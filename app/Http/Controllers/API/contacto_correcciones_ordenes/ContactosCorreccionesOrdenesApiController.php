<?php

namespace App\Http\Controllers\API\contacto_correcciones_ordenes;

use App\Http\Controllers\Controller;
use App\Models\ContactoCorrecionesOrdenes;
use Illuminate\Http\Request;

class ContactosCorreccionesOrdenesApiController extends Controller
{
    public function index()
    {
        $contactosCorreccionesOrdenes = ContactoCorrecionesOrdenes::all();
        return response()->json([
        'success' => true,
        'data' => $contactosCorreccionesOrdenes,
        ]);
    }

    public function store(Request $request)
  {
    $validatedData = $request->validate([
      'correccion_ordenes_id' => 'required|exists:correciones_ordenes,id',
      'tipo_fase_cr_orden_id' => 'required|exists:tipos_fases_ordenes,id',
      'usuario_id' => 'required|exists:usuarios,id_usuario',
    ]);

    $validatedData['cantidad'] = 1;
    $contactoCorreccionOrden = ContactoCorrecionesOrdenes::create($validatedData);

    return response()->json([
      'success' => true,
      'message' => 'Contacto de correccion orden creado exitosamente.',
      'data' => $contactoCorreccionOrden,
    ], 201);
  }

}
