<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no">
    <title>Centro de Terapia y Rehabilitación Visual</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('img/fav.png') }}" />
    <link href="{{ asset('assets/css/loader.css') }}" rel="stylesheet" type="text/css" />

    <!-- BEGIN GLOBAL MANDATORY STYLES -->
    <link href="https://fonts.googleapis.com/css?family=Quicksand:400,500,600,700&display=swap" rel="stylesheet">
    <link href="{{ asset('assets/css/historiaclinica/historiaclinica.css') }}" rel="stylesheet" type="text/css" class="structure" />
    <link href="{{ asset('assets/css/optometriapediatrica/optometriapediatrica.css') }}" rel="stylesheet" type="text/css" class="structure" />
    <link href="{{ asset('assets/css/optometrianeonatos/optometrianeonatos.css') }}" rel="stylesheet" type="text/css" class="structure" />
    <link href="{{ asset('bootstrap/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('bootstrap/css/bootstrap.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/plugins.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/structure.css') }}" rel="stylesheet" type="text/css" class="structure" />
    <link href="{{ asset('assets/css/usuarios/usuarios.css') }}" rel="stylesheet" type="text/css" class="structure" />
    <link href="{{ asset('assets/css/sucursales/sucursales.css') }}" rel="stylesheet" type="text/css" class="structure" />
    <link href="{{ asset('assets/css/bajavision/bajavision.css') }}" rel="stylesheet" type="text/css" class="structure" />
    <link href="{{ asset('assets/css/optometrianeonatos/optometrianeonatos.css') }}" rel="stylesheet" type="text/css" class="structure" />
    <link href="{{ asset('assets/css/optometriapediatrica/optometriapediatrica.css') }}" rel="stylesheet" type="text/css" class="structure" />
    <link href="{{ asset('assets/css/historiaclinica/historiaclinica.css') }}" rel="stylesheet" type="text/css" class="structure" />
    <link rel="stylesheet" type="text/css" href="{{ asset('plugins/table/datatable/datatables.css')}}">
    <link href="{{ asset('assets/css/consultas/optometriaGeneral.css') }}" rel="stylesheet" type="text/css" class="structure" />
    <link href="{{ asset('assets/css/consultas/optometriaGeneral.css') }}" rel="stylesheet" type="text/css" class="structure" />
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/components/cards/card.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('plugins/table/datatable/dt-global_style.css')}}">
    <link rel="stylesheet" type="text/css" href="{{ asset('plugins/select2/select2.min.css')}}">
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/tables/table-basic.css')}}">
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/widgets/modules-widgets.css')}}">
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/forms/theme-checkbox-radio.css')}}">

    <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/apps/contacts.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/apps/invoice-add.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/apps/invoice-edit.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/apps/invoice-list.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/apps/invoice-preview.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/apps/mailing-chat.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/apps/notes.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/apps/scrumboard.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/apps/todolist.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/forms/theme-checkbox-radio.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/Paciente/crearPaciente.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/home/home.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/forms/switches.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/widgets/modules-widgets.css') }}">
    <link href="{{ asset('assets/css/components/custom-sweetalert.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/dashboard/dash_1.css') }}" rel="stylesheet" type="text/css" class="dashboard-analytics">
    <link href="{{ asset('assets/css/authentication/form-1.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/sucursales/sucursales.css') }}" rel="stylesheet" type="text/css" class="structure" />
    <link href="{{ asset('assets/css/bajavision/bajavision.css') }}" rel="stylesheet" type="text/css" class="structure" />
    <!-- END GLOBAL MANDATORY STYLES -->
    <!-- BEGIN PAGE LEVEL PLUGINS/CUSTOM STYLES -->
    <link href="{{ asset('plugins/apex/apexcharts.css') }}" rel="stylesheet" type="text/css">
    <link href="{{ asset('assets/css/dashboard/dash_1.css') }}" rel="stylesheet" type="text/css" class="dashboard-analytics">
    <link rel="stylesheet" type="text/css" href="{{ asset('plugins/table/datatable/custom_dt_html5.css')}}">
    <link rel="stylesheet" type="text/css" href="{{ asset('plugins/table/datatable/dt-global_style.css')}}">
    <link rel="stylesheet" type="text/css" href="{{ asset('plugins/table/datatable/datatables.css')}}">
    <link href="{{ asset('plugins/sweetalerts/sweetalert2.min.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('plugins/sweetalerts/sweetalert.css') }}" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" type="text/css" href="{{ asset('plugins/table/datatable/custom_dt_miscellaneous.css')}}">
    <link rel="stylesheet" type="text/css" href="{{ asset('plugins/table/datatable/custom_dt_custom.css')}}">
    <link rel="stylesheet" type="text/css" href="{{ asset('plugins/file-upload/file-upload-with-preview.min.css')}}">
    <!-- END PAGE LEVEL PLUGINS/CUSTOM STYLES -->
</head>

<body className="dashboard-analytics admin-header" >
    <div id="load_screen">
        <div className="loader">
            <div className="loader-content">
                <div className="spinner-grow align-self-center"></div>
            </div>
        </div>
    </div>
    <div id="app"></div>
    <script src="{{ mix('js/app.js') }}"></script>
    <script src="{{ asset('js/usuarios.js') }}"></script>
    <script src="{{ asset('js/redireccion.js') }}"></script>
    <script src="{{ asset('assets/js/loader.js') }}"></script>
    <!-- END GLOBAL MANDATORY SCRIPTS -->
    
    <!-- BEGIN GLOBAL MANDATORY SCRIPTS -->
    <script src="{{ asset('assets/js/libs/jquery-3.1.1.min.js') }}"></script>
    <script src="{{ asset('bootstrap/js/popper.min.js') }}"></script>
    <script src="{{ asset('bootstrap/js/bootstrap.min.js') }}"></script>
    <script src="{{ asset('assets/js/app.js') }}"></script>
    <script src="{{ asset('public/plugins/table/datatable/datatables.js') }}"></script>
    <script src="{{ asset('public/js/sucursales/sucursales.js') }}"></script>
    <script src="{{ asset('public/js/sucursales.js') }}"></script>
    <script src="{{ asset('public/js/usuarios/usuarios.js') }}"></script>
    <script src="{{ asset('assets/js/dashboard/dash_1.js') }}"></script>
    <script src="{{ asset('assets/js/custom.js') }}"></script>
    <script src="{{ asset('assets/js/usuarios/usuarios.js') }}"></script>
    <script src="{{ asset('assets/js/sucursales/sucursales.js') }}"></script>
    <script src="{{ asset('assets/js/paciente/crearPaciente.js') }}"></script>
    <script src="{{ asset('assets/js/paciente/editarPaciente.js') }}"></script>
    <script src="{{ asset('assets/js/paciente/verPaciente.js') }}"></script>
    <script src="{{ asset('assets/js/paciente/eliminarPaciente.js') }}"></script>
    <script src="{{ asset('plugins/select2/select2.min.js') }}"></script>
    <script src="{{ asset('plugins/select2/custom-select2.js') }}"></script>
    <script src="{{ asset('plugins/bootstrap-maxlength/bootstrap-maxlength.js') }}"></script>
    <script src="{{ asset('public/js/optometrianeonatos/optometrianeonatos.js') }}"></script>
    <script src="{{ asset('public/js/optometriapediatrica/optometriapediatrica.js') }}"></script>
    <script src="{{ asset('public/js/bajavision/bajavision.js') }}"></script>
    <script src="{{ asset('public/js/historiaclinica/historiaclinica.js') }}"></script>
    <script>
        $(document).ready(function() {
            App.init();
        });
    </script>
    <!-- END GLOBAL MANDATORY SCRIPTS -->

    <!-- BEGIN PAGE LEVEL PLUGINS/CUSTOM SCRIPTS -->
    <script src="{{ asset('plugins/apex/apexcharts.min.js') }}"></script>
    <script src="{{ asset('plugins/sweetalerts/sweetalert2.min.js') }}"></script>
    <script src="{{ asset('plugins/sweetalerts/custom-sweetalert.js') }}"></script>
    <script src="{{ asset('plugins/apex/apexcharts.js') }}"></script>
    <script src="{{ asset('plugins/perfect-scrollbar/perfect-scrollbar.min.js') }}"></script>
    <script src="{{ asset('assets/js/authentication/form-1.js') }}"></script>
    <!-- BEGIN PAGE LEVEL PLUGINS/CUSTOM SCRIPTS -->
</body>

</html>