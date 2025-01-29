<?php

namespace App\Http\Controllers\API\marcas;

use App\Http\Controllers\Controller;
use App\Models\Marcas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MarcasApiController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Obtener todos los tipos de usuarios
            $cristales = Marcas::all();

            return response()->json([
                'success' => true,
                'message' => 'Operación exitosa',
                'data' => $cristales,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener marcas',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function create(Request $request)
    {
     
        $validator = Validator::make($request->all(), [
            'codigo' => 'required|string|max:100',
            'nombre' => 'required|string|max:100',
            'lente_contacto' => 'nullable|boolean', 
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors(),
            ], 422);
        }
    
        try {
            $cristales = new Marcas();
            $cristales->codigo = $request->input('codigo');
            $cristales->nombre = $request->input('nombre');
            $cristales->lente_contacto = $request->input('lente_contacto', 0); // Asignar 0 si no se envía
            
            $cristales->save();
    
            return response()->json([
                'success' => true,
                'message' => 'Cristales creado exitosamente',
                'data' => $cristales,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el marca',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }
    

    public function update(Request $request, $id)
    {
        // Validar la solicitud
        $validator = Validator::make($request->all(), [
            'codigo' => 'required|string|max:100',
            'nombre' => 'required|string|max:100',
            'lente_contacto' => 'nullable|boolean', // Validación para que sea un valor booleano (1 o 0)
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors(),
            ], 422);
        }
    
        try {
            // Buscar la marca por ID
            $marca = Marcas::find($id);
    
            if (!$marca) {
                return response()->json([
                    'success' => false,
                    'message' => 'Marca no encontrada',
                ], 404);
            }
    
            // Actualizar los datos
            $marca->codigo = $request->input('codigo');
            $marca->nombre = $request->input('nombre');
    
            // Verificar si se proporcionó el campo lente_contacto y actualizarlo
            if ($request->has('lente_contacto')) {
                $marca->lente_contacto = $request->input('lente_contacto') ? 1 : 0; // Convertir a 1 o 0
            }
    
            $marca->save();
    
            return response()->json([
                'success' => true,
                'message' => 'Marca actualizada exitosamente',
                'data' => [
                    'id' => $marca->id,
                    'codigo' => $marca->codigo,
                    'nombre' => $marca->nombre,
                    'lente_contacto' => $marca->lente_contacto, // Retornar 1 o 0
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la marca',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }
    

    

    public function delete($id)
    {
        try {
            // Buscar el marca por ID
            $marca = Marcas::find($id);

            if (!$marca) {
                return response()->json([
                    'success' => false,
                    'message' => 'marca no encontrado',
                ], 404);
            }

            // Eliminar el marca
            $marca->delete();

            return response()->json([
                'success' => true,
                'message' => 'marca eliminado exitosamente',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la marca',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }
}
