<?php

namespace App\Http\Controllers\API\marcas_onefit;

use App\Http\Controllers\Controller;
use App\Models\MarcaOnefit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MarcasOnefitApiController extends Controller
{
  public function index(Request $request)
  {
    try {
      $search = $request->input('search');

      $marcas = MarcaOnefit::query();

      if ($search) {
        $normalizedSearch = $this->normalizeString($search);

        $marcas = $marcas->get()->filter(function ($marca) use ($normalizedSearch) {
          $normalizedNombre = $this->normalizeString($marca->nombre);
          $normalizedCodigo = $this->normalizeString($marca->codigo);

          return str_contains($normalizedNombre, $normalizedSearch) ||
            str_contains($normalizedCodigo, $normalizedSearch);
        });

        $marcas = $marcas->values();
      } else {
        $marcas = $marcas->get();
      }

      return response()->json([
        'success' => true,
        'message' => 'Operación exitosa',
        'data' => $marcas,
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error al obtener marcas OneFit',
        'errors' => $e->getMessage(),
      ], 500);
    }
  }

  private function normalizeString($string)
  {
    $string = mb_strtolower($string ?? '');
    $string = preg_replace('/[^a-z0-9]/u', '', $string);

    return $string;
  }

  public function create(Request $request)
  {
    $validatedData = $request->validate([
      'codigo' => 'required|string|max:150|unique:marcas_onefit,codigo',
      'nombre' => 'required|string|max:150|unique:marcas_onefit,nombre',
    ], [
      'codigo.unique' => 'El código ya ha sido registrado. Por favor, usa otro.',
      'nombre.unique' => 'El nombre ya está en uso. Intenta con otro nombre.',
    ]);

    try {
      $marca = MarcaOnefit::create([
        'codigo' => $validatedData['codigo'],
        'nombre' => $validatedData['nombre'],
      ]);

      return response()->json([
        'success' => true,
        'message' => 'Marca OneFit creada exitosamente',
        'data' => $marca,
      ], 201);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error al crear la marca OneFit',
        'errors' => $e->getMessage(),
      ], 500);
    }
  }

  public function update(Request $request, $id)
  {
    $validator = Validator::make($request->all(), [
      'codigo' => 'required|string|max:150',
      'nombre' => 'required|string|max:150',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'success' => false,
        'message' => 'Error de validación',
        'errors' => $validator->errors(),
      ], 422);
    }

    try {
      $marca = MarcaOnefit::find($id);

      if (!$marca) {
        return response()->json([
          'success' => false,
          'message' => 'Marca OneFit no encontrada',
        ], 404);
      }

      $marca->codigo = $request->input('codigo');
      $marca->nombre = $request->input('nombre');

      $marca->save();

      return response()->json([
        'success' => true,
        'message' => 'Marca OneFit actualizada exitosamente',
        'data' => $marca,
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error al actualizar la marca OneFit',
        'errors' => $e->getMessage(),
      ], 500);
    }
  }

  public function delete($id)
  {
    try {
      $marca = MarcaOnefit::find($id);

      if (!$marca) {
        return response()->json([
          'success' => false,
          'message' => 'Marca OneFit no encontrada',
        ], 404);
      }

      $marca->delete();

      return response()->json([
        'success' => true,
        'message' => 'Marca OneFit eliminada exitosamente',
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error al eliminar la marca OneFit',
        'errors' => $e->getMessage(),
      ], 500);
    }
  }
}