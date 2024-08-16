import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const SesionTerapiaPediatrica = createAsyncThunk(
    'TerapiaPediatrica/SesionTerapiaPediatrica',
    async (id_terapia, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API}/terapia_optometria_pediatrica/${id_terapia}`);
            return response.data;

        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Acción para agregar una nueva sesión de terapia
export const agregarSesionTerapiaPediatrica = createAsyncThunk(
    'TerapiaPediatrica/agregarSesionTerapiaPediatrica',
    async (nuevaSesion, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API}/terapia_optometria_pediatrica`, nuevaSesion);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Acción para editar una sesión de terapia
export const editarSesionTerapiaPediatrica = createAsyncThunk(
    'TerapiaPediatrica/editarSesionTerapiaPediatrica',
    async ({ id, pagado }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API}/terapia_optometria_pediatrica/${id}`, {pagado});
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const SesionTerapiaPediatricaSlice = createSlice({
    name: 'sesionTerapiaPediatrica',
    initialState: {
        data: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(SesionTerapiaPediatrica.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(SesionTerapiaPediatrica.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.data; // Aquí se asegura de que se asigna 'data' correctamente
            })
            .addCase(SesionTerapiaPediatrica.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.error : action.error.message;
            })

            // Manejo de la solicitud POST para agregar una nueva sesión
            .addCase(agregarSesionTerapiaPediatrica.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(agregarSesionTerapiaPediatrica.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.push(action.payload.data); // Agrega la nueva sesión al estado actual
            })
            .addCase(agregarSesionTerapiaPediatrica.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.error : action.error.message;
            })

            // Manejo de la solicitud PUT para editar una sesión
            .addCase(editarSesionTerapiaPediatrica.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editarSesionTerapiaPediatrica.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.data.findIndex((session) => session.id === action.payload.data.id);
                if (index !== -1) {
                    state.data[index] = action.payload.data;
                }
            })
            .addCase(editarSesionTerapiaPediatrica.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.error : action.error.message;
            });
    },
});

export default SesionTerapiaPediatricaSlice.reducer;
