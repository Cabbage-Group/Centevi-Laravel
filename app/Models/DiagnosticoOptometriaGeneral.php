<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiagnosticoOptometriaGeneral extends Model
{
  use HasFactory;

  protected $table = 'diagnosticos_optometria_general';

  protected $fillable = [
    'diagnostico_id',
    'optometria_general_id',
  ];

  public function optometriaGeneral()
  {
    return $this->belongsTo(RefraccionGeneral::class, 'optometria_general_id');
  }

  public function diagnosticos()
  {
    return $this->belongsTo(Diagnosticos::class, 'diagnostico_id');
  }
}
