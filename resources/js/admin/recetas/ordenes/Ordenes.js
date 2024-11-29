import React, { useState } from 'react'
import CreateReceta from '../CreateOrden'
import { Button, Col, Input, Row, Select, Steps } from 'antd'
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

const Ordenes = () => {

  const [itemsSteps, setItemsSteps] = useState([
    {
      title: 'Nuevo',
      // icon: <SolutionOutlined />,
      icon: <FileAddOutlined />,
    },
    {
      title: 'En Confección',
      icon: <ImportOutlined />,
      // icon: <UserOutlined />,
    },
    {
      title: 'Listo',
      // icon: <LoadingOutlined />,
      icon: <CheckCircleOutlined />,
    },
    {
      title: 'Retirado',
      // status: 'wait',
      // icon: <SmileOutlined />,
      icon: <LogoutOutlined />,
    },
  ]);

  const [nivelStep, setNivelStep] = useState(0)

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

      setNivelStep(nivelStep + 1)
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
                  <Nuevo />
                ) : nivelStep == 1 ? (
                  <EnConfeccion />
                ) : nivelStep == 2 ? (
                  <Listo />
                ) : nivelStep == 3 ? (
                  <Retirado />
                ) : <div></div>
              }

              <Row
                gutter={[16, 16]}
              >
                <Button
                  onClick={() => setNivelStep(nivelStep - 1)}
                >
                  Anterior
                </Button>
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


      <CreateReceta />

    </div>
  )
}

export default Ordenes