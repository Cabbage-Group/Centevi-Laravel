<?php

namespace App\Http\Controllers\API\materiales;

use App\Http\Controllers\Controller;
use App\Models\Materiales;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MaterialesApiController extends Controller
{
  public function index(Request $request)
  {
    try {
      $search = $request->input('search');

      $materiales = Materiales::query();

      if ($search) {
        $normalizedSearch = $this->normalizeString($search);

        $materiales = $materiales->get()->filter(function ($material) use ($normalizedSearch) {
          $normalizedNombre = $this->normalizeString($material->nombre);
          $normalizedCodigo = $this->normalizeString($material->codigo);

          return str_contains($normalizedNombre, $normalizedSearch) ||
            str_contains($normalizedCodigo, $normalizedSearch);
        });

        $materiales = $materiales->values();
      } else {
        $materiales = $materiales->get();
      }


      foreach ($materiales as $material) {
        foreach ($material->getAttributes() as $key => $value) {
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
        'message' => 'Operación exitosa',
        'data' => $materiales,
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error al obtener materiales',
        'errors' => $e->getMessage(),
      ], 500);
    }
  }

  private function normalizeString($string)
  {
    $string = mb_strtolower($string);
    $string = preg_replace('/[^a-z0-9]/u', '', $string);
    return $string;
  }



  public function create(Request $request)
  {
    // Validar la solicitud
    $validator = Validator::make($request->all(), [
      'nombre' => 'required|string|max:100',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'success' => false,
        'message' => 'Error de validación',
        'errors' => $validator->errors(),
      ], 422);
    }

    try {
      $materiales = new Materiales();
      $materiales->nombre = $request->input('nombre');
      $materiales->save();

      return response()->json([
        'success' => true,
        'message' => 'materiales creado exitosamente',
        'data' => $materiales,
      ], 201);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error al crear el permiso',
        'errors' => $e->getMessage(),
      ], 500);
    }
  }

  public function update(Request $request, $id)
  {
    // Validar la solicitud
    $validator = Validator::make($request->all(), [
      'nombre' => 'required|string|max:100',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'success' => false,
        'message' => 'Error de validación',
        'errors' => $validator->errors(),
      ], 422);
    }

    try {
      // Buscar el material por ID
      $material = Materiales::find($id);

      if (!$material) {
        return response()->json([
          'success' => false,
          'message' => 'Material no encontrado',
        ], 404);
      }

      // Actualizar los datos
      $material->nombre = $request->input('nombre');
      $material->save();

      return response()->json([
        'success' => true,
        'message' => 'Material actualizado exitosamente',
        'data' => $material,
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error al actualizar el material',
        'errors' => $e->getMessage(),
      ], 500);
    }
  }

  public function delete($id)
  {
    try {
      // Buscar el material por ID
      $material = Materiales::find($id);

      if (!$material) {
        return response()->json([
          'success' => false,
          'message' => 'Material no encontrado',
        ], 404);
      }

      // Eliminar el material
      $material->delete();

      return response()->json([
        'success' => true,
        'message' => 'Material eliminado exitosamente',
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error al eliminar el material',
        'errors' => $e->getMessage(),
      ], 500);
    }
  }
}
