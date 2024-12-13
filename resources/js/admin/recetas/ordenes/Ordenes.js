import React, { useEffect, useState } from 'react'
import CreateReceta from '../CreateOrden'
import { Button, Col, Input, Row, Select, Steps } from 'antd'
import { useSelector, useDispatch } from 'react-redux';
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
import EditOrden from '../EditOrden';
import { useParams, useLocation } from 'react-router-dom';
import { fecthTiposFasesOrdenes } from '../../../redux/features/ordenes/tiposFasesOrdenesSlice';
import { current } from '@reduxjs/toolkit';
import { createFasesOrdenes } from '../../../redux/features/ordenes/fasesOrdenesSlice';

const Ordenes = () => {

  const dispatch = useDispatch();
  const location = useLocation();
  const { orden } = location.state || {};
  const { tiposFasesOrdenes } = useSelector((state) => state.tiposFasesOrdenes)
  const nuevaData = useSelector((state) => state.fasesOrdenes.nuevaData);
  const { orderId } = useParams();
  const [nivelStep, setNivelStep] = useState(0)
  const currentTipoFase = tiposFasesOrdenes[nivelStep] || {};
  const [initialized, setInitialized] = useState(false);
  const [fechaSolicitud, setFechaSolicitud] = useState(orden.created_at);

  useEffect(() => {
    console.log("Datos de fase guardados en nuevaData:", nuevaData);
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
            faseOrden.tipo_fase_orden_id === tipoFase.id

        );
        return hasCompleted ? index : lastStep;
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

  const avanzarFase = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro de avanzar en la fase?',
      text: "¡Confirmarás los cambios en los datos!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      const nuevaDataConOrderId = {
        ...nuevaData,
        ordenes_id: orderId,
      };
      console.log('nuevaDataConOrderId:', nuevaDataConOrderId)
      setNivelStep(nivelStep + 1)
      dispatch(createFasesOrdenes(nuevaDataConOrderId));
      dispatch(fecthTiposFasesOrdenes(orderId));
      // Mostrar alerta de éxito
      await Swal.fire(
        'Guardado!',
        'La fase ha sido guardada.',
        'success'
      );
    }
  }

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
                <Button
                  onClick={() => avanzarFase()}
                  type='primary'
                >
                  Completar Fase
                </Button>
              </Row>
            </div>

          </div>

        </Col>
      </Row>


      <EditOrden
        fecha_solicitud={fechaSolicitud}
      />

    </div>
  )
}

export default Ordenes