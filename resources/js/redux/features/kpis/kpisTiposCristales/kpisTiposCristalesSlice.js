
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../../config/config';


export const fetchKpisTiposCristales = createAsyncThunk(
    'kpisTiposCristales/fetchKpisTiposCristales',
    async ({
        startDate = '',
        endDate = '',
        limit = 10,
        name = [] }) => {
        try {
            const response = await axios.post(`${API}/kpis/tipo-cristal-esfera-cilindro-ordenes`, {
                startDate,
                endDate,
                name,
                limit

            });

            return response.data;
        } catch (error) {
            console.error('Error fetching Kpis:', error.response?.data || error.message);
            throw error;
        }
    }
);


export const fetchKpisTiposCristalesNoLimits = createAsyncThunk(
    'kpisTiposCristales/fetchKpisTiposCristalesNoLimits',
    async ({
        startDate = '',
        endDate = '',
        limit = 5000000,
        name = [] }) => {
        try {
            const response = await axios.post(`${API}/kpis/tipo-cristal-esfera-cilindro-ordenes`, {
                startDate,
                endDate,
                name,
                limit

            });

            return response.data;
        } catch (error) {
            console.error('Error fetching Kpis:', error.response?.data || error.message);
            throw error;
        }
    }
);


const kpisSliceTiposCristales = createSlice({
    name: 'kpisTiposCristales',
    initialState: {
        kpisTiposCristales: [],
        kpisTiposCristalesNoLimits: [],
        kpisTipos_cristales_select_option: [],
        kpisTipos_cristales_select_option_no_limits: [],
        status: 'idle',
        statusNolimits: 'idle',
        error: null,
        errorNoLimits: null,
    }, reducers: {
        setFechaRangeTiposCristales(state, action) {
            state.startDate = action.payload.startDate;
            state.endDate = action.payload.endDate;
        },
        setFechaRangeTiposCristalesNoLimits(state, action) {
            state.startDate = action.payload.startDate;
            state.endDate = action.payload.endDate;
        }
    }, extraReducers: (builder) => {
        builder
            .addCase(fetchKpisTiposCristales.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchKpisTiposCristales.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.kpisTiposCristales = action.payload.data;
                state.kpisTipos_cristales_select_option = action.payload.data.map(item => ({
                    value: item.name,
                    label: item.name
                }));
            })
            .addCase(fetchKpisTiposCristales.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchKpisTiposCristalesNoLimits.pending, (state) => {
                state.statusNolimits = 'loading';
            })
            .addCase(fetchKpisTiposCristalesNoLimits.fulfilled, (state, action) => {
                state.statusNolimits = 'succeeded';
                state.kpisTiposCristalesNoLimits = action.payload.data;
                state.kpisTipos_cristales_select_option_no_limits = action.payload.data.map(item => ({
                    value: item.name,
                    label: item.name
                }));
            })
            .addCase(fetchKpisTiposCristalesNoLimits.rejected, (state, action) => {
                state.statusNolimits = 'failed';
                state.errorNoLimits = action.error.message;
            })
    },
});

export const {
    setFechaRangeTiposCristales,
    setFechaRangeTiposCristalesNoLimits
} = kpisSliceTiposCristales.actions;
export default kpisSliceTiposCristales.reducer;