<?php

namespace App\Http\Controllers\API\permisos_tipos_usuarios;

use App\Http\Controllers\Controller;
use App\Models\PermisosTiposUsuarios;
use Illuminate\Http\Request;

class PermisosTiposUsuariosController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Obtener todos los tipos de usuarios
            $permisos = PermisosTiposUsuarios:: all();

            return response()->json([
                'success' => true,
                'message' => 'Operación exitosa',
                'data' => $permisos,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener tipos de usuarios',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

}
