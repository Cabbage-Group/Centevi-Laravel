import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const crearGeneral = createAsyncThunk(
    'optometriaGeneral/crearGeneral',
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
            data['tipo_lentes'] = JSON.stringify(data.tipo_lentes);
            data['lentes_contacto'] = JSON.stringify(data.lentes_contacto);
            data['pruebas'] = JSON.stringify(data.pruebas);
            data['pruebas_extra'] = JSON.stringify(data.pruebas_extra);
            data['acomodacion_extra'] = JSON.stringify(data.acomodacion_extra);
            data['acomodacion'] = JSON.stringify(data.acomodacion);

            const response = await axios.post(`${API}/ObtometriaGeneral`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const OptometriaGeneralSlice = createSlice({
    name: 'optometriaGeneral',
    initialState: {
        optometriaGeneral: null,
        status: 'idle', 
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(crearGeneral.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(crearGeneral.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.optometriaGeneral = action.payload;
            })
            .addCase(crearGeneral.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default OptometriaGeneralSlice.reducer;
