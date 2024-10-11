<?php

namespace App\Http\Controllers\API\usuarios;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Usuarios;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

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

        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors(),
            ], 400);
        }

     
        $page = $request->input('page', 1);
        $limit = $request->input('limit', 10);
        $sortOrder = $request->input('sortOrder', 'asc');
        $sortColumn = $request->input('sortColumn', 'id_usuario');
        $usuarios = $request->input('usuarios');
        $search = $request->input('search', '');  

        try {
            $query = Usuarios::query();

            
            if ($usuarios) {
                $query->where('usuario', 'LIKE', '%' . $usuarios . '%');
            }

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('usuario', 'LIKE', '%' . $search . '%')
                      ->orWhere('nombre', 'LIKE', '%' . $search . '%')
                      ->orWhere('perfil', 'LIKE', '%' . $search . '%')
                      ->orWhere('sucursal', 'LIKE', '%' . $search . '%')
                      ->orWhere('estado', 'LIKE', '%' . $search . '%')
                      ->orWhere('ultimo_login', 'LIKE', '%' . $search . '%')
                      ->orWhere('editado', 'LIKE', '%' . $search . '%')
                      ->orWhere('id_usuario', 'LIKE', '%' . $search . '%');
                });
            }   

          
            $query->orderBy($sortColumn, $sortOrder);

           
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

    public function usuariosDoctor()
{
    try {
        // Obtener el total de usuarios cuyo perfil es "doctor"
        $totalUsuariosDoctor = Usuarios::where('perfil', 'doctor')->count();

        // Respuesta exitosa con el total
        return response()->json([
            'success' => true,
            'message' => 'Operación exitosa',
            'total' => $totalUsuariosDoctor,
        ]);
    } catch (\Exception $e) {
        // Manejar cualquier error
        return response()->json([
            'success' => false,
            'message' => 'Error al obtener el total de usuarios con perfil de doctor',
            'errors' => $e->getMessage(),
        ], 500);
    }
}

    public function update(Request $request, $id)
{
   
    Log::info('Incoming request data:', $request->all());

  
    $request->validate([
        'usuario' => 'nullable|string|max:255',
        'nombre' => 'nullable|string|max:255',
        'password' => 'nullable|string',
        'perfil' => 'nullable|string|max:255',
        'sucursal' => 'nullable|integer',
        'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'estado' => 'nullable|integer',
        'ultimo_login' => 'nullable|date',
        'editado' => 'nullable|date',
        'tipo_usuario_id' => 'nullable|integer'
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

    try {
        // Manejar la imagen
        $fotoPath = $usuario->foto; // Mantener el valor actual si no se actualiza

        if ($request->hasFile('foto')) {
            // Eliminar la imagen existente si es necesario
            if ($fotoPath && Storage::exists('public/fotos/' . basename($fotoPath))) {
                Storage::delete('public/fotos/' . basename($fotoPath));
            }

            // Subir la nueva imagen
            $file = $request->file('foto');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $fotoPath = $file->storeAs('public/fotos', $fileName);
            $fotoPath = Storage::url($fotoPath); // Obtener URL pública
        }

        $usuario->usuario = $request->input('usuario', $usuario->usuario);
        $usuario->nombre = $request->input('nombre', $usuario->nombre);
        $password = $request->input('password');
        if ($password) {
            // Hash de la contraseña usando crypt con un formato específico
            $encryptionKey = '$2a$07$asxx54ahjppf45sd87a5a4dDDGsystemdev$';
            $usuario->password = crypt($password, $encryptionKey);
        } else {
            $usuario->password = $usuario->password; // Mantener la contraseña actual si no se proporciona una nueva
        }
        $usuario->perfil = $request->input('perfil', $usuario->perfil);
        $usuario->sucursal = intval($request->input('sucursal', $usuario->sucursal));
        $usuario->estado = $request->input('estado', $usuario->estado);
        $usuario->editado = now();
        $usuario->foto = $fotoPath; // Actualizar la ruta de la imagen si existe
        $usuario->tipo_usuario_id = intval($request->input('tipo_usuario_id', $usuario->tipo_usuario_id));

        // Guardar los cambios
        $usuario->save();

        return response()->json([
            'data' => $usuario,
            'status' => [
                'code' => 200,
                'message' => 'Usuario actualizado con éxito',
            ],
        ], 200);

    } catch (\Exception $e) {
        Log::error('Error al actualizar el usuario: ' . $e->getMessage());

        return response()->json([
            'status' => [
                'code' => 500,
                'message' => 'Error al actualizar el usuario',
            ],
            'errors' => $e->getMessage(),
        ], 500);
    }
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


public function add(Request $request)
{
    // Validar los datos de entrada
    $validator = Validator::make($request->all(), [
        'usuario' => 'required|string|max:255|unique:usuarios,usuario',
        'nombre' => 'required|string|max:255',
        'password' => 'required|string',
        'perfil' => 'nullable|string|max:255',
        'sucursal' => 'nullable|integer',
        'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validación de imagen
        'ultimo_login' => 'nullable|date',
        'editado' => 'nullable|date',
        'tipo_usuario_id' => 'nullable|integer',
    ]);

    // Manejar errores de validación
    if ($validator->fails()) {
        return response()->json([
            'status' => [
                'code' => 400,
                'message' => 'Error de validación',
            ],
            'errors' => $validator->errors(),
        ], 400);
    }

    try {
        $fotoPath = null;

        // Manejo de la imagen
        if ($request->hasFile('foto')) {
            $file = $request->file('foto');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $fotoPath = $file->storeAs('public/fotos', $fileName); // Guardar en 'storage/app/public/fotos'
            $fotoPath = Storage::url($fotoPath); // Obtener URL pública
        }

        // Preparar los datos para la inserción
        $usuarioData = [
            'usuario' => $request->input('usuario'),
            'nombre' => $request->input('nombre'),
            'password' => crypt($request->input('password'), '$2a$07$asxx54ahjppf45sd87a5a4dDDGsystemdev$'),// Usar bcrypt para encriptar la contraseña
            'perfil' => $request->input('perfil'),
            'sucursal' => $request->input('sucursal'),
            'foto' => $fotoPath, // Guardar la URL de la imagen
            'estado' => $request->input('estado', 0), 
            'ultimo_login' => $request->input('ultimo_login'),
            'editado' => $request->input('editado'),
            'tipo_usuario_id' => $request->input('tipo_usuario_id'),
        ];

        // Insertar el nuevo usuario y obtener el ID
        $id = DB::table('usuarios')->insertGetId($usuarioData);

        // Obtener el usuario recién creado
        $usuario = DB::table('usuarios')->where('id_usuario', $id)->first();

        return response()->json([
            'data' => $usuario,
            'status' => [
                'code' => 201,
                'message' => 'Usuario creado con éxito',
            ],
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'status' => [
                'code' => 500,
                'message' => 'Error al crear el usuario',
            ],
            'errors' => $e->getMessage(),
        ], 500);
    }
}




}
