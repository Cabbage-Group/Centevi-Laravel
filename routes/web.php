<?php

use App\Http\Controllers\Admin\Consultas\ConsultasController;
use App\Http\Controllers\Admin\Sucursales\SucursalesController;
use App\Http\Controllers\Admin\Usuarios\UsuariosController;
use App\Http\Controllers\Admin\Home\homeController;
use App\Http\Controllers\Auth\indexController;
use App\Http\Controllers\Auth\loginController;
use App\Http\Controllers\Admin\Pacientes\PacienteContoller;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [indexController::class, 'index']);

Route::get('login', [loginController::class, 'login']);

Route::get('usuarios', [UsuariosController::class, 'usuarios']);

Route::get('sucursales', [SucursalesController::class, 'sucursales']);

Route::get('home', [homeController::class, 'home'])->name('home');

Route::get('crear-paciente', [PacienteContoller::class, 'crearPaciente']);

Route::get('optometria-general', [ConsultasController::class, 'ObtometriaGeneral']);

Route::get('ortoptica-vision-binocul', [ConsultasController::class, 'OrtopticaVisionBinocul']);

