<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TiposAros extends Model
{
  use HasFactory;

  // Nombre de la tabla
  protected $table = 'tipos_aros';

  // Atributos que son asignables en masa
  protected $fillable = [
    'nombre'
  ];
  
}
