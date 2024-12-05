import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const VerUnaTerapiaOrtoptica = createAsyncThunk(
    'terapiasOrtoptica/fetchTerapiasOrtoptica',
    //Recuerda poner llaves cuadno es mas de un dato o id.
    async ({ id_paciente, id_terapia }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API}/terapias_ortoptica_adultos/${id_paciente}/${id_terapia}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const verTerapiaOrtopticaSlice = createSlice({
    name: 'verTerapiaOrtoptica',
    initialState: {
        data: {},
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(VerUnaTerapiaOrtoptica.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(VerUnaTerapiaOrtoptica.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.data;

            })
            .addCase(VerUnaTerapiaOrtoptica.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.error : action.error.message;
            });
    },
});

export default verTerapiaOrtopticaSlice.reducer;
