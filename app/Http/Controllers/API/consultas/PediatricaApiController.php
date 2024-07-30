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
        $validator = Validator::make($request->all(), [
            // Aquí puedes agregar las reglas de validación para los campos
            'sucursal' => 'required|integer|max:255',
            'doctor' => 'required|string|max:255',
            'paciente' => 'required|integer|max:10000',
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

        $optometriaPediatrica = OptometriaPediatrica::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Registro creado exitosamente',
            'data' => $optometriaPediatrica,
        ], 201);
    }

    public function editarPediatrica(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            // Aquí puedes agregar las reglas de validación para los campos
            'sucursal' => 'sometimes|required|integer|max:255',
            'doctor' => 'sometimes|required|string|max:255',
            'paciente' => 'sometimes|required|integer|max:255',
            'id_terapia' => 'sometimes|required|integer',
            'edad' => 'sometimes|required|integer',
            'fecha_atencion' => 'sometimes|required|date',
            // Agrega las reglas para los demás campos...
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors(),
            ], 400);
        }

        $optometriaPediatrica = OptometriaPediatrica::find($id);

        if (!$optometriaPediatrica) {
            return response()->json([
                'success' => false,
                'message' => 'Registro no encontrado',
            ], 404);
        }

        $optometriaPediatrica->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Registro actualizado exitosamente',
            'data' => $optometriaPediatrica,
        ], 200);
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
}
