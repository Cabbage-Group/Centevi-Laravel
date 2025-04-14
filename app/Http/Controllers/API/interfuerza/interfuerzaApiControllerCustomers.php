<?php

namespace App\Http\Controllers\API\interfuerza;

use App\Http\Controllers\Controller;
use App\Services\InterfuerzaService;
use Illuminate\Http\Request;

class interfuerzaApiControllerCustomers extends Controller
{
    protected $interfuerza;

    public function __construct(InterfuerzaService $interfuerza)
    {
        $this->interfuerza = $interfuerza;
    }

    public function getCustomers(Request $request)
    {
        $page = $request->query('page', 1);
        $field = $request->query('field');
        $operator = $request->query('operator');
        $value = $request->query('value');

        $allowedFields = [
            "Token",
            "Tipo",
            "RUC",
            "DV",
            "Contacto",
            "Nombre",
            "Email",
            "Marca",
            "Status",
            "Telefono_1",
            "Telefono_2",
            "Cellular",
            "Ciudad",
            "Estado",
            "Pais",
            "Vendedor",
            "Tipo_Contribuyente",
            "Clase"
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
            "action" => "customers",
            "page" => $page,
            "filters" => $filters
        ];

        $response = $this->interfuerza->request($payload);
        $data = $response->json();

        return response()->json([
            'success' => $response->successful(),
            'data' => $data['customers'] ?? [],
            'meta' => [
                'page' => $page,
                'per_page' => count($data['customers'] ?? []),
                'total' => $data['total'] ?? null
            ]
        ]);
    }
}
