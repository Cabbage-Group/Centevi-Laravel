<?php

namespace App\Http\Controllers\API\reportes;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReporteOrdenesFinancierasController extends Controller
{
  // pagado: 1 = Pagado, 2 = Abonado, otro = Cortesía (mismo criterio que TableOrdenesCorrecciones)
  private const ESTADO_FINANCIERO_SQL = "CASE
      WHEN ordenes.pagado = 1 THEN 'Pagado'
      WHEN ordenes.pagado = 2 THEN 'Abonado'
      ELSE 'Cortesía'
    END";

  public function index(Request $request)
  {
    $request->validate([
      'desde' => 'nullable|date',
      'hasta' => 'nullable|date',
      'sucursal' => 'nullable|string',
      'fase' => 'nullable|string|max:100',
      'estado_financiero' => 'nullable|in:0,1,2',
      'search' => 'nullable|string|max:255',
      'page' => 'nullable|integer|min:1',
      'limit' => 'nullable|integer|min:1|max:100',
      'export' => 'nullable|boolean',
    ]);

    $query = $this->baseQuery($request);

    $totales = (clone $query)
      ->select(DB::raw('
        COALESCE(SUM(t.total_cotizacion), 0) as total_cotizaciones,
        COALESCE(SUM(t.total_aplicado), 0) as total_aplicado,
        COALESCE(SUM(t.saldo_por_cobrar), 0) as saldo_por_cobrar,
        COUNT(*) as total_ordenes
      '))
      ->first();

    $resumen = [
      'total_cotizaciones' => round((float) $totales->total_cotizaciones, 2),
      'total_aplicado' => round((float) $totales->total_aplicado, 2),
      'saldo_por_cobrar' => round((float) $totales->saldo_por_cobrar, 2),
      'total_ordenes' => (int) $totales->total_ordenes,
    ];

    // Exportación: devuelve todo lo filtrado (con tope de seguridad)
    if ($request->boolean('export')) {
      return response()->json([
        'data' => $query->orderByDesc('t.fecha_orden')->limit(10000)->get(),
        'resumen' => $resumen,
      ]);
    }

    $limit = (int) $request->query('limit', 15);
    $page = (int) $request->query('page', 1);

    $paginated = $query->orderByDesc('t.fecha_orden')->paginate($limit, ['*'], 'page', $page);

    return response()->json([
      'data' => $paginated->items(),
      'meta' => [
        'page' => $paginated->currentPage(),
        'limit' => $paginated->perPage(),
        'total' => $paginated->total(),
        'last_page' => $paginated->lastPage(),
      ],
      'resumen' => $resumen,
    ]);
  }

  public function opciones()
  {
    return response()->json([
      'sucursales' => DB::table('sucursales')->select('id_sucursal', 'nombre')->orderBy('nombre')->get(),
      'fases' => collect(['Nuevo'])
        ->merge(DB::table('tipos_fases_ordenes')->orderBy('id')->pluck('tipo_fase_orden'))
        ->unique()
        ->values(),
    ]);
  }

  private function baseQuery(Request $request)
  {
    $ultimaFase = DB::table('fases_ordenes as fo')
      ->join('tipos_fases_ordenes as tfo', 'fo.tipo_fase_orden_id', '=', 'tfo.id')
      ->select(
        'fo.ordenes_id',
        DB::raw("
          CASE
            WHEN fo.status = 1 THEN
              CASE
                WHEN fo.tipo_fase_orden_id = 4 THEN tfo.tipo_fase_orden
                ELSE (SELECT tipo_fase_orden FROM tipos_fases_ordenes WHERE id = fo.tipo_fase_orden_id + 1 LIMIT 1)
              END
            ELSE tfo.tipo_fase_orden
          END as fase_actual
        ")
      )
      ->whereRaw('fo.id = (SELECT MAX(id) FROM fases_ordenes WHERE ordenes_id = fo.ordenes_id)');

    $aplicados = DB::table('orden_anticipos')
      ->select('id_orden', DB::raw('SUM(monto_aplicado) as total_aplicado'))
      ->groupBy('id_orden');

    $filas = DB::table('ordenes')
      ->leftJoin('pacientes', 'ordenes.id_paciente', '=', 'pacientes.id_paciente')
      ->leftJoin('sucursales', 'ordenes.id_sucursal', '=', 'sucursales.id_sucursal')
      ->leftJoinSub($ultimaFase, 'uf', 'ordenes.id_orden', '=', 'uf.ordenes_id')
      ->leftJoinSub($aplicados, 'ap', 'ordenes.id_orden', '=', 'ap.id_orden')
      ->select(
        'ordenes.id_orden',
        'ordenes.nro_orden_id',
        'ordenes.id_paciente',
        'ordenes.pagado',
        'ordenes.nro_cotizacion',
        'ordenes.created_at as fecha_orden',
        'ordenes.id_sucursal',
        'sucursales.nombre as sucursal',
        'pacientes.nro_cedula',
        DB::raw("TRIM(CONCAT(COALESCE(pacientes.nombres, ''), ' ', COALESCE(pacientes.apellidos, ''))) as paciente"),
        DB::raw("COALESCE(uf.fase_actual, 'Nuevo') as fase_actual"),
        DB::raw(self::ESTADO_FINANCIERO_SQL . ' as estado_financiero'),
        DB::raw('CAST(COALESCE(ordenes.cotizacion_total, 0) AS DECIMAL(12,2)) as total_cotizacion'),
        DB::raw('CAST(COALESCE(ap.total_aplicado, 0) AS DECIMAL(12,2)) as total_aplicado'),
        DB::raw('CASE
          WHEN ordenes.cotizacion_total IS NULL THEN NULL
          ELSE ROUND(ordenes.cotizacion_total - COALESCE(ap.total_aplicado, 0), 2)
        END as saldo_por_cobrar')
      );

    if ($request->filled('desde')) {
      $filas->whereDate('ordenes.created_at', '>=', $request->query('desde'));
    }

    if ($request->filled('hasta')) {
      $filas->whereDate('ordenes.created_at', '<=', $request->query('hasta'));
    }

    $sucursal = $request->query('sucursal');
    if (!empty($sucursal) && $sucursal !== 'todas') {
      $filas->where('ordenes.id_sucursal', $sucursal);
    }

    if ($request->filled('fase')) {
      $filas->whereRaw("COALESCE(uf.fase_actual, 'Nuevo') = ?", [$request->query('fase')]);
    }

    if ($request->filled('estado_financiero')) {
      $estado = (int) $request->query('estado_financiero');
      if ($estado === 0) {
        $filas->where(fn($q) => $q->whereNull('ordenes.pagado')->orWhereNotIn('ordenes.pagado', [1, 2]));
      } else {
        $filas->where('ordenes.pagado', $estado);
      }
    }

    if ($request->filled('search')) {
      $search = '%' . trim($request->query('search')) . '%';
      $filas->where(function ($q) use ($search) {
        $q->where('ordenes.nro_orden_id', 'like', $search)
          ->orWhere('ordenes.id_orden', 'like', $search)
          ->orWhere('ordenes.nro_cotizacion', 'like', $search)
          ->orWhere('pacientes.nro_cedula', 'like', $search)
          ->orWhereRaw("CONCAT(COALESCE(pacientes.nombres, ''), ' ', COALESCE(pacientes.apellidos, '')) LIKE ?", [$search]);
      });
    }

    // Se envuelve en subconsulta para poder sumar/ordenar por los alias calculados
    return DB::query()->fromSub($filas, 't')->select('t.*');
  }
}
