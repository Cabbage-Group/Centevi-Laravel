<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TiposFasesOrdenes extends Model
{
  use HasFactory;

  protected $table = 'tipos_fases_ordenes';

  protected $fillable = [
    'tipo_fase_orden',
  ];

  public function fasesOrdenes()
  {
    return $this->hasMany(FasesOrdenes::class, 'tipo_fase_orden_id');
  }

  public function fasesCorreccionesOrdenes()
  {
    return $this->hasMany(FasesCorreccionesOrdenes::class, 'tipo_fase_correccion_orden_id');
  }
}
