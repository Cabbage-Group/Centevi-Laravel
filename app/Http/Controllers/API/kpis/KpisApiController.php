<?php

namespace App\Http\Controllers\API\Kpis;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Http\Request;

class KpisApiController extends Controller
{
    public function VerKpis(Request $request)
{
    // Obtener los parámetros de ordenamiento
    $orderBy = $request->get('sortColumn', 'name'); // Campo para ordenar
    $orderDirection = $request->get('sortOrder', 'asc'); // Dirección (asc o desc)

    // Validar los parámetros de ordenamiento
    if (!in_array($orderDirection, ['asc', 'desc'])) {
        $orderDirection = 'asc';
    }

    // Procesar los filtros de fecha
    $startDate = $request->get('startDate', null); // Fecha de inicio
    $endDate = $request->get('endDate', null); // Fecha de fin

    // Establecer fechas predeterminadas si no se proporcionan
    $defaultStartDate = Carbon::now()->subDays(29)->startOfDay();
    $defaultEndDate = Carbon::now()->endOfDay();

    try {
        $startDate = $startDate 
            ? Carbon::createFromFormat('Y-m-d-H:i', $startDate) 
            : $defaultStartDate;
        $endDate = $endDate 
            ? Carbon::createFromFormat('Y-m-d-H:i', $endDate) 
            : $defaultEndDate;
    } catch (\Exception $e) {
        return response()->json(['error' => 'Invalid date format'], 400);
    }

    // Generar las fechas dentro del rango especificado
    $dates = collect();
    for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
        $dates->push($date->format('Y-m-d'));
    }

    // Obtener los nombres de las sucursales dinámicamente
    $sucursales = DB::table('sucursales')
        ->select('id_sucursal', 'nombre')
        ->get();

    // Construir dinámicamente los campos de las sucursales
    $selectQueries = [];
    foreach ($sucursales as $sucursal) {
        $selectQueries[] = DB::raw(
            "SUM(CASE WHEN id_sucursal = {$sucursal->id_sucursal} THEN 1 ELSE 0 END) as `{$sucursal->nombre}`"
        );
    }

    // Obtener los datos agrupados por fecha y sucursal dentro del rango especificado
    $result = DB::table('ordenes')
        ->select(
            DB::raw('DATE(created_at) as name'),
            ...$selectQueries
        )
        ->whereBetween(DB::raw('DATE(created_at)'), [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
        ->groupBy(DB::raw('DATE(created_at)'))
        ->get();

    // Crear un mapa de datos existentes por fecha
    $mappedData = $result->keyBy('name');

    // Combinar las fechas generadas con los datos de la consulta
    $data = $dates->map(function ($date) use ($sucursales, $mappedData) {
        $entry = [
            'name' => $date,
        ];

        foreach ($sucursales as $sucursal) {
            $entry[$sucursal->nombre] = isset($mappedData[$date]) ? (int)$mappedData[$date]->{$sucursal->nombre} : 0;
        }

        return $entry;
    });

    // Ordenar los datos según el parámetro recibido
    $sortedData = $data->sortBy([
        fn($a, $b) => $orderDirection === 'asc'
            ? $a[$orderBy] <=> $b[$orderBy]
            : $b[$orderBy] <=> $a[$orderBy]
    ]);

    // Retornar la respuesta en formato JSON
    return response()->json([
        'data' => $sortedData->values()
    ]);
}
}