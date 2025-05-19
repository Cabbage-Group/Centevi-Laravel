import React, { useEffect, useState } from 'react'
import { Button, Col, Row, Steps, Modal, Table } from 'antd'
import { useSelector, useDispatch } from 'react-redux';
import {
  FileAddOutlined,
  ImportOutlined,
  CheckCircleOutlined,
  LogoutOutlined,
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
  const { pacienteOrden } = useSelector((state) => state.ordenes);

  console.log('pacienteOrden:', pacienteOrden)

  useEffect(() => {
    if (pacienteOrden) {
      setFechaSolicitud(pacienteOrden?.created_at)
    }
  }, [pacienteOrden])


  useEffect(() => {
    dispatch(fetchPacientes({ page: 1, limit: 50000 }));
  }, []);

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
                    tipoFaseId={currentTipoFase?.id}
                    isDisabled={isButtonDisabled}

                  />

                ) : nivelStep == 1 ? (
                  <EnConfeccion
                    tipoFaseId={currentTipoFase?.id}
                    lab={nuevaData?.laboratorio}
                    isDisabled={isButtonDisabled}
                    fecha={nuevaData?.fecha_fase}
                  />
                ) : nivelStep == 2 ? (
                  <Listo
                    tipoFaseId={currentTipoFase.id}
                    isDisabled={isButtonDisabled}
                    lab={nuevaData?.laboratorio}
                  />
                ) : nivelStep == 3 ? (
                  <Retirado
                    tipoFaseId={currentTipoFase.id}
                    isDisabled={isButtonDisabled}
                    lab={nuevaData?.laboratorio}
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
                <Button
                  onClick={() => {
                    if (nivelStep < 4) {
                      setNivelStep(nivelStep + 1);
                    }
                  }}
                  disabled={nivelStep == currentPhase}
                >
                  Siguiente
                </Button>

                <Button
                  disabled
                  type='default'
                >
                  Guardar Fase
                </Button>
                <Button
                  type='primary'
                  disabled
                >
                  Completar Fase
                </Button>
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
      </Row>

      <VerOrden
        pacienteOrden={pacienteOrden}
        fecha_solicitud={fechaSolicitud}
      >
      </VerOrden>
    </div>
  )
}

export default VerUnaOrden