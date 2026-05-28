import React, { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Divider, Input, Row, Tooltip, Button } from 'antd'
import moment from 'moment';
import {
  ClockCircleTwoTone
} from '@ant-design/icons';
import { fecthTiposFasesOrdenes } from '../../../redux/features/ordenes/tiposFasesOrdenesSlice';
import { actualizarDatosFaseCorrecciones } from '../../../redux/features/correciones-ordenes/correccionesFasesOrdenesSlice';
import { createContactoCorreccionOrden } from '../../../redux/features/contacto-correccion-orden/ContactoCorreccionOrdenSlice';
import VecesContactoCorrecciones from '../VecesContactoCorrecciones';

const CorreccionRetirado = ({ tipoFaseId, isDisabled, correcionOrden }) => {

  const dispatch = useDispatch();
  const [fechaActual, setFechaActual] = useState(moment().format('YYYY-MM-DD HH:mm:ss'))
  const [fechaCreacion, setFechaCreacion] = useState('')
  const [fechaFaseListo, setFechaFaseListo] = useState('');
  const [faseOrdenId, setFaseOrdenId] = useState();
  const tiposFasesOrdenes = useSelector((state) => state.tiposFasesOrdenes.tiposFasesOrdenes)
  const [observaciones, setObservaciones] = useState('');
  const { correccionOrderId } = useParams();
  const location = useLocation();
  const { correcion } = location.state || {};
  const [laboratorio, setLaboratorio] = useState('');
  const [celular, setCelular] = useState(correcion?.celular);
  const [mensaje, setMensaje] = useState(
    'Buenas Tardes, le escribimos de {sucursal} para informarle que los lentes de el Paciente {nombre} estan listo. Puede pasar a retirarlos en los siguientes horarios:  Lunes a Viernes de 9:00 am a 5:00 pm. sabados de 8:00 am a 12:00 pm. La esperamos, Saludos'
  );

  const { pacientes } = useSelector((state) => state.pacientes);
  const [nombrePaciente, setNombrePaciente] = useState(correcion?.paciente_nombre_completo);
  const [selectedSucursal, setSelectedSucursal] = useState(correcion?.sucursal);
  const [ubicacionMaps, setUbicacionMaps] = useState(correcion?.ubicacion_maps);
  const [status, setStatus] = useState('');
  const idUsuario = localStorage.getItem('id_usuario');


  useEffect(() => {
    if (correccionOrderId) {
      dispatch(fecthTiposFasesOrdenes(correccionOrderId));
    }
  }, [])

  useEffect(() => {
    if (correcionOrden) {
      setSelectedSucursal(correcionOrden?.sucursal)
      setUbicacionMaps(correcionOrden?.ubicacion)
      setNombrePaciente(correcionOrden?.paciente_nombre_completo)
      setCelular(correcionOrden?.celular)
      setStatus(correcionOrden?.estado)
    }
  }, [correcionOrden])

  useEffect(() => {
    if (tiposFasesOrdenes && tiposFasesOrdenes.length > 0) {
      const tipoFase2 = tiposFasesOrdenes.find(fase =>
        fase.fases_correcciones_ordenes.some(faseOrden =>
          faseOrden.correccion_ordenes_id == correccionOrderId && faseOrden.tipo_fase_correccion_orden_id == tipoFaseId - 1
        ))
      if (tipoFase2) {
        const faseOrden2 = tipoFase2.fases_correcciones_ordenes.find(faseOrden =>
          faseOrden.correccion_ordenes_id == correccionOrderId && faseOrden.tipo_fase_correccion_orden_id == tipoFaseId - 1
        );


        if (faseOrden2) {
          setLaboratorio(faseOrden2.laboratorio);
          setFechaFaseListo(faseOrden2.fecha_fase)


        }
      }
    }
  }, [tiposFasesOrdenes, correccionOrderId]);

  useEffect(() => {
    if (tiposFasesOrdenes && tiposFasesOrdenes.length > 0) {
      const tipoFase = tiposFasesOrdenes.find(fase =>
        fase.fases_correcciones_ordenes.some(faseOrden =>
          faseOrden.correccion_ordenes_id == correccionOrderId && faseOrden.tipo_fase_correccion_orden_id == tipoFaseId
        )
      );

      if (tipoFase) {
        const faseOrden = tipoFase.fases_correcciones_ordenes.find(faseOrden =>
          faseOrden.correccion_ordenes_id == correccionOrderId && faseOrden.tipo_fase_correccion_orden_id == tipoFaseId
        );

        if (faseOrden) {
          setObservaciones(faseOrden.observacion);
          setFechaActual(faseOrden.fecha_fase);
          setFechaCreacion(faseOrden.created_at);
          setFaseOrdenId(faseOrden.id)

        }
      }
    }
  }, [tiposFasesOrdenes, correccionOrderId, tipoFaseId]);

  const getColorForStatus = (status) => {
    const colors = {
      Ok: 'green',
      Advertencia: 'yellow',
      Critico: 'red',
      Completado: 'blue',
    };
    return colors[status] || 'gray'; // Predeterminado: 'gray'
  };

  const generateWhatsAppLink = () => {
    const telefonoFormateado = `${celular.replace(/[^\d]/g, '')}`;
    let mensajePersonalizado = mensaje
      .replace('{nombre}', nombrePaciente)
      .replace('{sucursal}', selectedSucursal);

    if (ubicacionMaps) {
      mensajePersonalizado += `\n📍 Ubicación: ${ubicacionMaps}`;
    }
    const mensajeCodificado = encodeURIComponent(mensajePersonalizado);


    return `https://wa.me/${telefonoFormateado}?text=${mensajeCodificado}`;
  };



  useEffect(() => {
    const nuevaFase = {
      tipo_fase_correccion_orden_id: tipoFaseId,
      laboratorio: laboratorio,
      observacion: observaciones,
      fecha_fase: fechaActual,
    };
    dispatch(actualizarDatosFaseCorrecciones(nuevaFase));
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

      setFechaActual(moment().format('YYYY-MM-DD HH:mm:ss'))
      // Mostrar alerta de éxito
      await Swal.fire(
        'Guardado!',
        'La fecha ha sido actualizada.',
        'success'
      );
    }
  }

  const handleContactarPaciente = async () => {
    const newContactoOrdenData = {
      correccion_ordenes_id: correcionOrden?.correccion_id,
      tipo_fase_cr_orden_id: tipoFaseId,
      usuario_id: idUsuario,
      cantidad: 1
    };

    try {
      // Llamar a la API
      await dispatch(createContactoCorreccionOrden(newContactoOrdenData)).unwrap();
      console.log('Contacto creado exitosamente');

      // Abrir enlace de WhatsApp
      window.open(generateWhatsAppLink(), '_blank');
    } catch (error) {
      console.error('Error al crear contacto:', error);
    }
  };

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
            Fecha de la fase Retirado
          </label>
          <div>
            <Tooltip title="Actualizar Fecha">
              <ClockCircleTwoTone
                style={{
                  marginRight: '10px', cursor: 'pointer', fontSize: '18px'
                }}
                onClick={isDisabled ? null : () => actualizarFecha()}
              />
            </Tooltip>
            {fechaActual}
          </div>
          <Divider />
          <label htmlFor="inputAddress">
            Fecha de la fase listo
          </label>
          <div>
            {fechaFaseListo ? moment(fechaFaseListo).format('YYYY-MM-DD HH:mm:ss') : ""}
          </div>
          <Divider />
          <label htmlFor="status">Status</label>
          <div
            style={{
              display: 'flex',
              justifyContent: 'right',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div
              style={{
                fontSize: '13px',
                display: 'flex',
                alignItems: 'baseline',
                gap: '5px'
              }}
            >
              <span>Días en proceso:</span>

              <span
                style={{
                  fontWeight: 'bold',
                  fontSize: '23px',
                  color: '#262626'
                }}
              >
                {correcionOrden?.dias_en_proceso ?? 0}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '15px',
                  height: '15px',
                  borderRadius: '100%',
                  backgroundColor: getColorForStatus(status),
                  marginRight: '5px',
                }}
              ></div>

              <span>{status || 'Sin estado'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right', marginTop: '10px' }}>
            <VecesContactoCorrecciones id={correccionOrderId} />
            <Button
              style={{ marginLeft: '10px' }}
              onClick={handleContactarPaciente}
              disabled={isDisabled}
            >
              Contactar al paciente
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default CorreccionRetirado