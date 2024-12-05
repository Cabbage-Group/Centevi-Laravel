import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Thunk para actualizar un Neonato por ID
export const fetchEditarNeonato = createAsyncThunk(
    'Neonato/fetchEditarNeonato',
    async ({ id, id_consulta, data }, { rejectWithValue }) => {
        try {

            // Definir un valor predeterminado para id_terapia si no se proporciona
            if (!data.id_terapia) {
                data.id_terapia = '0'; // Valor predeterminado
            }

            data['agudeza_visual'] = JSON.stringify(data.agudeza_visual);
            data['lensometria'] = JSON.stringify(data.lensometria);
            data['lensometria_extra'] = JSON.stringify(data.lensometria_extra);
            data['pruebas_extras'] = JSON.stringify(data.pruebas_extras);
            data['refraccion'] = JSON.stringify(data.refraccion);
            data['sa_pp'] = JSON.stringify(data.sa_pp);
            data['editado'] = JSON.stringify(data.editado);

            const response = await axios.put(`${API}/neonatos/${id}/${id_consulta}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const EditarNeonatoSlice = createSlice({
    name: 'EditarNeonato',
    initialState: {
        data: {},
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEditarNeonato.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEditarNeonato.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.data;
            })
            .addCase(fetchEditarNeonato.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default EditarNeonatoSlice.reducer;