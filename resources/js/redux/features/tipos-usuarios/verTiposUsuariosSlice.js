import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fetchTiposUsuarios = createAsyncThunk(
  'tipoUsuarios/fecthTipoUsuarios',
  async ({ page = 1, limit = ''}) => {
    const response = await axios.get(`${API}/tipos-usuarios`, {
      params: { page, limit }
    });
    return response.data;
  }
);

export const createTiposUsuarios = createAsyncThunk(
    'tipoUsuarios/createTiposUsuarios',
    async (data) => {
      const response = await axios.post(`${API}/tipos-usuarios`, data);
      return response.data;
    }
  );
  


const tiposUsuariosSlice = createSlice({
  name: 'tiposUsuarios',
  initialState: {
    data: [],
    tiposUsuarios: [],
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
      .addCase(fetchTiposUsuarios.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTiposUsuarios.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tiposUsuarios = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchTiposUsuarios.rejected, (state, action) => {
        state.status = 'failed';
        state.tiposUsuarios = [];
        state.data = [];
        state.error = action.error.message;
      })
      .addCase(createTiposUsuarios.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createTiposUsuarios.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Aquí puedes manejar la respuesta después de crear o actualizar permisos, 
        // por ejemplo, actualizando la lista de permisos.
        state.data = action.payload.data; // Si es necesario
      })
      .addCase(createTiposUsuarios.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setOrden, setOrdenPor, setSearch } = tiposUsuariosSlice.actions;
export default tiposUsuariosSlice.reducer;
