<?php

namespace App\Http\Controllers\API\terapias;

use App\Http\Controllers\Controller;
use App\Models\TerapiaOptometriaNeonatos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Pacientes;


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
            'data' => $terapias,
            'mensaje_dev' => null
        ], 200);
    }

    public function verUnaTerapia_optometria_neonatos($id_paciente, $id_terapia = null, $id_sesion = null)
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
        $query = TerapiaOptometriaNeonatos::where('id_terapia', $id_terapia);
        if ($id_sesion) {
            $query->where('id', $id_sesion);
        }
        $terapia = $query->first();
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
            // 'doctor' => 'Administrador',
            'fecha_creacion' => now()->format('Y-m-d'),
            'sucursal' => null,
        ];


        $data = array_merge($defaults, $data);


        $terapia_neonatos = TerapiaOptometriaNeonatos::create($data);


        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Terapianeon$terapia_neonatos registrada correctamente',
            'data' => [$terapia_neonatos],
            'mensaje_dev' => null
        ], 201);
    }

    public function editarTerapia_optometria_neonatos(Request $request, $id_sesion)
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
        $terapia_neonatos = TerapiaOptometriaNeonatos::find($id_sesion);
        if (!$terapia_neonatos) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'Terapia no encontrada',
                'mensaje_dev' => "No se encontró ninguna sesioncon el ID proporcionado."
            ], 404);
        }
        $sesionData = json_decode($request->input('sesion'), true);
        $completado = 1;
        if (is_array($sesionData)) {

            foreach ($sesionData as $key => $value) {
                if (str_contains($key, 'resultado') && empty($value)) {
                    $completado = 0;
                    break;
                }
                if (str_contains($key, 'actividad') && $key !== 'actividad_casa' && empty($value)) {
                    $completado = 0;
                    break;
                }
            }
        } else {
            $completado = 0;
        }
        $updateData = [
            'sesion' => $request->input('sesion'),
            'completado' => $completado,
        ];
        if ($request->has('pagado')) {
            $updateData['pagado'] = $request->input('pagado');
        }
        if ($request->has('sucursal')) {
            $updateData['sucursal'] = $request->input('sucursal');
        }

        $terapia_neonatos->update($updateData);

        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Terapia actualizada correctamente',
            'data' => $terapia_neonatos,
            'mensaje_dev' => null
        ], 200);
    }

    public function eliminarTerapia_optometria_neonatos($id_sesion)
    {

        $terapia_bajav = TerapiaOptometriaNeonatos::find($id_sesion);

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

}
