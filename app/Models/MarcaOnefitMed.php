<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MarcaOnefitMed extends Model
{
  use HasFactory;

  protected $table = 'marcas_onefit_med';

  protected $primaryKey = 'id';

  protected $fillable = [
    'codigo',
    'nombre',
  ];
}