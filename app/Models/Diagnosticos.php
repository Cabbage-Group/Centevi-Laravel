<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Diagnosticos extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'diagnosticos';

    // Atributos que son asignables en masa
    protected $fillable = [
        'codigo',
        'diagnostico',
    ];
}
