<?php

namespace App\Http\Controllers\API\ordenes;

use App\Http\Controllers\Controller;
use App\Models\Ordenes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\TiposFasesOrdenes;
use App\Models\FasesOrdenes;
use Illuminate\Support\Facades\DB;

class OrdenesApiController extends Controller
{

  public function ordenes(Request $request)
  {
    $limit = $request->input('limit', 10);
    $page = $request->input('page', 1);
    $sortColumn = $request->input('sortColumn', 'id_orden');
    $sortOrder = $request->input('sortOrder', 'asc');

    // Subconsulta para contar el número total de fases para cada orden
    $contadorFasesQuery = DB::table('fases_ordenes')
      ->select('ordenes_id', DB::raw('COUNT(*) as total_fases'))
      ->groupBy('ordenes_id');

    // Subconsulta para obtener el primer dato
    $primeraFaseQuery = DB::table('fases_ordenes as fo')
      ->join('tipos_fases_ordenes as tfo', 'fo.tipo_fase_orden_id', '=', 'tfo.id')
      ->leftJoinSub($contadorFasesQuery, 'contador_fases', 'fo.ordenes_id', '=', 'contador_fases.ordenes_id')
      ->select(
        'fo.ordenes_id',
        'fo.laboratorio as laboratorio_primera_fase',
        'fo.observacion as observacion_primera_fase',
        'fo.fecha_fase as fecha_primera_fase',
        'contador_fases.total_fases',
        DB::raw('DATEDIFF(CURRENT_DATE, fo.fecha_fase) as dias_transcurridos'),
        DB::raw('CASE 
                WHEN contador_fases.total_fases = 4 THEN "Completado"
                WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) <= 6 THEN "Ok"
                WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) = 7 THEN "Advertencia"
                WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) >= 8 THEN "Critico"
                ELSE "sin_status"
            END as status_primera_fase')
      )
      ->whereRaw('fo.id = (
            SELECT MIN(id) 
            FROM fases_ordenes 
            WHERE ordenes_id = fo.ordenes_id 
            AND tipo_fase_orden_id = 1
        )');

    // Subconsulta para obtener la última fase
    $ultimaFaseQuery = DB::table('fases_ordenes as fo')
      ->join('tipos_fases_ordenes as tfo', 'fo.tipo_fase_orden_id', '=', 'tfo.id')
      ->select(
        'fo.ordenes_id',
        'tfo.tipo_fase_orden as fase_actual',
        'fo.laboratorio as laboratorio_ultima_fase',
        'fo.observacion as observacion_ultima_fase',
        'fo.fecha_fase as fecha_ultima_fase'
      )
      ->whereRaw('fo.id = (
            SELECT MAX(id) 
            FROM fases_ordenes 
            WHERE ordenes_id = fo.ordenes_id
        )');

    // Consulta principal
    $ordenes = Ordenes::with([
      'paciente:id_paciente,nombres,celular,apellidos',
      'sucursal:id_sucursal,nombre',
    ])
      ->join('usuarios', 'ordenes.elaborado_por', '=', 'usuarios.id_usuario')
      ->leftJoinSub($primeraFaseQuery, 'primeras_fases', 'ordenes.id_orden', '=', 'primeras_fases.ordenes_id')
      ->leftJoinSub($ultimaFaseQuery, 'ultimas_fases', 'ordenes.id_orden', '=', 'ultimas_fases.ordenes_id')
      ->select(
        'ordenes.*',
        'usuarios.nombre as elaborado_por_nombre',
        'primeras_fases.laboratorio_primera_fase as laboratorio',
        'primeras_fases.observacion_primera_fase as observacion',
        'primeras_fases.fecha_primera_fase as fecha_fase',
        'primeras_fases.status_primera_fase as status',
        'primeras_fases.dias_transcurridos as dias_transcurridos',
        'primeras_fases.total_fases as total_fases',
        'ultimas_fases.fase_actual'
      )
      ->orderBy($sortColumn, $sortOrder)
      ->paginate($limit, ['*'], 'page', $page);

    return response()->json([
      'data' => $ordenes->items(),
      'meta' => [
        'page' => $ordenes->currentPage(),
        'limit' => $ordenes->perPage(),
        'total' => $ordenes->total(),
      ],
      'respuesta' => true,
      'status' => [
        'code' => 200,
        'message' => 'Órdenes retrieved successfully',
      ],
      'mensaje' => 'Órdenes obtenidas correctamente',
    ], 200);
  }

  public function createOrdenes(Request $request)
  {
    $validator = Validator::make($request->all(), [
      "nro_orden" => 'nullable|integer|unique:ordenes,nro_orden',
      "id_paciente" => 'nullable|integer',
      'id_sucursal' => 'nullable|integer',
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

    ];

    $data = array_map(function ($value) {
      return $value === null ? '' : $value;
    }, $request->all());

    $data = array_merge($defaults, $data);

    $receta = Ordenes::create($data);

    return response()->json([
      'respuesta' => true,
      'mensaje' => 'Orden registrada correctamente',
      'data' => [$receta],
      'mensaje_dev' => null
    ], 201);
  }

  public function updateOrden(Request $request, $id_orden)
  {
    $orden = Ordenes::find($id_orden);

    if (!$orden) {
      return response()->json([
        'respuesta' => false,
        'mensaje' => 'Orden no encontrada',
        'mensaje_dev' => "Order with ID {$id_orden} does not exist",
      ], 404);
    }

    $validator = Validator::make($request->all(), [
      'nro_orden' => 'required|integer|unique:ordenes,nro_orden,' . $id_orden . ',id_orden',
      "id_paciente" => 'nullable|integer',
      'id_sucursal' => 'nullable|integer',
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

    $orden = Ordenes::find($id_orden);

    if (!$orden) {
      return response()->json([
        'respuesta' => false,
        'mensaje' => 'Orden no encontrada',
      ], 404);
    }

    $orden->update($request->all());


    return response()->json([
      'respuesta' => true,
      'mensaje' => 'Orden actualizada correctamente',
      'data' => $orden,
    ], 200);
  }

  public function deleteOrden($id_orden)
  {
    $orden = Ordenes::find($id_orden);

    if (!$orden) {
      return response()->json([
        'respuesta' => false,
        'mensaje' => 'Orden no encontrada',
        'mensaje_dev' => "Order with ID {$id_orden} does not exist",
      ], 404);
    }

    try {
      $orden->delete();

      return response()->json([
        'respuesta' => true,
        'mensaje' => 'Orden eliminada correctamente',
        'mensaje_dev' => null,
      ], 200);
    } catch (\Exception $e) {
      return response()->json([
        'respuesta' => false,
        'mensaje' => 'Error al eliminar la orden',
        'mensaje_dev' => $e->getMessage(),
      ], 500);
    }
  }


  public function tipoFasesOrdenes()
  {

    $tiposFases = TiposFasesOrdenes::with('fasesOrdenes')->get();
    return response()->json([
      'data' => $tiposFases,
      'status' => [
        'code' => 200
      ],
    ]);
  }

  public function createTiposFasesOrdenes(Request $request)
  {
    $validatedData = $request->validate([
      'tipo_fase_orden' => 'required|string|max:45',
    ]);

    $tipoFaseOrden = TiposFasesOrdenes::create($validatedData);

    return response()->json([
      'message' => 'Tipo de fase de orden creado exitosamente',
      'data' => $tipoFaseOrden,
    ], 201);
  }

  public function fasesOrdenes()
  {
    $fasesOrdenes = FasesOrdenes::with('tipoFaseOrden')->get(); // Incluye la relación con tipoFaseOrden
    return response()->json([
      'data' => $fasesOrdenes,
      'status' => [
        'code' => 200
      ]
    ]);
  }

  public function createFasesOrdenes(Request $request)
  {
    $validatedData = $request->validate([
      'tipo_fase_orden_id' => 'required|exists:tipos_fases_ordenes,id',
      'ordenes_id' => 'required|integer',
      'laboratorio' => 'nullable|string|max:45',
      'fecha_fase' => 'nullable|string|max:45',
      'observacion' => 'nullable|string|max:400',
    ]);

    $existingFase = FasesOrdenes::where('ordenes_id', $validatedData['ordenes_id'])
      ->where('tipo_fase_orden_id', $validatedData['tipo_fase_orden_id'])
      ->first();

    if ($existingFase) {
      $updated = $existingFase->update([
        'laboratorio' => $validatedData['laboratorio'],
        'observacion' => $validatedData['observacion'],
        'fecha_fase' => $validatedData['fecha_fase'],
      ]);

      if ($updated) {
        return response()->json([
          'message' => 'Fase de orden actualizada exitosamente',
          'data' => $existingFase,
        ], 200);
      } else {
        return response()->json([
          'message' => 'Error al actualizar la fase de orden. Inténtalo nuevamente.',
        ], 500);
      }
    } else {
      try {
        $faseOrden = FasesOrdenes::create($validatedData);

        return response()->json([
          'message' => 'Fase de orden creada exitosamente',
          'data' => $faseOrden,
        ], 201);
      } catch (\Exception $e) {
        return response()->json([
          'message' => 'Error al crear la fase de orden. Inténtalo nuevamente.',
          'error' => $e->getMessage(),
        ], 500);
      }
    }
  }



}
