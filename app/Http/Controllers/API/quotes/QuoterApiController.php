<?php

namespace App\Http\Controllers\API\quotes;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Exception;

class QuoterApiController extends Controller
{
  public function obtenerQuotes(Request $request)
  {
    $sortColumn = $request->input('sortColumn', 'created_at');
    $sortOrder = $request->input('sortOrder', 'asc');
    $page = $request->input('page', 1);
    $limit = $request->input('limit', 10);
    $searchTerm = $request->input('searchTerm', '');

    if (!in_array($sortOrder, ['asc', 'desc'])) {
      $sortOrder = 'asc';
    }

    $query = Quote::with(['lines', 'paciente'])
      ->orderBy($sortColumn, $sortOrder);

    if ($searchTerm) {
      if (in_array(strtolower($searchTerm), ['verificado', 'sin verificar', 'no creado'])) {
        $estado = null;

        if (strtolower($searchTerm) === 'verificado') {
          $estado = 1;
        } elseif (strtolower($searchTerm) === 'sin verificar') {
          $estado = null;
        } elseif (strtolower($searchTerm) === 'no creado') {
          $estado = 0;
        }

        $query->where('estado', $estado);
      } else {
        $query->where(function ($q) use ($searchTerm) {
          $q->where('Cliente', 'LIKE', "%$searchTerm%")
            ->orWhere('id', 'LIKE', "%$searchTerm%")
            ->orWhere('Bodega', 'LIKE', "%$searchTerm%")
            ->orWhere('Status', 'LIKE', "%$searchTerm%")
            ->orWhere('Total', 'LIKE', "%$searchTerm%")
            ->orWhere('Reservar_Productos', 'LIKE', "%$searchTerm%")
            ->orWhere('Vendedor', 'LIKE', "%$searchTerm%")
            ->orWhere('codigo_interfuerza', 'LIKE', "%$searchTerm%")
            ->orWhere('estado', 'LIKE', "%$searchTerm%");
        });
      }
    }

    $quotes = $query->paginate($limit, ['*'], 'page', $page);

    return response()->json([
      'data' => $quotes->items(),
      'meta' => [
        'total' => $quotes->total(),
        'limit' => $quotes->perPage(),
        'page' => $quotes->currentPage(),
        'last_page' => $quotes->lastPage(),
      ]
    ]);
  }

  public function verUnaCotizacion($id)
  {
    $quote = Quote::with('lines')->findOrFail($id);
    return response()->json($quote);
  }

  public function crearQoute(Request $request)
  {
    try {
      $data = $request->validate([
        'Cliente' => [
          'required',
          'string',
          Rule::exists('pacientes', 'codigo')
        ],
        'Bodega' => 'required|string',
        'Status' => 'nullable|string',
        'Date' => 'nullable|date',
        'Expira' => 'nullable|date',
        'Comentario' => 'nullable|string',
        'SubTotal' => 'nullable|numeric',
        'Discount' => 'nullable|numeric',
        'Taxes' => 'nullable|numeric',
        'Total' => 'nullable|numeric',
        'Reservar_Productos' => 'nullable|string',
        'Type' => 'nullable|string',
        'Vendedor' => 'nullable|string',
        'Currency' => 'nullable|string',
        'Currency_Rate' => 'nullable|numeric',
        'extraData' => 'nullable|string',
        'Lines' => 'nullable|array'
      ]);

      $quote = Quote::create($data);

      foreach ($data['Lines'] as $index => $line) {
        if (!is_array($line)) {
          return response()->json([
            'message' => "Invalid line format at index $index",
            'line' => $line
          ], 422);
        }

        $quote->lines()->create($line);
      }

      return response()->json([
        'message' => 'Quote created successfully',
        'quote' => $quote->load('lines')
      ], 201);
    } catch (ValidationException $e) {
      return response()->json([
        'message' => 'Validation failed',
        'errors' => $e->errors()
      ], 422);
    } catch (QueryException $e) {
      Log::error('Database error on quote creation', ['error' => $e->getMessage()]);
      return response()->json([
        'message' => 'Database error while creating quote',
        'error' => $e->getMessage()
      ], 500);
    } catch (Exception $e) {
      Log::error('Unexpected error on quote creation', ['error' => $e->getMessage()]);
      return response()->json([
        'message' => 'Unexpected error occurred',
        'error' => $e->getMessage()
      ], 500);
    }
  }


  public function updateEstadoInterfuerza(Request $request, $id)
  {
    $quote = Quote::findOrFail($id);

    $data = $request->validate([
      'estado' => 'nullable|integer',
      'codigo_interfuerza' => 'nullable|string'
    ]);

    if (isset($data['estado'])) {
      $quote->estado = $data['estado'];
    }

    if (isset($data['codigo_interfuerza'])) {
      $quote->codigo_interfuerza = $data['codigo_interfuerza'];
    }

    $quote->save();
    return response()->json([
      'message' => 'Estado y código Interfuerza actualizados correctamente',
      'quote' => $quote->only(['id', 'estado', 'codigo_interfuerza'])
    ]);
  }


  public function destroy($id)
  {
    $quote = Quote::findOrFail($id);
    $quote->lines()->delete();
    $quote->delete();

    return response()->json(['message' => 'Quote deleted']);
  }

  public function verifyQuoteInterfuerza(){
    
  }
}
