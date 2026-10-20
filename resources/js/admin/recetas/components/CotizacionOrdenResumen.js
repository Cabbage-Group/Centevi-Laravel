import React from 'react';
import { Table } from 'antd';
import ResumenCards from './ResumenCards';

const toCents = (n) => Math.round(Number(n || 0) * 100);
const money = (n) => `$${(toCents(n) / 100).toFixed(2)}`;

// Resumen de solo lectura de la cotización Interfuerza y anticipos aplicados a una orden
const CotizacionOrdenResumen = ({ pacienteOrden }) => {
    if (!pacienteOrden?.nro_cotizacion) return null;

    const anticipos = Array.isArray(pacienteOrden.orden_anticipos) ? pacienteOrden.orden_anticipos : [];
    const totalCents = toCents(pacienteOrden.cotizacion_total);
    const aplicadoCents = anticipos.reduce((sum, a) => sum + toCents(a.monto_aplicado), 0);
    const pagadoOrden = Number(pacienteOrden.pagado) === 1;
    const saldoCents = pagadoOrden ? 0 : Math.max(totalCents - aplicadoCents, 0);
    const pagado = pagadoOrden || (totalCents > 0 && saldoCents === 0);

    const columns = [
        { title: 'Referencia', dataIndex: 'referencia' },
        { title: 'Fecha', dataIndex: 'fecha' },
        { title: 'Tipo', dataIndex: 'tipo' },
        { title: 'Monto anticipo', dataIndex: 'monto', render: (v) => money(v) },
        { title: 'Aplicado a esta orden', dataIndex: 'monto_aplicado', render: (v) => money(v) },
    ];

    return (
        <div>
            <ResumenCards
                title="Cotización Interfuerza"
                items={[
                    { label: 'Cotización', value: pacienteOrden.nro_cotizacion },
                    { label: 'Estado', value: pacienteOrden.cotizacion_estado || '-' },
                    { label: 'Fecha', value: pacienteOrden.cotizacion_fecha || '-' },
                    { label: 'SubTotal', value: money(pacienteOrden.cotizacion_subtotal) },
                    { label: 'Total cotización', value: money(pacienteOrden.cotizacion_total), valueColor: '#1677ff' },
                ]}
            />

            {anticipos.length > 0 && (
                <>
                    <h4 style={{ marginBottom: '10px' }}>Anticipos aplicados</h4>
                    <Table
                        columns={columns}
                        dataSource={anticipos.map((a) => ({ ...a, key: a.id_anticipo }))}
                        pagination={false}
                        bordered
                        size="small"
                    />
                </>
            )}

            <div style={{ marginTop: '16px' }}>
                <ResumenCards
                    items={[
                        { label: 'Aplicado a esta orden', value: money(aplicadoCents / 100) },
                        {
                            label: 'Saldo por cobrar',
                            value: money(saldoCents / 100),
                            color: pagado ? '#52c41a' : '#ff4d4f',
                            valueColor: pagado ? '#389e0d' : '#cf1322',
                            hint: pagado ? 'PAGADO' : undefined,
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export default CotizacionOrdenResumen;
