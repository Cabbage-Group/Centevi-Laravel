<?php


use App\Http\Controllers\API\Documentos\DocumentosPacientesApiController;
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
use App\Http\Controllers\API\consultas\HistoriaClinicaApiController;
use App\Http\Controllers\API\recetas\RecetasApiController;
use App\Http\Controllers\API\terapias\Terapia_Bajav_ApiController;
use App\Http\Controllers\API\terapias\Terapias_Bajav_ApiController;


Route::get('/api/usuarios', [UsuariosApiController::class, 'usuarios']);
Route::get('/api/pacientes', [PacientesApiController::class, 'pacientes']);
Route::get('/api/pacientes/{id}', [PacientesApiController::class, 'VerPaciente']);
Route::get('/api/sucursales', [SucursalesApiController::class, 'sucursales']);

Route::post('/api/register', [LoginApiController::class, 'register']);
Route::post('/api/login', [LoginApiController::class,'login']);

Route::put('/api/usuarios/{id}', [UsuariosApiController::class, 'update']);
Route::delete('/api/usuarios/{id}', [UsuariosApiController::class, 'delete']);
Route::post('/api/usuarios', [UsuariosApiController::class, 'add']);

Route::post('/api/pacientes', [PacientesApiController::class, 'crearpaciente']);
Route::put('/api/pacientes/{id}', [PacientesApiController::class, 'editarpaciente']);
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

Route::get('/api/terapia_bajav/{id_paciente}/{id_terapia}/{id_sesion}', [Terapia_Bajav_ApiController::class, 'verUnaTerapia_Bajav']);
Route::delete('/api/terapia_bajav/{id_terapia}/{id_sesion}', [Terapia_Bajav_ApiController::class, 'eliminarTerapia_bajav']);
Route::get('/api/terapia_bajav/{id_terapia}', [Terapia_Bajav_ApiController::class, 'verTerapia_Bajav']);
Route::put('/api/terapia_bajav/{id_sesion}', [Terapia_Bajav_ApiController::class, 'editarTerapia_bajav']);
Route::post('/api/terapia_bajav', [Terapia_Bajav_ApiController::class, 'crearTerapia_Bajav']);



Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');


