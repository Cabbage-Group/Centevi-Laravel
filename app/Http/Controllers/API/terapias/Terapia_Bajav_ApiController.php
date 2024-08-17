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
        $paciente = Pacientes::select('id_paciente', 'sucursal', 'nombres', 'apellidos', 'nro_cedula')
            ->where('id_paciente', $id_paciente)
            ->first();

        if (!$paciente) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'Paciente no encontrado',
                'mensaje_dev' => "No se encontró ningún paciente con el ID proporcionado.",
            ], 404);
        }

        $query = TerapiaBajaV::where('id_terapia', $id_terapia);
        if ($id_sesion) {
            $query->where('id', $id_sesion);
        }
        $terapia = $query->first(); // Obtenemos la primera terapia, no un array de terapias
        if (!$terapia) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'No se encontraron terapias para el paciente y receta especificados.',
                'mensaje_dev' => "No se encontraron terapias con los parámetros proporcionados.",
            ], 404);
        }
        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Terapia encontrada correctamente.',
            'data' => [
                'paciente' => $paciente,
                'terapia' => $terapia // Cambiamos 'terapias' a 'terapia' y retornamos un único objeto
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
            'data' => $terapias,
            'mensaje_dev' => null
        ], 200);
    }

    public function eliminarTerapia_bajav($id_sesion)
    {
        $terapia_bajav = TerapiaBajaV::find($id_sesion);
        if (!$terapia_bajav) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'Terapia no encontrada',
                'mensaje_dev' => "No se encontró ninguna terapias_bajav con el ID proporcionado."
            ], 404);
        }
        $terapia_bajav->delete();
        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Terapia eliminada correctamente',
            'mensaje_dev' => null
        ], 200);
    }

    public function editarTerapia_bajav(Request $request, $id_sesion)
    {
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
        $terapia_bajav = TerapiaBajaV::create($data);
        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Terapiabajav registrada correctamente',
            'data' => [$terapia_bajav],
            'mensaje_dev' => null
        ], 201);
    }
}
