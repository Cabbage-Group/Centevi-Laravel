<?php

namespace App\Http\Controllers\API\pacientes;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pacientes;
use App\Models\HistoriaClinica;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class PacientesApiController extends Controller
{
    public function pacientes(Request $request)
    {
        // Obtener los parámetros
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 300);
        $sortOrder = $request->query('sortOrder', 'asc');
        $sortColumn = $request->query('sortColumn', 'id_paciente');

        // Validar los parámetros
        $request->validate([
            'page' => 'integer|min:1',
            'limit' => 'integer|min:1|max:100',
            'sortOrder' => 'in:asc,desc',
            'sortColumn' => 'string|in:sucursal,doctor,nombres,apellidos,nro_cedula,email,nro_seguro,fecha_nacimiento,genero,lugar_nacimiento,direccion,ocupacion,telefono,celular,medico,urgencia,menor,fecha_creacion', // Ajusta según los campos que tengas
        ]);

        // Obtener los datos paginados
        $pacientes = Pacientes::orderBy($sortColumn, $sortOrder)
            ->paginate($limit, ['*'], 'page', $page);

        // Formatear la respuesta
        return response()->json([
            'data' => $pacientes->items(),
            'meta' => [
                'page' => $pacientes->currentPage(),
                'limit' => $pacientes->perPage(),
                'total' => $pacientes->total(),
            ],
            'status' => [
                'code' => 200,
                'message' => 'Pacientes retrieved successfully',
            ],
        ]);
    }

    public function crearpaciente(Request $request)
{
    // Validar los datos de entrada para pacientes
    $validator = Validator::make($request->all(), [
        "sucursal" => 'required|int|max:11',
        "doctor" => 'required|string|max:255',
        'nombres' => 'required|string|max:255',
        'apellidos' => 'required|string|max:255',
        'nro_cedula' => 'required|string|max:20|unique:pacientes',
        'email' => 'required|string|email|max:255|unique:pacientes',
        'nro_seguro' => 'nullable|string|max:20',
        'fecha_nacimiento' => 'required|date',
        'genero' => 'required|string|in:masculino,femenino,otro',
        'lugar_nacimiento' => 'nullable|string|max:255',
        'direccion' => 'required|string|max:255',
        'ocupacion' => 'nullable|string|max:255',
        'telefono' => 'nullable|string|max:20',
        'celular' => 'nullable|string|max:20',
        'medico' => 'nullable|string|max:255',
        'urgencia' => 'nullable|string',
        'menor' => 'nullable|string',
        "fecha_creacion" => 'required|date'
    ]);

    // Retornar errores de validación si los hay
    if ($validator->fails()) {
        return response()->json([
            'respuesta' => false,
            'mensaje' => 'Validation errors',
            'data' => [],
            'mensaje_dev' => $validator->errors()
        ], 400);
    }

    // Crear un nuevo paciente
    $paciente = Pacientes::create([
        "sucursal" => $request->sucursal,
        "doctor" => $request->doctor,
        'nombres' => $request->nombres,
        'apellidos' => $request->apellidos,
        'nro_cedula' => $request->nro_cedula,
        'email' => $request->email,
        'nro_seguro' => $request->nro_seguro,
        'fecha_nacimiento' => $request->fecha_nacimiento,
        'genero' => $request->genero,
        'lugar_nacimiento' => $request->lugar_nacimiento,
        'direccion' => $request->direccion,
        'ocupacion' => $request->ocupacion,
        'telefono' => $request->telefono,
        'celular' => $request->celular,
        'medico' => $request->medico,
        'urgencia' => $request->urgencia,
        'menor' => $request->menor,
        "fecha_creacion" => $request->fecha_creacion
    ]);

    // Retornar respuesta exitosa
    return response()->json([
        'respuesta' => true,
        'mensaje' => 'Paciente registrado correctamente',
        'data' => [$paciente],
        'mensaje_dev' => null
    ], 201);
}

public function editarpaciente(Request $request, $id)
{
    // Validar los datos de entrada para pacientes
    $validator = Validator::make($request->all(), [
        "sucursal" => 'nullable|int|max:11',
        "doctor" => 'nullable|string|max:255',
        'nombres' => 'nullable|string|max:255',
        'apellidos' => 'nullable|string|max:255',
        'nro_cedula' => 'nullable|string|max:20' ,
        'email' => 'nullable|string|email|max:255' ,
        'nro_seguro' => 'nullable|string|max:20',
        'fecha_nacimiento' => 'required|date',
        'genero' => 'nullable|string',
        'lugar_nacimiento' => 'nullable|string|max:255',
        'direccion' => 'nullable|string|max:255',
        'ocupacion' => 'nullable|string|max:255',
        'telefono' => 'nullable|string|max:20',
        'celular' => 'nullable|string|max:20',
        'medico' => 'nullable|string|max:255',
        'urgencia' => 'nullable|string',
        'menor' => 'nullable|string',
        "fecha_creacion" => 'nullable|date'
    ]);

    // Retornar errores de validación si los hay
    if ($validator->fails()) {
        return response()->json([
            'respuesta' => false,
            'mensaje' => 'Validation errors',
            'data' => [],
            'mensaje_dev' => $validator->errors()
        ], 400);
    }

    // Buscar el paciente por ID
    $paciente = Pacientes::find($id);

    if (!$paciente) {
        return response()->json([
            'respuesta' => false,
            'mensaje' => 'Paciente no encontrado',
            'data' => [],
            'mensaje_dev' => null
        ], 404);
    }

    // Actualizar los datos del paciente
    $paciente->update([
        "sucursal" => $request->sucursal,
        "doctor" => $request->doctor,
        'nombres' => $request->nombres,
        'apellidos' => $request->apellidos,
        'nro_cedula' => $request->nro_cedula,
        'email' => $request->email,
        'nro_seguro' => $request->nro_seguro,
        'fecha_nacimiento' => $request->fecha_nacimiento,
        'genero' => $request->genero,
        'lugar_nacimiento' => $request->lugar_nacimiento,
        'direccion' => $request->direccion,
        'ocupacion' => $request->ocupacion,
        'telefono' => $request->telefono,
        'celular' => $request->celular,
        'medico' => $request->medico,
        'urgencia' => $request->urgencia,
        'menor' => $request->menor,
        "fecha_creacion" => $request->fecha_creacion
    ]);

    // Retornar respuesta exitosa
    return response()->json([
        'respuesta' => true,
        'mensaje' => 'Paciente actualizado correctamente',
        'data' => [$paciente],
        'mensaje_dev' => null
    ], 200);
}


public function eliminarpaciente($id)
{
    // Buscar el paciente por ID
    $paciente = Pacientes::find($id);

    if (!$paciente) {
        return response()->json([
            'respuesta' => false,
            'mensaje' => 'Paciente no encontrado',
            'data' => [],
            'mensaje_dev' => null
        ], 404);
    }

    // Eliminar el paciente
    $paciente->delete();

    // Retornar respuesta exitosa
    return response()->json([
        'respuesta' => true,
        'mensaje' => 'Paciente eliminado correctamente',
        'mensaje_dev' => null
    ], 200);
}


public function obtenerHistoriaClinica($paciente_id)
{
    // Buscar el paciente por ID
    $paciente = Pacientes::find($paciente_id);

    if (!$paciente) {
        return response()->json([
            'respuesta' => false,
            'mensaje' => 'Paciente no encontrado',
            'data' => [],
            'mensaje_dev' => null
        ], 404);
    }

    // Obtener todas las historias clínicas del paciente
    $historias = HistoriaClinica::where('paciente', $paciente_id)->get();

    return response()->json([
        'respuesta' => true,
        'mensaje' => 'Historias clínicas obtenidas correctamente',
        'data' => $historias,
        'mensaje_dev' => null
    ], 200);
}

    


}
