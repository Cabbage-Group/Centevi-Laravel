import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Divider, Input, Row, Tooltip, Button } from 'antd';
import moment from 'moment';
import {
  ClockCircleTwoTone
} from '@ant-design/icons';
import { fecthTiposFasesOrdenes } from '../../../../redux/features/ordenes/tiposFasesOrdenesSlice';
import { actualizarDatosFase } from '../../../../redux/features/ordenes/fasesOrdenesSlice';
import { createContactoOrden } from '../../../../redux/features/contacto-orden/ContactoOrdenSlice';
import { fetchPacientes } from '../../../../redux/features/pacientes/pacientesSlice';
import VecesContacto from '../../VecesContacto';

const EnConfeccion = ({ tipoFaseId, lab, fecha_fase,isDisabled }) => {
  const dispatch = useDispatch();
  const [fechaActual, setFechaActual] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [fechaCreacion, setFechaCreacion] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [fechaIngresoLaboratorio, setFechaIngresoLaboratorio] = useState('');
  const tiposFasesOrdenes = useSelector((state) => state.tiposFasesOrdenes.tiposFasesOrdenes);
  const [observaciones, setObservaciones] = useState('');
  const { orderId } = useParams();
  const location = useLocation();
  const [laboratorio, setLaboratorio] = useState('');
  const [faseOrdenId, setFaseOrdenId] = useState();
  const { orden } = location.state || {};
  const [celular, setCelular] = useState('');
  const [mensaje, setMensaje] = useState(
     'Buenas Tardes, le escribimos de {sucursal} para informarle que los lentes de el Paciente {nombre} están listo. Puede pasar a retirarlos en los siguientes horarios:  Lunes a Viernes de 9:00 am a 5:00 pm.  sábados de 8:00 am a 12:00 pm. La esperamos,Saludos'
   );
  const [selectedPaciente, setSelectedPaciente] = useState(orden?.id_paciente);
  const { pacientes } = useSelector((state) => state.pacientes);
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [selectedSucursal, setSelectedSucursal] = useState(orden?.sucursal?.nombre);
  const [ubicacionMaps, setUbicacionMaps] = useState(orden?.sucursal?.ubicacion_maps );
  const idUsuario = localStorage.getItem('id_usuario');

  useEffect(() => {
    if (orderId) {
      dispatch(fecthTiposFasesOrdenes(orderId));
    }
  }, []);

  useEffect(() => {
    dispatch(fetchPacientes({ page: 1, limit: 10000 }));
  }, []);

  useEffect(() => {
    if (selectedPaciente) {
      const pacienteSeleccionado = pacientes.find(
        (paciente) => paciente.id_paciente === selectedPaciente
      );
      console.log('pacienteSeleccionado:', pacienteSeleccionado)
      if (pacienteSeleccionado) {
        setCelular(pacienteSeleccionado?.celular || '');
        setNombrePaciente(pacienteSeleccionado?.nombres || '');
      } else {
        setCelular('');

      }
    } else {
      setCelular('');
    }
  }, [selectedPaciente, pacientes]);



  useEffect(() => {
    if (tiposFasesOrdenes && tiposFasesOrdenes.length > 0) {
      const tipoFaseAnterior = tiposFasesOrdenes.find(fase =>
        fase.fases_ordenes.some(faseOrden =>
          faseOrden.ordenes_id == orderId && faseOrden.tipo_fase_orden_id == tipoFaseId - 1
        )
      );
      if (tipoFaseAnterior) {
        const faseOrdenAnterior = tipoFaseAnterior.fases_ordenes.find(faseOrden =>
          faseOrden.ordenes_id == orderId && faseOrden.tipo_fase_orden_id == tipoFaseId - 1
        );
        if (faseOrdenAnterior) {
          setLaboratorio(faseOrdenAnterior.laboratorio);
          setFechaIngresoLaboratorio(faseOrdenAnterior.fecha_fase);
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
          setFaseOrdenId(faseOrden.id)
        }
      }
    }
  }, [tiposFasesOrdenes, orderId, tipoFaseId]);

  useEffect(() => {
    const nuevaFase = {
      tipo_fase_orden_id: tipoFaseId,
      laboratorio: laboratorio,
      observacion: observaciones,
      fecha_fase: fechaActual,
    };
    dispatch(actualizarDatosFase(nuevaFase));
  }, [observaciones, fechaActual, tipoFaseId, dispatch]);

  const getColorForStatus = (status) => {
    const colors = {
      Ok: 'green',
      Advertencia: 'yellow',
      Critico: 'red',
      Completado: 'blue',
    };
    return colors[status] || 'gray'; // Predeterminado: 'gray'
  };

  const statusToDisplay = orden?.status;

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
      setFechaActual(nuevaFecha);
      await Swal.fire(
        'Guardado!',
        'La fecha ha sido actualizada.',
        'success'
      );
    }
  }

  const handleContactarPaciente = async () => {
    // Datos para la API
    const newContactoOrdenData = {
      ordenes_id: orden?.id_orden,
      tipo_fase_orden_id: tipoFaseId,
      usuario_id: idUsuario,
      cantidad: 1
    };

    try {
      // Llamar a la API
      await dispatch(createContactoOrden(newContactoOrdenData)).unwrap();
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
            Fecha de la fase confección
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
            Fecha de ingreso al laboratorio
          </label>
          <div>
            {fechaIngresoLaboratorio || moment().format('YYYY-MM-DD HH:mm:ss')} {/* Si no hay fecha anterior, se muestra la fecha actual */}
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
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right', marginTop: '10px' }}>
            <VecesContacto id_orden={orderId} />
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
  );
}

export default EnConfeccion;
