<?php

namespace App\Http\Controllers\API\login;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Usuarios;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class LoginApiController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'usuario' => 'required|string|max:255|unique:usuarios',
            'nombre' => 'required|string|max:255',
            'password' => 'required|string|min:6|confirmed',
            'perfil' => 'required|string|max:255',
            'sucursal' => 'required|integer',
            'foto' => 'nullable|string|max:255',
            'estado' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'Validation errors',
                'data' => [],
                'mensaje_dev' => $validator->errors()
            ], 400);
        }

        $usuario = Usuarios::create([
            'usuario' => $request->usuario,
            'nombre' => $request->nombre,
            'password' => Hash::make($request->password),
            'perfil' => $request->perfil,
            'sucursal' => $request->sucursal,
            'foto' => $request->foto,
            'estado' => $request->estado,
        ]);

        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Usuario registrado correctamente',
            'data' => [$usuario],
            'mensaje_dev' => null
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'usuario' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'Validation errors',
                'data' => [],
                'mensaje_dev' => $validator->errors()
            ], 400);
        }

        $usuario = Usuarios::where('usuario', $request->usuario)->first();

        if (!$usuario || !Hash::check($request->password, $usuario->password)) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'Invalid credentials',
                'data' => [],
                'mensaje_dev' => 'Usuario o contraseña incorrectos'
            ], 401);
        }

        // Generar token con Laravel Sanctum
        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Login successful',
            'data' => [
                'token' => $token,
                'usuario' => $usuario
            ],
            'mensaje_dev' => null
        ], 200);
    }
}
