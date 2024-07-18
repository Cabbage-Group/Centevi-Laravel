// redux/slices/pacientesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../config/config';

export const fetchPacientes = createAsyncThunk(
    'pacientes/fetchPacientes',
    async ({ page = 1, limit = 2, sortOrder = 'asc', sortColumn = 'nombres' }) => {
        const response = await axios.get(`${API}/pacientes`, {
            params: { page, limit, sortOrder, sortColumn }
        });
        return response.data;
    }
);

const pacientesSlice = createSlice({
    name: 'pacientes',
    initialState: {
        data: [],
        pacientes: [],
        meta: {},
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPacientes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPacientes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.pacientes = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(fetchPacientes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default pacientesSlice.reducer;
