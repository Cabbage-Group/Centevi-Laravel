<?php

namespace App\Http\Controllers\API\terapias;

use App\Http\Controllers\Controller;
use App\Models\TerapiaOptometriaNeonatos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class Terapia_Optometria_Neonatos_ApiController extends Controller
{
    public function verTerapia_optometria_neonatos($id_terapia)
    {
        
        $query = TerapiaOptometriaNeonatos::where('id_terapia', $id_terapia);

        $terapias = $query->get();

        if ($terapias->isEmpty()) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'No se encontraron terapias para el paciente y receta especificados.',
                'mensaje_dev' => "No se encontraron terapias con los parámetros proporcionados.",
            ], 404);
        }

        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Terapias encontradas correctamente.',
            'data' => [
                'terapias' => $terapias
            ],
            'mensaje_dev' => null
        ], 200);
    }

    public function crearTerapia_optometria_neonatos(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "id_terapia" => 'nullable|integer',
            "sesion" => 'nullable|string|max:255',
            'completado' => 'nullable|boolean',
            'pagado' => 'nullable|boolean',
            'doctor' => 'nullable|string|max:255',
            'fecha_creacion' => 'nullable|date',
            'sucursal' => 'nullable|integer',
        ]);


        if ($validator->fails()) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'Validation errors',
                'data' => $validator->errors(),
                'mensaje_dev' => "Oops, validation errors occurred."
            ], 400);
        }

       // $user = auth()->user(); Falta login 
       // $nombreDoctor = $user->nombre;  Falta login

        $data = $request->all();
        $defaults = [
            "id_terapia" => null,
            "sesion" => null,
            'completado' => null,
            'pagado' => null,
            'doctor' => 'Administrador',
            'fecha_creacion' => now()->format('Y-m-d'),
            'sucursal' => null,
        ];


        $data = array_merge($defaults, $data);


        $terapia_bajav= TerapiaOptometriaNeonatos::create($data);


        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Terapiabajav registrada correctamente',
            'data' => [$terapia_bajav],
            'mensaje_dev' => null
        ], 201);
    }
}
