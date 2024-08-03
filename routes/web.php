<?php


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
use App\Models\Pacientes;

Route::get('/api/usuarios', [UsuariosApiController::class, 'usuarios']);
Route::get('/api/pacientes', [PacientesApiController::class, 'pacientes']);
Route::get('/api/pacientes/{id}', [PacientesApiController::class, 'VerPaciente']);
Route::get('/api/sucursales', [SucursalesApiController::class, 'sucursales']);


Route::post('/api/register', [LoginApiController::class, 'register']);
Route::post('/api/login', [LoginApiController::class,'login']);

Route::put('/api/usuarios/{id}', [UsuariosApiController::class, 'update']);


Route::post('/api/pacientes', [PacientesApiController::class, 'crearpaciente']);

Route::put('/api/pacientes/{id}', [PacientesApiController::class, 'editarpaciente']);

Route::delete('/api/pacientes/{id}', [PacientesApiController::class, 'eliminarpaciente']);

Route::get('/api/obtenerconsultagenerica/{paciente_id}', [PacientesApiController::class, 'obtenerconsultagenerica']);

Route::get('/api/mostrar-neonatos', [NeonatosApiController::class, 'mostrarOptometriaNeonatos']);
Route::post('/api/neonatos', [NeonatosApiController::class, 'CrearNeonatos']);
Route::put('/api/neonatos/{id}', [NeonatosApiController::class, 'EditarNeonatos']);
Route::delete('/api/neonatos/{id}', [NeonatosApiController::class, 'DeleteNeonatos']);
Route::get('/api/neonatos', [NeonatosApiController::class, 'ObtenerNeonatos']);

Route::get('/api/mostrar-pediatrica', [PediatricaApiController::class, 'mostrarOptometriaPediatrica']);
Route::post('/api/pediatrica', [PediatricaApiController::class, 'crearPediatrica']);
Route::put('/api/pediatrica/{id}', [PediatricaApiController::class, 'editarPediatrica']);
Route::delete('/api/pediatrica/{id}', [PediatricaApiController::class, 'eliminarPediatrica']);

Route::get('/api/ver-ortoptica/{id}', [OrtopticaApiController::class, 'VerOrtoptica']);
Route::get('/api/mostrar-ortoptica', [OrtopticaApiController::class, 'mostrarOrtopticaAdultos']);
Route::post('/api/ortoptica', [OrtopticaApiController::class, 'CrearOrtoptica']);
Route::put('/api/ortoptica/{id}', [OrtopticaApiController::class, 'EditarOrtoptica']);
Route::delete('/api/ortoptica/{id}', [OrtopticaApiController::class, 'DeleteOrtoptica']);

Route::get('/api/mostrar-bajavision', [BajaVisionApiController::class, 'mostrarBajaVision']);
Route::post('/api/bajavision', [BajaVisionApiController::class, 'CrearBajaVision']);
Route::put('/api/bajavision/{id}', [BajaVisionApiController::class, 'EditarBajaVision']);
Route::delete('/api/bajavision/{id}', [BajaVisionApiController::class, 'DeleteBajaVision']);

Route::get('/api/mostrar-refraccion', [OptometriaGeneralApiController::class, 'mostrarRefraccionGeneral']);
Route::post('/api/ObtometriaGeneral', [OptometriaGeneralApiController::class, 'CrearRefraccionGeneral']);
Route::put('/api/ObtometriaGeneral/{id}', [OptometriaGeneralApiController::class, 'EditarRefraccionGeneral']);
Route::delete('/api/ObtometriaGeneral/{id}', [OptometriaGeneralApiController::class, 'DeleteRefraccionGeneral']);

Route::get('/api/mostrar-consultagenerica', [ConsultaGenericaController::class, 'mostrarconsultagenerica']);
Route::post('/api/consultagenerica', [ConsultaGenericaController::class, 'Crearconsultagenerica']);
Route::put('/api/consultagenerica/{id}', [ConsultaGenericaController::class, 'Editarconsultagenerica']);
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


Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');


