<?php

namespace App\Http\Controllers\API\ordenAnticipo;

use App\Http\Controllers\Controller;
use App\Models\OrdenAnticipo;
use App\Models\Anticipo;
use App\Models\Ordenes;
use App\Services\InterfuerzaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class OrdenApiAnticipoController extends Controller
{
    /**
     * Listar todos los registros.
     */
    public function index(Request $request)
    {
        $query = OrdenAnticipo::with([
            'anticipo',
            'orden'
        ]);

        // Filtro opcional por orden
        if ($request->filled('id_orden')) {
            $query->where('id_orden', $request->id_orden);
        }

        // Filtro opcional por anticipo
        if ($request->filled('id_anticipo')) {
            $query->where('id_anticipo', $request->id_anticipo);
        }

        $ordenesAnticipos = $query
            ->orderByDesc('id_orden_anticipo')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $ordenesAnticipos
        ]);
    }

    /**
     * Crear una aplicación de anticipo a una orden.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_orden' => [
                'required',
                'integer',
                'exists:ordenes,id_orden',
            ],

            'id_anticipo' => [
                'required',
                'integer',
                'exists:anticipos,id_anticipo',
            ],

            'monto_aplicado' => [
                'required',
                'numeric',
                'min:0.01',
            ],
        ]);

        // Evitar que el mismo anticipo sea aplicado dos veces
        $existe = OrdenAnticipo::where('id_orden', $validated['id_orden'])
            ->where('id_anticipo', $validated['id_anticipo'])
            ->exists();

        if ($existe) {
            return response()->json([
                'success' => false,
                'message' => 'Este anticipo ya está aplicado a esta orden.'
            ], 422);
        }

        try {
            DB::beginTransaction();

            $anticipo = Anticipo::findOrFail($validated['id_anticipo']);

            // Validar que el anticipo esté activo
            if ($anticipo->estado !== 'ACTIVE') {
                return response()->json([
                    'success' => false,
                    'message' => 'El anticipo no está activo.'
                ], 422);
            }

            // Validar que no se aplique más dinero del disponible
            $montoAplicadoAnterior = OrdenAnticipo::where(
                'id_anticipo',
                $validated['id_anticipo']
            )->sum('monto_aplicado');

            $montoDisponible = $anticipo->monto - $montoAplicadoAnterior;

            if ((float) $validated['monto_aplicado'] > (float) $montoDisponible) {
                DB::rollBack();

                return response()->json([
                    'success' => false,
                    'message' => 'El monto aplicado supera el saldo disponible del anticipo.',
                    'monto_anticipo' => $anticipo->monto,
                    'monto_aplicado' => $montoAplicadoAnterior,
                    'monto_disponible' => $montoDisponible,
                ], 422);
            }

            $ordenAnticipo = OrdenAnticipo::create([
                'id_orden' => $validated['id_orden'],
                'id_anticipo' => $validated['id_anticipo'],
                'monto_aplicado' => $validated['monto_aplicado'],
                'created_by' => auth()->id(),
            ]);

            DB::commit();

            $ordenAnticipo->load([
                'anticipo',
                'orden'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Anticipo aplicado correctamente.',
                'data' => $ordenAnticipo
            ], 201);
        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al aplicar el anticipo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar un registro específico.
     */
    public function show($id)
    {
        $ordenAnticipo = OrdenAnticipo::with([
            'anticipo',
            'orden'
        ])->find($id);

        if (!$ordenAnticipo) {
            return response()->json([
                'success' => false,
                'message' => 'Registro de anticipo no encontrado.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $ordenAnticipo
        ]);
    }

    /**
     * Actualizar un registro.
     */
    public function update(Request $request, $id)
    {
        $ordenAnticipo = OrdenAnticipo::find($id);

        if (!$ordenAnticipo) {
            return response()->json([
                'success' => false,
                'message' => 'Registro de anticipo no encontrado.'
            ], 404);
        }

        $validated = $request->validate([
            'id_orden' => [
                'sometimes',
                'required',
                'integer',
                'exists:ordenes,id_orden',
            ],

            'id_anticipo' => [
                'sometimes',
                'required',
                'integer',
                'exists:anticipos,id_anticipo',
            ],

            'monto_aplicado' => [
                'sometimes',
                'required',
                'numeric',
                'min:0.01',
            ],
        ]);

        $idOrden = $validated['id_orden'] ?? $ordenAnticipo->id_orden;
        $idAnticipo = $validated['id_anticipo'] ?? $ordenAnticipo->id_anticipo;
        $montoAplicado = $validated['monto_aplicado'] ?? $ordenAnticipo->monto_aplicado;

        // Evitar duplicados
        $duplicado = OrdenAnticipo::where('id_orden', $idOrden)
            ->where('id_anticipo', $idAnticipo)
            ->where('id_orden_anticipo', '!=', $ordenAnticipo->id_orden_anticipo)
            ->exists();

        if ($duplicado) {
            return response()->json([
                'success' => false,
                'message' => 'Este anticipo ya está aplicado a esta orden.'
            ], 422);
        }

        try {
            DB::beginTransaction();

            $anticipo = Anticipo::findOrFail($idAnticipo);

            if ($anticipo->estado !== 'ACTIVE') {
                return response()->json([
                    'success' => false,
                    'message' => 'El anticipo no está activo.'
                ], 422);
            }

            /*
             * Excluimos el registro actual del cálculo porque
             * estamos modificándolo.
             */
            $montoAplicadoAnterior = OrdenAnticipo::where(
                'id_anticipo',
                $idAnticipo
            )
                ->where(
                    'id_orden_anticipo',
                    '!=',
                    $ordenAnticipo->id_orden_anticipo
                )
                ->sum('monto_aplicado');

            $montoDisponible = $anticipo->monto - $montoAplicadoAnterior;

            if ((float) $montoAplicado > (float) $montoDisponible) {
                DB::rollBack();

                return response()->json([
                    'success' => false,
                    'message' => 'El monto aplicado supera el saldo disponible del anticipo.',
                    'monto_anticipo' => $anticipo->monto,
                    'monto_aplicado' => $montoAplicadoAnterior,
                    'monto_disponible' => $montoDisponible,
                ], 422);
            }

            $ordenAnticipo->update([
                'id_orden' => $idOrden,
                'id_anticipo' => $idAnticipo,
                'monto_aplicado' => $montoAplicado,
            ]);

            DB::commit();

            $ordenAnticipo->load([
                'anticipo',
                'orden'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Aplicación de anticipo actualizada correctamente.',
                'data' => $ordenAnticipo
            ]);
        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la aplicación del anticipo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar una aplicación de anticipo.
     */
    public function destroy($id)
    {
        $ordenAnticipo = OrdenAnticipo::find($id);

        if (!$ordenAnticipo) {
            return response()->json([
                'success' => false,
                'message' => 'Registro de anticipo no encontrado.'
            ], 404);
        }

        try {
            $ordenAnticipo->delete();

            return response()->json([
                'success' => true,
                'message' => 'Aplicación de anticipo eliminada correctamente.'
            ]);
        } catch (\Throwable $e) {

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la aplicación del anticipo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener los anticipos aplicados a una orden específica.
     */
    public function porOrden($idOrden)
    {
        $orden = Ordenes::find($idOrden);

        if (!$orden) {
            return response()->json([
                'success' => false,
                'message' => 'Orden no encontrada.'
            ], 404);
        }

        $anticipos = OrdenAnticipo::with('anticipo')
            ->where('id_orden', $idOrden)
            ->orderByDesc('id_orden_anticipo')
            ->get();

        $totalAplicado = $anticipos->sum('monto_aplicado');

        return response()->json([
            'success' => true,
            'data' => $anticipos,
            'total_aplicado' => number_format($totalAplicado, 2, '.', ''),
        ]);
    }

    /**
     * Obtener el saldo disponible de un anticipo.
     */
    public function saldoAnticipo($idAnticipo)
    {
        $anticipo = Anticipo::find($idAnticipo);

        if (!$anticipo) {
            return response()->json([
                'success' => false,
                'message' => 'Anticipo no encontrado.'
            ], 404);
        }

        $totalAplicado = OrdenAnticipo::where(
            'id_anticipo',
            $idAnticipo
        )->sum('monto_aplicado');

        $saldoDisponible = $anticipo->monto - $totalAplicado;

        return response()->json([
            'success' => true,
            'data' => [
                'id_anticipo' => $anticipo->id_anticipo,
                'monto' => $anticipo->monto,
                'total_aplicado' => number_format($totalAplicado, 2, '.', ''),
                'saldo_disponible' => number_format(
                    max(0, $saldoDisponible),
                    2,
                    '.',
                    ''
                ),
            ]
        ]);
    }

    // app/Http/Controllers/OrdenAnticipoController.php
    public function resumenFinanciero(Request $request)
    {
        $data = $request->validate([
            'id_paciente' => 'required|integer|exists:pacientes,id_paciente',
        ]);

        $idPaciente = $data['id_paciente'];

        $anticipos = Anticipo::where('id_paciente', $idPaciente)
            ->where('estado', 'ACTIVE')
            ->with('ordenAnticipos')
            ->orderBy('fecha', 'asc')
            ->get();

        $recibidos = $anticipos->sum('monto');
        $aplicado  = $anticipos->sum(fn($a) => $a->ordenAnticipos->sum('monto_aplicado'));

        $saldoPorPagar = DB::table('ordenes')
            ->leftJoin('quotes', 'ordenes.nro_cotizacion', '=', 'quotes.id')
            ->leftJoin('orden_anticipos', 'orden_anticipos.id_orden', '=', 'ordenes.id_orden')
            ->where('ordenes.id_paciente', $idPaciente)
            ->where('ordenes.pagado', '!=', 1)
            ->groupBy('ordenes.id_orden', 'quotes.Total')
            ->select(
                'ordenes.id_orden',
                DB::raw('COALESCE(quotes.Total, 0) as total'),
                DB::raw('COALESCE(SUM(orden_anticipos.monto_aplicado), 0) as aplicado_orden')
            )
            ->get()
            ->sum(fn($o) => max(0, $o->total - $o->aplicado_orden));

        return response()->json([
            'anticipos_recibidos' => round($recibidos, 2),
            'aplicado_a_ordenes'  => round($aplicado, 2),
            'credito_disponible'  => round($recibidos - $aplicado, 2),
            'saldo_por_pagar'     => round($saldoPorPagar, 2),
            'detalle' => $anticipos->map(fn($a) => [
                'referencia' => $a->referencia,
                'fecha'      => $a->fecha->format('Y-m-d'),
                'tipo'       => $a->tipo,
                'estado'     => $a->estado,
                'monto'      => (float) $a->monto,
                'aplicado'   => round($a->ordenAnticipos->sum('monto_aplicado'), 2),
                'disponible' => $a->disponible,
            ]),
        ]);
    }

    public function guardarAnticipos(Request $request, Ordenes $orden, InterfuerzaService $interfuerza)
    {
        Log::info('INICIO guardarAnticipos', [
            'orden_id' => $orden->id_orden,
            'nro_cotizacion' => $orden->nro_cotizacion,
            'request' => $request->all(),
        ]);

        $data = $request->validate([
            'aplicaciones' => 'required|array',
            'aplicaciones.*.id_anticipo' => 'required|exists:anticipos,id_anticipo',
            'aplicaciones.*.monto_aplicado' => 'required|numeric|min:0',
        ]);

        $quoteResponse = $interfuerza->request([
            'class' => 'GET',
            'action' => 'quote',
            'id' => $orden->nro_cotizacion,
        ]);

        Log::info('Respuesta cotización Interfuerza', [
            'status' => $quoteResponse->status(),
            'successful' => $quoteResponse->successful(),
            'body' => $quoteResponse->json(),
        ]);

        if (!$quoteResponse->successful()) {
            Log::error('Error consultando cotización Interfuerza');

            throw ValidationException::withMessages([
                'aplicaciones' => 'No se pudo consultar la cotización en Interfuerza.',
            ]);
        }

        $quoteData = $quoteResponse->json()['quote'] ?? null;

        if (empty($quoteData)) {
            Log::error('Cotización vacía en Interfuerza', [
                'nro_cotizacion' => $orden->nro_cotizacion,
            ]);

            throw ValidationException::withMessages([
                'aplicaciones' => "No se encontró la cotización {$orden->nro_cotizacion} en Interfuerza.",
            ]);
        }

        $quote = $quoteData[0]['Quote'] ?? null;
        $totalCotizacion = (float) ($quote['Total'] ?? 0);

        Log::info('Total cotización obtenido', [
            'quote' => $quote,
            'total_cotizacion' => $totalCotizacion,
        ]);

        DB::transaction(function () use ($data, $orden, $totalCotizacion) {
            $totalAplicado = 0;

            foreach ($data['aplicaciones'] as $item) {
                $anticipo = Anticipo::with('ordenAnticipos')
                    ->findOrFail($item['id_anticipo']);

                $disponibleSinEstaOrden = $anticipo->disponible
                    + $anticipo->ordenAnticipos
                    ->where('id_orden', $orden->id_orden)
                    ->sum('monto_aplicado');

                Log::info('Validando anticipo', [
                    'orden_id' => $orden->id_orden,
                    'anticipo_id' => $anticipo->id_anticipo,
                    'referencia' => $anticipo->referencia,
                    'monto_solicitado' => $item['monto_aplicado'],
                    'disponible' => $anticipo->disponible,
                    'disponible_sin_esta_orden' => $disponibleSinEstaOrden,
                ]);

                if ($item['monto_aplicado'] > $disponibleSinEstaOrden) {
                    Log::warning('Anticipo sin saldo suficiente', [
                        'anticipo_id' => $anticipo->id_anticipo,
                        'monto_solicitado' => $item['monto_aplicado'],
                        'disponible' => $disponibleSinEstaOrden,
                    ]);

                    throw ValidationException::withMessages([
                        'aplicaciones' => "El anticipo {$anticipo->referencia} no tiene saldo suficiente.",
                    ]);
                }

                OrdenAnticipo::updateOrCreate(
                    [
                        'id_orden' => $orden->id_orden,
                        'id_anticipo' => $anticipo->id_anticipo,
                    ],
                    [
                        'monto_aplicado' => $item['monto_aplicado'],
                        'created_by' => auth()->id(),
                    ]
                );

                $totalAplicado += (float) $item['monto_aplicado'];

                Log::info('Anticipo aplicado', [
                    'anticipo_id' => $anticipo->id_anticipo,
                    'monto_aplicado' => $item['monto_aplicado'],
                    'total_aplicado_acumulado' => $totalAplicado,
                ]);
            }

            OrdenAnticipo::where('id_orden', $orden->id_orden)
                ->whereNotIn(
                    'id_anticipo',
                    collect($data['aplicaciones'])->pluck('id_anticipo')
                )
                ->delete();

            Log::info('Totales antes de actualizar pagado', [
                'orden_id' => $orden->id_orden,
                'total_cotizacion' => $totalCotizacion,
                'total_aplicado' => $totalAplicado,
                'supera_total' => $totalCotizacion > 0 && $totalAplicado > $totalCotizacion,
                'alcanza_total' => $totalCotizacion > 0 && $totalAplicado >= $totalCotizacion,
            ]);

            if ($totalCotizacion > 0 && $totalAplicado > $totalCotizacion) {
                Log::warning('Total aplicado supera cotización', [
                    'total_aplicado' => $totalAplicado,
                    'total_cotizacion' => $totalCotizacion,
                ]);

                throw ValidationException::withMessages([
                    'aplicaciones' => "El total aplicado ({$totalAplicado}) supera el total de la cotización ({$totalCotizacion}).",
                ]);
            }

            $pagado = (
                $totalCotizacion > 0 &&
                $totalAplicado >= $totalCotizacion
            ) ? 1 : 2;

            Log::info('Valor pagado calculado', [
                'total_cotizacion' => $totalCotizacion,
                'total_aplicado' => $totalAplicado,
                'pagado_calculado' => $pagado,
            ]);

            $updated = $orden->update([
                'pagado' => $pagado,
            ]);

            Log::info('Orden actualizada', [
                'orden_id' => $orden->id_orden,
                'update_result' => $updated,
                'pagado_despues_update' => $orden->fresh()->pagado,
            ]);
        });

        Log::info('FIN guardarAnticipos', [
            'orden_id' => $orden->id_orden,
            'pagado_final' => $orden->fresh()->pagado,
        ]);

        return response()->json([
            'ok' => true,
            'orden' => $orden->fresh('ordenAnticipos'),
        ]);
    }
}
