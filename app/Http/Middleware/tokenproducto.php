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
    protected $except = [];

    public function __construct()
    {
        // Base URL dinámica
        $baseUrl = url('/');

        $this->except = [
            "$baseUrl/api/register",
            "$baseUrl/api/login",
            "$baseUrl/api/validar-user",
            "$baseUrl/api/usuarios",
            "$baseUrl/api/usuarios/*",
            "$baseUrl/api/neonatos",
            "$baseUrl/api/neonatos/*",
            "$baseUrl/api/pediatrica",
            "$baseUrl/api/pediatrica/*",
            "$baseUrl/api/ortoptica",
            "$baseUrl/api/ortoptica/*",
            "$baseUrl/api/bajavision",
            "$baseUrl/api/bajavision/*",
            "$baseUrl/api/ObtometriaGeneral",
            "$baseUrl/api/ObtometriaGeneral/*",
            "$baseUrl/api/historiaclinica",
            "$baseUrl/api/historiaclinica/*",
            "$baseUrl/api/consultagenerica",
            "$baseUrl/api/consultagenerica/*",
            "$baseUrl/api/pacientes",
            "$baseUrl/api/pacientes/*",
            "$baseUrl/api/obtenerHistoriaClinica/*",
            "$baseUrl/api/ultimaAtencion",
            "$baseUrl/api/pacientesConsultasDiarias",
            "$baseUrl/api/pacientesTerapiasDiarias",
            "$baseUrl/api/pacientesSinAtender",
            "$baseUrl/api/pacientesAtendidosPorDiaV2",
            "$baseUrl/api/todosLospacientesSinAtender",
            "$baseUrl/api/proximascitas",
            "$baseUrl/api/actualizarcontacto",
            "$baseUrl/api/actualizarNota",
            "$baseUrl/api/actualizaragendo",

            "$baseUrl/api/verificar-cedula",
            "$baseUrl/api/recetas",
            "$baseUrl/api/documentos/subir",

            "$baseUrl/api/terapias_bajav",
            "$baseUrl/api/terapias_bajav/*/*",
            "$baseUrl/api/terapias_bajav/*",
            "$baseUrl/api/terapia_bajav",
            "$baseUrl/api/terapia_bajav/*/*",
            "$baseUrl/api/terapia_bajav/*",

            "$baseUrl/api/sucursales",
            "$baseUrl/api/sucursales/*",

            "$baseUrl/api/terapias_optometria_neonatos/*",
            "$baseUrl/api/terapias_optometria_neonatos/*/*",
            "$baseUrl/api/terapias_optometria_neonatos",

            "$baseUrl/api/terapias_optometria_pediatrica/*",
            "$baseUrl/api/terapias_optometria_pediatrica/*/*",
            "$baseUrl/api/terapias_optometria_pediatrica",

            "$baseUrl/api/terapias_ortoptica_adultos/*",
            "$baseUrl/api/terapias_ortoptica_adultos/*/*",
            "$baseUrl/api/terapias_ortoptica_adultos",

            "$baseUrl/api/terapia_optometria_neonatos/*",
            "$baseUrl/api/terapia_optometria_neonatos/*/*",
            "$baseUrl/api/terapia_optometria_neonatos",

            "$baseUrl/api/terapia_optometria_pediatrica/*",
            "$baseUrl/api/terapia_optometria_pediatrica/*/*",
            "$baseUrl/api/terapia_optometria_pediatrica",

            "$baseUrl/api/terapia_ortoptica_adultos/*",
            "$baseUrl/api/terapia_ortoptica_adultos/*/*",
            "$baseUrl/api/terapia_ortoptica_adultos",

            "$baseUrl/api/documentos/subir",
            "$baseUrl/api/tipos-usuarios",
            "$baseUrl/api/tipos-permisos",
            "$baseUrl/api/permisos",
            "$baseUrl/api/permisos/findAllUsuarioPermisos/*",
            "$baseUrl/api/permisos/createOrUpdatePermisosUsuario",
            "$baseUrl/api/permisos-tipos-usuarios",
            "$baseUrl/api/pacientes-menores",
            "$baseUrl/api/pacientes-adultos",
            "$baseUrl/api/usuarios-doctor",
        ];
    }
}
