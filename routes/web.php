<?php

use App\Http\Controllers\homeController;
use App\Http\Controllers\indexController;
use App\Http\Controllers\loginController;
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


