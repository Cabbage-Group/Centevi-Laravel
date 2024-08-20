import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fetchEditarPaciente = createAsyncThunk(
    'pacientes/fetchEditarPaciente',
    async ({ id, data }) => {
        try {

            data['urgencia'] = JSON.stringify(data.urgencia);
            data['menor'] = JSON.stringify(data.menor);

            const response = await axios.put(`${API}/pacientes/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const EditarPacienteSlice = createSlice({
    name: 'EditarPaciente',
    initialState: {
        data: {},
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEditarPaciente.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEditarPaciente.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.data;
            })
            .addCase(fetchEditarPaciente.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default EditarPacienteSlice.reducer;
