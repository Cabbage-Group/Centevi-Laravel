// components/pacientes/ResumenFinancieroPaciente.jsx
import React, { useMemo, useState } from 'react';
import { Select, Skeleton, Table } from 'antd';

const ESTADO_DEFAULT = 'PEND-APPLY';

const money = (v) => `$${Number(v || 0).toFixed(2)}`;
const sumMonto = (lista) => lista.reduce((acc, d) => acc + Number(d.monto || 0), 0);
const sortText = (field) => (a, b) => String(a[field] || '').localeCompare(String(b[field] || ''));
const sortNum = (field) => (a, b) => Number(a[field] || 0) - Number(b[field] || 0);

const ResumenFinancieroPaciente = ({ resumen, loading }) => {
    const [estadosFiltro, setEstadosFiltro] = useState([ESTADO_DEFAULT]);

    const detalle = useMemo(
        () => (resumen?.detalle || []).map((d, i) => ({ ...d, key: d.referencia || i })),
        [resumen]
    );

    const estadosDisponibles = useMemo(
        () => [...new Set(detalle.map((d) => d.estado).filter(Boolean))].sort(),
        [detalle]
    );

    // Sin estados seleccionados se muestran todos
    const detalleFiltrado = useMemo(
        () => estadosFiltro.length
            ? detalle.filter((d) => estadosFiltro.includes(d.estado))
            : detalle,
        [detalle, estadosFiltro]
    );

    const columns = [
        { title: 'Referencia', dataIndex: 'referencia', key: 'referencia', sorter: sortText('referencia') },
        { title: 'Fecha', dataIndex: 'fecha', key: 'fecha', sorter: sortText('fecha'), defaultSortOrder: 'descend' },
        { title: 'Tipo', dataIndex: 'tipo', key: 'tipo', sorter: sortText('tipo') },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            sorter: sortText('estado'),
            render: (estado) => (
                <span
                    style={{
                        background: estado === ESTADO_DEFAULT ? '#e6f7ee' : '#fbe6e6',
                        color: estado === ESTADO_DEFAULT ? '#1a7f4b' : '#c0392b',
                        padding: '2px 10px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                    }}
                >
                    {String(estado || '').toUpperCase()}
                </span>
            ),
        },
        { title: 'Monto', dataIndex: 'monto', key: 'monto', sorter: sortNum('monto'), render: money },
        { title: 'Aplicado', dataIndex: 'aplicado', key: 'aplicado', sorter: sortNum('aplicado'), render: money },
        { title: 'Disponible', dataIndex: 'disponible', key: 'disponible', sorter: sortNum('disponible'), render: money },
    ];

    const contenedorStyle = {
        background: 'rgb(0 150 136 / 11%)',
        width: '96%',
        left: '2%',
        padding: '15px',
    };

    const cardStyle = {
        flex: 1,
        background: '#fff',
        borderRadius: '8px',
        padding: '15px',
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,.08)',
    };

    if (loading) {
        return (
            <div className="card component-card_7 mb-4" style={contenedorStyle}>
                <Skeleton active title={{ width: '40%' }} paragraph={{ rows: 2 }} />
                <Skeleton active title={false} paragraph={{ rows: 5 }} />
            </div>
        );
    }

    if (!resumen) return null;

    return (

        <div
            className="card component-card_7 mb-4"
            style={contenedorStyle}
        >
            <h6 className="p-3">RESUMEN FINANCIERO DEL PACIENTE:</h6>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    gap: '15px',
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                }}
            >
                <div style={cardStyle}>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                        Anticipos recibidos
                    </div>

                    <div
                        style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#000',
                        }}
                    >
                        {money(resumen?.anticipos_recibidos)}
                    </div>
                </div>

                <div style={cardStyle}>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                        Aplicado a órdenes
                    </div>

                    <div
                        style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#a3855b',
                        }}
                    >
                        {money(resumen?.aplicado_a_ordenes)}
                    </div>
                </div>

                <div style={cardStyle}>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                        Crédito disponible
                    </div>

                    <div
                        style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#16a34a',
                        }}
                    >
                        {money(resumen?.credito_disponible)}
                    </div>
                </div>

                <div style={cardStyle}>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                        Saldo por pagar
                    </div>

                    <div
                        style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color:
                                Number(resumen?.saldo_por_pagar || 0) > 0
                                    ? '#dc2626'
                                    : '#16a34a',
                        }}
                    >
                        {money(resumen?.saldo_por_pagar)}
                    </div>
                </div>
            </div>

            {/* FILTROS Y TOTALES */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px',
                    flexWrap: 'wrap',
                    marginBottom: '10px',
                }}
            >
                <Select
                    mode="multiple"
                    allowClear
                    placeholder="Todos los estados"
                    value={estadosFiltro}
                    onChange={setEstadosFiltro}
                    options={estadosDisponibles.map((e) => ({ value: e, label: e }))}
                    style={{ minWidth: '260px' }}
                />

                <div style={{ fontSize: '13px' }}>
                    Mostrando <b>{detalleFiltrado.length}</b> anticipos ({money(sumMonto(detalleFiltrado))})
                    {' '}de <b>{detalle.length}</b> en total ({money(sumMonto(detalle))})
                </div>
            </div>

            {/* TABLA */}
            <div className="table-responsive-md">
                <Table
                    columns={columns}
                    dataSource={detalleFiltrado}
                    pagination={false}
                    size="small"
                />
            </div>
        </div>
    );
};

export default ResumenFinancieroPaciente;
