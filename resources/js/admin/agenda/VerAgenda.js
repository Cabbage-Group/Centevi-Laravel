import React, { useState, useRef, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { Modal, Input, DatePicker, Radio, Button, Space, Popconfirm, Select, Row, Col, List } from "antd";
import { LeftOutlined, RightOutlined, PlusOutlined, DeleteOutlined, CloseCircleTwoTone } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/es";
import BotonesFiltroAgenda from "./components/BotonesFiltroAgenda";
import { useSelector, useDispatch } from 'react-redux';
import { fetchServicios, fetchServiciosProximosAgenda } from "../../redux/features/servicios/serviciosSlice";
import { addOrUpdateEvent, fetchProximasCitasAgenda, setCurrentViewAgenda } from "../../redux/features/proximas_citas/ProximasCitasAgendaSlice";
import { fetchSucursales } from "../../redux/features/sucursales/sucursalesSlice";


dayjs.locale("es");

const VerAgenda = () => {
  const dispatch = useDispatch();

  const [proximosServicios, setProximosServicios] = useState([]);
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Reunión de equipo",
      start: "2025-03-13T10:00:00",
      end: "2025-03-13T11:00:00",
      badge: "Importante",
    },
    {
      id: "2",
      title: "Consulta médica",
      start: "2025-03-13T14:00:00",
      end: "2024-03-15T15:00:00",
      badge: "Personal",
    },
    {
      id: "3",
      title: "Entrega de proyecto",
      start: "2024-03-16T16:00:00",
      end: "2024-03-16T17:00:00",
      badge: "Trabajo",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [nroCedula, setNroCedula] = useState("");
  const [doctor, setDoctor] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDates, setEventDates] = useState([dayjs(), dayjs().add(1, "day")]);
  const [eventBadge, setEventBadge] = useState("");
  const [tableName, setTableName] = useState("")
  const [consultaId, setConsultaId] = useState()
  const [currentView, setCurrentView] = useState("timeGridDay");
  const [currentEventId, setCurrentEventId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDate, setCurrentDate] = useState(dayjs().format("MMMM YYYY"));
  const [currentDateAgenda, setCurrentDateAgenda] = useState(new Date());
  const [groupedEvents, setGroupedEvents] = useState([]);
  const [isGroupedModalOpen, setIsGroupedModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [selectedSucursales, setSelectedSucursales] = useState([]);

  // const [month, setMonth] = useState(currentDateAgenda.getMonth() + 1);
  // const [year, setYear] = useState(currentDateAgenda.getFullYear());
  const calendarRef = useRef(null);


  const { servicios, serviciosProximos, serviciosProximos_options } = useSelector((state) => state.servicios);

  const { proximasCitasAgenda } = useSelector((state) => state.proximasCitasAgenda);

  const { sucursales_with_colors } = useSelector((state) => state.sucursales);




  useEffect(() => {
    dispatch(fetchSucursales({}))
  }, [])

  console.log('sucursales_with_colors:', sucursales_with_colors)

  useEffect(() => {
    const month = currentDateAgenda.getMonth() + 1;
    const year = currentDateAgenda.getFullYear();
    dispatch(fetchProximasCitasAgenda({ month, year, sucursales: selectedSucursales }));
  }, [currentView, currentDateAgenda, selectedSucursales, dispatch]);

  const handleDateChange = (dateInfo) => {
    const { view } = dateInfo;
    let newDate = new Date(view.currentStart);
    console.log('newDate:', newDate)
    if (currentDateAgenda.getMonth() !== newDate.getMonth() || currentDateAgenda.getFullYear() !== newDate.getFullYear()) {
      setCurrentDateAgenda(newDate);
    }
  };


  const handleSucursalChange = (id) => {
    setSelectedSucursales((prev) =>
      prev.includes(id) ? prev.filter((sucursalId) => sucursalId !== id) : [...prev, id]
    );
  };


  const handleDateClick = (info) => {
    setIsEditMode(false);
    setCurrentEventId(null);
    setEventTitle("");
    setEventDescription("");
    setEventDates([dayjs(info.dateStr), dayjs(info.dateStr).add(1, "day")]);
    setEventBadge("Trabajo");
    setIsModalOpen(true);
  };

  const handleEventClick = (info) => {
    const eventId = Number(info.event.id);

    // if (info.extendedProps?.isMoreEvents) {
    //   setGroupedEvents(info.extendedProps.hiddenEvents);
    //   setIsGroupedModalOpen(true);
    // } else {
    //   console.log("Evento normal seleccionado:", info);
    // }


    let clickedEvent = proximasCitasAgenda.find(
      (event) => Number(event.id) === eventId
    );

    if (!clickedEvent) {
      proximasCitasAgenda.forEach(event => {
        if (event.extendedProps?.hiddenEvents) {
          const foundInHidden = event.extendedProps.hiddenEvents.find(
            (hiddenEvent) => Number(hiddenEvent.id) === eventId
          );
          if (foundInHidden) {
            clickedEvent = foundInHidden;
          }
        }
      });
    }

    if (clickedEvent) {
      setIsEditMode(true);
      setCurrentEventId(clickedEvent.id);
      setEventTitle(clickedEvent.extendedProps.paciente);
      setNroCedula(clickedEvent.extendedProps.nro_cedula);
      setDoctor(clickedEvent.extendedProps.doctor);
      setSucursal(clickedEvent.extendedProps.sucursal);
      setTableName(clickedEvent.extendedProps.origen_tabla);
      setConsultaId(clickedEvent.extendedProps.origen_id);
      setEventDescription(clickedEvent.extendedProps.comentarios || "");
      setEventDates([dayjs(clickedEvent.start)]);
      setEventBadge(clickedEvent.badge || "");
      setIsModalOpen(true);
    }
  };


  useEffect(() => {
    if (tableName && consultaId) {
      dispatch(
        fetchServiciosProximosAgenda({
          consulta_nombre: tableName,
          consulta_id: consultaId,
        })
      );
    }
  }, [tableName, consultaId, dispatch]);

  const openNewEventModal = () => {
    setIsEditMode(false);
    setCurrentEventId(null);
    setEventTitle("");
    setEventDescription("");
    setEventDates([dayjs(), dayjs().add(1, "day")]);
    setEventBadge("Trabajo");
    setIsModalOpen(true);
  };


  const handleCreateOrUpdateEvent = () => {
    if (!eventTitle.trim()) return;
    console.log('emtre')

    const newEvent = {
      id: isEdit ? currentEventId : Date.now().toString(),
      title: eventTitle,
      start: eventDates.format("YYYY-MM-DD HH:mm:ss"),
      description: eventDescription,
      badge: eventBadge,
    };
    dispatch(addOrUpdateEvent(newEvent))

    setIsModalOpen(false);
    // resetForm();
  };

  const handleDeleteEvent = () => {
    if (currentEventId) {
      setEvents(proximasCitasAgenda.filter(event => event.id !== currentEventId));
      setIsModalOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setEventTitle("");
    setEventDescription("");
    setEventDates([dayjs(), dayjs().add(1, "day")]);
    setEventBadge("Trabajo");
    setCurrentEventId(null);
    setIsEditMode(false);
  };

  const changeView = (viewName) => {

    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(viewName);
      dispatch(setCurrentViewAgenda(viewName));
      setCurrentView(viewName);
    }
  };

  const goToToday = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
    }
  };

  const goToPrev = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
    }
  };

  const goToNext = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
    }
  };

  const categories = [
    { "name": "Centro Médico San Judas Tadeo", "color": "green" },
    { "name": "Consultorios Medicos Paitilla", "color": "#1677FF" },
    { "name": " El Dorado", "color": "red" },
    // { "name": "Giras Interior del Pais", "color": "#D96B6B" },
    // { "name": "Consultorio Town Center Costa del Este", "color": "#88A04B" },
  ]

  useEffect(() => {
    dispatch(fetchServicios());
  }, []);

  const handleShowMore = (hiddenEvents, event) => {
    event.stopPropagation();

    setModalPosition({
      top: event.clientY,
      left: event.clientX,
    });

    setGroupedEvents(hiddenEvents);
    setIsGroupedModalOpen(true);
  };

  return (
    <div
      style={{
        width: "100%", margin: "auto", padding: "30px",
      }}
    >
      <div
        style={{ display: 'flex', position: 'relative' }}
      >

        <h2>Calendario</h2>

        <div
          style={{
            position: 'absolute', right: '0'
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openNewEventModal}
          >
            Agendar Cita
          </Button>
        </div>
      </div>

      <div
        style={{
          background: 'white',
          padding: '40px',
          position: 'relative'
        }}
      >

        {/* FILTROS DE AGENDAS */}

        <BotonesFiltroAgenda
          lista_botones={["Consultas", "Terapias", "Proximas Citas"]}
        />


        <div style={{ display: "flex", justifyContent: "center", marginBottom: "45px", fontSize: "18px", fontWeight: "bold" }}>
          <span style={{ fontSize: "18px", fontWeight: "bold" }}>{currentDate}</span>
        </div>
        <div
          style={{
            position: 'absolute', top: '30px', left: '40px', width: '43%'
          }}
        >
          <Row gutter={[8, 2]}>
            {sucursales_with_colors?.map((category) => (
              <Col key={category.id} xxl={24} xl={24} md={24}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={selectedSucursales.includes(category.id)}
                    onChange={() => handleSucursalChange(category.id)}
                  />
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: category.color,
                      borderRadius: 3,
                    }}
                  />
                  <span>{category.name}</span>
                </div>
              </Col>
            ))}
          </Row>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "70px" }}>
          <Space>
            <Button onClick={goToPrev} icon={<LeftOutlined />} />
            <Button onClick={goToNext} icon={<RightOutlined />} />
            <Button onClick={goToToday}>
              Hoy
            </Button>
          </Space>

          <Space>
            <Button
              onClick={() => changeView("dayGridMonth")}
              type={currentView === "dayGridMonth" ? "primary" : "default"}
            >
              Mes
            </Button>
            <Button
              onClick={() => changeView("timeGridWeek")}
              type={currentView === "timeGridWeek" ? "primary" : "default"}
            >
              Semana
            </Button>
            <Button
              onClick={() => changeView("timeGridDay")}
              type={currentView === "timeGridDay" ? "primary" : "default"}
            >
              Día
            </Button>
          </Space>
        </div>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={currentView}
          headerToolbar={false}
          locale={esLocale}
          editable
          selectable
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={proximasCitasAgenda}
          eventDisplay="block"
          datesSet={handleDateChange}
          buttonText={{
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
          }}
          hiddenDays={[0]}
          slotMinTime="08:00:00"
          slotMaxTime="19:00:00"
          slotLabelFormat={{
            hour: "numeric",
            minute: "2-digit",
            hour12: false,
            meridiem: 'short'
          }}
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            hour12: false,
            meridiem: 'short',
          }}

          height="auto"
          eventContent={(info) => {
            const { hiddenEvents } = info.event.extendedProps;
            const doctorName = info.event.extendedProps?.doctor || "No asignado";
            const eventTime = info.timeText;

            return (
              <div>
                <b>{eventTime} - {info.event.title}</b><br />
                <small>{doctorName}</small>

                {hiddenEvents && hiddenEvents.length > 0 && (
                  <span
                    style={{
                      color: "black",
                      cursor: "pointer",
                      position: "absolute",
                      bottom: "0px",
                      right: "0px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      backgroundColor: "white",
                      padding: "2px 4px",
                      borderRadius: "4px",
                      whiteSpace: "nowrap"
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowMore(hiddenEvents, e);
                    }}
                  >
                    +{hiddenEvents.length} más
                  </span>
                )}
              </div>
            );
          }}
        />
      </div>

      <Modal
        title={isEditMode ? "Editar Cita" : "Agendar Cita"}
        open={isModalOpen}
        width={"90vh"}
        onCancel={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        footer={[
          isEditMode && (
            <Popconfirm
              key="delete"
              title="¿Está seguro de eliminar este evento?"
              onConfirm={handleDeleteEvent}
              okText="Sí"
              cancelText="No"
            >
              <Button danger icon={<DeleteOutlined />}>
                Eliminar
              </Button>
            </Popconfirm>
          ),
          <Button
            key="cancel"
            onClick={() => {
              setIsModalOpen(false);
              resetForm();
            }}
          >
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleCreateOrUpdateEvent}
          >
            {isEditMode ? "Actualizar" : "Crear"}
          </Button>,
        ]}
        style={{ width: "90vh" }}
      >
        <label style={{ marginTop: '10px' }}>Agendado por:</label>
        <Input
          placeholder="Usuario Conectado"
          // value={eventTitle}
          // onChange={(e) => setEventTitle(e.target.value)}
          style={{ marginBottom: "5px" }}
          disabled
        />

        {/*  */}
        <Row gutter={[16, 16]}>
          <Col xxl={8} xl={8} md={8}>
            <label style={{ marginTop: '10px' }}>Cedula:</label>
            <Input
              placeholder="Cedula"
              value={nroCedula}
              onChange={(e) => setNroCedula(e.target.value)}
              style={{ marginBottom: "5px" }}
            />
          </Col>
          <Col xxl={16} xl={16} md={16}>
            <label style={{ marginTop: '10px' }}>Nombre del paciente:</label>
            <Input
              placeholder="Paciente"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              style={{ marginBottom: "5px" }}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xxl={12} xl={12} md={12}>
            <label style={{ marginTop: '10px' }}>Sucursal:</label>
            <Input
              placeholder="Sucursal"
              value={sucursal}
              onChange={(e) => setSucursal(e.target.value)}
              style={{ marginBottom: "5px" }}
            />
          </Col>
          <Col xxl={12} xl={12} md={12}>
            <label style={{ marginTop: '10px' }}>Doctor:</label>
            <Input
              placeholder="Doctor"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              style={{ marginBottom: "5px" }}
            />
          </Col>
        </Row>

        {/*  */}
        <label style={{ marginTop: '10px' }}>Comentarios de la agenda:</label>
        <Input.TextArea
          placeholder="Descripción del Evento"
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
          style={{ marginBottom: "5px" }}
        />

        <label style={{ marginTop: '10px' }}>Fecha y hora de la agenda:</label>
        <DatePicker
          showTime={{ format: "HH:mm" }} // Solo muestra horas y minutos
          value={eventDates}
          onChange={(date) => {
            console.log(date);
            setEventDates(date);
          }}
          format="YYYY-MM-DD HH:mm" // Formato sin segundos
          style={{ marginBottom: "10px", width: "100%" }}
          placeholder="Fecha de la agenda"
        />


        {/* <DatePicker.RangePicker
          showTime
          value={[eventDates[0], eventDates[1]]}
          onChange={(dates) => setEventDates(dates)}
          style={{ marginBottom: "10px", width: "100%" }}
          placeholder={["Fecha inicio", "Fecha fin"]}
        /> */}
        <Radio.Group
          value={eventBadge}
          onChange={(e) => setEventBadge(e.target.value)}
        >
          {/* <Radio value="Trabajo">Cita</Radio> */}
          <Radio value="terapia">Terapias</Radio>
          <Radio value="consulta">Consultas</Radio>
          {/* <Radio value="proximacita">Proximas Citas</Radio> */}
        </Radio.Group>

        {/* ------------------- */}

        <div className="form-row mb-4 mt-2">
          <div className="form-group col-md-12">
            <label htmlFor="tags">Servicios a realizar</label>
            <Select
              showSearch
              value={serviciosProximos_options}
              style={{
                width: '100%', color: 'transparent',
                background: 'white !important'
              }}
              onChange={(value, val) => {
                if (!proximosServicios.find(servicio => servicio.value == value)) {
                  const newServicios = [...proximosServicios, val];
                  setProximosServicios(newServicios)
                }
              }}
              options={servicios.map(servicio => ({
                value: servicio.id,
                label: servicio.codigo + " | " + servicio.servicio
              }))}
              filterOption={(input, option) => {
                const searchTerms = input.toLowerCase().split(' ');
                return searchTerms.every(term =>
                  (option?.label ?? '').toLowerCase().includes(term)
                );
              }}
            >
            </Select>
            <div
              style={{
                display: 'ruby',
                marginTop: '10px',
                marginBottom: '10px'
              }}
              onClick={() => {
              }}
            >
              {
                serviciosProximos_options.map((servicio) => {
                  return (
                    <div
                      style={{
                        color: 'black',
                        background: 'white',
                        border: '1px solid gray',
                        paddingTop: '5px',
                        paddingBottom: '5px',
                        paddingLeft: '10px',
                        paddingRight: '10px',
                        borderRadius: '20px',
                        display: 'flex',
                        marginRight: '5px',
                        marginTop: '5px'
                      }}
                    >
                      {servicio.label}
                      <div
                        style={{
                          marginLeft: '5px',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          const newServicios = serviciosProximos_options.filter(serv => serv.value !== servicio.value);
                          setProximosServicios(newServicios)
                        }}
                      >
                        <CloseCircleTwoTone twoToneColor="#eb2f96" />
                      </div>
                    </div>
                  )
                })
              }

            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title="Eventos agrupados"
        open={isGroupedModalOpen}
        onCancel={() => setIsGroupedModalOpen(false)}
        footer={null}
        width={250}
        style={{
          position: "absolute",
          top: modalPosition.top,
          left: modalPosition.left,
        }}
      >
        <List
          dataSource={groupedEvents}
          renderItem={(event) => (
            <List.Item
              style={{
                cursor: "pointer",
                padding: "6px",
                marginBottom: "6px",
                backgroundColor: event.backgroundColor,
                borderLeft: `3px solid ${event.borderColor}`,
                borderRadius: "6px",
                color: "white",
                fontSize: "12px", 
              }}
              onClick={() => {
                setIsGroupedModalOpen(false);
                handleEventClick({ event: { id: event.id } });
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <strong style={{ fontSize: "11px" }}>{dayjs(event.start).format("HH:mm")}- {event.title}</strong>
                <span style={{ fontSize: "10px", opacity: 0.7 }}>{event.extendedProps.doctor}</span>
              </div>
            </List.Item>
          )}
        />

      </Modal>



    </div>
  );
};

export default VerAgenda;