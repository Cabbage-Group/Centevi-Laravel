import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fetchSesionTerapiaNeonato = createAsyncThunk(
    'terapiaNeonato/sesionTerapiaNeonato',
    async ({ id_paciente, id_terapia, id_sesion }) => {
        const response = await axios.get(`${API}/terapia_optometria_neonatos/${id_paciente}/${id_terapia}/${id_sesion}`);
        return response.data;
    }
);

const SesionTerapiaNeonatoSlice = createSlice({
    name: 'sesionTerapiaNeonato',
    initialState: {
        paciente: null,
        terapia: null,
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSesionTerapiaNeonato.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSesionTerapiaNeonato.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.paciente = action.payload.data.paciente;
                state.terapia = action.payload.data.terapia;
            })
            .addCase(fetchSesionTerapiaNeonato.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default SesionTerapiaNeonatoSlice.reducer;