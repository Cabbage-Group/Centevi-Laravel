import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Acción asíncrona para eliminar la consulta
export const DeleteNeonatos = createAsyncThunk(
    'Neonatos/DeleteConsulta',
    async (id_consulta, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API}/neonatos/${id_consulta}`);
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

const fetchDeleteNeonatosSlice = createSlice({
    name: 'Neonatos',
    initialState: {
        consultas: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(DeleteNeonatos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(DeleteNeonatos.fulfilled, (state, action) => {
                state.loading = false;
                state.consultas = state.consultas.filter(consulta => consulta.id_consulta !== action.payload);
            })
            .addCase(DeleteNeonatos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default fetchDeleteNeonatosSlice.reducer;
