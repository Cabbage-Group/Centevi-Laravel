<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'http://127.0.0.1:8000/api/register',
        'http://127.0.0.1:8000/api/login',
        'http://127.0.0.1:8000/api/usuarios/*',
        'http://127.0.0.1:8000/api/pacientes',
        'http://127.0.0.1:8000/api/pacientes/*',
        'http://127.0.0.1:8000/api/obtenerHistoriaClinica/*',
        'http://127.0.0.1:8000/api/ultimaAtencion',
        'http://127.0.0.1:8000/api/pacientesConsultasDiarias',
        'http://127.0.0.1:8000/api/pacientesTerapiasDiarias',
        'http://127.0.0.1:8000/api/pacientesSinAtender',
        'http://127.0.0.1:8000/api/pacientesAtendidosPorDiaV2',
        'http://127.0.0.1:8000/api/todosLospacientesSinAtender'
        
    ];
}
