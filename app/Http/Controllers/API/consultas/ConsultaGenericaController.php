<?php

namespace App\Http\Controllers\API\consultas;

use App\Http\Controllers\Controller;
use App\Models\Citas;
use Illuminate\Http\Request;
use App\Models\ConsultaGenerica;
use App\Models\DiagnosticoHistoriaClinica;
use App\Models\ServiciosRealizadosHistoriasClinicas;
use App\Models\ServiciosProximosHistoriasClinicas;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;



class ConsultaGenericaController extends Controller
{
  public function CrearConsultaGenerica(Request $request)
  {
    // Validaciones necesarias
    $validator = Validator::make($request->all(), [
      'sucursal' => 'required|integer|max:255',
      'doctor' => 'required|string|max:255',
      'paciente' => 'required|integer',
      'id_terapia' => 'required|integer',
      'edad' => 'required|integer',
      'fecha_atencion' => 'required|date',
      'm_c' => 'required|string',
      'servicios_realizados_historias_clinicas' => 'array',
      'servicios_proximos_historias_clinicas' => 'array',
      'diagnosticos_historias_clinicas' => 'array',
      'fecha_proxima_consulta' => 'nullable|date',
      'agendado_por' => 'required|string|max:255',
      // Otras validaciones aquí...
    ]);

    if ($validator->fails()) {
      return response()->json([
        'success' => false,
        'message' => 'Error de validación',
        'errors' => $validator->errors(),
      ], 400);
    }

    // Convertir campos nulos en vacíos
    $datos = array_map(function ($value) {
      return $value === null ? '' : $value;
    }, $request->all());

    // Establecer la fecha de creación
    $datos['fecha_creacion'] = now(); // Establecer la fecha actual

    // Crear el registro de la consulta
    $consultaGenerica = ConsultaGenerica::create($datos);

    // Verificar si servicios_realizados_historias_clinicas existe y tiene elementos
    if (isset($request->servicios_realizados_historias_clinicas)) {
      foreach ($request->servicios_realizados_historias_clinicas as $servicioId) {
        ServiciosRealizadosHistoriasClinicas::create([
          'historiaclinica_id' => $consultaGenerica->id_consulta, // Usar el ID de la consulta generica como historiaclinica_id
          'servicios_id' => $servicioId,
        ]);
      }
    }

    if (isset($request->servicios_proximos_historias_clinicas)) {
      foreach ($request->servicios_proximos_historias_clinicas as $servicioId) {
        ServiciosProximosHistoriasClinicas::create([
          'historiaclinica_id' => $consultaGenerica->id_consulta, // Usar el ID de la consulta generica como historiaclinica_id
          'servicios_id' => $servicioId,
        ]);
      }
    }

    if (isset($request->diagnosticos_historias_clinicas)) {
      foreach ($request->diagnosticos_historias_clinicas as $diagnosticoId) {
        DiagnosticoHistoriaClinica::create([
          'historia_clinica_id' => $consultaGenerica->id_consulta,
          'diagnostico_id' => $diagnosticoId,
        ]);
      }
    }

    if (!empty($request->fecha_proxima_consulta)) {
      $fechaProxima = Carbon::parse($request->fecha_proxima_consulta)->setTime(12, 0, 0);
      Citas::create([
        'origen_id' => $consultaGenerica->id_consulta,
        'origen_tabla' => 'consulta_generica',
        'fecha_hora' => $fechaProxima,
        'tipo' => 'proxima_cita',
        'paciente_id' => $consultaGenerica->paciente,
        'doctor' => $consultaGenerica->doctor,
        'sucursal_id' => $consultaGenerica->sucursal,
        'ex_proxima_cita' => true,
        'comentarios' => '',
        'agendado_por' => $request->agendado_por,
      ]);
    }

    // Retornar la respuesta
    return response()->json([
      'success' => true,
      'message' => 'Registro creado exitosamente',
      'data' => $consultaGenerica,
    ], 201);
  }




  // Editar ConsultaGenerica
  public function EditarConsultaGenerica(Request $request, $pacienteId, $consultaId)
  {
    // Buscar el registro de ConsultaGenerica por el campo paciente y id_consulta
    $consultaGenerica = ConsultaGenerica::where('paciente', $pacienteId)
      ->where('id_consulta', $consultaId)
      ->first();

    if (!$consultaGenerica) {
      return response()->json([
        'success' => false,
        'message' => 'Registro no encontrado',
      ], 404);
    }

    $validator = Validator::make($request->all(), [
      // Validaciones necesarias
      'sucursal' => 'required|integer',
      'doctor' => 'required|string',
      'paciente' => 'required|integer',
      'id_terapia' => 'required|integer',
      'edad' => 'required|integer',
      'fecha_atencion' => 'required|date',
      'servicios_realizados_historias_clinicas' => 'array',
      'servicios_proximos_historias_clinicas' => 'array',
      'diagnostico_historia_clinica' => 'array',
      // Otras validaciones aquí...
    ]);

    if ($validator->fails()) {
      return response()->json([
        'success' => false,
        'message' => 'Error de validación',
        'errors' => $validator->errors(),
      ], 400);
    }

    // Obtener todos los datos de la solicitud
    $datos = $request->all();

    // Rellenar campos no enviados con un valor vacío o mantener el valor actual
    foreach ($consultaGenerica->getFillable() as $field) {
      if (!isset($datos[$field])) {
        $datos[$field] = $consultaGenerica->$field;  // Si no está en la solicitud, mantén el valor actual
      }
    }

    // Actualizar el registro con los datos procesados
    $consultaGenerica->update($datos);

    if ($request->has('servicios_realizados_historias_clinicas')) {
      // Eliminar los servicios realizados existentes
      ServiciosRealizadosHistoriasClinicas::where('historiaclinica_id', $consultaGenerica->id_consulta)->delete();

      // Insertar los nuevos servicios realizados
      foreach ($request->servicios_realizados_historias_clinicas as $servicioId) {
        ServiciosRealizadosHistoriasClinicas::create([
          'historiaclinica_id' => $consultaGenerica->id_consulta,
          'servicios_id' => $servicioId,
        ]);
      }
    }

    if ($request->has('servicios_proximos_historias_clinicas')) {

      ServiciosProximosHistoriasClinicas::where('historiaclinica_id', $consultaGenerica->id_consulta)->delete();

      // Insertar los nuevos servicios próximos
      foreach ($request->servicios_proximos_historias_clinicas as $servicioId) {
        ServiciosProximosHistoriasClinicas::create([
          'historiaclinica_id' => $consultaGenerica->id_consulta,
          'servicios_id' => $servicioId,
        ]);
      }
    }

    if ($request->has('diagnostico_historia_clinica')) {

      DiagnosticoHistoriaClinica::where('historia_clinica_id', $consultaGenerica->id_consulta)->delete();

      // Insertar los nuevos servicios próximos
      foreach ($request->diagnostico_historia_clinica as $servicioId) {
        DiagnosticoHistoriaClinica::create([
          'historia_clinica_id' => $consultaGenerica->id_consulta,
          'diagnostico_id' => $servicioId,
        ]);
      }
    }

    return response()->json([
      'success' => true,
      'message' => 'Registro actualizado exitosamente',
      'data' => $consultaGenerica,
    ], 200);
  }


  // Eliminar consultaGenerica
  public function DeleteConsultaGenerica($id)
  {
    $ConsultaGenerica = ConsultaGenerica::find($id);

    if (!$ConsultaGenerica) {
      return response()->json([
        'success' => false,
        'message' => 'Registro no encontrado',
      ], 404);
    }

    $cita = Citas::where('origen_id', $id)
      ->where('origen_tabla', 'consulta_generica')
      ->first();

    if ($cita) {
      $cita->delete();
    }

    $ConsultaGenerica->delete();
    return response()->json([
      'success' => true,
      'message' => 'Registro eliminado exitosamente',
    ], 200);
  }

  public function mostrarConsultaGenerica(Request $request)
  {
    // Obtén los parámetros de la solicitud
    $item = $request->query('item');
    $item2 = $request->query('item2');
    $valor = $request->query('valor');
    $valor2 = $request->query('valor2');

    if ($item && $item2) {
      // Consulta con parámetros
      $result = ConsultaGenerica::where($item, $valor)
        ->where($item2, $valor2)
        ->get(['id_consulta', 'fecha_creacion', 'doctor']);
    } else {
      // Consulta sin parámetros
      $result = ConsultaGenerica::all();
    }
    return response()->json([
      'success' => true,
      'message' => 'Registro exitosamente',
      'dataCG' => $result,
    ], 200);
  }
  public function VerConsultaGenerica($id, $id_consulta)
  {
    // Buscar el registro en la tabla OrtopticaAdultos por id_paciente y id_consulta
    $ortoptica = ConsultaGenerica::where('paciente', $id)
      ->where('id_consulta', $id_consulta)
      ->with('serviciosProximos.servicio')
      ->with('serviciosRealizados.servicio')
      ->with('diagnosticoHistoriaClinica.diagnosticos')
      ->first();

    // Verificar si el registro existe
    if (!$ortoptica) {
      return response()->json([
        'status' => [
          'code' => 404,
          'message' => 'Registro not found',
        ],
      ], 404);
    }


    // Formatear la respuesta
    return response()->json([
      'data' => $ortoptica,
      'status' => [
        'code' => 200,
        'message' => 'Registro retrieved successfully',
      ],
    ]);
  }

  // Obtener los campos que pueden ser asignados en masa
  protected function getFillable()
  {
    return (new ConsultaGenerica())->getFillable();
  }
}
