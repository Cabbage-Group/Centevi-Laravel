<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Orden-{{ $nro_orden }}</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
      font-size: 12px;
    }

    @page {
      margin-left: 25px;
      margin-right: 25px;
      margin-top: 1cm;
      margin-bottom: 1cm;
    }

    /* ============================================================
       HEADER
    ============================================================ */

    .container-grid {
      width: 100%;
      max-width: 100%;
      display: table;
      table-layout: fixed;
      border-spacing: 0;
    }

    .item-orden {
      width: 22%;
      display: table-cell;
      text-align: center;
      vertical-align: top;
      padding: 8px 2px;
    }

    .item-lente {
      width: 27%;
      display: table-cell;
      text-align: center;
      vertical-align: top;
      padding: 8px 2px;
    }

    .item-fecha-orden {
      background-color: white;
      color: gray;
      padding: 8px 2px;
      font-size: 13px;
      width: 100%;
      border-radius: 4px;
      border: 1px solid gray;
      box-sizing: border-box;
    }

    .boton-item-orden {
      background-color: white;
      color: red;
      padding: 8px 2px;
      font-size: 13px;
      border-radius: 4px;
      border: 1px solid gray;
      width: 100%;
      box-sizing: border-box;
    }

    .boton-tipo-lente {
      background-color: #1BBC9C;
      color: white;
      padding: 8px 2px;
      font-size: 13px;
      border-radius: 4px;
      border: 1px solid #1BBC9C;
      width: 100%;
      box-sizing: border-box;
    }

    .boton-item-white {
      background-color: white;
      display: inline-block;
      padding: 6px 1px;
      font-size: 12px;
      border-radius: 4px;
      border: 1px solid gray;
      width: 100%;
      box-sizing: border-box;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    /* ============================================================
       TABLAS GENERALES
    ============================================================ */

    table {
      border-collapse: collapse;
    }

    .header-table {
      background-color: #C0CDFA;
      color: #515365;
    }

    .header-table th {
      padding: 8px 2px;
      font-size: 11px;
      line-height: 13px;
    }

    .row-table {
      border-bottom: 1px solid gray;
    }

    .row-table th {
      padding: 8px 2px;
      color: #515365;
      font-size: 11px;
    }

    .table-informacion {
      width: 100%;
      max-width: 100%;
      table-layout: fixed;
      font-size: 11px;
    }

    .table-informacion th,
    .table-informacion td {
      border: 1px solid gray;
      padding: 5px 2px;
      word-wrap: break-word;
      word-break: break-word;
      overflow-wrap: break-word;
      text-align: center;
    }

    .table-informacion .cell-no-border {
      border-bottom: 1px solid white;
    }

    /* ============================================================
       CRISTALES
    ============================================================ */

    .tabla-caracteristicas {
      width: 100%;
      max-width: 100%;
      table-layout: fixed;
    }

    .tabla-caracteristicas th,
    .tabla-caracteristicas td {
      padding: 2px 5px;
      vertical-align: top;
      word-wrap: break-word;
      word-break: break-word;
      overflow-wrap: break-word;
    }

    .info-tabla-cristales {
      font-size: 11px;
      background-color: white;
      border: 1px solid gray;
      border-radius: 15px;
      padding: 4px 6px;
      margin-top: 3px;
      max-width: 100%;
      word-wrap: break-word;
      word-break: break-word;
      overflow-wrap: break-word;
    }

    /* ============================================================
       ONEFIT / ONEFITMED
    ============================================================ */

    .seccion-nueva {
      width: 100%;
      max-width: 100%;
      border: 1px solid blue;
      border-radius: 20px;
      padding: 9px;
      margin-top: 10px;
      box-sizing: border-box;
      overflow: hidden;
    }

    .titulo-seccion-nueva {
      width: 100%;
      margin-bottom: 8px;
      font-size: 13px;
      font-weight: 700;
    }

    .tabla-nueva {
      width: 100%;
      max-width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
      font-size: 10px;
    }

    .tabla-nueva th {
      background-color: #C0CDFA;
      color: #515365;
      padding: 5px 2px;
      border: 1px solid gray;
      font-size: 10px;
      line-height: 11px;
      word-wrap: break-word;
      word-break: break-word;
      overflow-wrap: break-word;
    }

    .tabla-nueva td {
      padding: 5px 2px;
      border: 1px solid gray;
      text-align: center;
      font-size: 10px;
      line-height: 11px;
      word-wrap: break-word;
      word-break: break-word;
      overflow-wrap: break-word;
    }

    .label-nuevo {
      font-size: 10px;
      color: #888ea8;
      font-weight: 700;
      margin-bottom: 3px;
    }

    .valor-nuevo {
      font-size: 10px;
      background-color: white;
      border: 1px solid gray;
      border-radius: 4px;
      padding: 5px 4px;
      width: 100%;
      box-sizing: border-box;
      min-height: 24px;
      word-wrap: break-word;
      word-break: break-word;
      overflow-wrap: break-word;
    }

    .tabla-marcas {
      width: 100%;
      max-width: 100%;
      border: 0;
      margin-top: 8px;
      border-collapse: collapse;
      table-layout: fixed;
    }

    .tabla-marcas td {
      border: 0;
      vertical-align: top;
      padding: 0;
    }

    .tabla-marcas .marca-od {
      width: 50%;
      padding-right: 4px;
    }

    .tabla-marcas .marca-oi {
      width: 50%;
      padding-left: 4px;
    }

    .observaciones-nueva {
      width: 100%;
      max-width: 100%;
      margin-top: 8px;
      box-sizing: border-box;
    }

    /* ============================================================
       SECCIONES GENERALES
    ============================================================ */

    .seccion-general {
      width: 100%;
      max-width: 100%;
      border: 1px solid blue;
      border-radius: 22px;
      padding: 10px;
      margin-top: 10px;
      box-sizing: border-box;
      overflow: hidden;
    }

    /* ============================================================
       ARO
    ============================================================ */

    .aro-layout {
      width: 100%;
      max-width: 100%;
      display: table;
      table-layout: fixed;
      border-collapse: collapse;
      margin-top: 8px;
    }

    .aro-layout-left {
      width: 58%;
      display: table-cell;
      vertical-align: top;
      padding-right: 8px;
    }

    .aro-layout-right {
      width: 42%;
      display: table-cell;
      vertical-align: top;
      padding-left: 3px;
    }

    .aro-label {
      font-size: 10px;
      color: #888ea8;
      font-weight: 700;
      margin-bottom: 3px;
    }

    .aro-figura {
      width: 100%;
      position: relative;
      margin-top: 20px;
      overflow: visible;
    }

    .aro-figura img {
      width: 100%;
      height: auto;
      display: block;
    }

    .medida-aro {
      position: absolute;
      border: 1px solid red;
      background-color: white;
      width: 52px;
      min-height: 20px;
      padding: 2px;
      font-size: 10px;
      text-align: center;
      line-height: 15px;
      box-sizing: border-box;
    }

    .medida-l-uno { left: -2%; top: 6%; }
    .medida-l-dos { left: 20%; top: -4%; }
    .medida-l-tres { left: 46%; top: 2%; }
    .medida-l-cuatro { left: 20%; top: 17%; }
    .medida-l-cinco { left: 70%; top:6%; }

    .aro-campo {
      width: 100%;
      margin-bottom: 8px;
    }

    .aro-observaciones {
      min-height: 60px;
      text-align: left;
      padding: 3px;
    }

    .radio-circulo {
      display: inline-block;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      margin-right: 4px;
      vertical-align: middle;
      background-color: #E0E6ED;
    }

    .radio-circulo-activo {
      display: inline-block;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      margin-right: 4px;
      vertical-align: middle;
      background-color: white;
      border: 2px solid blue;
    }

    /* ============================================================
       CONTACTO
    ============================================================ */

    .contacto-columnas {
      width: 100%;
      display: table;
      table-layout: fixed;
    }

    .contacto-columna {
      display: table-cell;
      vertical-align: top;
      width: 50%;
      padding-right: 5px;
    }

    .contacto-columna:last-child {
      padding-left: 5px;
      padding-right: 0;
    }

    .contacto-campo {
      width: 60%;
      margin-bottom: 8px;
    }

    .contacto-subtitulo {
      font-size: 10px;
      color: #666;
      margin-bottom: 3px;
    }
  </style>
</head>

<body>

  {{-- HEADER --}}
  <div class="container-grid">
    <div class="item-orden">
      <img
        alt="logo"
        class="navbar-logo"
        src="{{ public_path('img/centevi.png') }}"
        style="width:100%; max-width:150px; margin-top:-25px;"
      >
    </div>

    <div class="item-orden">
      <h4 style="font-weight:400; font-size:13px; color:#3b3f5c; margin:0 0 15px 0;">
        Fecha de solicitud
      </h4>
      <div class="item-fecha-orden">
        {{ \Carbon\Carbon::parse($fecha_solicitud)->format('d/m/Y') }}
      </div>
    </div>

    <div class="item-orden">
      <h4 style="font-weight:400; font-size:13px; color:#3b3f5c; margin:0 0 15px 0;">
        Nro. Orden*
      </h4>
      <div class="boton-item-orden">
        {{ $nro_orden }}
      </div>
    </div>

    <div class="item-lente">
      <h4 style="font-weight:400; font-size:13px; color:#3b3f5c; margin:0 0 15px 0;">
        Tipo de lente
      </h4>
      <div class="boton-tipo-lente">
        @if(isset($tipo_lente))
          @if($tipo_lente === 'onefit')
            Lente escleral OneFit
          @elseif($tipo_lente === 'onefitmed')
            Lente escleral OneFit Med
          @elseif($tipo_lente === 'contacto')
            Lente de contacto
          @else
            Lente normal
          @endif
        @else
          {{ $lente_contacto ? 'Lente de contacto' : 'Lente normal' }}
        @endif
      </div>
    </div>
  </div>

  {{-- PACIENTE / SUCURSAL --}}
  <div style="margin-bottom:5px; margin-top:-10px; color:#3b3f5c; font-size:13px;">
    <div>
      <span style="font-weight:700;">Paciente:</span>
      <span>{{ ucwords(strtolower($nombres_apellidos_paciente)) }}</span>
    </div>
    <div>
      <span style="font-weight:700;">Sucursal:</span>
      <span>{{ $sucursal }}</span>
    </div>
  </div>

  {{-- TABLA RX --}}
  @if(!isset($tipo_lente) || ($tipo_lente !== 'onefit' && $tipo_lente !== 'onefitmed'))
    <table class="table-informacion" style="margin-top:5px;">
      @if($lente_contacto)
        <tr class="header-table">
          <th style="width:8%;">RX</th>
          <th style="width:12%;">Esfera</th>
          <th style="width:12%;">Cilindro</th>
          <th style="width:9%;">Eje</th>
          <th style="width:10%;">ADD</th>
          <th style="width:19%;">Tipo de lente<br>de contacto</th>
          <th style="width:14%;">Curva Base</th>
          <th style="width:16%;">Diametro</th>
        </tr>
        <tr class="row-table">
          <th>OD</th>
          <th>{{ $esfera_od }}</th>
          <th>{{ $cilindro_od }}</th>
          <th>{{ $eje_od }}</th>
          <th>{{ $add_od }}</th>
          <th>{{ $prisma_od }}</th>
          <th>{{ $distancia_od ?? '-' }}</th>
          <th>{{ $altura_od ?? '-' }}</th>
        </tr>
        <tr class="row-table">
          <th>OI</th>
          <th>{{ $esfera_oi }}</th>
          <th>{{ $cilindro_oi }}</th>
          <th>{{ $eje_oi }}</th>
          <th>{{ $add_oi }}</th>
          <th>{{ $prisma_oi }}</th>
          <th>{{ $distancia_oi }}</th>
          <th>{{ $altura_oi ?? '-' }}</th>
        </tr>
      @else
        <tr class="header-table">
          <th style="width:12%;">RX</th>
          <th style="width:12%;">Esfera</th>
          <th style="width:12%;">Cilindro</th>
          <th style="width:10%;">Eje</th>
          <th style="width:11%;">ADD</th>
          <th style="width:12%;">PRISMA</th>
          <th style="width:16%;">DISTANCIA<br>PUPILAR*</th>
          <th style="width:15%;">ALTURA</th>
        </tr>
        <tr class="row-table">
          <th>OD</th>
          <th>{{ $esfera_od }}</th>
          <th>{{ $cilindro_od }}</th>
          <th>{{ $eje_od }}</th>
          <th>{{ $add_od }}</th>
          <th>{{ $prisma_od }}</th>
          <th>{{ $distancia_od }}</th>
          <th>{{ $altura_od }}</th>
        </tr>
        <tr class="row-table">
          <th>OI</th>
          <th>{{ $esfera_oi }}</th>
          <th>{{ $cilindro_oi }}</th>
          <th>{{ $eje_oi }}</th>
          <th>{{ $add_oi }}</th>
          <th>{{ $prisma_oi }}</th>
          <th>{{ $distancia_oi }}</th>
          <th>{{ $altura_oi }}</th>
        </tr>
      @endif
    </table>
  @endif

  {{-- ONEFIT --}}
  @if(isset($tipo_lente) && $tipo_lente === 'onefit')
    <div class="seccion-nueva">
      <div class="titulo-seccion-nueva">Características Lente Escleral OneFit</div>
      <table class="tabla-nueva">
        <thead>
          <tr>
            <th style="width:10%;">RX</th>
            <th style="width:15%;">Poder</th>
            <th style="width:15%;">Diámetro</th>
            <th style="width:15%;">Edge</th>
            <th style="width:15%;">PFSD</th>
            <th style="width:12.5%;">CB</th>
            <th style="width:12.5%;">CT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>OD</td>
            <td>{{ $poder_od ?? '-' }}</td>
            <td>{{ $dia_od ?? '-' }}</td>
            <td>{{ $edge_od ?? '-' }}</td>
            <td>{{ $pfsd_od ?? '-' }}</td>
            <td>{{ $cb_od ?? '-' }}</td>
            <td>{{ $ct_od ?? '-' }}</td>
          </tr>
          <tr>
            <td>OI</td>
            <td>{{ $poder_oi ?? '-' }}</td>
            <td>{{ $dia_oi ?? '-' }}</td>
            <td>{{ $edge_oi ?? '-' }}</td>
            <td>{{ $pfsd_oi ?? '-' }}</td>
            <td>{{ $cb_oi ?? '-' }}</td>
            <td>{{ $ct_oi ?? '-' }}</td>
          </tr>
        </tbody>
      </table>

      <table class="tabla-marcas">
        <tr>
          <td class="marca-od">
            <div class="label-nuevo">MARCA OD</div>
            <div class="valor-nuevo">{{ $marca ?? '-' }}</div>
          </td>
          <td class="marca-oi">
            <div class="label-nuevo">MARCA OI</div>
            <div class="valor-nuevo">{{ $marca_oi ?? '-' }}</div>
          </td>
        </tr>
      </table>

      @if(isset($observaciones) && $observaciones && $observaciones !== '_')
        <div class="observaciones-nueva">
          <div class="label-nuevo">OBSERVACIONES</div>
          <div class="valor-nuevo">{{ $observaciones }}</div>
        </div>
      @endif
    </div>
  @endif

  {{-- ONEFIT MED --}}
  @if(isset($tipo_lente) && $tipo_lente === 'onefitmed')
    <div class="seccion-nueva">
      <div class="titulo-seccion-nueva">Características Lente Escleral OneFit Med</div>
      <table class="tabla-nueva">
        <thead>
          <tr>
            <th style="width:9%;">RX</th>
            <th style="width:11%;">SAG</th>
            <th style="width:12%;">Poder</th>
            <th style="width:12%;">Diámetro</th>
            <th style="width:11%;">MID</th>
            <th style="width:11%;">LIM</th>
            <th style="width:11%;">PFSD</th>
            <th style="width:11%;">EDG</th>
            <th style="width:12%;">CT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>OD</td>
            <td>{{ $sag_od ?? '-' }}</td>
            <td>{{ $poder_od ?? '-' }}</td>
            <td>{{ $dia_od ?? '-' }}</td>
            <td>{{ $mid_od ?? '-' }}</td>
            <td>{{ $lim_od ?? '-' }}</td>
            <td>{{ $pfsd_od ?? '-' }}</td>
            <td>{{ $edg_od ?? '-' }}</td>
            <td>{{ $ct_od ?? '-' }}</td>
          </tr>
          <tr>
            <td>OI</td>
            <td>{{ $sag_oi ?? '-' }}</td>
            <td>{{ $poder_oi ?? '-' }}</td>
            <td>{{ $dia_oi ?? '-' }}</td>
            <td>{{ $mid_oi ?? '-' }}</td>
            <td>{{ $lim_oi ?? '-' }}</td>
            <td>{{ $pfsd_oi ?? '-' }}</td>
            <td>{{ $edg_oi ?? '-' }}</td>
            <td>{{ $ct_oi ?? '-' }}</td>
          </tr>
        </tbody>
      </table>

      <table class="tabla-marcas">
        <tr>
          <td class="marca-od">
            <div class="label-nuevo">MARCA OD</div>
            <div class="valor-nuevo">{{ $marca ?? '-' }}</div>
          </td>
          <td class="marca-oi">
            <div class="label-nuevo">MARCA OI</div>
            <div class="valor-nuevo">{{ $marca_oi ?? '-' }}</div>
          </td>
        </tr>
      </table>

      @if(isset($observaciones) && $observaciones && $observaciones !== '_')
        <div class="observaciones-nueva">
          <div class="label-nuevo">OBSERVACIONES</div>
          <div class="valor-nuevo">{{ $observaciones }}</div>
        </div>
      @endif
    </div>
  @endif

  {{-- CRISTALES --}}
  @if((!isset($tipo_lente) || ($tipo_lente !== 'onefit' && $tipo_lente !== 'onefitmed' && $tipo_lente !== 'contacto')) && !$lente_contacto)
    <div class="seccion-general">
      <div style="width:100%; margin-bottom:12px; font-size:13px;">
        Caracteristicas de Cristales
      </div>
      <table class="tabla-caracteristicas">
        <thead>
          <tr>
            <th style="font-size:11px;">TIPO DE CRISTAL</th>
            <th style="font-size:11px;">MATERIAL</th>
            <th style="font-size:11px;">TRATAMIENTOS Y FILTROS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div style="font-size:11px; text-align:left;">Ojo derecho:</div>
              @if(isset($tipo_cristal_od) && $tipo_cristal_od !== '_')
                <div class="info-tabla-cristales">{{ $tipo_cristal_od }}</div>
              @endif
            </td>
            <td>
              <div style="font-size:11px; text-align:left;">Ojo derecho:</div>
              @if(isset($material_od) && $material_od !== '_')
                <div class="info-tabla-cristales">{{ $material_od }}</div>
              @endif
            </td>
            <td>
              <div style="font-size:11px; text-align:left;">Ojo derecho:</div>
              @if(isset($tratamientos_od) && $tratamientos_od !== '_')
                <div class="info-tabla-cristales">{{ $tratamientos_od }}</div>
              @endif
            </td>
          </tr>
          <tr>
            <td>
              <div style="font-size:11px; text-align:left;">Ojo izquierdo:</div>
              @if(isset($tipo_cristal_oi) && $tipo_cristal_oi !== '_')
                <div class="info-tabla-cristales">{{ $tipo_cristal_oi }}</div>
              @endif
            </td>
            <td>
              <div style="font-size:11px; text-align:left;">Ojo izquierdo:</div>
              @if(isset($material_oi) && $material_oi !== '_')
                <div class="info-tabla-cristales">{{ $material_oi }}</div>
              @endif
            </td>
            <td>
              <div style="font-size:11px; text-align:left;">Ojo izquierdo:</div>
              @if(isset($tratamientos_oi) && $tratamientos_oi !== '_')
                <div class="info-tabla-cristales">{{ $tratamientos_oi }}</div>
              @endif
            </td>
          </tr>
          @if(isset($tipo_corredor) && $tipo_corredor !== '_')
            <tr>
              <td colspan="3">
                <div style="font-size:11px; text-align:left;">Tipo Corredor:</div>
                <div class="info-tabla-cristales">{{ $tipo_corredor }}</div>
              </td>
            </tr>
          @endif
        </tbody>
      </table>
    </div>
  @endif

  {{-- CARACTERÍSTICAS DE ARO --}}
  @if((!isset($tipo_lente) || $tipo_lente === 'aro') && !$lente_contacto)
    <div class="seccion-general">
      <table style="width:100%; table-layout:fixed; border-collapse:collapse;">
        <tr>
          <td style="width:74%; border:0; padding:0; vertical-align:top; font-size:13px;">
            Caracteristicas de Aro
          </td>
          <td style="width:20%; border:0; padding:0 2 0 4px; vertical-align:top;">
            <div class="aro-label">COLOR*</div>
            <div class="boton-item-white" style="text-align:left;">
              {{ ($color ?? '_') === '_' ? '' : $color }}
            </div>
          </td>
        </tr>
      </table>

      <table style="width:100%; table-layout:fixed; border-collapse:collapse; margin-top:8px;">
        <tr>
          <td style="width:24%; border:0; padding:0; vertical-align:top;">
            <div style="font-size:11px; white-space:nowrap;">
              <span class="{{ !empty($aro_centevi) ? 'radio-circulo-activo' : 'radio-circulo' }}"></span>
              ARO CENTEVI
            </div>
          </td>
          <td style="width:24%; border:0; padding:0; vertical-align:top;">
            <div style="font-size:11px; white-space:nowrap;">
              <span class="{{ !empty($aro_propio) ? 'radio-circulo-activo' : 'radio-circulo' }}"></span>
              ARO PROPIO
            </div>
          </td>
          <td style="width:10%; border:0; padding:0 10px; vertical-align:top;">
            <div class="aro-label">CÓDIGO</div>
            <div class="boton-item-white">
              {{ ($codigo ?? '_') === '_' ? '' : $codigo }}
            </div>
          </td>
          <td style="width:28%; border:0; padding:0 0 0 4px; vertical-align:top;">
            <div class="aro-label">MARCA</div>
            <div class="boton-item-white">
              {{ ($marca ?? '_') === '_' ? '' : $marca }}
            </div>
          </td>
        </tr>
      </table>

      <div class="aro-layout">
        <div class="aro-layout-left">
          <div class="aro-figura">
            <img src="{{ public_path('/assets/img/recetas/lentessinbarrillav2.png') }}" alt="Medidas del aro">
            <div class="medida-aro medida-l-uno">{{ ($l_uno ?? '_') === '_' ? '' : $l_uno }}</div>
            <div class="medida-aro medida-l-dos">{{ ($l_dos ?? '_') === '_' ? '' : $l_dos }}</div>
            <div class="medida-aro medida-l-tres">{{ ($l_tres ?? '_') === '_' ? '' : $l_tres }}</div>
            <div class="medida-aro medida-l-cuatro">{{ ($l_cuatro ?? '_') === '_' ? '' : $l_cuatro }}</div>
            <div class="medida-aro medida-l-cinco">{{ ($l_cinco ?? '_') === '_' ? '' : $l_cinco }}</div>
          </div>
        </div>

        <div class="aro-layout-right">
          <div class="aro-campo">
            <div class="aro-label">TIPO DE ARO*</div>
            <div class="boton-item-white">
              {{ ($tipo_aro ?? '_') === '_' ? '' : $tipo_aro }}
            </div>
          </div>
          <div class="aro-campo">
            <div class="aro-label">OBSERVACIONES</div>
            <div class="boton-item-white aro-observaciones">
              {{ ($observaciones ?? '_') === '_' ? '' : $observaciones }}
            </div>
          </div>
        </div>
      </div>
    </div>
  @endif

  {{-- LENTE DE CONTACTO --}}
  @if((isset($tipo_lente) && $tipo_lente === 'contacto') || $lente_contacto)
    <div class="seccion-general">
      <div style="width:100%; margin-bottom:12px; font-size:13px; font-weight:700;">
        Características Lente de Contacto
      </div>

      <div class="contacto-columnas">
        <div class="contacto-columna">
          <div style="font-size:0px; width:100%; color:#888ea8; font-weight:100; margin-bottom:7px;">
            MARCA
          </div>
          <div class="contacto-campo">
            <div class="contacto-subtitulo">Ojo Derecho</div>
            <div class="boton-item-white">
              {{ ($marca ?? '_') === '_' ? '' : $marca }}
            </div>
          </div>
          <div class="contacto-campo">
            <div class="contacto-subtitulo">Ojo Izquierdo</div>
            <div class="boton-item-white">
              {{ ($marca_oi ?? '_') === '_' ? '' : $marca_oi }}
            </div>
          </div>
          <div class="contacto-campo">
            <div class="aro-label">OBSERVACIONES</div>
            <div class="boton-item-white aro-observaciones">
              {{ ($observaciones ?? '_') === '_' ? '' : $observaciones }}
            </div>
          </div>
        </div>

    
      </div>
    </div>
  @endif

</body>
</html>