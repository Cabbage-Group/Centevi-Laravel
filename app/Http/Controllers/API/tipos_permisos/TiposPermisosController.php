<?php

namespace App\Http\Controllers\API\tipos_permisos;

use App\Http\Controllers\Controller;
use App\Models\TiposPermisos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TiposPermisosController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Obtener todos los tipos de usuarios
            $tiposPermisos = TiposPermisos::all();

            return response()->json([
                'success' => true,
                'message' => 'Operación exitosa',
                'data' => $tiposPermisos,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener tipos de usuarios',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function create(Request $request)
    {
        // Validar la solicitud
        $validator = Validator::make($request->all(), [
            'tipo' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Crear un nuevo tipo de usuario
            $tipoPermiso = new TiposPermisos();
            $tipoPermiso->tipo = $request->input('tipo');
            $tipoPermiso->save();

            return response()->json([
                'success' => true,
                'message' => 'Tipo de permiso creado exitosamente',
                'data' => $tipoPermiso,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el tipo de permiso',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }
}
