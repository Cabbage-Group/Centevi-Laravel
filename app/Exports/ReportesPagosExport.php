<?php

namespace App\Exports;

use App\ReportesPagos;
use DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ReportesPagosExport implements FromCollection, WithHeadings
{
  /**
   * @return \Illuminate\Support\Collection
   */
  public function headings(): array
  {
    return [
      'Abono',
      'Factura',
      'Fecha',
      'Fecha Pago fin',
      'Monto',
      'Balance',
      'Agente',
      'Caja',
      'Bodega',
      'Pais',
      'Ciudad',
      'Vendedor',
      'Tipo',
      'Pos',
      'Tipo transaccion',
      'Ref',
      'Comentario',
      'Referencia',
      'Proyecto',
      'Abono ref',
      'Fiscal id',
      'Monto factura',
      'Tipo factura',
    ];
  }
  public function collection()
  {
    $report = DB::table('reportes_pagos')
      ->where('cobro_anticipo_status', 'CLOSED')
      ->select(
        'cobro_anticipo_id',
        'cobro_aplicado_pago',
        'cobro_anticipo_fecha',
        'cobro_anticipo_fecha_pago_fin',

        'cobro_anticipo_monto',
        'cobro_anticipo_balance',
        'cobro_aplicado_agente',
        'cobro_aplicado_caja',
        'cobro_anticipo_bodega',
        'cobro_aplicado_pais',
        'cobro_aplicado_ciudad',
        'cobro_aplicado_vendedor',
        'cobro_anticipo_tipo',
        'cobro_anticipo_pos',
        'cobro_aplicado_tipo_trans',
        'cobro_aplicado_ref',
        'cobro_anticipo_comentario',
        'cobro_anticipo_referencia',
        'cobro_anticipo_proyecto',
        'cobro_anticipo_abono_ref',
        'cobro_anticipo_fiscal_id',
        'cobro_aplicado_monto',
        'cobro_aplicado_tipo'
      )->get();
    return $report;
  }
}