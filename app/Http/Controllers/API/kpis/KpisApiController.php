<?php

namespace App\Http\Controllers\API\Kpis;

use App\Http\Controllers\Controller;
use App\Models\BajaVision;
use App\Models\ConsultaGenerica;
use App\Models\Cristales;
use App\Models\HistoriaClinica;
use App\Models\OptometriaNeonatos;
use App\Models\OptometriaPediatrica;
use App\Models\Ordenes;
use App\Models\OrtopticaAdultos;
use App\Models\RefraccionGeneral;
use App\Models\Sucursales;
use App\Models\TerapiaBajaV;
use App\Models\TerapiaOptometriaNeonatos;
use App\Models\TerapiaOptometriaPediatrica;
use App\Models\TerapiaOrtopticaAdultos;
use App\Models\Usuarios;
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
                DB::raw(
                    '
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
                DB::raw(
                    '
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
                DB::raw(
                    '
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
                DB::raw(
                    '
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

    public function getConsultasPorFecha(Request $request)
    {
        // Obtener fechas o asignar valores predeterminados
        $startDate = $request->has('startDate') ? Carbon::parse($request->startDate)->startOfMonth() : null;
        $endDate = $request->has('endDate') ? Carbon::parse($request->endDate)->endOfMonth() : null;

        // Obtener todas las sucursales
        $sucursales = Sucursales::pluck('nombre', 'id_sucursal')->toArray();

        // Consulta para contar las consultas de BajaVision
        $bajaVisionQuery = BajaVision::selectRaw('DATE_FORMAT(fecha_creacion, "%Y-%m") as name, sucursal, COUNT(*) as total')
            ->groupBy('name', 'sucursal');

        $terapiaBajaVQuery = TerapiaBajaV::selectRaw('DATE_FORMAT(fecha_creacion, "%Y-%m") as name, sucursal, COUNT(*) as total')
            ->groupBy('name', 'sucursal');

        $terapiaOptometriaNeonatosVQuery = TerapiaOptometriaNeonatos::selectRaw('DATE_FORMAT(fecha_creacion, "%Y-%m") as name, sucursal, COUNT(*) as total')
            ->groupBy('name', 'sucursal');

        $terapiaOptometriaPediatricaQuery = TerapiaOptometriaPediatrica::selectRaw('DATE_FORMAT(fecha_creacion, "%Y-%m") as name, sucursal, COUNT(*) as total')
            ->groupBy('name', 'sucursal');

        $terapiaOrtopticaAdultosQuery = TerapiaOrtopticaAdultos::selectRaw('DATE_FORMAT(fecha_creacion, "%Y-%m") as name, sucursal, COUNT(*) as total')
            ->groupBy('name', 'sucursal');

        // Consulta para contar las consultas de ConsultaGenerica
        $consultaGenericaQuery = ConsultaGenerica::selectRaw('DATE_FORMAT(fecha_creacion, "%Y-%m") as name, sucursal, COUNT(*) as total')
            ->groupBy('name', 'sucursal');

        // Consulta para contar las consultas de HistoriaClinica
        $historiaClinicaQuery = HistoriaClinica::selectRaw('DATE_FORMAT(fecha_atencion, "%Y-%m") as name, sucursal, COUNT(*) as total')
            ->groupBy('name', 'sucursal');

        // Consulta para contar las consultas de OptometriaNeonatos
        $optometriaNeonatosQuery = OptometriaNeonatos::selectRaw('DATE_FORMAT(fecha_creacion, "%Y-%m") as name, sucursal, COUNT(*) as total')
            ->groupBy('name', 'sucursal');

        $refraccionGeneralQuery = RefraccionGeneral::selectRaw('DATE_FORMAT(fecha_creacion, "%Y-%m") as name, sucursal, COUNT(*) as total')
            ->groupBy('name', 'sucursal');

        $ortopticaAdultosQuery = OrtopticaAdultos::selectRaw('DATE_FORMAT(fecha_creacion, "%Y-%m") as name, sucursal, COUNT(*) as total')
            ->groupBy('name', 'sucursal');

        $optometriaPediatricaQuery = OptometriaPediatrica::selectRaw('DATE_FORMAT(fecha_creacion, "%Y-%m") as name, sucursal, COUNT(*) as total')
            ->groupBy('name', 'sucursal');

        // Aplicar filtro por fecha solo si se enviaron
        if ($startDate && $endDate) {
            $bajaVisionQuery->whereBetween('fecha_creacion', [$startDate, $endDate]);
            $consultaGenericaQuery->whereBetween('fecha_creacion', [$startDate, $endDate]);
            $historiaClinicaQuery->whereBetween('fecha_atencion', [$startDate, $endDate]);
            $optometriaNeonatosQuery->whereBetween('fecha_creacion', [$startDate, $endDate]);
            $refraccionGeneralQuery->whereBetween('fecha_creacion', [$startDate, $endDate]);
            $ortopticaAdultosQuery->whereBetween('fecha_creacion', [$startDate, $endDate]);
            $optometriaPediatricaQuery->whereBetween('fecha_creacion', [$startDate, $endDate]);
            $terapiaBajaVQuery->whereBetween('fecha_creacion', [$startDate, $endDate]);
            $terapiaOptometriaNeonatosVQuery->whereBetween('fecha_creacion', [$startDate, $endDate]);
            $terapiaOptometriaPediatricaQuery->whereBetween('fecha_creacion', [$startDate, $endDate]);
            $terapiaOrtopticaAdultosQuery->whereBetween('fecha_creacion', [$startDate, $endDate]);
        }

        // Unir todas las consultas usando UNION ALL
        $unionQuery = DB::table(DB::raw("({$bajaVisionQuery->toSql()}) as baja"))
            ->mergeBindings($bajaVisionQuery->getQuery())
            ->unionAll(
                DB::table(DB::raw("({$consultaGenericaQuery->toSql()}) as generica"))
                    ->mergeBindings($consultaGenericaQuery->getQuery())
            )
            ->unionAll(
                DB::table(DB::raw("({$historiaClinicaQuery->toSql()}) as historia"))
                    ->mergeBindings($historiaClinicaQuery->getQuery())
            )
            ->unionAll(
                DB::table(DB::raw("({$optometriaNeonatosQuery->toSql()}) as neonatos"))
                    ->mergeBindings($optometriaNeonatosQuery->getQuery())
            )
            ->unionAll(
                DB::table(DB::raw("({$refraccionGeneralQuery->toSql()}) as refraccion_general"))
                    ->mergeBindings($refraccionGeneralQuery->getQuery())
            )
            ->unionAll(
                DB::table(DB::raw("({$ortopticaAdultosQuery->toSql()}) as ortoptica_adultos"))
                    ->mergeBindings($ortopticaAdultosQuery->getQuery())
            )
            ->unionAll(
                DB::table(DB::raw("({$optometriaPediatricaQuery->toSql()}) as optometria_pediatrica"))
                    ->mergeBindings($optometriaPediatricaQuery->getQuery())
            )
            ->unionAll(
                DB::table(DB::raw("({$terapiaBajaVQuery->toSql()}) as terapia_baja"))
                    ->mergeBindings($terapiaBajaVQuery->getQuery())
            )
            ->unionAll(
                DB::table(DB::raw("({$terapiaOptometriaNeonatosVQuery->toSql()}) as terapia_optometria_neonatos"))
                    ->mergeBindings($terapiaBajaVQuery->getQuery())
            )
            ->unionAll(
                DB::table(DB::raw("({$terapiaOptometriaPediatricaQuery->toSql()}) as terapia_optometria_pediatrica"))
                    ->mergeBindings($terapiaBajaVQuery->getQuery())
            )
            ->unionAll(
                DB::table(DB::raw("({$terapiaOrtopticaAdultosQuery->toSql()}) as terapia_ortoptica_adultos"))
                    ->mergeBindings($terapiaBajaVQuery->getQuery())
            );;

        // Agrupar y sumar las consultas de todas las tablas
        $consultas = DB::table(DB::raw("({$unionQuery->toSql()}) as all_consultas"))
            ->mergeBindings($unionQuery)
            ->selectRaw('name, sucursal, SUM(total) as total')
            ->groupBy('name', 'sucursal')
            ->orderBy('name', 'asc')
            ->get();

        // Organizar datos en el formato requerido
        $result = [];
        $groupedData = $consultas->groupBy('name');

        foreach ($groupedData as $date => $entries) {
            $dataItem = ['name' => $date];

            // Inicializar sucursales en 0
            foreach ($sucursales as $sucursal) {
                $dataItem[$sucursal] = 0;
            }

            // Asignar los valores obtenidos de la consulta
            foreach ($entries as $entry) {
                if (isset($sucursales[$entry->sucursal])) {
                    $dataItem[$sucursales[$entry->sucursal]] = (int) $entry->total;
                }
            }

            $result[] = $dataItem;
        }

        return response()->json(['data' => $result]);
    }

    public function getConsultasPorFechaDoctores(Request $request)
    {
        // Obtener fechas o asignar valores predeterminados
        $startDate = $request->has('startDate') ? Carbon::parse($request->startDate)->startOfMonth() : null;
        $endDate = $request->has('endDate') ? Carbon::parse($request->endDate)->endOfMonth() : null;

        // Obtener todos los doctores
        $doctores = Usuarios::where('perfil', 'doctor')->pluck('nombre', 'nombre')->toArray();

        // Consulta para contar las consultas de BajaVision
        $bajaVisionQuery = BajaVision::selectRaw('DATE_FORMAT(fecha_creacion, "%Y-%m") as name, doctor, COUNT(*) as total')
            ->groupBy('name', 'doctor');

        $terapiaBajaVQuery = TerapiaBajaV::selectRaw('DATE_FORMAT(fecha_creacion, "%Y-%m") as name, doctor, COUNT(*) as total')
            ->groupBy('name', 'doctor');

        $terapiaOptometriaNeonatosVQuery = TerapiaOptometriaNeonatos::selectRaw('DATE_FORMAT(fecha_creacion, "%Y-%m") as name, doctor, COUNT(*) as total')
            ->groupBy('name', 'doctor');

        $terapiaOptometriaPediatricaQuery = TerapiaOptometriaPediatrica::selectRaw('DATE_FORMAT(fecha_creacion, "%Y-%m") as name, doctor, COUNT(*) as total')
            ->groupBy('name', 'doctor');

        $terapiaOrtopticaAdultosQuery = TerapiaOrtopticaAdultos::selectRaw('DATE_FORMAT(fecha_creacion, "%Y-%m") as name, doctor, COUNT(*) as total')
            ->groupBy('name', 'doctor');

        // Consulta para contar las consultas de ConsultaGenerica
        $consultaGenericaQuery = ConsultaGenerica::selectRaw('DATE_FORMAT(fecha_creacion, "%Y-%m") as name, doctor, COUNT(*) as total')
            ->groupBy('name', 'doctor');

        // Consulta para contar las consultas de HistoriaClinica
        $historiaClinicaQuery = HistoriaClinica::selectRaw('DATE_FORMAT(fecha_atencion, "%Y-%m") as name, doctor, COUNT(*) as total')
            ->groupBy('name', 'doctor');

        // Consulta para contar las consultas de OptometriaNeonatos
        $optometriaNeonatosQuery = OptometriaNeonatos::selectRaw('DATE_FORMAT(fecha_creacion, "%Y-%m") as name, doctor, COUNT(*) as total')
            ->groupBy('name', 'doctor');

        $refraccionGeneralQuery = RefraccionGeneral::selectRaw('DATE_FORMAT(fecha_creacion, "%Y-%m") as name, doctor, COUNT(*) as total')
            ->groupBy('name', 'doctor');

        $ortopticaAdultosQuery = OrtopticaAdultos::selectRaw('DATE_FORMAT(fecha_creacion, "%Y-%m") as name, doctor, COUNT(*) as total')
            ->groupBy('name', 'doctor');

        $optometriaPediatricaQuery = OptometriaPediatrica::selectRaw('DATE_FORMAT(fecha_creacion, "%Y-%m") as name, doctor, COUNT(*) as total')
            ->groupBy('name', 'doctor');

        // Aplicar filtro por fecha solo si se enviaron
        if ($startDate && $endDate) {
            $bajaVisionQuery->whereBetween('fecha_creacion', [$startDate, $endDate]);
            $consultaGenericaQuery->whereBetween('fecha_creacion', [$startDate, $endDate]);
            $historiaClinicaQuery->whereBetween('fecha_atencion', [$startDate, $endDate]);
            $optometriaNeonatosQuery->whereBetween('fecha_creacion', [$startDate, $endDate]);
            $refraccionGeneralQuery->whereBetween('fecha_creacion', [$startDate, $endDate]);
            $ortopticaAdultosQuery->whereBetween('fecha_creacion', [$startDate, $endDate]);
            $optometriaPediatricaQuery->whereBetween('fecha_creacion', [$startDate, $endDate]);
            $terapiaBajaVQuery->whereBetween('fecha_creacion', [$startDate, $endDate]);
            $terapiaOptometriaNeonatosVQuery->whereBetween('fecha_creacion', [$startDate, $endDate]);
            $terapiaOptometriaPediatricaQuery->whereBetween('fecha_creacion', [$startDate, $endDate]);
            $terapiaOrtopticaAdultosQuery->whereBetween('fecha_creacion', [$startDate, $endDate]);
        }

        // Unir todas las consultas usando UNION ALL
        $unionQuery = DB::table(DB::raw("({$bajaVisionQuery->toSql()}) as baja"))
            ->mergeBindings($bajaVisionQuery->getQuery())
            ->unionAll(
                DB::table(DB::raw("({$consultaGenericaQuery->toSql()}) as generica"))
                    ->mergeBindings($consultaGenericaQuery->getQuery())
            )
            ->unionAll(
                DB::table(DB::raw("({$historiaClinicaQuery->toSql()}) as historia"))
                    ->mergeBindings($historiaClinicaQuery->getQuery())
            )
            ->unionAll(
                DB::table(DB::raw("({$optometriaNeonatosQuery->toSql()}) as neonatos"))
                    ->mergeBindings($optometriaNeonatosQuery->getQuery())
            )
            ->unionAll(
                DB::table(DB::raw("({$refraccionGeneralQuery->toSql()}) as refraccion_general"))
                    ->mergeBindings($refraccionGeneralQuery->getQuery())
            )
            ->unionAll(
                DB::table(DB::raw("({$ortopticaAdultosQuery->toSql()}) as ortoptica_adultos"))
                    ->mergeBindings($ortopticaAdultosQuery->getQuery())
            )
            ->unionAll(
                DB::table(DB::raw("({$optometriaPediatricaQuery->toSql()}) as optometria_pediatrica"))
                    ->mergeBindings($optometriaPediatricaQuery->getQuery())
            )
            ->unionAll(
                DB::table(DB::raw("({$terapiaBajaVQuery->toSql()}) as terapia_baja"))
                    ->mergeBindings($terapiaBajaVQuery->getQuery())
            )
            ->unionAll(
                DB::table(DB::raw("({$terapiaOptometriaNeonatosVQuery->toSql()}) as terapia_optometria_neonatos"))
                    ->mergeBindings($terapiaBajaVQuery->getQuery())
            )
            ->unionAll(
                DB::table(DB::raw("({$terapiaOptometriaPediatricaQuery->toSql()}) as terapia_optometria_pediatrica"))
                    ->mergeBindings($terapiaBajaVQuery->getQuery())
            )
            ->unionAll(
                DB::table(DB::raw("({$terapiaOrtopticaAdultosQuery->toSql()}) as terapia_ortoptica_adultos"))
                    ->mergeBindings($terapiaBajaVQuery->getQuery())
            );

        // Agrupar y sumar las consultas de todas las tablas, y ordenar por la fecha (name)
        $consultas = DB::table(DB::raw("({$unionQuery->toSql()}) as all_consultas"))
            ->mergeBindings($unionQuery)
            ->selectRaw('name, doctor, SUM(total) as total')
            ->groupBy('name', 'doctor')
            ->orderBy('name', 'asc') // Ordenar de menor a mayor fecha
            ->get();

        // Organizar datos en el formato requerido
        $result = [];
        $groupedData = $consultas->groupBy('name');

        foreach ($groupedData as $date => $entries) {
            $dataItem = ['name' => $date];

            // Inicializar doctores en 0
            foreach ($doctores as $doctor) {
                $dataItem[$doctor] = 0;
            }

            // Asignar los valores obtenidos de la consulta
            foreach ($entries as $entry) {
                if (isset($doctores[$entry->doctor])) {
                    $dataItem[$entry->doctor] = (int) $entry->total;
                }
            }

            $result[] = $dataItem;
        }

        return response()->json(['data' => $result]);
    }

    public function PromedioFasesOrdenes(Request $request)
    {
        $sortColumn = $request->input('sortColumn', 'created_at');
        $faseInicial = $request->input('faseInicial');
        $faseFinal = $request->input('faseFinal');
        $startDate = $request->input('startDate');  // Fecha inicial
        $endDate = $request->input('endDate');      // Fecha final
        $lenteContacto = $request->input('lente_contacto'); // Lente de contacto
    
        // Asegurar que se puede ordenar por created_at
        $validSortColumns = ['id_orden', 'created_at', 'nro_order_id'];
        if (!in_array($sortColumn, $validSortColumns)) {
            $sortColumn = 'id_orden'; // Valor por defecto
        }
    
        // Validar que las fases estén en el rango correcto
        $faseInicial = is_numeric($faseInicial) ? max(1, min(4, intval($faseInicial))) : null;
        $faseFinal = is_numeric($faseFinal) ? max(1, min(4, intval($faseFinal))) : null;
    
        // Subconsulta para obtener la fecha de la primera fase
        $primeraFaseQuery = DB::table('fases_ordenes as fo')
            ->select('fo.ordenes_id', 'fo.fecha_fase as fecha_primera_fase')
            ->whereRaw('fo.id = (
            SELECT MIN(id) 
            FROM fases_ordenes 
            WHERE ordenes_id = fo.ordenes_id
        )');
    
        // Subconsulta para obtener la fecha de la última fase con el número de fase
        $ultimaFaseQuery = DB::table('fases_ordenes as fo')
            ->join('tipos_fases_ordenes as tfo', 'fo.tipo_fase_orden_id', '=', 'tfo.id')
            ->select(
                'fo.ordenes_id',
                DB::raw(
                    '
                CASE 
                    WHEN fo.status = 1 THEN 
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
                        END
                    ELSE 
                        tfo.tipo_fase_orden
                END as fase_actual'
                ),
                DB::raw(
                    '
                CASE 
                    WHEN fo.status = 1 THEN 
                        CASE 
                            WHEN fo.tipo_fase_orden_id IS NULL THEN 1
                            WHEN fo.tipo_fase_orden_id = 4 THEN 4
                            ELSE fo.tipo_fase_orden_id + 1
                        END
                    ELSE fo.tipo_fase_orden_id
                END as fase_actual_numero'
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
        $ordenesQuery = Ordenes::leftJoinSub($primeraFaseQuery, 'primeras_fases', 'ordenes.id_orden', '=', 'primeras_fases.ordenes_id')
            ->leftJoinSub($ultimaFaseQuery, 'ultimas_fases', 'ordenes.id_orden', '=', 'ultimas_fases.ordenes_id')
            ->select(
                'ordenes.id_orden',
                'ordenes.created_at',
                'ordenes.nro_orden_id',
                'ordenes.lente_contacto',
                'ultimas_fases.fecha_ultima_fase',
                'ultimas_fases.fase_actual_numero',
                DB::raw("COALESCE(ultimas_fases.fase_actual, 'Nuevo') as fase_actual"),
                DB::raw("DATEDIFF(ultimas_fases.fecha_ultima_fase, ordenes.created_at) as tiempo_transcurrido")
            );
    
        // Aplicar filtro por rango de fases si se proporcionaron los parámetros
        if ($faseInicial !== null && $faseFinal !== null) {
            $ordenesQuery->where(function ($query) use ($faseInicial, $faseFinal) {
                $query->whereNull('ultimas_fases.fase_actual_numero')
                    ->where(function ($q) use ($faseInicial, $faseFinal) {
                        $q->where(DB::raw('1'), '>=', $faseInicial)
                            ->where(DB::raw('1'), '<=', $faseFinal);
                    })
                    ->orWhere(function ($q) use ($faseInicial, $faseFinal) {
                        $q->whereNotNull('ultimas_fases.fase_actual_numero')
                            ->where('ultimas_fases.fase_actual_numero', '>=', $faseInicial)
                            ->where('ultimas_fases.fase_actual_numero', '<=', $faseFinal);
                    });
            });
        }
    
        // Filtrar por fecha en el rango proporcionado (si existe)
        if ($startDate && $endDate) {
            $ordenesQuery->whereBetween('ordenes.created_at', [
                $startDate . ' 00:00:00',
                $endDate . ' 23:59:59'
            ]);
        }
    
        // Filtrar por lente de contacto si se proporcionó el parámetro
        if (!is_null($lenteContacto) && is_array($lenteContacto)) {
            if (!empty($lenteContacto)) {
                $ordenesQuery->whereIn('lente_contacto', $lenteContacto); // Filtrar si hay valores en el array
            }
            // Si $lenteContacto está vacío, no se aplica ningún filtro y devuelve todos los registros
        } elseif (!is_null($lenteContacto) && in_array($lenteContacto, [0, 1])) {
            $ordenesQuery->where('lente_contacto', $lenteContacto);
        }

    
        // Obtener los datos
        $ordenes = $ordenesQuery->get();
        $totalRegistros = $ordenes->count();
    
        // Calcular el tiempo promedio
        $totalTiempo = $ordenes->sum('tiempo_transcurrido');
        $promedioTiempo = $totalRegistros > 0 ? $totalTiempo / $totalRegistros : 0;
        $promedioTiempoDias = floor($promedioTiempo); // Días completos
        $restoHoras = ($promedioTiempo - $promedioTiempoDias) * 24; // Horas en decimal
        $promedioTiempoHoras = floor($restoHoras); // Horas completas
        $promedioTiempoMinutos = round(($restoHoras - $promedioTiempoHoras) * 60);
    
        return response()->json([
            'data' => $ordenes,
            'total' => $totalRegistros,
           'tiempo_promedio' => [
                'dias' => $promedioTiempoDias,
                'horas' => $promedioTiempoHoras,
                'minutos' => $promedioTiempoMinutos
            ],
            'fase_inicial' => $faseInicial,
            'fase_final' => $faseFinal,
            'respuesta' => true,
            'status' => [
                'code' => 200,
                'message' => 'Órdenes retrieved successfully',
            ],
            'mensaje' => 'Órdenes obtenidas correctamente',
        ], 200);
    }

    public function countCrystalTypes(Request $request)
{
    // Obtener parámetros de fecha si se envían
    $startDate = $request->input('startDate');
    $endDate = $request->input('endDate');

    // Consulta base sin filtro de fechas si no se envían
    $query = Ordenes::query();

    if ($startDate && $endDate) {
        $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    // Obtener todas las fechas en el rango especificado o sin filtro si no se enviaron fechas
    $fechas = $query->selectRaw('DATE(created_at) as fecha')
        ->distinct()
        ->orderBy('fecha', 'asc')
        ->pluck('fecha');

    // Obtener todos los códigos de cristales disponibles
    $codigosCristales = Cristales::pluck('codigo');

    // Inicializar total de órdenes
    $totalOrdenes = 0;

    // Construir el array de respuesta
    $data = [];

    foreach ($fechas as $fecha) {
        // Obtener las órdenes creadas en esa fecha o todas si no hay filtro de fechas
        $ordenesPorFecha = Ordenes::whereDate('created_at', $fecha)->get();

        // Inicializar estructura con los códigos en 0
        $conteoCristales = array_fill_keys($codigosCristales->toArray(), 0);

        // Contar cuántas órdenes hay por cada tipo de cristal
        foreach ($ordenesPorFecha as $orden) {
            if ($orden->codigo_cristal) {
                $conteoCristales[$orden->codigo_cristal] = ($conteoCristales[$orden->codigo_cristal] ?? 0) + 1;
                $totalOrdenes++; // Contabilizar la orden en el total general
            }
        }

        // Convertir la fecha al formato DD-MM-YY
        $formattedDate = \Carbon\Carbon::createFromFormat('Y-m-d', $fecha)->format('d-m-y');

        // Construir la estructura final para la fecha
        $data[] = array_merge(['name' => $formattedDate], $conteoCristales);
    }

    return response()->json([
        'data' => $data,
        'total' => $totalOrdenes
    ], 200);
}


    
    public function actualizarCristales()
{
    // Obtener todas las órdenes donde codigo_cristal sea NULL
    $ordenes = Ordenes::whereNull('codigo_cristal')->get();

    foreach ($ordenes as $orden) {
        // Extraer el código antes del "|" de tipo_cristal_od y tipo_cristal_oi
        $tipoCristalOD = $orden->tipo_cristal_od ? explode('|', $orden->tipo_cristal_od)[0] : null;
        $tipoCristalOI = $orden->tipo_cristal_oi ? explode('|', $orden->tipo_cristal_oi)[0] : null;

        // Buscar en cristales usando el código de tipo_cristal_od, si no encuentra, usa tipo_cristal_oi
        $cristal = Cristales::where('codigo', $tipoCristalOD)->first() ?? Cristales::where('codigo', $tipoCristalOI)->first();

        if ($cristal) {
            // Actualizar la orden con el código del cristal encontrado
            $orden->update(['codigo_cristal' => $cristal->codigo]);
        }
    }

    return response()->json(['message' => 'Órdenes actualizadas correctamente'], 200);
}

public function getOrdersGroupedByDate(Request $request)
{
    // Obtener los parámetros startDate y endDate del request, si existen
    $startDate = $request->input('startDate');
    $endDate = $request->input('endDate');

    // Crear la consulta base
    $query = Ordenes::select(
                DB::raw('DATE_FORMAT(created_at, "%d-%m-%y") as name'), 
                DB::raw('SUM(CASE WHEN lente_contacto = "Lente contacto" THEN 1 ELSE 0 END) as lente_contacto'),
                DB::raw('SUM(CASE WHEN lente_contacto = "Lente normal" THEN 0 ELSE 1 END) as lente_normal')
            )
            ->groupBy(DB::raw('DATE_FORMAT(created_at, "%d-%m-%y")'))
            ->orderBy(DB::raw('DATE_FORMAT(created_at, "%d-%m-%y")'));

    // Filtrar por rango de fechas si los parámetros están presentes
    if ($startDate) {
        $query->where('created_at', '>=', $startDate);
    }
    if ($endDate) {
        $query->where('created_at', '<=', $endDate);
    }

    // Ejecutar la consulta
    $orders = $query->get();

    // Formatear la respuesta
    $response = [
        'data' => $orders
    ];

    return response()->json($response);
}

    
    
    
}
