<?php

namespace App\Console\Commands;

use App\Services\PacienteFusionService;
use Illuminate\Console\Command;
use Throwable;

class FusionarPacientes extends Command
{
  protected $signature = 'pacientes:fusionar
                          {principal : id_paciente que se conserva}
                          {duplicado : id_paciente que se absorbe y elimina}
                          {--ejecutar : Aplica los cambios (sin esta opción solo simula)}
                          {--ignorar-codigo : Fusiona aunque ambos tengan códigos de Interfuerza distintos}
                          {--usuario=consola : Quién realiza la fusión (queda en el log)}';

  protected $description = 'Fusiona dos pacientes duplicados moviendo todo su historial al principal';

  public function handle(PacienteFusionService $servicio): int
  {
    $principal = (int) $this->argument('principal');
    $duplicado = (int) $this->argument('duplicado');
    $ejecutar = (bool) $this->option('ejecutar');
    $ignorarCodigo = (bool) $this->option('ignorar-codigo');

    try {
      $resultado = $ejecutar
        ? $servicio->fusionar($principal, $duplicado, $this->option('usuario'), true, $ignorarCodigo)
        : $servicio->simular($principal, $duplicado, $ignorarCodigo);
    } catch (Throwable $e) {
      $this->error($e->getMessage());
      return self::FAILURE;
    }

    $this->line($ejecutar ? '<info>FUSIÓN APLICADA</info>' : '<comment>SIMULACIÓN (no se guardó nada). Agregue --ejecutar para aplicar.</comment>');
    $this->line("Paciente {$duplicado} → {$principal}");
    $this->table(['Tabla', 'Filas movidas'], collect($resultado['movidos'])->map(fn($n, $t) => [$t, $n])->values());
    $this->line('Resultado: ' . json_encode($resultado['principal'], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE));
    $this->line('Referencias del principal: ' . json_encode($resultado['referencias_finales']));
    foreach ($resultado['advertencias'] as $advertencia) {
      $this->warn($advertencia);
    }

    return self::SUCCESS;
  }
}
