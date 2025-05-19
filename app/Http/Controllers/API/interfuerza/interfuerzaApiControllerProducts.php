<?php

namespace App\Http\Controllers\API\interfuerza;

use App\Http\Controllers\Controller;
use App\Models\ProductInterfuerza;
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
      'data' => $data['products'] ?? [],
      'filters' => $payload,
      'meta' => [
        'page' => $page,
        'per_page' => count($data['products'] ?? []),
        'total' => $data['count'] ?? null
      ]
    ]);
  }

  public function verifyProduct(Request $request)
  {
    $codigo = $request->input('codigo');

    if (!$codigo) {
      return response()->json(['error' => 'codigo number is required'], 400);
    }

    try {
      $response = $this->interfuerza->request([
        'class' => 'GET',
        'action' => 'products',
        "id" =>  $codigo
      ]);

      $dataInterfuerza = $response->json();
      $existsInInterfuerza = !empty($dataInterfuerza['products']);

      $existsInLocal = ProductInterfuerza::where('codigo', $codigo)->exists();
      if ($existsInInterfuerza && $existsInLocal) {
        $message = "El producto existe tanto en Interfuerza como en el sistema local.";
      } elseif ($existsInInterfuerza && !$existsInLocal) {
        $message = "El producto existe en Interfuerza pero NO en el sistema local.";
      } elseif (!$existsInInterfuerza && $existsInLocal) {
        $message = "El producto existe en el sistema local pero NO en Interfuerza.";
      } else {
        $message = "El producto NO existe ni en Interfuerza ni en el sistema local.";
      }

      return response()->json([
        'success' => true,
        'exists_in_interfuerza' => $existsInInterfuerza,
        'exists_in_local' => $existsInLocal,
        'message' => $message,
        'product_interfuerza' => $dataInterfuerza['products'][0] ?? null, 
      ]);
    } catch (\Exception $e) {
      return response()->json(['error' => $e->getMessage()], 500);
    }
  }
}
