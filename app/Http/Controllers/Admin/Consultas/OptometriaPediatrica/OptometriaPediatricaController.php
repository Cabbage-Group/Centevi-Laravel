<?php

namespace App\Http\Controllers\Admin\Consultas\OptometriaPediatrica;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OptometriaPediatricaController extends Controller
{
    public function optometriapediatrica()
    {
        return view('admin.consulta.optometriapediatrica.optometriapediatrica');
    }
}
