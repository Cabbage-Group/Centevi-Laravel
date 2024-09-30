import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';
import moment from 'moment';

const getCurrentDate = () => moment().format('YYYY-MM-DD');


export const fetchAtendidosPorDia = createAsyncThunk(
  'atendidosPorDia/fetchAtendidosPorDia',
  async ({ page = 1, limit = 10, orden = 'asc', ordenPor = 'PACIENTE_NOMBRE', startDate = getCurrentDate(), endDate = getCurrentDate(), search = '' }) => {
    try {
      const fecha = startDate && endDate ? `${startDate} - ${endDate}` : '';

      const response = await axios.get(`${API}/pacientesAtendidosPorDiaV2`, {
        params: { page, limit, orden, ordenPor, fecha, search },
      });

      console.log('meta:', response.data.meta);

      console.log('mensaje:', response.data);

      return response.data;
    } catch (error) {
      console.error('Error fetching pacientesAtendidosPorDiaV2:', error.response?.data || error.message);
      throw error;
    }
  }
);


const atendidosPorDiaSlice = createSlice({
  name: 'atendidosPorDia',
  initialState: {
    data: [],
    atendidosPorDia: [],
    meta: {},
    status: 'idle',
    error: null,
    orden: 'asc',
    ordenPor: 'PACIENTE_NOMBRE',
    startDate: getCurrentDate(),
    endDate: getCurrentDate(),
    search: '',
    dataexport: []
  },
  reducers: {
    setOrden(state, action) {
      state.orden = action.payload;
    },
    setFechaRange(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    setOrdenPor(state, action) {
      state.ordenPor = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAtendidosPorDia.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAtendidosPorDia.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.atendidosPorDia = action.payload.data;
        state.meta = action.payload.meta;
        state.dataexport = action.payload.export.dataexport;

      })
      .addCase(fetchAtendidosPorDia.rejected, (state, action) => {
        state.status = 'failed';
        state.data = [];
        state.dataexport = [];
        state.error = action.error.message;
      });
  },
});


export const { setOrden, setFechaRange, setOrdenPor, setSearch } = atendidosPorDiaSlice.actions;
export default atendidosPorDiaSlice.reducer;