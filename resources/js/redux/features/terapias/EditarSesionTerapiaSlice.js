import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const editarSesionTerapia = createAsyncThunk(
    'terapia/editarSesionTerapia',
    async ({ id_sesion, sesion, sucursal }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API}/terapia_bajav/${id_sesion}`, {
                sesion,
                sucursal
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const EditarSesionTerapiaSlice = createSlice({
    name: 'editarSesionTerapia',
    initialState: {
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(editarSesionTerapia.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editarSesionTerapia.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(editarSesionTerapia.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.mensaje || 'Error al editar la sesión';
            });
    }
});

export default EditarSesionTerapiaSlice.reducer;