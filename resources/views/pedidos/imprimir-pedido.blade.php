<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Pedido de Materia Prima</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 24px;
            font-size: 13px;
        }

        h2 {
            color: #2c3e6b;
            margin-bottom: 4px;
        }

        .meta {
            display: flex;
            gap: 24px;
            margin-bottom: 20px;
            font-size: 12px;
            color: #555;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            background: #2c3e6b;
            color: #fff;
            padding: 8px 12px;
            text-align: left;
            font-size: 11px;
        }

        td {
            padding: 8px 12px;
            border-bottom: 1px solid #e8e8e8;
            vertical-align: top;
            font-size: 12px;
        }

        .detalle td {
            background: #fafafa;
            font-size: 11px;
            color: #666;
        }

        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px 32px;
        }

        .grid-1 {
            display: grid;
            grid-template-columns: 1fr;
            gap: 4px;
        }

        .badge-od {
            display: inline-block;
            background: #e8f4fd;
            color: #1a5f8a;
            border: 1px solid #1a5f8a;
            border-radius: 4px;
            padding: 1px 8px;
            font-size: 10px;
            font-weight: 700;
        }

        .badge-oi {
            display: inline-block;
            background: #f3e8fd;
            color: #6a3fa0;
            border: 1px solid #6a3fa0;
            border-radius: 4px;
            padding: 1px 8px;
            font-size: 10px;
            font-weight: 700;
        }

        .badge-ambos {
            display: inline-block;
            background: #e8fdf0;
            color: #27ae60;
            border: 1px solid #27ae60;
            border-radius: 4px;
            padding: 1px 8px;
            font-size: 10px;
            font-weight: 700;
        }

        .col-od {
            font-weight: 700;
            color: #1a5f8a;
            font-size: 10px;
        }

        .col-oi {
            font-weight: 700;
            color: #6a3fa0;
            font-size: 10px;
        }

        @media print {
            body {
                padding: 0;
            }
        }
    </style>
</head>

<body>
    <h2>Pedido de Materia Prima</h2>
    <div class="meta">
        <span>Proveedor: <strong>{{ $proveedor }}</strong></span>
        <span>Fecha: <strong>{{ $fecha }}</strong></span>
        <span>Órdenes: <strong>{{ count($ordenes) }}</strong></span>
    </div>

    <table>
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Orden</th>
                <th>Cantidad</th>
                <th>Ojo</th>
                <th>Observación</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($ordenes as $orden)
            @php
            $ojo = $orden['ojo'] ?? 'ambos';
            $mostrarOD = $ojo !== 'oi';
            $mostrarOI = $ojo !== 'od';
            $gridClass = ($mostrarOD && $mostrarOI) ? 'grid-2' : 'grid-1';
            $badgeClass = match($ojo) {
            'od' => 'badge-od',
            'oi' => 'badge-oi',
            default => 'badge-ambos',
            };
            $ojoLabel = match($ojo) {
            'od' => 'OD',
            'oi' => 'OI',
            default => 'Ambos',
            };
            $baseIgual = ($orden['tipo_base_od'] ?? null) === ($orden['tipo_base_oi'] ?? null);
            $baseUnica = $orden['tipo_base_od'] ?? $orden['tipo_base_oi'] ?? null;
            @endphp
            <tr>
                <td>{{ $orden['fecha'] ?? '—' }}</td>
                <td><strong>{{ $orden['id_orden'] }}</strong></td>
                <td style="text-align:center; font-weight:600;">{{ $orden['cantidad'] }}</td>
                <td><span class="{{ $badgeClass }}">{{ $ojoLabel }}</span></td>
                <td>{{ $orden['observacion'] ?: '—' }}</td>
            </tr>
            <tr class="detalle">
                <td colspan="5">
                    <div class="{{ $gridClass }}">
                        {{-- Headers de columna --}}
                        @if($mostrarOD)
                        <span class="col-od">OD</span>
                        @endif
                        @if($mostrarOI)
                        <span class="col-oi">OI</span>
                        @endif

                        @if($mostrarOD)
                        <span>Receta: <strong>{{ $orden['receta_od'] ?? '**' }}</strong></span>
                        @endif
                        @if($mostrarOI)
                        <span>Receta: <strong>{{ $orden['receta_oi'] ?? '**' }}</strong></span>
                        @endif

                        @if($mostrarOD)
                        <span>Add: <strong>{{ $orden['add_od'] ?? '**' }}</strong></span>
                        @endif
                        @if($mostrarOI)
                        <span>Add: <strong>{{ $orden['add_oi'] ?? '**' }}</strong></span>
                        @endif

                        @if($mostrarOD)
                        <span>Prismas: <strong>{{ $orden['prisma_od'] ?? '**' }}</strong></span>
                        @endif
                        @if($mostrarOI)
                        <span>Prismas: <strong>{{ $orden['prisma_oi'] ?? '**' }}</strong></span>
                        @endif
                        @if(!$baseIgual)
                        @if($mostrarOD)
                        <span>Nro Base: <strong>{{ $orden['tipo_base_od'] ?? '**' }}</strong></span>
                        @endif
                        @if($mostrarOI)
                        <span>Nro Base: <strong>{{ $orden['tipo_base_oi'] ?? '**' }}</strong></span>
                        @endif
                        @endif
                    </div>
                    <div style="margin-top:6px;">
                        @if($baseIgual)
                        <div>Nro Base: <strong>{{ $baseUnica ?? '**' }}</strong></div>
                        @endif
                        <div>Material: <strong>{{ $orden['material'] ?? '—' }}</strong></div>
                    </div>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <script>
        window.onload = () => {
            window.print();
        }
    </script>
</body>

</html>