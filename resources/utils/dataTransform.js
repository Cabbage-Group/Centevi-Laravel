// Función para transformar datos de terapias
export const transformDataForTerapias = (data) => {
  return data.map(terapia => ({
    Nombre: terapia.PACIENTE_NOMBRE.trim(),
    Cedula: terapia.PACIENTE_CEDULA,
    Sucursal: terapia.SUCURSAL,
    Celular: terapia.PACIENTE_CELULAR,
    Tipo: terapia.TIPO,
    Fecha: terapia.FECHA_ATENCION,
    Doctor: terapia.DOCTOR
  }));
};

export const transformDataForConsultasDiarias = (data) => {
  return data.map(consultaDiaria => ({
    Nombre: consultaDiaria.PACIENTE_NOMBRE.trim(),
    Cedula: consultaDiaria.PACIENTE_CEDULA,
    Sucursal: consultaDiaria.SUCURSAL,
    Celular: consultaDiaria.PACIENTE_CELULAR,
    Tipo: consultaDiaria.TIPO,
    Fecha: consultaDiaria.FECHA_ATENCION,
    Doctor: consultaDiaria.DOCTOR
  }));
};



export const transformDataForUltimaAtencion = (data) => {
  return data.map(ultAten => ({
    Nombres: ultAten.nombres.trim(),
    Cedula: ultAten.nro_cedula,
    Email: ultAten.email,
    Direccion: ultAten.direccion,
    UltimaAtencion: ultAten.ultima_atencion,
    Doctores: ultAten.doctores
  }));
};


export const transformDataForAtendidosPorDia = (data) => {
  return data.map(atendidoPorDia => ({
    Nombre: atendidoPorDia.PACIENTE_NOMBRE.trim(),
    Cedula: atendidoPorDia.PACIENTE_CEDULA,
    Sucursal: atendidoPorDia.SUCURSAL,
    Celular: atendidoPorDia.PACIENTE_CELULAR,
    Tipo: atendidoPorDia.TIPO,
    Fecha: atendidoPorDia.FECHA_ATENCION,
    Doctor: atendidoPorDia.DOCTOR
  }));
};

export const transformDataForProximasCitas = (data) => {
  return data.map(proximaCita => ({
    Fecha_Proxima_Cita: proximaCita.PROXIMA_FECHA.trim(),
    Nombre: proximaCita.PACIENTE_NOMBRE.trim(),
    Email: proximaCita.PACIENTE_EMAIL,
    Celular: proximaCita.PACIENTE_CELULAR,
    Sucursal: proximaCita.SUCURSAL,
    Doctor: proximaCita.DOCTOR,
    Se_Contacto: proximaCita.CONTACTO === 1 ? 'Sí' : 'No',
    Se_Agendo: proximaCita.SE_AGENDO === 1 ? 'Sí' : 'No',
  }));
};

export const transformDataForSinAtencion = (data) => {
  return data.map(pacienteSinAtencion => ({
    Fecha_Proxima_Cita: pacienteSinAtencion.nombres.trim(),
    Nombre: pacienteSinAtencion.nro_cedula.trim(),
    Email: pacienteSinAtencion.email,
    Celular: pacienteSinAtencion.celular,
  }));
};

export const transformDataForServiciosRealizados = (data) => {
  return data.map(serviciosR => ({
    ID_CONSULTA: serviciosR.ID_CONSULTA,
    Fecha_Consulta: serviciosR.FECHA_CONSULTA.trim(),
    Consulta: serviciosR.CONSULTA,
    Cedula: serviciosR.CEDULA,
    Paciente: serviciosR.PACIENTE,
    Servicio_Realizado: serviciosR.SERVICIO_REALIZADO,
  }));
};

export const transformDataForServiciosProximos = (data) => {
  return data.map(serviciosP => ({
    ID_CONSULTA: serviciosP.ID_CONSULTA,
    Fecha_Consulta: serviciosP.FECHA_CONSULTA.trim(),
    Consulta: serviciosP.CONSULTA,
    Cedula: serviciosP.CEDULA,
    Paciente: serviciosP.PACIENTE,
    Servicio_Realizado: serviciosP.SERVICIO_PROXIMO,
  }));
};


