import React, { useEffect, useState } from 'react'
import { Button, Col, Input, Row, Select, Steps, Tooltip } from 'antd'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
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
  const { tiposFasesOrdenes } = useSelector((state) => state.tiposFasesOrdenes)
  const nuevaDataCorrecciones = useSelector((state) => state.correccionesFasesOrdenes.nuevaDataCorrecciones);
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

  useEffect(() => {
    if (correcionOrden) {
      setNombrePaciente(correcionOrden?.paciente_nombre_completo)
      setUbicacionMaps(correcionOrden?.sucursal_ubicacion)
      setFechaSolicitud(correcionOrden?.created_at)
    }
  }, [correcionOrden])


  useEffect(() => {
    dispatch(fetchUsuarios({}))
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
    if (tiposFasesOrdenes.length > 0 && correccionOrderId && !initialized) {
      const lastPhase = tiposFasesOrdenes
        .flatMap(tipoFase => tipoFase.fases_correcciones_ordenes)
        .filter(faseOrden => faseOrden.correccion_ordenes_id === parseInt(correccionOrderId))
        .reduce((maxFase, currentFase) =>
          currentFase.tipo_fase_correccion_orden_id > maxFase.tipo_fase_correccion_orden_id ? currentFase : maxFase,
          { tipo_fase_correccion_orden_id: 0, status: 0 }
        );

      console.log('Última fase creada:', lastPhase);

      let newStep = 0;

      if (lastPhase.tipo_fase_correccion_orden_id === 1) {
        newStep = lastPhase.status === 1 ? 1 : 0;
      } else if (lastPhase.tipo_fase_correccion_orden_id === 2) {
        newStep = lastPhase.status === 1 ? 2 : 1;
      } else if (lastPhase.tipo_fase_correccion_orden_id === 3) {
        newStep = 2;
      } else if (lastPhase.tipo_fase_correccion_orden_id === 4) {
        newStep = 3;
      }

      console.log('Nuevo step:', newStep);
      setNivelStep(newStep);
      setInitialized(true);
    }
  }, [tiposFasesOrdenes, correccionOrderId])

  useEffect(() => {
    setInitialized(false);
  }, [correccionOrderId]);

  const retroceder = () => {
    navigate(`/ordenes`);
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

  const itemsSteps = tiposFasesOrdenes?.map((fase) => {
    let icon;
    switch (fase.tipo_fase_orden.toLowerCase()) {
      case 'nuevo':
        icon = <FileAddOutlined />;
        break;
      case 'en confeccion':
        icon = <ImportOutlined />;
        break;
      case 'listo':
        icon = <CheckCircleOutlined />;
        break;
      case 'retirado':
        icon = <LogoutOutlined />;
        break;
      default:
        icon = <FileAddOutlined />;
    }
    return {
      title: fase.tipo_fase_orden,
      icon: icon,
    };
  });

  const avanzarFase = async (avanzar = true, completar = false) => {
    if (nuevaDataCorrecciones.tipo_fase_correccion_orden_id === 1 && !nuevaDataCorrecciones.laboratorio) {
      await Swal.fire({
        title: 'Error',
        text: 'Debe seleccionar un laboratorio antes de continuar.',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    if (completar && nivelStep === 2) {
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

        await dispatch(updateOrden({ id_orden: correcionOrden.orden_id, data: pagado }));

        await Swal.fire(
          'Actualizado!',
          'El estado de pago ha sido actualizado correctamente.',
          'success'
        );
      }
    }

    const result = await Swal.fire({
      title: completar ? 'Estás seguro de completar la fase?' : 'Estás seguro de guardar la fase?',
      text: completar ? "Confirmarás la fase como completada!" : "Confirmarás los cambios en los datos!",
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
      };

      if (completar || avanzar) {
        setNivelStep(nivelStep + 1);
      }

      dispatch(createCorreccionesFasesOrdenes(nuevaDataConOrderId));

      if (completar && nivelStep === 2) {
        const siguienteFase = {
          ...nuevaDataConOrderId,
          status: 1,
          observacion: '',
          tipo_fase_correccion_orden_id: nuevaDataCorrecciones.tipo_fase_correccion_orden_id + 1,
        };

        dispatch(createCorreccionesFasesOrdenes(siguienteFase));
      }
      dispatch(fecthTiposFasesOrdenes(correccionOrderId));
      dispatch(fetchCorreccionOrden(correccionOrderId));

      await Swal.fire(completar ? 'Completado!' : 'Guardado!',
        completar ? 'La fase ha sido completada.' : 'La fase ha sido guardada.',
        'success');
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

  return (
    <div>

      <Row>
        <Tooltip title="Retroceder a tabla de órdenes">
          <Button
            onClick={retroceder}
            icon={<ArrowLeftOutlined />}
            style={{ display: 'flex', alignItems: 'center', marginLeft: '10px', }}
          >
          </Button>
        </Tooltip>
        <Col xxl={24} xl={24} md={24}>

          <div
            style={{
              background: 'white',
              marginLeft: '10px',
              marginRight: '10px',
              padding: '10px',
              borderRadius: '5px'
            }}
          >
            <Steps
              items={itemsSteps}
              current={nivelStep}
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
                Se completó todas las fases
              </div>
            )}
            <div
              style={{
                background: 'white',
                marginLeft: '10px',
                marginRight: '10px',
                // marginTop: '20px',
                padding: '15px',
                borderRadius: '5px'
              }}
            >

              {
                nivelStep == 0 ? (
                  <CorreccionNuevo
                    tipoFaseId={currentTipoFase.id}
                    lab={nuevaDataCorrecciones.laboratorio}
                    correcionOrden={correcionOrden}

                  />

                ) : nivelStep == 1 ? (
                  <CorreccionEnConfeccion
                    tipoFaseId={currentTipoFase.id}
                    lab={nuevaDataCorrecciones.laboratorio}
                    fecha={nuevaDataCorrecciones.fecha_fase}
                    correcionOrden={correcionOrden}
                  />
                ) : nivelStep == 2 ? (
                  <CorreccionListo
                    tipoFaseId={currentTipoFase.id}
                    lab={nuevaDataCorrecciones.laboratorio}
                    correcionOrden={correcionOrden}
                  />
                ) : nivelStep == 3 ? (
                  <CorreccionRetirado
                    tipoFaseId={currentTipoFase.id}
                    lab={nuevaDataCorrecciones.laboratorio}
                    correcionOrden={correcionOrden}
                  />
                ) : <div></div>
              }

              <Row
                gutter={[16, 16]}
              >
                {nivelStep > 0 && (
                  <Button
                    disabled={nivelStep <= 0}
                    onClick={() => {
                      if (nivelStep > 0) {
                        setNivelStep(nivelStep - 1);
                      }
                    }}
                  >
                    Anterior
                  </Button>
                )}

                {nivelStep < 3 ? (
                  <>
                    <Button onClick={() => avanzarFase(false, false)} type="default">
                      Guardar Fase
                    </Button>
                    <Button onClick={() => avanzarFase(false, true)} type="primary">
                      Completar Fase
                    </Button>
                  </>
                ) : nivelStep === 3 ? (
                  <Button onClick={() => avanzarFase(false, true)} type="primary">
                    Completar Fase
                  </Button>
                ) : null}
                {nivelStep === 4 && (
                  <Button
                    onClick={handleContactarPaciente}
                  >
                    Contactar al paciente
                  </Button>
                )}
              </Row>
            </div>

          </div>

        </Col>
      </Row>
      <EditarCorrecionOrden
        correcionOrden={correcionOrden}
        fecha_solicitud={fechaSolicitud}
      />
    </div>
  )
}

export default CorrecionOrden