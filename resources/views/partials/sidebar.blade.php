<!-- resources/views/sidebar.blade.php -->
@include('partials.header')
<!-- El resto del contenido de sidebar.blade.php -->

<body class="dashboard-analytics admin-header">
    <!-- BEGIN LOADER -->
    <div id="load_screen">
        <div class="loader">
            <div class="loader-content">
                <div class="spinner-grow align-self-center"></div>
            </div>
        </div>
    </div>
    <!--  END LOADER -->
    <!--  BEGIN MAIN CONTAINER  -->
    <div class="main-container" id="container">

        <div class="overlay"></div>
        <div class="search-overlay"></div>

        <!--  BEGIN SIDEBAR  -->
        <div class="sidebar-wrapper sidebar-theme">

            <div class="theme-logo">
                <a href="index.html">
                    <img src="{{ asset('img/centevi.png') }}" alt="Logo" class="mb-3"
                        style="max-width: 800px; display: block; margin: 0 auto;">
                </a>
            </div>

            <div class="sidebarCollapseFixed">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="feather feather-arrow-left">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
            </div>

            <nav id="compactSidebar">
                <ul class="menu-categories ps">

                    <li class="menu-block inicio">
                        <a href="{{ route('home') }}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" class="feather feather-home">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg> INICIO </a>
                    </li>

                    <li class="menu">
                        <a href="#pacientes" data-active="false" class="menu-toggle">
                            <div class="base-menu">
                                <div class="base-icons">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="feather feather-box">
                                        <path
                                            d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z">
                                        </path>
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                    </svg>
                                </div>
                                <span>Pacientes</span>
                            </div>
                        </a>
                    </li>
                    <li class="menu">
                        <a href="#consultas" data-active="false" class="menu-toggle">
                            <div class="base-menu">
                                <div class="base-icons">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z">
                                        </path>
                                    </svg>
                                </div>
                                <span>Consultas</span>
                            </div>
                        </a>
                    </li>

                    <li class="menu">
                        <a href="#sucursales" data-active="false" class="menu-toggle">
                            <div class="base-menu">
                                <div class="base-icons">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="feather feather-cpu">
                                        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                                        <rect x="9" y="9" width="6" height="6"></rect>
                                        <line x1="9" y1="1" x2="9" y2="4"></line>
                                        <line x1="15" y1="1" x2="15" y2="4"></line>
                                        <line x1="9" y1="20" x2="9" y2="23"></line>
                                        <line x1="15" y1="20" x2="15" y2="23"></line>
                                        <line x1="20" y1="9" x2="23" y2="9"></line>
                                        <line x1="20" y1="14" x2="23" y2="14"></line>
                                        <line x1="1" y1="9" x2="4" y2="9"></line>
                                        <line x1="1" y1="14" x2="4" y2="14"></line>
                                    </svg>
                                </div>
                                <span>Sucursales</span>
                            </div>
                        </a>
                    </li>

                    <li class="menu">
                        <a href="#recetas" data-active="false" class="menu-toggle">
                            <div class="base-menu">
                                <div class="base-icons">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                                        </path>
                                    </svg>
                                </div>
                                <span>Recetas</span>
                            </div>
                        </a>
                    </li>

                    <li class="menu">
                        <a href="#reportes" data-active="false" class="menu-toggle">
                            <div class="base-menu">
                                <div class="base-icons">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="feather feather-box">
                                        <path
                                            d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z">
                                        </path>
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                    </svg>
                                </div>
                                <span>Reportes</span>
                            </div>
                        </a>
                    </li>



                    <li class="menu">
                        <a href="#configuracion" data-active="false" class="menu-toggle">

                            <div class="base-menu">
                                <div class="base-icons">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                                        </path>
                                    </svg>
                                </div>
                                <span>Usuarios</span>
                            </div>
                        </a>
                    </li>
                    <div class="ps__rail-x" style="left: 0px; bottom: 0px;">
                        <div class="ps__thumb-x" tabindex="0" style="left: 0px; width: 0px;"></div>
                    </div>
                    <div class="ps__rail-y" style="top: 0px; right: 0px;">
                        <div class="ps__thumb-y" tabindex="0" style="top: 0px; height: 0px;"></div>
                    </div>
                </ul>
            </nav>

            <div id="compact_submenuSidebar" class="submenu-sidebar ps">

                <div class="submenu" id="pacientes">
                    <ul class="submenu-list" data-parent-element="#uiKit">
                        <li>
                            <a href="crear-paciente"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Crear Paciente </a>
                        </li>
                        <li>
                            <a href="lista-pacientes"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Lista de Pacientes </a>
                        </li>

                    </ul>
                </div>

                <div class="submenu" id="doctores">
                    <ul class="submenu-list" data-parent-element="#doctores">
                        <li>
                            <a href="#"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                                        height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Ver doctores </a>
                        </li>
                    </ul>
                </div>

                <div class="submenu" id="consultas">
                    <ul class="submenu-list" data-parent-element="#consultas">
                        <li>
                            <a href="optometria-neonatos"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Optometría Neonatos </a>
                        </li>
                        <li>
                            <a href="optometria-pediatrica"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Optometría Pediátrica </a>
                        </li>
                        <li>
                            <a href="ortoptica-adultos"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Ortóptica - Visión Binocular</a>
                        </li>
                        <li>
                            <a href="baja-vision"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                                        height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Baja Visión </a>
                        </li>
                        <li>
                            <a href="refraccion-general"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Optometría General </a>
                        </li>
                        <li>
                            <a href="consulta-generica"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Historia Clínica </a>
                        </li>


                    </ul>
                </div>

                <div class="submenu" id="reportes">
                    <ul class="submenu-list" data-parent-element="#reportes">
                        <li>
                            <a href="reportes"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                                        height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Ver Reportes </a>
                        </li>

                        <li>
                            <a href="reporte-pacientes-sin-atencion"> <span class="icon"><svg
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Pacientes sin atención </a>
                        </li>
                        <li>
                            <a href="reporte-pacientes-ultima-atencion"> <span class="icon"><svg
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Última atención </a>
                        </li>
                        <li>
                            <a href="reporte-pacientes-atendidos-por-dia"> <span class="icon"><svg
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Atendidos por día </a>
                        </li>
                        <li>
                            <a href="reporte-pacientes-consultas-diarias"> <span class="icon"><svg
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span>Consultas Diarias </a>
                        </li>
                        <li>
                            <a href="reporte-pacientes-terapias-diarias"> <span class="icon"><svg
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span>Terapias Diarias </a>
                        </li>
                    </ul>
                </div>

                <div class="submenu" id="sucursales">
                    <ul class="submenu-list" data-parent-element="#sucursales">
                        <li>
                            <a href="sucursales"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                                        height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Ver sucursales </a>
                        </li>
                    </ul>
                </div>


                <div class="submenu" id="recetas">

                    <ul class="submenu-list" data-parent-element="#recetas">
                        <li>
                            <a href="recetas"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                                        height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Ver Recetas </a>
                        </li>
                    </ul>
                </div>



                <div class="submenu" id="configuracion">
                    <ul class="submenu-list" data-parent-element="#uiKit">
                        <li>
                            <a href="usuarios"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                                        height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Ver Usuarios </a>
                        </li>

                    </ul>
                </div>


                <div class="ps__rail-x" style="left: 0px; bottom: 0px;">
                    <div class="ps__thumb-x" tabindex="0" style="left: 0px; width: 0px;"></div>
                </div>
                <div class="ps__rail-y" style="top: 0px; right: 0px;">
                    <div class="ps__thumb-y" tabindex="0" style="top: 0px; height: 0px;"></div>
                </div>
            </div>
        </div>
        
        <!--  END SIDEBAR  -->

        <!-- views/layout/app.blade.php -->
        @include('layouts.app')
        
        <!-- El resto del contenido de app.blade.php -->
    </div>
    <!-- END MAIN CONTAINER -->
    <script src="{{ asset('js/usuarios.js') }}"></script>
    <script src="{{ asset('js/redireccion.js') }}"></script>
</body>
