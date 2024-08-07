import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Thunk para obtener datos de MostrarOrtoptica
export const fetchMostrarConsultaGenerica = createAsyncThunk(
    'ConsultaGenerica/fetchMostrarConsultaGenerica',
    async ({ item = 'id_terapia', item2 = 'paciente', valor = '0', valor2 = '' }) => {
        const response = await axios.get(`${API}/mostrar-consultagenerica`, {
            params: { item, item2, valor, valor2 },
        });
        // console.log(response.data)
        return response.data;
    }
);
const MostrarConsultaGenericaSlice = createSlice({
    name: 'MostrarConsultaGenerica',
    initialState: {
        dataCG: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMostrarConsultaGenerica.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMostrarConsultaGenerica.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.dataCG = action.payload.dataCG;
                // console.log('Datos obtenidos:', state.dataCG);
            })
            .addCase(fetchMostrarConsultaGenerica.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default MostrarConsultaGenericaSlice.reducer;

