<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TerapiasOrtopticaAdultos extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'terapias_ortoptica_adultos';

    // Clave primaria de la tabla
    protected $primaryKey = 'id_terapia';

    // Indicación de que no se utilizan timestamps
    public $timestamps = false;

    // Atributos que son asignables en masa
    protected $fillable = [
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
