<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiciosRealizadosBajaVision extends Model
{
  use HasFactory;

  protected $table = 'servicios_realizados_baja_vision';

  protected $fillable = [
    'bajavision_id',
    'servicios_id',
  ];

  public function bajaVision()
  {
    return $this->belongsTo(BajaVision::class, 'bajavision_id');
  }

  public function servicio()
  {
    return $this->belongsTo(Servicio::class, 'servicios_id');
  }
}
