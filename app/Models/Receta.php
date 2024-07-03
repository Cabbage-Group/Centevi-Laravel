<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Receta extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'receta';

    // Clave primaria de la tabla
    protected $primaryKey = 'id_receta';

    // Atributos que son asignables en masa
    protected $fillable = [
        'id_paciente',
        'nro_receta',
        'direccion',
        'cedula',
        'telefono',
        'rx',
        'tipo_lente',
        'material',
        'tratamientos',
        'aro_propio',
        'observacion',
        'medidas',
        'sucursal',
        'doctor',
        'fecha_creacion',
    ];

    // Atributos que deben ser convertidos a tipos nativos
    protected $casts = [
        'fecha_creacion' => 'datetime',
    ];
}
