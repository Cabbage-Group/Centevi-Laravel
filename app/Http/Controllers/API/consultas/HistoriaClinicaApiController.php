<?php

namespace App\Http\Controllers\API\consultas;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HistoriaClinica;
use Illuminate\Support\Facades\Validator;

class HistoriaClinicaApiController extends Controller
{
    // Crear HistoriaClinica
    public function CrearHistoriaClinica(Request $request)
    {
        $validator = Validator::make($request->all(), [
            // Validaciones necesarias
            'sucursal' => 'required|integer|max:255',
            'doctor' => 'required|string|max:255',
            'paciente' => 'required|integer|max:10000',
            'id_terapia' => 'required|integer',
            'edad' => 'required|integer',
            'fecha_atencion' => 'required|date',
            'm_c' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors(),
            ], 400);
        }

        $historiaClinica = HistoriaClinica::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Registro creado exitosamente',
            'data' => $historiaClinica,
        ], 201);
    }

    // Editar HistoriaClinica
    public function EditarHistoriaClinica(Request $request, $id)
    {
        $historiaClinica = HistoriaClinica::find($id);

        if (!$historiaClinica) {
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
            'm_c' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors(),
            ], 400);
        }

        $historiaClinica->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Registro actualizado exitosamente',
            'data' => $historiaClinica,
        ], 200);
    }

    // Eliminar HistoriaClinica
    public function DeleteHistoriaClinica($id)
    {
        $historiaClinica = HistoriaClinica::find($id);

        if (!$historiaClinica) {
            return response()->json([
                'success' => false,
                'message' => 'Registro no encontrado',
            ], 404);
        }

        $historiaClinica->delete();

        return response()->json([
            'success' => true,
            'message' => 'Registro eliminado exitosamente',
        ], 200);
    }

    public function mostrarHistoriaClinica(Request $request)
    {
        // Obtén los parámetros de la solicitud
        $item = $request->query('item');
        $item2 = $request->query('item2');
        $valor = $request->query('valor');
        $valor2 = $request->query('valor2');

        if ($item && $item2) {
            // Consulta con parámetros
            $result = HistoriaClinica::where($item, $valor)
                ->where($item2, $valor2)
                ->get(['id_consulta', 'fecha_atencion', 'doctor']);
            
        } else {
            // Consulta sin parámetros
            $result = HistoriaClinica::all();
        }
        return response()->json([
            'success' => true,
            'message' => 'Registro exitosamente',
            'dataHC' => $result,
        ], 200);
    }
}
