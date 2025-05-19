import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const editarSesionTerapiaOrtoptica = createAsyncThunk(
    'terapia/editarSesionTerapiaOrtoptica',
    async ({ id_sesion, sesion, sucursal }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API}/terapia_ortoptica_adultos/${id_sesion}`, {
                sesion,
                sucursal
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const EditarSesionTerapiaOrtopticaSlice = createSlice({
    name: 'editarSesionTerapiaOrtoptica',
    initialState: {
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(editarSesionTerapiaOrtoptica.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editarSesionTerapiaOrtoptica.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(editarSesionTerapiaOrtoptica.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.mensaje || 'Error al editar la sesión';
            });
    }
});

export default EditarSesionTerapiaOrtopticaSlice.reducer;