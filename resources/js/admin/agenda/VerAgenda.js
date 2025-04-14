import React, { useState, useRef, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import {
  Modal, Input, DatePicker, Radio, Button,
  Space, Popconfirm, Select, Row, Col,
  List, Form, Spin, AutoComplete
} from "antd";
import { LeftOutlined, RightOutlined, PlusOutlined, DeleteOutlined, CloseCircleTwoTone, EyeOutlined, PhoneOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/es";
import BotonesFiltroAgenda from "./components/BotonesFiltroAgenda";
import { useSelector, useDispatch } from 'react-redux';
import { fetchServicios, fetchServiciosProximosAgenda } from "../../redux/features/servicios/serviciosSlice";
import { addOrUpdateEvent, deleteCita, fetchAgendarCitas, fetchCitasAgenda, setCurrentViewAgenda, updateCita } from "../../redux/features/citas/CitasAgendaSlice";
import { fetchSucursales } from "../../redux/features/sucursales/sucursalesSlice";
import Swal from 'sweetalert2';
import { fetchPacientes } from "../../redux/features/pacientes/pacientesSlice";
import { fetchUsuarios } from "../../redux/features/usuarios/usuariosSlice";
import axios from "axios";
import getIp from "../../redux/features/utils/getIp";
import { crearPacientes, verificarCedula } from "../../redux/features/pacientes/crearPacientesSlice";

dayjs.locale("es");

const VerAgenda = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm()
  const { servicios, serviciosProximos, serviciosProximos_options } = useSelector((state) => state.servicios);
  const [IP, setIp] = useState('');
  const [selectedIndex, setSelectedIndex] = useState([0]);
  const [proximosServicios, setProximosServicios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [nroCedula, setNroCedula] = useState("");
  const [doctor, setDoctor] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [celular, setCelular] = useState()
  const [eventDescription, setEventDescription] = useState("");
  const [eventDates, setEventDates] = useState(dayjs());

  const [dateEvent, setDateEvent] = useState(null);
  const [eventBadge, setEventBadge] = useState("");
  const [tableName, setTableName] = useState("citas_servicios");
  const [agendado_por, setAgendadoPor] = useState("");
  const [sucursalId, setSucursalId] = useState();
  // const [pacienteId, setPacienteId] = useState();
  const [eventPaciente, setEventPaciente] = useState(null);
  const [consultaId, setConsultaId] = useState()
  const [currentView, setCurrentView] = useState("timeGridDay");
  const [currentEventId, setCurrentEventId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [currentDate, setCurrentDate] = useState(dayjs().format("MMMM YYYY"));
  const [currentDateAgenda, setCurrentDateAgenda] = useState(new Date());
  const [currentEndDateAgenda, setCurrentEndDateAgenda] = useState(new Date());
  const [groupedEvents, setGroupedEvents] = useState([]);
  const [isGroupedModalOpen, setIsGroupedModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [selectedSucursales, setSelectedSucursales] = useState([]);
  const [hideSunday, setHideSunday] = useState(true);
  const usuario = localStorage.getItem("usuario");
  const [mensaje, setMensaje] = useState(
    `Buenas Tardes ☀
Un placer saludarle 👋🏻le escribimos de CENTEVI PANAMÁ. - Sucursal {sucursal}
Agradecemos confirmar su asistencia a la cita programada:
Día: {dia}
Hora: {hora}

Paciente: {nombre}

Recomendable confirmar con 24 horas de anticipación porque se mantiene agendas apretadas📚`
  );



  const calendarRef = useRef(null);

  const { citasAgenda } = useSelector((state) => state.citasAgenda);

  const { sucursales_with_colors, sucursales_option_selects } = useSelector((state) => state.sucursales);

  const { pacientes_options_agenda } = useSelector((state) => state.pacientes);

  const { usuarios_doctores_options_selecteds } = useSelector((state) => state.usuarios);

  const [selectedPaciente, setSelectedPaciente] = useState(null);

  const [selectedSucursal, setSelectedSucursal] = useState(null);

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [dataLoaded, setDataLoaded] = useState(false);

  const [pacienteInput, setPacienteInput] = useState('');

  const [pacienteId, setPacienteId] = useState('');

  const [createPaciente, setCreatePaciente] = useState(null)

  const [createCedula, setCreateCedula] = useState(null)

  const [apellidos, setApellidos] = useState('')

  const [esProximaCita, setEsProximaCita] = useState(1)



  useEffect(() => {
    dispatch(fetchSucursales({}))
  }, [])

  useEffect(() => {
    setProximosServicios(serviciosProximos_options);
  }, [serviciosProximos_options]);

  useEffect(() => {
    form.setFieldsValue({ agendado_por: usuario });
  }, [form]);

  useEffect(() => {
    dispatch(fetchUsuarios({}))
  }, [])

  useEffect(() => {
    if (sucursales_option_selects && sucursales_option_selects.length > 0) {
      sucursales_option_selects.map((sucursal) => {


        // Dorado : 186.74.2.218
        // San Judas Tadeo: 190.219.45.142
        // Paitilla:  45.229.196.9

        if (localStorage.getItem('ip') == '38.255.105.33') {
          if (sucursal.value == 7) {


            // console.log("sucursal: -----");
            // console.log(sucursal);

            // setSucursal(sucursal.label)
            // setSucursalId(sucursal.value);
            // form.setFieldsValue({
            //   sucursal: sucursal.label
            //     ? { value: sucursal.value, label: sucursal.label }
            //     : undefined,
            // });
          }
        }
      })
    }
  }, [sucursales_option_selects])

  const [isLoading, setIsLoading] = useState(false);

  const handlePacienteSelectOpen = () => {
    if (!dataLoaded) {
      setIsLoading(true);
      dispatch(fetchPacientes({}))
        .then(() => {
          setDataLoaded(true);
        })
        .catch((error) => {
          console.error('Error al cargar los pacientes:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  const handleCedulaSelectOpen = () => {
    if (!dataLoaded) {
      setIsLoading(true);
      dispatch(fetchPacientes({}))
        .then(() => {
          setDataLoaded(true);
        })
        .catch((error) => {
          console.error('Error al cargar las cedulas:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });

    }
  };

  const handleSelectChangServicios = (value, option) => {
    form.setFieldsValue({ proximosServicios: value });
    setProximosServicios((prev) => {
      const indexFind = prev.findIndex((proximo) => proximo.value === option.value);

      if (indexFind !== -1) {
        return prev.map((proximo, index) =>
          index === indexFind ? { ...proximo, ...option } : proximo
        );
      } else {
        return [...prev, option];
      }
    });
  };


  const handlePacienteChange = (value) => {
    const selected = pacientes_options_agenda.find((paciente) => paciente.label === value);
    if (selected) {
      setSelectedPaciente(selected.value);
      setPacienteId(selected.value)
      setApellidos(selected.apellidos)
      form.setFieldsValue({ nroCedula: selected.nro_cedula });
      form.setFieldsValue({ apellidos: selected.apellidos })
    }

  };


  const handleCedulaChange = (value) => {
    const paciente = pacientes_options_agenda.find((paciente) => paciente.label === value);
    if (paciente) {
      setSelectedPaciente(paciente.value)
      setPacienteId(paciente.value)
      setApellidos(paciente.apellidos)
      form.setFieldsValue({ paciente: paciente.nombres });
      form.setFieldsValue({ apellidos: paciente.apellidos })
    }
  };

  const handleApellidosChange = (value) => {
    const selected = pacientes_options_agenda.find((paciente) => paciente.label === value);
    if (selected) {
      setSelectedPaciente(selected.value);
      setPacienteId(selected.value)
      setApellidos(selected.apellidos)
      form.setFieldsValue({ nroCedula: selected.nro_cedula });
      form.setFieldsValue({ paciente: selected.nombres })
    }

  };


  const handleSucursalChangeSelect = (value) => {
    setSelectedSucursal(value);
  };

  const handleDoctorChange = (value) => {
    setSelectedDoctor(value);
  };


  useEffect(() => {
    const startMonth = currentDateAgenda.getMonth() + 1;
    const startYear = currentDateAgenda.getFullYear();
    const endMonth = currentEndDateAgenda.getMonth() + 1;
    const endYear = currentEndDateAgenda.getFullYear();

    const months = [];
    for (let m = startMonth; m <= (startYear === endYear ? endMonth : 12); m++) {
      months.push(m);
    }
    if (startYear !== endYear) {
      for (let m = 1; m <= endMonth; m++) {
        months.push(m);
      }
    }

    const years = [];
    for (let y = startYear; y <= endYear; y++) {
      years.push(y);
    }

    let tipo = [];
    let ex_proxima_cita = [];
    let citas_id_null = true;

    if (selectedIndex.length === 2 && selectedIndex.includes(0) && selectedIndex.includes(1)) {
      tipo = ['consulta', 'terapia'];
      citas_id_null = true;
      ex_proxima_cita = [false];
    }
    else if (selectedIndex.length === 3 && selectedIndex.includes(0) && selectedIndex.includes(1) && selectedIndex.includes(2)) {
      tipo = ['consulta', 'terapia', 'proxima_cita'];
      citas_id_null = true;
      ex_proxima_cita = [true, false];
    }
    else {
      if (selectedIndex.includes(0)) {
        tipo.push('consulta');
        citas_id_null = true;
        ex_proxima_cita.push(false);
      }
      if (selectedIndex.includes(1)) {
        tipo.push('terapia');
        ex_proxima_cita.push(false);
      }
      if (selectedIndex.includes(2)) {
        tipo.push('proxima_cita');
        citas_id_null = true;
        ex_proxima_cita.push(true);
      }
    }

    dispatch(fetchCitasAgenda({
      months,
      years,
      sucursales: selectedSucursales,
      tipo,
      ex_proxima_cita,
      citas_id_null
    }));
  }, [currentView, currentDateAgenda, selectedSucursales, currentEndDateAgenda, selectedIndex, dispatch]);


  const handleDateChange = (dateInfo) => {
    const { view } = dateInfo;
    const newDateCalendar = dayjs(dateInfo.view.currentStart).format("MMMM YYYY");
    let newDate = new Date(view.currentStart);
    let newEndDate = new Date(view.currentEnd);
    setCurrentDate(newDateCalendar);

    if (
      currentDateAgenda.getMonth() !== newDate.getMonth() ||
      currentDateAgenda.getFullYear() !== newDate.getFullYear()
    ) {
      setCurrentDateAgenda(newDate);
    }
    if (
      currentEndDateAgenda.getMonth() !== newEndDate.getMonth() ||
      currentEndDateAgenda.getFullYear() !== newEndDate.getFullYear()
    ) {
      setCurrentEndDateAgenda(newEndDate);
    }
  };

  const handleSucursalChange = (id) => {
    setSelectedSucursales((prev) =>
      prev.includes(id) ? prev.filter((sucursalId) => sucursalId !== id) : [...prev, id]
    );
  };

  const generateWhatsAppLink = () => {
    const fecha = new Date(dateEvent);

    const opcionesFecha = { weekday: "long", day: "numeric", month: "long", year: "numeric", locale: "es-ES" };
    const dia = fecha.toLocaleDateString("es-ES", opcionesFecha);

    const opcionesHora = { hour: "2-digit", minute: "2-digit", hour12: true };
    const hora = fecha.toLocaleTimeString("es-ES", opcionesHora);

    const telefonoFormateado = `${celular.replace(/[^\d]/g, '')}`;
    let mensajePersonalizado = mensaje
      .replace('{dia}', dia)
      .replace('{hora}', hora)
      .replace('{nombre}', eventPaciente)
      .replace('{sucursal}', sucursal);

    const mensajeCodificado = encodeURIComponent(mensajePersonalizado);


    return `https://wa.me/${telefonoFormateado}?text=${mensajeCodificado}`;
  };

  const handleContactarPaciente = async () => {

    try {
      window.open(generateWhatsAppLink(), '_blank');
    } catch (error) {
      console.error('Error al crear contacto:', error);
    }
  };

  const seleccionarSucursalIP = () => {

    let sucursalSeleccionado = null

    if (sucursales_option_selects && sucursales_option_selects.length > 0) {
      sucursales_option_selects.map((sucursal) => {


        // Dorado : 186.74.2.218
        // San Judas Tadeo: 190.219.45.142
        // Paitilla:  45.229.196.9

        if (localStorage.getItem('ip') == '186.74.2.218') {
          if (sucursal.value == 7) {
            sucursalSeleccionado = sucursal
          }
        } else if (localStorage.getItem('ip') == '190.219.45.142') {
          if (sucursal.value == 3) {
            sucursalSeleccionado = sucursal
          }
        } else if (localStorage.getItem('ip') == '45.229.196.9') {
          if (sucursal.value == 4) {
            sucursalSeleccionado = sucursal
          }
        }
      })
    }

    return sucursalSeleccionado;
  }

  const handleDateClick = (info) => {

    console.log('isEditMode:', isEditMode)
    setIsEditMode(false);
    form.setFieldsValue({
      fechaAgenda: dayjs(info.dateStr)
    });
    setCurrentEventId(null);
    setEventTitle("");
    setEventDescription("");
    setEventDates([dayjs(), dayjs().add(1, "day")]);
    setEventBadge("Trabajo");
    setAgendadoPor(localStorage.getItem("usuario"));
    setProximosServicios([])
    setConsultaId(null)
    setTableName(null)
    setConsultaId(null)

    form.resetFields();
    form.setFieldsValue({
      nroCedula: "",
      paciente: "",
      doctor: "",
      comentarios: "",
      fechaAgenda: dayjs(info.date),
      tipoAgenda: "",
      agendado_por: localStorage.getItem("usuario"),
      proximosServicios: []
    });



    // La IP tiene una sucursal
    const sucursalSeleccionado = seleccionarSucursalIP()

    if (sucursalSeleccionado) {

      setSucursalId(sucursalSeleccionado.value);
      setSucursal(sucursalSeleccionado.label)
      setSelectedSucursal(sucursalSeleccionado.value)

      form.setFieldsValue({
        sucursal: { value: sucursalSeleccionado.value, label: sucursalSeleccionado.label }
      })

    } else {
      form.setFieldsValue({
        sucursal: "",
      })
    }

    // FIN La IP tiene una sucursal

    setIsModalOpen(true);

  };

  useEffect(() => {
    if (consultaId) {
      dispatch(
        fetchServiciosProximosAgenda({
          consulta_nombre: tableName,
          consulta_id: consultaId,
        })
      );
    }
  }, [consultaId, tableName]);


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
      setConsultaId(clickedEvent.origen_id);
      setTableName(clickedEvent.origen_tabla);
      setDateEvent(clickedEvent.start)
      setEventPaciente(clickedEvent.paciente)
      setSucursal(clickedEvent.sucursal)
      setIsEditMode(true);
      setCurrentEventId(clickedEvent.id);
      setSucursalId(clickedEvent.sucursal_id);
      setPacienteId(clickedEvent.paciente_id)
      setCelular(clickedEvent.celular);
      setSelectedPaciente(clickedEvent.paciente_id)
      setPacienteId(clickedEvent.paciente_id)
      setSelectedSucursal(clickedEvent.sucursal_id)
      setAgendadoPor(clickedEvent.agendado_por)
      setPacienteInput(clickedEvent.paciente_id)
      setApellidos(clickedEvent.apellidos)
      setEsProximaCita(clickedEvent.esProximaCita)
      setIsModalOpen(true);
      form.setFieldsValue({
        nroCedula: clickedEvent.nro_cedula || "",
        paciente: clickedEvent.paciente,
        apellidos: clickedEvent.apellidos,
        sucursal: clickedEvent.sucursal ? { value: clickedEvent.sucursal_id, label: clickedEvent.sucursal } : undefined,
        doctor: clickedEvent.doctor || "",
        comentarios: clickedEvent.comentarios || "",
        fechaAgenda: dayjs(clickedEvent.start),
        tipoAgenda: clickedEvent.tipo || "",
        agendado_por: clickedEvent.agendado_por || "",
      });
      form.validateFields();
    }
  };
  useEffect(() => {
    if (serviciosProximos_options.length > 0) {
      form.setFieldsValue({
        proximosServicios: serviciosProximos_options.map(serv => serv.value)
      });
    } else {
      form.setFieldsValue({
        proximosServicios: []
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
    console.log('values', values)
    if (createCedula !== null) {
      dispatch(verificarCedula(createCedula))
        .then((response) => {
          if (response.payload == true) {
            Swal.fire({
              icon: "warning",
              title: "Cédula existente",
              text: "La cédula ya está registrada. No se puede agendar esta cita.",
            });
            return;
          } else if (response.payload === false) {
            Swal.fire({
              title: "Paciente no existe",
              text: "El paciente no está registrado. ¿Deseas crearlo?",
              icon: "question",
              showCancelButton: true,
              confirmButtonText: "Sí, crear paciente",
              cancelButtonText: "Cancelar",
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
            }).then((result) => {
              if (result.isConfirmed) {
                const data = {
                  nombres: values.paciente,
                  sucursal: selectedSucursal,
                  doctor: values.doctor,
                  nro_cedula: values.nroCedula,
                  apellidos: values.apellidos
                };
                dispatch(crearPacientes(data))
                  .then((response) => {
                    const newPaciente = response.payload.data[0];
                    if (newPaciente && newPaciente.id_paciente) {
                      Swal.fire({
                        title: "Cargando usuarios...",
                        allowOutsideClick: false,
                        didOpen: () => {
                          Swal.showLoading();
                        },
                      });
                      dispatch(fetchPacientes({}))
                        .then(() => {
                          Swal.close();
                          setTimeout(() => {
                            continueAgendarEvent(values, newPaciente.id_paciente);
                          });
                        })
                        .catch(() => {
                          Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Hubo un error al obtener los usuarios.",
                          });
                        });
                    } else {
                      Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "No se pudo obtener el ID del paciente creado.",
                      });
                    }
                  })
                  .catch((error) => {
                    Swal.fire({
                      icon: "error",
                      title: "Error",
                      text: "Hubo un error al crear el paciente.",
                    });
                  });
              }
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al verificar la cédula.",
          });
        });
    } else {
      const serviciosRealizadosSubmit = proximosServicios.map(servicio => servicio.value);

      console.log('entre aqui')
      if (!values.tipoAgenda || values.tipoAgenda === "proxima_cita") {
        Swal.fire({
          icon: "warning",
          title: "Tipo de Agenda requerido",
          text: "Por favor, selecciona un tipo de agenda (Terapia o Consulta) antes de continuar.",
        });
        return;
      }

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
            origen_tabla: "citas_servicios",
            fecha_hora: values.fechaAgenda.format("YYYY-MM-DD HH:mm"),
            tipo: values.tipoAgenda,
            paciente_id: pacienteId,
            doctor: values.doctor,
            sucursal_id: selectedSucursal,
            comentarios: values.comentarios,
            agendado_por: usuario,
            servicios_id: serviciosRealizadosSubmit
          };
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
    }


  };
  const continueAgendarEvent = (values, newPacienteId) => {
    const serviciosRealizadosSubmit = proximosServicios.map(servicio => servicio.value);
    const data = {
      cita_existente_id: currentEventId,
      origen_id: consultaId,
      origen_tabla: "citas_servicios",
      fecha_hora: values.fechaAgenda.format("YYYY-MM-DD HH:mm"),
      tipo: values.tipoAgenda,
      paciente_id: newPacienteId,
      doctor: values.doctor,
      sucursal_id: selectedSucursal,
      comentarios: values.comentarios,
      agendado_por: usuario,
      servicios_id: serviciosRealizadosSubmit
    };
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

  const handleDeleteEvent = () => {
    if (currentEventId) {
      setIsModalOpen(false);
      dispatch(deleteCita(currentEventId))
      resetForm();
    }
  };

  const handleUpdateEvent = (values) => {
    console.log('Actualizando con:', values);
    console.log('esProximaCita', esProximaCita);
    console.log('currentEventId', currentEventId);
    const serviciosRealizadosSubmit = proximosServicios.map(servicio => servicio.value);
    const tipo = esProximaCita === 1 ? 'proxima_cita' : values.tipoAgenda;
    const data = {
      origen_id: consultaId,
      origen_tabla: esProximaCita === 1 ? tableName : "citas_servicios",
      fecha_hora: values.fechaAgenda.format("YYYY-MM-DD HH:mm"),
      tipo: tipo,
      paciente_id: pacienteId,
      doctor: values.doctor,
      sucursal_id: selectedSucursal,
      ex_proxima_cita: esProximaCita === 1 ? esProximaCita : 0,
      comentarios: values.comentarios,
      agendado_por: usuario,
      servicios_ids: serviciosRealizadosSubmit
    };
    console.log('Datos finales a enviar:', data);
    if (currentEventId) {
      setIsModalOpen(false);
      dispatch(updateCita({ id_cita: currentEventId, data: data }))
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

        <BotonesFiltroAgenda
          lista_botones={["Consultas", "Terapias", "Proximas Citas"]}
          selectedIndex={selectedIndex}
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
          slotDuration="00:20:00"
          slotLabelInterval="00:30"
          height="auto"
          eventContent={(info) => {
            const { hiddenEvents, comentarios, doctor, tipo } = info.event.extendedProps;
            const eventTime = info.timeText;
            const isDayView = info.view.type === "timeGridDay";
            return (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <span>
                    <b
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "black",
                        flexShrink: 1,
                        minWidth: 0, // Necesario para que ellipsis funcione correctamente
                      }}
                      title={`${eventTime} - ${info.event.title}`}
                    >
                      {eventTime} - {info.event.title}
                    </b>
                  </span>

                  {isDayView && comentarios && (
                    <span
                      style={{
                        marginLeft: "6px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "black",
                        flexShrink: 0, // Esto evita que se corte el texto de comentarios
                      }}
                      title={comentarios}
                    >
                      ({comentarios})
                    </span>
                  )}
                </div>


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
                  title={doctor}
                >
                  🧑‍⚕️ {doctor}
                </small>

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
                  title={tipo}
                >
                  🩺 {tipo}
                </small>

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
                      whiteSpace: "nowrap",
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
              {isEditMode && (
                <Popconfirm
                  key="update"
                  title="¿Está seguro de actualizar este evento?"
                  onConfirm={async () => {
                    try {
                      const values = await form.validateFields();
                      handleUpdateEvent(values);
                    } catch (errorInfo) {
                      console.log('Errores en el formulario:', errorInfo);
                    }
                  }}
                  okText="Sí"
                  cancelText="No"
                >
                  <Button
                    icon={<EditOutlined />}
                    style={{
                      backgroundColor: '#fadb14',
                      borderColor: '#fadb14',
                      color: '#000',
                    }}
                  >
                    Actualizar
                  </Button>

                </Popconfirm>
              )}
              <Button
                key="cancel"
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button
                key="submit"
                type="primary"
                onClick={() => form.submit()}
                disabled={esProximaCita === false && isEditMode}
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
          <Form.Item
            name="agendado_por"
          >
            <Input
              placeholder=""
              style={{ marginBottom: "5px" }}
              disabled
            />
          </Form.Item>

          {/*  */}
          <Row gutter={[16, 16]}>
            <Col xxl={24} xl={24} md={24}>
              <label style={{ marginTop: '10px' }}>Cedula:</label>
              <Form.Item
                name="nroCedula"
                rules={[{ required: true, message: "La cédula es requerida" }]}
              >
                <AutoComplete
                  allowClear
                  showSearch
                  placeholder="Seleccionar paciente"
                  onSearch={(text) => {
                    setPacienteId(null)
                    setCreateCedula(text)
                  }}
                  onSelect={(value, key) => {
                    setCreateCedula(null)
                    handleCedulaChange(key.key);
                  }}
                  onDropdownVisibleChange={(open) => open && handleCedulaSelectOpen()}
                  notFoundContent={isLoading ? <Spin size="small" /> : null}
                  options={pacientes_options_agenda.map((paciente) => {
                    const fullName = `${paciente.nombres} ${paciente.apellidos}`;
                    const fullKey = `${paciente.nro_cedula}-${fullName}`;
                    return {
                      key: fullKey,
                      value: paciente.nro_cedula,
                      label: `${paciente.nro_cedula} - ${fullName}`,
                      searchText: fullName.toLowerCase(),
                    };
                  })}
                  filterOption={(inputValue, option) => {
                    const words = inputValue.toLowerCase().split(" ");
                    const fullText = `${option?.key} ${option?.searchText}`.toLowerCase();
                    return words.every(word => fullText.includes(word));
                  }}
                >
                </AutoComplete>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col xxl={12} xl={12} md={12}>
              <label style={{ marginTop: '10px' }}>Nombres:</label>
              <Form.Item
                name="paciente"
                // initialValue={pacienteInput}
                rules={[{ required: true, message: "El paciente es requerido" }]}
              >
                <AutoComplete
                  allowClear
                  showSearch
                  mode="combobox"
                  placeholder="Seleccionar paciente"
                  options={pacientes_options_agenda.map((paciente) => {
                    const fullName = `${paciente.nombres} ${paciente.apellidos}`;
                    const fullKey = `${paciente.nro_cedula}-${fullName}`;
                    return {
                      key: fullKey,
                      value: paciente.nombres,
                      label: `${paciente.nro_cedula} - ${fullName}`,
                      searchText: fullName.toLowerCase(),
                    }
                  })}
                  filterOption={(inputValue, option) => {
                    const words = inputValue.toLowerCase().split(" ");
                    const fullText = `${option?.key} ${option?.searchText}`.toLowerCase();
                    return words.every(word => fullText.includes(word));
                  }}
                  onChange={(value) => {
                    setPacienteInput(value);
                    form.setFieldsValue({ paciente: value });
                  }}
                  onSelect={(value, key) => {
                    const selected = pacientes_options_agenda.find(
                      (paciente) => paciente.nombres === value
                    );
                    setPacienteId(selected.value)
                    setCreatePaciente(null);
                    setCreateCedula(null)
                    handlePacienteChange(key.key);
                  }}
                  onSearch={(text) => {
                    setCreatePaciente(text)
                  }}
                  onDropdownVisibleChange={(open) => open && handlePacienteSelectOpen()}
                  notFoundContent={isLoading ? <Spin size="small" /> : null}
                >
                </AutoComplete>
              </Form.Item>
            </Col>
            <Col xxl={12} xl={12} md={12}>
              <label style={{ marginTop: '10px' }}>Apellidos:</label>
              <Form.Item
                name="apellidos"
                rules={[{ required: true, message: "El apellido es requerido" }]}
              >
                <AutoComplete
                  allowClear
                  showSearch
                  mode="combobox"
                  placeholder="Seleccionar paciente"
                  options={pacientes_options_agenda.map((paciente) => {
                    const fullName = `${paciente.nombres} ${paciente.apellidos}`;
                    const fullKey = `${paciente.nro_cedula}-${fullName}`;
                    return {
                      key: fullKey,
                      value: paciente.apellidos,
                      label: `${paciente.nro_cedula} - ${fullName}`,
                      searchText: fullName.toLowerCase(),
                    }
                  })}
                  filterOption={(inputValue, option) => {
                    const words = inputValue.toLowerCase().split(" ");
                    const fullText = `${option?.key} ${option?.searchText}`.toLowerCase();
                    return words.every(word => fullText.includes(word));
                  }}
                  onChange={(value) => {
                    setApellidos(value);
                    form.setFieldsValue({ apellidos: value });
                  }}
                  onSelect={(value, key) => {
                    setCreateCedula(null)

                    handleApellidosChange(key.key);
                  }}

                  onDropdownVisibleChange={(open) => open && handlePacienteSelectOpen()}
                  notFoundContent={isLoading ? <Spin size="small" /> : null}
                >
                </AutoComplete>
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
                <Select
                  placeholder="Seleccionar sucursal"
                  onChange={(value) => {
                    handleSucursalChangeSelect(value)
                    setSelectedSucursal(value)
                  }}
                >
                  {sucursales_option_selects.map((sucursal) => (
                    <Select.Option key={sucursal.value} value={sucursal.value}>
                      {sucursal.label}
                    </Select.Option>

                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xxl={12} xl={12} md={12}>
              <label style={{ marginTop: '10px' }}>Doctor:</label>
              <Form.Item
                name="doctor"
                rules={[{ required: true, message: "El doctor es requerido" }]}
              >
                <Select
                  placeholder="Seleccionar doctor"
                  onChange={handleDoctorChange}
                  value={selectedDoctor}
                >
                  {usuarios_doctores_options_selecteds.map((doctor) => (
                    <Select.Option key={doctor.value} value={doctor.label}>
                      {doctor.label}
                    </Select.Option>
                  ))}
                </Select>
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
            // rules={[
            //   {
            //     required: true,
            //     message: "El tipo de agenda es requerido",
            //   },
            //   ({ getFieldValue }) => ({
            //     validator(_, value) {
            //       if (value === "terapia" || value === "consulta") {
            //         return Promise.resolve();
            //       }
            //       return Promise.reject("Debes seleccionar Terapias o Consultas");
            //     },
            //   }),
            // ]}
            rules={[
              esProximaCita === false && {
                required: true,
                message: "El tipo de agenda es requerido",
              },
              esProximaCita === false && ({
                validator(_, value) {
                  if (value === "terapia" || value === "consulta") {
                    return Promise.resolve();
                  }
                  return Promise.reject("Debes seleccionar Terapias o Consultas");
                },
              }),
            ].filter(Boolean)}
          >
            <Radio.Group>
              <Radio value="terapia">Terapias</Radio>
              <Radio value="consulta">Consultas</Radio>
            </Radio.Group>
          </Form.Item>

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
                  onChange={handleSelectChangServicios}
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
                            // const newServicios = serviciosProximos_options.filter(serv => serv.value !== servicio.value);
                            setProximosServicios([])
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
                <strong style={{ fontSize: "11px", color: 'black' }}>
                  {dayjs(event.start).format("HH:mm")} - {event.title}
                  {currentView === "timeGridDay" && event.comentarios && (
                    <span style={{ fontWeight: "normal", fontSize: "10px", color: "black" }}>
                      {" "}({event.comentarios})
                    </span>
                  )}
                </strong>
                <span style={{ fontSize: "10px", opacity: 0.7, fontWeight: "bold", color: "black" }}>
                  🧑‍⚕️ {event.doctor}
                </span>
                <span style={{ fontSize: "10px", opacity: 0.7, fontWeight: "bold", color: "black" }}>
                  🩺 {event.tipo}
                </span>
              </div>
            </List.Item>
          )}
        />

      </Modal>
    </div>
  );
};

export default VerAgenda;