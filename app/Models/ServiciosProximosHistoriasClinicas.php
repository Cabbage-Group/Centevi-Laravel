<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiciosProximosHistoriasClinicas extends Model
{
  use HasFactory;

  protected $table = 'servicios_proximos_historias_clinicas';

  protected $fillable = [
    'historiaclinica_id',
    'servicios_id',
  ];

  public function historiaClinica()
  {
    return $this->belongsTo(ConsultaGenerica::class, 'historiaclinica_id');
  }

  public function servicio()
  {
    return $this->belongsTo(Servicio::class, 'servicios_id');
  }
}
