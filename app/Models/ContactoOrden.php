<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactoOrden extends Model
{
    use HasFactory;

    protected $table = 'contactos_ordenes';

    protected $fillable = [
        'ordenes_id', 
        'tipo_fase_orden_id', 
        'usuario_id', 
        'cantidad'
    ];

    public function orden()
    {
        return $this->belongsTo(Ordenes::class);
    }

    public function faseOrden()
    {
        return $this->belongsTo(FasesOrdenes::class, 'fase_orden_id');
    }

    
    public function usuarios()
    {
        return $this->belongsTo(Usuarios::class, 'usuario_id');
    }
}
