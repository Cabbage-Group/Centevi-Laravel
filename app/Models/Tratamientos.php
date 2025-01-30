<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tratamientos extends Model
{
  use HasFactory;

  // Nombre de la tabla
  protected $table = 'tratamientos';

  // Atributos que son asignables en masa
  protected $fillable = [
    'codigo',
    'nombre',
  ];
}
