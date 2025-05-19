import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';
import moment from 'moment';

export const fetchConsultasDiarias = createAsyncThunk(
  'consultasDiarias/fetchconsultasDiarias',
  async ({ page = 1, limit = 10, orden = 'asc', ordenPor = 'PACIENTE_NOMBRE', startDate = '', endDate = '', search = '', doctor = null }) => {
    try {

      const fecha = startDate && endDate ? `${startDate} - ${endDate}` : '';

      const params = { page, limit, orden, ordenPor, fecha, search };

      if (doctor) {
        params.doctor = doctor;
      }

      const response = await axios.get(`${API}/pacientesConsultasDiarias`, { params });

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
    startDate: '',
    endDate: '',
    search: '',
    doctor: '',
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
      });
  },
});


export const { setOrden, setFechaRange, setOrdenPor, setSearch } = consultasDiariasSlice.actions;
export default consultasDiariasSlice.reducer;