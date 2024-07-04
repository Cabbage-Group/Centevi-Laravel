<?php

use App\Http\Controllers\Admin\Sucursales\SucursalesController;
use App\Http\Controllers\Admin\Usuarios\UsuariosController;
use App\Http\Controllers\Auth\homeController;
use App\Http\Controllers\Auth\indexController;
use App\Http\Controllers\Auth\loginController;
use App\Http\Controllers\Admin\Pacientes\pacienteController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\BajaVision\BajaVisionController;
use App\Http\Controllers\Admin\HistoriaClinica\HistoriaClinicaController;
use App\Http\Controllers\Admin\OptometriaNeonatos\OptometriaNeonatosController;
use App\Http\Controllers\Admin\OptometriaPediatrica\OptometriaPediatricaController;

Route::get('/', [indexController::class, 'index']);

Route::get('login', [loginController::class, 'login']);

Route::get('usuarios', [UsuariosController::class, 'usuarios']);

Route::get('sucursales', [SucursalesController::class, 'sucursales']);

Route::get('home', [homeController::class, 'home'])->name('home');

Route::get('crear-paciente', [pacienteController::class, 'crearPaciente']);

Route::get('pacientes', [pacienteController::class, 'pacientes']);

Route::get('baja-vision', [BajaVisionController::class, 'bajavision']);

Route::get('consulta-generica', [HistoriaClinicaController::class, 'historiaclinica']);

Route::get('optometria-neonatos', [OptometriaNeonatosController::class, 'optometrianeonatos']);

Route::get('optometria-pediatrica', [OptometriaPediatricaController::class, 'optometriapediatrica']);




