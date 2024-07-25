<?php

namespace App\Http\Controllers\Admin\Sucursales;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SucursalesController extends Controller
{
    public function sucursales()
    {
        return view('admin.sucursales.sucursales');
    }
}
