import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../config/config';


export const fetchUltimaAtencion = createAsyncThunk(
    'ultimaAtencion/fetchUltimaAtencion',
    async ({ page = 1, limit = 20, orden = 'asc', ordenPor = 'nombres', startDate = '', endDate = '', search = '' }) => {
        try {
            const fecha = startDate && endDate ? `${startDate} - ${endDate}` : '';

            const response = await axios.get(`${API}/ultimaAtencion`, {
                params: { page, limit, orden, ordenPor, fecha, search },
            });

            console.log('mensaje:', response.data);

            return response.data;
        } catch (error) {
            console.error('Error fetching ultimaAtencion:', error.response?.data || error.message);
            throw error;
        }
    }
);


const ultimaAtencionSlice = createSlice({
    name: 'ultimaAtencion',
    initialState: {
        data: [],
        ultimaAtencion: [],
        meta: {},
        status: 'idle',
        error: null,
        orden: 'asc',
        ordenPor: 'nombres',
        startDate: '',
        endDate: '',
        search: '',  // Agrega el estado de búsqueda
    },
    reducers: {
        setOrden(state, action) {
            state.orden = action.payload;
        },
        setFechaRange(state, action) {
            state.startDate = action.payload.startDate;
            state.endDate = action.payload.endDate;
        },
        setOrdenPor(state, action) {
            state.ordenPor = action.payload;
        },
        setSearch(state, action) { // Agrega el reducer para la búsqueda
            state.search = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUltimaAtencion.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUltimaAtencion.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.ultimaAtencion = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(fetchUltimaAtencion.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});


export const { setOrden, setFechaRange, setOrdenPor, setSearch } = ultimaAtencionSlice.actions;
export default ultimaAtencionSlice.reducer;