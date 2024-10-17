import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';

export const fetchUsuarios = createAsyncThunk(
  'usuarios/fetchUsuarios',
  async ({ page = 1, limit = 10000, sortOrder = 'asc', sortColumn = 'nombre', search = '' }) => {
    try {
      const response = await axios.get(`${API}/usuarios`, {
        params: { page, limit, sortOrder, sortColumn, search }
      });


      return response.data;
    } catch (error) {
      console.error('Error fetching usuarios:', error.response.data);
      throw error;
    }
  }
);


export const updateUsuario = createAsyncThunk(
  'usuarios/updateUsuario',
  async ({ id_usuario, data }) => {
    try {

      const formData = new FormData();
      formData.append('_method', 'PUT');
      for (const [key, value] of data.entries()) {
        formData.append(key, value);
      }

      const response = await axios.post(`${API}/usuarios/${id_usuario}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error updating usuario:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const deleteUsuario = createAsyncThunk(
  'usuarios/deleteUsuario',
  async (id_usuario) => {
    try {
      await axios.delete(`${API}/usuarios/${id_usuario}`);
      return id_usuario;
    } catch (error) {
      console.error('Error deleting usuario:', error.response.data);
      throw error;
    }
  }
);

export const createUsuario = createAsyncThunk(
  'usuarios/createUsuario',
  async (newUsuarioData) => {
    try {
      const response = await axios.post(`${API}/usuarios`, newUsuarioData);
      return response.data;
    } catch (error) {
      console.error('Error creating usuario:', error.response.data);
      throw error;
    }
  }
);


export const updateEstadoUsuario = createAsyncThunk(
  'usuarios/updateEstadoUsuario',
  async ({ id_usuario, estado }) => {
    try {
      const response = await axios.put(`${API}/usuarios/${id_usuario}`, { estado });
      return response.data;
    } catch (error) {
      console.error('Error updating usuario:', error.response.data);
      throw error;
    }
  }
);

const usuariosSlice = createSlice({
  name: 'usuarios',
  initialState: {
    data: [],
    usuarios: [],
    meta: {},
    status: 'idle',
    error: null,
    search: ''
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsuarios.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.usuarios = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchUsuarios.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateUsuario.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUsuario.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.usuarios.findIndex(receta => receta.id_usuario === action.payload.data.id_usuario);
        if (index !== -1) {
          state.usuarios[index] = action.payload.data;
        }
      })
      .addCase(updateUsuario.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteUsuario.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUsuario.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.usuarios = state.usuarios.filter(usuario => usuario.id_usuario !== action.payload);
      })
      .addCase(deleteUsuario.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateEstadoUsuario.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateEstadoUsuario.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Actualiza el estado del usuario en la lista local
        const updatedUsuario = action.payload.data;
        state.usuarios = state.usuarios.map(usuario =>
          usuario.id_usuario === updatedUsuario.id_usuario ? updatedUsuario : usuario
        );
      })
      .addCase(updateEstadoUsuario.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createUsuario.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUsuario.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.usuarios.push(action.payload.data);
      })
      .addCase(createUsuario.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default usuariosSlice.reducer;
