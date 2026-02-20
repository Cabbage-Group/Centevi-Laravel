<?php

namespace App\Http\Controllers\API\ordenes;

use App\Http\Controllers\Controller;
use App\Models\Ordenes;
use Illuminate\Http\Request;
use App\Models\TiposFasesOrdenes;
use Carbon\Carbon;


class OrdenesCentilabApiController extends Controller
{

    public function obtenerOrdenesCentilab(Request $request)
    {
        $search = $request->input('search', '');
        $limit = $request->input('limit', 20);
        $page = $request->input('page', 1);
        $sortColumn = $request->input('sortColumn', 'id_orden');
        $sortOrder = $request->input('sortOrder', 'asc');
        $sucursal = $request->input('sucursal', []);
        $doctor = $request->input('doctor', []);
        $fecha = $request->input('fecha', '');

        $validColumns = ['id_orden', 'nro_orden_id', 'created_at', 'paciente', 'sucursal'];
        if (!in_array($sortColumn, $validColumns)) {
            $sortColumn = 'id_orden';
        }
        $sortOrder = $sortOrder === 'desc' ? 'desc' : 'asc';

        $query = Ordenes::with([
            'paciente:id_paciente,nro_cedula,nombres,celular,apellidos,doctor',
            'sucursal:id_sucursal,nombre,ubicacion,ubicacion_maps',
            'fasesOrdenes.tipoFaseOrden',
            'fasesOrdenes.usuario',
            'correciones'
        ]);

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('id_orden', 'like', "%$search%")
                    ->orWhere('nro_orden_id', 'like', "%$search%")
                    ->orWhere('nro_factura', 'like', "%$search%")
                    ->orWhere('created_at', 'like', "%$search%")
                    ->orWhereHas('paciente', function ($q) use ($search) {
                        $searchTerms = explode(' ', trim($search));

                        $q->where(function ($innerQ) use ($searchTerms) {
                            foreach ($searchTerms as $term) {
                                if (!empty($term)) {
                                    $innerQ->where(function ($nameQ) use ($term) {
                                        $nameQ->where('nombres', 'like', "%$term%")
                                            ->orWhere('apellidos', 'like', "%$term%");
                                    });
                                }
                            }
                        })
                            ->orWhere('celular', 'like', "%$search%")
                            ->orWhere('nro_cedula', 'like', "%$search%");
                    })
                    ->orWhereHas('sucursal', function ($q) use ($search) {
                        $q->where('nombre', 'like', "%$search%");
                    })
                    ->orWhereHas('fasesOrdenes', function ($q) use ($search) {
                        $q->where('laboratorio', 'like', "%$search%");
                    });
            });
        }

        if (!empty($sucursal)) {
            $query->whereIn('id_sucursal', (array) $sucursal);
        }

        if (!empty($doctor)) {
            $query->whereIn('doctor', (array) $doctor);
        }

        if (!empty($fecha)) {
            $fechas = explode(' - ', $fecha);
            if (count($fechas) === 2) {
                $fechaInicio = trim($fechas[0]);
                $fechaFin = trim($fechas[1]);

                if (strtotime($fechaInicio) && strtotime($fechaFin)) {
                    $query->whereBetween('created_at', [$fechaInicio . ' 00:00:00', $fechaFin . ' 23:59:59']);
                }
            }
        }

        $ordenesPaginadas = $query->orderBy($sortColumn, $sortOrder)
            ->paginate($limit, ['*'], 'page', $page);

        $ordenes = $ordenesPaginadas->getCollection()->map(function ($orden) {

            $ultimaFase = $orden->fasesOrdenes->sortByDesc('tipo_fase_orden_id')->first();

            $estado = 'Sin estado';
            $siguienteFase = "Nuevo";

            $faseEnConfeccion = $orden->fasesOrdenes->where('tipo_fase_orden_id', 2)->first();
            $faseListo = $orden->fasesOrdenes->where('tipo_fase_orden_id', 3)->first();
            $faseRetirado = $orden->fasesOrdenes->where('tipo_fase_orden_id', 4)->first();

            $fechaInicio = Carbon::parse($orden->created_at);
            $fechaFin = $faseRetirado ? Carbon::parse($faseRetirado->fecha_fase) : Carbon::now();
            $dias = $fechaInicio->diffInDays($fechaFin) + 1;

            if (!$ultimaFase) {
                $siguienteFase = "Nuevo";
            } else {
                $diasDiferencia = now()->diffInDays($ultimaFase->fecha_fase);

                if ($ultimaFase->tipo_fase_orden_id == 4) {
                    $estado = 'Completado';
                } elseif ($diasDiferencia <= 6) {
                    $estado = 'OK';
                } elseif ($diasDiferencia == 7) {
                    $estado = 'Advertencia';
                } else {
                    $estado = 'Crítico';
                }

                if ($ultimaFase->tipo_fase_orden_id == 4) {
                    $siguienteFase = "Retirado";
                } elseif ($ultimaFase->tipo_fase_orden_id == 3) {
                    $siguienteFase = "Listo";
                } elseif ($ultimaFase->tipo_fase_orden_id == 1 && $ultimaFase->status == 0) {
                    $siguienteFase = "Nuevo";
                } else {
                    $nuevoTipoFase = ($ultimaFase->status == 1 && $ultimaFase->tipo_fase_orden_id < 3)
                        ? $ultimaFase->tipo_fase_orden_id + 1
                        : $ultimaFase->tipo_fase_orden_id;

                    $siguienteFase = TiposFasesOrdenes::where('id', $nuevoTipoFase)
                        ->value('tipo_fase_orden') ?? "Finalizado";
                }
            }

            return [
                'id_orden' => $orden->id_orden,
                'nro_orden_id' => $orden->nro_orden_id,
                'nro_factura' => $orden->nro_factura,
                'pagado' => $orden->pagado,
                'created_at' => $orden->created_at ? Carbon::parse($orden->created_at)->format('d-m-Y') : null,
                'laboratorio' => $orden->fasesOrdenes->whereNotNull('laboratorio')->pluck('laboratorio')->first() ?? null,
                'proveedor_material' => $orden->fasesOrdenes->whereNotNull('proveedor_material')->pluck('proveedor_material')->first() ?? null,
                'tipo_fase_orden' => $siguienteFase,
                'elaborado_por_fase' => $ultimaFase->usuario->nombre ?? null,
                'siguiente_fase' => $siguienteFase,
                'codigo_cristal' => $orden->codigo_cristal,
                'id_paciente' => $orden->paciente->id_paciente,
                'nro_cedula' => $orden->paciente->nro_cedula,
                'nombres' => $orden->paciente->nombres,
                'apellidos' => $orden->paciente->apellidos,
                'celular' => $orden->paciente->celular,
                'doctor' => $orden->doctor,
                'sucursal' => $orden->sucursal->nombre,
                'lente_contacto' => $orden->lente_contacto,
                'correcciones' => $orden->correciones->count(),
                'cancelada' => $orden->cancelada ?? 0,
                'estado' => $estado,
                'dias' => $dias,
                'enviado' => $faseEnConfeccion ? Carbon::parse($faseEnConfeccion->fecha_fase)->format('d-m-Y') : null,
                'entrada' => $faseListo ? Carbon::parse($faseListo->fecha_fase)->format('d-m-Y') : null,
                'retiro' => $faseRetirado ? Carbon::parse($faseRetirado->fecha_fase)->format('d-m-Y') : null,
                'esfera_od' => $orden['esfera_od'],
                'cilindro_od' => $orden['cilindro_od'],
                'eje_od' => $orden['eje_od'],
                'add_od' => $orden['add_od'],
                'prisma_od' => $orden['prisma_od'],
                'distancia_od' => $orden['distancia_od'],
                'altura_od' => $orden['altura_od'],
                'esfera_oi' => $orden['esfera_oi'],
                'cilindro_oi' => $orden['cilindro_oi'],
                'eje_oi' => $orden['eje_oi'],
                'add_oi' => $orden['add_oi'],
                'prisma_oi' => $orden['prisma_oi'],
                'distancia_oi' => $orden['distancia_oi'],
                'altura_oi' => $orden['altura_oi'],
                'material_od' => $orden['material_od'],
                'material_oi' => $orden['material_oi'],
                'tipo_cristal_od' => $orden['tipo_cristal_od'],
                'tipo_cristal_oi' => $orden['tipo_cristal_oi'],
                'l_uno' => $orden['l_uno'] ?? "-",
                'l_dos' => $orden['l_dos'] ?? "-",
                'l_tres' => $orden['l_tres'] ?? "-",
                'l_cuatro' => $orden['l_cuatro'] ?? "-",
                'l_cinco' => $orden['l_cinco'] ?? "-",
                'color' => $orden['color'] ?? "_",
                'codigo' => $orden['codigo'] ?? "_",
                'marca' => $orden['marca'] ?? "_",
                'tipo_aro' => $orden['tipo_aro'] ?? "_",
                'observaciones' => $orden['observaciones'] ?? "_",
                'aro_centevi' => $orden['aro_centevi'],
                'aro_propio' => $orden['aro_propio'],
                'tratamientos_oi' => $orden['tratamientos_oi'],
                'tratamientos_od' => $orden['tratamientos_od'],
            ];
        });

        return response()->json([
            'data' => $ordenes,
            'meta' => [
                'total' => $ordenesPaginadas->total(),
                'limit' => $limit,
                'page' => $page,
                'last_page' => $ordenesPaginadas->lastPage(),
                'sortColumn' => $sortColumn,
                'sortOrder' => $sortOrder,
                'search' => $search,
                'sucursal' => $sucursal,
                'doctor' => $doctor,
            ]
        ]);
    }
}
