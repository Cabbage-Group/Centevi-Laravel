@extends('partials.sidebar')
@section('content')

<body>
<head>
    <link href="{{ asset('assets/css/bajavision/bajavision.css') }}" rel="stylesheet" type="text/css" class="structure" />
</head>

<div class="row layout-top-spacing">
    <div class="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
        <div class="widget-content-area br-4">
            <div class="widget-one">
                <div class="row">
                    <div id="flFormsGrid" class="col-lg-12 layout-spacing">
                        <div class="statbox widget box box-shadow">
                            <div class="widget-header">
                                <div class="row">
                                    <div class="col-xl-12 col-md-12 col-sm-12 col-12">
                                        <h3 class="text-center">Consulta de Baja Vision</h3>
                                    </div>
                                </div>
                            </div>
                            <div class="widget-content widget-content-area">
                                <form role="form" method="post">
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-12">
                                            <label for="inputEmail4">Pacientes</label>
                                            <select class="form-control form-small select2-hidden-accessible"
                                                name="paciente" data-select2-id="1" tabindex="-1"
                                                aria-hidden="true">
                                                <option value="" data-select2-id="3">&lt;--- Seleccione el
                                                paciente ---&gt;</option>
                                                <option value="22" data-fecha-nacimiento="2018-08-21"> Número
                                                    Cedula: 8-1219-383 || Nombres: Danna Lucia Gonzalez Quiros
                                                </option>
                                                <option value="8987" data-fecha-nacimiento="2024-05-18">
                                                    Número Cedula: 7-67-87 || Nombres: Tomasa Castillo </option>
                                                <option value="8988" data-fecha-nacimiento="1968-11-04">
                                                    Número Cedula: 7-103-662 || Nombres: Victor Soriano </option>
                                                <option value="8990" data-fecha-nacimiento="1983-09-23">
                                                    Número Cedula: 1-712-1736 || Nombres: CASTILLO PALACIO MORALES
                                                </option>
                                                <option value="8991" data-fecha-nacimiento="1967-01-25">
                                                    Número Cedula: 9-150-629 || Nombres: CAROLINA VARGAS CASTILLO de
                                                    PIMENTEL</option>
                                                <option value="8992" data-fecha-nacimiento="1953-09-14">
                                                    Número Cedula: 8-203-1442 || Nombres: JOSE ANTONIO RUIZ BARRANCO
                                                </option>
                                                <option value="8993" data-fecha-nacimiento="1985-06-29">
                                                    Número Cedula: 8-789-2088 || Nombres: ABDIEL ALMANZA DUTARI
                                                </option>
                                            </select>
                                            <span class="select2 select2-container mb-4 select2-container--default form-control-sm"
                                                dir="ltr" data-select2-id="2"
                                                style="width: 1128.89px;"><span class="selection"><span
                                                        class="select2-selection select2-selection--single"
                                                        role="combobox" aria-haspopup="true"
                                                        aria-expanded="false" tabindex="0"
                                                        aria-labelledby="select2-paciente-es-container"><span
                                                            class="select2-selection__rendered"
                                                            id="select2-paciente-es-container" role="textbox"
                                                            aria-readonly="true"
                                                            title="<--- Seleccione el paciente --->">&lt;---
                                                            Seleccione el paciente ---&gt;</span><span
                                                            class="select2-selection__arrow"
                                                            role="presentation"><b
                                                                role="presentation"></b></span></span></span><span
                                                class="dropdown-wrapper" aria-hidden="true"></span></span>
                                        </div>
                                    </div>
                                    <div class="form-row mb-12">
                                        <div class="form-group col-md-6">
                                            <label for="inputSucursal">Sucursal</label>
                                            <select required="" class="form-control" id="sucursal"
                                                name="sucursal">
                                                <option value="">Seleccionar sucursal</option>
                                                <option value="3">CENTEVI Centro Médico San Judas Tadeo
                                                </option>
                                                <option value="4">CENTEVI Consultorios Medicos Paitilla
                                                </option>
                                                <option value="5">CENTEVI Sede Chitre</option>
                                                <option value="7">CENTEVI El Dorado</option>
                                                <option value="8">CENTEVI Giras Interior del Pais</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label for="edad">Edad</label>
                                            <input type="text" class="form-control" id="edad"
                                                name="edad" readonly="">
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label for="inputAddress">Fecha de atencion</label>
                                            <input type="date" required="" class="form-control"
                                                id="inputAddress" name="fecha_atencion" max="2024-07-04">
                                        </div>
                                    </div>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-12">
                                            <label for="inputAddress">Motivo de consulta:</label>
                                            <textarea id="textarea" class="form-control textarea" maxlength="10000" rows="15"
                                                placeholder="Esta área tiene un limite de 10000 caracteres." name="m_c"></textarea>
                                        </div>
                                    </div>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-4">
                                            <label for="lugarNacimiento">Antecedentes Oculares</label>
                                            <input type="text" class="form-control" id="lugarNacimiento"
                                                placeholder="A/O" name="a_o">
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="inputAddress2">Antecedentes Personales</label>
                                            <input type="text" class="form-control" id="inputAddress2"
                                                placeholder="A/P" name="a_p">
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="inputAddress2">Antecentes Familiares</label>
                                            <input type="text" class="form-control" id="inputAddress2"
                                                placeholder="A/F" name="a_f">
                                        </div>
                                    </div>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-12">
                                            <label for="medicamentos">Medicamentos</label>
                                            <input type="text" class="form-control" id="medicamentos"
                                                placeholder="Medicamentos" name="medicamentos">
                                        </div>
                                    </div>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-12">
                                            <label for="tratamientos">Tratamientos anteriores</label>
                                            <input type="text" class="form-control" id="tratamientos"
                                                placeholder="Tratamientos" name="tratamientos">
                                        </div>
                                    </div>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-6">
                                            <label for="oftalmologico">DX. Oftalmologico Principal</label>
                                            <input type="text" class="form-control" id="oftalmologico"
                                                placeholder="Oftalmologico principal" name="dx_oft_princ">
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label for="objetivos">Objetivos de paciente</label>
                                            <input type="text" class="form-control" id="objetivos"
                                                placeholder="Objetivos" name="objetivos">
                                        </div>
                                    </div>

                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-12">
                                            <label for="lugarNacimiento">Acudiente/Acompañante</label>
                                            <input type="text" class="form-control" id=""
                                                placeholder="Acudiente/Acompañante" name="">
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label for="inputAddress2">¿Tuvo consulta de baja visión
                                                anteriormente?</label><br>
                                            <div style="display: flex; place-content: center;">
                                                <div>
                                                    <label for="vives-solo">Si</label>
                                                    <input type="radio" name="vives-solo" value="si">
                                                </div>
                                                <div style="margin-left:10px;">
                                                    <label for="vives-solo">No</label>
                                                    <input type="radio" name="vives-solo" value="no">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label for="inputAddress2">Consulta de baja visión anterior</label>
                                            <input type="date" class="form-control" id=""
                                                placeholder="Consulta de baja visión anterior" name=""
                                                max="2024-07-04">
                                        </div>
                                    </div>

                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-6">
                                            <label for="lugarNacimiento">¿Ha utilizado ayudas para BV?</label>
                                            <div style="display: flex; place-content: center;">
                                                <div>
                                                    <label for="vives-solo">Si</label>
                                                    <input type="radio" name="vives-solo" value="si">
                                                </div>
                                                <div style="margin-left:10px;">
                                                    <label for="vives-solo">No</label>
                                                    <input type="radio" name="vives-solo" value="no">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label for="lugarNacimiento">¿Que tipo de ayudas?</label>
                                            <input type="text" class="form-control" id=""
                                                placeholder="¿Que tipo de ayudas?" name="">
                                        </div>
                                        <div class="form-group col-md-12">
                                            <label for="lugarNacimiento">¿Quien le prescribió las ayudas?</label>
                                            <input type="text" class="form-control" id=""
                                                placeholder="¿Quien le prescribió las ayudas?" name="">
                                        </div>
                                    </div>

                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-6">
                                            <div style="text-align-last: center;">
                                                <label for="lugarNacimiento">¿Conoce su problema ocular?</label>
                                            </div>
                                            <div style="display: flex; place-content: center;">
                                                <div>
                                                    <label for="vives-solo">Si</label>
                                                    <input type="radio" name="vives-solo" value="si">
                                                </div>
                                                <div style="margin-left:10px;">
                                                    <label for="vives-solo">No</label>
                                                    <input type="radio" name="vives-solo" value="no">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group col-md-6">
                                            <div style="text-align-last: center;">
                                                <label for="lugarNacimiento">¿Su visión fluctúa día con
                                                    día?</label>
                                            </div>
                                            <div style="display: flex; place-content: center;">
                                                <div>
                                                    <label for="vives-solo">Si</label>
                                                    <input type="radio" name="vives-solo" value="si">
                                                </div>
                                                <div style="margin-left:10px;">
                                                    <label for="vives-solo">No</label>
                                                    <input type="radio" name="vives-solo" value="no">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group col-md-12">
                                            <label for="lugarNacimiento">¿Cuando?</label>
                                            <input type="text" class="form-control" id=""
                                                placeholder="Detalle Brevemente" name="">
                                        </div>
                                    </div>

                                    <script>
                                        document.querySelectorAll('.switch input').forEach(function(input) {
                                            input.addEventListener('change', function() {
                                                var slider = this.nextElementSibling;
                                                var text = slider.nextElementSibling;
                                                var circle = slider.querySelector('.slider-circle');
                                                if (this.) {
                                                    slider.style.backgroundColor = '#2196F3';
                                                    text.textContent = '';
                                                    circle.style.transform = 'translateX(26px)';
                                                } else {
                                                    slider.style.backgroundColor = '#b0b0b0';
                                                    text.textContent = '';
                                                    circle.style.transform = 'translateX(0)';
                                                }
                                            });
                                        });
                                    </script>

                                    <hr>
                                    <h6><b>Entorno Social</b></h6>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-12">
                                            <div class="table-responsive">
                                                <table class="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td class="text-center">¿Vives Solo?</td>
                                                            <td class="text-center">
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label for="vives-solo">Si</label>
                                                                        <input type="radio"
                                                                            name="vives-solo" value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label for="vives-solo">No</label>
                                                                        <input type="radio"
                                                                            name="vives-solo" value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">¿Influyó la perdida de visión
                                                                con su desempeño ocupacional?</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="ipvision-desem-ocup">Si</label>
                                                                        <input type="radio"
                                                                            name="ipvision-desem-ocup"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="ipvision-desem-ocup">No</label>
                                                                        <input type="radio"
                                                                            name="ipvision-desem-ocup"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">¿Cómo?</td>
                                                            <td>
                                                                <input type="text" class="form-control"
                                                                    placeholder="Explique Brevemente"
                                                                    name="como">
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">Nivel de Educación</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="nivel-educacion">Bachiller</label>
                                                                        <input type="radio"
                                                                            name="nivel-educacion"
                                                                            value="Bachiller">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="nivel-educacion">Licenciatura</label>
                                                                        <input type="radio"
                                                                            name="nivel-educacion"
                                                                            value="Licenciatura">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="nivel-educacion">Maestría</label>
                                                                        <input type="radio"
                                                                            name="nivel-educacion"
                                                                            value="Maestría">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="nivel-educacion">Doctorado</label>
                                                                        <input type="radio"
                                                                            name="nivel-educacion"
                                                                            value="Doctorado">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">Desplazamiento en lugares
                                                                externos</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="desplazamineto-lugares-externos">Solo</label>
                                                                        <input type="radio"
                                                                            name="desplazamineto-lugares-externos"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="desplazamineto-lugares-externos">Acompañado</label>
                                                                        <input type="radio"
                                                                            name="desplazamineto-lugares-externos"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td class="text-center">Desplazamiento en lugares
                                                                internos</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="desplazamineto-lugares-internos">Al
                                                                            tacto</label>
                                                                        <input type="radio"
                                                                            name="desplazamineto-lugares-internos"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="desplazamineto-lugares-internos">Visión</label>
                                                                        <input type="radio"
                                                                            name="desplazamineto-lugares-internos"
                                                                            value="no">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="desplazamineto-lugares-internos">Ambas</label>
                                                                        <input type="radio"
                                                                            name="desplazamineto-lugares-internos"
                                                                            value="Ambas">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td class="text-center">¿En qué momento del día le
                                                                gusta más desplazarse?</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="gusta-desplazarse">Día</label>
                                                                        <input type="radio"
                                                                            name="gusta-desplazarse"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="gusta-desplazarse">Noche</label>
                                                                        <input type="radio"
                                                                            name="gusta-desplazarse"
                                                                            value="no">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="gusta-desplazarse">Ambas</label>
                                                                        <input type="radio"
                                                                            name="gusta-desplazarse"
                                                                            value="Ambas">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    <hr>

                                    <h6><b>Tareas de Lejos: Tiene Dificultad para:</b></h6>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-12">
                                            <div class="table-responsive">
                                                <table class="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td class="text-center">Caminar en la calle</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label for="caminar-calle">Si</label>
                                                                        <input type="radio"
                                                                            name="caminar-calle"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label for="caminar-calle">No</label>
                                                                        <input type="radio"
                                                                            name="caminar-calle"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">Dezplazarse solo en un
                                                                lugares conocidos</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="desplazarse-lugares-conocidos">Si</label>
                                                                        <input type="radio"
                                                                            name="desplazarse-lugares-conocidos"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="desplazarse-lugares-conocidos">No</label>
                                                                        <input type="radio"
                                                                            name="desplazarse-lugares-conocidos"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">Dezplazarse solo en un
                                                                lugares lejanos</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="desplazarse-lugares-lejanos">Si</label>
                                                                        <input type="radio"
                                                                            name="desplazarse-lugares-lejanos"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="desplazarse-lugares-lejanos">No</label>
                                                                        <input type="radio"
                                                                            name="desplazarse-lugares-lejanos"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">Conducir de noche</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label for="conducir-noche">Si</label>
                                                                        <input type="radio"
                                                                            name="conducir-noche"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label for="conducir-noche">No</label>
                                                                        <input type="radio"
                                                                            name="conducir-noche"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">Conducir de día</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label for="conducir-dia">Si</label>
                                                                        <input type="radio"
                                                                            name="conducir-dia"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label for="conducir-dia">No</label>
                                                                        <input type="radio"
                                                                            name="conducir-dia"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">Ver las señales de tránsito
                                                                de día</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="seniales-transito-dia">Si</label>
                                                                        <input type="radio"
                                                                            name="seniales-transito-dia"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="seniales-transito-dia">No</label>
                                                                        <input type="radio"
                                                                            name="seniales-transito-dia"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">Ver las señales de tránsito
                                                                de noche</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="seniales-transito-noche">Si</label>
                                                                        <input type="radio"
                                                                            name="seniales-transito-noche"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="seniales-transito-noche">No</label>
                                                                        <input type="radio"
                                                                            name="seniales-transito-noche"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">Ver el letrero de los buses
                                                            </td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label for="letreros-buses">Si</label>
                                                                        <input type="radio"
                                                                            name="letreros-buses"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label for="letreros-buses">No</label>
                                                                        <input type="radio"
                                                                            name="letreros-buses"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">Reconocer la letra las caras
                                                                de las personas</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="reconocer-letra-caras-personas">Si</label>
                                                                        <input type="radio"
                                                                            name="reconocer-letra-caras-personas"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="reconocer-letra-caras-personas">No</label>
                                                                        <input type="radio"
                                                                            name="reconocer-letra-caras-personas"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">Ver al tablero en clases</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label for="tablero-clases">Si</label>
                                                                        <input type="radio"
                                                                            name="tablero-clases"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label for="tablero-clases">No</label>
                                                                        <input type="radio"
                                                                            name="tablero-clases"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">Ver los letreros de las
                                                                Calles</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label for="letreros-calles">Si</label>
                                                                        <input type="radio"
                                                                            name="letreros-calles"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label for="letreros-calles">No</label>
                                                                        <input type="radio"
                                                                            name="letreros-calles"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">Ver bordes y peldaños de
                                                                escaleras</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="bordes-peldanios-escaleras">Si</label>
                                                                        <input type="radio"
                                                                            name="bordes-peldanios-escaleras"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="bordes-peldanios-escaleras">No</label>
                                                                        <input type="radio"
                                                                            name="bordes-peldanios-escaleras"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">Ver las peliculas en el Cine
                                                                o Teatro</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="peliculas-cine-teatro">Si</label>
                                                                        <input type="radio"
                                                                            name="peliculas-cine-teatro"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="peliculas-cine-teatro">No</label>
                                                                        <input type="radio"
                                                                            name="peliculas-cine-teatro"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">Reconocer los colores</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label for="reconocer-colores">Si</label>
                                                                        <input type="radio"
                                                                            name="reconocer-colores"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label for="reconocer-colores">No</label>
                                                                        <input type="radio"
                                                                            name="reconocer-colores"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">Hacer Deportes</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label for="hacer-deportes">Si</label>
                                                                        <input type="radio"
                                                                            name="hacer-deportes"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label for="hacer-deportes">No</label>
                                                                        <input type="radio"
                                                                            name="hacer-deportes"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">Realizar tareas del hogar
                                                            </td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="realizar-tareas-hogar">Si</label>
                                                                        <input type="radio"
                                                                            name="realizar-tareas-hogar"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="realizar-tareas-hogar">No</label>
                                                                        <input type="radio"
                                                                            name="realizar-tareas-hogar"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">Cocinar</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label for="cocinar">Si</label>
                                                                        <input type="radio" name="cocinar"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label for="cocinar">No</label>
                                                                        <input type="radio" name="cocinar"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">Manejar los Electrodomesticos
                                                            </td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="manejar-electrodomesticos">Si</label>
                                                                        <input type="radio"
                                                                            name="manejar-electrodomesticos"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="manejar-electrodomesticos">No</label>
                                                                        <input type="radio"
                                                                            name="manejar-electrodomesticos"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">Ver la llama de la estufa
                                                            </td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label for="ver-llama-estufa">Si</label>
                                                                        <input type="radio"
                                                                            name="ver-llama-estufa"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label for="ver-llama-estufa">No</label>
                                                                        <input type="radio"
                                                                            name="ver-llama-estufa"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">Ver la comida en el plato
                                                            </td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label for="ver-comida-plato">Si</label>
                                                                        <input type="radio"
                                                                            name="ver-comida-plato"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label for="ver-comida-plato">No</label>
                                                                        <input type="radio"
                                                                            name="ver-comida-plato"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">Marcar un número telefónico
                                                            </td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="marcar-numero-telefonico">Si</label>
                                                                        <input type="radio"
                                                                            name="marcar-numero-telefonico"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="marcar-numero-telefonico">No</label>
                                                                        <input type="radio"
                                                                            name="marcar-numero-telefonico"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">Realizar su arreglo personal
                                                            </td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="arreglo-personal">bañarse</label>
                                                                        <input type="radio"
                                                                            name="arreglo-personal"
                                                                            value="bañarse">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="arreglo-personal">vestirse</label>
                                                                        <input type="radio"
                                                                            name="arreglo-personal"
                                                                            value="vestirse">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label for="arreglo-personal">lavarse los
                                                                            dientes</label>
                                                                        <input type="radio"
                                                                            name="arreglo-personal"
                                                                            value="lavarse los dientes">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    <hr>

                                    <h6><b>Tareas de Cerca: Tiene Dificultad para:</b></h6>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-12">
                                            <div class="table-responsive">
                                                <table class="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td class="text-center" style="width: 50%">Leer
                                                                titulares de periodicos y revistas</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="leer-titulares-periodicos-revistas">Si</label>
                                                                        <input type="radio"
                                                                            name="leer-titulares-periodicos-revistas"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="leer-titulares-periodicos-revistas">No</label>
                                                                        <input type="radio"
                                                                            name="leer-titulares-periodicos-revistas"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center" style="width: 50%">Leer
                                                                letra manuscrita o cursiva</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="leer-letra-manuscrita-cursiva">Si</label>
                                                                        <input type="radio"
                                                                            name="leer-letra-manuscrita-cursiva"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="leer-letra-manuscrita-cursiva">No</label>
                                                                        <input type="radio"
                                                                            name="leer-letra-manuscrita-cursiva"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center" style="width: 50%">Leer
                                                                periodicos</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label for="leer-periodicos">Si</label>
                                                                        <input type="radio"
                                                                            name="leer-periodicos"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label for="leer-periodicos">No</label>
                                                                        <input type="radio"
                                                                            name="leer-periodicos"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center" style="width: 50%">Ver los
                                                                precios o etiquetas de productos</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="ver-precios-etiquetas-productos">Si</label>
                                                                        <input type="radio"
                                                                            name="ver-precios-etiquetas-productos"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="ver-precios-etiquetas-productos">No</label>
                                                                        <input type="radio"
                                                                            name="ver-precios-etiquetas-productos"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center" style="width: 50%">Leer su
                                                                correo electrónico</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="leer-correo-electronico">Si</label>
                                                                        <input type="radio"
                                                                            name="leer-correo-electronico"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="leer-correo-electronico">No</label>
                                                                        <input type="radio"
                                                                            name="leer-correo-electronico"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center" style="width: 50%">Firmas
                                                                cheques, recibos, papelería</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="firma-cheque-recibo-papeleria">Si</label>
                                                                        <input type="radio"
                                                                            name="firma-cheque-recibo-papeleria"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="firma-cheque-recibo-papeleria">No</label>
                                                                        <input type="radio"
                                                                            name="firma-cheque-recibo-papeleria"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center" style="width: 50%">
                                                                Escribir</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label for="escribir">Si</label>
                                                                        <input type="radio" name="escribir"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label for="escribir">No</label>
                                                                        <input type="radio" name="escribir"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center" style="width: 50%">Coser,
                                                                tejer, bordar</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="coser-tejer-bordar">Si</label>
                                                                        <input type="radio"
                                                                            name="coser-tejer-bordar"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="coser-tejer-bordar">No</label>
                                                                        <input type="radio"
                                                                            name="coser-tejer-bordar"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center" style="width: 50%">Leer su
                                                                Libro Religioso</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="leer-libro-religioso">Si</label>
                                                                        <input type="radio"
                                                                            name="leer-libro-religioso"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="leer-libro-religioso">No</label>
                                                                        <input type="radio"
                                                                            name="leer-libro-religioso"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center" style="width: 50%">Ver la
                                                                pantalla de la computadora</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="ver-pantalla-computadora">Si</label>
                                                                        <input type="radio"
                                                                            name="ver-pantalla-computadora"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="ver-pantalla-computadora">No</label>
                                                                        <input type="radio"
                                                                            name="ver-pantalla-computadora"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>

                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    <hr>
                                    <h6><b>Iluminación: Tiene Problemas para:</b></h6>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-12">
                                            <div class="table-responsive">
                                                <table class="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td class="text-center" style="width: 50%">Tolerar
                                                                la luz del Sol</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label for="tolerar-luz-sol">Si</label>
                                                                        <input type="radio"
                                                                            name="tolerar-luz-sol"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label for="tolerar-luz-sol">No</label>
                                                                        <input type="radio"
                                                                            name="tolerar-luz-sol"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center" style="width: 50%">Usar
                                                                lentes oscuros de Sol</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="usar-lentes-oscuros-sol">Si</label>
                                                                        <input type="radio"
                                                                            name="usar-lentes-oscuros-sol"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="usar-lentes-oscuros-sol">No</label>
                                                                        <input type="radio"
                                                                            name="usar-lentes-oscuros-sol"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center" style="width: 50%">
                                                                Realizar actividades en lugares interiores</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="realizar-actividades-lugares-interiores">Si</label>
                                                                        <input type="radio"
                                                                            name="realizar-actividades-lugares-interiores"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="realizar-actividades-lugares-interiores">No</label>
                                                                        <input type="radio"
                                                                            name="realizar-actividades-lugares-interiores"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center" style="width: 50%">Siente
                                                                destellos de luces, o deslumbramiento de día</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="siente-destellos-luces-deslumbramiento-dia">Si</label>
                                                                        <input type="radio"
                                                                            name="siente-destellos-luces-deslumbramiento-dia"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="siente-destellos-luces-deslumbramiento-dia">No</label>
                                                                        <input type="radio"
                                                                            name="siente-destellos-luces-deslumbramiento-dia"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center" style="width: 50%">
                                                                Prefiere la luz</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label for="prefiere-luz">Si</label>
                                                                        <input type="radio"
                                                                            name="prefiere-luz"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label for="prefiere-luz">No</label>
                                                                        <input type="radio"
                                                                            name="prefiere-luz"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center" style="width: 50%">Ver en
                                                                lugares que las luces son amarillas</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="ver-lugares-luces-amarillas">Si</label>
                                                                        <input type="radio"
                                                                            name="ver-lugares-luces-amarillas"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="ver-lugares-luces-amarillas">No</label>
                                                                        <input type="radio"
                                                                            name="ver-lugares-luces-amarillas"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center" style="width: 50%">Ver en
                                                                lugares que las luces son blancas</td>
                                                            <td>
                                                                <div
                                                                    style="display: flex; place-content: center;">
                                                                    <div>
                                                                        <label
                                                                            for="ver-lugares-luces-blancas">Si</label>
                                                                        <input type="radio"
                                                                            name="ver-lugares-luces-blancas"
                                                                            value="si">
                                                                    </div>
                                                                    <div style="margin-left:10px;">
                                                                        <label
                                                                            for="ver-lugares-luces-blancas">No</label>
                                                                        <input type="radio"
                                                                            name="ver-lugares-luces-blancas"
                                                                            value="no">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    <h6>AGUDEZA VISUAL</h6>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-6">
                                            <div class="table-responsive">
                                                <table class="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th class="text-center">AV/SC</th>
                                                            <th>OD</th>
                                                            <th>OI</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td class="text-center">VL</td>
                                                            <td>
                                                                <input type="text" class="form-control"
                                                                    placeholder="od_vl" name="av/sc_od_vl">
                                                            </td>
                                                            <td>
                                                                <input type="text" class="form-control"
                                                                    placeholder="oi_vl" name="av/sc_oi_vl">
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">VP</td>
                                                            <td>
                                                                <input type="text" class="form-control"
                                                                    placeholder="od_vp" name="av/sc_od_vp">
                                                            </td>
                                                            <td>
                                                                <input type="text" class="form-control"
                                                                    placeholder="oi_vp" name="av/sc_oi_vp">
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">PH</td>
                                                            <td>
                                                                <input type="text" class="form-control"
                                                                    placeholder="od_ph" name="av/sc_od_ph">
                                                            </td>
                                                            <td>
                                                                <input type="text" class="form-control"
                                                                    placeholder="oi_ph" name="av/sc_oi_ph">
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div class="form-group col-md-6">
                                            <div class="table-responsive">
                                                <table class="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th class="text-center">AV/CC</th>
                                                            <th>OD</th>
                                                            <th>OI</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td class="text-center">VL</td>
                                                            <td>
                                                                <input type="text" class="form-control"
                                                                    placeholder="od_vl" name="av/cc_od_vl">
                                                            </td>
                                                            <td>
                                                                <input type="text" class="form-control"
                                                                    placeholder="oi_vl" name="av/cc_oi_vl">
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">VP</td>
                                                            <td>
                                                                <input type="text" class="form-control"
                                                                    placeholder="od_vp" name="av/cc_od_vp">
                                                            </td>
                                                            <td>
                                                                <input type="text" class="form-control"
                                                                    placeholder="oi_vp" name="av/cc_oi_vp">
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">PH</td>
                                                            <td>
                                                                <input type="text" class="form-control"
                                                                    placeholder="od_ph" name="av/cc_od_ph">
                                                            </td>
                                                            <td>
                                                                <input type="text" class="form-control"
                                                                    placeholder="oi_ph" name="av/cc_oi_ph">
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <h6>RECETA EN USO</h6>
                                        <div class="table-responsive">
                                            <table class="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th class="text-center">RX en uso</th>
                                                        <th>ESFERA</th>
                                                        <th>CILINDRO</th>
                                                        <th>EJE</th>
                                                        <th>P/BASE △</th>
                                                        <th>ADD</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td class="text-center">Ojo Derecho</td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                placeholder="esfera_od" name="esfera_od">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                placeholder="cilindro_od" name="cilindro_od">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                placeholder="eje_od" name="eje_od">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                placeholder="p_base_od" name="p_base_od"
                                                                value="△">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                placeholder="add_od" name="add_od">
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="text-center">Ojo Izquierdo</td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                placeholder="esfera_oi" name="esfera_oi">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                placeholder="cilindro_oi" name="cilindro_oi">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                placeholder="eje_oi" name="eje_oi">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                placeholder="p_base_oi" name="p_base_oi"
                                                                value="△">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                placeholder="add_oi" name="add_oi">
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-3">
                                            <label for="objetivos">Tipo de lentes</label>
                                            <input type="text" class="form-control"
                                                name="len_tipo_lentes">
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label for="objetivos">Filtros</label>
                                            <input type="text" class="form-control" name="len_filtros">
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label for="objetivos">Tiempo</label>
                                            <input type="text" class="form-control" name="len_tiempo">
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label for="objetivos">Tipo de Aro</label>
                                            <input type="text" class="form-control" name="len_tipo_aro">
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <h6><b>Test de Sensibilidad Luminosa (BAT)</b></h6>
                                        <table class="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th style="width: 150px" class="text-center">Ojo Evaluado
                                                    </th>
                                                    <th class="text-center">Apagado</th>
                                                    <th class="text-center">Bajo</th>
                                                    <th class="text-center">Medio</th>
                                                    <th class="text-center">Alto</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td class="text-center">OD</td>
                                                    <td>
                                                        <input type="text" class="form-control"
                                                            placeholder="Apagado" name="Apagado">
                                                    </td>
                                                    <td>
                                                        <input type="text" class="form-control"
                                                            placeholder="Bajo" name="Bajo">
                                                    </td>
                                                    <td>
                                                        <input type="text" class="form-control"
                                                            placeholder="Medio" name="Medio">
                                                    </td>
                                                    <td>
                                                        <input type="text" class="form-control"
                                                            placeholder="Alto" name="Alto"
                                                            value="">
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="text-center">OI</td>
                                                    <td>
                                                        <input type="text" class="form-control"
                                                            placeholder="Apagado" name="Apagado">
                                                    </td>
                                                    <td>
                                                        <input type="text" class="form-control"
                                                            placeholder="Bajo" name="Bajo">
                                                    </td>
                                                    <td>
                                                        <input type="text" class="form-control"
                                                            placeholder="Medio" name="Medio">
                                                    </td>
                                                    <td>
                                                        <input type="text" class="form-control"
                                                            placeholder="Alto" name="Alto"
                                                            value="">
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-12">
                                            <label for="inputAddress">Observaciones:</label>
                                            <textarea id="textarea" class="form-control textarea" maxlength="1000" rows="5"
                                                placeholder="Esta área tiene un limite de 1000 caracteres." name=""></textarea>
                                        </div>
                                    </div>

                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-12">
                                            <table class="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th class="text-center"></th>
                                                        <th class="text-center">CV.CONFRONTACION</th>
                                                        <th class="text-center">SALUD OCULAR</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td class="text-center">OD</td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                placeholder="Ojo Derecho" name="cv_od">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                placeholder="Ojo Derecho" name="so_od">
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="text-center">OI</td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                placeholder="Ojo Izquierdo" name="cv_oi">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                placeholder="Ojo Izquierdo" name="so_oi">
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <h6>AMSLER</h6>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-6">
                                            <input type="text" class="form-control"
                                                placeholder="Ojo Derecho" name="amsler_od">
                                        </div>
                                        <div class="form-group col-md-6">
                                            <input type="text" class="form-control"
                                                placeholder="Ojo Izquierdo" name="amsler_oi">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <h6>SENSIBILIDAD AL CONTRASTE</h6>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-6">
                                            <input type="text" class="form-control"
                                                placeholder="Ojo Derecho" name="sensibilidad_od">
                                        </div>
                                        <div class="form-group col-md-6">
                                            <input type="text" class="form-control"
                                                placeholder="Ojo Izquierdo" name="sensibilidad_oi">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-row mb-4">
                                <div class="form-group col-md-12">
                                    <label for="inputAddress">Versiones</label>
                                    <textarea id="textarea" class="form-control textarea" maxlength="800" rows="5"
                                        placeholder="Esta área tiene un limite de 800 caracteres." name="plan_versiones"></textarea>
                                </div>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th class="text-center">PRUEBAS SENSORIALES</th>
                                            <th class="text-center">VISION LEJANA</th>
                                            <th class="text-center">VISION PROXIMA</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="text-center">Luces de Worth</td>
                                            <td>
                                                <input type="text" class="form-control" name="vl_luces"
                                                    placeholder="vl_luces">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" name="vp_luces"
                                                    placeholder="vp_luces">
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="form-row mb-4">
                                <div class="form-group col-md-12">
                                    <label for="inputAddress">Visión de Color</label>
                                    <input type="text" class="form-control" id="inputAddress"
                                        placeholder="Visión de Color" name="vision_color" value="">
                                </div>
                            </div>
                            <div class="form-row mb-4">
                                <div class="form-group col-md-6">
                                    <label for="inputAddress">Ojo Derecho</label>
                                    <input type="text" class="form-control" id="inputAddress"
                                        placeholder="Ojo Derecho" name="prueba_od">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="inputAddress">Ojo Izquierdo</label>
                                    <input type="text" class="form-control" id="inputAddress"
                                        placeholder="Ojo Izquierdo" name="prueba_oi">
                                </div>
                            </div>
                            <div class="form-group">
                                <h5 class="p-4">RECETA FINAL PARA DISTANCIA</h5>
                                <div class="table-responsive">
                                    <table class="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th class="text-center">RX </th>
                                                <th>ESFERA</th>
                                                <th>CILINDRO</th>
                                                <th>EJE</th>
                                                <th>P/BASE △</th>
                                                <th>AGUDEZA VISUAL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="text-center">Ojo Derecho</td>
                                                <td>
                                                    <input type="text" class="form-control"
                                                        placeholder="esfera_od" name="esfera_od_f">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control"
                                                        placeholder="cilindro_od" name="cilindro_od_f">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control"
                                                        placeholder="eje_od" name="eje_od_f">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control"
                                                        placeholder="p_base_od" name="p_base_od_f"
                                                        value="△">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control"
                                                        placeholder="agz_od" name="agz_od_f">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-center">Ojo Izquierdo</td>
                                                <td>
                                                    <input type="text" class="form-control"
                                                        placeholder="esfera_oi" name="esfera_oi_f">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control"
                                                        placeholder="cilindro_oi" name="cilindro_oi_f">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control"
                                                        placeholder="eje_oi" name="eje_oi_f">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control"
                                                        placeholder="p_base_oi" name="p_base_oi_f"
                                                        value="△">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control"
                                                        placeholder="agz_oi" name="agz_oi_f">
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="form-row mb-4">
                                <div class="form-group col-md-6">
                                    <label for="inputAddress">TIPO DE LENTE</label>
                                    <input type="text" class="form-control" id="inputAddress"
                                        placeholder="Marca" name="lentes_marca_1">
                                </div>
                                <div class="form-group col-md-2">
                                    <label for="inputAddress">PD</label>
                                    <input type="text" class="form-control" id="inputAddress"
                                        placeholder="Tipo" name="lentes_pd_1">
                                </div>
                                <div class="form-group col-md-2">
                                    <label for="inputAddress">DNP</label>
                                    <input type="text" class="form-control" id="inputAddress"
                                        placeholder="Tipo" name="lentes_dnp_1">
                                </div>
                                <div class="form-group col-md-2">
                                    <label for="inputAddress">ALTURA</label>
                                    <input type="text" class="form-control" id="inputAddress"
                                        placeholder="Tipo" name="lentes_altura_1">
                                </div>
                            </div>
                            <div class="form-group">
                                <h5 class="p-4">RECETA FINAL PARA CERCA</h5>
                                <div class="table-responsive">
                                    <table class="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th class="text-center">RX </th>
                                                <th>ESFERA</th>
                                                <th>CILINDRO</th>
                                                <th>EJE</th>
                                                <th>P/BASE △</th>
                                                <th>AGUDEZA VISUAL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="text-center">Ojo Derecho</td>
                                                <td>
                                                    <input type="text" class="form-control"
                                                        placeholder="esfera_od" name="esfera_od_fc">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control"
                                                        placeholder="cilindro_od" name="cilindro_od_fc">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control"
                                                        placeholder="eje_od" name="eje_od_fc">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control"
                                                        placeholder="p_base_od" name="p_base_od_fc"
                                                        value="△">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control"
                                                        placeholder="agz_od" name="agz_od_fc">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-center">Ojo Izquierdo</td>
                                                <td>
                                                    <input type="text" class="form-control"
                                                        placeholder="esfera_oi" name="esfera_oi_fc">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control"
                                                        placeholder="cilindro_oi" name="cilindro_oi_fc">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control"
                                                        placeholder="eje_oi" name="eje_oi_fc">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control"
                                                        placeholder="p_base_oi" name="p_base_oi_fc"
                                                        value="△">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control"
                                                        placeholder="agz_oi" name="agz_oi_fc">
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="form-row mb-4">
                                <div class="form-group col-md-6">
                                    <label for="inputAddress">TIPO DE LENTE</label>
                                    <input type="text" class="form-control" id="inputAddress"
                                        placeholder="Marca" name="lentes_marca_2">
                                </div>
                                <div class="form-group col-md-2">
                                    <label for="inputAddress">PD</label>
                                    <input type="text" class="form-control" id="inputAddress"
                                        placeholder="Tipo" name="lentes_pd_2">
                                </div>
                                <div class="form-group col-md-2">
                                    <label for="inputAddress">DNP</label>
                                    <input type="text" class="form-control" id="inputAddress"
                                        placeholder="Tipo" name="lentes_dnp_2">
                                </div>
                                <div class="form-group col-md-2">
                                    <label for="inputAddress">ALTURA</label>
                                    <input type="text" class="form-control" id="inputAddress"
                                        placeholder="Tipo" name="lentes_altura_2">
                                </div>
                            </div>
                            <div class="form-row mb-4">
                                <div class="form-group col-md-12">
                                    <label for="inputAddress">Ayudas Opticas Para Baja Visión</label>
                                    <textarea id="textarea" class="form-control textarea" maxlength="800" rows="5"
                                        placeholder="Esta área tiene un limite de 800 caracteres." name="ayudas_opticas"></textarea>
                                </div>
                            </div>

                            <div class="form-row mb-4">
                                <h6><b>Microscopios</b></h6>
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th class="text-center"></th>
                                            <th class="text-center">Potencia</th>
                                            <th class="text-center">AV</th>
                                            <th class="text-center">Dist</th>
                                            <th class="text-center">Observaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="text-center">
                                                Ojo Derecho
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-center">
                                                Ojo Izquierdo
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="form-row mb-4">
                                <h6><b>Magnificador</b></h6>
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th class="text-center"></th>
                                            <th class="text-center">Potencia</th>
                                            <th class="text-center">AV</th>
                                            <th class="text-center">Dist</th>
                                            <th class="text-center">Observaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="text-center">
                                                Ojo Derecho
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-center">
                                                Ojo Izquierdo
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="form-row mb-4">
                                <h6><b>Telescopio</b></h6>
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th class="text-center"></th>
                                            <th class="text-center">Potencia</th>
                                            <th class="text-center">AV</th>
                                            <th class="text-center">Dist</th>
                                            <th class="text-center">Observaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="text-center">
                                                Ojo Derecho
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-center">
                                                Ojo Izquierdo
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="form-row mb-4">
                                <h6><b>Sistemas Telescopios Adaptados en Gafas</b></h6>
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th class="text-center"></th>
                                            <th class="text-center">Potencia</th>
                                            <th class="text-center">AV</th>
                                            <th class="text-center">Dist</th>
                                            <th class="text-center">Lte ADD</th>
                                            <th class="text-center">Observaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="text-center">
                                                Ojo Derecho
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-center">
                                                Ojo Izquierdo
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="form-row mb-4">
                                <h6><b>Telemicroscopio</b></h6>
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th class="text-center">Potencia</th>
                                            <th class="text-center">Lte ADD</th>
                                            <th class="text-center">AV</th>
                                            <th class="text-center">Dist</th>
                                            <th class="text-center">Observaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="text-center">Ojo Derecho</td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-center">Ojo Izquierdo</td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="form-row mb-4">
                                <h6><b>Circuito Cerrado de Television</b></h6>
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th class="text-center">Polaridad</th>
                                            <th class="text-center">Potencia</th>
                                            <th class="text-center">AV</th>
                                            <th class="text-center">Dist</th>
                                            <th class="text-center">Observaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="text-center">Ojo Derecho</td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-center">Ojo Izquierdo</td>
                                            <td class="text-center">
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="">
                                            </td>
                                            <td>
                                                <input type="text" class="form-control" placeholder=""
                                                    name="" value="">
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="form-row mb-4">
                                <div class="form-group col-md-12">
                                    <h6><b>Ayudas No Opticas/Otros</b></h6>
                                </div>
                                <div class="form-group col-md-4">
                                    <label>
                                        <input type="checkbox" name="tiposcopio"> Tiposcopio
                                    </label>
                                </div>
                                <div class="form-group col-md-4">
                                    <label>
                                        <input type="checkbox" name="guia_escritura"> Guia de Escritura
                                    </label>
                                </div>
                                <div class="form-group col-md-4">
                                    <label>
                                        <input type="checkbox" name="atril"> Atril
                                    </label>
                                </div>

                                <div class="form-group col-md-4">
                                    <label>
                                        <input type="checkbox" name="iluminacion"> Iluminacion
                                    </label>
                                </div>
                                <div class="form-group col-md-4">
                                    <label>
                                        <input type="checkbox" name="macrotipo"> Macrotipo
                                    </label>
                                </div>
                                <div class="form-group col-md-4">
                                    <label>
                                        <input type="checkbox" name="acetato_amarillo"> Acetato Amarillo
                                    </label>
                                </div>
                            </div>

                            <div class="form-row mb-4">
                                <div class="form-group col-md-12">
                                    <label for="inputAddress">Ayudas No Opticas Para Baja Visión</label>
                                    <textarea id="textarea" class="form-control textarea" maxlength="800" rows="5"
                                        placeholder="Esta área tiene un limite de 800 caracteres." name="ayudas_no_opticas"></textarea>
                                </div>
                            </div>

                            <div class="form-row mb-4">
                                <div class="form-group col-md-12">
                                    <label for="">Materiales a Prescribir:</label>
                                    <textarea id="textarea" class="form-control textarea" maxlength="1000" rows="5"
                                        placeholder="Esta área tiene un limite de 1000 caracteres." name=""></textarea>
                                </div>
                            </div>

                            <div class="form-row mb-4">
                                <div class="form-group col-md-12">
                                    <label for="inputAddress">Plan de Rehabilitación Visual</label>
                                    <textarea id="textarea" class="form-control textarea" maxlength="800" rows="5"
                                        placeholder="Esta área tiene un limite de 800 caracteres." name="plan_rehabilitacion"></textarea>
                                </div>
                            </div>

                            <div class="form-row mb-4">
                                <div class="form-group col-md-12">
                                    <label for="">Referencia a otro servicio:</label>
                                    <textarea id="textarea" class="form-control textarea" maxlength="1000" rows="5"
                                        placeholder="Esta área tiene un limite de 1000 caracteres." name=""></textarea>
                                </div>
                            </div>

                            <div class="form-row mb-4">
                                <div class="form-group col-md-12">
                                    <label for="">Observaciones:</label>
                                    <textarea id="textarea" class="form-control textarea" maxlength="1000" rows="5"
                                        placeholder="Esta área tiene un limite de 1000 caracteres." name=""></textarea>
                                </div>
                            </div>

                            <input type="hidden" name="crear_baja_vision">
                            <input type="hidden" name="id_terapia" value="0">

                            <input type="hidden" name="doctor" value="Administrador">
                            <button type="submit" class="btn btn-success mt-3">Guardar Consulta</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    @include('partials.footer')
</div>
</body>
@endsection
