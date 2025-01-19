import React, { useEffect, useState } from 'react'
import CreateReceta from '../CreateOrden'
import { Button, Col, Input, Row, Select, Steps, Tooltip } from 'antd'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
  FileAddOutlined,
  ImportOutlined,
  CheckCircleOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import moment from 'moment';
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
import VerOrden from '../VerOrden';
import EditOrden from '../EditOrden';
import EditarCorrecionOrden from '../../correciones-ordenes/EditarCorrecionOrden';

const Ordenes = () => {

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    orden,
    pagadoFiltro,
    sucursalFiltro,
    laboratorioFiltro,
    faseFiltro,
    lenteContactoFiltro,
    statusFiltro,
    localStartDateFiltro,
    localEndDateFiltro
  } = location.state || {};

  console.log('pagadoFilter:',pagadoFiltro)

  const { tiposFasesOrdenes } = useSelector((state) => state.tiposFasesOrdenes)
  const nuevaData = useSelector((state) => state.fasesOrdenes.nuevaData);
  const { orderId } = useParams();
  const [nivelStep, setNivelStep] = useState(0)
  const currentTipoFase = tiposFasesOrdenes[nivelStep] || {};
  const [initialized, setInitialized] = useState(false);
  const [fechaSolicitud, setFechaSolicitud] = useState(orden?.created_at);
  const [mensaje, setMensaje] = useState(
    'Buenas Tardes, le escribimos de {sucursal} para informarle que los lentes de el Paciente {nombre} están listo. Puede pasar a retirarlos en los siguientes horarios:  Lunes a Viernes de 9:00 am a 5:00 pm.  sábados de 8:00 am a 12:00 pm. La esperamos,Saludos'
  );
  const [celular, setCelular] = useState('');
  const [selectedPaciente, setSelectedPaciente] = useState(orden?.id_paciente);
  const { pacientes } = useSelector((state) => state.pacientes);
  const [selectedSucursal, setSelectedSucursal] = useState(orden?.sucursal?.nombre);
  const [ubicacionMaps, setUbicacionMaps] = useState(orden?.sucursal?.ubicacion_maps);
  const [nombrePaciente, setNombrePaciente] = useState('');
  const idUsuario = localStorage.getItem('id_usuario');

  const retroceder = () => {
    navigate(`/ordenes`);  // Aquí defines la URL y pasas pagadoFilter
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
    dispatch(setPagadoFilter(pagadoFiltro))
    dispatch(setLaboratorioFilter(laboratorioFiltro))
    dispatch(setTipoLenteFilter(lenteContactoFiltro))
    dispatch(setFaseFilter(faseFiltro))
    dispatch(setSucursalFilter(sucursalFiltro))
    dispatch(setStatusFilter(statusFiltro))
    dispatch(setFechaInicioFilter(localStartDateFiltro))
    dispatch(setFechaFinFilter(localEndDateFiltro))
  })

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
  }, [nuevaData, orderId]);

  const recibirDatosFase = (data) => {
    setFaseData(data);
  };

  useEffect(() => {
    if (orderId) {
      dispatch(fecthTiposFasesOrdenes(orderId));
    }
  }, [])

  useEffect(() => {
    if (tiposFasesOrdenes.length > 0 && orderId && !initialized) {
      const lastCompletedStep = tiposFasesOrdenes.reduce((lastStep, tipoFase, index) => {
        const hasCompleted = tipoFase.fases_ordenes.some(
          (faseOrden) =>
            faseOrden.ordenes_id === parseInt(orderId) &&
            faseOrden.tipo_fase_orden_id === tipoFase.id &&
            faseOrden.status === 1
        );

        const hasPending = tipoFase.fases_ordenes.some(
          (faseOrden) =>
            faseOrden.ordenes_id === parseInt(orderId) &&
            faseOrden.tipo_fase_orden_id === tipoFase.id &&
            faseOrden.status === 0
        );

        if (hasCompleted) {
          return index;
        } else if (hasPending) {
          return lastStep;
        }

        return lastStep;
      }, -1);

      setNivelStep(lastCompletedStep + 1);
      setInitialized(true);

    }
  }, [tiposFasesOrdenes, orderId, initialized]);

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
    const result = await Swal.fire({
      title: completar ? '¿Estás seguro de completar la fase?' : '¿Estás seguro de guardar la fase?',
      text: completar ? "¡Confirmarás la fase como completada!" : "¡Confirmarás los cambios en los datos!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ' + (completar ? 'completar' : 'guardar'),
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
      dispatch(fecthTiposFasesOrdenes(orderId));

      await Swal.fire(completar ? 'Completado!' : 'Guardado!',
        completar ? 'La fase ha sido completada.' : 'La fase ha sido guardada.',
        'success');
    }
  };

  const handleContactarPaciente = async () => {
    const newContactoOrdenData = {
      ordenes_id: orden?.id_orden,
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
            {nivelStep === 4 && (
              <>
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
                  <br />
                  <Link
                    to={`/crear-correciones-ordenes`}
                    className="btn btn-warning btnEditarReceta"
                    state={{ orden }}
                    data-target="#modalEditarSucursal"
                    data-toggle="modal"
                    id_receta="185"
                    style={{
                      display: 'inline-block',
                      marginTop: '10px',
                      padding: '10px 20px',
                      backgroundColor: '#ffc107',
                      color: '#000',
                      borderRadius: '5px',
                      textDecoration: 'none',
                    }}
                  >
                    Corregir orden
                  </Link>
                </div>
              </>
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
                  <Nuevo
                    tipoFaseId={currentTipoFase.id}
                    lab={nuevaData.laboratorio}

                  />

                ) : nivelStep == 1 ? (
                  <EnConfeccion
                    tipoFaseId={currentTipoFase.id}
                    lab={nuevaData.laboratorio}
                    fecha={nuevaData.fecha_fase}
                  />
                ) : nivelStep == 2 ? (
                  <Listo
                    tipoFaseId={currentTipoFase.id}
                    lab={nuevaData.laboratorio}
                  />
                ) : nivelStep == 3 ? (
                  <Retirado
                    tipoFaseId={currentTipoFase.id}
                    lab={nuevaData.laboratorio}
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

                <Button onClick={() => avanzarFase(false, false)} type='default'>
                  Guardar Fase
                </Button>
                <Button onClick={() => avanzarFase(false, true)} type='primary'>
                  Completar Fase
                </Button>
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
      <EditOrden fecha_solicitud={fechaSolicitud} />



    </div>
  )
}

export default Ordenes