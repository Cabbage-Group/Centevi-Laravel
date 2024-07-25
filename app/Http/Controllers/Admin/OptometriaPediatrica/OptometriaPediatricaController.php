<?php

namespace App\Http\Controllers\Admin\OptometriaPediatrica;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OptometriaPediatricaController extends Controller
{
    public function optometriapediatrica()
    {
        return view('admin.optometriapediatrica.optometriapediatrica');
    }
}
