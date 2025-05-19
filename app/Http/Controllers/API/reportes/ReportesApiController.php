<?php

namespace App\Http\Controllers\API\reportes;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Receta;

class ReportesApiController extends Controller
{
    public function reportes(Request $request)
    {
        // Obtener los parámetros
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 50);
        $sortOrder = $request->query('sortOrder', 'asc');
        $sortColumn = $request->query('sortColumn', 'id_receta'); // Cambiado a 'id_receta' según el modelo Receta

        // Validar los parámetros
        $request->validate([
            'page' => 'integer|min:1',
            'limit' => 'integer|min:1|max:100',
            'sortOrder' => 'in:asc,desc',
            'sortColumn' => 'string|in:id_receta,nro_receta,direccion,cedula,telefono,rx,tipo_lente,material,tratamientos,aro_propio,observacion,medidas,sucursal,doctor,fecha_creacion', // Ajustado según los campos de Receta
        ]);

        // Obtener los datos paginados
        $recetas = Receta::orderBy($sortColumn, $sortOrder)
            ->paginate($limit, ['*'], 'page', $page);

        // Formatear la respuesta
        return response()->json([
            'data' => $recetas->items(),
            'meta' => [
                'page' => $recetas->currentPage(),
                'limit' => $recetas->perPage(),
                'total' => $recetas->total(),
            ],
            'status' => [
                'code' => 200,
                'message' => 'Recetas retrieved successfully', // Actualizado el mensaje de éxito
            ],
        ]);
    }
}
