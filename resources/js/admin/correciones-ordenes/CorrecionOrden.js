import React, { useEffect, useState } from 'react'
import { Button, Col, Input, Row, Select, Steps, Tooltip } from 'antd'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, CarOutlined } from '@ant-design/icons';
import {
  FileAddOutlined,
  ImportOutlined,
  CheckCircleOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useParams, useLocation } from 'react-router-dom';
import { fecthTiposFasesOrdenes } from '../../redux/features/ordenes/tiposFasesOrdenesSlice';
import { createCorreccionesFasesOrdenes } from '../../redux/features/correciones-ordenes/correccionesFasesOrdenesSlice';
import CorreccionNuevo from './fases/CorreccionNuevo';
import CorreccionEnConfeccion from './fases/CorreccionEnConfeccion';
import CorreccionListo from './fases/CorreccionListo';
import CorreccionRetirado from './fases/CorreccionRetirado';
import { setChangeOrden, setFaseCorreccionFilter, setFaseFilter, setFechaInicioFilter, setLaboratorioCorreccionFilter, setLaboratorioFilter, setLenteContactoCorreccionFilter, setPagadoCorreccionFilter, setPagadoFilter, setStatusCorreccionFilter, setStatusFilter, setSucursalCorreccionFilter, setSucursalFilter, setTipoLenteFilter } from '../../redux/features/ordenes/fasesOrdenesSlice';
import EditarCorrecionOrden from './EditarCorrecionOrden';
import { fetchCorreccionOrden } from '../../redux/features/correciones-ordenes/correcionesOrdenesSlice';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice';
import { funPermisosObtenidosBoolean } from '../../utils/ValidarPermisos';
import { updateOrden } from '../../redux/features/ordenes/ordenesSlice';
import { fetchUsuarios } from '../../redux/features/usuarios/usuariosSlice';
import { clearCorreccionesObservaciones, createCorreccionesObservacionOrden, deleteCorreccionesObservacionOrden, fetchCorreccionesObservacionesOrden, updateCorreccionesObservacionOrden } from '../../redux/features/correccionesOrdenesObservaciones/correccionesOrdenesObservaciones';
import CorreccionEnviado from './fases/CorreccionEnviado';
import CorreccionObservacionesHistorial from './observaciones/CorreccionObservacioneshistorial';

const CorrecionOrden = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    pagadoFiltro,
    sucursalFiltro,
    laboratorioFiltro,
    faseFiltro,
    lenteContactoFiltro,
    statusFiltro,
    localStartDateFiltro,
    localEndDateFiltro,
    correctionsFiltroFase,
    correctionsFiltroLaboratorio,
    correctionsFiltroSucursal,
    correctionsFiltroStatus,
    correctionsFiltroPagado,
    correctionsFiltroLenteContacto,
    isCorrections
  } = location.state || {};
  const { usuario } = useSelector((state) => state.auth);
  const { tiposFasesOrdenes } = useSelector((state) => state.tiposFasesOrdenes)
  const nuevaDataCorrecciones = useSelector((state) => state.correccionesFasesOrdenes.nuevaDataCorrecciones);
  const usuarios = useSelector((state) => state.usuarios.usuarios);
  const { correcionOrden } = useSelector((state) => state.correcionesordenes);
  const { correccionOrderId } = useParams();
  const [nivelStep, setNivelStep] = useState(0)
  const currentTipoFase = tiposFasesOrdenes[nivelStep] || {};
  const [initialized, setInitialized] = useState(false);
  const [fechaSolicitud, setFechaSolicitud] = useState('');
  const [mensaje, setMensaje] = useState(
    'Buenas Tardes, le escribimos de {sucursal} para informarle que los lentes de el Paciente {nombre} estan listo. Puede pasar a retirarlos en los siguientes horarios:  Lunes a Viernes de 9:00 am a 5:00 pm. sabados de 8:00 am a 12:00 pm. La esperamos, Saludos'
  );
  const [ubicacionMaps, setUbicacionMaps] = useState('');
  const [nombrePaciente, setNombrePaciente] = useState('');
  const idUsuario = localStorage.getItem('id_usuario');
  const { permisos } = useSelector((state) => state.auth);
  const [basesValidas, setBasesValidas] = useState(true);
  const [textoNuevoObs, setTextoNuevoObs] = useState("");
  const [mostrarObs, setMostrarObs] = useState(false);
  const [guardandoObs, setGuardandoObs] = useState(false);
  const [editandoObs, setEditandoObs] = useState(null);
  const {
    correccionesObservaciones,
    statusFetch: statusObservaciones
  } = useSelector((state) => state.correccionesOrdenObservaciones);
  useEffect(() => {
    if (correcionOrden) {
      setNombrePaciente(correcionOrden?.paciente_nombre_completo)
      setUbicacionMaps(correcionOrden?.sucursal_ubicacion)
      setFechaSolicitud(correcionOrden?.created_at)
    }
  }, [correcionOrden])


  useEffect(() => {
    dispatch(fetchUsuarios({}))
    dispatch(fetchPacientes({ page: 1, limit: 50000 }));
  }, [])


  useEffect(() => {
    dispatch(fetchCorreccionOrden(correccionOrderId))
  }, [correccionOrderId])

  useEffect(() => {
  }, [nuevaDataCorrecciones, correccionOrderId]);

  useEffect(() => {
    if (pagadoFiltro !== undefined) {
      dispatch(setPagadoFilter(pagadoFiltro))
    }
    if (laboratorioFiltro !== undefined) {
      dispatch(setLaboratorioFilter(laboratorioFiltro))
    }
    if (lenteContactoFiltro !== undefined) {
      dispatch(setTipoLenteFilter(lenteContactoFiltro))
    }
    if (faseFiltro !== undefined) {
      dispatch(setFaseFilter(faseFiltro))
    }
    if (sucursalFiltro !== undefined) {
      dispatch(setSucursalFilter(sucursalFiltro))
    }
    if (statusFiltro !== undefined) {
      dispatch(setStatusFilter(statusFiltro))
    }
    if (localStartDateFiltro !== undefined) {
      dispatch(setFechaInicioFilter(localStartDateFiltro))
    }
    if (localEndDateFiltro !== undefined) {
      dispatch(setFechaInicioFilter(localEndDateFiltro))
    }
    if (correctionsFiltroFase !== undefined) {
      dispatch(setFaseCorreccionFilter(correctionsFiltroFase));
    }
    if (correctionsFiltroLaboratorio !== undefined) {
      dispatch(setLaboratorioCorreccionFilter(correctionsFiltroLaboratorio));
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
      dispatch(setLenteContactoCorreccionFilter(correctionsFiltroLenteContacto));
    }
    if (isCorrections !== false) {
      dispatch(setChangeOrden(isCorrections));
    }
  })

  useEffect(() => {
    if (correccionOrderId) {
      dispatch(fecthTiposFasesOrdenes(correccionOrderId));
    }
  }, [])

  useEffect(() => {
    if (correccionOrderId) {
      dispatch(fetchCorreccionesObservacionesOrden(correccionOrderId));
    }
    return () => dispatch(clearCorreccionesObservaciones());
  }, [correccionOrderId]);

  useEffect(() => {
    if (tiposFasesOrdenes.length > 0 && correccionOrderId && !initialized) {
      const lastPhase = tiposFasesOrdenes
        .flatMap(tipoFase => tipoFase.fases_correcciones_ordenes)
        .filter(faseOrden => faseOrden.correccion_ordenes_id === parseInt(correccionOrderId))
        .reduce((maxFase, currentFase) =>
          currentFase.tipo_fase_correccion_orden_id > maxFase.tipo_fase_correccion_orden_id ? currentFase : maxFase,
          { tipo_fase_correccion_orden_id: 0, status: 0 }
        );
      let newStep = 0;

      if (lastPhase.tipo_fase_correccion_orden_id === 1) {
        newStep = lastPhase.status === 1 ? 1 : 0;
      }
      else if (lastPhase.tipo_fase_correccion_orden_id === 2) {
        newStep = lastPhase.status === 1 ? 2 : 1;
      }
      else if (lastPhase.tipo_fase_correccion_orden_id === 3) {
        newStep = lastPhase.status === 1 ? 3 : 2;
      }
      else if (lastPhase.tipo_fase_correccion_orden_id === 4) {
        newStep = lastPhase.status === 1 ? 4 : 3;
      }
      else if (lastPhase.tipo_fase_correccion_orden_id === 5) {
        newStep = 4;
      }

      setNivelStep(newStep);
      setInitialized(true);
    }
  }, [tiposFasesOrdenes, correccionOrderId])

  useEffect(() => {
    setInitialized(false);
  }, [correccionOrderId]);

  const retroceder = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/ordenes");
    }
  };

  const generateWhatsAppLink = () => {
    const telefonoFormateado = `${celular.replace(/[^\d]/g, '')}`;
    let mensajePersonalizado = mensaje
      .replace('{nombre}', nombrePaciente)
      .replace('{sucursal}', selectedSucursal);

    if (ubicacionMaps) {
      mensajePersonalizado += `\n📍 Ubicación: ${ubicacionMaps}`;
    }
    const mensajeCodificado = encodeURIComponent(mensajePersonalizado);


    return `https://wa.me/${telefonoFormateado}?text=${mensajeCodificado}`;
  };

  const getOrderPhasesByType = (correccionOrderId) => {
    return tiposFasesOrdenes.map((tipoFase) => ({
      tipoFase: tipoFase.tipo_fase_orden,
      fasesOrdenes: tipoFase.fases_correcciones_ordenes
        .filter(
          (faseOrden) => faseOrden.correccion_ordenes_id === parseInt(correccionOrderId)
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

  const itemsSteps = getOrderPhasesByType(correccionOrderId).map((fase, index) => {
    let iconBase;
    switch (fase.tipoFase.toLowerCase()) {
      case 'nuevo':
        iconBase = <FileAddOutlined />;
        break;
      case "enviado":
        iconBase = <CarOutlined />;
        break;
      case 'en confeccion':
        iconBase = <ImportOutlined />;
        break;
      case 'listo':
        iconBase = <CheckCircleOutlined />;
        break;
      case 'retirado':
        iconBase = <LogoutOutlined />;
        break;
      default:
        iconBase = <FileAddOutlined />;
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
    if (nuevaDataCorrecciones.tipo_fase_correccion_orden_id === 2 && !nuevaDataCorrecciones.laboratorio) {
      await Swal.fire({
        title: 'Error',
        text: 'Debe seleccionar un laboratorio antes de continuar.',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    if (completar && nivelStep === 3) {
      if (!funPermisosObtenidosBoolean(permisos, "ordenes.correcion.fase.retirado")) {
        await Swal.fire({
          title: 'Acceso denegado',
          text: 'No tiene permisos suficientes para completar esta fase.',
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
        return;
      }

      if (correcionOrden?.pagado === "2") {
        const { value: nuevoEstado } = await Swal.fire({
          title: 'Actualizar estado de pago',
          text: 'El estado actual es "Abonado". Debe cambiarlo antes de continuar.',
          icon: 'warning',
          input: 'radio',
          inputOptions: {
            0: 'Cortesia',
            1: 'Pagado'
          },
          inputValidator: (value) => {
            if (!value) {
              return 'Debe seleccionar una opción antes de continuar';
            }
          },
          showCancelButton: true,
          confirmButtonText: 'Actualizar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33'
        });

        if (!nuevoEstado) {
          return;
        }

        const pagado = {
          pagado: nuevoEstado
        }

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
          await dispatch(updateOrden({ id_orden: correcionOrden.orden_id, data: pagado })).unwrap();;
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
      title: completar ? 'Estas seguro de completar la fase?' : 'Estás seguro de guardar la fase?',
      text: completar ? "Confirmaras la fase como completada!" : "Confirmarás los cambios en los datos!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, ' + (completar ? 'completar' : 'guardar'),
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      const status = completar ? 1 : 0;

      const nuevaDataConOrderId = {
        ...nuevaDataCorrecciones,
        correccion_ordenes_id: correccionOrderId,
        status: status,
        elaborado_por: usuario?.usuario?.id_usuario,
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

        if (completar || avanzar) {
          setNivelStep(nivelStep + 1);
        }
        await dispatch(createCorreccionesFasesOrdenes(nuevaDataConOrderId)).unwrap();;

        if (completar && nivelStep === 3) {
          const siguienteFase = {
            ...nuevaDataConOrderId,
            status: 1,
            observacion: '',
            tipo_fase_correccion_orden_id: nuevaDataCorrecciones.tipo_fase_correccion_orden_id + 1,
          };
          console.log('siguienteFase', siguienteFase)
          dispatch(createCorreccionesFasesOrdenes(siguienteFase));
        }
        dispatch(fecthTiposFasesOrdenes(correccionOrderId));
        dispatch(fetchCorreccionOrden(correccionOrderId));

        Swal.close();
        await Swal.fire(
          completar ? "Completado!" : "Guardado!",
          completar
            ? "La fase ha sido completada."
            : "La fase ha sido guardada.",
          "success"
        );
      } catch (error) {
        console.error(error);
        Swal.close();
        await Swal.fire(
          "Error",
          "Ocurrió un problema al guardar la fase.",
          "error"
        );
      }
    }
  };

  const handleContactarPaciente = async () => {
    const newContactoOrdenData = {
      correccion_ordenes_id: correcionOrden?.correccion_id,
      tipo_fase_cr_orden_id: 4,
      usuario_id: idUsuario,
      cantidad: 1
    };

    try {
      await dispatch(createContactoCorreccionOrden(newContactoOrdenData)).unwrap();
      console.log('Contacto creado exitosamente');

      window.open(generateWhatsAppLink(), '_blank');
    } catch (error) {
      console.error('Error al crear contacto:', error);
    }
  };

  const handleBasesValidasChange = (validas) => {
    setBasesValidas(validas);
  };


  const handleStepChange = async (clickedStep) => {
    console.log('clickedStep', clickedStep);

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

    if (clickedStep === nivelStep + 1) {

      if (nivelStep === 2 && !basesValidas) {
        await Swal.fire({
          title: "Bases inválidas",
          text: "No puedes avanzar mientras las bases no sean válidas.",
          icon: "warning",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#3085d6",
        });

        return;
      }

      console.log('enasasdasddas');

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
          updateCorreccionesObservacionOrden({
            correccionOrderId: parseInt(correccionOrderId),
            id: editandoObs.id,
            observacion: textoNuevoObs.trim(),
            elaborado_por: parseInt(idUsuario),
          })
        ).unwrap();
        setEditandoObs(null);
      } else {
        await dispatch(
          createCorreccionesObservacionOrden({
            correccionOrderId: parseInt(correccionOrderId),
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
      title: "¿Eliminar observacion?",
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
      await dispatch(deleteCorreccionesObservacionOrden({ correccionOrderId: parseInt(correccionOrderId), id })).unwrap();
    } catch {
      Swal.fire("Error", "No se pudo eliminar la observacion.", "error");
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
          >
          </Button>
        </Tooltip>
        <Col xxl={24} xl={24} md={24}>
          <div
            style={{
              background: 'white',
              marginLeft: '10px',
              marginRight: '10px',
              padding: "10px",
              borderRadius: '5px'
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
            {nivelStep === 4 && (
              <div
                style={{
                  background: '#e6ffed',
                  border: '1px solid #b7eb8f',
                  color: '#389e0d',
                  padding: '15px',
                  margin: '10px',
                  borderRadius: '5px',
                  textAlign: 'center',
                }}
              >
                Se completo todas las fases
              </div>
            )}
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
              {
                nivelStep == 0 ? (
                  <CorreccionNuevo
                    tipoFaseId={currentTipoFase.id}
                    lab={nuevaDataCorrecciones.laboratorio}
                    correcionOrden={correcionOrden}
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
                  <CorreccionEnviado
                    tipoFaseId={currentTipoFase.id}
                    lab={nuevaDataCorrecciones.laboratorio}
                    fecha={nuevaDataCorrecciones.fecha_fase}
                    correcionOrden={correcionOrden}
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
                ) : nivelStep == 2 ? (
                  <CorreccionEnConfeccion
                    tipoFaseId={currentTipoFase.id}
                    lab={nuevaDataCorrecciones.laboratorio}
                    fecha={nuevaDataCorrecciones.fecha_fase}
                    correcionOrden={correcionOrden}
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
                  <CorreccionListo
                    tipoFaseId={currentTipoFase.id}
                    lab={nuevaDataCorrecciones.laboratorio}
                    correcionOrden={correcionOrden}
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
                  <CorreccionRetirado
                    tipoFaseId={currentTipoFase.id}
                    lab={nuevaDataCorrecciones.laboratorio}
                    correcionOrden={correcionOrden}
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
                ) : <div></div>
              }
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
          <CorreccionObservacionesHistorial
            correccion_ordenes_id={parseInt(correccionOrderId)}
            usuariosData={usuarios}
            idUsuarioActual={parseInt(idUsuario)}
            loading={statusObservaciones === "loading"}
            editandoId={editandoObs?.id ?? null}
            onEditarClick={handleEditarObsClick}
            onEliminarClick={handleEliminarObs}
          />
        </div>
      </Row>
      <EditarCorrecionOrden
        correcionOrden={correcionOrden}
        fecha_solicitud={fechaSolicitud}
      />
    </div>
  )
}

export default CorrecionOrden
