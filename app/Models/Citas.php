<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Citas extends Model
{
    use HasFactory;

    protected $table = 'citas';
    protected $fillable = [
        'citas_id',
        'origen_id',
        'origen_tabla',
        'fecha_hora',
        'fecha_hora_fin',
        'tipo',
        'paciente_id',
        'doctor',
        'sucursal_id',
        'ex_proxima_cita',
        'comentarios',
        'agendado_por'
    ];

    public function paciente()
    {
        return $this->belongsTo(Pacientes::class, 'paciente_id', 'id_paciente');
    }

    public function sucursal()
    {
        return $this->belongsTo(Sucursales::class, 'sucursal_id', 'id_sucursal');
    }
}
