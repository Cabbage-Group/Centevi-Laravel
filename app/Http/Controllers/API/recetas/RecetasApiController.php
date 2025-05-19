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
    $search = $request->input('search', '');

    $orden = in_array($orden, ['asc', 'desc']) ? $orden : 'asc';
    $ordenPor = in_array($ordenPor, [
        'id_paciente', 'nombres', 'nro_receta', 'direccion', 'cedula',
        'telefono', 'rx', 'tipo_lente', 'material', 'tratamientos',
        'aro_propio', 'observacion', 'medidas', 'sucursal', 'doctor',
        'fecha_creacion'
    ]) ? $ordenPor : 'nombres';

    $query = Receta::join('pacientes', 'receta.id_paciente', '=', 'pacientes.id_paciente')
        ->select('receta.*', DB::raw('TRIM(pacientes.nombres) as nombres'), DB::raw('TRIM(pacientes.apellidos) as apellidos'));

    // Aplicar búsqueda
    if (!empty($search)) {
        $query->where(function ($q) use ($search) {
            $q->where('pacientes.nombres', 'like', "%{$search}%")
                ->orWhere('pacientes.apellidos', 'like', "%{$search}%")
                ->orWhere('receta.nro_receta', 'like', "%{$search}%")
                ->orWhere('receta.direccion', 'like', "%{$search}%")
                ->orWhere('receta.cedula', 'like', "%{$search}%")
                ->orWhere('receta.telefono', 'like', "%{$search}%")
                ->orWhere('receta.rx', 'like', "%{$search}%")
                ->orWhere('receta.tipo_lente', 'like', "%{$search}%")
                ->orWhere('receta.material', 'like', "%{$search}%")
                ->orWhere('receta.tratamientos', 'like', "%{$search}%")
                ->orWhere('receta.aro_propio', 'like', "%{$search}%")
                ->orWhere('receta.observacion', 'like', "%{$search}%")
                ->orWhere('receta.medidas', 'like', "%{$search}%")
                ->orWhere('receta.sucursal', 'like', "%{$search}%")
                ->orWhere('receta.doctor', 'like', "%{$search}%")
                ->orWhere(DB::raw("DATE_FORMAT(receta.fecha_creacion, '%Y-%m-%d %H:%i:%s')"), 'like', "%{$search}%");
        });
    }

    // Ordenar según el campo seleccionado
    if (in_array($ordenPor, ['nombres', 'apellidos'])) {
        $query->orderBy(DB::raw("TRIM(pacientes.$ordenPor)"), $orden);
    } else {
        $query->orderBy($ordenPor,$orden);
    }

    $recetas = $query->paginate($limit, ['*'], 'page', $page);

    $data = $recetas->map(function ($receta) {
        return [
            'ID_RECETA' => $receta->id_receta,
            'ID_PACIENTE' => $receta->id_paciente,
            'NRO_RECETA' => $receta->nro_receta,
            'DIRECCION' => $receta->direccion,
            'CEDULA' => $receta->cedula,
            'TELEFONO' => $receta->telefono,
            'RX' => $receta->rx,
            'TIPO_LENTE' => $receta->tipo_lente,
            'MATERIAL' => $receta->material,
            'TRATAMIENTOS' => $receta->tratamientos,
            'ARO_PROPIO' => $receta->aro_propio,
            'OBSERVACION' => $receta->observacion,
            'MEDIDAS' => $receta->medidas,
            'SUCURSAL' => $receta->sucursal,
            'DOCTOR' => $receta->doctor,
            'FECHA_ATENCION' => Carbon::parse($receta->fecha_creacion)->format('Y-m-d H:i:s'),
            'PACIENTE_NOMBRE' => $receta->paciente->nombres ?? 'N/A',
            'PACIENTE_APELLIDO' => $receta->paciente->apellidos ?? 'N/A',
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
            'tratamientos' => 'nullable|string',
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
            'sucursal' => '',
            'doctor' => '',
            'fecha_creacion' => now()->format('Y-m-d'), 
        ];
        
        $data = array_map(function ($value) {
            return $value === null ? '' : $value;
        }, $request->all());

        $data = array_merge($defaults, $data);

        $receta = Receta::create($data);

        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Receta registrada correctamente',
            'data' => [$receta],
            'mensaje_dev' => null
        ], 201);
    }


    public function eliminarReceta($id_receta)
    {
        // Buscar la receta por ID
        $receta = Receta::find($id_receta);

        // Verificar si la receta existe
        if (!$receta) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'Receta no encontrada',
                'mensaje_dev' => "No se encontró ninguna receta con el ID proporcionado."
            ], 404);
        }

        // Eliminar la receta
        $receta->delete();

        // Retornar respuesta exitosa
        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Receta eliminada correctamente',
            'mensaje_dev' => null
        ], 200);
    }

    public function verReceta($id_receta)
    {
        // Buscar la receta por ID
        $receta = Receta::join('pacientes', 'receta.id_paciente', '=', 'pacientes.id_paciente')
            ->select('receta.*', DB::raw('TRIM(pacientes.nombres) as nombres'), DB::raw('TRIM(pacientes.apellidos) as apellidos'))
            ->where('receta.id_receta', $id_receta)
            ->first();

        // Verificar si la receta existe
        if (!$receta) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'Receta no encontrada',
                'mensaje_dev' => "No se encontró ninguna receta con el ID proporcionado."
            ], 404);
        }

        // Formatear los datos de la receta
        $data = [
            'ID_RECETA' => $receta->id_receta,
            'ID_PACIENTE' => $receta->id_paciente,
            'NRO_RECETA' => $receta->nro_receta,
            'DIRECCION' => $receta->direccion,
            'CEDULA' => $receta->cedula,
            'TELEFONO' => $receta->telefono,
            'RX' => $receta->rx,
            'TIPO_LENTE' => $receta->tipo_lente,
            'MATERIAL' => $receta->material,
            'TRATAMIENTOS' => $receta->tratamientos,
            'ARO_PROPIO' => $receta->aro_propio,
            'OBSERVACION' => $receta->observacion,
            'MEDIDAS' => $receta->medidas,
            'SUCURSAL' => $receta->sucursal,
            'DOCTOR' => $receta->doctor,
            'FECHA_ATENCION' => Carbon::parse($receta->fecha_creacion)->format('Y-m-d H:i:s'),
            'PACIENTE_NOMBRE' => $receta->nombres ?? 'N/A',
            'PACIENTE_APELLIDO' => $receta->apellidos ?? 'N/A',
        ];

        // Retornar respuesta exitosa
        return response()->json([
            'respuesta' => true,
            'mensaje' => 'Receta encontrada correctamente',
            'data' => $data,
            'mensaje_dev' => null
        ], 200);
    }


    public function editarReceta(Request $request, $id_receta)
{
    // Validar los datos de entrada para recetas
    $validator = Validator::make($request->all(), [
        "id_paciente" => 'nullable|integer',
        "nro_receta" => 'nullable|string|max:255',
        'direccion' => 'nullable|string|max:255',
        'cedula' => 'nullable|string|max:255', 
        'telefono' => 'nullable|string|max:255',
        'rx' => 'nullable|string|max:300',
        'tipo_lente' => 'nullable|string|max:255',
        'material' => 'nullable|string|max:255',
        'tratamientos' => 'nullable|string',
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

    // Buscar la receta por ID
    $receta = Receta::find($id_receta);

    // Verificar si la receta existe
    if (!$receta) {
        return response()->json([
            'respuesta' => false,
            'mensaje' => 'Receta no encontrada',
            'mensaje_dev' => "No se encontró ninguna receta con el ID proporcionado."
        ], 404);
    }

    // Actualizar los datos de la receta
    $receta->update($request->all());

    // Retornar respuesta exitosa
    return response()->json([
        'respuesta' => true,
        'mensaje' => 'Receta actualizada correctamente',
        'data' => $receta,
        'mensaje_dev' => null
    ], 200);
}

}
