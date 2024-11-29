import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';
import CreateOrden from '../../../admin/recetas/CreateOrden.js';

export const fecthOrdenes = createAsyncThunk(
    'ordenes/fecthordenes',
    async ({ page = 1, limit = 7, orden = 'asc', ordenPor = 'nombres', search = '' }) => {
        const response = await axios.get(`${API}/ordenes`, {
            params: { page, limit, orden, ordenPor, search }
        });
        return response.data;
    }
);

export const createOrdenes = createAsyncThunk(
    'ordenes/createOrdenes',
    async (data) => {
        try {
            const response = await axios.post(`${API}/ordenes`, data);
            return response.data;
        } catch (error) {
            console.error('Error creating usuario:', error.response.data);
            throw error;
        }
    }
);

const ordenesSlice = createSlice({
    name: 'ordenes',
    initialState: {
        data: [],
        ordenes: [],
        meta: {},
        status: 'idle',
        error: null,
        orden: 'asc',
        ordenPor: 'PACIENTE_NOMBRE',
        search: '',
    },
    reducers: {
        setOrden(state, action) {
            state.orden = action.payload;
        },
        setOrdenPor(state, action) {
            state.ordenPor = action.payload;
        },
        setSearch(state, action) {
            state.search = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fecthOrdenes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fecthOrdenes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.ordenes = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(fecthOrdenes.rejected, (state, action) => {
                state.status = 'failed';
                state.ordenes = [];
                state.data = [];
                state.error = action.error.message;
            })
            .addCase(creatOrdenes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(creatOrdenes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.ordenes.push(action.payload.data);
            })
            .addCase(creatOrdenes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { setOrden, setOrdenPor, setSearch } = ordenesSlice.actions;
export default ordenesSlice.reducer;
