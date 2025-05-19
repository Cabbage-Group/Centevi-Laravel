import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Thunk para obtener datos de MostrarOrtoptica
export const fetchMostrarPediatrica = createAsyncThunk(
  'MostrarPediatrica/fetchMostrarPediatrica',
  async ({ item = 'id_terapia', item2 = 'paciente', valor = '0', valor2 = '' }) => {
    const response = await axios.get(`${API}/mostrar-pediatrica`, {
      params: { item, item2, valor, valor2 },
    });
    // console.log(response.data)
    return response.data;
  }
);
const MostrarPediatricaSlice = createSlice({
  name: 'MostrarPediatrica',
  initialState: {
    dataOP: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMostrarPediatrica.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMostrarPediatrica.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dataOP = action.payload.dataOP;
        // console.log('Datos obtenidos:', state.dataOA);
      })
      .addCase(fetchMostrarPediatrica.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.dataOP = [];
      });
  },
});

export default MostrarPediatricaSlice.reducer;

