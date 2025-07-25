<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiagnosticoHistoriaClinica extends Model
{
  use HasFactory;

  protected $table = 'diagnosticos_historias_clinicas';

  protected $fillable = [
    'diagnostico_id',
    'historia_clinica_id',
  ];

  public function historiaClinica()
  {
    return $this->belongsTo(RefraccionGeneral::class, 'historia_clinica_id');
  }

  public function diagnosticos()
  {
    return $this->belongsTo(Diagnosticos::class, 'diagnostico_id');
  }
}
