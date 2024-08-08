import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Thunk para obtener un NfetchVerNeonatos por ID de paciente
export const fetchVerNeonatos = createAsyncThunk(
    'VerNeonatos/fetchVerNeonatos',
    async ({ id, id_consulta } ) => {
        const response = await axios.get(`${API}/ver-neonatos/${id}/${id_consulta}`);
        return response.data;
    }
);

const fetchVerNeonatosSlice = createSlice({
    name: 'verNeonatos',
    initialState: {
        data: {},
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVerNeonatos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchVerNeonatos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.data;
            })
            .addCase(fetchVerNeonatos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default fetchVerNeonatosSlice.reducer;
