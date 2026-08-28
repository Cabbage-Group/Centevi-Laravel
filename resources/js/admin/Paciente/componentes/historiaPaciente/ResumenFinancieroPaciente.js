// components/pacientes/ResumenFinancieroPaciente.jsx
import React from 'react';
import { Table } from 'antd';

const ResumenFinancieroPaciente = ({ resumen }) => {
    if (!resumen) return null;

    const columns = [
        { title: 'Referencia', dataIndex: 'referencia', key: 'referencia' },
        { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
        { title: 'Tipo', dataIndex: 'tipo', key: 'tipo' },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            render: (estado) => (
                <span
                    style={{
                        background: estado === 'ACTIVE' ? '#e6f7ee' : '#fbe6e6',
                        color: estado === 'ACTIVE' ? '#1a7f4b' : '#c0392b',
                        padding: '2px 10px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                    }}
                >
                    {estado === 'ACTIVE' ? 'ACTIVO' : estado}
                </span>
            ),
        },
        { title: 'Monto', dataIndex: 'monto', key: 'monto', render: (v) => `$${Number(v).toFixed(2)}` },
        { title: 'Aplicado', dataIndex: 'aplicado', key: 'aplicado', render: (v) => `$${Number(v).toFixed(2)}` },
        { title: 'Disponible', dataIndex: 'disponible', key: 'disponible', render: (v) => `$${Number(v).toFixed(2)}` },
    ];

    const cardStyle = {
        flex: 1,
        background: '#fff',
        borderRadius: '8px',
        padding: '15px',
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,.08)',
    };

    return (

        <div
            className="card component-card_7 mb-4"
            style={{
                background: 'rgb(0 150 136 / 11%)',
                width: '96%',
                left: '2%',
                padding: '15px',
            }}
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
                        ${Number(resumen?.anticipos_recibidos || 0).toFixed(2)}
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
                        ${Number(resumen?.aplicado_a_ordenes || 0).toFixed(2)}
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
                        ${Number(resumen?.credito_disponible || 0).toFixed(2)}
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
                        ${Number(resumen?.saldo_por_pagar || 0).toFixed(2)}
                    </div>
                </div>
            </div>

            {/* TABLA */}
            <div className="table-responsive-md">
                <Table
                    columns={columns}
                    dataSource={(resumen?.detalle || []).map((d, i) => ({
                        ...d,
                        key: i,
                    }))}
                    pagination={false}
                    size="small"
                />
            </div>
        </div>
    );
};

export default ResumenFinancieroPaciente;