<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InterfuerzaSyncState extends Model
{
    protected $table = 'interfuerza_sync_state';

    protected $fillable = [
        'recurso',
        'ultima_pagina',
        'ultimo_total',
        'historial_completo',
        'ultima_pagina_revisada',
        'ultima_pagina_completa',
        'ultima_sincronizacion',
    ];

    protected $casts = [
        'historial_completo'     => 'boolean',
        'ultima_sincronizacion'  => 'datetime',
    ];
}
