import React, { useState, useRef, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import {
  Modal,
  Input,
  DatePicker,
  Radio,
  Button,
  Space,
  Popconfirm,
  Select,
  Row,
  Col,
  List,
  Form,
  Spin,
  AutoComplete,
  Calendar,
  Checkbox,
  Tooltip,
  Grid,
  Switch,
} from "antd";
import {
  LeftOutlined,
  RightOutlined,
  PlusOutlined,
  CalendarOutlined,
  DeleteOutlined,
  CloseCircleTwoTone,
  EyeOutlined,
  PhoneOutlined,
  EditOutlined,
  DownloadOutlined,
  ConsoleSqlOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/es";
import BotonesFiltroAgenda from "./components/BotonesFiltroAgenda";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchServicios,
  fetchServiciosProximosAgenda,
} from "../../redux/features/servicios/serviciosSlice";
import {
  addOrUpdateEvent,
  deleteCita,
  fetchAgendarCitas,
  fetchCitasAgenda,
  fetchConfirmarCita,
  setCurrentViewAgenda,
  updateCita,
  selectDisplayedCitas
} from "../../redux/features/citas/CitasAgendaSlice";
import { fetchSucursales } from "../../redux/features/sucursales/sucursalesSlice";
import Swal from "sweetalert2";
import { fetchPacientes } from "../../redux/features/pacientes/pacientesSlice";
import { fetchUsuarios } from "../../redux/features/usuarios/usuariosSlice";
import axios from "axios";
import getIp from "../../redux/features/utils/getIp";
import {
  crearPacientes,
  verificarCedula,
} from "../../redux/features/pacientes/crearPacientesSlice";
import debounce from "lodash/debounce";
import { Link } from "react-router-dom";
import TimeLine from "./components/TimeLine";
import * as XLSX from "xlsx";
import ValidarPermisos from "../../utils/ValidarPermisos";

dayjs.locale("es");
const { useBreakpoint } = Grid;

const VerAgenda = () => {
  const screens = useBreakpoint();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { servicios, serviciosProximos, serviciosProximos_options } = useSelector(
    (state) => state.servicios
  );
  const [IP, setIp] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  const [selectedIndex, setSelectedIndex] = useState([0]);
  const [proximosServicios, setProximosServicios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [nroCedula, setNroCedula] = useState("");
  const [doctor, setDoctor] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [direccion_sucursal, setDireccion_sucursal] = useState("");
  const [celular, setCelular] = useState();
  const [eventDescription, setEventDescription] = useState("");
  const [eventDates, setEventDates] = useState(dayjs());

  const [dateEvent, setDateEvent] = useState(null);
  const [eventBadge, setEventBadge] = useState("");
  const [tableName, setTableName] = useState("citas_servicios");
  const [agendado_por, setAgendadoPor] = useState("");
  const [sucursalId, setSucursalId] = useState();
  // const [pacienteId, setPacienteId] = useState();
  const [eventPaciente, setEventPaciente] = useState(null);
  const [consultaId, setConsultaId] = useState();
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
  const [hideSunday, setHideSunday] = useState(false);
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
  // const citasAgenda = useSelector(selectDisplayedCitas);
  const { citasAgenda, allCitasAgenda } = useSelector((state) => state.citasAgenda);

  const { sucursales_with_colors, sucursales_option_selects } = useSelector(
    (state) => state.sucursales
  );

  const { pacientes_options_agenda } = useSelector((state) => state.pacientes);

  const { usuarios_doctores_options_selecteds } = useSelector((state) => state.usuarios);

  const [selectedPaciente, setSelectedPaciente] = useState(null);

  const [selectedSucursal, setSelectedSucursal] = useState(null);

  const [selectedCedula, setSelectedCedula] = useState(null);

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [dataLoaded, setDataLoaded] = useState(false);

  const [pacienteInput, setPacienteInput] = useState("");

  const [pacienteId, setPacienteId] = useState("");

  const [createPaciente, setCreatePaciente] = useState(null);

  const [createCedula, setCreateCedula] = useState(null);

  const [apellidos, setApellidos] = useState("");

  const [esProximaCita, setEsProximaCita] = useState(null);

  const [openCalendar, setOpenCalendar] = useState(false);

  const [enableTimeEndDateForm, setEnableTimeEndDateForm] = useState(false);

  const [rangeTimeEndDateSelected, setRangeTimeEndDateSelected] = useState(60);

  const debouncedSetCedula = useMemo(
    () =>
      debounce((val) => {
        // setPacienteId(null);
        setCreateCedula(val);
      }, 100),
    []
  );

  const debouncedSetNombre = useMemo(
    () =>
      debounce((val) => {
        const cedula = form.getFieldValue("nroCedula");
        setCreateCedula(cedula);
      }, 100),
    []
  );

  const debouncedSetApellidos = useMemo(
    () =>
      debounce((val) => {
        const cedula = form.getFieldValue("nroCedula");
        setCreateCedula(cedula);
      }, 100),
    []
  );

  const debouncedSetCelular = useMemo(
    () =>
      debounce((val) => {
        const cedula = form.getFieldValue("nroCedula");
        setCreateCedula(cedula);
      }, 300),
    []
  );

  useEffect(() => {
    dispatch(fetchSucursales({}));
  }, []);

  useEffect(() => {
    setProximosServicios(serviciosProximos_options);
  }, [serviciosProximos_options]);

  // useEffect(() => {
  //   form.setFieldsValue({ agendado_por: usuario });
  // }, [form]);

  useEffect(() => {
    dispatch(fetchUsuarios({}));
  }, []);

  useEffect(() => {
    if (sucursales_option_selects && sucursales_option_selects.length > 0) {
      sucursales_option_selects.map((sucursal) => {
        // Dorado : 186.74.2.218
        // San Judas Tadeo: 190.219.45.142
        // Paitilla:  45.229.196.9

        if (localStorage.getItem("ip") == "38.255.105.33") {
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
      });
    }
  }, [sucursales_option_selects]);

  const [isLoading, setIsLoading] = useState(false);

  const handlePacienteSelectOpen = () => {
    if (!dataLoaded) {
      setIsLoading(true);
      dispatch(fetchPacientes({}))
        .then(() => {
          setDataLoaded(true);
        })
        .catch((error) => {
          console.error("Error al cargar los pacientes:", error);
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
          console.error("Error al cargar las cedulas:", error);
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
    const selected = pacientes_options_agenda.find((paciente) => paciente.value === value);

    if (selected) {
      setSelectedPaciente(selected.value);
      setPacienteId(selected.value);
      setApellidos(selected.apellidos);
      setApellidos(selected.celular);

      form.setFieldsValue({ nroCedula: selected.nro_cedula });
      form.setFieldsValue({ apellidos: selected.apellidos });
      form.setFieldsValue({ celular: selected.celular });
    }
  };

  const handleCedulaChange = (value) => {
    const paciente = pacientes_options_agenda.find((paciente) => paciente.value === value);

    if (paciente) {
      setSelectedPaciente(paciente.value);
      setPacienteId(paciente.value);
      setApellidos(paciente.apellidos);
      setCelular(paciente.celular);
      form.setFieldsValue({ paciente: paciente.nombres });
      form.setFieldsValue({ apellidos: paciente.apellidos });
      form.setFieldsValue({ celular: paciente.celular });
    }
  };

  const handleApellidosChange = (value) => {
    const selected = pacientes_options_agenda.find((paciente) => paciente.value === value);

    if (selected) {
      setSelectedPaciente(selected.value);
      setPacienteId(selected.value);
      setApellidos(selected.apellidos);
      setCelular(selected.celular);
      form.setFieldsValue({ nroCedula: selected.nro_cedula });
      form.setFieldsValue({ paciente: selected.nombres });
      form.setFieldsValue({ apellidos: selected.apellidos });
      form.setFieldsValue({ celular: selected.celular });
    }
  };

  const handleCelularChange = (value) => {
    const selected = pacientes_options_agenda.find((paciente) => paciente.value === value);
    if (selected) {
      setSelectedPaciente(selected.value);
      setPacienteId(selected.value);
      setApellidos(selected.apellidos);
      setCelular(selected.celular);
      form.setFieldsValue({ nroCedula: selected.nro_cedula });
      form.setFieldsValue({ paciente: selected.nombres });
      form.setFieldsValue({ apellidos: selected.apellidos });
      form.setFieldsValue({ celular: selected.celular });
    }
  };

  const resetearFormulario = (info = null) => {

    setPacienteId(null);
    setSelectedPaciente(null);
    setCelular("");
    setApellidos("");
    setCreateCedula(null);
    setCreatePaciente(null);


    setCurrentEventId(null);
    setIsEditMode(false);
    setConsultaId(null);
    setTableName(null);
    setEsProximaCita(null);
    setSelectedDoctor(null);
    setSelectedSucursal(null);
    setSucursal("");
    setSucursalId(null);
    setProximosServicios([]);
    setRangeTimeEndDateSelected(60);
    setAgendadoPor(localStorage.getItem("usuario"));


    form.resetFields();
    form.setFieldsValue({
      nroCedula: "",
      paciente: "",
      apellidos: "",
      celular: "",
      doctor: "",
      comentarios: "",
      confirmado: "SIN STATUS",
      tipoAgenda: "",
      agendado_por: localStorage.getItem("usuario"),
      proximosServicios: [],
      fechaAgenda: info ? dayjs(info.date) : dayjs(),
      fechaAgendaFin: info ? dayjs(info.date).add(1, "hour") : dayjs().add(1, "hour"),
    });

    const sucursalSeleccionado = seleccionarSucursalIP();
    if (sucursalSeleccionado) {
      setSucursalId(sucursalSeleccionado.value);
      setSucursal(sucursalSeleccionado.label);
      setSelectedSucursal(sucursalSeleccionado.value);
      setDireccion_sucursal(sucursalSeleccionado.ubicacion_maps);
      form.setFieldsValue({
        sucursal: { value: sucursalSeleccionado.value, label: sucursalSeleccionado.label },
      });
    }
  };

  // INICIO DESCARGA DEL EXCEL

  const downloadExcel = () => {
    try {
      if (typeof XLSX === "undefined") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "La librería XLSX no está disponible. Por favor, instala la dependencia.",
        });
        return;
      }

      const currentMonth = currentDateAgenda.getMonth() + 1;
      const currentYear = currentDateAgenda.getFullYear();
      const monthName = new Intl.DateTimeFormat("es-ES", {
        month: "long",
      }).format(currentDateAgenda);

      if (!allCitasAgenda || allCitasAgenda.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Sin datos",
          text: "No hay citas disponibles para exportar.",
        });
        return;
      }

      const citasDelMes = allCitasAgenda.filter((cita) => {
        const citaDate = new Date(cita.start);
        return citaDate.getMonth() + 1 === currentMonth && citaDate.getFullYear() === currentYear;
      });

      if (citasDelMes.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Sin datos",
          text: `No hay citas disponibles para ${monthName} ${currentYear}.`,
        });
        return;
      }

      // Revisar todas las propiedades que podrían contener servicios
      citasDelMes.forEach((cita, index) => {
        if (index < 3) {
          // Solo las primeras 3 para no llenar la consola
          console.log(`Cita ${index + 1}:`, {
            id: cita.id,
            extendedProps: cita.extendedProps,
            // Verificar si hay servicios en diferentes ubicaciones
            proximosServicios: cita.extendedProps?.proximosServicios,
            servicios_realizados: cita.extendedProps?.servicios_realizados,
            servicios: cita.extendedProps?.servicios,
            // También revisar directamente en la cita
            citaServicios: cita.servicios,
            citaProximosServicios: cita.proximosServicios,
          });
        }
      });

      const excelData = citasDelMes.map((cita) => {
        const fechaInicio = new Date(cita.start);
        const fechaFin = cita.fecha_hora_fin ? new Date(cita.fecha_hora_fin) : null;
        const nombres = cita.paciente || cita.title?.split(" - ")[0] || "";
        const apellidos = cita.apellidos || "";
        const nombreCompleto = apellidos ? `${nombres} ${apellidos}` : nombres;

        // FUNCIÓN PARA PROCESAR SERVICIOS
        const obtenerServicios = (cita) => {
          let servicios = [];

          // Intentar obtener servicios de diferentes ubicaciones posibles
          const posiblesServicios = [
            cita.extendedProps?.proximosServicios,
            cita.extendedProps?.servicios_realizados,
            cita.extendedProps?.servicios,
            cita.servicios,
            cita.proximosServicios,
          ];

          for (let servicioData of posiblesServicios) {
            if (servicioData) {
              // Si es un array de objetos
              if (Array.isArray(servicioData)) {
                servicios = servicioData.map((servicio) => {
                  if (typeof servicio === "object") {
                    return `${servicio.servicio_codigo || servicio.codigo || ""} | ${servicio.servicio_nombre || servicio.nombre || servicio.servicio || ""
                      }`;
                  }
                  return servicio.toString();
                });
                break;
              }
              // Si es una cadena
              else if (typeof servicioData === "string" && servicioData.trim() !== "") {
                servicios = [servicioData];
                break;
              }
            }
          }

          return servicios.join(", ") || "Sin servicios especificados";
        };

        const serviciosTexto = obtenerServicios(cita);

        return {
          Tipo: cita.extendedProps?.tipoAgenda || cita.tipo || "",
          Cédula: cita.extendedProps?.nroCedula || cita.nro_cedula || "",
          "Nombre Paciente": nombreCompleto,
          Sucursal: cita.sucursal || "",
          Doctor: cita.doctor || "",
          Status: cita.confirmado || "SIN STATUS",
          Celular: cita.celular || "",
          // "Servicios a Realizar": serviciosTexto,
          Fecha: fechaInicio.toLocaleDateString("es-ES"),
          "Hora Inicio": fechaInicio.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          "Hora Fin": fechaFin
            ? fechaFin.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
            : "",
          Comentarios: cita.comentarios || "",
          "Agendado Por": cita.agendado_por || "",
        };
      });

      // DEBUGGING: Ver los datos procesados para Excel
      console.log("=== DATOS PARA EXCEL ===");
      console.log("Primeros 2 registros procesados:", excelData.slice(0, 2));

      // Crear el libro de trabajo
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();

      // Agregar la hoja al libro
      XLSX.utils.book_append_sheet(workbook, worksheet, `Agenda ${monthName} ${currentYear}`);

      // Ajustar el ancho de las columnas
      const columnWidths = [
        { wch: 12 }, // Tipo
        { wch: 12 }, // Cédula
        { wch: 45 }, // Nombre Paciente (más ancho para nombre completo)
        { wch: 45 }, // Sucursal
        { wch: 20 }, // Doctor
        { wch: 12 }, // Status
        { wch: 50 }, // Servicios a Realizar (aumenté el ancho)
        { wch: 12 }, // Celular
        { wch: 12 }, // Fecha
        { wch: 12 }, // Hora Inicio
        { wch: 12 }, // Hora Fin
        { wch: 45 }, // Comentarios
        { wch: 15 }, // Agendado Por
      ];
      worksheet["!cols"] = columnWidths;

      // Descargar el archivo
      const fileName = `Agenda_${monthName}_${currentYear}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      // Mostrar mensaje de éxito
      Swal.fire({
        icon: "success",
        title: "Exportación exitosa",
        text: `Se han exportado ${citasDelMes.length} citas del mes de ${monthName} ${currentYear}.`,
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al exportar Excel:", error);
      Swal.fire({
        icon: "error",
        title: "Error de exportación",
        text: "Hubo un error al generar el archivo Excel. Revisa la consola para más detalles.",
      });
    }
  };

  const ExcelDownloadButton = () => (
    <Button
      type="primary"
      icon={<DownloadOutlined />}
      onClick={downloadExcel}
      style={{
        backgroundColor: "#52c41a",
        borderColor: "#52c41a",
        marginTop: "10px",
      }}
    >
      Descargar Excel
    </Button>
  );

  // FIN DE LA DESCARGA DEL EXCEL

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
      tipo = ["consulta", "terapia"];
      citas_id_null = true;
      ex_proxima_cita = [false];
    } else if (
      selectedIndex.length === 3 &&
      selectedIndex.includes(0) &&
      selectedIndex.includes(1) &&
      selectedIndex.includes(2)
    ) {
      tipo = ["consulta", "terapia", "proxima_cita"];
      citas_id_null = true;
      ex_proxima_cita = [true, false];
    } else {
      if (selectedIndex.includes(0)) {
        tipo.push("consulta");
        citas_id_null = true;
        ex_proxima_cita.push(false);
      }
      if (selectedIndex.includes(1)) {
        tipo.push("terapia");
        ex_proxima_cita.push(false);
      }
      if (selectedIndex.includes(2)) {
        tipo.push("proxima_cita");
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
      citas_id_null,
    });
  }, [
    currentView,
    currentDateAgenda,
    selectedSucursales,
    currentEndDateAgenda,
    selectedIndex,
    actualizarCitas,
    dispatch,
  ]);

  const obtenerCitas = async (data) => {
    dispatch(fetchCitasAgenda(data));
  };

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
    if (id === "otros") {
      setSelectedSucursales((prev) => prev.includes(id) ? [] : [id]);
      return;
    }

    setSelectedSucursales((prev) =>
      prev.includes(id) ? prev.filter((sucursalId) => sucursalId !== id) : [...prev, id]
    );
  };

  const generateWhatsAppLink = () => {
    const fecha = new Date(dateEvent);

    const opcionesFecha = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      locale: "es-ES",
    };
    const dia = fecha.toLocaleDateString("es-ES", opcionesFecha);

    const opcionesHora = { hour: "2-digit", minute: "2-digit", hour12: true };
    const hora = fecha.toLocaleTimeString("es-ES", opcionesHora);

    const telefonoFormateado = `${celular.replace(/[^\d]/g, "")}`;
    let mensajePersonalizado = mensaje
      .replace("{dia}", dia)
      .replace("{hora}", hora)
      .replace("{nombre}", eventPaciente)
      .replace("{sucursal}", sucursal)
      .replace("{direccion}", direccion_sucursal);

    const mensajeCodificado = encodeURIComponent(mensajePersonalizado);

    return `https://wa.me/${telefonoFormateado}?text=${mensajeCodificado}`;
  };

  const handleContactarPaciente = async () => {
    try {
      window.open(generateWhatsAppLink(), "_blank");
    } catch (error) {
      console.error("Error al crear contacto:", error);
    }
  };

  const seleccionarSucursalIP = () => {
    let sucursalSeleccionado = null;

    if (sucursales_option_selects && sucursales_option_selects.length > 0) {
      sucursales_option_selects.map((sucursal) => {
        // Dorado : 186.74.2.218
        // San Judas Tadeo: 190.219.45.142
        // Paitilla:  45.229.196.9

        if (localStorage.getItem("ip") == "186.74.2.218") {
          if (sucursal.value == 7) {
            sucursalSeleccionado = sucursal;
          }
        } else if (localStorage.getItem("ip") == "190.219.45.142") {
          if (sucursal.value == 3) {
            sucursalSeleccionado = sucursal;
          }
        } else if (localStorage.getItem("ip") == "45.229.196.9") {
          if (sucursal.value == 4) {
            sucursalSeleccionado = sucursal;
          }
        } else if (localStorage.getItem("ip") == "38.255.105.33") {
          if (sucursal.value == 4) {
            sucursalSeleccionado = sucursal;
          }
        }
      });
    }

    return sucursalSeleccionado;
  };

  const handleDateClick = (info) => {
    resetearFormulario(info);
    setIsModalOpen(true);
    // setIsModalOpen(true);
    // setRangeTimeEndDateSelected(60);
    // setIsEditMode(false);
    // form.setFieldsValue({
    //   fechaAgenda: dayjs(info.dateStr),
    // });
    // setCurrentEventId(null);
    // setEventTitle("");
    // setEventDescription("");
    // setEventDates([dayjs(), dayjs().add(1, "day")]);
    // setEventBadge("Trabajo");
    // setAgendadoPor(localStorage.getItem("usuario"));
    // setProximosServicios([]);
    // setConsultaId(null);
    // setTableName(null);
    // setConsultaId(null);

    // form.resetFields();
    // form.setFieldsValue({
    //   nroCedula: "",
    //   paciente: "",
    //   doctor: "",
    //   comentarios: "",
    //   confirmado: "SIN STATUS",
    //   fechaAgenda: dayjs(info.date),
    //   fechaAgendaFin: dayjs(info.date).add(1, "hour"),
    //   tipoAgenda: "",
    //   agendado_por: localStorage.getItem("usuario"),
    //   proximosServicios: [],
    // });

    // // La IP tiene una sucursal
    // const sucursalSeleccionado = seleccionarSucursalIP();

    // if (sucursalSeleccionado) {
    //   setSucursalId(sucursalSeleccionado.value);
    //   setSucursal(sucursalSeleccionado.label);
    //   setSelectedSucursal(sucursalSeleccionado.value);
    //   setDireccion_sucursal(sucursalSeleccionado.ubicacion_maps);

    //   form.setFieldsValue({
    //     sucursal: {
    //       value: sucursalSeleccionado.value,
    //       label: sucursalSeleccionado.label,
    //     },
    //   });
    // } else {
    //   form.setFieldsValue({
    //     sucursal: "",
    //   });
    // }

    // FIN La IP tiene una sucursal
  };

  const handleEventClick = (info) => {
    const eventId = Number(info.event.id);
    let clickedEvent = allCitasAgenda.find((event) => Number(event.id) === eventId);

    if (!clickedEvent) {
      allCitasAgenda.forEach((event) => {
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
      const fechaInicio = dayjs(clickedEvent.start);
      const fechaFin = clickedEvent.fecha_hora_fin
        ? dayjs(clickedEvent.fecha_hora_fin)
        : fechaInicio.add(60, "minutes"); // ← Asignar fin si no existe

      const diferenciaMinutos = fechaFin.diff(fechaInicio, "minute");

      if (isNaN(diferenciaMinutos)) {
        setRangeTimeEndDateSelected(60);
      } else if ([15, 30, 45, 60].includes(diferenciaMinutos)) {
        setRangeTimeEndDateSelected(diferenciaMinutos);
      } else {
        setRangeTimeEndDateSelected(null);
      }

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
      setPacienteId(clickedEvent.paciente_id);
      setSelectedSucursal(clickedEvent.sucursal_id);
      setAgendadoPor(clickedEvent.agendado_por);
      setPacienteInput(clickedEvent.paciente_id);
      setApellidos(clickedEvent.apellidos);

      form.setFieldsValue({
        nroCedula: clickedEvent.nro_cedula || "",
        paciente: clickedEvent.paciente,
        apellidos: clickedEvent.apellidos,
        celular: clickedEvent.celular,
        sucursal: clickedEvent.sucursal
          ? { value: clickedEvent.sucursal_id, label: clickedEvent.sucursal }
          : undefined,
        doctor: clickedEvent.doctor || "",
        comentarios: clickedEvent.comentarios || "",
        confirmado: clickedEvent.confirmado || "",
        fechaAgenda: fechaInicio,
        fechaAgendaFin: fechaFin,
        tipoAgenda: clickedEvent.tipo || "",
        agendado_por: clickedEvent.agendado_por || "",
      });

      form.validateFields();

      dispatch(
        fetchServiciosProximosAgenda({
          consulta_nombre: clickedEvent.origen_tabla,
          consulta_id: clickedEvent.esProximaCita === 1 ? clickedEvent.origen_id : clickedEvent.id,
        })
      );
    }
  };

  const ImageTherapy = () => (
    <img src="../../../img/icon_therapy.png" width={15} height={15} alt="icon therapy" />
  );

  const ImageConsulta = () => (
    <img src="../../../img/icon_consulta.png" width={15} height={15} alt="icon consulta" />
  );

  const ImageHistory = () => (
    <img src="../../../img/history.png" width={15} height={15} alt="icon history" />
  );

  const ImageCheck = () => (
    <img src="../../../img/check.png" width={15} height={15} alt="icon check" />
  );

  const ImageCancel = () => (
    <img src="../../../img/cancel.png" width={15} height={15} alt="icon cancel" />
  );

  const ImageWatch = () => (
    <img src="../../../img/watch.svg" width={18} height={18} alt="icon watch" />
  );

  const setTimeEndDate = (value) => {
    if (value) {
      form.setFieldsValue({
        fechaAgendaFin: dayjs(form.getFieldValue("fechaAgenda")).add(value, "minutes"),
      });
      setRangeTimeEndDateSelected(value);
      setEnableTimeEndDateForm(false);
    } else {
      setEnableTimeEndDateForm(true);
      setRangeTimeEndDateSelected(null);
    }
  };

  useEffect(() => {
    if (serviciosProximos_options.length > 0) {
      form.setFieldsValue({
        proximosServicios: serviciosProximos_options.map((serv) => serv.value),
      });
    } else {
      form.setFieldsValue({
        proximosServicios: [],
      });
    }
  }, [serviciosProximos_options]);

  const openNewEventModal = () => {
    resetearFormulario();
    setIsModalOpen(true);
    // setIsEditMode(false);
    // setCurrentEventId(null);
    // setEventTitle("");
    // setEventDescription("");
    // setEventDates([dayjs(), dayjs().add(1, "day")]);
    // setEventBadge("Trabajo");
    // setIsModalOpen(true);
  };

  const handleAgendarEvent = async (values) => {
    const serviciosRealizadosSubmit = proximosServicios.map((servicio) => servicio.value);

    if (createCedula !== null && values.nroCedula.trim() !== "") {
      console.log("values1:", values);
      try {
        const response = await dispatch(verificarCedula(createCedula)).unwrap();

        console.log("response:", response);

        if (response === "activo") {
          Swal.fire({
            icon: "warning",
            title: "Cédula existente",
            text: "La cédula ya está registrada. Seleccione un paciente de la lista",
          });
          return;
        }

        if (response === "no_existe") {
          const result = await Swal.fire({
            title: "Paciente no existe",
            text: "El paciente no está registrado. ¿Deseas crearlo?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, crear paciente",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
          });

          if (result.isConfirmed) {
            const dataPaciente = {
              nombres: values.paciente,
              nro_cedula: values.nroCedula,
              apellidos: values.apellidos,
              celular: values.celular,
              estado: false,
              estadoPaciente: "no_existe",
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
    }
    if (createCedula == null || values.nroCedula.trim() == "") {
      console.log("values2:", values);
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
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
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
          apellidos: values.apellidos ?? "",
          celular: values.celular ?? "",
          nombres: values.paciente ?? "",
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
    console.log("values3:", values);
    const serviciosRealizadosSubmit = proximosServicios.map((servicio) => servicio.value);
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
  };

  const handleDeleteEvent = async () => {
    if (currentEventId) {
      try {
        await dispatch(deleteCita(currentEventId)).unwrap();
        setIsModalOpen(false);
        resetForm();

        Swal.fire({
          icon: "success",
          title: "Cita eliminada",
          text: "La cita se eliminó correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error al eliminar",
          text: error?.message || "Ocurrió un error al eliminar la cita.",
        });
      }
    }
  };

  const handleUpdateEvent = async (values) => {
    console.log("values update", values);
    const serviciosRealizadosSubmit = proximosServicios.map((servicio) => servicio.value);
    const tipo = esProximaCita === 1 ? "proxima_cita" : values.tipoAgenda;

    const data = {
      origen_id: consultaId,
      origen_tabla: esProximaCita === 1 ? tableName : "citas_servicios",
      fecha_hora: values.fechaAgenda.format("YYYY-MM-DD HH:mm"),
      tipo,
      paciente_id: pacienteId,
      doctor: values.doctor,
      sucursal_id: selectedSucursal,
      ex_proxima_cita: esProximaCita === 1 ? esProximaCita : 0,
      comentarios: values.comentarios,
      confirmado: values.confirmado,
      agendado_por: usuario,
      servicios_ids: serviciosRealizadosSubmit,
      fecha_hora_fin: values.fechaAgendaFin.format("YYYY-MM-DD HH:mm"),
      nroCedula: values.nroCedula,
      celular: values.celular,
      nombres: values.paciente,
      apellidos: values.apellidos,
    };

    if (currentEventId) {
      try {
        await dispatch(updateCita({ id_cita: currentEventId, data })).unwrap();
        setIsModalOpen(false);

        Swal.fire({
          icon: "success",
          title: "Cita actualizada",
          text: "La cita se actualizó correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error al actualizar",
          text: error?.message || "Ocurrió un error al actualizar la cita.",
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
    setNroCedula("");
    setProximosServicios([]);
  };

  const changeView = (viewName) => {
    if (viewName !== "timeLine") {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.changeView(viewName);
        dispatch(setCurrentViewAgenda(viewName));
        setCurrentView(viewName);
      }
    } else {
      setCurrentView(viewName);
    }
  };

  const goToToday = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();

      const currentDate = calendarApi.getDate();
      setFechaSeleccionada(currentDate);
    }
  };

  const goToPrev = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();

      const currentDate = calendarApi.getDate();
      setFechaSeleccionada(currentDate);
    }
  };

  const goToNext = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();

      console.log(fechaSeleccionada);
      const currentDate = calendarApi.getDate();
      console.log(currentDate);
      setFechaSeleccionada(currentDate);
    }
  };

  useEffect(() => {
    dispatch(fetchServicios({}));
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
      calendarApi.changeView("timeGridDay");
      setFechaSeleccionada(date.toDate());
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
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      console.log(eventId);
      const data = {
        cita_id: eventId,
        confirmado: "CONFIRMADO",
      };

      try {
        await dispatch(fetchConfirmarCita(data)).unwrap();
        setActualizarCitas(!actualizarCitas);
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
  };

  const handleEventDrop = async (info) => {
    const eventId = Number(info.event.id);
    const clickedEvent = allCitasAgenda.find((event) => Number(event.id) === eventId);

    if (!clickedEvent) {
      info.revert();
      return;
    }

    const nuevaFechaInicio = dayjs(info.event.start);
    const nuevaFechaFin = info.event.end
      ? dayjs(info.event.end)
      : nuevaFechaInicio.add(60, "minutes");

    const result = await Swal.fire({
      title: "¿Mover cita?",
      text: `¿Deseas mover la cita al ${nuevaFechaInicio.format("DD/MM/YYYY HH:mm")}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, mover",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (!result.isConfirmed) {
      info.revert();
      return;
    }

    const data = {
      origen_id: clickedEvent.origen_id,
      origen_tabla: clickedEvent.esProximaCita === 1 ? clickedEvent.origen_tabla : "citas_servicios",
      fecha_hora: nuevaFechaInicio.format("YYYY-MM-DD HH:mm"),
      fecha_hora_fin: nuevaFechaFin.format("YYYY-MM-DD HH:mm"),
      tipo: clickedEvent.esProximaCita === 1 ? "proxima_cita" : clickedEvent.tipo,
      paciente_id: clickedEvent.paciente_id,
      doctor: clickedEvent.doctor,
      sucursal_id: clickedEvent.sucursal_id,
      ex_proxima_cita: clickedEvent.esProximaCita === 1 ? 1 : 0,
      comentarios: clickedEvent.comentarios,
      confirmado: clickedEvent.confirmado,
      agendado_por: usuario,
      servicios_ids: [],
      nroCedula: clickedEvent.nro_cedula,
      celular: clickedEvent.celular,
      nombres: clickedEvent.paciente,
      apellidos: clickedEvent.apellidos,
    };

    try {
      await dispatch(updateCita({ id_cita: eventId, data })).unwrap();
      Swal.fire({
        icon: "success",
        title: "Cita movida",
        text: "La cita se actualizó correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      info.revert();
      Swal.fire({
        icon: "error",
        title: "Error al mover",
        text: error?.message || "Ocurrió un error al mover la cita.",
      });
    }
  };

  const handleEventResize = async (info) => {
    const eventId = Number(info.event.id);
    const clickedEvent = allCitasAgenda.find((event) => Number(event.id) === eventId);

    if (!clickedEvent) {
      info.revert();
      return;
    }

    const nuevaFechaInicio = dayjs(info.event.start);
    const nuevaFechaFin = dayjs(info.event.end);

    const result = await Swal.fire({
      title: "¿Cambiar duración?",
      text: `¿Nueva hora de fin: ${nuevaFechaFin.format("HH:mm")}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (!result.isConfirmed) {
      info.revert();
      return;
    }

    const data = {
      origen_id: clickedEvent.origen_id,
      origen_tabla: clickedEvent.esProximaCita === 1 ? clickedEvent.origen_tabla : "citas_servicios",
      fecha_hora: nuevaFechaInicio.format("YYYY-MM-DD HH:mm"),
      fecha_hora_fin: nuevaFechaFin.format("YYYY-MM-DD HH:mm"),
      tipo: clickedEvent.esProximaCita === 1 ? "proxima_cita" : clickedEvent.tipo,
      paciente_id: clickedEvent.paciente_id,
      doctor: clickedEvent.doctor,
      sucursal_id: clickedEvent.sucursal_id,
      ex_proxima_cita: clickedEvent.esProximaCita === 1 ? 1 : 0,
      comentarios: clickedEvent.comentarios,
      confirmado: clickedEvent.confirmado,
      agendado_por: usuario,
      servicios_ids: [],
      nroCedula: clickedEvent.nro_cedula,
      celular: clickedEvent.celular,
      nombres: clickedEvent.paciente,
      apellidos: clickedEvent.apellidos,
    };

    try {
      await dispatch(updateCita({ id_cita: eventId, data })).unwrap();
      Swal.fire({
        icon: "success",
        title: "Duración actualizada",
        text: "La cita se actualizó correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      info.revert();
      Swal.fire({
        icon: "error",
        title: "Error al redimensionar",
        text: error?.message || "Ocurrió un error al actualizar la cita.",
      });
    }
  };

  return (
    <div
      style={
        screens.md
          ? {
            width: "100%",
            margin: "auto",
            padding: "30px",
            position: "relative",
            overflow: "hidden",
          }
          : {
            width: "100%",
            margin: "auto",
            padding: "0px",
            position: "relative",
            overflow: "hidden",
          }
      }
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
          color: "white",
        }}
        onClick={() => setOpenCalendar(!openCalendar)}
      >
        <CalendarOutlined style={{ color: "white" }} />
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
      <div style={{ display: "flex", position: "relative" }}>
        <h2>Calendario</h2>

        <div
          style={{
            position: "absolute",
            right: "0",
          }}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={openNewEventModal}>
            Agendar Cita
          </Button>
        </div>
      </div>

      <div
        style={
          screens.md
            ? {
              background: "white",
              padding: "40px",
              position: "relative",
            }
            : {
              background: "white",
              // padding: '40px',
              position: "relative",
            }
        }
      >
        <BotonesFiltroAgenda
          lista_botones={["Consultas", "Terapias", "Prox. Citas"]}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />

        {ValidarPermisos(
          "agenda.descargar-excel",
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "15px",
              marginBottom: "20px",
              float: "right",
              marginRight: "-24px",
            }}
          >
            <ExcelDownloadButton />
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "45px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          <span style={{ fontSize: "18px", fontWeight: "bold" }}>{currentDate}</span>
        </div>
        <div
          style={
            screens.md
              ? {
                position: "absolute",
                top: "30px",
                left: "40px",
                width: "43%",
                marginBottom: "20px",
              }
              : {
                position: "absolute",
                top: "5px",
                left: "5px",
                width: "43%",
                marginBottom: "20px",
              }
          }
        >
          <Row gutter={[8, 2]}>
            {sucursales_with_colors?.map((category) => (
              <Col key={category.id} xxl={24} xl={24} md={24} ms={24} xs={24}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {category.id === "otros" ?
                    (
                      <Switch
                        size="small"
                        checked={selectedSucursales.includes(category.id)}
                        onChange={() => handleSucursalChange(category.id)}
                      />
                    ) : (
                      <input
                        type="checkbox"
                        disabled={category.id !== "otros" && selectedSucursales.includes("otros")}
                        checked={selectedSucursales.includes(category.id)}
                        onChange={() => handleSucursalChange(category.id)}
                      />
                    )}
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: category.color,
                      borderRadius: 3,
                    }}
                  />
                  <span>
                    {screens.md
                      ? category.name
                      : category.name
                        .replace(
                          /\b(CENTEVI|Medico|Médico|Centro|Consultorios|Medicos|San|Judas)\b/gi,
                          ""
                        )
                        .trim()}
                  </span>
                </div>
              </Col>
            ))}
          </Row>
        </div>
        <div
          style={
            screens.md
              ? { display: "flex", justifyContent: "space-between", marginTop: "90px" }
              : { display: "flex", justifyContent: "space-between", marginTop: "90px" }
          }
        >
          <Space>
            <Button onClick={goToPrev} icon={<LeftOutlined />} />
            <Button onClick={goToNext} icon={<RightOutlined />} />
            <Button onClick={goToToday}>Hoy</Button>
          </Space>

          <Space>
            <Button
              onClick={toggleSunday}
              icon={<EyeOutlined />}
              type={hideSunday ? "default" : "primary"}
            />
            <Button
              onClick={() => changeView("dayGridMonth")}
              type={currentView === "dayGridMonth" ? "primary" : "default"}
            >
              {screens.md ? "Mes" : "M"}
            </Button>
            <Button
              onClick={() => changeView("timeGridWeek")}
              type={currentView === "timeGridWeek" ? "primary" : "default"}
            >
              {screens.md ? "Semana" : "S"}
            </Button>
            <Button
              onClick={() => changeView("timeGridDay")}
              type={currentView === "timeGridDay" ? "primary" : "default"}
            >
              {screens.md ? "Día" : "D"}
            </Button>
            <Button
              onClick={() => changeView("timeLine")}
              type={currentView === "timeLine" ? "primary" : "default"}
            >
              {screens.md ? "Time Line" : "T"}
            </Button>
          </Space>
        </div>
        {/* <button
          onClick={() => console.log(citasAgenda)}
        >
          agenda
        </button> */}
        {/* <h1>{currentView}</h1> */}
        <div style={currentView !== "timeLine" ? {} : { display: "none" }}>
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
            eventDrop={handleEventDrop}      // 👈 agregar
            eventResize={handleEventResize}
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
              meridiem: "short",
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
              meridiem: "short",
            }}
            slotDuration="00:20:00"
            slotLabelInterval="00:30"
            height="auto"
            eventDidMount={(info) => {
              const harness = info.el.closest(".fc-timegrid-event-harness");

              if (!harness) return;

              // Fuerza altura mínima REAL
              const minHeight = 65;

              const currentHeight = harness.getBoundingClientRect().height;

              if (currentHeight < minHeight) {
                harness.style.minHeight = `${minHeight}px`;
                harness.style.height = `${minHeight}px`;
              }
            }}
            eventContent={(info) => {
              const {
                hiddenEvents,
                comentarios,
                doctor,
                tipo,
                paciente,
                apellidos,
                fecha_hora_fin,
                celular,
                confirmado,
                paciente_id,
              } = info.event.extendedProps;
              const primerNombre = paciente ? paciente.trim().split(" ")[0] : "";
              const primerApellido = apellidos ? apellidos.trim().split(" ")[0] : "";
              const nombrePaciente = `${primerNombre} ${primerApellido}`;
              const eventTime =
                info.timeText +
                (fecha_hora_fin
                  ? " - " + dayjs(fecha_hora_fin).format("HH:mm")
                  : " - " + dayjs(info.timeText, "HH:mm").add(1, "hour").format("HH:mm"));

              const isDayView = info.view.type === "timeGridDay";
              return (
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => handleEventClick(info)}
                    style={
                      tipo == "terapia"
                        ? {
                          height: "100%",
                          border: "3px solid #003300",
                          marginLeft: "-3px",
                          paddingLeft: "3px",
                        }
                        : tipo == "consulta"
                          ? {
                            height: "100%",
                            border: "3px solid #3300FF",
                            marginLeft: "-3px",
                            paddingLeft: "3px",
                          }
                          : {
                            height: "100%",
                            border: "3px solid transparent",
                            marginLeft: "-3px",
                            paddingLeft: "3px",
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
                      🧑‍⚕ {doctor}
                    </small>

                    <div style={{ display: "flex" }}>
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
                        {tipo == "terapia" ? (
                          <ImageTherapy />
                        ) : tipo == "consulta" ? (
                          <ImageConsulta />
                        ) : (
                          <span>🩺</span>
                        )}{" "}
                        {tipo}
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

                  <div style={{ position: "absolute", bottom: "22px", left: "150px" }}>
                    <Tooltip title="Historia Clinica">
                      <Link to={"/historia-paciente/" + paciente_id}>
                        <ImageHistory />
                      </Link>
                    </Tooltip>
                  </div>

                  <div style={{ position: "absolute", bottom: "5px", left: "150px" }}>
                    {/* <Checkbox
                    onChange={(i) => enviarConfirmacionCita(info, i.target.checked)}
                    checked={confirmado}
                    style={{ display: 'none' }}
                    ref={confirmacionRef}
                  /> */}
                    <div onClick={() => enviarConfirmacionCita(info, !confirmado)}>
                      {
                        confirmado == "SIN STATUS" ? (
                          <Checkbox
                            checked={false}
                            ref={confirmacionRef}
                            style={{ position: "absolute", bottom: "-5px" }}
                          />
                        ) : confirmado == "CONFIRMADO" ? (
                          <ImageCheck />
                        ) : confirmado == "CANCELADO" ? (
                          <ImageCancel />
                        ) : confirmado == "REAGENDADO" ? (
                          <ImageWatch />
                        ) : (
                          <div></div>
                        )

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

        <div style={currentView !== "timeLine" ? { display: "none" } : {}}>
          <TimeLine
            citasAgenda={allCitasAgenda}
            fechaSeleccionada={fechaSeleccionada}
            handleEventClick={handleEventClick}
            enviarConfirmacionCita={enviarConfirmacionCita}
          />
        </div>
      </div>

      <Modal
        title={isEditMode ? "Editar Cita" : "Agendar Cita"}
        open={isModalOpen}
        width={"90vh"}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        footer={[
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Button type="default" icon={<PhoneOutlined />} onClick={handleContactarPaciente}>
              Contactar
            </Button>

            <div style={{ display: "flex", gap: 8 }}>
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
                      console.log("Errores en el formulario:", errorInfo);
                    }
                  }}
                  okText="Sí"
                  cancelText="No"
                >
                  <Button
                    icon={<EditOutlined />}
                    style={{
                      backgroundColor: "#fadb14",
                      borderColor: "#fadb14",
                      color: "#000",
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
          </div>,
        ]}
        style={{ width: "90vh" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAgendarEvent}
          onValuesChange={(changedValues, allValues) => {
            if (changedValues.fechaAgenda && rangeTimeEndDateSelected) {
              const nuevaFechaInicio = dayjs(changedValues.fechaAgenda);
              const nuevaFechaFin = nuevaFechaInicio.add(rangeTimeEndDateSelected, "minutes");

              form.setFieldsValue({
                fechaAgendaFin: nuevaFechaFin,
              });
            }
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xxl={12} xl={12} md={12}>
              <label style={{ marginTop: "10px" }}>Agendado por:</label>
              <Form.Item name="agendado_por">
                <Input placeholder="" style={{ marginBottom: "5px" }} disabled />
              </Form.Item>
            </Col>
            <Col xxl={12} xl={12} md={12}>
              <label style={{ marginTop: "10px" }}>Status:</label>
              <Form.Item
                name="confirmado"
              // rules={[{ required: true, message: "La sucursal es requerida" }]}
              >
                <Select placeholder="Selecciona un status" onChange={(value) => { }}>
                  {["SIN STATUS", "CONFIRMADO", "CANCELADO", "POSTERGADO", "REAGENDADO"].map(
                    (sucursal) => (
                      <Select.Option key={sucursal} value={sucursal}>
                        {sucursal}
                      </Select.Option>
                    )
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/*  */}
          <Row gutter={[16, 16]}>
            <Col xxl={12} xl={12} md={12}>
              <label style={{ marginTop: "10px" }}>Cedula:</label>
              <Form.Item
                name="nroCedula"
                rules={[{ required: true, message: "La cédula es requerida" }]}
              >
                <AutoComplete
                  allowClear
                  disabled={isEditMode}
                  showSearch
                  placeholder="Seleccionar paciente"
                  onSearch={(text) => debouncedSetCedula(text)}
                  onSelect={(value, data) => {
                    setCreateCedula(null);
                    // handleCedulaChange(key.key);
                    handleCedulaChange(data.id);
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
                      id: paciente.value,
                    };
                  })}
                  filterOption={(inputValue, option) => {
                    const words = inputValue.toLowerCase().split(" ");
                    const fullText = `${option?.key} ${option?.searchText}`.toLowerCase();
                    return words.every((word) => fullText.includes(word));
                  }}
                  onChange={(value) => {
                    if (!value) {
                      setPacienteId(null);
                    }
                  }}
                ></AutoComplete>
              </Form.Item>
            </Col>

            <Col xxl={12} xl={12} md={12}>
              <label style={{ marginTop: "10px" }}>Nombres:</label>
              <Form.Item
                name="paciente"
                // initialValue={pacienteInput}
                rules={[{ required: true, message: "El paciente es requerido" }]}
              >
                <AutoComplete
                  allowClear
                  disabled={isEditMode}
                  showSearch
                  mode="combobox"
                  placeholder="Seleccionar paciente"
                  options={pacientes_options_agenda.map((paciente) => {
                    const fullName = `${paciente.nombres} ${paciente.apellidos}`;
                    const fullKey = `${paciente.nro_cedula}-${fullName}`;
                    return {
                      key: fullKey,
                      // value: paciente.nombres,
                      value: paciente.value,
                      label: `${paciente.nro_cedula} - ${fullName}`,
                      searchText: fullName.toLowerCase(),
                      id: paciente.value,
                    };
                  })}
                  filterOption={(inputValue, option) => {
                    const words = inputValue.toLowerCase().split(" ");
                    const fullText = `${option?.key} ${option?.searchText}`.toLowerCase();
                    return words.every((word) => fullText.includes(word));
                  }}
                  // onChange={(value) => {
                  //   setPacienteInput(value);
                  //   form.setFieldsValue({ paciente: value });
                  // }}
                  onSelect={(value, data) => {
                    const selected = pacientes_options_agenda.find(
                      (paciente) => paciente.value === data.id
                    );
                    form.setFieldsValue({ paciente: selected.nombres });
                    setPacienteId(selected.value);
                    setCreatePaciente(null);
                    setCreateCedula(null);
                    handlePacienteChange(data.id);
                  }}
                  onSearch={(text) => debouncedSetNombre(text)}
                  // onSearch={(text) => {
                  //   setCreatePaciente(text)
                  // }}
                  onDropdownVisibleChange={(open) => open && handlePacienteSelectOpen()}
                  notFoundContent={isLoading ? <Spin size="small" /> : null}
                ></AutoComplete>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col xxl={12} xl={12} md={12}>
              <label style={{ marginTop: "10px" }}>Apellidos:</label>
              <Form.Item
                name="apellidos"
                rules={[{ required: true, message: "El apellido es requerido" }]}
              >
                <AutoComplete
                  allowClear
                  showSearch
                  disabled={isEditMode}
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
                      id: paciente.value,
                    };
                  })}
                  filterOption={(inputValue, option) => {
                    const words = inputValue.toLowerCase().split(" ");
                    const fullText = `${option?.key} ${option?.searchText}`.toLowerCase();
                    return words.every((word) => fullText.includes(word));
                  }}
                  // onChange={(value) => {
                  //   setApellidos(value);
                  //   form.setFieldsValue({ apellidos: value });
                  // }}
                  onSearch={(val) => debouncedSetApellidos(val)}
                  onSelect={(value, data) => {
                    setCreateCedula(null);
                    handleApellidosChange(data.id);
                  }}
                  onDropdownVisibleChange={(open) => open && handlePacienteSelectOpen()}
                  notFoundContent={isLoading ? <Spin size="small" /> : null}
                ></AutoComplete>
              </Form.Item>
            </Col>
            <Col xxl={12} xl={12} md={12}>
              <label style={{ marginTop: "10px" }}>Celular:</label>
              <Form.Item
                name="celular"
                rules={[{ required: true, message: "El celular es requerido" }]}
              >
                <AutoComplete
                  allowClear
                  showSearch
                  disabled={isEditMode}
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
                      id: paciente.value,
                    };
                  })}
                  filterOption={(inputValue, option) => {
                    const words = inputValue.toLowerCase().split(" ");
                    const fullText = `${option?.key} ${option?.searchText}`.toLowerCase();
                    return words.every((word) => fullText.includes(word));
                  }}
                  // onChange={(value) => {
                  //   setCelular(value);
                  //   form.setFieldsValue({ celular: value });
                  // }}
                  onSearch={(val) => {
                    const valueWithPrefix = val.startsWith("+507") ? val : `+507${val}`;
                    form.setFieldsValue({ celular: valueWithPrefix });
                    debouncedSetCelular(valueWithPrefix);
                  }}
                  onSelect={(value, data) => {
                    setCreateCedula(null);
                    handleCelularChange(data.id);
                  }}
                  onDropdownVisibleChange={(open) => open && handlePacienteSelectOpen()}
                  notFoundContent={isLoading ? <Spin size="small" /> : null}
                ></AutoComplete>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xxl={12} xl={12} md={12}>
              <label style={{ marginTop: "10px" }}>Sucursal:</label>
              <Form.Item
                name="sucursal"
                rules={[{ required: true, message: "La sucursal es requerida" }]}
              >
                <Select
                  placeholder="Seleccionar sucursal"
                  onChange={(value) => {
                    handleSucursalChangeSelect(value);
                    setSelectedSucursal(value);

                    const sucursalSeleccionada = sucursales_option_selects.find(
                      (sucursal) => sucursal.value == value
                    );
                    setDireccion_sucursal(sucursalSeleccionada.ubicacion_mps);
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
              <label style={{ marginTop: "10px" }}>Doctor:</label>
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
          <label style={{ marginTop: "10px" }}>Comentarios de la agenda:</label>
          <Form.Item
            rules={[{ required: true, message: "El comentario es requerido" }]}
            name="comentarios"
          >
            <Input.TextArea placeholder="Descripción del Evento" />
          </Form.Item>

          <Row gutter={[16, 16]}>
            <Col xxl={24} xl={24} md={24}>
              <label style={{ marginTop: "10px" }}>Fecha y hora de la agenda:</label>
              <div style={{ display: "flex", gap: "10px" }}>
                {/* <Button type={rangeTimeEndDateSelected == 15 ? "primary" : "default"} onClick={()=> setTimeEndDate(15)}>15min</Button> */}
                <Button
                  type={rangeTimeEndDateSelected == 15 ? "primary" : "default"}
                  onClick={() => setTimeEndDate(15)}
                >
                  15min
                </Button>
                <Button
                  type={rangeTimeEndDateSelected == 30 ? "primary" : "default"}
                  onClick={() => setTimeEndDate(30)}
                >
                  30min
                </Button>
                <Button
                  type={rangeTimeEndDateSelected == 45 ? "primary" : "default"}
                  onClick={() => setTimeEndDate(45)}
                >
                  45min
                </Button>
                <Button
                  type={rangeTimeEndDateSelected == 60 ? "primary" : "default"}
                  onClick={() => setTimeEndDate(60)}
                >
                  1h
                </Button>
                {/* <Button type={!rangeTimeEndDateSelected ? "primary" : "default"} onClick={()=> setTimeEndDate(null)}>Otro</Button> */}
              </div>
            </Col>
            <Col xxl={12} xl={12} md={12}>
              <label style={{ marginTop: "5px" }}>Hora de inicio:</label>
              <Form.Item
                name="fechaAgenda"
                rules={[{ required: true, message: "La fecha y hora de inicio es requerida" }]}
              >
                <DatePicker
                  allowClear={false}
                  showTime={{ format: "HH:mm" }}
                  format="YYYY-MM-DD HH:mm"
                  style={{ marginBottom: "10px", width: "100%" }}
                  placeholder="Fecha y hora de inicio"
                />
              </Form.Item>
            </Col>
            <Col xxl={12} xl={12} md={12}>
              <label style={{ marginTop: "10px" }}>Hora de fin:</label>
              <Form.Item
                name="fechaAgendaFin"
                rules={[{ required: true, message: "La fecha y hora de fin es requerida" }]}
              >
                <DatePicker
                  allowClear={false}
                  disabled={!enableTimeEndDateForm}
                  showTime={{ format: "HH:mm" }}
                  format="YYYY-MM-DD HH:mm"
                  style={{ marginBottom: "10px", width: "100%", color: "#1677FF !important" }}
                  placeholder="Fecha y hora de fin"
                />
              </Form.Item>
            </Col>
          </Row>
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
              esProximaCita === false && {
                validator(_, value) {
                  if (value === "terapia" || value === "consulta") {
                    return Promise.resolve();
                  }
                  return Promise.reject("Debes seleccionar Terapias o Consultas");
                },
              },
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
                    width: "100%",
                    color: "transparent",
                    background: "white !important",
                  }}
                  onChange={handleSelectChangServicios}
                  options={servicios.map((servicio) => ({
                    value: servicio.id,
                    label: servicio.codigo + " | " + servicio.servicio,
                  }))}
                  filterOption={(input, option) => {
                    const searchTerms = input.toLowerCase().split(" ");
                    return searchTerms.every((term) =>
                      (option?.label ?? "").toLowerCase().includes(term)
                    );
                  }}
                />
              </Form.Item>

              <div
                style={{
                  display: "ruby",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                {proximosServicios.map((servicio) => {
                  return (
                    <div
                      style={{
                        color: "black",
                        background: "white",
                        border: "1px solid gray",
                        paddingTop: "5px",
                        paddingBottom: "5px",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        borderRadius: "20px",
                        display: "flex",
                        marginRight: "5px",
                        marginTop: "5px",
                      }}
                    >
                      {servicio.label}
                      <div
                        style={{
                          marginLeft: "5px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          const nuevosServicios = proximosServicios.filter(
                            (serv) => serv.value !== servicio.value
                          );

                          setProximosServicios(nuevosServicios);

                          form.setFieldsValue({
                            proximosServicios: nuevosServicios.map((s) => s.value),
                          });
                        }}
                      >
                        <CloseCircleTwoTone twoToneColor="#eb2f96" />
                      </div>
                    </div>
                  );
                })}
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
            <div style={{ position: "relative" }}>
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
                    <strong style={{ fontSize: "11px", color: "black" }}>
                      {dayjs(event.start).format("HH:mm")} - {event.title} - {event.celular}
                      {currentView === "timeGridDay" && event.comentarios && (
                        <span style={{ fontWeight: "normal", fontSize: "10px", color: "black" }}>
                          {" "}
                          ({event.comentarios})
                        </span>
                      )}
                    </strong>
                    <span
                      style={{ fontSize: "10px", opacity: 0.7, fontWeight: "bold", color: "black" }}
                    >
                      🧑‍⚕️ {event.doctor}
                    </span>
                    <span
                      style={{ fontSize: "10px", opacity: 0.7, fontWeight: "bold", color: "black" }}
                    >
                      🩺 {event.tipo}
                    </span>
                  </div>
                </List.Item>
              </div>

              <div style={{ position: "absolute", bottom: "22px", left: "115px" }}>
                <Tooltip title="Historia Clinica">
                  <Link to={"/historia-paciente/" + event.paciente_id}>
                    <ImageHistory />
                  </Link>
                </Tooltip>
              </div>

              <div style={{ position: "absolute", bottom: "0", left: "115px" }}>
                {/* <Checkbox
                  onChange={(i) => enviarConfirmacionCita({ event: event }, i.target.checked)}
                  checked={event.confirmado}
                /> */}
                <div onClick={() => enviarConfirmacionCita({ event: event }, "")}>
                  {
                    event.confirmado == "SIN STATUS" ? (
                      <Checkbox
                        checked={false}
                        ref={confirmacionRef}
                        style={{ position: "absolute", bottom: "2px" }}
                      />
                    ) : event.confirmado == "CONFIRMADO" ? (
                      <ImageCheck />
                    ) : event.confirmado == "CANCELADO" ? (
                      <ImageCancel />
                    ) : event.confirmado == "REAGENDADO" ? (
                      <ImageWatch />
                    ) : (
                      <div></div>
                    )

                    // <ImageCheck />
                    // <ImageCancel />
                  }
                </div>
              </div>
            </div>
          )}
        />
      </Modal>
    </div>
  );
};

export default VerAgenda;
