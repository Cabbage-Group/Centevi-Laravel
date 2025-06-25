<?php

namespace App\Http\Controllers\API\interfuerza;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use App\Models\QuoteLine;
use App\Services\InterfuerzaService;
use Illuminate\Http\Request;
use Whoops\Run;
use Illuminate\Support\Facades\DB;

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


  public function findQuotesByIds(Request $request)
  {
    $targetIds = $request->input('ids');

    if (!is_array($targetIds) || empty($targetIds)) {
      return response()->json([
        'success' => false,
        'message' => 'El parámetro "ids" debe ser un array no vacío.'
      ], 400);
    }

    $initialPayload = array_merge(
      [
        "class" => "GET",
        "action" => "quotes",
        "page" => 1
      ],
      $request->except('ids')
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

    $page = $totalPages;
    $foundCount = 0;
    $cutoffDate = now()->subMonths(3)->startOfDay();
    $foundIds = [];

    do {
      $payload = array_merge(
        [
          "class" => "GET",
          "action" => "quotes",
          "page" => $page
        ],
        $request->except('ids')
      );

      $response = $this->interfuerza->request($payload);

      if (!$response->successful()) {
        return response()->json([
          'success' => false,
          'message' => 'Error al consultar la API externa',
          'details' => $response->json(),
        ], $response->status());
      }

      $quotes = $response->json()['quotes'] ?? [];

      foreach ($quotes as $quoteItem) {
        $quote = $quoteItem['Quote'] ?? null;
        $lines = $quoteItem['Lines'] ?? [];

        if (!$quote) continue;

        $quoteId = $quote['id'] ?? null;
        $quoteDate = $quote['Date'] ?? null;

        if ($quoteDate && \Carbon\Carbon::parse($quoteDate)->lt($cutoffDate)) {
          break 2;
        }

        if (in_array($quoteId, $targetIds) && !in_array($quoteId, $foundIds)) {
          try {
            // Suponiendo que tu campo en base de datos que guarda el ID externo es 'interfuerza_id'
            $localQuote = Quote::where('codigo_interfuerza', $quoteId)->first();

            if ($localQuote) {
              $localQuote->update([
                // 'date' => $quote['Date'] ?? $localQuote->date,
                'Cliente' => $quote['Cliente'] ?? $localQuote->Cliente,
               
                'Bodega' => $quote['Bodega'] ?? $localQuote->Bodega,
                'Status' => $quote['Status'] ?? $localQuote->Status,
                'Comentario' => $quote['Comentario'] ?? $localQuote->Comentario,
                'SubTotal' => $quote['SubTotal'] ?? $localQuote->SubTotal,
                'Discount' => $quote['Discount'] ?? $localQuote->Discount,
                'Taxes' => $quote['Taxes'] ?? $localQuote->Taxes,
                'Reservar_Productos' => $quote['Reservar_Productos'] ?? $localQuote->Reservar_Productos,
                'Type' => $quote['Type'] ?? $localQuote->Type,
                'Vendedor' => $quote['Vendedor'] ?? $localQuote->Vendedor,
                'Currency' => $quote['Currency'] ?? $localQuote->Currency,
                'Currency_Rate' => $quote['Currency_Rate'] ?? $localQuote->Currency_Rate,
                'codigo_interfuerza' => $quote['id'] ?? $localQuote->codigo_interfuerza,
                
                // 'total_amount' => $quote['TotalAmount'] ?? $localQuote->total_amount,
                // 'status' => $quote['Status'] ?? $localQuote->status,
                // Agrega aquí más campos según tu estructura de base de datos
              ]);
            }

            QuoteLine::where('quote_id', $localQuote->id)->delete();

            foreach ($lines as $line) {
              QuoteLine::create([
                'quote_id' => $localQuote->id,
                'Codigo' => $line['Codigo'] ?? null,
                'Descripcion' => $line['Descripcion'] ?? null,
                'Item_Number' => $line['Item_Number'] ?? null,
                'Nombre' => $line['Nombre'] ?? null,
                'Marca' => $line['Marca'] ?? null,
                'Category_L1' => $line['Category_L1'] ?? null,
                'Category_L2' => $line['Category_L2'] ?? null,
                'Category_L3' => $line['Category_L3'] ?? null,
                'Unidades' => $line['Unidades'] ?? null,
                'Precio_Unitario' => $line['Precio_Unitario'] ?? null,
                'Discount' => $line['Discount'] ?? null,
                'DiscountFactor' => $line['DiscountFactor'] ?? null,
                'TaxID' => $line['TaxID'] ?? null,
                'TaxName' => $line['TaxName'] ?? null,
                'TaxFactor' => $line['TaxFactor'] ?? null,
                'TaxValue' => $line['TaxValue'] ?? null,
                'Total' => $line['Total'] ?? null,
              ]);
            }

            DB::commit();
            $foundCount++;
            $foundIds[] = $quoteId;

            if ($foundCount >= count($targetIds)) {
              break 2;
            }
          } catch (\Exception $e) {
            ("Error actualizando cotización $quoteId: " . $e->getMessage());
          }
        }
      }

      $page--;
    } while ($page > 0);

    return response()->json([
      'success' => true,
      'updated_count' => $foundCount,
      'updated_ids' => $foundIds
    ]);
  }
}
