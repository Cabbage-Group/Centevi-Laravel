<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cotización - {{ $quoteDetails['id'] ?? '' }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: white;
            color: #333;
            font-size: 14px;
            
        }
        .pdf-content {
            width: 100%;
            margin: 0 auto;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        .header h1 {
            font-size: 34px;
            margin: 0;
            font-weight: 400;
        }
        .header .logo {
            text-align: right;
        }
        .header .logo img {
            height: 64px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        .info-grid p {
            margin: 5px 0;
        }
        .info-grid .bold {
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
        }
        thead tr {
            background-color: #e6e6e6;
        }
        thead th {
            font-weight: normal;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .totals-grid {
            display: grid;
            grid-template-columns: 1fr 300px;
            gap: 30px;
        }
        .totals-table td {
            border: none;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
        }
        .totals-table .total-row {
            background-color: #e6e6e6;
            font-weight: bold;
        }
        .totals-table .total-row td {
            padding: 10px 5px;
        }

        
    </style>
</head>
<body>
    <div class="pdf-content">
        <table style="width: 100%; border: none; margin-bottom: 30px;">
            <tr>
                <td style="border: none; vertical-align: middle;">
                    <h1 style="font-size: 34px; margin: 0; font-weight: 400;">COTIZACIÓN</h1>
                </td>
                <td style="border: none; text-align: right;">
                    <img src="{{ public_path('img/centevi.png') }}" alt="CENTEVI Logo" style="height: 64px;" />
                </td>
            </tr>
        </table>

        <table style="width: 100%; border: none; margin-bottom: 30px; font-size: 13px;">
            <tr>
                <td style="border: none; width: 33%; vertical-align: top;">
                    <p class="bold" style="font-size: 15px; margin-bottom: 10px;"><strong>Para:</strong></p>
                    <p>
                        @if(isset($quoteDetails['paciente']) && isset($quoteDetails['paciente']['nombres']) && isset($quoteDetails['paciente']['apellidos']))
                            {{ trim($quoteDetails['paciente']['nombres']) }} {{ trim($quoteDetails['paciente']['apellidos']) }}
                        @else
                            {{ $quoteDetails['Cliente'] ?? '' }}
                        @endif
                    </p>
                    <p>{{ $quoteDetails['paciente']['direccion'] ?? $quoteDetails['Direccion'] ?? '' }}</p>
                    <p>T: {{ $quoteDetails['paciente']['telefono'] ?? $quoteDetails['Telefono'] ?? '' }}</p>
                    <p>C: {{ $quoteDetails['paciente']['celular'] ?? $quoteDetails['Celular'] ?? '' }}</p>
                </td>
                <td style="border: none; width: 33%; vertical-align: top;">
                    <p style="font-size: 15px; margin-bottom: 10px;">
                        <strong>Cotización:</strong>
                    </p>
                    <p><strong># {{ $quoteDetails['id'] ?? '' }}</strong></p>
                    <p><strong>Tipo:</strong> {{ $quoteDetails['Type'] ?? '' }}</p>
                    <p><strong>Fecha:</strong> {{ isset($quoteDetails['Date']) ? \Carbon\Carbon::parse($quoteDetails['Date'])->format('d/m/Y') : '' }}</p>
                    <p><strong>Expira:</strong> {{ isset($quoteDetails['Expira']) ? \Carbon\Carbon::parse($quoteDetails['Expira'])->format('d/m/Y') : '' }}</p>
                    <p><strong>Bodega:</strong> {{ $quoteDetails['Bodega'] ?? '' }}</p>
                    <p><strong>Vendedor:</strong> {{ $quoteDetails['Vendedor'] ?? '' }}</p>
                    <p><strong>Contacto:</strong> {{ $quoteDetails['Contacto'] ?? '' }}</p>
                </td>
                <td style="border: none; width: 33%; vertical-align: top;">
                    <p class="bold" style="font-size: 18px; margin-bottom: 10px;"><strong>CENTEVI PANAMA, S.A.</strong></p>
                    <p style="font-size: 15px">155659660-2-2017 DV0</p>
                    <p style="font-size: 15px">Tel.: 310-8222</p>
                    <p style="font-size: 15px">{{ $quoteDetails['sucursal']['correo'] ?? 'centevipanamasdasda@email.com' }}</p>
                </td>
            </tr>
        </table>
        
        <table>
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th class="text-center">Unidades</th>
                    <th class="text-right">Precio</th>
                    <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                @forelse($quoteDetails['lines'] as $line)
                   <tr>
                        <td>{{ $line->Codigo ?? 'N/A' }}</td>
                        <td>{{ $line->Nombre ?? 'N/A' }}</td>
                        <td class="text-center">{{ number_format($line->Unidades ?? 0, 2) }}</td>
                        <td class="text-right">{{ number_format($line->Precio_Unitario ?? 0, 2) }}</td>
                        <td class="text-right">{{ number_format($line->Total ?? 0, 2) }}</td>
                    </tr>

                @empty
                    <tr>
                        <td>MP01</td>
                        <td></td>
                        <td class="text-center">2.00</td>
                        <td class="text-right">62.50</td>
                        <td class="text-right">120.38</td>
                    </tr>
                    <tr>
                        <td>DM18.191</td>
                        <td></td>
                        <td class="text-center">1.00</td>
                        <td class="text-right">130.00</td>
                        <td class="text-right">125.19</td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <table style="width: 100%; border: none;">
            <tr>
                <td style="border: none; vertical-align: top;">
                    <p style="font-size: 15px; margin-bottom: 10px;">
                        <strong>Notas adicionales:</strong>
                    </p>
                    <p>{{ $quoteDetails['Comentario'] ?? '-- No hay notas adicionales --' }}</p>
                </td>
                <td style="border: none; width: 300px; vertical-align: top;">
                    <table class="totals-table" style="margin-bottom: 0;">
                        <tr>
                            <td>Sub-Total:</td>
                            <td class="text-right">{{ number_format($quoteDetails['SubTotal'] ?? 0.00, 2) }}</td>
                        </tr>
                        <tr>
                            <td>Descuento:</td>
                            <td class="text-right">{{ number_format($quoteDetails['Discount'] ?? 0.00, 2) }}</td>
                        </tr>
                        <tr>
                            <td>Sub-Total:</td>
                            <td class="text-right">{{ number_format(($quoteDetails['SubTotal'] ?? 0.00) - ($quoteDetails['Discount'] ?? 0.00), 2) }}</td>
                        </tr>
                        <tr>
                            <td>Otros:</td>
                            <td class="text-right">{{ number_format($quoteDetails['Otros'] ?? 0.00, 2) }}</td>
                        </tr>
                        <tr>
                            <td>Impuestos (%):</td>
                            <td class="text-right">{{ number_format($quoteDetails['Taxes'] ?? 0.00, 2) }}</td>
                        </tr>
                        <tr class="total-row">
                            <td>Total:</td>
                            <td class="text-right">{{ number_format($quoteDetails['Total'] ?? 0.00, 2) }}</td>
                        </tr>
                        <tr>
                            <td>Abono:</td>
                            <td class="text-right">{{ number_format($quoteDetails['Abono'] ?? 0.00, 2) }}</td>
                        </tr>
                        <tr>
                            <td>Saldo Pendiente:</td>
                            <td class="text-right">{{ number_format($quoteDetails['SaldoPendiente'] ?? 0.00, 2) }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        
        <table style="width: 100%; border: none; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #666;">
            <tr>
                <td style="border: none; width: 45%; text-align: left; padding-left: 0;">
                    <img src="{{ public_path('img/ubicacion.png') }}" alt="Ubicación" style="vertical-align: middle; margin-right: 5px; width: 10px;">
                    CENTEVI PANAMA, S.A. - PANAMA
                </td>

                <td style="border: none; width: 30%; text-align: center;">
                    <img src="{{ public_path('img/correo.png') }}" alt="Correo" style="vertical-align: middle; margin-right: 5px; width: 12px;">
                    {{ $quoteDetails['sucursal']['correo'] ?? 'centevipanaasdasdasdma@email.com' }}
                </td>

                <td style="border: none; width: 25%; text-align: right;">
                    <img src="{{ public_path('img/telefono.png') }}" alt="Correo" style="vertical-align: middle; margin-right: 5px; width: 12px;">
                    310-8222/
                </td>
            </tr>
        </table>
    </div>
</body>
</html>