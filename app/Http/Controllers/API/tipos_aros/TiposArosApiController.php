<?php

namespace App\Http\Controllers\API\tipos_aros;

use App\Http\Controllers\Controller;
use App\Models\TiposAros;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TiposArosApiController extends Controller
{
  public function index(Request $request)
  {
    try {
      $search = $request->input('search');

      $tiposAros = TiposAros::query();

      foreach ($tiposAros as $tipo) {
        $tipo->nombre = utf8_encode($tipo->nombre);
      }

      if ($search) {
        $normalizedSearch = $this->normalizeString($search);

        $tiposAros = $tiposAros->get()->filter(function ($tiposAro) use ($normalizedSearch) {
          $normalizedNombre = $this->normalizeString($tiposAro->nombre);
          $normalizedCodigo = $this->normalizeString($tiposAro->codigo);

          return str_contains($normalizedNombre, $normalizedSearch) ||
            str_contains($normalizedCodigo, $normalizedSearch);
        });

        $tiposAros = $tiposAros->values();
      } else {
        $tiposAros = $tiposAros->get();
      }


      foreach ($tiposAros as $tipoAro) {
        foreach ($tipoAro->getAttributes() as $key => $value) {
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
        'data' => $tiposAros,
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error al obtener tiposAros',
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
    $validator = Validator::make($request->all(), [
      'nombre' => 'required|string|max:100|unique:tipos_aros,nombre',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'success' => false,
        'message' => 'Error de validación',
        'errors' => $validator->errors(),
      ], 422);
    }

    try {
      $tiposAros = TiposAros::create($request->only('nombre'));

      return response()->json([
        'success' => true,
        'message' => 'tiposAros creado exitosamente',
        'data' => $tiposAros,
      ], 201);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error al crear el tipoAro',
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
      // Buscar el tipoAro por ID
      $tipoAro = TiposAros::find($id);

      if (!$tipoAro) {
        return response()->json([
          'success' => false,
          'message' => 'tipoAro no encontrado',
        ], 404);
      }

      $tipoAro->nombre = $request->input('nombre');
      $tipoAro->save();

      return response()->json([
        'success' => true,
        'message' => 'tipoAro actualizado exitosamente',
        'data' => $tipoAro,
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error al actualizar el tipoAro',
        'errors' => $e->getMessage(),
      ], 500);
    }
  }

  public function delete($id)
  {
    try {
      // Buscar el tipoAro por ID
      $tipoAro = TiposAros::find($id);

      if (!$tipoAro) {
        return response()->json([
          'success' => false,
          'message' => 'tipoAro no encontrado',
        ], 404);
      }

      // Eliminar el tipoAro
      $tipoAro->delete();

      return response()->json([
        'success' => true,
        'message' => 'tipoAro eliminado exitosamente',
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error al eliminar el tipoAro',
        'errors' => $e->getMessage(),
      ], 500);
    }
  }
}
