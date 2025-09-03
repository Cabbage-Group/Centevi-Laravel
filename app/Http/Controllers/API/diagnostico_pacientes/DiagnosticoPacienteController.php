<?php

namespace App\Http\Controllers\API\diagnostico_pacientes;

use App\Http\Controllers\Controller;
use App\Models\Diagnosticos;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DiagnosticoPacienteController extends Controller
{
  public function mostrarDiagnosticos(Request $request)
  {
    try {
      $search = $request->input('search');
      $diagnosticos = Diagnosticos::query();

      // Si hay búsqueda, filtramos
      if ($search) {
        $normalizedSearch = $this->normalizeString($search);

        $diagnosticos = $diagnosticos->get()->filter(function ($diagnostico) use ($normalizedSearch) {
          $normalizedCodigo = $this->normalizeString($diagnostico->codigo ?? '');
          $normalizedDescripcion = $this->normalizeString($diagnostico->descripcion ?? '');
          $normalizedNombre = $this->normalizeString($diagnostico->nombre ?? '');

          return
            str_contains($normalizedCodigo, $normalizedSearch) ||
            str_contains($normalizedDescripcion, $normalizedSearch) ||
            str_contains($normalizedNombre, $normalizedSearch);
        })->values();
      } else {
        $diagnosticos = $diagnosticos->get();
      }

      foreach ($diagnosticos as $diagnostico) {
        foreach ($diagnostico->getAttributes() as $key => $value) {
          if (is_string($value) && !mb_check_encoding($value, 'UTF-8')) {
            return response()->json([
              'success' => false,
              'message' => "Caracteres mal codificados en el campo '$key'",
              'data' => $value,
            ], 500);
          }
        }
      }

      return response()->json([
        'success' => true,
        'message' => 'Diagnósticos obtenidos correctamente',
        'data' => $diagnosticos
      ], Response::HTTP_OK);
    } catch (\Throwable $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error interno del servidor',
        'error' => $e->getMessage(),
      ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
  }

  private function normalizeString($string)
  {
    $string = mb_strtolower($string);
    $string = preg_replace('/[^a-z0-9]/u', '', $string);
    return $string;
  }

  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'codigo' => 'required|string|max:100|unique:diagnosticos,codigo',
      'diagnostico' => 'required|string|max:255',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'status' => 'error',
        'errors' => $validator->errors(),
      ], 422);
    }

    $diagnosticos = Diagnosticos::create([
      'codigo' => $request->codigo,
      'diagnostico' => $request->diagnostico,
    ]);

    return response()->json([
      'status' => 'success',
      'data' => $diagnosticos,
      'message' => 'Diagnostico creado correctamente',
    ], 201);
  }

  public function update($id, Request $request)
  {
    $diagnostico = Diagnosticos::find($id);

    if (!$diagnostico) {
      return response()->json([
        'status' => 'error',
        'message' => 'Diagnostico no encontrado',
      ], 404);
    }

    $validator = Validator::make($request->all(), [
      'codigo' => 'required|string|max:100|unique:diagnosticos,codigo,' . $diagnostico->id,
      'diagnostico' => 'required|string|max:255',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'status' => 'error',
        'errors' => $validator->errors(),
      ], 422);
    }

    $diagnostico->update([
      'codigo' => $request->codigo,
      'diagnostico' => $request->diagnostico,
    ]);

    return response()->json([
      'status' => 'success',
      'data' => $diagnostico,
      'message' => 'Diagnostico actualizado correctamente',
    ], 200);
  }

  public function destroy($id)
  {
    $diagnostico = Diagnosticos::find($id);

    if (!$diagnostico) {
      return response()->json([
        'status' => 'error',
        'message' => 'Diagnostico no encontrado',
      ], 404);
    }

    $diagnostico->delete();

    return response()->json([
      'status' => 'success',
      'message' => 'Diagnostico eliminado correctamente',
      'id' => $id,
    ], 200);
  }
}
