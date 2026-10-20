import React, { useMemo } from 'react';
import { Spin, InputNumber, Table } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import ResumenCards from './ResumenCards';

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

    const anticiposDisponiblesList = anticiposList.filter(
        (a) => toCents(a.disponible) > 0
    );

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
            anticiposDisponiblesList.reduce(
                (sum, a) => sum + toCents(a.monto),
                0
            ),
        [anticiposDisponiblesList]
    );

    const totalAnticipos = fromCents(totalAnticiposCents);

    const creditoDisponibleCents = useMemo(
        () =>
            anticiposDisponiblesList.reduce(
                (sum, a) => sum + toCents(a.disponible),
                0
            ),
        [anticiposDisponiblesList]
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
        loadingAnticipos ||
        anticiposList.length > 0 ||
        !!cotizacion;

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
                        <ResumenCards
                            title="Cotización Interfuerza"
                            items={[
                                { label: 'Cotización', value: quote.id || '-' },
                                { label: 'Estado', value: quote.Status || '-' },
                                { label: 'Fecha', value: quote.Date || '-' },
                                { label: 'SubTotal', value: `$${fromCents(toCents(quote.SubTotal)).toFixed(2)}` },
                                { label: 'Total cotización', value: `$${totalCotizacion.toFixed(2)}`, valueColor: '#1677ff' },
                            ]}
                        />
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
                        dataSource={anticiposDisponiblesList.map((a) => ({
                            ...a,
                            key: a.id_anticipo,
                        }))}
                        pagination={false}
                        bordered
                        size="small"
                    />

                    <div style={{ marginTop: '20px' }}>
                        <ResumenCards
                            items={[
                                { label: 'Total anticipos', value: `$${totalAnticipos.toFixed(2)}` },
                                { label: 'Se aplicará a esta orden', value: `$${totalAplicado.toFixed(2)}` },
                                { label: 'Crédito disponible', value: `$${creditoDisponible.toFixed(2)}` },
                                ...(totalCotizacionCents > 0
                                    ? [{
                                        label: 'Saldo por cobrar',
                                        value: `$${saldoPorCobrar.toFixed(2)}`,
                                        color: quedaPagado ? '#52c41a' : '#ff4d4f',
                                        valueColor: quedaPagado ? '#389e0d' : '#cf1322',
                                        hint: quedaPagado ? 'Quedará PAGADO' : undefined,
                                    }]
                                    : []),
                            ]}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CotizacionInterfuerzaResumen;

