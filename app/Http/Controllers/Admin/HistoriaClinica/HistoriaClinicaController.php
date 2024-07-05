<?php

namespace App\Http\Controllers\Admin\HistoriaClinica;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HistoriaClinicaController extends Controller
{
    public function historiaclinica()
    {
        return view('admin.historiaclinica.historiaclinica');
    }
}
