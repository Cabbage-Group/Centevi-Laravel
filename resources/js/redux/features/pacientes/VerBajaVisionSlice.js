import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Thunk para obtener un BajaVision por ID de paciente
export const fetchVerBajaVision = createAsyncThunk(
    'BajaVision/fetchVerBajaVision',
    async ({ id, id_consulta } ) => {
        const response = await axios.get(`${API}/ver-bajavision/${id}/${id_consulta}`);
        return response.data;
    }
);

const VerBajaVisionSlice = createSlice({
    name: 'verBajaVision',
    initialState: {
        data: {},
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVerBajaVision.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchVerBajaVision.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.data;
            })
            .addCase(fetchVerBajaVision.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default VerBajaVisionSlice.reducer;
