<?php

namespace App\Http\Controllers\API\correciones_ordenes;

use App\Http\Controllers\Controller;
use App\Models\ContactoCorrecionesOrdenes;
use App\Models\CorrecionesOrdenes;
use App\Models\FasesCorreccionesOrdenes;
use App\Models\Ordenes;
use App\Models\TiposFasesOrdenes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;


class CorrecionesOrdenesController extends Controller
{
  public function VerCorrecionesOrdenes(Request $request)
  {
    $limit = $request->input('limit', 10);
    $page = $request->input('page', 1);
    $sortColumn = $request->input('sortColumn', 'created_at');
    $sortOrder = $request->input('sortOrder', 'asc');

    $validSortColumns = ['created_at'];
    if (!in_array($sortColumn, $validSortColumns)) {
      $sortColumn = 'created_at';
    }

    $contadorFasesQuery = DB::table('fases_correcciones_ordenes')
      ->select(
        'correccion_ordenes_id',
        DB::raw('COUNT(*) as total_fases'),
        DB::raw('SUM(1) as fases_completadas')
      )
      ->groupBy('correccion_ordenes_id');

    $primeraFaseQuery = DB::table('fases_correcciones_ordenes as fo')
      ->join('tipos_fases_ordenes as tfo', 'fo.tipo_fase_correccion_orden_id', '=', 'tfo.id')
      ->leftJoinSub($contadorFasesQuery, 'contador_fases', 'fo.correccion_ordenes_id', '=', 'contador_fases.correccion_ordenes_id')
      ->select(
        'fo.correccion_ordenes_id',
        'fo.laboratorio as laboratorio_primera_fase',
        'fo.observacion as observacion_primera_fase',
        'fo.fecha_fase as fecha_primera_fase',
        'contador_fases.total_fases',
        'contador_fases.fases_completadas',
        DB::raw('DATEDIFF(CURRENT_DATE, fo.fecha_fase) as dias_transcurridos'),
        DB::raw('CASE 
                  WHEN contador_fases.total_fases = 4 AND contador_fases.fases_completadas = 4 THEN "Completado"
                  WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) <= 6 THEN "Ok"
                  WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) = 7 THEN "Advertencia"
                  WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) >= 8 THEN "Critico"
                  ELSE "sin_status"
              END as status_primera_fase')
      )
      ->whereRaw('fo.id = (
              SELECT MIN(id) 
              FROM fases_correcciones_ordenes 
              WHERE correccion_ordenes_id = fo.correccion_ordenes_id 
              AND tipo_fase_correccion_orden_id = 1
          )');
    $ultimaFaseQuery = DB::table('fases_correcciones_ordenes as fo')
      ->join('tipos_fases_ordenes as tfo', 'fo.tipo_fase_correccion_orden_id', '=', 'tfo.id')
      ->select(
        'fo.correccion_ordenes_id',
        DB::raw(
          '
                CASE 
                    WHEN fo.status = 1 THEN 
                        CASE 
                            WHEN fo.tipo_fase_correccion_orden_id IS NULL THEN 
                                (SELECT tipo_fase_orden 
                                 FROM tipos_fases_ordenes 
                                 ORDER BY id ASC LIMIT 1)
                            WHEN fo.tipo_fase_correccion_orden_id = 4 THEN 
                                tfo.tipo_fase_orden  -- Mantiene el nombre original de la fase "4"
                            ELSE 
                                (SELECT tipo_fase_orden 
                                 FROM tipos_fases_ordenes 
                                 WHERE id = fo.tipo_fase_correccion_orden_id + 1 LIMIT 1)
                        END
                    ELSE 
                        tfo.tipo_fase_orden  -- Si el status es 0, mantén la fase actual
                END as fase_actual',
        ),
        'fo.laboratorio as laboratorio_ultima_fase',
        'fo.observacion as observacion_ultima_fase',
        'fo.fecha_fase as fecha_ultima_fase'
      )
      ->whereRaw('fo.id = (
            SELECT MAX(id) 
            FROM fases_correcciones_ordenes 
            WHERE correccion_ordenes_id = fo.correccion_ordenes_id
        )');

    $correcionesOrdenes = CorrecionesOrdenes::with([])
      ->join('usuarios', 'correciones_ordenes.elaborado_por', '=', 'usuarios.id_usuario')
      ->join('ordenes', 'correciones_ordenes.ordenes_id', '=', 'ordenes.id_orden')
      ->join('pacientes', 'ordenes.id_paciente', '=', 'pacientes.id_paciente')
      ->join('sucursales', 'ordenes.id_sucursal', '=', 'sucursales.id_sucursal')
      ->leftJoinSub($primeraFaseQuery, 'primeras_fases', 'correciones_ordenes.id', '=', 'primeras_fases.correccion_ordenes_id')
      ->leftJoinSub($ultimaFaseQuery, 'ultimas_fases', 'correciones_ordenes.id', '=', 'ultimas_fases.correccion_ordenes_id')
      ->select(
        'correciones_ordenes.*',
        'usuarios.nombre as elaborado_por_nombre',
        'primeras_fases.laboratorio_primera_fase as laboratorio',
        'primeras_fases.observacion_primera_fase as observacion',
        'primeras_fases.fecha_primera_fase as fecha_fase',
        'primeras_fases.status_primera_fase as status',
        'primeras_fases.dias_transcurridos as dias_transcurridos',
        'primeras_fases.total_fases as total_fases',
        'pacientes.celular as celular',
        'ordenes.nro_orden as nro_orden',
        'ordenes.nro_orden_id as nro_orden_id',
        'ordenes.pagado as pagado_orden',
        'ordenes.lente_contacto as lente_contacto',
        'sucursales.nombre as sucursal',
        DB::raw('CONCAT(pacientes.nombres, " ", pacientes.apellidos) as paciente_nombre_completo'),
        DB::raw('CASE WHEN ultimas_fases.fase_actual IS NULL THEN "Nuevo" ELSE ultimas_fases.fase_actual END as fase_actual')
      );


    // Consulta con ordenamiento y paginación
    $paginatedData = $correcionesOrdenes->orderBy($sortColumn, $sortOrder)
      ->orderBy($sortColumn, $sortOrder)
      ->paginate($limit, ['*'], 'page', $page);

    return response()->json([
      'success' => true,
      'data' => $paginatedData->items(), // Los datos paginados
      'meta' => [
        'page' => $paginatedData->currentPage(),
        'limit' => $paginatedData->perPage(),
        'total' => $paginatedData->total(),
      ],
    ], 200);
  }

  public function ObtenerCorrecionesOrdenes(Request $request, $id_orden)
  {

    $fase = $request->input('fase', []);
    $laboratorio = $request->input('laboratorio', []);
    $lenteContacto = $request->input('lenteContacto', []);
    $sucursales = $request->input('sucursales', []);
    $estados = $request->input('estados', []);
    $pagado = $request->input('pagado', null);

    $query = CorrecionesOrdenes::with([
      'orden:id_orden,pagado,nro_orden_id,id_sucursal,id_paciente,lente_contacto',
      'faseCorreccionOrden.tipoFaseCorreccionOrden',
      'orden.sucursal',
      'orden.paciente'
    ])
      ->whereHas('orden', function ($q) use ($id_orden) {
        $q->where('id_orden', $id_orden);
      });

    // if (!empty($lenteContacto)) {
    //   $query->whereHas('orden', function ($q) use ($lenteContacto) {
    //     $q->whereIn('lente_contacto', (array) $lenteContacto);
    //   });
    // }

    // if (!empty($sucursales)) {
    //   $query->whereHas('orden.sucursal', function ($q) use ($sucursales) {
    //     $q->whereIn('id_sucursal', (array) $sucursales);
    //   });
    // }

    // if (!empty($pagado)) {
    //   $query->whereHas('orden', function ($q) use ($pagado) {
    //     $q->whereIn('pagado', (array) $pagado);
    //   });
    // }

    $ordenes = $query->get();

    if ($ordenes->isEmpty()) {
      return response()->json([
        'message' => 'No se encontraron correcciones para esta orden.',
        'data' => [],
        'meta' => [
          'total' => 0
        ]
      ], 404);
    }

    $ordenes = $ordenes->map(function ($orden) {

      $ultimaFase = $orden->faseCorreccionOrden->sortByDesc('tipo_fase_correccion_orden_id')->first();

      $estado = 'Sin estado';
      $siguienteFase = "Nuevo";

      $diasDiferencia = now();
      if (!$ultimaFase) {
        $siguienteFase = "Nuevo";
      } else {
        $diasDiferencia = now()->diffInDays($ultimaFase->fecha_fase);
      
        if ($ultimaFase->tipo_fase_correccion_orden_id == 4) {
          $estado = 'Completado';
        } elseif ($diasDiferencia <= 6) {
          $estado = 'OK';
        } elseif ($diasDiferencia == 7) {
          $estado = 'Advertencia';
        } elseif ($diasDiferencia >= 8) {
          $estado = 'Crítico';
        }

        if ($ultimaFase->tipo_fase_correccion_orden_id == 4) {
          $siguienteFase = "Retirado";
        } elseif ($ultimaFase->tipo_fase_correccion_orden_id == 3) {
          $siguienteFase = "Listo";
        } elseif ($ultimaFase->tipo_fase_correccion_orden_id == 1 && $ultimaFase->status == 0) {
          $siguienteFase = "Nuevo";
        } else {
          $nuevoTipoFase = ($ultimaFase->status == 1 && $ultimaFase->tipo_fase_correccion_orden_id < 3)
            ? $ultimaFase->tipo_fase_correccion_orden_id + 1
            : $ultimaFase->tipo_fase_correccion_orden_id;

          $siguienteFase = TiposFasesOrdenes::where('id', $nuevoTipoFase)
            ->value('tipo_fase_orden') ?? "Finalizado";
        }
      }

      return [
        'correccion_id' => $orden->id,
        'orden_id' => $orden->orden ? $orden->orden->id_orden : null,
        'pagado' => $orden->orden ? $orden->orden->pagado : 0,
        'lente_contacto' => $orden->orden ?  $orden->orden->lente_contacto : null,
        'created_at' => $orden->created_at ? Carbon::parse($orden->created_at)->format('d-m-Y') : null,
        'id_sucursal' => $orden->orden ? $orden->orden->sucursal->id_sucursal : null,
        'sucursal' => $orden->orden ? $orden->orden->sucursal->nombre : null,
        'nro_orden_id' => $orden->orden ? $orden->orden->nro_orden_id : null,
        'nombres' => $orden->orden ? $orden->orden->paciente->nombres : null,
        'apellidos' => $orden->orden ? $orden->orden->paciente->apellidos : null,
        'celular' =>  $orden->orden ? $orden->orden->paciente->celular : null,
        'laboratorio' => $orden->faseCorreccionOrden->whereNotNull('laboratorio')->pluck('laboratorio')->first() ?? null,
        'fase_actual' => $siguienteFase,
        'siguiente_fase' => $siguienteFase,
        'paciente_nombre_completo' => $orden->orden ? trim($orden->orden->paciente->nombres . ' ' . $orden->orden->paciente->apellidos) : null,
        'estado' => $estado,
        'fecha' => $diasDiferencia && 0
      ];
    });

    if (!empty($fase)) {
      $ordenes = $ordenes->whereIn('fase_actual', (array) $fase)->values();
    }

    if (!empty($laboratorio)) {
      $ordenes = $ordenes->whereIn('laboratorio', (array) $laboratorio)->values();
    }

    if (!empty($estados)) {
      $ordenes = $ordenes->whereIn('estado', (array) $estados)->values();
    }

    if (!empty($sucursales)) {
      $ordenes = $ordenes->whereIn('id_sucursal', (array) $sucursales)->values();
    }


    if (!empty($pagado)) {
      $ordenes = $ordenes->whereIn('pagado', (array) $pagado)->values();
    }

    if (!empty($lenteContacto)) {
      $ordenes = $ordenes->whereIn('lente_contacto', (array) $lenteContacto)->values();
    }

    return response()->json([
      'data' => $ordenes,
      'meta' => [
        'total' => $ordenes->count()
      ],
      'fase' => $fase
    ]);
  }



  public function CreateCorrecionesOrdenes(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'ordenes_id' => 'required|exists:ordenes,id_orden',
      'elaborado_por' => 'nullable|integer',
      'esfera_od' => 'nullable|string|max:500',
      'esfera_oi' => 'nullable|string|max:500',
      'cilindro_od' => 'nullable|string|max:255',
      'cilindro_oi' => 'nullable|string|max:255',
      'eje_od' => 'nullable|string|max:255',
      'eje_oi' => 'nullable|string|max:255',
      'add_od' => 'nullable|string|max:255',
      'add_oi' => 'nullable|string|max:255',
      'prisma_od' => 'nullable|string|max:255',
      'prisma_oi' => 'nullable|string|max:255',
      'distancia_od' => 'nullable|string|max:255',
      'distancia_oi' => 'nullable|string|max:255',
      'altura_od' => 'nullable|string|max:255',
      'altura_oi' => 'nullable|string|max:255',
      'tipo_cristal_od' => 'nullable|string|max:255',
      'tipo_cristal_oi' => 'nullable|string|max:255',
      'material_od' => 'nullable|string|max:255',
      'material_oi' => 'nullable|string|max:255',
      'tratamientos_od' => 'nullable|string|max:255',
      'tratamientos_oi' => 'nullable|string|max:255',
      'aro_centevi' => 'nullable|integer|min:0|max:1',
      'aro_propio' => 'nullable|integer|min:0|max:1',
      'codigo' => 'nullable|string|max:255',
      'color' => 'nullable|string|max:255',
      'marca' => 'nullable',
      'tipo_aro' => 'nullable|string|max:255',
      'doctor' => 'nullable|string|max:255',
      'observaciones' => 'nullable|string|max:400',
      'l_uno' => 'nullable|string|max:255',
      'l_dos' => 'nullable|string|max:255',
      'l_tres' => 'nullable|string|max:255',
      'l_cuatro' => 'nullable|string|max:255',
      'l_cinco' => 'nullable|string|max:255',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'respuesta' => false,
        'mensaje' => 'Validation errors',
        'data' => $validator->errors(),
        'mensaje_dev' => "Oops, validation errors occurred."
      ], 400);
    }

    $data = $request->all();
    $defaults = [
      'elaborado_por' => 0,
      'esfera_od' => '',
      'esfera_oi' => '',
      'cilindro_od' => '',
      'cilindro_oi' => '',
      'eje_od' => '',
      'eje_oi' => '',
      'add_od' => '',
      'add_oi' => '',
      'prisma_od' => '',
      'prisma_oi' => '',
      'distancia_od' => '',
      'distancia_oi' => '',
      'altura_od' => '',
      'altura_oi' => '',
      'tipo_cristal_od' => '',
      'tipo_cristal_oi' => '',
      'material_od' => '',
      'material_oi' => '',
      'tratamientos_od' => '',
      'tratamientos_oi' => '',
      'aro_centevi' => 0,
      'aro_propio' => 0,
      'codigo' => '',
      'color' => '',
      'marca' => '',
      'tipo_aro' => '',
      'doctor' => '',
      'observaciones' => '',
      'l_uno' => '',
      'l_dos' => '',
      'l_tres' => '',
      'l_cuatro' => '',
      'l_cinco' => '',
      'pagado' => '',
      'lente_contacto' => 0

    ];

    $tipoCristalOd = $request->input('tipo_cristal_od');
    $tipoCristalOi = $request->input('tipo_cristal_oi');

    $codigoCristal = $tipoCristalOd ? explode(' | ', $tipoCristalOd)[0] : ($tipoCristalOi ? explode(' | ', $tipoCristalOi)[0] : null);

    $data = array_merge($defaults, $request->all(), ['codigo_cristal' => $codigoCristal]);

    $correccion = CorrecionesOrdenes::create($data);

    Ordenes::where('id_orden', $data['ordenes_id'])->update(['correccion' => true]);

    return response()->json([
      'success' => true,
      'data' => $correccion
    ], 201);
  }

  public function getCorreccionesPorOrden(Request $request, $ordenes_id)
  {
    $validator = Validator::make(['ordenes_id' => $ordenes_id], [
      'ordenes_id' => 'required|exists:ordenes,id_orden'
    ]);

    if ($validator->fails()) {
      return response()->json([
        'success' => false,
        'message' => 'El ID de la orden no es válido o no existe.',
        'errors' => $validator->errors()
      ], 400);
    }

    $contadorFasesQuery = DB::table('fases_correcciones_ordenes')
      ->select(
        'correccion_ordenes_id',
        DB::raw('COUNT(*) as total_fases'),
        DB::raw('SUM(1) as fases_completadas')
      )
      ->groupBy('correccion_ordenes_id');

    $primeraFaseQuery = DB::table('fases_correcciones_ordenes as fo')
      ->join('tipos_fases_ordenes as tfo', 'fo.tipo_fase_correccion_orden_id', '=', 'tfo.id')
      ->leftJoinSub($contadorFasesQuery, 'contador_fases', 'fo.correccion_ordenes_id', '=', 'contador_fases.correccion_ordenes_id')
      ->select(
        'fo.correccion_ordenes_id',
        'fo.laboratorio as laboratorio_primera_fase',
        'fo.observacion as observacion_primera_fase',
        'fo.fecha_fase as fecha_primera_fase',
        'contador_fases.total_fases',
        'contador_fases.fases_completadas',
        DB::raw('DATEDIFF(CURRENT_DATE, fo.fecha_fase) as dias_transcurridos'),
        DB::raw('CASE 
                  WHEN contador_fases.total_fases = 4 AND contador_fases.fases_completadas = 4 THEN "Completado"
                  WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) <= 6 THEN "Ok"
                  WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) = 7 THEN "Advertencia"
                  WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) >= 8 THEN "Critico"
                  ELSE "sin_status"
              END as status_primera_fase')
      )
      ->whereRaw('fo.id = (
              SELECT MIN(id) 
              FROM fases_correcciones_ordenes 
              WHERE correccion_ordenes_id = fo.correccion_ordenes_id 
              AND tipo_fase_correccion_orden_id = 1
          )');

    $ultimaFaseQuery = DB::table('fases_correcciones_ordenes as fo')
      ->join('tipos_fases_ordenes as tfo', 'fo.tipo_fase_correccion_orden_id', '=', 'tfo.id')
      ->select(
        'fo.correccion_ordenes_id',
        DB::raw(
          '
                CASE 
                    WHEN fo.status = 1 THEN 
                        CASE 
                            WHEN fo.tipo_fase_correccion_orden_id IS NULL THEN 
                                (SELECT tipo_fase_orden 
                                 FROM tipos_fases_ordenes 
                                 ORDER BY id ASC LIMIT 1)
                            WHEN fo.tipo_fase_correccion_orden_id = 4 THEN 
                                tfo.tipo_fase_orden  -- Mantiene el nombre original de la fase "4"
                            ELSE 
                                (SELECT tipo_fase_orden 
                                 FROM tipos_fases_ordenes 
                                 WHERE id = fo.tipo_fase_correccion_orden_id + 1 LIMIT 1)
                        END
                    ELSE 
                        tfo.tipo_fase_orden  -- Si el status es 0, mantén la fase actual
                END as fase_actual',
        ),
        'fo.laboratorio as laboratorio_ultima_fase',
        'fo.observacion as observacion_ultima_fase',
        'fo.fecha_fase as fecha_ultima_fase'
      )
      ->whereRaw('fo.id = (
            SELECT MAX(id) 
            FROM fases_correcciones_ordenes 
            WHERE correccion_ordenes_id = fo.correccion_ordenes_id
        )');

    if ($validator->fails()) {
      return response()->json([
        'success' => false,
        'message' => 'El ID de la orden no es válido o no existe.',
        'errors' => $validator->errors()
      ], 400);
    }

    // Obtener la orden original
    $correcionesOrdenes = CorrecionesOrdenes::with([])
      ->join('usuarios', 'correciones_ordenes.elaborado_por', '=', 'usuarios.id_usuario')
      ->join('ordenes', 'correciones_ordenes.ordenes_id', '=', 'ordenes.id_orden')
      ->join('pacientes', 'ordenes.id_paciente', '=', 'pacientes.id_paciente')
      ->join('sucursales', 'ordenes.id_sucursal', '=', 'sucursales.id_sucursal')
      ->leftJoinSub($primeraFaseQuery, 'primeras_fases', 'correciones_ordenes.id', '=', 'primeras_fases.correccion_ordenes_id')
      ->leftJoinSub($ultimaFaseQuery, 'ultimas_fases', 'correciones_ordenes.id', '=', 'ultimas_fases.correccion_ordenes_id')
      ->select(
        'correciones_ordenes.*',
        'usuarios.nombre as elaborado_por_nombre',
        'primeras_fases.laboratorio_primera_fase as laboratorio',
        'primeras_fases.observacion_primera_fase as observacion',
        'primeras_fases.fecha_primera_fase as fecha_fase',
        'primeras_fases.status_primera_fase as status',
        'primeras_fases.dias_transcurridos as dias_transcurridos',
        'primeras_fases.total_fases as total_fases',
        'pacientes.celular as celular',
        'ordenes.nro_orden as nro_orden',
        'ordenes.pagado as pagado_orden',
        'ordenes.nro_orden_id as nro_orden_id',
        'ordenes.lente_contacto as lente_contacto',
        'sucursales.nombre as sucursal',
        'sucursales.ubicacion_maps as ubicacion_maps',
        DB::raw('CONCAT(pacientes.nombres, " ", pacientes.apellidos) as paciente_nombre_completo'),
        DB::raw('CASE WHEN ultimas_fases.fase_actual IS NULL THEN "Nuevo" ELSE ultimas_fases.fase_actual END as fase_actual')
      )
      ->where('correciones_ordenes.ordenes_id', $ordenes_id);

    $correcionesOrdenesData = $correcionesOrdenes->paginate($request->input('limit', 10));

    return response()->json([
      'success' => true,
      'data' => $correcionesOrdenesData->items(),
      'meta' => [
        'page' => $correcionesOrdenesData->currentPage(),
        'limit' => $correcionesOrdenesData->perPage(),
        'total' => $correcionesOrdenesData->total(),
      ],
    ], 200);
  }

  public function updateCorreccionOrden(Request $request, $id)
  {
    $Correccionorden = CorrecionesOrdenes::find($id);

    if (!$Correccionorden) {
      return response()->json([
        'respuesta' => false,
        'mensaje' => 'Correccion Orden no encontrada',
        'mensaje_dev' => "Order with ID {$id} does not exist",
      ], 404);
    }

    $validator = Validator::make($request->all(), [
      'elaborado_por' => 'nullable|integer',
      'esfera_od' => 'nullable|string|max:255',
      'esfera_oi' => 'nullable|string|max:255',
      'cilindro_od' => 'nullable|string|max:255',
      'cilindro_oi' => 'nullable|string|max:255',
      'eje_od' => 'nullable|string|max:255',
      'eje_oi' => 'nullable|string|max:255',
      'add_od' => 'nullable|string|max:255',
      'add_oi' => 'nullable|string|max:255',
      'prisma_od' => 'nullable|string|max:255',
      'prisma_oi' => 'nullable|string|max:255',
      'distancia_od' => 'nullable|string|max:255',
      'distancia_oi' => 'nullable|string|max:255',
      'altura_od' => 'nullable|string|max:255',
      'altura_oi' => 'nullable|string|max:255',
      'material_od' => 'nullable|string|max:255',
      'material_oi' => 'nullable|string|max:255',
      'tratamientos_od' => 'nullable|string|max:255',
      'tratamientos_oi' => 'nullable|string|max:255',
      'aro_centevi' => 'nullable|integer|min:0|max:1',
      'aro_propio' => 'nullable|integer|min:0|max:1',
      'codigo' => 'nullable|string|max:255',
      'color' => 'nullable|string|max:255',
      'marca' => 'nullable|string|max:255',
      'tipo_aro' => 'nullable|string|max:255',
      'doctor' => 'nullable|string|max:255',
      'observaciones' => 'nullable|string|max:400',
      'l_uno' => 'nullable|string|max:255',
      'l_dos' => 'nullable|string|max:255',
      'l_tres' => 'nullable|string|max:255',
      'l_cuatro' => 'nullable|string|max:255',
      'l_cinco' => 'nullable|string|max:255',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'respuesta' => false,
        'mensaje' => 'Errores de validación',
        'data' => $validator->errors(),
      ], 400);
    }

    $Correccionorden = CorrecionesOrdenes::find($id);

    if (!$Correccionorden) {
      return response()->json([
        'respuesta' => false,
        'mensaje' => 'Correccion Orden no encontrada',
      ], 404);
    }

    $Correccionorden->update($request->all());


    return response()->json([
      'respuesta' => true,
      'mensaje' => 'Correccion Orden actualizada correctamente',
      'data' => $Correccionorden,
    ], 200);
  }

  public function DeleteCorrecionesOrdenes(Request $request)
  {
    // Validar los datos de entrada
    $validator = Validator::make($request->all(), [
      'correccion_id' => 'required|exists:correciones_ordenes,id',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'respuesta' => false,
        'mensaje' => 'Validation errors',
        'data' => $validator->errors(),
        'mensaje_dev' => "Oops, validation errors occurred.",
      ], 400);
    }

    if (!$request->has('correccion_id')) {
      return response()->json([
        'success' => false,
        'mensaje' => 'The field "correccion_id" is required and was not found.',
      ], 400);
    }

    // Obtener el ID de la corrección
    $correccionId = $request->input('correccion_id');

    // Buscar la corrección en la base de datos
    $correccion = CorrecionesOrdenes::find($correccionId);

    if (!$correccion) {
      return response()->json([
        'success' => false,
        'mensaje' => 'Correction not found.',
      ], 404);
    }

    $orden = $correccion->orden;

    $correccion->delete();

    $remainingCorrections = $orden->correciones()->count();

    // Si no quedan correcciones, actualizar el campo "correccion" en la tabla "ordenes" a 0
    if ($remainingCorrections === 0) {
      $orden->update(['correccion' => 0]);
    }

    return response()->json([
      'success' => true,
      'mensaje' => 'Correction deleted successfully.',
    ], 200);
  }

  public function fasesCorreccionesOrdenes()
  {
    $fasesOrdenes = FasesCorreccionesOrdenes::with('tipoFaseCorreccionOrden')->get(); // Incluye la relación con tipoFaseOrden
    return response()->json([
      'data' => $fasesOrdenes,
      'status' => [
        'code' => 200
      ]
    ]);
  }

  public function createFasesCorrecionesOrdenes(Request $request)
  {
    $validatedData = $request->validate([
      'tipo_fase_correccion_orden_id' => 'required|exists:tipos_fases_ordenes,id',
      'correccion_ordenes_id' => 'required|integer',
      'laboratorio' => 'nullable|string|max:45',
      'fecha_fase' => 'nullable|string|max:45',
      'observacion' => 'nullable|string|max:400',
      'status' => 'nullable|integer|min:0|max:1',
      'created_at' => 'nullable|date_format:Y-m-d H:i:s',
    ]);

    $existingFase = FasesCorreccionesOrdenes::where('correccion_ordenes_id', $validatedData['correccion_ordenes_id'])
      ->where('tipo_fase_correccion_orden_id', $validatedData['tipo_fase_correccion_orden_id'])
      ->first();

    if ($existingFase) {
      $updated = $existingFase->update([
        'laboratorio' => $validatedData['laboratorio'],
        'observacion' => $validatedData['observacion'],
        'fecha_fase' => $validatedData['fecha_fase'],
        'status' => $validatedData['status'] ?? $existingFase->status,
        'created_at' => $validatedData['created_at'] ?? $existingFase->created_at,
      ]);

      if ($updated && isset($validatedData['status']) && $validatedData['status'] == 0) {
        FasesCorreccionesOrdenes::where('correccion_ordenes_id', $validatedData['correccion_ordenes_id'])
          ->where('tipo_fase_correccion_orden_id', '>', $validatedData['tipo_fase_correccion_orden_id'])
          ->delete();
      }
      DB::commit();
      return response()->json([
        'message' => 'Fase de orden actualizada exitosamente',
        'data' => $existingFase,
      ], 200);
    } else {
      try {
        $faseOrden = FasesCorreccionesOrdenes::create(array_merge(
          $validatedData,
          ['created_at' => $validatedData['created_at'] ?? now()]
        ));

        DB::commit();
        return response()->json([
          'message' => 'Fase de orden creada exitosamente',
          'data' => $faseOrden,
        ], 201);
      } catch (\Exception $e) {
        return response()->json([
          'message' => 'Error al crear la fase de correcion orden. Inténtalo nuevamente.',
          'error' => $e->getMessage(),
        ], 500);
      }
    }
  }

  public function updateFasesCorreccionesOrdenes(Request $request, $id)
  {
    // Validar los datos de entrada
    $validatedData = $request->validate([
      'tipo_fase_correccion_orden_id' => 'nullable|exists:tipos_fases_ordenes,id',
      'correccion_ordenes_id' => 'nullable|integer',
      'laboratorio' => 'nullable|string|max:45',
      'fecha_fase' => 'nullable|string|max:45',
      'observacion' => 'nullable|string|max:400',
      'created_at' => 'nullable|date_format:Y-m-d H:i:s',
      'updated_at' => 'nullable|date_format:Y-m-d H:i:s',
    ]);

    // Buscar la fase de orden por ID
    $faseCorreccionOrden = FasesCorreccionesOrdenes::find($id);

    if (!$faseCorreccionOrden) {
      return response()->json([
        'message' => 'Fase de correccion orden no encontrada.',
      ], 404);
    }

    try {
      // Actualizar los datos del registro
      $faseCorreccionOrden->update(array_filter($validatedData)); // array_filter elimina valores nulos

      return response()->json([
        'message' => 'Fase de correccion orden actualizada exitosamente.',
        'data' => $faseCorreccionOrden,
      ], 200);
    } catch (\Exception $e) {
      return response()->json([
        'message' => 'Error al actualizar la fase de correccion orden. Inténtalo nuevamente.',
        'error' => $e->getMessage(),
      ], 500);
    }
  }

  public function verContactoCorreccionOrden($id_orden)
  {

    $data = ContactoCorrecionesOrdenes::join('usuarios', 'usuarios.id_usuario', 'contactos_correciones_ordenes.usuario_id')
      ->select(
        'contactos_correciones_ordenes.*',
        'usuarios.nombre',
      )
      ->where('contactos_correciones_ordenes.correccion_ordenes_id', $id_orden)
      ->orderBy('contactos_correciones_ordenes.created_at', 'desc')
      ->get();

    return response()->json([
      'data' => $data,
      'respuesta' => true,
      'status' => [
        'code' => 200,
        'message' => 'Contacto orders retrieved successfully',
      ],
      'mensaje' => 'Contactos de Órdenes del paciente obtenidas correctamente',
    ], 200);
  }

  public function getOrdenCorrecionPdf($id_orden)
  {
    $orden = CorrecionesOrdenes::with([])
      ->join('ordenes', 'correciones_ordenes.ordenes_id', '=', 'ordenes.id_orden')
      ->join('pacientes', 'ordenes.id_paciente', '=', 'pacientes.id_paciente')
      ->join('sucursales', 'ordenes.id_sucursal', '=', 'sucursales.id_sucursal')
      ->select(
        'correciones_ordenes.*',
        'sucursales.nombre',
        'pacientes.nombres',
        'pacientes.apellidos',
        'ordenes.nro_orden_id',
        'ordenes.id_orden as id_orden',
      )->where('correciones_ordenes.id', $id_orden)->first();


    $idCorrelativo = CorrecionesOrdenes::with([])
      ->where('correciones_ordenes.id', '<=', $id_orden)
      ->where('correciones_ordenes.ordenes_id', $orden['id_orden'])
      ->orderBy('id')
      ->count();

    $data = [
      'fecha_solicitud' => $orden['created_at'],
      'nro_orden' => $orden['nro_orden_id'] . ' - C' . $idCorrelativo,
      'lenteContacto' => false,
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
      'l_uno' => $orden['l_uno'],
      'l_dos' => $orden['l_dos'],
      'l_tres' => $orden['l_tres'],
      'l_cuatro' => $orden['l_cuatro'],
      'l_cinco' => $orden['l_cinco'],
      'color' => $orden['color'] ?? "_",
      'codigo' => $orden['codigo'] ?? "_",
      'marca' => $orden['marca'] ?? "_",
      'tipo_aro' => $orden['tipo_aro'] ?? "_",
      'observaciones' => $orden['observaciones'] ?? "_",
      'aro_centevi' => $orden['aro_centevi'],
      'aro_propio' => $orden['aro_propio'],
      'lente_contacto' => $orden['lente_contacto'],
      'tratamientos_oi' => $orden['tratamientos_oi'],
      'tratamientos_od' => $orden['tratamientos_od'],
      'sucursal' => $orden['nombre'] ?? '',
      'nombres_apellidos_paciente' => ($orden['nombres'] ? explode(' ', trim($orden['nombres']))[0] : '')
        . ' '
        . ($orden['apellidos'] ? explode(' ', trim($orden['apellidos']))[0] : '')
    ];

    $pdf = Pdf::loadView('pdf/ordenPdf', $data);
    return $pdf->stream('orden.pdf', [
      'Content-Type' => 'application/pdf',
      'Content-Disposition' => 'inline; filename="orden_' . $id_orden . '.pdf"'
    ]);
  }

  public function obtenerCorreccion($id_correccion)
  {
    // Buscar la corrección con todas sus relaciones
    $correccion = CorrecionesOrdenes::with([
      'orden.paciente',
      'orden.sucursal',
      'faseCorreccionOrden.usuario',
      'usuario'
    ])->find($id_correccion);

    // Si no existe la corrección, devolver un error 404
    if (!$correccion) {
      return response()->json(['message' => 'Corrección no encontrada'], 404);
    }

    $ultimaFase = $correccion->faseCorreccionOrden->sortByDesc('tipo_fase_correccion_orden_id')->first();

    $elaboradoPorNombre = $correccion->usuario ? $correccion->usuario->nombre : null;


    $elaboradoPorFase = $ultimaFase && $ultimaFase->usuario ? $ultimaFase->usuario->nombre : null;

    $estado = 'Sin estado';

    if ($ultimaFase) {
      if ($ultimaFase->tipo_fase_correccion_orden_id == 4) {
        $estado = 'Completado';
      } else {
        $fechaFase = Carbon::parse($ultimaFase->fecha_fase);
        $diasDiferencia = $fechaFase->diffInDays(Carbon::now());

        if ($diasDiferencia <= 6) {
          $estado = 'Ok';
        } elseif ($diasDiferencia == 7) {
          $estado = 'Advertencia';
        } else {
          $estado = 'Crítico';
        }
      }
    }

    return response()->json([
      'data' => [
        'correccion_id' => $correccion->id,
        'orden_id' => $correccion->orden ? $correccion->orden->id_orden : null,
        'pagado' => $correccion->orden ? $correccion->orden->pagado : 0,
        'created_at' => $correccion->created_at ? Carbon::parse($correccion->created_at)->format('d-m-Y') : null,
        'sucursal' => $correccion->orden ? $correccion->orden->sucursal->nombre : null,
        'nro_orden_id' => $correccion->orden ? $correccion->orden->nro_orden_id : null,
        'lente_contacto' => $correccion->orden ? $correccion->orden->lente_contacto : null,
        'paciente_nombre_completo' => $correccion->orden
          ? trim($correccion->orden->paciente->nombres . ' ' . $correccion->orden->paciente->apellidos)
          : null,
        'celular' => $correccion->orden ? $correccion->orden->paciente->celular : null,
        'laboratorio' => $correccion->faseCorreccionOrden->whereNotNull('laboratorio')->pluck('laboratorio')->first() ?? null,
        'estado' => $estado,
        'elaborado_por_nombre' => $elaboradoPorNombre,
        'elaborado_por_fase' => $elaboradoPorFase,
        'esfera_od' => $correccion->esfera_od,
        'esfera_oi' => $correccion->esfera_oi,
        'cilindro_od' => $correccion->cilindro_od,
        'cilindro_oi' => $correccion->cilindro_oi,
        'eje_od' => $correccion->eje_od,
        'eje_oi' => $correccion->eje_oi,
        'add_od' => $correccion->add_od,
        'add_oi' => $correccion->add_oi,
        'prisma_od' => $correccion->prisma_od,
        'prisma_oi' => $correccion->prisma_oi,
        'distancia_od' => $correccion->distancia_od,
        'distancia_oi' => $correccion->distancia_oi,
        'altura_od' => $correccion->altura_od,
        'altura_oi' => $correccion->altura_oi,
        'tipo_cristal_od' => $correccion->tipo_cristal_od,
        'tipo_cristal_oi' => $correccion->tipo_cristal_oi,
        'material_od' => $correccion->material_od,
        'material_oi' => $correccion->material_oi,
        'tratamientos_od' => $correccion->tratamientos_od,
        'tratamientos_oi' => $correccion->tratamientos_oi,
        'aro_centevi' => $correccion->aro_centevi,
        'aro_propio' => $correccion->aro_propio,
        'codigo' => $correccion->codigo,
        'color' => $correccion->color,
        'marca' => $correccion->marca,
        'tipo_aro' => $correccion->tipo_aro,
        'doctor' => $correccion->doctor,
        'observaciones' => $correccion->observaciones,
        'l_uno' => $correccion->l_uno,
        'l_dos' => $correccion->l_dos,
        'l_tres' => $correccion->l_tres,
        'l_cuatro' => $correccion->l_cuatro,
        'l_cinco' => $correccion->l_cinco
      ]
    ]);
  }
}
