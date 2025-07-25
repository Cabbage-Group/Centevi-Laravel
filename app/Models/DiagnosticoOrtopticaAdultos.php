<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiagnosticoOrtopticaAdultos  extends Model
{
    use HasFactory;

    protected $table = 'diagnosticos_ortoptica_adultos';

    protected $fillable = [
        'ortoptica_adulto_id',
        'diagnostico_id',
    ];

    public function ortopticaAdultos()
    {
        return $this->belongsTo(OrtopticaAdultos::class, 'ortoptica_adulto_id');
    }

    public function diagnosticos()
    {
        return $this->belongsTo(Diagnosticos::class, 'diagnostico_id');
    }
}
