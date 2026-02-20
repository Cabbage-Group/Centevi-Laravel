<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistorialOrden extends Model
{
    protected $table = 'historial_orden';

    protected $primaryKey = 'id';

    public $timestamps = true;

    protected $fillable = [
        'orden_id',
        'pedido_id',
        'merma_id',
        'tipo_evento',
        'proveedor',
        // snapshot receta
        'esfera_od', 'cilindro_od', 'eje_od', 'add_od', 'prisma_od',
        'esfera_oi', 'cilindro_oi', 'eje_oi', 'add_oi', 'prisma_oi',
        'tipo_base',
        'material',
        'observacion',
        'usuario_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ── Relaciones ────────────────────────────────────────────────────────────

    public function orden()
    {
        return $this->belongsTo(Ordenes::class, 'orden_id', 'id_orden');
    }

    public function pedido()
    {
        return $this->belongsTo(Pedido::class, 'pedido_id', 'id_pedido');
    }

    public function merma()
    {
        return $this->belongsTo(Mermas::class, 'merma_id', 'id_merma');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuarios::class, 'usuario_id', 'id');
    }
}