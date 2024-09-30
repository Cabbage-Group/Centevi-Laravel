import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Thunk para obtener datos de MostrarOrtoptica
export const fetchMostrarBajaVision = createAsyncThunk(
  'MostrarOrtoptica/fetchMostrarBajaVision',
  async ({ item = 'id_terapia', item2 = 'paciente', valor = '0', valor2 = '' }) => {
    const response = await axios.get(`${API}/mostrar-bajavision`, {
      params: { item, item2, valor, valor2 },
    });
    // console.log(response.data)
    return response.data;
  }
);
const MostrarBajaVisionSlice = createSlice({
  name: 'MostrarBajaVision',
  initialState: {
    dataBV: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMostrarBajaVision.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMostrarBajaVision.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dataBV = action.payload.dataBV;
        // console.log('Datos obtenidos:', state.dataOA);
      })
      .addCase(fetchMostrarBajaVision.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.dataBV = [];
      });
  },
});

export default MostrarBajaVisionSlice.reducer;

