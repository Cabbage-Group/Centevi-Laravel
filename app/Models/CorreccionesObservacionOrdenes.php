<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CorreccionesObservacionOrdenes extends Model
{
    use HasFactory;

    protected $table = 'correcciones_ordenes_observaciones';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'correccion_ordenes_id',
        'observacion',
        'elaborado_por',
        'created_at',
        'updated_at', 
    ];

    protected $casts = [
        'correccion_ordenes_id'    => 'integer',
        'elaborado_por' => 'integer',
    ];

    public function correccionOrden()
    {
        return $this->belongsTo(CorrecionesOrdenes::class, 'correccion_ordenes_id', 'id');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuarios::class, 'elaborado_por', 'id_usuario');
    }
}