@extends('partials.sidebar')
@section('content')

    <body>
        <head>
            <link href="{{ asset('assets/css/consultas/optometriapediatrica/optometriapediatrica.css') }}" rel="stylesheet"
                type="text/css" class="structure" />
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
                                                <h3 class="text-center">Optometría Pediatrica</h3>
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
                                                        <option value="23" data-fecha-nacimiento="2016-09-22"> Número
                                                            Cedula: 4-882-127 || Nombres: Amber Lizeth Martinez Moreno
                                                        </option>
                                                        <option value="24" data-fecha-nacimiento="2013-06-28"> Número
                                                            Cedula: 4-867-2164 || Nombres: Jenna Nicolle Martinez Moreno
                                                        </option>
                                                        <option value="26" data-fecha-nacimiento="2011-11-22"> Número
                                                            Cedula: 8-1118-185 || Nombres: Ambar Julieta Quintero Xatruch
                                                        </option>
                                                        <option value="27" data-fecha-nacimiento="2011-07-25"> Número
                                                            Cedula: 0000 || Nombres: Noa Stella Edde Sasson</option>
                                                        <option value="28" data-fecha-nacimiento="2012-07-08"> Número
                                                            Cedula: 8-1128-323 || Nombres: Daniel Antonio Halphen Tapia
                                                        </option>
                                                        <option value="29" data-fecha-nacimiento="2013-04-09"> Número
                                                            Cedula: 8-1140-1390 || Nombres: Salomon Dayan Yedid</option>
                                                        <option value="32" data-fecha-nacimiento="1965-08-24"> Número
                                                            Cedula: N-17-806 || Nombres: Laura Fernández Refincor</option>
                                                        <option value="33" data-fecha-nacimiento="2005-12-07"> Número
                                                            Cedula: 8-1029-2242 || Nombres: Luis Fernando Palomo Chan
                                                        </option>
                                                        <option value="35" data-fecha-nacimiento="2014-04-09"> Número
                                                            Cedula: 8-1156-1202 || Nombres: Jiam Carlos Tam Beitia</option>
                                                        <option value="36" data-fecha-nacimiento="2016-11-07"> Número
                                                            Cedula: 8-1196-30 || Nombres: Luca Josiah Shacklett Arias
                                                        </option>
                                                        
                                                    </select><span
                                                        class="select2 select2-container mb-4 select2-container--default form-control-sm"
                                                        dir="ltr" data-select2-id="2"
                                                        style="width: 865px;"><span class="selection"><span
                                                        class="select2-selection select2-selection--single"
                                                        role="combobox" aria-haspopup="true"
                                                        aria-expanded="false" tabindex="0"
                                                        aria-labelledby="select2-paciente-2b-container"><span
                                                        class="select2-selection__rendered"
                                                        id="select2-paciente-2b-container" role="textbox"
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

                                                    <select required="" class="form-control selectsucursal"
                                                        id="sucursal" name="sucursal">
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
                                                    <input type="date" required=""
                                                        class="form-control fechaantencion" id="inputAddress"
                                                        name="fecha_atencion" max="2024-07-04">
                                                </div>
                                            </div>
                                            <div class="form-row mb-4">
                                                <div class="form-group col-md-12">
                                                    <label for="inputAddress">Motivo de consulta:</label>
                                                    <textarea id="textarea" class="form-control textarea" maxlength="10000" rows="15" name="m_c"></textarea>
                                                </div>
                                            </div>
                                            <div class="form-row mb-4">
                                                <div class="form-group col-md-4">
                                                    <label for="lugarNacimiento">Antecedentes Oculares</label>
                                                    <input type="text" class="form-control" id="lugarNacimiento"
                                                        name="a_o">
                                                </div>
                                                <div class="form-group col-md-4">
                                                    <label for="inputAddress2">Antecedentes Personales</label>
                                                    <input type="text" class="form-control" id="inputAddress2"
                                                        name="a_p">
                                                </div>
                                                <div class="form-group col-md-4">
                                                    <label for="inputAddress2">Antecedentes Familiares</label>
                                                    <input type="text" class="form-control" id="inputAddress2"
                                                        name="a_f">
                                                </div>
                                            </div>
                                            <div class="form-row mb-4">
                                                <div class="form-group col-md-12">
                                                    <label for="medicamentos">Medicamentos</label>
                                                    <input type="text" class="form-control" id="medicamentos"
                                                        name="medicamentos">
                                                </div>
                                            </div>
                                            <div class="form-row mb-4">
                                                <div class="form-group col-md-12">
                                                    <label for="tratamientos">Tratamientos anteriores</label>
                                                    <input type="text" class="form-control" id="tratamientos"
                                                        name="tratamientos">
                                                </div>
                                            </div>
                                            <div class="form-row mb-4">
                                                <div class="form-group col-md-12">
                                                    <label for="tratamientos">Desarrollo del infante</label>
                                                    <input type="text" class="form-control" id="tratamientos"
                                                        name="desarrollo_infante">
                                                </div>
                                            </div>

                                            <div class="form-row mb-4">
                                                <div class="form-group col-md-3">
                                                    <label for="tratamientos">Nacimiento</label>
                                                    <input type="text" class="form-control" id="nacimiento"
                                                        name="nacimiento">
                                                </div>
                                                <div class="form-group col-md-3">
                                                    <label for="tratamientos">Parto</label>
                                                    <input type="text" class="form-control" id="parto"
                                                        name="parto">
                                                </div>
                                                <div class="form-group col-md-3">
                                                    <label for="tratamientos">Incubadora</label>
                                                    <input type="text" class="form-control" id="incubadora"
                                                        name="incubadora">
                                                </div>
                                                <div class="form-group col-md-3">
                                                    <label for="tratamientos">Tiempo</label>
                                                    <input type="text" class="form-control" id="tiempo"
                                                        name="tiempo">
                                                </div>
                                            </div>



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
                                                                            name="av/sc_od_vl">
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" class="form-control"
                                                                            name="av/sc_oi_vl">
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="text-center">VP</td>
                                                                    <td>
                                                                        <input type="text" class="form-control"
                                                                            name="av/sc_od_vp">
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" class="form-control"
                                                                            name="av/sc_oi_vp">
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="text-center">PH</td>
                                                                    <td>
                                                                        <input type="text" class="form-control"
                                                                            name="av/sc_od_ph">
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" class="form-control"
                                                                            name="av/sc_oi_ph">
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
                                                                            name="av/cc_od_vl">
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" class="form-control"
                                                                            name="av/cc_oi_vl">
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="text-center">VP</td>
                                                                    <td>
                                                                        <input type="text" class="form-control"
                                                                            name="av/cc_od_vp">
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" class="form-control"
                                                                            name="av/cc_oi_vp">
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="text-center">PH</td>
                                                                    <td>
                                                                        <input type="text" class="form-control"
                                                                            name="av/cc_od_ph">
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" class="form-control"
                                                                            name="av/cc_oi_ph">
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <h5>RECETA EN USO</h5>
                                                <div class="table-responsive">
                                                    <table class="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th class="text-center">RX</th>
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
                                                                        name="esfera_od" placeholder="esfera_od">
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="form-control"
                                                                        name="cilindro_od" placeholder="cilindro_od">
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="form-control"
                                                                        name="eje_od" placeholder="eje_od">
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="form-control"
                                                                        name="p_base_od" placeholder="△">
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="form-control"
                                                                        name="add_od" placeholder="add_od">
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="text-center">Ojo Izquierdo</td>
                                                                <td>
                                                                    <input type="text" class="form-control"
                                                                        name="esfera_oi" placeholder="esfera_oi">
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="form-control"
                                                                        name="cilindro_oi" placeholder="cilindro_oi">
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="form-control"
                                                                        name="eje_oi" placeholder="eje_oi">
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="form-control"
                                                                        name="p_base_oi" placeholder="△">
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="form-control"
                                                                        name="add_oi" placeholder="add_oi">
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
                                                        name="len_tipo_lentes" placeholder="len_tipo_lentes">
                                                </div>
                                                <div class="form-group col-md-3">
                                                    <label for="objetivos">Filtros</label>
                                                    <input type="text" class="form-control" name="len_filtros"
                                                        placeholder="len_filtros">
                                                </div>
                                                <div class="form-group col-md-3">
                                                    <label for="objetivos">Tiempo</label>
                                                    <input type="text" class="form-control" name="len_tiempo"
                                                        placeholder="len_tiempo">
                                                </div>
                                                <div class="form-group col-md-3">
                                                    <label for="objetivos">Tipo de Aro</label>
                                                    <input type="text" class="form-control" name="len_tipo_arco"
                                                        placeholder="len_tipo_arco">
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
                                                    <input type="text" class="form-control" name="sa_od">
                                                </div>
                                                <div class="form-group col-md-3">
                                                    <input type="text" class="form-control" name="pp_od">
                                                </div>
                                            </div>
                                            <div class="form-row mb-4">
                                                <div class="form-group col-md-3">
                                                    <input type="text" class="form-control" name="sa_oi">
                                                </div>
                                                <div class="form-group col-md-3">
                                                    <input type="text" class="form-control" name="pp_oi">
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-6">
                                            <label for="tratamientos">Hirschberg</label>
                                            <input type="text" class="form-control" id="hirschberg"
                                                name="hirschberg">
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label for="tratamientos">Krismsky</label>
                                            <input type="text" class="form-control" id="krismsky"
                                                name="krismsky">
                                        </div>
                                    </div>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-12">
                                            <label for="inputAddress">VERSIONES:</label>
                                            <textarea id="textarea" class="form-control textarea" maxlength="800" rows="5"
                                                name="plan_versiones"></textarea>
                                        </div>
                                    </div>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-4">
                                            <label for="VL">COVER TEST: VISION LEJANA:</label>
                                            <input type="text" class="form-control" id="VL"
                                                name="ct_vl">
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="VP">VISION PROXIMA</label>
                                            <input type="text" class="form-control" id="VP"
                                                name="ct_vp">
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="maddox">MADDOX:</label>
                                            <input type="text" class="form-control" id="maddox"
                                                name="maddox">
                                        </div>
                                    </div>

                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-6">
                                            <label for="tratamientos">Seguimiento Visual(AO): </label>
                                            <input type="text" class="form-control" id="ao"
                                                name="seguimiento_ao">
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label for="tratamientos">Sacádicos(AO): </label>
                                            <input type="text" class="form-control" id="ao"
                                                name="sacadicos_ao">
                                        </div>
                                    </div>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-2">
                                            <label for="tratamientos">PPC: OR </label>
                                            <input type="text" class="form-control" id="or"
                                                name="ppc_or">
                                        </div>
                                        <div class="form-group col-md-2">
                                            <label for="tratamientos">L: </label>
                                            <input type="text" class="form-control" id="L"
                                                name="ppc_l">
                                        </div>
                                        <div class="form-group col-md-2">
                                            <label for="tratamientos">FR: </label>
                                            <input type="text" class="form-control" id="FR"
                                                name="ppc_fr">
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label for="tratamientos">Posicion compensatoria: </label>
                                            <input type="text" class="form-control" id="Posicion"
                                                name="ppc_posicion">
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
                                                <tr>
                                                    <td class="text-center">Bagolinni</td>
                                                    <td>
                                                        <input type="text" class="form-control" name="vl_bg"
                                                        placeholder="vl_bg">
                                                    </td>
                                                    <td>
                                                        <input type="text" class="form-control" name="vp_bg"
                                                        placeholder="vp_bg">
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-3">
                                            <h5 class="text-center">Estereopsis</h5>

                                        </div>
                                        <div class="form-group col-md-3">
                                            <label for="inputAddress">Randot:</label>
                                            <input type="text" class="form-control" id="inputAddress"
                                                name="randot">
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label for="inputAddress">Lang:</label>
                                            <input type="text" class="form-control" id="inputAddress"
                                                name="lang">
                                        </div>
                                    </div>

                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-12">
                                            <label for="inputAddress">Visión de Color</label>
                                            <input type="text" class="form-control" id="inputAddress"
                                                name="vision_color">
                                        </div>
                                    </div>

                                    <!-- RECETA FINAL -->
                                    <div class="form-group">
                                        <h5>RECETA FINAL</h5>
                                        <div class="table-responsive">
                                            <table class="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th class="text-center">RX</th>
                                                        <th>ESFERA</th>
                                                        <th>CILINDRO</th>
                                                        <th>EJE</th>
                                                        <th>P/BASE △</th>
                                                        <th>ADD</th>
                                                        <th>AGUDEZA VISUAL</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td class="text-center">Ojo Derecho</td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                name="esfera_od_f" placeholder="esfera_od">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                name="cilindro_od_f" placeholder="cilindro_od">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                name="eje_od_f" placeholder="eje_od">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                name="p_base_od_f" placeholder="△">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                name="add_od_f" placeholder="add_od">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                name="agz_od_f" placeholder="agz_od_f">
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="text-center">Ojo Izquierdo</td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                name="esfera_oi_f" placeholder="esfera_oi">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                name="cilindro_oi_f" placeholder="cilindro_oi">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                name="eje_oi_f" placeholder="eje_oi">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                name="p_base_oi_f" placeholder="△">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                name="add_oi_f" placeholder="add_oi">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                name="agz_oi_f" placeholder="agz_oi_f">
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
                                                name="lente_marca_1">
                                        </div>
                                        <div class="form-group col-md-2">
                                            <label for="inputAddress">PD</label>
                                            <input type="text" class="form-control" id="inputAddress"
                                                name="lente_pd_1">
                                        </div>
                                        <div class="form-group col-md-2">
                                            <label for="inputAddress">DPN</label>
                                            <input type="text" class="form-control" id="inputAddress"
                                                name="lente_dpn_1">
                                        </div>
                                        <div class="form-group col-md-2">
                                            <label for="inputAddress">ALTURA</label>
                                            <input type="text" class="form-control" id="inputAddress"
                                                name="lente_altura_1">
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <h5>Lente de Contacto</h5>
                                        <div class="table-responsive">
                                            <table class="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>PARAMETROS</th>
                                                        <th class="text-center">OJO DERECHO</th>
                                                        <th class="text-center">OJO IZQUIERDO</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td class="text-center">PODER</td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                name="poder_od" placeholder="poder_od">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                name="poder_oi" placeholder="poder_oi">
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="text-center">C.B</td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                name="cb_od" placeholder="cb_od">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                name="cb_oi" placeholder="cb_oi">
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="text-center">DIA</td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                name="dia_od" placeholder="dia_od">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control"
                                                                name="dia_oi" placeholder="dia_oi">
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-6">
                                            <label for="inputAddress">Marca</label>
                                            <input type="text" class="form-control" id="inputAddress"
                                                name="lente_marca">
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label for="inputAddress">Tipo:</label>
                                            <input type="text" class="form-control" id="inputAddress"
                                                name="lente_tipo">
                                        </div>
                                    </div>
                                    <div class="form-row mb-4">
                                        <div class="form-group col-md-12">
                                            <label for="inputAddress">CONDUCTA A SEGUIR:</label>
                                            <textarea id="textarea" class="form-control textarea" maxlength="800" rows="5"
                                                name="conducta_seguir"></textarea>
                                        </div>
                                    </div>
                                    <input type="hidden" name="crear_optometria_pediatrica" value="crear">
                                    <input type="hidden" name="doctor" value="Administrador">
                                    <input type="hidden" name="id_terapia" value="0">

                                    <button type="submit" class="btn btn-success mt-3 btn-crear-paciente">
                                        <div class="txt-btn-crear">Crear Consulta</div>
                                        <div class="spinner-border no-mostrar-btn" role="status">
                                            <span class="sr-only"> Loading...</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            @include('partials.footer')
        </div>
@endsection
