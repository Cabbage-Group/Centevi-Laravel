import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Thunk para obtener datos de MostrarGeneral
export const fetchMostrarGeneral = createAsyncThunk(
    'MostrarGeneral/fetchMostrarGeneral',
    async ({ item = 'id_terapia', item2 = 'paciente', valor = '0', valor2 = '' }) => {
        const response = await axios.get(`${API}/mostrar-refraccion`, {
            params: { item, item2, valor, valor2 },
        });
        // console.log(response.data)
        return response.data;
    }
);
const MostrarGeneralSlice = createSlice({
    name: 'MostrarGeneral',
    initialState: {
        dataRG: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMostrarGeneral.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMostrarGeneral.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.dataRG = action.payload.dataRG;
                // console.log('Datos obtenidos:', state.dataOA);
            })
            .addCase(fetchMostrarGeneral.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default MostrarGeneralSlice.reducer;