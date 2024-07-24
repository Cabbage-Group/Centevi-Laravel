<?php

namespace App\Http\Controllers\API\consultas;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OptometriaNeonatos;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class NeonatosApiController extends Controller
{
    public function ObtenerNeonatos(Request $request)
    {
        // Validar los parámetros de entrada
        $validator = Validator::make($request->all(), [
            'page' => 'integer|min:1',
            'limit' => 'integer|min:1|max:100',
            'sortOrder' => Rule::in(['asc', 'desc']),
            'sortColumn' => Rule::in([
                'sucursal', 'doctor', 'paciente', 'id_terapia', 'edad', 
                'fecha_atencion', 'm_c', 'a_o', 'a_p', 'a_f', 'medicamentos', 
                'tratamientos', 'desarrollo', 'nacimiento', 'parto', 'gateo', 
                'lenguaje', 'complicaciones', 'perinatales', 'agudeza_visual', 
                'lensometria', 'lensometria_extra', 'sa_pp', 'pruebas_extras', 
                'refraccion', 'conducta_seguir', 'plan_versiones', 'fecha_creacion', 
                'editado'
            ]),
            'filter' => 'string|max:255',
        ]);

        // Manejar errores de validación
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors(),
            ], 400);
        }

        // Obtener los parámetros validados con valores predeterminados
        $page = $request->input('page', 1);
        $limit = $request->input('limit', 10);
        $sortOrder = $request->input('sortOrder', 'asc');
        $sortColumn = $request->input('sortColumn', 'id_consulta');
        $filter = $request->input('filter');

        try {
            $query = OptometriaNeonatos::query();

            // Aplicar filtro si se proporciona
            if ($filter) {
                $query->where('paciente', 'LIKE', '%' . $filter . '%');
            }

            // Aplicar ordenamiento por columna y orden especificados
            $query->orderBy($sortColumn, $sortOrder);

            // Obtener datos paginados
            $neonatos = $query->paginate($limit, ['*'], 'page', $page);

            $meta = [
                'page' => $neonatos->currentPage(),
                'limit' => $neonatos->perPage(),
                'total' => $neonatos->total(),
                'sortOrder' => $sortOrder,
                'sortColumn' => $sortColumn,
            ];

            return response()->json([
                'success' => true,
                'message' => 'Operación exitosa',
                'data' => $neonatos->items(),
                'meta' => $meta,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los registros',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }


    public function CrearNeonatos(Request $request)
    {
        // Validar los datos de entrada
        $request->validate([
            'sucursal' => 'required|integer|max:255',
            'doctor' => 'required|string|max:255',
            'paciente' => 'required|integer|max:255',
            'id_terapia' => 'required|integer',
            'edad' => 'required|integer',
            'fecha_atencion' => 'required|date',
            // Añadir validaciones para los demás campos necesarios
        ]);

        // Crear un nuevo registro en la tabla optometria_neonatos
        $neonato = OptometriaNeonatos::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Neonato creado con éxito',
            'data' => $neonato,
        ]);
    }

    public function EditarNeonatos(Request $request, $id)
    {
        // Validar los datos de entrada
        $request->validate([
            'sucursal' => 'integer|max:255',
            'doctor' => 'string|max:255',
            'paciente' => 'integer|max:255',
            'id_terapia' => 'integer',
            'edad' => 'integer',
            'fecha_atencion' => 'date',
            
            // Añadir validaciones para los demás campos necesarios
        ]);

        // Buscar el registro por id
        $neonato = OptometriaNeonatos::find($id);

        if (!$neonato) {
            return response()->json([
                'success' => false,
                'message' => 'Neonato no encontrado',
            ], 404);
        }

        // Actualizar los campos
        $neonato->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Neonato actualizado con éxito',
            'data' => $neonato,
        ]);
    }

    public function DeleteNeonatos($id)
    {
        // Buscar el registro por id
        $neonato = OptometriaNeonatos::find($id);

        if (!$neonato) {
            return response()->json([
                'success' => false,
                'message' => 'Neonato no encontrado',
            ], 404);
        }

        // Eliminar el registro
        $neonato->delete();

        return response()->json([
            'success' => true,
            'message' => 'Neonato eliminado con éxito',
        ]);
    }

}
