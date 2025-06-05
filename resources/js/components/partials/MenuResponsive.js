import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ValidarPermisos from '../../utils/ValidarPermisos';
import Navbar from './Navbar'

const MenuResponsive = ({ component, conversationsLength, fetchUsuario }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleSubmenu = (menuId) => {
        setActiveSubmenu(activeSubmenu === menuId ? null : menuId);
    };

    // Cerrar sidebar al hacer clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event) => {
            const sidebar = document.querySelector('.sidebar-wrapper');
            const menuToggle = document.querySelector('.mobile-menu-toggle');

            if (sidebar && !sidebar.contains(event.target) &&
                menuToggle && !menuToggle.contains(event.target) &&
                isSidebarOpen) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSidebarOpen]);

    return (
        <div className="mobile-app-container">
            {/* Botón de hamburguesa para móvil */}
            <button
                className="mobile-menu-toggle"
                onClick={toggleSidebar}
                aria-label="Toggle menu"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>

            {/* Overlay cuando el sidebar está abierto */}
            {isSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}

            <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="theme-logo">
                        <Link to="/home" onClick={() => setIsSidebarOpen(false)}>
                            <img
                                src="../img/centevi.png"
                                alt="Logo"
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        </Link>
                    </div>
                    <button
                        className="sidebar-close-btn"
                        onClick={toggleSidebar}
                        aria-label="Close menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <nav className="mobile-sidebar-nav">
                    <ul className="menu-categories">
                        <li className="menu-item inicio">
                            <Link
                                to="/home"
                                className="menu-link"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                                <span>AGENDA</span>
                            </Link>
                        </li>

                        {/* Menú Agenda */}
                        {ValidarPermisos("sidebar.agenda", (
                            <li className="menu-item">
                                <Link
                                    to="/ver-agenda"
                                    className="menu-link"
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <div style={{ width: '30px' }} >
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 9H21M7 3V5M17 3V5M6 12H8M11 12H13M16 12H18M6 15H8M11 15H13M16 15H18M6 18H8M11 18H13M16 18H18M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#1ABC9C" strokeWidth="2" strokeLinecap="round"></path>
                                        </svg>
                                    </div>
                                    <span>Agenda</span>
                                </Link>
                            </li>
                        ))}

                        {/* Puedes agregar más menús principales aquí siguiendo el mismo patrón */}

                    </ul>
                </nav>
            </div>

            {/* Contenido principal */}
            <div className="mobile-content">
                <Navbar />
                {component}
            </div>


            {/* Estilos (mejor mover a un archivo CSS aparte) */}
            <style jsx>{`
        .mobile-app-container {
          position: relative;
          min-height: 100vh;
        }
        
        .mobile-menu-toggle {
          position: fixed;
          top: 15px;
          left: 15px;
          z-index: 1000;
          background: #fff;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 999;
        }
        
        .sidebar-wrapper {
          position: fixed;
          top: 0;
          left: -280px;
          width: 280px;
          height: 100vh;
          background: #fff;
          z-index: 1000;
          transition: left 0.3s ease;
          overflow-y: auto;
          box-shadow: 2px 0 5px rgba(0,0,0,0.1);
        }
        
        .sidebar-wrapper.open {
          left: 0;
        }
        
        .sidebar-header {
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eee;
        }
        
        .sidebar-close-btn {
          background: none;
          border: none;
          padding: 5px;
        }
        
        .mobile-sidebar-nav {
          padding: 10px 0;
        }
        
        .menu-categories {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .menu-item {
          border-bottom: 1px solid #eee;
        }
        
        .menu-link {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          color: #333;
          text-decoration: none;
        }
        
        .menu-link svg {
          margin-right: 10px;
          flex-shrink: 0;
        }
        
        .has-submenu .menu-link {
          justify-content: space-between;
        }
        
        .submenu-arrow {
          transition: transform 0.3s ease;
        }
        
        .submenu-arrow.open {
          transform: rotate(180deg);
        }
        
        .submenu-list {
          list-style: none;
          padding: 0;
          margin: 0;
          background: #f9f9f9;
          display: none;
        }
        
        .submenu-list li a {
          display: block;
          padding: 10px 15px 10px 40px;
          color: #555;
          text-decoration: none;
        }
        
        .submenu-list li a:hover {
          background: #eee;
        }
        
        
        
        @media (min-width: 768px) {
          .mobile-menu-toggle {
            display: none;
          }
          
          .sidebar-wrapper {
            left: 0;
          }
          
          .mobile-content {
            margin-left: 280px;
            padding: 15px;
          }
        }
      `}</style>
        </div>
    );
};

export default MenuResponsive;