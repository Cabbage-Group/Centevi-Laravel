import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Divider, Input, Row, Select, Tooltip } from 'antd'
import moment from 'moment';
import {
  ClockCircleTwoTone
} from '@ant-design/icons';
import { fecthTiposFasesOrdenes } from '../../../../redux/features/ordenes/tiposFasesOrdenesSlice';
import { actualizarDatosFase } from '../../../../redux/features/ordenes/fasesOrdenesSlice';
const EnConfeccion = ({tipoFaseId}) => {

  const dispatch = useDispatch();
  const [fechaActual, setFechaActual] = useState(moment().format('YYYY-MM-DD HH:mm:ss'))
  const [fechaCreacion, setFechaCreacion] = useState(moment().format('YYYY-MM-DD HH:mm:ss'))
  const tiposFasesOrdenes = useSelector((state) => state.tiposFasesOrdenes.tiposFasesOrdenes)
  const [observaciones, setObservaciones] = useState('');
  const { orderId } = useParams(); 

  useEffect(()=>{
    dispatch(fecthTiposFasesOrdenes());
  },[])


  useEffect(() => {
    if (tiposFasesOrdenes && tiposFasesOrdenes.length > 0) {
      const tipoFase = tiposFasesOrdenes.find(fase => 
        fase.fases_ordenes.some(faseOrden => 
          faseOrden.ordenes_id == orderId  && faseOrden.tipo_fase_orden_id == tipoFaseId
        )
      );

      console.log('tipoFase:',tipoFase)
      if (tipoFase) {
        const faseOrden = tipoFase.fases_ordenes.find(faseOrden => 
          faseOrden.ordenes_id == orderId && faseOrden.tipo_fase_orden_id == tipoFaseId
        );
        console.log('faseOrden:',faseOrden)

        if (faseOrden) {
          setObservaciones(faseOrden.observacion);
          setFechaActual(faseOrden.fecha_fase);
          setFechaCreacion(faseOrden.created_at);
        }
      }
    }
  }, [tiposFasesOrdenes, orderId, tipoFaseId]);

  useEffect(() => {
    if (observaciones) {
      const nuevaFase = {
        tipo_fase_orden_id:tipoFaseId, 
        laboratorio: "",
        observacion:observaciones,
        fecha_fase: fechaActual,
      };
      dispatch(actualizarDatosFase(nuevaFase));
    }
  }, [observaciones, fechaActual, tipoFaseId, dispatch]);

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

    if (result.value === true) {
      const nuevaFecha = moment().format('YYYY-MM-DD HH:mm:ss');
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
          <label htmlFor="inputAddress">
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
            Fecha de la fase confección
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
            Fecha de ingreso al laboratorio
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
                background: 'yellow', marginRight: '5px'
              }}
            ></div>
            <span>Con Retraso</span>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default EnConfeccion