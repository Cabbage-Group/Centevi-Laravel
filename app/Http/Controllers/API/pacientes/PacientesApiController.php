<?php

namespace App\Http\Controllers\API\pacientes;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pacientes;

class PacientesApiController extends Controller
{
    public function pacientes(Request $request)
    {
        // Obtener los parámetros
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 50);
        $sortOrder = $request->query('sortOrder', 'asc');
        $sortColumn = $request->query('sortColumn', 'id_paciente');

        // Validar los parámetros
        $request->validate([
            'page' => 'integer|min:1',
            'limit' => 'integer|min:1|max:100',
            'sortOrder' => 'in:asc,desc',
            'sortColumn' => 'string|in:sucursal,doctor,nombres,apellidos,nro_cedula,email,nro_seguro,fecha_nacimiento,genero,lugar_nacimiento,direccion,ocupacion,telefono,celular,medico,urgencia,menor,fecha_creacion', // Ajusta según los campos que tengas
        ]);

        // Obtener los datos paginados
        $pacientes = Pacientes::orderBy($sortColumn, $sortOrder)
            ->paginate($limit, ['*'], 'page', $page);

        // Formatear la respuesta
        return response()->json([
            'data' => $pacientes->items(),
            'meta' => [
                'page' => $pacientes->currentPage(),
                'limit' => $pacientes->perPage(),
                'total' => $pacientes->total(),
            ],
            'status' => [
                'code' => 200,
                'message' => 'Pacientes retrieved successfully',
            ],
        ]);
    }
    
}
