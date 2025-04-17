<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    protected $fillable = [
        'Cliente',
        'Bodega',
        'Status',
        'Date',
        'Expira',
        'Comentario',
        'SubTotal',
        'Discount',
        'Taxes',
        'Total',
        'Reservar_Productos',
        'Type',
        'Vendedor',
        'Currency',
        'Currency_Rate',
        'extraData',
        'estado',
        'codigo_interfuerza'
    ];

    public function lines()
    {
        return $this->hasMany(QuoteLine::class);
    }
}
