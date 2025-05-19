import React from 'react'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="content-container">
      <div className="col layout-top-spacing colo-12">
        <div className="col-left-content">
          <div
            className="header-container"
            id="header"
          >
            <header id="navbar-header-dl" className="header-navbar-navbar-expand-sm" style={{ display: "flex", justifyContent: "space-between" }}>
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
                    style={{
                      display: 'flex'
                    }}
                  >
                    <div className="media">
                      <img
                        className="rounded-circle header-profile-user"
                        // src="{{ asset('assets/img/90x90.png')}}"
                        src="https://centevi.digital/vistas/img/usuarios/superadmin/249.jpg"
                        style={{
                          width: '30px',
                          marginRight: '5px'
                        }}
                      />
                      <div
                        className="media-body align-self-center"
                        style={{
                          marginTop: '-3px'
                        }}
                      >
                        <h6
                          style={{
                            color: "#4361ee",
                            fontSize: "13px",
                            fontWeight: 600,
                            marginBottom: 0
                          }}
                        >
                          {localStorage.getItem('usuario')}
                        </h6>
                      </div>
                    </div>
                    <div
                      style={{
                        marginTop: '1px'
                      }}
                    >
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
                    </div>
                  </a>
                  <div
                    aria-labelledby="userProfileDropdown"
                    className="dropdown-menu position-absolute"
                    style={{
                      marginTop: '20px'
                    }}
                  >
                    <div
                      className="user-profile-section"
                      style={{
                        padding: "16px 14px",
                        borderTopLeftRadius: "4px",
                        borderTopRightRadius: "4px",
                        // marginRight: "-12px",
                        // marginLeft: "-12px",
                        background: "rgb(96 152 149)",
                        marginTop: "-1px",
                      }}
                    >
                      <div className="media mx-auto">
                        <div
                          className="media-body"
                          style={{
                            fontWeight: "500",
                            marginBottom: "0",
                            color: "#e0e6ed",
                            fontSize: '12px'
                          }}
                        >
                          <span>
                            {localStorage.getItem('nombre')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="dropdown-item"
                      style={{
                        display: "block",
                        width: "100%",
                        padding: ".25rem 1.5rem",
                        clear: "both",
                        fontWeight: "400",
                        color: "#212529",
                        textAlign: "inherit",
                        whiteSpace: "nowrap",
                        backgroundColor: "transparent",
                        border: "0",
                      }}
                    >
                      <div
                        onClick={() => {
                          localStorage.clear();
                          navigate('/login', { replace: true })
                          window.location.reload();
                        }}
                        style={{
                          display: "block",
                          color: "#3b3f5c",
                          fontSize: "13px",
                          fontWeight: "600",
                          padding: "9px 14px",
                          cursor: 'pointer'
                        }}
                      >
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
                          style={{
                            width: "17px",
                            marginRight: "7px",
                            height: "17px",
                            color: "#009688",
                            fill: "rgb(0 150 136 / 13%)",
                          }}
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>
          </div>
        </div >
      </div >
    </div >
  )
}

export default Navbar