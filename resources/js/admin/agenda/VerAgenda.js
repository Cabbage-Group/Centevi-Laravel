import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { Modal, Input, DatePicker, Radio, Button, Space, Popconfirm, Select, Row, Col } from "antd";
import { LeftOutlined, RightOutlined, PlusOutlined, DeleteOutlined, CloseCircleTwoTone } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/es";
import BotonesFiltroAgenda from "./components/BotonesFiltroAgenda";
import { useSelector, useDispatch } from 'react-redux';
import { fetchServicios } from "../../redux/features/servicios/serviciosSlice";

// Configurar dayjs para usar español
dayjs.locale("es");

const VerAgenda = () => {
  const dispatch = useDispatch();

  const [proximosServicios, setProximosServicios] = useState([]);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDates, setEventDates] = useState([dayjs(), dayjs().add(1, "day")]);
  const [eventBadge, setEventBadge] = useState("Trabajo");
  // const [currentView, setCurrentView] = useState("dayGridMonth");
  const [currentView, setCurrentView] = useState("timeGridWeek");
  const [currentEventId, setCurrentEventId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDate, setCurrentDate] = useState(dayjs().format("MMMM YYYY"));
  const calendarRef = useRef(null);

  const { servicios } = useSelector((state) => state.servicios);

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
    const clickedEvent = events.find(event => event.id === info.event.id);
    if (clickedEvent) {
      setIsEditMode(true);
      setCurrentEventId(clickedEvent.id);
      setEventTitle(clickedEvent.title);
      setEventDescription(clickedEvent.description || "");
      setEventDates([
        dayjs(clickedEvent.start),
        dayjs(clickedEvent.end)
      ]);
      setEventBadge(clickedEvent.badge || "Trabajo");
      setIsModalOpen(true);
    }
  };

  const openNewEventModal = () => {
    setIsEditMode(false);
    setCurrentEventId(null);
    setEventTitle("");
    setEventDescription("");
    setEventDates([dayjs(), dayjs().add(1, "day")]);
    setEventBadge("Trabajo");
    setIsModalOpen(true);
  };


  // HANDLE PARA RANGE DATE PICKER
  // const handleCreateOrUpdateEvent = () => {
  //   if (!eventTitle.trim()) return;

  //   if (isEditMode && currentEventId) {
  //     setEvents(events.map(event =>
  //       event.id === currentEventId
  //         ? {
  //           ...event,
  //           title: eventTitle,
  //           start: eventDates[0].format("YYYY-MM-DD HH:mm"),
  //           end: eventDates[1].format("YYYY-MM-DD HH:mm"),
  //           description: eventDescription,
  //           badge: eventBadge,
  //         }
  //         : event
  //     ));
  //   } else {
  //     setEvents([
  //       ...events,
  //       {
  //         id: Date.now().toString(),
  //         title: eventTitle,
  //         start: eventDates[0].format("YYYY-MM-DD HH:mm"),
  //         end: eventDates[1].format("YYYY-MM-DD HH:mm"),
  //         description: eventDescription,
  //         badge: eventBadge,
  //       },
  //     ]);
  //   }

  //   setIsModalOpen(false);
  //   resetForm();
  // };

  const handleCreateOrUpdateEvent = () => {
    if (!eventTitle.trim()) return;

    if (isEditMode && currentEventId) {
      setEvents(events.map(event =>
        event.id === currentEventId
          ? {
            ...event,
            title: eventTitle,
            start: eventDates.format("YYYY-MM-DD HH:mm"),
            description: eventDescription,
            badge: eventBadge,
          }
          : event
      ));
    } else {
      setEvents([
        ...events,
        {
          id: Date.now().toString(),
          title: eventTitle,
          start: eventDates.format("YYYY-MM-DD HH:mm"),
          description: eventDescription,
          badge: eventBadge,
        },
      ]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDeleteEvent = () => {
    if (currentEventId) {
      setEvents(events.filter(event => event.id !== currentEventId));
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
            {categories.map((category) => (
              <Col xxl={24} xl={24} md={24} >
                <div key={category.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
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
          events={events}
          datesSet={(dateInfo) => setCurrentView(dateInfo.view.type)}
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
          eventContent={(eventInfo) => {
            const eventData = events.find((e) => e.id === eventInfo.event.id);
            const badgeColor =
              eventData && eventData.badge === "Importante"
                ? "#ff4d4f"
                : eventData && eventData.badge === "Personal"
                  ? "#52c41a"
                  : "#1890ff";

            return (
              <div
                style={{
                  backgroundColor: badgeColor,
                  color: "white",
                  padding: "2px 4px",
                  borderRadius: "3px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  width: "100%",
                  height: "100%",
                }}
              >
                {eventInfo.event.title}
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
              // value={eventTitle}
              // onChange={(e) => setEventTitle(e.target.value)}
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
              // value={eventTitle}
              // onChange={(e) => setEventTitle(e.target.value)}
              style={{ marginBottom: "5px" }}
            />
          </Col>
          <Col xxl={12} xl={12} md={12}>
            <label style={{ marginTop: '10px' }}>Doctor:</label>
            <Input
              placeholder="Doctor"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
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
          <Radio value="Personal">Terapias</Radio>
          <Radio value="Importante">Consultas</Radio>
          {/* <Radio value="proximacita">Proximas Citas</Radio> */}
        </Radio.Group>

        {/* ------------------- */}

        <div className="form-row mb-4 mt-2">
          <div className="form-group col-md-12">
            <label htmlFor="tags">Servicios a realizar</label>
            <Select
              showSearch
              value={null}
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
                proximosServicios.map((servicio) => {
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
                          const newServicios = proximosServicios.filter(serv => serv.value !== servicio.value);
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
    </div>
  );
};

export default VerAgenda;