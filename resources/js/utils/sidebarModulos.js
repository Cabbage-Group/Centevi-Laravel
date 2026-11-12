// Lee del DOM del sidebar los submódulos visibles (ya filtrados por permisos)
export const obtenerModulosSidebar = () => {
  const items = new Map();

  document.querySelectorAll("#compact_submenuSidebar .submenu").forEach((submenu) => {
    const toggle = document.querySelector(`#compactSidebar a[href="#${submenu.id}"]`);
    const modulo = limpiarTexto(toggle?.textContent) || submenu.id;

    submenu.querySelectorAll("a[href]").forEach((link) => {
      agregar(items, link, modulo);
    });
  });

  // Módulos que son enlace directo (agenda, chat, ventas...)
  document.querySelectorAll('#compactSidebar a.menu-toggle[href^="/"]').forEach((link) => {
    agregar(items, link, limpiarTexto(link.textContent));
  });

  return [...items.values()];
};

export const buscarModuloPorUrl = (url) =>
  obtenerModulosSidebar().find((item) => item.url === url) || null;

export const normalizar = (texto = "") =>
  texto
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

const limpiarTexto = (texto) => (texto || "").replace(/\s+/g, " ").trim();

const agregar = (items, link, modulo) => {
  const url = link.getAttribute("href");
  const titulo = limpiarTexto(link.textContent);
  if (!url || url.startsWith("#") || !titulo || items.has(url)) return;
  items.set(url, { url, titulo, modulo });
};
