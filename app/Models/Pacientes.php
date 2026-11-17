<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pacientes extends Model
{
  use HasFactory;

  // Nombre de la tabla
  protected $table = 'pacientes';

  // Clave primaria de la tabla
  protected $primaryKey = 'id_paciente';

  public $timestamps = false;

  // Atributos que son asignables en masa
  protected $fillable = [
    'sucursal',
    'doctor',
    'nombres',
    'apellidos',
    'nro_cedula',
    'email',
    'nro_seguro',
    'fecha_nacimiento',
    'genero',
    'lugar_nacimiento',
    'direccion',
    'ocupacion',
    'telefono',
    'celular',
    'medico',
    'urgencia',
    'menor',
    'interfuerza',
    'fecha_creacion',
    'estado',
    'codigo',
    'factura',
    'tipo_registro'
  ];

  // Atributos que deben ser convertidos a tipos nativos
  protected $casts = [
    'id_paciente' => 'integer',
    'sucursal' => 'integer',
    'factura' => 'integer',
    'estado' => 'boolean',
    'fecha_creacion' => 'date',
  ];

  /** Cédula tal como se guarda: sin espacios y en mayúsculas. Se conservan los guiones (8-1-123 ≠ 8-11-23). */
  public static function normalizarCedula(?string $cedula): string
  {
    return strtoupper(preg_replace('/\s+/', '', (string) $cedula));
  }

  /** Clave de comparación entre cédulas. */
  public static function claveCedula(?string $cedula): string
  {
    return self::normalizarCedula($cedula);
  }

  /** Descarta cédulas de relleno como "0000000", "---" o "00". */
  public static function esCedulaReal(?string $cedula): bool
  {
    $clave = self::claveCedula($cedula);
    return strlen($clave) >= 4 && preg_match('/[1-9]/', $clave) === 1;
  }

  public function scopeConCedula($query, ?string $cedula)
  {
    return $query->whereRaw("REPLACE(TRIM(nro_cedula), ' ', '') = ?", [self::claveCedula($cedula)]);
  }

  /**
   * Paciente que corresponde a una cédula. Si hay duplicados devuelve el más confiable:
   * activo, con código de Interfuerza y el más antiguo. Las cédulas de relleno no coinciden con nadie.
   */
  public static function buscarPorCedula(?string $cedula, ?int $excluirId = null): ?self
  {
    if (!self::esCedulaReal($cedula)) {
      return null;
    }

    return self::conCedula($cedula)
      ->when($excluirId, fn($q) => $q->where('id_paciente', '!=', $excluirId))
      ->orderByDesc('estado')
      ->orderByRaw("CASE WHEN codigo IS NULL OR TRIM(codigo) = '' THEN 1 ELSE 0 END")
      ->orderBy('id_paciente')
      ->first();
  }

  public function anticipos()
  {
    return $this->hasMany(Anticipo::class, 'id_paciente', 'id_paciente');
  }
}
