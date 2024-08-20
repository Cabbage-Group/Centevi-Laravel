import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const VerUnaTerapiaPediatrica = createAsyncThunk(
    'terapiasPediatrica/fetchTerapiasPediatrica',
    //Recuerda poner llaves cuadno es mas de un dato o id.
    async ({ id_paciente, id_terapia }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API}/terapias_optometria_pediatrica/${id_paciente}/${id_terapia}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const verTerapiaPediatricaSlice = createSlice({
    name: 'verTerapiaPediatrica',
    initialState: {
        data: {},
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(VerUnaTerapiaPediatrica.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(VerUnaTerapiaPediatrica.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.data;

            })
            .addCase(VerUnaTerapiaPediatrica.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.error : action.error.message;
            });
    },
});

export default verTerapiaPediatricaSlice.reducer;
