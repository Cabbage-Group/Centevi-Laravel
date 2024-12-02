import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Col, Divider, Input, Row, Select, Tooltip } from 'antd'
import moment from 'moment';
import {
  ClockCircleTwoTone
} from '@ant-design/icons';
import { actualizarDatosFase } from '../../../../redux/features/ordenes/fasesOrdenesSlice';
import { fecthTiposFasesOrdenes } from '../../../../redux/features/ordenes/tiposFasesOrdenesSlice';
import { useParams } from 'react-router-dom';


const Nuevo = ({ tipoFaseId }) => {

  const dispatch = useDispatch();
  const [fechaActual, setFechaActual] = useState('')
  const [fechaCreacion, setFechaCreacion] = useState('')
  const [laboratorio, setLaboratorio] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const tiposFasesOrdenes = useSelector((state) => state.tiposFasesOrdenes.tiposFasesOrdenes)
  const { orderId } = useParams(); 


  console.log('tiposFasesOrdenes:',tiposFasesOrdenes)
  console.log('orderId:',orderId)
  console.log('fechaActual:',fechaActual)

  useEffect(()=>{
    dispatch(fecthTiposFasesOrdenes());
  },[])

  useEffect(() => {
    if (tiposFasesOrdenes && tiposFasesOrdenes.length > 0) {
      console.log('entre1')
      const tipoFase = tiposFasesOrdenes.find(fase => 
        fase.fases_ordenes.some(faseOrden => 
          faseOrden.ordenes_id == orderId && faseOrden.tipo_fase_orden_id == tipoFaseId
        )
      );

      if (tipoFase) {
        console.log('entre2')
        const faseOrden = tipoFase.fases_ordenes.find(faseOrden => 
          faseOrden.ordenes_id == orderId && faseOrden.tipo_fase_orden_id == tipoFaseId
        );

        if (faseOrden) {
          console.log('entre3')
          setLaboratorio(faseOrden.laboratorio);
          setObservaciones(faseOrden.observacion);
          setFechaActual(faseOrden.fecha_fase);
          setFechaCreacion(faseOrden.created_at);
        }
      }
    }
  }, [tiposFasesOrdenes, orderId, tipoFaseId]);

  useEffect(() => {
    if (laboratorio && observaciones) {
      const nuevaFase = {
        tipo_fase_orden_id:tipoFaseId, 
        laboratorio,
        observacion:observaciones,
        fecha_fase: fechaActual,
      };
      dispatch(actualizarDatosFase(nuevaFase));
    }
  }, [laboratorio, observaciones, fechaActual, tipoFaseId, dispatch]);


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
    console.log('holaentre:')
    console.log('result :',result)
    if (result.value === true) {
      console.log('nuevaFecha:',nuevaFecha)
      const nuevaFecha = moment().format('YYYY-MM-DD HH:mm:ss');
      console.log('nuevaFecha:',nuevaFecha)
      setFechaActual(nuevaFecha)
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
          <label htmlFor="laboratorio">
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
            onChange={(value) => setLaboratorio(value)}
            value={laboratorio}
          /><br />

          <label htmlFor="observaciones">
            Observaciones
          </label>
          <Input.TextArea 
            rows="5" 
            onChange={(e) => setObservaciones(e.target.value)}
            value={observaciones}
          />
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
                onClick={() => {
                  console.log('Ícono clickeado');
                  actualizarFecha()
                }
              }
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
          <label htmlFor="fecha_fase">
            Fecha de creación de la orden
          </label>
          <div>
            <Tooltip title="Actualizar Fecha">
              <ClockCircleTwoTone
                style={{ marginRight: '10px', cursor: 'pointer', fontSize: '18px' }}
                // onClick={() => actualizarFecha()}
              />
            </Tooltip>
            {fechaCreacion}
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