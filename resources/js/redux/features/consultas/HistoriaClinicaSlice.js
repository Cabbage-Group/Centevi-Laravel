import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const crearHistoriaClinica = createAsyncThunk(
    'historiaClinica/crearHistoriaClinica',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API}/consultagenerica`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


const HistoriaClinicaSlice = createSlice({
    name: 'consultagenerica',
    initialState: {
        consultagenerica: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(crearHistoriaClinica.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(crearHistoriaClinica.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.consultagenerica = action.payload;
            })
            .addCase(crearHistoriaClinica.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default HistoriaClinicaSlice.reducer;
