import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fecthReportesOrdenes = createAsyncThunk(
  'reportesordenes/fecthReportesOrdenes',
  async ({
    page = 1,
    limit = 20,
    sortOrder = 'desc',
    sortColumn = 'created_at',
    status = '',
    lenteContacto = '',
    laboratorio = '',
    pagado = '',
    startDate = '',
    endDate = '',
    search = '',
  }) => {
    const fecha = startDate && endDate ? `${startDate} - ${endDate}` : '';

    const response = await axios.get(`${API}/reporte-ordenes`, {
      params: {
        page,
        limit,
        sortOrder,
        sortColumn,
        fecha,
        search,
        status,
        lenteContacto,
        laboratorio,
        pagado
      }
    });
    return response.data;
  }
);

export const fecthStatusTotals = createAsyncThunk(
  'reportesordenes/fecthStatusTotals',
  async ({
    page = 1,
    limit = 20,
    sortOrder = 'desc',
    sortColumn = 'created_at',
    startDate = '',
    endDate = '',
    search = '',
    lenteContacto = '',
    laboratorio = '',
    pagado = '',
  }) => {
    const statusValues = ['Ok', 'Advertencia', 'Critico', 'Completado'];
    const requests = statusValues.map(statusValue =>
      axios.get(`${API}/reporte-ordenes`, {
        params: {
          page,
          limit,
          sortOrder,
          sortColumn,
          fecha: startDate && endDate ? `${startDate} - ${endDate}` : '',
          search,
          status: statusValue,
          lenteContacto,
          laboratorio,
          pagado
        }
      })
    );

    const responses = await Promise.all(requests);

    // Formatear la respuesta para devolver los totales por cada status
    const totalsByStatus = responses.reduce((acc, response, index) => {
      const statusValue = statusValues[index];
      acc[statusValue] = response.data.meta.total;
      return acc;
    }, {});

    return totalsByStatus;
  }
);

export const fecthLenteContactoTotals = createAsyncThunk(
  'reportesordenes/fecthLenteContactoTotals',
  async ({
    page = 1,
    limit = 20,
    sortOrder = 'desc',
    sortColumn = 'created_at',
    startDate = '',
    endDate = '',
    search = '',
    status = '',
    laboratorio = '',
    pagado = '',
  }) => {
    const lenteContactoValues = [0, 1]; // Los valores posibles de lenteContacto (0 o 1)
    const requests = lenteContactoValues.map(lenteContactoValue =>
      axios.get(`${API}/reporte-ordenes`, {
        params: {
          page,
          limit,
          sortOrder,
          sortColumn,
          fecha: startDate && endDate ? `${startDate} - ${endDate}` : '',
          search,
          status,
          lenteContacto: lenteContactoValue,
          laboratorio,
          pagado
        }
      })
    );

    const responses = await Promise.all(requests);

    // Formatear la respuesta para devolver los totales por cada valor de lenteContacto
    const totalsByLenteContacto = responses.reduce((acc, response, index) => {
      const lenteContactoValue = lenteContactoValues[index];
      acc[lenteContactoValue] = response.data.meta.total;
      return acc;
    }, {});

    return totalsByLenteContacto;
  }
);

export const fecthLaboratorioTotals = createAsyncThunk(
  'reportesordenes/fecthLaboratorioTotals',
  async ({
    page = 1,
    limit = 20,
    sortOrder = 'desc',
    sortColumn = 'created_at',
    startDate = '',
    endDate = '',
    search = '',
    pagado = '',
  }) => {
    const laboratoriosValues = ['Ping', 'Optilab', 'Centilab', 'Vista Pro', 'Haseth J&J', 'Alcon', 'B+L'];
    const requests = laboratoriosValues.map(laboratoriosValue =>
      axios.get(`${API}/reporte-ordenes`, {
        params: {
          page,
          limit,
          sortOrder,
          sortColumn,
          fecha: startDate && endDate ? `${startDate} - ${endDate}` : '',
          search,
          laboratorio: laboratoriosValue,
          pagado
        }
      })
    );

    const responses = await Promise.all(requests);

    // Formatear la respuesta para devolver los totales por cada status
    const totalsByLaboratorios = responses.reduce((acc, response, index) => {
      const laboratoriosValue = laboratoriosValues[index];
      acc[laboratoriosValue] = response.data.meta.total;
      return acc;
    }, {});

    return totalsByLaboratorios;
  }
);

export const fecthPagadoTotals = createAsyncThunk(
  'reportesordenes/fecthPagadoTotals',
  async ({
    page = 1,
    limit = 20,
    sortOrder = 'desc',
    sortColumn = 'created_at',
    startDate = '',
    endDate = '',
    search = '',
  }) => {
    const pagadoValues = [0, 1, 2]; // Los valores posibles de lenteContacto (0 o 1)
    const requests = pagadoValues.map(pagadoValue =>
      axios.get(`${API}/reporte-ordenes`, {
        params: {
          page,
          limit,
          sortOrder,
          sortColumn,
          fecha: startDate && endDate ? `${startDate} - ${endDate}` : '',
          search,
          pagado: pagadoValue
        }
      })
    );

    const responses = await Promise.all(requests);

    // Formatear la respuesta para devolver los totales por cada valor de lenteContacto
    const totalsByPagado = responses.reduce((acc, response, index) => {
      const pagadoValue = pagadoValues[index];
      acc[pagadoValue] = response.data.meta.total;
      return acc;
    }, {});

    return totalsByPagado;
  }
);

export const fetchBranchTotals = createAsyncThunk(
  'reportesordenes/fetchBranchTotals',
  async ({sucursales = [],sucursalesNames = []}) => {
    const requests = sucursales.map(sucursal =>
      axios.get(`${API}/reporte-ordenes`, {
        params: {
          sucursales: sucursal
        }
      })
    );
    const responses = await Promise.all(requests);
    const totalsBySucursal = responses.reduce((acc, response, index) => {
      const sucursal = sucursalesNames[index];
      acc[sucursal] = response.data.meta.total;
      return acc;
    }, {});

    return totalsBySucursal;
  }
);

export const fetchDoctoresTotals = createAsyncThunk(
  'reportesordenes/fetchDoctoresTotals',
  async ({doctores = [],doctoresNames = []}) => {
    const requests = doctoresNames.map(doctor =>
      axios.get(`${API}/reporte-ordenes`, {
        params: {
          doctor: doctor
        }
      })
    );
    const responses = await Promise.all(requests);
    const totalsByDoctor= responses.reduce((acc, response, index) => {
      const doctor = doctoresNames[index];
      acc[doctor] = response.data.meta.total;
      return acc;
    }, {});

    return totalsByDoctor;
  }
);

export const fetchAsesoresTotals = createAsyncThunk(
  'reportesordenes/fetchAsesoresTotals',
  async ({asesores = [],asesoresNames = []}) => {
    console.log('asesores:',asesores)
    console.log('asesoresNames:',asesoresNames)
    const requests = asesoresNames.map(asesor =>
      axios.get(`${API}/reporte-ordenes`, {
        params: {
          asesor: asesor
        }
      })
    );
    console.log('requests:',requests)
    console.log('requests:',requests.data)

    const responses = await Promise.all(requests);
    console.log('responses:',responses.data)

    const totalsByAsesor= responses.reduce((acc, response, index) => {
      const asesor = asesoresNames[index];
      acc[asesor] = response.data.meta.total;
      return acc;
    }, {});

    return totalsByAsesor;
  }
);


const reportesOrdenesSlice = createSlice({
  name: 'reportesOrdenes',
  initialState: {
    reportesOrdenes: [],
    reportesOrdenesStatus: [],
    branchTotals: {},
    meta: {},
    dataexport: [],
    search: '',
    status: 'idle',
    error: null,
    sortOrder: 'desc',
    sortColumn: 'created_at',
  },
  reducers: {
    setSortOrder(state, action) {
      state.sortOrder = action.payload;
    },
    setSortColumn(state, action) {
      state.sortColumn = action.payload;
    },
    setFechaRange(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fecthReportesOrdenes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fecthReportesOrdenes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reportesOrdenes = action.payload.data;
        state.meta = action.payload.meta;
        state.dataexport = action.payload.export.dataexport;
      })
      .addCase(fecthReportesOrdenes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fecthStatusTotals.fulfilled, (state, action) => {
        state.statusTotals = action.payload;
      })
      .addCase(fecthStatusTotals.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fecthLenteContactoTotals.fulfilled, (state, action) => {
        state.lenteContactoTotals = action.payload;
      })
      .addCase(fecthLenteContactoTotals.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fecthLaboratorioTotals.fulfilled, (state, action) => {
        state.laboratoriosTotals = action.payload;
      })
      .addCase(fecthLaboratorioTotals.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fecthPagadoTotals.fulfilled, (state, action) => {
        state.pagadoTotals = action.payload;
      })
      .addCase(fecthPagadoTotals.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchBranchTotals.fulfilled, (state, action) => {
        state.branchTotals = action.payload;
      })
      .addCase(fetchBranchTotals.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchDoctoresTotals.fulfilled, (state, action) => {
        state.doctoresTotals = action.payload;
      })
      .addCase(fetchDoctoresTotals.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchAsesoresTotals.fulfilled, (state, action) => {
        state.asesoresTotals = action.payload;
      })
      .addCase(fetchAsesoresTotals.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const {
  setSortOrder,
  setSortColumn,
  setFechaRange,
  setSearch } = reportesOrdenesSlice.actions;
export default reportesOrdenesSlice.reducer;
