<?php

namespace App\Http\Controllers\API\correccionesObservacionesOrdenes;

use App\Http\Controllers\Controller;
use App\Models\CorreccionesObservacionOrdenes;
use App\Models\CorrecionesOrdenes;
use App\Models\Ordenes;
use App\Models\OrdenObservacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class CorreccionesObservacionController extends Controller
{

    public function index($correccion_orden_id)
    {
        $orden = CorrecionesOrdenes::with([
            'observacionesCorreccionesOrden.usuario:id_usuario,nombre',
        ])->find($correccion_orden_id);

        if (!$orden) {
            return response()->json([
                'message' => 'Correccion no encontrada',
            ], 404);
        }

        $observaciones = $orden->observacionesCorreccionesOrden->map(function ($obs) {
            return [
                'id'            => $obs->id,
                'observacion'   => $obs->observacion,
                'elaborado_por' => $obs->elaborado_por,
                'nombre_usuario' => $obs->usuario?->nombre ?? 'Desconocido',
                'created_at'    => $obs->created_at,
                'es_legacy'     => false,
            ];
        });

        return response()->json([
            'correccion_orden_id'    => (int) $correccion_orden_id,
            'observaciones' => $observaciones,
        ], 200);
    }

    public function store(Request $request, $correccion_orden_id)
    {
        $validator = Validator::make($request->all(), [
            'observacion'   => 'required|string|max:500',
            'elaborado_por' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos inválidos',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $orden = CorrecionesOrdenes::find($correccion_orden_id);

        if (!$orden) {
            return response()->json([
                'message' => 'Correccion no encontrada',
            ], 404);
        }

        $observacion = CorreccionesObservacionOrdenes::create([
            'correccion_ordenes_id'    => $correccion_orden_id,
            'observacion'   => $request->observacion,
            'elaborado_por' => $request->elaborado_por,
            'created_at'    => Carbon::now(),
        ]);

        $observacion->load('usuario:id_usuario,nombre');

        return response()->json([
            'message'     => 'Observación guardada correctamente',
            'observacion' => [
                'id'             => $observacion->id,
                'observacion'    => $observacion->observacion,
                'elaborado_por'  => $observacion->elaborado_por,
                'nombre_usuario' => $observacion->usuario?->nombre ?? 'Desconocido',
                'created_at'     => $observacion->created_at,
                'es_legacy'      => false,
            ],
        ], 201);
    }
    public function update(Request $request, $correccion_orden_id, $id)
    {
        $validator = Validator::make($request->all(), [
            'observacion'   => 'required|string|max:500',
            'elaborado_por' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos inválidos',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $observacion = CorreccionesObservacionOrdenes::where('id', $id)
            ->where('correccion_ordenes_id', $correccion_orden_id)
            ->first();

        if (!$observacion) {
            return response()->json([
                'message' => 'Observación no encontrada',
            ], 404);
        }

        $observacion->update([
            'observacion' => $request->observacion,
            'updated_at'  => Carbon::now(),
        ]);

        $observacion->load('usuario:id_usuario,nombre');

        return response()->json([
            'message'     => 'Observación actualizada correctamente',
            'observacion' => [
                'id'             => $observacion->id,
                'observacion'    => $observacion->observacion,
                'elaborado_por'  => $observacion->elaborado_por,
                'nombre_usuario' => $observacion->usuario?->nombre ?? 'Desconocido',
                'created_at'     => $observacion->created_at,
                'updated_at'     => $observacion->updated_at,
                'es_legacy'      => false,
            ],
        ], 200);
    }

    public function destroy(Request $request, $correccion_orden_id, $id)
    {
        $observacion = CorreccionesObservacionOrdenes::where('id', $id)
            ->where('correccion_ordenes_id', $correccion_orden_id)
            ->first();

        if (!$observacion) {
            return response()->json([
                'message' => 'Observación no encontrada',
            ], 404);
        }

        $observacion->delete();

        return response()->json([
            'message' => 'Observación eliminada correctamente',
        ], 200);
    }
}
