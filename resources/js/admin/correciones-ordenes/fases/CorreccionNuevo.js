import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Divider, Input, Select, Tooltip, Button } from 'antd';
import { ClockCircleTwoTone } from '@ant-design/icons';
import { fecthTiposFasesOrdenes } from '../../../redux/features/ordenes/tiposFasesOrdenesSlice';
import { fetchPacientes } from '../../../redux/features/pacientes/pacientesSlice';
import { actualizarDatosFaseCorrecciones } from '../../../redux/features/correciones-ordenes/correccionesFasesOrdenesSlice';
import { createContactoOrden } from '../../../redux/features/contacto-orden/ContactoOrdenSlice';
import moment from 'moment';
import { useLocation, useParams } from 'react-router-dom';
import VecesContacto from '../../recetas/VecesContacto';
import { createContactoCorreccionOrden } from '../../../redux/features/contacto-correccion-orden/ContactoCorreccionOrdenSlice';
import VecesContactoCorrecciones from '../VecesContactoCorrecciones';
import { fetchSucursales } from '../../../redux/features/sucursales/sucursalesSlice';

const CorreccionNuevo = ({ tipoFaseId, isDisabled }) => {
  const dispatch = useDispatch();
  const [fechaActual, setFechaActual] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [fechaCreacion, setFechaCreacion] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [faseOrdenId, setFaseOrdenId] = useState();
  const [laboratorio, setLaboratorio] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const tiposFasesOrdenes = useSelector((state) => state.tiposFasesOrdenes.tiposFasesOrdenes);
  const location = useLocation();
  const { correccionOrderId } = useParams();
  const { correcion } = location.state || {};
  const { pacienteOrden } = location.state || {};
  const [celular, setCelular] = useState(correcion?.celular);
  const [mensaje, setMensaje] = useState(
    'Buenas Tardes, le escribimos de {sucursal} para informarle que los lentes de el Paciente {nombre} están listo. Puede pasar a retirarlos en los siguientes horarios:  Lunes a Viernes de 9:00 am a 5:00 pm.  sábados de 8:00 am a 12:00 pm. La esperamos,Saludos'
  );
  const [nombrePaciente, setNombrePaciente] = useState(correcion?.paciente_nombre_completo);
  const [selectedSucursal, setSelectedSucursal] = useState(correcion?.sucursal );
  const [ubicacionMaps, setUbicacionMaps] = useState(correcion?.ubicacion_maps );
  const idUsuario = localStorage.getItem('id_usuario');

  const [opcionesLaboratorio, setOpcionesLaboratorio] = useState([
    { value: 'Centilab', label: 'Centilab' },
    { value: 'Ping', label: 'Ping' },
    { value: 'Optilab', label: 'Optilab' },
  ]);

  // useEffect(() => {
  //     dispatch(fetchPacientes({ page: 1, limit: 50000 }));
  //   }, []);

  console.log('correcion:',correcion)
  console.log('celular:',celular)
  useEffect(() => {
    // Cambiar las opciones del Select si lente_contacto es true
    if (correcion?.lente_contacto) {
      setOpcionesLaboratorio([
        { value: 'Vista Pro', label: 'Vista Pro' },
        { value: 'Haseth J&J', label: 'Haseth J&J' },
        { value: 'Alcon', label: 'Alcon' },
        { value: 'B+L', label: 'B+L' },
      ]);
    } else {
      setOpcionesLaboratorio([
        { value: 'Centilab', label: 'Centilab' },
        { value: 'Ping', label: 'Ping' },
        { value: 'Optilab', label: 'Optilab' },
      ]);
    }
  }, [correcion?.lente_contacto]);


  useEffect(() => {
    if (correccionOrderId) {
      dispatch(fecthTiposFasesOrdenes(correccionOrderId));
    }
  }, []);

 

  // useEffect(() => {
  //   if (selectedPaciente) {
  //     const pacienteSeleccionado = pacientes.find(
  //       (paciente) => paciente.id_paciente === selectedPaciente
  //     );
  //     if (pacienteSeleccionado) {
  //       setCelular(pacienteSeleccionado?.celular || '');
  //       setNombrePaciente(pacienteSeleccionado?.nombres || '');
  //     } else {
  //       setCelular('');

  //     }
  //   } else {
  //     setCelular('');
  //   }
  // }, [selectedPaciente, pacientes]);

  useEffect(() => {
    if (tiposFasesOrdenes && tiposFasesOrdenes.length > 0) {
      const tipoFase = tiposFasesOrdenes.find((fase) =>
        fase.fases_correcciones_ordenes.some(
          (faseOrden) =>
            faseOrden.correccion_ordenes_id == correccionOrderId && faseOrden.tipo_fase_correccion_orden_id == tipoFaseId
        )
      );

      if (tipoFase) {
        const faseOrden = tipoFase.fases_correcciones_ordenes.find(
          (faseOrden) =>
            faseOrden.correccion_ordenes_id == correccionOrderId && faseOrden.tipo_fase_correccion_orden_id == tipoFaseId
        );

        if (faseOrden) {
          setLaboratorio(faseOrden.laboratorio);
          setObservaciones(faseOrden.observacion);
          setFechaActual(faseOrden.fecha_fase);
          setFechaCreacion(faseOrden.created_at);
          setFaseOrdenId(faseOrden.id)
        }
      }
    }
  }, [tiposFasesOrdenes, correccionOrderId, tipoFaseId]);

  useEffect(() => {
    if (laboratorio && observaciones !== null) {
      const nuevaFase = {
        tipo_fase_correccion_orden_id: tipoFaseId,
        laboratorio: laboratorio,
        observacion: observaciones,
        fecha_fase: fechaActual,
        created_at: fechaCreacion,
      };
      dispatch(actualizarDatosFaseCorrecciones(nuevaFase));
    }
  }, [laboratorio, observaciones, fechaActual, tipoFaseId, dispatch, fechaCreacion]);

  const getColorForStatus = (status) => {
    const colors = {
      Ok: 'green',
      Advertencia: 'yellow',
      Critico: 'red',
      Completado: 'blue',
    };
    return colors[status] || 'gray'; // Predeterminado: 'gray'
  };



  const statusToDisplay = correcion?.status;

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
      setFechaActual(nuevaFecha)
      await Swal.fire(
        'Guardado!',
        'La fecha ha sido actualizada.',
        'success'
      );
    }
  }

  const actualizarFechaCreacionOrden = async () => {
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
      setFechaCreacion(nuevaFecha)
      await Swal.fire(
        'Guardado!',
        'La fecha ha sido actualizada.',
        'success'
      );
    }
  }

  const handleContactarPaciente = async () => {
    const newContactoOrdenData = {
      correccion_ordenes_id: correcion?.id,
      tipo_fase_cr_orden_id: tipoFaseId,
      usuario_id: idUsuario,
      cantidad: 1
    };

    try {
      
      await dispatch(createContactoCorreccionOrden(newContactoOrdenData)).unwrap();
      console.log('Contacto creado exitosamente');

      window.open(generateWhatsAppLink(), '_blank');
    } catch (error) {
      console.error('Error al crear contacto:', error);
    }
  };




  return (
    <div>
      <Row style={{ marginBottom: '20px' }} gutter={[16, 16]}>
        <Col xxl={12} xl={12} md={12}>
          <label htmlFor="laboratorio">Selecciona el laboratorio</label>
          <br />
          <Select
            showSearch
            placeholder=""
            options={opcionesLaboratorio}
            style={{
              width: '200px',
              height: '30px',
              color: 'black',
              fontWeight: 'bold',
              marginBottom: '20px',
            }}
            onChange={(value) => setLaboratorio(value)}
            value={laboratorio}
          />
          <br />
          <label htmlFor="observaciones">Observaciones</label>
          <Input.TextArea
            rows="5"
            onChange={(e) => setObservaciones(e.target.value)}
            value={observaciones}
          />
        </Col>
        <Col xxl={12} xl={12} md={12} style={{ textAlign: 'right' }}>
          <label htmlFor="inputAddress">Fecha de ingreso al laboratorio</label>
          <div>
            <Tooltip title="Actualizar Fecha">
              <ClockCircleTwoTone
                style={{ marginRight: '10px', cursor: 'pointer', fontSize: '18px' }}
                onClick={isDisabled ? null : () => actualizarFecha()}
              />
            </Tooltip>
            {fechaActual}
          </div>
          <Divider />
          <label htmlFor="fecha_fase">Fecha de creación de la orden</label>
          <div>
            <Tooltip title="Actualizar Fecha">
              <ClockCircleTwoTone
                style={{ marginRight: '10px', cursor: 'pointer', fontSize: '18px' }}
                onClick={isDisabled ? null : () => actualizarFechaCreacionOrden()}
              />
            </Tooltip>
            {fechaCreacion ? moment(fechaCreacion).format('YYYY-MM-DD HH:mm:ss') : ''}
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
  );
};

export default CorreccionNuevo;
