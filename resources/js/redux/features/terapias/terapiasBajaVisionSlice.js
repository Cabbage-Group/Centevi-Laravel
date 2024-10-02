import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Async thunk for fetching Terapias Baja Vision
export const fetchTerapiasBajaVision = createAsyncThunk(
    'terapiasBajaVision/fetchTerapiasBajaVision',
    async (id_paciente) => {
        const response = await axios.get(`${API}/terapias_bajav/${id_paciente}`);
        return response.data;
    }
);

// Async thunk for creating a new Terapia Baja Vision
export const createTerapiasBajaVision = createAsyncThunk(
    'terapiasBajaVision/createTerapiaBajaVision',
    async (terapiaData) => {
        const response = await axios.post(`${API}/terapias_bajav`, terapiaData);
        return response.data;
    }
);

// Async thunk for editing an existing Terapia Baja Vision
export const editTerapiasBajaVision = createAsyncThunk(
    'terapiasBajaVision/editTerapiaBajaVision',
    async ({ id_terapia, terapiaData }) => {
        const response = await axios.put(`${API}/terapias_bajav/${id_terapia}`, terapiaData);
        return response.data;
    }
);

// Async thunk for deleting a Terapia Baja Vision
export const deleteTerapiasBajaVision = createAsyncThunk(
    'terapiasBajaVision/deleteTerapiaBajaVision',
    async ( id_terapia ) => {
        const response = await axios.delete(`${API}/terapias_bajav/${id_terapia}`);
        return response.data;
    }
);

const terapiasBajaVisionSlice = createSlice({
    name: 'terapiasBajaVision',
    initialState: {
        terapias: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handling fetch
            .addCase(fetchTerapiasBajaVision.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTerapiasBajaVision.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.terapias = action.payload.data;
            })
            .addCase(fetchTerapiasBajaVision.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                state.terapias = [];
            })

            // Handling create
            .addCase(createTerapiasBajaVision.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createTerapiasBajaVision.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Optionally add the newly created therapy to the state
                state.terapias.push(action.payload.data[0]);
            })
            .addCase(createTerapiasBajaVision.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                state.terapias = [];
            })

            // Handling edit
            .addCase(editTerapiasBajaVision.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editTerapiasBajaVision.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedTerapia = action.payload.data;
                const index = Array.isArray(state.terapias)
                    ? state.terapias.findIndex(t => t.id_terapia === updatedTerapia.id_terapia)
                    : -1;
                if (index !== -1) {
                    state.terapias[index] = updatedTerapia;
                }
            })
            .addCase(editTerapiasBajaVision.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                state.terapias = [];
            })

            .addCase(deleteTerapiasBajaVision.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Filtra la terapia eliminada del estado
                state.terapias = state.terapias.filter(
                    (terapia) => terapia.id_terapia !== action.meta.arg
                );
            })
            .addCase(deleteTerapiasBajaVision.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                state.terapias = [];
            });
        },
});

export default terapiasBajaVisionSlice.reducer;
