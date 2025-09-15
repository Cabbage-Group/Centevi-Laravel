<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
  protected $fillable = [
    'Cliente',
    'Bodega',
    'Status',
    'Date',
    'Expira',
    'Comentario',
    'SubTotal',
    'Discount',
    'Taxes',
    'Total',
    'Abono',
    'Reservar_Productos',
    'Type',
    'Vendedor',
    'Currency',
    'Currency_Rate',
    'extraData',
    // 'estado',
    'codigo_interfuerza'
  ];

  protected $casts = [
    'estado' => 'boolean',
  ];

  public function lines()
  {
    return $this->hasMany(QuoteLine::class);
  }

  public function paciente()
  {
    return $this->belongsTo(Pacientes::class, 'Cliente', 'codigo');
  }
}
