import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';

export const fetchCitasAgenda = createAsyncThunk(
    'citasAgenda/fetchCitasAgenda',
    async ({ months = [], years = [], ex_proxima_cita = [], has_citas_id, citas_id_null, tipo = [], sucursales = [] }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API}/citas`, {
                months,
                years,
                ex_proxima_cita,
                has_citas_id,
                citas_id_null,
                tipo,
                sucursales
            });
            const citasData = response.data.data || [];

            const sucursalColors = {
                "CENTEVI El Dorado": "#FBDDD9",
                "CENTEVI Consultorios Medicos Paitilla": "#BEE9D3",
                "CENTEVI Centro Médico San Judas Tadeo": "#BCE9FB",
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
                comentarios: cita.comentarios?.trim() || 'Sin comentarios',
                agendado_por: cita.agendado_por?.trim() || ''
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
        currentView: 'timeGridWeek',
        currentType: [0]
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
            state.currentView = action.payload;
        },
        setCurrentTypeAgenda: (state, action) => {
            console.log('Nuevo currentType:', action.payload);
            state.currentType = action.payload;
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

                const finalEvents = [];
                const maxVisibleEvents = state.currentView === 'dayGridMonth' ? 5 :
                    state.currentView === 'timeGridDay' ? 5 : 2;


                Object.entries(groupedEvents).forEach(([key, eventsAtSameTime]) => {
                    if (eventsAtSameTime.length > maxVisibleEvents) {
                        const displayedEvents = eventsAtSameTime.slice(0, maxVisibleEvents);
                        const hiddenEvents = eventsAtSameTime.slice(maxVisibleEvents);

                        const lastEventIndex = displayedEvents.length - 1;
                        const lastEvent = displayedEvents[lastEventIndex];
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
            })
            .addCase(fetchAgendarCitas.fulfilled, (state, action) => {
                console.log('state.currentType,', state.currentType)
                const sucursalColors = {
                    7: "#FBDDD9",
                    4: "#BEE9D3",
                    3: "#BCE9FB",
                    default: "purple"
                };

                if (action.payload.nueva_cita) {
                    const { sucursal_id, tipo, origen_id } = action.payload.nueva_cita;
                    const color = sucursalColors[sucursal_id] || sucursalColors.default;

                    const nuevaCitaTransformada = {
                        ...action.payload.nueva_cita,
                        id: origen_id,
                        start: action.payload.nueva_cita.fecha_hora,
                        end: action.payload.nueva_cita.fecha_hora,
                        title: action.payload.nueva_cita.title,
                        paciente: action.payload.nueva_cita.paciente,
                        doctor: action.payload.nueva_cita.doctor,
                        badge: "Pendiente",
                        backgroundColor: color,
                        borderColor: color,
                    };



                    if (Array.isArray(state.currentType)) {

                        if (state.currentType.includes(0) && state.currentType.includes(1) && state.currentType.length === 2) {
                            if (tipo === "consulta" || tipo === "terapia") {
                                console.log(`✅ Agregando cita porque el tipo es ${tipo} y currentType es [0, 1]`);
                                state.citasAgenda = [...state.citasAgenda, nuevaCitaTransformada];
                            }
                        }

                        else if (state.currentType.includes(0) && state.currentType.includes(1) && state.currentType.includes(2) && state.currentType.length === 3) {
                            if (tipo === "consulta" || tipo === "terapia" || tipo === "proxima_cita") {
                                console.log(`✅ Verificando si la cita de tipo ${tipo} y currentType es [0, 1, 2] ya existe`);


                                if (action.payload.cita_existente_id) {
                                    const citaExistenteIndex = state.citasAgenda.findIndex(
                                        cita => cita.id === action.payload.cita_existente_id
                                    );

                                    if (citaExistenteIndex !== -1) {

                                        console.log(`✅ Actualizando cita con id ${action.payload.cita_existente_id}`);
                                        state.citasAgenda[citaExistenteIndex] = nuevaCitaTransformada;
                                    } else {

                                        console.log(`✅ Agregando nueva cita con tipo ${tipo} porque no existía previamente`);
                                        state.citasAgenda = [...state.citasAgenda, nuevaCitaTransformada];
                                    }
                                } else {

                                    console.log(`✅ Agregando nueva cita con tipo ${tipo} y currentType es [0, 1, 2]`);
                                    state.citasAgenda = [...state.citasAgenda, nuevaCitaTransformada];
                                }
                            }
                        }

                        else if (state.currentType.includes(1) && state.currentType.includes(2) && state.currentType.length === 2) {
                            if (tipo === "terapia" || tipo === "proxima_cita" || tipo === "consulta") {
                                console.log(`✅ Verificando si la cita de tipo ${tipo} y currentType es [1, 2] ya existe`);


                                if (action.payload.cita_existente_id) {
                                    const citaExistenteIndex = state.citasAgenda.findIndex(
                                        cita => cita.id === action.payload.cita_existente_id
                                    );

                                    if (citaExistenteIndex !== -1) {

                                        if (tipo === "consulta") {
                                            console.log(`✅ Eliminando cita con id ${action.payload.cita_existente_id} porque es tipo consulta`);
                                            state.citasAgenda = state.citasAgenda.filter(
                                                cita => cita.id !== action.payload.cita_existente_id
                                            );
                                        } else {

                                            console.log(`✅ Actualizando cita con id ${action.payload.cita_existente_id}`);
                                            state.citasAgenda[citaExistenteIndex] = nuevaCitaTransformada;
                                        }
                                    } else {

                                        console.log(`✅ Agregando nueva cita con tipo ${tipo} porque no existía previamente`);
                                        state.citasAgenda = [...state.citasAgenda, nuevaCitaTransformada];
                                    }
                                } else {

                                    console.log(`✅ Agregando nueva cita con tipo ${tipo} y currentType es [1, 2]`);
                                    state.citasAgenda = [...state.citasAgenda, nuevaCitaTransformada];
                                }
                            }
                        }

                        else if (state.currentType.includes(0) && state.currentType.includes(2) && state.currentType.length === 2) {

                            if (tipo === "terapia" || tipo === "proxima_cita" || tipo === "consulta") {
                                console.log(`✅ Verificando si la cita de tipo ${tipo} y currentType es [0, 2] ya existe`);


                                if (action.payload.cita_existente_id) {
                                    const citaExistenteIndex = state.citasAgenda.findIndex(
                                        cita => cita.id === action.payload.cita_existente_id
                                    );

                                    if (citaExistenteIndex !== -1) {

                                        if (tipo === "terapia") {
                                            console.log(`✅ Eliminando cita con id ${action.payload.cita_existente_id} porque es tipo terapia`);
                                            state.citasAgenda = state.citasAgenda.filter(
                                                cita => cita.id !== action.payload.cita_existente_id
                                            );
                                        } else {
                                            console.log(`✅ Actualizando cita con id ${action.payload.cita_existente_id}`);
                                            state.citasAgenda[citaExistenteIndex] = nuevaCitaTransformada;
                                        }
                                    } else {
                                        console.log(`✅ Agregando nueva cita con tipo ${tipo} porque no existía previamente`);
                                        state.citasAgenda = [...state.citasAgenda, nuevaCitaTransformada];
                                    }
                                } else {
                                    console.log(`✅ Agregando nueva cita con tipo ${tipo} y currentType es [1, 2]`);
                                    state.citasAgenda = [...state.citasAgenda, nuevaCitaTransformada];
                                }
                            }
                        }

                        else {
                            if (state.currentType.includes(0) && tipo === "consulta") {
                                console.log('✅ Agregando cita porque es consulta y currentType es 0');
                                state.citasAgenda = [...state.citasAgenda, nuevaCitaTransformada];
                            } else if (state.currentType.includes(1) && tipo === "terapia") {
                                console.log('✅ Agregando cita porque es terapia y currentType es 1');
                                state.citasAgenda = [...state.citasAgenda, nuevaCitaTransformada];
                            } else if (state.currentType.includes(2)) {
                                console.log('✅ quitando cita porque es  2');
                                state.citasAgenda = state.citasAgenda.filter(
                                    cita => cita.id !== action.payload.cita_existente_id
                                );
                            }
                        }
                    }
                } else {
                    console.log('No hay nueva cita para agregar');
                }
            });

    }
});
export const { addOrUpdateEvent, setCurrentViewAgenda, setCurrentTypeAgenda } = citasAgendaSlice.actions;
export default citasAgendaSlice.reducer;
