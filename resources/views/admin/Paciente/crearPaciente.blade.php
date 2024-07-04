@extends('partials.sidebar')
@section('content')
<div class="admin-data-content" style="margin-top:50px;">
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
                                            <h4>CREAR PACIENTE</h4>
                                        </div>
                                    </div>
                                </div>
                                <div class="widget-content widget-content-area">
                                    <form role="form" method="post">
                                        <div class="form-row mb-4">
                                            <div class="form-group col-md-4">
                                                <label for="nombres">Nombres</label>
                                                <input type="text" class="form-control nombres" id="nombres" required=""
                                                    name="nombres">
                                            </div>
                                            <div class="form-group col-md-4">
                                                <label for="apellidos">Apellidos</label>
                                                <input type="text" class="form-control" id="apellidos" required=""
                                                    name="apellidos">
                                            </div>
                                            <div class="form-group col-md-4">
                                                <label for="email">Email</label>
                                                <input type="email" class="form-control" id="email" required=""
                                                    name="email">
                                            </div>
                                        </div>
                                        <div class="form-row mb-4">
                                            <div class="form-group col-md-3">
                                                <label for="nro_cedula">Nro.Cedula</label>
                                                <input type="text" class="form-control" id="nro_cedula"
                                                    name="nro_cedula">
                                            </div>
                                            <div class="form-group col-md-3">
                                                <label for="nro_seguro">Nro.Seguro Social</label>
                                                <input type="text" class="form-control" id="nro_seguro"
                                                    name="nro_seguro">
                                            </div>
                                            <div class="form-group col-md-3">
                                                <label>Fecha de Nacimiento</label>
                                                <input type="date" class="form-control" name="fecha_nacimiento">
                                            </div>
                                            <div class="form-group col-md-3">
                                                <label for="inputAddress">Genero</label>
                                                <input type="text" class="form-control" name="genero">
                                            </div>
                                        </div>
                                        <div class="form-row mb-4">
                                            <div class="form-group col-md-4">
                                                <label for="lugarNacimiento">Lugar de Nacimiento</label>
                                                <input type="text" class="form-control" id="lugarNacimiento"
                                                    name="lugar_nacimiento">
                                            </div>
                                            <div class="form-group col-md-8">
                                                <label for="inputAddress2">Direccion Residencial</label>
                                                <input type="text" class="form-control" id="inputAddress2"
                                                    name="direccion">
                                            </div>
                                        </div>
                                        <div class="form-row mb-4">
                                            <div class="form-group col-md-4">
                                                <label for="ocupacion">Ocupación</label>
                                                <input type="text" class="form-control" id="ocupacion" name="ocupacion"
                                                    required="">
                                            </div>
                                            <div class="form-group col-md-4">
                                                <label for="telefono">Teléfono de casa</label>
                                                <input type="text" class="form-control" id="telefono" name="telefono"
                                                    required="">
                                            </div>
                                            <div class="form-group col-md-4">
                                                <label for="celular">Número de celular</label>
                                                <input type="text" class="form-control" id="celular" name="celular"
                                                    required="">
                                            </div>
                                        </div>


                                        <div class="form-row mb-4">
                                            <div class="form-group col-md-6">
                                                <label for="medico">Medico de Cabecera</label>
                                                <input type="text" class="form-control" id="medico"
                                                    name="medico_cabecera">
                                            </div>
                                        </div>




                                        <div class="form-group">
                                            <h4>EN CASO DE URGENCIA</h4>
                                        </div>
                                        <div class="form-row mb-4">
                                            <div class="form-group col-md-4">
                                                <label for="responsable"> Por favor colocar el nombre</label>
                                                <input type="text" class="form-control" id="nombre" name="nombre_ur">
                                            </div>
                                            <div class="form-group col-md-4">
                                                <label for="parentesco"> Parentesco</label>
                                                <input type="text" class="form-control" id="parentesco_ur"
                                                    name="parentesco_ur">
                                            </div>
                                            <div class="form-group col-md-4">
                                                <label for="nro_celular_responsable"> Nro.Celular</label>
                                                <input type="text" class="form-control" id="numero_ur" name="nro_ur">
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <h4>MENOR DE EDAD</h4>
                                        </div>
                                        <div class="form-row mb-4">
                                            <div class="form-group col-md-6">
                                                <label for="responsable"> Por favor colocar el nombre del acudiente o
                                                    responsable</label>
                                                <input type="text" class="form-control" id="responsable"
                                                    name="responsable">
                                            </div>
                                            <div class="form-group col-md-6">
                                                <label for="parentesco"> Parentesco</label>
                                                <input type="text" class="form-control" id="parentesco"
                                                    name="parentesco">
                                            </div>
                                        </div>
                                        <div class="form-row mb-4">
                                            <div class="form-group col-md-6">
                                                <label for="nro_celular_responsable"> Nro.Celular</label>
                                                <input type="text" class="form-control" id="nro_celular_responsable"
                                                    name="nro_celular_responsable">
                                            </div>
                                            <div class="form-group col-md-4">
                                                <label for="urg_celular">Remitido Por </label>
                                                <input type="text" class="form-control" id="remitido" name="remitido">
                                            </div>
                                        </div>

                                        <input type="hidden" name="sucursal" value="3">
                                        <input type="hidden" name="doctor" value="Administrador">

                                        <div class="btn-crear-paciente" style=" width: 150px">
                                            <button type="submit" class="btn btn-success mt-3 btn-crear-paciente">
                                                <div class="txt-btn-crear">Crear Paciente</div>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    @include('partials.footer')
</div>
@endsection