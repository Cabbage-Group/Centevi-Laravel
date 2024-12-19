<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FasesOrdenes extends Model
{
  use HasFactory;

  protected $table = 'fases_ordenes';

  public $timestamps = false;

  protected $fillable = [
    'tipo_fase_orden_id',
    'ordenes_id',
    'laboratorio',
    'observacion',
    'fecha_fase',
    'created_at',
    'updated_at',
  ];

  protected $casts = [
    'ordenes_id' => 'integer', // Asegura que siempre sea tratado como un número entero
    'tipo_fase_orden_id' => 'integer', // Asegura que siempre sea tratado como un número entero
  ];

  public function tipoFaseOrden()
  {
    return $this->belongsTo(TiposFasesOrdenes::class, 'tipo_fase_orden_id');
  }

  public function contactosOrdenes()
  {
      return $this->hasMany(ContactoOrden::class, 'fase_orden_id');
  }

}
