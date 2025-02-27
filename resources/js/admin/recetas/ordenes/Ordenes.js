import React, { useEffect, useState } from 'react'
import CreateReceta from '../CreateOrden'
import { Button, Col, Input, Row, Select, Steps, Tooltip } from 'antd'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  FileAddOutlined,
  ImportOutlined,
  CheckCircleOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import EnConfeccion from './fases/EnConfeccion';
import Nuevo from './fases/Nuevo';
import Listo from './fases/Listo';
import Retirado from './fases/Retirado';
import Swal from 'sweetalert2';
import { useParams, useLocation } from 'react-router-dom';
import { fecthTiposFasesOrdenes } from '../../../redux/features/ordenes/tiposFasesOrdenesSlice';
import { createFasesOrdenes, setFaseFilter, setFechaFinFilter, setFechaInicioFilter, setLaboratorioFilter, setPagadoFilter, setStatusFilter, setSucursalFilter, setTipoLenteFilter } from '../../../redux/features/ordenes/fasesOrdenesSlice';
import { createContactoOrden } from '../../../redux/features/contacto-orden/ContactoOrdenSlice';
import { fetchPacientes } from '../../../redux/features/pacientes/pacientesSlice';
import EditOrden from '../EditOrden';
import { fetchUsuarios } from '../../../redux/features/usuarios/usuariosSlice';
import { fetchOrdenDelPaciente, updateOrden } from '../../../redux/features/ordenes/ordenesSlice';
import { funPermisosObtenidosBoolean } from '../../../utils/ValidarPermisos';

const Ordenes = () => {

  const dispatch = useDispatch();

  const location = useLocation();
  const navigate = useNavigate();
  const { tiposFasesOrdenes } = useSelector((state) => state.tiposFasesOrdenes)
  const nuevaData = useSelector((state) => state.fasesOrdenes.nuevaData);
  const { orderId, nroOrden, idPaciente } = useParams();
  const [nivelStep, setNivelStep] = useState(0)
  const currentTipoFase = tiposFasesOrdenes[nivelStep] || {};
  const usuarios = useSelector((state) => state.usuarios.usuarios);
  const [initialized, setInitialized] = useState(false);
  const [fechaSolicitud, setFechaSolicitud] = useState('');
  const [mensaje, setMensaje] = useState(
    'Buenas Tardes, le escribimos de {sucursal} para informarle que los lentes de el Paciente {nombre} estan listo. Puede pasar a retirarlos en los siguientes horarios:  Lunes a Viernes de 9:00 am a 5:00 pm. sabados de 8:00 am a 12:00 pm. La esperamos, Saludos'
  );
  const [celular, setCelular] = useState('');
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const { pacientes } = useSelector((state) => state.pacientes);
  const [selectedSucursal, setSelectedSucursal] = useState('');
  const [ubicacionMaps, setUbicacionMaps] = useState();
  const [nombrePaciente, setNombrePaciente] = useState('');
  const idUsuario = localStorage.getItem('id_usuario');
  const { pacienteOrden } = useSelector((state) => state.ordenes);

  const { permisos } = useSelector((state) => state.auth);

  const {
    pagadoFiltro,
    sucursalFiltro,
    laboratorioFiltro,
    faseFiltro,
    lenteContactoFiltro,
    statusFiltro,
    localStartDateFiltro,
    localEndDateFiltro
  } = location.state || {};


  useEffect(() => {
    if (pacienteOrden) {
      setSelectedPaciente(pacienteOrden?.id_paciente)
      setSelectedSucursal(pacienteOrden?.sucursal_nombre)
      setUbicacionMaps(pacienteOrden?.sucursal_ubicacion)
      setFechaSolicitud(pacienteOrden?.created_at)
    }
  }, [pacienteOrden])

  useEffect(() => {
    if (idPaciente && nroOrden) {
      dispatch(fetchOrdenDelPaciente({ id_paciente: idPaciente, nro_orden_id: nroOrden }));
    }
  }, [idPaciente, nroOrden, dispatch]);

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
  },);

  useEffect(() => {
    if (selectedPaciente) {
      const pacienteSeleccionado = pacientes.find(
        (paciente) => paciente.id_paciente === selectedPaciente
      );
      if (pacienteSeleccionado) {
        setCelular(pacienteSeleccionado?.celular || '');
        setNombrePaciente(pacienteSeleccionado?.nombres || '');
      } else {
        setCelular('');

      }
    } else {
      setCelular('');
    }
  }, [selectedPaciente, pacientes]);

  useEffect(() => {
    dispatch(fetchPacientes({ page: 1, limit: 50000 }));
  }, []);

  useEffect(() => {
    dispatch(fetchUsuarios({}))
  }, [])


  useEffect(() => {
  }, [nuevaData, orderId]);

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
        .filter((faseOrden) => faseOrden.ordenes_id === parseInt(orderId))
        .map((faseOrden) => ({
          ...faseOrden,
          nombreUsuario: usuarios.find((user) => user.id_usuario === faseOrden.elaborado_por)?.nombre || 'Desconocido'
        })),
    }));
  };

  useEffect(() => {
    if (tiposFasesOrdenes.length > 0 && orderId && !initialized) {
      const lastPhase = tiposFasesOrdenes
        .flatMap(tipoFase => tipoFase.fases_ordenes)
        .filter(faseOrden => faseOrden.ordenes_id === parseInt(orderId))
        .reduce((maxFase, currentFase) =>
          currentFase.tipo_fase_orden_id > maxFase.tipo_fase_orden_id ? currentFase : maxFase,
          { tipo_fase_orden_id: 0, status: 0 }
        );

      console.log('Última fase creada:', lastPhase);

      let newStep = 0;

      if (lastPhase.tipo_fase_orden_id === 1) {
        newStep = lastPhase.status === 1 ? 1 : 0;
      } else if (lastPhase.tipo_fase_orden_id === 2) {
        newStep = lastPhase.status === 1 ? 2 : 1;
      } else if (lastPhase.tipo_fase_orden_id === 3) {
        newStep = 2;
      } else if (lastPhase.tipo_fase_orden_id === 4) {
        newStep = 3;
      }

      console.log('Nuevo step:', newStep);
      setNivelStep(newStep);
      setInitialized(true);
    }
  }, [tiposFasesOrdenes, orderId])


  useEffect(() => {
    setInitialized(false);
  }, [orderId]);

  const itemsSteps = getOrderPhasesByType(orderId).map((fase) => {
    let icon;
    switch (fase.tipoFase.toLowerCase()) {
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

    const nombresUsuarios = fase.fasesOrdenes
      .map((faseOrden) => faseOrden.nombreUsuario)
      .join(', ');

    const fechaFase = fase.fasesOrdenes
      .map((faseOrden) => faseOrden.created_at.split(' ')[0])
      .join(', ');

    return {
      title: fase.tipoFase,
      description: (
        <>
          <div>{nombresUsuarios || 'Desconocido'}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>{fechaFase || ''}</div>
        </>
      ),
      icon: icon,
    };
  });

  const avanzarFase = async (avanzar = true, completar = false) => {
    if (nuevaData.tipo_fase_orden_id === 1 && !nuevaData.laboratorio) {
      await Swal.fire({
        title: 'Error',
        text: 'Debe seleccionar un laboratorio antes de continuar.',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    if (completar && nivelStep === 2) {
      if (!funPermisosObtenidosBoolean(permisos, "ordenes.fase.retirado")) {
        await Swal.fire({
          title: 'Acceso denegado',
          text: 'No tiene permisos suficientes para completar esta fase.',
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
        return;
      }

      if (pacienteOrden?.pagado === "2") {
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

        await dispatch(updateOrden({ id_orden: pacienteOrden.id_orden, data: pagado }));

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
        ...nuevaData,
        ordenes_id: orderId,
        status: status,
      };

      if (completar || avanzar) {
        setNivelStep(nivelStep + 1);
      }

      dispatch(createFasesOrdenes(nuevaDataConOrderId));

      if (completar && nivelStep === 2) {
        const siguienteFase = {
          ...nuevaDataConOrderId,
          status: 1,
          observacion: '',
          tipo_fase_orden_id: nuevaData.tipo_fase_orden_id + 1,
        };

        dispatch(createFasesOrdenes(siguienteFase));
      }

      dispatch(fecthTiposFasesOrdenes(orderId));
      dispatch(fetchOrdenDelPaciente({ id_paciente: idPaciente, nro_orden_id: nroOrden }));

      await Swal.fire(
        completar ? 'Completado!' : 'Guardado!',
        completar ? 'La fase ha sido completada.' : 'La fase ha sido guardada.',
        'success'
      );
    }
  };


  const handleContactarPaciente = async () => {
    const newContactoOrdenData = {
      ordenes_id: pacienteOrden?.id_orden,
      tipo_fase_orden_id: 4,
      usuario_id: idUsuario,
      cantidad: 1
    };

    try {
      await dispatch(createContactoOrden(newContactoOrdenData)).unwrap();
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
                  <Nuevo
                    pacientesData={pacientes}
                    tipoFaseId={currentTipoFase.id}
                    lab={nuevaData.laboratorio}
                    pacienteOrden={pacienteOrden}

                  />

                ) : nivelStep == 1 ? (
                  <EnConfeccion
                    tipoFaseId={currentTipoFase.id}
                    lab={nuevaData.laboratorio}
                    fecha={nuevaData.fecha_fase}
                    pacientesData={pacientes}
                    pacienteOrden={pacienteOrden}
                  />
                ) : nivelStep == 2 ? (
                  <Listo
                    tipoFaseId={currentTipoFase.id}
                    lab={nuevaData.laboratorio}
                    pacientesData={pacientes}
                    pacienteOrden={pacienteOrden}
                  />
                ) : nivelStep == 3 ? (
                  <Retirado
                    tipoFaseId={currentTipoFase.id}
                    lab={nuevaData.laboratorio}
                    pacientesData={pacientes}
                    pacienteOrden={pacienteOrden}
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
                  <>
                    <Button
                      onClick={handleContactarPaciente}
                    >
                      Contactar al paciente
                    </Button>

                  </>
                )}
              </Row>
            </div>
          </div>
        </Col>
      </Row>
      <EditOrden
        pacienteOrden={pacienteOrden}
        fecha_solicitud={fechaSolicitud}
        pacientesData={pacientes}
        usuariosData={usuarios}
      />
    </div>
  )
}

export default Ordenes