<?php

namespace App\Http\Controllers\API\whatsapp;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class WhatsappApiController extends Controller
{
    public function getWhatsAppLink(Request $request)
    {
        // Validar la entrada
        $validated = $request->validate([
            'phone' => 'required|regex:/^[0-9]{10,15}$/',
            'message' => 'nullable|string|max:1000',
        ]);

        $phone = $validated['phone'];
        $message = isset($validated['message']) ? urlencode($validated['message']) : '';

        // Generar el enlace
        $whatsappLink = "https://wa.me/{$phone}?text={$message}";

        return response()->json([
            'success' => true,
            'link' => $whatsappLink,
        ]);
    }   
}
