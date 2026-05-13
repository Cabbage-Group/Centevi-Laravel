<?php

namespace App\Http\Controllers\API\ordenesObservaciones;

use App\Http\Controllers\Controller;
use App\Models\Ordenes;
use App\Models\OrdenObservacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class OrdenObservacionController extends Controller
{

    public function index($ordenes_id)
    {
        $orden = Ordenes::with([
            'observacionesOrden.usuario:id_usuario,nombre',
        ])->find($ordenes_id);

        if (!$orden) {
            return response()->json([
                'message' => 'Orden no encontrada',
            ], 404);
        }

        $observaciones = $orden->observacionesOrden->map(function ($obs) {
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
            'ordenes_id'    => (int) $ordenes_id,
            'observaciones' => $observaciones,
        ], 200);
    }

    public function store(Request $request, $ordenes_id)
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

        $orden = Ordenes::find($ordenes_id);

        if (!$orden) {
            return response()->json([
                'message' => 'Orden no encontrada',
            ], 404);
        }

        $observacion = OrdenObservacion::create([
            'ordenes_id'    => $ordenes_id,
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
    public function update(Request $request, $ordenes_id, $id)
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

        $observacion = OrdenObservacion::where('id', $id)
            ->where('ordenes_id', $ordenes_id)
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

    public function destroy(Request $request, $ordenes_id, $id)
    {
        $observacion = OrdenObservacion::where('id', $id)
            ->where('ordenes_id', $ordenes_id)
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
