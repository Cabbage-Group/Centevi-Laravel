<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MarcaOnefit extends Model
{
  use HasFactory;

  protected $table = 'marcas_onefit';

  protected $primaryKey = 'id';

  protected $fillable = [
    'codigo',
    'nombre',
  ];
}