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
    'http://127.0.0.1:8000/api/validar-user',
    'http://127.0.0.1:8000/api/usuarios',
    'http://127.0.0.1:8000/api/usuarios/*',
    'http://127.0.0.1:8000/api/neonatos',
    'http://127.0.0.1:8000/api/neonatos/*',
    'http://127.0.0.1:8000/api/pediatrica',
    'http://127.0.0.1:8000/api/pediatrica/*',
    'http://127.0.0.1:8000/api/ortoptica',
    'http://127.0.0.1:8000/api/ortoptica/*',
    'http://127.0.0.1:8000/api/bajavision',
    'http://127.0.0.1:8000/api/bajavision/*',
    'http://127.0.0.1:8000/api/ObtometriaGeneral/',
    'http://127.0.0.1:8000/api/ObtometriaGeneral/*',
    'http://127.0.0.1:8000/api/historiaclinica',
    'http://127.0.0.1:8000/api/historiaclinica/*',
    'http://127.0.0.1:8000/api/consultagenerica',
    'http://127.0.0.1:8000/api/consultagenerica/*',
    'http://127.0.0.1:8000/api/pacientes',
    'http://127.0.0.1:8000/api/pacientes/*',
    'http://127.0.0.1:8000/api/obtenerHistoriaClinica/*',
    'http://127.0.0.1:8000/api/ultimaAtencion',
    'http://127.0.0.1:8000/api/pacientesConsultasDiarias',
    'http://127.0.0.1:8000/api/pacientesTerapiasDiarias',
    'http://127.0.0.1:8000/api/pacientesSinAtender',
    'http://127.0.0.1:8000/api/pacientesAtendidosPorDiaV2',
    'http://127.0.0.1:8000/api/todosLospacientesSinAtender',
    'http://127.0.0.1:8000/api/proximascitas',
    'http://127.0.0.1:8000/api/actualizarcontacto',
    'http://127.0.0.1:8000/api/actualizarNota',
    'http://127.0.0.1:8000/api/actualizaragendo',

    'http://127.0.0.1:8000/api/verificar-cedula',
    'http://127.0.0.1:8000/api/recetas',
    'http://127.0.0.1:8000/api/documentos/subir',

    'http://127.0.0.1:8000/api/terapias_bajav',
    'http://127.0.0.1:8000/api/terapias_bajav/*/*',
    'http://127.0.0.1:8000/api/terapias_bajav/*',
    'http://127.0.0.1:8000/api/terapia_bajav',
    'http://127.0.0.1:8000/api/terapia_bajav/*/*',
    'http://127.0.0.1:8000/api/terapia_bajav/*',

    'http://127.0.0.1:8000/api/sucursales',
    'http://127.0.0.1:8000/api/sucursales/*',

    'http://127.0.0.1:8000/api/terapias_optometria_neonatos/*',
    'http://127.0.0.1:8000/api/terapias_optometria_neonatos/*/*',
    'http://127.0.0.1:8000/api/terapias_optometria_neonatos',

    'http://127.0.0.1:8000/api/terapias_optometria_pediatrica/*',
    'http://127.0.0.1:8000/api/terapias_optometria_pediatrica/*/*',
    'http://127.0.0.1:8000/api/terapias_optometria_pediatrica',

    'http://127.0.0.1:8000/api/terapias_ortoptica_adultos/*',
    'http://127.0.0.1:8000/api/terapias_ortoptica_adultos/*/*',
    'http://127.0.0.1:8000/api/terapias_ortoptica_adultos',

    'http://127.0.0.1:8000/api/terapia_optometria_neonatos/*',
    'http://127.0.0.1:8000/api/terapia_optometria_neonatos/*/*',
    'http://127.0.0.1:8000/api/terapia_optometria_neonatos',

    'http://127.0.0.1:8000/api/terapia_optometria_pediatrica/*',
    'http://127.0.0.1:8000/api/terapia_optometria_pediatrica/*/*',
    'http://127.0.0.1:8000/api/terapia_optometria_pediatrica',

    'http://127.0.0.1:8000/api/terapia_ortoptica_adultos/*',
    'http://127.0.0.1:8000/api/terapia_ortoptica_adultos/*/*',
    'http://127.0.0.1:8000/api/terapia_ortoptica_adultos',

    'http://127.0.0.1:8000/api/documentos/subir',
    'http://127.0.0.1:8000/api/tipos-usuarios',
    'http://127.0.0.1:8000/api/tipos-permisos',
    'http://127.0.0.1:8000/api/permisos',
    'http://127.0.0.1:8000/api/permisos/findAllUsuarioPermisos/*',
    'http://127.0.0.1:8000/api/permisos/createOrUpdatePermisosUsuario',
    'http://127.0.0.1:8000/api/permisos-tipos-usuarios',
    'http://127.0.0.1:8000/api/pacientes-menores',
    'http://127.0.0.1:8000/api/pacientes-adultos',
    'http://127.0.0.1:8000/api/usuarios-doctor',

    'http://127.0.0.1:8000/api/servicios',

    'http://127.0.0.1:8000/api/reporte-servicio-realizados',
    'http://127.0.0.1:8000/api/reporte-servicio-proximos',

    'http://127.0.0.1:8000/api/verOrdenes',
    'http://127.0.0.1:8000/api/ordenes/*',
    'http://127.0.0.1:8000/api/ordenes',

    'http://127.0.0.1:8000/api/tipos-fases-ordenes',
    'http://127.0.0.1:8000/api/fases-ordenes',
    'http://127.0.0.1:8000/api/fases-ordenes/*',

    'http://127.0.0.1:8000/api/create-fases-ordenes',

    'http://127.0.0.1:8000/api/reporte-ordenes',

    'http://127.0.0.1:8000/api/whatsapp-link',

    'http://127.0.0.1:8000/api/contacto-orden',

    'http://127.0.0.1:8000/api/kpis',

    'http://127.0.0.1:8000/api/kpis/asesores',

    'http://127.0.0.1:8000/api/kpis/doctores',

    'http://127.0.0.1:8000/api/kpis/doctor-ordenes',

    'http://127.0.0.1:8000/api/kpis/fases-ordenes',

    'http://127.0.0.1:8000/api/kpis/status-ordenes',

    'http://127.0.0.1:8000/api/kpis/asesor-ordenes',

    'http://127.0.0.1:8000/api/kpis/asesor-fases',

    'http://127.0.0.1:8000/api/kpis/asesor-status',

    'http://127.0.0.1:8000/api/kpis/promedio-fases-ordenes',

    'http://127.0.0.1:8000/api/kpis/tipo-cristales',

    'http://127.0.0.1:8000/api/kpis/lente-ordenes',

    'http://127.0.0.1:8000/api/kpis/lente-ordenes-sucursal',

    'http://127.0.0.1:8000/api/kpis/lente-ordenes-asesores',

    'http://127.0.0.1:8000/api/kpis/lente-ordenes-doctores',

    'http://127.0.0.1:8000/api/correciones-ordenes/*',

    'http://127.0.0.1:8000/api/correciones-ordenes',

    'http://127.0.0.1:8000/api/create-fases-correccion-ordenes',

    'http://127.0.0.1:8000/api/fases-correciones-ordenes/*',

    'http://127.0.0.1:8000/api/create-fases-correciones-ordenes',

    'http://127.0.0.1:8000/api/contacto-correccion-orden/*',

    'http://127.0.0.1:8000/api/cont-correccion-orden',

    'http://127.0.0.1:8000/api/migration',

    'http://127.0.0.1:8000/api/allordenes',

    'http://127.0.0.1:8000/api/send-verification-email',

    'http://127.0.0.1:8000/api/cristales/*',

    'http://127.0.0.1:8000/api/cristales/data',

    'http://127.0.0.1:8000/api/materiales/*',

    'http://127.0.0.1:8000/api/tratamientos/*',

    'http://127.0.0.1:8000/api/marcas',

    'http://127.0.0.1:8000/api/marcas/*',

    'http://127.0.0.1:8000/api/tipos-aros',

    'http://127.0.0.1:8000/api/tipos-aros/*',

    'http://127.0.0.1:8000/api/kpis/update-tipo-cristales',

    'http://127.0.0.1:8000/api/kpis/terapias-consultas-doctor',

    'http://127.0.0.1:8000/api/kpis/terapias-consultas-sucursales',

    'http://127.0.0.1:8000/api/kpis/consultas-doctores',

    'http://127.0.0.1:8000/api/kpis/terapias-doctores',

    'http://127.0.0.1:8000/api/kpis/consultas-sucursales',

    'http://127.0.0.1:8000/api/kpis/terapias-sucursales',

    'http://127.0.0.1:8000/api/kpis/terapias-consultas-consulta-sucursal',

    'http://127.0.0.1:8000/api/kpis/tipo-cristal-esfera-cilindro-ordenes',

    'http://127.0.0.1:8000/api/obtener-ordenes',

    'http://127.0.0.1:8000/api/obtener-correcciones-ordenes/*',

    'http://127.0.0.1:8000/api/citas',

    'http://127.0.0.1:8000/api/proximas-citas/generar',

    'http://127.0.0.1:8000/api/proximos-servicios/baja-vision/*',

    'http://127.0.0.1:8000/api/citas/crear',

    'http://127.0.0.1:8000/api/proveedor-material',

    'http://127.0.0.1:8000/api/proveedor-material/*',
    

    
    'http://127.0.0.1:8000/api/citas/agendar',

    'http://127.0.0.1:8000/api/citas/delete/*',

    'http://127.0.0.1:8000/api/citas/update/*',

    'http://127.0.0.1:8000/api/usuario/conversaciones/*',

    'http://127.0.0.1:8000/api/usuarios/conversaciones/*',

    'http://127.0.0.1:8000/api/upload',

    'http://127.0.0.1:8000/api/verificar-interfuerza',

    'http://127.0.0.1:8000/api/quote/create',

    'http://127.0.0.1:8000/api/crear/quote/centevi',

    'http://127.0.0.1:8000/api/update/quote/centevi/*',

    
    'http://127.0.0.1:8000/api/prueba/orden',

    


  ];
}
