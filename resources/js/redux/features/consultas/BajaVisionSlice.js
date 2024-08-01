import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const crearBajaVision = createAsyncThunk(
    'bajaVision/crearBajaVision',
    async (data, { rejectWithValue }) => {
        try {

            data['av_sc'] = JSON.stringify(data.av_sc);
            data['av_cc'] = JSON.stringify(data.av_cc);
            data['vision_exentrica'] = JSON.stringify(data.vision_exentrica);
            data['lensometria'] = JSON.stringify(data.lensometria);
            data['lensometria_extra'] = JSON.stringify(data.lensometria_extra);
            data['cv_so'] = JSON.stringify(data.cv_so);
            data['amsler'] = JSON.stringify(data.amsler);
            data['sensibilidad_c'] = JSON.stringify(data.sensibilidad_c);
            data['refraccion'] = JSON.stringify(data.refraccion);
            data['pruebas'] = JSON.stringify(data.pruebas);

            const response = await axios.post(`${API}/ObtometriaGeneral`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const BajaVisionSlice = createSlice({
    name: 'bajaVision',
    initialState: {
        bajaVision: null,
        status: 'idle', 
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(crearBajaVision.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(crearBajaVision.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.bajaVision = action.payload;
            })
            .addCase(crearBajaVision.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default BajaVisionSlice.reducer;
