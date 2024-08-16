import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const SesionTerapiaNeonatos = createAsyncThunk(
    'TerapiaNeonatos/SesionTerapiaNeonatos',
    async (id_terapia, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API}/terapia_optometria_neonatos/${id_terapia}`);
            return response.data;

        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Acción para agregar una nueva sesión de terapia
export const agregarSesionTerapiaNeonatos = createAsyncThunk(
    'TerapiaNeonatos/agregarSesionTerapiaNeonatos',
    async (nuevaSesion, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API}/terapia_optometria_neonatos`, nuevaSesion);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Acción para editar una sesión de terapia
export const editarSesionTerapiaNeonatos = createAsyncThunk(
    'TerapiaNeonatos/editarSesionTerapiaNeonatos',
    async ({ id, pagado }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API}/terapia_optometria_neonatos/${id}`, {pagado});
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const SesionTerapiaNeonatosSlice = createSlice({
    name: 'sesionTerapiaNeonatos',
    initialState: {
        data: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(SesionTerapiaNeonatos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(SesionTerapiaNeonatos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.data; // Aquí se asegura de que se asigna 'data' correctamente
            })
            .addCase(SesionTerapiaNeonatos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.error : action.error.message;
            })

            // Manejo de la solicitud POST para agregar una nueva sesión
            .addCase(agregarSesionTerapiaNeonatos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(agregarSesionTerapiaNeonatos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.push(action.payload.data); // Agrega la nueva sesión al estado actual
            })
            .addCase(agregarSesionTerapiaNeonatos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.error : action.error.message;
            })

            // Manejo de la solicitud PUT para editar una sesión
            .addCase(editarSesionTerapiaNeonatos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editarSesionTerapiaNeonatos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.data.findIndex((session) => session.id === action.payload.data.id);
                if (index !== -1) {
                    state.data[index] = action.payload.data;
                }
            })
            .addCase(editarSesionTerapiaNeonatos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.error : action.error.message;
            });
    },
});

export default SesionTerapiaNeonatosSlice.reducer;
