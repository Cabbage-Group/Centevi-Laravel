<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use App\Services\InterfuerzaCreateService;
use Illuminate\Http\Request;

class InterfuerzaQuotesCreator
{
    protected $createQuoteService;

    public function __construct(InterfuerzaCreateService $createQuoteService)
    {
        $this->createQuoteService = $createQuoteService;
    }

    public function crearQuotesInterfuerza(Request $request)
    {
        $payload = [
            'class' => 'PUT',
            'action' => 'quotes',
            'data' => $request->all()
        ];

        $payload = null;

        try {
            return $this->createQuoteService->request($payload);
        } catch (\Exception $e) {
            Log::error('Error creando QUOTE en Interfuerza', ['error' => $e->getMessage()]);
            return null;
        }
    }
}
