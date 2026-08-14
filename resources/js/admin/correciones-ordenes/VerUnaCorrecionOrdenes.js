import React, { useEffect, useState } from 'react'
import { Button, Col, Row, Steps, Modal, Table, Tooltip } from 'antd'
import { useSelector, useDispatch } from 'react-redux';
import {
  FileAddOutlined,
  ImportOutlined,
  CheckCircleOutlined,
  LogoutOutlined,
  CarOutlined,
} from '@ant-design/icons';

import { useParams, useLocation } from 'react-router-dom';
import { fecthTiposFasesOrdenes } from '../../redux/features/ordenes/tiposFasesOrdenesSlice';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice';
import CorreccionNuevo from './fases/CorreccionNuevo';
import CorreccionEnConfeccion from './fases/CorreccionEnConfeccion';
import CorreccionListo from './fases/CorreccionListo';
import CorreccionRetirado from './fases/CorreccionRetirado';
import VerCorreccionOrdenes from './VerCorreccionOrdenes';
import { fetchCorreccionOrden } from '../../redux/features/correciones-ordenes/correcionesOrdenesSlice';
import { fetchUsuarios } from '../../redux/features/usuarios/usuariosSlice';
import CorreccionEnviado from './fases/CorreccionEnviado';
import CorreccionObservacionesHistorial from './observaciones/CorreccionObservacioneshistorial';
import { clearCorreccionesObservaciones, fetchCorreccionesObservacionesOrden } from '../../redux/features/correccionesOrdenesObservaciones/correccionesOrdenesObservaciones';


const VerUnaCorrecionOrdenes = () => {

  const dispatch = useDispatch();
  const { tiposFasesOrdenes } = useSelector((state) => state.tiposFasesOrdenes)
  const nuevaDataCorrecciones = useSelector((state) => state.fasesOrdenes.nuevaDataCorrecciones);
  const { correccionOrderId } = useParams();
  const { correcionOrden, statusCorreccionOrden } = useSelector((state) => state.correcionesordenes);
  const [nivelStep, setNivelStep] = useState(0)
  const currentTipoFase = tiposFasesOrdenes[nivelStep] || {};
  const [initialized, setInitialized] = useState(false);
  const [fechaSolicitud, setFechaSolicitud] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [currentPhase, setCurrentPhase] = useState(0);
  const usuarios = useSelector((state) => state.usuarios.usuarios);
  const [tipoLente, setTipoLente] = useState('aro');
  const esAro = tipoLente === 'aro';
  const esOneFit = tipoLente === 'onefit';
  const esOneFitMed = tipoLente === 'onefitmed';
  const [oneFitValues, setOneFitValues] = useState(ONE_FIT_INITIAL);
  const [oneFitMedValues, setOneFitMedValues] = useState(ONE_FIT_MED_INITIAL);
  const {
    correccionesObservaciones,
    statusFetch: statusObservaciones
  } = useSelector((state) => state.correccionesOrdenObservaciones);

  useEffect(() => {
    dispatch(fetchUsuarios({}))
    dispatch(fetchPacientes({ page: 1, limit: 50000 }));
  }, []);

  useEffect(() => {
    if (correcionOrden) {
      setFechaSolicitud(correcionOrden?.created_at)
    }
  }, [correcionOrden])

  useEffect(() => {
  }, [nuevaDataCorrecciones, correccionOrderId]);

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
    dispatch(fetchCorreccionOrden(correccionOrderId))
  }, [correccionOrderId])

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

      setCurrentPhase(newStep);
      setNivelStep(newStep);
      setInitialized(true);
    }
  }, [tiposFasesOrdenes, correccionOrderId])


  useEffect(() => {
    setInitialized(false);
  }, [correccionOrderId]);

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


  const itemsSteps = tiposFasesOrdenes?.map((fase, index) => {
    let icon;
    const isCompletedOrActive = index <= nivelStep;
    switch (fase.tipo_fase_orden.toLowerCase()) {
      case 'nuevo':
        icon = <FileAddOutlined />;
        break;
      case 'enviado':
        icon = <CarOutlined />;
        break;
      case 'en confección':
        icon = (
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

  const handleStepChange = async (clickedStep) => {
    setNivelStep(clickedStep);
  };



  return (
    <div>
      <Row>
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
              onChange={handleStepChange}
              current={nivelStep}
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
                borderRadius: '5px'
              }}
            >

              {
                nivelStep == 0 ? (
                  <CorreccionNuevo
                    tipoFaseId={currentTipoFase?.id}
                    isDisabled={isButtonDisabled}
                    correcionOrden={correcionOrden}

                  />
                ) : nivelStep == 1 ? (
                  <CorreccionEnviado
                    tipoFaseId={currentTipoFase?.id}
                    lab={nuevaDataCorrecciones?.laboratorio}
                    isDisabled={isButtonDisabled}
                    fecha={nuevaDataCorrecciones?.fecha_fase}
                    correcionOrden={correcionOrden}
                  />
                ) : nivelStep == 2 ? (
                  <CorreccionEnConfeccion
                    tipoFaseId={currentTipoFase?.id}
                    lab={nuevaDataCorrecciones?.laboratorio}
                    isDisabled={isButtonDisabled}
                    fecha={correcionOrden?.fecha_fase}
                    correcionOrden={correcionOrden}
                  />
                ) : nivelStep == 3 ? (
                  <CorreccionListo
                    tipoFaseId={currentTipoFase.id}
                    isDisabled={isButtonDisabled}
                    lab={nuevaDataCorrecciones?.laboratorio}
                    correcionOrden={correcionOrden}
                  />
                ) : nivelStep == 4 ? (
                  <CorreccionRetirado
                    tipoFaseId={currentTipoFase.id}
                    isDisabled={isButtonDisabled}
                    lab={nuevaDataCorrecciones?.laboratorio}
                    correcionOrden={correcionOrden}
                  />
                ) : <div></div>
              }

              <Row
                gutter={[16, 16]}
              >
                {nivelStep === 4 && (
                  <Button
                    disabled
                  >
                    Contactar al paciente
                  </Button>
                )}
              </Row>
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
            correccionOrderId={parseInt(correccionOrderId)}
            loading={statusObservaciones === "loading"}
          />
        </div>
      </Row>

      <VerCorreccionOrdenes
        correcionOrden={correcionOrden}
        fecha_solicitud={fechaSolicitud}
        statusCorreccionOrden={statusCorreccionOrden}
      >
      </VerCorreccionOrdenes>
    </div>
  )
}

export default VerUnaCorrecionOrdenes