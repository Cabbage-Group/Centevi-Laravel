import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Divider, Input, Row, Tooltip, Button, Select } from 'antd'
import moment from 'moment';
import {
  ClockCircleTwoTone
} from '@ant-design/icons';
import { actualizarDatosFase, setProveedor, updateLaboratorioEnviado } from '../../../../redux/features/ordenes/fasesOrdenesSlice';
import { fecthTiposFasesOrdenes } from '../../../../redux/features/ordenes/tiposFasesOrdenesSlice';
import { fetchPacientes } from '../../../../redux/features/pacientes/pacientesSlice';
import { createContactoOrden } from '../../../../redux/features/contacto-orden/ContactoOrdenSlice';
import VecesContacto from '../../VecesContacto';
import { fetchProveedorMaterial } from '../../../../redux/features/proveedor-material/proveedorMaterialSlice';
import Swal from 'sweetalert2';

const Enviado = forwardRef(({
  tipoFaseId,
  isDisabled,
  pacientesData,
  pacienteOrden,
  textoObs,
  setTextoObs,
  onGuardarObs,
  guardandoObs,
  modoEdicion,
  onCancelarEdicion
}, ref) => {
  console.log('Renderizando componente Enviado con props:', tipoFaseId)
  const dispatch = useDispatch();
  const [fechaActual, setFechaActual] = useState(moment().format('YYYY-MM-DD HH:mm:ss'))
  const [fechaCreacion, setFechaCreacion] = useState('')
  const [fechaFaseEnviado, setFechaFaseEnviado] = useState('');
  const tiposFasesOrdenes = useSelector((state) => state.tiposFasesOrdenes.tiposFasesOrdenes)
  const proveedor_material_options_selecteds = useSelector((state) => state.proveedorMaterial.proveedor_material_options_selecteds);
  const [observaciones, setObservaciones] = useState('');
  const { orderId } = useParams();
  const location = useLocation();
  const [laboratorio, setLaboratorio] = useState('');
  const [proveedorMaterial, setProveedorMaterial] = useState('');
  const [elaboradoFase, setElaboradoFase] = useState('');
  const [faseOrdenId, setFaseOrdenId] = useState();
  const [celular, setCelular] = useState('');
  const usuarioId = Number(localStorage.getItem('id_usuario'));
  const [mensaje, setMensaje] = useState(
    'Buenas Tardes, le escribimos de {sucursal} para informarle que los lentes de el Paciente {nombre} estan listo. Puede pasar a retirarlos en los siguientes horarios:  Lunes a Viernes de 9:00 am a 5:00 pm. sabados de 8:00 am a 12:00 pm. La esperamos, Saludos'
  );
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [selectedSucursal, setSelectedSucursal] = useState();
  const [ubicacionMaps, setUbicacionMaps] = useState('');
  const idUsuario = localStorage.getItem('id_usuario');
  const [status, setStatus] = useState('');
  const [opcionesLaboratorio, setOpcionesLaboratorio] = useState([]);
  console.log('pacienteOrden en Enviado:', pacienteOrden);
  const [loadingLaboratorio, setLoadingLaboratorio] = useState(false);
  const nombresBasesActuales = useSelector(
    (state) => state.fasesOrdenes.nombresBasesActuales
  );
  const [laboratorioOriginal, setLaboratorioOriginal] = useState('');


  useEffect(() => {
    dispatch(fetchProveedorMaterial({}))
  }, [])


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
          setFechaFaseEnviado(faseOrden2.fecha_fase);
        }
      }
    }
  }, [tiposFasesOrdenes, orderId, tipoFaseId]);

  useEffect(() => {
    if (tiposFasesOrdenes && tiposFasesOrdenes.length > 0) {

      console.log('Tipo de tiposFasesOrdenes encontrado:', tiposFasesOrdenes);
      const tipoFase = tiposFasesOrdenes.find(fase =>
        fase.fases_ordenes.some(faseOrden =>
          faseOrden.ordenes_id == orderId && faseOrden.tipo_fase_orden_id == tipoFaseId
        )
      );
      console.log('Tipo de fase encontrado:', tipoFase);
      if (tipoFase) {
        const faseOrden = tipoFase.fases_ordenes.find(faseOrden =>
          faseOrden.ordenes_id == orderId && faseOrden.tipo_fase_orden_id == tipoFaseId
        );
        if (faseOrden) {
          console.log('Fase Orden encontrada:', faseOrden);
          setObservaciones(faseOrden.observacion);
          setLaboratorio(faseOrden.laboratorio);
          setLaboratorioOriginal(faseOrden.laboratorio);
          setProveedorMaterial(faseOrden.proveedor_material);
          setFechaFaseEnviado(faseOrden.fecha_fase);
          setFechaActual(faseOrden.fecha_fase);
          setFechaCreacion(faseOrden.created_at);
          setFaseOrdenId(faseOrden.id);
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


  useEffect(() => {
    const nuevaFase = {
      tipo_fase_orden_id: tipoFaseId,
      laboratorio: laboratorio,
      proveedor_material: proveedorMaterial,
      observacion: observaciones,
      fecha_fase: fechaActual,
      elaborado_por: usuarioId,
    };
    dispatch(actualizarDatosFase(nuevaFase));
    dispatch(setProveedor(proveedorMaterial))


  }, [laboratorio, observaciones, fechaActual, tipoFaseId, dispatch, status, proveedorMaterial]);

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
  
  useImperativeHandle(ref, () => ({
    getInfoLaboratorio: () => ({
      laboratorio,
      laboratorioOriginal,
      cambio: laboratorio !== laboratorioOriginal,
    }),
    guardarLaboratorioAlAvanzar: async (faseOrdenIdNuevo) => {
      const idAUsar = faseOrdenIdNuevo || faseOrdenId;
      if (!laboratorio) return false;
      if (laboratorio === laboratorioOriginal) return true;

      await dispatch(
        updateLaboratorioEnviado({
          id: idAUsar,
          laboratorio,
          tipo: pacienteOrden?.correccion === 1 ? 'correccion' : 'orden',
          id_orden: pacienteOrden?.id_orden,
          id_correccion: pacienteOrden?.id_correccion || null,
          observacion: pacienteOrden?.observacion_pedido || null,
          ojo: pacienteOrden?.ojo || 'ambos',
          receta_od: [
            pacienteOrden?.esfera_od,
            pacienteOrden?.cilindro_od,
            pacienteOrden?.eje_od ? `${pacienteOrden.eje_od}°` : null,
          ].filter(Boolean).join(' ') || null,
          receta_oi: [
            pacienteOrden?.esfera_oi,
            pacienteOrden?.cilindro_oi,
            pacienteOrden?.eje_oi ? `${pacienteOrden.eje_oi}°` : null,
          ].filter(Boolean).join(' ') || null,
          add_od: pacienteOrden?.add_od || null,
          add_oi: pacienteOrden?.add_oi || null,
          prisma_od: pacienteOrden?.prisma_od || null,
          prisma_oi: pacienteOrden?.prisma_oi || null,
          material: proveedorMaterial || null,
          esfera_od: pacienteOrden?.esfera_od || null,
          esfera_oi: pacienteOrden?.esfera_oi || null,
          cilindro_od: pacienteOrden?.cilindro_od || null,
          cilindro_oi: pacienteOrden?.cilindro_oi || null,
          eje_od: pacienteOrden?.eje_od || null,
          eje_oi: pacienteOrden?.eje_oi || null,
          tipo_cristal_od: pacienteOrden?.tipo_cristal_od || null,
          tipo_cristal_oi: pacienteOrden?.tipo_cristal_oi || null,
          material_od: pacienteOrden?.material_od || null,
          material_oi: pacienteOrden?.material_oi || null,
          tratamientos_od: pacienteOrden?.tratamientos_od || null,
          tratamientos_oi: pacienteOrden?.tratamientos_oi || null,
          tipo_base_od: nombresBasesActuales.derecha || null,
          tipo_base_oi: nombresBasesActuales.izquierda || null,
        })
      ).unwrap();
      return true;
    }
  }), [laboratorio, laboratorioOriginal, faseOrdenId, proveedorMaterial, pacienteOrden, nombresBasesActuales]);

  return (
    <div>
      <Row
        style={{ marginBottom: '20px' }}
        gutter={[16, 16]}
      >
        <Col xxl={12} xl={12} md={12}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="laboratorio">Selecciona el laboratorio</label>
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
            {/* 
            {!pacienteOrden?.lente_contacto && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="otraOpcion">Selecciona el proveedor de material</label>
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
            )} */}
          </div>
          <label htmlFor="observaciones">
            {modoEdicion ? "Editando observación" : "Nueva observación"}
          </label>
          <Input.TextArea
            rows={5}
            placeholder="Escribe una observación..."
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
              disabled={!textoObs?.trim() || isDisabled}
              onClick={onGuardarObs}
            >
              {modoEdicion ? "Actualizar" : "Guardar observación"}
            </Button>
            {modoEdicion && (
              <Button size="small" onClick={onCancelarEdicion}>
                Cancelar
              </Button>
            )}
          </div>
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
                onClick={isDisabled ? null : () => actualizarFecha()}
              />
            </Tooltip>
            {fechaActual}
          </div>
          <Divider />
          <label htmlFor="inputAddress">
            Fecha de la fase confeccion
          </label>
          <div>
            {fechaFaseEnviado ? moment(fechaFaseEnviado).format('YYYY-MM-DD HH:mm:ss') : ""}
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
                {pacienteOrden?.dias_en_proceso ?? 0}
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
  )
});

export default Enviado