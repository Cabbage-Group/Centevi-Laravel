<?php

namespace App\Http\Controllers\API\consultas;

use App\Http\Controllers\Controller;
use App\Models\Citas;
use Illuminate\Http\Request;
use App\Models\OptometriaPediatrica;
use App\Models\ServiciosRealizadosOptometriaPediatrica;
use App\Models\ServiciosProximosOptometriaPediatrica;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class PediatricaApiController extends Controller
{
  public function crearPediatrica(Request $request)
  {
    // Validaciones necesarias
    $validator = Validator::make($request->all(), [
      'sucursal' => 'required|integer',
      'doctor' => 'required|string',
      'paciente' => 'required|integer',
      'id_terapia' => 'required|integer',
      'edad' => 'required|integer',
      'fecha_atencion' => 'required|date',
      'servicios_realizados_optometria_pediatrica' => 'array',
      'servicios_proximos_optometria_pediatrica' => 'array',
      'fecha_proxima_consulta' => 'nullable|date',
      'agendado_por' => 'required|string|max:255',

    ]);

    if ($validator->fails()) {
      return response()->json([
        'success' => false,
        'message' => 'Error de validación',
        'errors' => $validator->errors(),
      ], 400);
    }

    try {
      // Convertir campos nulos en vacíos
      $datos = array_map(function ($value) {
        return $value === null ? '' : $value;
      }, $request->all());

      $datos['fecha_creacion'] = now(); // Establecer la fecha actual

      // Crear el registro
      $optometriaPediatrica = OptometriaPediatrica::create($datos);


      if (isset($request->servicios_realizados_optometria_pediatrica)) {
        foreach ($request->servicios_realizados_optometria_pediatrica as $servicioId) {
          ServiciosRealizadosOptometriaPediatrica::create([
            'optometriaPediatrica_id' => $optometriaPediatrica->id_consulta, // Usar el ID de la consulta generica como historiaclinica_id
            'servicios_id' => $servicioId,
          ]);
        }
      }

      if (isset($request->servicios_proximos_optometria_pediatrica)) {
        foreach ($request->servicios_proximos_optometria_pediatrica as $servicioId) {
          ServiciosProximosOptometriaPediatrica::create([
            'optometriaPediatrica_id' => $optometriaPediatrica->id_consulta, // Usar el ID de la consulta generica como historiaclinica_id
            'servicios_id' => $servicioId,
          ]);
        }
      }

      if (!empty($request->fecha_proxima_consulta)) {
        $fechaProxima = Carbon::parse($request->fecha_proxima_consulta)->setTime(12, 0, 0);
        Citas::create([
          'origen_id' => $optometriaPediatrica->id_consulta,
          'origen_tabla' => 'optometria_pediatrica',
          'fecha_hora' => $fechaProxima,
          'tipo' => 'proxima_cita',
          'paciente_id' => $optometriaPediatrica->paciente,
          'doctor' => $optometriaPediatrica->doctor,
          'sucursal_id' => $optometriaPediatrica->sucursal,
          'ex_proxima_cita' => true,
          'comentarios' => '',
          'agendado_por' => $request->agendado_por,
        ]);
      }

      return response()->json([
        'success' => true,
        'message' => 'Registro creado exitosamente',
        'data' => $optometriaPediatrica,
      ], 201);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error al crear el registro',
        'errors' => $e->getMessage(),
      ], 500);
    }
  }

  public function editarPediatrica(Request $request, $pacienteId, $consultaId)
  {
    $optometriaPediatrica = OptometriaPediatrica::where('paciente', $pacienteId)
      ->where('id_consulta', $consultaId)
      ->first();

    if (!$optometriaPediatrica) {
      return response()->json([
        'success' => false,
        'message' => 'Registro no encontrado',
      ], 404);
    }

    // Validar los datos de entrada
    $validator = Validator::make($request->all(), [
      'sucursal' => 'required|integer',
      'doctor' => 'required|string',
      'paciente' => 'required|integer',
      'id_terapia' => 'required|integer',
      'edad' => 'required|integer',
      'fecha_atencion' => 'required|date',
      'servicios_realizados_historias_clinicas' => 'array',
      'servicios_proximos_historias_clinicas' => 'array'
      // Agrega las reglas para los demás campos...
    ]);

    if ($validator->fails()) {
      return response()->json([
        'success' => false,
        'message' => 'Error de validación',
        'errors' => $validator->errors(),
      ], 400);
    }

    try {
      // Obtener todos los datos de la solicitud
      $datos = $request->all();

      // Rellenar campos no enviados con un valor vacío o mantener el valor actual
      foreach ($optometriaPediatrica->getFillable() as $field) {
        if (!isset($datos[$field])) {
          $datos[$field] = $optometriaPediatrica->$field;  // Mantén el valor actual si no está en la solicitud
        }
      }

      // Actualizar los campos
      $optometriaPediatrica->update($datos);

      if ($request->has('servicios_realizados_optometria_pediatrica')) {
        // Eliminar los servicios realizados existentes
        ServiciosRealizadosOptometriaPediatrica::where('optometriaPediatrica_id', $optometriaPediatrica->id_consulta)->delete();

        // Insertar los nuevos servicios realizados
        foreach ($request->servicios_realizados_optometria_pediatrica as $servicioId) {
          ServiciosRealizadosOptometriaPediatrica::create([
            'optometriaPediatrica_id' => $optometriaPediatrica->id_consulta,
            'servicios_id' => $servicioId,
          ]);
        }
      }

      if ($request->has('servicios_proximos_optometria_pediatrica')) {
        // Eliminar los servicios próximos existentes
        ServiciosProximosOptometriaPediatrica::where('optometriaPediatrica_id', $optometriaPediatrica->id_consulta)->delete();

        // Insertar los nuevos servicios próximos
        foreach ($request->servicios_proximos_optometria_pediatrica as $servicioId) {
          ServiciosProximosOptometriaPediatrica::create([
            'optometriaPediatrica_id' => $optometriaPediatrica->id_consulta,
            'servicios_id' => $servicioId,
          ]);
        }
      }

      return response()->json([
        'success' => true,
        'message' => 'Registro actualizado exitosamente',
        'data' => $optometriaPediatrica,
      ], 200);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error al actualizar el registro',
        'errors' => $e->getMessage(),
      ], 500);
    }
  }

  public function eliminarPediatrica($id)
  {
    $optometriaPediatrica = OptometriaPediatrica::find($id);

    if (!$optometriaPediatrica) {
      return response()->json([
        'success' => false,
        'message' => 'Registro no encontrado',
      ], 404);
    }

    $cita = Citas::where('origen_id', $id)
      ->where('origen_tabla', 'optometria_pediatrica')
      ->first();

    if ($cita) {
      $cita->delete();
    }

    $optometriaPediatrica->delete();

    return response()->json([
      'success' => true,
      'message' => 'Registro eliminado exitosamente',
    ], 200);
  }
  
  public function mostrarOptometriaPediatrica(Request $request)
  {
    // Obtén los parámetros de la solicitud
    $item = $request->query('item');
    $item2 = $request->query('item2');
    $valor = $request->query('valor');
    $valor2 = $request->query('valor2');

    if ($item && $item2) {
      // Consulta con parámetros
      $result = OptometriaPediatrica::where($item, $valor)
        ->where($item2, $valor2)
        ->get(['id_consulta', 'fecha_creacion', 'doctor']);
    } else {
      // Consulta sin parámetros
      $result = OptometriaPediatrica::all();
    }
    return response()->json([
      'success' => true,
      'message' => 'Registro exitosamente',
      'dataOP' => $result,
    ], 200);
  }

  public function VerOptometriaPediatrica($id, $id_consulta)
  {
    // Buscar el registro en la tabla OrtopticaAdultos por id_paciente y id_consulta
    $ortoptica = OptometriaPediatrica::where('paciente', $id)
      ->where('id_consulta', $id_consulta)
      ->with('serviciosProximos.servicio')
      ->with('serviciosRealizados.servicio')
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
    return (new OptometriaPediatrica())->getFillable();
  }
}
