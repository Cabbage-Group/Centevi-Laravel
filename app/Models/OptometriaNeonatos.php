<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OptometriaNeonatos extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'optometria_neonatos';

    // Clave primaria de la tabla
    protected $primaryKey = 'id_consulta';

    // Atributos que son asignables en masa
    protected $fillable = [
        'sucursal',
        'doctor',
        'paciente',
        'id_terapia',
        'edad',
        'fecha_atencion',
        'm_c',
        'a_o',
        'a_p',
        'a_f',
        'medicamentos',
        'tratamientos',
        'desarrollo',
        'nacimiento',
        'parto',
        'gateo',
        'lenguaje',
        'complicaciones',
        'perinatales',
        'agudeza_visual',
        'lensometria',
        'lensometria_extra',
        'sa_pp',
        'pruebas_extras',
        'refraccion',
        'conducta_seguir',
        'plan_versiones',
        'fecha_creacion',
        'editado',
    ];

    // Atributos que deben ser convertidos a tipos nativos
    protected $casts = [
        'fecha_atencion' => 'date',
        'fecha_creacion' => 'datetime',
    ];
}

