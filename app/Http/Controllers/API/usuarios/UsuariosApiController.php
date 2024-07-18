<?php

namespace App\Http\Controllers\API\usuarios;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Usuarios;
use Illuminate\Support\Facades\Hash;

class UsuariosApiController extends Controller
{
    public function usuarios(Request $request)
    {
        // Obtener los parámetros
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 50);
        $sortOrder = $request->query('sortOrder', 'asc');
        $sortColumn = $request->query('sortColumn', 'id_usuario');

        // Validar los parámetros
        $request->validate([
            'page' => 'integer|min:1',
            'limit' => 'integer|min:1|max:100',
            'sortOrder' => 'in:asc,desc',
            'sortColumn' => 'string|in:usuario,nombre,perfil,sucursal,estado,ultimo_login,editado', // Ajusta según los campos que tengas
        ]);

        // Obtener los datos paginados
        $usuarios = Usuarios::orderBy($sortColumn, $sortOrder)
            ->paginate($limit, ['*'], 'page', $page);

        // Formatear la respuesta
        return response()->json([
            'data' => $usuarios->items(),
            'meta' => [
                'page' => $usuarios->currentPage(),
                'limit' => $usuarios->perPage(),
                'total' => $usuarios->total(),
            ],
            'status' => [
                'code' => 200,
                'message' => 'Usuarios retrieved successfully',
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        // Validar los datos de entrada
        $request->validate([
            'usuario' => 'string|max:255',
            'nombre' => 'string|max:255',
            'password' => 'nullable|string|min:8', // La contraseña es opcional
            'perfil' => 'string|max:255',
            'sucursal' => 'integer',
            'foto' => 'string|max:255',
            'estado' => 'integer',
            'ultimo_login' => 'date',
            'editado' => 'date',
        ]);

        // Buscar el usuario por id
        $usuario = Usuarios::find($id);

        if (!$usuario) {
            return response()->json([
                'status' => [
                    'code' => 404,
                    'message' => 'Usuario no encontrado',
                ],
            ], 404);
        }

        // Actualizar los campos
        $usuario->usuario = $request->input('usuario', $usuario->usuario);
        $usuario->nombre = $request->input('nombre', $usuario->nombre);
        if ($request->filled('password')) {
            $usuario->password = Hash::make($request->input('password'));
        }
        $usuario->perfil = $request->input('perfil', $usuario->perfil);
        $usuario->sucursal = $request->input('sucursal', $usuario->sucursal);
        $usuario->foto = $request->input('foto', $usuario->foto);
        $usuario->estado = $request->input('estado', $usuario->estado);
        $usuario->ultimo_login = $request->input('ultimo_login', $usuario->ultimo_login);
        $usuario->editado = $request->input('editado', $usuario->editado);

        // Guardar los cambios
        $usuario->save();

        return response()->json([
            'data' => $usuario,
            'status' => [
                'code' => 200,
                'message' => 'Usuario actualizado con éxito',
            ],
        ]);
    }
}
