import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const editarSesionTerapiaPediatrica = createAsyncThunk(
    'terapia/editarSesionTerapiaPediatrica',
    async ({ id_sesion, sesion, sucursal }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API}/terapia_optometria_pediatrica/${id_sesion}`, {
                sesion,
                sucursal
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const EditarSesionTerapiaPediatricaSlice = createSlice({
    name: 'editarSesionTerapiaPediatrica',
    initialState: {
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(editarSesionTerapiaPediatrica.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editarSesionTerapiaPediatrica.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(editarSesionTerapiaPediatrica.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.mensaje || 'Error al editar la sesión';
            });
    }
});

export default EditarSesionTerapiaPediatricaSlice.reducer;