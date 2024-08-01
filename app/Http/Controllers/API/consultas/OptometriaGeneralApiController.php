<?php

namespace App\Http\Controllers\API\consultas;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RefraccionGeneral;
use Illuminate\Support\Facades\Validator;

class OptometriaGeneralApiController extends Controller
{
    // Crear RefraccionGeneral
    public function CrearRefraccionGeneral(Request $request)
    {
        $validator = Validator::make($request->all(), [
            // Validaciones necesarias
            'sucursal' => 'required|integer|max:255',
            'doctor' => 'required|string|max:255',
            'paciente' => 'required|integer|max:10000',
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

        $refraccionGeneral = RefraccionGeneral::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Registro creado exitosamente',
            'data' => $refraccionGeneral,
        ], 201);
    }

    // Editar RefraccionGeneral
    public function EditarRefraccionGeneral(Request $request, $id)
    {
        $refraccionGeneral = RefraccionGeneral::find($id);

        if (!$refraccionGeneral) {
            return response()->json([
                'success' => false,
                'message' => 'Registro no encontrado',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            // Validaciones necesarias
            'sucursal' => 'required|integer|max:255',
            'doctor' => 'required|string|max:255',
            'paciente' => 'required|integer|max:255',
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

        $refraccionGeneral->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Registro actualizado exitosamente',
            'data' => $refraccionGeneral,
        ], 200);
    }

    // Eliminar RefraccionGeneral
    public function DeleteRefraccionGeneral($id)
    {
        $refraccionGeneral = RefraccionGeneral::find($id);
        if (!$refraccionGeneral) {
            return response()->json([
                'success' => false,
                'message' => 'Registro no encontrado',
            ], 404);
        }
        $refraccionGeneral->delete();
        return response()->json([
            'success' => true,
            'message' => 'Registro eliminado exitosamente',
        ], 200);
    }

    // Mostrar RefraccionGeneral por id_paciente
    public function mostrarRefraccionGeneral(Request $request)
    {
        // Obtén los parámetros de la solicitud
        $item = $request->query('item');
        $item2 = $request->query('item2');
        $valor = $request->query('valor');
        $valor2 = $request->query('valor2');

        if ($item && $item2) {
            // Consulta con parámetros
            $result = RefraccionGeneral::where($item, $valor)
                ->where($item2, $valor2)
                ->get(['id_consulta', 'fecha_creacion', 'doctor']);
        } else {
            // Consulta sin parámetros
            $result = RefraccionGeneral::all();
        }
        return response()->json([
            'success' => true,
            'message' => 'Registro exitosamente',
            'dataRG' => $result,
        ], 200);
    }

}
