@extends('partials.sidebar')
@section('content')

    <body>
        <head>
            <link href="{{ asset('assets/css/historiaclinica/historiaclinica.css') }}" rel="stylesheet" type="text/css"
                class="structure" />
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
                                            <div style="text-align: center;" class="col-xl-12 col-md-12 col-sm-12 col-12">
                                                <h3>Historia Clinica</h3>
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
                                                    </select><span
                                                        class="select2 select2-container mb-4 select2-container--default form-control-sm"
                                                        dir="ltr" data-select2-id="2"
                                                        style="width: 1128.89px;"><span class="selection"><span
                                                                class="select2-selection select2-selection--single"
                                                                role="combobox" aria-haspopup="true"
                                                                aria-expanded="false" tabindex="0"
                                                                aria-labelledby="select2-paciente-ln-container"><span
                                                                    class="select2-selection__rendered"
                                                                    id="select2-paciente-ln-container" role="textbox"
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
                                                    <label for="textarea">Motivo de Consulta:</label>
                                                    <textarea id="textarea" class="form-control textarea" maxlength="10000" rows="25" placeholder=""
                                                        name="m_c"></textarea>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                
                                <input type="hidden" name="crear_consulta_generica" value="crear">
                                <input type="hidden" name="doctor" value="Administrador">
                                <input type="hidden" name="id_terapia" value="0">
                                <button type="submit" class="btn btn-success mt-3 btn-crear-consulta-generica">
                                    <div class="txt-btn-crear">Crear Paciente</div>
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
    </body>
    @include('partials.footer')
@endsection
