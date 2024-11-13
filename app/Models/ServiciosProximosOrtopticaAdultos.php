<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiciosProximosOrtopticaAdultos   extends Model
{
  use HasFactory;

  protected $table = 'servicios_proximos_ortoptica_adultos';

  protected $fillable = [
    'ortopticaAdultos_id',
    'servicios_id',
  ];

  public function ortopticaAdultos()
  {
    return $this->belongsTo(OrtopticaAdultos::class, 'ortopticaAdultos_id');
  }

  public function servicio()
  {
    return $this->belongsTo(Servicio::class, 'servicios_id');
  }
}
