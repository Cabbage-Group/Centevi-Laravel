import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';

// Acción asíncrona para obtener el total de pacientes menores de 18 años
export const fetchTotalPacientesMenores = createAsyncThunk(
  'pacientesMenores/fetchTotal',
  async () => {
    const response = await axios.get(`${API}/pacientes-menores`); // Reemplaza con la URL de tu API
    return response.data.total;
  }
);

const pacientesMenoresSlice = createSlice({
  name: 'pacientesMenores',
  initialState: {
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalPacientesMenores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalPacientesMenores.fulfilled, (state, action) => {
        state.total = action.payload;
        state.loading = false;
      })
      .addCase(fetchTotalPacientesMenores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default pacientesMenoresSlice.reducer;
