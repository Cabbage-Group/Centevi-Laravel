<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <h2>Historial de Orden #{{ $nro_orden ?? $orden->nro_orden_id }}</h2>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; font-size: 13px; }
        h2 { color: #2c3e6b; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; border: 1px solid #2c3e6b; }
        th { background: #2c3e6b; color: #fff; padding: 8px 10px; text-align: left; font-size: 11px; border: 1px solid #2c3e6b; }
        td { padding: 8px 10px; font-size: 12px; vertical-align: top; border: 1px solid #dcdcdc; }
        tr:nth-child(even) td { background: #f9f9f9; }

        .badge-pedido { background: #e8f4fd; color: #1a5f8a; padding: 2px 8px; border-radius: 3px; font-weight: 700; }
        .badge-merma  { background: #fff3cd; color: #856404; padding: 2px 8px; border-radius: 3px; font-weight: 700; }

        .badge-ojo-od    { background: #e8f4fd; color: #1a5f8a; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 11px; border: 1px solid #1a5f8a; }
        .badge-ojo-oi    { background: #f3e8fd; color: #6a3fa0; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 11px; border: 1px solid #6a3fa0; }
        .badge-ojo-ambos { background: #e8fdf0; color: #27ae60; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 11px; border: 1px solid #27ae60; }

        .detalle-grid {
            display: grid;
            gap: 3px 24px;
            background: #f5f7fa;
            border: 1px solid #e8e8e8;
            border-radius: 6px;
            padding: 8px 12px;
            margin: 6px 0;
        }
        .detalle-grid.dos-columnas { grid-template-columns: 1fr 1fr; }
        .detalle-grid.una-columna  { grid-template-columns: 1fr; }

        .col-header-od { font-weight: 700; color: #1a5f8a; font-size: 11px; }
        .col-header-oi { font-weight: 700; color: #6a3fa0; font-size: 11px; }

        .detalle-footer { margin-top: 6px; line-height: 1.7; }
        .detalle-obs    { color: #888; font-style: italic; }

        @media print { body { padding: 0; } }
    </style>
</head>
<body>
    <table>
        <thead>
            <tr>
                <th>FECHA Y HORA</th>
                <th>EVENTO</th>
                <th>PROVEEDOR</th>
                <th>CANTIDAD</th>
                <th>OJO</th>
                <th>DETALLE</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($historial as $item)
                @php
                    $ojo      = $item['ojo'] ?? 'ambos';
                    $detalle  = $item['detalle'] ?? [];
                    $mostrarOD = $ojo !== 'oi';
                    $mostrarOI = $ojo !== 'od';
                    $gridClass = ($mostrarOD && $mostrarOI) ? 'dos-columnas' : 'una-columna';

                    $ojoBadgeClass = match($ojo) {
                        'od'    => 'badge-ojo-od',
                        'oi'    => 'badge-ojo-oi',
                        default => 'badge-ojo-ambos',
                    };
                    $ojoLabel = match($ojo) {
                        'od'    => 'OD',
                        'oi'    => 'OI',
                        default => 'Ambos',
                    };
                @endphp
                <tr>
                    <td>{{ $item['fecha_hora'] ?? '—' }}</td>
                    <td>
                        <span class="{{ $item['evento'] === 'PEDIDO' ? 'badge-pedido' : 'badge-merma' }}">
                            {{ $item['evento'] }}
                        </span>
                    </td>
                    <td>{{ $item['proveedor'] ?? '—' }}</td>
                    <td style="text-align:center; font-weight:600;">{{ $item['cantidad'] }}</td>
                    <td style="text-align:center;">
                        <span class="{{ $ojoBadgeClass }}">{{ $ojoLabel }}</span>
                    </td>
                    <td>
                        <div style="font-size:12px; line-height:1.7;">

                            {{-- Título --}}
                            <div style="font-weight:700; color:#2c3e6b; margin-bottom:6px;">
                                {{ $detalle['titulo'] ?? '' }}
                            </div>

                            {{-- Grid OD / OI --}}
                            <div class="detalle-grid {{ $gridClass }}">

                                {{-- Headers de columna --}}
                                @if($mostrarOD)
                                    <span class="col-header-od">OD</span>
                                @endif
                                @if($mostrarOI)
                                    <span class="col-header-oi">OI</span>
                                @endif

                                {{-- Receta --}}
                                @if($mostrarOD)
                                    <span>Receta: <strong>{{ $detalle['receta_od'] ?? '**' }}</strong></span>
                                @endif
                                @if($mostrarOI)
                                    <span>Receta: <strong>{{ $detalle['receta_oi'] ?? '**' }}</strong></span>
                                @endif

                                {{-- Add --}}
                                @if($mostrarOD)
                                    <span>Add: <strong>{{ $detalle['add_od'] ?? '**' }}</strong></span>
                                @endif
                                @if($mostrarOI)
                                    <span>Add: <strong>{{ $detalle['add_oi'] ?? '**' }}</strong></span>
                                @endif

                                {{-- Prismas --}}
                                @if($mostrarOD)
                                    <span>Prismas: <strong>{{ $detalle['prisma_od'] ?? '**' }}</strong></span>
                                @endif
                                @if($mostrarOI)
                                    <span>Prismas: <strong>{{ $detalle['prisma_oi'] ?? '**' }}</strong></span>
                                @endif

                                {{-- Base --}}
                                @if($mostrarOD)
                                    <span>Base: <strong>{{ $detalle['tipo_base_od'] ?? '**' }}</strong></span>
                                @endif
                                @if($mostrarOI)
                                    <span>Base: <strong>{{ $detalle['tipo_base_oi'] ?? '**' }}</strong></span>
                                @endif

                            </div>

                            {{-- Material y observación --}}
                            <div class="detalle-footer">
                                <div>Material: <strong>{{ $detalle['material'] ?? '—' }}</strong></div>
                                <div class="detalle-obs">Obs: {{ $detalle['observacion'] ?? 'Sin observación' }}</div>
                            </div>

                        </div>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <script>
        window.onload = () => { window.print(); }
    </script>
</body>
</html>