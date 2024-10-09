<?php

namespace App\Http\Controllers\API\terapias;

use App\Http\Controllers\Controller;
use App\Models\TerapiaOrtopticaAdultos;
use App\Models\TerapiasOrtopticaAdultos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class Terapias_Ortoptica_Adultos_ApiController extends Controller
{
    public function verTerapias_ortoptica_adultos($id_paciente)
    {
         $query = TerapiasOrtopticaAdultos::where('id_paciente', $id_paciente);
         
        $terapias = $query->get();
        
        if ($terapias->isEmpty()) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'No se encontraron terapias para el paciente y receta especificados.',
                'mensaje_dev' => "No se encontraron terapias con los parámetros proporcionados.",
            ], 404);
        }
    
     
        foreach ($terapias as &$terapia) {
            $terapia->cantidad = TerapiaOrtopticaAdultos::where('id_terapia', $terapia->id_terapia)->count();
        }
    
  
        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Terapias encontradas correctamente.',
            'data' => $terapias,
            'mensaje_dev' => null
        ], 200);
    }

    public function verUnaTerapias_ortoptica_adultos($id_paciente, $id_terapia = null)
    {
        $terapia = TerapiasOrtopticaAdultos::where('id_paciente', $id_paciente);
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

    public function crearTerapias_ortoptica_adultos(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "id_paciente" => 'nullable|integer',
            "evaluacion" => 'nullable|string',
            'motivo' => 'nullable|string',
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
            "id_paciente" => $data['id_paciente'],
            "evaluacion" => null,
            'motivo' => null,
            'fecha_creacion' => now(),
        ];


        $data = array_merge($defaults, $data);


        $terapias_ot_adultos= TerapiasOrtopticaAdultos::create($defaults);


        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Terapiasbajav registrada correctamente',
            'data' => [$terapias_ot_adultos],
            'mensaje_dev' => null
        ], 201);
    }

    public function editarTerapias_ortoptica_adultos(Request $request, $id_terapia)
    {
        // Validar los datos de entrada para recetas
        $validator = Validator::make($request->all(), [
            "id_paciente" => 'nullable|integer',
            "evaluacion" => 'nullable|string',
            'motivo' => 'nullable|string',
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


        $terapias_Or_adultos = TerapiasOrtopticaAdultos::find($id_terapia);


        if (!$terapias_Or_adultos) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'Receta no encontrada',
                'mensaje_dev' => "No se encontró ninguna terapias_ne$terapias_Or_adultos con el ID proporcionado."
            ], 404);
        }

        $terapias_Or_adultos->update($request->all());


        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Terapias_ne$terapias_Or_adultos actualizada correctamente',
            'data' => $terapias_Or_adultos,
            'mensaje_dev' => null
        ], 200);
    }

    public function eliminarTerapias_ortoptica_adultos($id_terapia)
    {
        $terapias_bajav = TerapiasOrtopticaAdultos::find($id_terapia);

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
