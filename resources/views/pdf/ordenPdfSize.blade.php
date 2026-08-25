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
      margin: 30pt auto;
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


    /* ============================================================
       NUEVOS TIPOS DE LENTE
       SOLO ONEFIT / ONEFITMED
       ============================================================ */

    .caracteristicas-section-nuevo {
      width: 87%;
      border: 1px solid blue;
      border-radius: 5pt;
      padding: 4pt;
      margin-top: 3pt;
      box-sizing: border-box;
      overflow: hidden;
    }

    .section-title-nuevo {
      width: 100%;
      margin-bottom: 3pt;
      font-size: 9pt;
      font-weight: bold;
      white-space: normal;
      word-wrap: break-word;
    }

    /*
     * IMPORTANTE:
     * table-layout: fixed evita que las columnas crezcan
     * por el contenido y se salgan del ticket.
     */
    .tabla-nuevo {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
      margin: 0;
      padding: 0;
    }

    .tabla-nuevo th,
    .tabla-nuevo td {
      border: 1px solid gray;
      text-align: center;
      vertical-align: middle;
      overflow: hidden;
      word-wrap: break-word;
      word-break: break-all;
      white-space: normal;
      box-sizing: border-box;
    }

    .tabla-nuevo th {
      background-color: #C0CDFA;
      color: #515365;
      font-size: 6pt;
      line-height: 7pt;
      padding: 2pt 1pt;
    }

    .tabla-nuevo td {
      font-family: 'DejaVu Sans', sans-serif;
      font-size: 6pt;
      line-height: 7pt;
      padding: 2pt 1pt;
    }

    .tabla-nuevo .ojo {
      font-weight: bold;
      font-size: 6.5pt;
      color: #515365;
    }

    /*
     * OneFit:
     * 7 columnas.
     * Los porcentajes suman exactamente 100%.
     */
    .tabla-onefit th:nth-child(1),
    .tabla-onefit td:nth-child(1) {
      width: 10%;
    }

    .tabla-onefit th:nth-child(2),
    .tabla-onefit td:nth-child(2) {
      width: 14%;
    }

    .tabla-onefit th:nth-child(3),
    .tabla-onefit td:nth-child(3) {
      width: 14%;
    }

    .tabla-onefit th:nth-child(4),
    .tabla-onefit td:nth-child(4) {
      width: 14%;
    }

    .tabla-onefit th:nth-child(5),
    .tabla-onefit td:nth-child(5) {
      width: 14%;
    }

    .tabla-onefit th:nth-child(6),
    .tabla-onefit td:nth-child(6) {
      width: 14%;
    }

    .tabla-onefit th:nth-child(7),
    .tabla-onefit td:nth-child(7) {
      width: 20%;
    }


    .tabla-contacto {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
    }

    .tabla-contacto th,
    .tabla-contacto td {
      font-size: 5pt;
      line-height: 5.5pt;
      padding: 1pt 0.5pt;
    }

    /* RX */
    .tabla-contacto th:nth-child(1),
    .tabla-contacto td:nth-child(1) {
      width: 7%;
    }

    /* Esfera */
    .tabla-contacto th:nth-child(2),
    .tabla-contacto td:nth-child(2) {
      width: 11%;
    }

    /* Cilindro */
    .tabla-contacto th:nth-child(3),
    .tabla-contacto td:nth-child(3) {
      width: 11%;
    }

    /* Eje */
    .tabla-contacto th:nth-child(4),
    .tabla-contacto td:nth-child(4) {
      width: 9%;
    }

    /* ADD */
    .tabla-contacto th:nth-child(5),
    .tabla-contacto td:nth-child(5) {
      width: 9%;
    }

    /* Tipo de lente de contacto */
    .tabla-contacto th:nth-child(6),
    .tabla-contacto td:nth-child(6) {
      width: 20%;
    }

    /* Curva Base */
    .tabla-contacto th:nth-child(7),
    .tabla-contacto td:nth-child(7) {
      width: 16%;
    }

    /* Diámetro */
    .tabla-contacto th:nth-child(8),
    .tabla-contacto td:nth-child(8) {
      width: 17%;
    }

    /*
     * OneFit Med:
     * 9 columnas.
     * Se hacen todavía más compactas porque tiene más parámetros.
     */
    .tabla-onefitmed th {
      font-size: 5.2pt;
      line-height: 6pt;
      padding: 2pt 0.5pt;
    }

    .tabla-onefitmed td {
      font-size: 5.5pt;
      line-height: 6pt;
      padding: 2pt 0.5pt;
    }

    .tabla-onefitmed th:nth-child(1),
    .tabla-onefitmed td:nth-child(1) {
      width: 9%;
    }

    .tabla-onefitmed th:nth-child(2),
    .tabla-onefitmed td:nth-child(2) {
      width: 11%;
    }

    .tabla-onefitmed th:nth-child(3),
    .tabla-onefitmed td:nth-child(3) {
      width: 12%;
    }

    .tabla-onefitmed th:nth-child(4),
    .tabla-onefitmed td:nth-child(4) {
      width: 12%;
    }

    .tabla-onefitmed th:nth-child(5),
    .tabla-onefitmed td:nth-child(5) {
      width: 11%;
    }

    .tabla-onefitmed th:nth-child(6),
    .tabla-onefitmed td:nth-child(6) {
      width: 11%;
    }

    .tabla-onefitmed th:nth-child(7),
    .tabla-onefitmed td:nth-child(7) {
      width: 11%;
    }

    .tabla-onefitmed th:nth-child(8),
    .tabla-onefitmed td:nth-child(8) {
      width: 11%;
    }

    .tabla-onefitmed th:nth-child(9),
    .tabla-onefitmed td:nth-child(9) {
      width: 12%;
    }

    .nuevo-marcas {
      width: 100%;
      margin-top: 4pt;
    }

    .nuevo-marca-col {
      width: 48%;
      display: inline-block;
      vertical-align: top;
    }

    .nuevo-marca-space {
      width: 3%;
      display: inline-block;
    }

    .nuevo-label {
      font-size: 7pt;
      color: #888ea8;
      font-weight: 700;
      margin-bottom: 1pt;
    }

    .nuevo-valor {
      background-color: white;
      display: block;
      padding: 3pt 2pt;
      font-size: 8pt;
      border-radius: 3pt;
      border: 1px solid gray;
      width: 100%;
      box-sizing: border-box;
      white-space: normal;
      word-wrap: break-word;
      word-break: break-word;
      min-height: 14pt;
    }

    .nuevo-observaciones {
      width: 100%;
      margin-top: 4pt;
    }
  </style>
</head>

<body>

  {{-- ============================================================
       HEADER
       NO SE MODIFICA
  ============================================================ --}}

  <div class="container-grid">

    <div class="item-orden">

      <img
        alt="logo"
        class="navbar-logo"
        src="{{ public_path('img/centevi.png') }}"
        style="width:70%; max-height:18pt; margin-top:0" />

    </div>


    <div class="item-orden">

      <h4 style="font-weight:400; color:#3b3f5c">
        Fecha de solicitud
      </h4>

      <button
        class="item-fecha-orden"
        style="margin-top:1pt">
        {{ \Carbon\Carbon::parse($fecha_solicitud)->format('d/m/Y') }}
      </button>

    </div>


    <div class="item-orden">

      <h4 style="font-weight:400; color:#3b3f5c">
        Nro. Orden*
      </h4>

      <button
        class="boton-item-orden"
        style="margin-top:1pt">
        {{ $nro_orden }}
      </button>

    </div>


    <div class="item-lente">

      <h4 style="font-weight:400; color:#3b3f5c">
        Tipo de lente
      </h4>

      <button
        class="boton-tipo-lente"
        style="margin-top:1pt">

        @if($tipo_lente === 'contacto')

        Lente de contacto

        @elseif($tipo_lente === 'onefit')

        Lente escleral OneFit

        @elseif($tipo_lente === 'onefitmed')

        Lente escleral OneFit Med

        @else

        Lente normal

        @endif

      </button>

    </div>

  </div>


  {{-- ============================================================
       PACIENTE / SUCURSAL
       NO SE MODIFICA
  ============================================================ --}}

  <div style="margin-bottom:3pt; margin-top:2pt;">

    <div
      id="name-lastname"
      style="color:#3b3f5c;font-size:8pt;">

      <span
        style="font-family:'Segoe UI', sans-serif; font-weight:700">
        Paciente:
      </span>

      <span
        style="font-family:'Segoe UI', sans-serif;">
        {{ ucwords(strtolower($nombres_apellidos_paciente)) }}
      </span>

    </div>

    <div style="color:#3b3f5c;font-size:8pt;">

      <span
        style="font-family:'Segoe UI', sans-serif; font-weight:700">
        Sucursal:
      </span>

      <span
        style="font-family:'Segoe UI', sans-serif;">
        {{ $sucursal }}
      </span>

    </div>

  </div>


  {{-- ============================================================
       RX
       SOLO PARA ARO
       SE MANTIENE IGUAL
  ============================================================ --}}

  @if($tipo_lente === 'aro')

  <div class="container-grid">

    <table
      style="width:90%;"
      class="table-informacion">

      <tr class="header-table">

        <th>RX</th>

        <th>Esf</th>

        <th>Cil</th>

        <th>Eje</th>

        <th>ADD</th>

        <th>PRIS</th>

        <th>DP*</th>

        <th>ALT</th>

      </tr>


      <tr
        class="row-table"
        style="font-family:'DejaVu Sans', sans-serif">

        <th>OD</th>

        <th>{{ $esfera_od }}</th>

        <th>{{ $cilindro_od }}</th>

        <th>{{ $eje_od }}</th>

        <th>{{ $add_od }}</th>

        <th>{{ $prisma_od }}</th>

        <th>{{ $distancia_od }}</th>

        <th>{{ $altura_od }}</th>

      </tr>


      <tr
        class="row-table"
        style="font-family:'DejaVu Sans', sans-serif">

        <th>OI</th>

        <th>{{ $esfera_oi }}</th>

        <th>{{ $cilindro_oi }}</th>

        <th>{{ $eje_oi }}</th>

        <th>{{ $add_oi }}</th>

        <th>{{ $prisma_oi }}</th>

        <th class="cell-no-border">
          {{ $distancia_oi }}
        </th>

        <th>{{ $altura_oi }}</th>

      </tr>

    </table>

  </div>

  @endif


  {{-- ============================================================
       LENTE DE CONTACTO
       SE MANTIENE EL DISEÑO ACTUAL
  ============================================================ --}}

  @if($tipo_lente === 'contacto')

  <div class="caracteristicas-section" style="width: 80%;">

    <div class="section-title">
      Caracteristicas de Aro
    </div>

    <table class="tabla-nuevo tabla-contacto">

      <thead>

        <tr>

          <th>RX</th>

          <th>Esfera</th>

          <th>Cilindro</th>

          <th>Eje</th>

          <th>ADD</th>

          <th>
            Tipo de <br>
            lente <br>
            de contacto
          </th>

          <th>Curva Base</th>

          <th>Diametro</th>

        </tr>

      </thead>


      <tbody>

        <tr>

          <td class="ojo">
            OD
          </td>

          <td>
            {{ $esfera_od ?? '-' }}
          </td>

          <td>
            {{ $cilindro_od ?? '-' }}
          </td>

          <td>
            {{ $eje_od ?? '-' }}
          </td>

          <td>
            {{ $add_od ?? '-' }}
          </td>

          <td>
            {{ $prisma_od ?? '-' }}
          </td>

          <td>
            {{ $distancia_od ?? '-' }}
          </td>

          <td>
            {{ $altura_od ?? '-' }}
          </td>

        </tr>


        <tr>

          <td class="ojo">
            OI
          </td>

          <td>
            {{ $esfera_oi ?? '-' }}
          </td>

          <td>
            {{ $cilindro_oi ?? '-' }}
          </td>

          <td>
            {{ $eje_oi ?? '-' }}
          </td>

          <td>
            {{ $add_oi ?? '-' }}
          </td>

          <td>
            {{ $prisma_oi ?? '-' }}
          </td>

          <td>
            {{ $distancia_oi ?? '-' }}
          </td>

          <td>
            {{ $altura_oi ?? '-' }}
          </td>

        </tr>

      </tbody>

    </table>

    <div class="field-row">

      <div class="field-label">
        MARCA
      </div>

      <button
        class="boton-item-white"
        style="
          max-width: 180px;
          white-space: normal;
          word-break: break-word;
          overflow-wrap: break-word;
          {{$marca == '_' ? 'color:white' : ''}}
        ">
        {{$marca}}
      </button>

    </div>

    <div class="field-row">

      <div class="field-label">
        OBSERVACIONES
      </div>

      <button
        class="boton-item-white"
        style="
          max-width: 180px;
          white-space: normal;
          word-break: break-word;
          overflow-wrap: break-word;
          {{$observaciones == '_' ? 'color:white' : ''}}
        ">
        {{$observaciones}}
      </button>

    </div>

  </div>

  @endif


  {{-- ============================================================
       ONEFIT
       NUEVO TIPO - COMPACTO
  ============================================================ --}}

  @if($tipo_lente === 'onefit')

  <div class="caracteristicas-section-nuevo">

    <div class="section-title-nuevo">
      Características Lente Escleral OneFit
    </div>


    <table class="tabla-nuevo tabla-onefit">

      <thead>

        <tr>

          <th>RX</th>

          <th>Poder</th>

          <th>Diam</th>

          <th>Edge</th>

          <th>PFSD</th>

          <th>CB</th>

          <th>CT</th>

        </tr>

      </thead>


      <tbody>

        <tr>

          <td class="ojo">
            OD
          </td>

          <td>
            {{ $poder_od ?? '-' }}
          </td>

          <td>
            {{ $dia_od ?? '-' }}
          </td>

          <td>
            {{ $edge_od ?? '-' }}
          </td>

          <td>
            {{ $pfsd_od ?? '-' }}
          </td>

          <td>
            {{ $cb_od ?? '-' }}
          </td>

          <td>
            {{ $ct_od ?? '-' }}
          </td>

        </tr>


        <tr>

          <td class="ojo">
            OI
          </td>

          <td>
            {{ $poder_oi ?? '-' }}
          </td>

          <td>
            {{ $dia_oi ?? '-' }}
          </td>

          <td>
            {{ $edge_oi ?? '-' }}
          </td>

          <td>
            {{ $pfsd_oi ?? '-' }}
          </td>

          <td>
            {{ $cb_oi ?? '-' }}
          </td>

          <td>
            {{ $ct_oi ?? '-' }}
          </td>

        </tr>

      </tbody>

    </table>


    {{-- MARCAS --}}

    <div class="nuevo-marcas">

      <div class="nuevo-marca-col">

        <div class="nuevo-label">
          MARCA OD
        </div>

        <div class="nuevo-valor">
          {{ $marca ?? '-' }}
        </div>

      </div>


      <div class="nuevo-marca-space"></div>


      <div class="nuevo-marca-col">

        <div class="nuevo-label">
          MARCA OI
        </div>

        <div class="nuevo-valor">
          {{ $marca_oi ?? '-' }}
        </div>

      </div>

    </div>


    {{-- OBSERVACIONES --}}

    @if($observaciones && $observaciones !== '_')

    <div class="nuevo-observaciones">

      <div class="nuevo-label">
        OBSERVACIONES
      </div>

      <div class="nuevo-valor">
        {{ $observaciones }}
      </div>

    </div>

    @endif

  </div>

  @endif


  {{-- ============================================================
       ONEFIT MED
       NUEVO TIPO - COMPACTO
  ============================================================ --}}

  @if($tipo_lente === 'onefitmed')

  <div class="caracteristicas-section-nuevo">

    <div class="section-title-nuevo">
      Características Lente Escleral OneFit Med
    </div>


    <table class="tabla-nuevo tabla-onefitmed">

      <thead>

        <tr>

          <th>RX</th>

          <th>SAG</th>

          <th>Poder</th>

          <th>Diam</th>

          <th>MID</th>

          <th>LIM</th>

          <th>PFSD</th>

          <th>EDG</th>

          <th>CT</th>

        </tr>

      </thead>


      <tbody>

        <tr>

          <td class="ojo">
            OD
          </td>

          <td>
            {{ $sag_od ?? '-' }}
          </td>

          <td>
            {{ $poder_od ?? '-' }}
          </td>

          <td>
            {{ $dia_od ?? '-' }}
          </td>

          <td>
            {{ $mid_od ?? '-' }}
          </td>

          <td>
            {{ $lim_od ?? '-' }}
          </td>

          <td>
            {{ $pfsd_od ?? '-' }}
          </td>

          <td>
            {{ $edg_od ?? '-' }}
          </td>

          <td>
            {{ $ct_od ?? '-' }}
          </td>

        </tr>


        <tr>

          <td class="ojo">
            OI
          </td>

          <td>
            {{ $sag_oi ?? '-' }}
          </td>

          <td>
            {{ $poder_oi ?? '-' }}
          </td>

          <td>
            {{ $dia_oi ?? '-' }}
          </td>

          <td>
            {{ $mid_oi ?? '-' }}
          </td>

          <td>
            {{ $lim_oi ?? '-' }}
          </td>

          <td>
            {{ $pfsd_oi ?? '-' }}
          </td>

          <td>
            {{ $edg_oi ?? '-' }}
          </td>

          <td>
            {{ $ct_oi ?? '-' }}
          </td>

        </tr>

      </tbody>

    </table>


    {{-- MARCAS --}}

    <div class="nuevo-marcas">

      <div class="nuevo-marca-col">

        <div class="nuevo-label">
          MARCA OD
        </div>

        <div class="nuevo-valor">
          {{ $marca ?? '-' }}
        </div>

      </div>


      <div class="nuevo-marca-space"></div>


      <div class="nuevo-marca-col">

        <div class="nuevo-label">
          MARCA OI
        </div>

        <div class="nuevo-valor">
          {{ $marca_oi ?? '-' }}
        </div>

      </div>

    </div>


    {{-- OBSERVACIONES --}}

    @if($observaciones && $observaciones !== '_')

    <div class="nuevo-observaciones">

      <div class="nuevo-label">
        OBSERVACIONES
      </div>

      <div class="nuevo-valor">
        {{ $observaciones }}
      </div>

    </div>

    @endif

  </div>

  @endif


  {{-- ============================================================
       CRISTALES
       SOLO PARA ARO
       SE MANTIENE IGUAL
  ============================================================ --}}

  @if($tipo_lente === 'aro')

  <div
    class="caracteristicas-section"
    style="width:87%;">

    <div class="section-title">
      Caracteristicas de Cristales
    </div>


    <table class="tabla-caracteristicas">

      <thead>

        <tr>

          <th style="font-size:7pt; width:33%">
            TIPO DE CRISTAL
          </th>

          <th style="font-size:7pt; width:33%">
            MATERIAL
          </th>

          <th style="font-size:7pt; width:33%">
            TRATAMIENTOS
          </th>

        </tr>

      </thead>


      <tbody>

        <tr>

          <td>

            <div style="font-size:7pt; text-align:left">
              OD:
            </div>

            @if($tipo_cristal_od)

            <button class="info-tabla-cristales">
              {{$tipo_cristal_od}}
            </button>

            @endif

          </td>


          <td>

            <div style="font-size:7pt; text-align:left">
              OD:
            </div>

            @if($material_od)

            <button class="info-tabla-cristales">
              {{$material_od}}
            </button>

            @endif

          </td>


          <td>

            <div style="font-size:7pt; text-align:left">
              OD:
            </div>

            @if($tratamientos_od)

            <button class="info-tabla-cristales">
              {{$tratamientos_od}}
            </button>

            @endif

          </td>

        </tr>


        <tr>

          <td>

            <div style="font-size:7pt; text-align:left">
              OI:
            </div>

            @if($tipo_cristal_oi)

            <button class="info-tabla-cristales">
              {{$tipo_cristal_oi}}
            </button>

            @endif

          </td>


          <td>

            <div style="font-size:7pt; text-align:left">
              OI:
            </div>

            @if($material_oi)

            <button class="info-tabla-cristales">
              {{$material_oi}}
            </button>

            @endif

          </td>


          <td>

            <div style="font-size:7pt; text-align:left">
              OI:
            </div>

            @if($tratamientos_oi)

            <button class="info-tabla-cristales">
              {{$tratamientos_oi}}
            </button>

            @endif

          </td>

        </tr>

      </tbody>

    </table>

  </div>


  {{-- ============================================================
         ARO
         SE MANTIENE IGUAL
    ============================================================ --}}

  <div
    class="caracteristicas-section"
    style="width:87%;">

    <div class="section-title">
      Caracteristicas de Aro
    </div>


    <div
      class="field-row"
      style="width:87%;">

      <div class="field-label">
        COLOR*
      </div>

      <button
        class="boton-item-white"
        style="
            text-align:left;
            white-space:normal;
            word-wrap:break-word;
            {{$color == '_' ? 'color:white' : ''}}
          ">
        {{$color}}
      </button>

    </div>


    <div class="field-flex-row">

      <div class="field-half">

        <div class="check-label">

          <span
            class="check-circle
              {{ $aro_centevi ? 'check-circle-checked' : 'check-circle-unchecked' }}"></span>

          ARO CENTEVI

        </div>

      </div>


      <div class="field-half">

        <div class="check-label">

          <span
            class="check-circle
              {{ $aro_propio ? 'check-circle-checked' : 'check-circle-unchecked' }}"></span>

          ARO PROPIO

        </div>

      </div>

    </div>


    <div class="field-flex-row">

      <div class="field-half">

        <div class="field-label">
          CÓDIGO
        </div>

        <buton
          class="boton-item-white"
          style="
              white-space:normal;
              word-wrap:break-word;
              {{$codigo == '_' ? 'color:white' : ''}}
            ">
          {{$codigo}}
        </buton>

      </div>


      <div class="field-half">

        <div class="field-label">
          MARCA
        </div>

        <buton
          class="boton-item-white"
          style="
              white-space:normal;
              word-wrap:break-word;
              {{$marca == '_' ? 'color:white' : ''}}
            ">
          {{$marca}}
        </buton>

      </div>

    </div>


    <div class="lens-diagram">

      <img
        src="{{ public_path('/assets/img/recetas/lentessinbarrillav2.png') }}" />

      <button style="left:-8%; top:23%;">
        {{$l_uno}}
      </button>

      <button style="left:16%; top:-16%;">
        {{$l_dos}}
      </button>

      <button style="left:40%; top:8%;">
        {{$l_tres}}
      </button>

      <button style="left:15%; top:62%;">
        {{$l_cuatro}}
      </button>

      <button style="left:67%; top:23%;">
        {{$l_cinco}}
      </button>

    </div>


    <div
      class="field-row"
      style="width:87%;">

      <div class="field-label">
        TIPO DE ARO*
      </div>

      <button
        class="boton-item-white"
        style="
            white-space:normal;
            word-wrap:break-word;
          ">
        {{$tipo_aro}}
      </button>

    </div>


    <div
      class="field-row"
      style="width:87%;">

      <div class="field-label">
        OBSERVACIONES
      </div>

      <button
        class="boton-item-white"
        style="{{$observaciones == '_' ? 'color:white' : ''}}">
        {{$observaciones}}
      </button>

    </div>

  </div>

  @endif

</body>

</html>