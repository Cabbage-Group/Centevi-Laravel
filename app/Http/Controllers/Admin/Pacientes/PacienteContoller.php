<?php

namespace App\Http\Controllers\Admin\Pacientes;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PacienteContoller extends Controller
{
    public function crearPaciente(){
        return view('admin.Paciente.crearPaciente');
    }
}
