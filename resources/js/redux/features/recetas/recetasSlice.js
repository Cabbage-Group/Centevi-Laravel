import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fecthRecetas = createAsyncThunk(
    'recetas/fecthRecetas',
    async ({ page = 1, limit = 7, orden = 'asc', ordenPor = 'nombres', search = '' }) => {
        const response = await axios.get(`${API}/recetas`, {
            params: { page, limit, orden, ordenPor, search }
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
        orden: 'asc',
        ordenPor: 'PACIENTE_NOMBRE',
        search: '',
    },
    reducers: {
        setOrden(state, action) {
            state.orden = action.payload;
        },
        setOrdenPor(state, action) {
            state.ordenPor = action.payload;
        },
        setSearch(state, action) { 
            state.search = action.payload;
        }
    },
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

export const { setOrden, setOrdenPor, setSearch } = recetasSlice.actions;
export default recetasSlice.reducer;
