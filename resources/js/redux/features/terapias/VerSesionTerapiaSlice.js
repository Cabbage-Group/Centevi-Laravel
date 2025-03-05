import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fetchSesionTerapia = createAsyncThunk(
  'terapia/sesionTerapia',
  async ({ id_paciente, id_terapia, id_sesion }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/terapia_bajav/${id_paciente}/${id_terapia}/${id_sesion}`);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }

);

const SesionTerapiaSlice = createSlice({
  name: 'sesionTerapia',
  initialState: {
    paciente: null,
    terapia: null,
    sesion: {},
    status: 'idle',
    error: null,
    loading: false,
  },
  reducers: {
    clearSesionTerapiaBajaVision: (state) => {
      state.paciente = null;
      state.terapia = null;
      state.sesion = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSesionTerapia.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSesionTerapia.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.paciente = action.payload.data.paciente;
        state.terapia = action.payload.data.terapia;
        state.sesion = JSON.parse(action.payload.data.terapia.sesion);
        state.loading = false;
      })
      .addCase(fetchSesionTerapia.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});
export const { clearSesionTerapiaBajaVision } = SesionTerapiaSlice.actions;
export default SesionTerapiaSlice.reducer;