import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Thunk para obtener un ConsultaGenerica por ID de paciente
export const fetchVerConsultaGenerica = createAsyncThunk(
    'ConsultaGenerica/fetchVerConsultaGenerica',
    async ({ id, id_consulta } ) => {
        const response = await axios.get(`${API}/ver-consultagenerica/${id}/${id_consulta}`);
        return response.data;
    }
);

const VerConsultaGenericaSlice = createSlice({
    name: 'verConsultaGenerica',
    initialState: {
        data: {},
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVerConsultaGenerica.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchVerConsultaGenerica.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.data;
            })
            .addCase(fetchVerConsultaGenerica.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default VerConsultaGenericaSlice.reducer;
