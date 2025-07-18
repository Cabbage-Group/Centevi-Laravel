import React, { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Divider, Input, Row, Tooltip, Button } from 'antd'
import moment from 'moment';
import {
  ClockCircleTwoTone
} from '@ant-design/icons';
import { fecthTiposFasesOrdenes } from '../../../../redux/features/ordenes/tiposFasesOrdenesSlice';
import { actualizarDatosFase } from '../../../../redux/features/ordenes/fasesOrdenesSlice';
import { fetchPacientes } from '../../../../redux/features/pacientes/pacientesSlice';
import { createContactoOrden } from '../../../../redux/features/contacto-orden/ContactoOrdenSlice';
import VecesContacto from '../../VecesContacto';
import ValidarPermisos from '../../../../utils/ValidarPermisos';

const Retirado = ({ tipoFaseId, isDisabled, pacientesData, pacienteOrden }) => {

  const dispatch = useDispatch();
  const [fechaActual, setFechaActual] = useState(moment().format('YYYY-MM-DD HH:mm:ss'))
  const [fechaCreacion, setFechaCreacion] = useState('')
  const [fechaFaseListo, setFechaFaseListo] = useState('');
  const [faseOrdenId, setFaseOrdenId] = useState();
  const tiposFasesOrdenes = useSelector((state) => state.tiposFasesOrdenes.tiposFasesOrdenes)
  const [observaciones, setObservaciones] = useState('');
  const [elaboradoFase, setElaboradoFase] = useState('');
  const { orderId } = useParams();
  const [laboratorio, setLaboratorio] = useState('');
  const [celular, setCelular] = useState('');
  const usuarioId = Number(localStorage.getItem('id_usuario'));
  const [mensaje, setMensaje] = useState(
    'Buenas Tardes, le escribimos de {sucursal} para informarle que los lentes de el Paciente {nombre} estan listo. Puede pasar a retirarlos en los siguientes horarios:  Lunes a Viernes de 9:00 am a 5:00 pm. sabados de 8:00 am a 12:00 pm. La esperamos, Saludos'
  );
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [selectedSucursal, setSelectedSucursal] = useState('');
  const [ubicacionMaps, setUbicacionMaps] = useState('');
  const idUsuario = localStorage.getItem('id_usuario');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (orderId) {
      dispatch(fecthTiposFasesOrdenes(orderId));
    }
  }, [])

  useEffect(() => {
    if (pacienteOrden) {
      setSelectedPaciente(pacienteOrden?.id_paciente)
      setSelectedSucursal(pacienteOrden?.sucursal_nombre)
      setUbicacionMaps(pacienteOrden?.sucursal_ubicacion)
      setStatus(pacienteOrden?.status_primera_fase)
    }
  }, [pacienteOrden])

  useEffect(() => {
    if (selectedPaciente) {
      const pacienteSeleccionado = pacientesData.find(
        (paciente) => paciente.id_paciente === selectedPaciente
      );
      if (pacienteSeleccionado) {
        setCelular(pacienteSeleccionado?.celular || '');
        setNombrePaciente(pacienteSeleccionado?.nombres || '');
      } else {
        setCelular('');

      }
    } else {
      setCelular('');
    }
  }, [selectedPaciente, pacientesData]);


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
          setFechaFaseListo(faseOrden2.fecha_fase)

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
          setElaboradoFase(faseOrden.elaborado_por);

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
      tipo_fase_orden_id: tipoFaseId,
      laboratorio: laboratorio,
      observacion: observaciones,
      fecha_fase: fechaActual,
      elaborado_por: usuarioId,
    };
    dispatch(actualizarDatosFase(nuevaFase));
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
      ordenes_id: orderId,
      tipo_fase_orden_id: tipoFaseId,
      usuario_id: idUsuario,
      cantidad: 1
    };

    try {
      await dispatch(createContactoOrden(newContactoOrdenData)).unwrap();
      console.log('Contacto creado exitosamente');

      window.open(generateWhatsAppLink(), '_blank');
    } catch (error) {
      console.error('Error al crear contacto:', error);
    }
  };

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col span={24}>
          <div
            style={{
              background: '#e6ffed',
              border: '1px solid #b7eb8f',
              color: '#389e0d',
              padding: '15px',
              borderRadius: '5px',
              textAlign: 'center',
            }}
          >
            Se completo todas las fases
            <br />
            {
              ValidarPermisos(
                "orden.corregirorden",
                <Link
                  to={isDisabled ? '#' : `/crear-correciones-ordenes`}
                  className="btn btn-warning btnEditarReceta"
                  state={{ pacienteOrden }}
                  style={{
                    display: 'inline-block',
                    marginTop: '10px',
                    padding: '10px 20px',
                    backgroundColor: '#ffc107',
                    color: '#000',
                    borderRadius: '5px',
                    textDecoration: 'none',
                  }}

                >
                  Corregir orden
                </Link>
              )
            }
          </div>
        </Col>

        <Col xxl={12} xl={12} md={12} style={{ marginTop: '20px' }}>
          <label htmlFor="inputAddress">Observaciones</label>
          <Input.TextArea
            rows="5"
            onChange={(e) => setObservaciones(e.target.value)}
            value={observaciones}
          />
        </Col>
        <Col xxl={12} xl={12} md={12} style={{ textAlign: 'right' }}>
          <label htmlFor="inputAddress">Fecha de la fase Retirado</label>
          <div>
            <Tooltip title="Actualizar Fecha">
              <ClockCircleTwoTone
                style={{
                  marginRight: '10px',
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
                onClick={isDisabled ? null : () => actualizarFecha()}
              />
            </Tooltip>
            {fechaActual}
          </div>
          <Divider />
          <label htmlFor="inputAddress">Fecha de la fase listo</label>
          <div>
            {fechaFaseListo ? moment(fechaFaseListo).format('YYYY-MM-DD HH:mm:ss') : ""}
          </div>
          <Divider />
          <label htmlFor="status">Status</label>
          <div style={{ display: 'flex', justifyContent: 'right' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right', marginTop: '10px' }}>
            <VecesContacto id_orden={orderId} />
            <Button style={{ marginLeft: '10px' }} onClick={handleContactarPaciente} disabled={isDisabled}>
              Contactar al paciente
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Retirado