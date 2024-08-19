<?php

namespace App\Http\Controllers\API\consultas;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BajaVision;
use Illuminate\Support\Facades\Validator;

class BajaVisionApiController extends Controller
{
    public function CrearBajaVision(Request $request)
    {
        // Validaciones necesarias
        $validator = Validator::make($request->all(), [
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
    
        // Obtener todos los campos de la solicitud
        $datos = $request->all();
    
        // Rellenar campos no enviados con un valor adecuado
        foreach ($this->getFillable() as $field) {
            if (!isset($datos[$field])) {
                if (in_array($field, ['sucursal', 'paciente', 'id_terapia', 'edad'])) {
                    $datos[$field] = null; // Usa null para campos enteros
                } else {
                    $datos[$field] = ''; // Usa string vacío para otros campos
                }
            }
        }
    
        $datos['fecha_creacion'] = now(); // Establecer la fecha actual
    
        // Crear el registro
        $bajaVision = BajaVision::create($datos);
    
        return response()->json([
            'success' => true,
            'message' => 'Registro creado exitosamente',
            'data' => $bajaVision,
        ], 201);
    }
    

    public function EditarBajaVision(Request $request, $pacienteId, $consultaId)
    {
        // Buscar el registro de BajaVision por el campo paciente y id_consulta
        $bajaVision = BajaVision::where('paciente', $pacienteId)
            ->where('id_consulta', $consultaId)
            ->first();
    
        if (!$bajaVision) {
            return response()->json([
                'success' => false,
                'message' => 'Registro no encontrado',
            ], 404);
        }
    
        // Validaciones necesarias
        $validator = Validator::make($request->all(), [
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
    
        // Obtener todos los datos de la solicitud
        $datos = $request->all();
    
        // Rellenar campos no enviados con un valor adecuado
        foreach ($bajaVision->getFillable() as $field) {
            if (!isset($datos[$field])) {
                if (in_array($field, ['editado', 'fecha_proxima_consulta', 'fecha_creacion'])) {
                    $datos[$field] = $bajaVision->$field; // Mantén el valor actual si no está en la solicitud
                } else {
                    $datos[$field] = $bajaVision->$field;
                }
            }
        }
    
        // Actualizar el registro con los datos procesados
        $bajaVision->update($datos);
    
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

    public function mostrarBajaVision(Request $request)
    {
        // Obtén los parámetros de la solicitud
        $item = $request->query('item');
        $item2 = $request->query('item2');
        $valor = $request->query('valor');
        $valor2 = $request->query('valor2');

        if ($item && $item2) {
            // Consulta con parámetros
            $result = BajaVision::where($item, $valor)
                ->where($item2, $valor2)
                ->get(['id_consulta', 'fecha_creacion', 'doctor']);
        } else {
            // Consulta sin parámetros
            $result = BajaVision::all();
        }

        return response()->json([
            'success' => true,
            'message' => 'Registro exitosamente',
            'dataBV' => $result,
        ], 200);
    }

    public function VerBajaVision($id, $id_consulta)
    {
        // Buscar el registro en la tabla OrtopticaAdultos por id_paciente y id_consulta
        $ortoptica = BajaVision::where('paciente', $id)
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
        return (new BajaVision())->getFillable();
    }

}


