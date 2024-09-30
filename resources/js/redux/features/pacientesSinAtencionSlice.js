import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../config/config';


export const fetchPacientesSinAtencion = createAsyncThunk(
  'pacientesSinAtencion/fetchPacientesSinAtencion',
  async ({ page = 1, limit = 20, orden = 'asc', ordenPor = 'nombres', startDate = '', endDate = '', search = '' }) => {
    try {
      const fecha = startDate && endDate ? `${startDate} - ${endDate}` : '';

      const response = await axios.get(`${API}/pacientesSinAtender`, {
        params: { page, limit, orden, ordenPor, fecha, search },
      });

      console.log('mensaje:', response.data);

      return response.data;
    } catch (error) {
      console.error('Error fetching pacientesSinAtencion:', error.response?.data || error.message);
      throw error;
    }
  }
);


const pacientesSinAtencionSlice = createSlice({
  name: 'pacientesSinAtencion',
  initialState: {
    data: [],
    pacientesSinAtencion: [],
    meta: {},
    status: 'idle',
    error: null,
    orden: 'asc',
    ordenPor: 'nombres',
    startDate: '',
    endDate: '',
    search: '',  // Agrega el estado de búsqueda
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPacientesSinAtencion.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPacientesSinAtencion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pacientesSinAtencion = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchPacientesSinAtencion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.pacientesSinAtencion = [];
      });
  },
});


export const { setOrden, setFechaRange, setOrdenPor, setSearch } = pacientesSinAtencionSlice.actions;
export default pacientesSinAtencionSlice.reducer;