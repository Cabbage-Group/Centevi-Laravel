<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Orden-{{$nro_orden}}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 226.77pt;
      font-size: 9pt;
    }

    @page {
      size: 226.77pt 841.89pt;
      /* Exactly 80mm × 297mm (A4 height) */
      margin: 5mm;
      font-family: 'sans-serif';
    }

    .container-grid {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2pt;
    }

    .item-orden {
      width: 50%;
      display: block;
      text-align: center;
      margin: 0 0 2pt 0;
      padding: 2pt 0;
    }

    .item-lente {
      width: 50%;
      display: block;
      text-align: center;
      margin: 0 0 2pt 0;
      padding: 2pt 0;
    }

    .boton-tipo-lente {
      background-color: #1BBC9C;
      color: white;
      padding: 3pt 0;
      font-size: 9pt;
      border-radius: 3pt;
      border: 1px solid #1BBC9C;
      width: 100%;
    }

    .boton-item-orden {
      background-color: white;
      color: red;
      padding: 3pt 0;
      font-size: 9pt;
      border-radius: 3pt;
      border: 1px solid gray;
      width: 100%;
    }

    .boton-item-white {
      background-color: white;
      display: block;
      padding: 3pt 2pt;
      font-size: 9pt;
      border-radius: 3pt;
      border: 1px solid gray;
      width: 100%;
      margin-bottom: 2pt;
      box-sizing: border-box;
    }

    .item-fecha-orden {
      background-color: white;
      color: gray;
      padding: 3pt 0;
      font-size: 9pt;
      width: 100%;
      border-radius: 3pt;
      border: 1px solid gray;
    }

    .header-table {
      background-color: #C0CDFA;
      color: #515365;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      font-size: 8pt;
    }

    .header-table th {
      padding: 2pt 1pt;
      font-size: 7pt;
    }

    .row-table th {
      padding: 2pt 0;
      color: #515365;
      font-size: 8pt;
    }

    .row-table {
      border-bottom: 1px solid gray;
    }

    .info-tabla-cristales {
      font-size: 8pt;
      background-color: white;
      border: 1px solid gray;
      border-radius: 3pt;
      padding: 2pt;
      margin-top: 1pt;
      width: 100%;
      display: block;
      box-sizing: border-box;
    }

    .tabla-caracteristicas {
      width: 100%;
    }

    .tabla-caracteristicas td {
      white-space: normal;
      word-wrap: break-word;
      word-break: break-word;
      width: 33%;
      font-size: 7pt;
      vertical-align: top;
      padding: 1pt;
    }

    .table-informacion th,
    .table-informacion td {
      border: 1px solid gray;
      padding: 2pt 1pt;
      font-size: 7pt;
    }

    .table-informacion .cell-no-border {
      border-bottom: 1px solid white;
    }

    h4 {
      margin: 2pt 0;
      padding: 0;
      font-size: 9pt;
    }

    /* Adjustments for the lens diagram */
    .lens-diagram {
      position: relative;
      width: 80%;
      text-align: center;
      margin: 5pt auto;
      height: 130pt;
    }

    .lens-diagram img {
      height: 120pt;
      width: auto;
      max-width: 100%;
    }

    .lens-diagram button {
      position: absolute;
      border: 1px solid red;
      background-color: white;
      font-size: 6pt;
      width: 25pt;
      height: 12pt;
      padding: 0;
      margin: 0;
    }

    .caracteristicas-section {
      width: 100%;
      border: 1px solid blue;
      border-radius: 5pt;
      padding: 4pt;
      margin-top: 3pt;
      box-sizing: border-box;
    }

    .section-title {
      width: 100%;
      margin-bottom: 3pt;
      font-size: 9pt;
      font-weight: bold;
    }

    .field-label {
      font-size: 7pt;
      color: #888ea8;
      font-weight: 700;
      margin-bottom: 1pt;
    }

    .field-row {
      width: 100%;
      margin-bottom: 3pt;
    }

    .field-flex-row {
      display: flex;
      width: 100%;
      justify-content: space-between;
      margin-bottom: 3pt;
    }

    .field-half {
      width: 48%;
    }

    .check-label {
      display: flex;
      align-items: center;
      font-size: 7pt;
    }

    .check-circle {
      width: 7pt;
      height: 7pt;
      border-radius: 50%;
      display: inline-block;
      margin-right: 2pt;
    }

    .check-circle-checked {
      border: 1pt solid blue;
      background-color: white;
    }

    .check-circle-unchecked {
      background-color: #E0E6ED;
    }
  </style>
</head>

<body>
  <div class="container-grid">
    <div class="item-orden">
      <img alt="logo" class="navbar-logo" src="{{ public_path('img/centevi.png') }}"
        style="width:70%; max-height:18pt; margin-top:0" />
    </div>
    <div class="item-orden">
      <h4 style="font-weight:400; color:#3b3f5c">Fecha de solicitud</h4>
      <button class="item-fecha-orden"
        style="margin-top:1pt">{{ \Carbon\Carbon::parse($fecha_solicitud)->format('d/m/Y') }}</button>
    </div>
    <div class="item-orden">
      <h4 style="font-weight:400; color:#3b3f5c">Nro. Orden*</h4>
      <button class="boton-item-orden" style="margin-top:1pt">{{ $nro_orden }}</button>
    </div>
    <div class="item-lente">
      <h4 style="font-weight:400; color:#3b3f5c">Tipo de lente</h4>
      <button class="boton-tipo-lente" style="margin-top:1pt">
        {{ $lente_contacto ? 'Lente de contacto' : 'Lente normal' }}
      </button>
    </div>
  </div>
  <div style="margin-bottom:3pt; margin-top:2pt;">
    <div id="name-lastname" style="color:#3b3f5c;font-size:8pt;"><span
        style="font-family:'Segoe UI', sans-serif; font-weight:700">Paciente:</span> <span
        style="font-family:'Segoe UI', sans-serif;">{{ ucwords(strtolower($nombres_apellidos_paciente)) }}</span></div>
    <div style="color:#3b3f5c;font-size:8pt;"><span
        style="font-family:'Segoe UI', sans-serif; font-weight:700">Sucursal:</span> <span
        style="font-family:'Segoe UI', sans-serif;">{{ $sucursal }}</span></div>
  </div>
  <div class="container-grid">
    <table style="width:90%;" class="table-informacion">
      <tr class="header-table">
        <th>RX</th>
        <th>Esf</th>
        <th>Cil</th>
        <th>Eje</th>
        <th>ADD</th>
        @if($lente_contacto)
      <th>Tipo LC</th>
      <th>CB</th>
      <th>Diam</th>
    @else
    <th>PRIS</th>
    <th>DP*</th>
    <th>ALT</th>
  @endif
      </tr>
      <tr class="row-table" style="font-family:'DejaVu Sans', sans-serif">
        <th>OD</th>
        <th>{{$esfera_od}}</th>
        <th>{{$cilindro_od}}</th>
        <th>{{$eje_od}}</th>
        <th>{{$add_od}}</th>
        <th>{{$prisma_od}}</th>
        <th>{{$distancia_od}}</th>
        <th>{{$altura_od}}</th>
      </tr>
      <tr class="row-table" style="font-family:'DejaVu Sans', sans-serif">
        <th>OI</th>
        <th>{{$esfera_oi}}</th>
        <th>{{$cilindro_oi}}</th>
        <th>{{$eje_oi}}</th>
        <th>{{$add_oi}}</th>
        <th>{{$prisma_oi}}</th>
        <th class="{{ !$lente_contacto ? 'cell-no-border' : '' }}">{{$distancia_oi}}</th>
        <th>{{$altura_oi}}</th>
      </tr>
    </table>
  </div>
  @if(!$lente_contacto)
    <div class="caracteristicas-section" style="width:87%;">
    <div class="section-title">Caracteristicas de Cristales</div>
    <table class="tabla-caracteristicas">
      <thead>
      <tr>
        <th style="font-size:7pt; width:33%">TIPO DE CRISTAL</th>
        <th style="font-size:7pt; width:33%">MATERIAL</th>
        <th style="font-size:7pt; width:33%">TRATAMIENTOS</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>
        <div style="font-size:7pt; text-align:left">OD:</div>
        @if($tipo_cristal_od)
      <button class="info-tabla-cristales">{{$tipo_cristal_od}}</button>
    @endif
        </td>
        <td>
        <div style="font-size:7pt; text-align:left">OD:</div>
        @if($material_od)
      <button class="info-tabla-cristales">{{$material_od}}</button>
    @endif
        </td>
        <td>
        <div style="font-size:7pt; text-align:left">OD:</div>
        @if($tratamientos_od)
      <button class="info-tabla-cristales">{{$tratamientos_od}}</button>
    @endif

        </td>
      </tr>
      <tr>
        <td>
        <div style="font-size:7pt; text-align:left">OI:</div>
        @if($tipo_cristal_oi)
      <button class="info-tabla-cristales">{{$tipo_cristal_oi}}</button>
    @endif
        </td>
        <td>
        <div style="font-size:7pt; text-align:left">OI:</div>
        @if($material_oi)
      <button class="info-tabla-cristales">{{$material_oi}}</button>
    @endif
        </td>
        <td>
        <div style="font-size:7pt; text-align:left">OI:</div>
        @if($tratamientos_oi)
      <button class="info-tabla-cristales">{{$tratamientos_oi}}</button>
    @endif
        </td>
      </tr>
      </tbody>
    </table>
    </div>
  @endif

  @if($lente_contacto)
    <div class="caracteristicas-section">
    <div class="section-title">Caracteristicas de Aro</div>
    <div class="field-row">
      <div class="field-label">MARCA</div>
      <buton class="boton-item-white"
      style="white-space: normal; word-wrap: break-word; {{$marca == '_' ? 'color:white' : ''}}">
      {{$marca}}
      </buton>
    </div>
    <div class="field-row">
      <div class="field-label">OBSERVACIONES</div>
      <button class="boton-item-white"
      style="{{$observaciones == '_' ? 'color:white' : ''}}">{{$observaciones}}</button>
    </div>
    </div>
  @else
    <div class="caracteristicas-section" style="width:87%;">
    <div class="section-title">Caracteristicas de Aro</div>

    <div class="field-row" style="width:87%;">
      <div class="field-label">COLOR*</div>
      <button class="boton-item-white"
      style="text-align:left;white-space: normal; word-wrap: break-word; {{$color == '_' ? 'color:white' : ''}}">{{$color}}</button>
    </div>

    <div class="field-flex-row">
      <div class="field-half">
      <div class="check-label">
        <span class="check-circle {{ $aro_centevi ? 'check-circle-checked' : 'check-circle-unchecked' }}"></span>
        ARO CENTEVI
      </div>
      </div>
      <div class="field-half">
      <div class="check-label">
        <span class="check-circle {{ $aro_propio ? 'check-circle-checked' : 'check-circle-unchecked' }}"></span>
        ARO PROPIO
      </div>
      </div>
    </div>

    <div class="field-flex-row">
      <div class="field-half">
      <div class="field-label">CÓDIGO</div>
      <buton class="boton-item-white"
        style="white-space: normal; word-wrap: break-word; {{$codigo == '_' ? 'color:white' : ''}}">
        {{$codigo}}
      </buton>
      </div>
      <div class="field-half">
      <div class="field-label">MARCA</div>
      <buton class="boton-item-white"
        style="white-space: normal; word-wrap: break-word; {{$marca == '_' ? 'color:white' : ''}}">
        {{$marca}}
      </buton>
      </div>
    </div>

    <div class="lens-diagram">
      <img src="{{ public_path('/assets/img/recetas/lentessinbarrillav2.png') }}" />
      <button style="left:-4%; top:41%;">{{$l_uno}}</button>
      <button style="left:20%; top:3%;">{{$l_dos}}</button>
      <button style="left:45%; top:25%;">{{$l_tres}}</button>
      <button style="left:20%; top:80%;">{{$l_cuatro}}</button>
      <button style="left:70%; top:42%;">{{$l_cinco}}</button>
    </div>

    <div class="field-row" style="width:87%;">
      <div class="field-label">TIPO DE ARO*</div>
      <button class="boton-item-white" style="white-space: normal; word-wrap: break-word;">{{$tipo_aro}}</button>
    </div>

    <div class="field-row" style="width:87%;">
      <div class="field-label">OBSERVACIONES</div>
      <button class="boton-item-white"
      style="{{$observaciones == '_' ? 'color:white' : ''}}">{{$observaciones}}</button>
    </div>
    </div>
  @endif
</body>

</html>