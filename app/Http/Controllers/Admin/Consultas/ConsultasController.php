<?php

namespace App\Http\Controllers\Admin\Consultas;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ConsultasController extends Controller
{
    public function ObtometriaGeneral(){
        return view('admin.consulta.optometriaGeneral');
    }
}
