import React, { useEffect, useState } from 'react'
import { Button, Col, Input, Row, Select, Steps, Tooltip } from 'antd'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
import Swal from 'sweetalert2';
import { useParams, useLocation } from 'react-router-dom';
import { fecthTiposFasesOrdenes } from '../../redux/features/ordenes/tiposFasesOrdenesSlice';
import EditarCorrecionOrden from './EditarCorrecionOrden';
import { createCorreccionesFasesOrdenes } from '../../redux/features/correciones-ordenes/correccionesFasesOrdenesSlice';
import CorreccionNuevo from './fases/CorreccionNuevo';
import CorreccionEnConfeccion from './fases/CorreccionEnConfeccion';
import CorreccionListo from './fases/CorreccionListo';
import CorreccionRetirado from './fases/CorreccionRetirado';
import { setFaseFilter, setFechaInicioFilter, setLaboratorioFilter, setPagadoFilter, setStatusFilter, setSucursalFilter, setTipoLenteFilter } from '../../redux/features/ordenes/fasesOrdenesSlice';

const CorrecionOrden = () => {

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();  
  const { 
    correcion,
    pagadoFiltro,
    sucursalFiltro,
    laboratorioFiltro,
    faseFiltro,
    lenteContactoFiltro,
    statusFiltro,
    localStartDateFiltro,
    localEndDateFiltro
  } = location.state || {};
  const { tiposFasesOrdenes } = useSelector((state) => state.tiposFasesOrdenes)
  const nuevaDataCorrecciones = useSelector((state) => state.correccionesFasesOrdenes.nuevaDataCorrecciones);
  const { correccionOrderId } = useParams();
  const [nivelStep, setNivelStep] = useState(0)
  const currentTipoFase = tiposFasesOrdenes[nivelStep] || {};
  const [initialized, setInitialized] = useState(false);
  const [fechaSolicitud, setFechaSolicitud] = useState(correcion?.created_at);
  const [mensaje, setMensaje] = useState(
    'Buenas Tardes, le escribimos de {sucursal} para informarle que los lentes de el Paciente {nombre} están listo. Puede pasar a retirarlos en los siguientes horarios:  Lunes a Viernes de 9:00 am a 5:00 pm.  sábados de 8:00 am a 12:00 pm. La esperamos,Saludos'
  );
  const [ubicacionMaps, setUbicacionMaps] = useState(correcion?.sucursal);
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
  }, [nuevaDataCorrecciones, correccionOrderId]);

  useEffect(() =>{
      dispatch(setPagadoFilter(pagadoFiltro))
      dispatch(setLaboratorioFilter(laboratorioFiltro))
      dispatch(setTipoLenteFilter(lenteContactoFiltro))
      dispatch(setFaseFilter(faseFiltro))
      dispatch(setSucursalFilter(sucursalFiltro))
      dispatch(setStatusFilter(statusFiltro))
      dispatch(setFechaInicioFilter(localStartDateFiltro))
      dispatch(setFechaInicioFilter(localEndDateFiltro))
  })

 

  useEffect(() => {
    if (correccionOrderId) {
      dispatch(fecthTiposFasesOrdenes(correccionOrderId));
    }
  }, [])

  useEffect(() => {
    if (tiposFasesOrdenes.length > 0 && correccionOrderId && !initialized) {
      const lastCompletedStep = tiposFasesOrdenes.reduce((lastStep, tipoFase, index) => {
        const hasCompleted = tipoFase.fases_correcciones_ordenes.some(
          (faseOrden) =>
            faseOrden.correccion_ordenes_id === parseInt(correccionOrderId) &&
            faseOrden.tipo_fase_correccion_orden_id === tipoFase.id &&
            faseOrden.status === 1
        );

        const hasPending = tipoFase.fases_correcciones_ordenes.some(
          (faseOrden) =>
            faseOrden.correccion_ordenes_id === parseInt(correccionOrderId) &&
            faseOrden.tipo_fase_correccion_orden_id === tipoFase.id &&
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
  }, [tiposFasesOrdenes, correccionOrderId, initialized]);

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
        ...nuevaDataCorrecciones,
        correccion_ordenes_id: correccionOrderId,
        status: status,
      };

      if (completar || avanzar) {
        setNivelStep(nivelStep + 1);
      }

      dispatch(createCorreccionesFasesOrdenes(nuevaDataConOrderId));
      dispatch(fecthTiposFasesOrdenes(correccionOrderId));

      await Swal.fire(completar ? 'Completado!' : 'Guardado!',
        completar ? 'La fase ha sido completada.' : 'La fase ha sido guardada.',
        'success');
    }
  };

  const handleContactarPaciente = async () => {
    const newContactoOrdenData = {
      correccion_ordenes_id: correcion?.id,
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
                style={{ display: 'flex', alignItems: 'center' ,marginLeft: '10px',}}
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

                  />

                ) : nivelStep == 1 ? (
                  <CorreccionEnConfeccion
                    tipoFaseId={currentTipoFase.id}
                    lab={nuevaDataCorrecciones.laboratorio}
                    fecha={nuevaDataCorrecciones.fecha_fase}
                  />
                ) : nivelStep == 2 ? (
                  <CorreccionListo
                    tipoFaseId={currentTipoFase.id}
                    lab={nuevaDataCorrecciones.laboratorio}
                  />
                ) : nivelStep == 3 ? (
                  <CorreccionRetirado
                    tipoFaseId={currentTipoFase.id}
                    lab={nuevaDataCorrecciones.laboratorio}
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
      <EditarCorrecionOrden fecha_solicitud={fechaSolicitud} />



    </div>
  )
}

export default CorrecionOrden