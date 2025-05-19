import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Thunk para obtener un RefraccionGeneral por ID de paciente
export const fetchVerRefraccionGeneral = createAsyncThunk(
    'RefraccionGeneral/fetchVerRefraccionGeneral',
    async ({ id, id_consulta } ) => {
        const response = await axios.get(`${API}/ver-refraccion/${id}/${id_consulta}`);
        return response.data;
    }
);

const VerRefraccionGeneralSlice = createSlice({
    name: 'verRefraccionGeneral',
    initialState: {
        data: {},
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVerRefraccionGeneral.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchVerRefraccionGeneral.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.data;
            })
            .addCase(fetchVerRefraccionGeneral.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default VerRefraccionGeneralSlice.reducer;
