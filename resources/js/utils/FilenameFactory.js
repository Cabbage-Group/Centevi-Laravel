/**
 * 
 * @param {*} baseName titulo del archivo
 * @param {*} ext extension del archivo
 * @param {*} options opciones extra como el usernanme del usaurio 
 * @returnsun nombre de archiuvo unico diferenciable
 */
export const filenameFactory = (baseName, ext = "pdf", options = {}) => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toTimeString().slice(0, 5).replace(":", "-");

  let name = `${baseName}_${date}_${time}`;

  if (options.user) {
    // Sanear nombre del usuario: eliminar espacios y caracteres especiales
    const safeUser = options.user
      .trim()
      .replace(/\s+/g, "")          // eliminar espacios
      .replace(/[^\w.-]/g, "");     // solo deja letras, números, _ . -
    name += `_${safeUser}`;
  }
  if (options.unique) {
    name += `_${Math.random().toString(36).substring(2, 6)}`; // genera caracteres aleatorrios al final para que sea unico
  }

  return `${name}.${ext}`;
};
