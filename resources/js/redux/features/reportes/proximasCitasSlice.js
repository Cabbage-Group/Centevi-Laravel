import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';
import moment from 'moment';


const getCurrentDate = () => moment().format('YYYY-MM-DD');


export const fetchProximasCitas = createAsyncThunk(
    'proximasCitas/fetchProximasCitas',
    async ({ page = 1, limit = 10, orden = 'asc', ordenPor = 'PACIENTE_NOMBRE', startDate ='', endDate = '', search = '' }) => {
        try {
            const fecha = startDate && endDate ? `${startDate} - ${endDate}` : '';
            console.log('fecha1: ', startDate)
            console.log('fecha2: ', endDate)
            const response = await axios.get(`${API}/proximascitas`, {
                params: { page, limit, orden, ordenPor, fecha, search },
            })
            return response.data
        } catch (error) {
            console.error('Error fetching pacientesProximasCitas:', error.response?.data || error.message);
            throw error;
        }
    }
);

export const actualizarContacto = createAsyncThunk(
    'proximasCitas/actualizarContacto',
    async ({ tabla, id_consulta, hubo_contacto }) => {
        try {
            const response = await axios.put(`${API}/actualizarcontacto`, {
                tabla,
                id_consulta,
                hubo_contacto
            });
            return response.data;
        } catch (error) {
            console.error('Error updating contact:', error.response?.data || error.message);
            throw error;
        }
    }
);

export const actualizarAgendo = createAsyncThunk(
    'proximasCitas/actualizarAgendo',
    async ({ tabla, id_consulta, se_agendo }) => {
        try {
            const response = await axios.put(`${API}/actualizaragendo`, {
                tabla,
                id_consulta,
                se_agendo
            });
            return response.data;
        } catch (error) {
            console.error('Error updating agenda:', error.response?.data || error.message);
            throw error;
        }
    }
);


const proximasCitasSlice = createSlice({
    name: 'proximasCitas',
    initialState: {
        data: [],
        proximasCitas: [],
        meta: {},
        status: 'idle',
        error: null,
        orden: 'asc',
        ordenPor: 'PACIENTE_NOMBRE',
        startDate:  getCurrentDate(),
        endDate: moment().add(6, 'days').format('YYYY-MM-DD'),
        search: '',
        dataexport: [],
        updateStatus: 'idle', 
        updateError: null  
       
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
        setSearch(state, action) { 
            state.search = action.payload;
        },
        updateCitaContacto(state, action) {
            const { id_consulta, hubo_contacto } = action.payload;
            const cita = state.proximasCitas.find(c => c.ID_CONSULTA === id_consulta);
            if (cita) {
                cita.CONTACTO = hubo_contacto;
            }
        },
        updateCitaAgendada(state, action) {
            const { id_consulta, se_agendo } = action.payload;
            const cita = state.proximasCitas.find(c => c.ID_CONSULTA === id_consulta);
            if (cita) {
                cita.SE_AGENDO = se_agendo;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProximasCitas.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProximasCitas.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.proximasCitas = action.payload.data;
                state.meta = action.payload.meta;
                state.dataexport = action.payload.export.dataexport;
               
                
            })
            .addCase(fetchProximasCitas.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(actualizarContacto.pending, (state) => {
                state.updateStatus = 'loading';
                state.updateError = null;
            })
            .addCase(actualizarContacto.fulfilled, (state, action) => {
                state.updateStatus = 'succeeded';
                // Puedes actualizar el estado de `proximasCitas` si es necesario
            })
            .addCase(actualizarContacto.rejected, (state, action) => {
                state.updateStatus = 'failed';
                state.updateError = action.error.message;
            })
            .addCase(actualizarAgendo.pending, (state) => {
                state.updateStatus = 'loading';
                state.updateError = null;
            })
            .addCase(actualizarAgendo.fulfilled, (state, action) => {
                state.updateStatus = 'succeeded';
                // Puedes actualizar el estado de `proximasCitas` si es necesario
            })
            .addCase(actualizarAgendo.rejected, (state, action) => {
                state.updateStatus = 'failed';
                state.updateError = action.error.message;
            });
            
    },
});


export const { setOrden, setFechaRange, setOrdenPor, setSearch,updateCitaContacto, updateCitaAgendada } = proximasCitasSlice.actions;
export default proximasCitasSlice.reducer;