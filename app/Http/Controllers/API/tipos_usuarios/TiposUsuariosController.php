<?php

namespace App\Http\Controllers\API\tipos_usuarios;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TiposUsuario;
use Illuminate\Support\Facades\Validator;

class TiposUsuariosController extends Controller
{
    public function index(Request $request)
{
    try {
        // Obtener los parámetros de paginación
        $page = $request->input('page', 1); // Valor por defecto es 1
        $limit = (int) $request->input('limit', 10); // Valor por defecto es 10 y lo convertimos a entero

        // Obtener todos los tipos de usuarios con paginación
        $tiposUsuarios = TiposUsuario::paginate($limit);

        // Crear la metadata para la respuesta
        $meta = [
            'page' => $tiposUsuarios->currentPage(),
            'limit' => $limit, // Retornar el valor de limit como entero
            'total' => $tiposUsuarios->total(),
        ];

        return response()->json([
            'data' => $tiposUsuarios->items(), // Devuelve solo los elementos actuales
            'meta' => $meta,
            'status' => [
                'code' => 200,
                'message' => 'Tipos de usuarios retrieved successfully',
            ],
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
            'tipo_usuario' => 'required|string|max:255',
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
            $tipoUsuario = new TiposUsuario();
            $tipoUsuario->tipo_usuario = $request->input('tipo_usuario');
            $tipoUsuario->save();

            return response()->json([
                'success' => true,
                'message' => 'Tipo de usuario creado exitosamente',
                'data' => $tipoUsuario,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el tipo de usuario',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    
}
