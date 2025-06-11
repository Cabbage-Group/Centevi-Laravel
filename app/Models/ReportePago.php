<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportePago extends Model
{
    use HasFactory;

    protected $table = 'reportes_pagos';

    protected $fillable = [
        'cobro_anticipo_id',
        'cobro_anticipo_fecha',
        'cobro_anticipo_comentario',
        'cobro_anticipo_referencia',
        'cobro_anticipo_tipo',
        'cobro_anticipo_pos',
        'cobro_anticipo_bodega',
        'cobro_anticipo_proyecto',
        'cobro_anticipo_abono_ref',
        'cobro_anticipo_fiscal_id',
        'cobro_anticipo_monto',
        'cobro_anticipo_balance',
        'cobro_anticipo_fecha_pago_fin',

        'cobro_aplicado_pago',
        'cobro_aplicado_ciudad',
        'cobro_aplicado_pais',
        'cobro_aplicado_fecha',
        'cobro_aplicado_factura',
        'cobro_aplicado_vendedor',
        'cobro_aplicado_tipo',
        'cobro_aplicado_tipo_trans',
        'cobro_aplicado_ref',
        'cobro_aplicado_agente',
        'cobro_aplicado_caja',
        'cobro_aplicado_monto',
    ];
}
