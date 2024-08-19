<?php

namespace App\Http\Controllers\API\consultas;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OptometriaPediatrica;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
class PediatricaApiController extends Controller
{
    public function crearPediatrica(Request $request)
    {
        // Validaciones necesarias
        $validator = Validator::make($request->all(), [
            'sucursal' => 'required|integer',
            'doctor' => 'required|string',
            'paciente' => 'required|integer',
            'id_terapia' => 'required|integer',
            'edad' => 'required|integer',
            'fecha_atencion' => 'required|date',
            // Agrega las reglas para los demás campos...
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            // Convertir campos nulos en vacíos
            $datos = array_map(function ($value) {
                return $value === null ? '' : $value;
            }, $request->all());

            $datos['fecha_creacion'] = now(); // Establecer la fecha actual

            // Crear el registro
            $optometriaPediatrica = OptometriaPediatrica::create($datos);

            return response()->json([
                'success' => true,
                'message' => 'Registro creado exitosamente',
                'data' => $optometriaPediatrica,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el registro',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function editarPediatrica(Request $request, $pacienteId, $consultaId)
    {
        $optometriaPediatrica = OptometriaPediatrica::where('paciente', $pacienteId)
            ->where('id_consulta', $consultaId)
            ->first();

        if (!$optometriaPediatrica) {
            return response()->json([
                'success' => false,
                'message' => 'Registro no encontrado',
            ], 404);
        }

        // Validar los datos de entrada
        $validator = Validator::make($request->all(), [
            'sucursal' => 'required|integer',
            'doctor' => 'required|string',
            'paciente' => 'required|integer',
            'id_terapia' => 'required|integer',
            'edad' => 'required|integer',
            'fecha_atencion' => 'required|date',
            // Agrega las reglas para los demás campos...
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            // Obtener todos los datos de la solicitud
            $datos = $request->all();

            // Rellenar campos no enviados con un valor vacío o mantener el valor actual
            foreach ($optometriaPediatrica->getFillable() as $field) {
                if (!isset($datos[$field])) {
                    $datos[$field] = $optometriaPediatrica->$field;  // Mantén el valor actual si no está en la solicitud
                }
            }

            // Actualizar los campos
            $optometriaPediatrica->update($datos);

            return response()->json([
                'success' => true,
                'message' => 'Registro actualizado exitosamente',
                'data' => $optometriaPediatrica,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el registro',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function eliminarPediatrica($id)
    {
        $optometriaPediatrica = OptometriaPediatrica::find($id);

        if (!$optometriaPediatrica) {
            return response()->json([
                'success' => false,
                'message' => 'Registro no encontrado',
            ], 404);
        }

        $optometriaPediatrica->delete();

        return response()->json([
            'success' => true,
            'message' => 'Registro eliminado exitosamente',
        ], 200);
    }
    public function mostrarOptometriaPediatrica(Request $request)
    {
        // Obtén los parámetros de la solicitud
        $item = $request->query('item');
        $item2 = $request->query('item2');
        $valor = $request->query('valor');
        $valor2 = $request->query('valor2');

        if ($item && $item2) {
            // Consulta con parámetros
            $result = OptometriaPediatrica::where($item, $valor)
                ->where($item2, $valor2)
                ->get(['id_consulta', 'fecha_creacion', 'doctor']);
        } else {
            // Consulta sin parámetros
            $result = OptometriaPediatrica::all();
        }
        return response()->json([
            'success' => true,
            'message' => 'Registro exitosamente',
            'dataOP' => $result,
        ], 200);
    }

    public function VerOptometriaPediatrica($id, $id_consulta)
    {
        // Buscar el registro en la tabla OrtopticaAdultos por id_paciente y id_consulta
        $ortoptica = OptometriaPediatrica::where('paciente', $id)
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

    // Obtener los campos que pueden ser asignados en masa
    protected function getFillable()
    {
        return (new OptometriaPediatrica())->getFillable();
    }
}
