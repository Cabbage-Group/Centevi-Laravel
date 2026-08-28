<?php

namespace App\Http\Controllers\API\anticipos;

use App\Http\Controllers\Controller;
use App\Models\Anticipo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnticiposApiController extends Controller
{
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
}
