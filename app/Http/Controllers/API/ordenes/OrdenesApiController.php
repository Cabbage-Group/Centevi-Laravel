<?php

namespace App\Http\Controllers\API\ordenes;

use App\Http\Controllers\Controller;
use App\Models\Ordenes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\TiposFasesOrdenes;
use App\Models\FasesOrdenes;
use App\Models\ContactoOrden;
use App\Models\Cristales;
use App\Models\NroOrden;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class OrdenesApiController extends Controller
{

  public function ordenes(Request $request)
  {
    $limit = $request->input('limit', 10);
    $page = $request->input('page', 1);
    $sortColumn = $request->input('sortColumn', 'created_at');
    $sortOrder = $request->input('sortOrder', 'asc');
    $search = $request->input('search', '');
    $lenteContacto = $request->input('lenteContacto', []);
    $status = $request->input('status', []);
    $pagado = $request->input('pagado', []);
    $sucursal = $request->input('sucursal', []);
    $fecha = $request->input('fecha', '');
    $laboratorio = $request->input('laboratorio', []);
    $fase = $request->input('fase', []);

    // Asegurarse de que se puede ordenar por created_at
    $validSortColumns = ['id_orden', 'created_at', 'nro_order_id'];
    if (!in_array($sortColumn, $validSortColumns)) {
      $sortColumn = 'id_orden'; // Valor por defecto
    }

    // Subconsulta para contar el número total de fases para cada orden
    $contadorFasesQuery = DB::table('fases_ordenes')
      ->select(
        'ordenes_id',
        DB::raw('COUNT(*) as total_fases'),
        DB::raw('SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as fases_completadas')
      )
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
            FROM fases_ordenes 
            WHERE ordenes_id = fo.ordenes_id 
            AND tipo_fase_orden_id = 1
        )');

    // Subconsulta para obtener la última fase
    $ultimaFaseQuery = DB::table('fases_ordenes as fo')
      ->join('tipos_fases_ordenes as tfo', 'fo.tipo_fase_orden_id', '=', 'tfo.id')
      ->select(
        'fo.ordenes_id',
        DB::raw('
            CASE 
                WHEN fo.status = 1 THEN 
                    CASE 
                        WHEN fo.tipo_fase_orden_id IS NULL THEN 
                            (SELECT tipo_fase_orden 
                             FROM tipos_fases_ordenes 
                             ORDER BY id ASC LIMIT 1)
                        WHEN fo.tipo_fase_orden_id = 4 THEN 
                            tfo.tipo_fase_orden  -- Mantiene el nombre original de la fase "4"
                        ELSE 
                            (SELECT tipo_fase_orden 
                             FROM tipos_fases_ordenes 
                             WHERE id = fo.tipo_fase_orden_id + 1 LIMIT 1)
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
        FROM fases_ordenes 
        WHERE ordenes_id = fo.ordenes_id
    )');
    // Consulta principal
    $ordenes = Ordenes::with([
      'paciente:id_paciente,nombres,celular,apellidos',
      'sucursal:id_sucursal,nombre,ubicacion,ubicacion_maps',
    ])
      ->leftJoin('usuarios', 'ordenes.elaborado_por', '=', 'usuarios.id_usuario')
      ->leftJoinSub($primeraFaseQuery, 'primeras_fases', 'ordenes.id_orden', '=', 'primeras_fases.ordenes_id')
      ->leftJoinSub($ultimaFaseQuery, 'ultimas_fases', 'ordenes.id_orden', '=', 'ultimas_fases.ordenes_id')
      ->leftJoin('sucursales', 'ordenes.id_sucursal', '=', 'sucursales.id_sucursal')
      ->leftJoin('pacientes', 'ordenes.id_paciente', '=', 'pacientes.id_paciente')
      ->select(
        'ordenes.*',
        'usuarios.nombre as elaborado_por_nombre',
        'primeras_fases.laboratorio_primera_fase as laboratorio',
        'primeras_fases.observacion_primera_fase as observacion',
        'primeras_fases.fecha_primera_fase as fecha_fase',
        'primeras_fases.status_primera_fase as status',
        'primeras_fases.dias_transcurridos as dias_transcurridos',
        'primeras_fases.total_fases as total_fases',
        DB::raw("DATE_FORMAT(ordenes.created_at, '%d-%m-%Y') as created_at_formatted"),
        DB::raw("COALESCE(ultimas_fases.fase_actual, 'Nuevo') as fase_actual")
        // DB::raw('CASE WHEN ultimas_fases.fase_actual IS NULL THEN "Nuevo" ELSE ultimas_fases.fase_actual END as fase_actual')
      );
    if (!empty($search)) {
      $ordenes->where(function ($query) use ($search) {
        $query->where('ordenes.id_orden', 'like', "%{$search}%")
          ->orWhere('usuarios.nombre', 'like', "%{$search}%")
          ->orWhere('ordenes.doctor', 'like', "%{$search}%")
          ->orWhere('ordenes.nro_orden_id', 'like', "%{$search}%")
          ->orWhere('ordenes.created_at', 'like', "%{$search}%")
          ->orWhere('ordenes.pagado', 'like', "%{$search}%")
          ->orWhere('sucursales.nombre', 'like', "%{$search}%")
          ->orWhere('pacientes.nombres', 'like', "%{$search}%")
          ->orWhere('pacientes.apellidos', 'like', "%{$search}%")
          ->orWhere('pacientes.celular', 'like', "%{$search}%")
          ->orWhere('primeras_fases.status_primera_fase', 'like', "%{$search}%")
          ->orWhere('primeras_fases.laboratorio_primera_fase', 'like', "%{$search}%")
          ->orWhereRaw("CASE 
                WHEN ultimas_fases.fase_actual IS NULL THEN 'Nuevo'
                ELSE ultimas_fases.fase_actual 
                END LIKE ?", ["%{$search}%"]);

      });
    }

    if (is_array($lenteContacto) && !empty($lenteContacto)) {
      // Si se selecciona "both", filtra por 0 y 1
      if (in_array('both', $lenteContacto)) {
        $ordenes->whereIn('ordenes.lente_contacto', ['0', '1']);
      } else {
        // Filtra solo por los valores seleccionados (0 o 1)
        $ordenes->whereIn('ordenes.lente_contacto', $lenteContacto);
      }
    }
    if (is_array($fase) && !empty($fase)) {
      $ordenes->where(function ($query) use ($fase) {
        if (in_array('Nuevo', $fase)) {
          // Si busca "Nuevo", debe incluir NULL también
          $query->whereNull('ultimas_fases.fase_actual')
            ->orWhereIn('ultimas_fases.fase_actual', $fase);
        } else {
          $query->whereIn('ultimas_fases.fase_actual', $fase);
        }
      });
    }

    if (is_array($status) && !empty($status)) {
      // Filtrar por valores específicos de status (como Ok, Critico, etc.)
      $ordenes->whereIn('primeras_fases.status_primera_fase', array_filter($status, fn($value) => $value !== null));


      // Si el array contiene null, filtrar por los registros donde el status_primera_fase es null
      if (in_array(null, $status, true)) {
        $ordenes->orWhereNull('primeras_fases.status_primera_fase');
      }
    }

    if (is_array($laboratorio) && !empty($laboratorio)) {
      $ordenes->whereIn('primeras_fases.laboratorio_primera_fase', $laboratorio);
    }

    if (is_array($pagado) && !empty($pagado)) {
      $ordenes->whereIn('ordenes.pagado', $pagado);
    }

    if (is_array($sucursal) && !empty($sucursal)) {
      $ordenes->whereIn('ordenes.id_sucursal', $sucursal);
    }
    if (!empty($fecha)) {
      $dates = explode(' - ', $fecha);
      if (count($dates) === 2) {
        $startDate = $dates[0];
        $endDate = $dates[1];
        $ordenes->whereBetween('ordenes.created_at', [$startDate, $endDate]);
      }
    }

    $paginatedData = $ordenes->orderBy($sortColumn, $sortOrder)
      ->paginate($limit, ['*'], 'page', $page);

    return response()->json([
      'data' => $paginatedData->items(),
      'meta' => [
        'page' => $paginatedData->currentPage(),
        'limit' => $paginatedData->perPage(),
        'total' => $paginatedData->total(),
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

    try {
        DB::beginTransaction();

        // Crear un nuevo nro_orden
        $nroOrden = NroOrden::create([]);

        // Definir valores predeterminados
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
            'pagado' => 2,
            'lente_contacto' => 0,
            'nro_orden_id' => $nroOrden->id, // Asignamos el ID recién creado
        ];

        // Extraer los códigos de los cristales
        $tipoCristalOd = $request->input('tipo_cristal_od');
        $tipoCristalOi = $request->input('tipo_cristal_oi');

        // Asignar el cristal según la prioridad
        $cristalCodigo = null;
        if ($tipoCristalOd) {
            $cristalCodigo = explode(' | ', $tipoCristalOd)[0]; // Tomar el código antes del "|"
        } elseif ($tipoCristalOi) {
            $cristalCodigo = explode(' | ', $tipoCristalOi)[0]; // Tomar el código antes del "|"
        }

        $cristal = null;
        if ($cristalCodigo) {
            $cristal = Cristales::where('codigo', $cristalCodigo)->first(); // Buscar cristal por código
        }

        // Asignar el ID del cristal si se encuentra
        $cristalId = $cristal ? $cristal->id : null;
        $data = array_merge($defaults, $request->all(), ['cristal_id' => $cristalId]);

        // Crear la orden en la base de datos
        $orden = Ordenes::create($data);

        DB::commit();

        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Orden registrada correctamente',
            'data' => [$orden],
            'mensaje_dev' => null
        ], 201);
    } catch (\Exception $e) {
        DB::rollBack();

        return response()->json([
            'respuesta' => false,
            'mensaje' => 'Error al registrar la orden',
            'mensaje_dev' => $e->getMessage()
        ], 500);
    }
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

    $tiposFases = TiposFasesOrdenes::with(['fasesOrdenes', 'fasesCorreccionesOrdenes'])->get();
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
      'status' => 'nullable|integer|min:0|max:1',
      'created_at' => 'nullable|date_format:Y-m-d H:i:s',
    ]);

    $existingFase = FasesOrdenes::where('ordenes_id', $validatedData['ordenes_id'])
      ->where('tipo_fase_orden_id', $validatedData['tipo_fase_orden_id'])
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
        $faseOrden = FasesOrdenes::create(array_merge(
          $validatedData,
          ['created_at' => $validatedData['created_at'] ?? now()]
        ));

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

  public function updateFasesOrdenes(Request $request, $id)
  {
    // Validar los datos de entrada
    $validatedData = $request->validate([
      'tipo_fase_orden_id' => 'nullable|exists:tipos_fases_ordenes,id',
      'ordenes_id' => 'nullable|integer',
      'laboratorio' => 'nullable|string|max:45',
      'fecha_fase' => 'nullable|string|max:45',
      'observacion' => 'nullable|string|max:400',
      'created_at' => 'nullable|date_format:Y-m-d H:i:s',
      'updated_at' => 'nullable|date_format:Y-m-d H:i:s',
    ]);

    // Buscar la fase de orden por ID
    $faseOrden = FasesOrdenes::find($id);

    if (!$faseOrden) {
      return response()->json([
        'message' => 'Fase de orden no encontrada.',
      ], 404);
    }

    try {
      // Actualizar los datos del registro
      $faseOrden->update(array_filter($validatedData)); // array_filter elimina valores nulos

      return response()->json([
        'message' => 'Fase de orden actualizada exitosamente.',
        'data' => $faseOrden,
      ], 200);
    } catch (\Exception $e) {
      return response()->json([
        'message' => 'Error al actualizar la fase de orden. Inténtalo nuevamente.',
        'error' => $e->getMessage(),
      ], 500);
    }
  }


  public function reportesOrdenes(Request $request)
  {
    $limit = $request->input('limit', 10);
    $page = $request->input('page', 1);
    $sortColumn = $request->input('sortColumn', 'created_at_formatted');
    $sortOrder = $request->input('sortOrder', 'asc');
    $search = $request->input('search', '');
    $fecha = $request->input('fecha', '');
    $status = $request->input('status', '');
    $lenteContacto = $request->input('lenteContacto', '');
    $laboratorio = $request->input('laboratorio', '');
    $pagado = $request->input('pagado', '');
    $sucursales = $request->input('sucursales', '');
    $doctor = $request->input('doctor', '');
    $asesor = $request->input('asesor', '');

    $validSortColumns = [
      'id_orden',
      'created_at_formatted',
      'laboratorio',
      'status',
      'lente_contacto',
      'doctor',
      'pagado',
      'nro_orden_id',
      'tipo_cristal_od_codigo',
      'tipo_cristal_oi_codigo'
    ];
    if (!in_array($sortColumn, $validSortColumns)) {
      $sortColumn = 'id_orden';
    }

    $contadorFasesQuery = DB::table('fases_ordenes')
      ->select(
        'ordenes_id',
        DB::raw('COUNT(*) as total_fases'),
        DB::raw('SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as fases_completadas')
      )
      ->groupBy('ordenes_id');

    $contadorFasesQueryCorrecciones = DB::table('fases_correcciones_ordenes')
      ->select(
        'correccion_ordenes_id',
        DB::raw('COUNT(*) as total_fases'),
        DB::raw('SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as fases_completadas')
      )
      ->groupBy('correccion_ordenes_id');

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
        'contador_fases.fases_completadas',
        DB::raw('DATEDIFF(CURRENT_DATE, fo.fecha_fase) as dias_transcurridos'),
        DB::raw('CASE 
                WHEN contador_fases.total_fases = 4 AND contador_fases.fases_completadas = 4 THEN "Completado"
                WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) <= 6 THEN "Ok"
                WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) = 7 THEN "Advertencia"
                WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) >= 8 THEN "Critico"
                ELSE "sin_status"
            END as status_primera_fase'),
        DB::raw('CASE 
            WHEN contador_fases.total_fases = 4 THEN 0
            WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) <= 6 THEN 1
            WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) = 7 THEN 2
            WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) >= 8 THEN 3
            ELSE 4
        END as status_weight')

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
        DB::raw('
          CASE 
              WHEN fo.status = 1 THEN 
                  CASE 
                      WHEN fo.tipo_fase_orden_id IS NULL THEN 
                          (SELECT tipo_fase_orden 
                           FROM tipos_fases_ordenes 
                           ORDER BY id ASC LIMIT 1)
                      WHEN fo.tipo_fase_orden_id = 4 THEN 
                          tfo.tipo_fase_orden  -- Mantiene el nombre original de la fase "4"
                      ELSE 
                          (SELECT tipo_fase_orden 
                           FROM tipos_fases_ordenes 
                           WHERE id = fo.tipo_fase_orden_id + 1 LIMIT 1)
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
      FROM fases_ordenes 
      WHERE ordenes_id = fo.ordenes_id
  )');

    $primeraFaseCorreccionQuery = DB::table('fases_correcciones_ordenes as fo')
      ->join('tipos_fases_ordenes as tfo', 'fo.tipo_fase_correccion_orden_id', '=', 'tfo.id')
      ->leftJoinSub($contadorFasesQueryCorrecciones, 'contador_fases', 'fo.correccion_ordenes_id', '=', 'contador_fases.correccion_ordenes_id')
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

    $ultimaFaseCorreccionQuery = DB::table('fases_correcciones_ordenes as fo')
      ->join('tipos_fases_ordenes as tfo', 'fo.tipo_fase_correccion_orden_id', '=', 'tfo.id')
      ->select(
        'fo.correccion_ordenes_id',
        DB::raw('
            CASE 
                WHEN fo.status = 1 THEN 
                    CASE 
                        WHEN fo.tipo_fase_correccion_orden_id IS NULL THEN 
                            (SELECT tipo_fase_orden FROM tipos_fases_ordenes ORDER BY id ASC LIMIT 1)
                        WHEN fo.tipo_fase_correccion_orden_id = 4 THEN 
                            tfo.tipo_fase_orden
                        ELSE 
                            (SELECT tipo_fase_orden FROM tipos_fases_ordenes WHERE id = fo.tipo_fase_correccion_orden_id + 1 LIMIT 1)
                    END
                ELSE 
                    tfo.tipo_fase_orden
            END as fase_actual'
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

    $ordenes = Ordenes::with([
      'paciente:id_paciente,nombres,celular,apellidos',
      'sucursal:id_sucursal,nombre',
      'correciones' => function ($query) use ($primeraFaseCorreccionQuery, $ultimaFaseCorreccionQuery) {
        $query->select(
          'correciones_ordenes.*',
          'usuarios.nombre as elaborado_por_nombre',
          'ordenes.nro_orden_id',
          'ordenes.lente_contacto',
          'sucursales.nombre as nombre_sucursal',
          'primeras_fases.laboratorio_primera_fase as laboratorio',
          'primeras_fases.observacion_primera_fase as observacion',
          'primeras_fases.fecha_primera_fase as fecha_fase',
          'primeras_fases.status_primera_fase as status',
          'primeras_fases.dias_transcurridos',
          'primeras_fases.total_fases',
          DB::raw("CASE WHEN ordenes.pagado = 1 THEN 'Sí' ELSE 'No' END AS pagado_nombre"),
          DB::raw('SUBSTRING_INDEX(correciones_ordenes.tipo_cristal_od, " | ", 1) as tipo_cristal_od_codigo'),
          DB::raw('SUBSTRING_INDEX(correciones_ordenes.tipo_cristal_oi, " | ", 1) as tipo_cristal_oi_codigo'),
          DB::raw('CASE WHEN ultimas_fases.fase_actual IS NULL THEN "Nuevo" ELSE ultimas_fases.fase_actual END as fase_actual'),
          DB::raw("CONCAT(
                ordenes.nro_orden_id, 
                '-C', 
                ROW_NUMBER() OVER (PARTITION BY correciones_ordenes.ordenes_id ORDER BY correciones_ordenes.created_at)
            ) as correcion_format")
        )
          ->join('ordenes', 'correciones_ordenes.ordenes_id', '=', 'ordenes.id_orden')
          ->join('sucursales', 'ordenes.id_sucursal', '=', 'sucursales.id_sucursal')
          ->join('usuarios', 'correciones_ordenes.elaborado_por', '=', 'usuarios.id_usuario')
          ->leftJoinSub($primeraFaseCorreccionQuery, 'primeras_fases', 'correciones_ordenes.id', '=', 'primeras_fases.correccion_ordenes_id')
          ->leftJoinSub($ultimaFaseCorreccionQuery, 'ultimas_fases', 'correciones_ordenes.id', '=', 'ultimas_fases.correccion_ordenes_id');
      }
    ])
      ->leftJoin('usuarios', 'ordenes.elaborado_por', '=', 'usuarios.id_usuario')
      ->leftJoinSub($primeraFaseQuery, 'primeras_fases', 'ordenes.id_orden', '=', 'primeras_fases.ordenes_id')
      ->leftJoinSub($ultimaFaseQuery, 'ultimas_fases', 'ordenes.id_orden', '=', 'ultimas_fases.ordenes_id')
      ->select(
        'ordenes.id_orden',
        'ordenes.nro_orden',
        'ordenes.id_paciente',
        'ordenes.id_sucursal',
        'ordenes.nro_orden_id',
        'ordenes.pagado',
        'ordenes.doctor',
        'ordenes.lente_contacto',
        'ordenes.tipo_cristal_od',
        'ordenes.tipo_cristal_oi',
        'primeras_fases.status_primera_fase as status',
        'usuarios.nombre as elaborado_por_nombre',
        DB::raw('SUBSTRING_INDEX(ordenes.tipo_cristal_od, " | ", 1) as tipo_cristal_od_codigo'),
        DB::raw('SUBSTRING_INDEX(ordenes.tipo_cristal_oi, " | ", 1) as tipo_cristal_oi_codigo'),
        DB::raw('COALESCE(primeras_fases.laboratorio_primera_fase, "") as laboratorio'),
        DB::raw('CASE WHEN ultimas_fases.fase_actual IS NULL THEN "Nuevo" ELSE ultimas_fases.fase_actual END as fase_actual'),
        DB::raw("CASE WHEN pagado = 1 THEN 'Sí' ELSE 'No' END AS pagado_nombre"),
        DB::raw("DATE_FORMAT(ordenes.created_at, '%d-%m-%Y') as created_at_formatted")
      );

    if (!empty($search)) {
      $ordenes->where(function ($query) use ($search) {
        $query->where('ordenes.id_orden', 'like', "%{$search}%")
          ->orWhere('usuarios.nombre', 'like', "%{$search}%")
          ->orWhere('ordenes.nro_orden_id', 'like', "%{$search}%")
          ->orWhere('ordenes.doctor', 'like', "%{$search}%")
          ->orWhere('ordenes.created_at', 'like', "%{$search}%")
          ->orWhere('ordenes.pagado', 'like', "%{$search}%")
          ->orWhere(DB::raw('SUBSTRING_INDEX(ordenes.tipo_cristal_od, " | ", 1)'), 'like', "%{$search}%")
          ->orWhere(DB::raw('SUBSTRING_INDEX(ordenes.tipo_cristal_oi, " | ", 1)'), 'like', "%{$search}%");
      });
    }
    if (!empty($fecha)) {
      $dates = explode(' - ', $fecha);
      if (count($dates) === 2) {
        $startDate = $dates[0];
        $endDate = $dates[1];
        $ordenes->whereBetween('ordenes.created_at', [$startDate, $endDate]);
      }
    }

    if ($status !== '') {
      // Validate status input
      $validStatuses = ['Ok', 'Advertencia', 'Critico', 'Completado', 'null'];

      if (in_array($status, $validStatuses)) {
        if ($status === 'null') {
          // When status is 'null', filter for orders without a status
          $ordenes->whereNull('primeras_fases.status_primera_fase');
        } else {
          // Filter for specific status
          $ordenes->where('primeras_fases.status_primera_fase', $status);
        }
      }
    }

    if (!empty($sucursales)) {
      $ordenes->where('ordenes.id_sucursal', $sucursales);
    }

    if (!empty($doctor)) {
      $ordenes->where('ordenes.doctor', $doctor);
    }

    if (!empty($asesor)) {
      $ordenes->where('usuarios.nombre', $asesor);
    }

    if ($laboratorio !== '') {
      // Validar valores permitidos para laboratorio
      $validLaboratorios = ['Ping', 'Optilab', 'Centilab', 'Vista Pro', 'Haseth J&J', 'Alcon', 'B+L'];

      if (in_array($laboratorio, $validLaboratorios)) {
        // Filtrar por laboratorio específico
        $ordenes->where('primeras_fases.laboratorio_primera_fase', $laboratorio);
      } elseif ($laboratorio === 'null') {
        // Filtrar por órdenes que no tienen laboratorio (NULL)
        $ordenes->whereNull('primeras_fases.laboratorio_primera_fase');
      }
    }

    if ($lenteContacto !== '') {
      // Convert to boolean for strict comparison
      $lenteContactoValue = filter_var($lenteContacto, FILTER_VALIDATE_BOOLEAN);

      if ($lenteContacto === '1' || $lenteContacto === true) {
        // Only show lente de contacto orders
        $ordenes->where('ordenes.lente_contacto', true);
      } elseif ($lenteContacto === '0' || $lenteContacto === false) {
        // Only show non-lente de contacto orders
        $ordenes->where('ordenes.lente_contacto', false);
      }
      // If empty string, show all orders (no filter applied)
    }

    if ($pagado !== '') {
      if ($pagado === '1') {
        $ordenes->where('ordenes.pagado', '1');
      } elseif ($pagado === '0') {
        $ordenes->where('ordenes.pagado', '0');
      } elseif ($pagado === '2') {
        $ordenes->where('ordenes.pagado', '2');
      }
    }

    $dataexport = $ordenes->orderBy($sortColumn, $sortOrder)->get();


    $paginatedData = $ordenes->orderBy($sortColumn, $sortOrder)
      ->paginate($limit, ['*'], 'page', $page);

    return response()->json([
      'data' => $paginatedData->items(),
      'meta' => [
        'page' => $paginatedData->currentPage(),
        'limit' => $paginatedData->perPage(),
        'total' => $paginatedData->total(),
      ],
      'export' => [
        'dataexport' => $dataexport
      ],
      'respuesta' => true,
      'status' => [
        'code' => 200,
        'message' => 'Órdenes retrieved successfully',
      ],
      'mensaje' => 'Órdenes obtenidas correctamente',
    ], 200);
  }

  public function ordenesDelPaciente(Request $request, $id_paciente)
  {
    // Validate that the patient ID is numeric and exists
    $pacienteExists = DB::table('pacientes')->where('id_paciente', $id_paciente)->exists();

    if (!$pacienteExists) {
      return response()->json([
        'respuesta' => false,
        'mensaje' => 'Paciente no encontrado',
        'status' => [
          'code' => 404,
          'message' => 'Patient not found'
        ]
      ], 404);
    }

    $limit = $request->input('limit', 10);
    $page = $request->input('page', 1);
    $sortColumn = $request->input('sortColumn', 'created_at');
    $sortOrder = $request->input('sortOrder', 'desc');
    $search = $request->input('search', '');

    // Validate sort column
    $validSortColumns = ['id_orden', 'created_at', 'nro_orden', 'nro_orden_id'];
    if (!in_array($sortColumn, $validSortColumns)) {
      $sortColumn = 'created_at';
    }

    $contadorFasesQuery = DB::table('fases_ordenes')
      ->select('ordenes_id', DB::raw('COUNT(*) as total_fases'))
      ->groupBy('ordenes_id');

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
        DB::raw('
                  CASE 
                      WHEN fo.tipo_fase_orden_id IS NULL THEN 
                          (SELECT tipo_fase_orden 
                           FROM tipos_fases_ordenes 
                           ORDER BY id ASC LIMIT 1)
                      WHEN fo.tipo_fase_orden_id = 4 THEN 
                          tfo.tipo_fase_orden
                      ELSE 
                          (SELECT tipo_fase_orden 
                           FROM tipos_fases_ordenes 
                           WHERE id = fo.tipo_fase_orden_id + 1 LIMIT 1)
                  END as fase_actual'),
        'fo.laboratorio as laboratorio_ultima_fase',
        'fo.fecha_fase as fecha_ultima_fase'
      )
      ->whereRaw('fo.id = (
              SELECT MAX(id) 
              FROM fases_ordenes 
              WHERE ordenes_id = fo.ordenes_id
          )');

    $ordenes = Ordenes::with([
      'paciente:id_paciente,nombres,celular,apellidos',
      'sucursal:id_sucursal,nombre,ubicacion_maps',
    ])
      ->join('usuarios', 'ordenes.elaborado_por', '=', 'usuarios.id_usuario')
      ->leftJoinSub($primeraFaseQuery, 'primeras_fases', 'ordenes.id_orden', '=', 'primeras_fases.ordenes_id')
      ->leftJoinSub($ultimaFaseQuery, 'ultimas_fases', 'ordenes.id_orden', '=', 'ultimas_fases.ordenes_id')
      ->where('ordenes.id_paciente', $id_paciente)
      ->select(
        'ordenes.*',
        'usuarios.nombre as elaborado_por_nombre',
        'primeras_fases.status_primera_fase as status',
        DB::raw('CASE WHEN ultimas_fases.fase_actual IS NULL THEN "Nuevo" ELSE ultimas_fases.fase_actual END as fase_actual'),
        DB::raw('COALESCE(ultimas_fases.laboratorio_ultima_fase, "") as laboratorio_ultima_fase'),
        DB::raw('COALESCE(ultimas_fases.fecha_ultima_fase, "") as fecha_ultima_fase')
      );

    // Aplicar búsqueda si se proporciona
    if (!empty($search)) {
      $ordenes->where(function ($query) use ($search) {
        $query->where('ordenes.id_orden', 'like', "%{$search}%")
          ->orWhere('ordenes.nro_orden', 'like', "%{$search}%")
          ->orWhere('ordenes.nro_orden_id', 'like', "%{$search}%")
          ->orWhere('usuarios.nombre', 'like', "%{$search}%")
          ->orWhere('ordenes.doctor', 'like', "%{$search}%")
          ->orWhere('ultimas_fases.fase_actual', 'like', "%{$search}%");

      });
    }

    $paginatedData = $ordenes->orderBy($sortColumn, $sortOrder)
      ->paginate($limit, ['*'], 'page', $page);

    return response()->json([
      'data' => $paginatedData->items(),
      'meta' => [
        'page' => $paginatedData->currentPage(),
        'limit' => $paginatedData->perPage(),
        'total' => $paginatedData->total(),
      ],
      'respuesta' => true,
      'status' => [
        'code' => 200,
        'message' => 'Patient orders retrieved successfully',
      ],
      'mensaje' => 'Órdenes del paciente obtenidas correctamente',
    ], 200);
  }

  public function verContactoOrden($id_orden)
  {

    $data = ContactoOrden::join('usuarios', 'usuarios.id_usuario', 'contactos_ordenes.usuario_id')
      ->select(
        'contactos_ordenes.*',
        'usuarios.nombre',
      )
      ->where('contactos_ordenes.ordenes_id', $id_orden)
      ->orderBy('contactos_ordenes.created_at', 'desc')
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

  public function verOrdenPdf($id_orden)
  {

    $orden = Ordenes::join('sucursales', 'sucursales.id_sucursal', 'ordenes.id_sucursal')
      ->join('pacientes', 'pacientes.id_paciente', 'ordenes.id_paciente')
      ->select(
        'ordenes.*',
        'sucursales.nombre',
        'pacientes.nombres',
        'pacientes.apellidos',
      )
      ->where('ordenes.id_orden', $id_orden)
      ->first();
    $data = [
      'fecha_solicitud' => $orden['created_at'],
      'nro_orden' => $orden['nro_orden_id'],
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

  public function migrarNroOrdenes()
  {
    try {
      DB::beginTransaction();

      // 1. Eliminar todos los registros de la tabla nro_ordenes
      DB::table('nro_ordenes')->delete();

      // 2. Insertar los valores únicos de nro_orden desde la tabla ordenes en nro_ordenes
      DB::table('nro_ordenes')->insertUsing(
        ['id'],
        DB::table('ordenes')->select('nro_orden')->distinct()
      );

      // 3. Actualizar el campo nro_orden_id en la tabla ordenes
      DB::table('ordenes')->update([
        'nro_orden_id' => DB::raw("(SELECT id FROM nro_ordenes WHERE nro_ordenes.id = ordenes.nro_orden)")
      ]);

      DB::commit();

      return response()->json([
        'message' => 'Migración completada exitosamente.'
      ], 200);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json([
        'message' => 'Error al migrar los nro_ordenes.',
        'error' => $e->getMessage()
      ], 500);
    }
  }

  public function getOrdenesConTotal()
  {
    $ordenes = Ordenes::all();
    $total = Ordenes::count();

    return response()->json([
      'respuesta' => true,
      'mensaje' => 'Órdenes obtenidas correctamente',
      'total' => $total,
      'data' => $ordenes
    ], 200);
  }



}

