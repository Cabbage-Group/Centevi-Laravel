import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';

export const fetchCitasAgenda = createAsyncThunk(
    'citasAgenda/fetchCitasAgenda',
    async ({ month, year, ex_proxima_cita, has_citas_id, citas_id_null, tipo, sucursales = [] }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API}/citas`, {
                month,
                year,
                ex_proxima_cita,
                has_citas_id,
                citas_id_null,
                tipo,
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
                origen_id: cita.origen_id || 'Sin ID',
                origen_tabla: cita.origen_tabla || 'Desconocido',
                tipo: cita.tipo || 'Desconocido',
                paciente_id: cita.paciente_id || 'No registrado',
                nro_cedula: cita.paciente?.nro_cedula || 'Sin datos',
                sucursal_id: cita?.sucursal_id || 'Sin sucursal',
                doctor: cita?.doctor || 'Sin datos',
                paciente: cita.paciente?.nombres || 'Sin Nombre',
                sucursal: cita.sucursal?.nombre || 'Sin Sucursal',
                celular: cita.paciente?.celular || "00000000",
                comentarios: cita.comentarios?.trim() || 'Sin comentarios'
            }));

        } catch (error) {
            console.error('Error en fetchProximasCitasAgenda:', error);
            return rejectWithValue(error.response?.data || 'Error fetching citas');
        }
    }
);

export const fetchAgendarCitas = createAsyncThunk(
    'citasAgenda/fetchAgendarCitas',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API}/citas/agendar`, data);
            return response.data;

        } catch (error) {
            console.error('Error en fetchProximasCitasAgenda:', error);
            return rejectWithValue(error.response?.data || 'Error fetching citas');
        }
    }
);

const citasAgendaSlice = createSlice({
    name: 'citasAgenda',
    initialState: {
        citasAgenda: [],
        loading: false,
        error: null,
        currentView: 'timeGridWeek'
    },
    reducers: {
        addOrUpdateEvent: (state, action) => {
            const index = state.citasAgenda.findIndex(
                (event) => event.id === action.payload.id
            );
            if (index !== -1) {
                state.citasAgenda[index] = action.payload;
            } else {

                state.citasAgenda.push(action.payload);
            }
        },
        setCurrentViewAgenda: (state, action) => {
            console.log('action.payload:', action.payload)
            state.currentView = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCitasAgenda.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCitasAgenda.fulfilled, (state, action) => {
                state.loading = false;
                const groupedEvents = {};

                action.payload.forEach((event) => {
                    const eventDate = new Date(event.start);
                    let eventKey;

                    if (state.currentView === 'timeGridWeek' || state.currentView === 'timeGridDay') {
                        // Agrupar por hora
                        eventKey = `${eventDate.toDateString()} ${eventDate.getHours()}:00`;
                    } else if (state.currentView === 'dayGridMonth') {
                        // Agrupar por día
                        eventKey = eventDate.toDateString();
                    }

                    if (!groupedEvents[eventKey]) {
                        groupedEvents[eventKey] = [];
                    }

                    groupedEvents[eventKey].push(event);
                });


                console.log('groupedEvents:', groupedEvents);

                const finalEvents = [];
                const maxVisibleEvents = state.currentView === 'dayGridMonth' ? 5 :
                    state.currentView === 'timeGridDay' ? 5 : 2;


                Object.entries(groupedEvents).forEach(([key, eventsAtSameTime]) => {
                    if (eventsAtSameTime.length > maxVisibleEvents) {
                        const displayedEvents = eventsAtSameTime.slice(0, maxVisibleEvents);
                        const hiddenEvents = eventsAtSameTime.slice(maxVisibleEvents);

                        const lastEventIndex = displayedEvents.length - 1;
                        const lastEvent = displayedEvents[lastEventIndex];
                        console.log('lastEvent:', lastEvent)
                        displayedEvents[lastEventIndex].extendedProps = {
                            isMoreEvents: true,
                            hiddenEvents: hiddenEvents
                        };

                        finalEvents.push(...displayedEvents);
                    } else {
                        finalEvents.push(...eventsAtSameTime);
                    }
                });



                state.citasAgenda = finalEvents
            })
            .addCase(fetchCitasAgenda.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error desconocido';
            });
    }
});
export const { addOrUpdateEvent, setCurrentViewAgenda } = citasAgendaSlice.actions;
export default citasAgendaSlice.reducer;
