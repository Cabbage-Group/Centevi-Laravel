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

    public function verUnaTerapias_optometria_neonatos($id_paciente, $id_terapia = null)
    {
        $terapia = TerapiasOptometriaNeonatos::where('id_paciente', $id_paciente);
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
        $terapias_neonatos= TerapiasOptometriaNeonatos::create($data);


        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Terapiasne$terapias_neonatos registrada correctamente',
            'data' => [$terapias_neonatos],
            'mensaje_dev' => null
        ], 201);
    }


    public function editarTerapias_optometria_neonatos(Request $request, $id_terapia)
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


        $terapias_neonatos = TerapiasOptometriaNeonatos::find($id_terapia);


        if (!$terapias_neonatos) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'Receta no encontrada',
                'mensaje_dev' => "No se encontró ninguna terapias_ne$terapias_neonatos con el ID proporcionado."
            ], 404);
        }

        $terapias_neonatos->update($request->all());


        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Terapias_ne$terapias_neonatos actualizada correctamente',
            'data' => $terapias_neonatos,
            'mensaje_dev' => null
        ], 200);
    }

    public function eliminarTerapias_optometria_neonatos($id_terapia)
    {
        $terapias_bajav = TerapiasOptometriaNeonatos::find($id_terapia);

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
