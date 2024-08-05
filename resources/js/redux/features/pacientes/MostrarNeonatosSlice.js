import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Thunk para obtener datos de MostrarOrtoptica
export const fetchMostrarNeonatos = createAsyncThunk(
    'MostrarNeonatos/fetchMostrarNeonatos',
    async ({ item = 'id_terapia', item2 = 'paciente', valor = '0', valor2 = '' }) => {
        const response = await axios.get(`${API}/mostrar-neonatos`, {
            params: { item, item2, valor, valor2 },
        });
        console.log(response.data)
        return response.data;
    }
);
const MostrarNeonatosSlice = createSlice({
    name: 'MostrarNeonatos',
    initialState: {
        dataON: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMostrarNeonatos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMostrarNeonatos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.dataON = action.payload.dataON;
                console.log('Datos obtenidos:', state.dataON);
            })
            .addCase(fetchMostrarNeonatos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default MostrarNeonatosSlice.reducer;

