import React, { useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaStar, FaRegStar } from "react-icons/fa";
import { toggleFavorito } from "../../redux/features/favoritos/favoritosSlice";
import { obtenerModulosSidebar, normalizar } from "../../utils/sidebarModulos";
import "./SidebarBuscador.css";

const PANEL_WIDTH = 300;
const STRIP_ABIERTO_HEIGHT = 44;

const SidebarBuscador = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favoritos = useSelector((state) => state.favoritos.items);
  const id_usuario = Number(localStorage.getItem("id_usuario"));

  const stripRef = useRef(null);
  const inputRef = useRef(null);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [query, setQuery] = useState("");
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [modulos, setModulos] = useState([]);
  const [posicion, setPosicion] = useState({ top: 0, left: 0 });

  const abierto = hover || focus || query !== "" || soloFavoritos;
  const urlsFavoritas = useMemo(() => new Set(favoritos.map((f) => f.url)), [favoritos]);

  const prepararPanel = () => {
    setModulos(obtenerModulosSidebar());
    const rect = stripRef.current?.getBoundingClientRect();
    if (rect) {
      const left = Math.min(rect.left, window.innerWidth - PANEL_WIDTH - 8);
      setPosicion({ top: rect.top + STRIP_ABIERTO_HEIGHT + 4, left: Math.max(left, 8) });
    }
  };

  const resultados = useMemo(() => {
    const base = soloFavoritos ? favoritos : modulos;
    const termino = normalizar(query);
    if (!termino) return soloFavoritos ? base : [];
    return base.filter(
      (item) => normalizar(item.titulo).includes(termino) || normalizar(item.modulo).includes(termino)
    );
  }, [query, soloFavoritos, favoritos, modulos]);

  const cerrar = () => {
    setQuery("");
    setSoloFavoritos(false);
    setHover(false);
    inputRef.current?.blur();
  };

  const irA = (url) => {
    cerrar();
    navigate(url);
  };

  const onToggleFavorito = (e, item) => {
    e.stopPropagation();
    dispatch(toggleFavorito({ id_usuario, url: item.url, titulo: item.titulo, modulo: item.modulo }));
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") cerrar();
    if (e.key === "Enter" && resultados[0]) irA(resultados[0].url);
  };

  const mostrarPanel = abierto && (query !== "" || soloFavoritos);

  return (
    <li
      ref={stripRef}
      className={`sb-buscador ${abierto ? "sb-buscador--abierto" : ""}`}
      onMouseEnter={() => {
        prepararPanel();
        setHover(true);
      }}
      onMouseLeave={() => setHover(false)}
    >
      <div className="sb-linea" />

      <div className="sb-controles">
        <div className="sb-input">
          <FaSearch className="sb-input-icon" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder="Buscar módulo..."
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              prepararPanel();
              setFocus(true);
            }}
            onBlur={() => setFocus(false)}
            onKeyDown={onKeyDown}
          />
        </div>
        <button
          type="button"
          className={`sb-fav-toggle ${soloFavoritos ? "activo" : ""}`}
          title={soloFavoritos ? "Ver todos" : "Ver favoritos"}
          onClick={() => {
            prepararPanel();
            setSoloFavoritos((prev) => !prev);
          }}
        >
          {soloFavoritos ? <FaStar /> : <FaRegStar />}
        </button>
      </div>

      {mostrarPanel && (
        <div
          className="sb-panel"
          style={{ top: posicion.top, left: posicion.left, width: PANEL_WIDTH }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="sb-panel-titulo">
            {soloFavoritos ? "Favoritos" : "Resultados"}
            <span>{resultados.length}</span>
          </div>

          {resultados.length === 0 ? (
            <div className="sb-vacio">
              {soloFavoritos ? "Aún no tienes favoritos. Usa la ★ del menú superior." : "Sin coincidencias"}
            </div>
          ) : (
            <ul className="sb-lista">
              {resultados.map((item) => (
                <li key={item.url} onClick={() => irA(item.url)}>
                  <div className="sb-item-texto">
                    <span className="sb-item-titulo">{item.titulo}</span>
                    {item.modulo && <span className="sb-item-modulo">{item.modulo}</span>}
                  </div>
                  <button
                    type="button"
                    className={`sb-item-fav ${urlsFavoritas.has(item.url) ? "activo" : ""}`}
                    onClick={(e) => onToggleFavorito(e, item)}
                    title={urlsFavoritas.has(item.url) ? "Quitar de favoritos" : "Agregar a favoritos"}
                  >
                    {urlsFavoritas.has(item.url) ? <FaStar /> : <FaRegStar />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
};

export default SidebarBuscador;
