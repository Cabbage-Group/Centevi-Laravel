<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductInterfuerza extends Model
{
    use HasFactory;

    protected $table = 'products_interfuerza';

    protected $fillable = [
        'codigo',
        'type',
        'prod_madre',
        'upc_code',
        'item_number',
        'nombre',
        'category_l1',
        'category_l2',
        'category_l3',
        'codigo_externo',
        'proveedor_principal',
        'setup',
        'ultimo_costo_unidad',
        'peso',
        'detalle',
        'status',
        'marca',
        'grosor',
        'ancho',
        'altura',
        'largo',
        'matrix',
        'matrix_child',
        'color',
        'talla',
        'tax',
        'volumen',
        'lote',
        'expiracion',
        'has_promotion',
        'has_promotion_type',
        'has_promotion_value',
        'has_promotion_default_price',
        'has_promotion_date',
        'service_price',
        'service_setup',
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
        'expiracion' => 'date',
        'has_promotion_date' => 'date',
        'has_promotion' => 'boolean',
    ];

    public function prices()
    {
        return $this->hasMany(ProductPrice::class, 'product_id');
    }
}
