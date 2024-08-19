<?php

namespace App\Http\Controllers\API\consultas;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ConsultaGenerica;
use Illuminate\Support\Facades\Validator;

class ConsultaGenericaController extends Controller
{
    public function CrearConsultaGenerica(Request $request)
    {
        // Validaciones necesarias
        $validator = Validator::make($request->all(), [
            'sucursal' => 'required|integer|max:255',
            'doctor' => 'required|string|max:255',
            'paciente' => 'required|integer|max:10000',
            'id_terapia' => 'required|integer',
            'edad' => 'required|integer',
            'fecha_atencion' => 'required|date',
            'm_c' => 'required|string',
            // Otras validaciones aquí...
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors(),
            ], 400);
        }

        // Convertir campos nulos en vacíos
        $datos = array_map(function ($value) {
            return $value === null ? '' : $value;
        }, $request->all());

        $datos['fecha_creacion'] = now(); // Establecer la fecha actual

        // Crear el registro
        $consultaGenerica = ConsultaGenerica::create($datos);

        return response()->json([
            'success' => true,
            'message' => 'Registro creado exitosamente',
            'data' => $consultaGenerica,
        ], 201);
    }



    // Editar ConsultaGenerica
    public function EditarConsultaGenerica(Request $request, $pacienteId, $consultaId)
    {
        // Buscar el registro de ConsultaGenerica por el campo paciente y id_consulta
        $consultaGenerica = ConsultaGenerica::where('paciente', $pacienteId)
            ->where('id_consulta', $consultaId)
            ->first();

        if (!$consultaGenerica) {
            return response()->json([
                'success' => false,
                'message' => 'Registro no encontrado',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            // Validaciones necesarias
            'sucursal' => 'required|integer',
            'doctor' => 'required|string',
            'paciente' => 'required|integer',
            'id_terapia' => 'required|integer',
            'edad' => 'required|integer',
            'fecha_atencion' => 'required|date',
            // Otras validaciones aquí...
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors(),
            ], 400);
        }

        // Obtener todos los datos de la solicitud
        $datos = $request->all();

        // Rellenar campos no enviados con un valor vacío o mantener el valor actual
        foreach ($consultaGenerica->getFillable() as $field) {
            if (!isset($datos[$field])) {
                $datos[$field] = $consultaGenerica->$field;  // Si no está en la solicitud, mantén el valor actual
            }
        }

        // Actualizar el registro con los datos procesados
        $consultaGenerica->update($datos);

        return response()->json([
            'success' => true,
            'message' => 'Registro actualizado exitosamente',
            'data' => $consultaGenerica,
        ], 200);
    }


    // Eliminar consultaGenerica
    public function DeleteConsultaGenerica($id)
    {
        $ConsultaGenerica = ConsultaGenerica::find($id);

        if (!$ConsultaGenerica) {
            return response()->json([
                'success' => false,
                'message' => 'Registro no encontrado',
            ], 404);
        }
        $ConsultaGenerica->delete();
        return response()->json([
            'success' => true,
            'message' => 'Registro eliminado exitosamente',
        ], 200);
    }

    public function mostrarConsultaGenerica(Request $request)
    {
        // Obtén los parámetros de la solicitud
        $item = $request->query('item');
        $item2 = $request->query('item2');
        $valor = $request->query('valor');
        $valor2 = $request->query('valor2');

        if ($item && $item2) {
            // Consulta con parámetros
            $result = ConsultaGenerica::where($item, $valor)
                ->where($item2, $valor2)
                ->get(['id_consulta', 'fecha_creacion', 'doctor']);

        } else {
            // Consulta sin parámetros
            $result = ConsultaGenerica::all();
        }
        return response()->json([
            'success' => true,
            'message' => 'Registro exitosamente',
            'dataCG' => $result,
        ], 200);
    }
    public function VerConsultaGenerica($id, $id_consulta)
    {
        // Buscar el registro en la tabla OrtopticaAdultos por id_paciente y id_consulta
        $ortoptica = ConsultaGenerica::where('paciente', $id)
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
        return (new ConsultaGenerica())->getFillable();
    }

}
