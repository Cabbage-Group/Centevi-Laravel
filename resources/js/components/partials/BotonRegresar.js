import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { obtenerModulosSidebar } from '../../utils/sidebarModulos';

const RUTAS_RAIZ_FIJAS = ['/', '/home'];
const STORAGE_ULTIMA_RAIZ = 'ultima_vista_raiz';

// Vista raíz = /home o cualquier página a la que se llega directo desde el sidebar
const esVistaRaiz = (pathname) =>
  RUTAS_RAIZ_FIJAS.includes(pathname) || obtenerModulosSidebar().some((m) => m.url === pathname);

const BotonRegresar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const permisos = useSelector((state) => state.auth.permisos);
  const [raiz, setRaiz] = useState(true);

  // Se recalcula tras el render porque los links del sidebar dependen de los permisos
  useEffect(() => {
    const timer = setTimeout(() => {
      const esRaiz = esVistaRaiz(pathname);
      setRaiz(esRaiz);
      if (esRaiz) {
        try {
          sessionStorage.setItem(STORAGE_ULTIMA_RAIZ, pathname);
        } catch (e) { /* sin storage disponible */ }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname, permisos]);

  const regresar = () => {
    // idx lo guarda react-router: > 0 significa que hay una vista anterior dentro de la app
    if ((window.history.state?.idx ?? 0) > 0) {
      navigate(-1);
      return;
    }

    let destino = '/home';
    try {
      destino = sessionStorage.getItem(STORAGE_ULTIMA_RAIZ) || '/home';
    } catch (e) { /* sin storage disponible */ }
    navigate(destino === pathname ? '/home' : destino);
  };

  if (raiz) return null;

  return (
    <button type="button" className="nav-back-btn" onClick={regresar} title="Regresar">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      <span>Regresar</span>
    </button>
  );
};

export default BotonRegresar;
