<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TerapiaBajaV extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'terapia_bajav';

    // Clave primaria de la tabla
    protected $primaryKey = 'id';

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
        'fecha_creacion' => 'datetime',
        'completado' => 'boolean',
        'pagado' => 'boolean',
    ];
}
