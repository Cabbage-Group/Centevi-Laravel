import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fetchSesionTerapia = createAsyncThunk(
    'terapia/sesionTerapia',
    async ({ id_paciente, id_terapia, id_sesion }) => {
        const response = await axios.get(`${API}/terapia_bajav/${id_paciente}/${id_terapia}/${id_sesion}`);
        return response.data;
    }
);

const SesionTerapiaSlice = createSlice({
    name: 'sesionTerapia',
    initialState: {
        paciente: null,
        terapia: null,
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSesionTerapia.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSesionTerapia.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.paciente = action.payload.data.paciente;
                state.terapia = action.payload.data.terapia;
            })
            .addCase(fetchSesionTerapia.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default SesionTerapiaSlice.reducer;