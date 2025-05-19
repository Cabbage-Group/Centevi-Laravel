import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Thunk para actualizar un OptometriaGeneral por ID
export const fetchEditarOptometriaGeneral = createAsyncThunk(
    'OptometriaGeneral/fetchEditarOptometriaGeneral',
    async ({ id, id_consulta, data }, { rejectWithValue }) => {
        try {

            // Definir un valor predeterminado para id_terapia si no se proporciona
            if (!data.id_terapia) {
                data.id_terapia = '0'; // Valor predeterminado
            }

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
            data['editado'] = JSON.stringify(data.editado);

            const response = await axios.put(`${API}/ObtometriaGeneral/${id}/${id_consulta}`, data);
            
            console.log('datos:',response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const EditarOptometriaGeneralSlice = createSlice({
    name: 'EditarOptometriaGeneral',
    initialState: {
        data: {},
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEditarOptometriaGeneral.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEditarOptometriaGeneral.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.data;
            })
            .addCase(fetchEditarOptometriaGeneral.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default EditarOptometriaGeneralSlice.reducer;