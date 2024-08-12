<?php

namespace App\Http\Controllers\API\terapias;

use App\Http\Controllers\Controller;
use App\Models\TerapiaOptometriaNeonatos;
use App\Models\TerapiasOptometriaNeonatos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class Terapias_Optometria_Neonatos_ApiController extends Controller
{
    public function verTerapias_optometria_neonatos($id_paciente)
    {
       
        $query = TerapiasOptometriaNeonatos::where('id_paciente', $id_paciente);
         
        $terapias = $query->get();
        
        if ($terapias->isEmpty()) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'No se encontraron terapias para el paciente y receta especificados.',
                'mensaje_dev' => "No se encontraron terapias con los parámetros proporcionados.",
            ], 404);
        }
    
     
        foreach ($terapias as &$terapia) {
            $terapia->cantidad = TerapiaOptometriaNeonatos::where('id_terapia', $terapia->id_terapia)->count();
        }
    
  
        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Terapias encontradas correctamente.',
            'data' => $terapias,
            'mensaje_dev' => null
        ], 200);
    }

    public function crearTerapias_optometria_neonatos(Request $request)
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


        $terapias_bajav= TerapiasOptometriaNeonatos::create($data);


        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Terapiasbajav registrada correctamente',
            'data' => [$terapias_bajav],
            'mensaje_dev' => null
        ], 201);
    }
}
