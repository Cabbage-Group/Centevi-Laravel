<?php


use App\Http\Controllers\API\contacto_correcciones_ordenes\ContactosCorreccionesOrdenesApiController;
use App\Http\Controllers\API\Documentos\DocumentosPacientesApiController;
use App\Http\Controllers\API\tipos_permisos\TiposPermisosController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\usuarios\UsuariosApiController;
use App\Http\Controllers\API\sucursales\SucursalesApiController;
use App\Http\Controllers\API\pacientes\PacientesApiController;
use App\Http\Controllers\API\login\LoginApiController;
use App\Http\Controllers\API\consultas\NeonatosApiController;
use App\Http\Controllers\API\consultas\PediatricaApiController;
use App\Http\Controllers\API\consultas\OrtopticaApiController;
use App\Http\Controllers\API\consultas\BajaVisionApiController;
use App\Http\Controllers\API\consultas\OptometriaGeneralApiController;
use App\Http\Controllers\API\consultas\ConsultaGenericaController;
use App\Http\Controllers\Admin\HistoriaClinica\HistoriaClinicaController;
use App\Http\Controllers\API\agenda\AgendaApiController;
use App\Http\Controllers\API\contacto_orden\ContactosOrdenesApiController;
use App\Http\Controllers\API\correciones_ordenes\CorrecionesOrdenesController;
use App\Http\Controllers\API\cristales\CristalesApiController;
use App\Http\Controllers\API\diagnostico_pacientes\DiagnosticoPacienteController;
use App\Http\Controllers\API\download\DownloadController;
use App\Http\Controllers\API\email\EmailController;
use App\Http\Controllers\API\interfuerza\interfuerzaApiControllerCustomers;
use App\Http\Controllers\API\interfuerza\interfuerzaApiControllerProducts;
use App\Http\Controllers\API\interfuerza\interfuerzaApiControllerQuotes;
use App\Http\Controllers\API\interfuerza\interfuerzaApiControllerWareHouses;
use App\Http\Controllers\API\interfuerza\InterfuerzaController;
use App\Http\Controllers\API\kpis\KpisApiController;
use App\Http\Controllers\API\marcas\MarcasApiController;
use App\Http\Controllers\API\materiales\MaterialesApiController;
use App\Http\Controllers\API\ordenes\OrdenesApiController;
use App\Http\Controllers\API\permisos\PermisosController;
use App\Http\Controllers\API\permisos_tipos_usuarios\PermisosTiposUsuariosController;
use App\Http\Controllers\API\products_interfuerza\ProductsInterfuerzaApiController;
use App\Http\Controllers\API\proveedorMaterial\ProveedorDeMaterialController;
use App\Http\Controllers\API\proveedorMaterial\ProveedorMaterialApiController;
use App\Http\Controllers\API\quotes\QuoterApiController;
use App\Http\Controllers\API\recetas\RecetasApiController;
use App\Http\Controllers\API\terapias\Terapia_Bajav_ApiController;
use App\Http\Controllers\API\terapias\Terapia_Optometria_Neonatos_ApiController;
use App\Http\Controllers\API\terapias\Terapia_Optometria_Pediatrica_ApiController;
use App\Http\Controllers\API\terapias\Terapia_Ortoptica_Adultos_ApiController;
use App\Http\Controllers\API\terapias\Terapias_Bajav_ApiController;
use App\Http\Controllers\API\terapias\Terapias_Optometria_Neonatos_ApiController;
use App\Http\Controllers\API\terapias\Terapias_Optometria_Pediatrica_ApiController;
use App\Http\Controllers\API\terapias\Terapias_Ortoptica_Adultos_ApiController;
use App\Http\Controllers\API\tipos_usuarios\TiposUsuariosController;
use App\Http\Controllers\API\servicios\ServiciosApiController;
use App\Http\Controllers\API\tipos_aros\TiposArosApiController;
use App\Http\Controllers\API\quotes\QuotePdfController;
use App\Http\Controllers\API\quotes_timelines\QuoteTimelineApiController;
use App\Http\Controllers\API\reportes\ReporteDiagnosticosController;
use App\Http\Controllers\API\tratamientos\TratamientosApiController;
use App\Http\Controllers\API\whatsapp\WhatsappApiController;
use App\Http\Controllers\API\ventas\VentasApiController;
use App\Http\Controllers\API\warehouse\WarehouseController;
use Illuminate\Support\Facades\View;

Route::get('/api/usuarios', [UsuariosApiController::class, 'usuarios']);
Route::get('/api/usuarios-doctor', [UsuariosApiController::class, 'usuariosDoctor']);
Route::get('/api/pacientes', [PacientesApiController::class, 'pacientes']);
Route::get('/api/exportar-pacientes-v2', [PacientesApiController::class, 'exportPacientesExcel']);

Route::get('/api/pacientes/{id}', [PacientesApiController::class, 'VerPaciente']);

Route::get('/api/sucursales', [SucursalesApiController::class, 'sucursales']);
Route::post('/api/sucursales', [SucursalesApiController::class, 'createSucursal']);
Route::put('/api/sucursales/{id}', [SucursalesApiController::class, 'updateSucursal']);
Route::delete('/api/sucursales/{id}', [SucursalesApiController::class, 'deleteSucursal']);

Route::post('/api/register', [LoginApiController::class, 'register']);
Route::post('/api/login', [LoginApiController::class, 'login']);
Route::post('/api/validar-user', [LoginApiController::class, 'validarUser']);
Route::get('/api/asignar-tokens', [LoginApiController::class, 'asignarTokens']);
Route::get('/api/delete-tokens', [LoginApiController::class, 'deleteTokens']);

Route::put('/api/usuarios/{id}', [UsuariosApiController::class, 'update']);
Route::delete('/api/usuarios/{id}', [UsuariosApiController::class, 'delete']);
Route::post('/api/usuarios', [UsuariosApiController::class, 'add']);

Route::post('/api/pacientes', [PacientesApiController::class, 'crearpaciente']);
Route::put('/api/pacientes/{id}', [PacientesApiController::class, 'editarpaciente']);


Route::get('/api/pacientes-menores', [PacientesApiController::class, 'pacientesMenores']);

Route::get('/api/pacientes-adultos', [PacientesApiController::class, 'pacientesAdultos']);

Route::get('/api/pacientes/{id}/tiempo-sin-consulta', [PacientesApiController::class, 'diasOMesesDesdeUltimaConsulta']);
// php artisan optimize
//
Route::get('/api/tipos-usuarios', [TiposUsuariosController::class, 'index']);

Route::post('/api/tipos-usuarios', [TiposUsuariosController::class, 'create']);


Route::get('/api/tipos-permisos', [TiposPermisosController::class, 'index']);

Route::post('/api/tipos-permisos', [TiposPermisosController::class, 'create']);

Route::get('/api/permisos', [PermisosController::class, 'index']);

Route::post('/api/permisos', [PermisosController::class, 'create']);

Route::get('/api/permisos/findAllUsuarioPermisos/{id}', [PermisosController::class, 'findAllUsuarioPermisos']);

Route::post('/api/permisos/createOrUpdatePermisosUsuario', [PermisosController::class, 'createOrUpdatePermisosUsuario']);

Route::get('/api/permisos-tipos-usuarios', [PermisosTiposUsuariosController::class, 'index']);











Route::delete('/api/pacientes/{id}', [PacientesApiController::class, 'eliminarpaciente']);




















Route::get('/api/obtenerconsultagenerica/{paciente_id}', [PacientesApiController::class, 'obtenerconsultagenerica']);

Route::get('/api/ver-neonatos/{id}/{id_consulta}', [NeonatosApiController::class, 'VerOptometriaNeonatos']);
Route::get('/api/mostrar-neonatos', [NeonatosApiController::class, 'mostrarOptometriaNeonatos']);
Route::post('/api/neonatos', [NeonatosApiController::class, 'CrearNeonatos']);
Route::put('/api/neonatos/{id}/{id_consulta}', [NeonatosApiController::class, 'EditarNeonatos']);
Route::delete('/api/neonatos/{id}', [NeonatosApiController::class, 'DeleteNeonatos']);
Route::get('/api/neonatos', [NeonatosApiController::class, 'ObtenerNeonatos']);

Route::get('/api/ver-pediatrica/{id}/{id_consulta}', [PediatricaApiController::class, 'VerOptometriaPediatrica']);
Route::get('/api/mostrar-pediatrica', [PediatricaApiController::class, 'mostrarOptometriaPediatrica']);
Route::post('/api/pediatrica', [PediatricaApiController::class, 'crearPediatrica']);
Route::put('/api/pediatrica/{id}/{id_consulta}', [PediatricaApiController::class, 'editarPediatrica']);
Route::delete('/api/pediatrica/{id}', [PediatricaApiController::class, 'eliminarPediatrica']);

Route::get('/api/ver-ortoptica/{id}/{id_consulta}', [OrtopticaApiController::class, 'VerOrtoptica']);
Route::get('/api/mostrar-ortoptica', [OrtopticaApiController::class, 'mostrarOrtopticaAdultos']);
Route::post('/api/ortoptica', [OrtopticaApiController::class, 'CrearOrtoptica']);
Route::put('/api/ortoptica/{id}/{id_consulta}', [OrtopticaApiController::class, 'EditarOrtoptica']);
Route::delete('/api/ortoptica/{id}', [OrtopticaApiController::class, 'DeleteOrtoptica']);

Route::get('/api/ver-bajavision/{id}/{id_consulta}', [BajaVisionApiController::class, 'verBajaVision']);
Route::get('/api/mostrar-bajavision', [BajaVisionApiController::class, 'mostrarBajaVision']);
Route::post('/api/bajavision', [BajaVisionApiController::class, 'CrearBajaVision']);
Route::put('/api/bajavision/{id}/{id_consulta}', [BajaVisionApiController::class, 'EditarBajaVision']);
Route::delete('/api/bajavision/{id}', [BajaVisionApiController::class, 'DeleteBajaVision']);

Route::get('/api/ver-refraccion/{id}/{id_consulta}', [OptometriaGeneralApiController::class, 'verRefraccionGeneral']);
Route::get('/api/mostrar-refraccion', [OptometriaGeneralApiController::class, 'mostrarRefraccionGeneral']);
Route::post('/api/ObtometriaGeneral', [OptometriaGeneralApiController::class, 'CrearRefraccionGeneral']);
Route::put('/api/ObtometriaGeneral/{id}/{id_consulta}', [OptometriaGeneralApiController::class, 'EditarRefraccionGeneral']);
Route::delete('/api/ObtometriaGeneral/{id}', [OptometriaGeneralApiController::class, 'DeleteRefraccionGeneral']);

// REPORTE DE DIAGNOSTICOS
Route::get('/api/reportes/reporte-diagnosticos', [ReporteDiagnosticosController::class, 'obtenerReporteDiagnosticos']);
Route::get('/api/reportes/reporte-diagnosticos/exportar', [ReporteDiagnosticosController::class, 'exportarExcelDiagnosticos']);

Route::get('/api/ver-consultagenerica/{id}/{id_consulta}', [ConsultaGenericaController::class, 'VerConsultaGenerica']);
Route::get('/api/mostrar-consultagenerica', [ConsultaGenericaController::class, 'mostrarconsultagenerica']);
Route::post('/api/consultagenerica', [ConsultaGenericaController::class, 'Crearconsultagenerica']);
Route::put('/api/consultagenerica/{id}/{id_consulta}', [ConsultaGenericaController::class, 'Editarconsultagenerica']);
Route::delete('/api/consultagenerica/{id}', [ConsultaGenericaController::class, 'Deleteconsultagenerica']);

Route::get('/api/mostrar-historiaclinica', [HistoriaClinicaController::class, 'mostrarHistoriaClinica']);
Route::post('/api/historiaclinica', [HistoriaClinicaController::class, 'CrearHistoriaClinica']);
Route::put('/api/historiaclinica/{id}', [HistoriaClinicaController::class, 'EditarHistoriaClinica']);
Route::delete('/api/historiaclinica/{id}', [HistoriaClinicaController::class, 'DeleteHistoriaClinica']);

Route::get('/api/ultimaAtencion', [PacientesApiController::class, 'mostrarUltimaAtencionPacientes']);
Route::get('/api/pacientesConsultasDiarias', [PacientesApiController::class, 'PacientesConsultasDiarias']);
Route::get('/api/pacientesTerapiasDiarias', [PacientesApiController::class, 'PacientesTerapiasDiarias']);
Route::get('/api/pacientesSinAtender', [PacientesApiController::class, 'mostrarCantidadPacientesSinAtender']);
Route::get('/api/pacientesAtendidosPorDiaV2', [PacientesApiController::class, 'MostrarPacientesAtendidosPorDiaV2']);
Route::get('/api/todosLospacientesSinAtender', [PacientesApiController::class, 'mostrarTodosLosPacientesSinAtender']);
Route::post('/api/proximascitas', [PacientesApiController::class, 'MostrarProximasCitas']);

Route::put('/api/actualizarcontacto', [PacientesApiController::class, 'actualizarContacto']);
Route::put('/api/actualizarNota', [PacientesApiController::class, 'actualizarNota']);

Route::put('/api/actualizaragendo', [PacientesApiController::class, 'actualizarAgendo']);

Route::post('/api/verificar-cedula', [PacientesApiController::class, 'verificarCedula']);

Route::get('/api/recetas', [RecetasApiController::class, 'recetas']);
Route::post('/api/recetas', [RecetasApiController::class, 'crearRecetas']);
Route::delete('/api/recetas/{id}', [RecetasApiController::class, 'eliminarReceta']);
Route::get('/api/recetas/{id}', [RecetasApiController::class, 'verReceta']);
Route::put('/api/recetas/{id}', [RecetasApiController::class, 'editarReceta']);

Route::post('/api/documentos/subir', [DocumentosPacientesApiController::class, 'uploadDocument']);
Route::get('/api/documentos/{idPaciente}', [DocumentosPacientesApiController::class, 'index']);










Route::delete('/api/documentos/{idDocumento}', [DocumentosPacientesApiController::class, 'destroy']);


















Route::get('/api/terapias_bajav/{id_paciente}/{id_terapia}', [Terapias_Bajav_ApiController::class, 'verUnaTerapias_Bajav']);
Route::get('/api/terapias_bajav/{id_paciente}', [Terapias_Bajav_ApiController::class, 'verTerapias_Bajav']);
Route::post('/api/terapias_bajav', [Terapias_Bajav_ApiController::class, 'crearTerapias_Bajav']);
Route::put('/api/terapias_bajav/{id}', [Terapias_Bajav_ApiController::class, 'editarTerapias_Bajav']);
Route::delete('/api/terapias_bajav/{id}', [Terapias_Bajav_ApiController::class, 'eliminarTerapias_Bajav']);

Route::get('/api/terapias_optometria_neonatos/{id_paciente}/{id_terapia}', [Terapias_Optometria_Neonatos_ApiController::class, 'verUnaTerapias_optometria_neonatos']);
Route::get('/api/terapias_optometria_neonatos/{id_paciente}', [Terapias_Optometria_Neonatos_ApiController::class, 'verTerapias_optometria_neonatos']);
Route::post('/api/terapias_optometria_neonatos', [Terapias_Optometria_Neonatos_ApiController::class, 'crearTerapias_optometria_neonatos']);
Route::put('/api/terapias_optometria_neonatos/{id_terapia}', [Terapias_Optometria_Neonatos_ApiController::class, 'editarTerapias_optometria_neonatos']);
Route::delete('/api/terapias_optometria_neonatos/{id_terapia}', [Terapias_Optometria_Neonatos_ApiController::class, 'eliminarTerapias_optometria_neonatos']);

Route::get('/api/terapias_optometria_pediatrica/{id_paciente}/{id_terapia}', [Terapias_Optometria_Pediatrica_ApiController::class, 'verUnaTerapias_optometria_pediatrica']);
Route::get('/api/terapias_optometria_pediatrica/{id_paciente}', [Terapias_Optometria_Pediatrica_ApiController::class, 'verTerapias_optometria_pediatrica']);
Route::post('/api/terapias_optometria_pediatrica', [Terapias_Optometria_Pediatrica_ApiController::class, 'crearTerapias_optometria_pediatrica']);
Route::put('/api/terapias_optometria_pediatrica/{id}', [Terapias_Optometria_Pediatrica_ApiController::class, 'editarTerapias_optometria_pediatrica']);
Route::delete('/api/terapias_optometria_pediatrica/{id_terapia}', [Terapias_Optometria_Pediatrica_ApiController::class, 'eliminarTerapias_optometria_pediatrica']);

Route::get('/api/terapias_ortoptica_adultos/{id_paciente}/{id_terapia}', [Terapias_Ortoptica_Adultos_ApiController::class, 'verUnaTerapias_ortoptica_adultos']);
Route::get('/api/terapias_ortoptica_adultos/{id_terapia}', [Terapias_Ortoptica_Adultos_ApiController::class, 'verTerapias_ortoptica_adultos']);
Route::post('/api/terapias_ortoptica_adultos', [Terapias_Ortoptica_Adultos_ApiController::class, 'crearTerapias_ortoptica_adultos']);
Route::put('/api/terapias_ortoptica_adultos/{id}', [Terapias_Ortoptica_Adultos_ApiController::class, 'editarTerapias_ortoptica_adultos']);
Route::delete('/api/terapias_ortoptica_adultos/{id_paciente}', [Terapias_Ortoptica_Adultos_ApiController::class, 'eliminarTerapias_ortoptica_adultos']);

Route::get('/api/terapia_bajav/{id_paciente}/{id_terapia}/{id_sesion}', [Terapia_Bajav_ApiController::class, 'verUnaTerapia_Bajav']);
Route::delete('/api/terapia_bajav/{id_sesion}', [Terapia_Bajav_ApiController::class, 'eliminarTerapia_bajav']);
Route::get('/api/terapia_bajav/{id_terapia}', [Terapia_Bajav_ApiController::class, 'verTerapia_Bajav']);
Route::put('/api/terapia_bajav/{id_sesion}', [Terapia_Bajav_ApiController::class, 'editarTerapia_bajav']);
Route::post('/api/terapia_bajav', [Terapia_Bajav_ApiController::class, 'crearTerapia_Bajav']);

Route::get('/api/terapia_optometria_neonatos/{id_paciente}/{id_terapia}/{id_sesion}', [Terapia_Optometria_Neonatos_ApiController::class, 'verUnaTerapia_optometria_neonatos']);
Route::get('/api/terapia_optometria_neonatos/{id_terapia}', [Terapia_Optometria_Neonatos_ApiController::class, 'verTerapia_optometria_neonatos']);
Route::post('/api/terapia_optometria_neonatos', [Terapia_Optometria_Neonatos_ApiController::class, 'crearTerapia_optometria_neonatos']);
Route::put('/api/terapia_optometria_neonatos/{id_sesion}', [Terapia_Optometria_Neonatos_ApiController::class, 'editarTerapia_optometria_neonatos']);
Route::delete('/api/terapia_optometria_neonatos/{id_sesion}', [Terapia_Optometria_Neonatos_ApiController::class, 'eliminarTerapia_optometria_neonatos']);

Route::get('/api/terapia_optometria_pediatrica/{id_paciente}/{id_terapia}/{id_sesion}', [Terapia_Optometria_Pediatrica_ApiController::class, 'verUnaTerapia_optometria_pediatrica']);
Route::get('/api/terapia_optometria_pediatrica/{id_terapia}', [Terapia_Optometria_Pediatrica_ApiController::class, 'verTerapia_optometria_pediatrica']);
Route::post('/api/terapia_optometria_pediatrica', [Terapia_Optometria_Pediatrica_ApiController::class, 'crearTerapia_optometria_pediatrica']);
Route::put('/api/terapia_optometria_pediatrica/{id_sesion}', [Terapia_Optometria_Pediatrica_ApiController::class, 'editarTerapia_optometria_pediatrica']);
Route::delete('/api/terapia_optometria_pediatrica/{id_sesion}', [Terapia_Optometria_Pediatrica_ApiController::class, 'eliminarTerapia_optometria_pediatrica']);

Route::get('/api/terapia_ortoptica_adultos/{id_paciente}/{id_terapia}/{id_sesion}', [Terapia_Ortoptica_Adultos_ApiController::class, 'verUnaTerapia_ortoptica_adultos']);
Route::get('/api/terapia_ortoptica_adultos/{id_terapia}', [Terapia_Ortoptica_Adultos_ApiController::class, 'verTerapia_ortoptica_adultos']);
Route::post('/api/terapia_ortoptica_adultos', [Terapia_Ortoptica_Adultos_ApiController::class, 'crearTerapia_ortoptica_adultos']);
Route::put('/api/terapia_ortoptica_adultos/{id_sesion}', [Terapia_Ortoptica_Adultos_ApiController::class, 'editarTerapia_ortoptica_adultos']);
Route::delete('/api/terapia_ortoptica_adultos/{id_sesion}', [Terapia_Ortoptica_Adultos_ApiController::class, 'eliminarTerapia_ortoptica_adultos']);

Route::get('/api/servicios', [ServiciosApiController::class, 'index']);
Route::post('/api/servicios/store', [ServiciosApiController::class, 'store']);
Route::put('/api/servicios/update/{id}', [ServiciosApiController::class, 'update']);
Route::delete('/api/servicios/delete/{id}', [ServiciosApiController::class, 'destroy']);

Route::get('/api/reportes-servicios-realizados', [PacientesApiController::class, 'obtenerConsultasConServicios']);

Route::get('/api/reportes-servicios-proximos', [PacientesApiController::class, 'obtenerConsultasConServiciosProximos']);

Route::post('/api/ordenes', [OrdenesApiController::class, 'createOrdenes']);

Route::post('/api/verOrdenes', [OrdenesApiController::class, 'ordenes']);

Route::put('/api/ordenes/{id}', [OrdenesApiController::class, 'updateOrden']);

Route::delete('/api/ordenes/{id}', [OrdenesApiController::class, 'deleteOrden']);

Route::get('/api/ordenes/pdf/{id}', [OrdenesApiController::class, 'verOrdenPdf']);
Route::get('/api/ordenes/correcion/pdf/{id}/{numero_correcion}', [OrdenesApiController::class, 'verCorrecionPdf']);

Route::get('/api/quote/pdf/{id}', [QuotePdfController::class, 'verCotizacionPdf']);

Route::get('/api/ordenes/contacto-orden/{id}', [OrdenesApiController::class, 'verContactoOrden']);

Route::get('/api/tipos-fases-ordenes/{idOrden}', [OrdenesApiController::class, 'tipoFasesOrdenes']);

Route::post('/api/tipos-fases-ordenes', [OrdenesApiController::class, 'createTiposFasesOrdenes']);

Route::get('/api/fases-ordenes', [OrdenesApiController::class, 'fasesOrdenes']);

Route::put('/api/fases-ordenes/{id}', [OrdenesApiController::class, 'updateFasesOrdenes']);

Route::post('/api/create-fases-ordenes', [OrdenesApiController::class, 'createFasesOrdenes']);

Route::get('/api/reporte-ordenes-2', [OrdenesApiController::class, 'reportesOrdenes2']);


Route::get('/api/ordenes/{id}', [OrdenesApiController::class, 'ordenesDelPaciente']);

Route::get('/api/ordenes/{id}/tiempo-sin-orden', [OrdenesApiController::class, 'diasOMesesDesdeUltimaOrden']);

Route::get('/api/paciente/orden/{id_paciente}/{nro_orden}', [OrdenesApiController::class, 'obtenerOrdenPaciente']);

Route::post('/api/whatsapp-link', [WhatsappApiController::class, 'getWhatsAppLink']);

Route::get('/api/contacto-orden', [ContactosOrdenesApiController::class, 'index']);

Route::post('/api/contacto-orden', [ContactosOrdenesApiController::class, 'store']);

Route::post('/api/kpis', [KpisApiController::class, 'VerKpis']);

Route::post('/api/kpis/asesores', [KpisApiController::class, 'VerKpisAsesores']);

Route::post('/api/kpis/doctores', [KpisApiController::class, 'VerKpisDoctores']);

Route::post('/api/kpis/doctor-ordenes', [KpisApiController::class, 'getDoctorOrdersStats']);

Route::post('/api/kpis/fases-ordenes', [KpisApiController::class, 'getDoctorFases']);

Route::post('/api/kpis/status-ordenes', [KpisApiController::class, 'getDoctorStatus']);

Route::post('/api/kpis/asesor-ordenes', [KpisApiController::class, 'getAsesoresOrdersStats']);

Route::post('/api/kpis/asesor-fases', [KpisApiController::class, 'getAsesoresFases']);

Route::post('/api/kpis/asesor-status', [KpisApiController::class, 'getAsesorStatus']);

Route::get('/api/kpis/sucursales-consultas', [KpisApiController::class, 'getConsultasPorFecha']);

Route::get('/api/kpis/doctores-consultas', [KpisApiController::class, 'getConsultasPorFechaDoctores']);

Route::post('/api/kpis/promedio-fases-ordenes', [KpisApiController::class, 'PromedioFasesOrdenes']); // todos los registros + tiempo promedio

Route::post('/api/kpis/promedio-fases-ordenes-resumen', [KpisApiController::class, 'PromedioFasesOrdenesResumen']); // solo tiempo promedio + totalcount

Route::post('/api/kpis/tipo-cristales', [KpisApiController::class, 'countCrystalTypes']);

Route::post('/api/kpis/lente-ordenes', [KpisApiController::class, 'getOrdersGroupedByDate']);

Route::post('/api/kpis/lente-ordenes-sucursal', [KpisApiController::class, 'obtenerLentesPorSucursal']);

Route::post('/api/kpis/lente-ordenes-asesores', [KpisApiController::class, 'obtenerLentesPorUsuario']);

Route::post('/api/kpis/lente-ordenes-doctores', [KpisApiController::class, 'obtenerLentesPorDoctor']);

Route::post('/api/kpis/update-tipo-cristales', [KpisApiController::class, 'actualizarCristales']);

Route::get('/api/correciones-ordenes', [CorrecionesOrdenesController::class, 'VerCorrecionesOrdenes']);

Route::put('/api/correciones-ordenes/{id}', [CorrecionesOrdenesController::class, 'updateCorreccionOrden']);

Route::get('/api/correciones-ordenes/{id}', [CorrecionesOrdenesController::class, 'getCorreccionesPorOrden']);

Route::delete('/api/correciones-ordenes', [CorrecionesOrdenesController::class, 'DeleteCorrecionesOrdenes']);

Route::post('/api/correciones-ordenes', [CorrecionesOrdenesController::class, 'CreateCorrecionesOrdenes']);

Route::post('/api/create-fases-correccion-ordenes', [CorrecionesOrdenesController::class, 'createFasesCorrecionesOrdenes']);

Route::get('/api/fases-correciones-ordenes', [CorrecionesOrdenesController::class, 'fasesCorreccionesOrdenes']);

Route::post('/api/create-fases-correciones-ordenes', [CorrecionesOrdenesController::class, 'createFasesCorrecionesOrdenes']);

Route::put('/api/fases-correciones-ordenes/{id}', [CorrecionesOrdenesController::class, 'updateFasesCorreccionesOrdenes']);

Route::get('/api/correciones-ordenes/contacto-correccion-orden/{id}', [CorrecionesOrdenesController::class, 'verContactoCorreccionOrden']);

Route::get('/api/cont-correccion-orden', [ContactosCorreccionesOrdenesApiController::class, 'index']);

Route::post('/api/cont-correccion-orden', [ContactosCorreccionesOrdenesApiController::class, 'store']);

Route::delete('/api/migration', [OrdenesApiController::class, 'migrarNroOrdenes']);

Route::get('/api/allordenes', [OrdenesApiController::class, 'getOrdenesConTotal']);

Route::get('/api/cristales', [CristalesApiController::class, 'index']);

Route::post('/api/cristales', [CristalesApiController::class, 'create']);

Route::put('/api/cristales/{id}', [CristalesApiController::class, 'update']);

Route::delete('/api/cristales/{id}', [CristalesApiController::class, 'delete']);

Route::post('/api/cristales/data', [CristalesApiController::class, 'resetAndInsert']);

Route::get('/api/materiales', [MaterialesApiController::class, 'index']);

Route::post('/api/materiales', [MaterialesApiController::class, 'create']);

Route::put('/api/materiales/{id}', [MaterialesApiController::class, 'update']);

Route::delete('/api/materiales/{id}', [MaterialesApiController::class, 'delete']);

Route::get('/api/tratamientos', [TratamientosApiController::class, 'index']);

Route::post('/api/tratamientos', [TratamientosApiController::class, 'create']);

Route::put('/api/tratamientos/{id}', [TratamientosApiController::class, 'update']);

Route::delete('/api/tratamientos/{id}', [TratamientosApiController::class, 'delete']);

Route::get('/api/marcas', [MarcasApiController::class, 'index']);

Route::post('/api/marcas', [MarcasApiController::class, 'create']);

Route::delete('/api/marcas/{id}', [MarcasApiController::class, 'delete']);

Route::put('/api/marcas/{id}', [MarcasApiController::class, 'update']);

Route::get('/api/tipos-aros', [TiposArosApiController::class, 'index']);

Route::post('/api/tipos-aros', [TiposArosApiController::class, 'create']);

Route::delete('/api/tipos-aros/{id}', [TiposArosApiController::class, 'delete']);

Route::put('/api/tipos-aros/{id}', [TiposArosApiController::class, 'update']);

Route::post('/api/kpis/terapias-consultas-doctor', [KpisApiController::class, 'getConsultasYTerapiasPorDoctor']);

Route::post('/api/kpis/terapias-consultas-sucursales', [KpisApiController::class, 'getConsultasYTerapiasPorSucursal']);

Route::post('/api/kpis/consultas-doctores', [KpisApiController::class, 'getConsultasYTerapiasPorConsultaDoctor']);

Route::post('/api/kpis/terapias-doctores', [KpisApiController::class, 'getConsultasYTerapiasPorTerapiaDoctor']);

Route::post('/api/kpis/consultas-sucursales', [KpisApiController::class, 'getConsultasYTerapiasPorConsultaSucursal']);

Route::post('/api/kpis/terapias-sucursales', [KpisApiController::class, 'getConsultasYTerapiasPorTerapiaSucursal']);

Route::post('/api/kpis/terapias-consultas-consulta-sucursal', [KpisApiController::class, 'getConsultasYTerapiasPorConsultaSucursal']);

Route::post('/api/kpis/tipo-cristal-esfera-cilindro-ordenes', [KpisApiController::class, 'getEstadisticasTipoCristalCiliEsf']);

Route::get('/api/ordenes/pdf/size/{id}', [OrdenesApiController::class, 'verOrdenPdfSize']);

Route::get('/api/ordenes/pdf/small/{id}', [OrdenesApiController::class, 'verOrdenPdfSmall']);

Route::put('/api/ordenes/cancelada/{id}', [OrdenesApiController::class, 'updateOrdenCancelada']);

Route::get('/preview-email', function () {
    return View::make('emails.verify', ['code' => '123456']);
});

Route::post('/api/send-verification-email', [EmailController::class, 'sendVerificationEmail']);

Route::post('/api/obtener-ordenes', [OrdenesApiController::class, 'obtenerOrdenes']);



Route::post('/api/obtener-correcciones-ordenes/{id_orden}', [CorrecionesOrdenesController::class, 'ObtenerCorrecionesOrdenes']);

Route::get('/api/obtener-correccion/{id_correccion}', [CorrecionesOrdenesController::class, 'obtenerCorreccion']);

Route::get('/api/reporte-ordenes', [OrdenesApiController::class, 'reporteOrdenes']);

Route::get('/api/ver-eventos', [AgendaApiController::class, 'getEvents']);

Route::get('/api/menciones/pacientes', [PacientesApiController::class, 'buscarPacientes']);

Route::get('/api/proximas-citas/generar', [AgendaApiController::class, 'generarDataProximasCitas']);

Route::post('/api/citas', [AgendaApiController::class, 'verEventosAgenda']);

Route::get('/api/proximos-servicios/servicios-realizados', [ServiciosApiController::class, 'getServiciosProximos']);

Route::get('/api/search/ordenes', [OrdenesApiController::class, 'searchOrdenes']);

Route::post('/api/citas/agendar', [AgendaApiController::class, 'agendarCita']);
Route::post('/api/citas/confirmar', [AgendaApiController::class, 'confirmarCita']);

Route::delete('/api/citas/delete/{id}', [AgendaApiController::class, 'deleteCita']);

Route::get('/api/proveedor-material', [ProveedorMaterialApiController::class, 'index']);

Route::get('/api/proveedor-material/{id}', [ProveedorMaterialApiController::class, 'show']);

Route::post('/api/proveedor-material', [ProveedorMaterialApiController::class, 'store']);

Route::put('/api/proveedor-material/{id}', [ProveedorMaterialApiController::class, 'update']);

Route::delete('/api/proveedor-material/{id}', [ProveedorMaterialApiController::class, 'destroy']);

Route::get('/api/usuario/conversaciones/{id}', [UsuariosApiController::class, 'getUserConversations']);

Route::get('/api/usuarios/conversaciones/{id}', [UsuariosApiController::class, 'getUsersWithConversations']);

Route::get('/api/usuarios/exclude', [UsuariosApiController::class, 'getUsersExceptOne']);

Route::get('download/{fileId}', [DownloadController::class, 'download']);

Route::post('/api/upload', [DownloadController::class, 'upload']);

Route::post('/api/verificar-interfuerza', [InterfuerzaController::class, 'verificarYActualizar']);

Route::put('/api/citas/update/{id}', [AgendaApiController::class, 'updateCita']);

Route::post('/api/quote/create', [interfuerzaApiControllerQuotes::class, 'createQuote']);

Route::get('/api/customers/get', [interfuerzaApiControllerCustomers::class, 'getCustomers']);

Route::get('/api/ware-houses/get', [interfuerzaApiControllerWareHouses::class, 'getWareHouses']);



Route::get('/api/products/get', [interfuerzaApiControllerProducts::class, 'getProducts']);

Route::get('/api/obtener/quotes/centevi', [QuoterApiController::class, 'obtenerQuotes']);

Route::get('/api/ver/quote/centevi/{id}', [QuoterApiController::class, 'verUnaCotizacion']);

Route::post('/api/crear/quote/centevi', [QuoterApiController::class, 'crearQoute']);

Route::put('/api/update/quote/centevi/{id}', [QuoterApiController::class, 'updateEstadoInterfuerza']);

// rutas quoteTimeline - seguimiento de cotizacion
Route::get('/api/quote-timeline/for-quote/{quoteId}', [QuoteTimelineApiController::class, 'getAllQuoteTimelinesByQuoteId']);

Route::post('/api/quote-timeline', [QuoteTimelineApiController::class, 'createQuoteTimeline']);

Route::put('/api/quote-timeline/{id}', [QuoteTimelineApiController::class, 'updateQuoteTimeline']);

Route::delete('/api/quote-timeline/{id}', [QuoteTimelineApiController::class, 'destroyQuoteTimeline']);

Route::post('/api/prueba/orden', [OrdenesApiController::class, 'pruebaobtenerOrdenes']);

Route::get('/api/products', [ProductsInterfuerzaApiController::class, 'obtenerProductos']);

Route::post('/api/crear/products', [ProductsInterfuerzaApiController::class, 'crearProducts']);

Route::post('/api/migration/products', [ProductsInterfuerzaApiController::class, 'migrationProductsInterfuerza']);

Route::delete('/api/delete/products', [ProductsInterfuerzaApiController::class, 'deleteProductoInterfuerza']);

Route::post('/api/verify/products', [interfuerzaApiControllerProducts::class, 'verifyProduct']);

Route::post('/api/verify/quotes', [interfuerzaApiControllerQuotes::class, 'findQuotesByIds']);

Route::get('/api/ventas', [VentasApiController::class, 'reportes']);

Route::post('/api/ventas/download-data', [VentasApiController::class, 'export']);

Route::get('/api/warehouses/index', [WarehouseController::class, 'index']);

Route::post('/api/warehouses/sync', [WarehouseController::class, 'syncFromInterfuerza']);

Route::post('/api/warehouses/sync', [WarehouseController::class, 'syncFromInterfuerza']);

Route::patch('/api/warehouses/{id}/send-discount', [WarehouseController::class, 'updateSendDiscount']);

Route::patch('/api/warehouses/{id}/updateSucursal', [WarehouseController::class, 'updateSucursal']);

Route::get('/api/diagnosticos/obtener-diagnosticos', [DiagnosticoPacienteController::class, 'mostrarDiagnosticos']);
Route::post('/api/diagnosticos/crearDiagnosticos', [DiagnosticoPacienteController::class, 'store']);
Route::put('/api/diagnosticos/{id}/actualizarDiagnosticos', [DiagnosticoPacienteController::class, 'update']);
Route::delete('/api/diagnosticos/{id}/eliminarDiagnosticos', [DiagnosticoPacienteController::class, 'destroy']);




Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
