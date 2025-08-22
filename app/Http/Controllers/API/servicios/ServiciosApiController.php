<?php

namespace App\Http\Controllers\API\servicios;

use App\Http\Controllers\Controller;
use App\Models\CitasServicios;
use App\Models\Servicio;
use App\Models\ServiciosProximosBajaVision;
use App\Models\ServiciosProximosHistoriasClinicas;
use App\Models\ServiciosProximosOptometriaGeneral;
use App\Models\ServiciosProximosOptometriaNeonatos;
use App\Models\ServiciosProximosOptometriaPediatrica;
use App\Models\ServiciosProximosOrtopticaAdultos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Response;

class ServiciosApiController extends Controller
{
  public function index(Request $request)
  {
    try {
      $search = $request->input('search');
      $servicios = Servicio::query();

      if ($search) {
        $normalizedSearch = $this->normalizeString($search);

        $servicios = $servicios->get()->filter(function ($servicio) use ($normalizedSearch) {
          $normalizedCodigo = $this->normalizeString($servicio->codigo ?? '');
          $normalizedServicio = $this->normalizeString($servicio->servicio ?? '');

          return
            str_contains($normalizedCodigo, $normalizedSearch) ||
            str_contains($normalizedServicio, $normalizedSearch);
        })->values();
      } else {
        $servicios = $servicios->get();
      }

      foreach ($servicios as $servicio) {
        foreach ($servicio->getAttributes() as $key => $value) {
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
        'data' => $servicios
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



  public function getServiciosProximos(Request $request)
  {
    try {
      $consultaNombre = $request->input('consulta_nombre');
      $consultaId = $request->input('consulta_id');

      if (empty($consultaNombre)) {
        return response()->json([
          'status' => 'success',
          'data' => [],
        ], 200);
      }
      $models = [
        'baja_vision' => [
          'model' => ServiciosProximosBajaVision::class,
          'relation' => 'bajavision',
          'foreign_key' => 'bajavision_id',
        ],
        'refraccion_general' => [
          'model' => ServiciosProximosOptometriaGeneral::class,
          'relation' => 'optometriaGeneral',
          'foreign_key' => 'optometriageneral_id',
        ],
        'consulta_generica' => [
          'model' => ServiciosProximosHistoriasClinicas::class,
          'relation' => 'historiaClinica',
          'foreign_key' => 'historiaclinica_id',
        ],
        'optometria_neonatos' => [
          'model' => ServiciosProximosOptometriaNeonatos::class,
          'relation' => 'optometriaNeonatos',
          'foreign_key' => 'optometriaNeonatos_id',
        ],
        'optometria_pediatrica' => [
          'model' => ServiciosProximosOptometriaPediatrica::class,
          'relation' => 'optometriaPediatrica',
          'foreign_key' => 'optometriaPediatrica_id',
        ],
        'ortoptica_adultos' => [
          'model' => ServiciosProximosOrtopticaAdultos::class,
          'relation' => 'ortopticaAdultos',
          'foreign_key' => 'ortopticaAdultos_id',
        ],
        'citas_servicios' => [
          'model' => CitasServicios::class,
          'relation' => 'cita',
          'foreign_key' => 'cita_id',
        ]

      ];

      if (!isset($models[$consultaNombre])) {
        return response()->json([
          'status' => 'success',
          'data' => [],
        ], 200);
      }

      $modelClass = $models[$consultaNombre]['model'];
      $relationName = $models[$consultaNombre]['relation'];
      $foreignKey = $models[$consultaNombre]['foreign_key'] ?? 'consulta_id';

      $query = $modelClass::with(['servicio:id,servicio,codigo', $relationName])
        ->when(!empty($consultaId), function ($q) use ($foreignKey, $consultaId) {
          return $q->where($foreignKey, (int) $consultaId);
        })
        ->get();

      if ($query->isEmpty()) {
        return response()->json([
          'status' => 'success',
          'data' => [],
        ], 200);
      }

      $result = $query->map(function ($item) use ($relationName) {
        return [
          'id' => $item->id,
          'consulta_id' => $item->{$item->getForeignKey()},
          'servicios_id' => $item->servicios_id,
          'servicio_codigo' => optional($item->servicio)->codigo,
          'servicio_nombre' => optional($item->servicio)->servicio,
          'consulta_nombre' => optional($item->{$relationName})->nombre,
        ];
      });

      return response()->json([
        'data' => $result,
        'status' => 'success',
      ], 200);
    } catch (\Exception $e) {
      return response()->json([
        'status' => 'error',
        'message' => 'Ocurrió un error al obtener los servicios próximos.',
        'error' => $e->getMessage(),
      ], 500);
    }
  }

  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'codigo' => 'required|string|max:100|unique:servicios,codigo',
      'servicio' => 'required|string|max:255',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'status' => 'error',
        'errors' => $validator->errors(),
      ], 422);
    }

    $servicio = Servicio::create([
      'codigo' => $request->codigo,
      'servicio' => $request->servicio,
    ]);

    return response()->json([
      'status' => 'success',
      'data' => $servicio,
      'message' => 'Servicio creado correctamente',
    ], 201);
  }

  public function update($id, Request $request)
  {
    $servicio = Servicio::find($id);

    if (!$servicio) {
      return response()->json([
        'status' => 'error',
        'message' => 'Servicio no encontrado',
      ], 404);
    }

    $validator = Validator::make($request->all(), [
      'codigo' => 'required|string|max:100|unique:servicios,codigo,' . $servicio->id,
      'servicio' => 'required|string|max:255',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'status' => 'error',
        'errors' => $validator->errors(),
      ], 422);
    }

    $servicio->update([
      'codigo' => $request->codigo,
      'servicio' => $request->servicio,
    ]);

    return response()->json([
      'status' => 'success',
      'data' => $servicio,
      'message' => 'Servicio actualizado correctamente',
    ], 200);
  }

  public function destroy($id)
  {
    $servicio = Servicio::find($id);

    if (!$servicio) {
      return response()->json([
        'status' => 'error',
        'message' => 'Servicio no encontrado',
      ], 404);
    }

    $servicio->delete();

    return response()->json([
      'status' => 'success',
      'message' => 'Servicio eliminado correctamente',
      'id' => $id,
    ], 200);
  }
}
