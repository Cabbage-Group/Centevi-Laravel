<?php

namespace App\Http\Controllers\API\tratamientos;

use App\Http\Controllers\Controller;
use App\Models\Tratamientos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TratamientosApiController extends Controller
{
  public function index(Request $request)
  {
    try {
      $tratamientos = Tratamientos::all();

      // Verificar la codificación de los datos
      foreach ($tratamientos as $tratamiento) {
        foreach ($tratamiento->getAttributes() as $key => $value) {
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
        'data' => $tratamientos,
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error al obtener tratamientos',
        'errors' => $e->getMessage(),
      ], 500);
    }
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
      $tratamientos = new Tratamientos();
      $tratamientos->nombre = $request->input('nombre');
      $tratamientos->save();

      return response()->json([
        'success' => true,
        'message' => 'tratamientos creado exitosamente',
        'data' => $tratamientos,
      ], 201);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error al crear el tratamiento',
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
      // Buscar el tratamiento por ID
      $tratamiento = Tratamientos::find($id);

      if (!$tratamiento) {
        return response()->json([
          'success' => false,
          'message' => 'Tratamiento no encontrado',
        ], 404);
      }

      // Actualizar los datos
      $tratamiento->nombre = $request->input('nombre');
      $tratamiento->save();

      return response()->json([
        'success' => true,
        'message' => 'Tratamiento actualizado exitosamente',
        'data' => $tratamiento,
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error al actualizar el tratamiento',
        'errors' => $e->getMessage(),
      ], 500);
    }
  }

  public function delete($id)
  {
    try {
      // Buscar el tratamiento por ID
      $tratamiento = Tratamientos::find($id);

      if (!$tratamiento) {
        return response()->json([
          'success' => false,
          'message' => 'Tratamiento no encontrado',
        ], 404);
      }

      // Eliminar el tratamiento
      $tratamiento->delete();

      return response()->json([
        'success' => true,
        'message' => 'Tratamiento eliminado exitosamente',
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error al eliminar el tratamiento',
        'errors' => $e->getMessage(),
      ], 500);
    }
  }
}
