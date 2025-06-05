import React from 'react'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'

const MenuWeb = ({ component, conversationsLength, fetchUsuario, ValidarPermisos }) => {
  return (
    <div className="main-container" id="container">
      <div className="overlay"></div>
      <div className="search-overlay"></div>

      {/* Mobile menu button */}
      <div className="mobile-menu-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </div>

      <div className="sidebar-wrapper sidebar-theme mobile-sidebar">
        <div className="theme-logo">
          <a href="/home">
            <img src="../img/centevi.png" alt="Logo" className="mb-3"
              style={{ maxWidth: 150, display: "block", margin: "0 auto" }} />
          </a>
        </div>

        <nav id="compactSidebar">
          <ul className="menu-categories ps" style={{ width: '100%' }}>
            <li className="menu-block inicio">
              <a href="/home">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" className="feather feather-home">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span className="menu-text">AGENDA</span>
              </a>
            </li>

            {/* Menú simplificado para móvil */}
            {ValidarPermisos(
              "sidebar.agenda",
              <li className="menu" onClick={() => navigate("/ver-agenda")}>
                <Link to="/ver-agenda" className="menu-toggle" style={{ width: '100%' }}>
                  <div className="base-menu">
                    <div className="base-icons">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 9H21M7 3V5M17 3V5M6 12H8M11 12H13M16 12H18M6 15H8M11 15H13M16 15H18M6 18H8M11 18H13M16 18H18M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#1ABC9C" strokeWidth="2" strokeLinecap="round"></path>
                      </svg>
                    </div>
                    <span className="menu-text">Agenda</span>
                  </div>
                </Link>
              </li>
            )}

            {/* Puedes agregar más elementos del menú aquí */}
          </ul>
        </nav>
      </div>

      <div id="content" className="main-content">
        <div className="layout-px-spacing">
          <Navbar />
          {fetchUsuario ? component : null}
        </div>
      </div>
    </div>
  )
}

export default MenuWeb