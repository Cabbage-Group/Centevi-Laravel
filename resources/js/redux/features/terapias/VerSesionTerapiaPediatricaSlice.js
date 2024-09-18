import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fetchSesionTerapiaPediatrica = createAsyncThunk(
    'terapia/sesionTerapiaPediatrica',
    async ({ id_paciente, id_terapia, id_sesion }) => {
        const response = await axios.get(`${API}/terapia_optometria_pediatrica/${id_paciente}/${id_terapia}/${id_sesion}`);
        return response.data;
    }
);

const SesionTerapiaPediatricaSlice = createSlice({
    name: 'sesionTerapiaPediatrica',
    initialState: {
        paciente: null,
        terapia: null,
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSesionTerapiaPediatrica.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSesionTerapiaPediatrica.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.paciente = action.payload.data.paciente;
                state.terapia = action.payload.data.terapia;
            })
            .addCase(fetchSesionTerapiaPediatrica.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default SesionTerapiaPediatricaSlice.reducer;