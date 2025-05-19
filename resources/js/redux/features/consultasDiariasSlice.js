import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../config/config';
import moment from 'moment';

const getCurrentDate = () => moment().format('YYYY-MM-DD');


export const fetchConsultasDiarias = createAsyncThunk(
  'consultasDiarias/fetchconsultasDiarias',
  async ({ page = 1, limit = 10, orden = 'asc', ordenPor = 'PACIENTE_NOMBRE', startDate = getCurrentDate(), endDate = getCurrentDate(), search = '' }) => {
    try {

      const fecha = startDate && endDate ? `${startDate} - ${endDate}` : '';

      const response = await axios.get(`${API}/pacientesConsultasDiarias`, {
        params: { page, limit, orden, ordenPor, fecha, search },
      });

      console.log('mensaje:', response.data);

      return response.data;
    } catch (error) {
      console.error('Error fetching consultasDiarias:', error.response?.data || error.message);
      throw error;
    }
  }
);
const consultasDiariasSlice = createSlice({
  name: 'consultasDiarias',
  initialState: {
    data: [],
    consultasDiarias: [],
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
      .addCase(fetchConsultasDiarias.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchConsultasDiarias.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.consultasDiarias = action.payload.data;
        state.meta = action.payload.meta;
        state.dataexport = action.payload.export.dataexport;

      })
      .addCase(fetchConsultasDiarias.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.dataexport = [];
      });
  },
});


export const { setOrden, setFechaRange, setOrdenPor, setSearch } = consultasDiariasSlice.actions;
export default consultasDiariasSlice.reducer;