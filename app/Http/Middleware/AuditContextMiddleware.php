<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Usuarios;
use Illuminate\Support\Facades\Log;

class AuditContextMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Solo auditar métodos de escritura
        if (in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])) {
            
            // usuario del request (establecido por CustomAuthenticateWithToken)
            $usuario = $request->user();
            
            // Si no está en el request, intenta obtenerlo del token
            if (!$usuario) {
                $token = $request->bearerToken();
                if ($token) {
                    $usuario = Usuarios::where('token', $token)->first();
                }
            }
            
            // Extrae los datos del usuario
            $usuarioId = $usuario?->id_usuario;
            $usuarioNombre = $usuario?->nombre;

            // Guardamos el contexto inicial de auditoría
            app()->instance('audit.context', [
                'endpoint'       => $request->path(),
                'method'         => $request->method(),
                'ip'             => $request->ip(),
                'user_agent'     => $request->userAgent(),
                'usuario_id'     => $usuarioId,
                'usuario_nombre' => $usuarioNombre,
                'request_json'   => json_encode($this->filterSensitiveData($request->all())),
                'tablas'         => [], // se llenará dinámicamente
            ]);
            
            // Log::info('Audit context creado', [
                // 'usuario_id' => $usuarioId,
                // 'usuario_nombre' => $usuarioNombre,
                // 'endpoint' => $request->path(),
            // ]);
        }

        return $next($request);
    }

    private function filterSensitiveData(array $data): array
    {
        unset($data['password'], $data['token'], $data['password_confirmation']);
        return $data;
    }
}