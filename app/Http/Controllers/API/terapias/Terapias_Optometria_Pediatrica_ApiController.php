<?php

namespace App\Http\Controllers\API\terapias;

use App\Http\Controllers\Controller;
use App\Models\TerapiaOptometriaPediatrica;
use App\Models\TerapiasOptometriaPediatrica;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class Terapias_Optometria_Pediatrica_ApiController extends Controller
{
    public function verTerapias_optometria_pediatrica($id_paciente)
    {
         $query = TerapiasOptometriaPediatrica::where('id_paciente', $id_paciente);
         
        $terapias = $query->get();
        
        if ($terapias->isEmpty()) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'No se encontraron terapias para el paciente y receta especificados.',
                'mensaje_dev' => "No se encontraron terapias con los parámetros proporcionados.",
            ], 404);
        }
    
     
        foreach ($terapias as &$terapia) {
            $terapia->cantidad = TerapiaOptometriaPediatrica::where('id_terapia', $terapia->id_terapia)->count();
        }
    
  
        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Terapias encontradas correctamente.',
            'data' => $terapias,
            'mensaje_dev' => null
        ], 200);
    }


    public function verUnaTerapias_optometria_pediatrica($id_paciente, $id_terapia = null)
    {
        $terapia = TerapiasOptometriaPediatrica::where('id_paciente', $id_paciente);
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
        
        return response()->json([
            'respuesta' => true,
            'data' => $terapia,
            'mensaje_dev' => null
        ], 200);
    }

    public function crearTerapias_optometria_pediatrica(Request $request)
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


        $terapias_pediatrica= TerapiasOptometriaPediatrica::create($data);


        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Terapiasbajav registrada correctamente',
            'data' => [$terapias_pediatrica],
            'mensaje_dev' => null
        ], 201);
    }


    public function editarTerapias_optometria_pediatrica(Request $request, $id_terapia)
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


        $terapias_pediatrica = TerapiasOptometriaPediatrica::find($id_terapia);


        if (!$terapias_pediatrica) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'Receta no encontrada',
                'mensaje_dev' => "No se encontró ninguna terapias_ne$terapias_pediatrica con el ID proporcionado."
            ], 404);
        }

        $terapias_pediatrica->update($request->all());


        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Terapias_ne$terapias_pediatrica actualizada correctamente',
            'data' => $terapias_pediatrica,
            'mensaje_dev' => null
        ], 200);
    }

    public function eliminarTerapias_optometria_pediatrica($id_terapia)
    {
        $terapias_bajav = TerapiasOptometriaPediatrica::find($id_terapia);

        if (!$terapias_bajav) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'Terapia no encontrada',
                'mensaje_dev' => "No se encontró ninguna terapias_bajav con el ID proporcionado."
            ], 404);
        }

        $terapias_bajav->delete();

        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Terapias_bajav eliminada correctamente',
            'data' => null,
            'mensaje_dev' => null
        ], 200);
    }
      
}
