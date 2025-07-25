<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiagnosticoOptometriaPediatrica  extends Model
{
    use HasFactory;

    protected $table = 'diagnosticos_optometria_pediatrica';

    protected $fillable = [
        'optometria_pediatrica_id',
        'diagnostico_id',
    ];

    public function optometriaPediatrica()
    {
        return $this->belongsTo(OptometriaPediatrica::class, 'optometria_pediatrica_id');
    }

    public function diagnosticos()
    {
        return $this->belongsTo(Diagnosticos::class, 'diagnostico_id');
    }
}
