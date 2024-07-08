<?php

namespace App\Http\Controllers\Admin\Consultas\OptometriaNeonatos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OptometriaNeonatosController extends Controller
{
    public function optometrianeonatos()
    {
        return view('admin.consulta.optometrianeonatos.optometrianeonatos');
    }
}
