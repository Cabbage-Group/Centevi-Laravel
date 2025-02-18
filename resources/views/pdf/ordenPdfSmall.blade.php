<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Boleta-{{$nro_orden}}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 226.77pt;
      /* 80mm width */
      font-family: 'Courier', monospace;
      /* Receipt-style font */
      font-size: 9pt;
    }

    @page {
      size: 226.77pt 220pt;
      /* Width 80mm, height for minimal receipt */
      margin: 2mm;
    }

    .receipt {
      width: 100%;
      text-align: center;
    }

    .logo-container {
      margin: 8pt auto;
      height: 25pt;
      text-align: center;
    }

    .logo {
      height: 25pt;
      max-width: 80%;
      object-fit: contain;
    }

    .divider {
      border-top: 1px dashed #000;
      margin: 5pt 0;
    }

    .title {
      font-size: 10pt;
      font-weight: bold;
      margin: 5pt 0;
    }

    .order-number {
      font-size: 12pt;
      font-weight: bold;
      margin: 5pt 0;
    }

    .info-section {
      text-align: left;
      padding: 0 5pt;
    }

    .info-row {
      line-height: 12pt;
    }

    .label {
      font-weight: bold;
    }

    .footer {
      margin-top: 10pt;
      font-size: 8pt;
      text-align: center;
    }
  </style>
</head>

<body>
  <div class="receipt">
    <div class="logo-container">
      <img alt="logo" class="logo" src="{{ public_path('img/centevi.png') }}" />
    </div>

    <div class="title">Ticket:</div>

    <div class="divider"></div>

    <!-- Order Number -->
    <div class="order-number">N° ORDEN {{ $nro_orden }}</div>

    <div class="divider"></div>

    <!-- Receipt Information -->
    <div class="info-section">
      <div class="info-row">
        <span class="label">FECHA:</span> {{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}
      </div>
      <div class="info-row">
        <span class="label">PACIENTE:</span> {{ ucwords(strtolower($nombres_apellidos_paciente)) }}
      </div>
      <div class="info-row">
        <span class="label">SUCURSAL:</span> {{ $sucursal }}
      </div>
    </div>

    <div class="divider"></div>

    <div class="footer">
      * *<br>

    </div>
  </div>
</body>

</html>