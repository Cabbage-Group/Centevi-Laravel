import React, { useEffect, useState } from 'react'
import { Button, Col, Row, Steps, Modal, Table } from 'antd'
import { useSelector, useDispatch } from 'react-redux';
import {
  FileAddOutlined,
  ImportOutlined,
  CheckCircleOutlined,
  LogoutOutlined,
  CarOutlined,
} from '@ant-design/icons';

import Nuevo from './fases/Nuevo';
import Listo from './fases/Listo';
import EnConfeccion from './fases/EnConfeccion';
import Retirado from './fases/Retirado';
import { useParams, useLocation } from 'react-router-dom';
import { fecthTiposFasesOrdenes } from '../../../redux/features/ordenes/tiposFasesOrdenesSlice';
import { fetchPacientes } from '../../../redux/features/pacientes/pacientesSlice';
import VerOrden from '../VerOrden';
import { fetchOrdenDelPaciente } from '../../../redux/features/ordenes/ordenesSlice';
import Enviado from './fases/Enviado';
import ObservacionesHistorial from './observaciones/Observacioneshistorial';
import { clearObservaciones, fetchObservacionesOrden } from '../../../redux/features/ordenesObservaciones/ordenObservacionesSlice';

const VerUnaOrden = () => {

  const dispatch = useDispatch();
  const { tiposFasesOrdenes } = useSelector((state) => state.tiposFasesOrdenes)
  const nuevaData = useSelector((state) => state.fasesOrdenes.nuevaData);
  const { orderId, nroOrden, idPaciente } = useParams();
  const [nivelStep, setNivelStep] = useState(0)
  const currentTipoFase = tiposFasesOrdenes[nivelStep] || {};
  const [initialized, setInitialized] = useState(false);
  const [fechaSolicitud, setFechaSolicitud] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [currentPhase, setCurrentPhase] = useState(0);
  const { pacienteOrden, statusPacienteOrden } = useSelector((state) => state.ordenes);
  const { status, pacientes } = useSelector((state) => state.pacientes);
  const {
    observaciones,
    statusFetch: statusObservaciones
  } = useSelector((state) => state.ordenObservaciones);

  useEffect(() => {
    if (pacienteOrden) {
      setFechaSolicitud(pacienteOrden?.created_at)
    }
  }, [pacienteOrden])


  useEffect(() => {
    if (status === "idle" || pacientes.length < 11) {
      dispatch(fetchPacientes({ page: 1, limit: 50000 }));
    }
  }, []);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchObservacionesOrden(orderId));
    }
    return () => dispatch(clearObservaciones());
  }, [orderId]);


  useEffect(() => {
    if (idPaciente && nroOrden) {
      dispatch(fetchOrdenDelPaciente({ id_paciente: idPaciente, nro_orden_id: nroOrden }));
    }
  }, [idPaciente, nroOrden, dispatch]);


  useEffect(() => {
  }, [nuevaData, orderId]);

  useEffect(() => {
    if (orderId) {
      dispatch(fecthTiposFasesOrdenes(orderId));
    }
  }, [])

  useEffect(() => {
    if (tiposFasesOrdenes.length > 0 && orderId && !initialized) {
      const lastPhase = tiposFasesOrdenes
        .flatMap(tipoFase => tipoFase.fases_ordenes)
        .filter(faseOrden => faseOrden.ordenes_id === parseInt(orderId))
        .reduce((maxFase, currentFase) =>
          currentFase.tipo_fase_orden_id > maxFase.tipo_fase_orden_id ? currentFase : maxFase,
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
  }, [tiposFasesOrdenes, orderId])


  useEffect(() => {
    setInitialized(false);
  }, [orderId]);

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
                    tipoFaseId={currentTipoFase?.id}
                    isDisabled={isButtonDisabled}
                    pacientesData={pacientes}
                    pacienteOrden={pacienteOrden}
                  />
                ) : nivelStep == 1 ? (
                  <Enviado
                    tipoFaseId={currentTipoFase?.id}
                    lab={nuevaData?.laboratorio}
                    isDisabled={isButtonDisabled}
                    fecha={nuevaData?.fecha_fase}
                    pacientesData={pacientes}
                    pacienteOrden={pacienteOrden}
                  />
                ) : nivelStep == 2 ? (
                  <EnConfeccion
                    tipoFaseId={currentTipoFase?.id}
                    lab={nuevaData?.laboratorio}
                    isDisabled={isButtonDisabled}
                    fecha={nuevaData?.fecha_fase}
                    pacientesData={pacientes}
                    pacienteOrden={pacienteOrden}
                  />
                ) : nivelStep == 3 ? (
                  <Listo
                    tipoFaseId={currentTipoFase.id}
                    isDisabled={isButtonDisabled}
                    lab={nuevaData?.laboratorio}
                    pacientesData={pacientes}
                    pacienteOrden={pacienteOrden}
                  />
                ) : nivelStep == 4 ? (
                  <Retirado
                    tipoFaseId={currentTipoFase.id}
                    isDisabled={isButtonDisabled}
                    lab={nuevaData?.laboratorio}
                    pacientesData={pacientes}
                    pacienteOrden={pacienteOrden}
                  />
                ) : <div></div>
              }
              <Row
                gutter={[16, 16]}
              >
                {nivelStep === 5 && (
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
          <ObservacionesHistorial
            ordenes_id={parseInt(orderId)}
            loading={statusObservaciones === "loading"}
          />
        </div>
      </Row>

      <VerOrden
        pacienteOrden={pacienteOrden}
        fecha_solicitud={fechaSolicitud}
        statusPacienteOrden={statusPacienteOrden}
      >
      </VerOrden>
    </div>
  )
}

export default VerUnaOrden