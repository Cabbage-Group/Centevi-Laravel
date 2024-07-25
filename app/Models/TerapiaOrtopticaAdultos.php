<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TerapiaOrtopticaAdultos extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'terapia_ortoptica_adultos';

    // Clave primaria de la tabla
    protected $primaryKey = 'id';

    // Atributos que son asignables en masa
    protected $fillable = [
        'id_terapia',
        'id_paciente',
        'evaluacion',
        'motivo',
        'fecha_creacion',
    ];

    // Atributos que deben ser convertidos a tipos nativos
    protected $casts = [
        'fecha_creacion' => 'datetime',
    ];
}
