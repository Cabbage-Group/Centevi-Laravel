<?php

namespace App\Http\Controllers\API\tipos_aros;

use App\Http\Controllers\Controller;
use App\Models\TiposAros;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TiposArosApiController extends Controller
{
    public function index(Request $request)
    {
        try {
            $search = $request->input('search');

            $tiposAros = TiposAros::get();

            if ($search) {
                $normalizedSearch = $this->normalizeString($search);

                $tiposAros = $tiposAros->filter(function ($tipoAro) use ($normalizedSearch) {
                    $normalizedNombre = $this->normalizeString($tipoAro->nombre ?? '');
                    $normalizedCodigo = $this->normalizeString($tipoAro->codigo ?? '');

                    return str_contains($normalizedNombre, $normalizedSearch)
                        || str_contains($normalizedCodigo, $normalizedSearch);
                })->values();
            }

            $data = [];

            foreach ($tiposAros as $tipoAro) {

                // Validar cada atributo individualmente
                foreach ($tipoAro->getAttributes() as $campo => $valor) {

                    if (!is_string($valor)) {
                        continue;
                    }

                    try {
                        json_encode($valor, JSON_THROW_ON_ERROR);
                    } catch (\JsonException $e) {

                        Log::error('Campo con UTF-8 inválido', [
                            'id' => $tipoAro->id ?? null,
                            'campo' => $campo,
                            'valor' => $valor,
                            'hex' => bin2hex($valor),
                            'error' => $e->getMessage(),
                        ]);

                        return response()->json([
                            'success' => false,
                            'message' => 'Campo con caracteres inválidos',
                            'id' => $tipoAro->id ?? null,
                            'campo' => $campo,
                            'valor' => $valor,
                            'hex' => bin2hex($valor),
                        ], 500);
                    }
                }

                // Validar el modelo completo
                try {
                    $array = $tipoAro->toArray();
                    json_encode($array, JSON_THROW_ON_ERROR);
                    $data[] = $array;
                } catch (\JsonException $e) {

                    Log::error('Registro con UTF-8 inválido', [
                        'id' => $tipoAro->id ?? null,
                        'error' => $e->getMessage(),
                        'attributes' => $tipoAro->getAttributes(),
                    ]);

                    return response()->json([
                        'success' => false,
                        'message' => 'Registro con caracteres inválidos',
                        'id' => $tipoAro->id ?? null,
                        'error' => $e->getMessage(),
                        'attributes' => $tipoAro->getAttributes(),
                    ], 500);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Operación exitosa',
                'data' => $data,
            ]);
        } catch (\Throwable $e) {

            Log::error('Error index TiposAros', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener tiposAros',
                'errors' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
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
