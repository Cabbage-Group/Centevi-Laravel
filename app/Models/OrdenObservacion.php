<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenObservacion extends Model
{
    use HasFactory;

    protected $table = 'ordenes_observaciones';

    public $timestamps = false;

    protected $fillable = [
        'ordenes_id',
        'observacion',
        'elaborado_por',
        'created_at',
        'updated_at', 
    ];

    protected $casts = [
        'ordenes_id'    => 'integer',
        'elaborado_por' => 'integer',
    ];

    public function orden()
    {
        return $this->belongsTo(Ordenes::class, 'ordenes_id', 'id_orden');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuarios::class, 'elaborado_por', 'id_usuario');
    }
}