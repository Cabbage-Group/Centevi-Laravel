import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';

export const fetchProximasCitasAgenda = createAsyncThunk(
    'proximasCitasAgenda/fetchProximasCitasAgenda',
    async ({ month, year},{ rejectWithValue }) => {
        try {
            const response = await axios.get(`${API}/proximas-citas`, {
                params: { month, year }, // Enviar los filtros a la API
            });
            const citasData = response.data.data || []; // Asegura que sea un array

            console.log('citasData:', citasData);
            console.log('Es array:', Array.isArray(citasData));

            return citasData.map(cita => ({
                id: cita.id || `sin-id-${Math.random().toString(36).substr(2, 9)}`,
                title: `${cita.origen_tabla?.toUpperCase() || 'SIN TABLA'} - Paciente: ${cita.paciente?.nombres || 'Sin Nombre'}`,
                start: cita.fecha_hora || new Date().toISOString(),
                end: cita.fecha_hora || new Date().toISOString(),
                badge: cita.tipo || 'Desconocido',
                extendedProps: {
                    origen_id: cita.origen_id || 'Sin ID',
                    origen_tabla: cita.origen_tabla || 'Desconocido',
                    tipo: cita.tipo || 'Desconocido',
                    paciente_id: cita.paciente_id || 'No registrado',
                    nro_cedula: cita.paciente?.nro_cedula || 'Sin datos',
                    doctor: cita?.doctor_id || 'Sin datos',
                    paciente: cita.paciente?.nombres || 'Sin Nombre',
                    sucursal: cita.sucursal?.nombre || 'Sin Sucursal',
                    comentarios: cita.comentarios?.trim() || 'Sin comentarios'
                }
            }));

        } catch (error) {
            console.error('Error en fetchProximasCitasAgenda:', error);
            return rejectWithValue(error.response?.data || 'Error fetching citas');
        }
    }
);


const proximasCitasAgendaSlice = createSlice({
    name: 'proximasCitasAgenda',
    initialState: {
        proximasCitasAgenda: [],
        loading: false,
        error: null,
    },
    reducers: {
        addOrUpdateEvent: (state, action) => {
            const index = state.proximasCitasAgenda.findIndex(
                (event) => event.id === action.payload.id
            );
            if (index !== -1) {
                // Actualiza el evento existente
                state.proximasCitasAgenda[index] = action.payload;
            } else {
                // Agrega un nuevo evento
                state.proximasCitasAgenda.push(action.payload);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProximasCitasAgenda.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProximasCitasAgenda.fulfilled, (state, action) => {
                console.log('action.payload:', action.payload)
                state.loading = false;
                state.proximasCitasAgenda = action.payload;
            })
            .addCase(fetchProximasCitasAgenda.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error desconocido';
            });
    }
});
export const { addOrUpdateEvent } = proximasCitasAgendaSlice.actions;
export default proximasCitasAgendaSlice.reducer;
