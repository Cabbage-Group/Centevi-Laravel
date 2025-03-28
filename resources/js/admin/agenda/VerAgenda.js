import React, { useState, useRef, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { Modal, Input, DatePicker, Radio, Button, Space, Popconfirm, Select, Row, Col, List, Form } from "antd";
import { LeftOutlined, RightOutlined, PlusOutlined, DeleteOutlined, CloseCircleTwoTone, EyeOutlined, PhoneOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/es";
import BotonesFiltroAgenda from "./components/BotonesFiltroAgenda";
import { useSelector, useDispatch } from 'react-redux';
import { fetchServicios, fetchServiciosProximosAgenda } from "../../redux/features/servicios/serviciosSlice";
import { addOrUpdateEvent, fetchAgendarCitas, fetchCitasAgenda, setCurrentViewAgenda } from "../../redux/features/citas/CitasAgendaSlice";
import { fetchSucursales } from "../../redux/features/sucursales/sucursalesSlice";
import Swal from 'sweetalert2';


dayjs.locale("es");

const VerAgenda = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm()
  const { servicios, serviciosProximos, serviciosProximos_options } = useSelector((state) => state.servicios);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [proximosServicios, setProximosServicios] = useState(serviciosProximos_options);
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
  const [celular, setCelular] = useState()
  const [eventDescription, setEventDescription] = useState("");
  const [eventDates, setEventDates] = useState(dayjs());
  const [eventBadge, setEventBadge] = useState("");
  const [tableName, setTableName] = useState("");
  const [sucursalId, setSucursalId] = useState();
  const [pacienteId, setPacienteId] = useState();
  const [consultaId, setConsultaId] = useState()
  const [currentView, setCurrentView] = useState("timeGridWeek");
  const [currentEventId, setCurrentEventId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDate, setCurrentDate] = useState(dayjs().format("MMMM YYYY"));
  const [currentDateAgenda, setCurrentDateAgenda] = useState(new Date());
  const [groupedEvents, setGroupedEvents] = useState([]);
  const [isGroupedModalOpen, setIsGroupedModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [selectedSucursales, setSelectedSucursales] = useState([]);
  const [hideSunday, setHideSunday] = useState(true);
  const [mensaje, setMensaje] = useState(
    'Buenas Tardes, le escribimos de {sucursal} para informarle que los lentes de el Paciente {nombre} estan listo.'
  );

  const calendarRef = useRef(null);




  const { citasAgenda } = useSelector((state) => state.citasAgenda);

  const { sucursales_with_colors } = useSelector((state) => state.sucursales);

  useEffect(() => {
    dispatch(fetchSucursales({}))
  }, [])



  useEffect(() => {
    setProximosServicios(serviciosProximos_options);
  }, [serviciosProximos_options]);

  useEffect(() => {
    const month = currentDateAgenda.getMonth() + 1;
    const year = currentDateAgenda.getFullYear();

    let tipo = '';
    let ex_proxima_cita = false;
    let citas_id_null = true

    if (selectedIndex === 0) {
      tipo = 'consulta';
      citas_id_null = true;
      ex_proxima_cita = false;
    } else if (selectedIndex === 1) {
      tipo = 'terapia';
      ex_proxima_cita = false;
    } else if (selectedIndex === 2) {
      tipo = '';
      citas_id_null = true
      ex_proxima_cita = true;
    }

    dispatch(fetchCitasAgenda({ month, year, sucursales: selectedSucursales, tipo, ex_proxima_cita, citas_id_null }));
  }, [currentView, currentDateAgenda, selectedSucursales, selectedIndex, dispatch]);

  const handleDateChange = (dateInfo) => {
    const { view } = dateInfo;
    let newDate = new Date(view.currentStart);
    if (currentDateAgenda.getMonth() !== newDate.getMonth() || currentDateAgenda.getFullYear() !== newDate.getFullYear()) {
      setCurrentDateAgenda(newDate);
    }
  };


  const handleSucursalChange = (id) => {
    setSelectedSucursales((prev) =>
      prev.includes(id) ? prev.filter((sucursalId) => sucursalId !== id) : [...prev, id]
    );
  };

  const generateWhatsAppLink = () => {
    const telefonoFormateado = `${celular.replace(/[^\d]/g, '')}`;
    let mensajePersonalizado = mensaje
      .replace('{nombre}', eventTitle)
      .replace('{sucursal}', sucursal);

    const mensajeCodificado = encodeURIComponent(mensajePersonalizado);


    return `https://wa.me/${telefonoFormateado}?text=${mensajeCodificado}`;
  };

  const handleContactarPaciente = async () => {

    try {
      // Abrir enlace de WhatsApp
      window.open(generateWhatsAppLink(), '_blank');
    } catch (error) {
      console.error('Error al crear contacto:', error);
    }
  };


  const handleDateClick = (info) => {
    setIsEditMode(false);
    form.setFieldsValue({
      fechaAgenda: dayjs(info.dateStr)
    });
    setCurrentEventId(null);
    setEventTitle("");
    setEventDescription("");
    setEventDates([dayjs(info.dateStr), dayjs(info.dateStr).add(1, "day")]);
    setEventBadge("Trabajo");
    setIsModalOpen(true);
  };

  const handleEventClick = (info) => {
    const eventId = Number(info.event.id);
    let clickedEvent = citasAgenda.find(
      (event) => Number(event.id) === eventId
    );

    if (!clickedEvent) {
      citasAgenda.forEach(event => {
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
      dispatch(
        fetchServiciosProximosAgenda({
          consulta_nombre: tableName,
          consulta_id: consultaId,
        })
      );
      setIsEditMode(true);
      setCurrentEventId(clickedEvent.id);
      setTableName(clickedEvent.origen_tabla);
      setConsultaId(clickedEvent.origen_id);
      setSucursalId(clickedEvent.sucursal_id);
      setPacienteId(clickedEvent.paciente_id)
      setCelular(clickedEvent.celular);
      setIsModalOpen(true);

      console.log("Antes de setFieldsValue:", form.getFieldsValue());
      console.log("serviciosProximos_options:", serviciosProximos_options);

      form.setFieldsValue({
        nroCedula: clickedEvent.nro_cedula || "",
        paciente: clickedEvent.paciente || "",
        sucursal: clickedEvent.sucursal || "",
        doctor: clickedEvent.doctor || "",
        comentarios: clickedEvent.comentarios || "",
        fechaAgenda: dayjs(clickedEvent.start),
        tipoAgenda: clickedEvent.tipo || ""
      });

      form.validateFields();

      console.log("Después de setFieldsValue:", form.getFieldsValue());
    }
  };


  useEffect(() => {
    dispatch(
      fetchServiciosProximosAgenda({
        consulta_nombre: tableName,
        consulta_id: consultaId,
      })
    );
  }, [consultaId]);

  useEffect(() => {
    if (serviciosProximos_options.length > 0) {
      form.setFieldsValue({
        proximosServicios: serviciosProximos_options
      });
    }
  }, [serviciosProximos_options]);

  const openNewEventModal = () => {
    setIsEditMode(false);
    setCurrentEventId(null);
    setEventTitle("");
    setEventDescription("");
    setEventDates([dayjs(), dayjs().add(1, "day")]);
    setEventBadge("Trabajo");
    setIsModalOpen(true);
  };

  const handleAgendarEvent = (values) => {
    console.log('values:', values)
    if (!eventDates) {
      Swal.fire({
        icon: "warning",
        title: "Fecha requerida",
        text: "Por favor, selecciona una fecha antes de agendar.",
      });
      return;
    }

    Swal.fire({
      title: "¿Confirmar agendamiento?",
      text: "¿Deseas agendar esta cita?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, agendar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          cita_existente_id: currentEventId,
          origen_id: consultaId,
          origen_tabla: tableName,
          fecha_hora: values.fechaAgenda.format("YYYY-MM-DD HH:mm"),
          tipo: values.tipoAgenda,
          paciente_id: pacienteId,
          doctor: values.doctor,
          sucursal_id: sucursalId,
          comentarios: values.comentarios,
        };

        console.log('result:', data);
        setIsModalOpen(false);
        dispatch(fetchAgendarCitas(data));

        Swal.fire({
          icon: "success",
          title: "Cita Agendada",
          text: "La cita ha sido agendada exitosamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };



  const handleDeleteEvent = () => {
    if (currentEventId) {
      setEvents(citasAgenda.filter(event => event.id !== currentEventId));
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
    setDoctor("");
    setSucursal("");
    setNroCedula("")
    setProximosServicios([]);
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

  const toggleSunday = () => {
    setHideSunday(!hideSunday);
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
          setSelectedIndex={setSelectedIndex}
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
            <Button onClick={toggleSunday} icon={<EyeOutlined />} type={hideSunday ? "default" : "primary"} />
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
          events={citasAgenda}
          eventOrder="id"
          eventDisplay="block"
          datesSet={handleDateChange}
          buttonText={{
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
          }}
          hiddenDays={hideSunday ? [0] : []}
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
            const doctorName = info.event.extendedProps.doctor;
            const eventTime = info.timeText;

            // console.log('info:', info)

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
          form.resetFields();
          resetForm();
        }}
        footer={[
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}>
            <Button
              type="default"
              icon={<PhoneOutlined />}
              onClick={handleContactarPaciente}
            >
              Contactar
            </Button>

            <div style={{ display: 'flex', gap: 8 }}>
              {isEditMode && (
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
              )}
              <Button
                key="cancel"
                onClick={() => {
                  setIsModalOpen(false);
                  form.resetFields();
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button
                key="submit"
                type="primary"
                onClick={() => form.submit()}
              >
                Agendar Cita
              </Button>
            </div>
          </div>
        ]}
        style={{ width: "90vh" }}


      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAgendarEvent}
        >

          <label style={{ marginTop: '10px' }}>Agendado por:</label>
          <Input
            placeholder="Usuario Conectado"
            style={{ marginBottom: "5px" }}
            disabled
          />

          {/*  */}
          <Row gutter={[16, 16]}>
            <Col xxl={8} xl={8} md={8}>
              <label style={{ marginTop: '10px' }}>Cedula:</label>
              <Form.Item
                name="nroCedula"
                rules={[{ required: true, message: "La cédula es requerida" }]}
              >
                <Input
                  placeholder="Cédula"
                />
              </Form.Item>
            </Col>
            <Col xxl={16} xl={16} md={16}>
              <label style={{ marginTop: '10px' }}>Nombre del paciente:</label>
              <Form.Item
                name="paciente"
                rules={[{ required: true, message: "El paciente es requerido" }]}
              >
                <Input
                  placeholder="paciente"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xxl={12} xl={12} md={12}>
              <label style={{ marginTop: '10px' }}>Sucursal:</label>
              <Form.Item
                name="sucursal"
                rules={[{ required: true, message: "La sucursal es requerida" }]}
              >
                <Input
                  placeholder="sucursal"
                />
              </Form.Item>
            </Col>
            <Col xxl={12} xl={12} md={12}>
              <label style={{ marginTop: '10px' }}>Doctor:</label>
              <Form.Item
                name="doctor"
                rules={[{ required: true, message: "El doctor es requerido" }]}
              >
                <Input
                  placeholder="doctor"
                />
              </Form.Item>
            </Col>
          </Row>


          {/*  */}
          <label style={{ marginTop: '10px' }}>Comentarios de la agenda:</label>
          <Form.Item
            name="comentarios"
          >
            <Input.TextArea
              placeholder="Descripción del Evento"
            />
          </Form.Item>
          <label style={{ marginTop: '10px' }}>Fecha y hora de la agenda:</label>
          <Form.Item
            name="fechaAgenda"
            rules={[{ required: true, message: "La fecha y hora son requeridas" }]}
          >
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              style={{ marginBottom: "10px", width: "100%" }}
              placeholder="Fecha de la agenda"
            />
          </Form.Item>
          <Form.Item
            name="tipoAgenda"
            rules={[{ required: true, message: "El tipo de agenda es requerido" }]}
          >
            <Radio.Group>
              <Radio value="terapia">Terapias</Radio>
              <Radio value="consulta">Consultas</Radio>
            </Radio.Group>
          </Form.Item>

          {/* ------------------- */}

          <div className="form-row mb-4 mt-2">
            <div className="form-group col-md-12">
              <label htmlFor="tags">Servicios a realizar</label>
              <Form.Item
                name="proximosServicios"
                rules={[{ required: true, message: "Debes seleccionar al menos un servicio" }]}
              >
                <Select
                  showSearch
                  style={{
                    width: '100%', color: 'transparent',
                    background: 'white !important'
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
                />
              </Form.Item>

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
        </Form>
      </Modal>

      <Modal
        title="Proximas citas"
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
                <span style={{ fontSize: "10px", opacity: 0.7 }}>{event.doctor}</span>
              </div>
            </List.Item>
          )}
        />

      </Modal>



    </div>
  );
};

export default VerAgenda;