import React from 'react';
import { format, parseISO, startOfHour, isSameHour } from 'date-fns';
import { es } from 'date-fns/locale'; // Para formato en español
import '../../../../css/agenda/TimeLine.css';
import { Checkbox, Tooltip, Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Paragraph, Text } = Typography;

const EventCalendar = ({ events, handleEventClick, enviarConfirmacionCita }) => {
  // 1. Función para agrupar eventos por hora
  const groupEventsByHour = () => {
    const grouped = {};

    events.forEach(event => {
      const eventDate = parseISO(event.date);
      const eventDateEnd = parseISO(event.end);
      const hourStart = startOfHour(eventDate);
      const hourEnd = startOfHour(eventDateEnd);

      const hourKey = hourStart.toISOString();
      const hourKeyEnd = hourEnd.toISOString();

      if (!grouped[hourKey]) {
        grouped[hourKey] = {
          hourDisplay: format(hourStart, 'HH:mm'),
          dateDisplay: format(hourStart, 'PPPP', { locale: es }),

          hourDisplayEnd: format(hourEnd, 'HH:mm'),
          dateDisplayEnd: format(hourEnd, 'PPPP', { locale: es }),
          events: []
        };
      }

      grouped[hourKey].events.push(event);
    });

    return grouped;
  };

  // 2. Ordenar eventos por hora
  const sortHourGroups = (groups) => {
    return Object.entries(groups).sort(([keyA], [keyB]) => {
      return new Date(keyA) - new Date(keyB);
    });
  };

  const groupedEvents = groupEventsByHour();
  const sortedGroups = sortHourGroups(groupedEvents);

  const ImageTherapy = () => (
    <img src="../../../img/icon_therapy.png" width={15} height={15} alt="icon therapy" />
  )

  const ImageConsulta = () => (
    <img src="../../../img/icon_consulta.png" width={15} height={15} alt="icon consulta" />
  )

  const ImageHistory = () => (
    <img src="../../../img/history.png" width={15} height={15} alt="icon history" />
  )

  const ImageCheck = () => (
    <img src="../../../img/check.png" width={15} height={15} alt="icon check" />
  )

  const ImageCancel = () => (
    <img src="../../../img/cancel.png" width={15} height={15} alt="icon cancel" />
  )

  const ImageWatch = () => (
    <img src="../../../img/watch.svg" width={18} height={18} alt="icon watch" />
  )

  // 3. Componente para mostrar grupos de eventos
  return (
    <div className="event-calendar-container">
      {/* Encabezado con fecha */}
      {/* {sortedGroups.length > 0 && (
        <div className="date-header">
          {groupedEvents[sortedGroups[0][0]].dateDisplay}
        </div>
      )} */}

      {/* Lista de eventos agrupados */}
      <div className="hour-groups">
        {sortedGroups.map(([hourKey, group]) => (
          <div key={hourKey} className="hour-group">
            {/* Hora a la izquierda */}
            <div className="hour-label">
              {group.hourDisplay} - {group.hourDisplayEnd}
            </div>
            <div style={{ width: '5px', background: '#3BAEA3', height: 'auto' }}></div>
            {/* Eventos (máx 5 por fila) */}
            <div className="events-container">
              {group.events.map((event, index) => (
                <React.Fragment key={event.id}>
                  <div style={{ position: 'relative' }} className="event-card">
                    <div
                      onClick={() => {
                        handleEventClick({ event: event.cita });
                      }}
                    >
                      <div className="event-title">{event.title}</div>
                      <div className="event-title">{event.celular}</div>
                      <div className="event-description" style={{ marginBottom: '5px' }}>
                        <Text
                          ellipsis={true}
                          style={{ width: "180px" }}
                          title={event.comentarios}
                        >
                          {event.comentarios}
                        </Text>
                      </div>
                      <div className="event-description">
                        <div style={{ display: 'flex' }}>
                          <small
                            style={{
                              display: "block",
                              fontSize: "12px",
                              fontWeight: "bold",
                              color: "black",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={event.description}
                          >
                            🧑‍⚕️ {event.doctor}
                          </small>
                        </div>

                      </div>
                      <div className="event-description">
                        <div style={{ display: 'flex' }}>
                          <small
                            style={{
                              display: "block",
                              fontSize: "12px",
                              fontWeight: "bold",
                              color: "black",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={event.description}
                          >
                            {
                              event.description == "terapia"
                                ? <ImageTherapy />
                                : event.description == "consulta"
                                  ? <ImageConsulta />
                                  : <span>🩺</span>
                            } {event.description}


                          </small>
                        </div>
                      </div>




                      <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                        <Tooltip title='Historia Clinica' >
                          <Link to={"/historia-paciente/" + event.paciente_id}>
                            <ImageHistory />
                          </Link>
                        </Tooltip>
                      </div>
                    </div>

                    <div
                      onClick={() => enviarConfirmacionCita({ event: event.cita }, !event.confirmado)}
                      style={{ position: 'absolute', bottom: '10px', right: '30px' }}
                    >
                      {
                        event.confirmado == 'SIN STATUS'
                          ? <Checkbox
                            checked={false}

                          />
                          : event.confirmado == 'CONFIRMADO'
                            ? <ImageCheck />
                            : event.confirmado == 'CANCELADO'
                              ? <ImageCancel />
                              : event.confirmado == 'REAGENDADO'
                                ? <ImageWatch />
                                : <div></div>

                        // <ImageCheck />
                        // <ImageCancel />
                      }

                    </div>
                  </div>
                  {/* Salto de línea cada 5 eventos */}
                  {(index + 1) % 5 === 0 && <div className="break-row"></div>}
                </React.Fragment>
              ))}
              <div
                style={{
                  borderBottom: '1px solid gray',
                  height: '5px',
                  width: '100%',
                  position: 'absolute',
                  bottom: '-12px'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Datos de ejemplo para probar el componente
const sampleEvents = [
  { id: 1, title: 'Reunión Equipo', description: 'Revisión de proyecto', date: '2023-11-15T09:00:00', end: '2023-11-15T09:00:00' },
  { id: 8, title: 'Reunión Equipo', description: 'Revisión de proyecto', date: '2023-11-15T09:00:00', end: '2023-11-15T09:00:00' },
  { id: 9, title: 'Reunión Equipo', description: 'Revisión de proyecto', date: '2023-11-15T09:00:00', end: '2023-11-15T09:00:00' },
  { id: 10, title: 'Reunión Equipo', description: 'Revisión de proyecto', date: '2023-11-15T09:00:00', end: '2023-11-15T09:00:00' },
  { id: 11, title: 'Reunión Equipo', description: 'Revisión de proyecto', date: '2023-11-15T09:00:00', end: '2023-11-15T09:00:00' },
  { id: 12, title: 'Reunión Equipo', description: 'Revisión de proyecto', date: '2023-11-15T09:00:00', end: '2023-11-15T09:00:00' },
  { id: 13, title: 'Reunión Equipo', description: 'Revisión de proyecto', date: '2023-11-15T09:00:00', end: '2023-11-15T09:00:00' },
  { id: 2, title: 'Presentación', description: 'Demo para cliente', date: '2023-11-15T09:30:00', end: '2023-11-15T09:30:00' },
  { id: 3, title: 'Almuerzo', description: 'Con proveedores', date: '2023-11-15T13:00:00', end: '2023-11-15T13:00:00' },
  { id: 4, title: 'Entrevista', description: 'Candidato desarrollador', date: '2023-11-15T13:15:00', end: '2023-11-15T13:15:00' },
  { id: 5, title: 'Revisión', description: 'Documentación técnica', date: '2023-11-15T13:45:00', end: '2023-11-15T13:45:00' },
  { id: 6, title: 'Capacitación', description: 'Nuevo sistema', date: '2023-11-15T14:00:00', end: '2023-11-15T14:00:00' },
  { id: 7, title: 'Seguimiento', description: 'Proyecto X', date: '2023-11-15T14:30:00', end: '2023-11-15T14:30:00' },
];

// Uso del componente
const TimeLine = ({ citasAgenda, fechaSeleccionada, handleEventClick, enviarConfirmacionCita }) => {
  // Función para normalizar fechas y comparar solo día, mes y año
  const normalizarFecha = (fecha) => {
    // Si es string (como "2025-06-14 10:20:00")
    if (typeof fecha === 'string') {
      return fecha.split(' ')[0]; // Tomar solo la parte de la fecha "YYYY-MM-DD"
    }
    // Si es objeto Date
    const d = new Date(fecha);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const formatearFechaBonita = (fecha) => {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = meses[d.getMonth()];
    const año = d.getFullYear();
    return `${dia} de ${mes} del ${año}`;
  };

  // Filtrar citas que coincidan con la fecha seleccionada
  const citasFiltradas = citasAgenda.filter(cita => {
    const fechaCitaNormalizada = normalizarFecha(cita.start);
    const fechaSeleccionadaNormalizada = normalizarFecha(fechaSeleccionada);
    return fechaCitaNormalizada === fechaSeleccionadaNormalizada;
  });

  // Función para sumar 1 hora a una fecha
  const sumarHoras = (fechaString, horas = 1) => {
    const fecha = new Date(fechaString);

    if (isNaN(fecha.getTime())) {
      // Si la fecha no es válida, usamos la fecha actual como fallback
      const ahora = new Date();
      ahora.setHours(ahora.getHours() + horas);
      return ahora.toISOString().slice(0, 19).replace('T', ' ');
    }
    fecha.setHours(fecha.getHours() + horas);


    return fecha.toISOString();
  };

  return (
    <div>
      <div style={{
        fontSize: '1.2rem',
        fontWeight: 'bold',
        margin: '10px 0',
        textAlign: 'center',
        color: '#333'
      }}>
        {formatearFechaBonita(fechaSeleccionada)}
      </div>



      {/* <button onClick={() => {
        console.log(fechaSeleccionada)
        var x = citasFiltradas.map((cita, index) => {
          // Verificamos explícitamente si fecha_hora_fin existe y es válida
          const endDate =
            cita.fecha_hora_fin && !isNaN(new Date(cita.fecha_hora_fin).getTime()) &&
              cita.fecha_hora_fin !== null
              ? cita.fecha_hora_fin
              : sumarHoras(cita.start, 1);

          console.log(`Cita ${index}:`, {
            start: cita.start,
            originalEnd: cita.fecha_hora_fin,
            calculatedEnd: endDate,
            calule: sumarHoras(cita.start, 1)
          });

          return {
            id: index,
            title: cita.title,
            description: cita.tipo,
            date: cita.start,
            end: endDate
          };
        })
        console.log(x)
      }}>fecha</button> */}
      <EventCalendar
        events={citasFiltradas.map((cita, index) => {
          // Verificamos explícitamente si fecha_hora_fin existe y es válida
          const endDate = cita.fecha_hora_fin && !isNaN(new Date(cita.fecha_hora_fin).getTime()) && cita.fecha_hora_fin !== null
            ? cita.fecha_hora_fin
            : sumarHoras(cita.start, 1);

          return {
            id: cita.id,
            title: cita.title,
            description: cita.tipo,
            date: cita.start,
            end: endDate,
            nroCedula: cita.nro_cedula,
            celular: cita.celular,
            comentarios: cita.comentarios,
            confirmado: cita.confirmado,
            doctor: cita.doctor,
            paciente_id: cita.paciente_id,
            cita: cita
          };
        })}
        handleEventClick={handleEventClick}
        enviarConfirmacionCita={enviarConfirmacionCita}
      />
    </div>
  );
};

export default TimeLine;