<?php

namespace App\Http\Controllers\API\Kpis;

use App\Http\Controllers\Controller;
use App\Models\Ordenes;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Http\Request;

class KpisApiController extends Controller
{
  public function VerKpis(Request $request)
  {
    $orderBy = $request->get('sortColumn', 'name'); // Campo para ordenar
    $orderDirection = $request->get('sortOrder', 'asc'); // Dirección (asc o desc)

    if (!in_array($orderDirection, ['asc', 'desc'])) {
      $orderDirection = 'asc';
    }

    $startDate = $request->input('startDate', null);
    $endDate = $request->input('endDate', null);
    $lenteContacto = $request->input('lenteContacto', null);

    try {
      $startDate = $startDate ? Carbon::createFromFormat('Y-m-d-H:i', $startDate) : null;
      $endDate = $endDate ? Carbon::createFromFormat('Y-m-d-H:i', $endDate) : null;
    } catch (\Exception $e) {
      return response()->json(['error' => 'Invalid date format'], 400);
    }


    $sucursales = DB::table('sucursales')->select('id_sucursal', 'nombre')->get();


    $selectQueries = [];
    foreach ($sucursales as $sucursal) {
      $selectQueries[] = DB::raw("SUM(CASE WHEN id_sucursal = {$sucursal->id_sucursal} THEN 1 ELSE 0 END) as `{$sucursal->nombre}`");
    }

    $query = DB::table('ordenes')->select(
      DB::raw('DATE(created_at) as name'),
      ...$selectQueries
    )->groupBy(DB::raw('DATE(created_at)'));

    // Aplicar filtro de fecha solo si se proporcionan valores
    if ($startDate && $endDate) {
      $query->whereBetween(DB::raw('DATE(created_at)'), [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')]);
    }

    if (!is_null($lenteContacto) && is_array($lenteContacto)) {
      if (!empty($lenteContacto)) {
        $query->whereIn('lente_contacto', $lenteContacto); // Filtrar si hay valores en el array
      }
      // Si $lenteContacto está vacío, no se aplica ningún filtro y devuelve todos los registros
    } elseif (!is_null($lenteContacto) && in_array($lenteContacto, [0, 1])) {
      $query->where('lente_contacto', $lenteContacto);
    }


    $result = $query->get();

    $mappedData = $result->keyBy('name');

    $dates = $result->pluck('name');

    $data = $dates->map(function ($date) use ($sucursales, $mappedData) {
      $entry = ['name' => Carbon::parse($date)->format('d-m-y')]; // Formatear la fecha

      foreach ($sucursales as $sucursal) {
        $entry[$sucursal->nombre] = isset($mappedData[$date]) ? (int) $mappedData[$date]->{$sucursal->nombre} : 0;
      }

      return $entry;
    });

    $sortedData = $data->sortBy([
      fn($a, $b) => $orderDirection === 'asc' ? $a[$orderBy] <=> $b[$orderBy] : $b[$orderBy] <=> $a[$orderBy]
    ]);

    return response()->json(['data' => $sortedData->values()]);
  }

  public function VerKpisAsesores(Request $request)
  {
    $orderBy = $request->input('sortColumn', 'name'); // Campo para ordenar
    $orderDirection = $request->input('sortOrder', 'asc'); // Dirección (asc o desc)

    if (!in_array($orderDirection, ['asc', 'desc'])) {
      $orderDirection = 'asc';
    }

    $startDate = $request->input('startDate', null);
    $endDate = $request->input('endDate', null);
    $lenteContacto = $request->input('lenteContacto', null);

    try {
      $startDate = $startDate ? Carbon::createFromFormat('Y-m-d-H:i', $startDate) : null;
      $endDate = $endDate ? Carbon::createFromFormat('Y-m-d-H:i', $endDate) : null;
    } catch (\Exception $e) {
      return response()->json(['error' => 'Invalid date format'], 400);
    }

    $asesores = DB::table('usuarios')
      ->where('estado', 1)
      ->select('id_usuario', 'nombre')
      ->get();

    $selectQueries = [];
    foreach ($asesores as $asesor) {
      $selectQueries[] = DB::raw("SUM(CASE WHEN ordenes.elaborado_por = {$asesor->id_usuario} THEN 1 ELSE 0 END) as `{$asesor->nombre}`");
    }

    $query = DB::table('ordenes')
      ->join('usuarios', 'ordenes.elaborado_por', '=', 'usuarios.id_usuario')
      ->where('usuarios.estado', 1)
      ->select(
        DB::raw('DATE(ordenes.created_at) as name'),
        ...$selectQueries
      )
      ->groupBy(DB::raw('DATE(ordenes.created_at)'));

    // Aplicar filtro de fecha si se proporcionan valores
    if ($startDate && $endDate) {
      $query->whereBetween(DB::raw('DATE(ordenes.created_at)'), [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')]);
    }

    if (!is_null($lenteContacto) && is_array($lenteContacto)) {
      if (!empty($lenteContacto)) {
        $query->whereIn('lente_contacto', $lenteContacto); // Filtrar si hay valores en el array
      }
      // Si $lenteContacto está vacío, no se aplica ningún filtro y devuelve todos los registros
    } elseif (!is_null($lenteContacto) && in_array($lenteContacto, [0, 1])) {
      $query->where('lente_contacto', $lenteContacto);
    }

    $result = $query->get();

    // Asegurar que todos los asesores aparezcan, incluso si no tienen órdenes
    $mappedData = $result->keyBy('name');
    $dates = $result->pluck('name');

    $data = $dates->map(function ($date) use ($asesores, $mappedData) {
      $entry = ['name' => Carbon::parse($date)->format('d-m-y')]; // Formatear la fecha

      foreach ($asesores as $asesor) {
        $entry[$asesor->nombre] = isset($mappedData[$date]) ? (int) $mappedData[$date]->{$asesor->nombre} : 0;
      }

      return $entry;
    });

    // Agregar asesores que no tienen órdenes para que aparezcan en la lista con valores `0`
    if ($data->isEmpty()) {
      $data->push(['name' => now()->format('d-m-y')] + collect($asesores)->pluck('nombre')->flip()->map(fn() => 0)->toArray());
    }

    $sortedData = $data->sortBy([
      fn($a, $b) => $orderDirection === 'asc' ? $a[$orderBy] <=> $b[$orderBy] : $b[$orderBy] <=> $a[$orderBy]
    ]);

    return response()->json(['data' => $sortedData->values()]);
  }


  public function VerKpisDoctores(Request $request)
  {
    $orderBy = $request->input('sortColumn', 'name'); // Campo para ordenar
    $orderDirection = $request->input('sortOrder', 'asc'); // Dirección (asc o desc)

    if (!in_array($orderDirection, ['asc', 'desc'])) {
      $orderDirection = 'asc';
    }

    $startDate = $request->input('startDate', null);
    $endDate = $request->input('endDate', null);
    $lenteContacto = $request->input('lenteContacto', null);

    try {
      $startDate = $startDate ? Carbon::createFromFormat('Y-m-d-H:i', $startDate) : null;
      $endDate = $endDate ? Carbon::createFromFormat('Y-m-d-H:i', $endDate) : null;
    } catch (\Exception $e) {
      return response()->json(['error' => 'Invalid date format'], 400);
    }

    $doctores = DB::table('usuarios')
      ->where('perfil', 'doctor')
      ->where('estado', 1)
      ->select('id_usuario', 'nombre')
      ->get();

    $selectQueries = [];
    foreach ($doctores as $doctor) {
      $selectQueries[] = DB::raw("SUM(CASE WHEN ordenes.elaborado_por = {$doctor->id_usuario} THEN 1 ELSE 0 END) as `{$doctor->nombre}`");
    }

    // Construir la consulta con los doctores
    $query = DB::table('ordenes')
      ->join('usuarios', 'ordenes.elaborado_por', '=', 'usuarios.id_usuario')
      ->where('usuarios.perfil', 'doctor') // Filtrar solo doctores
      ->select(
        DB::raw('DATE(ordenes.created_at) as name'),
        ...$selectQueries
      )
      ->groupBy(DB::raw('DATE(ordenes.created_at)'));

    // Aplicar filtro de fecha solo si se proporcionan valores
    if ($startDate && $endDate) {
      $query->whereBetween(DB::raw('DATE(ordenes.created_at)'), [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')]);
    }

    if (!is_null($lenteContacto) && is_array($lenteContacto)) {
      if (!empty($lenteContacto)) {
        $query->whereIn('lente_contacto', $lenteContacto); // Filtrar si hay valores en el array
      }
      // Si $lenteContacto está vacío, no se aplica ningún filtro y devuelve todos los registros
    } elseif (!is_null($lenteContacto) && in_array($lenteContacto, [0, 1])) {
      $query->where('lente_contacto', $lenteContacto);
    }

    $result = $query->get();

    $mappedData = $result->keyBy('name');
    $dates = $result->pluck('name');

    $data = $dates->map(function ($date) use ($doctores, $mappedData) {
      $entry = ['name' => Carbon::parse($date)->format('d-m-y')]; // Formatear la fecha

      foreach ($doctores as $doctor) {
        $entry[$doctor->nombre] = isset($mappedData[$date]) ? (int) $mappedData[$date]->{$doctor->nombre} : 0;
      }

      return $entry;
    });

    $sortedData = $data->sortBy([
      fn($a, $b) => $orderDirection === 'asc' ? $a[$orderBy] <=> $b[$orderBy] : $b[$orderBy] <=> $a[$orderBy]
    ]);

    return response()->json(['data' => $sortedData->values()]);
  }

  public function getDoctorOrdersStats(Request $request)
  {
    $doctorId = $request->input('doctor', 'doctor_id');

    if (!$doctorId) {
      return response()->json(['error' => 'doctor_id is required'], 400);
    }

    // Contar órdenes creadas por el doctor
    $totalOrders = DB::table('ordenes')
      ->where('elaborado_por', $doctorId)
      ->count();

    // Contar correcciones asociadas a esas órdenes
    $totalCorrections = DB::table('correciones_ordenes')
      ->whereIn('ordenes_id', function ($query) use ($doctorId) {
        $query->select('id_orden')
          ->from('ordenes')
          ->where('elaborado_por', $doctorId);
      })
      ->count();

    // Formato de respuesta
    $data = [
      ['name' => 'Total Orders', 'value' => $totalOrders],
      ['name' => 'Total Corrections', 'value' => $totalCorrections],
    ];

    return response()->json(['data' => $data]);
  }

  public function getDoctorFases(Request $request)
  {
    $doctorId = $request->input('doctor', 'doctor_id');
    $sortColumn = $request->input('sortColumn', 'created_at');
    $sortOrder = $request->input('sortOrder', 'asc');

    $validSortColumns = ['id_orden', 'created_at', 'nro_order_id'];
    if (!in_array($sortColumn, $validSortColumns)) {
      $sortColumn = 'id_orden'; // Valor por defecto
    }

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

    $ordenesQuery = Ordenes::with([
      'paciente:id_paciente,nombres,celular,apellidos',
      'sucursal:id_sucursal,nombre,ubicacion,ubicacion_maps',
    ])
      ->leftJoin('usuarios', 'ordenes.elaborado_por', '=', 'usuarios.id_usuario')
      ->leftJoin('sucursales', 'ordenes.id_sucursal', '=', 'sucursales.id_sucursal')
      ->leftJoin('pacientes', 'ordenes.id_paciente', '=', 'pacientes.id_paciente')
      ->leftJoinSub($primeraFaseQuery, 'primeras_fases', 'ordenes.id_orden', '=', 'primeras_fases.ordenes_id')
      ->leftJoinSub($ultimaFaseQuery, 'ultimas_fases', 'ordenes.id_orden', '=', 'ultimas_fases.ordenes_id')
      ->where('ordenes.elaborado_por', $doctorId)
      ->select(
        'ordenes.*',
        'usuarios.nombre as elaborado_por_nombre',
        DB::raw("DATE_FORMAT(ordenes.created_at, '%d-%m-%Y') as created_at_formatted"),
        DB::raw('CASE WHEN ultimas_fases.fase_actual IS NULL THEN "Nuevo" ELSE ultimas_fases.fase_actual END as fase_actual')
      )
      ->orderBy($sortColumn, $sortOrder)
      ->get();

    // Contar las fases
    $fasesCount = $ordenesQuery->groupBy('fase_actual')->map(function ($items, $fase) {
      return [
        'name' => $fase,
        'value' => count($items)
      ];
    })->values();

    return response()->json([
      'data' => $fasesCount,
      'respuesta' => true,
      'status' => [
        'code' => 200,
        'message' => 'Órdenes retrieved successfully',
      ],
      'mensaje' => 'Órdenes obtenidas correctamente',
    ], 200);
  }

  public function getDoctorStatus(Request $request)
  {
    $doctorId = $request->input('doctor', 'doctor_id');
    $sortColumn = $request->input('sortColumn', 'created_at');
    $sortOrder = $request->input('sortOrder', 'asc');

    $validSortColumns = ['id_orden', 'created_at', 'nro_order_id'];
    if (!in_array($sortColumn, $validSortColumns)) {
      $sortColumn = 'id_orden'; // Valor por defecto
    }

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

    $ordenesQuery = Ordenes::with([
      'paciente:id_paciente,nombres,celular,apellidos',
      'sucursal:id_sucursal,nombre,ubicacion,ubicacion_maps',
    ])
      ->leftJoin('usuarios', 'ordenes.elaborado_por', '=', 'usuarios.id_usuario')
      ->leftJoin('sucursales', 'ordenes.id_sucursal', '=', 'sucursales.id_sucursal')
      ->leftJoin('pacientes', 'ordenes.id_paciente', '=', 'pacientes.id_paciente')
      ->leftJoinSub($primeraFaseQuery, 'primeras_fases', 'ordenes.id_orden', '=', 'primeras_fases.ordenes_id')
      ->leftJoinSub($ultimaFaseQuery, 'ultimas_fases', 'ordenes.id_orden', '=', 'ultimas_fases.ordenes_id')
      ->where('ordenes.elaborado_por', $doctorId)
      ->select(
        'ordenes.*',
        'usuarios.nombre as elaborado_por_nombre',
        DB::raw("COALESCE(primeras_fases.status_primera_fase, 'sin status') as status"),
        DB::raw("DATE_FORMAT(ordenes.created_at, '%d-%m-%Y') as created_at_formatted"),
        DB::raw('CASE WHEN ultimas_fases.fase_actual IS NULL THEN "Nuevo" ELSE ultimas_fases.fase_actual END as fase_actual')
      )
      ->orderBy($sortColumn, $sortOrder)
      ->get();

    // Contar las fases
    $statusCount = $ordenesQuery->groupBy('status')->map(function ($items, $status) {
      return [
        'name' => $status,
        'value' => count($items)
      ];
    })->values();


    return response()->json([
      'data' => $statusCount,
      'respuesta' => true,
      'status' => [
        'code' => 200,
        'message' => 'Órdenes retrieved successfully',
      ],
      'mensaje' => 'Órdenes obtenidas correctamente',
    ], 200);
  }

  public function getAsesoresOrdersStats(Request $request)
  {
    $doctorId = $request->input('usuario', 'usuario_id');

    if (!$doctorId) {
      return response()->json(['error' => 'usuario_id is required'], 400);
    }

    $totalOrders = DB::table('ordenes')
      ->where('elaborado_por', $doctorId)
      ->count();

    $totalCorrections = DB::table('correciones_ordenes')
      ->whereIn('ordenes_id', function ($query) use ($doctorId) {
        $query->select('id_orden')
          ->from('ordenes')
          ->where('elaborado_por', $doctorId);
      })
      ->count();

    // Formato de respuesta
    $data = [
      ['name' => 'Total Orders', 'value' => $totalOrders],
      ['name' => 'Total Corrections', 'value' => $totalCorrections],
    ];

    return response()->json(['data' => $data]);
  }

  public function getAsesoresFases(Request $request)
  {
    $usuarioId = $request->input('usuario', 'id_usuario');
    $sortColumn = $request->input('sortColumn', 'created_at');
    $sortOrder = $request->input('sortOrder', 'asc');

    $validSortColumns = ['id_orden', 'created_at', 'nro_order_id'];
    if (!in_array($sortColumn, $validSortColumns)) {
      $sortColumn = 'id_orden'; // Valor por defecto
    }

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

    $ordenesQuery = Ordenes::with([
      'paciente:id_paciente,nombres,celular,apellidos',
      'sucursal:id_sucursal,nombre,ubicacion,ubicacion_maps',
    ])
      ->leftJoin('usuarios', 'ordenes.elaborado_por', '=', 'usuarios.id_usuario')
      ->leftJoin('sucursales', 'ordenes.id_sucursal', '=', 'sucursales.id_sucursal')
      ->leftJoin('pacientes', 'ordenes.id_paciente', '=', 'pacientes.id_paciente')
      ->leftJoinSub($primeraFaseQuery, 'primeras_fases', 'ordenes.id_orden', '=', 'primeras_fases.ordenes_id')
      ->leftJoinSub($ultimaFaseQuery, 'ultimas_fases', 'ordenes.id_orden', '=', 'ultimas_fases.ordenes_id')
      ->where('ordenes.elaborado_por', $usuarioId)
      ->select(
        'ordenes.*',
        'usuarios.nombre as elaborado_por_nombre',
        DB::raw("DATE_FORMAT(ordenes.created_at, '%d-%m-%Y') as created_at_formatted"),
        DB::raw('CASE WHEN ultimas_fases.fase_actual IS NULL THEN "Nuevo" ELSE ultimas_fases.fase_actual END as fase_actual')
      )
      ->orderBy($sortColumn, $sortOrder)
      ->get();

    // Contar las fases
    $fasesCount = $ordenesQuery->groupBy('fase_actual')->map(function ($items, $fase) {
      return [
        'name' => $fase,
        'value' => count($items)
      ];
    })->values();

    return response()->json([
      'data' => $fasesCount,
      'respuesta' => true,
      'status' => [
        'code' => 200,
        'message' => 'Órdenes retrieved successfully',
      ],
      'mensaje' => 'Órdenes obtenidas correctamente',
    ], 200);
  }


  public function getAsesorStatus(Request $request)
  {
    $usuarioId = $request->input('usuario', 'id_usuario');
    $sortColumn = $request->input('sortColumn', 'created_at');
    $sortOrder = $request->input('sortOrder', 'asc');

    $validSortColumns = ['id_orden', 'created_at', 'nro_order_id'];
    if (!in_array($sortColumn, $validSortColumns)) {
      $sortColumn = 'id_orden'; // Valor por defecto
    }

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

    $ordenesQuery = Ordenes::with([
      'paciente:id_paciente,nombres,celular,apellidos',
      'sucursal:id_sucursal,nombre,ubicacion,ubicacion_maps',
    ])
      ->leftJoin('usuarios', 'ordenes.elaborado_por', '=', 'usuarios.id_usuario')
      ->leftJoin('sucursales', 'ordenes.id_sucursal', '=', 'sucursales.id_sucursal')
      ->leftJoin('pacientes', 'ordenes.id_paciente', '=', 'pacientes.id_paciente')
      ->leftJoinSub($primeraFaseQuery, 'primeras_fases', 'ordenes.id_orden', '=', 'primeras_fases.ordenes_id')
      ->leftJoinSub($ultimaFaseQuery, 'ultimas_fases', 'ordenes.id_orden', '=', 'ultimas_fases.ordenes_id')
      ->where('ordenes.elaborado_por', $usuarioId)
      ->select(
        'ordenes.*',
        'usuarios.nombre as elaborado_por_nombre',
        DB::raw("COALESCE(primeras_fases.status_primera_fase, 'sin status') as status"),
        DB::raw("DATE_FORMAT(ordenes.created_at, '%d-%m-%Y') as created_at_formatted"),
        DB::raw('CASE WHEN ultimas_fases.fase_actual IS NULL THEN "Nuevo" ELSE ultimas_fases.fase_actual END as fase_actual')
      )
      ->orderBy($sortColumn, $sortOrder)
      ->get();

    // Contar las fases
    $statusCount = $ordenesQuery->groupBy('status')->map(function ($items, $status) {
      return [
        'name' => $status,
        'value' => count($items)
      ];
    })->values();


    return response()->json([
      'data' => $statusCount,
      'respuesta' => true,
      'status' => [
        'code' => 200,
        'message' => 'Órdenes retrieved successfully',
      ],
      'mensaje' => 'Órdenes obtenidas correctamente',
    ], 200);
  }



}