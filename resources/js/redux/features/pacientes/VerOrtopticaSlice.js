import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Thunk para obtener un Ortoptica por ID de paciente
export const fetchVerOrtoptica = createAsyncThunk(
    'Ortoptica/fetchVerOrtoptica',
    async (id) => {
        const response = await axios.get(`${API}/ver-ortoptica/${id}`);
        console.log(response.data)
        return response.data;
    }
);

const VerOrtopticaSlice = createSlice({
    name: 'verOrtoptica',
    initialState: {
        data: {},
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVerOrtoptica.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchVerOrtoptica.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.data;
                console.log('datos obtenidos:',state.data)
            })
            .addCase(fetchVerOrtoptica.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default VerOrtopticaSlice.reducer;
