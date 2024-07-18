import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../config/config';

export const fetchUsuarios = createAsyncThunk(
    'usuarios/fetchUsuarios',
    async ({ page = 1, limit = 2, sortOrder = 'asc', sortColumn = 'nombre' }) => {
        try {
            const response = await axios.get(`${API}/usuarios`, {
                params: { page, limit, sortOrder, sortColumn }
            });

            console.log('mensaje:', response.data)

            return response.data;
        } catch (error) {
            console.error('Error fetching usuarios:', error.response.data);
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
            });
    },
});

export default usuariosSlice.reducer;
