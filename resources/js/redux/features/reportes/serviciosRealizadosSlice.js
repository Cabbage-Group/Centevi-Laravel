import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';

export const fetchServiciosRealizados = createAsyncThunk(
  'serviciosRealizados/fetchServiciosRealizados',
  async ({
    page = 1,
    limit = 10,
    sortOrder = 'asc',
    sortColumn = 'ID_CONSULTA',
    startDate = '',
    endDate = '',
    search = '',
  }) => {
    try {
      const fecha = startDate && endDate ? `${startDate} - ${endDate}` : '';

      const params = {
        page,
        limit,
        sortOrder,
        sortColumn,
        fecha,
        search
      };
      const response = await axios.get(`${API}/reportes-servicios-realizados`, { params })
      return response.data;
    } catch (error) {
      console.error('Error fetching pacientesServiciosRealizados:', error.response?.data || error.message);
      throw error;
    }
  }
);


const serviciosRealizadosSlice = createSlice({
  name: 'serviciosRealizados',
  initialState: {
    serviciosRealizados: [],
    status: 'idle',
    error: null,
    meta: {},
    dataexport: [],

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
      .addCase(fetchServiciosRealizados.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchServiciosRealizados.fulfilled, (state, action) => {
        console.log('la data llego:', action.payload.data)
        state.status = 'succeeded';
        state.serviciosRealizados = action.payload.data;
        state.meta = action.payload.meta;
        state.dataexport = action.payload.export.dataexport;
      })
      .addCase(fetchServiciosRealizados.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {
  setSortOrder,
  setSortColumn,
  setFechaRange,
  setSearch,
} = serviciosRealizadosSlice.actions;
export default serviciosRealizadosSlice.reducer;