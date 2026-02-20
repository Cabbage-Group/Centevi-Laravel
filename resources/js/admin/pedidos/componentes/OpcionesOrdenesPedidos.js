import { AutoComplete, Button, Col, DatePicker, Row, Select } from "antd";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchOrdenesPedidos, setStatusLoadingOrdenesPedidos } from "../../../redux/features/pedidos/ordenesPedidosSlice";
import { fetchProveedorMaterial } from "../../../redux/features/proveedor-material/proveedorMaterialSlice";

const { Option } = Select;
const { RangePicker } = DatePicker;

const OpcionesOrdenesPedidos = ({
    setEstadoFilter,
    setProveedorFilter,
    setFechaRange,
    onAplicar,
    onCrearPedido,
    pendientes = 0,
    realizados = 0,
    seleccionadas = 0,
}) => {
    const dispatch = useDispatch();
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [localFechas, setLocalFechas] = useState(null);
    const [localEstado, setLocalEstado] = useState(null);
    const [localProveedor, setLocalProveedor] = useState(null);
    const { proveedor_material_options_selecteds, status: statusProveedores } = useSelector(
        (state) => state.proveedorMaterial
    );
    
    useEffect(() => {
        if (debouncedSearch === '') {
            dispatch(setSearchOrdenesPedidos(''));
            return;
        }
        const timeoutId = setTimeout(() => {
            dispatch(setSearchOrdenesPedidos(debouncedSearch));
        }, 1250);
        return () => clearTimeout(timeoutId);
    }, [debouncedSearch, dispatch]);

    useEffect(() => {
        dispatch(fetchProveedorMaterial({}));
    }, [dispatch]);


    const handleAplicar = () => {
        setEstadoFilter(localEstado ?? '');
        setProveedorFilter(localProveedor ?? '');
        dispatch(setFechaRange({
            startDate: localFechas?.[0]?.format('YYYY-MM-DD') ?? '',
            endDate: localFechas?.[1]?.format('YYYY-MM-DD') ?? '',
        }));
        onAplicar();
    };
    const handleLimpiar = () => {
        setLocalFechas(null);
        setLocalEstado(null);
        setLocalProveedor(null);
        setDebouncedSearch('');
        setEstadoFilter('');
        setProveedorFilter('');
        dispatch(setSearchOrdenesPedidos(''));
        dispatch(setFechaRange({ startDate: '', endDate: '' }));
        onAplicar();
    };

    const cardStyle = {
        background: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: 8,
        padding: '16px 20px',
        marginBottom: 16,
    };

    const labelStyle = {
        fontSize: 12,
        fontWeight: 600,
        color: '#555',
        marginBottom: 6,
        display: 'block',
    };

    return (
        <div style={{ width: '100%' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
            }}>
                <Button
                    type="primary"
                    onClick={onCrearPedido}
                    style={{ background: '#28a745', borderColor: '#28a745' }}
                >
                    Crear Pedido
                </Button>

                <div style={{ display: 'flex', gap: 8 }}>
                    {[
                        { label: 'Pendientes', value: pendientes },
                        { label: 'Realizados', value: realizados },
                        { label: 'Seleccionadas', value: seleccionadas },
                    ].map(({ label, value }) => (
                        <div key={label} style={{
                            border: '1px solid #e8e8e8',
                            borderRadius: 8,
                            padding: '5px 16px',
                            background: '#fff',
                            fontSize: 13,
                            color: '#555',
                            fontWeight: 500,
                        }}>
                            {label}: <strong>{value}</strong>
                        </div>
                    ))}
                </div>
            </div>
            <Row gutter={16} align="stretch">
                <Col xxl={6} xl={6} lg={8} md={24} sm={24} xs={24}>
                    <div style={cardStyle}>
                        <span style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, display: 'block' }}>
                            Buscar
                        </span>
                        <label style={labelStyle}>Orden / Nro. orden:</label>
                        <AutoComplete
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Search..."
                            value={debouncedSearch}
                            onChange={(val) => {
                                dispatch(setStatusLoadingOrdenesPedidos());
                                setDebouncedSearch(val);
                            }}
                        />
                    </div>
                </Col>

                {/* ── Tarjeta Filtros ── */}
                <Col xxl={18} xl={18} lg={16} md={24} sm={24} xs={24}>
                    <div style={cardStyle}>
                        <span style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, display: 'block' }}>
                            Filtros
                        </span>
                        <Row gutter={[12, 12]} align="bottom">
                            <Col flex="1">
                                <label style={labelStyle}>Pedido material:</label>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Todos"
                                    value={localEstado}
                                    onChange={setLocalEstado}
                                    allowClear
                                >
                                    <Option value="Realizado">Realizado</Option>
                                    <Option value="Pendiente">Pendiente</Option>
                                </Select>
                            </Col>

                            <Col flex="2">
                                <label style={labelStyle}>Proveedor:</label>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Todos"
                                    value={localProveedor}
                                    onChange={setLocalProveedor}
                                    disabled={statusProveedores === 'loading'}
                                    loading={statusProveedores === 'loading'}
                                    showSearch
                                    filterOption={(input, option) =>
                                        option?.label?.toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={proveedor_material_options_selecteds.map((p) => ({
                                        label: p.label,
                                        value: p.label,
                                    }))}
                                    allowClear
                                />
                            </Col>

                            <Col flex="2">
                                <label style={labelStyle}>Rango de fechas:</label>
                                <RangePicker
                                    style={{ width: '100%' }}
                                    format="DD/MM/YYYY"
                                    value={localFechas}
                                    onChange={setLocalFechas}
                                    placeholder={['dd/mm/aaaa', 'dd/mm/aaaa']}
                                />
                            </Col>

                            <Col flex="none">
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <Button
                                        type="primary"
                                        onClick={handleAplicar}
                                        style={{ background: '#2c3e6b', borderColor: '#2c3e6b', whiteSpace: 'nowrap' }}
                                    >
                                        Buscar
                                    </Button>
                                    <Button onClick={handleLimpiar} style={{ whiteSpace: 'nowrap' }}>
                                        Reset
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default OpcionesOrdenesPedidos;