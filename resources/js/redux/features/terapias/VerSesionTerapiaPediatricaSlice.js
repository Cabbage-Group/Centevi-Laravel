import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fetchSesionTerapiaPediatrica = createAsyncThunk(
  'terapia/sesionTerapiaPediatrica',
  async ({ id_paciente, id_terapia, id_sesion }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/terapia_optometria_pediatrica/${id_paciente}/${id_terapia}/${id_sesion}`);
      console.log('entre a la api:')
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const SesionTerapiaPediatricaSlice = createSlice({
  name: 'sesionTerapiaPediatrica',
  initialState: {
    paciente: null,
    terapia: null,
    sesion: {},
    status: 'idle',
    respuesta: false,
    error: null,
    loading: false,
  },
  reducers: {
    clearSesionTerapiaPediatrica: (state) => {
      state.paciente = null;
      state.terapia = null;
      state.sesion = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSesionTerapiaPediatrica.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSesionTerapiaPediatrica.fulfilled, (state, action) => {
        state.status = action.payload.status
        state.paciente = action.payload.data.paciente;
        state.terapia = action.payload.data.terapia;
        state.sesion = JSON.parse(action.payload.data.terapia.sesion);
        state.loading = false;
      })
      .addCase(fetchSesionTerapiaPediatrica.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});
export const { clearSesionTerapiaPediatrica } = SesionTerapiaPediatricaSlice.actions;
export default SesionTerapiaPediatricaSlice.reducer;