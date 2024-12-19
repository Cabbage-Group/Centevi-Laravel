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
      });
  },
});

export const {
  setSortOrder,
  setSortColumn,
  setFechaRange,
  setSearch } = reportesOrdenesSlice.actions;
export default reportesOrdenesSlice.reducer;
