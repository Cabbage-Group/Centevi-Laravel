import axios from "axios";
import API from "../../../../config/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";


export const fetchKpisOrdenesTipoCristal = createAsyncThunk(
    'kpisOrdenes/fetchKpisOrdenesTipoCristal',
    async ({startDate = '', endDate = ''}) => {
        try {
            const today = dayjs();
            const formattedEndDate = endDate ? `${endDate}-23:59` : today.format('YYYY-MM-DD-23:59');
            const formattedStartDate = startDate ? `${startDate}-00:00` : dayjs(formattedEndDate, 'YYYY-MM-DD-23:59').subtract(30, 'day').format('YYYY-MM-DD-00:00');

            const requestBody = {
                startDate: formattedStartDate,
                endDate: formattedEndDate
            };

            const response = await axios.post(`${API}/kpis/tipo-cristales`, requestBody);

            return response.data;
        } catch (error) {
            console.error('Error fetching Kpis:', error.response?.data || error.message);
            throw error;
        }
    }
);

export const fetchKpisOrdenesLente= createAsyncThunk(
    'kpisOrdenes/fetchKpisOrdenesLente',
    async ({startDate = '', endDate = ''}) => {
        try {

            const today = dayjs();
            const formattedEndDate = endDate ? `${endDate}-23:59` : today.format('YYYY-MM-DD-23:59');
            const formattedStartDate = startDate ? `${startDate}-00:00` : dayjs(formattedEndDate, 'YYYY-MM-DD-23:59').subtract(30, 'day').format('YYYY-MM-DD-00:00');

            const requestBody = {
                startDate: formattedStartDate,
                endDate: formattedEndDate
            };

            const response = await axios.post(`${API}/kpis/lente-ordenes`, requestBody);

            return response.data;
        } catch (error) {
            console.error('Error fetching Kpis:', error.response?.data || error.message);
            throw error;
        }
    }
);


const kpisOrdenesSlice = createSlice({
    name: 'kpisOrdenes',
    initialState: {
        kpisOrdenesTipoCristal: [],
        kpisOrdenesLente: [],
        statusLente: 'idle',
        errorLente: []
    },
    reducers: {
        setFechaRangeOrdenesTipoCristal(state, action) {
            state.startDate = action.payload.startDate;
            state.endDate = action.payload.endDate;
        },
        setFechaRangeOrdenesLente(state, action) {
            state.startDate = action.payload.startDate;
            state.endDate = action.payload.endDate;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchKpisOrdenesTipoCristal.pending, (state) => {
                state.status = ' loading';
            })
            .addCase(fetchKpisOrdenesTipoCristal.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.kpisOrdenesTipoCristal = action.payload.data;
            })
            .addCase(fetchKpisOrdenesTipoCristal.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message
            })
            .addCase(fetchKpisOrdenesLente.pending, (state) => {
                state.statusLente = ' loading';
            })
            .addCase(fetchKpisOrdenesLente.fulfilled, (state, action) => {
                state.statusLente = 'succeeded';
                state.kpisOrdenesLente = action.payload.data;
            })
            .addCase(fetchKpisOrdenesLente.rejected, (state, action) => {
                state.statusLente = 'failed';
                state.errorLente = action.error.message
            })
    }
});

export const { setFechaRangeOrdenesTipoCristal,setFechaRangeOrdenesLente } = kpisOrdenesSlice.actions;
export default kpisOrdenesSlice.reducer;