import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fetchTiposPermisos = createAsyncThunk(
  'tiposPermisos/fetchTiposPermisos',
  async () => {
    const response = await axios.get(`${API}/tipos-permisos`, {
    });
    console.log('hola')
    return response.data;
  }
);

export const createTiposPermisos = createAsyncThunk(
  'tiposPermisos/createTiposPermisos',
  async (data) => {
    const response = await axios.post(`${API}/tipos-permisos`, data);
    return response.data;
  }
);


const TiposPermisosSlice = createSlice({
  name: 'tiposPermisos',
  initialState: {
    data: [],
    tiposPermisos: [],
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
      .addCase(fetchTiposPermisos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTiposPermisos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tiposPermisos = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchTiposPermisos.rejected, (state, action) => {
        state.status = 'failed';
        state.tiposPermisos = [];
        state.data = [];
        state.error = action.error.message;
      })
      .addCase(createTiposPermisos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createTiposPermisos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Aquí puedes manejar la respuesta después de crear o actualizar permisos, 
        // por ejemplo, actualizando la lista de permisos.
        state.data = action.payload.data; // Si es necesario
      })
      .addCase(createTiposPermisos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setOrden, setOrdenPor, setSearch } = TiposPermisosSlice.actions;

export default TiposPermisosSlice.reducer;
