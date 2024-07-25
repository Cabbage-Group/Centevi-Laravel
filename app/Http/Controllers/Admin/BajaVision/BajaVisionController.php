<?php

namespace App\Http\Controllers\Admin\BajaVision;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BajaVisionController extends Controller
{
    public function bajavision()
    {
        return view('admin.bajavision.bajavision');
    }
}
