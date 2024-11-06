<?php

namespace App\Http\Controllers\API\servicios;

use App\Http\Controllers\Controller;
use App\Models\Servicio;
use Illuminate\Http\Request;

class ServiciosApiController extends Controller
{
  public function index()
  {
    // Obtener todos los servicios
    $servicios = Servicio::all();

    // Retornar la respuesta estructurada
    return response()->json([
      'data' => $servicios,
      'status' => 'success',
    ]);
  }
}
