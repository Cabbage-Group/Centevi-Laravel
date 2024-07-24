import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';

export const fetchSucursales = createAsyncThunk(
    'sucursales/fetchSucursales',
    async ({ page = 1, limit = 50, sortOrder = 'asc', sortColumn = 'nombre' }) => {
        try {
            const response = await axios.get(`${API}/sucursales`, {
                params: { page, limit, sortOrder, sortColumn }
            });
            return response.data;
        } catch (error) {
            // Log the error details for debugging
            console.error('Error fetching sucursales:', error.response.data);
            throw error;
        }
    }
);

const sucursalesSlice = createSlice({
    name: 'sucursales',
    initialState: {
        sucursales: [],
        meta: {},
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSucursales.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSucursales.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.sucursales = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(fetchSucursales.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default sucursalesSlice.reducer;