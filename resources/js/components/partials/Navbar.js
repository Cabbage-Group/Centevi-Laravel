import React from 'react'

const Navbar = () => {
    return (
        <div className="content-container">
            <div className="col layout-top-spacing colo-12">
                <div className="col-left-content">
                    <div
                        className="header-container"
                        id="header"
                    >
                        <header id="navbar-header-dl" className="header-navbar-navbar-expand-sm" style={{display:"flex",justifyContent:"space-between"}}>
                            <div className="d-flex">
                                <a
                                    href={{ javascript: void (0), }}
                                    className="sidebarCollapse"
                                    dataplacement="bottom"
                                >
                                    <div className="bt-menu-trigger">
                                        <span>
                                        </span>
                                    </div>
                                </a>
                            </div>
                            <div className="header-actions">
                                <div className="nav-item dropdown user-profile-dropdown">
                                    <a
                                        aria-expanded="false"
                                        aria-haspopup="false"
                                        className="nav-link dropdown-toggle user"
                                        data-toggle="dropdown"
                                        href="#"
                                        id="user-profile-dropdown"
                                    >
                                        <div className="media">
                                            <img
                                                className="rounded-circle header-profile-user"
                                                src="{{ asset('assets/img/90x90.png')}}"
                                            />
                                            <div className="media-body align-self-center">
                                                <h6>
                                                    admin
                                                </h6>
                                            </div>
                                        </div>
                                        <svg
                                            className="feather feather-chevron-down"
                                            fill="none"
                                            height="24"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            width="24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </a>
                                    <div
                                        aria-labelledby="userProfileDropdown"
                                        className="dropdown-menu position-absolute"
                                    >
                                        <div className="user-profile-section">
                                            <div className="media mx-auto">
                                                <div className="media-body">
                                                    <span>
                                                        Administrador
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="dropdown-item">
                                            <a href="salir">
                                                <svg
                                                    className="feather feather-log-out"
                                                    fill="none"
                                                    height="24"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                    width="24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                                    <polyline points="16 17 21 12 16 7" />
                                                    <line
                                                        x1="21"
                                                        x2="9"
                                                        y1="12"
                                                        y2="12"
                                                    />
                                                </svg>
                                                {' '}
                                                <span>
                                                    Salir
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar