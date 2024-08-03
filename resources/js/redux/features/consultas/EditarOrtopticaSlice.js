import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Thunk para actualizar un Ortoptica por ID
export const fetchEditarOrtoptica = createAsyncThunk(
    'Ortopticas/fetchEditarOrtoptica',
    async ({ id, data }) => {
        try {

            data['av_sc'] = JSON.stringify(data.av_sc);
            data['av_cc'] = JSON.stringify(data.av_cc);
            data['lensometria'] = JSON.stringify(data.lensometria);
            data['lensometria_extra'] = JSON.stringify(data.lensometria_extra);
            data['visuscopia'] = JSON.stringify(data.visuscopia);
            data['visuscopia_extra'] = JSON.stringify(data.visuscopia_extra);
            data['refraccion'] = JSON.stringify(data.refraccion);
            data['lentes_contacto'] = JSON.stringify(data.lentes_contacto);
            data['pruebas'] = JSON.stringify(data.pruebas);
            data['pruebas_extra'] = JSON.stringify(data.pruebas_extra);
            data['acomodacion'] = JSON.stringify(data.acomodacion);
            data['acomodacion_extra'] = JSON.stringify(data.acomodacion_extra);
            data['vergencia'] = JSON.stringify(data.vergencia);
            data['pruebas_extra'] = JSON.stringify(data.pruebas_extra);

            const response = await axios.put(`${API}/ortoptica/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const EditarOrtopticaSlice = createSlice({
    name: 'EditarOrtoptica',
    initialState: {
        data: {},
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEditarOrtoptica.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEditarOrtoptica.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.data;
            })
            .addCase(fetchEditarOrtoptica.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default EditarOrtopticaSlice.reducer;
