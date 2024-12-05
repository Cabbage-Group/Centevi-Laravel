import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fetchSesionTerapiaOrtoptica = createAsyncThunk(
    'terapiaOrtoptica/sesionTerapiaOrtoptica',
    async ({ id_paciente, id_terapia, id_sesion }) => {
        const response = await axios.get(`${API}/terapia_ortoptica_adultos/${id_paciente}/${id_terapia}/${id_sesion}`);
        return response.data;
    }
);

const SesionTerapiaOrtopticaSlice = createSlice({
    name: 'sesionTerapiaOrtoptica',
    initialState: {
        paciente: null,
        terapia: null,
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSesionTerapiaOrtoptica.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSesionTerapiaOrtoptica.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.paciente = action.payload.data.paciente;
                state.terapia = action.payload.data.terapia;
            })
            .addCase(fetchSesionTerapiaOrtoptica.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default SesionTerapiaOrtopticaSlice.reducer;