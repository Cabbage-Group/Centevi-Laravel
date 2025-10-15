<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;


class AuditLogMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // Ejecutamos primero la request y capturamos la respuesta
        $response = $next($request);

        // Recuperamos las tablas que fueron pasadas desde la ruta (atributo opcional)
        $tablas = $request->route()->defaults['tablas'] ?? [];

        // Solo auditar si:
        // - Hay tablas definidas
        // - El método HTTP es relevante (POST, PUT, DELETE)
        if (!empty($tablas) && in_array($request->method(), ['POST', 'PUT', 'DELETE'])) {
            
            $usuario = Auth::user();

            // Preparamos los datos del log
            $log = [
                'tablas'         => json_encode($tablas),
                'endpoint'       => $request->path(),
                'method'         => $request->method(),
                'request_json'   => json_encode($this->filterSensitiveData($request->all())),
                'response_json'  => json_encode($this->getResponseData($response)),
                'status_code'    => $response->status(),
                'ip'             => $request->ip(),
                'user_agent'     => $request->userAgent(),
                'usuario_id'     => $usuario?->usuario_id,
                'usuario_nombre' => $usuario?->nombre,
            ];

            DB::table('auditoria_logs')->insert($log);
        }

        return $response;
    }

    // Filtrar datos sensibles antes de guardar
    private function filterSensitiveData(array $data): array
    {
        unset($data['password'], $data['token'], $data['password_confirmation']);
        return $data;
    }

    // Capturar cuerpo JSON de respuesta (solo si es relevante)
    private function getResponseData($response)
    {
        if (method_exists($response, 'getData')) {
            return $response->getData();
        }
        return null;
    }
}
