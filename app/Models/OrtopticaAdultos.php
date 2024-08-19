<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrtopticaAdultos extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'ortoptica_adultos';

    // Clave primaria de la tabla
    protected $primaryKey = 'id_consulta';

    public $timestamps = false;
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
        'av_sc',
        'av_cc',
        'ojo_dominante',
        'mano_dominante',
        'lensometria',
        'lensometria_extra',
        'sa_pp',
        'visuscopia',
        'visuscopia_extra',
        'refraccion',
        'lentes_contacto',
        'pruebas',
        'pruebas_extra',
        'acomodacion',
        'acomodacion_extra',
        'vergencia',
        'conducta_seguir',
        'plan_versiones',
        'fecha_creacion',
        'editado',
        'fecha_proxima_consulta',
        'hubo_contacto',
        'se_agendo'
    ];

    // Atributos que deben ser convertidos a tipos nativos
    protected $casts = [
        'fecha_atencion' => 'date',
        'fecha_creacion' => 'datetime',
        'fecha_proxima_consulta' => 'datetime',

    ];

}

