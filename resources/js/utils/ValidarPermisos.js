import { useSelector } from "react-redux";

export default function (permiso, componente) {
  const { permisos } = useSelector(({ auth }) => auth);

  if (localStorage.getItem('tpuprivilegio') == "todo") {
    return componente
  }

  let tienePermiso = false

  permisos.map((pem) => {
    if (permiso == pem.slug) {
      tienePermiso = true
    }
  })

  if (tienePermiso) {
    return componente
  } else {
    return null
  }
}


export function funPermisosObtenidos(permisos, permiso, componente) {
  if (localStorage.getItem('tpuprivilegio') == "todo") {
    return componente
  }

  let tienePermiso = false

  permisos.map((pem) => {
    if (permiso == pem.slug) {
      tienePermiso = true
    }
  })

  if (tienePermiso) {
    return componente
  } else {
    return null
  }
}

export function funPermisosObtenidosIf(permisos, permiso, componente, componenteIf) {
  if (localStorage.getItem('tpuprivilegio') == "todo") {
    return componente
  }

  let tienePermiso = false

  permisos.map((pem) => {
    if (permiso == pem.pemslug) {
      tienePermiso = true
    }
  })

  if (tienePermiso) {
    return componente
  } else {
    return componenteIf
  }
}

export function funPermisosObtenidosBoolean(permisos, permiso) {
  if (localStorage.getItem('tpuprivilegio') == "todo") {
    return true
  }

  let tienePermiso = false

  permisos.map((pem) => {
    if (permiso == pem.slug) {
      tienePermiso = true
    }
  })

  if (tienePermiso) {
    return true
  } else {
    return false
  }
}

export function getMaxDiscountFromPermisos(permisos) {
  if (localStorage.getItem("tpuprivilegio") === "todo") {
    return 100;
  }

  let maxDiscount = 0;

  permisos.forEach((pem) => {
    if (pem.slug.startsWith("cotizaciones.descuentos.productos.")) {
      const parts = pem.slug.split(".");
      const value = parseFloat(parts[parts.length - 1]);
      if (!isNaN(value) && value > maxDiscount) {
        maxDiscount = value;
      }
    }
  });

  return maxDiscount;
}