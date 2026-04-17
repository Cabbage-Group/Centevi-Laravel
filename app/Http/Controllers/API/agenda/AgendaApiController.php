<?php

namespace App\Http\Controllers\API\agenda;

use App\Http\Controllers\Controller;
use App\Models\BajaVision;
use App\Models\Citas;
use App\Models\CitasServicios;
use App\Models\ConsultaGenerica;
use App\Models\OptometriaNeonatos;
use App\Models\OptometriaPediatrica;
use App\Models\OrtopticaAdultos;
use App\Models\Pacientes;
use App\Models\RefraccionGeneral;
use App\Models\ServiciosProximosBajaVision;
use App\Models\ServiciosProximosHistoriasClinicas;
use App\Models\ServiciosProximosOptometriaGeneral;
use App\Models\ServiciosProximosOptometriaNeonatos;
use App\Models\ServiciosProximosOptometriaPediatrica;
use App\Models\ServiciosProximosOrtopticaAdultos;
use App\Models\Sucursales;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class AgendaApiController extends Controller
{

  public function verEventosAgenda(Request $request)
  {
    $months = $request->input('months', [Carbon::now()->month]);
    $years = $request->input('years', [Carbon::now()->year]);
    $sucursales = $request->input('sucursales', []);
    $exProximaCita = $request->input('ex_proxima_cita', []);
    $hasCitasId = $request->input('has_citas_id', null);
    $citasIdNull = $request->input('citas_id_null', null);
    $tipo = $request->input('tipo', []);

    // Convertir a array si no lo es
    if (!is_array($months)) {
      $months = explode(',', $months);
    }
    if (!is_array($years)) {
      $years = explode(',', $years);
    }

    if (empty($tipo)) {
      $tipo = null;
    }

    $query = Citas::with(['paciente:id_paciente,nombres,nro_cedula,telefono,celular,apellidos', 'sucursal:id_sucursal,nombre'])
      ->whereIn(DB::raw('MONTH(fecha_hora)'), $months)
      ->whereIn(DB::raw('YEAR(fecha_hora)'), $years);

    if (!empty($sucursales)) {
      if (in_array('otros', $sucursales)) {
        $query->whereNotIn('sucursal_id', [3, 4, 7, 11]);
      } else {
        $query->whereIn('sucursal_id', $sucursales);
      }
    }

    // if (!is_null($exProximaCita)) {
    //     $query->where('ex_proxima_cita', filter_var($exProximaCita, FILTER_VALIDATE_BOOLEAN));
    // }

    if (!empty($exProximaCita)) {
      $query->whereIn('ex_proxima_cita', (array) $exProximaCita);
    }

    if (!is_null($hasCitasId) && filter_var($hasCitasId, FILTER_VALIDATE_BOOLEAN)) {
      $query->whereNotNull('citas_id');
    }

    if (!is_null($citasIdNull) && filter_var($citasIdNull, FILTER_VALIDATE_BOOLEAN)) {
      $query->whereNull('citas_id');
    }

    if (!is_null($tipo) && !empty($tipo)) {
      $query->whereIn('tipo', $tipo);
    }

    return response()->json([
      "data" => $query->orderBy('fecha_hora', 'desc')->get(),
      'sucursales' => $sucursales,
      'empsucursales' => !empty($sucursales)
    ]);
  }


  public function agendarCita(Request $request)
  {
    $request->validate([
      'origen_id' => 'nullable|integer',
      'origen_tabla' => 'nullable|string',
      'fecha_hora' => 'required|date',
      'fecha_hora_fin' => 'required|date|after:fecha_hora',
      'tipo' => 'nullable|in:consulta,terapia',
      'paciente_id' => 'nullable|integer',
      'doctor' => 'nullable|string',
      'sucursal_id' => 'nullable|integer',
      'comentarios' => 'nullable|string',
      'agendado_por' => 'nullable|string',
      'cita_existente_id' => 'nullable|integer|exists:citas,id',
      'servicios_id' => 'nullable|array',
      'servicios_id.*' => 'integer|exists:servicios,id',
      'confirmado' => 'nullable|string',
      'nombres' => 'nullable|string',
      'apellidos' => 'nullable|string',
      'celular' => 'nullable|string',

    ]);

    $nuevaCita = Citas::create([
      'origen_id' => null,
      'origen_tabla' => $request->origen_tabla ?? 'citas_servicios',
      'fecha_hora' => $request->fecha_hora,
      'fecha_hora_fin' => $request->fecha_hora_fin,
      'tipo' => $request->tipo,
      'paciente_id' => $request->paciente_id,
      'doctor' => $request->doctor,
      'sucursal_id' => $request->sucursal_id,
      'agendado_por' => $request->agendado_por,
      'ex_proxima_cita' => false,
      'comentarios' => $request->comentarios,
      'confirmado' => $request->confirmado,
      'nombres' => $request->nombres,
      'apellidos' => $request->apellidos,
      'celular' => $request->celular
    ]);

    $nuevaCita->update([
      'origen_id' => $request->origen_id ?? $nuevaCita->id,
    ]);

    if ($request->has('servicios_id') && is_array($request->servicios_id)) {
      foreach ($request->servicios_id as $servicioId) {
        CitasServicios::create([
          'cita_id' => $nuevaCita->id,
          'servicios_id' => $servicioId,
        ]);
      }
    }

    if ($request->cita_existente_id) {
      $citaExistente = Citas::where('id', $request->cita_existente_id)->whereNull('citas_id')->first();

      if ($citaExistente) {
        $citaExistente->update(['citas_id' => $nuevaCita->id]);
      }
    }

    // Obtener el nombre del paciente si existe
    $pacienteNombre = null;
    if ($request->paciente_id) {
      $paciente = Pacientes::find($request->paciente_id);
      $pacienteNombre = $paciente ? $paciente->nombres : 'Desconocido';
      $nro_cedula = $paciente ? $paciente->nro_cedula : 'descnocido';
      $apellidos = $paciente ? $paciente->apellidos : 'desconocido';
      $celular = $paciente ? $paciente->celular : 'desconocido';
    }
    $sucursalNombre = 'Desconocida';
    if ($request->sucursal_id) {
      $sucursal = Sucursales::find($request->sucursal_id);
      if ($sucursal) {
        $sucursalNombre = $sucursal->nombre;
      }
    }

    return response()->json([
      'message' => 'Cita creada exitosamente',
      'nueva_cita' => [
        'id' => $nuevaCita->id,
        'origen_id' => $nuevaCita->origen_id,
        'origen_tabla' => $nuevaCita->origen_tabla,
        'fecha_hora' => $nuevaCita->fecha_hora,
        'fecha_hora_fin' => $nuevaCita->fecha_hora_fin,
        'tipo' => $nuevaCita->tipo,
        'paciente_id' => $nuevaCita->paciente_id,
        'sucursal_id' => $nuevaCita->sucursal_id,
        'doctor' => $nuevaCita->doctor,
        'agendado_por' => $nuevaCita->agendado_por,
        'comentarios' => $nuevaCita->comentarios,
        'nro_cedula' => $nro_cedula ?? '',
        'title' => $pacienteNombre ?? $nuevaCita->nombres,
        'paciente' => $pacienteNombre ?? $nuevaCita->nombres,
        'sucursal' => $sucursalNombre,
        'apellidos' => $apellidos ?? $nuevaCita->apellidos,
        'celular' => $celular ?? $nuevaCita->celular,
        'ex_proxima_cita' => $nuevaCita->ex_proxima_cita,
        'confirmado' => $nuevaCita->confirmado
      ],
      'cita_existente_id' => $request->cita_existente_id
    ], 201);
  }

  public function confirmarCita(Request $request)
  {
    $request->validate([
      'cita_id' => 'nullable|integer',
      'confirmado' => 'nullable|string'
    ]);

    $cita = Citas::find($request->cita_id);

    if ($cita) {
      $cita->confirmado = $request->confirmado;
      $cita->update();
    }

    return response()->json([
      'message' => 'Cita creada exitosamente',
    ], 201);
  }

  public function deleteCita($id)
  {
    $cita = Citas::find($id);

    if (!$cita) {
      return response()->json(['message' => 'Cita no encontrada'], 404);
    }

    // $citaEliminada = $cita->toArray(); // Guardamos los datos antes de eliminar
    $citaEliminada = array_map(function ($value) {
      if (is_string($value)) {
        return mb_convert_encoding($value, 'UTF-8', 'UTF-8');
      }
      return $value;
    }, $cita->toArray());

    if ($cita->ex_proxima_cita == 1 || $cita->ex_proxima_cita === true) {
      $origenTabla = $cita->origen_tabla;
      $origenId = $cita->origen_id;

      $tablaServiciosMap = [
        'baja_vision' => ['tabla' => 'servicios_proximos_baja_vision', 'columna' => 'bajavision_id'],
        'consulta_generica' => ['tabla' => 'servicios_proximos_historias_clinicas', 'columna' => 'historiaclinica_id'],
        'refraccion_general' => ['tabla' => 'servicios_proximos_optometria_general', 'columna' => 'optometriageneral_id'],
        'optometria_neonatos' => ['tabla' => 'servicios_proximos_optometria_neonatos', 'columna' => 'optometriaNeonatos_id'],
        'optometria_pediatrica' => ['tabla' => 'servicios_proximos_optometria_pediatrica', 'columna' => 'optometriaPediatrica_id'],
        'ortoptica_adultos' => ['tabla' => 'servicios_proximos_ortoptica_adultos', 'columna' => 'ortopticaAdultos_id'],
      ];

      if (isset($tablaServiciosMap[$origenTabla])) {
        $tablaServicios = $tablaServiciosMap[$origenTabla]['tabla'];
        $columna = $tablaServiciosMap[$origenTabla]['columna'];

        try {
          DB::table($tablaServicios)
            ->where($columna, $origenId)
            ->delete();
        } catch (\Exception $e) {
          return response()->json([
            'message' => 'Error al eliminar servicios relacionados',
            'error' => $e->getMessage()
          ], 500);
        }
      }
    }

    $cita->delete();

    return response()->json([
      'message' => 'Cita eliminada con éxito',
      'cita' => $citaEliminada
    ], 200);
  }


  public function updateCita(Request $request, $id)
  {
    // Validación
    $validator = Validator::make($request->all(), [
      'origen_id' => 'nullable|integer',
      'origen_tabla' => 'nullable|string',
      'fecha_hora' => 'nullable|date',
      'fecha_hora_fin' => 'nullable|date|after:fecha_hora',
      'tipo' => 'nullable|string',
      'paciente_id' => 'nullable|integer|exists:pacientes,id_paciente',
      'doctor' => 'nullable|string',
      'sucursal_id' => 'nullable|integer|exists:sucursales,id_sucursal',
      'ex_proxima_cita' => 'nullable|boolean',
      'comentarios' => 'nullable|string',
      'agendado_por' => 'nullable|string',
      'servicios_ids' => 'nullable|array',
      'confirmado' => 'nullable|string',
      'nombres' => 'nullable|string',
      'apellidos' => 'nullable|string',
      'celular' => 'nullable|string',
      'nroCedula' => 'nullable|string'
    ]);

    $nuevaCedula = $request->input('nroCedula');
    $pacienteId = $request->input('paciente_id');
    $nuevoPaciente = null;

    if ($validator->fails()) {
      return response()->json(['errors' => $validator->errors()], 422);
    }

    // Buscar cita
    $cita = Citas::find($id);
    if (!$cita) {
      return response()->json(['message' => 'Cita no encontrada'], 404);
    }

    if ($nuevaCedula && !$pacienteId) {
      $cedulaYaExiste = Pacientes::where('nro_cedula', $nuevaCedula)->exists();

      if (!$cedulaYaExiste) {
        $nuevoPaciente = Pacientes::create([
          'nro_cedula' => $nuevaCedula,
          'nombres' => $request->input('nombres', ''),
          'apellidos' => $request->input('apellidos', ''),
          'celular' => $request->input('celular', null),
          'doctor' => $request->input('doctor', ''),
          'email' => $request->input('email', ''),
          'nro_seguro' => $request->input('nro_seguro', ''),
          'genero' => $request->input('genero', ''),
          'lugar_nacimiento' => $request->input('lugar_nacimiento', ''),
          'direccion' => $request->input('direccion', ''),
          'ocupacion' => $request->input('ocupacion', ''),
          'telefono' => $request->input('telefono', ''),
          'medico' => $request->input('medico', ''),
          'urgencia' => $request->input('urgencia', ''),
          'menor' => $request->input('menor', ''),
          'estado' => $request->input('estado', 0)
        ]);

        $request->merge(['paciente_id' => $nuevoPaciente->id_paciente]);
        $pacienteId = $nuevoPaciente->id_paciente;
      }
    }

    if ($nuevaCedula && $pacienteId) {
      $pacienteActual = Pacientes::find($pacienteId);

      if (!$pacienteActual) {
        return response()->json(['message' => 'Paciente no encontrado'], 404);
      }

      if ($pacienteActual->nro_cedula !== $nuevaCedula) {
        $cedulaExiste = Pacientes::where('nro_cedula', $nuevaCedula)
          ->where('id_paciente', '!=', $pacienteId)
          ->exists();

        if ($cedulaExiste) {
          return response()->json([
            'message' => 'La cédula ingresada ya está registrada en otro paciente.'
          ], 409);
        }
      }
    }



    // Actualizar cita
    $cita->update($request->all());

    $exProximaCita = $request->boolean('ex_proxima_cita');
    $origenTabla = $request->input('origen_tabla');
    $origenId = $request->input('origen_id');
    $serviciosIds = $request->input('servicios_ids', []);

    if ($exProximaCita && $origenTabla === 'baja_vision') {

      ServiciosProximosBajaVision::where('bajavision_id', $origenId)->delete();

      foreach ($serviciosIds as $servicioId) {
        ServiciosProximosBajaVision::create([
          'bajavision_id' => $origenId,
          'servicios_id' => $servicioId,
        ]);
      }
    } elseif ($exProximaCita && $origenTabla === 'consulta_generica') {
      ServiciosProximosHistoriasClinicas::where('historiaclinica_id', $origenId)->delete();

      foreach ($serviciosIds as $servicioId) {
        ServiciosProximosHistoriasClinicas::create([
          'historiaclinica_id' => $origenId,
          'servicios_id' => $servicioId,
        ]);
      }
    } elseif ($exProximaCita && $origenTabla === 'refraccion_general') {

      ServiciosProximosOptometriaGeneral::where('optometriageneral_id', $origenId)->delete();


      foreach ($serviciosIds as $servicioId) {
        ServiciosProximosOptometriaGeneral::create([
          'optometriageneral_id' => $origenId,
          'servicios_id' => $servicioId,
        ]);
      }
    } elseif ($exProximaCita && $origenTabla === 'ortoptica_adultos') {

      ServiciosProximosOrtopticaAdultos::where('ortopticaAdultos_id', $origenId)->delete();


      foreach ($serviciosIds as $servicioId) {
        ServiciosProximosOrtopticaAdultos::create([
          'ortopticaAdultos_id' => $origenId,
          'servicios_id' => $servicioId,
        ]);
      }
    } elseif ($exProximaCita && $origenTabla === 'optometria_pediatrica') {

      ServiciosProximosOptometriaPediatrica::where('optometriaPediatrica_id', $origenId)->delete();


      foreach ($serviciosIds as $servicioId) {
        ServiciosProximosOptometriaPediatrica::create([
          'optometriaPediatrica_id' => $origenId,
          'servicios_id' => $servicioId,
        ]);
      }
    } elseif ($exProximaCita && $origenTabla === 'optometria_neonatos') {

      ServiciosProximosOptometriaNeonatos::where('optometriaNeonatos_id', $origenId)->delete();


      foreach ($serviciosIds as $servicioId) {
        ServiciosProximosOptometriaNeonatos::create([
          'optometriaNeonatos_id' => $origenId,
          'servicios_id' => $servicioId,
        ]);
      }
    } elseif (!$exProximaCita) {

      CitasServicios::where('cita_id', $cita->id)->delete();


      foreach ($serviciosIds as $servicioId) {
        CitasServicios::create([
          'cita_id' => $cita->id,
          'servicios_id' => $servicioId,
        ]);
      }
    }

    $pacienteNombre = null;
    if ($request->paciente_id) {
      $paciente = Pacientes::find($request->paciente_id);
      $pacienteNombre = $paciente ? $paciente->nombres : 'Desconocido';
      $nro_cedula = $paciente ? $paciente->nro_cedula : 'descnocido';
      $apellidos = $paciente ? $paciente->apellidos : 'desconocido';
    }
    $sucursalNombre = 'Desconocida';
    if ($request->sucursal_id) {
      $sucursal = Sucursales::find($request->sucursal_id);
      if ($sucursal) {
        $sucursalNombre = $sucursal->nombre;
      }
    }
    return response()->json([
      'message' => 'Cita actualizada correctamente',
      'cita' => [
        'id' => $cita->id,
        'origen_id' => $cita->origen_id,
        'origen_tabla' => $cita->origen_tabla,
        'fecha_hora' => $cita->fecha_hora,
        'fecha_hora_fin' => $cita->fecha_hora_fin,
        'tipo' => $cita->tipo,
        'paciente_id' => $cita->paciente_id,
        'sucursal_id' => $cita->sucursal_id,
        'doctor' => $cita->doctor,
        'agendado_por' => $cita->agendado_por,
        'comentarios' => $cita->comentarios,
        'nro_cedula' => $nro_cedula ?? ($nuevoPaciente?->nro_cedula) ?? '',
        'title' => $pacienteNombre ?? ($nuevoPaciente?->nombres) ?? ($cita->nombres) ?? '',
        'paciente' => $pacienteNombre ?? ($nuevoPaciente?->nombres) ?? ($cita->nombres) ?? '',
        'sucursal' => $sucursalNombre,
        'apellidos' => $apellidos ?? ($nuevoPaciente?->apellidos) ?? ($cita->apellidos) ?? '',
        'celular' => ($cita->celular) ?? '',
        'ex_proxima_cita' => $cita->ex_proxima_cita,
        'confirmado' => $cita->confirmado,
      ]
    ]);
  }




  public function generarDataProximasCitas()
  {

    DB::table('consultagenerica')->update([
      'fecha_proxima_consulta' => DB::raw("CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00')")
    ]);

    DB::table('baja_vision')->update([
      'fecha_proxima_consulta' => DB::raw("CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00')")
    ]);

    DB::table('optometria_neonatos')->update([
      'fecha_proxima_consulta' => DB::raw("CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00')")
    ]);

    DB::table('optometria_pediatrica')->update([
      'fecha_proxima_consulta' => DB::raw("CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00')")
    ]);

    DB::table('ortoptica_adultos')->update([
      'fecha_proxima_consulta' => DB::raw("CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00')")
    ]);

    DB::table('refracciongeneral')->update([
      'fecha_proxima_consulta' => DB::raw("CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00')")
    ]);

    // UPDATE consultagenerica
    // SET fecha_proxima_consulta = CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00');

    // UPDATE baja_vision
    // SET fecha_proxima_consulta = CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00');

    // UPDATE optometria_neonatos
    // SET fecha_proxima_consulta = CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00');

    // UPDATE optometria_pediatrica
    // SET fecha_proxima_consulta = CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00');

    // UPDATE ortoptica_adultos
    // SET fecha_proxima_consulta = CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00');

    // UPDATE refracciongeneral
    // SET fecha_proxima_consulta = CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00');

    $consultas = BajaVision::whereNotNull('fecha_proxima_consulta')->get();

    foreach ($consultas as $consulta) {
      Citas::updateOrCreate(
        [
          'origen_id' => $consulta->id_consulta,
          'origen_tabla' => 'baja_vision'
        ],
        [
          'paciente_id' => $consulta->paciente,
          'doctor_id' => $consulta->doctor,
          'sucursal_id' => $consulta->sucursal,
          'fecha_hora' => $consulta->fecha_proxima_consulta,
          'comentarios' => ' ',
          'tipo' => 'proxima_cita',
          'ex_proxima_cita' => true
        ]
      );
    }

    $consultasGenericas = ConsultaGenerica::whereNotNull('fecha_proxima_consulta')->get();

    foreach ($consultasGenericas as $consulta) {
      Citas::updateOrCreate(
        [
          'origen_id' => $consulta->id_consulta,
          'origen_tabla' => 'consulta_generica'
        ],
        [
          'paciente_id' => $consulta->paciente,
          'doctor_id' => $consulta->doctor,
          'sucursal_id' => $consulta->sucursal,
          'fecha_hora' => $consulta->fecha_proxima_consulta,
          'comentarios' => ' ',
          'tipo' => 'proxima_cita',
          'ex_proxima_cita' => true
        ]
      );
    }

    $consultasNeonatos = OptometriaNeonatos::whereNotNull('fecha_proxima_consulta')->get();

    foreach ($consultasNeonatos as $consulta) {
      Citas::updateOrCreate(
        [
          'origen_id' => $consulta->id_consulta,
          'origen_tabla' => 'optometria_neonatos'
        ],
        [
          'paciente_id' => $consulta->paciente,
          'doctor_id' => $consulta->doctor,
          'sucursal_id' => $consulta->sucursal,
          'fecha_hora' => $consulta->fecha_proxima_consulta,
          'comentarios' => ' ',
          'tipo' => 'proxima_cita',
          'ex_proxima_cita' => true
        ]
      );
    }

    $consultasOptometriaPediatrica = OptometriaPediatrica::whereNotNull('fecha_proxima_consulta')->get();

    foreach ($consultasOptometriaPediatrica as $consulta) {
      Citas::updateOrCreate(
        [
          'origen_id' => $consulta->id_consulta,
          'origen_tabla' => 'optometria_pediatrica'
        ],
        [
          'paciente_id' => $consulta->paciente,
          'doctor_id' => $consulta->doctor,
          'sucursal_id' => $consulta->sucursal,
          'fecha_hora' => $consulta->fecha_proxima_consulta,
          'comentarios' => ' ',
          'tipo' => 'proxima_cita',
          'ex_proxima_cita' => true
        ]
      );
    }


    $consultasOrtopticaAdultos = OrtopticaAdultos::whereNotNull('fecha_proxima_consulta')->get();
    foreach ($consultasOrtopticaAdultos as $consulta) {
      Citas::updateOrCreate(
        [
          'origen_id' => $consulta->id_consulta,
          'origen_tabla' => 'ortoptica_adultos',
        ],
        [
          'paciente_id' => $consulta->paciente,
          'doctor_id' => $consulta->doctor,
          'sucursal_id' => $consulta->sucursal,
          'fecha_hora' => $consulta->fecha_proxima_consulta,
          'comentarios' => ' ',
          'tipo' => 'proxima_cita',
          'ex_proxima_cita' => true
        ]
      );
    }

    $consultasRefraccionGeneral = RefraccionGeneral::whereNotNull('fecha_proxima_consulta')->get();
    foreach ($consultasRefraccionGeneral as $consulta) {
      Citas::updateOrCreate(
        [
          'origen_id' => $consulta->id_consulta,
          'origen_tabla' => 'refraccion_general',
        ],
        [
          'paciente_id' => $consulta->paciente,
          'doctor_id' => $consulta->doctor,
          'sucursal_id' => $consulta->sucursal,
          'fecha_hora' => $consulta->fecha_proxima_consulta,
          'comentarios' => ' ',
          'tipo' => 'proxima_cita',
          'ex_proxima_cita' => true
        ]
      );
    }

    return response()->json(['message' => 'Proximas citas actualizadas correctamente']);
  }
}
