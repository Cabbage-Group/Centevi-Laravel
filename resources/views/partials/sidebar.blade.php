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
                    <img src="{{ asset('img/centevi.png') }}" alt="Logo" class="mb-3" style="max-width: 800px; display: block; margin: 0 auto;">
                </a>
            </div>

            <div class="sidebarCollapseFixed">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
            </div>

            <nav id="compactSidebar">
                <ul class="menu-categories">
                    <li class="menu active">
                        <a href="#dashboard" data-active="true" class="menu-toggle">
                            <div class="base-menu">
                                <div class="base-icons">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                    </svg>
                                </div>
                                <span>Dashboard</span>
                            </div>
                        </a>
                    </li>

                    <li class="menu">
                        <a href="#app" data-active="false" class="menu-toggle">
                            <div class="base-menu">
                                <div class="base-icons">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-cpu">
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
                                <span>Apps</span>
                            </div>
                        </a>
                    </li>

                    <li class="menu">
                        <a href="#uiKit" data-active="false" class="menu-toggle">
                            <div class="base-menu">
                                <div class="base-icons">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-zap">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                    </svg>
                                </div>
                                <span>UI Kit</span>
                            </div>
                        </a>
                    </li>

                    <li class="menu">
                        <a href="#components" data-active="false" class="menu-toggle">
                            <div class="base-menu">
                                <div class="base-icons">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-box">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z">
                                        </path>
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                    </svg>
                                </div>
                                <span>Components</span>
                            </div>
                        </a>
                    </li>
                </ul>
            </nav>

            <div id="compact_submenuSidebar" class="submenu-sidebar">

                <div class="submenu" id="dashboard">
                    <ul class="submenu-list menu-block-submenu" data-parent-element="#dashboard">
                        <li class="active menu-block">
                            <a href="index.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-pie-chart">
                                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                                    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                                </svg> Analytics </a>
                        </li>
                        <li class="menu-block">
                            <a href="index2.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-shopping-bag">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                                </svg> Sales </a>
                        </li>
                    </ul>
                </div>

                <div class="submenu" id="app">
                    <ul class="submenu-list menu-block-submenu" data-parent-element="#app">
                        <li class="menu-block">
                            <a href="apps_chat.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-square">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg> Chat </a>
                        </li>
                        <li class="menu-block">
                            <a href="apps_mailbox.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mail">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z">
                                    </path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg> Mailbox </a>
                        </li>
                        <li class="menu-block">
                            <a href="apps_todoList.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg> Todo List </a>
                        </li>
                        <li class="menu-block">
                            <a href="apps_notes.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg> Notes</a>
                        </li>
                        <li class="menu-block">
                            <a href="apps_scrumboard.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-plus">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="12" y1="18" x2="12" y2="12"></line>
                                    <line x1="9" y1="15" x2="15" y2="15"></line>
                                </svg> Scrumboard</a>
                        </li>
                        <li class="menu-block">
                            <a href="apps_contacts.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg> Contacts</a>
                        </li>
                        <li class="menu-block">
                            <a href="apps_invoice-list.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-dollar-sign">
                                    <line x1="12" y1="1" x2="12" y2="23"></line>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                </svg> Invoice </a>
                        </li>
                        <li class="menu-block">
                            <a href="apps_calendar.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg> Calendar</a>
                        </li>
                    </ul>
                </div>

                <div class="submenu" id="uiKit">
                    <ul class="submenu-list" data-parent-element="#uiKit">
                        <li>
                            <a href="ui_alerts.html"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Alerts </a>
                        </li>
                        <li>
                            <a href="ui_avatar.html"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Avatar </a>
                        </li>
                        <li>
                            <a href="ui_badges.html"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Badges </a>
                        </li>
                        <li>
                            <a href="ui_breadcrumbs.html"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Breadcrumbs </a>
                        </li>
                        <li>
                            <a href="ui_buttons.html"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Buttons </a>
                        </li>
                        <li>
                            <a href="ui_buttons_group.html"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Button Groups </a>
                        </li>
                        <li>
                            <a href="ui_color_library.html"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Color Library </a>
                        </li>
                        <li>
                            <a href="ui_dropdown.html"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Dropdown </a>
                        </li>
                        <li>
                            <a href="ui_infobox.html"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Infobox </a>
                        </li>
                        <li>
                            <a href="ui_jumbotron.html"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Jumbotron </a>
                        </li>
                        <li>
                            <a href="ui_loader.html"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Loader </a>
                        </li>
                        <li>
                            <a href="ui_pagination.html"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Pagination </a>
                        </li>
                        <li>
                            <a href="ui_popovers.html"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Popovers </a>
                        </li>
                        <li>
                            <a href="ui_progress_bar.html"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Progress Bar </a>
                        </li>
                        <li>
                            <a href="ui_search.html"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Search </a>
                        </li>
                        <li>
                            <a href="ui_tooltips.html"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Tooltips </a>
                        </li>
                        <li>
                            <a href="ui_treeview.html"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Treeview </a>
                        </li>
                        <li>
                            <a href="ui_typography.html"> <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-git-commit">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                                    </svg></span> Typography </a>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
        <!--  END SIDEBAR  -->

        <!-- resources/views/app.blade.php -->
        @include('layouts.app')
        <!-- El resto del contenido de app.blade.php -->
    </div>
    <!-- END MAIN CONTAINER -->

    <script src="{{ asset('js/usuarios.js') }}"></script>
    <script src="{{ asset('js/redireccion.js') }}"></script>
</body>