import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';



export const verificarCedula = createAsyncThunk(
    'pacientes/verificarCedula',
    async (nroCedula, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API}/verificar-cedula`, { nro_cedula: nroCedula });
            return response.data.data.exists;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);



export const crearPacientes = createAsyncThunk(
    'pacientes/crearPacientes',
    async (data, { rejectWithValue }) => {
        try {
            
            data['urgencia'] = JSON.stringify(data.urgencia);
            data['menor'] = JSON.stringify(data.menor);
           
            const response = await axios.post(`${API}/pacientes`, data);
            console.log('Datos enviados:', data);

            return response.data;
        } catch (error) {
            console.log('Datos enviados:', data);

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
        cedulaVerificada: null,
        cedulaVerificacionStatus: 'idle',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(crearPacientes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(crearPacientes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.crearPacientes = action.payload;
            })
            .addCase(crearPacientes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(verificarCedula.pending, (state) => {
                state.cedulaVerificacionStatus = 'loading';
            })
            .addCase(verificarCedula.fulfilled, (state, action) => {
                state.cedulaVerificacionStatus = 'succeeded';
                state.cedulaVerificada = action.payload;
            })
            .addCase(verificarCedula.rejected, (state, action) => {
                state.cedulaVerificacionStatus = 'failed';
                state.error = action.payload;
            });
    },
});

export default crearPacientesSlice.reducer;
