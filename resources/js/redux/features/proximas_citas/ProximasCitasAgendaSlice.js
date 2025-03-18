import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';

export const fetchProximasCitasAgenda = createAsyncThunk(
    'proximasCitasAgenda/fetchProximasCitasAgenda',
    async ({ month, year, sucursales = [] }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API}/proximas-citas`, {
                month,
                year,
                sucursales
            });
            const citasData = response.data.data || [];

            const sucursalColors = {
                "CENTEVI El Dorado": "red",
                "CENTEVI Consultorios Medicos Paitilla": "green",
                "CENTEVI Centro Médico San Judas Tadeo": "#1677FF",
                "Otros": "purple"
            };

            return citasData.map(cita => ({
                id: cita.id || `sin-id-${Math.random().toString(36).substr(2, 9)}`,
                title: cita.paciente?.nombres || 'Sin Nombre',
                start: cita.fecha_hora || new Date().toISOString(),
                end: cita.fecha_hora || new Date().toISOString(),
                backgroundColor: sucursalColors[cita.sucursal?.nombre] || "purple",
                borderColor: sucursalColors[cita.sucursal?.nombre] || "purple",
                badge: cita?.sucursal?.nombre || 'Desconocido',
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
        currentView: 'dayGridMonth'
    },
    reducers: {
        addOrUpdateEvent: (state, action) => {
            const index = state.proximasCitasAgenda.findIndex(
                (event) => event.id === action.payload.id
            );
            if (index !== -1) {
                state.proximasCitasAgenda[index] = action.payload;
            } else {

                state.proximasCitasAgenda.push(action.payload);
            }
        },
        setCurrentViewAgenda: (state, action) => {
            state.currentView = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProximasCitasAgenda.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProximasCitasAgenda.fulfilled, (state, action) => {
                state.loading = false;
                const groupedEvents = {};

                action.payload.forEach((event) => {
                    const eventDate = new Date(event.start);

                    const eventKey = state.currentView === 'dayGridMonth'
                        ? eventDate.toDateString()
                        : eventDate.getTime();

                    if (!groupedEvents[eventKey]) {
                        groupedEvents[eventKey] = [];
                    }
                    groupedEvents[eventKey].push(event);
                });

                const finalEvents = [];
                const maxVisibleEvents = state.currentView === 'dayGridMonth' ? 5 :
                    state.currentView === 'timeGridWeek' ? 2 :
                        state.currentView === 'timeGridDay' ? 7 : 5;

                Object.values(groupedEvents).forEach((eventsAtSameTime) => {
                    if (eventsAtSameTime.length > maxVisibleEvents) {
                        const displayedEvents = eventsAtSameTime.slice(0, maxVisibleEvents);
                        const hiddenEvents = eventsAtSameTime.slice(maxVisibleEvents);

                        const lastEventIndex = displayedEvents.length - 1;
                        displayedEvents[lastEventIndex].extendedProps = {
                            isMoreEvents: true,
                            hiddenEvents: hiddenEvents
                        };

                        finalEvents.push(...displayedEvents);
                    } else {
                        finalEvents.push(...eventsAtSameTime);
                    }
                });

                state.proximasCitasAgenda = finalEvents;
            })


            .addCase(fetchProximasCitasAgenda.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error desconocido';
            });
    }
});
export const { addOrUpdateEvent, setCurrentViewAgenda } = proximasCitasAgendaSlice.actions;
export default proximasCitasAgendaSlice.reducer;
