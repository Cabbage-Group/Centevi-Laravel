<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Usuarios;
use Illuminate\Support\Facades\Log;

class CustomAuthenticateWithToken
{
    public function handle(Request $request, Closure $next)
    {
        // Debug: Log todos los headers
        Log::info('Headers recibidos:', [
            'all_headers' => $request->headers->all(),
            'bearer_token' => $request->bearerToken(),
            'auth_header' => $request->header('Authorization'),
        ]);

        $token = $request->bearerToken();
        
        if (!$token) {
            Log::warning('No token provided en la petición: ' . $request->path());
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'Token no proporcionado',
                'data' => [],
                'mensaje_dev' => 'El header Authorization con Bearer token es requerido'
            ], 401);
        }

        $usuario = Usuarios::where('token', $token)->first();

        if (!$usuario) {
            Log::warning('Token inválido: ' . substr($token, 0, 10) . '...');
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'Token inválido',
                'data' => [],
                'mensaje_dev' => 'El token no existe o expiró'
            ], 401);
        }

        Log::info('Usuario autenticado: ' . $usuario->nombre);
        $request->setUserResolver(function () use ($usuario) {
            return $usuario;
        });

        return $next($request);
    }
}