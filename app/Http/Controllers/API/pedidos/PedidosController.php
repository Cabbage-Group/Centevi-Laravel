<?php

namespace App\Http\Controllers\API\pedidos;

use App\Http\Controllers\Controller;
use App\Models\CorrecionesOrdenes;
use App\Models\FasesCorreccionesOrdenes;
use App\Models\FasesOrdenes;
use App\Models\Mermas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Pedido;
use App\Models\Ordenes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class PedidosController extends Controller
{
    public function crearPedido(Request $request)
    {
        Log::info('=== INICIO crearPedido ===');

        $request->validate([
            'id_proveedor'             => 'required|exists:proveedor_de_material,id',
            'ordenes'                  => 'required|array|min:1',
            'ordenes.*.tipo'              => 'required|in:orden,correccion',
            'ordenes.*.id_orden'       => 'exists:ordenes,id_orden',
            'ordenes.*.id_correccion'     => 'nullable|exists:correciones_ordenes,id',
            'ordenes.*.observacion'    => 'nullable|string|max:500',
            'ordenes.*.mermas'         => 'nullable|array',
            'ordenes.*.mermas.*.id_merma' => 'exists:mermas,id_merma',
            'ordenes.*.receta_od'   => 'nullable|string|max:100',
            'ordenes.*.receta_oi'   => 'nullable|string|max:100',
            'ordenes.*.add_od'      => 'nullable|string|max:20',
            'ordenes.*.add_oi'      => 'nullable|string|max:20',
            'ordenes.*.prisma_od'   => 'nullable|string|max:100',
            'ordenes.*.prisma_oi'   => 'nullable|string|max:100',
            'ordenes.*.material'    => 'nullable|string|max:150',
            'ordenes.*.esfera_od'      => 'nullable|string|max:20',
            'ordenes.*.esfera_oi'      => 'nullable|string|max:20',
            'ordenes.*.cilindro_od'    => 'nullable|string|max:20',
            'ordenes.*.cilindro_oi'    => 'nullable|string|max:20',
            'ordenes.*.eje_od'         => 'nullable|string|max:20',
            'ordenes.*.eje_oi'         => 'nullable|string|max:20',
            'ordenes.*.tipo_cristal_od' => 'nullable|string|max:150',
            'ordenes.*.tipo_cristal_oi' => 'nullable|string|max:150',
            'ordenes.*.material_od'    => 'nullable|string|max:150',
            'ordenes.*.material_oi'    => 'nullable|string|max:150',
            'ordenes.*.tratamientos_od' => 'nullable|string|max:255',
            'ordenes.*.tratamientos_oi' => 'nullable|string|max:255',
            'ordenes.*.ojo' => 'nullable|in:ambos,od,oi',
            'ordenes.*.tipo_base_od' => 'nullable|string|max:50',
            'ordenes.*.tipo_base_oi' => 'nullable|string|max:50',
        ]);

        $camposPorOjo = function (array $item): array {
            $ojo     = $item['ojo'] ?? 'ambos';
            $soloOD  = $ojo === 'od';
            $soloOI  = $ojo === 'oi';

            return [
                'receta_od'       => $soloOI ? null : ($item['receta_od']       ?? null),
                'receta_oi'       => $soloOD ? null : ($item['receta_oi']       ?? null),
                'add_od'          => $soloOI ? null : ($item['add_od']          ?? null),
                'add_oi'          => $soloOD ? null : ($item['add_oi']          ?? null),
                'prisma_od'       => $soloOI ? null : ($item['prisma_od']       ?? null),
                'prisma_oi'       => $soloOD ? null : ($item['prisma_oi']       ?? null),
                'esfera_od'       => $soloOI ? null : ($item['esfera_od']       ?? null),
                'esfera_oi'       => $soloOD ? null : ($item['esfera_oi']       ?? null),
                'cilindro_od'     => $soloOI ? null : ($item['cilindro_od']     ?? null),
                'cilindro_oi'     => $soloOD ? null : ($item['cilindro_oi']     ?? null),
                'eje_od'          => $soloOI ? null : ($item['eje_od']          ?? null),
                'eje_oi'          => $soloOD ? null : ($item['eje_oi']          ?? null),
                'tipo_cristal_od' => $soloOI ? null : ($item['tipo_cristal_od'] ?? null),
                'tipo_cristal_oi' => $soloOD ? null : ($item['tipo_cristal_oi'] ?? null),
                'material_od'     => $soloOI ? null : ($item['material_od']     ?? null),
                'material_oi'     => $soloOD ? null : ($item['material_oi']     ?? null),
                'tratamientos_od' => $soloOI ? null : ($item['tratamientos_od'] ?? null),
                'tratamientos_oi' => $soloOD ? null : ($item['tratamientos_oi'] ?? null),
                'tipo_base_od'    => $soloOI ? null : ($item['tipo_base_od']    ?? null),
                'tipo_base_oi'    => $soloOD ? null : ($item['tipo_base_oi']    ?? null),
                'material'        => $item['material']  ?? null,
            ];
        };

        return DB::transaction(function () use ($request, $camposPorOjo) {
            try {
                foreach ($request->ordenes as $item) {
                    $tipo = $item['tipo'];

                    if ($tipo === 'correccion') {
                        // ── Corrección ───────────────────────────────────────────
                        $correccion = CorrecionesOrdenes::findOrFail($item['id_correccion']);

                        if (!$correccion->id_pedido) {
                            $pedido = Pedido::create([
                                'id_proveedor'   => $request->id_proveedor,
                                'fecha_generado' => now(),
                                'estado'         => 'Realizado',
                                'total_ordenes'  => 1,
                                'ojo'             => $item['ojo'] ?? 'ambos',
                                'observacion'    => $item['observacion'] ?? null,
                                'receta_od'      => $item['receta_od'] ?? null,
                                'receta_oi'      => $item['receta_oi'] ?? null,
                                'add_od'         => $item['add_od'] ?? null,
                                'add_oi'         => $item['add_oi'] ?? null,
                                'prisma_od'      => $item['prisma_od'] ?? null,
                                'prisma_oi'      => $item['prisma_oi'] ?? null,
                                'material'       => $item['material'] ?? null,
                                'esfera_od'      => $item['esfera_od'] ?? null,
                                'esfera_oi'      => $item['esfera_oi'] ?? null,
                                'cilindro_od'     => $item['cilindro_od'] ?? null,
                                'cilindro_oi'     => $item['cilindro_oi'] ?? null,
                                'eje_od'          => $item['eje_od'] ?? null,
                                'eje_oi'          => $item['eje_oi'] ?? null,
                                'tipo_cristal_od' => $item['tipo_cristal_od'] ?? null,
                                'tipo_cristal_oi' => $item['tipo_cristal_oi'] ?? null,
                                'material_od'     => $item['material_od'] ?? null,
                                'material_oi'     => $item['material_oi'] ?? null,
                                'tratamientos_od' => $item['tratamientos_od'] ?? null,
                                'tratamientos_oi' => $item['tratamientos_oi'] ?? null,
                                'ojo' => $item['ojo'] ?? 'ambos',
                                'tipo_base_od' => $item['tipo_base_od'] ?? null,
                                'tipo_base_oi' => $item['tipo_base_oi'] ?? null,
                            ]);

                            CorrecionesOrdenes::where('id', $correccion->id)
                                ->update([
                                    'id_pedido'          => $pedido->id_pedido,
                                    'observacion_pedido' => $item['observacion'] ?? null,
                                ]);

                            $correccion->refresh();
                        } else {
                            $pedido = Pedido::find($correccion->id_pedido);
                            if (!empty($item['observacion'])) {
                                $pedido->update([
                                    'observacion' => $item['observacion'],
                                ]);
                            }
                        }

                        $mermasEntrada = $item['mermas'] ?? [];
                        if (!empty($mermasEntrada)) {
                            $mermaIds = collect($mermasEntrada)->pluck('id_merma')->toArray();

                            Mermas::whereIn('id_merma', $mermaIds)
                                ->update(array_merge(
                                    [
                                        'id_proveedor' => $request->id_proveedor,
                                        'estado'       => 'Realizado',
                                        'observacion'  => $item['observacion'] ?? null,
                                        'ojo'          => $item['ojo'] ?? 'ambos',
                                    ],
                                    $camposPorOjo($item)
                                ));

                            $mermasPendientes = Mermas::where('correccion_id', $correccion->id)
                                ->where('estado', 'Pendiente')
                                ->count();

                            $pedido->update([
                                'estado' => $mermasPendientes > 0 ? 'Pendiente' : 'Realizado',
                            ]);
                        }
                    } else {
                        $orden = Ordenes::findOrFail($item['id_orden']);
                        $mermasEntrada = $item['mermas'] ?? [];

                        if (!$orden->id_pedido) {
                            $pedido = Pedido::create([
                                'id_proveedor'   => $request->id_proveedor,
                                'fecha_generado' => now(),
                                'estado'         => 'Realizado',
                                'total_ordenes'  => 1,
                                'ojo'             => $item['ojo'] ?? 'ambos',
                                'observacion'    => $item['observacion'] ?? null,
                                'receta_od'      => $item['receta_od'] ?? null,
                                'receta_oi'      => $item['receta_oi'] ?? null,
                                'add_od'         => $item['add_od'] ?? null,
                                'add_oi'         => $item['add_oi'] ?? null,
                                'prisma_od'      => $item['prisma_od'] ?? null,
                                'prisma_oi'      => $item['prisma_oi'] ?? null,
                                'material'       => $item['material'] ?? null,
                                'esfera_od'      => $item['esfera_od'] ?? null,
                                'esfera_oi'      => $item['esfera_oi'] ?? null,
                                'cilindro_od'    => $item['cilindro_od'] ?? null,
                                'cilindro_oi'    => $item['cilindro_oi'] ?? null,
                                'eje_od'         => $item['eje_od'] ?? null,
                                'eje_oi'         => $item['eje_oi'] ?? null,
                                'tipo_cristal_od' => $item['tipo_cristal_od'] ?? null,
                                'tipo_cristal_oi' => $item['tipo_cristal_oi'] ?? null,
                                'material_od'    => $item['material_od'] ?? null,
                                'material_oi'    => $item['material_oi'] ?? null,
                                'tratamientos_od' => $item['tratamientos_od'] ?? null,
                                'tratamientos_oi' => $item['tratamientos_oi'] ?? null,
                                'ojo' => $item['ojo'] ?? 'ambos',
                                'tipo_base_od' => $item['tipo_base_od'] ?? null,
                                'tipo_base_oi' => $item['tipo_base_oi'] ?? null,
                            ]);

                            Ordenes::where('id_orden', $orden->id_orden)
                                ->update([
                                    'id_pedido'          => $pedido->id_pedido,
                                    'observacion_pedido' => $item['observacion'] ?? null,
                                ]);

                            // Refrescar el modelo para que $orden->id_pedido esté actualizado
                            $orden->refresh();
                        } else {
                            $pedido = Pedido::find($orden->id_pedido);
                        }

                        if (!empty($mermasEntrada)) {
                            $mermaIds = collect($mermasEntrada)->pluck('id_merma')->toArray();

                            Mermas::whereIn('id_merma', $mermaIds)
                                ->update(array_merge(
                                    [
                                        'id_proveedor' => $request->id_proveedor,
                                        'estado'       => 'Realizado',
                                        'observacion'  => $item['observacion'] ?? null,
                                        'ojo'          => $item['ojo'] ?? 'ambos',
                                    ],
                                    $camposPorOjo($item)  // ← actualiza campos ópticos según ojo
                                ));

                            $mermasPendientesRestantes = Mermas::where('orden_id', $orden->id_orden)
                                ->where('estado', 'Pendiente')
                                ->count();

                            $pedido->update([
                                'estado' => $mermasPendientesRestantes > 0 ? 'Pendiente' : 'Realizado',
                            ]);
                        }
                    }
                }

                // ── Retornar órdenes actualizadas ────────────────────────────
                $idsOrdenes = collect($request->ordenes)->pluck('id_orden')->toArray();

                $ordenesCargadas = Ordenes::with([
                    'pedido.proveedor',
                    'correciones',
                    'fasesOrdenes.baseIzquierda',
                    'fasesOrdenes.baseDerecha',
                    'mermas' => fn($q) => $q->orderBy('created_at', 'desc'),
                ])->whereIn('id_orden', $idsOrdenes)->get();

                $ordenes = $ordenesCargadas->map(fn($o) => $this->formatOrden($o));

                Log::info('=== FIN crearPedido OK ===');

                return response()->json([
                    'message' => 'Pedido procesado correctamente',
                    'ordenes' => $ordenes,
                ]);
            } catch (\Exception $e) {
                Log::error('ERROR en crearPedido', [
                    'mensaje' => $e->getMessage(),
                    'linea'   => $e->getLine(),
                    'archivo' => $e->getFile(),
                ]);
                throw $e;
            }
        });
    }

    public function obtenerOrdenesPedidos(Request $request)
    {
        $search    = $request->input('search', '');
        $limit     = $request->input('limit', 20);
        $page      = $request->input('page', 1);
        $estado    = $request->input('estado', '');
        $proveedor = $request->input('proveedor', '');
        $fecha = $request->input('fecha', '');

        $query = Ordenes::with([
            'pedido.proveedor',
            'correciones.pedido.proveedor',
            'correciones.mermas',
            'fasesOrdenes.tipoFaseOrden',
            'fasesOrdenes.usuario',
            'fasesOrdenes.baseIzquierda',
            'fasesOrdenes.baseDerecha',
            'correciones.faseCorreccionOrden.tipoFaseCorreccionOrden',
            'correciones.faseCorreccionOrden.usuario',
            'mermas' => fn($q) => $q->with('proveedor')->orderBy('created_at', 'desc'),
        ])->where('cancelada', 0)
            ->where('lente_contacto', false);

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('id_orden', 'like', "%$search%")
                    ->orWhere('nro_orden_id', 'like', "%$search%");
            });
        }

        if (!empty($proveedor)) {
            $query->where(function ($q) use ($proveedor) {
                $q->whereHas('mermas.proveedor', fn($p) => $p->where('nombre', 'like', "%$proveedor%"))
                    ->orWhere(function ($q2) use ($proveedor) {
                        $q2->whereHas('pedido.proveedor', fn($p) => $p->where('nombre', 'like', "%$proveedor%"))
                            ->whereDoesntHave('mermas');
                    });
            });
        }

        if (!empty($fecha)) {
            $fechas = explode(' - ', $fecha);
            if (count($fechas) === 2) {
                $fechaInicio = trim($fechas[0]);
                $fechaFin    = trim($fechas[1]);

                if (strtotime($fechaInicio) && strtotime($fechaFin)) {
                    $query->whereHas('pedido', fn($q) => $q->whereBetween(
                        'fecha_generado',
                        [
                            Carbon::parse($fechaInicio)->startOfDay()->utc(),
                            Carbon::parse($fechaFin)->endOfDay()->utc(),
                        ]
                    ));
                }
            }
        }


        $queryBase = clone $query;

        if (!empty($estado)) {
            if ($estado === 'Pendiente') {
                $query->where(function ($q) {
                    $q->whereNull('id_pedido')
                        ->orWhereHas('pedido', fn($p) => $p->where('estado', 'Pendiente'));
                });
            } else {
                $query->whereHas('pedido', fn($q) => $q->where('estado', $estado));
            }
        }

        $ordenesPaginadas = $query
            ->orderBy('created_at', 'desc')
            ->paginate($limit, ['*'], 'page', $page);

        $totalPendientes = (clone $queryBase)
            ->where(function ($q) {
                $q->whereNull('id_pedido')
                    ->orWhereHas('pedido', fn($p) => $p->where('estado', 'Pendiente'));
            })
            ->count();

        $totalRealizados = (clone $queryBase)
            ->whereHas('pedido', fn($q) => $q->where('estado', 'Realizado'))
            ->count();

        $ordenes = $ordenesPaginadas
            ->getCollection()
            ->flatMap(fn($orden) => $this->formatOrdenConCorrecciones($orden));

        return response()->json([
            'data' => $ordenes->values(),
            'meta' => [
                'total'            => $ordenesPaginadas->total(),
                'limit'            => $limit,
                'page'             => $page,
                'last_page'        => $ordenesPaginadas->lastPage(),
                'total_pendientes' => $totalPendientes,
                'total_realizados' => $totalRealizados,
            ],
        ]);
    }

    public function crearMerma(Request $request)
    {
        Log::info('=== INICIO crearMerma ===');

        $request->validate([
            'orden_id'      => 'nullable|exists:ordenes,id_orden',
            'correccion_id' => 'nullable|exists:correciones_ordenes,id',
            'observacion'   => 'nullable|string|max:255',
            'id_proveedor'  => 'nullable|exists:proveedor_de_material,id',
            'ojo'             => 'nullable|in:ambos,od,oi',
            'receta_od'     => 'nullable|string|max:100',
            'receta_oi'     => 'nullable|string|max:100',
            'add_od'        => 'nullable|string|max:20',
            'add_oi'        => 'nullable|string|max:20',
            'prisma_od'     => 'nullable|string|max:100',
            'prisma_oi'     => 'nullable|string|max:100',
            'material'      => 'nullable|string|max:150',
            'esfera_od'      => 'nullable|string|max:20',
            'esfera_oi'      => 'nullable|string|max:20',
            'cilindro_od'    => 'nullable|string|max:20',
            'cilindro_oi'    => 'nullable|string|max:20',
            'eje_od'         => 'nullable|string|max:20',
            'eje_oi'         => 'nullable|string|max:20',
            'tipo_cristal_od' => 'nullable|string|max:150',
            'tipo_cristal_oi' => 'nullable|string|max:150',
            'material_od'    => 'nullable|string|max:150',
            'material_oi'    => 'nullable|string|max:150',
            'tratamientos_od' => 'nullable|string|max:255',
            'tratamientos_oi' => 'nullable|string|max:255',
            'tipo_base_od' => 'nullable|string|max:50',
            'tipo_base_oi' => 'nullable|string|max:50',

        ]);

        if (empty($request->orden_id) && empty($request->correccion_id)) {
            return response()->json(['message' => 'Debe indicar orden_id o correccion_id'], 422);
        }

        $aplicarFiltroOjo = function (array $data, string $ojo): array {
            if ($ojo === 'od') {
                $data['receta_oi']       = null;
                $data['add_oi']          = null;
                $data['prisma_oi']       = null;
                $data['esfera_oi']       = null;
                $data['cilindro_oi']     = null;
                $data['eje_oi']          = null;
                $data['tipo_cristal_oi'] = null;
                $data['material_oi']     = null;
                $data['tratamientos_oi'] = null;
                $data['tipo_base_oi'] = null;
            } elseif ($ojo === 'oi') {
                $data['receta_od']       = null;
                $data['add_od']          = null;
                $data['prisma_od']       = null;
                $data['esfera_od']       = null;
                $data['cilindro_od']     = null;
                $data['eje_od']          = null;
                $data['tipo_cristal_od'] = null;
                $data['material_od']     = null;
                $data['tratamientos_od'] = null;
                $data['tipo_base_oi'] = null;
            }
            return $data;
        };

        return DB::transaction(function () use ($request, $aplicarFiltroOjo) {
            try {
                if ($request->correccion_id) {
                    $correccion  = CorrecionesOrdenes::with('pedido')->findOrFail($request->correccion_id);
                    $pedidoId    = $correccion->id_pedido;
                    $idProveedor = $correccion->pedido?->id_proveedor ?? null;
                    $ojo = $request->ojo
                        ?? $correccion->pedido?->ojo
                        ?? 'ambos';

                    $mermaData = $aplicarFiltroOjo([
                        'orden_id'      => null,
                        'correccion_id' => $correccion->id,
                        'pedido_id'     => $pedidoId,
                        'cantidad'      => 1,
                        'estado'        => 'Pendiente',
                        'observacion'   => $request->observacion ?? null,
                        'usuario_id'    => auth()->id(),
                        'id_proveedor'  => $idProveedor,
                        'receta_od'     => $request->receta_od,
                        'receta_oi'     => $request->receta_oi,
                        'add_od'        => $request->add_od,
                        'add_oi'        => $request->add_oi,
                        'prisma_od'     => $request->prisma_od,
                        'prisma_oi'     => $request->prisma_oi,
                        'tipo_base_od' => $request->tipo_base_od,
                        'tipo_base_oi' => $request->tipo_base_oi,
                        'material'      => $request->material,
                        'esfera_od'      => $request->esfera_od,
                        'esfera_oi'      => $request->esfera_oi,
                        'cilindro_od'    => $request->cilindro_od,
                        'cilindro_oi'    => $request->cilindro_oi,
                        'eje_od'         => $request->eje_od,
                        'eje_oi'         => $request->eje_oi,
                        'tipo_cristal_od' => $request->tipo_cristal_od,
                        'tipo_cristal_oi' => $request->tipo_cristal_oi,
                        'material_od'    => $request->material_od,
                        'material_oi'    => $request->material_oi,
                        'tratamientos_od' => $request->tratamientos_od,
                        'tratamientos_oi' => $request->tratamientos_oi,
                        'ojo' => $ojo,
                    ], $ojo);
                    $merma = Mermas::create($mermaData);
                    if ($pedidoId) {
                        Pedido::where('id_pedido', $pedidoId)
                            ->update(['estado' => 'Pendiente']);
                    }
                } else {
                    // ── Es orden normal ───────────────────────────────────────
                    $orden       = Ordenes::with('pedido')->findOrFail($request->orden_id);
                    $pedidoId    = $orden->id_pedido;
                    $idProveedor = $orden->pedido?->id_proveedor ?? null;

                    $ojo = $request->ojo
                        ?? $orden->pedido?->ojo
                        ?? 'ambos';

                    $mermaData = $aplicarFiltroOjo([
                        'orden_id'      => $orden->id_orden,
                        'correccion_id' => null,
                        'pedido_id'     => $pedidoId,
                        'cantidad'      => 1,
                        'estado'        => 'Pendiente',
                        'observacion'   => $request->observacion ?? null,
                        'usuario_id'    => auth()->id(),
                        'id_proveedor'  => $idProveedor,
                        'receta_od'     => $request->receta_od,
                        'receta_oi'     => $request->receta_oi,
                        'add_od'        => $request->add_od,
                        'add_oi'        => $request->add_oi,
                        'prisma_od'     => $request->prisma_od,
                        'prisma_oi'     => $request->prisma_oi,
                        'tipo_base_od' => $request->tipo_base_od,
                        'tipo_base_oi' => $request->tipo_base_oi,
                        'material'      => $request->material,
                        'esfera_od'      => $request->esfera_od,
                        'esfera_oi'      => $request->esfera_oi,
                        'cilindro_od'    => $request->cilindro_od,
                        'cilindro_oi'    => $request->cilindro_oi,
                        'eje_od'         => $request->eje_od,
                        'eje_oi'         => $request->eje_oi,
                        'tipo_cristal_od' => $request->tipo_cristal_od,
                        'tipo_cristal_oi' => $request->tipo_cristal_oi,
                        'material_od'    => $request->material_od,
                        'material_oi'    => $request->material_oi,
                        'tratamientos_od' => $request->tratamientos_od,
                        'tratamientos_oi' => $request->tratamientos_oi,
                        'ojo' => $ojo,
                    ], $ojo);

                    $merma = Mermas::create($mermaData);

                    if ($pedidoId) {
                        Pedido::where('id_pedido', $pedidoId)
                            ->update(['estado' => 'Pendiente']);
                    }
                }

                Log::info('Merma creada', ['id_merma' => $merma->id_merma]);

                return response()->json([
                    'message' => 'Merma registrada correctamente',
                    'merma'   => $merma,
                ]);
            } catch (\Exception $e) {
                Log::error('ERROR en crearMerma', [
                    'mensaje' => $e->getMessage(),
                    'linea'   => $e->getLine(),
                    'archivo' => $e->getFile(),
                ]);
                throw $e;
            }
        });
    }

    public function updateMerma(Request $request)
    {
        $request->validate([
            'merma_ids'    => 'required|array|min:1',
            'merma_ids.*'  => 'required|exists:mermas,id_merma',
            'id_proveedor' => 'required|exists:proveedor_de_material,id',
        ]);

        Mermas::whereIn('id_merma', $request->merma_ids)
            ->update([
                'id_proveedor' => $request->id_proveedor,
                'estado'       => 'Realizado',
            ]);

        return response()->json([
            'message' => 'Mermas actualizadas correctamente',
        ]);
    }

    public function historialEventosPorOrden(Request $request, $id_orden)
    {
        $esCorreccion  = $request->boolean('es_correccion', false);
        $correccionId  = $request->input('correccion_id');

        if ($esCorreccion && $correccionId) {
            $correccion   = CorrecionesOrdenes::with('pedido.proveedor')->findOrFail($correccionId);
            $ordenPadre   = Ordenes::find($correccion->ordenes_id);
            $pedidoEvento = collect();

            $laboratorioFase = FasesCorreccionesOrdenes::where('correccion_ordenes_id', $correccion->id)
                ->where('tipo_fase_correccion_orden_id', 2)
                ->value('laboratorio');

            $esCentilab = $laboratorioFase === 'Centilab';

            if ($correccion->id_pedido) {
                $pedido = Pedido::with('proveedor')->find($correccion->id_pedido);
                if ($pedido) {
                    $pedidoEvento->push([
                        'evento_id'  => $pedido->id_pedido,
                        'fecha_hora' => $pedido->fecha_generado?->format('d/m/Y H:i:s'),
                        'evento'     => 'PEDIDO',
                        'proveedor'  => $pedido->proveedor?->nombre ?? '—',
                        'esCentilab'  => $esCentilab,
                        'cantidad'   => 1,
                        'estado'     => $pedido->estado,
                        'ojo'     => $pedido->ojo,
                        'detalle' => [
                            ...$this->formatDetalle('PEDIDO', $pedido),

                            ...(
                                !$esCentilab
                                ? [
                                    'tipo_base_extra' => 'Gestionado por laboratorio',
                                    'proveedor_extra' => 'Gestionado por laboratorio',
                                ]
                                : []
                            )
                        ],
                        '_sort'      => $pedido->fecha_generado,
                    ]);
                }
            }

            $mermasEventos = Mermas::with('proveedor')
                ->where('correccion_id', $correccionId)
                ->get()
                ->map(fn($merma) => [
                    'evento_id'  => $merma->id_merma,
                    'fecha_hora' => $merma->created_at?->format('d/m/Y H:i:s'),
                    'evento'     => 'MERMA',
                    'proveedor'  => $merma->proveedor?->nombre ?? '—',
                    'cantidad'   => 1,
                    'estado'     => $merma->estado,
                    'ojo'        => $merma->ojo,
                    'esCentilab' => $esCentilab,
                    'detalle' => [
                        ...$this->formatDetalle('MERMA', $merma),

                        ...(
                            !$esCentilab
                            ? [
                                'tipo_base_extra' => 'Gestionado por laboratorio',
                                'proveedor_extra' => 'Gestionado por laboratorio',
                            ]
                            : []
                        )
                    ],
                    '_sort'      => $merma->created_at,
                ]);

            $historial = $pedidoEvento
                ->merge($mermasEventos)
                ->sortByDesc('_sort')
                ->values()
                ->map(fn($e) => collect($e)->except('_sort')->all());

            $mermaTotal     = Mermas::where('correccion_id', $correccionId)->count();
            $mermaPendiente = Mermas::where('correccion_id', $correccionId)->where('estado', 'Pendiente')->count();

            $ultimoEvento    = $historial->first();
            $ultimoProveedor = $ultimoEvento['proveedor'] ?? '—';

            return response()->json([
                'id_orden'  => $correccion->id,
                'nro_orden' => ($ordenPadre->nro_orden_id ?? '') . '-C',
                'historial' => $historial,
                'merma_total'      => $mermaTotal,
                'merma_pendiente'  => $mermaPendiente,
                'ultimo_proveedor' => $ultimoProveedor,
            ]);
        }

        $orden        = Ordenes::findOrFail($id_orden);
        $pedidoEvento = collect();
        $laboratorioFase = FasesOrdenes::where('ordenes_id', $orden->id_orden)
            ->where('tipo_fase_orden_id', 2)
            ->value('laboratorio');
        $esCentilab = $laboratorioFase === 'Centilab';
        if ($orden->id_pedido) {
            $pedido = Pedido::with('proveedor')->find($orden->id_pedido);
            if ($pedido) {
                $pedidoEvento->push([
                    'evento_id'  => $pedido->id_pedido,
                    'fecha_hora' => $pedido->fecha_generado?->format('d/m/Y H:i:s'),
                    'evento'     => 'PEDIDO',
                    'proveedor'  => $pedido->proveedor?->nombre ?? '—',
                    'laboratorio' => $laboratorioFase ?? '—',
                    'esCentilab'  => $esCentilab,
                    'cantidad'   => 1,
                    'estado'     => $pedido->estado,
                    'ojo'     => $pedido->ojo,
                    'detalle' => [
                        ...$this->formatDetalle('PEDIDO', $pedido),
                        ...(
                            $laboratorioFase !== 'Centilab'
                            ? [
                                'tipo_base_extra' => 'Gestionado por laboratorio',
                                'proveedor_extra'   => 'Gestionado por laboratorio',
                            ]
                            : []
                        )
                    ],
                    '_sort'      => $pedido->fecha_generado,
                ]);
            }
        }

        $mermasEventos = Mermas::with('proveedor')
            ->where('orden_id', $id_orden)
            ->whereNull('correccion_id')
            ->get()
            ->map(fn($merma) => [
                'evento_id'  => $merma->id_merma,
                'fecha_hora' => $merma->created_at?->format('d/m/Y H:i:s'),
                'evento'     => 'MERMA',
                'proveedor'  => $merma->proveedor?->nombre ?? '—',
                'cantidad'   => 1,
                'estado'     => $merma->estado,
                'ojo'     => $merma->ojo,
                'esCentilab' => $esCentilab,
                'detalle' => [
                    ...$this->formatDetalle('MERMA', $merma),

                    ...(
                        !$esCentilab
                        ? [
                            'tipo_base_extra' => 'Gestionado por laboratorio',
                            'proveedor_extra' => 'Gestionado por laboratorio',
                        ]
                        : []
                    )
                ],
                '_sort'      => $merma->created_at,
            ]);

        $historial = $pedidoEvento
            ->merge($mermasEventos)
            ->sortByDesc('_sort')
            ->values()
            ->map(fn($e) => collect($e)->except('_sort')->all());

        $mermaTotal     = Mermas::where('orden_id', $id_orden)->whereNull('correccion_id')->count();
        $mermaPendiente = Mermas::where('orden_id', $id_orden)->whereNull('correccion_id')->where('estado', 'Pendiente')->count();


        $ultimoEvento = $historial->first();
        $ultimoProveedor = $ultimoEvento['proveedor'] ?? '—';

        return response()->json([
            'id_orden'  => $orden->id_orden,
            'nro_orden' => $orden->nro_orden_id,
            'historial' => $historial,
            'merma_total'      => $mermaTotal,
            'merma_pendiente'  => $mermaPendiente,
            'ultimo_proveedor' => $ultimoProveedor,
        ]);
    }

    public function imprimirHistorial(Request $request, $id_orden)
    {
        $esCorreccion = $request->boolean('es_correccion', false);
        $correccionId = $request->input('correccion_id');

        if ($esCorreccion && $correccionId) {
            $correccion   = CorrecionesOrdenes::with('pedido.proveedor')->findOrFail($correccionId);
            $ordenPadre   = Ordenes::find($correccion->ordenes_id);
            $pedidoEvento = collect();
            $laboratorioFase = FasesCorreccionesOrdenes::where('correccion_ordenes_id', $correccion->id)
                ->where('tipo_fase_correccion_orden_id', 2)
                ->value('laboratorio');

            $esCentilab = $laboratorioFase === 'Centilab';

            if ($correccion->id_pedido) {
                $pedido = Pedido::with('proveedor')->find($correccion->id_pedido);
                if ($pedido) {
                    $pedidoEvento->push([
                        'evento_id'  => $pedido->id_pedido,
                        'fecha_hora' => $pedido->fecha_generado?->format('d/m/Y H:i:s'),
                        'evento'     => 'PEDIDO',
                        'proveedor'  => $pedido->proveedor?->nombre ?? '—',
                        'cantidad'   => 1,
                        'esCentilab'  => $esCentilab,
                        'ojo' => $pedido->ojo,
                        'estado'     => $pedido->estado,
                        'detalle' => [
                            ...$this->formatDetalle('PEDIDO', $pedido),
                            ...(
                                $laboratorioFase !== 'Centilab'
                                ? [
                                    'tipo_base_extra' => 'Gestionado por laboratorio',
                                    'proveedor_extra'   => 'Gestionado por laboratorio',
                                ]
                                : []
                            )
                        ],
                        '_sort'      => $pedido->fecha_generado,
                    ]);
                }
            }

            $mermasEventos = Mermas::with('proveedor')
                ->where('correccion_id', $correccionId)
                ->get()
                ->map(fn($merma) => [
                    'evento_id'  => $merma->id_merma,
                    'fecha_hora' => $merma->created_at?->format('d/m/Y H:i:s'),
                    'evento'     => 'MERMA',
                    'ojo'     => $merma->ojo,
                    'proveedor'  => $merma->proveedor?->nombre ?? '—',
                    'cantidad'   => 1,
                    'estado'     => $merma->estado,
                    'esCentilab' => $esCentilab,
                    'detalle' => [
                        ...$this->formatDetalle('MERMA', $merma),

                        ...(
                            !$esCentilab
                            ? [
                                'tipo_base_extra' => 'Gestionado por laboratorio',
                                'proveedor_extra' => 'Gestionado por laboratorio',
                            ]
                            : []
                        )
                    ],
                    '_sort'      => $merma->created_at,
                ]);

            $historial = $pedidoEvento
                ->merge($mermasEventos)
                ->sortByDesc('_sort')
                ->values()
                ->map(fn($e) => collect($e)->except('_sort')->all());

            return view('pedidos.historial-imprimir', [
                'orden'    => $ordenPadre,
                'nro_orden' => ($ordenPadre->nro_orden_id ?? '') . '-C',
                'historial' => $historial,
            ]);
        }

        $orden        = Ordenes::findOrFail($id_orden);
        $pedidoEvento = collect();
        $laboratorioFase = FasesOrdenes::where('ordenes_id', $orden->id_orden)
            ->where('tipo_fase_orden_id', 2)
            ->value('laboratorio');

        $esCentilab = $laboratorioFase === 'Centilab';
        if ($orden->id_pedido) {
            $pedido = Pedido::with('proveedor')->find($orden->id_pedido);
            if ($pedido) {
                $pedidoEvento->push([
                    'evento_id'  => $pedido->id_pedido,
                    'fecha_hora' => $pedido->fecha_generado?->format('d/m/Y H:i:s'),
                    'evento'     => 'PEDIDO',
                    'ojo'  => $pedido->ojo,
                    'esCentilab'  => $esCentilab,
                    'proveedor'  => $pedido->proveedor?->nombre ?? '—',
                    'cantidad'   => 1,
                    'estado'     => $pedido->estado,
                    'detalle' => [
                        ...$this->formatDetalle('PEDIDO', $pedido),
                        ...(
                            $laboratorioFase !== 'Centilab'
                            ? [
                                'tipo_base_extra' => 'Gestionado por laboratorio',
                                'proveedor_extra'   => 'Gestionado por laboratorio',
                            ]
                            : []
                        )
                    ],
                    '_sort'      => $pedido->fecha_generado,
                ]);
            }
        }

        $mermasEventos = Mermas::with('proveedor')
            ->where('orden_id', $id_orden)
            ->whereNull('correccion_id')
            ->get()
            ->map(fn($merma) => [
                'evento_id'  => $merma->id_merma,
                'fecha_hora' => $merma->created_at?->format('d/m/Y H:i:s'),
                'evento'     => 'MERMA',
                'proveedor'  => $merma->proveedor?->nombre ?? '—',
                'cantidad'   => 1,
                'estado'     => $merma->estado,
                'ojo'     => $merma->ojo,
                'detalle'    => $this->formatDetalle('MERMA', $merma),
                '_sort'      => $merma->created_at,
            ]);

        $historial = $pedidoEvento
            ->merge($mermasEventos)
            ->sortByDesc('_sort')
            ->values()
            ->map(fn($e) => collect($e)->except('_sort')->all());

        return view('pedidos.historial-imprimir', [
            'orden'    => $orden,
            'nro_orden' => $orden->nro_orden_id,
            'historial' => $historial,
        ]);
    }

    public function eliminarEvento(Request $request)
    {
        $request->validate([
            'tipo'  => 'required|in:pedido,merma',
            'id'    => 'required|integer',
        ]);

        return DB::transaction(function () use ($request) {
            try {
                if ($request->tipo === 'pedido') {
                    $pedido = Pedido::findOrFail($request->id);

                    // Limpiar en órdenes normales
                    Ordenes::where('id_pedido', $request->id)
                        ->update([
                            'id_pedido'          => null,
                            'observacion_pedido' => null,
                        ]);

                    // ← Limpiar en correcciones también
                    CorrecionesOrdenes::where('id_pedido', $request->id)
                        ->update([
                            'id_pedido'          => null,
                            'observacion_pedido' => null,
                        ]);

                    $pedido->delete();

                    $message = 'Pedido eliminado correctamente';
                } else {
                    $merma         = Mermas::findOrFail($request->id);
                    $orden_id      = $merma->orden_id;
                    $correccion_id = $merma->correccion_id; // ← nuevo
                    $pedido_id     = $merma->pedido_id;

                    $merma->delete();

                    if ($pedido_id) {
                        // Contar mermas pendientes según si es orden o corrección
                        $mermasPendientes = Mermas::where('estado', 'Pendiente')
                            ->where(function ($q) use ($orden_id, $correccion_id) {
                                if ($correccion_id) {
                                    // Es merma de corrección
                                    $q->where('correccion_id', $correccion_id);
                                } else {
                                    // Es merma de orden normal
                                    $q->where('orden_id', $orden_id)
                                        ->whereNull('correccion_id');
                                }
                            })
                            ->count();

                        Pedido::where('id_pedido', $pedido_id)
                            ->update([
                                'estado' => $mermasPendientes > 0 ? 'Pendiente' : 'Realizado',
                            ]);
                    }

                    $message = 'Merma eliminada correctamente';
                }

                return response()->json(['message' => $message]);
            } catch (\Exception $e) {
                Log::error('ERROR en eliminarEvento', [
                    'mensaje' => $e->getMessage(),
                    'linea'   => $e->getLine(),
                ]);
                throw $e;
            }
        });
    }

    public function imprimirPedido(Request $request)
    {
        $data = json_decode($request->input('data'), true);

        return view('pedidos.imprimir-pedido', [
            'proveedor' => $data['proveedor'],
            'fecha'     => $data['fecha'],
            'ordenes'   => $data['ordenes'],
        ]);
    }

    private function formatDetalle(string $tipo, $model): array
    {
        return [
            'titulo'      => $tipo === 'MERMA'
                ? 'Merma registrada, se requiere material adicional.'
                : 'Pedido generado al proveedor.',
            'receta_od'   => $model->receta_od,
            'receta_oi'   => $model->receta_oi,
            'add_od'      => $model->add_od   ?: '**',
            'add_oi'      => $model->add_oi   ?: '**',
            'prisma_od'   => $model->prisma_od ?: '**',
            'prisma_oi'   => $model->prisma_oi ?: '**',
            'tipo_base_od' => $model->tipo_base_od ?? '**',
            'tipo_base_oi' => $model->tipo_base_oi ?? '**',
            'material'    => $model->material,
            'ojo' => $model->ojo ?? false,
            'observacion' => $model->observacion ?: 'Sin observacion',
        ];
    }

    private function getTipoBaseOD(Ordenes $orden): ?string
    {
        $fase = $orden->fasesOrdenes->firstWhere('tipo_fase_orden_id', 3);
        return $fase?->baseDerecha?->codigo ?? null;
    }

    private function getTipoBaseOI(Ordenes $orden): ?string
    {
        $fase = $orden->fasesOrdenes->firstWhere('tipo_fase_orden_id', 3);
        return $fase?->baseIzquierda?->codigo ?? null;
    }

    private function getTipoBaseODCorrecciones(CorrecionesOrdenes $c): ?string
    {
        $fase = $c->faseCorreccionOrden->firstWhere('tipo_fase_correccion_orden_id', 3);
        return $fase?->baseDerecha?->codigo ?? null;
    }

    private function getTipoBaseOICorrecciones(CorrecionesOrdenes $c): ?string
    {
        $fase = $c->faseCorreccionOrden->firstWhere('tipo_fase_correccion_orden_id', 3);
        return $fase?->baseIzquierda?->codigo ?? null;
    }

    private function formatOrden(Ordenes $orden): array
    {
        $limpiar = fn($valor) => $valor ? trim(explode('|', $valor)[1] ?? $valor) : null;


        $laboratorio = $orden->fasesOrdenes
            ->whereNotNull('laboratorio')
            ->pluck('laboratorio')
            ->first() ?? null;
        $tieneLaboratorio = !is_null($laboratorio) && trim($laboratorio) !== '';
        $esCentilab = strtolower(trim($laboratorio ?? '')) === 'centilab';
        return [
            'id_orden'           => $orden->id_orden,
            'id_paciente'        => $orden->id_paciente,
            'nro_orden_id'       => $orden->nro_orden_id,
            'id_pedido'          => $orden->id_pedido,
            'laboratorio'        => $laboratorio,
            'es_centilab' => $esCentilab,
            'tipo_base_gestionado_laboratorio'   => $tieneLaboratorio ? (!$esCentilab ? 'Gestionado por laboratorio' : null) : null,
            'pedido_ojo' => $orden->pedido?->ojo ?? 'ambos',
            'fecha' => $orden->created_at?->toDateString(),
            'orden'              => $orden->nro_orden_id,
            'esfera_od'          => $orden->esfera_od,
            'cilindro_od'        => $orden->cilindro_od,
            'tipo_cristal_od'   => $orden->tipo_cristal_od,
            'tipo_cristal_oi'   => $orden->tipo_cristal_oi,
            'material_od'        => $orden->material_od,
            'material_oi'        => $orden->material_oi,
            'tratamientos_od'    => $orden->tratamientos_od,
            'tratamientos_oi'    => $orden->tratamientos_oi,
            'eje_od'             => $orden->eje_od,
            'add_od'             => $orden->add_od,
            'prisma_od'          => $orden->prisma_od,
            'esfera_oi'          => $orden->esfera_oi,
            'cilindro_oi'        => $orden->cilindro_oi,
            'eje_oi'             => $orden->eje_oi,
            'add_oi'             => $orden->add_oi,
            'prisma_oi'          => $orden->prisma_oi,
            'tipo_base_od' => $this->getTipoBaseOD($orden),
            'tipo_base_oi' => $this->getTipoBaseOI($orden),
            'pedido_material'    => $orden->pedido?->estado ?? 'Pendiente',
            'merma_estado'       => $orden->mermas->first()?->estado,
            'merma_pendiente'    => $orden->mermas->where('estado', 'Pendiente')->count(),
            'fecha_pedido' => $orden->pedido?->fecha_generado?->toIso8601String(),
            'proveedor'                          => $tieneLaboratorio
                ? ($esCentilab
                    ? ($orden->mermas->first()?->proveedor?->nombre ?? $orden->pedido?->proveedor?->nombre ?? null)
                    : 'Gestionado por laboratorio')
                : null,
            'observacion_pedido' => $orden->observacion_pedido ?? null,
            'merma_count'              => $orden->mermas->count(),
            'correcciones'       => $orden->correciones->count(),
            'mermas' => $orden->mermas,
            'receta_od' => $orden->esfera_od . ' ' . $orden->cilindro_od . ' ' . $orden->eje_od,
            'receta_oi' => $orden->esfera_oi . ' ' . $orden->cilindro_oi . ' ' . $orden->eje_oi,
            'material' => (($limpiar($orden->tipo_cristal_od) ?? $limpiar($orden->tipo_cristal_oi) ?? '**') . ' / ' .
                ($orden->material_od    ?? $orden->material_oi    ?? '**') . ' / ' .
                ($orden->tratamientos_od ?? $orden->tratamientos_oi ?? '**')),
        ];
    }

    private function formatOrdenConCorrecciones(Ordenes $orden): array
    {
        $limpiar = fn($valor) => $valor ? trim(explode('|', $valor)[1] ?? $valor) : null;
        $resultado = [$this->formatOrden($orden)];

        foreach ($orden->correciones as $index => $correccion) {
            $numero = $index + 1;

            $laboratorio = $correccion->faseCorreccionOrden
                ->whereNotNull('laboratorio')
                ->pluck('laboratorio')
                ->first() ?? null;
            $tieneLaboratorio = !is_null($laboratorio) && trim($laboratorio) !== '';
            $esCentilab = strtolower(trim($laboratorio ?? '')) === 'centilab';
            $resultado[] = [
                'id_orden'           => "c-{$correccion->id}-{$orden->id_orden}",
                'id_real'            => $correccion->id,
                'id_orden_padre'     => $orden->id_orden,
                'es_correccion'      => true,
                'laboratorio'        => $laboratorio,
                'es_centilab' => $esCentilab,
                'tipo_base_gestionado_laboratorio'   => $tieneLaboratorio ? (!$esCentilab ? 'Gestionado por laboratorio' : null) : null,
                'pedido_ojo' => $correccion->pedido?->ojo ?? 'ambos',
                'fecha'              => $correccion->created_at,
                'nro_orden_id'       => $orden->nro_orden_id . '-C' . $numero,
                'orden'              => $orden->nro_orden_id . '-C' . $numero,
                'esfera_od'          => $correccion->esfera_od,
                'cilindro_od'        => $correccion->cilindro_od,
                'eje_od'             => $correccion->eje_od,
                'add_od'             => $correccion->add_od,
                'prisma_od'          => $correccion->prisma_od,
                'esfera_oi'          => $correccion->esfera_oi,
                'cilindro_oi'        => $correccion->cilindro_oi,
                'eje_oi'             => $correccion->eje_oi,
                'add_oi'             => $correccion->add_oi,
                'prisma_oi'          => $correccion->prisma_oi,
                'tipo_cristal_od'    => $correccion->tipo_cristal_od,
                'tipo_cristal_oi'    => $correccion->tipo_cristal_oi,
                'material_od'        => $correccion->material_od,
                'material_oi'        => $correccion->material_oi,
                'tratamientos_od'    => $correccion->tratamientos_od,
                'tratamientos_oi'    => $correccion->tratamientos_oi,
                'receta_od'          => $correccion->esfera_od . ' ' . $correccion->cilindro_od . ' ' . $correccion->eje_od,
                'receta_oi'          => $correccion->esfera_oi . ' ' . $correccion->cilindro_oi . ' ' . $correccion->eje_oi,
                'tipo_base_od' => $this->getTipoBaseODCorrecciones($correccion),
                'tipo_base_oi' => $this->getTipoBaseOICorrecciones($correccion),
                // 'material'           => $correccion->material_od ?? $correccion->material_oi,
                'material'           => (($limpiar($correccion->tipo_cristal_od) ?? $limpiar($correccion->tipo_cristal_oi) ?? '**') . ' / ' .
                    ($correccion->material_od ?? $correccion->material_oi ?? '**') . ' / ' .
                    ($correccion->tratamientos_od ?? $correccion->tratamientos_oi ?? '**')),
                'fecha_pedido'      => $correccion->pedido?->fecha_generado?->toIso8601String(),
                'observacion_pedido' => $correccion->observacion_pedido,
                'correcciones'       => 0,
                'id_pedido'       => $correccion->id_pedido,
                'pedido_material' => $correccion->pedido?->estado ?? 'Pendiente',
                'proveedor'                          => $tieneLaboratorio
                    ? ($esCentilab
                        ? ($correccion->mermas->first()?->proveedor?->nombre ?? $correccion->pedido?->proveedor?->nombre ?? null)
                        : 'Gestionado por laboratorio')
                    : null,
                'merma_count'     => $correccion->mermas->count(),
                'merma_pendiente' => $correccion->mermas->where('estado', 'Pendiente')->count(),
                'merma_estado' => $correccion->mermas->last()?->estado,
                'mermas'          => $correccion->mermas,
            ];
        }

        return $resultado;
    }
}
