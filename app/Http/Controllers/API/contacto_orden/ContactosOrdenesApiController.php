<?php

namespace App\Http\Controllers\API\contacto_orden;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContactoOrden;

class ContactosOrdenesApiController extends Controller
{
    public function index()
    {
        $contactosOrdenes = ContactoOrden::all();
        return response()->json([
            'success' => true,
            'data' => $contactosOrdenes,
        ]);
    }

    public function store(Request $request)
{
    $validatedData = $request->validate([
        'ordenes_id' => 'required|exists:ordenes,id_orden',
        'fase_orden_id' => 'required|exists:fases_ordenes,id',
        'usuario_id' => 'required|exists:usuarios,id_usuario',
    ]);

    $validatedData['cantidad'] = 1; 
    $contactoOrden = ContactoOrden::create($validatedData);

    return response()->json([
        'success' => true,
        'message' => 'Contacto de orden creado exitosamente.',
        'data' => $contactoOrden,
    ], 201);
}
}
