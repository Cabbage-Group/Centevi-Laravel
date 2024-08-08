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
                'sucursal',
                'doctor',
                'paciente',
                'id_terapia',
                'edad',
                'fecha_atencion',
                'm_c',
                'a_o',
                'a_p',
                'a_f',
                'medicamentos',
                'tratamientos',
                'desarrollo',
                'nacimiento',
                'parto',
                'gateo',
                'lenguaje',
                'complicaciones',
                'perinatales',
                'postnatales',
                'agudeza_visual',
                'lensometria',
                'lensometria_extra',
                'sa_pp',
                'pruebas_extras',
                'refraccion',
                'conducta_seguir',
                'plan_versiones',
                'fecha_creacion',
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
        // Validaciones necesarias
        $request->validate([
            'sucursal' => 'required|integer|max:1000',
            'doctor' => 'required|string|max:1000',
            'paciente' => 'required|integer|max:10000',
            'id_terapia' => 'required|integer',
            'edad' => 'required|integer',
            'fecha_atencion' => 'required|date',
            // Añadir validaciones para los demás campos necesarios
        ]);

        try {
            // Preparar los datos para la creación
            $datos = $request->all();
            $datos['fecha_creacion'] = now(); // Establecer la fecha actual

            // Crear el registro
            $neonato = OptometriaNeonatos::create($datos);

            return response()->json([
                'success' => true,
                'message' => 'Neonato creado con éxito',
                'data' => $neonato,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los registros',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function EditarNeonatos(Request $request, $pacienteId, $consultaId)
    {

        // Buscar el registro de OrtopticaAdultos por el campo paciente y id_consulta
        $neonato = OptometriaNeonatos::where('paciente', $pacienteId)
            ->where('id_consulta', $consultaId)
            ->first();

        if (!$neonato) {
            return response()->json([
                'success' => false,
                'message' => 'Registro no encontrado',
            ], 404);
        }
        // Validar los datos de entrada
        $request->validate([
            'sucursal' => 'required|integer',
            'doctor' => 'required|string',
            'paciente' => 'required|integer',
            'id_terapia' => 'required|integer',
            'edad' => 'required|integer',
            'fecha_atencion' => 'required|date',

        // Añadir validaciones para los demás campos necesarios
        ]);

        // Actualizar los campos
        $neonato->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Neonato actualizado con éxito',
            'data' => $neonato,
        ], 200);
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

    public function mostrarOptometriaNeonatos(Request $request)
    {
        // Obtén los parámetros de la solicitud
        $item = $request->query('item');
        $item2 = $request->query('item2');
        $valor = $request->query('valor');
        $valor2 = $request->query('valor2');

        if ($item && $item2) {
            // Consulta con parámetros
            $result = OptometriaNeonatos::where($item, $valor)
                ->where($item2, $valor2)
                ->get(['id_consulta', 'fecha_creacion', 'doctor']);
        } else {
            // Consulta sin parámetros
            $result = OptometriaNeonatos::all();
        }
        return response()->json([
            'success' => true,
            'message' => 'Registro exitosamente',
            'dataON' => $result,
        ], 200);
    }

    public function VerOptometriaNeonatos($id, $id_consulta)
    {
        // Buscar el registro en la tabla OrtopticaAdultos por id_paciente y id_consulta
        $ortoptica = OptometriaNeonatos::where('paciente', $id)
            ->where('id_consulta', $id_consulta)
            ->first();

        // Verificar si el registro existe
        if (!$ortoptica) {
            return response()->json([
                'status' => [
                    'code' => 404,
                    'message' => 'Registro not found',
                ],
            ], 404);
        }

        // Formatear la respuesta
        return response()->json([
            'data' => $ortoptica,
            'status' => [
                'code' => 200,
                'message' => 'Registro retrieved successfully',
            ],
        ]);
    }

}
