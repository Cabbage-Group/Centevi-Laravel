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

export const fetchServiciosProximosAgenda = createAsyncThunk(
  'servicios/fetchServiciosProximos',
  async ({ consulta_nombre, consulta_id }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/proximos-servicios/servicios-realizados`, {
        params: { consulta_nombre: consulta_nombre, consulta_id },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching servicios próximos:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const serviciosSlice = createSlice({
  name: 'servicios',
  initialState: {
    servicios: [],
    serviciosProximos: [],
    serviciosProximos_options: [],
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
      })
      .addCase(fetchServiciosProximosAgenda.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchServiciosProximosAgenda.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.serviciosProximos = action.payload.data;
        state.serviciosProximos_options = state.serviciosProximos
        .map(servicios => ({
          value: servicios.servicios_id,
          label: servicios.servicio_codigo +  " | " +  servicios.servicio_nombre 
        }));
      })
      .addCase(fetchServiciosProximosAgenda.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default serviciosSlice.reducer; 