import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { InputNumber, Button, Table, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { fetchAnticiposDisponibles, guardarAnticipos } from '../../redux/features/anticipos/anticiposSlice';

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

    const anticiposList = Array.isArray(anticipos) ? anticipos : [];

    const usadoOriginalPorAnticipo = useMemo(() => {
        const map = {};
        (ordenAnticiposActuales || []).forEach((oa) => {
            map[oa.id_anticipo] = Number(oa.monto_aplicado || 0);
        });
        return map;
    }, [ordenAnticiposActuales]);

    useEffect(() => {
        if (!loading) {
            setMontos(usadoOriginalPorAnticipo);
        }
    }, [usadoOriginalPorAnticipo, loading]);

    const getEffectiveMax = (record) => {
        const usadoOriginal = usadoOriginalPorAnticipo[record.id_anticipo] || 0;
        return Number(record.disponible) + usadoOriginal;
    };

    const handleMontoChange = (record, value) => {
        if (loading) return;
        const effectiveMax = getEffectiveMax(record);
        let monto = value === null || value === undefined ? 0 : Number(value);
        if (monto < 0) monto = 0;
        if (monto > effectiveMax) monto = effectiveMax;
        setMontos((prev) => ({ ...prev, [record.id_anticipo]: monto }));
    };

    const totalAplicado = useMemo(
        () => Object.values(montos).reduce((sum, m) => sum + (Number(m) || 0), 0),
        [montos]
    );

    const totalAnticipos = useMemo(
        () => anticiposList.reduce((sum, a) => sum + Number(a.monto), 0),
        [anticiposList]
    );

    const creditoDisponible = totalAnticipos - totalAplicado;
    const saldoPorCobrar = Math.max(0, Number(totalCotizacion || 0) - totalAplicado);
    const quedaPagado = saldoPorCobrar <= 0;

    const handleGuardar = async () => {
        if (loading) return;
        const aplicaciones = anticiposList.map((a) => ({
            id_anticipo: a.id_anticipo,
            monto_aplicado: Number(montos[a.id_anticipo] || 0),
        }));

        setSaving(true);
        try {
            const result = await dispatch(guardarAnticipos({ ordenId, aplicaciones })).unwrap();

            if (idPaciente) {
                dispatch(fetchAnticiposDisponibles(idPaciente));
            }

            Swal.fire({
                icon: 'success',
                title: 'Anticipos guardados',
                text: result?.orden?.pagado ? 'La orden quedó marcada como Pagada.' : 'Saldo pendiente actualizado.',
            });
            onSaved?.(result.orden);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.message || 'No se pudieron guardar los anticipos.',
            });
        } finally {
            setSaving(false);
        }
    };

    const columns = [
        { title: 'Referencia', dataIndex: 'referencia', key: 'referencia' },
        { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
        { title: 'Tipo', dataIndex: 'tipo', key: 'tipo' },
        { title: 'Monto', dataIndex: 'monto', key: 'monto', render: (v) => `$${Number(v).toFixed(2)}` },
        {
            title: 'Aplicado a la orden',
            key: 'aplicado',
            render: (_, record) => (
                <InputNumber
                    style={{ width: '120px' }}
                    min={0}
                    max={getEffectiveMax(record)}
                    precision={2}
                    value={montos[record.id_anticipo] ?? 0}
                    onChange={(value) => handleMontoChange(record, value)}
                    disabled={loading}
                />
            ),
        },
        {
            title: 'Disponible',
            key: 'disponible',
            render: (_, record) => {
                const usadoAqui = Number(montos[record.id_anticipo] || 0);
                const effectiveMax = getEffectiveMax(record);
                return `$${(effectiveMax - usadoAqui).toFixed(2)}`;
            },
        },
    ];

    const antIcon = <LoadingOutlined style={{ fontSize: 32, color: '#52c41a' }} spin />;

    return (
        <div style={{ marginTop: '20px', position: 'relative' }}>
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
                        flexDirection: 'column',
                    }}
                >
                    <Spin indicator={antIcon} tip="Cargando anticipos, por favor espere..." size="large" />
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4>Anticipos y saldos</h4>
                <Button type="primary" loading={saving} disabled={loading} onClick={handleGuardar}>
                    Guardar anticipos
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={anticiposList.map((a) => ({ ...a, key: a.id_anticipo }))}
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
                <div><b>Total anticipos:</b> ${totalAnticipos.toFixed(2)}</div>
                <div><b>Aplicado a esta orden:</b> ${totalAplicado.toFixed(2)}</div>
                <div><b>Crédito disponible:</b> ${creditoDisponible.toFixed(2)}</div>
                <div style={{ color: quedaPagado ? 'green' : 'red' }}>
                    <b>Saldo por cobrar:</b> ${saldoPorCobrar.toFixed(2)} {quedaPagado && '(quedará PAGADO)'}
                </div>
            </div>
        </div>
    );
};

export default AnticiposOrdenTable;