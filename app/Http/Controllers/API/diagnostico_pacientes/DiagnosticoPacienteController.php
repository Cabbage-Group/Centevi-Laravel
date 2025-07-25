<?php

namespace App\Http\Controllers\API\diagnostico_pacientes;

use App\Http\Controllers\Controller;
use App\Models\Diagnosticos;
use Illuminate\Http\Request;

class DiagnosticoPacienteController extends Controller
{
  public function mostrarDiagnosticos(Request $request)
  {
    $diagnosticos = Diagnosticos::all();

    return response()->json([
      'message' => 'Obtener los diagnosticos',
      'diagnosticos' => $diagnosticos
    ], 200);
  }
}
