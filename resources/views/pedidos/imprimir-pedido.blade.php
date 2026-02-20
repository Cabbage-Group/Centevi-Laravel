<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Pedido de Materia Prima</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 24px; font-size: 13px; }
        h2 { color: #2c3e6b; margin-bottom: 4px; }
        .meta { display: flex; gap: 24px; margin-bottom: 20px; font-size: 12px; color: #555; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #2c3e6b; color: #fff; padding: 8px 12px; text-align: left; font-size: 11px; }
        td { padding: 8px 12px; border-bottom: 1px solid #e8e8e8; vertical-align: top; font-size: 12px; }
        .detalle td { background: #fafafa; font-size: 11px; color: #666; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 32px; }
        @media print { body { padding: 0; } }
    </style>
</head>
<body>
    <h2>Pedido de Materia Prima</h2>
    <div class="meta">
        <span>Proveedor: <strong>{{ $proveedor }}</strong></span>
        <span>Generado: <strong>{{ $fecha }}</strong></span>
        <span>Órdenes: <strong>{{ count($ordenes) }}</strong></span>
    </div>

    <table>
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Orden</th>
                <th>Cantidad</th>
                <th>Observación</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($ordenes as $orden)
            <tr>
                <td>{{ $orden['fecha'] ?? '—' }}</td>
                <td><strong>{{ $orden['id_orden'] }}</strong></td>
                <td>{{ $orden['cantidad'] }}</td>
                <td>{{ $orden['observacion'] ?: '—' }}</td>
            </tr>
            <tr class="detalle">
                <td colspan="4">
                    <div class="grid">
                        <span>Receta OD: <strong>{{ $orden['receta_od'] ?? '—' }}</strong></span>
                        <span>Receta OI: <strong>{{ $orden['receta_oi'] ?? '—' }}</strong></span>
                        <span>Add OD: <strong>{{ $orden['add_od'] ?? '**' }}</strong></span>
                        <span>Add OI: <strong>{{ $orden['add_oi'] ?? '**' }}</strong></span>
                        <span>Prismas OD: <strong>{{ $orden['prisma_od'] ?? '**' }}</strong></span>
                        <span>Prismas OI: <strong>{{ $orden['prisma_oi'] ?? '**' }}</strong></span>
                        <span>Tipo de base: <strong>{{ $orden['tipo_base'] ?? '—' }}</strong></span>
                        <span>Material: <strong>{{ $orden['material'] ?? '—' }}</strong></span>
                    </div>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <script>window.onload = () => { window.print(); }</script>
</body>
</html>