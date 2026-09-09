import React, { useMemo } from 'react';
import { Spin, InputNumber, Table } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const toCents = (n) => Math.round(Number(n || 0) * 100);
const fromCents = (c) => c / 100;

const antIcon = (
    <LoadingOutlined
        style={{ fontSize: 32, color: '#52c41a' }}
        spin
    />
);

const CotizacionInterfuerzaResumen = ({
    loading = false,
    cotizacion,
    anticipos = [],
    montosAnticipos = {},
    onMontoAnticipoChange,
    loadingAnticipos = false,
}) => {
    const anticiposList = Array.isArray(anticipos) ? anticipos : [];

    const quote = cotizacion?.interfuerza?.[0]?.Quote || {};
    const totalCotizacionCents = toCents(quote.Total);
    const totalCotizacion = fromCents(totalCotizacionCents);

    const totalAplicadoCents = useMemo(
        () =>
            Object.values(montosAnticipos).reduce(
                (sum, m) => sum + toCents(m),
                0
            ),
        [montosAnticipos]
    );

    const totalAplicado = fromCents(totalAplicadoCents);

    const getMax = (record) => {
        const disponibleCents = toCents(record.disponible);

        if (!totalCotizacionCents) {
            return fromCents(disponibleCents);
        }

        const aplicadoActualCents = toCents(
            montosAnticipos[record.id_anticipo] || 0
        );

        const aplicadoEnOtrosCents =
            totalAplicadoCents - aplicadoActualCents;

        const saldoRestanteCents = Math.max(
            0,
            totalCotizacionCents - aplicadoEnOtrosCents
        );

        return fromCents(
            Math.min(
                disponibleCents,
                saldoRestanteCents
            )
        );
    };

    const handleMontoChange = (record, value) => {
        if (loadingAnticipos) return;

        const maxCents = toCents(getMax(record));

        let montoCents = toCents(value);

        if (montoCents < 0) {
            montoCents = 0;
        }

        if (montoCents > maxCents) {
            montoCents = maxCents;
        }

        onMontoAnticipoChange(
            record.id_anticipo,
            fromCents(montoCents)
        );
    };

    const totalAnticiposCents = useMemo(
        () =>
            anticiposList.reduce(
                (sum, a) => sum + toCents(a.monto),
                0
            ),
        [anticiposList]
    );

    const totalAnticipos = fromCents(totalAnticiposCents);

    const creditoDisponibleCents = Math.max(
        0,
        totalAnticiposCents - totalAplicadoCents
    );

    const creditoDisponible = fromCents(creditoDisponibleCents);

    const saldoPorCobrarCents = Math.max(
        0,
        totalCotizacionCents - totalAplicadoCents
    );

    const saldoPorCobrar = fromCents(saldoPorCobrarCents);

    const quedaPagado =
        totalCotizacionCents > 0 &&
        saldoPorCobrarCents <= 0;

    const mostrarCotizacion = loading || cotizacion;
    const mostrarAnticipos =
        loadingAnticipos || anticiposList.length > 0;

    if (!mostrarCotizacion && !mostrarAnticipos) {
        return null;
    }

    const columnsAnticipos = [
        {
            title: 'Referencia',
            dataIndex: 'referencia',
            key: 'referencia',
        },
        {
            title: 'Fecha',
            dataIndex: 'fecha',
            key: 'fecha',
        },
        {
            title: 'Tipo',
            dataIndex: 'tipo',
            key: 'tipo',
        },
        {
            title: 'Monto',
            dataIndex: 'monto',
            key: 'monto',
            render: (v) =>
                `$${fromCents(toCents(v)).toFixed(2)}`,
        },
        {
            title: 'Aplicar a esta orden',
            key: 'aplicado',
            render: (_, record) => (
                <InputNumber
                    style={{ width: '120px' }}
                    min={0}
                    max={getMax(record)}
                    precision={2}
                    value={montosAnticipos[record.id_anticipo] ?? 0}
                    onChange={(value) =>
                        handleMontoChange(record, value)
                    }
                    disabled={loadingAnticipos}
                />
            ),
        },
        {
            title: 'Disponible',
            key: 'disponible',
            render: (_, record) => {
                const disponibleCents = toCents(record.disponible);
                const aplicadoCents = toCents(
                    montosAnticipos[record.id_anticipo] || 0
                );

                const disponibleRestanteCents = Math.max(
                    0,
                    disponibleCents - aplicadoCents
                );

                return `$${fromCents(
                    disponibleRestanteCents
                ).toFixed(2)}`;
            },
        },
    ];

    return (
        <div style={{ marginBottom: '20px' }}>
            {mostrarCotizacion && (
                <div
                    style={{
                        position: 'relative',
                        minHeight: loading ? '60px' : 'auto',
                        marginBottom: mostrarAnticipos ? '20px' : 0,
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
                                backgroundColor:
                                    'rgba(255,255,255,0.7)',
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
                                <b>Cotización:</b>{' '}
                                {quote.id || '-'}
                            </div>

                            <div>
                                <b>Estado:</b>{' '}
                                {quote.Status || '-'}
                            </div>

                            <div>
                                <b>Fecha:</b>{' '}
                                {quote.Date || '-'}
                            </div>

                            <div>
                                <b>SubTotal:</b> $
                                {fromCents(
                                    toCents(quote.SubTotal)
                                ).toFixed(2)}
                            </div>

                            <div style={{ color: '#1677ff' }}>
                                <b>Total cotización:</b> $
                                {totalCotizacion.toFixed(2)}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {mostrarAnticipos && (
                <div style={{ position: 'relative' }}>
                    {loadingAnticipos && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor:
                                    'rgba(255,255,255,0.7)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 10,
                                flexDirection: 'column',
                            }}
                        >
                            <Spin
                                indicator={antIcon}
                                tip="Cargando anticipos del paciente..."
                                size="large"
                            />
                        </div>
                    )}

                    <h4>Anticipos disponibles del paciente</h4>

                    <Table
                        columns={columnsAnticipos}
                        dataSource={anticiposList.map((a) => ({
                            ...a,
                            key: a.id_anticipo,
                        }))}
                        pagination={false}
                        bordered
                        size="small"
                    />

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '12px 40px',
                            marginTop: '20px',
                            padding: '12px 20px',
                            textAlign: 'center',
                        }}
                    >
                        <div>
                            <b>Total anticipos:</b> $
                            {totalAnticipos.toFixed(2)}
                        </div>

                        <div>
                            <b>Se aplicará a esta orden:</b> $
                            {totalAplicado.toFixed(2)}
                        </div>

                        <div>
                            <b>Crédito disponible:</b> $
                            {creditoDisponible.toFixed(2)}
                        </div>

                        {totalCotizacionCents > 0 && (
                            <div
                                style={{
                                    color: quedaPagado
                                        ? 'green'
                                        : 'red',
                                }}
                            >
                                <b>Saldo por cobrar:</b> $
                                {saldoPorCobrar.toFixed(2)}{' '}
                                {quedaPagado &&
                                    '(quedará PAGADO)'}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CotizacionInterfuerzaResumen;

