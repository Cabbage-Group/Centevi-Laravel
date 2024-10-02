import moment from 'moment-timezone';

// Función para detectar automáticamente la zona horaria del usuario
export const getUserTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

// Función para obtener la fecha actual en la zona horaria especificada o la detectada automáticamente
export const getCurrentDate = (format = 'YYYY-MM-DD HH:mm:ss', timeZone) => {
  const userTimeZone = timeZone || getUserTimeZone(); // Si no se proporciona zona horaria, usar la detectada
  return moment.tz(userTimeZone).format(format);
};

// Función para obtener la fecha actual en la zona horaria especificada o la detectada automáticamente
export const getCurrentMMYYYYDate = (format = 'YYYY-MM-DD', timeZone) => {
  const userTimeZone = timeZone || getUserTimeZone();
  return moment.tz(userTimeZone).format(format);
};

// Función para formatear una fecha dada en la zona horaria especificada o la detectada automáticamente
export const formatDate = (date, format = 'YYYY-MM-DD', timeZone) => {
  const userTimeZone = timeZone || getUserTimeZone(); // Si no se proporciona zona horaria, usar la detectada
  return moment.tz(date, userTimeZone).format(format);
};
