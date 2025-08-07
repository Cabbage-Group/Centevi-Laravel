import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';
import Swal from 'sweetalert2';

export const fetchServicios = createAsyncThunk(
  'servicios/fetchServicios',
  async ({ search }) => {
    try {
      const response = await axios.get(`${API}/servicios`, {
        params: {
          search: search
        }
      });
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

export const updateServicios = createAsyncThunk(
  'servicios/updateServicios',
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API}/servicios/update/${id}`, data);

      Swal.fire({
        icon: 'success',
        title: 'Servicio actualizado',
        text: 'El servicio se ha actualizado correctamente',
        confirmButtonColor: '#3085d6'
      });

      return response.data;
    } catch (error) {
      console.error('Error updating servicio:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Hubo un error al actualizar el servicio',
        confirmButtonColor: '#d33'
      });

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createServicios = createAsyncThunk(
  'servicios/createServicios',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/servicios/store`, data);
      Swal.fire({
        icon: 'success',
        title: 'Servicio creado',
        text: 'El servicio se ha creado correctamente',
        confirmButtonColor: '#3085d6'
      });

      return response.data;
    } catch (error) {
      console.error('Error creating servicio:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Hubo un error al crear el servicio',
        confirmButtonColor: '#d33'
      });

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteServicios = createAsyncThunk(
  'servicios/deleteServicios',
  async (id_orden, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API}/servicios/delete/${id_orden}`);
      return response;
    } catch (error) {
      console.error('Error deleting servicio:', error.response?.data || error.message);
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
    status_servicios: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServicios.pending, (state) => {
        state.status_servicios = true;
        state.metaSucursales = {};
      })
      .addCase(fetchServicios.fulfilled, (state, action) => {
        state.status_servicios = false;
        state.servicios = action.payload.data;
      })
      .addCase(fetchServicios.rejected, (state, action) => {
        state.status_servicios = true;
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
            label: servicios.servicio_codigo + " | " + servicios.servicio_nombre
          }));
      })
      .addCase(fetchServiciosProximosAgenda.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateServicios.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateServicios.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.servicios.findIndex(servicio => servicio.id === action.payload.data.id);
        if (index !== -1) {
          state.servicios[index] = action.payload.data;
        }
      })
      .addCase(updateServicios.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createServicios.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createServicios.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.servicios.push(action.payload.data);
      })
      .addCase(createServicios.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteServicios.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteServicios.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.servicios = state.servicios.filter(
          servicio => servicio.id !== Number(action.payload.data.id)
        );
      })

      .addCase(deleteServicios.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

  },
});

export default serviciosSlice.reducer; 