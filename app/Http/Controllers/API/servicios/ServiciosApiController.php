<?php

namespace App\Http\Controllers\API\servicios;

use App\Http\Controllers\Controller;
use App\Models\Servicio;
use App\Models\ServiciosProximosBajaVision;
use App\Models\ServiciosProximosOptometriaGeneral;
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

  public function getServiciosProximos(Request $request)
  {
    try {
      $consultaNombre = $request->input('consulta_nombre'); // Nombre de la consulta
      $consultaId = $request->input('consulta_id'); // ID de la consulta

      if (empty($consultaNombre)) {
        return response()->json([
          'status' => 'success',
          'data' => [],
        ], 200);
      }
      // Mapeo del nombre de la consulta a su respectivo modelo y relación con servicios
      $models = [
        'baja_vision' => [
          'model' => ServiciosProximosBajaVision::class,
          'relation' => 'bajavision',
          'foreign_key' => 'bajavision_id',
        ],
        'optometria_general' => [
          'model' => ServiciosProximosOptometriaGeneral::class,
          'relation' => 'optometriaGeneral',
          'foreign_key' => 'optometriageneral_id',
        ],
        // Puedes seguir agregando más modelos aquí...
      ];

      // Verificar si la consulta es válida
      if (!isset($models[$consultaNombre])) {
        return response()->json([
          'status' => 'success',
          'data' => [], // Devuelve un array vacío
        ], 200);
      }


      $modelClass = $models[$consultaNombre]['model'];
      $relationName = $models[$consultaNombre]['relation'];
      $foreignKey = $models[$consultaNombre]['foreign_key'] ?? 'consulta_id';

      // Obtener los servicios próximos del modelo correspondiente
      $query = $modelClass::with(['servicio:id,servicio,codigo', $relationName])
        ->when(!empty($consultaId), function ($q) use ($foreignKey, $consultaId) {
          return $q->where($foreignKey, (int) $consultaId);
        })
        ->get();

      // Verificar si se encontraron registros
      if ($query->isEmpty()) {
        return response()->json([
          'status' => 'success',
          'data' => [], // Devuelve un array vacío
        ], 200);
      }

      // Transformar los datos de la consulta
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
}
