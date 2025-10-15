<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuditContextMiddleware
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
        // Solo auditar métodos de escritura
        if (in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])) {

            // Guardamos el contexto inicial de auditoría
            app()->instance('audit.context', [
                'endpoint'       => $request->path(),
                'method'         => $request->method(),
                'ip'             => $request->ip(),
                'user_agent'     => $request->userAgent(),
                'usuario_id'     => Auth::id(),
                'usuario_nombre' => Auth::user()?->nombre,
                'request_json'   => json_encode($this->filterSensitiveData($request->all())),
                'tablas'         => [], // se llenará dinámicamente
            ]);
        }

        return $next($request);
    }

    private function filterSensitiveData(array $data): array
    {
        unset($data['password'], $data['token'], $data['password_confirmation']);
        return $data;
    }
}
