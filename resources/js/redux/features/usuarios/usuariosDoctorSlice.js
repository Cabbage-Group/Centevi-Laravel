import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';

// Acción asíncrona para obtener el total de pacientes menores de 18 años
export const fetchTotalUsuariosDoctor = createAsyncThunk(
  'usuariosDoctor/fetchTotal',
  async () => {
      const response = await axios.get(`${API}/usuarios-doctor`); // Reemplaza con la URL de tu API
      return response.data.total;
    }
);

const usuariosDoctorSlice = createSlice({
  name: 'usuariosDoctor',
  initialState: {
    totalDoctor: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalUsuariosDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalUsuariosDoctor.fulfilled, (state, action) => {
        state.totalDoctor = action.payload;
        state.loading = false;
      })
      .addCase(fetchTotalUsuariosDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default usuariosDoctorSlice.reducer;
