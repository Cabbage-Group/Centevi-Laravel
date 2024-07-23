import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const crearNeonato = createAsyncThunk(
    'optometriaNeonatos/crearNeonato',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API}/neonatos`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const optometriaNeonatosSlice = createSlice({
    name: 'optometriaNeonatos',
    initialState: {
        neonato: null,
        status: 'idle', 
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(crearNeonato.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(crearNeonato.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.neonato = action.payload;
            })
            .addCase(crearNeonato.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default optometriaNeonatosSlice.reducer;
