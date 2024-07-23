<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pacientes extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'pacientes';

    // Clave primaria de la tabla
    protected $primaryKey = 'id_paciente';

    public $timestamps = false;

    // Atributos que son asignables en masa
    protected $fillable = [
        'sucursal',
        'doctor',
        'nombres',
        'apellidos',
        'nro_cedula',
        'email',
        'nro_seguro',
        'fecha_nacimiento',
        'genero',
        'lugar_nacimiento',
        'direccion',
        'ocupacion',
        'telefono',
        'celular',
        'medico',
        'urgencia',
        'menor',
        'fecha_creacion',
    ];

    // Atributos que deben ser convertidos a tipos nativos
    protected $casts = [
        'fecha_nacimiento' => 'date',
        'fecha_creacion' => 'date',
    ];

}
