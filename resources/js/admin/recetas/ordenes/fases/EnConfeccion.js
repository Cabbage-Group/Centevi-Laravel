import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Divider, Input, Row, Tooltip, Button, Select } from 'antd';
import moment from 'moment';
import {
  ClockCircleTwoTone
} from '@ant-design/icons';
import { fecthTiposFasesOrdenes } from '../../../../redux/features/ordenes/tiposFasesOrdenesSlice';
import { actualizarDatosFase, setNombresBasesActuales, } from '../../../../redux/features/ordenes/fasesOrdenesSlice';
import { createContactoOrden } from '../../../../redux/features/contacto-orden/ContactoOrdenSlice';
import { fetchBases } from '../../../../redux/features/bases/basesSlice';
import VecesContacto from '../../VecesContacto';

const EnConfeccion = ({
  tipoFaseId,
  isDisabled,
  pacientesData,
  pacienteOrden,
  onBasesValidasChange,
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
  const [fechaIngresoLaboratorio, setFechaIngresoLaboratorio] = useState('');
  const tiposFasesOrdenes = useSelector((state) => state.tiposFasesOrdenes.tiposFasesOrdenes);
  const proveedor = useSelector((state) => state.fasesOrdenes.proveedor);
  const { bases, loading } = useSelector((state) => state.bases);
  const [observaciones, setObservaciones] = useState('');
  const [baseOjoIzquierdoId, setBaseOjoIzquierdoId] = useState(null);
  const [baseOjoDerechoId, setBaseOjoDerechoId] = useState(null);
  const { orderId } = useParams();
  const [elaboradoFase, setElaboradoFase] = useState('');
  const [laboratorio, setLaboratorio] = useState('');
  const [proveedorMaterial, setProveedorMaterial] = useState('');
  const [faseOrdenId, setFaseOrdenId] = useState();
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
  const [lenteContacto, setLenteContacto] = useState(0);

  console.log('baseOjoIzquierdoId', baseOjoIzquierdoId)
  useEffect(() => {
    if (orderId) {
      dispatch(fecthTiposFasesOrdenes(orderId));
    }
    dispatch(fetchBases({}));
  }, []);



  useEffect(() => {
    if (pacienteOrden) {
      setSelectedPaciente(pacienteOrden?.id_paciente)
      setSelectedSucursal(pacienteOrden?.sucursal_nombre)
      setUbicacionMaps(pacienteOrden?.sucursal_ubicacion)
      setStatus(pacienteOrden?.status_primera_fase)
      setLenteContacto(pacienteOrden?.lente_contacto || 0)
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
      const faseOrden = tiposFasesOrdenes
        .flatMap((tipoFaseOrden) => tipoFaseOrden.fases_ordenes)
        .find((fasesOrden) =>
          fasesOrden.tipo_fase_orden_id == tipoFaseId &&
          fasesOrden.ordenes_id == orderId
        );
      setBaseOjoIzquierdoId(
        faseOrden?.base_ojo_izquierdo_id != null
          ? Number(faseOrden.base_ojo_izquierdo_id)
          : null
      );
      setBaseOjoDerechoId(
        faseOrden?.base_ojo_derecho_id != null
          ? Number(faseOrden.base_ojo_derecho_id)
          : null
      );
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
      proveedor_material: proveedorMaterial,
      observacion: observaciones,
      fecha_fase: fechaActual,
      elaborado_por: usuarioId,
      base_ojo_izquierdo_id: baseOjoIzquierdoId,
      base_ojo_derecho_id: baseOjoDerechoId,
    };
    dispatch(actualizarDatosFase(nuevaFase));
  }, [observaciones, baseOjoIzquierdoId, baseOjoDerechoId, fechaActual, tipoFaseId, dispatch, status]);

  useEffect(() => {
    if (!loading && bases?.length && baseOjoIzquierdoId) {
      setBaseOjoIzquierdoId(baseOjoIzquierdoId);
    }
    if (!loading && bases?.length && baseOjoDerechoId) {
      setBaseOjoDerechoId(baseOjoDerechoId);
    }
  }, [loading, bases]);

  useEffect(() => {
    if (!bases?.length) return;

    const baseIzquierda = bases.find(
      (b) => Number(b.id) === Number(baseOjoIzquierdoId)
    );

    const baseDerecha = bases.find(
      (b) => Number(b.id) === Number(baseOjoDerechoId)
    );

    dispatch(
      setNombresBasesActuales({
        izquierda: baseIzquierda
          ? `${baseIzquierda.codigo}`
          : null,

        derecha: baseDerecha
          ? `${baseDerecha.codigo}`
          : null,
      })
    );
  }, [baseOjoIzquierdoId, baseOjoDerechoId, bases, dispatch]);
  
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
      ordenes_id: orderId,
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

  const basesValidas = () => {
    if (lenteContacto === 1) {
      return true;
    }
    return baseOjoIzquierdoId !== null && baseOjoDerechoId !== null;
  };

  useEffect(() => {
    window.basesValidasEnConfeccion = basesValidas();
  }, [baseOjoIzquierdoId, baseOjoDerechoId, lenteContacto]);

  useEffect(() => {
    const validas = basesValidas();
    window.basesValidasEnConfeccion = validas;

    if (onBasesValidasChange) {
      onBasesValidasChange(validas);
    }
  }, [baseOjoIzquierdoId, baseOjoDerechoId, lenteContacto]);

  return (
    <div>
      <Row
        style={{ marginBottom: '20px' }}
        gutter={[16, 16]}
      >
        <Col xxl={15} xl={15} md={12}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
          }}>
            <div>
              <label htmlFor="laboratorio">
                Base Ojo Izquierdo{lenteContacto === 0 ? ' *' : ''}
              </label>
              <br />
              <Select
                showSearch
                optionFilterProp="label"
                placeholder={loading ? "Cargando bases..." : "Selecciona una base"}
                loading={loading}
                disabled={loading}
                options={(bases ?? []).map((base) => ({
                  value: Number(base.id),
                  label: `${base.codigo} - ${base.descripcion}`,
                }))}
                style={{
                  width: '350px',
                  height: '30px',
                  color: 'black',
                  fontWeight: 'bold',
                }}
                onChange={(value) => setBaseOjoIzquierdoId(Number(value))}
                value={!loading ? baseOjoIzquierdoId : undefined}
                status={!baseOjoIzquierdoId && !loading && lenteContacto === 0 ? "error" : ""}
              />
            </div>

            <div>
              <label htmlFor="otraOpcion">
                Base Ojo Derecho{lenteContacto === 0 ? ' *' : ''}
              </label>
              <br />
              <Select
                showSearch
                optionFilterProp="label"
                placeholder={loading ? "Cargando bases..." : "Selecciona una base"}
                loading={loading}
                disabled={loading}
                options={(bases ?? []).map((base) => ({
                  value: Number(base.id),
                  label: `${base.codigo} - ${base.descripcion}`,
                }))}
                style={{
                  width: '350px',
                  height: '30px',
                  color: 'black',
                  fontWeight: 'bold',
                }}
                onChange={(value) => setBaseOjoDerechoId(Number(value))}
                value={!loading ? baseOjoDerechoId : undefined}
                status={!baseOjoDerechoId && !loading && lenteContacto === 0 ? "error" : ""}
              />
            </div>
          </div>

          {lenteContacto === 0 && (!baseOjoIzquierdoId || !baseOjoDerechoId) && (
            <div style={{
              color: 'red',
              fontSize: '12px',
              marginBottom: '10px',
              marginTop: '-10px'
            }}>
              * Ambas bases son obligatorias
            </div>
          )}

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
              disabled={!textoObs?.trim() || isDisabled}
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
        <Col
          xxl={9} xl={9} md={12}
          style={{
            textAlign: 'right'
          }}
        >
          <label htmlFor="inputAddress">
            Fecha de la fase confeccion
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
  );
}

export default EnConfeccion;
