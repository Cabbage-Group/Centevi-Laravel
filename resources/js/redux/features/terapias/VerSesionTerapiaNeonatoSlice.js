import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fetchSesionTerapiaNeonato = createAsyncThunk(
  'terapiaNeonato/sesionTerapiaNeonato',
  async ({ id_paciente, id_terapia, id_sesion }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/terapia_optometria_neonatos/${id_paciente}/${id_terapia}/${id_sesion}`);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const SesionTerapiaNeonatoSlice = createSlice({
  name: 'sesionTerapiaNeonato',
  initialState: {
    paciente: null,
    terapia: null,
    sesion: {},
    status: 'idle',
    error: null,
    loading: false,
  },
  reducers: {
    clearSesionTerapiaNeonato: (state) => {
      state.paciente = null;
      state.terapia = null;
      state.sesion = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSesionTerapiaNeonato.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSesionTerapiaNeonato.fulfilled, (state, action) => {
        state.status = action.payload.status
        state.paciente = action.payload.data.paciente;
        state.terapia = action.payload.data.terapia;
        state.sesion = JSON.parse(action.payload.data.terapia.sesion);
      })
      .addCase(fetchSesionTerapiaNeonato.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});
export const { clearSesionTerapiaNeonato } = SesionTerapiaNeonatoSlice.actions;
export default SesionTerapiaNeonatoSlice.reducer;