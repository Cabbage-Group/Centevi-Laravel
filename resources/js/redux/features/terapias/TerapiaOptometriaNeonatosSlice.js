import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Fetch Terapias for a specific patient
export const fetchTerapiasOptometriaNeonatos = createAsyncThunk(
    'terapiaNeonatos/fetchTerapiasOptometriaNeonatos',
    async (id_paciente) => {
            const response = await axios.get(`${API}/terapias_optometria_neonatos/${id_paciente}`);
            return response.data;
    }
);

export const createTerapiasOptometriaNeonatos = createAsyncThunk(
    'terapiaOptometriaNeonatos/createTerapiaOptometriaNeonatos',
    async (terapiaData) => {
        const response = await axios.post(`${API}/terapias_optometria_neonatos`, terapiaData);
        return response.data;
    }
);

// Async thunk for editing an existing Terapia Baja Vision
export const editTerapiasOptometriaNeonatos = createAsyncThunk(
    'terapiasOptometriaNeonatos/editTerapiaOptometriaNeonatos',
    async ({ id_terapia, terapiaData }) => {
        const response = await axios.put(`${API}/terapias_optometria_neonatos/${id_terapia}`, terapiaData);
        return response.data;
    }
);

export const deleteTerapiasOptometriaNeonatos = createAsyncThunk(
    'terapiaOptometriaNeonatos/deleteTerapiasOptometriaNeonatos',
    async (id_terapia, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API}/terapias_optometria_neonatos/${id_terapia}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const TerapiaOptometriaNeonatosSlice = createSlice({
    name: 'terapiaNeonatos',
    initialState: {
        neonatos: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTerapiasOptometriaNeonatos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTerapiasOptometriaNeonatos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.neonatos = action.payload.data;
            })
            .addCase(fetchTerapiasOptometriaNeonatos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.error : action.error.message;
            })

            .addCase(editTerapiasOptometriaNeonatos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editTerapiasOptometriaNeonatos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedTerapia = action.payload.data;
                const index = Array.isArray(state.neonatos)
                    ? state.neonatos.findIndex(t => t.id_terapia === updatedTerapia.id_terapia)
                    : -1;
                if (index !== -1) {
                    state.neonatos[index] = updatedTerapia;
                }
            })
            .addCase(editTerapiasOptometriaNeonatos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            builder.addCase(deleteTerapiasOptometriaNeonatos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Filtra la terapia eliminada del estado
                state.neonatos = state.neonatos.filter(
                    (terapia) => terapia.id_terapia !== action.meta.arg
                );
            })
            builder.addCase(deleteTerapiasOptometriaNeonatos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default TerapiaOptometriaNeonatosSlice.reducer;
