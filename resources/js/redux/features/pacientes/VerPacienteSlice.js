import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Thunk para obtener un paciente por ID
export const fetchVerPaciente = createAsyncThunk(
    'pacientes/fetchVerPaciente',
    async (id) => {
        const response = await axios.get(`${API}/pacientes/${id}`);
        return response.data;
    }
);
const VerPacienteSlice = createSlice({
    name: 'VerPaciente',
    initialState: {
        data: {},
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVerPaciente.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchVerPaciente.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.data;
            })

            .addCase(fetchVerPaciente.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default VerPacienteSlice.reducer;
