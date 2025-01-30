<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Marcas extends Model
{
  use HasFactory;

  // Nombre de la tabla
  protected $table = 'marcas';

  // Atributos que son asignables en masa
  protected $fillable = [
    'codigo',
    'nombre',
    'lente_contacto'
  ];

 

}
