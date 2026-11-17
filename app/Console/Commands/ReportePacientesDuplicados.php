<?php

namespace App\Console\Commands;

use App\Models\Pacientes;
use App\Services\PacienteFusionService;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class ReportePacientesDuplicados extends Command
{
  protected $signature = 'pacientes:duplicados
                          {--csv= : Ruta donde guardar el reporte en CSV}
                          {--incluir-genericas : Incluye cédulas de relleno como 0000000}';

  protected $description = 'Lista los pacientes con cédula repetida, clasificados y con la fusión sugerida';

  public function handle(PacienteFusionService $servicio): int
  {
    $claves = Pacientes::query()
      ->selectRaw("REPLACE(TRIM(nro_cedula), ' ', '') AS clave")
      ->whereRaw("TRIM(nro_cedula) <> ''")
      ->groupBy('clave')
      ->havingRaw('COUNT(*) > 1')
      ->pluck('clave');

    $filas = [];
    $resumen = [];

    foreach ($claves as $clave) {
      if (!$this->option('incluir-genericas') && !Pacientes::esCedulaReal($clave)) {
        continue;
      }

      $pacientes = Pacientes::conCedula($clave)->orderBy('id_paciente')->get();
      $info = $pacientes->map(function ($p) use ($servicio) {
        $refs = $servicio->contarReferencias($p->id_paciente);
        $historial = collect(PacienteFusionService::HISTORIAL)->sum(fn($t) => $refs[$t] ?? 0);
        return [
          'p' => $p,
          'citas' => $refs['citas'] ?? 0,
          'historial' => $historial,
          'tiene_codigo' => trim((string) $p->codigo) !== '',
          'nombre' => $this->normalizarNombre($p->nombres . ' ' . $p->apellidos),
        ];
      });

      $tipo = $this->clasificar($info);
      $resumen[$tipo] = ($resumen[$tipo] ?? 0) + 1;

      // Principal sugerido: más historial, activo, con código, más antiguo
      $principal = $info->sortBy([
        fn($a, $b) => $b['historial'] <=> $a['historial'],
        fn($a, $b) => $b['p']->estado <=> $a['p']->estado,
        fn($a, $b) => $b['tiene_codigo'] <=> $a['tiene_codigo'],
        fn($a, $b) => $a['p']->id_paciente <=> $b['p']->id_paciente,
      ])->first();

      $codigos = $info->filter(fn($i) => $i['tiene_codigo'])->map(fn($i) => trim($i['p']->codigo))->unique();

      foreach ($info as $i) {
        $p = $i['p'];
        $esPrincipal = $p->id_paciente === $principal['p']->id_paciente;
        $comando = '';
        if (!$esPrincipal && $tipo !== 'REVISAR_PERSONAS_DISTINTAS') {
          $comando = "php artisan pacientes:fusionar {$principal['p']->id_paciente} {$p->id_paciente}"
            . ($codigos->count() > 1 ? ' --ignorar-codigo' : '');
        }
        $filas[] = [
          $clave, $tipo, $p->id_paciente,
          Str::limit(trim($p->nombres . ' ' . $p->apellidos), 40),
          $p->estado ? 1 : 0, $p->codigo, $i['citas'], $i['historial'],
          $esPrincipal ? 'PRINCIPAL' : '', $comando,
        ];
      }
    }

    $cabecera = ['Cédula', 'Tipo', 'ID', 'Nombre', 'Estado', 'Código IF', 'Citas', 'Historial', 'Sugerido', 'Comando'];
    $this->table($cabecera, $filas);

    $this->newLine();
    $this->info('Resumen por tipo (grupos):');
    foreach ($resumen as $tipo => $n) {
      $this->line("  {$tipo}: {$n}");
    }

    if ($ruta = $this->option('csv')) {
      $f = fopen($ruta, 'w');
      fwrite($f, "\xEF\xBB\xBF");
      fputcsv($f, $cabecera);
      foreach ($filas as $fila) {
        fputcsv($f, $fila);
      }
      fclose($f);
      $this->info("CSV guardado en {$ruta}");
    }

    return self::SUCCESS;
  }

  private function clasificar($info): string
  {
    $nombres = $info->pluck('nombre');
    $base = $nombres->first();
    $mismoNombre = $nombres->every(fn($n) => $this->mismaPersona($base, $n));

    if (!$mismoNombre) {
      return 'REVISAR_PERSONAS_DISTINTAS';
    }
    if ($info->contains(fn($i) => !$i['p']->estado) && $info->contains(fn($i) => $i['p']->estado)) {
      return 'PREREGISTRO_AGENDA';
    }
    return 'MISMA_PERSONA';
  }

  /** Cada palabra del nombre más corto aparece (con hasta 1-2 letras de diferencia) en el más largo. */
  private function mismaPersona(string $a, string $b): bool
  {
    $sinEspacios = fn($s) => str_replace(' ', '', $s);
    if (levenshtein($sinEspacios($a), $sinEspacios($b)) <= 2) {
      return true;
    }

    $ta = array_filter(explode(' ', $a));
    $tb = array_filter(explode(' ', $b));
    [$corto, $largo] = count($ta) <= count($tb) ? [$ta, $tb] : [$tb, $ta];
    if (!$corto) {
      return false;
    }

    foreach ($corto as $palabra) {
      $tolerancia = strlen($palabra) >= 6 ? 2 : 1;
      $encontrada = false;
      foreach ($largo as $otra) {
        if (levenshtein($palabra, $otra) <= $tolerancia) {
          $encontrada = true;
          break;
        }
      }
      if (!$encontrada) {
        return false;
      }
    }
    return true;
  }

  private function normalizarNombre(string $nombre): string
  {
    $nombre = Str::ascii(mb_strtolower($nombre));
    $nombre = preg_replace('/[^a-z ]/', '', $nombre);
    return trim(preg_replace('/\s+/', ' ', $nombre));
  }
}
