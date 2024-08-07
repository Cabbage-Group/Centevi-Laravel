import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fecthRecetas = createAsyncThunk(
    'recetas/fecthRecetas',
    async ({ page = 1, limit = 7, orden = 'asc', ordenPor = 'nombres' }) => {
        const response = await axios.get(`${API}/recetas`, {
            params: { page, limit, orden, ordenPor}
        });
        return response.data;
    }
);

const recetasSlice = createSlice({
    name: 'recetas',
    initialState: {
        data: [],
        recetas: [],
        meta: {},
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fecthRecetas.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fecthRecetas.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.recetas = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(fecthRecetas.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default recetasSlice.reducer;
