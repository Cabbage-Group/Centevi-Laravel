<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProximasCitas extends Model
{
    use HasFactory;

    protected $table = 'proximas_citas';
    protected $fillable = [
        'origen_id',
        'origen_tabla',
        'fecha_hora',
        'tipo',
        'paciente_id',
        'doctor_id',
        'sucursal_id',
        'comentarios'
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
