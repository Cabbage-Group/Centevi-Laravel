import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Thunk para obtener un Pediatrica por ID de paciente
export const fetchVerPediatrica = createAsyncThunk(
    'Pediatrica/fetchVerPediatrica',
    async ({ id, id_consulta } ) => {
        const response = await axios.get(`${API}/ver-pediatrica/${id}/${id_consulta}`);
        // console.log(response.data)
        return response.data;
    }
);

const VerPediatricaSlice = createSlice({
    name: 'verPediatrica',
    initialState: {
        data: {},
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVerPediatrica.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchVerPediatrica.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.data;
                // console.log('datos obtenidos:',state.data)
            })
            .addCase(fetchVerPediatrica.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default VerPediatricaSlice.reducer;
