import React, { useState } from 'react'
import { Col, Divider, Input, Row, Select, Tooltip } from 'antd'
import moment from 'moment';
import {
  ClockCircleTwoTone
} from '@ant-design/icons';
// import Swal from 'sweetalert2';

const Nuevo = () => {

  const [fechaActual, setFechaActual] = useState(moment().format('YYYY-MM-DD HH:mm:ss'))

  const actualizarFecha = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro de actualizar esta fecha?',
      text: "¡Confirmarás los cambios en los datos!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {

      setFechaActual(moment().format('YYYY-MM-DD HH:mm:ss'))
      // Mostrar alerta de éxito
      await Swal.fire(
        'Guardado!',
        'La fecha ha sido actualizada.',
        'success'
      );
    }
  }

  return (
    <div>
      <Row
        style={{ marginBottom: '20px' }}
        gutter={[16, 16]}
      >
        <Col xxl={12} xl={12} md={12}>
          <label htmlFor="inputAddress">
            Selecciona el laboratorio
          </label><br />
          <Select
            showSearch
            placeholder=""
            options={[
              { value: "Centilab", label: "Centilab" },
              { value: "Ping", label: "Ping" },
              { value: "Optilab", label: "Optilab" },
            ]}
            style={{
              width: "200px",
              height: "30px",
              color: "black",
              fontWeight: "bold",
              marginBottom: '20px'
            }}
            onChange={(e) => {
            }}
          /><br />

          <label htmlFor="inputAddress">
            Observaciones
          </label>
          <Input.TextArea rows="5" />
        </Col>
        <Col
          xxl={12} xl={12} md={12}
          style={{
            textAlign: 'right'
          }}
        >
          <label htmlFor="inputAddress">
            Fecha de ingreso al laboratorio
          </label>
          <div>
            <Tooltip title="Actualizar Fecha">
              <ClockCircleTwoTone
                style={{
                  marginRight: '10px', cursor: 'pointer', fontSize: '18px'
                }}
                onClick={() => actualizarFecha()}
              />
            </Tooltip>
            {fechaActual}

          </div>
          {/* <input
                    className="form-control"
                    // value={moment.format('YYYY-MM-DD')}
                    name="fecha_atencion"
                    type="date"
                  // onChange={}
                  /> */}
          <Divider />
          <label htmlFor="inputAddress">
            Fecha de creación de la orden
          </label>
          <div>
            {moment().format('YYYY-MM-DD HH:mm:ss')}
          </div>
          <Divider />
          <label htmlFor="inputAddress">
            Status
          </label>
          <div
            style={{ display: 'flex', justifyContent: 'right' }}
          >
            <div
              style={{
                width: '15px', height: '15px', borderRadius: '100%',
                background: 'green', marginRight: '5px'
              }}
            ></div>
            <span>Ok</span>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Nuevo