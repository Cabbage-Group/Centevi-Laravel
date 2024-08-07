import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Async thunk para eliminar recetas
export const eliminarRecetas = createAsyncThunk(
    'recetas/eliminarRecetas',
    async (id_receta, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API}/recetas/${id_receta}`);
            console.log('Receta eliminada, ID:', id_receta);
            return response.data;
        } catch (error) {
            console.log('Error eliminando receta, ID:', id_receta);
            return rejectWithValue(error.response.data);
        }
    }
);

const eliminarRecetasSlice = createSlice({
    name: 'eliminarRecetas',
    initialState: {
        recetas: [],
        status: 'idle', 
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Casos para eliminarRecetas
            .addCase(eliminarRecetas.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(eliminarRecetas.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Filtra la receta eliminada del estado
                state.recetas = state.recetas.filter(receta => receta.id_receta !== action.meta.arg);
            })
            .addCase(eliminarRecetas.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default eliminarRecetasSlice.reducer;
