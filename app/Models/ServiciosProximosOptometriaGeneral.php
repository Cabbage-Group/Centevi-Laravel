<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiciosProximosOptometriaGeneral extends Model
{
  use HasFactory;

  protected $table = 'servicios_proximos_optometria_general';

  protected $fillable = [
    'optometriageneral_id',
    'servicios_id',
  ];

  public function optometriaGeneral()
  {
    return $this->belongsTo(RefraccionGeneral::class, 'optometriageneral_id');
  }

  public function servicio()
  {
    return $this->belongsTo(Servicio::class, 'servicios_id');
  }
}
