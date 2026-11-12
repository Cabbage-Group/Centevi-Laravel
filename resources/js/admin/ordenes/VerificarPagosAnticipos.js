import React, { useRef, useState } from 'react';
import { Modal, Button, Table, Tag, Progress, Alert } from 'antd';
import { FaSyncAlt } from 'react-icons/fa';
import axios from 'axios';
import moment from 'moment';
import API from '../../config/config.js';

const ESTADOS = {
  en_cola: { color: 'default', texto: 'En cola' },
  procesando: { color: 'processing', texto: 'Procesando...' },
  pagado: { color: 'success', texto: 'Pasó a pagado' },
  pendiente: { color: 'warning', texto: 'Sigue abonado' },
  omitida: { color: 'default', texto: 'Omitida' },
  error: { color: 'error', texto: 'Error' },
};

const money = (value) => `$${(Number(value) || 0).toFixed(2)}`;

// Versión sin modal (se usa al entrar al reporte de órdenes financieras): procesa todas las
// órdenes candidatas una por una y devuelve el resumen de resultados.
export const verificarPagosAnticiposEnLote = async ({ onProgreso, debeDetener } = {}) => {
  const { data } = await axios.get(`${API}/ordenes-abonadas/con-anticipos`);
  const candidatas = data.data || [];
  const resumen = { total: candidatas.length, procesadas: 0, pagado: 0, pendiente: 0, omitida: 0, error: 0 };

  onProgreso?.({ ...resumen });

  for (const orden of candidatas) {
    if (debeDetener?.()) break;
    try {
      const { data: res } = await axios.post(`${API}/ordenes/${orden.id_orden}/verificar-pago-anticipos`);
      resumen[res.resultado] = (resumen[res.resultado] || 0) + 1;
    } catch (err) {
      resumen.error += 1;
    }
    resumen.procesadas += 1;
    onProgreso?.({ ...resumen });
  }

  return resumen;
};

// Verifica en lote las órdenes abonadas con anticipos (desde el 01/10/2026):
// si todos sus anticipos están CLOSED en Interfuerza, pasan a pagado (misma lógica del botón de la tabla).
const VerificarPagosAnticipos = ({ onFinish, buttonProps = {}, label = 'Verificar pagos de anticipos' }) => {
  const [open, setOpen] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [finalizado, setFinalizado] = useState(false);
  const [ordenes, setOrdenes] = useState([]);
  const [error, setError] = useState(null);
  const detenerRef = useRef(false);

  const actualizarFila = (id_orden, cambios) =>
    setOrdenes((prev) => prev.map((o) => (o.id_orden === id_orden ? { ...o, ...cambios } : o)));

  const abrir = async () => {
    setOpen(true);
    setFinalizado(false);
    setError(null);
    setOrdenes([]);
    setCargando(true);
    try {
      const { data } = await axios.get(`${API}/ordenes-abonadas/con-anticipos`);
      setOrdenes(data.data.map((o) => ({ ...o, estado: 'en_cola', mensaje: '', pendientes: [] })));
    } catch (err) {
      setError(err?.response?.data?.mensaje || 'No se pudieron obtener las órdenes abonadas.');
    } finally {
      setCargando(false);
    }
  };

  const iniciar = async () => {
    detenerRef.current = false;
    setProcesando(true);
    let pasaronAPagado = 0;

    for (const orden of ordenes) {
      if (detenerRef.current) break;
      if (orden.estado !== 'en_cola') continue;

      actualizarFila(orden.id_orden, { estado: 'procesando' });
      try {
        const { data } = await axios.post(`${API}/ordenes/${orden.id_orden}/verificar-pago-anticipos`);
        if (data.resultado === 'pagado') pasaronAPagado += 1;
        actualizarFila(orden.id_orden, {
          estado: data.resultado,
          mensaje: data.mensaje,
          pendientes: data.pendientes || [],
        });
      } catch (err) {
        actualizarFila(orden.id_orden, {
          estado: 'error',
          mensaje: err?.response?.data?.mensaje || 'Error al verificar la orden',
        });
      }
    }

    setProcesando(false);
    setFinalizado(true);
    if (pasaronAPagado > 0 && onFinish) onFinish();
  };

  const cerrar = () => {
    detenerRef.current = true;
    setOpen(false);
  };

  const conteo = (estado) => ordenes.filter((o) => o.estado === estado).length;
  const procesadas = ordenes.filter((o) => !['en_cola', 'procesando'].includes(o.estado)).length;
  const porcentaje = ordenes.length ? Math.round((procesadas / ordenes.length) * 100) : 0;

  const columns = [
    { title: 'Orden', dataIndex: 'nro_orden_id', width: 90 },
    {
      title: 'Fecha',
      dataIndex: 'fecha_orden',
      width: 100,
      render: (v) => (v ? moment(v).format('DD/MM/YYYY') : ''),
    },
    { title: 'Paciente', dataIndex: 'paciente', ellipsis: true },
    {
      title: 'Sucursal',
      dataIndex: 'sucursal',
      ellipsis: true,
      render: (v) => (v || '').replace('CENTEVI', '').trim(),
    },
    { title: 'Anticipos', dataIndex: 'total_anticipos', width: 85, align: 'center' },
    { title: 'Aplicado', dataIndex: 'total_aplicado', width: 100, align: 'right', render: money },
    {
      title: 'Resultado',
      dataIndex: 'estado',
      width: 150,
      render: (estado, o) => (
        <div>
          <Tag color={ESTADOS[estado]?.color}>{ESTADOS[estado]?.texto}</Tag>
          {o.mensaje && <div style={{ fontSize: 11, color: '#888ea8', marginTop: 2 }}>{o.mensaje}</div>}
        </div>
      ),
    },
  ];

  const filaPendientes = (o) => (
    <table style={{ width: '100%', fontSize: 12 }}>
      <thead>
        <tr style={{ color: '#888ea8' }}>
          <th style={{ textAlign: 'left', padding: 4 }}>Referencia</th>
          <th style={{ textAlign: 'right', padding: 4 }}>Monto</th>
          <th style={{ textAlign: 'center', padding: 4 }}>Estado</th>
        </tr>
      </thead>
      <tbody>
        {o.pendientes.map((a) => (
          <tr key={a.referencia}>
            <td style={{ padding: 4, fontWeight: 600 }}>{a.referencia}</td>
            <td style={{ padding: 4, textAlign: 'right' }}>{money(a.monto)}</td>
            <td style={{ padding: 4, textAlign: 'center' }}>
              <Tag color="orange">{a.estado || 'SIN ESTADO'}</Tag>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <Button icon={<FaSyncAlt style={{ marginRight: 6 }} />} onClick={abrir} {...buttonProps}>
        {label}
      </Button>

      <Modal
        open={open}
        title="Verificar pagos de órdenes abonadas"
        width={900}
        onCancel={cerrar}
        maskClosable={!procesando}
        destroyOnClose
        footer={[
          <Button key="cerrar" onClick={cerrar}>
            {procesando ? 'Detener y cerrar' : 'Cerrar'}
          </Button>,
          !finalizado && (
            <Button
              key="iniciar"
              type="primary"
              loading={procesando}
              disabled={cargando || ordenes.length === 0}
              onClick={iniciar}
            >
              {procesando ? 'Procesando...' : `Iniciar verificación (${ordenes.length})`}
            </Button>
          ),
        ]}
      >
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 12 }}
          message="Órdenes abonadas con anticipos aplicados, creadas a partir del 1 de octubre de 2026 en adelante."
          description="Se consulta en Interfuerza el estado de los anticipos de cada orden. Si todos están en CLOSED, la orden pasa a pagado; si alguno no lo está, la orden se queda en abonado."
        />

        {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 12 }} />}

        {(procesando || finalizado) && (
          <div style={{ marginBottom: 12 }}>
            <Progress percent={porcentaje} size="small" status={procesando ? 'active' : 'normal'} />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 12 }}>
              <Tag color="success">Pasaron a pagado: {conteo('pagado')}</Tag>
              <Tag color="warning">Siguen abonado: {conteo('pendiente')}</Tag>
              <Tag>Omitidas: {conteo('omitida')}</Tag>
              <Tag color="error">Errores: {conteo('error')}</Tag>
              <Tag>Procesadas: {procesadas} / {ordenes.length}</Tag>
            </div>
          </div>
        )}

        <Table
          size="small"
          rowKey="id_orden"
          columns={columns}
          dataSource={ordenes}
          loading={cargando}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          scroll={{ x: 'max-content' }}
          locale={{ emptyText: cargando ? 'Cargando...' : 'No hay órdenes abonadas con anticipos para verificar' }}
          expandable={{
            expandedRowRender: filaPendientes,
            rowExpandable: (o) => o.pendientes.length > 0,
          }}
        />
      </Modal>
    </>
  );
};

export default VerificarPagosAnticipos;
