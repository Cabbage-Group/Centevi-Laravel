<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class InterfuerzaCreateService
{
    protected $baseUrl = 'https://app.interfuerza.com/api/v4/';
    protected $token = 'bcf0466ee568b7825422e792b62d825f-qgfd-ueibyzke';

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
