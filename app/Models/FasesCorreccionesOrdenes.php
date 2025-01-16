<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FasesCorreccionesOrdenes extends Model
{
  use HasFactory;

  protected $table = 'fases_correcciones_ordenes';

  public $timestamps = false;

  protected $fillable = [
    'tipo_fase_correccion_orden_id',
    'correccion_ordenes_id',
    'laboratorio',
    'observacion',
    'fecha_fase',
    'status',
    'created_at',
    'updated_at',
  ];

  protected $casts = [
    'correccion_ordenes_id' => 'integer', // Asegura que siempre sea tratado como un número entero
    'tipo_fase_correccion_orden_id' => 'integer', // Asegura que siempre sea tratado como un número entero
    'status' => 'integer', // Asegura que siempre sea tratado como un número entero
  ];


  public function tipoFaseCorreccionOrden()
  {
    return $this->belongsTo(TiposFasesOrdenes::class, 'tipo_fase_correccion_orden_id');
  }

}
