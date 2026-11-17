<?php

namespace App\Http\Controllers\API\interfuerza;

use App\Http\Controllers\Controller;
use App\Models\Pacientes;
use App\Services\InterfuerzaClientCreator;
use App\Services\InterfuerzaCreateService;
use App\Services\InterfuerzaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class InterfuerzaController extends Controller
{
  protected $interfuerzaService;
  protected $interfuerzaCreateService;
  protected $interfuerzaClientCreator;

  public function __construct(
    InterfuerzaService $interfuerzaService,
    InterfuerzaCreateService $interfuerzaCreateService,
    InterfuerzaClientCreator $interfuerzaClientCreator
  ) {
    // Este controlador usa la API v4 de Interfuerza
    $this->interfuerzaService = $interfuerzaService->withConfig(InterfuerzaService::V4_URL, InterfuerzaService::V4_TOKEN);
    $this->interfuerzaCreateService = $interfuerzaCreateService->withConfig(InterfuerzaService::V4_URL, InterfuerzaService::V4_TOKEN);
    $this->interfuerzaClientCreator = new InterfuerzaClientCreator($this->interfuerzaCreateService);
  }


  private function utf8ize($mixed)
  {
    if (is_array($mixed)) {
      foreach ($mixed as $key => $value) {
        $mixed[$key] = $this->utf8ize($value);
      }
    } elseif (is_string($mixed)) {
      return mb_convert_encoding($mixed, 'UTF-8', 'UTF-8');
    }
    return $mixed;
  }

  public function verificarYActualizar(Request $request)
  {
    $ruc = $request->input('ruc');
    $usuario = $request->input('usuario');

    if (!$ruc) {
      return response()->json(['message' => 'RUC no proporcionado'], 400);
    }

    $response = $this->interfuerzaService->request([
      'class' => 'GET',
      'action' => 'customers',
      'page' => '1',
      'filters' => [
        [
          'field' => 'RUC',
          'type' => '=',
          'value' => $ruc,
        ]
      ]
    ]);

    if (!$response || !$response->successful()) {
      return response()->json(['message' => 'Error al consultar a Interfuerza'], 500);
    }

    $data = $response->json();
    // Se usa el paciente exacto que se acaba de crear/editar; la cédula es solo respaldo
    $idPaciente = $request->input('id_paciente');
    $paciente = $idPaciente ? Pacientes::find($idPaciente) : Pacientes::buscarPorCedula($ruc);

    if (empty($data['customers']) || count($data['customers']) === 0) {
      if ($paciente) {
        $responseInterfuerza = $this->interfuerzaClientCreator->crearCliente($paciente, $usuario);


        if ($responseInterfuerza === null) {
          return response()->json([
            'respuesta' => false,
            'message' => 'No se pudo comunicar con Interfuerza',
            'mensaje_dev' => 'Error al hacer la solicitud HTTP'
          ], 500);
        }

        if (!$responseInterfuerza->successful()) {
          return response()->json([
            'respuesta' => true,
            'message' => 'Paciente registrado, pero Interfuerza devolvió un error',
            'data' => [$paciente],
            'mensaje_dev' => $responseInterfuerza->body()
          ], 200);
        }

        $interfuerzaData = $responseInterfuerza->json();

        if (isset($interfuerzaData['response']['id'])) {
          $paciente->codigo = $interfuerzaData['response']['id'];
        }

        $paciente->interfuerza = true;
        $paciente->save();

        return response()->json([
          'message' => 'Paciente no encontrado. Se creó uno nuevo en Interfuerza',
          'paciente' => $paciente,
          'interfuerza' => $responseInterfuerza->json()
        ], 200);
      }

      return response()->json(['message' => 'Paciente no encontrado en tu sistema'], 404);
    }

    if (!$paciente) {
      return response()->json(['message' => 'Paciente no encontrado en tu sistema'], 404);
    }

    $interfuerzaId = $data['customers'][0]['Cliente'] ?? null;

    if ($interfuerzaId) {
      $otro = Pacientes::where('codigo', $interfuerzaId)
        ->where('id_paciente', '!=', $paciente->id_paciente)
        ->first();

      if ($otro) {
        // No mover el código a otro registro: eso separa anticipos e historial
        Log::warning('Código de Interfuerza ya asignado a otro paciente', [
          'codigo' => $interfuerzaId,
          'paciente_solicitado' => $paciente->id_paciente,
          'paciente_con_codigo' => $otro->id_paciente,
        ]);

        return response()->json([
          'message' => "El cliente de Interfuerza {$interfuerzaId} ya está vinculado al paciente ID {$otro->id_paciente}. Posible duplicado: debe fusionarse.",
          'paciente' => $this->utf8ize($paciente->toArray()),
        ]);
      }

      $paciente->codigo = $interfuerzaId;
    }
    
    $paciente->interfuerza = true;
    $paciente->save();

    $pacienteData = $this->utf8ize($paciente->toArray());

    return response()->json([
      'message' => 'Paciente actualizado con éxito',
      'paciente' => $pacienteData,
    ]);
  }
}
