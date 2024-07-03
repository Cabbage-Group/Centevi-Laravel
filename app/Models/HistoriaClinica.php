<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoriaClinica extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'historia_clinica';

    // Clave primaria de la tabla
    protected $primaryKey = 'id_consulta';

    // Indicación de si los IDs son autoincrementales o no
    public $incrementing = false;

    // Atributos que son asignables en masa
    protected $fillable = [
        'sucursal',
        'doctor',
        'paciente',
        'id_terapia',
        'edad',
        'fecha_atencion',
        'm_c',
    ];

    // Atributos que deben ser convertidos a tipos nativos
    protected $casts = [
        'fecha_atencion' => 'date',
    ];
}

