@extends('partials.sidebar')
@section('content')

<body>
    <head>
        <link href="{{ asset('assets/css/consultas/optometrianeonatos/optometrianeonatos.css') }}" rel="stylesheet" type="text/css" class="structure" />
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
                                        <h3 class="text-center">Optometría Neonatos</h3>
                                    </div>
                                </div>
                            </div>
                            <div class="widget-content widget-content-area">
                                <form role="form" method="post">
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-12">
                                            <label for="inputEmail4">Pacientes</label>
                                            <select class="form-control form-small select2-hidden-accessible"
                                                name="paciente" data-select2-id="1" tabindex="-1" aria-hidden="true">
                                                <option value="" data-select2-id="3">&lt;--- Seleccione el
                                                    paciente ---&gt;</option>
                                                <option value="22" data-fecha-nacimiento="2018-08-21"> Número
                                                    Cedula: 8-1219-383 || Nombres: Danna Lucia Gonzalez Quiros</option>
                                                <option value="23" data-fecha-nacimiento="2016-09-22"> Número
                                                    Cedula: 4-882-127 || Nombres: Amber Lizeth Martinez Moreno</option>
                                                <option value="24" data-fecha-nacimiento="2013-06-28"> Número
                                                    Cedula: 4-867-2164 || Nombres: Jenna Nicolle Martinez Moreno
                                                </option>
                                                <option value="26" data-fecha-nacimiento="2011-11-22"> Número
                                                    Cedula: 8-1118-185 || Nombres: Ambar Julieta Quintero Xatruch
                                                </option>
                                                <option value="27" data-fecha-nacimiento="2011-07-25"> Número
                                                    Cedula: 0000 || Nombres: Noa Stella Edde Sasson</option>
                                                <option value="28" data-fecha-nacimiento="2012-07-08"> Número
                                                    Cedula: 8-1128-323 || Nombres: Daniel Antonio Halphen Tapia</option>
                                                <option value="29" data-fecha-nacimiento="2013-04-09"> Número
                                                    Cedula: 8-1140-1390 || Nombres: Salomon Dayan Yedid</option>
                                                <option value="32" data-fecha-nacimiento="1965-08-24"> Número
                                                    Cedula: N-17-806 || Nombres: Laura Fernández Refincor</option>
                                                <option value="33" data-fecha-nacimiento="2005-12-07"> Número
                                                    Cedula: 8-1029-2242 || Nombres: Luis Fernando Palomo Chan</option>
                                                <option value="35" data-fecha-nacimiento="2014-04-09"> Número
                                                    Cedula: 8-1156-1202 || Nombres: Jiam Carlos Tam Beitia</option>
                                                <option value="36" data-fecha-nacimiento="2016-11-07"> Número
                                                    Cedula: 8-1196-30 || Nombres: Luca Josiah Shacklett Arias</option>
                                                <option value="37" data-fecha-nacimiento="2011-02-18"> Número
                                                    Cedula: 064999726 || Nombres: Gabriela Saray Flores Chavez</option>
                                                <option value="38" data-fecha-nacimiento="2004-01-30"> Número
                                                    Cedula: 3-753-1045 || Nombres: Victor Adrian Miller Rodriguez
                                                </option>
                                                <option value="39" data-fecha-nacimiento="2021-08-31"> Número
                                                    Cedula: 8-1253-2353 || Nombres: Theo Orozco Calderin</option>
                                                <option value="40" data-fecha-nacimiento="2014-07-14"> Número
                                                    Cedula: 9-783-2092 || Nombres: Isabel Lunadys Núñez Batista
                                                </option>
                                                <option value="41" data-fecha-nacimiento="2012-12-30"> Número
                                                    Cedula: 8-1135-2150 || Nombres: Leonardo Alarcon Martinez</option>
                                                <option value="42" data-fecha-nacimiento="1992-06-15"> Número
                                                    Cedula: 8-883-173 || Nombres: Dilliamileth Esther Canales Bustamante
                                                </option>
                                                <option value="43" data-fecha-nacimiento="2014-08-03"> Número
                                                    Cedula: 8-1161-2268 || Nombres: Gabriel Ben Rubi Scmaffer</option>
                                                <option value="44" data-fecha-nacimiento="2020-05-22"> Número
                                                    Cedula: 8-1239-1527 || Nombres: Victor Manuel García Farah</option>
                                                <option value="45" data-fecha-nacimiento="1942-06-14"> Número
                                                    Cedula: e-8-22365 || Nombres: Shanta Nandwani Nandwani</option>
                                                <option value="47" data-fecha-nacimiento="2013-10-04"> Número
                                                    Cedula: 9-782-1702 || Nombres: Mariana Elizabeth Palacios Vergara
                                                </option>
                                                <option value="48" data-fecha-nacimiento="1980-10-31"> Número
                                                    Cedula: PE-9-2046 || Nombres: Sonia Ivette Pimentel Sánchez</option>
                                                <option value="49" data-fecha-nacimiento="2010-10-08"> Número
                                                    Cedula: 8-1101-1624 || Nombres: Gabriela Sofia Saldaña Dominguez
                                                </option>
                                                <option value="50" data-fecha-nacimiento="1964-03-07"> Número
                                                    Cedula: E-8-65267 || Nombres: Ravit Yeshurun de Levy</option>
                                            </select><span
                                                class="select2 select2-container mb-4 select2-container--default form-control-sm"
                                                dir="ltr" data-select2-id="2" style="width: 865px;"><span
                                                    class="selection"><span
                                                        class="select2-selection select2-selection--single"
                                                        role="combobox" aria-haspopup="true"
                                                        aria-expanded="false" tabindex="0"
                                                        aria-labelledby="select2-paciente-yx-container"><span
                                                            class="select2-selection__rendered"
                                                            id="select2-paciente-yx-container" role="textbox"
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
                                                <option value="3">CENTEVI Centro Médico San Judas Tadeo</option>
                                                <option value="4">CENTEVI Consultorios Medicos Paitilla</option>
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
                                            <textarea id="textarea" class="form-control textarea" maxlength="10000" rows="15" placeholder=""
                                                name="m_c"></textarea>
                                        </div>
                                    </div>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-4">
                                            <label for="lugarNacimiento">Antecedentes Oculares</label>
                                            <input type="text" class="form-control" id="lugarNacimiento"
                                                placeholder="" name="a_o">
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="inputAddress2">Antecedentes Personales</label>
                                            <input type="text" class="form-control" id="inputAddress2"
                                                placeholder="" name="a_p">
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="inputAddress2">Antecedentes Familiares</label>
                                            <input type="text" class="form-control" id="inputAddress2"
                                                placeholder="" name="a_f">
                                        </div>
                                    </div>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-12">
                                            <label for="medicamentos">Medicamentos</label>
                                            <input type="text" class="form-control" id="medicamentos"
                                                placeholder="" name="medicamentos">
                                        </div>
                                    </div>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-12">
                                            <label for="tratamientos">Tratamientos anteriores</label>
                                            <input type="text" class="form-control" id="tratamientos"
                                                placeholder="" name="tratamientos">
                                        </div>
                                    </div>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-12">
                                            <label for="tratamientos">Desarrollo del infante</label>
                                            <input type="text" class="form-control" id="tratamientos"
                                                placeholder="" name="desarrollo_infante">
                                        </div>
                                    </div>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-3">
                                            <label for="tratamientos">Nacimiento</label>
                                            <input type="text" class="form-control" id="tratamientos"
                                                placeholder="" name="nacimiento">
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label for="tratamientos">Parto</label>
                                            <input type="text" class="form-control" id="tratamientos"
                                                placeholder="" name="parto">
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label for="tratamientos">Gateo</label>
                                            <input type="text" class="form-control" id="tratamientos"
                                                placeholder="" name="gateo">
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label for="tratamientos">Lenguaje</label>
                                            <input type="text" class="form-control" id="tratamientos"
                                                placeholder="" name="lenguaje">
                                        </div>
                                    </div>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-4">
                                            <label for="tratamientos">Complicaciones Prenatales</label>
                                            <input type="text" class="form-control" id="tratamientos"
                                                placeholder="" name="complicaciones">
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="tratamientos">Perinatales</label>
                                            <input type="text" class="form-control" id="tratamientos"
                                                placeholder="" name="perinatales">
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="tratamientos">Postnatales</label>
                                            <input type="text" class="form-control" id="tratamientos"
                                                placeholder="" name="postnatales">
                                        </div>
                                    </div>

                                    <h6>AGUDEZA VISUAL:</h6>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-3">
                                            <label for="tambor">Tambor Optocinético AO </label>
                                            <input type="text" class="form-control" id="tambor"
                                                placeholder="" name="tambor">
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label for="fija">Fija</label>
                                            <input type="text" class="form-control" id="fija"
                                                placeholder="" name="fija">
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label for="sigue">Sigue</label>
                                            <input type="text" class="form-control" id="sigue"
                                                placeholder="" name="sigue">
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label for="mantiene">Mantiene</label>
                                            <input type="text" class="form-control" id="mantiene"
                                                placeholder="" name="mantiene">
                                        </div>
                                    </div>

                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-4">
                                            <label for="test">Test mirada preferencial OD </label>
                                            <input type="text" class="form-control" id="test"
                                                placeholder="" name="test">
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="oi">OI</label>
                                            <input type="text" class="form-control" id="oi"
                                                placeholder="" name="a_oi">
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="ao">AO</label>
                                            <input type="text" class="form-control" id="ao"
                                                placeholder="" name="a_ao">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <h5>RECETA EN USO</h5>
                                        <div class="table-responsive">
                                            <table class="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th class="text-center">RX </th>
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
                                                                placeholder="" name="esfera_od">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                placeholder="" name="cilindro_od">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                placeholder="" name="eje_od">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                placeholder="△" name="p_base_od">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                placeholder="" name="add_od">
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="text-center">Ojo Izquierdo</td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                placeholder="" name="esfera_oi">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                placeholder="" name="cilindro_oi">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                placeholder="" name="eje_oi">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                placeholder="△" name="p_base_oi">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                placeholder="" name="add_oi">
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-3">
                                            <label for="objetivos">Tipo de lentes</label>
                                            <input type="text" class="form-control" name="len_tipo_lentes">
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

                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-3">
                                            <h5>Segmento Anterior</h5>
                                        </div>
                                        <div class="form-group col-md-3">
                                            <h5>Polo Posterior</h5>
                                        </div>
                                    </div>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-3">
                                            <input type="text" class="form-control" placeholder=""
                                                name="sa_od">
                                        </div>
                                        <div class="form-group col-md-3">
                                            <input type="text" class="form-control" placeholder=""
                                                name="pp_od">
                                        </div>
                                    </div>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-3">
                                            <input type="text" class="form-control" placeholder=""
                                                name="sa_oi">
                                        </div>
                                        <div class="form-group col-md-3">
                                            <input type="text" class="form-control" placeholder=""
                                                name="pp_oi">
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div class="form-row mb-4">
                                <div class="form-group col-md-6">
                                    <label for="tratamientos">Hirschberg</label>
                                    <input type="text" class="form-control" id="D" placeholder=""
                                        name="hirschberg">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="tratamientos">Krismsky</label>
                                    <input type="text" class="form-control" id="I" placeholder=""
                                        name="krismsky">
                                </div>
                            </div>

                            <div class="form-row mb-4">
                                <div class="form-group col-md-12">
                                    <label for="inputAddress">VERSIONES:</label>
                                    <textarea id="textarea" class="form-control textarea" maxlength="10000" rows="15" placeholder=""
                                        name="plan_versiones"></textarea>
                                </div>
                            </div>

                            <div class="form-row mb-4">
                                <div class="form-group col-md-3">
                                    <label for="tratamientos">CT: VP:</label>
                                    <input type="text" class="form-control" id="D" placeholder=""
                                        name="ct_vp">
                                </div>
                                <div class="form-group col-md-3">
                                    <label for="tratamientos">Reflejo Cocleopalpebral</label>
                                    <input type="text" class="form-control" id="I" placeholder=""
                                        name="ct_reflejo">
                                </div>
                                <div class="form-group col-md-3">
                                    <label for="tratamientos">Ducciones:OD</label>
                                    <input type="text" class="form-control" id="I" placeholder=""
                                        name="ducciones_od">
                                </div>
                                <div class="form-group col-md-3">
                                    <label for="tratamientos">OI</label>
                                    <input type="text" class="form-control" id="I" placeholder=""
                                        name="ducciones_oi">
                                </div>
                            </div>

                            <div class="form-row mb-4">
                                <div class="form-group col-md-8">
                                    <label for="tratamientos">Posición Compensatoria</label>
                                    <input type="text" class="form-control" id="I" placeholder=""
                                        name="posicion_compensatoria">
                                </div>
                            </div>


                            <div class="form-row mb-4">
                                <div class="form-group col-md-3">
                                    <label for="tratamientos">Reflejos Pupilares: Fotomotor/OD </label>
                                    <input type="text" class="form-control" id="D" placeholder=""
                                        name="fotomotor_od">
                                </div>
                                <div class="form-group col-md-3">
                                    <label for="tratamientos">Consensual</label>
                                    <input type="text" class="form-control" id="I" placeholder=""
                                        name="consensual">
                                </div>
                                <div class="form-group col-md-3">
                                    <label for="tratamientos">Fotomotor:OI</label>
                                    <input type="text" class="form-control" id="I" placeholder=""
                                        name="fotomotor_oi">
                                </div>
                                <div class="form-group col-md-3">
                                    <label for="tratamientos">Consensual</label>
                                    <input type="text" class="form-control" id="I" placeholder=""
                                        name="fotomotor_consensual">
                                </div>
                            </div>
                            <div class="form-row mb-4">
                                <div class="form-group col-md-6">
                                    <label for="inputAddress">Reflejo retinoscopico OD:</label>
                                    <input type="text" class="form-control" id="inputAddress"
                                        placeholder="" name="reflejo_r_od">
                                </div>
                                <div class="form-group col-md-3">
                                    <label for="inputAddress">OI:</label>
                                    <input type="text" class="form-control" id="inputAddress"
                                        placeholder="" name="reflejo_r_oi">
                                </div>
                                <div class="form-group col-md-3">
                                    <label for="inputAddress">AO:</label>
                                    <input type="text" class="form-control" id="inputAddress"
                                        placeholder="" name="reflejo_r_ao">
                                </div>
                            </div>
                            <div class="form-group">
                                <h5>RECETA FINAL</h5>
                                <div class="table-responsive">
                                    <table class="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th class="text-center">RX </th>
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
                                                    <input type="text" class="form-control" placeholder=""
                                                        name="esfera_od_f">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control" placeholder=""
                                                        name="cilindro_od_f">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control" placeholder=""
                                                        name="eje_od_f">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control" placeholder="△"
                                                        name="p_base_od_f">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control" placeholder=""
                                                        name="add_od_f">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-center">Ojo Izquierdo</td>
                                                <td>
                                                    <input type="text" class="form-control" placeholder=""
                                                        name="esfera_oi_f">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control" placeholder=""
                                                        name="cilindro_oi_f">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control" placeholder=""
                                                        name="eje_oi_f">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control" placeholder="△"
                                                        name="p_base_oi_f">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control" placeholder=""
                                                        name="add_oi_f">
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div class="form-row mb-4">
                                <div class="form-group col-md-6">
                                    <label for="inputAddress">Tipo Lentes</label>
                                    <input type="text" class="form-control" id="inputAddress"
                                        placeholder="" name="refraccion_tipo_lentes">
                                </div>
                                <div class="form-group col-md-2">
                                    <label for="inputAddress">PD:</label>
                                    <input type="text" class="form-control" id="inputAddress"
                                        placeholder="" name="refraccion_pd">
                                </div>
                                <div class="form-group col-md-4">
                                    <label for="inputAddress">USO:</label>
                                    <input type="text" class="form-control" id="inputAddress"
                                        placeholder="" name="refraccion_uso">
                                </div>
                            </div>
                            <div class="form-row mb-4">
                                <div class="form-group col-md-12">
                                    <label for="inputAddress">CONDUCTA A SEGUIR:</label>
                                    <textarea id="textarea" class="form-control textarea" maxlength="10000" rows="15" placeholder=""
                                        name="conducta_seguir"></textarea>
                                </div>
                            </div>
                            <input type="hidden" name="crear_optometria_neonatos" value="crear">
                            <input type="hidden" name="doctor" value="Administrador">
                            <input type="hidden" name="id_terapia" value="0">
                            <button type="submit" class="btn btn-success mt-3">Guardar Consulta</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@include('partials.footer')
</body>
@endsection
