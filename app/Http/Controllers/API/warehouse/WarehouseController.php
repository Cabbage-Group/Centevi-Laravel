<?php

namespace App\Http\Controllers\API\warehouse;

use App\Http\Controllers\Controller;
use App\Models\WareHouse;
use App\Services\InterfuerzaService;
use Illuminate\Http\Request;

class WarehouseController extends Controller
{

    protected $interfuerza;

    public function __construct(InterfuerzaService $interfuerza)
    {
        $this->interfuerza = $interfuerza;
    }


    public function index(Request $request)
    {
        $page = $request->input('page');
        $limit = $request->input('limit');

        if ($limit === null && $page === null) {
            $warehouses = WareHouse::all();

            return response()->json([
                'data' => $warehouses,
                'meta' => [
                    'total' => $warehouses->count(),
                    'limit' => null,
                    'page' => null,
                ]
            ]);
        }

        $limit = (int) ($limit ?? 10);
        $page = (int) ($page ?? 1);

        $warehouses = WareHouse::paginate($limit, ['*'], 'page', $page);

        return response()->json([
            'data' => $warehouses->items(),
            'meta' => [
                'total' => $warehouses->total(),
                'limit' => $warehouses->perPage(),
                'page' => $warehouses->currentPage(),
            ]
        ]);
    }

    public function syncFromInterfuerza()
    {
        $payload = [
            "class" => "GET",
            "action" => "warehouses"
        ];

        $response = $this->interfuerza->request($payload);

        if (!$response->successful()) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener datos de Interfuerza'
            ], 500);
        }

        $data = $response->json();
        $warehouses = $data['warehouses'] ?? [];

        $created = [];

        foreach ($warehouses as $w) {
            if (!WareHouse::where('nombre', $w['Nombre'])->exists()) {
                $new = WareHouse::create([
                    'nombre' => $w['Nombre'],
                    'status' => $w['Status'] ?? true,
                    'tienda' => $w['Tienda'] ?? null,
                    'type' => $w['Type'] ?? null,
                    'venta_pos' => $w['Venta_POS'] ?? false,
                ]);
                $created[] = $new;
            }
        }

        return response()->json([
            'success' => true,
            'created_count' => count($created),
            'created' => $created
        ]);
    }

    public function updateSendDiscount(Request $request, $id)
    {
        $request->validate([
            'send_discount' => 'required|boolean',
        ]);

        $warehouse = WareHouse::find($id);

        if (!$warehouse) {
            return response()->json([
                'success' => false,
                'message' => 'Warehouse no encontrado',
            ], 404);
        }

        $warehouse->send_discount = $request->send_discount;
        $warehouse->save();

        return response()->json([
            'success' => true,
            'message' => 'Campo send_discount actualizado correctamente',
            'data' => $warehouse,
        ]);
    }

    public function updateSucursal(Request $request, $id)
    {
        $request->validate([
            'sucursal_id' => 'nullable|exists:sucursales,id_sucursal',
        ]);

        $warehouse = Warehouse::find($id);

        if (!$warehouse) {
            return response()->json([
                'success' => false,
                'message' => 'Warehouse no encontrado',
            ], 404);
        }

        if ($request->filled('sucursal_id')) {
            $sucursalAsignada = Warehouse::where('sucursal_id', $request->sucursal_id)
                ->where('id', '!=', $id) 
                ->exists();

            if ($sucursalAsignada) {
                return response()->json([
                    'success' => false,
                    'message' => 'La sucursal ya está asignada a otra bodega',
                    'warehouse_id_conflict' => $id
                ], 409); 
            }
        }

        $warehouse->sucursal_id = $request->sucursal_id;
        $warehouse->save();

        return response()->json([
            'success' => true,
            'message' => 'Sucursal actualizada correctamente',
            'data' => $warehouse,
        ]);
    }
}
