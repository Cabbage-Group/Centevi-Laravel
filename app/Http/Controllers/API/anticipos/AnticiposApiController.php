<?php

namespace App\Http\Controllers\API\anticipos;

use App\Http\Controllers\Controller;
use App\Models\Anticipo;
use App\Models\InterfuerzaSyncState;
use App\Models\Pacientes;
use App\Services\AnticiposSyncService;
use App\Services\InterfuerzaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class AnticiposApiController extends Controller
{
    protected InterfuerzaService $interfuerza;

    public function __construct(InterfuerzaService $interfuerza)
    {
        $this->interfuerza = $interfuerza;
    }

    public function index(Request $request)
    {
        try {
            $sortColumn = $request->input('sortColumn', 'created_at');
            $sortOrder = strtolower($request->input('sortOrder', 'desc'));
            $page = $request->input('page', 1);
            $limit = $request->input('limit', 18);
            $searchTerm = trim($request->input('searchTerm', ''));
            $idPaciente = $request->input('id_paciente');

            $allowedSortColumns = [
                'id_anticipo',
                'id_paciente',
                'id_sucursal',
                'referencia',
                'tipo',
                'monto',
                'estado',
                'fecha',
                'created_by',
                'created_at',
                'updated_at',
            ];

            if (!in_array($sortColumn, $allowedSortColumns)) {
                $sortColumn = 'created_at';
            }

            if (!in_array($sortOrder, ['asc', 'desc'])) {
                $sortOrder = 'desc';
            }

            $query = Anticipo::with([
                'paciente',
                'ordenAnticipos'
            ]);

            if ($idPaciente) {
                $query->where('id_paciente', $idPaciente);
            }


            if ($searchTerm !== '') {
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('id_anticipo', 'LIKE', "%{$searchTerm}%")
                        ->orWhere('id_paciente', 'LIKE', "%{$searchTerm}%")
                        ->orWhere('id_sucursal', 'LIKE', "%{$searchTerm}%")
                        ->orWhere('referencia', 'LIKE', "%{$searchTerm}%")
                        ->orWhere('tipo', 'LIKE', "%{$searchTerm}%")
                        ->orWhere('monto', 'LIKE', "%{$searchTerm}%")
                        ->orWhere('estado', 'LIKE', "%{$searchTerm}%")
                        ->orWhere('fecha', 'LIKE', "%{$searchTerm}%")
                        ->orWhere('created_by', 'LIKE', "%{$searchTerm}%");
                });
            }
            $anticipos = $query
                ->orderBy($sortColumn, $sortOrder)
                ->orderBy('id_anticipo', 'desc')
                ->paginate($limit, ['*'], 'page', $page);

            return response()->json([
                'data' => $anticipos->items(),
                'meta' => [
                    'total' => $anticipos->total(),
                    'limit' => $anticipos->perPage(),
                    'page' => $anticipos->currentPage(),
                    'last_page' => $anticipos->lastPage(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los anticipos',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $anticipo = Anticipo::with([
                'paciente',
                'ordenAnticipos.orden'
            ])->find($id);

            if (!$anticipo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anticipo no encontrado',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $anticipo,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el anticipo',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'id_paciente' => ['required', 'integer'],
                'id_sucursal' => ['required', 'integer'],
                'referencia' => ['nullable', 'string', 'max:255'],
                'tipo' => ['required', 'string', 'max:100'],
                'monto' => ['required', 'numeric', 'min:0.01'],
                'estado' => ['required'],
                'fecha' => ['required', 'date'],
                'created_by' => ['nullable', 'integer'],
            ]);

            DB::beginTransaction();

            $anticipo = Anticipo::create($validated);

            DB::commit();

            $anticipo->load([
                'paciente',
                'ordenAnticipos'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Anticipo creado correctamente',
                'data' => $anticipo,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al crear el anticipo',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $anticipo = Anticipo::find($id);

            if (!$anticipo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anticipo no encontrado',
                ], 404);
            }

            $tieneOrdenAnticipo = $anticipo->ordenAnticipos()->exists();

            $validated = $request->validate([
                'id_paciente' => ['sometimes', 'integer'],
                'id_sucursal' => ['sometimes', 'integer'],
                'referencia' => ['sometimes', 'nullable', 'string', 'max:255'],
                'tipo' => ['sometimes', 'string', 'max:100'],
                'monto' => ['sometimes', 'numeric', 'min:0.01'],
                'estado' => ['sometimes'],
                'fecha' => ['sometimes', 'date'],
                'created_by' => ['sometimes', 'nullable', 'integer'],
            ]);

            if ($tieneOrdenAnticipo && array_key_exists('monto', $validated)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede modificar el monto porque el anticipo ya ha sido aplicado a una orden.',
                ], 422);
            }

            DB::beginTransaction();

            $anticipo->update($validated);

            DB::commit();

            $anticipo->load([
                'paciente',
                'ordenAnticipos'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Anticipo actualizado correctamente',
                'data' => $anticipo,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el anticipo',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $anticipo = Anticipo::find($id);

            if (!$anticipo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anticipo no encontrado',
                ], 404);
            }

            $tieneOrdenAnticipo = $anticipo->ordenAnticipos()->exists();

            if ($tieneOrdenAnticipo) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar el anticipo porque ya ha sido aplicado a una orden.',
                ], 422);
            }

            $anticipo->delete();

            return response()->json([
                'success' => true,
                'message' => 'Anticipo eliminado correctamente',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el anticipo',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }


    public function fetchAnticiposInterfuerza(Request $request)
    {
        $page = $request->input('page', 1);
        $limit = $request->input('limit', 25);

        $response = $this->interfuerza->request([
            'class'  => 'GET',
            'action' => 'payments',
            'page'   => $page,
            'limit'  => $limit,
        ]);

        if (!$response->successful()) {
            return response()->json([
                'error'  => 'Error consultando Interfuerza',
                'status' => $response->status(),
            ], 502);
        }

        $body = $response->json();

        $payments = $body['payments'] ?? [];

        return response()->json([
            'data'           => $payments,
            'count'          => (int) ($body['count'] ?? 0),
            'page'           => (int) $page,
            'total_pagina'   => count($payments),
            'limit'          => (int) $limit,
        ]);
    }

    public function migrationAnticiposInterfuerza(Request $request)
    {
        $data           = $request->input('data', []);
        $page           = $request->input('page');
        $esUltimaPagina = $request->boolean('es_ultima_pagina');
        $huboErrores    = $request->boolean('hubo_errores');
        $totalEnPagina  = $request->input('total_pagina'); // total de payments (no solo anticipos) que trajo esta página
        $limitPagina    = (int) $request->input('limit', 25);

        if ($page === null || $totalEnPagina === null) {
            return response()->json(['error' => 'Faltan page o total_pagina'], 400);
        }

        try {
            $migrados      = 0;
            $sincronizados = 0;
            $pendientes    = 0;

            foreach ($data as $registro) {
                $referencia    = $registro['referencia'] ?? null;
                $codigoCliente = $registro['codigo_cliente'] ?? null;

                if (!$referencia) {
                    continue;
                }

                $paciente = $codigoCliente
                    ? Pacientes::where('codigo', $codigoCliente)->first()
                    : null;

                Anticipo::updateOrCreate(
                    ['referencia' => $referencia],
                    [
                        'id_paciente'        => $paciente?->id_paciente,
                        'codigo_interfuerza' => $codigoCliente,
                        'pagina_interfuerza' => $page,
                        'sincronizado'       => (bool) $paciente,
                        'tipo'               => 'ADVANCE',
                        'monto'              => $registro['monto'] ?? 0,
                        'fecha'              => $registro['fecha'] ?? now()->toDateString(),
                        'estado'             => $registro['estado'] ?? 'ACTIVE',
                    ]
                );

                $migrados++;
                $paciente ? $sincronizados++ : $pendientes++;
            }

            $estado = InterfuerzaSyncState::firstOrCreate(
                ['recurso' => 'anticipos'],
                [
                    'ultima_pagina'          => 0,
                    'ultima_pagina_revisada' => 0,
                    'ultima_pagina_completa' => null,
                    'ultimo_total'           => 0,
                    'historial_completo'     => false,
                ]
            );

            // ultima_pagina: solo se mueve si esta página SÍ trajo anticipos
            if (!empty($data) && $page > $estado->ultima_pagina) {
                $estado->ultima_pagina = $page;
            }

            // ultima_pagina_revisada: avanza siempre, tenga o no anticipos
            if ($page >= ($estado->ultima_pagina_revisada ?? 0)) {
                $estado->ultima_pagina_revisada = $page;
                $estado->ultima_pagina_completa = $totalEnPagina >= $limitPagina;
            }

            if ($esUltimaPagina && !$huboErrores) {
                $estado->historial_completo = true;
            }

            $estado->ultima_sincronizacion = now();
            $estado->save();

            return response()->json([
                'message'       => 'Página migrada',
                'page'          => $page,
                'migrados'      => $migrados,
                'sincronizados' => $sincronizados,
                'pendientes'    => $pendientes,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function actualizarAnticiposRecientes(Request $request, AnticiposSyncService $sync)
    {
        try {
            $resultado = $sync->sincronizarRecientes($request->input('limit', 100));

            return response()->json(array_merge(
                ['message' => 'Anticipos actualizados'],
                $resultado
            ));
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
