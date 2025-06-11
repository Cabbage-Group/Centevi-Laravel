<?php

namespace App\Http\Controllers\API\ventas;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ReportePago;
use App\Exports\ReportesPagosExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class VentasApiController extends Controller
{
    public function guardarPagosReportes(Request $request)
    {
      $data = $request->all();
      
        foreach ($data as $item) {
            ReportePago::create([
                'cobro_anticipo_id'             => $item['cobro_anticipo_id'] ?? null,
                'cobro_anticipo_fecha'          => $item['cobro_anticipo_fecha'] ?? null,
                'cobro_anticipo_comentario'     => $item['cobro_anticipo_comentario'] ?? null,
                'cobro_anticipo_referencia'     => $item['cobro_anticipo_referencia'] ?? null,
                'cobro_anticipo_tipo'           => $item['cobro_anticipo_tipo'] ?? null,
                'cobro_anticipo_pos'            => $item['cobro_anticipo_pos'] ?? null,
                'cobro_anticipo_bodega'         => $item['cobro_anticipo_bodega'] ?? null,
                'cobro_anticipo_proyecto'       => $item['cobro_anticipo_proyecto'] ?? null,
                'cobro_anticipo_abono_ref'      => $item['cobro_anticipo_abono_ref'] ?? null,
                'cobro_anticipo_fiscal_id'      => $item['cobro_anticipo_fiscal_id'] ?? null,
                'cobro_anticipo_monto'          => $item['cobro_anticipo_monto'] ?? 0,
                'cobro_anticipo_balance'        => $item['cobro_anticipo_balance'] ?? 0,
                'cobro_anticipo_fecha_pago_fin' => $item['cobro_anticipo_fecha_pago_fin'] ?? null,

                'cobro_aplicado_pago'           => $item['cobro_aplicado_pago'] ?? null,
                'cobro_aplicado_ciudad'         => $item['cobro_aplicado_ciudad'] ?? null,
                'cobro_aplicado_pais'           => $item['cobro_aplicado_pais'] ?? null,
                'cobro_aplicado_fecha'          => $item['cobro_aplicado_fecha'] ?? null,
                'cobro_aplicado_factura'        => $item['cobro_aplicado_factura'] ?? null,
                'cobro_aplicado_vendedor'       => $item['cobro_aplicado_vendedor'] ?? null,
                'cobro_aplicado_tipo'           => $item['cobro_aplicado_tipo'] ?? null,
                'cobro_aplicado_tipo_trans'     => $item['cobro_aplicado_tipo_trans'] ?? null,
                'cobro_aplicado_ref'            => $item['cobro_aplicado_ref'] ?? null,
                'cobro_aplicado_agente'         => $item['cobro_aplicado_agente'] ?? null,
                'cobro_aplicado_caja'           => $item['cobro_aplicado_caja'] ?? null,
                'cobro_aplicado_monto'          => $item['cobro_aplicado_monto'] ?? null,
            ]);
        }

        return response()->json(['success' => true]);
    }

    public function reportes(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'page' => 'integer|min:1',
            'limit' => 'integer|min:1|max:10000',
            'sortOrder' => Rule::in(['asc', 'desc']),
            'searchAbono' => 'nullable|string|max:255',
            'searchFactura' => 'nullable|string|max:255',
            'searchDateFactura' => 'nullable|string|max:255',
            'searchDateAbono' => 'nullable|string|max:255',
        ]);


        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors(),
            ], 400);
        }


        $page = $request->input('page', 1);
        $limit = $request->input('limit', 10);
        $sortOrder = $request->input('sortOrder', 'asc');
        $sortColumn = $request->input('sortColumn', 'id');
        $searchDateFactura = $request->input('searchDateFactura');
        $searchDateAbono = $request->input('searchDateAbono');
        $id_abono = $request->input('searchAbono');
        $id_factura = $request->input('searchFactura');

        try {
            $query = ReportePago::query();

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

            $query->where(function ($q) use ($id_abono) {
                $q->where('cobro_anticipo_id', 'LIKE', '%' . $id_abono . '%')
                ->orWhere('cobro_aplicado_factura', 'LIKE', '%' . $id_abono . '%');
            });

            if ($id_factura) {
                $query->where('cobro_aplicado_pago', 'LIKE', '%' . $id_factura . '%');
            }

            $query->orderBy($sortColumn, $sortOrder);


            $reportesPago = $query->paginate($limit, ['*'], 'page', $page);

            $meta = [
                'page' => $reportesPago->currentPage(),
                'limit' => $reportesPago->perPage(),
                'total' => $reportesPago->total(),
                'sortOrder' => $sortOrder,
                'sortColumn' => $sortColumn,
            ];

            return response()->json([
                'success' => true,
                'message' => 'Operación exitosa',
                'data' => $reportesPago->items(),
                'meta' => $meta,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener reportesPago',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function export(){
        return Excel::download(new ReportesPagosExport,'reporte.xlsx');
    }
    
}
