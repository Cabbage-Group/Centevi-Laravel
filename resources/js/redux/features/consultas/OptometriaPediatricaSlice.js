import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const crearPediatrica = createAsyncThunk(
    'optometriaPediatrica/crearPediatrica',
    async (data, { rejectWithValue }) => {
        try {

            data['av_sc'] = JSON.stringify(data.av_sc);
            data['av_cc'] = JSON.stringify(data.av_cc);
            data['lensometria'] = JSON.stringify(data.lensometria);
            data['lensometria_extra'] = JSON.stringify(data.lensometria_extra);
            data['sa_pp'] = JSON.stringify(data.sa_pp);
            data['visuscopia'] = JSON.stringify(data.visuscopia);
            data['visuscopia_extra'] = JSON.stringify(data.visuscopia_extra);
            data['refraccion'] = JSON.stringify(data.refraccion);
            data['lentes_contacto'] = JSON.stringify(data.lentes_contacto);
            data['pruebas'] = JSON.stringify(data.pruebas);
            data['pruebas_extra'] = JSON.stringify(data.pruebas_extras);
            data['pruebas_extras'] = JSON.stringify(data.pruebas_extras);

            const response = await axios.post(`${API}/pediatrica`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const optometriaPediatricaSlice = createSlice({
    name: 'optometriaPediatrica',
    initialState: {
        optometriaPediatrica: null,
        status: 'idle', 
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(crearPediatrica.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(crearPediatrica.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.pediatrica = action.payload;
            })
            .addCase(crearPediatrica.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default optometriaPediatricaSlice.reducer;
