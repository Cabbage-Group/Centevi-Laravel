<?php

namespace App\Http\Controllers\API\correciones_ordenes;

use App\Http\Controllers\Controller;
use App\Models\ContactoCorrecionesOrdenes;
use App\Models\CorrecIonesOrdenes;
use App\Models\FasesCorreccionesOrdenes;
use App\Models\Ordenes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class CorrecionesOrdenesController extends Controller
{
    public function VerCorrecionesOrdenes(Request $request)
{
    $limit = $request->input('limit', 10); // Límite de registros por página
    $page = $request->input('page', 1); // Página actual
    $sortColumn = $request->input('sortColumn', 'created_at'); // Columna para ordenar
    $sortOrder = $request->input('sortOrder', 'asc'); // Orden (ascendente o descendente)

    $validSortColumns = ['created_at'];
    if (!in_array($sortColumn, $validSortColumns)) {
      $sortColumn = 'created_at';
    }

    $contadorFasesQuery = DB::table('fases_correcciones_ordenes')
        ->select('correccion_ordenes_id', 
            DB::raw('COUNT(*) as total_fases'),
            DB::raw('SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as fases_completadas')
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
            DB::raw('
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

    $correcionesOrdenes = CorrecionesOrdenes::with([
          ])
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
        'pagado' => '',
        'lente_contacto' => 0

        ];

        $data = array_map(function ($value) {
            return $value === null ? '' : $value;
          }, $request->all());

        $data = array_merge($defaults, $data);

        $correccion = CorrecionesOrdenes::create($data);

        Ordenes::where('id_orden', $data['ordenes_id'])->update(['correccion' => true]);

        return response()->json([
            'success' => true,
            'data' => $correccion,
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
        ->select('correccion_ordenes_id', 
            DB::raw('COUNT(*) as total_fases'),
            DB::raw('SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as fases_completadas')
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
            DB::raw('
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
    $correcionesOrdenes = CorrecionesOrdenes::with([
        ])
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

      if ($updated) {
        return response()->json([
          'message' => 'Fase de correccion orden actualizada exitosamente',
          'data' => $existingFase,
        ], 200);
      } else {
        return response()->json([
          'message' => 'Error al actualizar la fase de  correcion orden. Inténtalo nuevamente.',
        ], 500);
      }
    } else {
      try {
        $faseOrden = FasesCorreccionesOrdenes::create(array_merge(
          $validatedData,
          ['created_at' => $validatedData['created_at'] ?? now()]
        ));

        return response()->json([
          'message' => 'Fase de correccion orden creada exitosamente',
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

    $data = ContactoCorrecionesOrdenes::join('usuarios','usuarios.id_usuario','contactos_correciones_ordenes.usuario_id')
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

  


}
