import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fetchServicios = createAsyncThunk(
  'servicios/fetchServicios',
  async () => {
    try {
      const response = await axios.get(`${API}/servicios`);
      return response.data;
    } catch (error) {

      console.error('Error fetching servicios:', error.response.data);
      throw error;
    }
  }
);

const serviciosSlice = createSlice({
  name: 'servicios',
  initialState: {
    servicios: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServicios.pending, (state) => {
        state.status = 'loading';
        state.metaSucursales = {};
      })
      .addCase(fetchServicios.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.servicios = action.payload.data; 
      })
      .addCase(fetchServicios.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default serviciosSlice.reducer; 