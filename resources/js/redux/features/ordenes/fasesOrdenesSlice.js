import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fecthFasesOrdenes = createAsyncThunk(
    'fasesOrdenes/fecthfasesOrdenes',
    async () => {
        const response = await axios.get(`${API}/fases-ordenes`);

        return response.data;
    }
);

export const createFasesOrdenes = createAsyncThunk(
    'fasesOrdenes/createFasesOrdenes',
    async (data) => {
        try {
            const response = await axios.post(`${API}/create-fases-ordenes`, data);
            return response.data;
        } catch (error) {
            console.error('Error creating fase orden:', error.response.data);
            throw error;
        }
    }
);

export const updateFasesOrdenes = createAsyncThunk(
    'fasesOrdenes/updateFasesOrdenes',
    async ({ id, data }) => {
        try {
            console.log('data:', data)
            const response = await axios.put(`${API}/fases-ordenes/${id}`, data);

            return response.data;
        } catch (error) {
            console.error('Error updating fase orden:', error.response?.data || error.message);
            throw error;
        }
    }
);




const fasesOrdenesSlice = createSlice({
    name: 'fasesOrdenes',
    initialState: {
        data: [],
        fasesOrdenes: [],
        nuevaData: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        actualizarDatosFase: (state, action) => {
            state.nuevaData = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fecthFasesOrdenes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fecthFasesOrdenes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.fasesOrdenes = action.payload.data;
            })
            .addCase(fecthFasesOrdenes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createFasesOrdenes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createFasesOrdenes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.fasesOrdenes.push(action.payload.data);
            })
            .addCase(createFasesOrdenes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateFasesOrdenes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateFasesOrdenes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.fasesOrdenes.findIndex(receta => receta.id === action.payload.data.id);
                if (index !== -1) {
                    state.fasesOrdenes[index] = action.payload.data;
                }
            })
            .addCase(updateFasesOrdenes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { actualizarDatosFase } = fasesOrdenesSlice.actions;

export default fasesOrdenesSlice.reducer;
