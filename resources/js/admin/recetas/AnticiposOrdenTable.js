import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { InputNumber, Button, Table, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import {
    fetchAnticiposDisponibles,
    guardarAnticipos
} from '../../redux/features/anticipos/anticiposSlice';

const toCents = (n) => Math.round(Number(n || 0) * 100);
const fromCents = (c) => c / 100;

const AnticiposOrdenTable = ({
    ordenId,
    idPaciente,
    anticipos = [],
    totalCotizacion,
    ordenAnticiposActuales = [],
    loading = false,
    onSaved
}) => {
    const dispatch = useDispatch();

    const [montos, setMontos] = useState({});
    const [saving, setSaving] = useState(false);

    const anticiposList = Array.isArray(anticipos)
        ? anticipos
        : [];

    const totalCotizacionCents = toCents(totalCotizacion);

    console.log('========== ANTICIPOS ORDEN RENDER ==========');
    console.log('ordenId:', ordenId);
    console.log('idPaciente:', idPaciente);
    console.log('totalCotizacion RAW:', totalCotizacion);
    console.log('totalCotizacionCents:', totalCotizacionCents);
    console.log('loading:', loading);
    console.log('anticipos RAW:', anticipos);
    console.log('anticiposList:', anticiposList);
    console.log('ordenAnticiposActuales:', ordenAnticiposActuales);
    console.log('montos actual:', montos);
    console.log('=============================================');

    const usadoOriginalPorAnticipo = useMemo(() => {
        const map = {};

        (ordenAnticiposActuales || []).forEach((oa) => {
            map[oa.id_anticipo] = Number(
                oa.monto_aplicado || 0
            );
        });

        console.log(
            '========== USADO ORIGINAL POR ANTICIPO =========='
        );
        console.log(
            'ordenAnticiposActuales:',
            ordenAnticiposActuales
        );
        console.log(
            'usadoOriginalPorAnticipo:',
            map
        );
        console.log(
            '================================================='
        );

        return map;
    }, [ordenAnticiposActuales]);

    useEffect(() => {
        console.log(
            '========== useEffect INICIALIZANDO MONTOS =========='
        );
        console.log('loading:', loading);
        console.log(
            'usadoOriginalPorAnticipo:',
            usadoOriginalPorAnticipo
        );

        if (!loading) {
            setMontos(usadoOriginalPorAnticipo);

            console.log(
                'setMontos ejecutado con:',
                usadoOriginalPorAnticipo
            );
        }

        console.log(
            '==================================================='
        );
    }, [usadoOriginalPorAnticipo, loading]);

    const totalAplicadoCents = useMemo(
        () =>
            Object.values(montos).reduce(
                (sum, m) => sum + toCents(m),
                0
            ),
        [montos]
    );

    const totalAplicado = fromCents(
        totalAplicadoCents
    );

    console.log('========== CALCULO TOTAL APLICADO ==========');
    console.log('montos:', montos);
    console.log(
        'Object.values(montos):',
        Object.values(montos)
    );
    console.log(
        'totalAplicadoCents:',
        totalAplicadoCents
    );
    console.log('totalAplicado:', totalAplicado);
    console.log('============================================');

    const getEffectiveMax = (record) => {
        const usadoOriginal =
            usadoOriginalPorAnticipo[
                record.id_anticipo
            ] || 0;

        const disponibleRecord = Number(
            record.disponible || 0
        );

        const maxPorAnticipoCents =
            toCents(disponibleRecord) +
            toCents(usadoOriginal);

        if (!totalCotizacionCents) {
            console.log(
                '========== EFFECTIVE MAX SIN COTIZACION =========='
            );
            console.log('record:', record);
            console.log(
                'disponibleRecord:',
                disponibleRecord
            );
            console.log(
                'usadoOriginal:',
                usadoOriginal
            );
            console.log(
                'maxPorAnticipoCents:',
                maxPorAnticipoCents
            );
            console.log(
                '=================================================='
            );

            return fromCents(
                maxPorAnticipoCents
            );
        }

        const montoActual = Number(
            montos[record.id_anticipo] || 0
        );

        const aplicadoEnOtrosCents =
            totalAplicadoCents -
            toCents(montoActual);

        const saldoRestanteCents = Math.max(
            0,
            totalCotizacionCents -
                aplicadoEnOtrosCents
        );

        const effectiveMaxCents = Math.min(
            maxPorAnticipoCents,
            saldoRestanteCents
        );

        console.log(
            '========== EFFECTIVE MAX =========='
        );
        console.log('record:', record);
        console.log(
            'id_anticipo:',
            record.id_anticipo
        );
        console.log(
            'record.disponible:',
            record.disponible
        );
        console.log(
            'usadoOriginal:',
            usadoOriginal
        );
        console.log(
            'montoActual:',
            montoActual
        );
        console.log(
            'maxPorAnticipoCents:',
            maxPorAnticipoCents
        );
        console.log(
            'maxPorAnticipo:',
            fromCents(maxPorAnticipoCents)
        );
        console.log(
            'totalCotizacionCents:',
            totalCotizacionCents
        );
        console.log(
            'totalCotizacion:',
            totalCotizacion
        );
        console.log(
            'totalAplicadoCents:',
            totalAplicadoCents
        );
        console.log(
            'aplicadoEnOtrosCents:',
            aplicadoEnOtrosCents
        );
        console.log(
            'aplicadoEnOtros:',
            fromCents(aplicadoEnOtrosCents)
        );
        console.log(
            'saldoRestanteCents:',
            saldoRestanteCents
        );
        console.log(
            'saldoRestante:',
            fromCents(saldoRestanteCents)
        );
        console.log(
            'effectiveMaxCents:',
            effectiveMaxCents
        );
        console.log(
            'effectiveMax:',
            fromCents(effectiveMaxCents)
        );
        console.log(
            '===================================='
        );

        return fromCents(
            effectiveMaxCents
        );
    };

    const handleMontoChange = (
        record,
        value
    ) => {
        if (loading) return;

        const effectiveMax =
            getEffectiveMax(record);

        let monto =
            value === null ||
            value === undefined
                ? 0
                : Number(value);

        const montoOriginal = monto;

        if (monto < 0) {
            monto = 0;
        }

        if (monto > effectiveMax) {
            monto = effectiveMax;
        }

        console.log(
            '========== CAMBIO MONTO ANTICIPO =========='
        );
        console.log('record:', record);
        console.log(
            'id_anticipo:',
            record.id_anticipo
        );
        console.log(
            'value recibido:',
            value
        );
        console.log(
            'monto convertido:',
            montoOriginal
        );
        console.log(
            'effectiveMax:',
            effectiveMax
        );
        console.log(
            'monto final:',
            monto
        );
        console.log(
            'montos ANTES:',
            montos
        );
        console.log(
            'totalAplicado ANTES:',
            totalAplicado
        );
        console.log(
            'totalCotizacion:',
            totalCotizacion
        );
        console.log(
            '==========================================='
        );

        setMontos((prev) => {
            const nuevoMontos = {
                ...prev,
                [record.id_anticipo]: monto
            };

            console.log(
                'montos DESPUES:',
                nuevoMontos
            );

            return nuevoMontos;
        });
    };

    const totalAnticiposCents = useMemo(
        () =>
            anticiposList.reduce(
                (sum, a) =>
                    sum + toCents(a.monto),
                0
            ),
        [anticiposList]
    );

    const totalAnticipos = fromCents(
        totalAnticiposCents
    );

    const creditoDisponibleCents =
        Math.max(
            0,
            totalAnticiposCents -
                totalAplicadoCents
        );

    const creditoDisponible = fromCents(
        creditoDisponibleCents
    );

    const saldoPorCobrarCents =
        Math.max(
            0,
            totalCotizacionCents -
                totalAplicadoCents
        );

    const saldoPorCobrar = fromCents(
        saldoPorCobrarCents
    );

    const quedaPagado =
        totalCotizacionCents > 0 &&
        totalAplicadoCents >=
            totalCotizacionCents;

    console.log('========== RESUMEN FINAL ==========');
    console.log(
        'totalCotizacion RAW:',
        totalCotizacion
    );
    console.log(
        'totalCotizacionCents:',
        totalCotizacionCents
    );
    console.log(
        'totalAnticipos:',
        totalAnticipos
    );
    console.log(
        'totalAnticiposCents:',
        totalAnticiposCents
    );
    console.log(
        'montos:',
        montos
    );
    console.log(
        'totalAplicado:',
        totalAplicado
    );
    console.log(
        'totalAplicadoCents:',
        totalAplicadoCents
    );
    console.log(
        'creditoDisponible:',
        creditoDisponible
    );
    console.log(
        'creditoDisponibleCents:',
        creditoDisponibleCents
    );
    console.log(
        'saldoPorCobrar:',
        saldoPorCobrar
    );
    console.log(
        'saldoPorCobrarCents:',
        saldoPorCobrarCents
    );
    console.log(
        'quedaPagado:',
        quedaPagado
    );
    console.log(
        'CONDICION 1 totalCotizacion > 0:',
        totalCotizacionCents > 0
    );
    console.log(
        'CONDICION 2 aplicado >= cotizacion:',
        totalAplicadoCents >=
            totalCotizacionCents
    );
    console.log(
        '==================================='
    );

    const handleGuardar = async () => {
        if (loading) return;

        const aplicaciones =
            anticiposList.map((a) => ({
                id_anticipo: a.id_anticipo,
                monto_aplicado: Number(
                    montos[a.id_anticipo] || 0
                ),
            }));

        console.log(
            '========== GUARDAR ANTICIPOS =========='
        );
        console.log('ordenId:', ordenId);
        console.log(
            'idPaciente:',
            idPaciente
        );
        console.log(
            'totalCotizacion:',
            totalCotizacion
        );
        console.log(
            'montos:',
            montos
        );
        console.log(
            'aplicaciones:',
            aplicaciones
        );
        console.log(
            'totalAplicado:',
            totalAplicado
        );
        console.log(
            'saldoPorCobrar:',
            saldoPorCobrar
        );
        console.log(
            'quedaPagado:',
            quedaPagado
        );
        console.log(
            '======================================='
        );

        setSaving(true);

        try {
            const result =
                await dispatch(
                    guardarAnticipos({
                        ordenId,
                        aplicaciones
                    })
                ).unwrap();

            console.log(
                '========== RESPUESTA GUARDAR =========='
            );
            console.log(
                'result:',
                result
            );
            console.log(
                'orden result:',
                result?.orden
            );
            console.log(
                'pagado backend:',
                result?.orden?.pagado
            );
            console.log(
                '========================================'
            );

            if (idPaciente) {
                dispatch(
                    fetchAnticiposDisponibles(
                        idPaciente
                    )
                );
            }

            Swal.fire({
                icon: 'success',
                title: 'Anticipos guardados',
                text:
                    result?.orden?.pagado
                        ? 'La orden quedó marcada como Pagada.'
                        : 'Saldo pendiente actualizado.',
            });

            onSaved?.(result.orden);
        } catch (error) {
            console.error(
                '========== ERROR GUARDAR ANTICIPOS =========='
            );
            console.error('error:', error);
            console.error(
                'error message:',
                error?.message
            );
            console.error(
                '============================================='
            );

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text:
                    error?.message ||
                    'No se pudieron guardar los anticipos.',
            });
        } finally {
            setSaving(false);
        }
    };

    const columns = [
        {
            title: 'Referencia',
            dataIndex: 'referencia',
            key: 'referencia'
        },
        {
            title: 'Fecha',
            dataIndex: 'fecha',
            key: 'fecha'
        },
        {
            title: 'Tipo',
            dataIndex: 'tipo',
            key: 'tipo'
        },
        {
            title: 'Monto',
            dataIndex: 'monto',
            key: 'monto',
            render: (v) =>
                `$${Number(v || 0).toFixed(2)}`
        },
        {
            title: 'Aplicado a la orden',
            key: 'aplicado',
            render: (_, record) => {
                const effectiveMax =
                    getEffectiveMax(record);

                return (
                    <InputNumber
                        style={{
                            width: '120px'
                        }}
                        min={0}
                        max={effectiveMax}
                        precision={2}
                        value={
                            montos[
                                record.id_anticipo
                            ] ?? 0
                        }
                        onChange={(value) =>
                            handleMontoChange(
                                record,
                                value
                            )
                        }
                        disabled={
                            loading || saving
                        }
                    />
                );
            },
        },
        {
            title: 'Disponible',
            key: 'disponible',
            render: (_, record) => {
                const usadoAqui =
                    Number(
                        montos[
                            record.id_anticipo
                        ] || 0
                    );

                const usadoOriginal =
                    usadoOriginalPorAnticipo[
                        record.id_anticipo
                    ] || 0;

                const maxPorAnticipo =
                    fromCents(
                        toCents(
                            record.disponible
                        ) +
                            toCents(
                                usadoOriginal
                            )
                    );

                const disponibleActual =
                    Math.max(
                        0,
                        toCents(
                            maxPorAnticipo
                        ) -
                            toCents(
                                usadoAqui
                            )
                    );

                console.log(
                    '========== COLUMNA DISPONIBLE =========='
                );
                console.log(
                    'id_anticipo:',
                    record.id_anticipo
                );
                console.log(
                    'record.disponible:',
                    record.disponible
                );
                console.log(
                    'usadoOriginal:',
                    usadoOriginal
                );
                console.log(
                    'usadoAqui:',
                    usadoAqui
                );
                console.log(
                    'maxPorAnticipo:',
                    maxPorAnticipo
                );
                console.log(
                    'disponibleActual:',
                    fromCents(
                        disponibleActual
                    )
                );
                console.log(
                    '========================================'
                );

                return `$${fromCents(
                    disponibleActual
                ).toFixed(2)}`;
            },
        },
    ];

    const antIcon = (
        <LoadingOutlined
            style={{
                fontSize: 32,
                color: '#52c41a'
            }}
            spin
        />
    );

    return (
        <div
            style={{
                marginTop: '20px',
                position: 'relative'
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
                        flexDirection: 'column',
                    }}
                >
                    <Spin
                        indicator={antIcon}
                        tip="Cargando anticipos, por favor espere..."
                        size="large"
                    />
                </div>
            )}

            <div
                style={{
                    display: 'flex',
                    justifyContent:
                        'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                }}
            >
                <h4>
                    Anticipos y saldos
                </h4>

                <Button
                    type="primary"
                    loading={saving}
                    disabled={
                        loading || saving
                    }
                    onClick={
                        handleGuardar
                    }
                >
                    Guardar anticipos
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={anticiposList.map(
                    (a) => ({
                        ...a,
                        key: a.id_anticipo
                    })
                )}
                pagination={false}
                bordered
                size="small"
            />

            <div
                style={{
                    display: 'flex',
                    justifyContent:
                        'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px 40px',
                    marginTop: '20px',
                    padding: '12px 20px',
                    textAlign: 'center',
                }}
            >
                <div>
                    <b>
                        Total anticipos:
                    </b>{' '}
                    $
                    {totalAnticipos.toFixed(
                        2
                    )}
                </div>

                <div>
                    <b>
                        Aplicado a esta orden:
                    </b>{' '}
                    $
                    {totalAplicado.toFixed(
                        2
                    )}
                </div>

                <div>
                    <b>
                        Crédito disponible:
                    </b>{' '}
                    $
                    {creditoDisponible.toFixed(
                        2
                    )}
                </div>

                <div
                    style={{
                        color:
                            quedaPagado
                                ? 'green'
                                : 'red'
                    }}
                >
                    <b>
                        Saldo por cobrar:
                    </b>{' '}
                    $
                    {saldoPorCobrar.toFixed(
                        2
                    )}{' '}
                    {quedaPagado &&
                        '(quedará PAGADO)'}
                </div>
            </div>
        </div>
    );
};

export default AnticiposOrdenTable;