<?php

namespace App\Http\Controllers\API\quotes;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use App\Models\Ordenes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\View;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Usuarios;
use App\Models\Sucursales;

class QuotePdfController extends Controller
{
  public function verCotizacionPdf($id_cotizacion)
  {
    $quote = Quote::with(['lines', 'paciente'])
      ->where('id', $id_cotizacion)
      ->first();

    if (!$quote) {
      return response()->json(['error' => 'Cotización no encontrada'], 404);
    }
    $sucursal = null;
    if ($quote->Vendedor) {
      // $usuario = Usuarios::find($quote->Vendedor);
      $usuario = Usuarios::where('nombre',$quote->Vendedor)->first();
      if ($usuario && $usuario->sucursal) {
        $sucursal = Sucursales::find($usuario->sucursal);
      }

      $quoteDetails = [
        'id' => $quote->id,
        'Cliente' => $quote->Cliente,
        'Type' => $quote->Type,
        'Date' => $quote->Date,
        'Expira' => $quote->Expira,
        'Bodega' => $quote->Bodega,
        'Vendedor' => $quote->Vendedor,
        'Contacto' => $quote->Contacto,
        'Comentario' => $quote->Comentario,
        'SubTotal' => $quote->SubTotal,
        'Discount' => $quote->Discount,
        'Otros' => $quote->Otros ?? 0.00,
        'Taxes' => $quote->Taxes,
        'Total' => $quote->Total,
        'Abono' => $quote->Abono ?? 0.00,
        'SaldoPendiente' => ($quote->Total ?? 0.00) - ($quote->Abono ?? 0.00),
        'lines' => $quote->lines,

        'paciente' => $quote->paciente,
        'sucursal' => $sucursal,

        'Direccion' => $quote->extraData['direccion'] ?? null,
        'Telefono' => $quote->extraData['telefono'] ?? null,
        'Celular' => $quote->extraData['celular'] ?? null,
      ];

      $pdf = Pdf::loadView('pdf/cotizacionPdf', compact('quoteDetails'));

      return $pdf->stream("cotizacion_{$id_cotizacion}.pdf");
    }
  }
}
