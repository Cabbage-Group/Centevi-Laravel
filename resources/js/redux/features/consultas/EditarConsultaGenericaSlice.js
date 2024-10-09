import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Thunk para actualizar un ConsultaGenerica por ID
export const fetchEditarConsultaGenerica = createAsyncThunk(
    'ConsultaGenerica/fetchEditarConsultaGenerica',
    async ({ id, id_consulta, data }, { rejectWithValue }) => {
        try {

            // Definir un valor predeterminado para id_terapia si no se proporciona
            if (!data.id_terapia) {
                data.id_terapia = '0'; // Valor predeterminado
            }

            data['editado'] = JSON.stringify(data.editado);

            const response = await axios.put(`${API}/consultagenerica/${id}/${id_consulta}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const EditarConsultaGenericaSlice = createSlice({
    name: 'EditarConsultaGenerica',
    initialState: {
        data: {},
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEditarConsultaGenerica.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEditarConsultaGenerica.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.data;
            })
            .addCase(fetchEditarConsultaGenerica.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default EditarConsultaGenericaSlice.reducer;