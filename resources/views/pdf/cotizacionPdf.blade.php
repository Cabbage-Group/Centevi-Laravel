<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cotización - {{ $quoteDetails['id'] ?? '' }}</title>
    {{-- estilos de fuentes montserrat --}}
    @include('pdf.css.fontMonserrat') 
    <style>
        
        /* ----------------- configuracion pagina ----------------- */
        body {
            font-family: 'Montserrat';
            background: white;
            color:#1E2837;
            font-size: 14px;
        }
        .pdf-content {
            width: 100%;
            margin: 0 auto;
        }
        table {
            width: 100%;
            margin-bottom: 10px;
        }
        
        /* ----------------- tabla/seccion info inicial ----------------- */
        .title{
          font-size: 38px;
          font-weight: 500;
          margin: 0;
        }
        .info-table {
          width: 100%; 
          border: none; 
          font-size: 9px;
          border-collapse: collapse;
        }
        .info-table .header {
          font-weight: 500;
          font-size: 11px; 
          margin-bottom: 5px;
        }

        .info-table .header-bussiness {
          font-weight: 500;
          font-size: 13px; 
          margin-bottom: 5px;
        }

        .info-table .highlight {
          font-weight: 500;
          font-size: 13px; 
          line-height: 1;
        }

        .info-table p {
          margin: 0 0 0 0;
          font-size: 9px; 
        }
        
        
        /* ----------------- tabla de venta ----------------- */
        .sales-table {
          
        }

        .sales-table th {
            border: 0px solid white;
            padding: 8px;
            text-align: left;
            font-size: 11px;
            font-weight: 500;
        }

        .sales-table td {
            border: 0px solid white;
            padding: 8px;
            text-align: left;
            border-bottom: 2px solid #E6E6E6;
            font-size: 9px;
        }

        .sales-table thead tr {
            background-color: #D1D4D9;
            padding-top: 1px;
            padding-bottom: 6px;
        }


        .text-center { text-align: center; }
        .text-right { text-align: right; }

        /* ----------------- tabla/seccion de precios ----------------- */

        .totals-table td {
            border: none;
            font-size: 11px;
        }
        .totals-table .total-row {
            background-color: #D1D4D9;
            font-weight: 500;
        }
        .totals-table .total-row td {
            padding: 10px 5px;
        }

        /* ----------------- tabla/seccion footer ----------------- */

        .footer-table {
          width: 100%; 
          border: none;
          border-top: 1.5px solid #D1D4D9; 
          font-size: 12px; 
          color: #666;
        }

        .footer-table td {
          font-size: 9px;
          padding-top: 2px;
          
        }
        .footer-table td p {
          font-size: 9px;
          margin: 0 25px 0 0;
          display: inline;
          text
        }


    </style>
</head>
<body>
    <div class="pdf-content">
        <table style="width: 100%; border: none; margin-bottom: 10px;">
            <tr>
                <td style="border: none; vertical-align: middle;">
                    <h1 class="title">COTIZACIÓN</h1>
                </td>
                <td style="border: none; text-align: right;">
                    <img src="{{ public_path('img/centevi.png') }}" alt="CENTEVI Logo" style="height: 64px;" />
                </td>
            </tr>
        </table>

        <table class="info-table">
            <tr>
                <td style="border: none; width: 37%; vertical-align: top; padding-right: 40px">
                    <p class="header">Para:</p>
                    <p class="highlight">
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
                    <p class="header">Cotización:</p>
                    <p class="highlight"># {{ $quoteDetails['id'] ?? '' }}</p>
                     {{-- <p class="highlight"># {{ $quoteDetails['codigo_interfuerza'] ?? 'SINCODIGO' }}</p> --}}
                    <p>Tipo: {{ $quoteDetails['Type'] ?? '' }}</p>
                    <p>Fecha: {{ isset($quoteDetails['Date']) ? \Carbon\Carbon::parse($quoteDetails['Date'])->format('d/m/Y') : '' }}</p>
                    <p>Expira: {{ isset($quoteDetails['Expira']) ? \Carbon\Carbon::parse($quoteDetails['Expira'])->format('d/m/Y') : '' }}</p>
                    <p>Bodega: {{ $quoteDetails['Bodega'] ?? '' }}</p>
                    <p>Vendedor: {{ $quoteDetails['Vendedor'] ?? '' }}</p>
                    <p>Contacto: {{ $quoteDetails['Contacto'] ?? '' }}</p>
                </td>
                <td style="border: none; width: 30%; vertical-align: top;">
                    <p class="header-bussiness">CENTEVI PANAMA, S.A.</p>
                    <p >155659660-2-2017 DV0</p>
                    <p >Tel.: 310-8222</p>
                    <p >{{ $quoteDetails['sucursal']['correo'] ?? 'centevipanama' }}</p>
                </td>
            </tr>
        </table>

        <table class="sales-table">
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
                    <p style="font-size: 13px; margin: 0 0 10px 0; font-weight: 500;">
                        Notas adicionales:
                    </p>
                    <p style="font-size: 9px;">{{ $quoteDetails['Comentario'] ?? '-- No hay notas adicionales --' }}</p>
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

        <table class="footer-table">
            <tr style="width: 100%;">
                <td>
                    <p>
                        <img src="{{ public_path('img/ubicacion-simple.png') }}" alt="Ubicación" style="vertical-align: middle; margin-right: 5px; width: 10px;">
                        CENTEVI PANAMA, S.A. - PANAMA 
                    </p>
                  
                    <p>
                        <img src="{{ public_path('img/arroba.png') }}" alt="Correo" style="vertical-align: middle; margin-right: 5px; width: 12px;">
                        {{ $quoteDetails['sucursal']['correo'] ?? 'centevipanama' }}
                    </p>
                  
                    <p>
                        <img src="{{ public_path('img/telefono-simple.png') }}" alt="Correo" style="vertical-align: middle; margin-right: 5px; width: 12px;">
                        310-8222/
                    </p>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>