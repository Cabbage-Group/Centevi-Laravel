import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../../config/config';
import dayjs from 'dayjs';

export const fetchKpisConsultasTerapias = createAsyncThunk(
    'kpisConsultasTerapias/fetchKpisConsultasTerapias',
    async ({ startDate = '', endDate = '' }) => {
        try {
            const today = dayjs();
            
            const formattedEndDate = endDate
                ? `${endDate}-23:59`
                : today.endOf('month').format('YYYY-MM-DD-23:59');

            // Si no se proporciona startDate, lo calculamos como 12 meses atrás desde endDate
            const formattedStartDate = startDate
                ? `${startDate}-00:00`
                : today.subtract(12, 'month').startOf('month').format('YYYY-MM-DD-00:00');

            // Construir los parámetros de la consulta directamente en la URL
            const params = new URLSearchParams({
                startDate: formattedStartDate,
                endDate: formattedEndDate
            });

            // Hacer la solicitud GET con los parámetros en la URL
            const response = await axios.get(`${API}/kpis/sucursales-consultas?${params.toString()}`);

            return response.data;
        } catch (error) {
            console.error('Error fetching Kpis:', error.response?.data || error.message);
            throw error;
        }
    }
);

export const fetchKpisConsultasTerapiasDoctores = createAsyncThunk(
    'kpisConsultasTerapias/fetchKpisConsultasTerapiasDoctores',
    async ({ startDate = '', endDate = '' }) => {
        try {
            const today = dayjs();

            const formattedEndDate = endDate
                ? `${endDate}-23:59`
                : today.endOf('month').format('YYYY-MM-DD-23:59');

            // Si no se proporciona startDate, lo calculamos como 12 meses atrás desde endDate
            const formattedStartDate = startDate
                ? `${startDate}-00:00`
                : today.subtract(12, 'month').startOf('month').format('YYYY-MM-DD-00:00');

            // Construir los parámetros de la consulta directamente en la URL
            const params = new URLSearchParams({
                startDate: formattedStartDate,
                endDate: formattedEndDate
            });

            // Hacer la solicitud GET con los parámetros en la URL
            const response = await axios.get(`${API}/kpis/doctores-consultas?${params.toString()}`);

            return response.data;
        } catch (error) {
            console.error('Error fetching Kpis:', error.response?.data || error.message);
            throw error;
        }
    }
);
const kpisSliceConsultasTerapias = createSlice({
    name: 'kpis',
    initialState: {
        kpisConsultasTerapias: [],
        kpisConsultasTerapiasDoctores: [],
        sortOrder: 'asc',
        status: 'idle',
        error: null,
        search: '',
        startDate: null,
        endDate: null,
    },
    reducers: {
        setFechaRangeConsultasTerapias(state, action) {
            state.startDate = action.payload.startDate;
            state.endDate = action.payload.endDate;
        },
        setFechaRangeConsultasTerapiasDoctores(state, action) {
            state.startDate = action.payload.startDate;
            state.endDate = action.payload.endDate;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchKpisConsultasTerapias.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchKpisConsultasTerapias.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.kpisConsultasTerapias = action.payload.data;
            })
            .addCase(fetchKpisConsultasTerapias.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchKpisConsultasTerapiasDoctores.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchKpisConsultasTerapiasDoctores.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.kpisConsultasTerapiasDoctores = action.payload.data;
            })
            .addCase(fetchKpisConsultasTerapiasDoctores.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    },
});

export const {
    setSortOrder,
    setFechaRangeConsultasTerapias,
    setFechaRangeConsultasTerapiasDoctores
} = kpisSliceConsultasTerapias.actions;
export default kpisSliceConsultasTerapias.reducer;

