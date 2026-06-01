import React, { useEffect, useState } from "react";
import CreateReceta from "../CreateOrden";
import { Button, Col, Input, Row, Select, Steps, Tooltip } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, CarOutlined, CloseOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import {
  FileAddOutlined,
  ImportOutlined,
  CheckCircleOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import EnConfeccion from "./fases/EnConfeccion";
import Nuevo from "./fases/Nuevo";
import Listo from "./fases/Listo";
import Retirado from "./fases/Retirado";
import Swal from "sweetalert2";
import { useParams, useLocation } from "react-router-dom";
import { fecthTiposFasesOrdenes } from "../../../redux/features/ordenes/tiposFasesOrdenesSlice";
import {
  createFasesOrdenes,
  setChangeOrden,
  setendDateLabo,
  setFaseCorreccionFilter,
  setFaseFilter,
  setfaseFilterLabo,
  setFechaFinFilter,
  setFechaInicioFilter,
  setLaboratorioCorreccionFilter,
  setLaboratorioFilter,
  setlaboratorioFilterLabo,
  setLenteContactoCorreccionFilter,
  setlenteContactoFilterLabo,
  setPagadoCorreccionFilter,
  setPagadoFilter,
  setProveedor,
  setproveedorFilterLabo,
  setstartDateLabo,
  setStatusCorreccionFilter,
  setStatusFilter,
  setstatusFilterLabo,
  setSucursalCorreccionFilter,
  setSucursalFilter,
  setsucursalFilterLabo,
  setTipoLenteFilter,
} from "../../../redux/features/ordenes/fasesOrdenesSlice";
import { createContactoOrden } from "../../../redux/features/contacto-orden/ContactoOrdenSlice";
import { fetchPacientes } from "../../../redux/features/pacientes/pacientesSlice";
import EditOrden from "../EditOrden";
import { fetchUsuarios } from "../../../redux/features/usuarios/usuariosSlice";
import {
  fetchOrdenDelPaciente,
  updateOrden,
} from "../../../redux/features/ordenes/ordenesSlice";
import { funPermisosObtenidosBoolean } from "../../../utils/ValidarPermisos";
import { clearObservaciones, createObservacionOrden, deleteObservacionOrden, fetchObservacionesOrden, updateObservacionOrden } from "../../../redux/features/ordenesObservaciones/ordenObservacionesSlice";
import ObservacionesHistorial from "./observaciones/Observacioneshistorial";
import Enviado from "./fases/Enviado";
import { useRef } from "react";

const Ordenes = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { tiposFasesOrdenes } = useSelector(
    (state) => state.tiposFasesOrdenes
  );
  const enviadoRef = useRef(null);
  const {
    observaciones,
    statusFetch: statusObservaciones
  } = useSelector((state) => state.ordenObservaciones);
  const nuevaData = useSelector((state) => state.fasesOrdenes.nuevaData);
  const { orderId, nroOrden, idPaciente } = useParams();
  const [nivelStep, setNivelStep] = useState(0);
  const currentTipoFase = tiposFasesOrdenes[nivelStep] || {};
  const usuarios = useSelector((state) => state.usuarios.usuarios);
  const status_usuarios = useSelector((state) => state.usuarios.status_usuarios);
  const [initialized, setInitialized] = useState(false);
  const [fechaSolicitud, setFechaSolicitud] = useState("");
  const [mensaje, setMensaje] = useState(
    "Buenas Tardes, le escribimos de {sucursal} para informarle que los lentes de el Paciente {nombre} estan listo. Puede pasar a retirarlos en los siguientes horarios:  Lunes a Viernes de 9:00 am a 5:00 pm. sabados de 8:00 am a 12:00 pm. La esperamos, Saludos"
  );
  const [celular, setCelular] = useState("");
  const [selectedPaciente, setSelectedPaciente] = useState("");
  const { pacientes, status } = useSelector((state) => state.pacientes);
  const [selectedSucursal, setSelectedSucursal] = useState("");
  const [ubicacionMaps, setUbicacionMaps] = useState();
  const [nombrePaciente, setNombrePaciente] = useState("");
  const idUsuario = localStorage.getItem("id_usuario");
  const { pacienteOrden, statusPacienteOrden } = useSelector((state) => state.ordenes);
  const [basesValidas, setBasesValidas] = useState(true);
  const [textoNuevoObs, setTextoNuevoObs] = useState("");
  const [mostrarObs, setMostrarObs] = useState(false);
  const [guardandoObs, setGuardandoObs] = useState(false);
  const [editandoObs, setEditandoObs] = useState(null);
  const { permisos } = useSelector((state) => state.auth);
  const {
    pagadoFiltro,
    sucursalFiltro,
    laboratorioFiltro,
    faseFiltro,
    lenteContactoFiltro,
    statusFiltro,
    localStartDateFiltro,
    localEndDateFiltro,
    isCorrections,
    correctionsFiltroFase,
    correctionsFiltroLaboratorio,
    correctionsFiltroSucursal,
    correctionsFiltroStatus,
    correctionsFiltroPagado,
    correctionsFiltroLenteContacto,
    laboratorioFilterLabo,
    sucursalFilterLabo,
    lenteContactoFilterLabo,
    statusFilterLabo,
    faseFilterLabo,
    proveedorFilterLabo,
    startDateLabo,
    endDateLabo,

  } = location.state || {};

  useEffect(() => {
    if (pacienteOrden) {
      setSelectedPaciente(pacienteOrden?.id_paciente);
      setSelectedSucursal(pacienteOrden?.sucursal_nombre);
      setUbicacionMaps(pacienteOrden?.sucursal_ubicacion);
      setFechaSolicitud(pacienteOrden?.created_at);
    }
  }, [pacienteOrden]);

  useEffect(() => {
    if (idPaciente && nroOrden) {
      dispatch(
        fetchOrdenDelPaciente({
          id_paciente: idPaciente,
          nro_orden_id: nroOrden,
        })
      );
    }
  }, [idPaciente, nroOrden, dispatch]);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchObservacionesOrden(orderId));
    }
    return () => dispatch(clearObservaciones());
  }, [orderId]);

  const retroceder = () => {
    navigate(-1);
  };

  const generateWhatsAppLink = () => {
    const telefonoFormateado = `${celular.replace(/[^\d]/g, "")}`;
    let mensajePersonalizado = mensaje
      .replace("{nombre}", nombrePaciente)
      .replace("{sucursal}", selectedSucursal);

    if (ubicacionMaps) {
      mensajePersonalizado += `\n📍 Ubicación: ${ubicacionMaps}`;
    }
    const mensajeCodificado = encodeURIComponent(mensajePersonalizado);

    return `https://wa.me/${telefonoFormateado}?text=${mensajeCodificado}`;
  };

  useEffect(() => {
    if (pagadoFiltro !== undefined) {
      dispatch(setPagadoFilter(pagadoFiltro));
    }
    if (sucursalFiltro !== undefined) {
      dispatch(setSucursalFilter(sucursalFiltro));
    }
    if (laboratorioFiltro !== undefined) {
      dispatch(setLaboratorioFilter(laboratorioFiltro));
    }
    if (faseFiltro !== undefined) {
      dispatch(setFaseFilter(faseFiltro));
    }
    if (lenteContactoFiltro !== undefined) {
      dispatch(setTipoLenteFilter(lenteContactoFiltro));
    }
    if (statusFiltro !== undefined) {
      dispatch(setStatusFilter(statusFiltro));
    }
    if (localStartDateFiltro !== undefined) {
      dispatch(setFechaInicioFilter(localStartDateFiltro));
    }
    if (localEndDateFiltro !== undefined) {
      dispatch(setFechaFinFilter(localEndDateFiltro));
    }
    if (correctionsFiltroFase !== undefined) {
      dispatch(setFaseCorreccionFilter(correctionsFiltroFase));
    }
    if (correctionsFiltroLaboratorio !== undefined) {
      dispatch(
        setLaboratorioCorreccionFilter(correctionsFiltroLaboratorio)
      );
    }
    if (correctionsFiltroSucursal !== undefined) {
      dispatch(setSucursalCorreccionFilter(correctionsFiltroSucursal));
    }
    if (correctionsFiltroStatus !== undefined) {
      dispatch(setStatusCorreccionFilter(correctionsFiltroStatus));
    }
    if (correctionsFiltroPagado !== undefined) {
      dispatch(setPagadoCorreccionFilter(correctionsFiltroPagado));
    }
    if (correctionsFiltroLenteContacto !== undefined) {
      dispatch(
        setLenteContactoCorreccionFilter(correctionsFiltroLenteContacto)
      );
    }
    if (isCorrections !== false) {
      dispatch(setChangeOrden(isCorrections));
    }
    if (laboratorioFilterLabo !== false) {
      dispatch(setlaboratorioFilterLabo(laboratorioFilterLabo));
    }
    if (sucursalFilterLabo !== false) {
      dispatch(setsucursalFilterLabo(sucursalFilterLabo));
    }
    if (lenteContactoFilterLabo !== false) {
      dispatch(setlenteContactoFilterLabo(lenteContactoFilterLabo));
    }
    if (statusFilterLabo !== false) {
      dispatch(setstatusFilterLabo(statusFilterLabo));
    }
    if (faseFilterLabo !== false) {
      dispatch(setfaseFilterLabo(faseFilterLabo));
    }
    if (proveedorFilterLabo !== false) {
      dispatch(setproveedorFilterLabo(proveedorFilterLabo));
    }
    if (startDateLabo !== false) {
      dispatch(setstartDateLabo(startDateLabo));
    }
    if (endDateLabo !== false) {
      dispatch(setendDateLabo(endDateLabo));
    }
  }, []);

  useEffect(() => {
    if (selectedPaciente) {
      const pacienteSeleccionado = pacientes.find(
        (paciente) => paciente.id_paciente === selectedPaciente
      );
      if (pacienteSeleccionado) {
        setCelular(pacienteSeleccionado?.celular || "");
        setNombrePaciente(pacienteSeleccionado?.nombres || "");
      } else {
        setCelular("");
      }
    } else {
      setCelular("");
    }
  }, [selectedPaciente, pacientes]);

  useEffect(() => {
    if (status === "idle" || pacientes.length < 11) {
      dispatch(fetchPacientes({ page: 1, limit: 50000 }));
    }
  }, []);

  useEffect(() => {
    if (status_usuarios === "idle" || usuarios.length === 0) {
      dispatch(fetchUsuarios({}));
    }
  }, []);

  useEffect(() => { }, [nuevaData, orderId]);

  const recibirDatosFase = (data) => {
    setFaseData(data);
  };

  useEffect(() => {
    if (orderId) {
      dispatch(fecthTiposFasesOrdenes(orderId));
    }
  }, [orderId]);

  const getOrderPhasesByType = (orderId) => {
    return tiposFasesOrdenes.map((tipoFase) => ({
      tipoFase: tipoFase.tipo_fase_orden,
      fasesOrdenes: tipoFase.fases_ordenes
        .filter(
          (faseOrden) => faseOrden.ordenes_id === parseInt(orderId)
        )
        .map((faseOrden) => ({
          ...faseOrden,
          nombreUsuario:
            usuarios.find(
              (user) =>
                user.id_usuario === faseOrden.elaborado_por
            )?.nombre || "Desconocido",
        })),
    }));
  };

  useEffect(() => {
    if (tiposFasesOrdenes.length > 0 && orderId && !initialized) {
      const lastPhase = tiposFasesOrdenes
        .flatMap((tipoFase) => tipoFase.fases_ordenes)
        .filter(
          (faseOrden) => faseOrden.ordenes_id === parseInt(orderId)
        )
        .reduce(
          (maxFase, currentFase) =>
            currentFase.tipo_fase_orden_id >
              maxFase.tipo_fase_orden_id
              ? currentFase
              : maxFase,
          { tipo_fase_orden_id: 0, status: 0 }
        );

      let newStep = 0;

      if (lastPhase.tipo_fase_orden_id === 1) {
        newStep = lastPhase.status === 1 ? 1 : 0;
      }
      else if (lastPhase.tipo_fase_orden_id === 2) {
        newStep = lastPhase.status === 1 ? 2 : 1;
      }
      else if (lastPhase.tipo_fase_orden_id === 3) {
        newStep = lastPhase.status === 1 ? 3 : 2;
      }
      else if (lastPhase.tipo_fase_orden_id === 4) {
        newStep = lastPhase.status === 1 ? 4 : 3;
      }
      else if (lastPhase.tipo_fase_orden_id === 5) {
        newStep = 4;
      }
      setNivelStep(newStep);
      setInitialized(true);
    }
  }, [tiposFasesOrdenes, orderId]);

  useEffect(() => {
    setInitialized(false);
  }, [orderId]);

  const itemsSteps = getOrderPhasesByType(orderId).map((fase, index) => {
    let iconBase;
    const isCompletedOrActive = index <= nivelStep;
    switch (fase.tipoFase.toLowerCase()) {
      case "nuevo": iconBase = <FileAddOutlined />; break;
      case "enviado": iconBase = <CarOutlined />; break;
      case 'en confección':
        iconBase = (
          <>
            <style>{`
        .icon-confeccion-container {
          display: inline-flex; 
          align-items: center;
          justify-content: center;
          width: 54px;
          height: 54px;
          overflow: hidden;
          vertical-align: middle;
          margin-top: -6px; 
        }

        .icon-confeccion-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .fase-activa {
          transform: translateX(-60px);
          filter: drop-shadow(60px 0 0 #1575fc);
        }

        .fase-desactivada {
          transform: translateX(-60px);
          filter: drop-shadow(60px 0 0 #8c8c8c);
        }

        .icon-confeccion-container:hover .icon-confeccion-img {
          transform: translateX(-60px);
          filter: drop-shadow(60px 0 0 #1575fc) brightness(1.1);
        }
      `}</style>

            <span className="icon-confeccion-container">
              <img
                src="/assets/img/confeccion.png"
                alt="En Confección"
                className={`icon-confeccion-img ${isCompletedOrActive ? 'fase-activa' : 'fase-desactivada'}`}
              />
            </span>
          </>
        );
        break;
      case "listo": iconBase = <CheckCircleOutlined />; break;
      case "retirado": iconBase = <LogoutOutlined />; break;
      default: iconBase = <FileAddOutlined />;
    }

    const nombresUsuarios = fase.fasesOrdenes
      .map((faseOrden) => faseOrden.nombreUsuario)
      .join(", ");

    const fechaFase = fase.fasesOrdenes
      .map((faseOrden) => faseOrden.created_at.split(" ")[0])
      .join(", ");

    const icon = index === nivelStep ? (
      <Tooltip title="Click para Guardar Fase">
        <span
          onClick={(e) => {
            e.stopPropagation();
            avanzarFase(false, false);
          }}
          style={{ cursor: "pointer" }}
        >
          {iconBase}
        </span>
      </Tooltip>
    ) : iconBase;

    return {
      title: (
        <Tooltip
          title={
            index === nivelStep
              ? "Click para Guardar Fase"
              : index === nivelStep + 1
                ? "Click para Completar Fase"
                : index < nivelStep
                  ? "Click para volver a esta fase"
                  : "Debes completar la fase actual primero"
          }
        >
          {fase.tipoFase}
        </Tooltip>
      ),
      description: (
        <>
          <div>{nombresUsuarios || "Desconocido"}</div>
          <div style={{ fontSize: "12px", color: "#888" }}>
            {fechaFase || ""}
          </div>
        </>
      ),
      icon,
    };
  });

  const avanzarFase = async (avanzar = true, completar = false) => {
    if (nuevaData.tipo_fase_orden_id === 2 && !nuevaData.laboratorio) {
      await Swal.fire({
        title: "Error",
        text: "Debe seleccionar un laboratorio antes de continuar.",
        icon: "error",
        confirmButtonText: "Entendido",
      });
      return;
    }

    if (completar && nivelStep === 3) {
      if (
        !funPermisosObtenidosBoolean(permisos, "ordenes.fase.retirado")
      ) {
        await Swal.fire({
          title: "Acceso denegado",
          text: "No tiene permisos suficientes para completar esta fase.",
          icon: "error",
          confirmButtonText: "Entendido",
        });
        return;
      }

      if (pacienteOrden?.pagado === "2") {
        const { value: nuevoEstado } = await Swal.fire({
          title: "Actualizar estado de pago",
          text: 'El estado actual es "Abonado". Debe cambiarlo antes de continuar.',
          icon: "warning",
          input: "radio",
          inputOptions: {
            0: "Cortesia",
            1: "Pagado",
          },
          inputValidator: (value) => {
            if (!value) {
              return "Debe seleccionar una opción antes de continuar";
            }
          },
          showCancelButton: true,
          confirmButtonText: "Actualizar",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
        });

        if (!nuevoEstado) {
          return;
        }

        const pagado = {
          pagado: nuevoEstado,
        };

        Swal.fire({
          title: "Actualizando...",
          html: "Por favor espere",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        try {
          await dispatch(
            updateOrden({
              id_orden: pacienteOrden.id_orden,
              data: pagado,
            })
          ).unwrap();

          await Swal.fire(
            "Actualizado!",
            "El estado de pago ha sido actualizado correctamente.",
            "success"
          );
        } catch (error) {
          await Swal.fire(
            "Error",
            "Ocurrió un error al actualizar.",
            "error"
          );
          return;
        }
      }
    }

    const result = await Swal.fire({
      title: completar
        ? "Estas seguro de completar la fase?"
        : "Estas seguro de guardar la fase?",
      text: completar
        ? "Confirmaras la fase como completada!"
        : "Confirmaras los cambios en los datos!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, " + (completar ? "completar" : "guardar"),
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      if (nuevaData.tipo_fase_orden_id === 2 && enviadoRef.current?.guardarLaboratorioAlAvanzar) {
        try {
          const confirmoLaboratorio = await enviadoRef.current.guardarLaboratorioAlAvanzar();
          if (!confirmoLaboratorio) return;

        } catch (err) {
          console.error("Error al procesar el laboratorio:", err);
          await Swal.fire(
            "Error",
            "Ocurrió un problema al guardar los datos del laboratorio.",
            "error"
          );
          return;
        }
      }
      const status = completar ? 1 : 0;

      const nuevaDataConOrderId = {
        ...nuevaData,
        ordenes_id: orderId,
        status: status,
      };

      try {
        Swal.fire({
          title: "Cargando...",
          text: "Por favor espere",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await dispatch(
          createFasesOrdenes(nuevaDataConOrderId)
        ).unwrap();

        if (completar && nivelStep === 3) {
          const siguienteFase = {
            ...nuevaDataConOrderId,
            status: 1,
            observacion: "",
            tipo_fase_orden_id: nuevaData.tipo_fase_orden_id + 1,
          };

          await dispatch(createFasesOrdenes(siguienteFase)).unwrap();
        }

        await Promise.all([
          dispatch(fecthTiposFasesOrdenes(orderId)).unwrap(),
        ]);

        if (completar || avanzar) {
          setNivelStep(nivelStep + 1);
        }
        Swal.close();
        await Swal.fire(
          completar ? "Completado!" : "Guardado!",
          completar ? "La fase ha sido completada." : "La fase ha sido guardada.",
          "success"
        );
      } catch (error) {
        console.error(error);
        Swal.close();
        await Swal.fire(
          "Error",
          error || "Ocurrió un problema al guardar la fase.",
          "error"
        );
      }
    }
  };

  const handleContactarPaciente = async () => {
    const newContactoOrdenData = {
      ordenes_id: pacienteOrden?.id_orden,
      tipo_fase_orden_id: 4,
      usuario_id: idUsuario,
      cantidad: 1,
    };

    try {
      await dispatch(createContactoOrden(newContactoOrdenData)).unwrap();
      console.log("Contacto creado exitosamente");

      window.open(generateWhatsAppLink(), "_blank");
    } catch (error) {
      console.error("Error al crear contacto:", error);
    }
  };

  const handleBasesValidasChange = (validas) => {
    console.log('validas', validas)
    setBasesValidas(validas);
  };

  const handleStepChange = async (clickedStep) => {
    if (Math.abs(clickedStep - nivelStep) > 1) {
      await Swal.fire({
        title: "Acción no permitida",
        text: "Solo puedes avanzar o retroceder un paso a la vez.",
        icon: "warning",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#3085d6",
      });

      return;
    }

    if (clickedStep < nivelStep) {
      setNivelStep(clickedStep);
      return;
    }

    if (clickedStep === nivelStep) {
      await avanzarFase(false, false);
      return;
    }

    if (clickedStep === nivelStep + 1 && basesValidas) {
      await avanzarFase(false, true);
      return;
    }
  };

  const handleGuardarObservacion = async () => {
    if (!textoNuevoObs.trim()) return;
    setGuardandoObs(true);
    try {
      if (editandoObs) {
        await dispatch(
          updateObservacionOrden({
            ordenes_id: parseInt(orderId),
            id: editandoObs.id,
            observacion: textoNuevoObs.trim(),
            elaborado_por: parseInt(idUsuario),
          })
        ).unwrap();
        setEditandoObs(null);
      } else {
        await dispatch(
          createObservacionOrden({
            ordenes_id: parseInt(orderId),
            observacion: textoNuevoObs.trim(),
            elaborado_por: parseInt(idUsuario),
          })
        ).unwrap();
      }
      setTextoNuevoObs("");
    } finally {
      setGuardandoObs(false);
    }
  };

  const handleEditarObsClick = ({ id, observacion }) => {
    setEditandoObs({ id, observacion });
    setTextoNuevoObs(observacion);
  };

  const handleEliminarObs = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar observación?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await dispatch(deleteObservacionOrden({ ordenes_id: parseInt(orderId), id })).unwrap();
    } catch {
      Swal.fire("Error", "No se pudo eliminar la observación.", "error");
    }
  };

  return (
    <div>
      <Row>
        <Tooltip title="Retroceder a tabla de órdenes">
          <Button
            onClick={retroceder}
            icon={<ArrowLeftOutlined />}
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "10px",
            }}
          ></Button>
        </Tooltip>
        <Col xxl={24} xl={24} md={24}>
          <div
            style={{
              background: "white",
              marginLeft: "10px",
              marginRight: "10px",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <Steps
              items={itemsSteps.map((item, index) => ({
                ...item,
                title: (
                  <Tooltip
                    title={
                      index === nivelStep
                        ? "Click para Guardar Fase"
                        : index === nivelStep + 1
                          ? "Click para Completar Fase"
                          : index < nivelStep
                            ? "Click para volver a esta fase"
                            : "Debes completar la fase actual primero"
                    }
                  >
                    {item.title}
                  </Tooltip>
                ),
              }))}
              current={nivelStep}
              onChange={handleStepChange}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div>

            <div
              style={{
                background: 'white',
                marginLeft: '10px',
                marginRight: '10px',
                // marginTop: '20px',
                padding: '15px',
                borderRadius: '5px',
              }}
            >
              {nivelStep == 0 ? (
                <Nuevo
                  pacientesData={pacientes}
                  tipoFaseId={currentTipoFase.id}
                  lab={nuevaData.laboratorio}
                  pacienteOrden={pacienteOrden}
                  textoObs={textoNuevoObs}
                  setTextoObs={setTextoNuevoObs}
                  onGuardarObs={handleGuardarObservacion}
                  guardandoObs={guardandoObs}
                  modoEdicion={!!editandoObs}
                  onCancelarEdicion={() => {
                    setEditandoObs(null);
                    setTextoNuevoObs("");
                  }}
                />
              ) : nivelStep == 1 ? (
                <Enviado
                  ref={enviadoRef}
                  pacientesData={pacientes}
                  tipoFaseId={currentTipoFase.id}
                  lab={nuevaData.laboratorio}
                  pacienteOrden={pacienteOrden}
                  textoObs={textoNuevoObs}
                  setTextoObs={setTextoNuevoObs}
                  onGuardarObs={handleGuardarObservacion}
                  guardandoObs={guardandoObs}
                  modoEdicion={!!editandoObs}
                  onCancelarEdicion={() => {
                    setEditandoObs(null);
                    setTextoNuevoObs("");
                  }}
                />
              ) : nivelStep == 2 ? (
                <EnConfeccion
                  tipoFaseId={currentTipoFase.id}
                  lab={nuevaData.laboratorio}
                  fecha={nuevaData.fecha_fase}
                  pacientesData={pacientes}
                  pacienteOrden={pacienteOrden}
                  onBasesValidasChange={handleBasesValidasChange}
                  textoObs={textoNuevoObs}
                  setTextoObs={setTextoNuevoObs}
                  onGuardarObs={handleGuardarObservacion}
                  guardandoObs={guardandoObs}
                  modoEdicion={!!editandoObs}
                  onCancelarEdicion={() => {
                    setEditandoObs(null);
                    setTextoNuevoObs("");
                  }}
                />
              ) : nivelStep == 3 ? (
                <Listo
                  tipoFaseId={currentTipoFase.id}
                  lab={nuevaData.laboratorio}
                  pacientesData={pacientes}
                  pacienteOrden={pacienteOrden}
                  textoObs={textoNuevoObs}
                  setTextoObs={setTextoNuevoObs}
                  onGuardarObs={handleGuardarObservacion}
                  guardandoObs={guardandoObs}
                  modoEdicion={!!editandoObs}
                  onCancelarEdicion={() => {
                    setEditandoObs(null);
                    setTextoNuevoObs("");
                  }}
                />
              ) : nivelStep == 4 ? (
                <Retirado
                  tipoFaseId={currentTipoFase.id}
                  lab={nuevaData.laboratorio}
                  pacientesData={pacientes}
                  pacienteOrden={pacienteOrden}
                  textoObs={textoNuevoObs}
                  setTextoObs={setTextoNuevoObs}
                  onGuardarObs={handleGuardarObservacion}
                  guardandoObs={guardandoObs}
                  modoEdicion={!!editandoObs}
                  onCancelarEdicion={() => {
                    setEditandoObs(null);
                    setTextoNuevoObs("");
                  }}
                />
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </Col>
        <div style={{
          background: "white",
          marginLeft: "10px",
          marginRight: "40px",
          marginTop: "10px",
          padding: "15px",
          borderRadius: "5px",
          width: "100%",
        }}>
          <ObservacionesHistorial
            ordenes_id={parseInt(orderId)}
            usuariosData={usuarios}
            idUsuarioActual={parseInt(idUsuario)}
            loading={statusObservaciones === "loading"}
            editandoId={editandoObs?.id ?? null}
            onEditarClick={handleEditarObsClick}
            onEliminarClick={handleEliminarObs}
          />
        </div>
      </Row>
      <EditOrden
        pacienteOrden={pacienteOrden}
        fecha_solicitud={fechaSolicitud}
        pacientesData={pacientes}
        usuariosData={usuarios}
        status={status}
        statusPacienteOrden={statusPacienteOrden}
      />
    </div>
  )
}

export default Ordenes