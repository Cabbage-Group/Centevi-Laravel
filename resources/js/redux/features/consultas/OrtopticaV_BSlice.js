import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const crearOrtoptica = createAsyncThunk(
    'ortoptica/crearOrtoptica',
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
            data['pruebas_extra'] = JSON.stringify(data.pruebas_extra);
            data['vergencia'] = JSON.stringify(data.vergencia);
            data['acomodacion_extra'] = JSON.stringify(data.acomodacion_extra);
            data['acomodacion'] = JSON.stringify(data.acomodacion);
            data['editado'] = JSON.stringify(data.editado);


            const response = await axios.post(`${API}/ortoptica`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const ortopticaV_BSlice = createSlice({
    name: 'ortoptica',
    initialState: {
        ortoptica: null,
        status: 'idle', 
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(crearOrtoptica.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(crearOrtoptica.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.ortoptica = action.payload;
            })
            .addCase(crearOrtoptica.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default ortopticaV_BSlice.reducer;
