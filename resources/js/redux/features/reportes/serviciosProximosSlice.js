import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';

export const fetchServiciosProximos = createAsyncThunk(
    'serviciosProximos/fetchServiciosProximos',
    async ({
        page = 1, 
        limit = 10, 
        sortOrderServiciosProximos = 'asc', 
        sortColumnServiciosProximos = 'ID_CONSULTA',
        startDateServiciosProximos = '', 
        endDateServiciosProximos = '', 
        searchServiciosProximos = '', 
    }) => {
        try {
            const fecha = startDateServiciosProximos && endDateServiciosProximos ? `${startDateServiciosProximos} - ${endDateServiciosProximos}` : '';

            const params = { 
                page, 
                limit, 
                sortOrder: sortOrderServiciosProximos, 
                sortColumn: sortColumnServiciosProximos,
                fecha,
                search: searchServiciosProximos
            };
            const response = await axios.get(`${API}/reportes-servicios-proximos`, {params})
            return response.data;
        } catch (error) {
            console.error('Error fetching pacientesServiciosProximos:', error.response?.data || error.message);
            throw error;
        }
    }
);

const serviciosProximosSlice = createSlice({
    name: 'serviciosProximos',
    initialState: {
        serviciosProximos: [],
        statusServiciosProximos: 'idle',
        errorServiciosProximos: null,
        metaServiciosProximos: {},
        dataexportServiciosProximos: [],
 
    },
    reducers: {
        setSortOrderServiciosProximos(state, action) {
            state.sortOrderServiciosProximos = action.payload; 
        },
        setSortColumnServiciosProximos(state, action) {
            state.sortColumnServiciosProximos = action.payload; 
        },
        setFechaRangeServiciosProximos(state, action) {
            state.startDateServiciosProximos = action.payload.startDateServiciosProximos;
            state.endDateServiciosProximos = action.payload.endDateServiciosProximos;
        },  
        setSearchServiciosProximos(state, action) {
            state.searchServiciosProximos = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchServiciosProximos.pending, (state) => {
                state.statusServiciosProximos = 'loading';
            })
            .addCase(fetchServiciosProximos.fulfilled, (state, action) => {
                state.statusServiciosProximos = 'succeeded';
                state.serviciosProximos = action.payload.data; 
                state.metaServiciosProximos = action.payload.meta;
                state.dataexportServiciosProximos= action.payload.export.dataexport;  
            })
            .addCase(fetchServiciosProximos.rejected, (state, action) => {
                state.statusServiciosProximos = 'failed';
                state.errorServiciosProximos = action.error.message;
            });
    },
});

export const { 
    setSortOrderServiciosProximos, 
    setSortColumnServiciosProximos, 
    setFechaRangeServiciosProximos,
    setSearchServiciosProximos, 
} = serviciosProximosSlice.actions;

export default serviciosProximosSlice.reducer;