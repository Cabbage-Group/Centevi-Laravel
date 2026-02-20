<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mermas extends Model
{
    use HasFactory;

    protected $table = 'mermas';

    protected $primaryKey = 'id_merma';

    public $incrementing = true;

    protected $keyType = 'int';

    protected $fillable = [
        'orden_id',
        'pedido_id',
        'id_proveedor',
        'cantidad',
        'estado',
        'observacion',
        'usuario_id',
        'receta_od',
        'receta_oi',
        'add_od',
        'add_oi',
        'prisma_od',
        'prisma_oi',
        'tipo_base',
        'material',
        'correccion_id',
    ];

    protected $casts = [
        'orden_id' => 'integer',
        'pedido_id' => 'integer',
        'id_proveedor' => 'integer',
        'cantidad' => 'integer',
        'correccion_id' => 'integer',
    ];


    public function orden()
    {
        return $this->belongsTo(Ordenes::class, 'orden_id', 'id_orden');
    }

    public function pedido()
    {
        return $this->belongsTo(Pedido::class, 'pedido_id', 'id_pedido');
    }

    public function proveedor()
    {
        return $this->belongsTo(ProveedorMaterial::class, 'id_proveedor', 'id');
    }

    public function correccion()
    {
        return $this->belongsTo(CorrecionesOrdenes::class, 'correccion_id', 'id');
    }
}
