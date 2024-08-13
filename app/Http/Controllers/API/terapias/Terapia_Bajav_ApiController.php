<?php

namespace App\Http\Controllers\API\terapias;

use App\Http\Controllers\Controller;
use App\Models\TerapiaBajaV;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Pacientes;

class Terapia_Bajav_ApiController extends Controller
{


    public function verUnaTerapia_bajav($id_paciente, $id_terapia = null, $id_sesion = null)
    {
        // Buscar el paciente por su ID
        $paciente = Pacientes::find($id_paciente);

        if (!$paciente) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'Paciente no encontrado',
                'mensaje_dev' => "No se encontró ningún paciente con el ID proporcionado.",
            ], 404);
        }

        // Buscar las terapias asociadas con el id_terapia y opcionalmente con id_sesion
        $query = TerapiaBajaV::where('id_terapia', $id_terapia);

        if ($id_sesion) {
            $query->where('id', $id_sesion);
        }

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
                'paciente' => $paciente,
                'terapias' => $terapias
            ],
            'mensaje_dev' => null
        ], 200);
    }

    

    public function verTerapia_bajav($id_terapia = null)
    {
        
       
        $query = TerapiaBajaV::where('id_terapia', $id_terapia);

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

    public function eliminarTerapia_bajav($id_terapia, $id_sesion = null)
{
    // Buscar la terapia con el id_terapia y opcionalmente el id_sesion
    $query = TerapiaBajaV::where('id_terapia', $id_terapia);

    if ($id_sesion) {
        $query->where('id', $id_sesion);
    }

    $terapia = $query->first();

    // Verificar si la terapia fue encontrada
    if (!$terapia) {
        return response()->json([
            'respuesta' => false,
            'mensaje' => 'Terapia no encontrada',
            'mensaje_dev' => "No se encontró ninguna terapia con los parámetros proporcionados.",
        ], 404);
    }

    // Eliminar la terapia
    $terapia->delete();

    return response()->json([
        'respuesta' => true,
        'mensaje' => 'Terapia eliminada correctamente',
        'mensaje_dev' => null
    ], 200);
}


public function editarTerapia_bajav(Request $request, $id_sesion)
{
    // Validar los datos de entrada
    $validator = Validator::make($request->all(), [
        "id_terapia" => 'nullable|integer',
        'pagado' => 'nullable|boolean',
        'sucursal' => 'nullable|integer'
    ]);
    if ($validator->fails()) {
        return response()->json([
            'respuesta' => false,
            'mensaje' => 'Validation errors',
            'data' => $validator->errors(),
            'mensaje_dev' => "Oops, validation errors occurred."
        ], 400);
    }
    // Buscar la terapia por ID
    $terapia_bajav = TerapiaBajaV::find($id_sesion);
    if (!$terapia_bajav) {
        return response()->json([
            'respuesta' => false,
            'mensaje' => 'Terapia no encontrada',
            'mensaje_dev' => "No se encontró ninguna sesioncon el ID proporcionado."
        ], 404);
    }
    // Convertir el campo sesion de JSON a objeto
    $sesionData = json_decode($request->input('sesion'), true);
    // Determinar si el campo completado debe ser 1 o 0
    $completado = 1;
    if (is_array($sesionData)) {
        // Verificar los campos `resultado` y `actividad` (exceptuando `actividad_casa`)
        foreach ($sesionData as $key => $value) {
            if (str_contains($key, 'resultado') && empty($value)) {
                $completado = 0; // No completado si hay campos `resultado` vacíos
                break;
            }
            if (str_contains($key, 'actividad') && $key !== 'actividad_casa' && empty($value)) {
                $completado = 0; // No completado si hay campos `actividad` vacíos (excepto `actividad_casa`)
                break;
            }
        }
    } else {
        $completado = 0; // Si `sesion` no es un JSON válido, marcar como no completado
    }
    // Actualizar la terapia
    $terapia_bajav->update([
        'sesion' => $request->input('sesion'),
        'pagado' => $request->input('pagado'),
        'sucursal' => $request->input('sucursal'),
        'completado' => $completado,
    ]);

    return response()->json([
        'respuesta' => true,
        'mensaje' => 'Terapia actualizada correctamente',
        'data' => $terapia_bajav,
        'mensaje_dev' => null
    ], 200);
}

    public function crearTerapia_Bajav(Request $request)
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


        $terapia_bajav= TerapiaBajaV::create($data);


        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Terapiabajav registrada correctamente',
            'data' => [$terapia_bajav],
            'mensaje_dev' => null
        ], 201);
    }
}
