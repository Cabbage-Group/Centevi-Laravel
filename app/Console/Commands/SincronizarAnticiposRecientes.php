<?php

namespace App\Console\Commands;

use App\Services\AnticiposSyncService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SincronizarAnticiposRecientes extends Command
{
    protected $signature = 'anticipos:sincronizar-recientes';
    protected $description = 'Sincroniza los anticipos de hoy y ayer desde Interfuerza';

    public function handle(AnticiposSyncService $sync)
    {
        try {
            $resultado = $sync->sincronizarRecientes();
            $this->info("Sincronización OK: {$resultado['migrados']} anticipos, páginas: " . implode(',', $resultado['paginas_revisadas']));
        } catch (\Exception $e) {
            $this->error('Error: ' . $e->getMessage());
            Log::error('Fallo sincronización de anticipos Interfuerza', ['error' => $e->getMessage()]);
        }
    }
}