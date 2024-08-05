import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Thunk para obtener datos de MostrarOrtoptica
export const fetchMostrarOrtoptica = createAsyncThunk(
    'MostrarOrtoptica/fetchMostrarOrtoptica',
    async ({ item = 'id_terapia', item2 = 'paciente', valor = '0', valor2 = '' }) => {
        const response = await axios.get(`${API}/mostrar-ortoptica`, {
            params: { item, item2, valor, valor2 },
        });
        console.log(response.data)
        return response.data;
    }
);
const MostrarOrtopticaSlice = createSlice({
    name: 'MostrarOrtoptica',
    initialState: {
        dataOA: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMostrarOrtoptica.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMostrarOrtoptica.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.dataOA = action.payload.dataOA;
                // console.log('ID Consulta:', state.consultaIds);
                console.log('Datos obtenidos:', state.dataOA);
            })
            .addCase(fetchMostrarOrtoptica.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default MostrarOrtopticaSlice.reducer;
