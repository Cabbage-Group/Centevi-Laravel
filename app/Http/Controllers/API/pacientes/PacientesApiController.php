<?php

namespace App\Http\Controllers\API\pacientes;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pacientes;
use App\Models\HistoriaClinica;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;



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
        "sucursal" => 'nullable|int|max:11',
        "doctor" => 'nullable|string|max:255',
        'nombres' => 'nullable|string|max:255',
        'apellidos' => 'nullable|string|max:255',
        'email' => 'nullable|string|email|max:255',
        'nro_seguro' => 'nullable|string|max:20',
        'fecha_nacimiento' => 'nullable|date',
        'genero' => 'nullable|string',
        'lugar_nacimiento' => 'nullable|string|max:255',
        'direccion' => 'nullable|string|max:255',
        'ocupacion' => 'nullable|string|max:255',
        'telefono' => 'nullable|string|max:20',
        'celular' => 'nullable|string|max:20',
        'medico' => 'nullable|string|max:255',
        'urgencia' => 'nullable|string',
        'menor' => 'nullable|string',
        'fecha_creacion' => 'nullable|date',
        'nro_cedula' => 'nullable|string|max:20|unique:pacientes',
    ]);

    // Retornar errores de validación si los hay
    if ($validator->fails()) {
        return response()->json([
            'respuesta' => false,
            'mensaje' => 'Validation errors',
            'data' => [],
            'mensaje_dev' => "Opps el numero de cedula ya existe"
        ], 400);
    }

    // Obtener los datos de la solicitud y rellenar los valores faltantes
    $data = $request->all();
    $defaults = [
        'sucursal' => '1', //cambiar cuando se realize la parte de login
        'doctor' => 'Pepe', //cambiar cuando se realize la parte de login
        'nombres' => '',
        'apellidos' => '',
        'email' => '',
        'nro_seguro' => '',
        'fecha_nacimiento' => '',
        'genero' => '',
        'lugar_nacimiento' => '',
        'direccion' => '',
        'ocupacion' => '',
        'telefono' => '',
        'celular' => '',
        'medico' => '',
        'urgencia' => '',
        'menor' => '',
        'fecha_creacion' => now()->format('Y/m/d'),
        'nro_cedula' => ''
    ];

    // Rellenar datos faltantes con valores predeterminados
    $data = array_merge($defaults, $data);

    // Crear un nuevo paciente
    $paciente = Pacientes::create($data);

    // Retornar respuesta exitosa
    return response()->json([
        'respuesta' => true,
        'mensaje' => 'Paciente registrado correctamente',
        'data' => [$paciente],
        'mensaje_dev' => null
    ], 201);
}



    public function verificarCedula(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nro_cedula' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'respuesta' => false,
                'mensaje' => 'Validation errors',
                'data' => [],
                'mensaje_dev' => 'Número de cédula inválido'
            ], 400);
        }

        $exists = Pacientes::where('nro_cedula', $request->input('nro_cedula'))->exists();

        return response()->json([
            'respuesta' => true,
            'data' => ['exists' => $exists]
        ], 200);
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
    $page = (int) $request->input('page', 1); 
    $limit = (int) $request->input('limit', 20); 
    $orden = $request->input('orden', 'asc');
    $ordenPor = $request->input('ordenPor', 'nombres');
    $searchTerm = trim($request->input('search', '')); 

    
    if (!in_array($orden, ['asc', 'desc'])) {
        $orden = 'asc'; 
    }
    $camposPermitidos = ['nombres', 'nro_cedula', 'email', 'direccion', 'doctores'];

    if (!in_array($ordenPor, $camposPermitidos)) {
        $ordenPor = 'nombres'; 
    }

  
    $subquery = DB::table(DB::raw(
        "
        (SELECT paciente, MAX(fecha_atencion) AS ultima_atencion, 
        GROUP_CONCAT(DISTINCT doctor ORDER BY doctor ASC SEPARATOR ', ') AS doctores
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


    $pacientesQuery = DB::table('pacientes')
        ->leftJoinSub($subquery, 'todas_las_atenciones', function ($join) {
            $join->on('pacientes.id_paciente', '=', 'todas_las_atenciones.paciente');
        })
        ->leftJoinSub($subqueryTerapias, 'terapias', function ($join) {
            $join->on('pacientes.id_paciente', '=', 'terapias.paciente');
        })
        ->select(
            'pacientes.id_paciente AS id',
            'pacientes.nombres AS nombres',
            'pacientes.apellidos AS apellidos',
            'pacientes.nro_cedula AS nro_cedula',
            'pacientes.email AS email',
            'pacientes.direccion AS direccion',
            'pacientes.celular AS celular',
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

    
    if ($searchTerm) {
        $pacientesQuery->where(function ($query) use ($searchTerm) {
            $query->where('pacientes.nombres', 'like', "%$searchTerm%")
                ->orWhere('pacientes.apellidos', 'like', "%$searchTerm%")
                ->orWhere('pacientes.nro_cedula', 'like', "%$searchTerm%")
                ->orWhere('pacientes.email', 'like', "%$searchTerm%")
                ->orWhere('pacientes.direccion', 'like', "%$searchTerm%")
                ->orWhere(DB::raw('TRIM(todas_las_atenciones.doctores)'), 'like', "%$searchTerm%"); 
        });
    }

    
    if ($fecha !== null) {
        if (strpos($fecha, ' - ') !== false) {
            list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
            $pacientesQuery->havingRaw("COALESCE(ultima_atencion, '1970-01-01') BETWEEN ? AND ?", [$fechaInicio, $fechaFin]);
        } else {
            $pacientesQuery->havingRaw("COALESCE(ultima_atencion, '1970-01-01') = ?", [$fecha]);
        }
    }

    
    if ($ordenPor === 'doctores') {
        $pacientesQuery->orderBy(DB::raw('TRIM(doctores)'), $orden);
    } else {
        $pacientesQuery->orderBy(DB::raw('TRIM(pacientes.' . $ordenPor . ')'), $orden);
    }

    
    $totalPacientes = DB::table('pacientes')->count();

   
    $result = $pacientesQuery->paginate($limit, ['*'], 'page', $page);

   
    $exportResult = $pacientesQuery->get();

    return response()->json([
        'data' => $result->items(),
        'meta' => [
            'total' => $result->total(),
            'page' => $result->currentPage(),
            'limit' => $limit,
        ],
        'export' => [
            'dataexport' => $exportResult,
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
        $limit = (int) $request->input('limit', 10); 
        $fecha = $request->input('fecha');
        $orden = $request->input('orden', 'asc'); 
        $ordenPor = $request->input('ordenPor', 'FECHA_ATENCION');
        $page = (int) $request->input('page', 1);
        $search = $request->input('search', ''); 

        $orden = in_array($orden, ['asc', 'desc']) ? $orden : 'asc';
        $ordenPor = in_array($ordenPor, [
            'ID_PACIENTE', 'PACIENTE_NOMBRE', 'PACIENTE_APELLIDO', 'PACIENTE_CEDULA',
            'PACIENTE_CELULAR', 'FECHA_ATENCION', 'DOCTOR', 'SUCURSAL', 'TIPO'
        ]) ? $ordenPor : 'FECHA_ATENCION';

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
            ->where(function ($query) use ($fecha, $search) {
                if ($fecha !== null) {
                    if (strpos($fecha, ' - ') !== false) {
                        list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                        $query->whereBetween('b.fecha_atencion', [$fechaInicio, $fechaFin]);
                    } else {
                        $query->where('b.fecha_atencion', $fecha);
                    }
                }
                if ($search !== '') {
                    $query->where(function ($subquery) use ($search) {
                        $subquery->where('pacientes.id_paciente', 'like', "%{$search}%")
                            ->orWhere('pacientes.nombres', 'like', "%{$search}%")
                            ->orWhere('pacientes.apellidos', 'like', "%{$search}%")
                            ->orWhere('pacientes.nro_cedula', 'like', "%{$search}%")
                            ->orWhere('pacientes.celular', 'like', "%{$search}%")
                            ->orWhere('b.fecha_atencion', 'like', "%{$search}%")
                            ->orWhere('b.doctor', 'like', "%{$search}%")
                            ->orWhere('s.nombre', 'like', "%{$search}%")
                            ->orWhere(DB::raw("'Consulta Baja Visión'"), 'like', "%{$search}%");
                    });
                }
            });
        $query->unionAll(
            DB::table('pacientes')
                ->select(
                    'pacientes.id_paciente as ID_PACIENTE',
                    'pacientes.nombres as PACIENTE_NOMBRE',
                    'pacientes.apellidos as PACIENTE_APELLIDO',
                    'pacientes.nro_cedula as PACIENTE_CEDULA',
                    'pacientes.celular as PACIENTE_CELULAR',
                    'o.fecha_atencion as FECHA_ATENCION',
                    'o.doctor as DOCTOR',
                    's.nombre as SUCURSAL',
                    DB::raw("'Optometría Neonatos' as TIPO")
                )
                ->join('optometria_neonatos as o', 'pacientes.id_paciente', '=', 'o.paciente')
                ->leftJoin('sucursales as s', 'o.sucursal', '=', 's.id_sucursal')
                ->where(function ($query) use ($fecha, $search) {
                    if ($fecha !== null) {
                        if (strpos($fecha, ' - ') !== false) {
                            list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                            $query->whereBetween('o.fecha_atencion', [$fechaInicio, $fechaFin]);
                        } else {
                            $query->where('o.fecha_atencion', $fecha);
                        }
                    }
                    if ($search !== '') {
                        $query->where(function ($subquery) use ($search) {
                            $subquery->where('pacientes.id_paciente', 'like', "%{$search}%")
                                ->orWhere('pacientes.nombres', 'like', "%{$search}%")
                                ->orWhere('pacientes.apellidos', 'like', "%{$search}%")
                                ->orWhere('pacientes.nro_cedula', 'like', "%{$search}%")
                                ->orWhere('pacientes.celular', 'like', "%{$search}%")
                                ->orWhere('o.fecha_atencion', 'like', "%{$search}%")
                                ->orWhere('o.doctor', 'like', "%{$search}%")
                                ->orWhere('s.nombre', 'like', "%{$search}%")
                                ->orWhere(DB::raw("'Optometría Neonatos'"), 'like', "%{$search}%");
                        });
                    }
                })
        );
        $query->unionAll(
            DB::table('pacientes')
                ->select(
                    'pacientes.id_paciente as ID_PACIENTE',
                    'pacientes.nombres as PACIENTE_NOMBRE',
                    'pacientes.apellidos as PACIENTE_APELLIDO',
                    'pacientes.nro_cedula as PACIENTE_CEDULA',
                    'pacientes.celular as PACIENTE_CELULAR',
                    'o.fecha_atencion as FECHA_ATENCION',
                    'o.doctor as DOCTOR',
                    's.nombre as SUCURSAL',
                    DB::raw("'Optometría Pediátrica' as TIPO")
                )
                ->join('optometria_pediatrica as o', 'pacientes.id_paciente', '=', 'o.paciente')
                ->leftJoin('sucursales as s', 'o.sucursal', '=', 's.id_sucursal')
                ->where(function ($query) use ($fecha, $search) {
                    if ($fecha !== null) {
                        if (strpos($fecha, ' - ') !== false) {
                            list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                            $query->whereBetween('o.fecha_atencion', [$fechaInicio, $fechaFin]);
                        } else {
                            $query->where('o.fecha_atencion', $fecha);
                        }
                    }
                    if ($search !== '') {
                        $query->where(function ($subquery) use ($search) {
                            $subquery->where('pacientes.id_paciente', 'like', "%{$search}%")
                                ->orWhere('pacientes.nombres', 'like', "%{$search}%")
                                ->orWhere('pacientes.apellidos', 'like', "%{$search}%")
                                ->orWhere('pacientes.nro_cedula', 'like', "%{$search}%")
                                ->orWhere('pacientes.celular', 'like', "%{$search}%")
                                ->orWhere('o.fecha_atencion', 'like', "%{$search}%")
                                ->orWhere('o.doctor', 'like', "%{$search}%")
                                ->orWhere('s.nombre', 'like', "%{$search}%")
                                ->orWhere(DB::raw("'Optometría Pediátrica'"), 'like', "%{$search}%");
                        });
                    }
                })
        );

        $query->unionAll(
            DB::table('pacientes')
                ->select(
                    'pacientes.id_paciente as ID_PACIENTE',
                    'pacientes.nombres as PACIENTE_NOMBRE',
                    'pacientes.apellidos as PACIENTE_APELLIDO',
                    'pacientes.nro_cedula as PACIENTE_CEDULA',
                    'pacientes.celular as PACIENTE_CELULAR',
                    'o.fecha_atencion as FECHA_ATENCION',
                    'o.doctor as DOCTOR',
                    's.nombre as SUCURSAL',
                    DB::raw("'Ortoptica Adultos' as TIPO")
                )
                ->join('ortoptica_adultos as o', 'pacientes.id_paciente', '=', 'o.paciente')
                ->leftJoin('sucursales as s', 'o.sucursal', '=', 's.id_sucursal')
                ->where(function ($query) use ($fecha, $search) {
                    if ($fecha !== null) {
                        if (strpos($fecha, ' - ') !== false) {
                            list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                            $query->whereBetween('o.fecha_atencion', [$fechaInicio, $fechaFin]);
                        } else {
                            $query->where('o.fecha_atencion', $fecha);
                        }
                    }
                    if ($search !== '') {
                        $query->where(function ($subquery) use ($search) {
                            $subquery->where('pacientes.id_paciente', 'like', "%{$search}%")
                                ->orWhere('pacientes.nombres', 'like', "%{$search}%")
                                ->orWhere('pacientes.apellidos', 'like', "%{$search}%")
                                ->orWhere('pacientes.nro_cedula', 'like', "%{$search}%")
                                ->orWhere('pacientes.celular', 'like', "%{$search}%")
                                ->orWhere('o.fecha_atencion', 'like', "%{$search}%")
                                ->orWhere('o.doctor', 'like', "%{$search}%")
                                ->orWhere('s.nombre', 'like', "%{$search}%")
                                ->orWhere(DB::raw("'Ortoptica Adultos'"), 'like', "%{$search}%");
                        });
                    }
                })
        );

        $query->unionAll(
            DB::table('pacientes')
                ->select(
                    'pacientes.id_paciente as ID_PACIENTE',
                    'pacientes.nombres as PACIENTE_NOMBRE',
                    'pacientes.apellidos as PACIENTE_APELLIDO',
                    'pacientes.nro_cedula as PACIENTE_CEDULA',
                    'pacientes.celular as PACIENTE_CELULAR',
                    'c.fecha_atencion as FECHA_ATENCION',
                    'c.doctor as DOCTOR',
                    's.nombre as SUCURSAL',
                    DB::raw("'Historia Clínica' as TIPO")
                )
                ->join('consultagenerica as c', 'pacientes.id_paciente', '=', 'c.paciente')
                ->leftJoin('sucursales as s', 'c.sucursal', '=', 's.id_sucursal')
                ->where(function ($query) use ($fecha, $search) {
                    if ($fecha !== null) {
                        if (strpos($fecha, ' - ') !== false) {
                            list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                            $query->whereBetween('c.fecha_atencion', [$fechaInicio, $fechaFin]);
                        } else {
                            $query->where('c.fecha_atencion', $fecha);
                        }
                    }
                    if ($search !== '') {
                        $query->where(function ($subquery) use ($search) {
                            $subquery->where('pacientes.id_paciente', 'like', "%{$search}%")
                                ->orWhere('pacientes.nombres', 'like', "%{$search}%")
                                ->orWhere('pacientes.apellidos', 'like', "%{$search}%")
                                ->orWhere('pacientes.nro_cedula', 'like', "%{$search}%")
                                ->orWhere('pacientes.celular', 'like', "%{$search}%")
                                ->orWhere('c.fecha_atencion', 'like', "%{$search}%")
                                ->orWhere('c.doctor', 'like', "%{$search}%")
                                ->orWhere('s.nombre', 'like', "%{$search}%")
                                ->orWhere(DB::raw("'Historia Clínica'"), 'like', "%{$search}%");
                        });
                    }
                })
        );

        $query->unionAll(
            DB::table('pacientes')
                ->select(
                    'pacientes.id_paciente as ID_PACIENTE',
                    'pacientes.nombres as PACIENTE_NOMBRE',
                    'pacientes.apellidos as PACIENTE_APELLIDO',
                    'pacientes.nro_cedula as PACIENTE_CEDULA',
                    'pacientes.celular as PACIENTE_CELULAR',
                    'r.fecha_atencion as FECHA_ATENCION',
                    'r.doctor as DOCTOR',
                    's.nombre as SUCURSAL',
                    DB::raw("'Optometría General' as TIPO")
                )
                ->join('refracciongeneral as r', 'pacientes.id_paciente', '=', 'r.paciente')
                ->leftJoin('sucursales as s', 'r.sucursal', '=', 's.id_sucursal')
                ->where(function ($query) use ($fecha, $search) {
                    if ($fecha !== null) {
                        if (strpos($fecha, ' - ') !== false) {
                            list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                            $query->whereBetween('r.fecha_atencion', [$fechaInicio, $fechaFin]);
                        } else {
                            $query->where('r.fecha_atencion', $fecha);
                        }
                    }
                    if ($search !== '') {
                        $query->where(function ($subquery) use ($search) {
                            $subquery->where('pacientes.id_paciente', 'like', "%{$search}%")
                                ->orWhere('pacientes.nombres', 'like', "%{$search}%")
                                ->orWhere('pacientes.apellidos', 'like', "%{$search}%")
                                ->orWhere('pacientes.nro_cedula', 'like', "%{$search}%")
                                ->orWhere('pacientes.celular', 'like', "%{$search}%")
                                ->orWhere('r.fecha_atencion', 'like', "%{$search}%")
                                ->orWhere('r.doctor', 'like', "%{$search}%")
                                ->orWhere('s.nombre', 'like', "%{$search}%")
                                ->orWhere(DB::raw("'Optometría General'"), 'like', "%{$search}%");
                        });
                    }
                })
        );

        // Calcular el offset y limitar la consulta
        $result = DB::table(DB::raw("({$query->toSql()}) as sub"))
            ->mergeBindings($query)
            ->orderBy($ordenPor, $orden)
            ->paginate($limit, ['*'], 'page', $page);
        
        $exportResult =  DB::table(DB::raw("({$query->toSql()}) as sub"))
            ->mergeBindings($query)
            ->orderBy($ordenPor, $orden);

        return response()->json([
            'data' => $result->items(),
            'meta' => [
                'page' => $result->currentPage(),
                'total' => $result->total(),
                'limit' => $limit
            ],
            'export' => [
                'dataexport' => $exportResult->get(),
            ],
            'status' => [
                'code' => 200,
                'message' => 'Pacientes retrieved successfully',
            ],

        ]);
    }




    public function PacientesTerapiasDiarias(Request $request)
    {
        // Obtener parámetros de la solicitud
        $limit = (int) $request->input('limit', 10); // Valor por defecto de 10 si no se proporciona
        $fecha = $request->input('fecha');
        $page = (int) $request->input('page', 1);
        $orden = $request->input('orden', 'asc'); // Valor por defecto 'asc' si no se proporciona
        $ordenPor = $request->input('ordenPor', 'FECHA_ATENCION'); // Valor por defecto 'FECHA_ATENCION' si no se proporciona
        $search = $request->input('search', ''); // Valor por defecto vacío si no se proporciona

        // Validar valores de orden y ordenPor
        $orden = in_array($orden, ['asc', 'desc']) ? $orden : 'asc';
        $ordenPor = in_array($ordenPor, [
            'ID_PACIENTE', 'PACIENTE_NOMBRE', 'PACIENTE_APELLIDO', 'PACIENTE_CEDULA',
            'PACIENTE_CELULAR', 'FECHA_ATENCION', 'DOCTOR', 'SUCURSAL', 'TIPO'
        ]) ? $ordenPor : 'FECHA_ATENCION';

        // Inicializar la consulta base
        $query = DB::table('pacientes')
            ->select(
                'pacientes.id_paciente as ID_PACIENTE',
                'pacientes.nombres as PACIENTE_NOMBRE',
                'pacientes.apellidos as PACIENTE_APELLIDO',
                'pacientes.nro_cedula as PACIENTE_CEDULA',
                'pacientes.celular as PACIENTE_CELULAR',
                'terapia_bajav.fecha_creacion as FECHA_ATENCION',
                'terapia_bajav.doctor as DOCTOR',
                'sucursales.nombre as SUCURSAL',
                DB::raw("'Terapia Baja Visión' as TIPO")
            )
            ->join('terapias_bajav', 'pacientes.id_paciente', '=', 'terapias_bajav.id_paciente')
            ->join('terapia_bajav', 'terapia_bajav.id_terapia', '=', 'terapias_bajav.id_terapia')
            ->leftJoin('sucursales', 'terapia_bajav.sucursal', '=', 'sucursales.id_sucursal')
            ->where(function ($query) use ($fecha, $search) {
                if ($fecha !== null) {
                    if (strpos($fecha, ' - ') !== false) {
                        list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                        $query->whereBetween('terapia_bajav.fecha_creacion', [$fechaInicio, $fechaFin]);
                    } else {
                        $query->where('terapia_bajav.fecha_creacion', $fecha);
                    }
                }
                if ($search !== '') {
                    $query->where(function ($query) use ($search) {
                        $query->where('pacientes.id_paciente', 'like', "%{$search}%")
                            ->orWhere('pacientes.nombres', 'like', "%{$search}%")
                            ->orWhere('pacientes.apellidos', 'like', "%{$search}%")
                            ->orWhere('pacientes.nro_cedula', 'like', "%{$search}%")
                            ->orWhere('pacientes.celular', 'like', "%{$search}%")
                            ->orWhere('terapia_bajav.fecha_creacion', 'like', "%{$search}%")
                            ->orWhere('terapia_bajav.doctor', 'like', "%{$search}%")
                            ->orWhere('sucursales.nombre', 'like', "%{$search}%")
                            ->orWhere(DB::raw("'Terapia Baja Visión'"), 'like', "%{$search}%");
                    });
                }
            });

        // Unir con otras tablas similares
        $query->unionAll(
            DB::table('pacientes')
                ->select(
                    'pacientes.id_paciente as ID_PACIENTE',
                    'pacientes.nombres as PACIENTE_NOMBRE',
                    'pacientes.apellidos as PACIENTE_APELLIDO',
                    'pacientes.nro_cedula as PACIENTE_CEDULA',
                    'pacientes.celular as PACIENTE_CELULAR',
                    'terapia_optometria_neonatos.fecha_creacion as FECHA_ATENCION',
                    'terapia_optometria_neonatos.doctor as DOCTOR',
                    'sucursales.nombre as SUCURSAL',
                    DB::raw("'Terapia Optometría Neonatos' as TIPO")
                )
                ->join('terapias_optometria_neonatos', 'pacientes.id_paciente', '=', 'terapias_optometria_neonatos.id_paciente')
                ->join('terapia_optometria_neonatos', 'terapias_optometria_neonatos.id_terapia', '=', 'terapia_optometria_neonatos.id_terapia')
                ->leftJoin('sucursales', 'terapia_optometria_neonatos.sucursal', '=', 'sucursales.id_sucursal')
                ->where(function ($query) use ($fecha, $search) {
                    if ($fecha !== null) {
                        if (strpos($fecha, ' - ') !== false) {
                            list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                            $query->whereBetween('terapia_optometria_neonatos.fecha_creacion', [$fechaInicio, $fechaFin]);
                        } else {
                            $query->where('terapia_optometria_neonatos.fecha_creacion', $fecha);
                        }
                    }
                    if ($search !== '') {
                        $query->where(function ($query) use ($search) {
                            $query->where('pacientes.id_paciente', 'like', "%{$search}%")
                                ->orWhere('pacientes.nombres', 'like', "%{$search}%")
                                ->orWhere('pacientes.apellidos', 'like', "%{$search}%")
                                ->orWhere('pacientes.nro_cedula', 'like', "%{$search}%")
                                ->orWhere('terapia_optometria_neonatos.fecha_creacion', 'like', "%{$search}%")
                                ->orWhere('terapia_optometria_neonatos.doctor', 'like', "%{$search}%")
                                ->orWhere('sucursales.nombre', 'like', "%{$search}%")
                                ->orWhere(DB::raw("'Terapia Optometría Neonatos'"), 'like', "%{$search}%");
                        });
                    }
                })
        );

        // Repetir para las demás tablas
        $query->unionAll(
            DB::table('pacientes')
                ->select(
                    'pacientes.id_paciente as ID_PACIENTE',
                    'pacientes.nombres as PACIENTE_NOMBRE',
                    'pacientes.apellidos as PACIENTE_APELLIDO',
                    'pacientes.nro_cedula as PACIENTE_CEDULA',
                    'pacientes.celular as PACIENTE_CELULAR',
                    'terapia_optometria_pediatrica.fecha_creacion as FECHA_ATENCION',
                    'terapia_optometria_pediatrica.doctor as DOCTOR',
                    'sucursales.nombre as SUCURSAL',
                    DB::raw("'Terapia Optometría Pediátrica' as TIPO")
                )
                ->join('terapias_optometria_pediatrica', 'pacientes.id_paciente', '=', 'terapias_optometria_pediatrica.id_paciente')
                ->join('terapia_optometria_pediatrica', 'terapias_optometria_pediatrica.id_terapia', '=', 'terapia_optometria_pediatrica.id_terapia')
                ->leftJoin('sucursales', 'terapia_optometria_pediatrica.sucursal', '=', 'sucursales.id_sucursal')
                ->where(function ($query) use ($fecha, $search) {
                    if ($fecha !== null) {
                        if (strpos($fecha, ' - ') !== false) {
                            list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                            $query->whereBetween('terapia_optometria_pediatrica.fecha_creacion', [$fechaInicio, $fechaFin]);
                        } else {
                            $query->where('terapia_optometria_pediatrica.fecha_creacion', $fecha);
                        }
                    }
                    if ($search !== '') {
                        $query->where(function ($query) use ($search) {
                            $query->where('pacientes.nombres', 'like', "%{$search}%")
                                ->orWhere('pacientes.nombres', 'like', "%{$search}%")
                                ->orWhere('pacientes.apellidos', 'like', "%{$search}%")
                                ->orWhere('pacientes.nro_cedula', 'like', "%{$search}%")
                                ->orWhere('pacientes.celular', 'like', "%{$search}%")
                                ->orWhere('terapia_optometria_pediatrica.fecha_creacion', 'like', "%{$search}%")
                                ->orWhere('terapia_optometria_pediatrica.doctor', 'like', "%{$search}%")
                                ->orWhere('sucursales.nombre', 'like', "%{$search}%")
                                ->orWhere(DB::raw("'Terapia Optometría Pediátrica'"), 'like', "%{$search}%");
                        });
                    }
                })
        );

        $query->unionAll(
            DB::table('pacientes')
                ->select(
                    'pacientes.id_paciente as ID_PACIENTE',
                    'pacientes.nombres as PACIENTE_NOMBRE',
                    'pacientes.apellidos as PACIENTE_APELLIDO',
                    'pacientes.nro_cedula as PACIENTE_CEDULA',
                    'pacientes.celular as PACIENTE_CELULAR',
                    'terapia_ortoptica_adultos.fecha_creacion as FECHA_ATENCION',
                    'terapia_ortoptica_adultos.doctor as DOCTOR',
                    'sucursales.nombre as SUCURSAL',
                    DB::raw("'Terapia Ortóptica Adultos' as TIPO")
                )
                ->join('terapias_ortoptica_adultos', 'pacientes.id_paciente', '=', 'terapias_ortoptica_adultos.id_paciente')
                ->join('terapia_ortoptica_adultos', 'terapias_ortoptica_adultos.id_terapia', '=', 'terapia_ortoptica_adultos.id_terapia')
                ->leftJoin('sucursales', 'terapia_ortoptica_adultos.sucursal', '=', 'sucursales.id_sucursal')
                ->where(function ($query) use ($fecha, $search) {
                    if ($fecha !== null) {
                        if (strpos($fecha, ' - ') !== false) {
                            list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                            $query->whereBetween('terapia_ortoptica_adultos.fecha_creacion', [$fechaInicio, $fechaFin]);
                        } else {
                            $query->where('terapia_ortoptica_adultos.fecha_creacion', $fecha);
                        }
                    }
                    if ($search !== '') {
                        $query->where(function ($query) use ($search) {
                            $query->where('pacientes.nombres', 'like', "%{$search}%")
                                ->orWhere('pacientes.nombres', 'like', "%{$search}%")
                                ->orWhere('pacientes.apellidos', 'like', "%{$search}%")
                                ->orWhere('pacientes.nro_cedula', 'like', "%{$search}%")
                                ->orWhere('pacientes.celular', 'like', "%{$search}%")
                                ->orWhere('terapia_ortoptica_adultos.fecha_creacion', 'like', "%{$search}%")
                                ->orWhere('terapia_ortoptica_adultos.doctor', 'like', "%{$search}%")
                                ->orWhere('sucursales.nombre', 'like', "%{$search}%")
                                ->orWhere(DB::raw("'Terapia Ortóptica Adultos'"), 'like', "%{$search}%");
                        });
                    }
                })
        );

        // Aplicar ordenamiento y paginación
        $result = DB::table(DB::raw("({$query->toSql()}) as sub"))
            ->mergeBindings($query)
            ->orderBy($ordenPor, $orden)
            ->paginate($limit, ['*'], 'page', $page);

        $exportResult =  DB::table(DB::raw("({$query->toSql()}) as sub"))
            ->mergeBindings($query)
            ->orderBy($ordenPor, $orden);
        

        return response()->json([
            'data' => $result->items(),
            'meta' => [
                'page' => $result->currentPage(),
                'total' => $result->total(),
                'limit' => $limit

            ],
            'export' => [
                'dataexport' => $exportResult->get(),
            ],
            'status' => [
                'code' => 200,
                'message' => 'Pacientes retrieved successfully',
            ],

        ]);
    }

    public function mostrarCantidadPacientesSinAtender(Request $request)
    {
        $limit = (int) $request->input('limit', 6);
        $page = (int) $request->input('page', 1);
        $orden = in_array($request->input('orden', 'asc'), ['asc', 'desc']) ? $request->input('orden') : 'asc';
        $ordenPor = in_array($request->input('ordenPor', 'nombres'), [
            'pacientes.id_paciente', 'pacientes.nombres', 'pacientes.apellidos', 'pacientes.nro_cedula', 'pacientes.celular'
        ]) ? $request->input('ordenPor') : 'pacientes.nombres';
        $search = $request->input('search', '');

        // Base Query
        $query = DB::table('pacientes')
            ->leftJoin('optometria_neonatos', 'pacientes.id_paciente', '=', 'optometria_neonatos.paciente')
            ->leftJoin('optometria_pediatrica', 'pacientes.id_paciente', '=', 'optometria_pediatrica.paciente')
            ->leftJoin('ortoptica_adultos', 'pacientes.id_paciente', '=', 'ortoptica_adultos.paciente')
            ->leftJoin('consultagenerica', 'pacientes.id_paciente', '=', 'consultagenerica.paciente')
            ->leftJoin('refracciongeneral', 'pacientes.id_paciente', '=', 'refracciongeneral.paciente')
            ->leftJoin('terapias_bajav', 'pacientes.id_paciente', '=', 'terapias_bajav.id_paciente')
            ->leftJoin('terapias_optometria_neonatos', 'pacientes.id_paciente', '=', 'terapias_optometria_neonatos.id_paciente')
            ->leftJoin('terapias_optometria_pediatrica', 'pacientes.id_paciente', '=', 'terapias_optometria_pediatrica.id_paciente')
            ->leftJoin('terapias_ortoptica_adultos', 'pacientes.id_paciente', '=', 'terapias_ortoptica_adultos.id_paciente')
            ->whereNull('optometria_neonatos.paciente')
            ->whereNull('optometria_pediatrica.paciente')
            ->whereNull('ortoptica_adultos.paciente')
            ->whereNull('consultagenerica.paciente')
            ->whereNull('refracciongeneral.paciente')
            ->whereNull('terapias_bajav.id_paciente')
            ->whereNull('terapias_optometria_neonatos.id_paciente')
            ->whereNull('terapias_optometria_pediatrica.id_paciente')
            ->whereNull('terapias_ortoptica_adultos.id_paciente');

        if ($search !== '') {
            $searchTerm = '%' . $search . '%';
            $query->where(function ($query) use ($searchTerm) {
                $query->whereRaw('TRIM(pacientes.nombres) LIKE ?', [$searchTerm])
                    ->orWhereRaw('TRIM(pacientes.apellidos) LIKE ?', [$searchTerm])
                    ->orWhereRaw('TRIM(pacientes.nro_cedula) LIKE ?', [$searchTerm])
                    ->orWhereRaw('TRIM(pacientes.celular) LIKE ?', [$searchTerm]);
            });
        }

        // Contar los registros
        $cantidadPacientes = $query->count();

        // Obtener los registros con paginación
        $pacientesSinAtender = $query
            ->orderByRaw('TRIM(' . $ordenPor . ') ' . $orden)
            ->limit($limit)
            ->offset(($page - 1) * $limit)
            ->get();

        return response()->json([
            'data' => $pacientesSinAtender,
            'meta' => [
                'page' => $page,
                'limit' => $limit,
                'last_page' => ceil($cantidadPacientes / $limit),
                'total' => $cantidadPacientes,
            ],
            'status' => [
                'code' => 200,
                'message' => 'Pacientes retrieved successfully',
            ],
        ]);
    }

    public function mostrarTodosLosPacientesSinAtender(Request $request)
    {
        $limit = (int) $request->input('limit', 6);
        $page = (int) $request->input('page', 1);
        $orden = in_array($request->input('orden', 'asc'), ['asc', 'desc']) ? $request->input('orden') : 'asc';
        $ordenPor = in_array($request->input('ordenPor', 'nombres'), [
            'pacientes.id_paciente', 'pacientes.nombres', 'pacientes.apellidos', 'pacientes.nro_cedula', 'pacientes.celular'
        ]) ? $request->input('ordenPor') : 'pacientes.nombres';
        $search = $request->input('search', '');

        // Base Query
        $query = DB::table('pacientes')
            ->leftJoin('optometria_neonatos', 'pacientes.id_paciente', '=', 'optometria_neonatos.paciente')
            ->leftJoin('optometria_pediatrica', 'pacientes.id_paciente', '=', 'optometria_pediatrica.paciente')
            ->leftJoin('ortoptica_adultos', 'pacientes.id_paciente', '=', 'ortoptica_adultos.paciente')
            ->leftJoin('consultagenerica', 'pacientes.id_paciente', '=', 'consultagenerica.paciente')
            ->leftJoin('refracciongeneral', 'pacientes.id_paciente', '=', 'refracciongeneral.paciente')
            ->leftJoin('terapias_bajav', 'pacientes.id_paciente', '=', 'terapias_bajav.id_paciente')
            ->leftJoin('terapias_optometria_neonatos', 'pacientes.id_paciente', '=', 'terapias_optometria_neonatos.id_paciente')
            ->leftJoin('terapias_optometria_pediatrica', 'pacientes.id_paciente', '=', 'terapias_optometria_pediatrica.id_paciente')
            ->leftJoin('terapias_ortoptica_adultos', 'pacientes.id_paciente', '=', 'terapias_ortoptica_adultos.id_paciente')
            ->whereNull('optometria_neonatos.paciente')
            ->whereNull('optometria_pediatrica.paciente')
            ->whereNull('ortoptica_adultos.paciente')
            ->whereNull('consultagenerica.paciente')
            ->whereNull('refracciongeneral.paciente')
            ->whereNull('terapias_bajav.id_paciente')
            ->whereNull('terapias_optometria_neonatos.id_paciente')
            ->whereNull('terapias_optometria_pediatrica.id_paciente')
            ->whereNull('terapias_ortoptica_adultos.id_paciente');

        if ($search !== '') {
            $searchTerm = '%' . $search . '%';
            $query->where(function ($query) use ($searchTerm) {
                $query->whereRaw('TRIM(pacientes.nombres) LIKE ?', [$searchTerm])
                    ->orWhereRaw('TRIM(pacientes.apellidos) LIKE ?', [$searchTerm])
                    ->orWhereRaw('TRIM(pacientes.nro_cedula) LIKE ?', [$searchTerm])
                    ->orWhereRaw('TRIM(pacientes.celular) LIKE ?', [$searchTerm]);
            });
        }

        $pacientesSinAtender = Cache::remember('pacientes_sin_atender_' . $page . '_' . $limit, 60, function () use ($query, $limit, $page, $ordenPor, $orden) {
            return $query->orderByRaw('TRIM(' . $ordenPor . ') ' . $orden)
                ->limit($limit)
                ->offset(($page - 1) * $limit)
                ->get();
        });

        $cantidadPacientes = Cache::remember('cantidad_pacientes_sin_atender_' . $page . '_' . $limit, 60, function () use ($query) {
            return $query->count();
        });

        return response()->json([
            'data' => $pacientesSinAtender,
            'meta' => [
                'page' => $page,
                'limit' => $limit,
                'last_page' => ceil($cantidadPacientes / $limit),
                'total' => $cantidadPacientes,
            ],
            'status' => [
                'code' => 200,
                'message' => 'Pacientes retrieved successfully',
            ],
        ]);
    }




    public function MostrarPacientesAtendidosPorDiaV2(Request $request)
    {

        $limit = $request->input('limit', 10); // Valor por defecto de 10 si no se proporciona
        $fecha = $request->input('fecha');
        $page = (int) $request->input('page', 1);
        $orden = $request->input('orden', 'asc'); // Valor por defecto 'asc' si no se proporciona
        $ordenPor = $request->input('ordenPor', 'FECHA_ATENCION'); // Valor por defecto 'FECHA_ATENCION' si no se proporciona
        $search = $request->input('search', '');

        $orden = in_array($orden, ['asc', 'desc']) ? $orden : 'asc';
        $ordenPor = in_array($ordenPor, [
            'ID_PACIENTE', 'PACIENTE_NOMBRE', 'PACIENTE_APELLIDO', 'PACIENTE_CEDULA',
            'PACIENTE_CELULAR', 'FECHA_ATENCION', 'DOCTOR', 'SUCURSAL', 'TIPO'
        ]) ? $ordenPor : 'FECHA_ATENCION';

        $query = DB::table('pacientes')
            ->select(
                'pacientes.id_paciente as ID_PACIENTE',
                'pacientes.nombres as PACIENTE_NOMBRE',
                'pacientes.apellidos as PACIENTE_APELLIDO',
                'pacientes.nro_cedula as PACIENTE_CEDULA',
                'pacientes.celular as PACIENTE_CELULAR',
                'baja_vision.fecha_atencion as FECHA_ATENCION',
                'baja_vision.doctor as DOCTOR',
                'sucursales.nombre as SUCURSAL',
                DB::raw("'Consulta Baja Visión' as TIPO")
            )
            ->join('baja_vision', 'pacientes.id_paciente', '=', 'baja_vision.paciente')
            ->leftJoin('sucursales', 'baja_vision.sucursal', '=', 'sucursales.id_sucursal')
            ->where(function ($query) use ($fecha, $search) {
                if ($fecha !== null) {
                    if (strpos($fecha, ' - ') !== false) {
                        list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                        $query->whereBetween('baja_vision.fecha_atencion', [$fechaInicio, $fechaFin]);
                    } else {
                        $query->where('baja_vision.fecha_atencion', $fecha);
                    }
                }
                if ($search !== '') {
                    $query->where(function ($query) use ($search) {
                        $query->where('pacientes.id_paciente', 'like', "%{$search}%")
                            ->orWhere('pacientes.nombres', 'like', "%{$search}%")
                            ->orWhere('pacientes.apellidos', 'like', "%{$search}%")
                            ->orWhere('pacientes.nro_cedula', 'like', "%{$search}%")
                            ->orWhere('pacientes.celular', 'like', "%{$search}%")
                            ->orWhere('baja_vision.fecha_atencion', 'like', "%{$search}%")
                            ->orWhere('baja_vision.doctor', 'like', "%{$search}%")
                            ->orWhere('sucursales.nombre', 'like', "%{$search}%")
                            ->orWhere(DB::raw("'Consulta Baja Visión'"), 'like', "%{$search}%");
                    });
                };
            });


        $query->unionAll(
            DB::table('pacientes')
                ->select(
                    'pacientes.id_paciente as ID_PACIENTE',
                    'pacientes.nombres as PACIENTE_NOMBRE',
                    'pacientes.apellidos as PACIENTE_APELLIDO',
                    'pacientes.nro_cedula as PACIENTE_CEDULA',
                    'pacientes.celular as PACIENTE_CELULAR',
                    'optometria_neonatos.fecha_atencion as FECHA_ATENCION',
                    'optometria_neonatos.doctor as DOCTOR',
                    'sucursales.nombre as SUCURSAL',
                    DB::raw("'Optometría Neonatos' as TIPO")
                )
                ->join('optometria_neonatos', 'pacientes.id_paciente', '=', 'optometria_neonatos.paciente')
                ->leftJoin('sucursales', 'optometria_neonatos.sucursal', '=', 'sucursales.id_sucursal')
                ->where(function ($query) use ($fecha, $search) {
                    if ($fecha !== null) {
                        if (strpos($fecha, ' - ') !== false) {
                            list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                            $query->whereBetween('optometria_neonatos.fecha_atencion', [$fechaInicio, $fechaFin]);
                        } else {
                            $query->where('optometria_neonatos.fecha_atencion', $fecha);
                        }
                    }
                    if ($search !== '') {
                        $query->where(function ($query) use ($search) {
                            $query->where('pacientes.id_paciente', 'like', "%{$search}%")
                                ->orWhere('pacientes.nombres', 'like', "%{$search}%")
                                ->orWhere('pacientes.apellidos', 'like', "%{$search}%")
                                ->orWhere('pacientes.nro_cedula', 'like', "%{$search}%")
                                ->orWhere('pacientes.celular', 'like', "%{$search}%")
                                ->orWhere('optometria_neonatos.fecha_atencion', 'like', "%{$search}%")
                                ->orWhere('optometria_neonatos.doctor', 'like', "%{$search}%")
                                ->orWhere('sucursales.nombre', 'like', "%{$search}%")
                                ->orWhere(DB::raw("'Optometría Neonatos'"), 'like', "%{$search}%");
                        });
                    }
                })
        );

        $query->unionAll(
            DB::table('pacientes')
                ->select(
                    'pacientes.id_paciente as ID_PACIENTE',
                    'pacientes.nombres as PACIENTE_NOMBRE',
                    'pacientes.apellidos as PACIENTE_APELLIDO',
                    'pacientes.nro_cedula as PACIENTE_CEDULA',
                    'pacientes.celular as PACIENTE_CELULAR',
                    'optometria_pediatrica.fecha_atencion as FECHA_ATENCION',
                    'optometria_pediatrica.doctor as DOCTOR',
                    'sucursales.nombre as SUCURSAL',
                    DB::raw("'Optometría Pediátrica' as TIPO")
                )
                ->join('optometria_pediatrica', 'pacientes.id_paciente', '=', 'optometria_pediatrica.paciente')
                ->leftJoin('sucursales', 'optometria_pediatrica.sucursal', '=', 'sucursales.id_sucursal')
                ->where(function ($query) use ($fecha, $search) {
                    if ($fecha !== null) {
                        if (strpos($fecha, ' - ') !== false) {
                            list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                            $query->whereBetween('optometria_pediatrica.fecha_atencion', [$fechaInicio, $fechaFin]);
                        } else {
                            $query->where('optometria_pediatrica.fecha_atencion', $fecha);
                        }
                    }
                    if ($search !== '') {
                        $query->where(function ($query) use ($search) {
                            $query->where('pacientes.id_paciente', 'like', "%{$search}%")
                                ->orWhere('pacientes.nombres', 'like', "%{$search}%")
                                ->orWhere('pacientes.apellidos', 'like', "%{$search}%")
                                ->orWhere('pacientes.nro_cedula', 'like', "%{$search}%")
                                ->orWhere('pacientes.celular', 'like', "%{$search}%")
                                ->orWhere('optometria_pediatrica.fecha_atencion', 'like', "%{$search}%")
                                ->orWhere('optometria_pediatrica.doctor', 'like', "%{$search}%")
                                ->orWhere('sucursales.nombre', 'like', "%{$search}%")
                                ->orWhere(DB::raw("'Optometría Pediátrica'"), 'like', "%{$search}%");
                        });
                    }
                })
        );


        $query->unionAll(
            DB::table('pacientes')
                ->select(
                    'pacientes.id_paciente as ID_PACIENTE',
                    'pacientes.nombres as PACIENTE_NOMBRE',
                    'pacientes.apellidos as PACIENTE_APELLIDO',
                    'pacientes.nro_cedula as PACIENTE_CEDULA',
                    'pacientes.celular as PACIENTE_CELULAR',
                    'ortoptica_adultos.fecha_atencion as FECHA_ATENCION',
                    'ortoptica_adultos.doctor as DOCTOR',
                    'sucursales.nombre as SUCURSAL',
                    DB::raw("'Ortoptica Adultos' as TIPO")
                )
                ->join('ortoptica_adultos', 'pacientes.id_paciente', '=', 'ortoptica_adultos.paciente')
                ->leftJoin('sucursales', 'ortoptica_adultos.sucursal', '=', 'sucursales.id_sucursal')
                ->where(function ($query) use ($fecha, $search) {
                    if ($fecha !== null) {
                        if (strpos($fecha, ' - ') !== false) {
                            list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                            $query->whereBetween('ortoptica_adultos.fecha_atencion', [$fechaInicio, $fechaFin]);
                        } else {
                            $query->where('ortoptica_adultos.fecha_atencion', $fecha);
                        }
                    }
                    if ($search !== '') {
                        $query->where(function ($query) use ($search) {
                            $query->where('pacientes.id_paciente', 'like', "%{$search}%")
                                ->orWhere('pacientes.nombres', 'like', "%{$search}%")
                                ->orWhere('pacientes.apellidos', 'like', "%{$search}%")
                                ->orWhere('pacientes.nro_cedula', 'like', "%{$search}%")
                                ->orWhere('ortoptica_adultos.fecha_atencion', 'like', "%{$search}%")
                                ->orWhere('ortoptica_adultos.doctor', 'like', "%{$search}%")
                                ->orWhere('sucursales.nombre', 'like', "%{$search}%")
                                ->orWhere(DB::raw("'Ortoptica Adultos'"), 'like', "%{$search}%");
                        });
                    }
                })
        );

        $query->unionAll(
            DB::table('pacientes')
                ->select(
                    'pacientes.id_paciente as ID_PACIENTE',
                    'pacientes.nombres as PACIENTE_NOMBRE',
                    'pacientes.apellidos as PACIENTE_APELLIDO',
                    'pacientes.nro_cedula as PACIENTE_CEDULA',
                    'pacientes.celular as PACIENTE_CELULAR',
                    'consultagenerica.fecha_atencion as FECHA_ATENCION',
                    'consultagenerica.doctor as DOCTOR',
                    'sucursales.nombre as SUCURSAL',
                    DB::raw("'Historia Clínica' as TIPO")
                )
                ->join('consultagenerica', 'pacientes.id_paciente', '=', 'consultagenerica.paciente')
                ->leftJoin('sucursales', 'consultagenerica.sucursal', '=', 'sucursales.id_sucursal')
                ->where(function ($query) use ($fecha, $search) {
                    if ($fecha !== null) {
                        if (strpos($fecha, ' - ') !== false) {
                            list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                            $query->whereBetween('consultagenerica.fecha_atencion', [$fechaInicio, $fechaFin]);
                        } else {
                            $query->where('consultagenerica.fecha_atencion', $fecha);
                        }
                    }

                    if ($search !== '') {
                        $query->where(function ($query) use ($search) {
                            $query->where('pacientes.id_paciente', 'like', "%{$search}%")
                                ->orWhere('pacientes.nombres', 'like', "%{$search}%")
                                ->orWhere('pacientes.apellidos', 'like', "%{$search}%")
                                ->orWhere('pacientes.nro_cedula', 'like', "%{$search}%")
                                ->orWhere('consultagenerica.fecha_atencion', 'like', "%{$search}%")
                                ->orWhere('consultagenerica.doctor', 'like', "%{$search}%")
                                ->orWhere('sucursales.nombre', 'like', "%{$search}%")
                                ->orWhere(DB::raw("'Historia Clínica'"), 'like', "%{$search}%");
                        });
                    }
                })
        );

        $query->unionAll(
            DB::table('pacientes')
                ->select(
                    'pacientes.id_paciente as ID_PACIENTE',
                    'pacientes.nombres as PACIENTE_NOMBRE',
                    'pacientes.apellidos as PACIENTE_APELLIDO',
                    'pacientes.nro_cedula as PACIENTE_CEDULA',
                    'pacientes.celular as PACIENTE_CELULAR',
                    'refracciongeneral.fecha_atencion as FECHA_ATENCION',
                    'refracciongeneral.doctor as DOCTOR',
                    'sucursales.nombre as SUCURSAL',
                    DB::raw("'Optometría General' as TIPO")
                )
                ->join('refracciongeneral', 'pacientes.id_paciente', '=', 'refracciongeneral.paciente')
                ->leftJoin('sucursales', 'refracciongeneral.sucursal', '=', 'sucursales.id_sucursal')
                ->where(function ($query) use ($fecha, $search) {
                    if ($fecha !== null) {
                        if (strpos($fecha, ' - ') !== false) {
                            list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                            $query->whereBetween('refracciongeneral.fecha_atencion', [$fechaInicio, $fechaFin]);
                        } else {
                            $query->where('refracciongeneral.fecha_atencion', $fecha);
                        }
                    }
                    if ($search !== '') {
                        $query->where(function ($query) use ($search) {
                            $query->where('pacientes.id_paciente', 'like', "%{$search}%")
                                ->orWhere('pacientes.nombres', 'like', "%{$search}%")
                                ->orWhere('pacientes.apellidos', 'like', "%{$search}%")
                                ->orWhere('pacientes.nro_cedula', 'like', "%{$search}%")
                                ->orWhere('refracciongeneral.fecha_atencion', 'like', "%{$search}%")
                                ->orWhere('refracciongeneral.doctor', 'like', "%{$search}%")
                                ->orWhere('sucursales.nombre', 'like', "%{$search}%")
                                ->orWhere(DB::raw("'Optometría General'"), 'like', "%{$search}%");
                        });
                    }
                })
        );

        $query->unionAll(
            DB::table('pacientes')
                ->select(
                    'pacientes.id_paciente as ID_PACIENTE',
                    'pacientes.nombres as PACIENTE_NOMBRE',
                    'pacientes.apellidos as PACIENTE_APELLIDO',
                    'pacientes.nro_cedula as PACIENTE_CEDULA',
                    'pacientes.celular as PACIENTE_CELULAR',
                    'terapia_bajav.fecha_creacion as FECHA_ATENCION',
                    'terapia_bajav.doctor as DOCTOR',
                    'sucursales.nombre as SUCURSAL',
                    DB::raw("'Terapia Baja Visión' as TIPO")
                )
                ->join('terapias_bajav', 'pacientes.id_paciente', '=', 'terapias_bajav.id_paciente')
                ->join('terapia_bajav', 'terapia_bajav.id_terapia', '=', 'terapias_bajav.id_terapia')
                ->leftJoin('sucursales', 'terapia_bajav.sucursal', '=', 'sucursales.id_sucursal')
                ->where(function ($query) use ($fecha, $search) {
                    if ($fecha !== null) {
                        if (strpos($fecha, ' - ') !== false) {
                            list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                            $query->whereBetween('terapia_bajav.fecha_creacion', [$fechaInicio, $fechaFin]);
                        } else {
                            $query->where('terapia_bajav.fecha_creacion', $fecha);
                        }
                    }
                    if ($search !== '') {
                        $query->where(function ($query) use ($search) {
                            $query->where('pacientes.id_paciente', 'like', "%{$search}%")
                                ->orWhere('pacientes.nombres', 'like', "%{$search}%")
                                ->orWhere('pacientes.apellidos', 'like', "%{$search}%")
                                ->orWhere('pacientes.nro_cedula', 'like', "%{$search}%")
                                ->orWhere('terapia_bajav.fecha_creacion', 'like', "%{$search}%")
                                ->orWhere('terapia_bajav.doctor', 'like', "%{$search}%")
                                ->orWhere('sucursales.nombre', 'like', "%{$search}%")
                                ->orWhere(DB::raw("'Terapia Baja Visión'"), 'like', "%{$search}%");
                        });
                    }
                })
        );

        $query->unionAll(
            DB::table('pacientes')
                ->select(
                    'pacientes.id_paciente as ID_PACIENTE',
                    'pacientes.nombres as PACIENTE_NOMBRE',
                    'pacientes.apellidos as PACIENTE_APELLIDO',
                    'pacientes.nro_cedula as PACIENTE_CEDULA',
                    'pacientes.celular as PACIENTE_CELULAR',
                    'terapia_optometria_neonatos.fecha_creacion as FECHA_ATENCION',
                    'terapia_optometria_neonatos.doctor as DOCTOR',
                    'sucursales.nombre as SUCURSAL',
                    DB::raw("'Terapia Optometría Neonatos' as TIPO")
                )
                ->join('terapias_optometria_neonatos', 'pacientes.id_paciente', '=', 'terapias_optometria_neonatos.id_paciente')
                ->join('terapia_optometria_neonatos', 'terapias_optometria_neonatos.id_terapia', '=', 'terapia_optometria_neonatos.id_terapia')
                ->leftJoin('sucursales', 'terapia_optometria_neonatos.sucursal', '=', 'sucursales.id_sucursal')
                ->where(function ($query) use ($fecha, $search) {
                    if ($fecha !== null) {
                        if (strpos($fecha, ' - ') !== false) {
                            list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                            $query->whereBetween('terapia_optometria_neonatos.fecha_creacion', [$fechaInicio, $fechaFin]);
                        } else {
                            $query->where('terapia_optometria_neonatos.fecha_creacion', $fecha);
                        }
                    }
                    if ($search !== '') {
                        $query->where(function ($query) use ($search) {
                            $query->where('pacientes.id_paciente', 'like', "%{$search}%")
                                ->orWhere('pacientes.nombres', 'like', "%{$search}%")
                                ->orWhere('pacientes.apellidos', 'like', "%{$search}%")
                                ->orWhere('pacientes.nro_cedula', 'like', "%{$search}%")
                                ->orWhere('terapia_optometria_neonatos.fecha_creacion', 'like', "%{$search}%")
                                ->orWhere('terapia_optometria_neonatos.doctor', 'like', "%{$search}%")
                                ->orWhere('sucursales.nombre', 'like', "%{$search}%")
                                ->orWhere(DB::raw("'Terapia Optometría Neonatos'"), 'like', "%{$search}%");
                        });
                    }
                })
        );

        $query->unionAll(
            DB::table('pacientes')
                ->select(
                    'pacientes.id_paciente as ID_PACIENTE',
                    'pacientes.nombres as PACIENTE_NOMBRE',
                    'pacientes.apellidos as PACIENTE_APELLIDO',
                    'pacientes.nro_cedula as PACIENTE_CEDULA',
                    'pacientes.celular as PACIENTE_CELULAR',
                    'terapia_optometria_pediatrica.fecha_creacion as FECHA_ATENCION',
                    'terapia_optometria_pediatrica.doctor as DOCTOR',
                    'sucursales.nombre as SUCURSAL',
                    DB::raw("'Terapia Optometría Pediátrica' as TIPO")
                )
                ->join('terapias_optometria_pediatrica', 'pacientes.id_paciente', '=', 'terapias_optometria_pediatrica.id_paciente')
                ->join('terapia_optometria_pediatrica', 'terapias_optometria_pediatrica.id_terapia', '=', 'terapia_optometria_pediatrica.id_terapia')
                ->leftJoin('sucursales', 'terapia_optometria_pediatrica.sucursal', '=', 'sucursales.id_sucursal')
                ->where(function ($query) use ($fecha, $search) {
                    if ($fecha !== null) {
                        if (strpos($fecha, ' - ') !== false) {
                            list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                            $query->whereBetween('terapia_optometria_pediatrica.fecha_creacion', [$fechaInicio, $fechaFin]);
                        } else {
                            $query->where('terapia_optometria_pediatrica.fecha_creacion', $fecha);
                        }
                    }
                    if ($search !== '') {
                        $query->where(function ($query) use ($search) {
                            $query->where('pacientes.id_paciente', 'like', "%{$search}%")
                                ->orWhere('pacientes.nombres', 'like', "%{$search}%")
                                ->orWhere('pacientes.apellidos', 'like', "%{$search}%")
                                ->orWhere('pacientes.nro_cedula', 'like', "%{$search}%")
                                ->orWhere('terapia_optometria_pediatrica.fecha_creacion', 'like', "%{$search}%")
                                ->orWhere('terapia_optometria_pediatrica.doctor', 'like', "%{$search}%")
                                ->orWhere('sucursales.nombre', 'like', "%{$search}%")
                                ->orWhere(DB::raw("'Terapia Optometría Pediátrica'"), 'like', "%{$search}%");
                        });
                    }
                })
        );


        $query->unionAll(
            DB::table('pacientes')
                ->select(
                    'pacientes.id_paciente as ID_PACIENTE',
                    'pacientes.nombres as PACIENTE_NOMBRE',
                    'pacientes.apellidos as PACIENTE_APELLIDO',
                    'pacientes.nro_cedula as PACIENTE_CEDULA',
                    'pacientes.celular as PACIENTE_CELULAR',
                    'terapia_ortoptica_adultos.fecha_creacion as FECHA_ATENCION',
                    'terapia_ortoptica_adultos.doctor as DOCTOR',
                    'sucursales.nombre as SUCURSAL',
                    DB::raw("'Terapia Ortoptica Adultos' as TIPO")
                )
                ->join('terapias_ortoptica_adultos', 'pacientes.id_paciente', '=', 'terapias_ortoptica_adultos.id_paciente')
                ->join('terapia_ortoptica_adultos', 'terapias_ortoptica_adultos.id_terapia', '=', 'terapia_ortoptica_adultos.id_terapia')
                ->leftJoin('sucursales', 'terapia_ortoptica_adultos.sucursal', '=', 'sucursales.id_sucursal')
                ->where(function ($query) use ($fecha, $search) {
                    if ($fecha !== null) {
                        if (strpos($fecha, ' - ') !== false) {
                            list($fechaInicio, $fechaFin) = array_map('trim', explode(' - ', $fecha));
                            $query->whereBetween('terapia_ortoptica_adultos.fecha_creacion', [$fechaInicio, $fechaFin]);
                        } else {
                            $query->where('terapia_ortoptica_adultos.fecha_creacion', $fecha);
                        }
                    }
                    if ($search !== '') {
                        $query->where(function ($query) use ($search) {
                            $query->where('pacientes.id_paciente', 'like', "%{$search}%")
                                ->orWhere('pacientes.nombres', 'like', "%{$search}%")
                                ->orWhere('pacientes.apellidos', 'like', "%{$search}%")
                                ->orWhere('pacientes.nro_cedula', 'like', "%{$search}%")
                                ->orWhere('terapia_ortoptica_adultos.fecha_creacion', 'like', "%{$search}%")
                                ->orWhere('terapia_ortoptica_adultos.doctor', 'like', "%{$search}%")
                                ->orWhere('sucursales.nombre', 'like', "%{$search}%")
                                ->orWhere(DB::raw("'Terapia Ortoptica Adultos'"), 'like', "%{$search}%");
                        });
                    }
                })
        );

        $result = DB::table(DB::raw("({$query->toSql()}) as sub"))
            ->mergeBindings($query)
            ->orderBy($ordenPor, $orden)
            ->paginate($limit, ['*'], 'page', $page);
        
        $exportResult =  DB::table(DB::raw("({$query->toSql()}) as sub"))
            ->mergeBindings($query)
            ->orderBy($ordenPor, $orden);

        return response()->json([
            'data' => $result->items(),
            'meta' => [
                'page' => $result->currentPage(),
                'last_page' => $result->lastPage(),
                'total' => $result->total(),
                'limit' => $limit
            ],
            'export' => [
                'dataexport' => $exportResult->get(),
            ],
            'status' => [
                'code' => 200,
                'message' => 'Pacientes retrieved successfully',
            ],

        ]);
    }
}