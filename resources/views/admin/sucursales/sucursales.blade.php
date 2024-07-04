@extends('partials.sidebar')
@section('content')

<body>

<head>
<link href="{{ asset('assets/css/sucursales/sucursales.css') }}" rel="stylesheet" type="text/css" class="structure" />
</head>

<div class="admin-data-content" style="margin-top:50px;">
  <div class="row layout-top-spacing">
    <div class="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
        <div class="widget-content-area br-4">
            <div class="widget-one">
            <div class="row layout-top-spacing" id="cancel-row">
                
                <div class="col-xl-12 col-lg-12 col-sm-12  layout-spacing">
                    <div class="widget-content widget-content-area br-6">
                       <button class="btn btn-success mb-4 ml-3 mt-4" data-toggle="modal" data-target="#modalAgregarSursal">
                                 
                                 Agregar Sucursal
                                
                        </button>


                        <div id="zero-config_wrapper" class="dataTables_wrapper container-fluid dt-bootstrap4"><div class="dt--top-section"><div class="row"><div class="col-12 col-sm-6 d-flex justify-content-sm-start justify-content-center"><div class="dataTables_length" id="zero-config_length"><label>Results :  <select name="zero-config_length" aria-controls="zero-config" class="form-control"><option value="7">7</option><option value="10">10</option><option value="20">20</option><option value="50">50</option></select></label></div></div><div class="col-12 col-sm-6 d-flex justify-content-sm-end justify-content-center mt-sm-0 mt-3"><div id="zero-config_filter" class="dataTables_filter"><label><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg><input type="search" class="form-control" placeholder="Search..." aria-controls="zero-config"></label></div></div></div></div><div class="table-responsive"><table id="zero-config" class="table dt-table-hover tablaSucursal dataTable" style="width:100%" role="grid" aria-describedby="zero-config_info">
                            <thead>
                                <tr role="row">
                                    <th class="sorting" tabindex="0" aria-controls="zero-config">Nombre Sucursal</th>
                                    <th class="sorting" tabindex="0" aria-controls="zero-config">Ubicacion</th>
                                    <th class="sorting" tabindex="0" aria-controls="zero-config">Fecha de creacion</th>
                                    <th class="text-center dt-no-sorting sorting" tabindex="0" aria-controls="zero-config">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                              <tr role="row">
                              
                               <td>CENTEVI Centro Médico San Judas Tadeo</td>
                               <td>VILLA LUCRE, San Miguelito</td>
                               <td>2021-09-15 23:09:36</td>
                               <td>
                                 
                               <div class="btn-group">
                                
                                 <button class="btn btn-warning btnEditarSucursal" id_sucursal="3" data-toggle="modal" data-target="#modalEditarSucursal"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path stroke-linecap="modalEditarSucursal" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                 </svg></button>
                              
                   
                                 <button class="btn btn-danger btnEliminarSucursal" borrar_sucursal="3"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                 </svg></button>
                   
                               </div>  
                   
                               </td>

                              </tr><tr role="row">
                              
                               <td>CENTEVI Consultorios Medicos Paitilla</td>
                               <td>CENTEVI Paitilla</td>
                               <td>2021-09-15 23:09:50</td>
                               <td>
                                 
                               <div class="btn-group">
                                
                                 <button class="btn btn-warning btnEditarSucursal" id_sucursal="4" data-toggle="modal" data-target="#modalEditarSucursal"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path stroke-linecap="modalEditarSucursal" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                 </svg></button>
                              
                   
                                 <button class="btn btn-danger btnEliminarSucursal" borrar_sucursal="4"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                 </svg></button>
                   
                               </div>  
                   
                               </td>

                              </tr><tr role="row">
                              
                               <td>CENTEVI Sede Chitre</td>
                               <td>CHITRE, Provincia Herrera</td>
                               <td>2021-09-22 16:31:04</td>
                               <td>
                                 
                               <div class="btn-group">
                                
                                 <button class="btn btn-warning btnEditarSucursal" id_sucursal="5" data-toggle="modal" data-target="#modalEditarSucursal"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path stroke-linecap="modalEditarSucursal" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                 </svg></button>
                              
                   
                                 <button class="btn btn-danger btnEliminarSucursal" borrar_sucursal="5"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                 </svg></button>
                   
                               </div>  
                   
                               </td>

                              </tr><tr role="row">
                              
                               <td>CENTEVI El Dorado</td>
                               <td>EL DORADO, Ciudad de Panama</td>
                               <td>2022-04-05 16:24:00</td>
                               <td>
                                 
                               <div class="btn-group">
                                
                                 <button class="btn btn-warning btnEditarSucursal" id_sucursal="7" data-toggle="modal" data-target="#modalEditarSucursal"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path stroke-linecap="modalEditarSucursal" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                 </svg></button>
                              
                   
                                 <button class="btn btn-danger btnEliminarSucursal" borrar_sucursal="7"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                 </svg></button>
                   
                               </div>  
                   
                               </td>

                              </tr><tr role="row">
                              
                               <td>CENTEVI Giras Interior del Pais</td>
                               <td>Interior del Pais</td>
                               <td>2024-04-18 09:12:39</td>
                               <td>
                                 
                               <div class="btn-group">
                                
                                 <button class="btn btn-warning btnEditarSucursal" id_sucursal="8" data-toggle="modal" data-target="#modalEditarSucursal"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path stroke-linecap="modalEditarSucursal" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                 </svg></button>
                              
                   
                                 <button class="btn btn-danger btnEliminarSucursal" borrar_sucursal="8"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                 </svg></button>
                   
                               </div>  
                   
                               </td>

                              </tr>                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>Nombre Sucursal</th>
                                    <th>Ubicacion</th>
                                    <th>Estado</th>
                                    <th>Fecha de creacion</th>
                                  
                                    <th class="invisible"></th>
                                </tr>
                            </tfoot>
                        </table></div><div class="dt--bottom-section d-sm-flex justify-content-sm-between text-center"><div class="dt--pages-count  mb-sm-0 mb-3"><div class="dataTables_info" id="zero-config_info" role="status" aria-live="polite"></div></div><div class="dt--pagination"><div class="dataTables_paginate paging_simple_numbers" id="zero-config_paginate"></div></div></div></div>
                    </div>
                </div>
            
            </div>
            </div>
        </div>
    </div>
  </div>
</div>
</body>
@endsection