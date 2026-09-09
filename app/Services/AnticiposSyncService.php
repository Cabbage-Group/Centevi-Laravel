<?php

namespace App\Services;

use App\Models\Anticipo;
use App\Models\InterfuerzaSyncState;
use App\Models\Pacientes;

class AnticiposSyncService
{
    protected InterfuerzaService $interfuerza;

    public function __construct(InterfuerzaService $interfuerza)
    {
        $this->interfuerza = $interfuerza;
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
            // Nunca se ha corrido: no hay nada "reciente" que rastrear todavía.
            $paginaInicio = $totalPaginasActual;
        } elseif ((bool) $estado->ultima_pagina_completa) {
            // La última página revisada ya estaba llena (25/25): avanzo a la siguiente.
            $paginaInicio = $ultimaRevisada + 1;
        } else {
            // Quedó incompleta: la re-reviso por si le llegaron los datos que faltaban.
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
                // No avanzamos el cursor más allá de aquí; la próxima corrida reintenta desde este punto.
                break;
            }

            $payments = $response->json()['payments'] ?? [];

            $anticipos = collect($payments)->filter(
                fn ($p) => strtoupper($p['Payment']['Type'] ?? '') === 'ADVANCE'
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
                        'estado'             => strtoupper($pago['Status'] ?? '') === 'DELETED' ? 'CANCELLED' : 'ACTIVE',
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
}