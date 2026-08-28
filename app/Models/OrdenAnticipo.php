<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrdenAnticipo extends Model
{
    protected $table = 'orden_anticipos';
    protected $primaryKey = 'id_orden_anticipo';

    protected $fillable = ['id_orden', 'id_anticipo', 'monto_aplicado', 'created_by'];

    protected $casts = ['monto_aplicado' => 'decimal:2'];

    public function anticipo()
    {
        return $this->belongsTo(Anticipo::class, 'id_anticipo', 'id_anticipo');
    }

    public function orden()
    {
        return $this->belongsTo(Ordenes::class, 'id_orden', 'id_orden');
    }
}