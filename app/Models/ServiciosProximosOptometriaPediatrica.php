<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiciosProximosOptometriaPediatrica extends Model
{
  use HasFactory;

  protected $table = 'servicios_proximos_optometria_pediatrica';

  protected $fillable = [
    'optometriaPediatrica_id',
    'servicios_id',
  ];

  public function optometriaPediatrica()
  {
    return $this->belongsTo(OptometriaPediatrica::class, 'optometriaPediatrica_id');
  }

  public function servicio()
  {
    return $this->belongsTo(Servicio::class, 'servicios_id');
  }
}
