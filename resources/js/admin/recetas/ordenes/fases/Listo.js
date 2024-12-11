import React, { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Divider, Input, Row, Select, Tooltip } from 'antd'
import moment from 'moment';
import {
  ClockCircleTwoTone
} from '@ant-design/icons';
import { actualizarDatosFase } from '../../../../redux/features/ordenes/fasesOrdenesSlice';
import { fecthTiposFasesOrdenes } from '../../../../redux/features/ordenes/tiposFasesOrdenesSlice';

const Listo = ({ tipoFaseId, lab }) => {

  const dispatch = useDispatch();
  const [fechaActual, setFechaActual] = useState(moment().format('YYYY-MM-DD HH:mm:ss'))
  const [fechaCreacion, setFechaCreacion] = useState('')
  const [fechaFaseConfeccion, setFechaFaseConfeccion] = useState(''); 
  const tiposFasesOrdenes = useSelector((state) => state.tiposFasesOrdenes.tiposFasesOrdenes)
  const [observaciones, setObservaciones] = useState('');
  const { orderId } = useParams();

  const [status, setStatus] = useState('');
  const [allFasesCompletas, setAllFasesCompletas] = useState(false);
  const location = useLocation();
  const [laboratorio, setLaboratorio] = useState('');
  const { orden } = location.state || {};

  useEffect(() => {
    if (orderId) {
      dispatch(fecthTiposFasesOrdenes(orderId));
    }
  }, [])

  useEffect(() => {
    if (tiposFasesOrdenes && tiposFasesOrdenes.length > 0) {
      const tipoFase2 = tiposFasesOrdenes.find(fase =>
        fase.fases_ordenes.some(faseOrden =>
          faseOrden.ordenes_id == orderId && faseOrden.tipo_fase_orden_id == tipoFaseId - 1
        ))
      if (tipoFase2) {
        const faseOrden2 = tipoFase2.fases_ordenes.find(faseOrden =>
          faseOrden.ordenes_id == orderId && faseOrden.tipo_fase_orden_id == tipoFaseId - 1
        );


        if (faseOrden2) {
          setLaboratorio(faseOrden2.laboratorio);
          setFechaFaseConfeccion(faseOrden2.fecha_fase);
        }
      }
    }
  }, [tiposFasesOrdenes, orderId]);

  useEffect(() => {
    if (tiposFasesOrdenes && tiposFasesOrdenes.length > 0) {
      const tipoFase = tiposFasesOrdenes.find(fase =>
        fase.fases_ordenes.some(faseOrden =>
          faseOrden.ordenes_id == orderId && faseOrden.tipo_fase_orden_id == tipoFaseId
        )
      );
      if (tipoFase) {
        const faseOrden = tipoFase.fases_ordenes.find(faseOrden =>
          faseOrden.ordenes_id == orderId && faseOrden.tipo_fase_orden_id == tipoFaseId
        );
        if (faseOrden) {
          setObservaciones(faseOrden.observacion);
          setFechaActual(faseOrden.fecha_fase);
          setFechaCreacion(faseOrden.created_at);


        }
      }
    }
  }, [tiposFasesOrdenes, orderId, tipoFaseId]);

  const getColorForStatus = (status) => {
    const colors = {
      Ok: 'green',
      Advertencia: 'yellow',
      Critico: 'red',
      Completado: 'blue',
    };
    return colors[status] || 'gray';
  };

  const statusToDisplay = orden?.status_final || orden?.status;

  useEffect(() => {
    const nuevaFase = {
      tipo_fase_orden_id: tipoFaseId,
      laboratorio: laboratorio,
      observacion: observaciones,
      fecha_fase: fechaActual,
    };
    dispatch(actualizarDatosFase(nuevaFase));

  }, [observaciones, fechaActual, tipoFaseId, dispatch]);

  console.log('')

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
            Fecha de la fase Listo
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
          <Divider />
          <label htmlFor="inputAddress">
            Fecha de la fase confección
          </label>
          <div>
            {fechaFaseConfeccion ? moment(fechaFaseConfeccion).format('YYYY-MM-DD HH:mm:ss') : ""}
          </div>
          <Divider />
          <label htmlFor="status">Status</label>
          <div style={{ display: 'flex', justifyContent: 'right' }}>
            <div
              style={{
                width: '15px',
                height: '15px',
                borderRadius: '100%',
                backgroundColor: getColorForStatus(statusToDisplay),
                marginRight: '5px',
              }}
            ></div>
            <span>{statusToDisplay || 'Sin estado'}</span>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Listo