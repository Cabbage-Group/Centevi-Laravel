<?php

use App\Http\Controllers\API\reportes\ReportesApiController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\usuarios\UsuariosApiController;
use App\Http\Controllers\API\sucursales\SucursalesApiController;
use App\Http\Controllers\API\pacientes\PacientesApiController;
use App\Http\Controllers\API\login\LoginApiController;
use App\Http\Controllers\API\consultas\NeonatosApiController;
use App\Http\Controllers\API\consultas\PediatricaApiController;

Route::get('/api/usuarios', [UsuariosApiController::class, 'usuarios']);
Route::get('/api/pacientes', [PacientesApiController::class, 'pacientes']);
Route::get('/api/sucursales', [SucursalesApiController::class, 'sucursales']);
Route::get('/api/reportes', [ReportesApiController::class, 'reportes']);

Route::post('/api/register', [LoginApiController::class, 'register']);
Route::post('/api/login', [LoginApiController::class,'login']);

Route::put('/api/usuarios/{id}', [UsuariosApiController::class, 'update']);

Route::post('/api/neonatos', [NeonatosApiController::class, 'CrearNeonatos']);
Route::put('/api/neonatos/{id}', [NeonatosApiController::class, 'EditarNeonatos']);
Route::delete('/api/neonatos/{id}', [NeonatosApiController::class, 'DeleteNeonatos']);
Route::get('/api/neonatos', [NeonatosApiController::class, 'ObtenerNeonatos']);

Route::post('/api/pediatrica', [PediatricaApiController::class, 'crearPediatrica']);
Route::put('/api/pediatrica/{id}', [PediatricaApiController::class, 'editarPediatrica']);
Route::delete('/api/pediatrica/{id}', [PediatricaApiController::class, 'eliminarPediatrica']);

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');


