<?php

use App\Http\Controllers\Auth\homeController;
use App\Http\Controllers\Auth\indexController;
use App\Http\Controllers\Auth\loginController;
use App\Http\Controllers\Admin\Pacientes\pacienteController;
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

Route::get('home', [homeController::class, 'home'])->name('home');

Route::get('crear-paciente', [pacienteController::class, 'crearPaciente']);

