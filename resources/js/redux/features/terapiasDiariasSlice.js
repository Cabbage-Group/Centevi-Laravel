import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../config/config';
import moment from 'moment';


const getCurrentDate = () => moment().format('YYYY-MM-DD');


export const fetchTerapiasDiarias = createAsyncThunk(
  'terapiasDiarias/fetchTerapiasDiarias',
  async ({ page = 1, limit = 10, orden = 'asc', ordenPor = 'PACIENTE_NOMBRE', startDate = getCurrentDate(), endDate = getCurrentDate(), search = '' }) => {
    try {
      const fecha = startDate && endDate ? `${startDate} - ${endDate}` : '';

      const response = await axios.get(`${API}/pacientesTerapiasDiarias`, {
        params: { page, limit, orden, ordenPor, fecha, search },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching pacientesTerapiasDiarias:', error.response?.data || error.message);
      throw error;
    }
  }
);


const terapiasDiariasSlice = createSlice({
  name: 'terapiasDiarias',
  initialState: {
    data: [],
    terapiasDiarias: [],
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
    setSearch(state, action) { // Agrega el reducer para la búsqueda
      state.search = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTerapiasDiarias.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTerapiasDiarias.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.terapiasDiarias = action.payload.data;
        state.meta = action.payload.meta;
        state.dataexport = action.payload.export.dataexport;

      })
      .addCase(fetchTerapiasDiarias.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.terapiasDiarias = [];
      });
  },
});


export const { setOrden, setFechaRange, setOrdenPor, setSearch } = terapiasDiariasSlice.actions;
export default terapiasDiariasSlice.reducer;