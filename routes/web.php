<?php

use App\Http\Controllers\API\reportes\ReportesApiController;
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
use App\Http\Controllers\API\consultas\HistoriaClinicaApiController;


Route::get('/api/usuarios', [UsuariosApiController::class, 'usuarios']);
Route::get('/api/pacientes', [PacientesApiController::class, 'pacientes']);
Route::get('/api/sucursales', [SucursalesApiController::class, 'sucursales']);
Route::get('/api/reportes', [ReportesApiController::class, 'reportes']);

Route::post('/api/register', [LoginApiController::class, 'register']);
Route::post('/api/login', [LoginApiController::class,'login']);

Route::put('/api/usuarios/{id}', [UsuariosApiController::class, 'update']);


Route::post('/api/pacientes', [PacientesApiController::class, 'crearpaciente']);

Route::put('/api/pacientes/{id}', [PacientesApiController::class, 'editarpaciente']);

Route::delete('/api/pacientes/{id}', [PacientesApiController::class, 'eliminarpaciente']);

Route::get('/api/obtenerHistoriaClinica/{paciente_id}', [PacientesApiController::class, 'obtenerHistoriaClinica']);

Route::post('/api/neonatos', [NeonatosApiController::class, 'CrearNeonatos']);
Route::put('/api/neonatos/{id}', [NeonatosApiController::class, 'EditarNeonatos']);
Route::delete('/api/neonatos/{id}', [NeonatosApiController::class, 'DeleteNeonatos']);
Route::get('/api/neonatos', [NeonatosApiController::class, 'ObtenerNeonatos']);

Route::post('/api/pediatrica', [PediatricaApiController::class, 'crearPediatrica']);
Route::put('/api/pediatrica/{id}', [PediatricaApiController::class, 'editarPediatrica']);
Route::delete('/api/pediatrica/{id}', [PediatricaApiController::class, 'eliminarPediatrica']);

Route::post('/api/ortoptica', [OrtopticaApiController::class, 'CrearOrtoptica']);
Route::put('/api/ortoptica/{id}', [OrtopticaApiController::class, 'EditarOrtoptica']);
Route::delete('/api/ortoptica/{id}', [OrtopticaApiController::class, 'DeleteOrtoptica']);

Route::post('/api/bajavision', [BajaVisionApiController::class, 'CrearBajaVision']);
Route::put('/api/bajavision/{id}', [BajaVisionApiController::class, 'EditarBajaVision']);
Route::delete('/api/bajavision/{id}', [BajaVisionApiController::class, 'DeleteBajaVision']);

Route::post('/api/ObtometriaGeneral', [OptometriaGeneralApiController::class, 'CrearRefraccionGeneral']);
Route::put('/api/ObtometriaGeneral/{id}', [OptometriaGeneralApiController::class, 'EditarRefraccionGeneral']);
Route::delete('/api/ObtometriaGeneral/{id}', [OptometriaGeneralApiController::class, 'DeleteRefraccionGeneral']);

Route::post('/api/historiaclinica', [HistoriaClinicaApiController::class, 'CrearHistoriaClinica']);
Route::put('/api/historiaclinica/{id}', [HistoriaClinicaApiController::class, 'EditarHistoriaClinica']);
Route::delete('/api/historiaclinica/{id}', [HistoriaClinicaApiController::class, 'DeleteHistoriaClinica']);

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');


