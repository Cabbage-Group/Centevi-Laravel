import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const crearPacientes = createAsyncThunk(
    'pacientes/crearPacientes',
    async (data, { rejectWithValue }) => {
        try {
            
            data['urgencia'] = JSON.stringify(data.urgencia);
            data['menor'] = JSON.stringify(data.menor);
           
            const response = await axios.post(`${API}/pacientes`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const crearPacientesSlice = createSlice({
    name: 'crearPacientes',
    initialState: {
        crearPacientes: null,
        status: 'idle', 
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(crearPacientes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(crearPacientes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.pacientes = action.payload;
            })
            .addCase(crearPacientes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default crearPacientesSlice.reducer;
