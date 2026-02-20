<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProveedorMaterial extends Model
{
    use HasFactory;

    protected $table = 'proveedor_de_material';


    protected $primaryKey = 'id';

    protected $fillable = ['nombre'];

    public $timestamps = true;

    
    public function pedidos()
    {
        return $this->hasMany(Pedido::class, 'id_proveedor', 'id');
    }
}