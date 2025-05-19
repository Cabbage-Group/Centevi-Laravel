@extends('partials.sidebar')
@section('content')
<link rel="stylesheet" type="text/css" href="{{ asset('assets/css/consultas/ortopticaVisionBinocul.css') }}">
<div class="admin-data-content" style="margin-top:50px;" data-select2-id="12">
    <div class="row layout-top-spacing" data-select2-id="11">
        <div class="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing" data-select2-id="10">
            <div class="widget-content-area br-4" data-select2-id="9">
                <div class="widget-one" data-select2-id="8">
                    <div class="row" data-select2-id="7">
                        <div id="flFormsGrid" class="col-lg-12 layout-spacing" data-select2-id="flFormsGrid">
                            <div class="statbox widget box box-shadow" data-select2-id="6">
                                <div class="widget-header">
                                    <div class="row">
                                        <div class="col-xl-12 col-md-12 col-sm-12 col-12">
                                            <h3 class="text-center">Consulta de Ortóptica</h3>
                                        </div>
                                    </div>
                                </div>
                                <div class="widget-content widget-content-area">
                                    <form role="form" method="post" data-select2-id="5">
                                        <div class="form-row mb-4">
                                            <div class="form-group col-md-12">
                                                <label for="inputEmail4">Pacientes</label>
                                                <select class="form-control form-small select2-hidden-accessible"
                                                    name="paciente" data-select2-id="1" tabindex="-1"
                                                    aria-hidden="true">
                                                    <option value="" data-select2-id="3">Seleccione el paciente</option>
                                                    <option value="22" data-fecha-nacimiento="2018-08-21"
                                                        data-select2-id="19"> Número Cedula: 8-1219-383 || Nombres:
                                                        Danna Lucia Gonzalez Quiros</option>
                                                    <option value="23" data-fecha-nacimiento="2016-09-22"
                                                        data-select2-id="20"> Número Cedula: 4-882-127 || Nombres: Amber
                                                        Lizeth Martinez Moreno</option>
                                                    <option value="24" data-fecha-nacimiento="2013-06-28"
                                                        data-select2-id="21"> Número Cedula: 4-867-2164 || Nombres:
                                                        Jenna Nicolle Martinez Moreno</option>
                                                    <option value="26" data-fecha-nacimiento="2011-11-22"
                                                        data-select2-id="22"> Número Cedula: 8-1118-185 || Nombres:
                                                        Ambar Julieta Quintero Xatruch</option>
                                                    <option value="27" data-fecha-nacimiento="2011-07-25"
                                                        data-select2-id="23"> Número Cedula: 0000 || Nombres: Noa Stella
                                                        Edde Sasson</option>
                                                    <option value="28" data-fecha-nacimiento="2012-07-08"
                                                        data-select2-id="24"> Número Cedula: 8-1128-323 || Nombres:
                                                        Daniel Antonio Halphen Tapia</option>
                                                    <option value="29" data-fecha-nacimiento="2013-04-09"
                                                        data-select2-id="25"> Número Cedula: 8-1140-1390 || Nombres:
                                                        Salomon Dayan Yedid</option>
                                                    <option value="32" data-fecha-nacimiento="1965-08-24"
                                                        data-select2-id="26"> Número Cedula: N-17-806 || Nombres: Laura
                                                        Fernández Refincor</option>
                                                    <option value="33" data-fecha-nacimiento="2005-12-07"
                                                        data-select2-id="27"> Número Cedula: 8-1029-2242 || Nombres:
                                                        Luis Fernando Palomo Chan</option>
                                                    <option value="35" data-fecha-nacimiento="2014-04-09"
                                                        data-select2-id="28"> Número Cedula: 8-1156-1202 || Nombres:
                                                        Jiam Carlos Tam Beitia</option>
                                                    <option value="36" data-fecha-nacimiento="2016-11-07"
                                                        data-select2-id="29"> Número Cedula: 8-1196-30 || Nombres: Luca
                                                        Josiah Shacklett Arias</option>
                                                    <option value="37" data-fecha-nacimiento="2011-02-18"
                                                        data-select2-id="30"> Número Cedula: 064999726 || Nombres:
                                                        Gabriela Saray Flores Chavez</option>
                                                    <option value="38" data-fecha-nacimiento="2004-01-30"
                                                        data-select2-id="31"> Número Cedula: 3-753-1045 || Nombres:
                                                        Victor Adrian Miller Rodriguez</option>
                                                    <option value="39" data-fecha-nacimiento="2021-08-31"
                                                        data-select2-id="32"> Número Cedula: 8-1253-2353 || Nombres:
                                                        Theo Orozco Calderin</option>
                                                    <option value="40" data-fecha-nacimiento="2014-07-14"
                                                        data-select2-id="33"> Número Cedula: 9-783-2092 || Nombres:
                                                        Isabel Lunadys Núñez Batista </option>
                                                    <option value="41" data-fecha-nacimiento="2012-12-30"
                                                        data-select2-id="34"> Número Cedula: 8-1135-2150 || Nombres:
                                                        Leonardo Alarcon Martinez</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="form-row mb-12">
                                            <div class="form-group col-md-6">
                                                <label for="inputSucursal">Sucursal</label>
                                                <select required="" class="form-control" id="sucursal" name="sucursal">
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
                                                <input type="text" class="form-control" id="edad" name="edad"
                                                    readonly="">
                                            </div>
                                            <div class="form-group col-md-3">
                                                <label for="inputAddress">Fecha de atencion</label>
                                                <input type="date" required="" class="form-control" id="inputAddress"
                                                    name="fecha_atencion" max="2024-07-05">
                                            </div>
                                        </div>
                                        <div class="form-row mb-4">
                                            <div class="form-group col-md-12">
                                                <label for="inputAddress">Motivo de Consulta:</label>
                                                <textarea id="textarea" class="form-control textarea" maxlength="10000"
                                                    rows="15" placeholder="" name="m_c"></textarea>
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
                                                <input type="text" class="form-control" id="medicamentos" placeholder=""
                                                    name="medicamentos">
                                            </div>
                                        </div>
                                        <div class="form-row mb-4">
                                            <div class="form-group col-md-12">
                                                <label for="tratamientos">Tratamientos anteriores</label>
                                                <input type="text" class="form-control" id="tratamientos" placeholder=""
                                                    name="tratamientos">
                                            </div>
                                        </div>
                                        <h5>AGUDEZA VISUAL</h5>
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
                                                                        placeholder="" name="av/sc_od_vl">
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="form-control"
                                                                        placeholder="" name="av/sc_oi_vl">
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="text-center">VP</td>
                                                                <td>
                                                                    <input type="text" class="form-control"
                                                                        placeholder="" name="av/sc_od_vp">
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="form-control"
                                                                        placeholder="" name="av/sc_oi_vp">
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="text-center">PH</td>
                                                                <td>
                                                                    <input type="text" class="form-control"
                                                                        placeholder="" name="av/sc_od_ph">
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="form-control"
                                                                        placeholder="" name="av/sc_oi_ph">
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
                                                                        placeholder="" name="av/cc_od_vl">
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="form-control"
                                                                        placeholder="" name="av/cc_oi_vl">
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="text-center">VP</td>
                                                                <td>
                                                                    <input type="text" class="form-control"
                                                                        placeholder="" name="av/cc_od_vp">
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="form-control"
                                                                        placeholder="" name="av/cc_oi_vp">
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="text-center">PH</td>
                                                                <td>
                                                                    <input type="text" class="form-control"
                                                                        placeholder="" name="av/cc_od_ph">
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="form-control"
                                                                        placeholder="" name="av/cc_oi_ph">
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <h5>LENSOMETRIA</h5>
                                            <div class="table-responsive">
                                                <table class="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th class="text-center">RX EN USO</th>
                                                            <th>ESFERA</th>
                                                            <th>CILINDRO</th>
                                                            <th>EJE</th>
                                                            <th>P/BASE △</th>
                                                            <th>ADD</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td class="text-center">OD</td>
                                                            <td>
                                                                <input type="text" class="form-control" placeholder=""
                                                                    name="esfera_od">
                                                            </td>
                                                            <td>
                                                                <input type="text" class="form-control" placeholder=""
                                                                    name="cilindro_od">
                                                            </td>
                                                            <td>
                                                                <input type="text" class="form-control" placeholder=""
                                                                    name="eje_od">
                                                            </td>
                                                            <td>
                                                                <input type="text" class="form-control" placeholder="△"
                                                                    name="p_base_od">
                                                            </td>
                                                            <td>
                                                                <input type="text" class="form-control" placeholder=""
                                                                    name="add_od">
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-center">OI</td>
                                                            <td>
                                                                <input type="text" class="form-control" placeholder=""
                                                                    name="esfera_oi">
                                                            </td>
                                                            <td>
                                                                <input type="text" class="form-control" placeholder=""
                                                                    name="cilindro_oi">
                                                            </td>
                                                            <td>
                                                                <input type="text" class="form-control" placeholder=""
                                                                    name="eje_oi">
                                                            </td>
                                                            <td>
                                                                <input type="text" class="form-control" placeholder="△"
                                                                    name="p_base_oi">
                                                            </td>
                                                            <td>
                                                                <input type="text" class="form-control" placeholder=""
                                                                    name="add_oi">
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
                                                <input type="text" class="form-control" name="len_tipo_arco">
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
                                                <input type="text" class="form-control" placeholder="" name="sa_od">
                                            </div>
                                            <div class="form-group col-md-3">
                                                <input type="text" class="form-control" placeholder="" name="pp_od">
                                            </div>
                                        </div>
                                        <div class="form-row mb-4">
                                            <div class="form-group col-md-3">
                                                <input type="text" class="form-control" placeholder="" name="sa_oi">
                                            </div>
                                            <div class="form-group col-md-3">
                                                <input type="text" class="form-control" placeholder="" name="pp_oi">
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <h6>VISUSCOPIA:</h6>
                                <div class="form-row mb-4">
                                    <div class="form-group col-md-6">
                                        <label for="v_od">OD</label>
                                        <input type="text" class="form-control" id="v_od" placeholder=""
                                            name="viscopia_od">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="v_oi">OI</label>
                                        <input type="text" class="form-control" id="v_oi" placeholder=""
                                            name="viscopia_oi">
                                    </div>
                                </div>
                                <div class="form-row mb-4">
                                    <div class="form-group col-md-6">
                                        <label for="tratamientos">Hirschberg</label>
                                        <input type="text" class="form-control" id="hirschberg" placeholder=""
                                            name="hirschberg">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="tratamientos">Krismsky</label>
                                        <input type="text" class="form-control" id="krismsky" placeholder=""
                                            name="krismsky">
                                    </div>
                                </div>
                                <div class="form-row mb-4">
                                    <div class="form-group col-md-12">
                                        <label for="inputAddress">VERSIONES:</label>
                                        <textarea id="textarea" class="form-control textarea" maxlength="10000"
                                            rows="15" placeholder="" name="plan_versiones"></textarea>
                                    </div>
                                </div>
                                <div class="form-row mb-4">
                                    <div class="form-group col-md-4">
                                        <label for="VL">COVER TEST: VL:</label>
                                        <input type="text" class="form-control" id="VL" placeholder="" name="ct_vl">
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label for="VP">VP</label>
                                        <input type="text" class="form-control" id="VP" placeholder="" name="ct_vp">
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label for="maddox">MADDOX:</label>
                                        <input type="text" class="form-control" id="maddox" placeholder=""
                                            name="maddox">
                                    </div>
                                </div>
                                <div class="form-row mb-4">
                                    <div class="form-group col-md-6">
                                        <label for="tratamientos">Seguimiento Visual(AO): </label>
                                        <input type="text" class="form-control" id="seguimiento" placeholder=""
                                            name="seguimiento_ao">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="tratamientos">Sacádicos(AO): </label>
                                        <input type="text" class="form-control" id="sacadicos" placeholder=""
                                            name="sacadicos_ao">
                                    </div>
                                </div>
                                <div class="form-row mb-4">
                                    <div class="form-group col-md-2">
                                        <label for="tratamientos">PPC: OR </label>
                                        <input type="text" class="form-control" id="ppc_or" placeholder=""
                                            name="ppc_or">
                                    </div>
                                    <div class="form-group col-md-2">
                                        <label for="tratamientos">L: </label>
                                        <input type="text" class="form-control" id="ppc_l" placeholder="" name="ppc_l">
                                    </div>
                                    <div class="form-group col-md-2">
                                        <label for="tratamientos">FR: </label>
                                        <input type="text" class="form-control" id="ppc_fr" placeholder=""
                                            name="ppc_fr">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="tratamientos">Posicion compensatoria: </label>
                                        <input type="text" class="form-control" id="ppc_posicion" placeholder=""
                                            name="ppc_posicion">
                                    </div>
                                </div>
                                <div class="form-row mb-4">
                                    <div class="form-group col-md-6">
                                        <label for="tratamientos">TEST DE BIELSCHOWSKY</label>
                                        <input type="text" class="form-control" id="helshoswky" placeholder=""
                                            name="helshoswky">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="tratamientos">VON GRAEFE</label>
                                        <input type="text" class="form-control" id="von_graefe" placeholder=""
                                            name="von_graefe">
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
                                                        placeholder="">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control" name="vp_luces"
                                                        placeholder="">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-center">Bagolinni</td>
                                                <td>
                                                    <input type="text" class="form-control" name="vl_bg" placeholder="">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control" name="vp_bg" placeholder="">
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
                                        <input type="text" class="form-control" id="inputAddress" placeholder=""
                                            name="randot">
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label for="inputAddress">Lang:</label>
                                        <input type="text" class="form-control" id="inputAddress" placeholder=""
                                            name="lang">
                                    </div>
                                </div>
                                <div class="form-row mb-4">
                                    <div class="form-group col-md-12">
                                        <label for="inputAddress">Visión de Color</label>
                                        <input type="text" class="form-control" id="inputAddress" placeholder=""
                                            name="vision_color">
                                    </div>
                                </div>
                                <h4>EVALUACION DE LA ACOMODACION</h4>
                                <div class="form-row mb-4">
                                    <div class="form-group col-md-3">
                                        <label for="inputAddress">A.A OD:</label>
                                        <input type="text" class="form-control" id="inputAddress" placeholder=""
                                            name="aa_od">
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label for="inputAddress">OI</label>
                                        <input type="text" class="form-control" id="inputAddress" placeholder=""
                                            name="aa_oi">
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label for="inputAddress">FAM: OD</label>
                                        <input type="text" class="form-control" id="inputAddress" placeholder=""
                                            name="fan_od">
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label for="inputAddress">OI</label>
                                        <input type="text" class="form-control" id="inputAddress" placeholder=""
                                            name="fan_cpm">
                                    </div>
                                </div>
                                <div class="form-row mb-4">
                                    <div class="form-group col-md-3">
                                        <label for="inputAddress">FAB</label>
                                        <input type="text" class="form-control" id="inputAddress" placeholder=""
                                            name="aco_oi">
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label for="inputAddress">MEM: OD</label>
                                        <input type="text" class="form-control" id="inputAddress" placeholder=""
                                            name="aco_cpm">
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label for="inputAddress">OI</label>
                                        <input type="text" class="form-control" id="inputAddress" placeholder=""
                                            name="acp_fab">
                                    </div>
                                </div>
                                <div class="form-row mb-4">
                                    <div class="form-group col-md-3">
                                        <label for="inputAddress">ARN</label>
                                        <input type="text" class="form-control" id="inputAddress" placeholder=""
                                            name="mem_arn">
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label for="inputAddress">ARP</label>
                                        <input type="text" class="form-control" id="inputAddress" placeholder=""
                                            name="mem_arp">
                                    </div>
                                </div>
                                <h4>EVALUACION DE LAS VERGENCIAS</h4>
                                <div class="form-row mb-4">
                                    <div class="form-group col-md-3">
                                        <label for="inputAddress">BT/VL</label>
                                        <input type="text" class="form-control" id="inputAddress" placeholder=""
                                            name="v_vt_vl">
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label for="inputAddress">BT/VP</label>
                                        <input type="text" class="form-control" id="inputAddress" placeholder=""
                                            name="v_bt_vp">
                                    </div>
                                </div>
                                <div class="form-row mb-4">
                                    <div class="form-group col-md-3">
                                        <label for="inputAddress">BN/VL</label>
                                        <input type="text" class="form-control" id="inputAddress" placeholder=""
                                            name="v_bn_vl">
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label for="inputAddress">BN/VP</label>
                                        <input type="text" class="form-control" id="inputAddress" placeholder=""
                                            name="v_bn_vp">
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
                                                    <th>AGUDEZA VISUAL</th>
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
                                                    <td>
                                                        <input type="text" class="form-control" placeholder=""
                                                            name="agz_od_f">
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
                                                    <td>
                                                        <input type="text" class="form-control" placeholder=""
                                                            name="agz_oi_f">
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="form-row mb-4">
                                    <div class="form-group col-md-6">
                                        <label for="inputAddress">TIPO DE LENTE</label>
                                        <input type="text" class="form-control" id="inputAddress" placeholder=""
                                            name="lente_marca_1">
                                    </div>
                                    <div class="form-group col-md-2">
                                        <label for="inputAddress">PD</label>
                                        <input type="text" class="form-control" id="inputAddress" placeholder=""
                                            name="lente_pd_1">
                                    </div>
                                    <div class="form-group col-md-2">
                                        <label for="inputAddress">DNP</label>
                                        <input type="text" class="form-control" id="inputAddress" placeholder=""
                                            name="lente_dnp_1">
                                    </div>
                                    <div class="form-group col-md-2">
                                        <label for="inputAddress">ALTURA</label>
                                        <input type="text" class="form-control" id="inputAddress" placeholder=""
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
                                                        <input type="text" class="form-control" placeholder=""
                                                            name="poder_od">
                                                    </td>
                                                    <td>
                                                        <input type="text" class="form-control" placeholder=""
                                                            name="poder_oi">
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="text-center">C.B</td>
                                                    <td>
                                                        <input type="text" class="form-control" placeholder=""
                                                            name="cb_od">
                                                    </td>
                                                    <td>
                                                        <input type="text" class="form-control" placeholder=""
                                                            name="cb_oi">
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="text-center">DIA</td>
                                                    <td>
                                                        <input type="text" class="form-control" placeholder=""
                                                            name="dia_od">
                                                    </td>
                                                    <td>
                                                        <input type="text" class="form-control" placeholder=""
                                                            name="dia_oi">
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="form-row mb-4">
                                    <div class="form-group col-md-6">
                                        <label for="inputAddress">MARCA</label>
                                        <input type="text" class="form-control" id="inputAddress" placeholder=""
                                            name="lente_marca">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="inputAddress">TIPO</label>
                                        <input type="text" class="form-control" id="inputAddress" placeholder=""
                                            name="lente_tipo">
                                    </div>
                                </div>
                                <div class="form-row mb-4">
                                    <div class="form-group col-md-12">
                                        <label for="inputAddress">CONDUCTA A SEGUIR:</label>
                                        <textarea id="textarea" class="form-control textarea" maxlength="10000"
                                            rows="15" placeholder="" name="conducta_seguir"></textarea>
                                    </div>
                                </div
                                <input type="hidden" name="crear_ortoptica_adultos" value="crear">
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
</div>
@endsection