<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuoteLine extends Model
{

    protected $table = 'quotes_lines';

    protected $fillable = [
        'quote_id',
        'Codigo',
        'Descripcion',
        'Item_Number',
        'Nombre',
        'Marca',
        'Category_L1',
        'Category_L2',
        'Category_L3',
        'Unidades',
        'Precio_Unitario',
        'Discount',
        'DiscountFactor',
        'TaxID',
        'TaxName',
        'TaxFactor',
        'TaxValue',
        'Total'
    ];

    public function quote()
    {
        return $this->belongsTo(Quote::class);
    }
}
