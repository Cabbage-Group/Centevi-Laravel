import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fetchPermisos = createAsyncThunk(
  'permisos/fetchPermisos',
  async (id) => {
    const response = await axios.get(`${API}/permisos/findAllUsuarioPermisos/${id}`, {
    });
    return response.data;
  }
);

export const createOrUpdatePermisosUsuario = createAsyncThunk(
  'permisos/createOrUpdatePermisosUsuario',
  async (data) => {
    const response = await axios.post(`${API}/permisos/createOrUpdatePermisosUsuario`, data);
    return response.data;
  }
);

export const createPermisos = createAsyncThunk(
  'permisos/createPermisos',
  async (data) => {
    const response = await axios.post(`${API}/permisos`, data);
    return response.data;
  }
);



const permisosSlice = createSlice({
  name: 'permisos',
  initialState: {
    data: [],
    permisos: [],
    meta: {},
    status: 'idle',
    error: null,
    // orden: 'asc',
    // ordenPor: 'PACIENTE_NOMBRE',
    // search: '',
  },
  reducers: {
    setOrden(state, action) {
      state.orden = action.payload;
    },
    setOrdenPor(state, action) {
      state.ordenPor = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermisos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPermisos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.permisos = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchPermisos.rejected, (state, action) => {
        state.status = 'failed';
        state.permisos = [];
        state.data = [];
        state.error = action.error.message;
      })
      .addCase(createPermisos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPermisos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Aquí puedes manejar la respuesta después de crear o actualizar permisos, 
        // por ejemplo, actualizando la lista de permisos.
        state.data = action.payload.data; // Si es necesario
      })
      .addCase(createPermisos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createOrUpdatePermisosUsuario.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrUpdatePermisosUsuario.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Aquí puedes manejar la respuesta después de crear o actualizar permisos, 
        // por ejemplo, actualizando la lista de permisos.
        state.data = action.payload.data; // Si es necesario
      })
      .addCase(createOrUpdatePermisosUsuario.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setOrden, setOrdenPor, setSearch } = permisosSlice.actions;

export default permisosSlice.reducer;
