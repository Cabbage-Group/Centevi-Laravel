<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <h2>Historial de Orden #{{ $nro_orden ?? $orden->nro_orden_id }}</h2>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            font-size: 13px;
        }

        h2 {
            color: #2c3e6b;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
            border: 1px solid #2c3e6b;
        }

        th {
            background: #2c3e6b;
            color: #fff;
            padding: 8px 10px;
            text-align: left;
            font-size: 11px;
            border: 1px solid #2c3e6b;
        }

        td {
            padding: 8px 10px;
            font-size: 12px;
            vertical-align: top;
            border: 1px solid #dcdcdc;
        }

        tr:nth-child(even) td {
            background: #f9f9f9;
        }

        .badge-pedido {
            background: #e8f4fd;
            color: #1a5f8a;
            padding: 2px 8px;
            border-radius: 3px;
            font-weight: 700;
        }

        .badge-merma {
            background: #fff3cd;
            color: #856404;
            padding: 2px 8px;
            border-radius: 3px;
            font-weight: 700;
        }

        pre {
            margin: 0;
            font-family: inherit;
            white-space: pre-wrap;
            line-height: 1.6;
        }

        @media print {
            body {
                padding: 0;
            }
        }
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
                <th>DETALLE</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($historial as $item)
            <tr>
                <td>{{ $item['fecha_hora'] ?? '—' }}</td>
                <td>
                    <span class="{{ $item['evento'] === 'PEDIDO' ? 'badge-pedido' : 'badge-merma' }}">
                        {{ $item['evento'] }}
                    </span>
                </td>
                <td>{{ $item['proveedor'] ?? '—' }}</td>
                <td>{{ $item['cantidad'] }}</td>
                <td>
                    <div style="line-height: 1.7; font-size: 12px;">
                        <div><strong>{{ $item['detalle']['titulo'] ?? '' }}</strong></div>
                        <div>Receta OD: {{ $item['detalle']['receta_od'] ?? '—' }} &nbsp;|&nbsp; Receta OI: {{ $item['detalle']['receta_oi'] ?? '—' }}</div>
                        <div>Add OD: {{ $item['detalle']['add_od'] ?? '**' }} &nbsp;|&nbsp; Add OI: {{ $item['detalle']['add_oi'] ?? '**' }}</div>
                        <div>Prismas OD: {{ $item['detalle']['prisma_od'] ?? '**' }} &nbsp;|&nbsp; Prismas OI: {{ $item['detalle']['prisma_oi'] ?? '**' }}</div>
                        <div>Nro de base: {{ $item['detalle']['tipo_base'] ?? '—' }}</div>
                        <div>Material: {{ $item['detalle']['material'] ?? '—' }}</div>
                        <div>Observación: {{ $item['detalle']['observacion'] ?? 'Sin observación' }}</div>
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