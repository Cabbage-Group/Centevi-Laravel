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
    'proveedor_material',
    'fecha_fase',
    'status',
    'elaborado_por',
    'base_ojo_izquierdo_id',
    'base_ojo_derecho_id',
    'created_at',
    'updated_at',
  ];

  protected $casts = [
    'ordenes_id' => 'integer', // Asegura que siempre sea tratado como un número entero
    'tipo_fase_orden_id' => 'integer', // Asegura que siempre sea tratado como un número entero
    'status' => 'integer', // Asegura que siempre sea tratado como un número entero
    'elaborado_por' => 'integer', // Asegura que siempre sea tratado como un número entero
  ];


  public function tipoFaseOrden()
  {
    return $this->belongsTo(TiposFasesOrdenes::class, 'tipo_fase_orden_id');
  }

  public function contactosOrdenes()
  {
    return $this->hasMany(ContactoOrden::class, 'fase_orden_id');
  }

  public function orden()
  {
    return $this->belongsTo(Ordenes::class, 'ordenes_id', 'id_orden');
  }

  public function usuario()
  {
    return $this->belongsTo(Usuarios::class, 'elaborado_por', 'id_usuario');
  }
}
