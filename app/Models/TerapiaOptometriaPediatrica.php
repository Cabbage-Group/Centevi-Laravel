<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TerapiaOptometriaPediatrica extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'terapia_optometria_pediatrica';

    // Clave primaria de la tabla
    protected $primaryKey = 'id';

    public $timestamps = false;


    // Atributos que son asignables en masa
    protected $fillable = [
        'id_terapia',
        'sesion',
        'completado',
        'pagado',
        'doctor',
        'fecha_creacion',
        'sucursal',
    ];

    // Atributos que deben ser convertidos a tipos nativos
    protected $casts = [
        'sucursal' => 'integer',
        'fecha_creacion' => 'datetime',
        'completado' => 'boolean',
        'pagado' => 'boolean',
    ];
}
