import React, { useEffect, useState } from 'react'
import { Button, Col, Row, Steps, Modal, Table } from 'antd'
import { useSelector, useDispatch } from 'react-redux';
import {
  FileAddOutlined,
  ImportOutlined,
  CheckCircleOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import { useParams, useLocation } from 'react-router-dom';
import { fecthTiposFasesOrdenes } from '../../redux/features/ordenes/tiposFasesOrdenesSlice';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice';
import CorreccionNuevo from './fases/CorreccionNuevo';
import CorreccionEnConfeccion from './fases/CorreccionEnConfeccion';
import CorreccionListo from './fases/CorreccionListo';
import CorreccionRetirado from './fases/CorreccionRetirado';
import VerCorreccionOrdenes from './VerCorreccionOrdenes';

const VerUnaCorrecionOrdenes = () => {

  const dispatch = useDispatch();
  const location = useLocation();
  const { correcion } = location.state || {};
  const { tiposFasesOrdenes } = useSelector((state) => state.tiposFasesOrdenes)
  const nuevaDataCorrecciones = useSelector((state) => state.fasesOrdenes.nuevaDataCorrecciones);
  const { correccionOrderId } = useParams();
  const [nivelStep, setNivelStep] = useState(0)
  const currentTipoFase = tiposFasesOrdenes[nivelStep] || {};
  const [initialized, setInitialized] = useState(false);
  const [fechaSolicitud, setFechaSolicitud] = useState(correcion?.created_at);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [currentPhase, setCurrentPhase] = useState(0);


  useEffect(() => {
    dispatch(fetchPacientes({ page: 1, limit: 50000 }));
  }, []);


  useEffect(() => {
  }, [nuevaDataCorrecciones, correccionOrderId]);

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

      const nextPhase = lastCompletedStep + 1;
      setCurrentPhase(nextPhase);
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
                    tipoFaseId={currentTipoFase?.id}
                    isDisabled={isButtonDisabled}

                  />

                ) : nivelStep == 1 ? (
                  <CorreccionEnConfeccion
                    tipoFaseId={currentTipoFase?.id}
                    lab={nuevaDataCorrecciones?.laboratorio}
                    isDisabled={isButtonDisabled}
                    fecha={nuevaDataCorrecciones?.fecha_fase}
                  />
                ) : nivelStep == 2 ? (
                  <CorreccionListo
                    tipoFaseId={currentTipoFase.id}
                    isDisabled={isButtonDisabled}
                    lab={nuevaDataCorrecciones?.laboratorio}
                  />
                ) : nivelStep == 3 ? (
                  <CorreccionRetirado
                    tipoFaseId={currentTipoFase.id}
                    isDisabled={isButtonDisabled}
                    lab={nuevaDataCorrecciones?.laboratorio}
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

      <VerCorreccionOrdenes
        fecha_solicitud={fechaSolicitud}
      >
      </VerCorreccionOrdenes>
    </div>
  )
}

export default VerUnaCorrecionOrdenes