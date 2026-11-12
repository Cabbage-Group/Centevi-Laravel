<?php

namespace App\Services;

use App\Models\Anticipo;
use App\Models\InterfuerzaSyncState;
use App\Models\Pacientes;
use Illuminate\Support\Facades\Log;

class AnticiposSyncService
{
    protected InterfuerzaService $interfuerza;

    public function __construct(InterfuerzaService $interfuerza)
    {
        $this->interfuerza = $interfuerza->withConfig(InterfuerzaService::V4_URL, InterfuerzaService::V4_TOKEN);
    }

    public const MAX_PAGINAS_CLIENTE = 5;
    private const POR_PAGINA_CLIENTE = 25;

    /**
     * Sincroniza los anticipos (ADVANCE) de un cliente de Interfuerza a la BD local.
     *
     * @throws \OverflowException si el cliente supera MAX_PAGINAS_CLIENTE páginas
     * @throws \RuntimeException si Interfuerza responde con error
     */
    public function sincronizarPorCliente(Pacientes $paciente): int
    {
        $codigo = $paciente->codigo;
        if (!$codigo) {
            return 0;
        }

        $consultar = fn(int $pagina) => $this->interfuerza->request([
            'class'   => 'GET',
            'action'  => 'payments',
            'filters' => [
                ['field' => 'Cliente', 'type' => '=', 'value' => $codigo],
            ],
            'page'    => (string) $pagina,
        ]);

        $primera = $consultar(1);
        if (!$primera->successful()) {
            throw new \RuntimeException('Error consultando Interfuerza: ' . $primera->status());
        }

        $count        = (int) ($primera->json()['count'] ?? 0);
        $totalPaginas = max(1, (int) ceil($count / self::POR_PAGINA_CLIENTE));

        if ($totalPaginas > self::MAX_PAGINAS_CLIENTE) {
            throw new \OverflowException(
                'La información de este paciente supera el límite permitido. Contacte con un administrador para evaluar el caso.'
            );
        }

        $payments = $primera->json()['payments'] ?? [];
        for ($pagina = 2; $pagina <= $totalPaginas; $pagina++) {
            $response = $consultar($pagina);
            if (!$response->successful()) {
                throw new \RuntimeException('Error consultando Interfuerza (página ' . $pagina . '): ' . $response->status());
            }
            $payments = array_merge($payments, $response->json()['payments'] ?? []);
        }

        $guardados = 0;
        foreach ($payments as $registro) {
            $pago = $registro['Payment'] ?? [];
            if (strtoupper($pago['Type'] ?? '') !== 'ADVANCE' || empty($pago['id'])) {
                continue;
            }

            Anticipo::updateOrCreate(
                ['referencia' => $pago['id']],
                [
                    'id_paciente'        => $paciente->id_paciente,
                    'codigo_interfuerza' => $pago['Cliente'] ?? $codigo,
                    'sincronizado'       => true,
                    'tipo'               => 'ADVANCE',
                    'monto'              => $pago['Monto'] ?? 0,
                    'fecha'              => $pago['Fecha'],
                    'estado'             => strtoupper($pago['Status'] ?? ''),
                ]
            );
            $guardados++;
        }

        return $guardados;
    }

    public function sincronizarRecientes(int $limit = 25): array
    {
        $estado = InterfuerzaSyncState::firstOrCreate(
            ['recurso' => 'anticipos'],
            [
                'ultima_pagina'          => 0,
                'ultimo_total'           => 0,
                'historial_completo'     => false,
                'ultima_pagina_revisada' => null,
                'ultima_pagina_completa' => null,
            ]
        );

        if (!$estado->historial_completo) {
            throw new \RuntimeException(
                'El histórico de anticipos no está completamente migrado. Ejecute la migración completa antes de sincronizar recientes.'
            );
        }

        $primeraRespuesta = $this->interfuerza->request([
            'class'  => 'GET',
            'action' => 'payments',
            'page'   => 1,
            'limit'  => $limit,
        ]);

        if (!$primeraRespuesta->successful()) {
            throw new \RuntimeException('Error consultando Interfuerza: ' . $primeraRespuesta->status());
        }

        $countActual        = (int) ($primeraRespuesta->json()['count'] ?? 0);
        $totalPaginasActual = max(1, (int) ceil($countActual / $limit));

        $ultimaRevisada = $estado->ultima_pagina_revisada;

        if ($ultimaRevisada === null) {
            $paginaInicio = $totalPaginasActual;
        } elseif ((bool) $estado->ultima_pagina_completa) {
            $paginaInicio = $ultimaRevisada + 1;
        } else {
            $paginaInicio = $ultimaRevisada;
        }

        $paginaInicio = max(1, min($paginaInicio, $totalPaginasActual));
        $paginaFin    = $totalPaginasActual;

        $migrados        = 0;
        $sincronizados   = 0;
        $pendientes      = 0;
        $paginasRevisadas = [];
        $ultimaPaginaProcesadaOk = null;
        $ultimaPaginaCompletaOk  = $estado->ultima_pagina_completa;

        for ($pagina = $paginaInicio; $pagina <= $paginaFin; $pagina++) {
            $response = ($pagina === 1)
                ? $primeraRespuesta
                : $this->interfuerza->request([
                    'class'  => 'GET',
                    'action' => 'payments',
                    'page'   => $pagina,
                    'limit'  => $limit,
                ]);

            if (!$response->successful()) {
                break;
            }

            $payments = $response->json()['payments'] ?? [];

            $anticipos = collect($payments)->filter(
                fn($p) => strtoupper($p['Payment']['Type'] ?? '') === 'ADVANCE'
            );

            foreach ($anticipos as $registro) {
                $pago          = $registro['Payment'];
                $referencia    = $pago['id'] ?? null;
                $codigoCliente = $pago['Cliente'] ?? null;

                if (!$referencia) continue;

                $paciente = $codigoCliente
                    ? Pacientes::where('codigo', $codigoCliente)->first()
                    : null;

                Anticipo::updateOrCreate(
                    ['referencia' => $referencia],
                    [
                        'id_paciente'        => $paciente?->id_paciente,
                        'codigo_interfuerza' => $codigoCliente,
                        'pagina_interfuerza' => $pagina,
                        'sincronizado'       => (bool) $paciente,
                        'tipo'               => 'ADVANCE',
                        'monto'              => $pago['Monto'] ?? 0,
                        'fecha'              => $pago['Fecha'],
                        'estado' => strtoupper($pago['Status'] ?? ''),
                    ]
                );

                $migrados++;
                $paciente ? $sincronizados++ : $pendientes++;
            }

            $paginasRevisadas[] = $pagina;
            $ultimaPaginaProcesadaOk = $pagina;
            $ultimaPaginaCompletaOk  = count($payments) >= $limit;
        }

        $estado->update([
            'ultimo_total'           => $countActual,
            'ultima_pagina_revisada' => $ultimaPaginaProcesadaOk ?? $estado->ultima_pagina_revisada,
            'ultima_pagina_completa' => $ultimaPaginaCompletaOk,
            'ultima_sincronizacion'  => now(),
        ]);

        return [
            'paginas_revisadas'  => $paginasRevisadas,
            'migrados'           => $migrados,
            'sincronizados'      => $sincronizados,
            'pendientes'         => $pendientes,
            'historial_completo' => true,
        ];
    }

    public function verificarEstados(\Illuminate\Support\Collection $anticipos, int $limit = 25): void
    {
        Log::info('verificarEstados: inicio', [
            'total_anticipos' => $anticipos->count(),
            'limit' => $limit,
        ]);

        $porPagina = $anticipos
            ->whereNotNull('pagina_interfuerza')
            ->groupBy('pagina_interfuerza');

        Log::info('verificarEstados: anticipos agrupados', [
            'total_paginas' => $porPagina->count(),
            'total_sin_pagina' => $anticipos->whereNull('pagina_interfuerza')->count(),
        ]);

        foreach ($porPagina as $pagina => $grupo) {
            Log::info('verificarEstados: consultando InterFuerza', [
                'pagina' => $pagina,
                'cantidad_anticipos' => $grupo->count(),
                'referencias' => $grupo->pluck('referencia')->values()->toArray(),
            ]);

            $response = $this->interfuerza->request([
                'class' => 'GET',
                'action' => 'payments',
                'page' => $pagina,
                'limit' => $limit,
            ]);

            Log::info('verificarEstados: respuesta InterFuerza', [
                'pagina' => $pagina,
                'status_http' => $response->status(),
                'successful' => $response->successful(),
            ]);

            if (!$response->successful()) {
                Log::warning('verificarEstados: consulta fallida', [
                    'pagina' => $pagina,
                    'response' => $response->body(),
                ]);

                continue;
            }

            $paymentsResponse = $response->json()['payments'] ?? [];

            Log::info('verificarEstados: pagos recibidos', [
                'pagina' => $pagina,
                'cantidad_pagos' => count($paymentsResponse),
            ]);

            $payments = collect($paymentsResponse)
                ->keyBy(fn($p) => $p['Payment']['id'] ?? null);

            foreach ($grupo as $anticipo) {
                Log::info('verificarEstados: buscando anticipo', [
                    'anticipo_id_local' => $anticipo->id_anticipo,
                    'referencia' => $anticipo->referencia,
                    'estado_local' => $anticipo->estado,
                    'pagina_interfuerza' => $anticipo->pagina_interfuerza,
                ]);

                $remoto = $payments->get($anticipo->referencia);

                if (!$remoto) {
                    Log::warning('verificarEstados: pago no encontrado', [
                        'referencia_buscada' => $anticipo->referencia,
                        'pagina' => $pagina,
                    ]);

                    continue;
                }

                Log::info('verificarEstados: pago encontrado', [
                    'referencia' => $anticipo->referencia,
                    'payment_id' => $remoto['Payment']['id'] ?? null,
                    'status_remoto' => $remoto['Payment']['Status'] ?? null,
                ]);

                $estadoRemoto = strtoupper(
                    $remoto['Payment']['Status'] ?? ''
                );

                Log::info('verificarEstados: comparación de estados', [
                    'referencia' => $anticipo->referencia,
                    'estado_local' => $anticipo->estado,
                    'estado_remoto' => $estadoRemoto,
                ]);

                if ($estadoRemoto !== '' && $estadoRemoto !== $anticipo->estado) {
                    $estadoAnterior = $anticipo->estado;

                    $anticipo->update([
                        'estado' => $estadoRemoto,
                    ]);

                    Log::info('verificarEstados: estado actualizado', [
                        'anticipo_id_local' => $anticipo->id_anticipo,
                        'referencia' => $anticipo->referencia,
                        'estado_anterior' => $estadoAnterior,
                        'estado_nuevo' => $estadoRemoto,
                    ]);
                } else {
                    Log::info('verificarEstados: estado sin cambios', [
                        'referencia' => $anticipo->referencia,
                        'estado' => $anticipo->estado,
                    ]);
                }
            }
        }

        Log::info('verificarEstados: finalizado');
    }

    /**
     * Refresca desde Interfuerza los anticipos aplicados a una orden y devuelve
     * los que todavía no están en estado CLOSED.
     *
     * @throws \RuntimeException si no se pudo consultar Interfuerza
     */
    public function anticiposNoCerradosDeOrden(int $idOrden): \Illuminate\Support\Collection
    {
        // Solo anticipos realmente aplicados (se guardan filas con monto 0 de los no seleccionados)
        $idsAnticipos = \App\Models\OrdenAnticipo::where('id_orden', $idOrden)
            ->where('monto_aplicado', '>', 0)
            ->pluck('id_anticipo')
            ->unique();

        if ($idsAnticipos->isEmpty()) {
            return collect();
        }

        $anticipos = Anticipo::whereIn('id_anticipo', $idsAnticipos)->get();

        // Sincroniza por cliente (trae el estado actual de todos sus pagos)
        $pacientes = Pacientes::whereIn('id_paciente', $anticipos->pluck('id_paciente')->filter()->unique())->get();
        foreach ($pacientes as $paciente) {
            try {
                $this->sincronizarPorCliente($paciente);
            } catch (\OverflowException $e) {
                // Cliente con demasiados pagos: se verifican solo por página
                $this->verificarEstados($anticipos->where('id_paciente', $paciente->id_paciente));
            }
        }

        // Anticipos sin paciente local: se verifican por página
        $sinPaciente = $anticipos->whereNull('id_paciente');
        if ($sinPaciente->isNotEmpty()) {
            $this->verificarEstados($sinPaciente);
        }

        return Anticipo::whereIn('id_anticipo', $idsAnticipos)
            ->get()
            ->filter(fn($a) => strtoupper((string) $a->estado) !== 'CLOSED')
            ->values();
    }
}
