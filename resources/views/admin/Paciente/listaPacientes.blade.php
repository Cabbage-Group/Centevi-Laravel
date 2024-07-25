<div class="admin-data-content" style="margin-top:50px;">
    <div class="row layout-top-spacing">
        <div class="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
            <div class="widget-content-area br-4">
                <div class="widget-one">
                    <div class="row layout-top-spacing" id="cancel-row">
                        <div class="col-xl-12 col-lg-12 col-sm-12  layout-spacing">
                            <div class="widget-content widget-content-area br-6">
                                <div class="form-row mb-4">
                                    <div class="form-group col-md-12" style="display:flex;">
                                        <a class="btn btn-success mb-4 ml-3 mt-4" href="crear-paciente">
                                            Agregar Paciente
                                        </a>
                                        <input style="width: 50%; margin-top:16px" type="text"
                                            class="form-control txt-buscar-cedula" placeholder="Buscar por Cedula"
                                            name="">
                                    </div>
                                </div>
                                <div class="table-responsive">
                                    <table id="zero-config" class="table dt-table-hover tabla_pacientes"
                                        style="width:100%">
                                        <thead>
                                            <tr>
                                                <th>Nombres de Paciente</th>
                                                <th>Cedula</th>
                                                <th>Direccion</th>
                                                <th>Fecha de creacion</th>
                                                <th class="text-center dt-no-sorting">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Danna Lucia Gonzalez Quiros</td>
                                                <td>8-1219-383</td>
                                                <td>Santiago, Provincia Veraguas</td>
                                                <td>2021-12-29</td>
                                                <td>
                                                    <div class="btn-group">
                                                        <button class="btn btn-primary btnVerHistoria" id_paciente="22"
                                                            data-toggle="modal" data-target="#modalEditarUsuario"><svg
                                                                xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z">
                                                                </path>
                                                            </svg></button>
                                                        <button class="btn btn-warning btnEditarPaciente"
                                                            id_paciente="22" data-toggle="modal"
                                                            data-target="#modalEditarUsuario"><svg
                                                                xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                                                </path>
                                                            </svg></button>
                                                        <button class="btn btn-danger btnEliminarPaciente"
                                                            borrar_paciente="22"><svg xmlns="http://www.w3.org/2000/svg"
                                                                class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                                                stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                                                </path>
                                                            </svg></button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Amber Lizeth Martinez Moreno</td>
                                                <td>4-882-127</td>
                                                <td>David Residencial Hacienda del Lago, Chiriqui</td>
                                                <td>2021-12-29</td>
                                                <td>
                                                    <div class="btn-group">
                                                        <button class="btn btn-primary btnVerHistoria" id_paciente="23"
                                                            data-toggle="modal" data-target="#modalEditarUsuario"><svg
                                                                xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z">
                                                                </path>
                                                            </svg></button>
                                                        <button class="btn btn-warning btnEditarPaciente"
                                                            id_paciente="23" data-toggle="modal"
                                                            data-target="#modalEditarUsuario"><svg
                                                                xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                                                </path>
                                                            </svg></button>
                                                        <button class="btn btn-danger btnEliminarPaciente"
                                                            borrar_paciente="23"><svg xmlns="http://www.w3.org/2000/svg"
                                                                class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                                                stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                                                </path>
                                                            </svg></button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Jenna Nicolle Martinez Moreno</td>
                                                <td>4-867-2164</td>
                                                <td>David Residencial Hacienda del Lago Chiriqui</td>
                                                <td>2021-12-29</td>
                                                <td>
                                                    <div class="btn-group">
                                                        <button class="btn btn-primary btnVerHistoria" id_paciente="24"
                                                            data-toggle="modal" data-target="#modalEditarUsuario"><svg
                                                                xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z">
                                                                </path>
                                                            </svg></button>
                                                        <button class="btn btn-warning btnEditarPaciente"
                                                            id_paciente="24" data-toggle="modal"
                                                            data-target="#modalEditarUsuario"><svg
                                                                xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                                                </path>
                                                            </svg></button>
                                                        <button class="btn btn-danger btnEliminarPaciente"
                                                            borrar_paciente="24"><svg xmlns="http://www.w3.org/2000/svg"
                                                                class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                                                stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                                                </path>
                                                            </svg></button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Ambar Julieta Quintero Xatruch</td>
                                                <td>8-1118-185</td>
                                                <td>Limajos, Panama</td>
                                                <td>2022-01-16</td>
                                                <td>
                                                    <div class="btn-group">
                                                        <button class="btn btn-primary btnVerHistoria" id_paciente="26"
                                                            data-toggle="modal" data-target="#modalEditarUsuario"><svg
                                                                xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z">
                                                                </path>
                                                            </svg></button>
                                                        <button class="btn btn-warning btnEditarPaciente"
                                                            id_paciente="26" data-toggle="modal"
                                                            data-target="#modalEditarUsuario"><svg
                                                                xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                                                </path>
                                                            </svg></button>
                                                        <button class="btn btn-danger btnEliminarPaciente"
                                                            borrar_paciente="26"><svg xmlns="http://www.w3.org/2000/svg"
                                                                class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                                                stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                                                </path>
                                                            </svg></button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Noa Stella Edde Sasson</td>
                                                <td>0000</td>
                                                <td>Pacific Point Torre 500, 3A</td>
                                                <td>2022-01-18</td>
                                                <td>
                                                    <div class="btn-group">
                                                        <button class="btn btn-primary btnVerHistoria" id_paciente="27"
                                                            data-toggle="modal" data-target="#modalEditarUsuario"><svg
                                                                xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z">
                                                                </path>
                                                            </svg></button>
                                                        <button class="btn btn-warning btnEditarPaciente"
                                                            id_paciente="27" data-toggle="modal"
                                                            data-target="#modalEditarUsuario"><svg
                                                                xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                                                </path>
                                                            </svg></button>
                                                        <button class="btn btn-danger btnEliminarPaciente"
                                                            borrar_paciente="27"><svg xmlns="http://www.w3.org/2000/svg"
                                                                class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                                                stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                                                </path>
                                                            </svg></button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Daniel Antonio Halphen Tapia</td>
                                                <td>8-1128-323</td>
                                                <td> Calle Amapolas, San Francisco</td>
                                                <td>2022-01-19</td>
                                                <td>
                                                    <div class="btn-group">
                                                        <button class="btn btn-primary btnVerHistoria" id_paciente="28"
                                                            data-toggle="modal" data-target="#modalEditarUsuario"><svg
                                                                xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z">
                                                                </path>
                                                            </svg></button>
                                                        <button class="btn btn-warning btnEditarPaciente"
                                                            id_paciente="28" data-toggle="modal"
                                                            data-target="#modalEditarUsuario"><svg
                                                                xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                                                </path>
                                                            </svg></button>
                                                        <button class="btn btn-danger btnEliminarPaciente"
                                                            borrar_paciente="28"><svg xmlns="http://www.w3.org/2000/svg"
                                                                class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                                                stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                                                </path>
                                                            </svg></button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Salomon Dayan Yedid</td>
                                                <td>8-1140-1390</td>
                                                <td>Punta Paitilla, Edificio Golden Palace</td>
                                                <td>2022-01-30</td>
                                                <td>
                                                    <div class="btn-group">
                                                        <button class="btn btn-primary btnVerHistoria" id_paciente="29"
                                                            data-toggle="modal" data-target="#modalEditarUsuario"><svg
                                                                xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z">
                                                                </path>
                                                            </svg></button>
                                                        <button class="btn btn-warning btnEditarPaciente"
                                                            id_paciente="29" data-toggle="modal"
                                                            data-target="#modalEditarUsuario"><svg
                                                                xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                                                </path>
                                                            </svg></button>
                                                        <button class="btn btn-danger btnEliminarPaciente"
                                                            borrar_paciente="29"><svg xmlns="http://www.w3.org/2000/svg"
                                                                class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                                                stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                                                </path>
                                                            </svg></button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Laura Fernández Refincor</td>
                                                <td>N-17-806</td>
                                                <td>Brisas del Golf</td>
                                                <td>2022-03-11</td>
                                                <td>
                                                    <div class="btn-group">
                                                        <button class="btn btn-primary btnVerHistoria" id_paciente="32"
                                                            data-toggle="modal" data-target="#modalEditarUsuario"><svg
                                                                xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z">
                                                                </path>
                                                            </svg></button>
                                                        <button class="btn btn-warning btnEditarPaciente"
                                                            id_paciente="32" data-toggle="modal"
                                                            data-target="#modalEditarUsuario"><svg
                                                                xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                                                </path>
                                                            </svg></button>
                                                        <button class="btn btn-danger btnEliminarPaciente"
                                                            borrar_paciente="32"><svg xmlns="http://www.w3.org/2000/svg"
                                                                class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                                                stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                                                </path>
                                                            </svg></button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Luis Fernando Palomo Chan</td>
                                                <td>8-1029-2242</td>
                                                <td>Albrook, Ville de Frenze, Calle 3era #53</td>
                                                <td>2022-03-11</td>
                                                <td>
                                                    <div class="btn-group">
                                                        <button class="btn btn-primary btnVerHistoria" id_paciente="33"
                                                            data-toggle="modal" data-target="#modalEditarUsuario"><svg
                                                                xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z">
                                                                </path>
                                                            </svg></button>
                                                        <button class="btn btn-warning btnEditarPaciente"
                                                            id_paciente="33" data-toggle="modal"
                                                            data-target="#modalEditarUsuario"><svg
                                                                xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                                                </path>
                                                            </svg></button>
                                                        <button class="btn btn-danger btnEliminarPaciente"
                                                            borrar_paciente="33"><svg xmlns="http://www.w3.org/2000/svg"
                                                                class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                                                stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                                                </path>
                                                            </svg></button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Jiam Carlos Tam Beitia</td>
                                                <td>8-1156-1202</td>
                                                <td>Parque Lefevre</td>
                                                <td>2022-03-11</td>
                                                <td>
                                                    <div class="btn-group">
                                                        <button class="btn btn-primary btnVerHistoria" id_paciente="35"
                                                            data-toggle="modal" data-target="#modalEditarUsuario"><svg
                                                                xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z">
                                                                </path>
                                                            </svg></button>
                                                        <button class="btn btn-warning btnEditarPaciente"
                                                            id_paciente="35" data-toggle="modal"
                                                            data-target="#modalEditarUsuario"><svg
                                                                xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                                                </path>
                                                            </svg></button>
                                                        <button class="btn btn-danger btnEliminarPaciente"
                                                            borrar_paciente="35"><svg xmlns="http://www.w3.org/2000/svg"
                                                                class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                                                stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                                                </path>
                                                            </svg></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th>Nombres de Paciente</th>
                                                <th>Cedula</th>
                                                <th>Direccion</th>
                                                <th>Fecha de creacion</th>
                                                <th class="text-center dt-no-sorting">Action</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                <div class="dt--bottom-section d-sm-flex justify-content-sm-between text-center"
                                    style="float: right;">
                                    <div class="dt--pagination">
                                        <div class="dataTables_paginate paging_simple_numbers"
                                            id="zero-config_paginate">
                                            <ul class="pagination">
                                                <li data-index="antes" style="cursor:pointer"
                                                    class="paginate_button page-item previous disabled paginate-item"
                                                    id="zero-config_previous">
                                                    <a href="#" aria-controls="zero-config" data-dt-idx="0" tabindex="0"
                                                        class="page-link">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                            stroke-width="2" stroke-linecap="round"
                                                            stroke-linejoin="round" class="feather feather-arrow-left">
                                                            <line x1="19" y1="12" x2="5" y2="12"></line>
                                                            <polyline points="12 19 5 12 12 5"></polyline>
                                                        </svg>
                                                    </a>
                                                </li>
                                                <li style="cursor:pointer" data-index="1"
                                                    class="paginate_button page-item active paginate-item paginan-1" "=""><div href="
                                                    #" aria-controls="zero-config" data-index="1" data-dt-idx="1"
                                                    tabindex="0" class="page-link">1
                                        </div>
                                        </li>
                                        <li style="cursor:pointer" data-index="2"
                                            class="paginate_button page-item paginate-item paginan-2">
                                            <div href="#" aria-controls="zero-config" data-index="2" data-dt-idx="2"
                                                tabindex="0" class="page-link">2</div>
                                        </li>
                                        <li style="cursor:pointer" data-index="3"
                                            class="paginate_button page-item paginate-item paginan-3">
                                            <div href="#" aria-controls="zero-config" data-index="3" data-dt-idx="3"
                                                tabindex="0" class="page-link">3</div>
                                        </li>
                                        <li style="cursor:pointer" data-index="..."
                                            class="paginate_button page-item paginate-item paginan-...">
                                            <div href="#" aria-controls="zero-config" data-index="..." data-dt-idx="..."
                                                tabindex="0" class="page-link">...</div>
                                        </li>
                                        <li style="cursor:pointer" data-index="881"
                                            class="paginate_button page-item paginate-item paginan-881">
                                            <div href="#" aria-controls="zero-config" data-index="881" data-dt-idx="881"
                                                tabindex="0" class="page-link">881</div>
                                        </li>
                                        <li style="cursor:pointer" data-index="882"
                                            class="paginate_button page-item paginate-item paginan-882">
                                            <div href="#" aria-controls="zero-config" data-index="882" data-dt-idx="882"
                                                tabindex="0" class="page-link">882</div>
                                        </li>
                                        <li data-index="siguiente" style="cursor:pointer"
                                            class="paginate_button page-item next paginate-item" id="zero-config_next">
                                            <div href="#" aria-controls="zero-config" data-dt-idx="8" tabindex="0"
                                                class="page-link">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                    class="feather feather-arrow-right">
                                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                                    <polyline points="12 5 19 12 12 19"></polyline>
                                                </svg>
                                            </div>
                                        </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>