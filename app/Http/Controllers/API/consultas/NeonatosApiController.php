<?php

namespace App\Http\Controllers\API\consultas;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OptometriaNeonatos;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class NeonatosApiController extends Controller
{
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
            // Convertir campos nulos en vacíos
            $datos = array_map(function ($value) {
                return $value === null ? '' : $value;
            }, $request->all());

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
                'message' => 'Error al crear el registro',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }


    public function EditarNeonatos(Request $request, $pacienteId, $consultaId)
    {
        // Buscar el registro de OptometriaNeonatos por el campo paciente y id_consulta
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

        // Obtener todos los datos de la solicitud
        $datos = $request->all();

        // Rellenar campos no enviados con un valor vacío o mantener el valor actual
        foreach ($neonato->getFillable() as $field) {
            if (!isset($datos[$field])) {
                $datos[$field] = $neonato->$field;  // Mantén el valor actual si no está en la solicitud
            }
        }

        // Actualizar los campos
        $neonato->update($datos);

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
        // Buscar el registro en la tabla neonato por id_paciente y id_consulta
        $neonato = OptometriaNeonatos::where('paciente', $id)
            ->where('id_consulta', $id_consulta)
            ->first();

        // Verificar si el registro existe
        if (!$neonato) {
            return response()->json([
                'status' => [
                    'code' => 404,
                    'message' => 'Registro not found',
                ],
            ], 404);
        }

        // Formatear la respuesta
        return response()->json([
            'data' => $neonato,
            'status' => [
                'code' => 200,
                'message' => 'Registro retrieved successfully',
            ],
        ]);
    }

    // Obtener los campos que pueden ser asignados en masa
    protected function getFillable()
    {
        return (new OptometriaNeonatos())->getFillable();
    }

}
