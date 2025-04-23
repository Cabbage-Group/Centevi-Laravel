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
}
