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
    
        // Preparar los datos para la creación
        $datos = $request->all();
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
        public function EditarConsultaGenerica(Request $request, $id)
        {
            $ConsultaGenerica = ConsultaGenerica::find($id);
    
            if (!$ConsultaGenerica) {
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
            $ConsultaGenerica->update($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Registro actualizado exitosamente',
                'data' => $ConsultaGenerica,
            ], 200);
        }

        // Eliminar ConsultaGenerica
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
}
