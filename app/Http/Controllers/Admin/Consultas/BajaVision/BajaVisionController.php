<?php

namespace App\Http\Controllers\Admin\Consultas\BajaVision;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BajaVisionController extends Controller
{
    public function bajavision()
    {
        return view('admin.consulta.bajavision.bajavision');
    }
}
