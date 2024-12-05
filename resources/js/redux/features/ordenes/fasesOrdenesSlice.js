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

export const createFasesOrdenes= createAsyncThunk(
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
            });
    },
});

export const { actualizarDatosFase } = fasesOrdenesSlice.actions;

export default fasesOrdenesSlice.reducer;
