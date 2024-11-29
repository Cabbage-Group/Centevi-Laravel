<?php

namespace App\Http\Controllers\API\ordenes;

use App\Http\Controllers\Controller;
use App\Models\Ordenes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrdenesApiController extends Controller
{
    public function ordenes(Request $request) {

    }

    public function createOrdenes(Request $request){
        $validator = Validator::make($request->all(), [
            "nro_orden" => 'nullable|integer|unique:ordenes,nro_orden', 
            "id_paciente" => 'nullable|integer',
            'id_sucursal' => 'nullable|integer',
            'elaborado_por' => 'nullable|integer', // Agregar validación de unicidad
            'esfera_od' => 'nullable|string|max:255',
            'esfera_oi' => 'nullable|string|max:255',
            'cilindro_od' => 'nullable|string|max:255', // Dependiendo del formato esperado
            'cilindro_oi' => 'nullable|string|max:255', // Dependiendo del formato esperado
            'eje_od' => 'nullable|string|max:255',
            'eje_oi' => 'nullable|string|max:255',
            'add_od' => 'nullable|string|max:255',
            'add_oi' => 'nullable|string|max:255',
            'prisma_od' => 'nullable|string|max:255',
            'prisma_oi' => 'nullable|string|max:255',
            'distancia_od' => 'nullable|string|max:255',
            'distancia_oi' => 'nullable|string|max:255',
            'altura_od' => 'nullable|string|max:255',
            'altura_oi' => 'nullable|string|max:255',
            'tipo_cristal_od' => 'nullable|string|max:255',
            'tipo_cristal_oi' => 'nullable|string|max:255',
            'material_od' => 'nullable|string|max:255',
            'material_oi' => 'nullable|string|max:255',
            'tratamientos_od' => 'nullable|string|max:255',
            'tratamientos_oi' => 'nullable|string|max:255',
            'aro_centevi' => 'nullable|integer|min:0|max:1',
            'aro_propio' => 'nullable|integer|min:0|max:1',
            'codigo' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:255',
            'marca' => 'nullable|string|max:255',
            'tipo_aro' => 'nullable|string|max:255',
            'doctor' => 'nullable|string|max:255',
            'observaciones' => 'nullable|string|max:255',
            'l_uno' => 'nullable|string|max:255',
            'l_dos' => 'nullable|string|max:255',
            'l_tres' => 'nullable|string|max:255',
            'l_cuatro' => 'nullable|string|max:255',
            'l_cinco' => 'nullable|string|max:255',


        ]);

        // Retornar errores de validación si los hay
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
            'elaborado_por' => 0,
            'esfera_od' => '',
            'esfera_oi' => '',
            'cilindro_od' => '', 
            'cilindro_oi' => '', 
            'eje_od' => '',
            'eje_oi' => '',
            'add_od' => '',
            'add_oi' => '',
            'prisma_od' => '',
            'prisma_oi' => '',
            'distancia_od' => '',
            'distancia_oi' => '',
            'altura_od' => '',
            'altura_oi' => '',
            'tipo_cristal_od' => '',
            'tipo_cristal_oi' => '',
            'material_od' => '',
            'material_oi' => '',
            'tratamientos_od' => '',
            'tratamientos_oi' => '',
            'aro_centevi' => 0,
            'aro_propio' => 0,
            'codigo' => '',
            'color' => '',
            'marca' => '',
            'tipo_aro' => '',
            'doctor' => '',
            'observaciones' => '',
            'l_uno' => '',
            'l_dos' => '',
            'l_tres' => '',
            'l_cuatro' => '',
            'l_cinco' => '',

        ];
        
        $data = array_map(function ($value) {
            return $value === null ? '' : $value;
        }, $request->all());

        $data = array_merge($defaults, $data);

        $receta = Ordenes::create($data);

        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Orden registrada correctamente',
            'data' => [$receta],
            'mensaje_dev' => null
        ], 201);
    }
}
