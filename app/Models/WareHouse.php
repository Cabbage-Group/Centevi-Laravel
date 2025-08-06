<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    use HasFactory;

    protected $table = 'warehouses';

    protected $fillable = [
        'nombre',
        'status',
        'tienda',
        'type',
        'venta_post',
    ];

    protected $casts = [
        'send_discount' => 'integer'
    ];
}
