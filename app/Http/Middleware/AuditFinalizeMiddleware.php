<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AuditFinalizeMiddleware
{
    /**
     * Handle an incoming request.
     * Este método es OBLIGATORIO en Laravel 8
     */
    public function handle(Request $request, Closure $next)
    {
        return $next($request);
    }

    /**
     * Este middleware se ejecuta después de enviar la respuesta.
     */
    public function terminate($request, $response)
    {
        if (!app()->bound('audit.context')) {
            return;
        }

        try {
            $context = app('audit.context');

            // Evitamos logs vacíos
            if (empty($context['tablas'])) {
                return;
            }
          
            // Guardamos el log final consolidado
            DB::table('auditoria_logs')->insert([
                'tablas'         => json_encode($context['tablas']),
                'endpoint'       => $context['endpoint'] ?? 'N/A',
                'method'         => $context['method'] ?? 'N/A',
                'request_json'   => $context['request_json'] ?? null,
                'response_json'  => json_encode($this->getResponseData($response)),
                'status_code'    => $response->getStatusCode(),
                'ip'             => $context['ip'] ?? null,
                'user_agent'     => $context['user_agent'] ?? null,
                'usuario_id'     => $context['usuario_id'] ?? null,
                'usuario_nombre' => $context['usuario_nombre'] ?? null,
                'created_at'     => now(),
            ]);
        } catch (\Throwable $th) {
          Log::error('Error en auditoría:', ['error' => $th->getMessage()]);
        }
        
    }

    private function getResponseData($response)
    {
        if (method_exists($response, 'getData')) {
            return $response->getData(true);
        }

        return null;
    }
}
