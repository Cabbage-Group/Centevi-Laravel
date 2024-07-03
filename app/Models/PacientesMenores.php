<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PacientesMenores extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'pacientesmenores';

    // Clave primaria de la tabla
    protected $primaryKey = 'id_paciente';

    // Atributos que son asignables en masa
    protected $fillable = [
        'nombres',
        'apellidos',
        'nro_cedula',
        'nro_seguro',
        'fecha_nacimiento',
        'genero',
        'lugar_nacimiento',
        'direccion',
        'medico_cabecera',
        'responsable',
        'parentesco',
        'nro_celular_responsable',
        'otro_nro_responsable',
        'alergias',
        'urg_responsable',
        'urg_parentesto',
        'urg_celular',
        'fecha_creacion',
    ];

    // Atributos que deben ser convertidos a tipos nativos
    protected $casts = [
        'fecha_nacimiento' => 'date',
        'fecha_creacion' => 'datetime',
    ];

}
