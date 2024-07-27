<?php

namespace App\Http\Controllers\API\consultas;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BajaVision;
use Illuminate\Support\Facades\Validator;

class BajaVisionApiController extends Controller
{
    // Crear BajaVision
    public function CrearBajaVision(Request $request)
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

        $bajaVision = BajaVision::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Registro creado exitosamente',
            'data' => $bajaVision,
        ], 201);
    }

    // Editar BajaVision
    public function EditarBajaVision(Request $request, $id)
    {
        $bajaVision = BajaVision::find($id);

        if (!$bajaVision) {
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

        $bajaVision->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Registro actualizado exitosamente',
            'data' => $bajaVision,
        ], 200);
    }

    // Eliminar BajaVision
    public function DeleteBajaVision($id)
    {
        $bajaVision = BajaVision::find($id);

        if (!$bajaVision) {
            return response()->json([
                'success' => false,
                'message' => 'Registro no encontrado',
            ], 404);
        }

        $bajaVision->delete();

        return response()->json([
            'success' => true,
            'message' => 'Registro eliminado exitosamente',
        ], 200);
    }
}
