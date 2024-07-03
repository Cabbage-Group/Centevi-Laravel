@extends('partials.sidebar')
@section('content')
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no">
    <title>Centro de Optica</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('img/favicon.ico') }}" />
    <link href="{{ asset('assets/css/loader.css') }}" rel="stylesheet" type="text/css" />
    <script src="{{ asset('assets/js/loader.js') }}"></script>
    <!-- BEGIN GLOBAL MANDATORY STYLES -->
    <link href="https://fonts.googleapis.com/css?family=Quicksand:400,500,600,700&display=swap" rel="stylesheet">
    <link href="{{ asset('bootstrap/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/plugins.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/structure.css') }}" rel="stylesheet" type="text/css" class="structure" />
    <link href="{{ asset('resources/css/admin/usuarios/usuarios.css') }}" rel="stylesheet" type="text/css" class="structure" /> 
    <link href="{{ asset('assets/css/authentication/form-1.css') }}" rel="stylesheet" type="text/css" />
    <!-- END GLOBAL MANDATORY STYLES -->
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/forms/theme-checkbox-radio.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/forms/switches.css') }}">
</head>


<body class="form">
<div class="widget-content-area br-4">
            <div class="widget-one">
            <div class="row layout-top-spacing" id="cancel-row">
                
                <div class="col-xl-12 col-lg-12 col-sm-12  layout-spacing">
                    <div class="widget-content widget-content-area br-6">
                       <button class="btn btn-success mt-3 ml-4" data-toggle="modal" data-target="#modalAgregarUsuario">
          
                         Agregar usuario

                        </button>

                        <div class="table-responsive">
                          <div id="zero-config_wrapper" class="dataTables_wrapper container-fluid dt-bootstrap4"><div class="dt--top-section"><div class="row"><div class="col-12 col-sm-6 d-flex justify-content-sm-start justify-content-center"><div class="dataTables_length" id="zero-config_length"><label>Results :  <select name="zero-config_length" aria-controls="zero-config" class="form-control"><option value="7">7</option><option value="10">10</option><option value="20">20</option><option value="50">50</option></select></label></div></div><div class="col-12 col-sm-6 d-flex justify-content-sm-end justify-content-center mt-sm-0 mt-3"><div id="zero-config_filter" class="dataTables_filter"><label><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg><input type="search" class="form-control" placeholder="Search..." aria-controls="zero-config"></label></div></div></div></div><div class="table-responsive"><table id="zero-config" class="table dt-table-hover tablas dataTable" style="width: 100%;" role="grid" aria-describedby="zero-config_info">
                          <thead>
                                        <tr role="row"><th style="width: 11px;" class="sorting_asc" tabindex="0" aria-controls="zero-config" rowspan="1" colspan="1" aria-sort="ascending" aria-label="#: activate to sort column descending">#</th><th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1" colspan="1" aria-label="Nombre: activate to sort column ascending" style="width: 156px;">Nombre</th><th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1" colspan="1" aria-label="Usuario: activate to sort column ascending" style="width: 64px;">Usuario</th><th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1" colspan="1" aria-label="Foto: activate to sort column ascending" style="width: 36px;">Foto</th><th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1" colspan="1" aria-label="Perfil: activate to sort column ascending" style="width: 117px;">Perfil</th><th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1" colspan="1" aria-label="Estado: activate to sort column ascending" style="width: 122px;">Estado</th><th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1" colspan="1" aria-label="Último login: activate to sort column ascending" style="width: 116px;">Último login</th><th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1" colspan="1" aria-label="Acciones: activate to sort column ascending" style="width: 104px;">Acciones</th></tr>
                           </thead>
                                    <tbody>

                                                                       
                                 
                                 <tr role="row">
                                           <td class="sorting_1">1</td>
                                           <td>Administrador</td>
                                           <td>admin</td><td><img src="vistas/img/usuarios/admin/912.jpg" class="img-thumbnail" width="40px"></td><td>superadministrador</td><td><button class="btn btn-success btn-xs btnActivar" idusuario="1" estadousuario="0">Activado</button></td><td>2024-07-03 13:06:03</td>
                                           <td>
                                 
                                             <div class="btn-group">
                                                 
                                               <button class="btn btn-warning btnEditarUsuario" idusuario="1" data-toggle="modal" data-target="#modalEditarUsuario"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                             </svg></button>
                                 
                                               <button class="btn btn-danger btnEliminarUsuario" idusuario="1" fotousuario="vistas/img/usuarios/admin/912.jpg" usuario="admin"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                             </svg></button>
                                 
                                             </div>  
                                 
                                           </td>
                                 
                                         </tr><tr role="row">
                                           <td class="sorting_1">2</td>
                                           <td>SuperAdmin</td>
                                           <td>superadmin</td><td><img src="vistas/img/usuarios/superadmin/249.jpg" class="img-thumbnail" width="40px"></td><td>superadministrador</td><td><button class="btn btn-success btn-xs btnActivar" idusuario="13" estadousuario="0">Activado</button></td><td>2024-06-24 12:51:14</td>
                                           <td>
                                 
                                             <div class="btn-group">
                                                 
                                               <button class="btn btn-warning btnEditarUsuario" idusuario="13" data-toggle="modal" data-target="#modalEditarUsuario"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                             </svg></button>
                                 
                                               <button class="btn btn-danger btnEliminarUsuario" idusuario="13" fotousuario="vistas/img/usuarios/superadmin/249.jpg" usuario="superadmin"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                             </svg></button>
                                 
                                             </div>  
                                 
                                           </td>
                                 
                                         </tr><tr role="row">
                                           <td class="sorting_1">3</td>
                                           <td>Laura Toro Yau</td>
                                           <td>ltoroyau</td><td><img src="vistas/img/usuarios/ltoroyau/116.jpg" class="img-thumbnail" width="40px"></td><td>superadministrador</td><td><button class="btn btn-success btn-xs btnActivar" idusuario="14" estadousuario="0">Activado</button></td><td>2024-06-06 10:41:25</td>
                                           <td>
                                 
                                             <div class="btn-group">
                                                 
                                               <button class="btn btn-warning btnEditarUsuario" idusuario="14" data-toggle="modal" data-target="#modalEditarUsuario"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                             </svg></button>
                                 
                                               <button class="btn btn-danger btnEliminarUsuario" idusuario="14" fotousuario="vistas/img/usuarios/ltoroyau/116.jpg" usuario="ltoroyau"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                             </svg></button>
                                 
                                             </div>  
                                 
                                           </td>
                                 
                                         </tr><tr role="row">
                                           <td class="sorting_1">4</td>
                                           <td>Xavier Vargas</td>
                                           <td>xvargas</td><td><img src="vistas/img/usuarios/xvargas/922.jpg" class="img-thumbnail" width="40px"></td><td>doctor</td><td><button class="btn btn-success btn-xs btnActivar" idusuario="15" estadousuario="0">Activado</button></td><td>2024-05-27 10:53:03</td>
                                           <td>
                                 
                                             <div class="btn-group">
                                                 
                                               <button class="btn btn-warning btnEditarUsuario" idusuario="15" data-toggle="modal" data-target="#modalEditarUsuario"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                             </svg></button>
                                 
                                               <button class="btn btn-danger btnEliminarUsuario" idusuario="15" fotousuario="vistas/img/usuarios/xvargas/922.jpg" usuario="xvargas"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                             </svg></button>
                                 
                                             </div>  
                                 
                                           </td>
                                 
                                         </tr><tr role="row">
                                           <td class="sorting_1">5</td>
                                           <td>Valerie Cole</td>
                                           <td>vcole</td><td><img src="vistas/img/usuarios/vcole/655.png" class="img-thumbnail" width="40px"></td><td>gestor</td><td><button class="btn btn-success btn-xs btnActivar" idusuario="21" estadousuario="0">Activado</button></td><td>2022-06-15 13:54:01</td>
                                           <td>
                                 
                                             <div class="btn-group">
                                                 
                                               <button class="btn btn-warning btnEditarUsuario" idusuario="21" data-toggle="modal" data-target="#modalEditarUsuario"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                             </svg></button>
                                 
                                               <button class="btn btn-danger btnEliminarUsuario" idusuario="21" fotousuario="vistas/img/usuarios/vcole/655.png" usuario="vcole"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                             </svg></button>
                                 
                                             </div>  
                                 
                                           </td>
                                 
                                         </tr><tr role="row">
                                           <td class="sorting_1">6</td>
                                           <td>Rosa Urdaneta</td>
                                           <td>rourdaneta</td><td><img src="vistas/img/usuarios/rourdaneta/837.jpg" class="img-thumbnail" width="40px"></td><td>gestor</td><td><button class="btn btn-success btn-xs btnActivar" idusuario="23" estadousuario="0">Activado</button></td><td>2023-05-10 10:35:04</td>
                                           <td>
                                 
                                             <div class="btn-group">
                                                 
                                               <button class="btn btn-warning btnEditarUsuario" idusuario="23" data-toggle="modal" data-target="#modalEditarUsuario"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                             </svg></button>
                                 
                                               <button class="btn btn-danger btnEliminarUsuario" idusuario="23" fotousuario="vistas/img/usuarios/rourdaneta/837.jpg" usuario="rourdaneta"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                             </svg></button>
                                 
                                             </div>  
                                 
                                           </td>
                                 
                                         </tr><tr role="row">
                                           <td class="sorting_1">7</td>
                                           <td>Jennifer Erinna</td>
                                           <td>jerinna</td><td><img src="vistas/img/usuarios/default/anonymous.png" class="img-thumbnail" width="40px"></td><td>gestor</td><td><button class="btn btn-success btn-xs btnActivar" idusuario="31" estadousuario="0">Activado</button></td><td>2024-05-14 09:26:45</td>
                                           <td>
                                 
                                             <div class="btn-group">
                                                 
                                               <button class="btn btn-warning btnEditarUsuario" idusuario="31" data-toggle="modal" data-target="#modalEditarUsuario"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                             </svg></button>
                                 
                                               <button class="btn btn-danger btnEliminarUsuario" idusuario="31" fotousuario="" usuario="jerinna"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                             </svg></button>
                                 
                                             </div>  
                                 
                                           </td>
                                 
                                         </tr></tbody>
                                 <tfoot>
                                  <tr><th style="width:10px" rowspan="1" colspan="1">#</th><th rowspan="1" colspan="1">Nombre</th><th rowspan="1" colspan="1">Usuario</th><th rowspan="1" colspan="1">Foto</th><th rowspan="1" colspan="1">Perfil</th><th rowspan="1" colspan="1">Estado</th><th rowspan="1" colspan="1">Último login</th><th rowspan="1" colspan="1">Acciones</th></tr>
                            </tfoot>
                        </table></div><div class="dt--bottom-section d-sm-flex justify-content-sm-between text-center"><div class="dt--pages-count  mb-sm-0 mb-3"><div class="dataTables_info" id="zero-config_info" role="status" aria-live="polite">Showing page 1 of 6</div></div><div class="dt--pagination"><div class="dataTables_paginate paging_simple_numbers" id="zero-config_paginate"><ul class="pagination"><li class="paginate_button page-item previous disabled" id="zero-config_previous"><a href="#" aria-controls="zero-config" data-dt-idx="0" tabindex="0" class="page-link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></a></li><li class="paginate_button page-item active"><a href="#" aria-controls="zero-config" data-dt-idx="1" tabindex="0" class="page-link">1</a></li><li class="paginate_button page-item "><a href="#" aria-controls="zero-config" data-dt-idx="2" tabindex="0" class="page-link">2</a></li><li class="paginate_button page-item "><a href="#" aria-controls="zero-config" data-dt-idx="3" tabindex="0" class="page-link">3</a></li><li class="paginate_button page-item "><a href="#" aria-controls="zero-config" data-dt-idx="4" tabindex="0" class="page-link">4</a></li><li class="paginate_button page-item "><a href="#" aria-controls="zero-config" data-dt-idx="5" tabindex="0" class="page-link">5</a></li><li class="paginate_button page-item "><a href="#" aria-controls="zero-config" data-dt-idx="6" tabindex="0" class="page-link">6</a></li><li class="paginate_button page-item next" id="zero-config_next"><a href="#" aria-controls="zero-config" data-dt-idx="7" tabindex="0" class="page-link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a></li></ul></div></div></div></div>
                     </div>
                  </div>
                </div>
            
            </div>
            </div>
        </div>


    <!-- BEGIN GLOBAL MANDATORY SCRIPTS -->
    <script src="{{ asset('assets/js/libs/jquery-3.1.1.min.js') }}"></script>
    <script src="{{ asset('bootstrap/js/popper.min.js') }}"></script>
    <script src="{{ asset('bootstrap/js/bootstrap.min.js') }}"></script>

    <!-- END GLOBAL MANDATORY SCRIPTS -->
    <script src="{{ asset('assets/js/authentication/form-1.js') }}"></script>

</body>

</html>
@endsection