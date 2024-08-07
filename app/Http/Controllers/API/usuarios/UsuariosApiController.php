<?php

namespace App\Http\Controllers\API\usuarios;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Usuarios;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UsuariosApiController extends Controller
{
    public function usuarios(Request $request)
    {
        // Validar los parámetros de entrada
        $validator = Validator::make($request->all(), [
            'page' => 'integer|min:1',
            'limit' => 'integer|min:1|max:10000',
            'sortOrder' => Rule::in(['asc', 'desc']),
            'sortColumn' => Rule::in(['usuario', 'nombre', 'perfil', 'sucursal', 'estado', 'ultimo_login', 'editado', 'id']),
            'usuarios' => 'string|max:255',
        ]);

        // Manejar errores de validación
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors(),
            ], 400);
        }

        // Obtener los parámetros validados con valores predeterminados
        $page = $request->input('page', 1);
        $limit = $request->input('limit', 10);
        $sortOrder = $request->input('sortOrder', 'asc');
        $sortColumn = $request->input('sortColumn', 'id_usuario');
        $usuarios = $request->input('usuarios');

        try {
            $query = Usuarios::query();

            // Aplicar filtro de usuarios si se proporciona
            if ($usuarios) {
                $query->where('usuario', 'LIKE', '%' . $usuarios . '%');
            }

            // Aplicar ordenamiento por columna y orden especificados
            $query->orderBy($sortColumn, $sortOrder);

            // Obtener datos paginados
            $usuarios = $query->paginate($limit, ['*'], 'page', $page);

            $meta = [
                'page' => $usuarios->currentPage(),
                'limit' => $usuarios->perPage(),
                'total' => $usuarios->total(),
                'sortOrder' => $sortOrder,
                'sortColumn' => $sortColumn,
            ];

            return response()->json([
                'success' => true,
                'message' => 'Operación exitosa',
                'data' => $usuarios->items(),
                'meta' => $meta,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener usuarios',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        // Validar los datos de entrada
        $request->validate([
            'usuario' => 'string|max:255',
            'nombre' => 'string|max:255',
            'password' => 'nullable|string', // La contraseña es opcional
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

    public function delete($id)
{
    try {
        // Buscar el usuario por ID
        $usuario = Usuarios::find($id);

        // Verificar si el usuario existe
        if (!$usuario) {
            return response()->json([
                'status' => [
                    'code' => 404,
                    'message' => 'Usuario no encontrado',
                ],
            ], 404);
        }

        // Eliminar el usuario
        $usuario->delete();

        return response()->json([
            'status' => [
                'code' => 200,
                'message' => 'Usuario eliminado con éxito',
            ],
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => [
                'code' => 500,
                'message' => 'Error al eliminar el usuario',
            ],
            'errors' => $e->getMessage(),
        ], 500);
    }
}

}
