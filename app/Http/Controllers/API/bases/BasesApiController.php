<?php

namespace App\Http\Controllers\API\bases;

use App\Http\Controllers\Controller;
use App\Models\Bases;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BasesApiController extends Controller
{
    public function index(Request $request)
    {
        $query = Bases::query();

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('descripcion', 'LIKE', "%{$search}%")
                ->orWhere('codigo', 'LIKE', "%{$search}%");
            });
        }

        $bases = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Operación exitosa',
            'data' => $bases
        ], Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo' => 'required|string|max:255',
            'descripcion' => 'required|string|max:255',
        ]);

        $base = Bases::create($validated);

        return response()->json($base, Response::HTTP_CREATED);
    }

    public function update($id, Request $request)
    {
        $base = Bases::find($id);

        if (!$base) {
            return response()->json([
                'message' => 'Base no encontrada.',
            ], 404);
        }

        $validated = $request->validate([
            'codigo' => 'sometimes|string|max:255',
            'descripcion' => 'sometimes|string|max:255',
        ]);

        $base->update($validated);

        return response()->json([
            'message' => 'Base actualizada exitosamente.',
            'data' => $base,
        ], 200);
    }

    public function delete($id)
    {
        $base = Bases::find($id);

        if (!$base) {
        return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        $base->delete();

        return response()->json([
            'respuesta' => true,
            'message' => 'Base eliminada correctamente.',
            'id' => $id,
        ], 200);
    }
}
