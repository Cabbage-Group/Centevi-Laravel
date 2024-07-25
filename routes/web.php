<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\usuarios\UsuariosApiController;
use App\Http\Controllers\API\sucursales\SucursalesApiController;
use App\Http\Controllers\API\pacientes\PacientesApiController;
use App\Http\Controllers\API\login\LoginApiController;


Route::get('/api/usuarios', [UsuariosApiController::class, 'usuarios']);
Route::get('/api/pacientes', [PacientesApiController::class, 'pacientes']);
Route::get('/api/sucursales', [SucursalesApiController::class, 'sucursales']);


Route::post('/api/register', [LoginApiController::class, 'register']);
Route::post('/api/login', [LoginApiController::class,'login']);

Route::put('/api/usuarios/{id}', [UsuariosApiController::class, 'update']);

Route::post('/api/pacientes', [PacientesApiController::class, 'crearpaciente']);

Route::put('/api/pacientes/{id}', [PacientesApiController::class, 'editarpaciente']);

Route::delete('/api/pacientes/{id}', [PacientesApiController::class, 'eliminarpaciente']);

Route::get('/api/obtenerHistoriaClinica/{paciente_id}', [PacientesApiController::class, 'obtenerHistoriaClinica']);

Route::get('/api/ultimaAtencion', [PacientesApiController::class, 'mostrarUltimaAtencionPacientes']);

Route::get('/api/pacientesConsultasDiarias', [PacientesApiController::class, 'PacientesConsultasDiarias']);

Route::get('/api/pacientesTerapiasDiarias', [PacientesApiController::class, 'PacientesTerapiasDiarias']);

Route::get('/api/pacientesSinAtender', [PacientesApiController::class, 'mostrarCantidadPacientesSinAtender']);

Route::get('/api/pacientesAtendidosPorDiaV2', [PacientesApiController::class, 'MostrarPacientesAtendidosPorDiaV2']);

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');


