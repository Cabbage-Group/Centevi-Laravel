<?php

namespace App\Services;

use App\Models\Pacientes;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use RuntimeException;

/**
 * Fusiona dos registros de paciente: mueve todas las referencias del duplicado
 * al principal, completa datos vacíos, conserva el código de Interfuerza,
 * deja un registro en `pacientes_fusiones` y elimina el duplicado.
 */
class PacienteFusionService
{
  /**
   * Tablas que referencian a pacientes.id_paciente (no hay FKs declaradas).
   * tabla => columna
   */
  public const REFERENCIAS = [
    'citas' => 'paciente_id',
    'consultagenerica' => 'paciente',
    'refracciongeneral' => 'paciente',
    'historia_clinica' => 'paciente',
    'baja_vision' => 'paciente',
    'optometria_neonatos' => 'paciente',
    'optometria_pediatrica' => 'paciente',
    'ortoptica_adultos' => 'paciente',
    'terapias_bajav' => 'id_paciente',
    'terapias_optometria_neonatos' => 'id_paciente',
    'terapias_optometria_pediatrica' => 'id_paciente',
    'terapias_ortoptica_adultos' => 'id_paciente',
    'ordenes' => 'id_paciente',
    'receta' => 'id_paciente',
    'anticipos' => 'id_paciente',
    'documentos_pacientes' => 'id_paciente',
  ];

  /** Referencias que se consideran historial clínico/comercial (no solo agenda). */
  public const HISTORIAL = [
    'consultagenerica', 'refracciongeneral', 'historia_clinica', 'baja_vision',
    'optometria_neonatos', 'optometria_pediatrica', 'ortoptica_adultos',
    'terapias_bajav', 'terapias_optometria_neonatos', 'terapias_optometria_pediatrica',
    'terapias_ortoptica_adultos', 'ordenes', 'receta', 'anticipos', 'documentos_pacientes',
  ];

  /** Campos del principal que se completan con los del duplicado si están vacíos. */
  private const CAMPOS_COMPLETABLES = [
    'sucursal', 'doctor', 'email', 'nro_seguro', 'fecha_nacimiento', 'genero',
    'lugar_nacimiento', 'direccion', 'ocupacion', 'telefono', 'celular', 'medico',
  ];

  /** Cantidad de referencias por tabla de un paciente. */
  public function contarReferencias(int $idPaciente): array
  {
    $conteo = [];
    foreach ($this->referenciasExistentes() as $tabla => $columna) {
      $valor = $tabla === 'citas' ? (string) $idPaciente : $idPaciente;
      $conteo[$tabla] = DB::table($tabla)->where($columna, $valor)->count();
    }
    if (Schema::hasColumn('ordenes', 'id_cliente')) {
      $conteo['ordenes.id_cliente'] = DB::table('ordenes')->where('id_cliente', $idPaciente)->count();
    }
    return $conteo;
  }

  public function tieneHistorial(int $idPaciente): bool
  {
    foreach (self::HISTORIAL as $tabla) {
      $columna = self::REFERENCIAS[$tabla];
      if (Schema::hasTable($tabla) && DB::table($tabla)->where($columna, $idPaciente)->exists()) {
        return true;
      }
    }
    return false;
  }

  /**
   * @param bool $ejecutar false = simulación (se revierte todo)
   * @param bool $ignorarCodigo permite fusionar aunque ambos tengan códigos de Interfuerza distintos
   *                            (se conserva el del principal)
   */
  public function fusionar(int $idPrincipal, int $idDuplicado, ?string $usuario = null, bool $ejecutar = false, bool $ignorarCodigo = false): array
  {
    if ($idPrincipal === $idDuplicado) {
      throw new RuntimeException('El paciente principal y el duplicado no pueden ser el mismo.');
    }

    return DB::transaction(function () use ($idPrincipal, $idDuplicado, $usuario, $ejecutar, $ignorarCodigo) {
      $principal = Pacientes::lockForUpdate()->find($idPrincipal);
      $duplicado = Pacientes::lockForUpdate()->find($idDuplicado);

      if (!$principal || !$duplicado) {
        throw new RuntimeException('No se encontró el paciente ' . (!$principal ? $idPrincipal : $idDuplicado) . '.');
      }

      $antesPrincipal = $principal->getAttributes();
      $antesDuplicado = $duplicado->getAttributes();
      $advertencias = [];

      if (Pacientes::claveCedula($principal->nro_cedula) !== Pacientes::claveCedula($duplicado->nro_cedula)) {
        $advertencias[] = "Las cédulas son distintas ({$principal->nro_cedula} / {$duplicado->nro_cedula}).";
      }

      // Código de Interfuerza
      $codPrincipal = trim((string) $principal->codigo);
      $codDuplicado = trim((string) $duplicado->codigo);
      if ($codPrincipal !== '' && $codDuplicado !== '' && $codPrincipal !== $codDuplicado) {
        if (!$ignorarCodigo) {
          throw new RuntimeException("Ambos pacientes tienen códigos de Interfuerza distintos ({$codPrincipal} / {$codDuplicado}). Revise en Interfuerza y use --ignorar-codigo para conservar el del principal.");
        }
        $advertencias[] = "Se conserva el código {$codPrincipal}; el código {$codDuplicado} queda solo en los anticipos movidos.";
      }

      // 1. Mover referencias
      $movidos = [];
      foreach ($this->referenciasExistentes() as $tabla => $columna) {
        $desde = $tabla === 'citas' ? (string) $idDuplicado : $idDuplicado;
        $hacia = $tabla === 'citas' ? (string) $idPrincipal : $idPrincipal;
        $movidos[$tabla] = DB::table($tabla)->where($columna, $desde)->update([$columna => $hacia]);
      }
      if (Schema::hasColumn('ordenes', 'id_cliente')) {
        $movidos['ordenes.id_cliente'] = DB::table('ordenes')->where('id_cliente', $idDuplicado)->update(['id_cliente' => $idPrincipal]);
      }

      // 2. Completar datos vacíos del principal
      foreach (self::CAMPOS_COMPLETABLES as $campo) {
        $actual = $principal->getAttribute($campo);
        $otro = $duplicado->getAttribute($campo);
        if ((is_null($actual) || trim((string) $actual) === '') && !is_null($otro) && trim((string) $otro) !== '') {
          $principal->setAttribute($campo, $otro);
        }
      }

      // 3. Interfuerza
      if ($codPrincipal === '' && $codDuplicado !== '') {
        $duplicado->codigo = null;
        $duplicado->save(); // liberar el código antes de asignarlo
        $principal->codigo = $codDuplicado;
      }
      if ($principal->interfuerza || $duplicado->interfuerza) {
        $principal->interfuerza = 1;
      }

      // 4. Estado: activo si alguno lo estaba o si el expediente tiene historial
      if ($principal->estado || $duplicado->estado || $this->tieneHistorial($idPrincipal)) {
        $principal->estado = 1;
      }

      $principal->save();

      // 5. Log de auditoría
      DB::table('pacientes_fusiones')->insert([
        'id_principal' => $idPrincipal,
        'id_duplicado' => $idDuplicado,
        'principal_antes' => json_encode($antesPrincipal, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE),
        'duplicado_antes' => json_encode($antesDuplicado, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE),
        'referencias_movidas' => json_encode($movidos),
        'usuario' => $usuario,
        'created_at' => now(),
      ]);

      // 6. Eliminar duplicado (ya sin referencias)
      $restantes = array_filter($this->contarReferencias($idDuplicado));
      if ($restantes) {
        throw new RuntimeException('El duplicado aún tiene referencias: ' . json_encode($restantes));
      }
      $duplicado->delete();

      $resultado = [
        'ejecutado' => $ejecutar,
        'principal' => $principal->fresh()->only(['id_paciente', 'nombres', 'apellidos', 'nro_cedula', 'estado', 'interfuerza', 'codigo']),
        'movidos' => array_filter($movidos),
        'referencias_finales' => array_filter($this->contarReferencias($idPrincipal)),
        'advertencias' => $advertencias,
      ];

      if (!$ejecutar) {
        // Simulación: revertir todo lo hecho dentro de la transacción
        throw new SimulacionFusion($resultado);
      }

      return $resultado;
    });
  }

  /** Igual que fusionar() pero devuelve el resultado de la simulación en vez de la excepción. */
  public function simular(int $idPrincipal, int $idDuplicado, bool $ignorarCodigo = false): array
  {
    try {
      $this->fusionar($idPrincipal, $idDuplicado, null, false, $ignorarCodigo);
    } catch (SimulacionFusion $s) {
      return $s->resultado;
    }
    return [];
  }

  private function referenciasExistentes(): array
  {
    return array_filter(self::REFERENCIAS, fn($columna, $tabla) => Schema::hasTable($tabla), ARRAY_FILTER_USE_BOTH);
  }
}
