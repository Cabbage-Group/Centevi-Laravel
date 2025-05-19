import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Acción asíncrona para eliminar la consulta
export const DeletePediatrica = createAsyncThunk(
    'Pediatrica/DeletePediatrica',
    async (id_consulta, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API}/pediatrica/${id_consulta}`);
            if (response.data.success) {
                return id_consulta; // Devuelve el ID de la consulta eliminada para actualizar el estado
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response.data.message || 'Error al eliminar la consulta');
        }
    }
);

const fetchDeletePediatricaSlice = createSlice({
    name: 'Pediatrica',
    initialState: {
        consultas: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(DeletePediatrica.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(DeletePediatrica.fulfilled, (state, action) => {
                state.loading = false;
                state.consultas = state.consultas.filter(consulta => consulta.id_consulta !== action.payload);
            })
            .addCase(DeletePediatrica.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default fetchDeletePediatricaSlice.reducer;
