import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const SesionTerapiaOrtoptica = createAsyncThunk(
    'TerapiaOrtoptica/SesionTerapiaOrtoptica',
    async (id_terapia, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API}/terapia_ortoptica_adultos/${id_terapia}`);
            return response.data;

        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Acción para agregar una nueva sesión de terapia
export const agregarSesionTerapiaOrtoptica = createAsyncThunk(
    'TerapiaOrtoptica/agregarSesionTerapiaOrtoptica',
    async (nuevaSesion, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API}/terapia_ortoptica_adultos`, nuevaSesion);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Acción para editar una sesión de terapia
export const editarSesionTerapiaOrtoptica = createAsyncThunk(
    'TerapiaOrtoptica/editarSesionTerapiaOrtoptica',
    async ({ id, pagado }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API}/terapia_ortoptica_adultos/${id}`, {pagado});
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const SesionTerapiaOrtopticaSlice = createSlice({
    name: 'sesionTerapiaOrtoptica',
    initialState: {
        data: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(SesionTerapiaOrtoptica.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(SesionTerapiaOrtoptica.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.data; // Aquí se asegura de que se asigna 'data' correctamente
            })
            .addCase(SesionTerapiaOrtoptica.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.error : action.error.message;
            })

            // Manejo de la solicitud POST para agregar una nueva sesión
            .addCase(agregarSesionTerapiaOrtoptica.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(agregarSesionTerapiaOrtoptica.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.push(action.payload.data); // Agrega la nueva sesión al estado actual
            })
            .addCase(agregarSesionTerapiaOrtoptica.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.error : action.error.message;
            })

            // Manejo de la solicitud PUT para editar una sesión
            .addCase(editarSesionTerapiaOrtoptica.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editarSesionTerapiaOrtoptica.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.data.findIndex((session) => session.id === action.payload.data.id);
                if (index !== -1) {
                    state.data[index] = action.payload.data;
                }
            })
            .addCase(editarSesionTerapiaOrtoptica.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.error : action.error.message;
            });
    },
});

export default SesionTerapiaOrtopticaSlice.reducer;
