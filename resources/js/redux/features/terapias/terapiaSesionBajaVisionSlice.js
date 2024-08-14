import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const SesionTerapiaBajaVision = createAsyncThunk(
    'TerapiaBajaVision/SesionTerapiaBajaVision',
    async (id_terapia, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API}/terapia_bajav/${id_terapia}`);
            return response.data;

        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Acción para agregar una nueva sesión de terapia
export const agregarSesionTerapiaBajaVision = createAsyncThunk(
    'TerapiaBajaVision/agregarSesionTerapiaBajaVision',
    async (nuevaSesion, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API}/terapia_bajav`, nuevaSesion);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Acción para editar una sesión de terapia
export const editarSesionTerapiaBajaVision = createAsyncThunk(
    'TerapiaBajaVision/editarSesionTerapiaBajaVision',
    async ({ id, pagado }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API}/terapia_bajav/${id}`, {pagado});
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const SesionTerapiaBajaVisionSlice = createSlice({
    name: 'sesionTerapiaBajaVision',
    initialState: {
        data: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(SesionTerapiaBajaVision.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(SesionTerapiaBajaVision.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.data; // Aquí se asegura de que se asigna 'data' correctamente
            })
            .addCase(SesionTerapiaBajaVision.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.error : action.error.message;
            })

            // Manejo de la solicitud POST para agregar una nueva sesión
            .addCase(agregarSesionTerapiaBajaVision.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(agregarSesionTerapiaBajaVision.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.push(action.payload.data); // Agrega la nueva sesión al estado actual
            })
            .addCase(agregarSesionTerapiaBajaVision.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.error : action.error.message;
            })

            // Manejo de la solicitud PUT para editar una sesión
            .addCase(editarSesionTerapiaBajaVision.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editarSesionTerapiaBajaVision.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.data.findIndex((session) => session.id === action.payload.data.id);
                if (index !== -1) {
                    state.data[index] = action.payload.data;
                }
            })
            .addCase(editarSesionTerapiaBajaVision.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.error : action.error.message;
            });
    },
});

export default SesionTerapiaBajaVisionSlice.reducer;
