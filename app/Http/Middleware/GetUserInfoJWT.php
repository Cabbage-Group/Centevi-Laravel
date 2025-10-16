<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Usuarios;
use Illuminate\Support\Facades\Log;

class GetUserInfoJWT
{
    public function handle(Request $request, Closure $next)
    {
        // Intenta obtener el token del header
        $token = $request->bearerToken();
        
        // Si hay token, busca el usuario
        if ($token) {
            $usuario = Usuarios::where('token', $token)->first();
            
            if ($usuario) {
                // Si encontró usuario, lo guarda en el request
                $request->setUserResolver(function () use ($usuario) {
                    return $usuario;
                });
                
                Log::info('Usuario autenticado', [
                    'usuario_id' => $usuario->id_usuario,
                    'nombre' => $usuario->nombre,
                ]);
            } else {
                // Token existe pero es inválido
                Log::warning('Token inválido: ' . substr($token, 0, 10) . '...');
            }
        } else {
            // No hay token, pero continuamos sin error
            Log::info('No hay token en la petición: ' . $request->path());
        }
        
        // SIEMPRE continúa, sin importar si hay usuario o no
        return $next($request);
    }
}