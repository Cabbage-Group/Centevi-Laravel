<?php

namespace App\Exports;

use App\ReportesPagos;
use DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Schema;

class ReportesPagosExport implements FromCollection, WithHeadings
{
  protected $request;

  public function __construct(Request $request)
  {
    $this->request = $request;
  }

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
    $request = $this->request;

    $sortOrder = $request->input('sortOrder', 'asc');
    $sortColumn = $request->input('sortColumn', 'id');
    $searchDateFactura = $request->input('searchDateFactura');
    $searchDateAbono = $request->input('searchDateAbono');
    $id_abono = $request->input('searchAbono');
    $id_factura = $request->input('searchFactura');

    $query = DB::table('reportes_pagos')
      ->where('cobro_anticipo_status', 'CLOSED');

    if ($searchDateAbono) {
      $desde = Carbon::parse($searchDateAbono . '-01')->startOfMonth()->toDateString();
      $hasta = Carbon::parse($searchDateAbono . '-01')->endOfMonth()->toDateString();

      $query->whereBetween('cobro_anticipo_fecha', [$desde, $hasta]);
    }

    if ($searchDateFactura) {
      $desde = Carbon::parse($searchDateFactura . '-01')->startOfMonth()->toDateString();
      $hasta = Carbon::parse($searchDateFactura . '-01')->endOfMonth()->toDateString();

      $query->whereBetween('cobro_aplicado_fecha', [$desde, $hasta]);
    }

    if ($id_abono) {
      $query->where(function ($q) use ($id_abono) {
        $q->where('cobro_anticipo_id', 'LIKE', '%' . $id_abono . '%')
          ->orWhere('cobro_aplicado_factura', 'LIKE', '%' . $id_abono . '%');
      });
    }

    if ($id_factura) {
      $query->where('cobro_aplicado_pago', 'LIKE', '%' . $id_factura . '%');
    }

    // Aplica el ordenamiento si la columna existe
    if (Schema::hasColumn('reportes_pagos', $sortColumn)) {
      $query->orderBy($sortColumn, $sortOrder);
    }

    return $query->select(
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
  }
}
