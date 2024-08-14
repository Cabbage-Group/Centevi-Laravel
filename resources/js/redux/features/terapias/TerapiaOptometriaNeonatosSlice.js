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

const TerapiaOptometriaNeonatosSlice = createSlice({
    name: 'terapiaNeonatos',
    initialState: {
        data: [],
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
                state.data = action.payload.data; // Ensure 'data' is assigned correctly
            })
            .addCase(fetchTerapiasOptometriaNeonatos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.error : action.error.message;
            });
    },
});

export default TerapiaOptometriaNeonatosSlice.reducer;
