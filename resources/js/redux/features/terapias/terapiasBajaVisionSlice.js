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
            });
    },
});

export default terapiasBajaVisionSlice.reducer;
