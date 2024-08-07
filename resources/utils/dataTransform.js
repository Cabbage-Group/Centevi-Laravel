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
    return data.map(consultaDiaria=> ({
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

