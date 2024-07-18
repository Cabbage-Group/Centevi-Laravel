<?php

use App\Http\Controllers\API\reportes\ReportesApiController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\usuarios\UsuariosApiController;
use App\Http\Controllers\API\sucursales\SucursalesApiController;
use App\Http\Controllers\API\pacientes\PacientesApiController;
use App\Http\Controllers\API\login\LoginApiController;

Route::get('/api/usuarios', [UsuariosApiController::class, 'usuarios']);
Route::get('/api/pacientes', [PacientesApiController::class, 'pacientes']);
Route::get('/api/sucursales', [SucursalesApiController::class, 'sucursales']);
Route::get('/api/reportes', [ReportesApiController::class, 'reportes']);

Route::post('/api/register', [LoginApiController::class, 'register']);
Route::post('/api/login', [LoginApiController::class,'login']);

Route::put('/api/usuarios/{id}', [UsuariosApiController::class, 'update']);

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');


