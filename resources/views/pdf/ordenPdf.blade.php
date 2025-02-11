<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Orden-{{$nro_orden}}</title>
  <style>
    body {}

    @page {
      margin-left: 25px;
      margin-right: 25px;
      margin-top: 1cm;
      font-family: 'sans-serif';
    }

    .container-grid {
      width: 100%;
      display: flex;
      gap: 5px;
    }

    .item {
      width: 22%;
      display: inline-block;
      text-align: center;
    }

    .item-lente {
      width: 27%;
      display: inline-block;
      text-align: center;
      margin: 0 2px;
      padding: 8px 2px;
    }

    .item-orden {
      width: 22%;
      display: inline-block;
      text-align: center;
      margin: 0 2px;
      padding: 8px 2px;
    }

    .boton-tipo-lente {
      background-color: #1BBC9C;
      color: white;
      padding: 8px 2px;
      font-size: 13px;
      border-radius: 4px;
      border: 1px solid #1BBC9C;
      width: 100%;
    }

    .boton-item-orden {
      background-color: white;
      color: red;
      padding: 8px 2px;
      font-size: 13px;
      border-radius: 4px;
      border: 1px solid gray;
      width: 100%;
    }

    .boton-item-white {
      background-color: white;
      display: inline-block;
      padding: 8px 5px;
      font-size: 13px;
      border-radius: 4px;
      border: 1px solid gray;
      width: 100%;
    }

    .item-fecha-orden {
      background-color: white;
      color: gray;
      padding: 8px 2px;
      font-size: 13px;
      width: 100%;
      border-radius: 4px;
      border: 1px solid gray;
    }

    .header-table {
      background-color: #C0CDFA;
      color: #515365;
    }

    table {
      border-collapse: collapse;
    }

    .header-table th {
      padding: 10px 0;
    }

    .row-table th {
      padding: 15px 0;
      color: #515365;
    }

    .row-table {
      border-bottom: 1px solid gray;
    }

    .info-tabla-cristales {
      font-size: 13px;
      background-color: white;
      border: 1px solid gray;
      border-radius: 20px;
      padding: 5px;
    }

    .tabla-caracteristicas {
      width: 100%;
    }

    .tabla-caracteristicas td {
      white-space: normal;
      word-wrap: break-word;
      word-break: break-word;
      width: 150px;
    }

    .table-informacion th,
    .table-informacion td {
      border: 1px solid gray;
      padding: 3px 3px;
    }

    .table-informacion .cell-no-border {
      border-bottom: 1px solid white;
    }
  </style>
</head>

<body>
  <div class="container-grid">
    <div class="item-orden">
      <img alt="logo" class="navbar-logo" src="{{ public_path('img/centevi.png') }}"
        style="width:100%; margin-top:-25px" />
    </div>
    <div class="item-orden">
      <h4 style="font-weight:400;font-size:13px; color:#3b3f5c">Fecha de solicitud</h4>
      <button class="item-fecha-orden"
        style="margin-top:-15px">{{ \Carbon\Carbon::parse($fecha_solicitud)->format('d/m/Y') }}</button>
    </div>
    <div class="item-orden">
      <h4 style="font-weight:400;font-size:13px; color:#3b3f5c">Nro. Orden*</h4>
      <button class="boton-item-orden" style="margin-top:-15px">{{ $nro_orden }}</button>
    </div>
    <div class="item-lente">
      <h4 style="font-weight:400;font-size:13px; color:#3b3f5c">Tipo de lente</h4>
      <button class="boton-tipo-lente" style="margin-top:-15px">
        {{ $lente_contacto ? 'Lente de contacto' : 'Lente normal' }}
      </button>
    </div>
  </div>
  <div style="margin-bottom:5px; margin-top:-10px;">
    <div id="name-lastname" style="color:#3b3f5c;font-size:13px;"><span
        style="font-family:'Segoe UI', sans-serif; font-weight:700">Paciente:</span> <span
        style="font-family:'Segoe UI', sans-serif;">{{ ucwords(strtolower($nombres_apellidos_paciente)) }}</span></div>
    <div style="color:#3b3f5c;font-size:13px;"><span
        style="font-family:'Segoe UI', sans-serif; font-weight:700">Sucursal:</span> <span
        style="font-family:'Segoe UI', sans-serif;">{{ $sucursal }}</span></div>
  </div>
  <div class="container-grid">
    <table style="width:100%; font-size:12px" class="table-informacion">
      <tr class="header-table">
        <th>RX</th>
        <th>Esfera</th>
        <th>Cilindro</th>
        <th>Eje</th>
        <th>ADD</th>
        @if($lente_contacto)
      <th>Tipo de lente de contacto</th>
      <th>Curva Base</th>
      <th>Diametro</th>
    @else
    <th>PRISMA</th>
    <th>DISTANCIA PUPILAR*</th>
    <th>ALTURA</th>
  @endif
      </tr>
      <tr class="row-table" style="font-family:'DejaVu Sans', sans-serif">
        <th>OD</th>
        <th style="">{{$esfera_od}}</th>
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
        <th style="font-family:'DejaVu Sans', sans-serif">{{$prisma_oi}}</th>
        <th class="{{ !$lente_contacto ? 'cell-no-border' : '' }}">{{$distancia_oi}}</th>
        <th>{{$altura_oi}}</th>
      </tr>
    </table>
  </div>
  @if(!$lente_contacto)
    <div style="widht: 100%; border: 1px solid blue; border-radius: 25px; padding:10px;  margin-top: 10px">
    <div style=" width:100%; margin-bottom:20px; align-items:start">Caracteristicas de Cristales</div>
    <table class="tabla-caracteristicas">
      <thead>
      <tr>
        <th style="font-size:12px">TIPO DE CRISTAL</th>
        <th style="font-size:12px">MATERIAL</th>
        <th style="font-size:12px">TRATAMIENTOS Y FILTROS</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>
        <div style="font-size:12px; text-align:start">Ojo derecho:</div>
        @if($tipo_cristal_od)
      <button class="info-tabla-cristales">{{$tipo_cristal_od}}</button>
    @endif
        </td>
        <td>
        <div style="font-size:12px; text-align:start">Ojo derecho:</div>
        @if($material_od)
      <button class="info-tabla-cristales">{{$material_od}}</button>
    @endif
        </td>
        <td>
        <div style="font-size:12px; text-align:start">Ojo derecho:</div>
        @if($tratamientos_od)
      <button class="info-tabla-cristales">{{$tratamientos_od}}</button>
    @endif
        </td>
      </tr>
      <tr>
        <td>
        <div style="font-size:12px; text-align:start">Ojo Izquierdo:</div>
        @if($tipo_cristal_oi)
      <button class="info-tabla-cristales">{{$tipo_cristal_oi}}</button>
    @endif
        </td>
        <td>
        <div style="font-size:12px; text-align:start">Ojo Izquierdo:</div>
        @if($material_oi)
      <button class="info-tabla-cristales">{{$material_oi}}</button>
    @endif
        </td>
        <td>
        <div style="font-size:12px; text-align:start">Ojo Izquierdo:</div>
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
    <div style="widht: 100%; border: 1px solid blue; border-radius: 25px; padding:20px 20px;  margin-top: 10px">
    <div style="width:100%; display: inline-block; margin-bottom:20px">
      <div style="width:74%; display: inline-block">Caracteristicas de Aro</div>
    </div>
    <div style="width:48%;  display: inline-block">
      <div style="font-size:12px; width:100%; color:#888ea8; font-weight:700">MARCA</div>
      <buton class="boton-item-white"
      style="font-size:12px;white-space: normal; word-wrap: break-word; {{$marca == '_' ? 'color:white' : ''}}">
      {{$marca}}</buton>
    </div>

    <div style="width:1%; display:inline-block;"></div>

    <div style="width:48%; display:inline-block;">
      <div style="font-size:12px;width:100%; color:#888ea8; font-weight:700">OBSERVACIONES</div>
      <button class="boton-item-white"
      style="font-size:12px; {{$observaciones == '_' ? 'color:white' : ''}}">{{$observaciones}}</button>
    </div>
    </div>
  @else
    <div style="widht: 100%; border: 1px solid blue; border-radius: 25px; padding:20px 20px;  margin-top: 10px">
    <div style="width:100%; display: inline-block">
      <div style="width:74%; display: inline-block">Caracteristicas de Aro</div>
      <div style="width:25%; display: inline-block">
      <div style="font-size:12px; color:#888ea8; font-weight:700">COLOR*</div>
      <button class="boton-item-white"
        style="font-size:12px; text-align:left;white-space: normal; word-wrap: break-word; {{$color == '_' ? 'color:white' : ''}}">{{$color}}</button>
      </div>
    </div>
    <div style="width:100%;  display: inline-block">
      <div style="width:24%; display: inline-block">
      <div style="font-size:12px; display:flex; align-items:center">
        @if($aro_centevi)
      <button
      style="border-radius:50%; border: 2px solid blue; margin:0 auto; background-color:white; width:5px; height:5px"></button>
    @else
    <button style="border-radius:50%; border: none; background-color:#E0E6ED; width:8px; height:8px"></button>
  @endif
        <span style="">ARO CENTEVI</span>
      </div>
      </div>
      <div style="width:24%; display: inline-block">
      <div style="font-size:12px; display:flex; align-items:center">
        @if($aro_propio)
      <button
      style="border-radius:50%; border: 2px solid blue; margin:0 auto; background-color:white; width:5px; height:5px"></button>
    @else
    <button style="border-radius:50%; border: none; background-color:#E0E6ED; width:8px; height:8px"></button>
  @endif
        ARO PROPIO
      </div>
      </div>
      <div style="width:24%; display: inline-block">
      <div style="font-size:12px; margin-bottom:5px; color:#888ea8; font-weight:700">CÓDIGO</div>
      <buton class="boton-item-white"
        style="font-size:12px;white-space: normal; word-wrap: break-word; {{$codigo == '_' ? 'color:white' : ''}}">
        {{$codigo}}</buton>
      </div>
      <div style="width:1%; display:inline-block"></div>
      <div style="width:24%; display: inline-block;">
      <div style="font-size:12px; margin-bottom:5px; width:100%; color:#888ea8; font-weight:700">MARCA</div>
      <buton class="boton-item-white"
        style="font-size:12px;white-space: normal; word-wrap: break-word; {{$marca == '_' ? 'color:white' : ''}}">
        {{$marca}}</buton>
      </div>
    </div>
    <div style="width:100%; display:inline-block; margin-top:20px;">
      <div style="width:60%; display: inline-block; justify-content:center; position:relative; background-color:red">
      <img src="{{ public_path('/assets/img/recetas/lentessinbarrillav2.png') }}" style="width: 100%;" />
      <button
        style="position:absolute; left:-25px; border:1px solid red; background-color: white; width:70px; top:72px">{{$l_uno}}</button>
      <button
        style="position:absolute; left:82px; border:1px solid red; background-color: white; width:70px; top:-2px">{{$l_dos}}</button>
      <button
        style="position:absolute; left:185px; border:1px solid red; background-color: white; width:70px; top:35px">{{$l_tres}}</button>
      <button
        style="position:absolute; left:90px; border:1px solid red; background-color: white; width:70px; top:150px">{{$l_cuatro}}</button>
      <button
        style="position:absolute; left:300px; border:1px solid red; background-color: white; width:70px; top:71px">{{$l_cinco}}</button>
      </div>
      <div style="width:39%; display: inline-block; float:right">
      <div style="width:100%; display: inline-block">
        <div>
        <div style="font-size:12px; color:#888ea8; font-weight:700">TIPO DE ARO*</div>
        <button class="boton-item-white"
          style="font-size:12px;white-space: normal; word-wrap: break-word;">{{$tipo_aro}}</button>
        </div>
      </div>
      <div style="width:100%; display: inline-block; margin-top:10px">
        <div style="font-size:12px; color:#888ea8; font-weight:700">OBSERVACIONES</div>
        <button class="boton-item-white"
        style="font-size:12px; {{$observaciones == '_' ? 'color:white' : ''}}">{{$observaciones}}</button>
      </div>
      </div>
    </div>
    </div>
  @endif
</body>

</html>