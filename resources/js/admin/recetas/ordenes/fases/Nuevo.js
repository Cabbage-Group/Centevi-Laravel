import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Divider, Input, Row, Select, Tooltip, Button, Space } from 'antd';
import moment from 'moment';
import { ClockCircleTwoTone, ConsoleSqlOutlined } from '@ant-design/icons';
import { actualizarDatosFase, setProveedor } from '../../../../redux/features/ordenes/fasesOrdenesSlice';
import { fecthTiposFasesOrdenes } from '../../../../redux/features/ordenes/tiposFasesOrdenesSlice';
import { useParams, useLocation } from 'react-router-dom';
import { createContactoOrden } from '../../../../redux/features/contacto-orden/ContactoOrdenSlice';
import VecesContacto from '../../VecesContacto';
import { fetchProveedorMaterial } from '../../../../redux/features/proveedor-material/proveedorMaterialSlice';


const Nuevo = ({ tipoFaseId, isDisabled, pacientesData, pacienteOrden }) => {
  const dispatch = useDispatch();
  const [fechaActual, setFechaActual] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [fechaCreacion, setFechaCreacion] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [faseOrdenId, setFaseOrdenId] = useState();
  const [laboratorio, setLaboratorio] = useState('');
  const [proveedorMaterial, setProveedorMaterial] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [elaboradoFase, setElaboradoFase] = useState('');
  const tiposFasesOrdenes = useSelector((state) => state.tiposFasesOrdenes.tiposFasesOrdenes);
  const proveedor_material_options_selecteds = useSelector((state) => state.proveedorMaterial.proveedor_material_options_selecteds);
  const { orderId } = useParams();
  const usuarioId = Number(localStorage.getItem('id_usuario'));
  const [celular, setCelular] = useState('');
  const [mensaje, setMensaje] = useState(
    'Buenas Tardes, le escribimos de {sucursal} para informarle que los lentes de el Paciente {nombre} estan listo. Puede pasar a retirarlos en los siguientes horarios:  Lunes a Viernes de 9:00 am a 5:00 pm. sabados de 8:00 am a 12:00 pm. La esperamos, Saludos'
  );
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [selectedSucursal, setSelectedSucursal] = useState('');
  const [ubicacionMaps, setUbicacionMaps] = useState('');
  const [status, setStatus] = useState('');
  const idUsuario = localStorage.getItem('id_usuario');
  const [opcionesLaboratorio, setOpcionesLaboratorio] = useState([]);

  useEffect(() => {
    dispatch(fetchProveedorMaterial())
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
    if (pacienteOrden?.lente_contacto) {
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
  }, [pacienteOrden?.lente_contacto]);

  useEffect(() => {
    if (orderId) {
      dispatch(fecthTiposFasesOrdenes(orderId));
    }
  }, []);

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
      const tipoFase = tiposFasesOrdenes.find((fase) =>
        fase.fases_ordenes.some(
          (faseOrden) =>
            faseOrden.ordenes_id == orderId && faseOrden.tipo_fase_orden_id == tipoFaseId
        )
      );

      if (tipoFase) {
        const faseOrden = tipoFase.fases_ordenes.find(
          (faseOrden) =>
            faseOrden.ordenes_id == orderId && faseOrden.tipo_fase_orden_id == tipoFaseId
        );

        if (faseOrden) {
          setLaboratorio(faseOrden.laboratorio);
          setObservaciones(faseOrden.observacion);
          setProveedorMaterial(faseOrden.proveedor_material);
          setFechaActual(faseOrden.fecha_fase);
          setFechaCreacion(faseOrden.created_at);
          setFaseOrdenId(faseOrden.id);
          setElaboradoFase(faseOrden.elaborado_por);
        }
      }
    }
  }, [tiposFasesOrdenes, orderId, tipoFaseId]);

  useEffect(() => {
    const nuevaFase = {
      tipo_fase_orden_id: tipoFaseId,
      laboratorio: laboratorio,
      observacion: observaciones,
      proveedor_material: proveedorMaterial,
      fecha_fase: fechaActual,
      elaborado_por: usuarioId,
      created_at: fechaCreacion,
    };
    dispatch(actualizarDatosFase(nuevaFase));
    dispatch(setProveedor(proveedorMaterial))

  }, [laboratorio, observaciones, fechaActual, tipoFaseId, fechaCreacion, status, proveedorMaterial]);

  const getColorForStatus = (status) => {
    const colors = {
      Ok: 'green',
      Advertencia: 'yellow',
      Critico: 'red',
      Completado: 'blue',
    };
    return colors[status] || 'gray';
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
      <Row style={{ marginBottom: '20px' }} gutter={[16, 16]}>
        <Col xxl={12} xl={12} md={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div>
              <label htmlFor="laboratorio">Selecciona el laboratorio</label>
              <br />
              <Select
                showSearch
                placeholder="Selecciona un laboratorio"
                options={opcionesLaboratorio}
                style={{
                  width: '200px',
                  height: '30px',
                  color: 'black',
                  fontWeight: 'bold',
                }}
                onChange={(value) => setLaboratorio(value)}
                value={laboratorio}
              />
            </div>

            {!pacienteOrden?.lente_contacto && (
              <div>
                <label htmlFor="otraOpcion">Selecciona el proveedor de material</label>
                <br />
                <Select
                  showSearch
                  placeholder="Selecciona un proveedor"
                  options={proveedor_material_options_selecteds}
                  style={{
                    width: '200px',
                    height: '30px',
                    color: 'black',
                    fontWeight: 'bold',
                  }}
                  onChange={(value) => setProveedorMaterial(value)}
                  value={proveedorMaterial}
                />
              </div>
            )}
          </div>
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
                backgroundColor: getColorForStatus(status),
                marginRight: '5px',
              }}
            ></div>
            <span>{status || 'Sin estado'}</span>
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
};

export default Nuevo;
