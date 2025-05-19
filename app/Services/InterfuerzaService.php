<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class InterfuerzaService
{
    protected $baseUrl = 'https://app.interfuerza.com/api/';
    protected $token = 'bcf0466ee568b7825422e792b62d825f';

    public function request($payload)
    {
        return Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-IFX-Token' => $this->token,
        ])->post($this->baseUrl, $payload);
    }
}




