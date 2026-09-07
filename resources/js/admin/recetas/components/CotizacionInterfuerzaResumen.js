import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = (
    <LoadingOutlined
        style={{ fontSize: 32, color: '#52c41a' }}
        spin
    />
);

const CotizacionInterfuerzaResumen = ({ loading = false, cotizacion }) => {
    if (!loading && !cotizacion) return null;

    console.log('CotizacionInterfuerzaResumen cotizacion:', cotizacion);

    const quote = cotizacion?.interfuerza?.[0]?.Quote || {};

    return (
        <div
            style={{
                marginBottom: '20px',
                position: 'relative',
                minHeight: loading ? '60px' : 'auto',
            }}
        >
            {loading && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 10,
                    }}
                >
                    <Spin
                        indicator={antIcon}
                        tip="Consultando cotización en Interfuerza..."
                        size="large"
                    />
                </div>
            )}

            {!loading && cotizacion && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px 40px',
                        padding: '12px 20px',
                        border: '2px solid blue',
                        borderRadius: '25px',
                        textAlign: 'center',
                    }}
                >
                    <div>
                        <b>Cotización:</b> {quote.id || '-'}
                    </div>

                    <div>
                        <b>Cliente:</b> {quote.Cliente || '-'}
                    </div>

                    <div>
                        <b>Nombre:</b> {quote.Nombre || '-'}
                    </div>

                    <div>
                        <b>Estado:</b> {quote.Status || '-'}
                    </div>

                    <div>
                        <b>Fecha:</b> {quote.Date || '-'}
                    </div>

                    <div>
                        <b>SubTotal:</b>{' '}
                        ${Number(quote.SubTotal || 0).toFixed(2)}
                    </div>

                    <div>
                        <b>Impuestos:</b>{' '}
                        ${Number(quote.Taxes || 0).toFixed(2)}
                    </div>

                    <div style={{ color: '#1677ff' }}>
                        <b>Total cotización:</b>{' '}
                        ${Number(quote.Total || 0).toFixed(2)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CotizacionInterfuerzaResumen;