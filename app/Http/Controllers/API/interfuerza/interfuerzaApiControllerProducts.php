<?php

namespace App\Http\Controllers\API\interfuerza;

use App\Http\Controllers\Controller;
use App\Services\InterfuerzaService;
use Illuminate\Http\Request;

class interfuerzaApiControllerProducts extends Controller
{
    protected $interfuerza;

    public function __construct(InterfuerzaService $interfuerza)
    {
        $this->interfuerza = $interfuerza;
    }

    public function getProducts(Request $request)
    {
        $page = $request->query('page', 1);
        $field = $request->query('field');
        $operator = $request->query('operator');
        $value = $request->query('value');

        $allowedFields = [
            "UPC_Code",
            "Item_Number",
            "Type",
            "Nombre",
            "Category_L1",
            "Category_L2",
            "Category_L3",
            "Marca",
            "Proveedor_Principal",
            "Peso",
            "Precio_Venta",
            "Matrix",
            "Matrix_Parent",
            "Matrix_Child"
        ];

        $filters = [];

        if ($field && in_array($field, $allowedFields) && $operator && $value) {
            $filters[] = [
                "field" => $field,
                "type" => $operator,
                "value" => $operator === 'like' ? "%$value%" : $value
            ];
        }

        $payload = [
            "class" => "GET",
            "action" => "products",
            "page" => $page,
            "filters" => $filters
        ];

        $response = $this->interfuerza->request($payload);
        $data = $response->json();

        return response()->json([
            'success' => $response->successful(),
            'data' =>  $data['products'] ?? [],
            'filters' => $payload,
            'meta' => [
                'page' => $page,
                'per_page' => count($data['products'] ?? []),
                'total' => $data['total'] ?? null
            ]
        ]);
    }
}
