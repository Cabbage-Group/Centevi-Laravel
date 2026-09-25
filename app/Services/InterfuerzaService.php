<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class InterfuerzaService
{
    public const V4_URL = 'https://app.interfuerza.com/api/v4/';
    public const V4_TOKEN = 'bcf0466ee568b7825422e792b62d825f-qgfd-ueibyzke';

    protected $baseUrl = 'https://app.interfuerza.com/api/';
    protected $token = 'bcf0466ee568b7825422e792b62d825f';

    public function withConfig(string $baseUrl, string $token): self
    {
        $clone = clone $this;
        $clone->baseUrl = $baseUrl;
        $clone->token = $token;
        return $clone;
    }

    public function request($payload)
    {
        return Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-IFX-Token' => $this->token,
        ])->post($this->baseUrl, $payload);
    }
}




