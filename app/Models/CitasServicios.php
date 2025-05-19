<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CitasServicios extends Model
{
    use HasFactory;

    protected $table = 'citas_servicios';

    protected $fillable = [
        'cita_id',
        'servicios_id',
    ];

    public function cita()
    {
        return $this->belongsTo(Citas::class, 'cita_id');
    }
    
    public function servicio()
    {
      return $this->belongsTo(Servicio::class, 'servicios_id');
    }
}
