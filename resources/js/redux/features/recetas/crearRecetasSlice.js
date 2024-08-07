import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const crearRecetas = createAsyncThunk(
    'crearRecetas/crearRecetas',
    async (data, { rejectWithValue }) => {
        try {
            
            data['rx'] = JSON.stringify(data.rx);
            data['material'] = JSON.stringify(data.material);
            data['tratamientos'] = JSON.stringify(data.tratamientos);
            data['aro_propio'] = JSON.stringify(data.aro_propio);
            data['medidas'] = JSON.stringify(data.medidas);
           
            const response = await axios.post(`${API}/recetas`, data);
            console.log('Datos enviados:', data);

            return response.data;
        } catch (error) {
            console.log('Datos enviados:', data);

            return rejectWithValue(error.response.data);
        }
    }
);

const crearRecetasSlice = createSlice({
    name: 'recetas',
    initialState: {
        crearRecetas: null,
        status: 'idle', 
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(crearRecetas.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(crearRecetas.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.crearRecetas = action.payload;
            })
            .addCase(crearRecetas.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
    },
});

export default crearRecetasSlice.reducer;
