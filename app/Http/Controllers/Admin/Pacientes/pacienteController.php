<?php

namespace App\Http\Controllers\Admin\Pacientes;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class pacienteController extends Controller
{
    public function crearPaciente(){
        return view('admin.Paciente.crearPaciente');
    }
}

