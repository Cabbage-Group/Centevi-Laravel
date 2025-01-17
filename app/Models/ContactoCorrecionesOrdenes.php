<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactoCorrecionesOrdenes extends Model
{
    use HasFactory;

    protected $table = 'contactos_correciones_ordenes';

    protected $fillable = [
        'correccion_ordenes_id', 
        'tipo_fase_cr_orden_id', 
        'usuario_id', 
        'cantidad'
    ];

    public function correccionOrden()
    {
        return $this->belongsTo(CorrecionesOrdenes::class);
    }

    public function faseCorreccionOrden()
    {
        return $this->belongsTo(FasesCorreccionesOrdenes::class, 'tipo_fase_cr_orden_id');
    }

    
    public function usuarios()
    {
        return $this->belongsTo(Usuarios::class, 'usuario_id');
    }
}
