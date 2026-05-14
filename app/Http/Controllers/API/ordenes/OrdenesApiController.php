<?php

namespace App\Http\Controllers\API\ordenes;

use App\Http\Controllers\Controller;
use App\Models\Ordenes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\TiposFasesOrdenes;
use App\Models\FasesOrdenes;
use App\Models\ContactoOrden;
use App\Models\Cristales;
use App\Models\NroOrden;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use App\Models\CorrecionesOrdenes;
use App\Models\Pedido;

class OrdenesApiController extends Controller
{

  public function obtenerOrdenes(Request $request)
  {
    $search             = $request->input('search', '');
    $limit              = $request->input('limit', 20);
    $page               = $request->input('page', 1);
    $sortColumn         = $request->input('sortColumn', 'id_orden');
    $sortOrder          = $request->input('sortOrder', 'asc');
    $lenteContacto      = $request->input('lenteContacto', []);
    $estados            = $request->input('estados', []);
    $pagado             = $request->input('pagado', []);
    $sucursal           = $request->input('sucursal', []);
    $laboratorio        = $request->input('laboratorio', []);
    $fase               = $request->input('fase', []);
    $proveedor          = $request->input('proveedor', []);
    $serviciosFiltrados = $request->input('serviciosFiltrados', []);
    $fecha              = $request->input('fecha', '');
    $cancelada          = $request->input('cancelada', null);

    $validColumns = ['id_orden', 'nro_orden_id', 'created_at', 'paciente', 'sucursal'];
    if (!in_array($sortColumn, $validColumns)) {
      $sortColumn = 'id_orden';
    }
    $sortOrder = $sortOrder === 'desc' ? 'desc' : 'asc';

    $query = Ordenes::with([
      'paciente:id_paciente,nro_cedula,nombres,celular,apellidos',
      'sucursal:id_sucursal,nombre,ubicacion,ubicacion_maps',
      'fasesOrdenes.tipoFaseOrden',
      'fasesOrdenes.usuario',
      'correciones.faseCorreccionOrden.tipoFaseCorreccionOrden',
      'correciones.faseCorreccionOrden.usuario',
    ]);


    if (!empty($search)) {
      $query->where(function ($q) use ($search) {
        $q->where('id_orden', 'like', "%$search%")
          ->orWhere('nro_orden_id', 'like', "%$search%")
          ->orWhere('nro_factura', 'like', "%$search%")
          ->orWhere('created_at', 'like', "%$search%")
          ->orWhereHas('paciente', function ($q) use ($search) {
            $searchTerms = explode(' ', trim($search));
            $q->where(function ($innerQ) use ($searchTerms) {
              foreach ($searchTerms as $term) {
                if (!empty($term)) {
                  $innerQ->where(function ($nameQ) use ($term) {
                    $nameQ->where('nombres', 'like', "%$term%")
                      ->orWhere('apellidos', 'like', "%$term%");
                  });
                }
              }
            })
              ->orWhere('celular', 'like', "%$search%")
              ->orWhere('nro_cedula', 'like', "%$search%");
          })
          ->orWhereHas('sucursal', function ($q) use ($search) {
            $q->where('nombre', 'like', "%$search%");
          })
          ->orWhereHas('fasesOrdenes', function ($q) use ($search) {
            $q->where('laboratorio', 'like', "%$search%");
          });
      });
    }

    if (!empty($fecha)) {
      $fechas = explode(' - ', $fecha);
      if (count($fechas) === 2) {
        $fechaInicio = trim($fechas[0]);
        $fechaFin    = trim($fechas[1]);
        if (strtotime($fechaInicio) && strtotime($fechaFin)) {
          $query->whereBetween('created_at', [
            $fechaInicio . ' 00:00:00',
            $fechaFin . ' 23:59:59',
          ]);
        }
      }
    }

    if (!empty($lenteContacto)) {
      $query->whereIn('lente_contacto', (array) $lenteContacto);
    }

    if (!empty($pagado)) {
      $query->whereIn('pagado', (array) $pagado);
    }

    if (!empty($sucursal)) {
      $query->whereIn('id_sucursal', (array) $sucursal);
    }

    if (!empty($laboratorio)) {
      $query->whereHas('fasesOrdenes', function ($q) use ($laboratorio) {
        $q->whereIn('laboratorio', (array) $laboratorio);
      });
    }

    if (!empty($proveedor)) {
      $query->whereHas('fasesOrdenes', function ($q) use ($proveedor) {
        $q->whereIn('proveedor_material', (array) $proveedor);
      });
    }

    if (!empty($serviciosFiltrados)) {
      $query->where(function ($q) use ($serviciosFiltrados) {
        $q->whereIn('tipo_cristal_od', (array) $serviciosFiltrados)
          ->orWhereIn('tipo_cristal_oi', (array) $serviciosFiltrados);
      });
    }

    if ($cancelada == true) {
      $query->where('cancelada', $cancelada);
    }

    $tiposFases = TiposFasesOrdenes::pluck('tipo_fase_orden', 'id');

    $hayFiltrosCalculados = !empty($fase) || !empty($estados);

    // Closure reutilizable inline para armar las filas de una orden + sus correcciones
    $buildFilas = function ($orden) use ($tiposFases) {
      $ultimaFase    = $orden->fasesOrdenes->sortByDesc('tipo_fase_orden_id')->first();
      $estado        = 'Sin estado';
      $siguienteFase = 'Nuevo';

      if ($ultimaFase) {
        $diasDiferencia = now()->diffInDays($ultimaFase->fecha_fase);

        if ($ultimaFase->tipo_fase_orden_id == 5) {
          $estado = 'Completado';
        } elseif ($diasDiferencia <= 6) {
          $estado = 'OK';
        } elseif ($diasDiferencia == 7) {
          $estado = 'Advertencia';
        } else {
          $estado = 'Crítico';
        }

        if ($ultimaFase->tipo_fase_orden_id == 5) {
          $siguienteFase = 'Retirado';
        } elseif ($ultimaFase->tipo_fase_orden_id == 4) {
          $siguienteFase = 'Listo';
        } elseif ($ultimaFase->tipo_fase_orden_id == 1 && $ultimaFase->status == 0) {
          $siguienteFase = 'Nuevo';
        } else {
          $nuevoTipoFase = ($ultimaFase->status == 1 && $ultimaFase->tipo_fase_orden_id < 4)
            ? $ultimaFase->tipo_fase_orden_id + 1
            : $ultimaFase->tipo_fase_orden_id;

          $siguienteFase = $tiposFases[$nuevoTipoFase] ?? 'Finalizado';
        }
      }

      $filas = [[
        'id_orden'           => $orden->id_orden,
        'nro_orden_id'       => $orden->nro_orden_id,
        'nro_factura'        => $orden->nro_factura,
        'pagado'             => $orden->pagado,
        'es_correccion'      => false,
        'created_at'         => $orden->created_at ? Carbon::parse($orden->created_at)->format('d-m-Y') : null,
        'laboratorio'        => $orden->fasesOrdenes->whereNotNull('laboratorio')->pluck('laboratorio')->first() ?? null,
        'proveedor_material' => $orden->fasesOrdenes->whereNotNull('proveedor_material')->pluck('proveedor_material')->first() ?? null,
        'tipo_fase_orden'    => $siguienteFase,
        'elaborado_por_fase' => $ultimaFase->usuario->nombre ?? null,
        'siguiente_fase'     => $siguienteFase,
        'codigo_cristal'     => $orden->codigo_cristal,
        'id_paciente'        => $orden->paciente->id_paciente,
        'nro_cedula'         => $orden->paciente->nro_cedula,
        'nombres'            => $orden->paciente->nombres,
        'apellidos'          => $orden->paciente->apellidos,
        'celular'            => $orden->paciente->celular,
        'sucursal'           => $orden->sucursal->nombre,
        'lente_contacto'     => $orden->lente_contacto,
        'correcciones'       => $orden->correciones->count(),
        'cancelada'          => $orden->cancelada ?? 0,
        'estado'             => $estado,
        'esfera_od'          => $orden['esfera_od'],
        'cilindro_od'        => $orden['cilindro_od'],
        'eje_od'             => $orden['eje_od'],
        'add_od'             => $orden['add_od'],
        'prisma_od'          => $orden['prisma_od'],
        'distancia_od'       => $orden['distancia_od'],
        'altura_od'          => $orden['altura_od'],
        'esfera_oi'          => $orden['esfera_oi'],
        'cilindro_oi'        => $orden['cilindro_oi'],
        'eje_oi'             => $orden['eje_oi'],
        'add_oi'             => $orden['add_oi'],
        'prisma_oi'          => $orden['prisma_oi'],
        'distancia_oi'       => $orden['distancia_oi'],
        'altura_oi'          => $orden['altura_oi'],
        'material_od'        => $orden['material_od'],
        'material_oi'        => $orden['material_oi'],
        'tipo_cristal_od'    => $orden['tipo_cristal_od'],
        'tipo_cristal_oi'    => $orden['tipo_cristal_oi'],
        'l_uno'              => $orden['l_uno'] ?? '-',
        'l_dos'              => $orden['l_dos'] ?? '-',
        'l_tres'             => $orden['l_tres'] ?? '-',
        'l_cuatro'           => $orden['l_cuatro'] ?? '-',
        'l_cinco'            => $orden['l_cinco'] ?? '-',
        'color'              => $orden['color'] ?? '_',
        'codigo'             => $orden['codigo'] ?? '_',
        'marca'              => $orden['marca'] ?? '_',
        'tipo_aro'           => $orden['tipo_aro'] ?? '_',
        'observaciones'      => $orden['observaciones'] ?? '_',
        'aro_centevi'        => $orden['aro_centevi'],
        'aro_propio'         => $orden['aro_propio'],
        'tratamientos_oi'    => $orden['tratamientos_oi'],
        'tratamientos_od'    => $orden['tratamientos_od'],
      ]];

      foreach ($orden->correciones as $index => $correccion) {
        $numero = $index + 1;


        $ultimaFaseCorr = $correccion->faseCorreccionOrden->sortByDesc('tipo_fase_correccion_orden_id')->first();
        $estadoCorr = 'Sin estado';
        $siguienteFaseCorr = 'Nuevo';

        if ($ultimaFaseCorr) {
          $diasC = now()->diffInDays($ultimaFaseCorr->fecha_fase);

          if ($ultimaFaseCorr->tipo_fase_correccion_orden_id == 5) {
            $estadoCorr = 'Completado';
          } elseif ($diasC <= 6) {
            $estadoCorr = 'OK';
          } elseif ($diasC == 7) {
            $estadoCorr = 'Advertencia';
          } elseif ($diasC >= 8) {
            $estadoCorr = 'Crítico';
          }

          if ($ultimaFaseCorr->tipo_fase_correccion_orden_id == 5) {
            $siguienteFaseCorr = 'Retirado';
          } elseif ($ultimaFaseCorr->tipo_fase_correccion_orden_id == 4) {
            $siguienteFaseCorr = 'Listo';
          } elseif ($ultimaFaseCorr->tipo_fase_correccion_orden_id == 1 && $ultimaFaseCorr->status == 0) {
            $siguienteFaseCorr = 'Nuevo';
          } else {
            $nuevoTipoFaseC = ($ultimaFaseCorr->status == 1 && $ultimaFaseCorr->tipo_fase_correccion_orden_id < 4)
              ? $ultimaFaseCorr->tipo_fase_correccion_orden_id + 1
              : $ultimaFaseCorr->tipo_fase_correccion_orden_id;

            $siguienteFaseCorr = $tiposFases[$nuevoTipoFaseC] ?? 'Finalizado';
          }
        }
        $filas[] = [
          'id_orden'           => "c-{$correccion->id}-{$orden->id_orden}",
          'id_real'            => $correccion->id,
          'id_orden_padre'     => $orden->id_orden,
          'es_correccion'      => true,
          'nro_orden_id'       => $orden->nro_orden_id . '-C' . $numero,
          'nro_factura'        => $orden->nro_factura,
          'pagado'             => $orden->pagado,
          'created_at'         => $correccion->created_at ? Carbon::parse($correccion->created_at)->format('d-m-Y') : null,
          'id_paciente'        => $orden->paciente->id_paciente,
          'nro_cedula'         => $orden->paciente->nro_cedula,
          'nombres'            => $orden->paciente->nombres,
          'apellidos'          => $orden->paciente->apellidos,
          'celular'            => $orden->paciente->celular,
          'sucursal'           => $orden->sucursal->nombre,
          'cancelada'          => $orden->cancelada ?? 0,
          'estado'             => $estadoCorr,
          'tipo_fase_orden'    => $siguienteFaseCorr,
          'fase_actual'        => $siguienteFaseCorr,
          'siguiente_fase'     => $siguienteFaseCorr,
          'lente_contacto'     => $orden->lente_contacto,
          'correcciones'       => 0,
          'esfera_od'          => $correccion->esfera_od,
          'cilindro_od'        => $correccion->cilindro_od,
          'eje_od'             => $correccion->eje_od,
          'add_od'             => $correccion->add_od,
          'prisma_od'          => $correccion->prisma_od,
          'esfera_oi'          => $correccion->esfera_oi,
          'cilindro_oi'        => $correccion->cilindro_oi,
          'eje_oi'             => $correccion->eje_oi,
          'add_oi'             => $correccion->add_oi,
          'prisma_oi'          => $correccion->prisma_oi,
          'tipo_cristal_od'    => $correccion->tipo_cristal_od,
          'tipo_cristal_oi'    => $correccion->tipo_cristal_oi,
          'material_od'        => $correccion->material_od,
          'material_oi'        => $correccion->material_oi,
          'tratamientos_od'    => $correccion->tratamientos_od,
          'tratamientos_oi'    => $correccion->tratamientos_oi,
          'laboratorio'        => $correccion->faseCorreccionOrden ? $correccion->faseCorreccionOrden->whereNotNull('laboratorio')->pluck('laboratorio')->first() : null,
          'proveedor_material' => $correccion->faseCorreccionOrden ? $correccion->faseCorreccionOrden->whereNotNull('proveedor_material')->pluck('proveedor_material')->first() : null,
          'distancia_od'       => null,
          'altura_od'          => null,
          'distancia_oi'       => null,
          'altura_oi'          => null,
          'codigo_cristal'     => $correccion->codigo_cristal,
          'l_uno'              => '-',
          'l_dos'              => '-',
          'l_tres'             => '-',
          'l_cuatro'           => '-',
          'l_cinco'            => '-',
          'color'              => '_',
          'codigo'             => '_',
          'marca'              => '_',
          'tipo_aro'           => '_',
          'observaciones'      => $correccion->observacion_pedido ?? '_',
          'aro_centevi'        => null,
          'aro_propio'         => null,
        ];
      }

      return $filas;
    };

    // ✅ Sin filtros calculados: paginar directo en DB
    if (!$hayFiltrosCalculados) {
      $ordenesPaginadas = $query->orderBy($sortColumn, $sortOrder)
        ->paginate($limit, ['*'], 'page', $page);

      $data = $ordenesPaginadas->getCollection()->flatMap($buildFilas);

      return response()->json([
        'data' => $data->values(),
        'meta' => [
          'total'         => $ordenesPaginadas->total(),
          'limit'         => $limit,
          'page'          => $page,
          'last_page'     => $ordenesPaginadas->lastPage(),
          'sortColumn'    => $sortColumn,
          'sortOrder'     => $sortOrder,
          'search'        => $search,
          'lenteContacto' => $lenteContacto,
          'estados'       => $estados,
        ],
      ]);
    }

    // Con filtros calculados: traer todo y filtrar en PHP
    $ordenes = $query->orderBy($sortColumn, $sortOrder)
      ->get()
      ->flatMap($buildFilas);

    if (!empty($fase)) {
      $ordenes = $ordenes->whereIn('tipo_fase_orden', (array) $fase)->values();
    }

    if (!empty($estados)) {
      $ordenes = $ordenes->whereIn('estado', (array) $estados)->values();
    }

    $total            = $ordenes->count();
    $ordenesPaginadas = $ordenes->slice(($page - 1) * $limit, $limit)->values();

    return response()->json([
      'data' => $ordenesPaginadas,
      'meta' => [
        'total'         => $total,
        'limit'         => $limit,
        'page'          => $page,
        'last_page'     => ceil($total / $limit),
        'sortColumn'    => $sortColumn,
        'sortOrder'     => $sortOrder,
        'search'        => $search,
        'lenteContacto' => $lenteContacto,
        'estados'       => $estados,
      ],
    ]);
  }

  public function ordenes(Request $request)
  {
    $limit = $request->input('limit', 10);
    $page = $request->input('page', 1);
    $sortColumn = $request->input('sortColumn', 'created_at');
    $sortOrder = $request->input('sortOrder', 'asc');
    $search = $request->input('search', '');
    $lenteContacto = $request->input('lenteContacto', []);
    $status = $request->input('status', []);
    $pagado = $request->input('pagado', []);
    $sucursal = $request->input('sucursal', []);
    $fecha = $request->input('fecha', '');
    $laboratorio = $request->input('laboratorio', []);
    $fase = $request->input('fase', []);

    $validSortColumns = ['id_orden', 'created_at', 'nro_order_id'];
    if (!in_array($sortColumn, $validSortColumns)) {
      $sortColumn = 'id_orden';
    }

    $contadorFasesQuery = DB::table('fases_ordenes')
      ->select(
        'ordenes_id',
        DB::raw('COUNT(*) as total_fases'),
        DB::raw('SUM(1) as fases_completadas')
      )
      ->groupBy('ordenes_id');

    $primeraFaseQuery = DB::table('fases_ordenes as fo')
      ->join('tipos_fases_ordenes as tfo', 'fo.tipo_fase_orden_id', '=', 'tfo.id')
      ->leftJoinSub($contadorFasesQuery, 'contador_fases', 'fo.ordenes_id', '=', 'contador_fases.ordenes_id')
      ->leftJoin('fases_ordenes as fase4', function ($join) {
        $join->on('fo.ordenes_id', '=', 'fase4.ordenes_id')
          ->where('fase4.tipo_fase_orden_id', 4)
          ->where('fase4.status', 1);
      })
      ->select(
        'fo.ordenes_id',
        'fo.laboratorio as laboratorio_primera_fase',
        'fo.observacion as observacion_primera_fase',
        'fo.fecha_fase as fecha_primera_fase',
        'contador_fases.total_fases',
        'contador_fases.fases_completadas',
        DB::raw('DATEDIFF(CURRENT_DATE, fo.fecha_fase) as dias_transcurridos'),
        DB::raw("CASE 
        WHEN contador_fases.total_fases = 4 
            AND contador_fases.fases_completadas = 4 
            AND fase4.ordenes_id IS NOT NULL THEN 'Completado'
        WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) <= 6 THEN 'Ok'
        WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) = 7 THEN 'Advertencia'
        WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) >= 8 THEN 'Critico'
        ELSE 'sin_status'
    END as status_primera_fase")
      )
      ->whereRaw('fo.id = (
            SELECT MIN(id) 
            FROM fases_ordenes 
            WHERE ordenes_id = fo.ordenes_id 
            AND tipo_fase_orden_id = 1
        )');

    $ultimaFaseQuery = DB::table('fases_ordenes as fo')
      ->join('tipos_fases_ordenes as tfo', 'fo.tipo_fase_orden_id', '=', 'tfo.id')
      ->leftJoin('usuarios as u', 'fo.elaborado_por', '=', 'u.id_usuario')
      ->select(
        'fo.ordenes_id',
        DB::raw(
          '
            CASE 
                WHEN fo.status = 1 THEN 
                    CASE 
                        WHEN fo.tipo_fase_orden_id IS NULL THEN 
                            (SELECT tipo_fase_orden 
                             FROM tipos_fases_ordenes 
                             ORDER BY id ASC LIMIT 1)
                        WHEN fo.tipo_fase_orden_id = 4 THEN 
                            tfo.tipo_fase_orden  -- Mantiene el nombre original de la fase "4"
                        ELSE 
                            (SELECT tipo_fase_orden 
                             FROM tipos_fases_ordenes 
                             WHERE id = fo.tipo_fase_orden_id + 1 LIMIT 1)
                    END
                ELSE 
                    tfo.tipo_fase_orden  -- Si el status es 0, mantén la fase actual
            END as fase_actual',
        ),
        'fo.laboratorio as laboratorio_ultima_fase',
        'fo.observacion as observacion_ultima_fase',
        'fo.fecha_fase as fecha_ultima_fase',
        'fo.elaborado_por',
        'u.nombre as elaborado_por_nombre'
      )
      ->whereRaw('fo.id = (
        SELECT MAX(id) 
        FROM fases_ordenes 
        WHERE ordenes_id = fo.ordenes_id
    )');

    $ordenes = Ordenes::with([
      'paciente:id_paciente,nombres,celular,apellidos',
      'sucursal:id_sucursal,nombre,ubicacion,ubicacion_maps',
    ])
      ->leftJoin('usuarios', 'ordenes.elaborado_por', '=', 'usuarios.id_usuario')
      ->leftJoinSub($primeraFaseQuery, 'primeras_fases', 'ordenes.id_orden', '=', 'primeras_fases.ordenes_id')
      ->leftJoinSub($ultimaFaseQuery, 'ultimas_fases', 'ordenes.id_orden', '=', 'ultimas_fases.ordenes_id')
      ->leftJoin('sucursales', 'ordenes.id_sucursal', '=', 'sucursales.id_sucursal')
      ->leftJoin('pacientes', 'ordenes.id_paciente', '=', 'pacientes.id_paciente')
      ->select(
        'ordenes.*',
        'usuarios.nombre as elaborado_por_nombre',
        'primeras_fases.laboratorio_primera_fase as laboratorio',
        'primeras_fases.observacion_primera_fase as observacion',
        'primeras_fases.fecha_primera_fase as fecha_fase',
        'primeras_fases.status_primera_fase as status',
        'primeras_fases.dias_transcurridos as dias_transcurridos',
        'primeras_fases.total_fases as total_fases',
        DB::raw("DATE_FORMAT(ordenes.created_at, '%d-%m-%Y') as created_at_formatted"),
        DB::raw("COALESCE(ultimas_fases.fase_actual, 'Nuevo') as fase_actual"),
        'ultimas_fases.elaborado_por_nombre as elaborado_por_fase'
        // DB::raw('CASE WHEN ultimas_fases.fase_actual IS NULL THEN "Nuevo" ELSE ultimas_fases.fase_actual END as fase_actual')
      );
    if (!empty($search)) {
      $ordenes->where(function ($query) use ($search) {
        $query->where('ordenes.id_orden', 'like', "%{$search}%")
          ->orWhere('usuarios.nombre', 'like', "%{$search}%")
          ->orWhere('ordenes.doctor', 'like', "%{$search}%")
          ->orWhere('ordenes.nro_orden_id', 'like', "%{$search}%")
          ->orWhere('ordenes.created_at', 'like', "%{$search}%")
          ->orWhere('ordenes.pagado', 'like', "%{$search}%")
          ->orWhere('sucursales.nombre', 'like', "%{$search}%")
          ->orWhere('pacientes.nombres', 'like', "%{$search}%")
          ->orWhere('pacientes.apellidos', 'like', "%{$search}%")
          ->orWhere('pacientes.celular', 'like', "%{$search}%")
          ->orWhere('primeras_fases.status_primera_fase', 'like', "%{$search}%")
          ->orWhere('primeras_fases.laboratorio_primera_fase', 'like', "%{$search}%")
          ->orWhereRaw("CASE 
                WHEN ultimas_fases.fase_actual IS NULL THEN 'Nuevo'
                ELSE ultimas_fases.fase_actual 
                END LIKE ?", ["%{$search}%"]);
      });
    }

    if (is_array($lenteContacto) && !empty($lenteContacto)) {
      // Si se selecciona "both", filtra por 0 y 1
      if (in_array('both', $lenteContacto)) {
        $ordenes->whereIn('ordenes.lente_contacto', ['0', '1']);
      } else {
        // Filtra solo por los valores seleccionados (0 o 1)
        $ordenes->whereIn('ordenes.lente_contacto', $lenteContacto);
      }
    }
    if (is_array($fase) && !empty($fase)) {
      $ordenes->where(function ($query) use ($fase) {
        if (in_array('Nuevo', $fase)) {
          // Si busca "Nuevo", debe incluir NULL también
          $query->whereNull('ultimas_fases.fase_actual')
            ->orWhereIn('ultimas_fases.fase_actual', $fase);
        } else {
          $query->whereIn('ultimas_fases.fase_actual', $fase);
        }
      });
    }

    if (is_array($status) && !empty($status)) {
      // Filtrar por valores específicos de status (como Ok, Critico, etc.)
      $ordenes->whereIn('primeras_fases.status_primera_fase', array_filter($status, fn($value) => $value !== null));


      // Si el array contiene null, filtrar por los registros donde el status_primera_fase es null
      if (in_array(null, $status, true)) {
        $ordenes->orWhereNull('primeras_fases.status_primera_fase');
      }
    }

    if (is_array($laboratorio) && !empty($laboratorio)) {
      $ordenes->whereIn('primeras_fases.laboratorio_primera_fase', $laboratorio);
    }

    if (is_array($pagado) && !empty($pagado)) {
      $ordenes->whereIn('ordenes.pagado', $pagado);
    }

    if (is_array($sucursal) && !empty($sucursal)) {
      $ordenes->whereIn('ordenes.id_sucursal', $sucursal);
    }
    if (!empty($fecha)) {
      $dates = explode(' - ', $fecha);
      if (count($dates) === 2) {
        $startDate = $dates[0];
        $endDate = $dates[1];
        $ordenes->whereBetween('ordenes.created_at', [$startDate, $endDate]);
      }
    }

    $paginatedData = $ordenes->orderBy($sortColumn, $sortOrder)
      ->paginate($limit, ['*'], 'page', $page);

    return response()->json([
      'data' => $paginatedData->items(),
      'meta' => [
        'page' => $paginatedData->currentPage(),
        'limit' => $paginatedData->perPage(),
        'total' => $paginatedData->total(),
      ],
      'respuesta' => true,
      'status' => [
        'code' => 200,
        'message' => 'Órdenes retrieved successfully',
      ],
      'mensaje' => 'Órdenes obtenidas correctamente',
    ], 200);
  }

  public function createOrdenes(Request $request)
  {
    $validator = Validator::make($request->all(), [
      "id_paciente" => 'nullable|integer',
      'id_sucursal' => 'nullable|integer',
      'nro_cotizacion' => 'required|integer',
      'nro_factura' => 'nullable|string|max:144',
      'elaborado_por' => 'nullable|integer',
      'esfera_od' => 'nullable|string|max:255',
      'esfera_oi' => 'nullable|string|max:255',
      'cilindro_od' => 'nullable|string|max:255',
      'cilindro_oi' => 'nullable|string|max:255',
      'eje_od' => 'nullable|string|max:255',
      'eje_oi' => 'nullable|string|max:255',
      'add_od' => 'nullable|string|max:255',
      'add_oi' => 'nullable|string|max:255',
      'prisma_od' => 'nullable|string|max:255',
      'prisma_oi' => 'nullable|string|max:255',
      'distancia_od' => 'nullable|string|max:255',
      'distancia_oi' => 'nullable|string|max:255',
      'altura_od' => 'nullable|string|max:255',
      'altura_oi' => 'nullable|string|max:255',
      'tipo_cristal_od' => 'nullable|string|max:255',
      'tipo_cristal_oi' => 'nullable|string|max:255',
      'tipo_corredor' => 'nullable|string|max:255',
      'material_od' => 'nullable|string|max:255',
      'material_oi' => 'nullable|string|max:255',
      'tratamientos_od' => 'nullable|string|max:255',
      'tratamientos_oi' => 'nullable|string|max:255',
      'aro_centevi' => 'nullable|integer|min:0|max:1',
      'aro_propio' => 'nullable|integer|min:0|max:1',
      'codigo_cristal' => 'nullable|string|max:255',
      'color' => 'nullable|string|max:255',
      'marca' => 'nullable|string|max:255',
      'marca_oi' => 'nullable|string|max:255',
      'tipo_aro' => 'nullable|string|max:255',
      'doctor' => 'nullable|string|max:255',
      'observaciones' => 'nullable|string|max:400',
      'l_uno' => 'nullable|string|max:255',
      'l_dos' => 'nullable|string|max:255',
      'l_tres' => 'nullable|string|max:255',
      'l_cuatro' => 'nullable|string|max:255',
      'l_cinco' => 'nullable|string|max:255',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'respuesta' => false,
        'mensaje' => 'Validation errors',
        'data' => $validator->errors(),
        'mensaje_dev' => "Oops, validation errors occurred."
      ], 400);
    }

    try {
      DB::beginTransaction();

      $nroOrden = NroOrden::create([]);

      $defaults = [
        'elaborado_por' => 0,
        'esfera_od' => '',
        'esfera_oi' => '',
        'cilindro_od' => '',
        'cilindro_oi' => '',
        'eje_od' => '',
        'eje_oi' => '',
        'add_od' => '',
        'add_oi' => '',
        'prisma_od' => '',
        'prisma_oi' => '',
        'distancia_od' => '',
        'distancia_oi' => '',
        'altura_od' => '',
        'altura_oi' => '',
        'tipo_cristal_od' => '',
        'tipo_cristal_oi' => '',
        'tipo_corredor' => '',
        'material_od' => '',
        'material_oi' => '',
        'tratamientos_od' => '',
        'tratamientos_oi' => '',
        'aro_centevi' => 0,
        'aro_propio' => 0,
        'codigo_cristal' => '',
        'color' => '',
        'marca' => '',
        'marca_oi' => '',
        'tipo_aro' => '',
        'doctor' => '',
        'observaciones' => '',
        'l_uno' => '',
        'l_dos' => '',
        'l_tres' => '',
        'l_cuatro' => '',
        'l_cinco' => '',
        'pagado' => 2,
        'lente_contacto' => 0,
        'nro_orden_id' => $nroOrden->id,
        'nro_cotizacion' => 0,
        'nro_factura' => ''
      ];

      $tipoCristalOd = $request->input('tipo_cristal_od');
      $tipoCristalOi = $request->input('tipo_cristal_oi');

      $codigoCristal = $tipoCristalOd ? explode(' | ', $tipoCristalOd)[0] : ($tipoCristalOi ? explode(' | ', $tipoCristalOi)[0] : null);

      $data = array_merge($defaults, $request->all(), ['codigo_cristal' => $codigoCristal]);

      $orden = Ordenes::create($data);

      DB::commit();

      return response()->json([
        'respuesta' => true,
        'mensaje' => 'Orden registrada correctamente',
        'data' => [$orden],
        'mensaje_dev' => null
      ], 201);
    } catch (\Exception $e) {
      DB::rollBack();

      return response()->json([
        'respuesta' => false,
        'mensaje' => 'Error al registrar la orden',
        'mensaje_dev' => $e->getMessage()
      ], 500);
    }
  }


  public function updateOrden(Request $request, $id_orden)
  {
    $orden = Ordenes::find($id_orden);

    if (!$orden) {
      return response()->json([
        'respuesta' => false,
        'mensaje' => 'Orden no encontrada',
        'mensaje_dev' => "Order with ID {$id_orden} does not exist",
      ], 404);
    }

    $validator = Validator::make($request->all(), [
      "id_paciente" => 'nullable|integer',
      'id_sucursal' => 'nullable|integer',
      'nro_factura' => 'nullable|string|max:144',
      'elaborado_por' => 'nullable|integer',
      'esfera_od' => 'nullable|string|max:255',
      'esfera_oi' => 'nullable|string|max:255',
      'cilindro_od' => 'nullable|string|max:255',
      'cilindro_oi' => 'nullable|string|max:255',
      'eje_od' => 'nullable|string|max:255',
      'eje_oi' => 'nullable|string|max:255',
      'add_od' => 'nullable|string|max:255',
      'add_oi' => 'nullable|string|max:255',
      'prisma_od' => 'nullable|string|max:255',
      'prisma_oi' => 'nullable|string|max:255',
      'distancia_od' => 'nullable|string|max:255',
      'distancia_oi' => 'nullable|string|max:255',
      'altura_od' => 'nullable|string|max:255',
      'altura_oi' => 'nullable|string|max:255',
      'material_od' => 'nullable|string|max:255',
      'material_oi' => 'nullable|string|max:255',
      'tratamientos_od' => 'nullable|string|max:255',
      'tratamientos_oi' => 'nullable|string|max:255',
      'tipo_cristal_od' => 'nullable|string|max:255',
      'tipo_cristal_oi' => 'nullable|string|max:255',
      'aro_centevi' => 'nullable|integer|min:0|max:1',
      'aro_propio' => 'nullable|integer|min:0|max:1',
      'codigo' => 'nullable|string|max:255',
      'color' => 'nullable|string|max:255',
      'marca' => 'nullable|string|max:255',
      'tipo_aro' => 'nullable|string|max:255',
      'doctor' => 'nullable|string|max:255',
      'observaciones' => 'nullable|string|max:400',
      'l_uno' => 'nullable|string|max:255',
      'l_dos' => 'nullable|string|max:255',
      'l_tres' => 'nullable|string|max:255',
      'l_cuatro' => 'nullable|string|max:255',
      'l_cinco' => 'nullable|string|max:255',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'respuesta' => false,
        'mensaje' => 'Errores de validación',
        'data' => $validator->errors(),
      ], 400);
    }

    try {
      DB::beginTransaction();

      // Extraer los valores de tipo_cristal_od y tipo_cristal_oi
      $tipoCristalOd = $request->input('tipo_cristal_od', $orden->tipo_cristal_od);
      $tipoCristalOi = $request->input('tipo_cristal_oi', $orden->tipo_cristal_oi);

      // Obtener el código del cristal preferentemente de tipo_cristal_od, si no, de tipo_cristal_oi
      $codigoCristal = $tipoCristalOd ? explode(' | ', $tipoCristalOd)[0] : ($tipoCristalOi ? explode(' | ', $tipoCristalOi)[0] : $orden->codigo_cristal);

      // Actualizar los datos
      $orden->update(array_merge($request->all(), ['codigo_cristal' => $codigoCristal]));

      DB::commit();

      return response()->json([
        'respuesta' => true,
        'mensaje' => 'Orden actualizada correctamente',
        'data' => $orden,
      ], 200);
    } catch (\Exception $e) {
      DB::rollBack();

      return response()->json([
        'respuesta' => false,
        'mensaje' => 'Error al actualizar la orden',
        'mensaje_dev' => $e->getMessage(),
      ], 500);
    }
  }


  public function deleteOrden($id_orden)
  {
    $orden = Ordenes::find($id_orden);

    if (!$orden) {
      return response()->json([
        'respuesta' => false,
        'mensaje' => 'Orden no encontrada',
        'mensaje_dev' => "Order with ID {$id_orden} does not exist",
      ], 404);
    }

    try {
      $pedidoId = $orden->id_pedido;

      $orden->delete();

      if ($pedidoId) {
        $pedido = Pedido::find($pedidoId);

        if ($pedido) {
          $otrasOrdenes = Ordenes::where('id_pedido', $pedidoId)->count();
          $otrasCorrecciones = CorrecionesOrdenes::where('id_pedido', $pedidoId)->count();

          if ($otrasOrdenes === 0 && $otrasCorrecciones === 0) {
            $pedido->delete();
          }
        }
      }

      return response()->json([
        'respuesta' => true,
        'mensaje' => 'Orden eliminada correctamente',
        'mensaje_dev' => null,
      ], 200);
    } catch (\Exception $e) {
      return response()->json([
        'respuesta' => false,
        'mensaje' => 'Error al eliminar la orden',
        'mensaje_dev' => $e->getMessage(),
      ], 500);
    }
  }


  public function tipoFasesOrdenes($idOrden)
  {
    $tiposFases = TiposFasesOrdenes::with([
      'fasesOrdenes' => function ($query) use ($idOrden) {
        $query->where('ordenes_id', $idOrden);
      },
      'fasesCorreccionesOrdenes' => function ($query) use ($idOrden) {
        $query->where('correccion_ordenes_id', $idOrden);
      }
    ])->get();

    return response()->json([
      'data' => $tiposFases,
      'status' => [
        'code' => 200
      ],
    ]);
  }


  public function createTiposFasesOrdenes(Request $request)
  {
    $validatedData = $request->validate([
      'tipo_fase_orden' => 'required|string|max:45',
    ]);

    $tipoFaseOrden = TiposFasesOrdenes::create($validatedData);

    return response()->json([
      'message' => 'Tipo de fase de orden creado exitosamente',
      'data' => $tipoFaseOrden,
    ], 201);
  }

  public function fasesOrdenes()
  {
    $fasesOrdenes = FasesOrdenes::with('tipoFaseOrden')->get();
    return response()->json([
      'data' => $fasesOrdenes,
      'status' => [
        'code' => 200
      ]
    ]);
  }

  public function createFasesOrdenes(Request $request)
  {
    $validatedData = $request->validate([
      'tipo_fase_orden_id' => 'required|exists:tipos_fases_ordenes,id',
      'ordenes_id' => 'required|integer',
      'laboratorio' => 'nullable|string|max:45',
      'fecha_fase' => 'nullable|string|max:45',
      'observacion' => 'nullable|string|max:400',
      'proveedor_material' => 'nullable|string|max:255',
      'status' => 'nullable|integer|min:0|max:1',
      'created_at' => 'nullable|date_format:Y-m-d H:i:s',
      'elaborado_por' => 'required|integer',
      'base_ojo_izquierdo_id' => 'nullable|integer',
      'base_ojo_derecho_id' => 'nullable|integer',
    ]);

    DB::beginTransaction();

    try {
      $existingFase = FasesOrdenes::where('ordenes_id', $validatedData['ordenes_id'])
        ->where('tipo_fase_orden_id', $validatedData['tipo_fase_orden_id'])
        ->first();

      if ($existingFase) {
        $updated = $existingFase->update([
          'laboratorio' => $validatedData['laboratorio'],
          'observacion' => $validatedData['observacion'],
          'proveedor_material' => $validatedData['proveedor_material'],
          'fecha_fase' => $validatedData['fecha_fase'],
          'status' => $validatedData['status'] ?? $existingFase->status,
          'created_at' => $validatedData['created_at'] ?? $existingFase->created_at,
          'elaborado_por' => $validatedData['elaborado_por'],
          'base_ojo_izquierdo_id' => $validatedData['base_ojo_izquierdo_id'] ?? null,
          'base_ojo_derecho_id' => $validatedData['base_ojo_derecho_id']  ?? null,
        ]);

        if ($updated && isset($validatedData['status']) && $validatedData['status'] == 0) {
          FasesOrdenes::where('ordenes_id', $validatedData['ordenes_id'])
            ->where('tipo_fase_orden_id', '>', $validatedData['tipo_fase_orden_id'])
            ->delete();
        }

        DB::commit();
        return response()->json([
          'message' => 'Fase de orden actualizada exitosamente',
          'data' => $existingFase,
        ], 200);
      } else {
        $faseOrden = FasesOrdenes::create(array_merge(
          $validatedData,
          ['created_at' => $validatedData['created_at'] ?? now()]
        ));

        DB::commit();
        return response()->json([
          'message' => 'Fase de orden creada exitosamente',
          'data' => $faseOrden,
        ], 201);
      }
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json([
        'message' => 'Error al procesar la fase de orden.',
        'error' => $e->getMessage(),
      ], 500);
    }
  }

  public function updateFasesOrdenes(Request $request, $id)
  {
    // Validar los datos de entrada
    $validatedData = $request->validate([
      'tipo_fase_orden_id' => 'nullable|exists:tipos_fases_ordenes,id',
      'ordenes_id' => 'nullable|integer',
      'laboratorio' => 'nullable|string|max:45',
      'fecha_fase' => 'nullable|string|max:45',
      'observacion' => 'nullable|string|max:400',
      'elaborado_por' => 'nullable|string|max:100', // Agregado
      'created_at' => 'nullable|date_format:Y-m-d H:i:s',
      'updated_at' => 'nullable|date_format:Y-m-d H:i:s',
    ]);

    // Buscar la fase de orden por ID
    $faseOrden = FasesOrdenes::find($id);

    if (!$faseOrden) {
      return response()->json([
        'message' => 'Fase de orden no encontrada.',
      ], 404);
    }

    try {
      // Actualizar los datos del registro
      $faseOrden->update(array_filter($validatedData)); // array_filter elimina valores nulos

      return response()->json([
        'message' => 'Fase de orden actualizada exitosamente.',
        'data' => $faseOrden,
      ], 200);
    } catch (\Exception $e) {
      return response()->json([
        'message' => 'Error al actualizar la fase de orden. Inténtalo nuevamente.',
        'error' => $e->getMessage(),
      ], 500);
    }
  }

  public function reportesOrdenes(Request $request)
  {
    $limit = $request->input('limit', 10);
    $page = $request->input('page', 1);
    $sortColumn = $request->input('sortColumn', 'created_at_formatted');
    $sortOrder = $request->input('sortOrder', 'asc');
    $search = $request->input('search', '');
    $fecha = $request->input('fecha', '');
    $status = $request->input('status', '');
    $lenteContacto = $request->input('lenteContacto', '');
    $laboratorio = $request->input('laboratorio', '');
    $pagado = $request->input('pagado', '');
    $sucursales = $request->input('sucursales', '');
    $doctor = $request->input('doctor', '');
    $asesor = $request->input('asesor', '');

    $validSortColumns = [
      'id_orden',
      'created_at_formatted',
      'laboratorio',
      'status',
      'lente_contacto',
      'doctor',
      'pagado',
      'nro_orden_id',
      'tipo_cristal_od_codigo',
      'tipo_cristal_oi_codigo'
    ];
    if (!in_array($sortColumn, $validSortColumns)) {
      $sortColumn = 'id_orden';
    }

    $contadorFasesQuery = DB::table('fases_ordenes')
      ->select(
        'ordenes_id',
        DB::raw('COUNT(*) as total_fases'),
        DB::raw('SUM(1) as fases_completadas')
      )
      ->groupBy('ordenes_id');

    $contadorFasesQueryCorrecciones = DB::table('fases_correcciones_ordenes')
      ->select(
        'correccion_ordenes_id',
        DB::raw('COUNT(*) as total_fases'),
        DB::raw('SUM(1) as fases_completadas')
      )
      ->groupBy('correccion_ordenes_id');

    $primeraFaseQuery = DB::table('fases_ordenes as fo')
      ->join('tipos_fases_ordenes as tfo', 'fo.tipo_fase_orden_id', '=', 'tfo.id')
      ->leftJoinSub($contadorFasesQuery, 'contador_fases', 'fo.ordenes_id', '=', 'contador_fases.ordenes_id')
      ->leftJoin('fases_ordenes as fase4', function ($join) {
        $join->on('fo.ordenes_id', '=', 'fase4.ordenes_id')
          ->where('fase4.tipo_fase_orden_id', 4)
          ->where('fase4.status', 1);
      })
      ->select(
        'fo.ordenes_id',
        'fo.laboratorio as laboratorio_primera_fase',
        'fo.observacion as observacion_primera_fase',
        'fo.fecha_fase as fecha_primera_fase',
        'contador_fases.total_fases',
        'contador_fases.fases_completadas',
        DB::raw('DATEDIFF(CURRENT_DATE, fo.fecha_fase) as dias_transcurridos'),
        DB::raw("CASE 
        WHEN contador_fases.total_fases = 4 
            AND contador_fases.fases_completadas = 4 
            AND fase4.ordenes_id IS NOT NULL THEN 'Completado'
        WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) <= 6 THEN 'Ok'
        WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) = 7 THEN 'Advertencia'
        WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) >= 8 THEN 'Critico'
        ELSE 'sin_status'
    END as status_primera_fase"),
        DB::raw('CASE 
            WHEN contador_fases.total_fases = 4 THEN 0
            WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) <= 6 THEN 1
            WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) = 7 THEN 2
            WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) >= 8 THEN 3
            ELSE 4
        END as status_weight')

      )
      ->whereRaw('fo.id = (
            SELECT MIN(id) 
            FROM fases_ordenes 
            WHERE ordenes_id = fo.ordenes_id 
            AND tipo_fase_orden_id = 1
        )');
    $ultimaFaseQuery = DB::table('fases_ordenes as fo')
      ->join('tipos_fases_ordenes as tfo', 'fo.tipo_fase_orden_id', '=', 'tfo.id')
      ->select(
        'fo.ordenes_id',
        DB::raw(
          '
          CASE 
              WHEN fo.status = 1 THEN 
                  CASE 
                      WHEN fo.tipo_fase_orden_id IS NULL THEN 
                          (SELECT tipo_fase_orden 
                           FROM tipos_fases_ordenes 
                           ORDER BY id ASC LIMIT 1)
                      WHEN fo.tipo_fase_orden_id = 4 THEN 
                          tfo.tipo_fase_orden  -- Mantiene el nombre original de la fase "4"
                      ELSE 
                          (SELECT tipo_fase_orden 
                           FROM tipos_fases_ordenes 
                           WHERE id = fo.tipo_fase_orden_id + 1 LIMIT 1)
                  END
              ELSE 
                  tfo.tipo_fase_orden  -- Si el status es 0, mantén la fase actual
          END as fase_actual',
        ),
        'fo.laboratorio as laboratorio_ultima_fase',
        'fo.observacion as observacion_ultima_fase',
        'fo.fecha_fase as fecha_ultima_fase'
      )
      ->whereRaw('fo.id = (
      SELECT MAX(id) 
      FROM fases_ordenes 
      WHERE ordenes_id = fo.ordenes_id
  )');

    $primeraFaseCorreccionQuery = DB::table('fases_correcciones_ordenes as fo')
      ->join('tipos_fases_ordenes as tfo', 'fo.tipo_fase_correccion_orden_id', '=', 'tfo.id')
      ->leftJoinSub($contadorFasesQueryCorrecciones, 'contador_fases', 'fo.correccion_ordenes_id', '=', 'contador_fases.correccion_ordenes_id')
      ->select(
        'fo.correccion_ordenes_id',
        'fo.laboratorio as laboratorio_primera_fase',
        'fo.observacion as observacion_primera_fase',
        'fo.fecha_fase as fecha_primera_fase',
        'contador_fases.total_fases',
        'contador_fases.fases_completadas',
        DB::raw('DATEDIFF(CURRENT_DATE, fo.fecha_fase) as dias_transcurridos'),
        DB::raw('CASE 
                WHEN contador_fases.total_fases = 4 AND contador_fases.fases_completadas = 4 THEN "Completado"
                WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) <= 6 THEN "Ok"
                WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) = 7 THEN "Advertencia"
                WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) >= 8 THEN "Critico"
                ELSE "sin_status"
            END as status_primera_fase')
      )
      ->whereRaw('fo.id = (
        SELECT MIN(id) 
        FROM fases_correcciones_ordenes 
        WHERE correccion_ordenes_id = fo.correccion_ordenes_id 
        AND tipo_fase_correccion_orden_id = 1
    )');

    $ultimaFaseCorreccionQuery = DB::table('fases_correcciones_ordenes as fo')
      ->join('tipos_fases_ordenes as tfo', 'fo.tipo_fase_correccion_orden_id', '=', 'tfo.id')
      ->select(
        'fo.correccion_ordenes_id',
        DB::raw(
          '
            CASE 
                WHEN fo.status = 1 THEN 
                    CASE 
                        WHEN fo.tipo_fase_correccion_orden_id IS NULL THEN 
                            (SELECT tipo_fase_orden FROM tipos_fases_ordenes ORDER BY id ASC LIMIT 1)
                        WHEN fo.tipo_fase_correccion_orden_id = 4 THEN 
                            tfo.tipo_fase_orden
                        ELSE 
                            (SELECT tipo_fase_orden FROM tipos_fases_ordenes WHERE id = fo.tipo_fase_correccion_orden_id + 1 LIMIT 1)
                    END
                ELSE 
                    tfo.tipo_fase_orden
            END as fase_actual'
        ),
        'fo.laboratorio as laboratorio_ultima_fase',
        'fo.observacion as observacion_ultima_fase',
        'fo.fecha_fase as fecha_ultima_fase'
      )
      ->whereRaw('fo.id = (
        SELECT MAX(id) 
        FROM fases_correcciones_ordenes 
        WHERE correccion_ordenes_id = fo.correccion_ordenes_id
    )');

    $ordenes = Ordenes::with([
      'paciente:id_paciente,nombres,celular,apellidos',
      'sucursal:id_sucursal,nombre',
      'correciones' => function ($query) use ($primeraFaseCorreccionQuery, $ultimaFaseCorreccionQuery) {
        $query->select(
          'correciones_ordenes.*',
          'usuarios.nombre as elaborado_por_nombre',
          'ordenes.nro_orden_id',
          'ordenes.lente_contacto',
          'sucursales.nombre as nombre_sucursal',
          'primeras_fases.laboratorio_primera_fase as laboratorio',
          'primeras_fases.observacion_primera_fase as observacion',
          'primeras_fases.fecha_primera_fase as fecha_fase',
          'primeras_fases.status_primera_fase as status',
          'primeras_fases.dias_transcurridos',
          'primeras_fases.total_fases',
          DB::raw("CASE WHEN ordenes.pagado = 1 THEN 'Sí' ELSE 'No' END AS pagado_nombre"),
          DB::raw('SUBSTRING_INDEX(correciones_ordenes.tipo_cristal_od, " | ", 1) as tipo_cristal_od_codigo'),
          DB::raw('SUBSTRING_INDEX(correciones_ordenes.tipo_cristal_oi, " | ", 1) as tipo_cristal_oi_codigo'),
          DB::raw('CASE WHEN ultimas_fases.fase_actual IS NULL THEN "Nuevo" ELSE ultimas_fases.fase_actual END as fase_actual'),
          DB::raw("CONCAT(
                ordenes.nro_orden_id, 
                '-C', 
                ROW_NUMBER() OVER (PARTITION BY correciones_ordenes.ordenes_id ORDER BY correciones_ordenes.created_at)
            ) as correcion_format")
        )
          ->join('ordenes', 'correciones_ordenes.ordenes_id', '=', 'ordenes.id_orden')
          ->join('sucursales', 'ordenes.id_sucursal', '=', 'sucursales.id_sucursal')
          ->join('usuarios', 'correciones_ordenes.elaborado_por', '=', 'usuarios.id_usuario')
          ->leftJoinSub($primeraFaseCorreccionQuery, 'primeras_fases', 'correciones_ordenes.id', '=', 'primeras_fases.correccion_ordenes_id')
          ->leftJoinSub($ultimaFaseCorreccionQuery, 'ultimas_fases', 'correciones_ordenes.id', '=', 'ultimas_fases.correccion_ordenes_id');
      }
    ])
      ->leftJoin('usuarios', 'ordenes.elaborado_por', '=', 'usuarios.id_usuario')
      ->leftJoinSub($primeraFaseQuery, 'primeras_fases', 'ordenes.id_orden', '=', 'primeras_fases.ordenes_id')
      ->leftJoinSub($ultimaFaseQuery, 'ultimas_fases', 'ordenes.id_orden', '=', 'ultimas_fases.ordenes_id')
      ->select(
        'ordenes.id_orden',
        'ordenes.nro_orden',
        'ordenes.id_paciente',
        'ordenes.id_sucursal',
        'ordenes.nro_orden_id',
        'ordenes.pagado',
        'ordenes.doctor',
        'ordenes.lente_contacto',
        'ordenes.tipo_cristal_od',
        'ordenes.tipo_cristal_oi',
        'primeras_fases.status_primera_fase as status',
        'usuarios.nombre as elaborado_por_nombre',
        DB::raw('SUBSTRING_INDEX(ordenes.tipo_cristal_od, " | ", 1) as tipo_cristal_od_codigo'),
        DB::raw('SUBSTRING_INDEX(ordenes.tipo_cristal_oi, " | ", 1) as tipo_cristal_oi_codigo'),
        DB::raw('COALESCE(primeras_fases.laboratorio_primera_fase, "") as laboratorio'),
        DB::raw('CASE WHEN ultimas_fases.fase_actual IS NULL THEN "Nuevo" ELSE ultimas_fases.fase_actual END as fase_actual'),
        DB::raw("CASE WHEN pagado = 1 THEN 'Sí' ELSE 'No' END AS pagado_nombre"),
        DB::raw("DATE_FORMAT(ordenes.created_at, '%d-%m-%Y') as created_at_formatted")
      );

    if (!empty($search)) {
      $ordenes->where(function ($query) use ($search) {
        $query->where('ordenes.id_orden', 'like', "%{$search}%")
          ->orWhere('usuarios.nombre', 'like', "%{$search}%")
          ->orWhere('ordenes.nro_orden_id', 'like', "%{$search}%")
          ->orWhere('ordenes.doctor', 'like', "%{$search}%")
          ->orWhere('ordenes.created_at', 'like', "%{$search}%")
          ->orWhere('ordenes.pagado', 'like', "%{$search}%")
          ->orWhere(DB::raw('SUBSTRING_INDEX(ordenes.tipo_cristal_od, " | ", 1)'), 'like', "%{$search}%")
          ->orWhere(DB::raw('SUBSTRING_INDEX(ordenes.tipo_cristal_oi, " | ", 1)'), 'like', "%{$search}%");
      });
    }
    if (!empty($fecha)) {
      $dates = explode(' - ', $fecha);
      if (count($dates) === 2) {
        $startDate = $dates[0];
        $endDate = $dates[1];
        $ordenes->whereBetween('ordenes.created_at', [$startDate, $endDate]);
      }
    }

    if ($status !== '') {
      // Validate status input
      $validStatuses = ['Ok', 'Advertencia', 'Critico', 'Completado', 'null'];

      if (in_array($status, $validStatuses)) {
        if ($status === 'null') {
          // When status is 'null', filter for orders without a status
          $ordenes->whereNull('primeras_fases.status_primera_fase');
        } else {
          // Filter for specific status
          $ordenes->where('primeras_fases.status_primera_fase', $status);
        }
      }
    }

    if (!empty($sucursales)) {
      $ordenes->where('ordenes.id_sucursal', $sucursales);
    }

    if (!empty($doctor)) {
      $ordenes->where('ordenes.doctor', $doctor);
    }

    if (!empty($asesor)) {
      $ordenes->where('usuarios.nombre', $asesor);
    }

    if ($laboratorio !== '') {
      // Validar valores permitidos para laboratorio
      $validLaboratorios = ['Ping', 'Optilab', 'Centilab', 'Vista Pro', 'Haseth J&J', 'Alcon', 'B+L'];

      if (in_array($laboratorio, $validLaboratorios)) {
        // Filtrar por laboratorio específico
        $ordenes->where('primeras_fases.laboratorio_primera_fase', $laboratorio);
      } elseif ($laboratorio === 'null') {
        // Filtrar por órdenes que no tienen laboratorio (NULL)
        $ordenes->whereNull('primeras_fases.laboratorio_primera_fase');
      }
    }

    if ($lenteContacto !== '') {
      // Convert to boolean for strict comparison
      $lenteContactoValue = filter_var($lenteContacto, FILTER_VALIDATE_BOOLEAN);

      if ($lenteContacto === '1' || $lenteContacto === true) {
        // Only show lente de contacto orders
        $ordenes->where('ordenes.lente_contacto', true);
      } elseif ($lenteContacto === '0' || $lenteContacto === false) {
        // Only show non-lente de contacto orders
        $ordenes->where('ordenes.lente_contacto', false);
      }
      // If empty string, show all orders (no filter applied)
    }

    if ($pagado !== '') {
      if ($pagado === '1') {
        $ordenes->where('ordenes.pagado', '1');
      } elseif ($pagado === '0') {
        $ordenes->where('ordenes.pagado', '0');
      } elseif ($pagado === '2') {
        $ordenes->where('ordenes.pagado', '2');
      }
    }

    $dataexport = $ordenes->orderBy($sortColumn, $sortOrder)->get();


    $paginatedData = $ordenes->orderBy($sortColumn, $sortOrder)
      ->paginate($limit, ['*'], 'page', $page);

    return response()->json([
      'data' => $paginatedData->items(),
      'meta' => [
        'page' => $paginatedData->currentPage(),
        'limit' => $paginatedData->perPage(),
        'total' => $paginatedData->total(),
      ],
      'export' => [
        'dataexport' => $dataexport
      ],
      'respuesta' => true,
      'status' => [
        'code' => 200,
        'message' => 'Órdenes retrieved successfully',
      ],
      'mensaje' => 'Órdenes obtenidas correctamente',
    ], 200);
  }
  public function reportesOrdenes2(Request $request)
  {
    $limit = $request->input('limit', 10);
    $page = $request->input('page', 1);
    $sortColumn = $request->input('sortColumn', 'created_at_formatted');
    $sortOrder = $request->input('sortOrder', 'asc');
    $search = $request->input('search', '');
    $fecha = $request->input('fecha', '');
    $status = $request->input('status', '');
    $lenteContacto = $request->input('lenteContacto', '');
    $laboratorio = $request->input('laboratorio', '');
    $pagado = $request->input('pagado', '');
    $sucursales = $request->input('sucursales', '');
    $doctor = $request->input('doctor', '');
    $asesor = $request->input('asesor', '');

    $validSortColumns = [
      'id_orden',
      'created_at_formatted',
      'laboratorio',
      'status',
      'lente_contacto',
      'doctor',
      'pagado',
      'nro_orden_id',
      'tipo_cristal_od_codigo',
      'tipo_cristal_oi_codigo'
    ];
    if (!in_array($sortColumn, $validSortColumns)) {
      $sortColumn = 'id_orden';
    }

    $contadorFasesQuery = DB::table('fases_ordenes')
      ->select(
        'ordenes_id',
        DB::raw('COUNT(*) as total_fases'),
        DB::raw('SUM(1) as fases_completadas')
      )
      ->groupBy('ordenes_id');

    $contadorFasesQueryCorrecciones = DB::table('fases_correcciones_ordenes')
      ->select(
        'correccion_ordenes_id',
        DB::raw('COUNT(*) as total_fases'),
        DB::raw('SUM(1) as fases_completadas')
      )
      ->groupBy('correccion_ordenes_id');

    $primeraFaseQuery = DB::table('fases_ordenes as fo')
      ->join('tipos_fases_ordenes as tfo', 'fo.tipo_fase_orden_id', '=', 'tfo.id')
      ->leftJoinSub($contadorFasesQuery, 'contador_fases', 'fo.ordenes_id', '=', 'contador_fases.ordenes_id')
      ->leftJoin('fases_ordenes as fase4', function ($join) {
        $join->on('fo.ordenes_id', '=', 'fase4.ordenes_id')
          ->where('fase4.tipo_fase_orden_id', 4)
          ->where('fase4.status', 1);
      })
      ->select(
        'fo.ordenes_id',
        'fo.laboratorio as laboratorio_primera_fase',
        'fo.observacion as observacion_primera_fase',
        'fo.fecha_fase as fecha_primera_fase',
        'contador_fases.total_fases',
        'contador_fases.fases_completadas',
        DB::raw('DATEDIFF(CURRENT_DATE, fo.fecha_fase) as dias_transcurridos'),
        DB::raw("CASE 
        WHEN contador_fases.total_fases = 4 
            AND contador_fases.fases_completadas = 4 
            AND fase4.ordenes_id IS NOT NULL THEN 'Completado'
        WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) <= 6 THEN 'Ok'
        WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) = 7 THEN 'Advertencia'
        WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) >= 8 THEN 'Critico'
        ELSE 'sin_status'
    END as status_primera_fase"),
        DB::raw('CASE 
            WHEN contador_fases.total_fases = 4 THEN 0
            WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) <= 6 THEN 1
            WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) = 7 THEN 2
            WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) >= 8 THEN 3
            ELSE 4
        END as status_weight')

      )
      ->whereRaw('fo.id = (
            SELECT MIN(id) 
            FROM fases_ordenes 
            WHERE ordenes_id = fo.ordenes_id 
            AND tipo_fase_orden_id = 1
        )');
    $ultimaFaseQuery = DB::table('fases_ordenes as fo')
      ->join('tipos_fases_ordenes as tfo', 'fo.tipo_fase_orden_id', '=', 'tfo.id')
      ->select(
        'fo.ordenes_id',
        DB::raw(
          '
          CASE 
              WHEN fo.status = 1 THEN 
                  CASE 
                      WHEN fo.tipo_fase_orden_id IS NULL THEN 
                          (SELECT tipo_fase_orden 
                           FROM tipos_fases_ordenes 
                           ORDER BY id ASC LIMIT 1)
                      WHEN fo.tipo_fase_orden_id = 4 THEN 
                          tfo.tipo_fase_orden  -- Mantiene el nombre original de la fase "4"
                      ELSE 
                          (SELECT tipo_fase_orden 
                           FROM tipos_fases_ordenes 
                           WHERE id = fo.tipo_fase_orden_id + 1 LIMIT 1)
                  END
              ELSE 
                  tfo.tipo_fase_orden  -- Si el status es 0, mantén la fase actual
          END as fase_actual',
        ),
        'fo.laboratorio as laboratorio_ultima_fase',
        'fo.observacion as observacion_ultima_fase',
        'fo.fecha_fase as fecha_ultima_fase'
      )
      ->whereRaw('fo.id = (
      SELECT MAX(id) 
      FROM fases_ordenes 
      WHERE ordenes_id = fo.ordenes_id
  )');

    $primeraFaseCorreccionQuery = DB::table('fases_correcciones_ordenes as fo')
      ->join('tipos_fases_ordenes as tfo', 'fo.tipo_fase_correccion_orden_id', '=', 'tfo.id')
      ->leftJoinSub($contadorFasesQueryCorrecciones, 'contador_fases', 'fo.correccion_ordenes_id', '=', 'contador_fases.correccion_ordenes_id')
      ->select(
        'fo.correccion_ordenes_id',
        'fo.laboratorio as laboratorio_primera_fase',
        'fo.observacion as observacion_primera_fase',
        'fo.fecha_fase as fecha_primera_fase',
        'contador_fases.total_fases',
        'contador_fases.fases_completadas',
        DB::raw('DATEDIFF(CURRENT_DATE, fo.fecha_fase) as dias_transcurridos'),
        DB::raw('CASE 
                WHEN contador_fases.total_fases = 4 AND contador_fases.fases_completadas = 4 THEN "Completado"
                WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) <= 6 THEN "Ok"
                WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) = 7 THEN "Advertencia"
                WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) >= 8 THEN "Critico"
                ELSE "sin_status"
            END as status_primera_fase')
      )
      ->whereRaw('fo.id = (
        SELECT MIN(id) 
        FROM fases_correcciones_ordenes 
        WHERE correccion_ordenes_id = fo.correccion_ordenes_id 
        AND tipo_fase_correccion_orden_id = 1
    )');

    $ultimaFaseCorreccionQuery = DB::table('fases_correcciones_ordenes as fo')
      ->join('tipos_fases_ordenes as tfo', 'fo.tipo_fase_correccion_orden_id', '=', 'tfo.id')
      ->select(
        'fo.correccion_ordenes_id',
        DB::raw(
          '
            CASE 
                WHEN fo.status = 1 THEN 
                    CASE 
                        WHEN fo.tipo_fase_correccion_orden_id IS NULL THEN 
                            (SELECT tipo_fase_orden FROM tipos_fases_ordenes ORDER BY id ASC LIMIT 1)
                        WHEN fo.tipo_fase_correccion_orden_id = 4 THEN 
                            tfo.tipo_fase_orden
                        ELSE 
                            (SELECT tipo_fase_orden FROM tipos_fases_ordenes WHERE id = fo.tipo_fase_correccion_orden_id + 1 LIMIT 1)
                    END
                ELSE 
                    tfo.tipo_fase_orden
            END as fase_actual'
        ),
        'fo.laboratorio as laboratorio_ultima_fase',
        'fo.observacion as observacion_ultima_fase',
        'fo.fecha_fase as fecha_ultima_fase'
      )
      ->whereRaw('fo.id = (
        SELECT MAX(id) 
        FROM fases_correcciones_ordenes 
        WHERE correccion_ordenes_id = fo.correccion_ordenes_id
    )');

    $ordenes = Ordenes::with([
      'paciente:id_paciente,nombres,celular,apellidos',
      'sucursal:id_sucursal,nombre',
      'correciones' => function ($query) use ($primeraFaseCorreccionQuery, $ultimaFaseCorreccionQuery) {
        $query->select(
          'correciones_ordenes.*',
          'usuarios.nombre as elaborado_por_nombre',
          'ordenes.nro_orden_id',
          'ordenes.lente_contacto',
          'sucursales.nombre as nombre_sucursal',
          'primeras_fases.laboratorio_primera_fase as laboratorio',
          'primeras_fases.observacion_primera_fase as observacion',
          'primeras_fases.fecha_primera_fase as fecha_fase',
          'primeras_fases.status_primera_fase as status',
          'primeras_fases.dias_transcurridos',
          'primeras_fases.total_fases',
          DB::raw("CASE WHEN ordenes.pagado = 1 THEN 'Sí' ELSE 'No' END AS pagado_nombre"),
          DB::raw('SUBSTRING_INDEX(correciones_ordenes.tipo_cristal_od, " | ", 1) as tipo_cristal_od_codigo'),
          DB::raw('SUBSTRING_INDEX(correciones_ordenes.tipo_cristal_oi, " | ", 1) as tipo_cristal_oi_codigo'),
          DB::raw('CASE WHEN ultimas_fases.fase_actual IS NULL THEN "Nuevo" ELSE ultimas_fases.fase_actual END as fase_actual'),
          DB::raw("CONCAT(
                ordenes.nro_orden_id, 
                '-C', 
                ROW_NUMBER() OVER (PARTITION BY correciones_ordenes.ordenes_id ORDER BY correciones_ordenes.created_at)
            ) as correcion_format")
        )
          ->join('ordenes', 'correciones_ordenes.ordenes_id', '=', 'ordenes.id_orden')
          ->join('sucursales', 'ordenes.id_sucursal', '=', 'sucursales.id_sucursal')
          ->join('usuarios', 'correciones_ordenes.elaborado_por', '=', 'usuarios.id_usuario')
          ->leftJoinSub($primeraFaseCorreccionQuery, 'primeras_fases', 'correciones_ordenes.id', '=', 'primeras_fases.correccion_ordenes_id')
          ->leftJoinSub($ultimaFaseCorreccionQuery, 'ultimas_fases', 'correciones_ordenes.id', '=', 'ultimas_fases.correccion_ordenes_id');
      }
    ])
      ->leftJoin('usuarios', 'ordenes.elaborado_por', '=', 'usuarios.id_usuario')
      ->leftJoinSub($primeraFaseQuery, 'primeras_fases', 'ordenes.id_orden', '=', 'primeras_fases.ordenes_id')
      ->leftJoinSub($ultimaFaseQuery, 'ultimas_fases', 'ordenes.id_orden', '=', 'ultimas_fases.ordenes_id')
      ->select(
        'ordenes.id_orden',
        'ordenes.nro_orden',
        'ordenes.id_paciente',
        'ordenes.id_sucursal',
        'ordenes.nro_orden_id',
        'ordenes.pagado',
        'ordenes.doctor',
        'ordenes.lente_contacto',
        'ordenes.tipo_cristal_od',
        'ordenes.tipo_cristal_oi',
        'primeras_fases.status_primera_fase as status',
        'usuarios.nombre as elaborado_por_nombre',
        DB::raw('SUBSTRING_INDEX(ordenes.tipo_cristal_od, " | ", 1) as tipo_cristal_od_codigo'),
        DB::raw('SUBSTRING_INDEX(ordenes.tipo_cristal_oi, " | ", 1) as tipo_cristal_oi_codigo'),
        DB::raw('COALESCE(primeras_fases.laboratorio_primera_fase, "") as laboratorio'),
        DB::raw('CASE WHEN ultimas_fases.fase_actual IS NULL THEN "Nuevo" ELSE ultimas_fases.fase_actual END as fase_actual'),
        DB::raw("CASE WHEN pagado = 1 THEN 'Sí' ELSE 'No' END AS pagado_nombre"),
        DB::raw("DATE_FORMAT(ordenes.created_at, '%d-%m-%Y') as created_at_formatted")
      );

    if (!empty($search)) {
      $ordenes->where(function ($query) use ($search) {
        $query->where('ordenes.id_orden', 'like', "%{$search}%")
          ->orWhere('usuarios.nombre', 'like', "%{$search}%")
          ->orWhere('ordenes.nro_orden_id', 'like', "%{$search}%")
          ->orWhere('ordenes.doctor', 'like', "%{$search}%")
          ->orWhere('ordenes.created_at', 'like', "%{$search}%")
          ->orWhere('ordenes.pagado', 'like', "%{$search}%")
          ->orWhere(DB::raw('SUBSTRING_INDEX(ordenes.tipo_cristal_od, " | ", 1)'), 'like', "%{$search}%")
          ->orWhere(DB::raw('SUBSTRING_INDEX(ordenes.tipo_cristal_oi, " | ", 1)'), 'like', "%{$search}%");
      });
    }
    if (!empty($fecha)) {
      $dates = explode(' - ', $fecha);
      if (count($dates) === 2) {
        $startDate = $dates[0];
        $endDate = $dates[1];
        $ordenes->whereBetween('ordenes.created_at', [$startDate, $endDate]);
      }
    }

    if ($status !== '') {
      // Validate status input
      $validStatuses = ['Ok', 'Advertencia', 'Critico', 'Completado', 'null'];

      if (in_array($status, $validStatuses)) {
        if ($status === 'null') {
          // When status is 'null', filter for orders without a status
          $ordenes->whereNull('primeras_fases.status_primera_fase');
        } else {
          // Filter for specific status
          $ordenes->where('primeras_fases.status_primera_fase', $status);
        }
      }
    }

    if (!empty($sucursales)) {
      $ordenes->where('ordenes.id_sucursal', $sucursales);
    }

    if (!empty($doctor)) {
      $ordenes->where('ordenes.doctor', $doctor);
    }

    if (!empty($asesor)) {
      $ordenes->where('usuarios.nombre', $asesor);
    }

    if ($laboratorio !== '') {
      // Validar valores permitidos para laboratorio
      $validLaboratorios = ['Ping', 'Optilab', 'Centilab', 'Vista Pro', 'Haseth J&J', 'Alcon', 'B+L'];

      if (in_array($laboratorio, $validLaboratorios)) {
        // Filtrar por laboratorio específico
        $ordenes->where('primeras_fases.laboratorio_primera_fase', $laboratorio);
      } elseif ($laboratorio === 'null') {
        // Filtrar por órdenes que no tienen laboratorio (NULL)
        $ordenes->whereNull('primeras_fases.laboratorio_primera_fase');
      }
    }

    if ($lenteContacto !== '') {
      // Convert to boolean for strict comparison
      $lenteContactoValue = filter_var($lenteContacto, FILTER_VALIDATE_BOOLEAN);

      if ($lenteContacto === '1' || $lenteContacto === true) {
        // Only show lente de contacto orders
        $ordenes->where('ordenes.lente_contacto', true);
      } elseif ($lenteContacto === '0' || $lenteContacto === false) {
        // Only show non-lente de contacto orders
        $ordenes->where('ordenes.lente_contacto', false);
      }
      // If empty string, show all orders (no filter applied)
    }

    if ($pagado !== '') {
      if ($pagado === '1') {
        $ordenes->where('ordenes.pagado', '1');
      } elseif ($pagado === '0') {
        $ordenes->where('ordenes.pagado', '0');
      } elseif ($pagado === '2') {
        $ordenes->where('ordenes.pagado', '2');
      }
    }

    $dataexport = $ordenes->orderBy($sortColumn, $sortOrder)->get();


    $paginatedData = $ordenes->orderBy($sortColumn, $sortOrder)
      ->paginate($limit, ['*'], 'page', $page);

    return response()->json([
      'data' => $paginatedData->items(),
      'meta' => [
        'page' => $paginatedData->currentPage(),
        'limit' => $paginatedData->perPage(),
        'total' => $paginatedData->total(),
      ],
      'export' => [
        'dataexport' => $dataexport
      ],
      'respuesta' => true,
      'status' => [
        'code' => 200,
        'message' => 'Órdenes retrieved successfully',
      ],
      'mensaje' => 'Órdenes obtenidas correctamente',
    ], 200);
  }

  public function reporteOrdenes(Request $request)
  {
    $search = $request->input('search', '');
    $limit = $request->input('limit', 20);
    $page = (int) $request->input('page', 1);
    $sortColumn = $request->input('sortColumn', 'id_orden');
    $sortOrder = $request->input('sortOrder', 'asc');
    $fecha = $request->input('fecha', '');

    $validColumns = ['id_orden', 'nro_orden_id', 'created_at', 'paciente', 'sucursal'];
    if (!in_array($sortColumn, $validColumns)) {
      $sortColumn = 'id_orden';
    }
    $sortOrder = $sortOrder === 'desc' ? 'desc' : 'asc';

    $query = Ordenes::with([
      'paciente:id_paciente,nombres,celular,apellidos,doctor',
      'sucursal:id_sucursal,nombre,ubicacion,ubicacion_maps',
      'fasesOrdenes.tipoFaseOrden',
      'fasesOrdenes.usuario',
      'correciones'
    ]);

    if (!empty($search)) {
      $query->where(function ($q) use ($search) {
        $q->where('id_orden', 'like', "%$search%")
          ->orWhere('nro_orden_id', 'like', "%$search%")
          ->orWhere('created_at', 'like', "%$search%")
          ->orWhereHas('paciente', function ($q) use ($search) {
            $q->whereRaw("REPLACE(TRIM(CONCAT(nombres, ' ', apellidos)), '  ', ' ') LIKE ?", ["%$search%"])
              ->orWhereRaw("REPLACE(TRIM(CONCAT(apellidos, ' ', nombres)), '  ', ' ') LIKE ?", ["%$search%"])
              ->orWhere('celular', 'like', "%$search%");
          })
          ->orWhereHas('sucursal', function ($q) use ($search) {
            $q->where('nombre', 'like', "%$search%");
          });
      });
    }

    if (!empty($fecha)) {
      $fechas = explode(' - ', $fecha);
      if (count($fechas) === 2) {
        $fechaInicio = trim($fechas[0]);
        $fechaFin = trim($fechas[1]);

        if (strtotime($fechaInicio) && strtotime($fechaFin)) {
          $query->whereBetween('created_at', [$fechaInicio . ' 00:00:00', $fechaFin . ' 23:59:59']);
        }
      }
    }

    $ordenes = $query->orderBy($sortColumn, $sortOrder)->get();

    $estadisticas = [
      'estados' => [
        'Completado' => 0,
        'OK' => 0,
        'Advertencia' => 0,
        'Crítico' => 0,
        'Sin estado' => 0,
      ],
      'lentes' => [
        'contacto' => 0,
        'normales' => 0,
      ],
      'laboratorios' => [],
      'pagos' => [
        'Pagado' => 0,
        'Cortesía' => 0,
        'Abonado' => 0
      ],
      'doctores' => [],
      'sucursales' => [],
      'asesores' => []
    ];

    $ordenes = $ordenes->map(function ($orden) use (&$estadisticas) {
      $ultimaFase = $orden->fasesOrdenes->sortByDesc('tipo_fase_orden_id')->first();

      $estado = 'Sin estado';

      if (!$ultimaFase) {
      } else {
        $diasDiferencia = now()->diffInDays($ultimaFase->fecha_fase);

        if ($ultimaFase->tipo_fase_orden_id == 4) {
          $estado = 'Completado';
        } elseif ($diasDiferencia <= 6) {
          $estado = 'OK';
        } elseif ($diasDiferencia == 7) {
          $estado = 'Advertencia';
        } else {
          $estado = 'Crítico';
        }
      }

      $estadisticas['estados'][$estado]++;

      $doctor = $orden->paciente->doctor ?? 'Desconocido';
      if (!isset($estadisticas['doctores'][$doctor])) {
        $estadisticas['doctores'][$doctor] = 0;
      }
      $estadisticas['doctores'][$doctor]++;

      if ($orden->lente_contacto == 1) {
        $estadisticas['lentes']['contacto']++;
      } else {
        $estadisticas['lentes']['normales']++;
      }

      $laboratorio = $orden->fasesOrdenes->whereNotNull('laboratorio')->pluck('laboratorio')->first();
      if ($laboratorio) {
        if (!isset($estadisticas['laboratorios'][$laboratorio])) {
          $estadisticas['laboratorios'][$laboratorio] = 0;
        }
        $estadisticas['laboratorios'][$laboratorio]++;
      }

      $estadoPago = 'Desconocido';
      if ($orden->pagado == 1) {
        $estadoPago = 'Pagado';
        $estadisticas['pagos']['Pagado']++;
      } elseif ($orden->pagado == 0) {
        $estadoPago = 'Cortesía';
        $estadisticas['pagos']['Cortesía']++;
      } elseif ($orden->pagado == 2) {
        $estadoPago = 'Abonado';
        $estadisticas['pagos']['Abonado']++;
      }

      $doctor = $orden->paciente->doctor ?? 'Desconocido';
      if (!isset($estadisticas['doctores'][$doctor])) {
        $estadisticas['doctores'][$doctor] = 0;
      }
      $estadisticas['doctores'][$doctor]++;

      $sucursal = $orden->sucursal->nombre ?? 'Desconocido';
      if (!isset($estadisticas['sucursales'][$sucursal])) {
        $estadisticas['sucursales'][$sucursal] = 0;
      }
      $estadisticas['sucursales'][$sucursal]++;

      $asesor = $ultimaFase->usuario->nombre ?? 'Desconocido';
      if (!isset($estadisticas['asesores'][$asesor])) {
        $estadisticas['asesores'][$asesor] = 0;
      }
      $estadisticas['asesores'][$asesor]++;


      $correcciones = $orden->correciones->map(function ($correccion) {

        $ultimaFase = $correccion->faseCorreccionOrden->sortByDesc('tipo_fase_correccion_orden_id')->first();
        $estado = 'Sin estado';

        $estadoPago = 'Desconocido';
        if ($correccion->orden->pagado == 1) {
          $estadoPago = 'Pagado';
        } elseif ($correccion->orden->pagado == 0) {
          $estadoPago = 'Cortesía';
        } elseif ($correccion->orden->pagado == 2) {
          $estadoPago = 'Abonado';
        }


        if (!$ultimaFase) {
          $siguienteFase = "Nuevo";
        } else {
          $diasDiferencia = now()->diffInDays($ultimaFase->fecha_fase);

          if ($ultimaFase->tipo_fase_correccion_orden_id == 4) {
            $estado = 'Completado';
          } elseif ($diasDiferencia <= 6) {
            $estado = 'OK';
          } elseif ($diasDiferencia == 7) {
            $estado = 'Advertencia';
          } else {
            $estado = 'Crítico';
          }

          if ($ultimaFase->tipo_fase_correccion_orden_id == 4) {
            $siguienteFase = "Retirado";
          } elseif ($ultimaFase->tipo_fase_correccion_orden_id == 3) {
            $siguienteFase = "Listo";
          } elseif ($ultimaFase->tipo_fase_correccion_orden_id == 1 && $ultimaFase->status == 0) {
            $siguienteFase = "Nuevo";
          } else {
            $nuevoTipoFase = ($ultimaFase->status == 1 && $ultimaFase->tipo_fase_correccion_orden_id < 3)
              ? $ultimaFase->tipo_fase_correccion_orden_id + 1
              : $ultimaFase->tipo_fase_correccion_orden_id;

            $siguienteFase = TiposFasesOrdenes::where('id', $nuevoTipoFase)
              ->value('tipo_fase_orden') ?? "Finalizado";
          }
        }
        return [
          'id_correccion' => $correccion->id,
          'sucursal' => $correccion->orden->sucursal->nombre,
          'doctor' => $correccion->doctor,
          'asesor' => $ultimaFase->usuario->nombre ?? null,
          'fecha' => $correccion->created_at ? Carbon::parse($correccion->created_at)->format('d-m-Y') : null,
          'laboratorio' => $correccion->faseCorreccionOrden->whereNotNull('laboratorio')->pluck('laboratorio')->first(),
          'lente_contacto' => $correccion->orden->lente_contacto,
          'codigo_cristal' => $correccion->codigo_cristal,
          'nro_orden_id' => $correccion->orden->nro_orden_id,
          'pagado' => $estadoPago,
          'estado' => $estado
        ];
      });
      return [
        'id_orden' => $orden->id_orden,
        'lente_contacto' => $orden->lente_contacto,
        'codigo_cristal' => $orden->codigo_cristal,
        'estado' => $estado,
        'created_at' => $orden->created_at ? Carbon::parse($orden->created_at)->format('d-m-Y') : null,
        'nro_orden_id' => $orden->nro_orden_id,
        'pagado' => $estadoPago,
        'sucursal' => $orden->sucursal->nombre,
        'doctor' => $orden->doctor,
        'asesor' => $ultimaFase->usuario->nombre ?? null,
        'laboratorio' => $orden->fasesOrdenes->whereNotNull('laboratorio')->pluck('laboratorio')->first() ?? null,
        'correcciones' => $correcciones
      ];
    });

    $total = $ordenes->count();
    $ordenesPaginadas = $ordenes->slice(($page - 1) * $limit, $limit)->values();

    return response()->json([
      'data' => $ordenesPaginadas,
      'meta' => [
        'total' => $total,
        'limit' => $limit,
        'page' => $page,
        'last_page' => ceil($total / $limit),
        'sortColumn' => $sortColumn,
        'sortOrder' => $sortOrder,
        'search' => $search
      ],
      'estadisticas' => $estadisticas,
      'export' => [
        'dataexport' => $ordenes
      ]
    ]);
  }

  public function ordenesDelPaciente(Request $request, $id_paciente)
  {
    // Validar que el paciente existe
    $pacienteExists = DB::table('pacientes')->where('id_paciente', $id_paciente)->exists();

    if (!$pacienteExists) {
      return response()->json([
        'respuesta' => false,
        'mensaje' => 'Paciente no encontrado',
        'status' => [
          'code' => 404,
          'message' => 'Patient not found'
        ]
      ], 404);
    }

    $ordenes = Ordenes::with([
      'paciente:id_paciente,nombres,celular,apellidos',
      'sucursal:id_sucursal,nombre,ubicacion_maps',
    ])
      ->join('usuarios', 'ordenes.elaborado_por', '=', 'usuarios.id_usuario')
      ->where('ordenes.id_paciente', $id_paciente);

    // Filtro por nro_orden_id
    $nroOrdenId = $request->query('nro_orden_id');
    if (!empty($nroOrdenId)) {
      $ordenes->where('ordenes.nro_orden_id', $nroOrdenId);
    }

    // ✅ Filtro por orden cancelada (campo booleano)
    if ($request->has('cancelada')) {
      $cancelada = filter_var($request->query('cancelada'), FILTER_VALIDATE_BOOLEAN);
      $ordenes->where('ordenes.cancelada', $cancelada);
    }

    $limit = $request->input('limit');
    $page = $request->input('page');
    $sortColumn = $request->input('sortColumn');
    $sortOrder = $request->input('sortOrder', 'desc');

    if ($limit && $page) {
      $validSortColumns = ['id_orden', 'created_at', 'nro_orden', 'nro_orden_id'];
      if (!in_array($sortColumn, $validSortColumns)) {
        $sortColumn = 'created_at';
      }

      $paginatedData = $ordenes->orderBy($sortColumn, $sortOrder)
        ->paginate($limit, ['*'], 'page', $page);

      return response()->json([
        'data' => $paginatedData->items(),
        'meta' => [
          'page' => $paginatedData->currentPage(),
          'limit' => (int) $paginatedData->perPage(),
          'total' => $paginatedData->total(),
        ],
        'respuesta' => true,
        'status' => [
          'code' => 200,
          'message' => 'Patient orders retrieved successfully',
        ],
        'mensaje' => 'Órdenes del paciente obtenidas correctamente',
      ]);
    } else {
      $allData = $ordenes->orderBy('created_at', 'desc')->get();

      return response()->json([
        'data' => $allData,
        'respuesta' => true,
        'status' => [
          'code' => 200,
          'message' => 'Patient orders retrieved successfully',
        ],
        'mensaje' => 'Órdenes del paciente obtenidas correctamente (sin paginación)',
      ]);
    }
  }



  public function obtenerOrdenPaciente($id_paciente, $nroOrdenId)
  {
    $pacienteExists = DB::table('pacientes')->where('id_paciente', $id_paciente)->exists();

    if (!$pacienteExists) {
      return response()->json([
        'respuesta' => false,
        'mensaje' => 'Paciente no encontrado',
        'status' => [
          'code' => 404,
          'message' => 'Patient not found'
        ]
      ], 404);
    }

    $contadorFasesQuery = DB::table('fases_ordenes')
      ->select(
        'ordenes_id',
        DB::raw('COUNT(*) as total_fases'),
        DB::raw('SUM(1) as fases_completadas')
      )
      ->groupBy('ordenes_id');

    // Subconsulta para obtener la última fase activa
    $ultimaFaseQuery = DB::table('fases_ordenes as fo2')
      ->select(
        'fo2.ordenes_id',
        DB::raw('
                CASE 
                    WHEN fo2.status = 0 THEN (
                        SELECT tipo_fase_orden_id 
                        FROM fases_ordenes 
                        WHERE ordenes_id = fo2.ordenes_id 
                        AND id < fo2.id 
                        ORDER BY id DESC 
                        LIMIT 1
                    )
                    ELSE fo2.tipo_fase_orden_id 
                END as ultima_fase_tipo_id
            '),
        DB::raw('
                CASE 
                    WHEN fo2.status = 0 THEN (
                        CASE 
                            WHEN (
                                SELECT tipo_fase_orden_id 
                                FROM fases_ordenes 
                                WHERE ordenes_id = fo2.ordenes_id 
                                AND id < fo2.id 
                                ORDER BY id DESC 
                                LIMIT 1
                            ) IS NULL THEN \'Nuevo\'
                            WHEN (
                                SELECT tipo_fase_orden_id 
                                FROM fases_ordenes 
                                WHERE ordenes_id = fo2.ordenes_id 
                                AND id < fo2.id 
                                ORDER BY id DESC 
                                LIMIT 1
                            ) = 1 THEN \'Enviado\'
                            WHEN (
                                SELECT tipo_fase_orden_id 
                                FROM fases_ordenes 
                                WHERE ordenes_id = fo2.ordenes_id 
                                AND id < fo2.id 
                                ORDER BY id DESC 
                                LIMIT 1
                            ) = 2 THEN \'En Confección\'
                            WHEN (
                                SELECT tipo_fase_orden_id 
                                FROM fases_ordenes 
                                WHERE ordenes_id = fo2.ordenes_id 
                                AND id < fo2.id 
                                ORDER BY id DESC 
                                LIMIT 1
                            ) = 3 THEN \'Listo\'
                            WHEN (
                                SELECT tipo_fase_orden_id 
                                FROM fases_ordenes 
                                WHERE ordenes_id = fo2.ordenes_id 
                                AND id < fo2.id 
                                ORDER BY id DESC 
                                LIMIT 1
                            ) = 4 THEN \'Retirado\'
                            ELSE \'Desconocido\'
                        END
                    )
                    ELSE (
                        CASE 
                            WHEN fo2.tipo_fase_orden_id IS NULL THEN \'Nuevo\'
                            WHEN fo2.tipo_fase_orden_id = 1 THEN \'Enviado\'
                            WHEN fo2.tipo_fase_orden_id = 2 THEN \'En Confección\'
                            WHEN fo2.tipo_fase_orden_id = 3 THEN \'Listo\'
                            WHEN fo2.tipo_fase_orden_id = 4 THEN \'Retirado\'
                            ELSE \'Desconocido\'
                        END
                    )
                END as ultima_fase_nombre
            ')
      )
      ->whereRaw('fo2.id = (
            SELECT MAX(id) 
            FROM fases_ordenes 
            WHERE ordenes_id = fo2.ordenes_id
        )');

    $primeraFaseQuery = DB::table('fases_ordenes as fo')
      ->join('tipos_fases_ordenes as tfo', 'fo.tipo_fase_orden_id', '=', 'tfo.id')
      ->leftJoinSub($contadorFasesQuery, 'contador_fases', 'fo.ordenes_id', '=', 'contador_fases.ordenes_id')
      ->leftJoin('fases_ordenes as fase4', function ($join) {
        $join->on('fo.ordenes_id', '=', 'fase4.ordenes_id')
          ->where('fase4.tipo_fase_orden_id', 5)
          ->where('fase4.status', 1);
      })
      ->select(
        'fo.ordenes_id',
        'fo.laboratorio as laboratorio_primera_fase',
        'fo.observacion as observacion_primera_fase',
        'fo.fecha_fase as fecha_primera_fase',
        'contador_fases.total_fases',
        'contador_fases.fases_completadas',
        DB::raw('DATEDIFF(CURRENT_DATE, fo.fecha_fase) as dias_transcurridos'),
        DB::raw("CASE 
                WHEN contador_fases.total_fases = 5
                    AND contador_fases.fases_completadas = 5 
                    AND fase4.ordenes_id IS NOT NULL THEN 'Completado'
                WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) <= 6 THEN 'Ok'
                WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) = 7 THEN 'Advertencia'
                WHEN DATEDIFF(CURRENT_DATE, fo.fecha_fase) >= 8 THEN 'Critico'
                ELSE 'sin_status'
            END as status_primera_fase")
      )
      ->whereRaw('fo.id = (
            SELECT MIN(id) 
            FROM fases_ordenes 
            WHERE ordenes_id = fo.ordenes_id 
            AND tipo_fase_orden_id = 2
        )');

    $orden = DB::table('ordenes')
      ->leftJoin('usuarios', 'ordenes.elaborado_por', '=', 'usuarios.id_usuario')
      ->leftJoin('pacientes', 'ordenes.id_paciente', '=', 'pacientes.id_paciente')
      ->leftJoin('sucursales', 'ordenes.id_sucursal', '=', 'sucursales.id_sucursal')
      ->leftJoinSub($primeraFaseQuery, 'primeras_fases', 'ordenes.id_orden', '=', 'primeras_fases.ordenes_id')
      ->leftJoinSub($ultimaFaseQuery, 'ultima_fase', 'ordenes.id_orden', '=', 'ultima_fase.ordenes_id')
      ->select(
        'ordenes.*',
        'primeras_fases.*',
        DB::raw("COALESCE(ultima_fase.ultima_fase_tipo_id, 0) as ultima_fase_tipo_id"),
        DB::raw("COALESCE(ultima_fase.ultima_fase_nombre, 'Nuevo') as ultima_fase_nombre"),
        'pacientes.nombres as paciente_nombres',
        'pacientes.apellidos as paciente_apellidos',
        'pacientes.celular as paciente_celular',
        'sucursales.nombre as sucursal_nombre',
        'sucursales.ubicacion_maps as sucursal_ubicacion',
        'usuarios.nombre as elaborado_por'
      )
      ->where('ordenes.id_paciente', $id_paciente)
      ->where('ordenes.nro_orden_id', $nroOrdenId)
      ->first();

    if ($orden) {
      $orden = collect($orden)->map(function ($value, $key) {
        if (in_array($key, ['nro_orden', 'ordenes_id', 'pagado', 'id_paciente', 'id_sucursal', 'lente_contacto', 'correccion'])) {
          return (int) $value;
        }
        return $value;
      })->toArray();
    }

    if (!$orden) {
      return response()->json([
        'respuesta' => false,
        'mensaje' => 'Orden no encontrada para el paciente',
        'status' => [
          'code' => 404,
          'message' => 'Order not found'
        ]
      ], 404);
    }

    return response()->json([
      'respuesta' => true,
      'data' => $orden,
      'status' => [
        'code' => 200,
        'message' => 'Order retrieved successfully'
      ],
      'mensaje' => 'Orden obtenida correctamente'
    ], 200);
  }


  public function verContactoOrden($id_orden)
  {

    $data = ContactoOrden::join('usuarios', 'usuarios.id_usuario', 'contactos_ordenes.usuario_id')
      ->select(
        'contactos_ordenes.*',
        'usuarios.nombre',
      )
      ->where('contactos_ordenes.ordenes_id', $id_orden)
      ->orderBy('contactos_ordenes.created_at', 'desc')
      ->get();

    return response()->json([
      'data' => $data,
      'respuesta' => true,
      'status' => [
        'code' => 200,
        'message' => 'Contacto orders retrieved successfully',
      ],
      'mensaje' => 'Contactos de Órdenes del paciente obtenidas correctamente',
    ], 200);
  }

  public function verOrdenPdf($id_orden)
  {

    $orden = Ordenes::join('sucursales', 'sucursales.id_sucursal', 'ordenes.id_sucursal')
      ->join('pacientes', 'pacientes.id_paciente', 'ordenes.id_paciente')
      ->select(
        'ordenes.*',
        'sucursales.nombre',
        'pacientes.nombres',
        'pacientes.apellidos',
      )
      ->where('ordenes.id_orden', $id_orden)
      ->first();
    $data = [
      'fecha_solicitud' => $orden['created_at'],
      'nro_orden' => $orden['nro_orden_id'],
      'lenteContacto' => false,
      'esfera_od' => $orden['esfera_od'],
      'cilindro_od' => $orden['cilindro_od'],
      'eje_od' => $orden['eje_od'],
      'add_od' => $orden['add_od'],
      'prisma_od' => $orden['prisma_od'],
      'distancia_od' => $orden['distancia_od'],
      'altura_od' => $orden['altura_od'],
      'esfera_oi' => $orden['esfera_oi'],
      'cilindro_oi' => $orden['cilindro_oi'],
      'eje_oi' => $orden['eje_oi'],
      'add_oi' => $orden['add_oi'],
      'prisma_oi' => $orden['prisma_oi'],
      'distancia_oi' => $orden['distancia_oi'],
      'altura_oi' => $orden['altura_oi'],
      'material_od' => $orden['material_od'],
      'material_oi' => $orden['material_oi'],
      'tipo_cristal_od' => $orden['tipo_cristal_od'],
      'tipo_cristal_oi' => $orden['tipo_cristal_oi'],
      'tipo_corredor' => $orden['tipo_corredor'],
      'l_uno' => $orden['l_uno'] ?? "-",
      'l_dos' => $orden['l_dos'] ?? "-",
      'l_tres' => $orden['l_tres'] ?? "-",
      'l_cuatro' => $orden['l_cuatro'] ?? "-",
      'l_cinco' => $orden['l_cinco'] ?? "-",
      'color' => $orden['color'] ?? "_",
      'codigo' => $orden['codigo'] ?? "_",
      'marca' => $orden['marca'] ?? "_",
      'marca_oi' => $orden['marca_oi'] ?? "_",
      'tipo_aro' => $orden['tipo_aro'] ?? "_",
      'observaciones' => $orden['observaciones'] ?? "_",
      'aro_centevi' => $orden['aro_centevi'],
      'aro_propio' => $orden['aro_propio'],
      'lente_contacto' => $orden['lente_contacto'],
      'tratamientos_oi' => $orden['tratamientos_oi'],
      'tratamientos_od' => $orden['tratamientos_od'],
      'sucursal' => $orden['nombre'] ?? '',
      'nombres_apellidos_paciente' => ($orden['nombres'] ? explode(' ', trim($orden['nombres']))[0] : '')
        . ' '
        . ($orden['apellidos'] ? explode(' ', trim($orden['apellidos']))[0] : '')
    ];

    $pdf = Pdf::loadView('pdf/ordenPdf', $data);
    return $pdf->stream('orden.pdf', [
      'Content-Type' => 'application/pdf',
      'Content-Disposition' => 'inline; filename="orden_' . $id_orden . '.pdf"'
    ]);
  }

  public function verCorrecionPdf($id_correcion, $numero_correcion)
  {

    $orden = CorrecionesOrdenes::join(
      'ordenes',
      'ordenes.id_orden',
      'correciones_ordenes.ordenes_id'
    )
      ->join('sucursales', 'sucursales.id_sucursal', 'ordenes.id_sucursal')
      ->join('pacientes', 'pacientes.id_paciente', 'ordenes.id_paciente')
      ->select(
        'correciones_ordenes.*',
        'sucursales.nombre',
        'pacientes.nombres',
        'pacientes.apellidos',
      )
      ->where('correciones_ordenes.id', $id_correcion)
      ->first();
    $data = [
      'fecha_solicitud' => $orden['created_at'],
      'nro_orden' => $numero_correcion,
      'lenteContacto' => false,
      'esfera_od' => $orden['esfera_od'],
      'cilindro_od' => $orden['cilindro_od'],
      'eje_od' => $orden['eje_od'],
      'add_od' => $orden['add_od'],
      'prisma_od' => $orden['prisma_od'],
      'distancia_od' => $orden['distancia_od'],
      'altura_od' => $orden['altura_od'],
      'esfera_oi' => $orden['esfera_oi'],
      'cilindro_oi' => $orden['cilindro_oi'],
      'eje_oi' => $orden['eje_oi'],
      'add_oi' => $orden['add_oi'],
      'prisma_oi' => $orden['prisma_oi'],
      'distancia_oi' => $orden['distancia_oi'],
      'altura_oi' => $orden['altura_oi'],
      'material_od' => $orden['material_od'],
      'material_oi' => $orden['material_oi'],
      'tipo_cristal_od' => $orden['tipo_cristal_od'],
      'tipo_cristal_oi' => $orden['tipo_cristal_oi'],
      'tipo_corredor' => $orden['tipo_corredor'],
      'l_uno' => $orden['l_uno'] ?? "-",
      'l_dos' => $orden['l_dos'] ?? "-",
      'l_tres' => $orden['l_tres'] ?? "-",
      'l_cuatro' => $orden['l_cuatro'] ?? "-",
      'l_cinco' => $orden['l_cinco'] ?? "-",
      'color' => $orden['color'] ?? "_",
      'codigo' => $orden['codigo'] ?? "_",
      'marca' => $orden['marca'] ?? "_",
      'marca_oi' => $orden['marca_oi'] ?? "_",
      'tipo_aro' => $orden['tipo_aro'] ?? "_",
      'observaciones' => $orden['observaciones'] ?? "_",
      'aro_centevi' => $orden['aro_centevi'],
      'aro_propio' => $orden['aro_propio'],
      'lente_contacto' => $orden['ordenes.lente_contacto'],
      'tratamientos_oi' => $orden['tratamientos_oi'],
      'tratamientos_od' => $orden['tratamientos_od'],
      'sucursal' => $orden['nombre'] ?? '',
      'nombres_apellidos_paciente' => ($orden['nombres'] ? explode(' ', trim($orden['nombres']))[0] : '')
        . ' '
        . ($orden['apellidos'] ? explode(' ', trim($orden['apellidos']))[0] : '')
    ];

    $pdf = Pdf::loadView('pdf/ordenPdf', $data);
    return $pdf->stream('orden.pdf', [
      'Content-Type' => 'application/pdf',
      'Content-Disposition' => 'inline; filename="orden_' . $id_correcion . '.pdf"'
    ]);
  }

  public function verOrdenPdfSize($id_orden)
  {

    $orden = Ordenes::join('sucursales', 'sucursales.id_sucursal', 'ordenes.id_sucursal')
      ->join('pacientes', 'pacientes.id_paciente', 'ordenes.id_paciente')
      ->select(
        'ordenes.*',
        'sucursales.nombre',
        'pacientes.nombres',
        'pacientes.apellidos',
      )
      ->where('ordenes.id_orden', $id_orden)
      ->first();
    $data = [
      'fecha_solicitud' => $orden['created_at'],
      'nro_orden' => $orden['nro_orden_id'],
      'lenteContacto' => false,
      'esfera_od' => $orden['esfera_od'],
      'cilindro_od' => $orden['cilindro_od'],
      'eje_od' => $orden['eje_od'],
      'add_od' => $orden['add_od'],
      'prisma_od' => $orden['prisma_od'],
      'distancia_od' => $orden['distancia_od'],
      'altura_od' => $orden['altura_od'],
      'esfera_oi' => $orden['esfera_oi'],
      'cilindro_oi' => $orden['cilindro_oi'],
      'eje_oi' => $orden['eje_oi'],
      'add_oi' => $orden['add_oi'],
      'prisma_oi' => $orden['prisma_oi'],
      'distancia_oi' => $orden['distancia_oi'],
      'altura_oi' => $orden['altura_oi'],
      'material_od' => $orden['material_od'],
      'material_oi' => $orden['material_oi'],
      'tipo_cristal_od' => $orden['tipo_cristal_od'],
      'tipo_cristal_oi' => $orden['tipo_cristal_oi'],
      'l_uno' => $orden['l_uno'] ?? "-",
      'l_dos' => $orden['l_dos'] ?? "-",
      'l_tres' => $orden['l_tres'] ?? "-",
      'l_cuatro' => $orden['l_cuatro'] ?? "-",
      'l_cinco' => $orden['l_cinco'] ?? "-",
      'color' => $orden['color'] ?? "_",
      'codigo' => $orden['codigo'] ?? "_",
      'marca' => $orden['marca'] ?? "_",
      'marca' => $orden['marca_oi'] ?? "_",
      'tipo_aro' => $orden['tipo_aro'] ?? "_",
      'observaciones' => $orden['observaciones'] ?? "_",
      'aro_centevi' => $orden['aro_centevi'],
      'aro_propio' => $orden['aro_propio'],
      'lente_contacto' => $orden['lente_contacto'],
      'tratamientos_oi' => $orden['tratamientos_oi'],
      'tratamientos_od' => $orden['tratamientos_od'],
      'sucursal' => $orden['nombre'] ?? '',
      'nombres_apellidos_paciente' => ($orden['nombres'] ? explode(' ', trim($orden['nombres']))[0] : '')
        . ' '
        . ($orden['apellidos'] ? explode(' ', trim($orden['apellidos']))[0] : '')
    ];

    $pdf = Pdf::loadView('pdf/ordenPdfSize', $data)->setPaper([0, 0, 226.77, 841.89]);
    return $pdf->stream('orden.pdf', [
      'Content-Type' => 'application/pdf',
      'Content-Disposition' => 'inline; filename="orden_' . $id_orden . '.pdf"'
    ]);
  }

  public function verOrdenPdfSmall($id_orden)
  {

    $orden = Ordenes::join('sucursales', 'sucursales.id_sucursal', 'ordenes.id_sucursal')
      ->join('pacientes', 'pacientes.id_paciente', 'ordenes.id_paciente')
      ->select(
        'ordenes.*',
        'sucursales.nombre',
        'pacientes.nombres',
        'pacientes.apellidos',
      )
      ->where('ordenes.id_orden', $id_orden)
      ->first();
    $data = [
      'fecha_solicitud' => $orden['created_at'],
      'nro_orden' => $orden['nro_orden_id'],
      'lenteContacto' => false,
      'esfera_od' => $orden['esfera_od'],
      'cilindro_od' => $orden['cilindro_od'],
      'eje_od' => $orden['eje_od'],
      'add_od' => $orden['add_od'],
      'prisma_od' => $orden['prisma_od'],
      'distancia_od' => $orden['distancia_od'],
      'altura_od' => $orden['altura_od'],
      'esfera_oi' => $orden['esfera_oi'],
      'cilindro_oi' => $orden['cilindro_oi'],
      'eje_oi' => $orden['eje_oi'],
      'add_oi' => $orden['add_oi'],
      'prisma_oi' => $orden['prisma_oi'],
      'distancia_oi' => $orden['distancia_oi'],
      'altura_oi' => $orden['altura_oi'],
      'material_od' => $orden['material_od'],
      'material_oi' => $orden['material_oi'],
      'tipo_cristal_od' => $orden['tipo_cristal_od'],
      'tipo_cristal_oi' => $orden['tipo_cristal_oi'],
      'l_uno' => $orden['l_uno'] ?? "-",
      'l_dos' => $orden['l_dos'] ?? "-",
      'l_tres' => $orden['l_tres'] ?? "-",
      'l_cuatro' => $orden['l_cuatro'] ?? "-",
      'l_cinco' => $orden['l_cinco'] ?? "-",
      'color' => $orden['color'] ?? "_",
      'codigo' => $orden['codigo'] ?? "_",
      'marca' => $orden['marca'] ?? "_",
      'tipo_aro' => $orden['tipo_aro'] ?? "_",
      'observaciones' => $orden['observaciones'] ?? "_",
      'aro_centevi' => $orden['aro_centevi'],
      'aro_propio' => $orden['aro_propio'],
      'lente_contacto' => $orden['lente_contacto'],
      'tratamientos_oi' => $orden['tratamientos_oi'],
      'tratamientos_od' => $orden['tratamientos_od'],
      'sucursal' => $orden['nombre'] ?? '',
      'nombres_apellidos_paciente' => ($orden['nombres'] ? explode(' ', trim($orden['nombres']))[0] : '')
        . ' '
        . ($orden['apellidos'] ? explode(' ', trim($orden['apellidos']))[0] : '')
    ];

    $pdf = Pdf::loadView('pdf/ordenPdfSmall', $data)->setPaper([0, 0, 226.77, 841.89]);
    return $pdf->stream('orden.pdf', [
      'Content-Type' => 'application/pdf',
      'Content-Disposition' => 'inline; filename="orden_' . $id_orden . '.pdf"'
    ]);
  }

  public function migrarNroOrdenes()
  {
    try {
      DB::beginTransaction();

      // 1. Eliminar todos los registros de la tabla nro_ordenes
      DB::table('nro_ordenes')->delete();

      // 2. Insertar los valores únicos de nro_orden desde la tabla ordenes en nro_ordenes
      DB::table('nro_ordenes')->insertUsing(
        ['id'],
        DB::table('ordenes')->select('nro_orden')->distinct()
      );

      // 3. Actualizar el campo nro_orden_id en la tabla ordenes
      DB::table('ordenes')->update([
        'nro_orden_id' => DB::raw("(SELECT id FROM nro_ordenes WHERE nro_ordenes.id = ordenes.nro_orden)")
      ]);

      DB::commit();

      return response()->json([
        'message' => 'Migración completada exitosamente.'
      ], 200);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json([
        'message' => 'Error al migrar los nro_ordenes.',
        'error' => $e->getMessage()
      ], 500);
    }
  }

  public function getOrdenesConTotal()
  {
    $ordenes = Ordenes::all();
    $total = Ordenes::count();

    return response()->json([
      'respuesta' => true,
      'mensaje' => 'Órdenes obtenidas correctamente',
      'total' => $total,
      'data' => $ordenes
    ], 200);
  }

  public function searchOrdenes(Request $request)
  {
    $query = $request->query('search');

    if (!$query) {
      // Si no se pasa el parámetro 'search', devolver las últimas 10 órdenes creadas
      $ordenes = Ordenes::latest()
        ->limit(10)
        ->get(['id_orden', 'nro_orden_id', 'id_paciente']);
    } else {
      // Si se pasa 'search', filtrar por 'nro_orden_id'
      $ordenes = Ordenes::where('nro_orden_id', 'LIKE', "%{$query}%")
        ->latest()
        ->limit(10)
        ->get(['id_orden', 'nro_orden_id', 'id_paciente']);
    }

    return response()->json([
      'data' => $ordenes->map(fn($o) => [
        'id' => (string) $o->id_orden,
        'display' => (string) $o->nro_orden_id,
        'id_paciente' => $o->id_paciente
      ])
    ], 200);
  }

  public function updateOrdenCancelada($id_orden)
  {
    $orden = Ordenes::find($id_orden);

    if (!$orden) {
      return response()->json([
        'respuesta' => false,
        'mensaje' => 'Orden no encontrada',
        'status' => [
          'code' => 404,
          'message' => 'Order not found'
        ]
      ], 404);
    }

    // Alternar el estado de cancelada
    $orden->cancelada = !$orden->cancelada;
    $orden->save();

    return response()->json([
      'respuesta' => true,
      'mensaje' => 'Orden actualizada correctamente',
      'data' => $orden
    ], 200);
  }

  public function diasOMesesDesdeUltimaOrden($id_paciente)
  {
    $ultimaOrden = Ordenes::where('id_paciente', $id_paciente)
      ->orderBy('created_at', 'desc')
      ->first();

    if (!$ultimaOrden) {
      return response()->json([
        'respuesta' => false,
        'mensaje' => 'El paciente no tiene órdenes registradas'
      ], 404);
    }

    $fechaUltimaOrden = Carbon::parse($ultimaOrden->created_at);
    $fechaActual = Carbon::now();

    $diff = $fechaUltimaOrden->diff($fechaActual);

    // Si es menor o igual a 31 días
    if ($diff->y === 0 && $diff->m === 0 && $diff->d <= 31) {
      return response()->json([
        'respuesta' => true,
        'tiempo' => $diff->d . ' días'
      ]);
    }

    // Convertir años a meses + meses del intervalo
    $totalMeses = ($diff->y * 12) + $diff->m;

    return response()->json([
      'respuesta' => true,
      'tiempo' => $totalMeses . ' meses ' . $diff->d . ' días'
    ]);
  }
}
