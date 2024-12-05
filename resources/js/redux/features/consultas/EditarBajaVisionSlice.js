import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Thunk para actualizar un BajaVision por ID
export const fetchEditarBajaVision = createAsyncThunk(
    'BajaVision/fetchEditarBajaVision',
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
            data['cv_so'] = JSON.stringify(data.cv_so);
            data['amsler'] = JSON.stringify(data.amsler);
            data['sensibilidad_c'] = JSON.stringify(data.sensibilidad_c);
            data['refraccion'] = JSON.stringify(data.refraccion);
            data['pruebas'] = JSON.stringify(data.pruebas);
            data['editado'] = JSON.stringify(data.editado);

            const response = await axios.put(`${API}/bajavision/${id}/${id_consulta}`, data);
            console.log(response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const EditarBajaVisionSlice = createSlice({
    name: 'EditarBajaVision',
    initialState: {
        data: {},
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEditarBajaVision.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEditarBajaVision.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.data;
            })
            .addCase(fetchEditarBajaVision.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default EditarBajaVisionSlice.reducer;