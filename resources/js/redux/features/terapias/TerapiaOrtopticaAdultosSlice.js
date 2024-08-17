import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Fetch Terapias for a specific patient
export const fetchTerapiasOrtopticaAdultos = createAsyncThunk(
    'terapiaOrtopticaAdultos/fetchTerapiasOrtopticaAdultos',
    async (id_paciente) => {
        const response = await axios.get(`${API}/terapias_ortoptica_adultos/${id_paciente}`);
        return response.data;
    }
);

export const createTerapiasOrtopticaAdultos = createAsyncThunk(
    'terapiaOrtopticaAdultos/createTerapiaOrtopticaAdultos',
    async (terapiaData) => {
        const response = await axios.post(`${API}/terapias_ortoptica_adultos`, terapiaData);
        return response.data;
    }
);

// Async thunk for editing an existing Terapia Baja Vision
export const editTerapiasOrtopticaAdultos = createAsyncThunk(
    'terapiasOrtopticaAdultos/editTerapiaOrtopticaAdultos',
    async ({ id_terapia, terapiaData }) => {
        const response = await axios.put(`${API}/terapias_ortoptica_adultos/${id_terapia}`, terapiaData);
        return response.data;
    }
);

export const deleteTerapiasOrtopticaAdultos = createAsyncThunk(
    'terapiaOrtopticaAdultos/deleteTerapiasOrtopticaAdultos',
    async (id_terapia, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API}/terapias_ortoptica_adultos/${id_terapia}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const TerapiaOrtopticaAdultosSlice = createSlice({
    name: 'terapiaOrtopticaAdultos',
    initialState: {
        ortoptica: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTerapiasOrtopticaAdultos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTerapiasOrtopticaAdultos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.ortoptica = action.payload.data;
            })
            .addCase(fetchTerapiasOrtopticaAdultos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.error : action.error.message;
            })

            // Handling create
            .addCase(createTerapiasOrtopticaAdultos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createTerapiasOrtopticaAdultos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Optionally add the newly created therapy to the state
                state.ortoptica.push(action.payload.data[0]);
            })
            .addCase(createTerapiasOrtopticaAdultos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // Handling edit
            .addCase(editTerapiasOrtopticaAdultos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editTerapiasOrtopticaAdultos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedTerapia = action.payload.data;
                const index = Array.isArray(state.ortoptica)
                    ? state.ortoptica.findIndex(t => t.id_terapia === updatedTerapia.id_terapia)
                    : -1;
                if (index !== -1) {
                    state.ortoptica[index] = updatedTerapia;
                }
            })
        builder.addCase(deleteTerapiasOrtopticaAdultos.fulfilled, (state, action) => {
            state.status = 'succeeded';
            // Filtra la terapia eliminada del estado
            state.ortoptica = state.ortoptica.filter(
                (terapia) => terapia.id_terapia !== action.meta.arg
            );
        })
        builder.addCase(deleteTerapiasOrtopticaAdultos.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });
    },
});

export default TerapiaOrtopticaAdultosSlice.reducer;
