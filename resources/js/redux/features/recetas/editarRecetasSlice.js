import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';


export const editarReceta = createAsyncThunk(
    'editarReceta/editarReceta',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            
            const response = await axios.put(`${API}/recetas/${id}`, data);
            console.log('este es el id:', response.data)
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

const recetasSlice = createSlice({
    name: 'editarReceta',
    initialState : {
        editarRecetas: [],
        loading: false,
        error: null,
    }, 
    reducers: {
        // Puedes agregar otros reducers aquí si es necesario
    },
    extraReducers: (builder) => {
        builder
            .addCase(editarReceta.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editarReceta.fulfilled, (state, action) => {
                state.loading = false;
                // Actualiza la receta en el estado
                const index = state.recetas.findIndex(receta => receta.id_receta === action.payload.data.id_receta);
                if (index !== -1) {
                    state.recetas[index] = action.payload.data;
                }
            })
            .addCase(editarReceta.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to edit receta';
            });
    },
});

export default recetasSlice.reducer;
