<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BajaVision extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'baja_vision';

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
        'dx_oft_princ',
        'objetivos',
        'av_sc',
        'av_cc',
        'vision_exentrica',
        'lensometria',
        'lensometria_extra',
        'cv_so',
        'amsler',
        'sensibilidad_c',
        'refraccion',
        'pruebas',
        'ayudas_opticas',
        'ayudas_no_opticas',
        'plan_rehabilitacion',
        'plan_versiones',
        'fecha_creacion',
        'editado',
        'fecha_proxima_consulta',
        'hubo_contacto',
        'se_agendo'
    ];

    // Atributos que deben ser convertidos a tipos nativos
    protected $casts = [
        'sucursal' => 'integer',
        'paciente' => 'integer',
        'fecha_atencion' => 'date',
        'fecha_creacion' => 'datetime',
        'fecha_proxima_consulta' => 'datetime',

    ];
}
