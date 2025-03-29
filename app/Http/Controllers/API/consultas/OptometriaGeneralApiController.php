<?php

namespace App\Http\Controllers\API\consultas;

use App\Http\Controllers\Controller;
use App\Models\Citas;
use Illuminate\Http\Request;
use App\Models\RefraccionGeneral;
use App\Models\ServiciosProximosOptometriaGeneral;
use App\Models\ServiciosRealizadosOptometriaGeneral;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class OptometriaGeneralApiController extends Controller
{
  public function CrearRefraccionGeneral(Request $request)
  {
    // Validaciones necesarias
    $validator = Validator::make($request->all(), [
      'sucursal' => 'required|integer|max:255',
      'doctor' => 'required|string|max:255',
      'paciente' => 'required|integer',
      'id_terapia' => 'required|integer',
      'edad' => 'required|integer',
      'fecha_atencion' => 'required|date',
      'servicios_realizados_optometria_general' => 'array',
      'servicios_proximos_optometria_general' => 'array',
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

    try {
      // Convertir campos nulos en vacíos
      $datos = array_map(function ($value) {
        return $value === null ? '' : $value;
      }, $request->all());

      $datos['fecha_creacion'] = now(); // Establecer la fecha actual

      // Crear el registro
      $refraccionGeneral = RefraccionGeneral::create($datos);

      if (isset($request->servicios_realizados_optometria_general)) {
        foreach ($request->servicios_realizados_optometria_general as $servicioId) {
          ServiciosRealizadosOptometriaGeneral::create([
            'optometriageneral_id' => $refraccionGeneral->id_consulta,
            'servicios_id' => $servicioId,
          ]);
        }
      }

      if (isset($request->servicios_proximos_optometria_general)) {
        foreach ($request->servicios_proximos_optometria_general as $servicioId) {
          ServiciosProximosOptometriaGeneral::create([
            'optometriageneral_id' => $refraccionGeneral->id_consulta,
            'servicios_id' => $servicioId,
          ]);
        }
      }

      if (!empty($request->fecha_proxima_consulta)) {
        $fechaProxima = Carbon::parse($request->fecha_proxima_consulta)->setTime(12, 0, 0);
        Citas::create([
          'origen_id' => $refraccionGeneral->id_consulta,
          'origen_tabla' => 'refraccion_general',
          'fecha_hora' => $fechaProxima,
          'tipo' => 'proxima cita',
          'paciente_id' => $refraccionGeneral->paciente,
          'doctor' => $refraccionGeneral->doctor,
          'sucursal_id' => $refraccionGeneral->sucursal,
          'ex_proxima_cita' => true,
          'comentarios' => '',
          'agendado_por' => $request->agendado_por, 
        ]);
      }
  

      return response()->json([
        'success' => true,
        'message' => 'Registro creado exitosamente',
        'data' => $refraccionGeneral,
      ], 201);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error al crear el registro',
        'errors' => $e->getMessage(),
      ], 500);
    }
  }

  public function EditarRefraccionGeneral(Request $request, $pacienteId, $consultaId)
  {
    $refraccionGeneral = RefraccionGeneral::where('paciente', $pacienteId)
      ->where('id_consulta', $consultaId)
      ->first();

    if (!$refraccionGeneral) {
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
    foreach ($refraccionGeneral->getFillable() as $field) {
      if (!isset($datos[$field])) {
        $datos[$field] = $refraccionGeneral->$field;  // Mantén el valor actual si no está en la solicitud
      }
    }

    // Actualizar los campos
    $refraccionGeneral->update($datos);

    if ($request->has('servicios_realizados_optometria_general')) {
      // Eliminar los servicios realizados existentes
      ServiciosRealizadosOptometriaGeneral::where('optometriageneral_id', $refraccionGeneral->id_consulta)->delete();

      // Insertar los nuevos servicios realizados
      foreach ($request->servicios_realizados_optometria_general as $servicioId) {
        ServiciosRealizadosOptometriaGeneral::create([
          'optometriageneral_id' => $refraccionGeneral->id_consulta,
          'servicios_id' => $servicioId,
        ]);
      }
    }

    if ($request->has('servicios_proximos_optometria_general')) {
      // Eliminar los servicios próximos existentes
      ServiciosProximosOptometriaGeneral::where('optometriageneral_id', $refraccionGeneral->id_consulta)->delete();

      // Insertar los nuevos servicios próximos
      foreach ($request->servicios_proximos_optometria_general as $servicioId) {
        ServiciosProximosOptometriaGeneral::create([
          'optometriageneral_id' => $refraccionGeneral->id_consulta,
          'servicios_id' => $servicioId,
        ]);
      }
    }

    return response()->json([
      'success' => true,
      'message' => 'Registro actualizado exitosamente',
      'data' => $refraccionGeneral,
    ], 200);
  }


  // Eliminar RefraccionGeneral
  public function DeleteRefraccionGeneral($id)
  {
    $refraccionGeneral = RefraccionGeneral::find($id);
    if (!$refraccionGeneral) {
      return response()->json([
        'success' => false,
        'message' => 'Registro no encontrado',
      ], 404);
    }
    $refraccionGeneral->delete();
    return response()->json([
      'success' => true,
      'message' => 'Registro eliminado exitosamente',
    ], 200);
  }

  // Mostrar RefraccionGeneral por id_paciente
  public function mostrarRefraccionGeneral(Request $request)
  {
    // Obtén los parámetros de la solicitud
    $item = $request->query('item');
    $item2 = $request->query('item2');
    $valor = $request->query('valor');
    $valor2 = $request->query('valor2');

    if ($item && $item2) {
      // Consulta con parámetros
      $result = RefraccionGeneral::where($item, $valor)
        ->where($item2, $valor2)
        ->get(['id_consulta', 'fecha_creacion', 'doctor']);
    } else {
      // Consulta sin parámetros
      $result = RefraccionGeneral::all();
    }
    return response()->json([
      'success' => true,
      'message' => 'Registro exitosamente',
      'dataRG' => $result,
    ], 200);
  }

  public function VerRefraccionGeneral($id, $id_consulta)
  {
    // Buscar el registro en la tabla OrtopticaAdultos por id_paciente y id_consulta
    $ortoptica = RefraccionGeneral::where('paciente', $id)
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
    return (new RefraccionGeneral())->getFillable();
  }
}