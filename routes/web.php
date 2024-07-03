<?php

use App\Http\Controllers\homeController;
use App\Http\Controllers\indexController;
use App\Http\Controllers\loginController;
use App\Http\Controllers\Admin\Sucursales\SucursalesController;
use App\Http\Controllers\Admin\Usuarios\UsuariosController;
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

Route::get('home', [homeController::class, 'home']);

Route::get('usuarios', [UsuariosController::class, 'usuarios']);

Route::get('sucursales', [SucursalesController::class, 'sucursales']);
