<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiciosRealizadosOptometriaNeonatos extends Model
{
  use HasFactory;

  protected $table = 'servicios_realizados_optometria_neonatos';

  protected $fillable = [
    'optometriaNeonatos_id',
    'servicios_id',
  ];

  public function optometriaNeonatos()
  {
    return $this->belongsTo(OptometriaNeonatos::class, 'optometriaNeonatos_id');
  }

  public function servicio()
  {
    return $this->belongsTo(Servicio::class, 'servicios_id');
  }
}
