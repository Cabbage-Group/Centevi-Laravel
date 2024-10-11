import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';

// Acción asíncrona para obtener el total de pacientes menores de 18 años
export const fetchTotalPacientesAdultos = createAsyncThunk(
  'pacientesAdultos/fetchTotal',
  async () => {
      const response = await axios.get(`${API}/pacientes-adultos`); // Reemplaza con la URL de tu API
      return response.data.total;
    }
);

const pacientesAdultosSlice = createSlice({
  name: 'pacientesAdultos',
  initialState: {
    totalAdultos: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalPacientesAdultos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalPacientesAdultos.fulfilled, (state, action) => {
        state.totalAdultos = action.payload;
        state.loading = false;
      })
      .addCase(fetchTotalPacientesAdultos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default pacientesAdultosSlice.reducer;
