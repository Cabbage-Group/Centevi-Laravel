<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Servicio extends Model
{
  use HasFactory;

  protected $table = 'servicios';

  protected $fillable = [
    'codigo',
    'servicio',
  ];

  public function serviciosRealizadosHistoriasClinicas()
  {
    return $this->hasMany(ServiciosRealizadosHistoriasClinicas::class, 'servicios_id');
  }

  public function serviciosProximosHistoriasClinicas()
  {
    return $this->hasMany(ServiciosProximosHistoriasClinicas::class, 'servicios_id');
  }

  public function serviciosBajaVision()
  {
    return $this->hasMany(ServiciosProximosBajaVision::class, 'servicios_id');
  }
}
