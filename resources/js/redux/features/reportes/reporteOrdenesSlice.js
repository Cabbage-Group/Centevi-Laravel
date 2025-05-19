import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';


export const fetchReportesOrdenes = createAsyncThunk(
  'reportesordenes/fetchReportesOrdenes',
  async ({
    page = 1,
    limit = 20,
    sortOrder = 'desc',
    sortColumn = 'created_at',
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
        search
      }
    });
    return response.data;
  }
);

const reportesOrdenesSlice = createSlice({
  name: 'reportesOrdenes',
  initialState: {
    reportesOrdenes: [],
    reportesOrdenesStatus: [],
    branchTotals: {},
    estados: {},
    lentes: {},
    laboratorios: {},
    pagos: {},
    doctores: {},
    sucursales: {},
    asesores: {},
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportesOrdenes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReportesOrdenes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reportesOrdenes = action.payload.data;
        state.meta = action.payload.meta;
        state.estadisticas = action.payload.estadisticas;
        state.estados = action.payload.estadisticas.estados;
        state.lentes = action.payload.estadisticas.lentes;
        state.laboratorios = action.payload.estadisticas.laboratorios;
        state.pagos = action.payload.estadisticas.pagos;
        state.doctores = action.payload.estadisticas.doctores;
        state.sucursales = action.payload.estadisticas.sucursales;
        state.asesores = action.payload.estadisticas.asesores;
        state.dataexport = action.payload.export.dataexport;
      })
      .addCase(fetchReportesOrdenes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  },
});

export const {
  setSortOrder,
  setSortColumn,
  setFechaRange,
  setSearch } = reportesOrdenesSlice.actions;
export default reportesOrdenesSlice.reducer;
