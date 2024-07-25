<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResultadosOrtopticaAdultos extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'resultados_ortoptica_adultos';

    // Clave primaria de la tabla
    protected $primaryKey = 'id_resultado';

    // Atributos que son asignables en masa
    protected $fillable = [
        'id_consulta',
        'resultado',
        'fecha_creacion',
    ];

    // Atributos que deben ser convertidos a tipos nativos
    protected $casts = [
        'fecha_creacion' => 'datetime',
    ];
}
