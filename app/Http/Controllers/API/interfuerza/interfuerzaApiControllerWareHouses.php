<?php

namespace App\Http\Controllers\API\interfuerza;

use App\Http\Controllers\Controller;
use App\Services\InterfuerzaService;
use Illuminate\Http\Request;

class interfuerzaApiControllerWareHouses extends Controller
{
    protected $interfuerza;

    public function __construct(InterfuerzaService $interfuerza)
    {
        $this->interfuerza = $interfuerza;
    }

    public function getWareHouses()
    {
   
        $payload = [
            "class" => "GET",
            "action" => "warehouses"
        ];

        $response = $this->interfuerza->request($payload);
        $data = $response->json();

        return response()->json([
            'success' => $response->successful(),
            'data' => $data['warehouses'] ?? []
        ]);
    }
}
