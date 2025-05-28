<?php

namespace App\Http\Controllers\API\interfuerza;

use App\Http\Controllers\Controller;
use App\Services\InterfuerzaService;
use Illuminate\Http\Request;
use Whoops\Run;

class interfuerzaApiControllerQuotes extends Controller
{
  protected $interfuerza;

  public function __construct(InterfuerzaService $interfuerza)
  {
    $this->interfuerza = $interfuerza;
  }

  public function createQuote(Request $request)
  {
    $payload = [
      "class" => "PUT",
      "action" => "quotes",
      "data" => $request->all()
    ];

    $response = $this->interfuerza->request($payload);

    return response()->json([
      'success' => $response->successful(),
      'data' => $response->json()
    ], $response->status());
  }

  public function findQuoteById(Request $request)
  {
    $targetId = $request->input('id');

    if (!$targetId) {
      return response()->json([
        'success' => false,
        'message' => 'El parámetro "id" es obligatorio.'
      ], 400);
    }

    $initialPayload = array_merge(
      [
        "class" => "GET",
        "action" => "quotes",
        "page" => 1
      ],
      $request->except('id')
    );

    $initialResponse = $this->interfuerza->request($initialPayload);

    if (!$initialResponse->successful()) {
      return response()->json([
        'success' => false,
        'message' => 'Error al obtener el total de cotizaciones',
        'details' => $initialResponse->json(),
      ], $initialResponse->status());
    }

    $count = $initialResponse['count'] ?? 0;


    $perPage = 25;


    $totalPages = ($perPage > 0) ? (int) ceil($count / $perPage) : 1;
    echo "Página actual: $totalPages<br>";
    $foundItem = null;
    $page = $totalPages;

    echo "Página actual: $count<br>";

    do {
      $payload = array_merge(
        [
          "class" => "GET",
          "action" => "quotes",
        ],
        $request->except('id'),
        ['page' => $page]
      );



      $response = $this->interfuerza->request($payload);

      // dd($response->json());

      if (!$response->successful()) {
        return response()->json([
          'success' => false,
          'message' => 'Error al consultar la API externa',
          'details' => $response->json(),
        ], $response->status());
      }

      $quotes = $response->json()['quotes'] ?? [];



      $foundItem = collect($quotes)->first(function ($quoteItem) use ($targetId) {
        return $quoteItem['Quote']['id'] === $targetId;
      });

      // dd($foundItem);
      // dd("Page actual: $page", "Cantidad de resultados: " . count($quotes), $foundItem);
      echo "Página actual: $page<br>";

      $page--;
    } while (empty($foundItem));

    if ($foundItem) {
      return response()->json([
        'success' => true,
        'data' => $foundItem
      ]);
    }

    return response()->json([
      'success' => false,
      'message' => 'No se encontró la cotización con el ID proporcionado.'
    ], 404);
  }
}
