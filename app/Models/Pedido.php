<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $table = 'pedidos';

    protected $primaryKey = 'id_pedido';

    public $timestamps = true;

    protected $fillable = [
        'id_proveedor',
        'fecha_generado',
        'fecha_envio',
        'fecha_entrega',
        'estado',
        'total_ordenes',
        'observacion',
        'receta_od',
        'receta_oi',
        'add_od',
        'add_oi',
        'prisma_od',
        'prisma_oi',
        'tipo_base',
        'material'
    ];

    protected $casts = [
        'fecha_generado' => 'datetime',
        'fecha_envio' => 'datetime',
        'fecha_entrega' => 'datetime',
    ];



    public function proveedor()
    {
        return $this->belongsTo(ProveedorMaterial::class, 'id_proveedor', 'id');
    }

    public function ordenes()
    {
        return $this->hasMany(Ordenes::class, 'id_pedido', 'id_pedido');
    }
}
