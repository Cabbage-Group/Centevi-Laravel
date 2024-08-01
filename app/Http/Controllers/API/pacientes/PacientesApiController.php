<?php

namespace App\Http\Controllers\API\pacientes;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pacientes;
use App\Models\HistoriaClinica;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;


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
            'limit' => 'integer|min:1|max:10000',
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
            'nro_cedula' => 'nullable|string|max:20',
            'email' => 'nullable|string|email|max:255',
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



    public function mostrarUltimaAtencionPacientes(Request $request)
    {
        $fecha = $request->input('fecha');
        $page = (int) $request->input('page', 1); // Valor predeterminado si no se proporciona
        $limit = (int)$request->input('limit', 20); // Valor predeterminado si no se proporciona
        $orden = trim($request->input('orden', 'asc'));
        $ordenPor = trim($request->input('ordenPor', 'nombres'));
        $searchTerm = trim($request->input('search', '')); // Término de búsqueda

        // Validar el parámetro de ordenamiento
        if (!in_array($orden, ['asc', 'desc'])) {
            $orden = 'asc'; // Valor por defecto si se proporciona un valor inválido
        }
        $camposPermitidos = ['nombres', 'nro_cedula', 'email', 'direccion', 'doctores'];

        if (!in_array($ordenPor, $camposPermitidos)) {
            $ordenPor = 'nombres'; // Valor por defecto si se proporciona un campo inválido
        }

        // Subconsulta para obtener la fecha máxima de atención por paciente
        $subquery = DB::table(DB::raw(
            "
        (SELECT paciente, MAX(fecha_atencion) AS ultima_atencion, GROUP_CONCAT(DISTINCT doctor ORDER BY doctor ASC SEPARATOR ', ') AS doctores
        FROM (
            SELECT paciente, fecha_atencion, doctor FROM optometria_neonatos
            UNION
            SELECT paciente, fecha_atencion, doctor FROM optometria_pediatrica
            UNION
            SELECT paciente, fecha_atencion, doctor FROM ortoptica_adultos
            UNION
            SELECT paciente, fecha_atencion, doctor FROM consultagenerica
            UNION
            SELECT paciente, fecha_atencion, doctor FROM refracciongeneral
        ) AS todas_las_atenciones
        GROUP BY paciente) AS todas_las_atenciones"
        ));

        // Subconsulta para las nuevas tablas
        $subqueryTerapias = DB::table(DB::raw(
            "
        (SELECT id_paciente AS paciente, DATE(fecha_creacion) AS fecha_atencion
        FROM terapias_bajav
        UNION
        SELECT id_paciente AS paciente, DATE(fecha_creacion) AS fecha_atencion
        FROM terapias_optometria_neonatos
        UNION
        SELECT id_paciente AS paciente, DATE(fecha_creacion) AS fecha_atencion
        FROM terapias_optometria_pediatrica
        UNION
        SELECT id_paciente AS paciente, DATE(fecha_creacion) AS fecha_atencion
        FROM terapias_ortoptica_adultos) AS terapias"
        ));

        // Construir la consulta base
        $pacientesQuery = DB::table('pacientes')
            ->leftJoinSub($subquery, 'todas_las_atenciones', function ($join) {
                $join->on('pacientes.id_paciente', '=', 'todas_las_atenciones.paciente');
            })
            ->leftJoinSub($subqueryTerapias, 'terapias', function ($join) {
                $join->on('pacientes.id_paciente', '=', 'terapias.paciente');
            })
            ->select(
                'pacientes.id_paciente',
                'pacientes.nombres',
                'pacientes.apellidos',
                'pacientes.nro_cedula',
                'pacientes.email',
                'pacientes.direccion',
                'pacientes.celular',
                DB::raw('MAX(ultima_atencion) AS ultima_atencion'),
                DB::raw("GROUP_CONCAT(DISTINCT todas_las_atenciones.doctores ORDER BY todas_las_atenciones.doctores ASC SEPARATOR ', ') AS doctores")
            )
            ->groupBy(
                'pacientes.id_paciente',
                'pacientes.nombres',
                'pacientes.apellidos',
                'pacientes.nro_cedula',
                'pacientes.email',
                'pacientes.direccion',
                'pacientes.celular'
            );

        // Aplicar filtros de búsqueda si se proporciona un término de búsqueda
        if ($searchTerm) {
            $pacientesQuery->where(function ($query) use ($searchTerm) {
                $query->where('pacientes.nombres', 'like', "%$searchTerm%")
                    ->orWhere('pacientes.apellidos', 'like', "%$searchTerm%")
                    ->orWhere('pacientes.nro_cedula', 'like', "%$searchTerm%")
                    ->orWhere('pacientes.email', 'like', "%$searchTerm%")
                    ->orWhere('pacientes.direccion', 'like', "%$searchTerm%");
            });
        }

        // Aplicar filtros de fecha si se proporcionan
        if ($fecha !== null) {
            if (strpos($fecha, ' - ') !== false) {
                list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                $pacientesQuery->havingRaw("COALESCE(ultima_atencion, '1970-01-01') BETWEEN ? AND ?", [$fechaInicio, $fechaFin]);
            } else {
                $pacientesQuery->havingRaw("COALESCE(ultima_atencion, '1970-01-01') = ?", [$fecha]);
            }
        }

        $totalPacientes = DB::table('pacientes')->count();


        // Aplicar ordenamiento
        if ($ordenPor === 'doctores') {
            $pacientesQuery->orderBy(DB::raw('TRIM(doctores)'), $orden);
        } else {
            $pacientesQuery->orderBy(DB::raw('TRIM(pacientes.' . $ordenPor . ')'), $orden);
        }



        // Aplicar limit y offset
        $offset = ($page - 1) * $limit;
        $pacientes = $pacientesQuery->offset($offset)->limit($limit)->get();

        return response()->json([
            'data' => $pacientes,
            'meta' => [
                'total' => $totalPacientes,
                'page' => $page,
                'limit' => $limit,
            ],
            'status' => [
                'code' => 200,
                'message' => 'Pacientes retrieved successfully',
            ],
        ]);
    }

    public function PacientesConsultasDiarias(Request $request)
    {
        // Obtener parámetros de la solicitud
        $valor = $request->input('valor', 10); // Valor por defecto de 10 si no se proporciona
        $fecha = $request->input('fecha');

        // Inicializar los parámetros de consulta
        $query = DB::table('pacientes')
            ->select(
                'pacientes.id_paciente as ID_PACIENTE',
                'pacientes.nombres as PACIENTE_NOMBRE',
                'pacientes.apellidos as PACIENTE_APELLIDO',
                'pacientes.nro_cedula as PACIENTE_CEDULA',
                'pacientes.celular as PACIENTE_CELULAR',
                'b.fecha_atencion as FECHA_ATENCION',
                'b.doctor as DOCTOR',
                's.nombre as SUCURSAL',
                DB::raw("'Consulta Baja Visión' as TIPO")
            )
            ->leftJoin('baja_vision as b', 'pacientes.id_paciente', '=', 'b.paciente')
            ->leftJoin('sucursales as s', 'b.sucursal', '=', 's.id_sucursal')
            ->where(function ($query) use ($fecha) {
                if ($fecha !== null) {
                    if (strpos($fecha, ' - ') !== false) {
                        list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                        $query->whereBetween('b.fecha_atencion', [$fechaInicio, $fechaFin]);
                    } else {
                        $query->where('b.fecha_atencion', $fecha);
                    }
                }
            })
            ->unionAll(
                DB::table('pacientes')
                    ->select(
                        'pacientes.id_paciente',
                        'pacientes.nombres',
                        'pacientes.apellidos',
                        'pacientes.nro_cedula',
                        'pacientes.celular',
                        'o.fecha_atencion',
                        'o.doctor',
                        's.nombre',
                        DB::raw("'Optometría Neonatos' as TIPO")
                    )
                    ->join('optometria_neonatos as o', 'pacientes.id_paciente', '=', 'o.paciente')
                    ->leftJoin('sucursales as s', 'o.sucursal', '=', 's.id_sucursal')
                    ->where(function ($query) use ($fecha) {
                        if ($fecha !== null) {
                            if (strpos($fecha, ' - ') !== false) {
                                list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                                $query->whereBetween('o.fecha_atencion', [$fechaInicio, $fechaFin]);
                            } else {
                                $query->where('o.fecha_atencion', $fecha);
                            }
                        }
                    })
            )
            ->unionAll(
                DB::table('pacientes')
                    ->select(
                        'pacientes.id_paciente',
                        'pacientes.nombres',
                        'pacientes.apellidos',
                        'pacientes.nro_cedula',
                        'pacientes.celular',
                        'o.fecha_atencion',
                        'o.doctor',
                        's.nombre',
                        DB::raw("'Optometría Pediátrica' as TIPO")
                    )
                    ->join('optometria_pediatrica as o', 'pacientes.id_paciente', '=', 'o.paciente')
                    ->leftJoin('sucursales as s', 'o.sucursal', '=', 's.id_sucursal')
                    ->where(function ($query) use ($fecha) {
                        if ($fecha !== null) {
                            if (strpos($fecha, ' - ') !== false) {
                                list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                                $query->whereBetween('o.fecha_atencion', [$fechaInicio, $fechaFin]);
                            } else {
                                $query->where('o.fecha_atencion', $fecha);
                            }
                        }
                    })
            )
            ->unionAll(
                DB::table('pacientes')
                    ->select(
                        'pacientes.id_paciente',
                        'pacientes.nombres',
                        'pacientes.apellidos',
                        'pacientes.nro_cedula',
                        'pacientes.celular',
                        'o.fecha_atencion',
                        'o.doctor',
                        's.nombre',
                        DB::raw("'Ortóptica Adultos' as TIPO")
                    )
                    ->join('ortoptica_adultos as o', 'pacientes.id_paciente', '=', 'o.paciente')
                    ->leftJoin('sucursales as s', 'o.sucursal', '=', 's.id_sucursal')
                    ->where(function ($query) use ($fecha) {
                        if ($fecha !== null) {
                            if (strpos($fecha, ' - ') !== false) {
                                list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                                $query->whereBetween('o.fecha_atencion', [$fechaInicio, $fechaFin]);
                            } else {
                                $query->where('o.fecha_atencion', $fecha);
                            }
                        }
                    })
            )
            ->unionAll(
                DB::table('pacientes')
                    ->select(
                        'pacientes.id_paciente',
                        'pacientes.nombres',
                        'pacientes.apellidos',
                        'pacientes.nro_cedula',
                        'pacientes.celular',
                        'c.fecha_atencion',
                        'c.doctor',
                        's.nombre',
                        DB::raw("'Historia Clínica' as TIPO")
                    )
                    ->join('consultagenerica as c', 'pacientes.id_paciente', '=', 'c.paciente')
                    ->leftJoin('sucursales as s', 'c.sucursal', '=', 's.id_sucursal')
                    ->where(function ($query) use ($fecha) {
                        if ($fecha !== null) {
                            if (strpos($fecha, ' - ') !== false) {
                                list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                                $query->whereBetween('c.fecha_atencion', [$fechaInicio, $fechaFin]);
                            } else {
                                $query->where('c.fecha_atencion', $fecha);
                            }
                        }
                    })
            )
            ->unionAll(
                DB::table('pacientes')
                    ->select(
                        'pacientes.id_paciente',
                        'pacientes.nombres',
                        'pacientes.apellidos',
                        'pacientes.nro_cedula',
                        'pacientes.celular',
                        'r.fecha_atencion',
                        'r.doctor',
                        's.nombre',
                        DB::raw("'Optometría General' as TIPO")
                    )
                    ->join('refracciongeneral as r', 'pacientes.id_paciente', '=', 'r.paciente')
                    ->leftJoin('sucursales as s', 'r.sucursal', '=', 's.id_sucursal')
                    ->where(function ($query) use ($fecha) {
                        if ($fecha !== null) {
                            if (strpos($fecha, ' - ') !== false) {
                                list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                                $query->whereBetween('r.fecha_atencion', [$fechaInicio, $fechaFin]);
                            } else {
                                $query->where('r.fecha_atencion', $fecha);
                            }
                        }
                    })
            )
            ->orderBy('FECHA_ATENCION', 'desc')
            ->paginate($valor);

        // Formatear la respuesta
        return response()->json([
            'data' => $query->items(),
            'meta' => [
                'total' => $query->total(),
                'per_page' => $query->perPage(),
                'current_page' => $query->currentPage(),
                'last_page' => $query->lastPage(),
                'from' => $query->firstItem(),
                'to' => $query->lastItem()
            ],
            'status' => 'success'
        ]);
    }
}