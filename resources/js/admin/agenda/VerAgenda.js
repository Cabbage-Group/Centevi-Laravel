import React, { useState, useRef, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import * as Yup from 'yup';
import {
  Modal, Input, DatePicker, Radio, Button,
  Space, Popconfirm, Row, Col,
  List, Spin,
  Calendar,
  Checkbox,
  Tooltip
} from "antd";
import {
  LeftOutlined, RightOutlined, PlusOutlined,
  CalendarOutlined, DeleteOutlined, CloseCircleTwoTone,
  EyeOutlined, PhoneOutlined, EditOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/es";
import BotonesFiltroAgenda from "./components/BotonesFiltroAgenda";
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchServicios,
  fetchServiciosProximosAgenda
} from "../../redux/features/servicios/serviciosSlice";
import {
  addOrUpdateEvent, deleteCita,
  fetchAgendarCitas, fetchCitasAgenda,
  fetchConfirmarCita,
  setCurrentViewAgenda, updateCita
} from "../../redux/features/citas/CitasAgendaSlice";
import { fetchSucursales } from "../../redux/features/sucursales/sucursalesSlice";
import Swal from 'sweetalert2';
import { fetchPacientes } from "../../redux/features/pacientes/pacientesSlice";
import { fetchUsuarios } from "../../redux/features/usuarios/usuariosSlice";
import axios from "axios";
import getIp from "../../redux/features/utils/getIp";
import {
  crearPacientes,
  verificarCedula
} from "../../redux/features/pacientes/crearPacientesSlice";
import debounce from 'lodash/debounce';
import { Link } from "react-router-dom";
import { values } from "pdf-lib";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Form, Formik } from "formik";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";



dayjs.locale("es");
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const VerAgenda = () => {
  const formikRef = useRef();
  const hint = React.useRef('');



  const dispatch = useDispatch();
  const {
    servicios, serviciosProximos, serviciosProximos_options
  } = useSelector((state) => state.servicios);
  const [IP, setIp] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState('');
  const [selectedIndex, setSelectedIndex] = useState([0]);
  const [proximosServicios, setProximosServicios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [nroCedula, setNroCedula] = useState("");
  const [doctor, setDoctor] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [direccion_sucursal, setDireccion_sucursal] = useState("");
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
  const [modalPosition, setModalPosition] = useState({ top: 0, left: "-50px" });
  const [selectedSucursales, setSelectedSucursales] = useState([]);
  const [hideSunday, setHideSunday] = useState(true);
  const [actualizarCitas, setActualizarCitas] = useState(false);
  const usuario = localStorage.getItem("usuario");
  const [mensaje, setMensaje] = useState(
    `Buenas Tardes
Un placer saludarle le escribimos de CENTEVI PANAMÁ. - Sucursal {sucursal}
Agradecemos confirmar su asistencia a la cita programada:
Día: {dia}
Hora: {hora}

Paciente: {nombre}

Recomendable confirmar con 24 horas de anticipación porque se mantiene agendas apretadas

Dirección fisica: {direccion}

*Método de pago*
 
Yappy, directorio de empresas en BGeneral como Centevi Panamá
Efectivo
Tarjeta (Clave,Visa o Mastercard)
`
  );

  const calendarRef = useRef(null);
  const confirmacionRef = useRef(null);

  const { citasAgenda } = useSelector((state) => state.citasAgenda);

  const { sucursales_with_colors, sucursales_option_selects } = useSelector((state) => state.sucursales);

  const { pacientes_options_agenda } = useSelector((state) => state.pacientes);

  const { usuarios_doctores_options_selecteds } = useSelector((state) => state.usuarios);

  const [selectedPaciente, setSelectedPaciente] = useState(null);

  const [selectedSucursal, setSelectedSucursal] = useState(null);

  const [selectedCedula, setSelectedCedula] = useState(null);

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [dataLoaded, setDataLoaded] = useState(false);

  const [pacienteInput, setPacienteInput] = useState('');

  const [pacienteId, setPacienteId] = useState('');

  const [createPaciente, setCreatePaciente] = useState(null)

  const [createCedula, setCreateCedula] = useState(null)

  const [apellidos, setApellidos] = useState('')

  const [esProximaCita, setEsProximaCita] = useState(null)

  const [openCalendar, setOpenCalendar] = useState(false);

  const [fechaAgendaInicio, setFechaAgendaInicio] = useState();

  const [fechaAgendaFin, setFechaAgendaFin] = useState();

  const [tipoAgenda, setTipoAgenda] = useState();

  const [comentarios, setComentarios] = useState();

  const [selectedConfirmado, setSelectConfirmado] = useState();

  const [enableTimeEndDateForm, setEnableTimeEndDateForm] = useState(false)

  const [rangeTimeEndDateSelected, setRangeTimeEndDateSelected] = useState(60)

  const validationSchema = Yup.object({
    celular: Yup.string()
      .required('El celular es obligatorio'),
    paciente: Yup.string()
      .required('La cédula es obligatoria'),
    cedula: Yup.string()
      .required('El nombre es obligatorio'),
    apellidos: Yup.string()
      .required('Los apellidos son obligatorios'),
    sucursal: Yup.string()
      .required('La sucursal es obligatoria'),
    doctor: Yup.string()
      .required('El doctor es obligatorio'),
    confirmado: Yup.string().required('Este campo es obligatorio'),
  });

  useEffect(() => {
    dispatch(fetchSucursales({}))
    // dispatch(fetchPacientes({}))
  }, [])

  useEffect(() => {
    setProximosServicios(serviciosProximos_options);
  }, [serviciosProximos_options]);

  // useEffect(() => {
  //   form.setFieldsValue({ agendado_por: usuario });
  // }, [form]);

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

    obtenerCitas({
      months,
      years,
      sucursales: selectedSucursales,
      tipo,
      ex_proxima_cita,
      citas_id_null
    });
  }, [
    currentView, currentDateAgenda, selectedSucursales,
    currentEndDateAgenda, selectedIndex, actualizarCitas, dispatch
  ]);

  const obtenerCitas = async (data) => {
    await dispatch(fetchCitasAgenda(data));

    changeView("timeGridDay");
  }


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
      .replace('{sucursal}', sucursal)
      .replace('{direccion}', direccion_sucursal);

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
        } else if (localStorage.getItem('ip') == '38.255.105.33') {
          if (sucursal.value == 4) {
            sucursalSeleccionado = sucursal
          }
        }
      })
    }

    return sucursalSeleccionado;
  }

  const handleDateClick = (info) => {
    setIsModalOpen(true);
    setRangeTimeEndDateSelected(60);
    setIsEditMode(false);
    formikRef.current.resetForm();
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
    formikRef.current.setFieldValue('fechaAgenda', dayjs(info.date));
    formikRef.current.setFieldValue('fechaAgendaFin', dayjs(info.date).add(1, 'hour'),);
    formikRef.current.setFieldValue('agendado_por', localStorage.getItem("usuario"),);
    formikRef.current.setFieldValue('confirmado', 'SIN STATUS',);

    // La IP tiene una sucursal
    const sucursalSeleccionado = seleccionarSucursalIP()

    if (sucursalSeleccionado) {

      setSucursalId(sucursalSeleccionado.value);
      setSucursal(sucursalSeleccionado.label)
      setSelectedSucursal(sucursalSeleccionado.value)
      setDireccion_sucursal(sucursalSeleccionado.ubicacion_maps)

      formikRef.current.setFieldValue('sucursal', sucursalSeleccionado.value)

    } else {
      formikRef.current.setFieldValue('sucursal', '')
    }

    // FIN La IP tiene una sucursal


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
    setIsModalOpen(true);

    if (clickedEvent) {
      const sucursalSeleccionada = sucursales_option_selects.find(
        (sucursal) => sucursal.value == clickedEvent.sucursal_id
      );
      setDireccion_sucursal(sucursalSeleccionada?.ubicacion_maps || "");
      setConsultaId(clickedEvent.origen_id);
      setTableName(clickedEvent.origen_tabla);
      setEsProximaCita(clickedEvent.esProximaCita);
      setDateEvent(clickedEvent.start);
      setEventPaciente(clickedEvent.paciente);
      setSucursal(clickedEvent.sucursal);
      setIsEditMode(true);
      setCurrentEventId(clickedEvent.id);
      setSucursalId(clickedEvent.sucursal_id);
      setPacienteId(clickedEvent.paciente_id);
      setCelular(clickedEvent.celular);
      setSelectedPaciente(clickedEvent.paciente_id);
      setSelectedSucursal(clickedEvent.sucursal_id);
      setAgendadoPor(clickedEvent.agendado_por);
      setPacienteInput(clickedEvent.paciente_id);
      setApellidos(clickedEvent.apellidos);
      setSelectedEvent(clickedEvent);
      setSelectedDoctor(clickedEvent.doctor)
      setFechaAgendaInicio(clickedEvent.start)
      setFechaAgendaFin(clickedEvent.fecha_hora_fin)
      setComentarios(clickedEvent.comentarios)
      setSelectConfirmado(clickedEvent.confirmado)
      dispatch(
        fetchServiciosProximosAgenda({
          consulta_nombre: clickedEvent.origen_tabla,
          consulta_id:
            clickedEvent.esProximaCita === 1
              ? clickedEvent.origen_id
              : clickedEvent.id,
        })
      );
    }
  };

  useEffect(() => {
    if (formikRef.current && selectedEvent) {
      const fechaInicio = dayjs(selectedEvent.start);
      const fechaFin = selectedEvent.fecha_hora_fin
        ? dayjs(selectedEvent.fecha_hora_fin)
        : fechaInicio.add(60, 'minutes');

      const diferenciaMinutos = fechaFin.diff(fechaInicio, 'minute');

      if (isNaN(diferenciaMinutos)) {
        setRangeTimeEndDateSelected(60);
      } else if ([15, 30, 45, 60].includes(diferenciaMinutos)) {
        setRangeTimeEndDateSelected(diferenciaMinutos);
      } else {
        setRangeTimeEndDateSelected(null);
      }
      formikRef.current.setFieldValue('cedula', selectedEvent.nro_cedula || '');
      formikRef.current.setFieldValue('paciente', selectedEvent.paciente || '');
      formikRef.current.setFieldValue('apellidos', selectedEvent.apellidos || '');
      formikRef.current.setFieldValue('celular', selectedEvent.celular || '');
      formikRef.current.setFieldValue('sucursal', selectedEvent.sucursal_id || '');
      formikRef.current.setFieldValue('doctor', selectedEvent.doctor || '');
      formikRef.current.setFieldValue('comentarios', selectedEvent.comentarios || '');
      formikRef.current.setFieldValue('fechaAgenda', fechaInicio || '');
      formikRef.current.setFieldValue('fechaAgendaFin', fechaFin || '');
      formikRef.current.setFieldValue('tipoAgenda', selectedEvent.tipo || '');
      formikRef.current.setFieldValue('agendado_por', selectedEvent.agendado_por || '');
      formikRef.current.setFieldValue('confirmado', selectedEvent.confirmado || '');
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (!formikRef.current) return;

    const values = serviciosProximos_options.map(serv => serv.value);
    formikRef.current.setFieldValue('proximosServicios', values);
  }, [serviciosProximos_options]);

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

  const setTimeEndDate = (value) => {
    const fechaAgendaValue = formikRef.current.values.fechaAgenda;

    if (value && fechaAgendaValue) {
      const startDate = dayjs(fechaAgendaValue);
      const endDate = startDate.add(value, 'minutes');

      formikRef.current.setFieldValue('fechaAgenda', startDate);
      formikRef.current.setFieldValue('fechaAgendaFin', endDate);

      setFechaAgendaInicio(startDate);
      setFechaAgendaFin(endDate);

      setRangeTimeEndDateSelected(value);
      setEnableTimeEndDateForm(false);
    } else {
      setEnableTimeEndDateForm(true);
      setRangeTimeEndDateSelected(null);
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

  const handleAgendarEvent = async (values) => {
    console.log('Form submit:', values);
    const serviciosRealizadosSubmit = proximosServicios.map(servicio => servicio.value);
    console.log('createCedula:', createCedula);
    if (createCedula !== null) {
      try {
        const response = await dispatch(verificarCedula(createCedula)).unwrap();

        console.log('response:', response)

        if (response === 'activo') {
          Swal.fire({
            icon: "warning",
            title: "Cédula existente",
            text: "La cédula ya está registrada. Seleccione un paciente de la lista",
          });
          return;
        }

        if (response === 'no_existe') {
          const result = await Swal.fire({
            title: "Paciente no existe",
            text: "El paciente no está registrado. ¿Deseas crearlo?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, crear paciente",
            cancelButtonText: "Cancelar",
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
          });

          if (result.isConfirmed) {
            const dataPaciente = {
              nombres: selectedPaciente,
              nro_cedula: nroCedula,
              apellidos: apellidos,
              celular: celular,
              estado: false,
              estadoPaciente: 'no_existe'
            };

            try {
              const response = await dispatch(crearPacientes(dataPaciente)).unwrap();
              const newPaciente = response.data[0];

              if (newPaciente && newPaciente.id_paciente) {
                Swal.fire({
                  title: "Cargando usuarios...",
                  allowOutsideClick: false,
                  didOpen: () => {
                    Swal.showLoading();
                  },
                });

                await dispatch(fetchPacientes({})).unwrap();
                Swal.close();
                continueAgendarEvent(values, newPaciente.id_paciente);
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: "No se pudo obtener el ID del paciente creado.",
                });
              }
            } catch (error) {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un error al crear el paciente.",
              });
            }
          }
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al verificar la cédula.",
        });
      }
    } else {
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

      const result = await Swal.fire({
        title: "¿Confirmar agendamiento?",
        text: "¿Deseas agendar esta cita?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, agendar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
      });

      if (result.isConfirmed) {
        const data = {
          cita_existente_id: currentEventId,
          origen_id: consultaId,
          origen_tabla: "citas_servicios",
          fecha_hora: values.fechaAgenda.format("YYYY-MM-DD HH:mm"),
          fecha_hora_fin: values.fechaAgendaFin.format("YYYY-MM-DD HH:mm"),
          tipo: values.tipoAgenda,
          paciente_id: pacienteId,
          doctor: values.doctor,
          sucursal_id: selectedSucursal,
          comentarios: values.comentarios,
          confirmado: values.confirmado,
          agendado_por: usuario,
          servicios_id: serviciosRealizadosSubmit,
        };

        setIsModalOpen(false);

        try {
          await dispatch(fetchAgendarCitas(data)).unwrap();
          Swal.fire({
            icon: "success",
            title: "Cita Agendada",
            text: "La cita ha sido agendada exitosamente.",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al agendar la cita.",
          });
        }
      }
    }
  };

  const continueAgendarEvent = async (values, newPacienteId) => {
    const serviciosRealizadosSubmit = proximosServicios.map(servicio => servicio.value);
    const data = {
      cita_existente_id: currentEventId,
      origen_id: consultaId,
      origen_tabla: "citas_servicios",
      fecha_hora: values.fechaAgenda.format("YYYY-MM-DD HH:mm"),
      fecha_hora_fin: values.fechaAgendaFin.format("YYYY-MM-DD HH:mm"),
      tipo: values.tipoAgenda,
      paciente_id: newPacienteId,
      doctor: values.doctor,
      sucursal_id: selectedSucursal,
      comentarios: values.comentarios,
      confirmado: values.confirmado,
      agendado_por: usuario,
      servicios_id: serviciosRealizadosSubmit
    };

    setIsModalOpen(false);

    try {
      await dispatch(fetchAgendarCitas(data)).unwrap();
      Swal.fire({
        icon: "success",
        title: "Cita Agendada",
        text: "La cita ha sido agendada exitosamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al agendar la cita.",
      });
    }
  };


  const handleDeleteEvent = async () => {
    if (currentEventId) {
      try {
        await dispatch(deleteCita(currentEventId)).unwrap();
        setIsModalOpen(false);
        resetForm();

        Swal.fire({
          icon: 'success',
          title: 'Cita eliminada',
          text: 'La cita se eliminó correctamente.',
          timer: 2000,
          showConfirmButton: false,
        });

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar',
          text: error?.message || 'Ocurrió un error al eliminar la cita.',
        });
      }
    }
  };

  const handleUpdateEvent = async (values) => {
    const serviciosRealizadosSubmit = proximosServicios.map(servicio => servicio.value);
    const tipo = esProximaCita === 1 ? 'proxima_cita' : tipoAgenda;

    const data = {
      origen_id: consultaId,
      origen_tabla: esProximaCita === 1 ? tableName : "citas_servicios",
      fecha_hora: dayjs(fechaAgendaInicio).format('YYYY-MM-DD HH:mm:ss'),
      tipo: tipo,
      paciente_id: pacienteId,
      doctor: selectedDoctor,
      sucursal_id: selectedSucursal,
      ex_proxima_cita: esProximaCita === 1 ? esProximaCita : 0,
      comentarios: comentarios,
      confirmado: values.confirmado,
      agendado_por: usuario,
      servicios_ids: serviciosRealizadosSubmit,
      fecha_hora_fin: dayjs(fechaAgendaFin).format('YYYY-MM-DD HH:mm:ss'),
    };
    console.log('data:', data)

    if (currentEventId) {
      try {
        await dispatch(updateCita({ id_cita: currentEventId, data })).unwrap();
        setIsModalOpen(false);

        Swal.fire({
          icon: 'success',
          title: 'Cita actualizada',
          text: 'La cita se actualizó correctamente.',
          timer: 2000,
          showConfirmButton: false,
        });

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: error?.message || 'Ocurrió un error al actualizar la cita.',
        });
      }
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
      left: event.clientX - 150,
    });

    setGroupedEvents(hiddenEvents);
    setIsGroupedModalOpen(true);
  };

  const toggleSunday = () => {
    setHideSunday(!hideSunday);
  };

  const handleSelect = (date) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(date.toDate());
      calendarApi.changeView('timeGridDay');
    }
  };

  const enviarConfirmacionCita = async (info, confirmado) => {
    const eventId = Number(info.event.id);

    const result = await Swal.fire({
      title: "Confirmar Cita?",
      text: "¿Deseas confirmar que se dio esta cita?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    });

    if (result.isConfirmed) {
      console.log(eventId)
      const data = {
        cita_id: eventId,
        confirmado: 'CONFIRMADO'
      }

      try {
        await dispatch(fetchConfirmarCita(data)).unwrap();
        setActualizarCitas(!actualizarCitas)
        Swal.fire({
          icon: "success",
          title: "Cita Confirmada",
          text: "La cita ha sido confirmada exitosamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al confirmar la cita.",
        });
      }
    }


  }

  return (
    <div
      style={{
        width: "100%", margin: "auto", padding: "30px", position: "relative", overflow: "hidden"
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "45%",
          right: openCalendar ? "350px" : "0px",
          transform: "translateY(-50%)",
          transition: "right 0.5s ease",
          cursor: "pointer",
          background: "#009688",
          borderRadius: "8px 0px 0px 8px",
          width: "50px",
          height: "50px",
          textAlign: "center",
          zIndex: 1000,
          fontSize: "20px",
          alignContent: "center",
          color: 'white'
        }}
        onClick={() => setOpenCalendar(!openCalendar)}
      >
        <CalendarOutlined style={{ color: 'white' }} />
      </div>

      <div
        style={{
          position: "fixed",
          top: "45%",
          right: openCalendar ? "0px" : "-350px",
          transform: "translateY(-50%)",
          transition: "right 0.5s ease",
          background: "#009688",
          width: "350px",
          height: "370px",
          padding: "20px",
          borderRadius: "8px 0px 0px 8px",
          zIndex: 999,
        }}
      >
        <Calendar fullscreen={false} onSelect={handleSelect} mode="month" />
      </div>
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
        {/* <button
          onClick={() => console.log(citasAgenda)}
        >
          agenda
        </button> */}
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={currentView}
          headerToolbar={false}
          locale={esLocale}
          editable
          selectable
          dateClick={handleDateClick}
          // eventClick={(info) => handleEventClick(info)}
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
          slotMinTime="07:00:00"
          slotMaxTime="19:00:00"
          slotLabelFormat={{
            hour: "numeric",
            minute: "2-digit",
            hour12: false,
            meridiem: 'short'
          }}
          dayHeaderContent={(arg) => {
            const date = arg.date;
            const options = { weekday: "long", day: "2-digit", month: "2-digit" };
            const formatted = date.toLocaleDateString("es-ES", options);
            return formatted;
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
            const {
              hiddenEvents, comentarios, doctor, tipo, paciente,
              apellidos, fecha_hora_fin, celular, confirmado, paciente_id
            } = info.event.extendedProps;
            const primerNombre = paciente ? paciente.trim().split(" ")[0] : "";
            const primerApellido = apellidos ? apellidos.trim().split(" ")[0] : "";
            const nombrePaciente = `${primerNombre} ${primerApellido}`;
            const eventTime = info.timeText + (fecha_hora_fin
              ? (" - " + dayjs(fecha_hora_fin).format('HH:mm'))
              : " - " + dayjs(info.timeText, 'HH:mm').add(1, 'hour').format('HH:mm'));

            const isDayView = info.view.type === "timeGridDay";
            return (
              <div style={{ position: 'relative' }}>
                <div
                  onClick={() => handleEventClick(info)}
                  style={
                    tipo == "terapia" ?
                      {
                        height: "100%",
                        border: "3px solid #003300",
                        marginLeft: "-3px",
                        paddingLeft: "3px"
                      }
                      : tipo == "consulta" ?
                        {
                          height: "100%",
                          border: "3px solid #3300FF",
                          marginLeft: "-3px",
                          paddingLeft: "3px"
                        }
                        : {
                          height: "100%",
                          border: "3px solid transparent",
                          marginLeft: "-3px",
                          paddingLeft: "3px"
                        }
                  }
                >
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
                          minWidth: 0,
                        }}
                        title={`${eventTime} - ${info.event.title} - ${celular}`}
                      >
                        {eventTime} - {nombrePaciente} - {celular}
                      </b>
                    </span>

                    {isDayView && comentarios && (
                      <span
                        style={{
                          marginLeft: "6px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          color: "black",
                          flexShrink: 0,
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
                      title={tipo}
                    >
                      {
                        tipo == "terapia"
                          ? <ImageTherapy />
                          : tipo == "consulta"
                            ? <ImageConsulta />
                            : <span>🩺</span>
                      } {tipo}


                    </small>
                  </div>

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

                <div style={{ position: 'absolute', bottom: '22px', left: '150px' }}>
                  <Tooltip title='Historia Clinica' >
                    <Link to={"/historia-paciente/" + paciente_id}>
                      <ImageHistory />
                    </Link>
                  </Tooltip>
                </div>

                <div style={{ position: 'absolute', bottom: '5px', left: '150px' }}>
                  {/* <Checkbox
                    onChange={(i) => enviarConfirmacionCita(info, i.target.checked)}
                    checked={confirmado}
                    style={{ display: 'none' }}
                    ref={confirmacionRef}
                  /> */}
                  <div onClick={() => enviarConfirmacionCita(info, !confirmado)}>
                    {
                      confirmado == 'SIN STATUS'
                        ? <Checkbox
                          checked={false}
                          ref={confirmacionRef}
                          style={{ position: 'absolute', bottom: '-5px' }}
                        />
                        : confirmado == 'CONFIRMADO'
                          ? <ImageCheck />
                          : confirmado == 'CANCELADO'
                            ? <ImageCancel />
                            : confirmado == 'REAGENDADO'
                              ? <ImageWatch />
                              : <div></div>

                      // <ImageCheck />
                      // <ImageCancel />
                    }

                  </div>
                </div>
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
                onClick={() => formikRef.current?.submitForm()}
                disabled={esProximaCita === false && isEditMode}
              >
                Agendar Cita
              </Button>
            </div>
          </div>
        ]}
        style={{ width: "90vh" }}
      >
        <Formik
          innerRef={formikRef}
          initialValues={{
            paciente: '',
            cedula: '',
            apellidos: '',
            celular: '',
            sucursal: '',
            doctor: '',
            comentarios: '',
            fechaAgenda: '',
            proximosServicios: '',
            fechaAgenda: '',
            fechaAgendaFin: '',
            tipoAgenda: '',
            agendado_por: '',
            confirmado: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleAgendarEvent}
        >
          {({ values, setFieldValue, handleSubmit, errors, touched }) => (
            <Form onSubmit={handleSubmit}>
              <Row gutter={[16, 32]} style={{ marginBottom: 24 }}>
                <Col xxl={12} xl={12} md={12}>
                  <Box
                    component="form"
                    sx={{ '& > :not(style)': { width: '25ch' } }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="outlined-basic"
                      label="Agendado por"
                      variant="outlined"
                      value={values.agendado_por}
                      disabled
                    />

                  </Box>
                </Col>
                <Col xxl={12} xl={12} md={12}>
                  <FormControl
                    sx={{ width: '100%' }}
                    error={Boolean(touched.confirmado && errors.confirmado)}
                  >
                    <InputLabel id="demo-simple-select-label">Status</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={values.confirmado}
                      onChange={(event) => {
                        const selectedValue = event.target.value;
                        setSelectConfirmado(selectedValue);
                        setFieldValue('confirmado', selectedValue);
                      }}
                      label="Status"
                    >
                      {[
                        "SIN STATUS", "CONFIRMADO", "CANCELADO", "POSTERGADO"
                      ].map((sucursal) => (
                        <MenuItem key={sucursal} value={sucursal}>
                          {sucursal}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.confirmado && errors.confirmado && (
                      <FormHelperText>{errors.confirmado}</FormHelperText>
                    )}
                  </FormControl>
                </Col>
              </Row>
              <Row gutter={[16, 32]} style={{ marginBottom: 24 }}>
                <Col xxl={12} xl={12} md={12}>
                  <Autocomplete
                    name="cedula"
                    options={pacientes_options_agenda}
                    getOptionLabel={(option) => option.label || ''}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(event, newValue) => {
                      setFieldValue('cedula', newValue && newValue.nro_cedula ? newValue.nro_cedula : '');
                      setFieldValue('paciente', newValue && newValue.nombres ? newValue.nombres : '');
                      setFieldValue('apellidos', newValue && newValue.apellidos ? newValue.apellidos : '');
                      setFieldValue('celular', newValue && newValue.celular ? newValue.celular : '');
                      setPacienteId(newValue?.id)
                      setCreateCedula(null)
                    }}
                    loading={isLoading}
                    onOpen={() => {
                      if (!dataLoaded) {
                        setIsLoading(true);
                        dispatch(fetchPacientes({}))
                          .then(() => {
                            setDataLoaded(true);
                          })
                          .catch((error) => {
                            console.error('Error al cargar las cédulas:', error);
                          })
                          .finally(() => {
                            setIsLoading(false);
                          });
                      }
                    }}
                    disablePortal
                    renderInput={(params) => {
                      return (
                        <Box sx={{ position: 'relative' }}>
                          <Typography
                            sx={{
                              position: 'absolute',
                              opacity: 0.5,
                              left: 14,
                              top: 16,
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              width: 'calc(100% - 75px)',
                            }}
                          >
                            {hint.current}
                          </Typography>
                          <TextField
                            {...params}
                            onChange={(event) => {
                              console.log('value:', event.target.value)
                              const newValue = event.target.value;
                              setFieldValue('cedula', newValue);
                              setNroCedula(event.target.value)
                              setCreateCedula(event.target.value)

                            }}
                            error={Boolean(errors.cedula && touched.cedula)}
                            helperText={touched.cedula && errors.cedula}
                            label="Cedula"
                          />
                        </Box>
                      );
                    }}
                    inputValue={values.cedula}
                  />
                </Col>

                <Col xxl={12} xl={12} md={12}>
                  <Autocomplete
                    options={pacientes_options_agenda}
                    getOptionLabel={(option) => option.label || ''}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(event, newValue) => {
                      setFieldValue('paciente', newValue && newValue.label ? newValue.label : '');
                      setFieldValue('cedula', newValue && newValue.nro_cedula ? newValue.nro_cedula : '');
                      setFieldValue('apellidos', newValue && newValue.apellidos ? newValue.apellidos : '');
                      setFieldValue('celular', newValue && newValue.celular ? newValue.celular : '');
                      setPacienteId(newValue?.id)
                      setCreateCedula(null)
                    }}
                    disablePortal
                    loading={isLoading}
                    onOpen={() => {
                      if (!dataLoaded) {
                        setIsLoading(true);
                        dispatch(fetchPacientes({}))
                          .then(() => {
                            setDataLoaded(true);
                          })
                          .catch((error) => {
                            console.error('Error al cargar las cédulas:', error);
                          })
                          .finally(() => {
                            setIsLoading(false);
                          });
                      }
                    }}
                    renderInput={(params) => {
                      return (
                        <Box sx={{ position: 'relative' }}>
                          <Typography
                            sx={{
                              position: 'absolute',
                              opacity: 0.5,
                              left: 14,
                              top: 16,
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              width: 'calc(100% - 75px)',
                            }}
                          >
                            {hint.current}
                          </Typography>
                          <TextField
                            {...params}
                            onChange={(event) => {
                              const newValue = event.target.value;
                              setFieldValue('paciente', newValue);
                              setSelectedPaciente(event.target.value)
                              if (nroCedula) {
                                setCreateCedula(nroCedula)
                              }
                            }}
                            error={Boolean(errors.paciente && touched.paciente)}
                            helperText={touched.paciente && errors.paciente}
                            label="Nombre"
                          />
                        </Box>
                      );
                    }}
                    inputValue={values.paciente}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 32]} style={{ marginBottom: 24 }}>
                <Col xxl={12} xl={12} md={12}>
                  <Autocomplete
                    options={pacientes_options_agenda}
                    getOptionLabel={(option) => option.label || ''}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(event, newValue) => {
                      console.log('newValue:', newValue)
                      setFieldValue('apellidos', newValue && newValue.apellidos ? newValue.apellidos : '');
                      setFieldValue('paciente', newValue && newValue.label ? newValue.label : '');
                      setFieldValue('cedula', newValue && newValue.nro_cedula ? newValue.nro_cedula : '');
                      setFieldValue('apellidos', newValue && newValue.apellidos ? newValue.apellidos : '');
                      setFieldValue('celular', newValue && newValue.celular ? newValue.celular : '');
                      setPacienteId(newValue?.id)
                      setCreateCedula(null)
                    }}
                    disablePortal
                    loading={isLoading}
                    onOpen={() => {
                      if (!dataLoaded) {
                        setIsLoading(true);
                        dispatch(fetchPacientes({}))
                          .then(() => {
                            setDataLoaded(true);
                          })
                          .catch((error) => {
                            console.error('Error al cargar las cédulas:', error);
                          })
                          .finally(() => {
                            setIsLoading(false);
                          });
                      }
                    }}
                    renderInput={(params) => {
                      return (
                        <Box sx={{ position: 'relative' }}>
                          <Typography
                            sx={{
                              position: 'absolute',
                              opacity: 0.5,
                              left: 14,
                              top: 16,
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              width: 'calc(100% - 75px)',
                            }}
                          >
                            {hint.current}
                          </Typography>
                          <TextField
                            {...params}
                            onChange={(event) => {
                              const newValue = event.target.value;
                              setFieldValue('apellidos', newValue);
                              setApellidos(event.target.value)
                              if (nroCedula) {
                                setCreateCedula(nroCedula)
                              }
                            }}
                            error={Boolean(errors.apellidos && touched.apellidos)}
                            helperText={touched.apellidos && errors.apellidos}
                            label="Apellidos"

                          />
                        </Box>
                      );
                    }}
                    inputValue={values.apellidos}
                  />
                </Col>
                <Col xxl={12} xl={12} md={12}>
                  <Autocomplete
                    options={pacientes_options_agenda}
                    getOptionLabel={(option) => option.label || ''}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(event, newValue) => {
                      setFieldValue('celular', newValue && newValue.celular ? newValue.celular : '');
                      setFieldValue('cedula', newValue && newValue.nro_cedula ? newValue.nro_cedula : '');
                      setFieldValue('apellidos', newValue && newValue.apellidos ? newValue.apellidos : '');
                      setFieldValue('paciente', newValue && newValue.label ? newValue.label : '');
                      setPacienteId(newValue?.id)
                      setCreateCedula(null)
                    }}
                    loading={isLoading}
                    onOpen={() => {
                      if (!dataLoaded) {
                        setIsLoading(true);
                        dispatch(fetchPacientes({}))
                          .then(() => {
                            setDataLoaded(true);
                          })
                          .catch((error) => {
                            console.error('Error al cargar las cédulas:', error);
                          })
                          .finally(() => {
                            setIsLoading(false);
                          });
                      }
                    }}
                    disablePortal
                    renderInput={(params) => {
                      return (
                        <Box sx={{ position: 'relative' }}>
                          <Typography
                            sx={{
                              position: 'absolute',
                              opacity: 0.5,
                              left: 14,
                              top: 16,
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              width: 'calc(100% - 75px)',
                            }}
                          >
                            {hint.current}
                          </Typography>
                          <TextField
                            {...params}
                            onChange={(event) => {
                              let newValue = event.target.value;
                              if (newValue && !newValue.startsWith('+507')) {
                                newValue = '+507' + newValue.replace(/^\+507/, '').replace(/[^0-9]/g, '');
                              }

                              setFieldValue('celular', newValue);
                              setCelular(newValue);

                              if (nroCedula) {
                                setCreateCedula(nroCedula);
                              }
                            }}
                            label="Celular"
                            error={Boolean(errors.celular && touched.celular)}
                            helperText={touched.celular && errors.celular}
                          />

                        </Box>
                      );
                    }}
                    inputValue={values.celular}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 32]} style={{ marginBottom: 24 }}>
                <Col xxl={12} xl={12} md={12}>
                  <FormControl sx={{ width: '100%' }}
                    error={Boolean(touched.sucursal && errors.sucursal)}
                  >
                    <InputLabel id="demo-simple-select-label">Sucursal</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={values.sucursal}
                      onChange={(event) => {
                        const selectedValue = event.target.value;
                        handleSucursalChangeSelect(selectedValue);
                        setFieldValue('sucursal', selectedValue);
                      }}
                      label="Sucursal"
                    >
                      {sucursales_option_selects.map((sucursal) => (
                        <MenuItem key={sucursal.value} value={sucursal.value}>
                          {sucursal.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.sucursal && errors.sucursal && (
                      <FormHelperText>{errors.sucursal}</FormHelperText>
                    )}
                  </FormControl>
                </Col>

                <Col xxl={12} xl={12} md={12}>
                  <FormControl sx={{ width: '100%' }}
                    error={Boolean(touched.doctor && errors.doctor)}
                  >
                    <InputLabel id="demo-simple-select-label">Doctor</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={values.doctor}
                      onChange={(event) => {
                        const selectedValue = event.target.value;
                        handleDoctorChange(selectedValue);
                        setFieldValue('doctor', selectedValue);
                      }}
                      label="Doctor"
                    >
                      {usuarios_doctores_options_selecteds.map((doctor) => (
                        <MenuItem key={doctor.value} value={doctor.label}>
                          {doctor.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.doctor && errors.doctor && (
                      <FormHelperText>{errors.doctor}</FormHelperText>
                    )}
                  </FormControl>
                </Col>
              </Row>
              <FormControl sx={{ m: 1, width: '100%' }}>
                <FormLabel htmlFor="comentarios">Comentarios de la agenda:</FormLabel>
                <TextareaAutosize
                  id="comentarios"
                  name="comentarios"
                  minRows={4}
                  placeholder="Escribe tu comentario aquí..."
                  style={{
                    width: '100%',
                    fontSize: 16,
                    padding: 8,
                    borderRadius: 4,
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                    fontFamily: 'inherit',
                  }}
                  value={values.comentarios}
                  onChange={(e) => {
                    setFieldValue('comentarios', e.target.value)
                    setComentarios(e.target.value)
                  }}
                />
              </FormControl>

              <Row gutter={[16, 16]}>
                <Col xxl={24} xl={24} md={24}>
                  <label style={{ marginTop: '10px' }}>Fecha y hora de la agenda:</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {/* <Button type={rangeTimeEndDateSelected == 15 ? "primary" : "default"} onClick={()=> setTimeEndDate(15)}>15min</Button> */}
                    <Button type={rangeTimeEndDateSelected == 30 ? "primary" : "default"} onClick={() => setTimeEndDate(30)}>30min</Button>
                    <Button type={rangeTimeEndDateSelected == 45 ? "primary" : "default"} onClick={() => setTimeEndDate(45)}>45min</Button>
                    <Button type={rangeTimeEndDateSelected == 60 ? "primary" : "default"} onClick={() => setTimeEndDate(60)}>1h</Button>
                    {/* <Button type={!rangeTimeEndDateSelected ? "primary" : "default"} onClick={()=> setTimeEndDate(null)}>Otro</Button> */}
                  </div>
                </Col>
                <Col xxl={12} xl={12} md={12}>
                  <label style={{ marginTop: '5px' }}>Hora de inicio:</label>
                  <DatePicker
                    value={values.fechaAgenda ? dayjs(values.fechaAgenda) : null}
                    allowClear={false}
                    showTime={{ format: "HH:mm" }}
                    format="YYYY-MM-DD HH:mm"
                    style={{ marginBottom: "10px", width: "100%" }}
                    placeholder="Fecha y hora de inicio"
                    onChange={(date) => {
                      setFieldValue('fechaAgenda', date ? date.toISOString() : '');
                      setFechaAgendaInicio(date)
                    }}
                  />
                </Col>
                <Col xxl={12} xl={12} md={12}>
                  <label style={{ marginTop: '10px' }}>Hora de fin:</label>

                  <DatePicker
                    value={values.fechaAgendaFin ? dayjs(values.fechaAgendaFin) : null}
                    allowClear={false}
                    disabled={!enableTimeEndDateForm}
                    showTime={{ format: "HH:mm" }}
                    format="YYYY-MM-DD HH:mm"
                    style={{ marginBottom: "10px", width: "100%", color: '#1677FF !important' }}
                    placeholder="Fecha y hora de fin"
                    onChange={(date) => {
                      setFieldValue('fechaAgendaFin', date ? date.toISOString() : '');
                      setFechaAgendaFin(date)
                    }}

                  />

                </Col>
              </Row>

              <Radio.Group
                name="tipoAgenda"
                value={values.tipoAgenda}
                onChange={(e) => {
                  setFieldValue('tipoAgenda', e.target.value),
                    setTipoAgenda(e.target.value)
                }}
              >
                <Radio value="terapia">Terapias</Radio>
                <Radio value="consulta">Consultas</Radio>
              </Radio.Group>

              <div className="form-row mb-4 mt-2">
                <div className="form-group col-md-12">
                  <FormLabel htmlFor="comentarios">Servicios a realizar:</FormLabel>
                  <FormControl sx={{ m: 1, width: '100%' }}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={values.proximosServicios}
                      onChange={(event) => {
                        const value = event.target.value;
                        setFieldValue('proximosServicios', value);
                        const option = servicios.find(servicio => servicio.id === value);

                        if (option) {
                          setProximosServicios((prev) => {
                            const indexFind = prev.findIndex(
                              (proximo) => proximo.value === option.id
                            );

                            const newOption = {
                              value: option.id,
                              label: option.codigo + ' | ' + option.servicio,
                            };

                            if (indexFind !== -1) {
                              return prev.map((proximo, index) =>
                                index === indexFind ? { ...proximo, ...newOption } : proximo
                              );
                            } else {
                              return [...prev, newOption];
                            }
                          });
                        }
                      }}
                      MenuProps={MenuProps}
                    >
                      {servicios.map((servicio) => (
                        <MenuItem key={servicio.id} value={servicio.id}>
                          {servicio.codigo + "|" + servicio.servicio}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                            {servicio?.label}
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
          )}
        </Formik>
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
            <div style={{ position: 'relative' }}>
              <div>
                <List.Item
                  style={
                    event.tipo == "terapia"
                      ? {
                        cursor: "pointer",
                        padding: "6px",
                        marginBottom: "6px",
                        backgroundColor: event.backgroundColor,
                        borderLeft: `3px solid ${event.borderColor}`,
                        borderRadius: "6px",
                        color: "white",
                        fontSize: "12px",
                        height: "100%",
                        border: "3px solid #003300",
                      }
                      : event.tipo == "consulta"
                        ? {
                          cursor: "pointer",
                          padding: "6px",
                          marginBottom: "6px",
                          backgroundColor: event.backgroundColor,
                          borderLeft: `3px solid ${event.borderColor}`,
                          borderRadius: "6px",
                          color: "white",
                          fontSize: "12px",
                          height: "100%",
                          border: "3px solid #3300FF",
                        }
                        : {
                          cursor: "pointer",
                          padding: "6px",
                          marginBottom: "6px",
                          backgroundColor: event.backgroundColor,
                          borderLeft: `3px solid ${event.borderColor}`,
                          borderRadius: "6px",
                          color: "white",
                          fontSize: "12px",
                          height: "100%",
                          border: "3px solid transparent",
                        }
                  }
                  onClick={() => {
                    // setIsGroupedModalOpen(false);
                    // handleEventClick({ event: { id: event.id } });
                    handleEventClick({ event: event });
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <strong style={{ fontSize: "11px", color: 'black' }}>
                      {dayjs(event.start).format("HH:mm")} - {event.title} - {event.celular}
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
              </div>

              <div style={{ position: 'absolute', bottom: '22px', left: '115px' }}>
                <Tooltip title='Historia Clinica' >
                  <Link to={"/historia-paciente/" + event.paciente_id}>
                    <ImageHistory />
                  </Link>
                </Tooltip>
              </div>

              <div style={{ position: 'absolute', bottom: '0', left: '115px' }}>
                {/* <Checkbox
                  onChange={(i) => enviarConfirmacionCita({ event: event }, i.target.checked)}
                  checked={event.confirmado}
                /> */}
                <div onClick={() => enviarConfirmacionCita({ event: event }, '')}>
                  {
                    event.confirmado == 'SIN STATUS'
                      ? <Checkbox
                        checked={false}
                        ref={confirmacionRef}
                        style={{ position: 'absolute', bottom: '2px' }}
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

            </div>
          )}
        />

      </Modal>
    </div >
  );
};

export default VerAgenda;