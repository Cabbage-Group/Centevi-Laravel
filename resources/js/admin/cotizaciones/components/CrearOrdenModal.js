import React from 'react';
import {
  Modal,
  Button,
  Table,
  InputNumber,
  Select,
  Divider,
} from 'antd';
import {
  CheckCircleFilled,
} from '@ant-design/icons';

const CrearOrdenModal = ({
  open,
  onCancel,
  quote,
  sucursales = [],
  idSucursal,
  setIdSucursal,
  onCrearOrden,
  ordenCreada,
  onVerOrden,
  onVerListaOrdenes,
}) => {
  const total = Number(quote?.Total || 0);

  const columns = [
    {
      dataIndex: 'label1',
      width: '28%',
      render: (text) => (
        <span style={{ color: '#666' }}>
          {text}
        </span>
      ),
    },
    {
      dataIndex: 'value1',
      width: '32%',
    },
    {
      dataIndex: 'label2',
      width: '18%',
      render: (text) => (
        <span style={{ color: '#666' }}>
          {text}
        </span>
      ),
    },
    {
      dataIndex: 'value2',
      width: '22%',
    },
  ];

  const dataSource = [
    {
      key: 1,
      label1: 'Cotización',
      value1: quote?.id,
      label2: 'Total',
      value2: `$${total.toFixed(2)}`,
    },
    {
      key: 2,
      label1: 'Paciente',
      value1: `${quote?.paciente?.nombres || ''} ${
        quote?.paciente?.apellidos || ''
      }`.trim(),
      label2: 'Cédula',
      value2: quote?.paciente?.nro_cedula || '-',
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={680}
      centered
      closable
      title={
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Convertir {quote?.id} en orden
          </div>

          {!ordenCreada && (
            <div
              style={{
                fontSize: 13,
                fontWeight: 400,
                color: '#888',
                marginTop: 4,
              }}
            >
              Conversión dentro del CRM
            </div>
          )}
        </div>
      }
    >
      {ordenCreada ? (
        <div
          style={{
            textAlign: 'center',
            padding: '38px 20px 10px',
          }}
        >
          <CheckCircleFilled
            style={{
              fontSize: 62,
              color: '#52c41a',
            }}
          />

          <div
            style={{
              fontSize: 20,
              marginTop: 22,
            }}
          >
            Orden{' '}
            <span
              style={{
                color: '#5269c9',
                fontWeight: 500,
              }}
            >
              {ordenCreada.nro_orden_id}
            </span>{' '}
            creada
          </div>

          <div
            style={{
              color: '#888',
              fontSize: 13,
              marginTop: 8,
            }}
          >
            $0.00 reservados y {total} por cobrar.
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
              marginTop: 48,
            }}
          >
            <Button onClick={onCancel}>
              Cerrar
            </Button>

            <Button onClick={onVerListaOrdenes}>
              Ver lista de órdenes
            </Button>

            <Button
              type="primary"
              onClick={() => onVerOrden(ordenCreada)}
            >
              Abrir {ordenCreada.nro_orden_id}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Table
            bordered
            pagination={false}
            size="small"
            showHeader={false}
            columns={columns}
            dataSource={dataSource}
          />

          <Divider style={{ margin: '20px 0' }} />

          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontWeight: 500,
                marginBottom: 8,
              }}
            >
              Sucursal
            </div>

            <Select
              placeholder="Seleccione una sucursal"
              style={{ width: '100%' }}
              value={idSucursal}
              onChange={setIdSucursal}
              options={sucursales}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 500,
                }}
              >
                Monto de la orden
              </div>

              <InputNumber
                value={total}
                disabled
                precision={2}
                prefix="$"
                style={{
                  width: 310,
                  marginTop: 8,
                }}
              />
            </div>

            <div
              style={{
                textAlign: 'right',
                minWidth: 160,
              }}
            >
              <div style={{ color: '#666' }}>
                Total
              </div>

              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                ${total.toFixed(2)}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
              marginTop: 24,
            }}
          >
            <Button onClick={onCancel}>
              Cancelar
            </Button>

            <Button
              type="primary"
              disabled={!idSucursal}
              onClick={onCrearOrden}
            >
              Crear orden
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default CrearOrdenModal;

