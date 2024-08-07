<?php

namespace App\Http\Controllers\API\recetas;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Receta;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

class RecetasApiController extends Controller
{
    public function recetas(Request $request)
    {
        // Obtener los parámetros
        $page = $request->input('page', 1);
        $limit = (int)$request->input('limit', 7);
        $orden = $request->input('orden', 'asc');
        $ordenPor = $request->input('ordenPor', 'nombres');


        $orden = in_array($orden, ['asc', 'desc']) ? $orden : 'asc';
        $ordenPor = in_array($ordenPor, [
            'id_paciente', 'nombres', 'nro_receta', 'direccion', 'cedula',
            'telefono', 'rx', 'tipo_lente', 'meterial', 'tratamientos',
            'aro_propio', 'observacion', 'medidas', 'sucursal', 'doctor',
            'fecha_creacion'
        ]) ? $ordenPor : 'nombres';

        $query = Receta::join('pacientes', 'receta.id_paciente', '=', 'pacientes.id_paciente')
            ->select('receta.*', DB::raw('TRIM(pacientes.nombres) as nombres'), DB::raw('TRIM(pacientes.apellidos) as apellidos'));

        // Ordenar según el campo seleccionado
        if (in_array($ordenPor, ['nombres', 'apellidos'])) {
            $query->orderBy(DB::raw("TRIM(pacientes.$ordenPor)"), $orden);
        } else {
            $query->orderBy("receta.$ordenPor", $orden);
        }

        $recetas = $query->paginate($limit, ['*'], 'page', $page);


        $data = $recetas->map(function ($receta) {
            return [
                'ID_RECETA' => $receta->id_receta,
                'ID_PACIENTE' => $receta->id_paciente,
                'PACIENTE_NOMBRE' => $receta->paciente->nombres ?? 'N/A',
                'PACIENTE_APELLIDO' => $receta->paciente->apellidos ?? 'N/A',
                'FECHA_ATENCION' => Carbon::parse($receta->fecha_creacion)->format('Y-m-d H:i:s'),
                'DOCTOR' => $receta->doctor

            ];
        });


        return response()->json([
            'data' => $data,
            'meta' => [
                'page' => $recetas->currentPage(),
                'limit' => $recetas->perPage(),
                'total' => $recetas->total(),
            ],
            'status' => [
                'code' => 200,
                'message' => 'Recetas retrieved successfully',
            ],
        ]);
    }


    public function crearRecetas(Request $request)
{
    // Validar los datos de entrada para recetas
    $validator = Validator::make($request->all(), [
        "id_paciente" => 'nullable|integer',
        "nro_receta" => 'nullable|string|max:255',
        'direccion' => 'nullable|string|max:255',
        'cedula' => 'nullable|string|max:255|unique:receta,cedula', // Agregar validación de unicidad
        'telefono' => 'nullable|string|max:255',
        'rx' => 'nullable|string|max:300',
        'tipo_lente' => 'nullable|string|max:255', // Dependiendo del formato esperado
        'material' => 'nullable|string|max:255', // Dependiendo del formato esperado
        'tratamientos' => 'nullable|string|max:255',
        'aro_propio' => 'nullable|string|max:255',
        'observacion' => 'nullable|string|max:255',
        'medidas' => 'nullable|string|max:300',
        'sucursal' => 'nullable|integer|max:543',
        'doctor' => 'nullable|string|max:255',
        'fecha_creacion' => 'nullable|date',    
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

    // Obtener los datos de la solicitud y rellenar los valores faltantes
    $data = $request->all();
    $defaults = [
        "id_paciente" => null,
        "nro_receta" => '',
        'direccion' => '',
        'cedula' => '',
        'telefono' => '',
        'rx' => '',
        'tipo_lente' => '',
        'material' => '',
        'tratamientos' => '',
        'aro_propio' => '',
        'observacion' => '',
        'medidas' => '',
        'sucursal' => null,
        'doctor' => '',
        'fecha_creacion' => now()->format('Y-m-d'), // Asegúrate de usar el formato correcto
    ];

    // Rellenar datos faltantes con valores predeterminados
    $data = array_merge($defaults, $data);

    // Crear una nueva receta
    $receta = Receta::create($data);

    // Retornar respuesta exitosa
    return response()->json([
        'respuesta' => true,
        'mensaje' => 'Receta registrada correctamente',
        'data' => [$receta],
        'mensaje_dev' => null
    ], 201);
}

}
