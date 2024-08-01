<?php

namespace App\Http\Controllers\API\consultas;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\OrtopticaAdultos;

class OrtopticaApiController extends Controller
{
    // Crear OrtopticaAdultos
    public function CrearOrtoptica(Request $request)
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

        $ortoptica = OrtopticaAdultos::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Registro creado exitosamente',
            'data' => $ortoptica,
        ], 201);
    }

    // Editar OrtopticaAdultos
    public function EditarOrtoptica(Request $request, $id)
    {
        $ortoptica = OrtopticaAdultos::find($id);

        if (!$ortoptica) {
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

        $ortoptica->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Registro actualizado exitosamente',
            'data' => $ortoptica,
        ], 200);
    }

    // Eliminar OrtopticaAdultos
    public function DeleteOrtoptica($id)
    {
        $ortoptica = OrtopticaAdultos::find($id);

        if (!$ortoptica) {
            return response()->json([
                'success' => false,
                'message' => 'Registro no encontrado',
            ], 404);
        }

        $ortoptica->delete();

        return response()->json([
            'success' => true,
            'message' => 'Registro eliminado exitosamente',
        ], 200);
    }

    public function mostrarOrtopticaAdultos(Request $request)
    {
        // Obtén los parámetros de la solicitud
        $item = $request->query('item');
        $item2 = $request->query('item2');
        $valor = $request->query('valor');
        $valor2 = $request->query('valor2');

        if ($item && $item2) {
            // Consulta con parámetros
            $result = OrtopticaAdultos::where($item, $valor)
                ->where($item2, $valor2)
                ->get(['id_consulta', 'fecha_creacion', 'doctor']);
        } else {
            // Consulta sin parámetros
            $result = OrtopticaAdultos::all();
        }
        return response()->json([
            'success' => true,
            'message' => 'Registro exitosamente',
            'dataOA' => $result,
        ], 200);
    }

}
