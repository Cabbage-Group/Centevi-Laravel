<?php

namespace App\Http\Controllers\API\terapias;

use App\Http\Controllers\Controller;
use App\Models\TerapiaBajaV;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\TerapiasBajaV;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class Terapias_Bajav_ApiController extends Controller
{

    public function verTerapias_bajav($id_paciente)
    {
        $query = TerapiasBajaV::where('id_paciente', $id_paciente);
        
        $terapias = $query->get();
        if ($terapias->isEmpty()) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'No se encontraron terapias para el paciente y receta especificados.',
                'mensaje_dev' => "No se encontraron terapias con los parámetros proporcionados.",
            ], 404);
        }
        foreach ($terapias as &$terapia) {
            $terapia->cantidad = TerapiaBajaV::where('id_terapia', $terapia->id_terapia)->count();
        }
        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Terapias encontradas correctamente.',
            'data' => $terapias,
            'mensaje_dev' => null
        ], 200);
    }

    public function verUnaTerapias_bajav($id_paciente, $id_terapia = null)
    {
        $terapia = TerapiasBajaV::where('id_paciente', $id_paciente);
        if ($id_terapia) {
            $terapia->where('id_terapia', $id_terapia);
        }
        $terapia = $terapia->first();

        if (!$terapia) {
            return response()->json([
                'respuesta' => false,
                'data' => null,
                'mensaje_dev' => 'No data found for the given parameters'
            ], 404);
        }
    
        // Count the number of records matching the provided id_terapia
        $cantidad = TerapiasBajaV::where('id_terapia', $id_terapia)->count();
    
        // Add the count to the response data
        $terapia->cantidad = $cantidad;
    
        // Return the response as JSON
        return response()->json([
            'respuesta' => true,
            'data' => $terapia,
            'mensaje_dev' => null
        ], 200);
    }
    

    public function crearTerapias_Bajav(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "id_paciente" => 'nullable|integer',
            "evaluacion" => 'nullable|string|max:255',
            'motivo' => 'nullable|string|max:255',
            'fecha_creacion' => 'nullable|date',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'Validation errors',
                'data' => $validator->errors(),
                'mensaje_dev' => "Oops, validation errors occurred."
            ], 400);
        }
        $data = $request->all();
        $defaults = [
            "id_paciente" => null,
            "evaluacion" => null,
            'motivo' => null,
            'fecha_creacion' => now()->format('Y-m-d'),
        ];
        $data = array_merge($defaults, $data);
        $terapias_bajav= TerapiasBajaV::create($data);
        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Terapiasbajav registrada correctamente',
            'data' => [$terapias_bajav],
            'mensaje_dev' => null
        ], 201);
    }

    public function editarTerapias_Bajav(Request $request, $id_terapia)
    {
        // Validar los datos de entrada para recetas
        $validator = Validator::make($request->all(), [
            "id_paciente" => 'nullable|integer',
            "evaluacion" => 'nullable|string|max:255',
            'motivo' => 'nullable|string|max:255',
            'fecha_creacion' => 'nullable|date',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'Validation errors',
                'data' => $validator->errors(),
                'mensaje_dev' => "Oops, validation errors occurred."
            ], 400);
        }
        $terapias_bajav = TerapiasBajaV::find($id_terapia);
        if (!$terapias_bajav) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'Receta no encontrada',
                'mensaje_dev' => "No se encontró ninguna terapias_bajav con el ID proporcionado."
            ], 404);
        }
        $terapias_bajav->update($request->all());
        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Terapias_bajav actualizada correctamente',
            'data' => $terapias_bajav,
            'mensaje_dev' => null
        ], 200);
    }
}
