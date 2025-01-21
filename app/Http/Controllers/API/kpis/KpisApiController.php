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

  
}