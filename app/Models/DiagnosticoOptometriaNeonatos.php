<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiagnosticoOptometriaNeonatos extends Model
{
    use HasFactory;

    protected $table = 'diagnosticos_optometria_neonatos';

    protected $fillable = [
        'optometria_neonatos_id',
        'diagnostico_id',
    ];

    public function optometriaNeonatos()
    {
        return $this->belongsTo(OptometriaNeonatos::class, 'optometria_neonatos_id');
    }

    public function diagnosticos()
    {
        return $this->belongsTo(Diagnosticos::class, 'diagnostico_id');
    }
}
