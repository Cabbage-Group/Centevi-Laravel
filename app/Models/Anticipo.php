<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Anticipo extends Model
{
    protected $table = 'anticipos';
    protected $primaryKey = 'id_anticipo';

    protected $fillable = [
        'id_paciente', 'id_sucursal', 'referencia', 'tipo',
        'monto', 'estado', 'fecha', 'created_by',
    ];

    protected $casts = [
        'monto' => 'decimal:2',
        'fecha' => 'date',
    ];

    public function paciente()
    {
        return $this->belongsTo(Pacientes::class, 'id_paciente', 'id_paciente');
    }

    public function ordenAnticipos()
    {
        return $this->hasMany(OrdenAnticipo::class, 'id_anticipo', 'id_anticipo');
    }

    public function getDisponibleAttribute(): float
    {
        return round($this->monto - $this->ordenAnticipos->sum('monto_aplicado'), 2);
    }
}

