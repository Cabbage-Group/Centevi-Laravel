<?php

namespace App\Http\Controllers\API\sucursales;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sucursales;

class SucursalesApiController extends Controller
{
    public function sucursales(Request $request)
    {
        // Obtener los parámetros
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 50);
        $sortOrder = $request->query('sortOrder', 'asc');
        $sortColumn = $request->query('sortColumn', 'id_sucursal');
        // return array(
        //     $page,
        //     $limit,
        //     $sortColumn,
        //     $sortOrder,
        // );

        // Validar los parámetros
        $request->validate([
            'page' => 'integer|min:1',
            'limit' => 'integer|min:1|max:100',
            'sortOrder' => 'in:asc,desc',
            'sortColumn' => 'string|in:nombre,ubicacion,fecha_creacion', // Ajusta según los campos que tengas
        ]);

        // Obtener los datos paginados
        $sucursales = Sucursales::orderBy($sortColumn, $sortOrder)
            ->paginate($limit, ['*'], 'page', $page);

        // Formatear la respuesta
        return response()->json([
            'data' => $sucursales->items(),
            'meta' => [
                'page' => $sucursales->currentPage(),
                'limit' => $sucursales->perPage(),
                'total' => $sucursales->total(),
            ],
            'status' => [
                'code' => 200,
                'message' => 'Sucursales retrieved successfully',
            ],
        ]);
    }
}
