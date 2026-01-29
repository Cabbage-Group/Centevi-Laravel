<?php

namespace App\Http\Controllers\API\diagnostico_pacientes;

use App\Http\Controllers\Controller;
use App\Models\Diagnosticos;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class DiagnosticoPacienteController extends Controller
{
  public function mostrarDiagnosticos(Request $request)
  {
    try {
      $search = $request->input('search');
      $diagnosticos = Diagnosticos::query();

      // Si hay búsqueda, filtramos
      if ($search) {
        $normalizedSearch = $this->normalizeString($search);

        $diagnosticos = $diagnosticos->get()->filter(function ($diagnostico) use ($normalizedSearch) {
          $normalizedCodigo = $this->normalizeString($diagnostico->codigo ?? '');
          $normalizedDescripcion = $this->normalizeString($diagnostico->descripcion ?? '');
          $normalizedNombre = $this->normalizeString($diagnostico->nombre ?? '');

          return
            str_contains($normalizedCodigo, $normalizedSearch) ||
            str_contains($normalizedDescripcion, $normalizedSearch) ||
            str_contains($normalizedNombre, $normalizedSearch);
        })->values();
      } else {
        $diagnosticos = $diagnosticos->get();
      }

      foreach ($diagnosticos as $diagnostico) {
        foreach ($diagnostico->getAttributes() as $key => $value) {
          if (is_string($value) && !mb_check_encoding($value, 'UTF-8')) {
            return response()->json([
              'success' => false,
              'message' => "Caracteres mal codificados en el campo '$key'",
              'data' => $value,
            ], 500);
          }
        }
      }

      return response()->json([
        'success' => true,
        'message' => 'Diagnósticos obtenidos correctamente',
        'data' => $diagnosticos
      ], Response::HTTP_OK);
    } catch (\Throwable $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error interno del servidor',
        'error' => $e->getMessage(),
      ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
  }

  private function normalizeString($string)
  {
    $string = mb_strtolower($string);
    $string = preg_replace('/[^a-z0-9]/u', '', $string);
    return $string;
  }

  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'codigo' => 'required|string|max:100|unique:diagnosticos,codigo',
      'diagnostico' => 'required|string|max:255',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'status' => 'error',
        'errors' => $validator->errors(),
      ], 422);
    }

    $diagnosticos = Diagnosticos::create([
      'codigo' => $request->codigo,
      'diagnostico' => $request->diagnostico,
    ]);

    return response()->json([
      'status' => 'success',
      'data' => $diagnosticos,
      'message' => 'Diagnostico creado correctamente',
    ], 201);
  }

  public function update($id, Request $request)
  {
    $diagnostico = Diagnosticos::find($id);

    if (!$diagnostico) {
      return response()->json([
        'status' => 'error',
        'message' => 'Diagnostico no encontrado',
      ], 404);
    }

    $validator = Validator::make($request->all(), [
      'codigo' => 'required|string|max:100|unique:diagnosticos,codigo,' . $diagnostico->id,
      'diagnostico' => 'required|string|max:255',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'status' => 'error',
        'errors' => $validator->errors(),
      ], 422);
    }

    $diagnostico->update([
      'codigo' => $request->codigo,
      'diagnostico' => $request->diagnostico,
    ]);

    return response()->json([
      'status' => 'success',
      'data' => $diagnostico,
      'message' => 'Diagnostico actualizado correctamente',
    ], 200);
  }

  public function destroy($id)
  {
    $diagnostico = Diagnosticos::find($id);

    if (!$diagnostico) {
      return response()->json([
        'status' => 'error',
        'message' => 'Diagnostico no encontrado',
      ], 404);
    }

    $diagnostico->delete();

    return response()->json([
      'status' => 'success',
      'message' => 'Diagnostico eliminado correctamente',
      'id' => $id,
    ], 200);
  }

  public function diagnosticosPorPaciente(Request $request, int $pacienteId)
  {
    $perPage = $request->query('limit', 10);

    $fuentes = [
      [
        'tabla_historia' => 'consultagenerica',
        'pk_historia'    => 'id_consulta',
        'campo_paciente' => 'paciente',
        'tabla_diag'     => 'diagnosticos_historias_clinicas',
        'fk_historia'    => 'historia_clinica_id',
      ],
      [
        'tabla_historia' => 'refracciongeneral',
        'pk_historia'    => 'id_consulta',
        'campo_paciente' => 'paciente',
        'tabla_diag'     => 'diagnosticos_optometria_general',
        'fk_historia'    => 'optometria_general_id',
      ],
      [
        'tabla_historia' => 'optometria_neonatos',
        'pk_historia'    => 'id_consulta',
        'campo_paciente' => 'paciente',
        'tabla_diag'     => 'diagnosticos_optometria_neonatos',
        'fk_historia'    => 'optometria_neonatos_id',
      ],
      [
        'tabla_historia' => 'optometria_pediatrica',
        'pk_historia'    => 'id_consulta',
        'campo_paciente' => 'paciente',
        'tabla_diag'     => 'diagnosticos_optometria_pediatrica',
        'fk_historia'    => 'optometria_pediatrica_id',
      ],
      [
        'tabla_historia' => 'ortoptica_adultos',
        'pk_historia'    => 'id_consulta',
        'campo_paciente' => 'paciente',
        'tabla_diag'     => 'diagnosticos_ortoptica_adultos',
        'fk_historia'    => 'ortoptica_adulto_id',
      ],
    ];

    $queries = [];

    foreach ($fuentes as $f) {
      $queries[] = DB::table($f['tabla_historia'] . ' as h')
        ->join($f['tabla_diag'] . ' as dh', 'dh.' . $f['fk_historia'], '=', 'h.' . $f['pk_historia'])
        ->join('diagnosticos as d', 'd.id', '=', 'dh.diagnostico_id')
        ->where('h.' . $f['campo_paciente'], $pacienteId)
        ->select([
          'd.codigo',
          'd.diagnostico',
        ]);
    }

    $query = array_shift($queries);
    foreach ($queries as $q) {
      $query->unionAll($q);
    }

    $query = DB::query()
      ->fromSub($query, 't')
      ->select('codigo', 'diagnostico')
      ->distinct();

    $paginator = $query->paginate($perPage);

    return response()->json([
      'data' => $paginator->items(),
      'meta' => [
        'current_page' => $paginator->currentPage(),
        'last_page'    => $paginator->lastPage(),
        'per_page'     => $paginator->perPage(),
        'total'        => $paginator->total(),
        'from'         => $paginator->firstItem(),
        'to'           => $paginator->lastItem(),
      ],
    ]);
  }

  public function diagnosticosPorPacienteDetalle(Request $request, int $pacienteId)
  {
    $perPage = $request->query('limit', 7);

    $fuentes = [
      [
        'tabla_historia' => 'consultagenerica',
        'pk_historia'    => 'id_consulta',
        'campo_paciente' => 'paciente',
        'tabla_diag'     => 'diagnosticos_historias_clinicas',
        'fk_historia'    => 'historia_clinica_id',
        'consulta'       => 'Consulta General',
      ],
      [
        'tabla_historia' => 'refracciongeneral',
        'pk_historia'    => 'id_consulta',
        'campo_paciente' => 'paciente',
        'tabla_diag'     => 'diagnosticos_optometria_general',
        'fk_historia'    => 'optometria_general_id',
        'consulta'       => 'Refracción General',
      ],
      [
        'tabla_historia' => 'optometria_neonatos',
        'pk_historia'    => 'id_consulta',
        'campo_paciente' => 'paciente',
        'tabla_diag'     => 'diagnosticos_optometria_neonatos',
        'fk_historia'    => 'optometria_neonatos_id',
        'consulta'       => 'Optometría Neonatos',
      ],
      [
        'tabla_historia' => 'optometria_pediatrica',
        'pk_historia'    => 'id_consulta',
        'campo_paciente' => 'paciente',
        'tabla_diag'     => 'diagnosticos_optometria_pediatrica',
        'fk_historia'    => 'optometria_pediatrica_id',
        'consulta'       => 'Optometría Pediátrica',
      ],
      [
        'tabla_historia' => 'ortoptica_adultos',
        'pk_historia'    => 'id_consulta',
        'campo_paciente' => 'paciente',
        'tabla_diag'     => 'diagnosticos_ortoptica_adultos',
        'fk_historia'    => 'ortoptica_adulto_id',
        'consulta'       => 'Ortóptica Adultos',
      ],
    ];

    $queries = [];

    foreach ($fuentes as $f) {
      $queries[] = DB::table($f['tabla_historia'] . ' as h')
        ->join($f['tabla_diag'] . ' as dh', 'dh.' . $f['fk_historia'], '=', 'h.' . $f['pk_historia'])
        ->join('diagnosticos as d', 'd.id', '=', 'dh.diagnostico_id')
        ->where('h.' . $f['campo_paciente'], $pacienteId)
        ->select([
          'd.codigo',
          'd.diagnostico',
          'h.doctor',
          'dh.created_at as fecha_diagnostico',
          DB::raw("'" . $f['consulta'] . "' as consulta"),
        ]);
    }

    $query = array_shift($queries);
    foreach ($queries as $q) {
      $query->unionAll($q);
    }

    $query = DB::query()
      ->fromSub($query, 't')
      ->orderBy('fecha_diagnostico', 'asc');

    $paginator = $query->paginate($perPage);

    $startId = ($paginator->currentPage() - 1) * $paginator->perPage();

    $data = collect($paginator->items())->values()->map(function ($item, $index) use ($startId) {
      return [
        'id'                => $startId + $index + 1,
        'codigo'            => $item->codigo,
        'diagnostico'       => $item->diagnostico,
        'doctor'            => $item->doctor,
        'fecha_diagnostico' => $item->fecha_diagnostico,
        'consulta'          => $item->consulta,
      ];
    });

    return response()->json([
      'data' => $data,
      'meta' => [
        'current_page' => $paginator->currentPage(),
        'last_page'    => $paginator->lastPage(),
        'per_page'     => $paginator->perPage(),
        'total'        => $paginator->total(),
        'from'         => $paginator->firstItem(),
        'to'           => $paginator->lastItem(),
      ],
    ]);
  }
}
