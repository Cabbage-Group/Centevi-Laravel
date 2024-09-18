import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const editarSesionTerapiaNeonato = createAsyncThunk(
    'terapia/editarSesionTerapiaNeonato',
    async ({ id_sesion, sesion, sucursal }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API}/terapia_optometria_neonatos/${id_sesion}`, {
                sesion,
                sucursal
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const EditarSesionTerapiaNeonatoSlice = createSlice({
    name: 'editarSesionTerapiaNeonato',
    initialState: {
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(editarSesionTerapiaNeonato.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editarSesionTerapiaNeonato.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(editarSesionTerapiaNeonato.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.mensaje || 'Error al editar la sesión';
            });
    }
});

export default EditarSesionTerapiaNeonatoSlice.reducer;