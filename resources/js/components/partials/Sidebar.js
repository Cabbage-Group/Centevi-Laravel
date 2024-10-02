import React from 'react'
import Navbar from './Navbar'
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';


const Sidebar = (props) => {

  const { component } = props
  const { usuario } = useSelector((state) => state.auth);

  return (
    <div className="main-container" id="container">
      <div className="overlay"></div>
      <div className="search-overlay"></div>

      <div className="sidebar-wrapper sidebar-theme">
        <div className="theme-logo">
          <a href="/home">
            <img src="../img/centevi.png" alt="Logo" className="mb-3"
              style={{ maxWidth: 800, display: "block", margin: "0 auto", }} />
          </a>
        </div>
        <div className="sidebarCollapseFixed">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="feather feather-arrow-left">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </div>
        <nav id="compactSidebar">
          <ul className="menu-categories ps">
            <li className="menu-block inicio">
              <a href="/home" >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" className="feather feather-home">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg> INICIO
              </a>
            </li>
            <li className="menu">
              <a href="#pacientes" data-active="false" className="menu-toggle">
                <div className="base-menu">
                  <div className="base-icons">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round" className="feather feather-box">
                      <path
                        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z">
                      </path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  </div>
                  <span>Pacientes</span>
                </div>
              </a>
            </li>
            <li className="menu">
              <a href="#consultas" data-active="false" className="menu-toggle">
                <div className="base-menu">
                  <div className="base-icons">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z">
                      </path>
                    </svg>
                  </div>
                  <span>Consultas</span>
                </div>
              </a>
            </li>
            {
              usuario?.usuario?.perfil == 'superadministrador' ? (
                <li className="menu">
                  <a href="#sucursales" data-active="false" className="menu-toggle">
                    <div className="base-menu">
                      <div className="base-icons">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                          strokeLinejoin="round" className="feather feather-cpu">
                          <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
                          <rect x="9" y="9" width="6" height="6" />
                          <line x1="9" y1="1" x2="9" y2="4" />
                          <line x1="15" y1="1" x2="15" y2="4" />
                          <line x1="9" y1="20" x2="9" y2="23" />
                          <line x1="15" y1="20" x2="15" y2="23" />
                          <line x1="20" y1="9" x2="23" y2="9" />
                          <line x1="20" y1="14" x2="23" y2="14" />
                          <line x1="1" y1="9" x2="4" y2="9" />
                          <line x1="1" y1="14" x2="4" y2="14" />
                        </svg>
                      </div>
                      <span>Sucursales</span>
                    </div>
                  </a>
                </li>
              ) : null
            }

            <li className="menu">
              <a href="#recetas" data-active="false" className="menu-toggle">
                <div className="base-menu">
                  <div className="base-icons">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                      </path>
                    </svg>
                  </div>
                  <span>Recetas</span>
                </div>
              </a>
            </li>
            <li className="menu">
              <a href="#reportes" data-active="false" className="menu-toggle">
                <div className="base-menu">
                  <div className="base-icons">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round" className="feather feather-box">
                      <path
                        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z">
                      </path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  </div>
                  <span>Reportes</span>
                </div>
              </a>
            </li>
            {
              usuario?.usuario?.perfil == 'superadministrador' ? (
                <li className="menu">
                  <a href="#configuracion" data-active="false" className="menu-toggle">
                    <div className="base-menu">
                      <div className="base-icons">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                          viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                          </path>
                        </svg>
                      </div>
                      <span>Usuarios</span>
                    </div>
                  </a>
                </li>
              ) : null
            }

            <div className="ps__rail-x" style={{ left: 0, bottom: 0, }}>
              <div className="ps__thumb-x" tabIndex="0" style={{ left: 0, width: 0, }}></div>
            </div>
            <div className="ps__rail-y" style={{ top: 0, right: 0, }}>
              <div className="ps__thumb-y" tabIndex="0" style={{ top: 0, height: 0, }}></div>
            </div>
          </ul>
        </nav>
        <div id="compact_submenuSidebar" className="submenu-sidebar ps">
          <div className="submenu" id="pacientes">
            <ul className="submenu-list" data-parent-element="#uiKit">
              <li>
                <Link to={"/crear-paciente"}>
                  <span className="icon"><svg xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="feather feather-git-commit">
                    <circle cx="12" cy="12" r="4" />
                    <line x1="1.05" y1="12" x2="7" y2="12" />
                    <line x1="17.01" y1="12" x2="22.96" y2="12" />
                  </svg></span> Crear Paciente
                </Link>
              </li>
              <li>
                <Link to={"/lista-pacientes"}>
                  <span className="icon"><svg xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="feather feather-git-commit">
                    <circle cx="12" cy="12" r="4" />
                    <line x1="1.05" y1="12" x2="7" y2="12" />
                    <line x1="17.01" y1="12" x2="22.96" y2="12" />
                  </svg></span> Lista de Pacientes
                </Link>
              </li>
            </ul>
          </div>
          <div className="submenu" id="doctores">
            <ul className="submenu-list" data-parent-element="#doctores">
              <li>
                <Link to={"/ver-doctores"}>
                  <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                    height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="feather feather-git-commit">
                    <circle cx="12" cy="12" r="4" />
                    <line x1="1.05" y1="12" x2="7" y2="12" />
                    <line x1="17.01" y1="12" x2="22.96" y2="12" />
                  </svg></span> Ver doctores
                </Link>
              </li>
            </ul>
          </div>
          <div className="submenu" id="consultas">
            <ul className="submenu-list" data-parent-element="#consultas">
              <li>
                <Link to={"/optometria-neonatos"}>
                  <span className="icon"><svg xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="feather feather-git-commit">
                    <circle cx="12" cy="12" r="4" />
                    <line x1="1.05" y1="12" x2="7" y2="12" />
                    <line x1="17.01" y1="12" x2="22.96" y2="12" />
                  </svg></span> Optometría Neonatos
                </Link>
              </li>
              <li>
                <Link to={"/optometria-pediatra"}>
                  <span className="icon"><svg xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="feather feather-git-commit">
                    <circle cx="12" cy="12" r="4" />
                    <line x1="1.05" y1="12" x2="7" y2="12" />
                    <line x1="17.01" y1="12" x2="22.96" y2="12" />
                  </svg></span> Optometría Pediátrica
                </Link>
              </li>
              <li>
                <Link to={"/vision-binocular"}>
                  <span className="icon"><svg xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="feather feather-git-commit">
                    <circle cx="12" cy="12" r="4" />
                    <line x1="1.05" y1="12" x2="7" y2="12" />
                    <line x1="17.01" y1="12" x2="22.96" y2="12" />
                  </svg></span> Ortóptica - Visión Binocular
                </Link>
              </li>
              <li>
                <Link to={"/baja-vision"}>
                  <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                    height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="feather feather-git-commit">
                    <circle cx="12" cy="12" r="4" />
                    <line x1="1.05" y1="12" x2="7" y2="12" />
                    <line x1="17.01" y1="12" x2="22.96" y2="12" />
                  </svg></span> Baja Visión
                </Link>
              </li>
              <li>
                <Link to={"/optometria-general"}>
                  <span className="icon"><svg xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="feather feather-git-commit">
                    <circle cx="12" cy="12" r="4" />
                    <line x1="1.05" y1="12" x2="7" y2="12" />
                    <line x1="17.01" y1="12" x2="22.96" y2="12" />
                  </svg></span> Optometría General
                </Link>
              </li>
              <li>
                <Link to={"/historia-clinica"}>
                  <span className="icon"><svg xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="feather feather-git-commit">
                    <circle cx="12" cy="12" r="4" />
                    <line x1="1.05" y1="12" x2="7" y2="12" />
                    <line x1="17.01" y1="12" x2="22.96" y2="12" />
                  </svg></span> Historia Clínica
                </Link>
              </li>
            </ul>
          </div>
          <div className="submenu" id="reportes">
            <ul className="submenu-list" data-parent-element="#reportes">
              {
                usuario?.usuario?.perfil == 'superadministrador' ? (
                  <li>
                    <Link to={"/reportes"}>
                      <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                        height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="feather feather-git-commit">
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg></span> Ver Reportes
                    </Link>
                  </li>
                ) : null
              }

              {
                usuario?.usuario?.perfil == 'superadministrador' ? (
                  <li>
                    <Link to={"/reportes-sin-atencion"}>
                      <span className="icon"><svg
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round" className="feather feather-git-commit">
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg></span> Pacientes sin atención
                    </Link>
                  </li>
                ) : null
              }

              {
                usuario?.usuario?.perfil == 'superadministrador' ? (
                  <li>
                    <Link to={"/reportes-ultima-atencion"}>
                      <span className="icon"><svg
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round" className="feather feather-git-commit">
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg></span> Última atención
                    </Link>
                  </li>
                ) : null
              }

              {
                usuario?.usuario?.perfil == 'superadministrador' ? (
                  <li>
                    <Link to={"/paciente-atendido-dia"}>
                      <span className="icon"><svg
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round" className="feather feather-git-commit">
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg></span> Atendidos por día
                    </Link>
                  </li>
                ) : null
              }

              {
                usuario?.usuario?.perfil == 'superadministrador' ? (
                  <li>
                    <Link to={"/consultas-diarias"}>
                      <span className="icon"><svg
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round" className="feather feather-git-commit">
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg></span>Consultas Diarias
                    </Link>
                  </li>
                ) : null
              }

              {
                usuario?.usuario?.perfil == 'superadministrador' ? (
                  <li>
                    <Link to={"/terapias-diarias"}>
                      <span className="icon"><svg
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round" className="feather feather-git-commit">
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg></span>Terapias Diarias
                    </Link>
                  </li>
                ) : null
              }

              <li>
                <Link to={"/proximas-citas"}>
                  <span className="icon"><svg
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round" className="feather feather-git-commit">
                    <circle cx="12" cy="12" r="4" />
                    <line x1="1.05" y1="12" x2="7" y2="12" />
                    <line x1="17.01" y1="12" x2="22.96" y2="12" />
                  </svg></span>Proximas Citas
                </Link>
              </li>
            </ul>
          </div>
          <div className="submenu" id="sucursales">
            <ul className="submenu-list" data-parent-element="#sucursales">
              <li>
                <Link to={"/sucursales"}>
                  <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                    height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="feather feather-git-commit">
                    <circle cx="12" cy="12" r="4" />
                    <line x1="1.05" y1="12" x2="7" y2="12" />
                    <line x1="17.01" y1="12" x2="22.96" y2="12" />
                  </svg></span> Ver sucursales
                </Link>
              </li>
            </ul>
          </div>
          <div className="submenu" id="recetas">
            <ul className="submenu-list" data-parent-element="#recetas">
              <li>
                <Link to={"/recetas"}>
                  <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                    height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="feather feather-git-commit">
                    <circle cx="12" cy="12" r="4" />
                    <line x1="1.05" y1="12" x2="7" y2="12" />
                    <line x1="17.01" y1="12" x2="22.96" y2="12" />
                  </svg></span> Ver Recetas
                </Link>
              </li>
            </ul>
          </div>
          <div className="submenu" id="configuracion">
            <ul className="submenu-list" data-parent-element="#uiKit">
              <li>
                <Link to={"/usuarios"}>
                  <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                    height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="feather feather-git-commit">
                    <circle cx="12" cy="12" r="4" />
                    <line x1="1.05" y1="12" x2="7" y2="12" />
                    <line x1="17.01" y1="12" x2="22.96" y2="12" />
                  </svg></span> Ver Usuarios
                </Link>
              </li>
            </ul>
          </div>
          <div className="ps__rail-x" style={{ left: 0, bottom: 0, }}>
            <div className="ps__thumb-x" tabIndex="0" style={{ left: 0, width: 0, }}></div>
          </div>
          <div className="ps__rail-y" style={{ top: 0, right: 0 }}>
            <div className="ps__thumb-y" tabIndex="0" style={{ top: 0, height: 0 }}></div>
          </div>
        </div>
      </div>


      {/*  */}

      <div id="content" className="main-content">
        <div className="layout-px-spacing">
          <Navbar />
          {component}
        </div>
      </div>
      {/*  */}
    </div>
  )
}

export default Sidebar