<?php

namespace App\Http\Controllers\API\cristales;

use App\Http\Controllers\Controller;
use App\Models\Cristales;
use App\Models\Ordenes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class CristalesApiController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Obtener todos los tipos de usuarios
            $cristales = Cristales::all();

            return response()->json([
                'success' => true,
                'message' => 'Operación exitosa',
                'data' => $cristales,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener cristales',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function create(Request $request)
    {
        // Validar la solicitud
        $validator = Validator::make($request->all(), [
            'codigo' => 'required|string|max:100',
            'nombre' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $cristales = new Cristales();
            $cristales->codigo = $request->input('codigo');
            $cristales->nombre = $request->input('nombre');
            $cristales->save();

            return response()->json([
                'success' => true,
                'message' => 'cristales creado exitosamente',
                'data' => $cristales,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el cristal',
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
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Buscar el cristal por ID
            $cristal = Cristales::find($id);

            if (!$cristal) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cristal no encontrado',
                ], 404);
            }

            // Actualizar los datos
            $cristal->codigo = $request->input('codigo');
            $cristal->nombre = $request->input('nombre');
            $cristal->save();

            return response()->json([
                'success' => true,
                'message' => 'Cristal actualizado exitosamente',
                'data' => $cristal,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el cristal',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function delete($id)
    {
        try {
            // Buscar el cristal por ID
            $cristal = Cristales::find($id);

            if (!$cristal) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cristal no encontrado',
                ], 404);
            }

            // Eliminar el cristal
            $cristal->delete();

            return response()->json([
                'success' => true,
                'message' => 'Cristal eliminado exitosamente',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el cristal',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }




    public function resetAndInsert(Request $request)
    {
        // Validar que la data recibida sea un array de objetos con "codigo"
        $request->validate([
            'data' => 'required|array',
            'data.*.codigo' => 'required|string'
        ]);

        DB::transaction(function () use ($request) {
            // Eliminar todos los registros existentes
            Cristales::truncate();

            // Preparar los nuevos registros
            $newData = collect($request->input('data'))->map(function ($item) {
                [$codigo, $nombre] = explode('|', $item['codigo'], 2);
                return [
                    'codigo' => trim($codigo),
                    'nombre' => trim($nombre),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })->toArray();

            // Insertar los nuevos registros en la base de datos
            Cristales::insert($newData);
        });

        return response()->json(['message' => 'Datos actualizados correctamente'], 200);
    }

   
}
