import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';

export const fetchUsuarios = createAsyncThunk(
    'usuarios/fetchUsuarios',
    async ({ page = 1, limit = 2, sortOrder = 'asc', sortColumn = 'nombre' }) => {
        try {
            const response = await axios.get(`${API}/usuarios`, {
                params: { page, limit, sortOrder, sortColumn }
            });


            return response.data;
        } catch (error) {
            console.error('Error fetching usuarios:', error.response.data);
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
            });
    },
});

export default usuariosSlice.reducer;
