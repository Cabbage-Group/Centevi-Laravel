import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Divider, Input, Select, Tooltip, Button } from 'antd';
import { ClockCircleTwoTone } from '@ant-design/icons';
import { fecthTiposFasesOrdenes } from '../../../redux/features/ordenes/tiposFasesOrdenesSlice';
import { actualizarDatosFaseCorrecciones } from '../../../redux/features/correciones-ordenes/correccionesFasesOrdenesSlice';
import moment from 'moment';
import { useLocation, useParams } from 'react-router-dom';
import { createContactoCorreccionOrden } from '../../../redux/features/contacto-correccion-orden/ContactoCorreccionOrdenSlice';
import VecesContactoCorrecciones from '../VecesContactoCorrecciones';
import { fetchProveedorMaterial } from '../../../redux/features/proveedor-material/proveedorMaterialSlice';


const CorreccionNuevo = ({
  tipoFaseId,
  isDisabled,
  correcionOrden,
  textoObs,
  setTextoObs,
  onGuardarObs,
  guardandoObs,
  modoEdicion,
  onCancelarEdicion
}) => {
  const dispatch = useDispatch();
  const [fechaActual, setFechaActual] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [fechaCreacion, setFechaCreacion] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [faseOrdenId, setFaseOrdenId] = useState();
  const [laboratorio, setLaboratorio] = useState('');
  const [proveedorMaterial, setProveedorMaterial] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const tiposFasesOrdenes = useSelector((state) => state.tiposFasesOrdenes.tiposFasesOrdenes);
  const proveedor_material_options_selecteds = useSelector((state) => state.proveedorMaterial.proveedor_material_options_selecteds);
  const { correccionOrderId } = useParams();
  const [celular, setCelular] = useState('');
  const [mensaje, setMensaje] = useState(
    'Buenas Tardes, le escribimos de {sucursal} para informarle que los lentes de el Paciente {nombre} estan listo. Puede pasar a retirarlos en los siguientes horarios:  Lunes a Viernes de 9:00 am a 5:00 pm. sabados de 8:00 am a 12:00 pm. La esperamos, Saludos'
  );
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [selectedSucursal, setSelectedSucursal] = useState('');
  const [ubicacionMaps, setUbicacionMaps] = useState('');
  const [status, setStatus] = useState('');
  const idUsuario = localStorage.getItem('id_usuario');
  const [opcionesLaboratorio, setOpcionesLaboratorio] = useState([]);

  useEffect(() => {
    dispatch(fetchProveedorMaterial({}))
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
    if (correcionOrden?.lente_contacto) {
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
  }, [correcionOrden?.lente_contacto]);


  useEffect(() => {
    if (correccionOrderId) {
      dispatch(fecthTiposFasesOrdenes(correccionOrderId));
    }
  }, []);

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
          setProveedorMaterial(faseOrden.proveedor_material);
          setFechaActual(faseOrden.fecha_fase);
          setFechaCreacion(faseOrden.created_at);
          setFaseOrdenId(faseOrden.id)
        }
      }
    }
  }, [tiposFasesOrdenes, correccionOrderId, tipoFaseId]);

  useEffect(() => {
    {
      const nuevaFase = {
        tipo_fase_correccion_orden_id: tipoFaseId,
        laboratorio: laboratorio,
        observacion: observaciones,
        proveedor_material: proveedorMaterial,
        fecha_fase: fechaActual,
        created_at: fechaCreacion,
      };
      dispatch(actualizarDatosFaseCorrecciones(nuevaFase));
    }
  }, [laboratorio, observaciones, fechaActual, proveedorMaterial, tipoFaseId, dispatch, fechaCreacion, status]);

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
      correccion_ordenes_id: correcionOrden?.correccion_id,
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
          {/* <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

            {!correcionOrden?.lente_contacto && (
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
          </div> */}
          <label htmlFor="observaciones">
            {modoEdicion ? "Editando observacion" : "Nueva observacion"}
          </label>
          <Input.TextArea
            rows={5}
            placeholder="Escribe una observacion..."
            onChange={(e) => setTextoObs(e.target.value)}
            value={textoObs}
            disabled={isDisabled}
            style={{ borderColor: modoEdicion ? "#faad14" : undefined }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <Button
              type="primary"
              size="small"
              loading={guardandoObs}
              disabled={!textoObs?.trim()}
              onClick={onGuardarObs}
            >
              {modoEdicion ? "Actualizar" : "Guardar observacion"}
            </Button>
            {modoEdicion && (
              <Button size="small" onClick={onCancelarEdicion}>
                Cancelar
              </Button>
            )}
          </div>
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
          <label htmlFor="fecha_fase">Fecha de creacion de la orden</label>
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
            <VecesContactoCorrecciones
              correcionOrden={correcionOrden}
              id={correccionOrderId}
            />
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
