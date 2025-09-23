<?php

namespace App\Http\Controllers\API\quotes_timelines;

use App\Http\Controllers\Controller;
use App\Models\QuoteTimeline;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class QuoteTimelineApiController extends Controller{
  public function getAllQuoteTimelinesByQuoteId($quoteId)
  {
    // $quoteTimelines = QuoteTimeline::with(['quote', 'usuario'])
    $quoteTimelines = QuoteTimeline::where('quote_id', $quoteId)
      ->orderBy('occurred_at', 'desc')
      ->get();

    return response()->json(['data' => $quoteTimelines]);
  }

  public function createQuoteTimeline(Request $request){
    try {
      $data = $request->validate([
        'quote_id' => [
          'required',
          'integer',
          Rule::exists('quotes', 'id')
        ],
        'usuario_id' => [
          'required',
          'integer',
          Rule::exists('usuarios', 'id_usuario')
        ],
        'context_title' => 'required|string',
        'details' => 'nullable|string',
        'communication_channel' => 'required|string',
        'communication_info' => 'nullable|string',
        'occurred_at' => 'required|string',
      ]);

      $quoteTimeline = QuoteTimeline::create($data);
      return response()->json([
        'message' => 'Quote created successfully',
        'quote_timeline' => $quoteTimeline,
      ], 201);

    } catch (ValidationException $e) {
      return response()->json([
        'message' => 'Validation failed',
        'errors' => $e->errors()
      ], 422);

    } catch (QueryException $e) {
      Log::error(
        'Database error on quote_timeline creation',
        ['error' => $e->getMessage()]
      );
      return response()->json([
        'message' => 'Database error while creating quote_line',
        'error' => $e->getMessage()
      ], 500);

    } catch (Exception $e) {
      Log::error('Unexpected error on quote_timeline creation', ['error' => $e->getMessage()]);
      return response()->json([
        'message' => 'Unexpected error occurred',
        'error' => $e->getMessage()
      ], 500);
    }
  }

  public function updateQuoteTimeline(Request $request, $id)
  {
    try {
      $quoteTimeline = QuoteTimeline::findOrFail($id);

      $data = $request->validate([
          'quote_id' => ['required', 'integer', Rule::exists('quotes', 'id')],
          'usuario_id' => ['nullable', 'integer', Rule::exists('usuarios', 'id_usuario')],
          'context_title' => ['required', 'string', 'max:255'],
          'details' => ['nullable', 'string'],
          'communication_channel' => ['required', Rule::in(['whatsapp','phone','email','presential','other'])],
          'communication_info' => ['nullable', 'string', 'max:255'],
          'occurred_at' => ['nullable', 'date'],
      ]);

      $quoteTimeline->update($data);

      // recarga para devolver el modelo con relaciones si quieres
      $quoteTimeline->load(['quote', 'usuario']);

      return response()->json([
          'message' => 'Quote timeline updated successfully',
          'quote_timeline' => $quoteTimeline,
      ], 200);

    } catch (ValidationException $e) {
      return response()->json([
          'message' => 'Validation failed',
          'errors' => $e->errors()
      ], 422);

    } catch (QueryException $e) {
      Log::error('Database error on quote_timeline update', ['error' => $e->getMessage()]);
      return response()->json([
          'message' => 'Database error while updating quote_timeline',
          'error' => $e->getMessage()
      ], 500);

    } catch (Exception $e) {
      Log::error('Unexpected error on quote_timeline update', ['error' => $e->getMessage()]);
      return response()->json([
          'message' => 'Unexpected error occurred',
          'error' => $e->getMessage()
      ], 500);
    }
  }

  public function destroyQuoteTimeline($id){
    $quoteTimeline = QuoteTimeline::findOrFail($id);
    $quoteTimeline->delete();
    return response()->json(['message' => 'quote_timeline deleted'], 200);
  }
}