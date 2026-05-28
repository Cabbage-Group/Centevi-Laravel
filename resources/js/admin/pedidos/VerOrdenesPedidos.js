import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Tooltip,
    Typography,
    Table,
    Button,
    Modal,
    Skeleton,
    Checkbox,
} from "antd";
import { EyeOutlined, FilePdfOutlined, EditOutlined, HistoryOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { createMermaPedidos, fecthOrdenesPedidos, setFechaRangeOrdenesPedidos } from "../../redux/features/pedidos/ordenesPedidosSlice";
import OpcionesOrdenesPedidos from "./componentes/OpcionesOrdenesPedidos";
import ModalCrearPedido from "./componentes/ModalCrearPedido";
import ModalHistorialOrden from "./componentes/ModalHistorialOrden";
import Swal from "sweetalert2";
const { Text } = Typography;


const VerOrdenesPedidos = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        ordenesPedidos,
        startDate,
        endDate,
        status,
        error,
        meta,
        search,
        orderId,
        totalPendientes,
        totalRealizados
    } =
        useSelector((state) => state.ordenesPedidos);

    const getSucursalInicial = () => {
        const ip = localStorage.getItem('ip');
        const sucursalPorIp = {
            '186.74.2.218': null,
            '190.219.45.142': 3,
            '45.229.196.9': 4,
            '190.34.23.233': 11,
        };
        return sucursalPorIp[ip] ? [sucursalPorIp[ip]] : [];
    };

    const [showOrden, setShowOrden] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showOrdenSize, setShowOrdenSize] = useState(false);
    const [loadingPdfSize, setLoadingPdfSize] = useState(false);
    const [urlPdfOrdenSize, setUrlPdfOrdenSize] = useState(null);
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [urlPdfOrden, setUrlPdfOrden] = useState(null);
    const [sucursalFilter, setSucursalFilter] = useState(getSucursalInicial || []);
    const [doctorFilter, setDoctorFilter] = useState([]);
    const [showModalPedido, setShowModalPedido] = useState(false);
    const [showModalHistorial, setShowModalHistorial] = useState(false);
    const [ordenHistorialId, setOrdenHistorialId] = useState(null);
    const [nroOrdenIdHistorial, setnroOrdenIdHistorial] = useState(null);
    const [aplicarFiltros, setAplicarFiltros] = useState(false);
    const [estadoFilter, setEstadoFilter] = useState('');
    const [proveedorFilter, setProveedorFilter] = useState('');
    const [historialEsCorreccion, setHistorialEsCorreccion] = useState(false);
    const [historialCorreccionId, setHistorialCorreccionId] = useState(null);
    const [loadingMerma, setLoadingMerma] = useState(null);
    const [loading, setIsLoading] = useState();

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]);

    const currentPageIds = (ordenesPedidos || []).map((o) => o.nro_orden_id);

    const seleccionables = currentPageIds.filter((id) => {
        const orden = ordenesPedidos.find((o) => o.nro_orden_id === id);
        return orden?.pedido_material !== 'Realizado';
    });

    const allCurrentSelected =
        seleccionables.length > 0 &&
        seleccionables.every((id) => selectedRowKeys.includes(id));
    const someCurrentSelected =
        seleccionables.some((id) => selectedRowKeys.includes(id)) &&
        !allCurrentSelected;

    const seleccionadas = selectedRowKeys.length;

    const handleSelectAll = (e) => {
        const seleccionables = currentPageIds.filter((id) => {
            const orden = ordenesPedidos.find((o) => o.nro_orden_id === id);
            return orden?.pedido_material !== 'Realizado';
        });

        if (e.target.checked) {
            setSelectedRowKeys((prev) => [
                ...prev,
                ...seleccionables.filter((id) => !prev.includes(id)),
            ]);
            setSelectedOrders((prev) => {
                const prevIds = prev.map((o) => o.nro_orden_id);
                const nuevas = ordenesPedidos.filter(
                    (o) => seleccionables.includes(o.nro_orden_id) && !prevIds.includes(o.nro_orden_id)
                );
                return [...prev, ...nuevas];
            });
        } else {
            setSelectedRowKeys((prev) => prev.filter((id) => !seleccionables.includes(id)));
            setSelectedOrders((prev) => prev.filter((o) => !seleccionables.includes(o.nro_orden_id)));
        }
    };

    const handleSelectRow = (id, checked) => {
        const orden = ordenesPedidos.find((o) => o.nro_orden_id === id);
        if (orden?.pedido_material === 'Realizado') return;

        if (checked) {
            setSelectedRowKeys((prev) => [...prev, id]);
            setSelectedOrders((prev) =>
                prev.find((o) => o.nro_orden_id === id) ? prev : [...prev, orden]
            );
        } else {
            setSelectedRowKeys((prev) => prev.filter((k) => k !== id));
            setSelectedOrders((prev) => prev.filter((o) => o.nro_orden_id !== id));
        }
    };

    const handleAbrirHistorial = (record) => {
        setOrdenHistorialId(record.es_correccion ? record.id_real : record.id_orden);
        setnroOrdenIdHistorial(record.nro_orden_id)
        setHistorialEsCorreccion(record.es_correccion ?? false);
        setHistorialCorreccionId(record.es_correccion ? record.id_real : null);
        setShowModalHistorial(true);
    };


    useEffect(() => {
        dispatch(fecthOrdenesPedidos({
            page: 1,
            limit: 20,
            search: '',
            sucursal: sucursalFilter,
            doctor: [],
            startDate: '',
            endDate: '',
            estado: '',
            proveedor: '',
        }));
    }, []);

    useEffect(() => {
        if (aplicarFiltros) return;
        let isCurrent = true;
        setIsLoading(true);
        dispatch(fecthOrdenesPedidos({
            page: currentPage,
            limit: 20,
            search,
            sucursal: sucursalFilter,
            doctor: doctorFilter,
            startDate,
            endDate,
            estado: estadoFilter,
            proveedor: proveedorFilter,
        })).then(() => {
            if (isCurrent) setIsLoading(false);
        });
        return () => { isCurrent = false; };
    }, [dispatch, currentPage, search, startDate, endDate]);

    useEffect(() => {
        if (!aplicarFiltros) return;
        let isCurrent = true;
        setIsLoading(true);
        dispatch(fecthOrdenesPedidos({
            page: 1,
            limit: 20,
            search,
            sucursal: sucursalFilter,
            doctor: doctorFilter,
            startDate,
            endDate,
            estado: estadoFilter,
            proveedor: proveedorFilter,
        })).then(() => {
            if (isCurrent) {
                setIsLoading(false);
                setAplicarFiltros(false);
                setCurrentPage(1);
            }
        });
        return () => { isCurrent = false; };
    }, [aplicarFiltros]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleAgregarMerma = async (record) => {
        console.log('record', record)
        if (!record.id_pedido) return;

        const ojoInicial = record.pedido_ojo ?? 'ambos';

        const { isConfirmed, value } = await Swal.fire({
            title: "¿Agregar merma?",
            html: `
                <p style="margin-bottom: 12px;">
                    Se registrará una merma para la orden <strong>#${record.nro_orden_id ?? record.nro_orden_id}</strong>.
                    El pedido asociado cambiará automáticamente a estado <strong>Pendiente</strong>.
                </p>
            `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2c3e6b",
            cancelButtonColor: "#aaa",
            confirmButtonText: "Sí, agregar merma",
            cancelButtonText: "Cancelar"
        });

        if (!isConfirmed || !value) return;

        const ojo = value.ojo;
        const soloOD = ojo === 'od';
        const soloOI = ojo === 'oi';

        setLoadingMerma(record.id_orden);
        try {
            await dispatch(createMermaPedidos({
                orden_id: record.es_correccion ? null : record.id_orden,
                correccion_id: record.es_correccion ? record.id_real : null,
                receta_od: soloOI ? null : record.receta_od,
                receta_oi: soloOD ? null : record.receta_oi,
                add_od: soloOI ? null : record.add_od,
                add_oi: soloOD ? null : record.add_oi,
                prisma_od: soloOI ? null : record.prisma_od,
                prisma_oi: soloOD ? null : record.prisma_oi,
                esfera_od: soloOI ? null : record.esfera_od,
                esfera_oi: soloOD ? null : record.esfera_oi,
                cilindro_od: soloOI ? null : record.cilindro_od,
                cilindro_oi: soloOD ? null : record.cilindro_oi,
                eje_od: soloOI ? null : record.eje_od,
                eje_oi: soloOD ? null : record.eje_oi,
                tipo_cristal_od: soloOI ? null : record.tipo_cristal_od,
                tipo_cristal_oi: soloOD ? null : record.tipo_cristal_oi,
                material_od: soloOI ? null : record.material_od,
                material_oi: soloOD ? null : record.material_oi,
                tratamientos_od: soloOI ? null : record.tratamientos_od,
                tratamientos_oi: soloOD ? null : record.tratamientos_oi,
                tipo_base_od: soloOD ? null : record.tipo_base_od ?? null,
                tipo_base_oi: soloOI ? null : record.tipo_base_oi ?? null,
                material: record.material,
            })).unwrap();

            const resultado = await dispatch(fecthOrdenesPedidos({
                page: currentPage,
                limit: 20,
                search,
                sucursal: sucursalFilter,
                doctor: doctorFilter,
                startDate,
                endDate,
                estado: estadoFilter,
                proveedor: proveedorFilter,
            })).unwrap();

            const freshOrders = resultado?.data ?? [];
            if (freshOrders.length > 0) {
                setSelectedOrders((prev) =>
                    prev.map((o) => {
                        const actualizada = freshOrders.find(
                            (f) => f.nro_orden_id === o.nro_orden_id
                        );
                        return actualizada ?? o;
                    })
                );
            }

            Swal.fire({
                title: "Merma registrada",
                text: "El pedido ha pasado a estado Pendiente.",
                icon: "success",
                confirmButtonColor: "#2c3e6b",
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
                confirmButtonColor: "#e74c3c",
            });
        } finally {
            setLoadingMerma(null);
        }
    };

    const handleConfirmarMerma = (record) => {
        setSelectedRowKeys((prev) =>
            prev.includes(record.nro_orden_id) ? prev : [...prev, record.nro_orden_id]
        );
        setSelectedOrders((prev) =>
            prev.find((o) => o.nro_orden_id === record.nro_orden_id) ? prev : [...prev, record]
        );
        setShowModalPedido(true);
    };


    const columns = [
        {
            title: (
                <Checkbox
                    checked={allCurrentSelected}
                    indeterminate={someCurrentSelected}
                    onChange={handleSelectAll}
                />
            ),
            key: "checkbox",
            width: 40,
            render: (_, record) => {
                const bloqueado = record.pedido_material === 'Realizado';
                return (
                    <Tooltip title={bloqueado ? "Orden ya realizada" : ""}>
                        <Checkbox
                            checked={selectedRowKeys.includes(record.nro_orden_id)}
                            disabled={bloqueado}
                            onChange={(e) => handleSelectRow(record.nro_orden_id, e.target.checked)}
                        />
                    </Tooltip>
                );
            },
        },
        {
            title: "Fecha",
            dataIndex: "fecha",
            width: 100,
            render: (val) => {
                if (!val) return '—';
                return new Date(val).toLocaleDateString('es-PE', {
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
            },
        },
        {
            title: "Orden",
            dataIndex: "nro_orden_id",
            width: 80,
        },
        {
            title: "RECETA",
            align: "center",
            dataIndex: "receta_od",
            children: [
                {
                    title: "OD",
                    dataIndex: "receta_od",
                    width: 140,
                    align: "center",
                    render: (val) => <span style={{ fontSize: 12 }}>{val ?? "**"}</span>,
                },
                {
                    title: "OI",
                    dataIndex: "receta_oi",
                    width: 140,
                    align: "center",
                    render: (val) => <span style={{ fontSize: 12 }}>{val ?? "**"}</span>,
                },
            ],
        },
        {
            title: "ADD",
            align: "center",
            children: [
                {
                    title: "OD",
                    dataIndex: "add_od",
                    width: 60,
                    align: "center",
                    render: (val) => <span style={{ fontSize: 12 }}>{val || "**"}</span>,
                },
                {
                    title: "OI",
                    dataIndex: "add_oi",
                    width: 60,
                    align: "center",
                    render: (val) => <span style={{ fontSize: 12 }}>{val || "**"}</span>,
                },
            ],
        },
        {
            title: "PRISMAS",
            align: "center",
            children: [
                {
                    title: "OD",
                    dataIndex: "prisma_od",
                    width: 160,
                    align: "center",
                    render: (val) => <span style={{ fontSize: 12 }}>{val || "**"}</span>,
                },
                {
                    title: "OI",
                    dataIndex: "prisma_oi",
                    width: 160,
                    align: "center",
                    render: (val) => <span style={{ fontSize: 12 }}>{val || "**"}</span>,
                },
            ],
        },
        {
            title: "TIPO DE BASE",
            dataIndex: "tipo_base_od",
            width: 200,
            align: "center",
            render: (_, record) => {
                if (!record.es_centilab && record.tipo_base_gestionado_laboratorio) {
                    return (
                        <span
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#d48806",
                            }}
                        >
                            {record.tipo_base_gestionado_laboratorio}
                        </span>
                    );
                }
                const od = record.tipo_base_od;
                const oi = record.tipo_base_oi;
                if (od === oi) {
                    return (
                        <span style={{ fontSize: 12 }}>
                            {od ?? "**"}
                        </span>
                    );
                }
                return (
                    <span style={{ fontSize: 12 }}>
                        {od ? (
                            <span style={{ color: "#1a5f8a", fontWeight: 600 }}>
                                {od}
                            </span>
                        ) : (
                            <span style={{ color: "#aaa" }}>**</span>
                        )}

                        <span style={{ color: "#bbb", margin: "0 4px" }}>|</span>

                        {oi ? (
                            <span style={{ color: "#6a3fa0", fontWeight: 600 }}>
                                {oi}
                            </span>
                        ) : (
                            <span style={{ color: "#aaa" }}>**</span>
                        )}
                    </span>
                );
            },
        },
        {
            title: "MATERIAL",
            dataIndex: "material",
            width: 240,
            align: "center",
            render: (val) => <span style={{ fontSize: 12 }}>{val ?? "**"}</span>,
        },
        {
            title: "LABORATORIO",
            dataIndex: "laboratorio",
            width: 140,
            align: "center",
            render: (val) => (
                <span style={{ fontSize: 12, fontWeight: val ? 500 : 400 }}>
                    {val ?? "—"}
                </span>
            ),
        },
        {
            title: "PEDIDO MATERIAL",
            dataIndex: "pedido_material",
            width: 180,
            render: (_, record) => {
                const tieneMermaPendiente = record.merma_estado === 'Pendiente' && record.merma_pendiente > 0;
                const esRealizado = record.pedido_material === 'Realizado';
                const esPendiente = record.pedido_material === 'Pendiente';

                return (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        {record.pedido_material && (
                            <span style={{
                                display: "inline-flex", alignItems: "center", gap: 4,
                                backgroundColor: esRealizado ? "#f0faf0" : esPendiente ? "#fffdf0" : "#f0f0f0",
                                border: `1px solid ${esRealizado ? "#b7eb8f" : esPendiente ? "#f39c12" : "#d9d9d9"}`,
                                borderRadius: 12, padding: "2px 10px", fontSize: 12,
                                color: esRealizado ? "#389e0d" : esPendiente ? "#d48806" : "#515365",
                            }}>
                                <span style={{
                                    width: 7, height: 7, borderRadius: "50%", display: "inline-block",
                                    backgroundColor: esRealizado ? "#52c41a" : esPendiente ? "#f39c12" : "#aaa",
                                }} />
                                {record.pedido_material}
                            </span>
                        )}
                        {tieneMermaPendiente && (
                            <Tooltip title="Confirmar merma pendiente">
                                <span
                                    onClick={() => handleConfirmarMerma(record)}
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: 4,
                                        backgroundColor: "#fff3e0", border: "1.5px solid #f39c12",
                                        borderRadius: 12, padding: "2px 10px", fontSize: 12,
                                        color: "#e67e22", fontWeight: "bold", cursor: "pointer",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = 0.75}
                                    onMouseLeave={e => e.currentTarget.style.opacity = 1}
                                >
                                    Merma pendiente: {record.merma_pendiente}
                                </span>
                            </Tooltip>
                        )}
                    </div>
                );
            },
        },
        {
            title: "FECHA PEDIDO",
            dataIndex: "fecha_pedido",
            width: 110,
            render: (val) => {
                if (!val) return '—';
                return new Date(val).toLocaleDateString('es-PE', {
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
            },
        },
        {
            title: "PROVEEDOR",
            dataIndex: "proveedor",
            width: 160,
        },
        {
            title: "MERMA",
            key: "merma",
            width: 90,
            align: "center",
            render: (_, record) => {
                const count = record.merma_count ?? 0;
                const tienePedido = !!record.id_pedido;
                return (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <div style={{
                            minWidth: 28, height: 28, borderRadius: 6,
                            backgroundColor: count > 0 ? "#fff3e0" : "#f5f5f5",
                            border: `1.5px solid ${count > 0 ? "#f39c12" : "#d9d9d9"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: "bold", fontSize: 13,
                            color: count > 0 ? "#e67e22" : "#aaa", padding: "0 4px",
                        }}>
                            {count}
                        </div>
                        <Tooltip title={tienePedido ? "Agregar merma" : "Sin pedido asignado"}>
                            <Button
                                size="small"
                                icon={<PlusOutlined />}
                                onClick={() => handleAgregarMerma(record)}
                                style={{
                                    width: 28, height: 28,
                                    backgroundColor: tienePedido ? "#f39c12" : "#e0e0e0",
                                    borderColor: tienePedido ? "#f39c12" : "#d9d9d9",
                                    color: tienePedido ? "#fff" : "#aaa",
                                    borderRadius: 6, display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                    cursor: tienePedido ? "pointer" : "not-allowed",
                                    opacity: tienePedido ? 1 : 0.5,
                                }}
                            />
                        </Tooltip>
                    </div>
                );
            },
        },
        {
            title: "HISTORIAL",
            key: "historial",
            width: 80,
            align: "center",
            render: (_, record) => (
                <Tooltip title="Ver historial de la orden">
                    <Button
                        size="small"
                        icon={<HistoryOutlined />}
                        onClick={() => handleAbrirHistorial(record)}
                        style={{ background: "#2c3e6b", borderColor: "#2c3e6b", color: "#fff", borderRadius: 4 }}
                    />
                </Tooltip>
            ),
        },
        {
            title: "Acciones",
            key: "acciones",
            width: 120,
            render: (_, record) => (
                <>
                    <Button size="small" icon={<EyeOutlined />}
                        onClick={() => {
                            if (record.es_correccion) {
                                navigate(`/ver-correcion-orden/${record.id_real}`);
                            } else {
                                navigate(`/ver-orden/${record.id_orden}/${record?.nro_orden_id}/${record?.id_paciente}`);
                            }
                        }}
                        style={{ marginRight: "6px", backgroundColor: "#1890ff", color: "#fff" }} />
                    <Button size="small" icon={<EditOutlined />}
                        onClick={() => {
                            if (record.es_correccion) {
                                navigate(`/correciones-ordenes/${record.id_real}`);
                            } else {
                                navigate(`/orden-receta/${record.id_orden}/${record.nro_orden_id}/${record.id_paciente}`, {
                                    state: { sucursalFilterLabo: sucursalFilter, doctor: doctorFilter, searchLabo: search, startDateLabo: startDate, endDateLabo: endDate },
                                });
                            }
                        }}
                        style={{ backgroundColor: "#f39c12", borderColor: "#f39c12", color: "#fff", opacity: record?.cancelada ? 0.5 : 1 }}
                        disabled={record.cancelada}
                    />
                </>
            ),
        },
    ];

    return (
        <div className="widget-content-area br-4">
            <div className="widget-one">

                <div className="row layout-top-spacing" id="cancel-row">
                    <div className="col-xl-12 col-lg-12 col-sm-12 layout-spacing">
                        <div className="widget-content widget-content-area br-6">
                            <div style={{ width: "100%", marginBottom: "20px" }}>
                                <div className="d-flex">
                                    <OpcionesOrdenesPedidos
                                        setFechaRange={setFechaRangeOrdenesPedidos}
                                        setEstadoFilter={setEstadoFilter}
                                        setProveedorFilter={setProveedorFilter}
                                        onAplicar={() => setAplicarFiltros(true)}
                                        onCrearPedido={() => setShowModalPedido(true)}
                                        pendientes={totalPendientes}
                                        realizados={totalRealizados}
                                        seleccionadas={seleccionadas}
                                    />
                                </div>
                            </div>
                            <Table
                                className="table-ordenes"
                                columns={columns}
                                bordered
                                dataSource={ordenesPedidos}
                                rowKey="id_orden"
                                loading={status === 'loading'}
                                rowClassName={(record) => (record.cancelada ? 'fila-cancelada' : '')}
                                pagination={{
                                    current: currentPage,
                                    total: meta?.total,
                                    pageSize: 20,
                                    onChange: handlePageChange,
                                    showSizeChanger: false,
                                }}
                                scroll={{ x: "max-content" }}
                            />
                            {status === "failed" && (
                                <p style={{ color: "red" }}>Error: {error}</p>
                            )}


                            <Modal
                                open={showOrden}
                                zIndex={1000000000}
                                width={1600}
                                closable={false}
                                footer={null}
                                height="100%"
                                centered={false}
                            >
                                {orderId !== null && (
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <button className="btn btn-danger">Ticket</button>
                                    </div>
                                )}
                                {loadingPdf ? (
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <Skeleton.Node active style={{ width: 1500, height: 600, marginBottom: "10px" }}>
                                            <div />
                                        </Skeleton.Node>
                                    </div>
                                ) : urlPdfOrden ? (
                                    <iframe src={urlPdfOrden} title="" width="100%" height="800px" style={{ border: "none" }} />
                                ) : (
                                    "PDF no disponible"
                                )}
                                <div style={{ display: "flex", justifyContent: "end" }}>
                                    <button onClick={() => { }} className="btn btn-danger">Cerrar</button>
                                </div>
                            </Modal>


                            <Modal
                                open={showOrdenSize}
                                zIndex={1000000000}
                                width={1600}
                                closable={false}
                                footer={null}
                                height="100%"
                                centered={false}
                            >
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <button className="btn btn-danger">A4</button>
                                </div>
                                {loadingPdfSize ? (
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <Skeleton.Node active style={{ width: 1500, height: 600, marginBottom: "10px" }}>
                                            <div />
                                        </Skeleton.Node>
                                    </div>
                                ) : urlPdfOrdenSize ? (
                                    <iframe src={urlPdfOrdenSize} title="" width="100%" height="800px" style={{ border: "none" }} />
                                ) : (
                                    "PDF no disponible"
                                )}
                                <div style={{ display: "flex", justifyContent: "end" }}>
                                    <button onClick={() => { }} className="btn btn-danger">Cerrar</button>
                                </div>
                            </Modal>

                            {showModalPedido && (
                                <ModalCrearPedido
                                    open={showModalPedido}
                                    onClose={() => setShowModalPedido(false)}
                                    selectedRowKeys={selectedRowKeys}
                                    ordenesPedidos={selectedOrders}
                                    onSuccess={() => {
                                        setSelectedRowKeys([]);
                                        setSelectedOrders([]);
                                        setShowModalPedido(false);
                                        dispatch(fecthOrdenesPedidos({
                                            page: currentPage,
                                            limit: 20,
                                            search,
                                            startDate,
                                            endDate,
                                            estado: estadoFilter,
                                            proveedor: proveedorFilter,
                                        }));
                                    }}
                                />
                            )}
                            <ModalHistorialOrden
                                open={showModalHistorial}
                                onClose={() => {
                                    setShowModalHistorial(false);
                                    setOrdenHistorialId(null);
                                    setHistorialEsCorreccion(false);
                                    setHistorialCorreccionId(null);
                                }}
                                nroOrdenId={nroOrdenIdHistorial}
                                idOrden={ordenHistorialId}
                                esCorreccion={historialEsCorreccion}
                                correccionId={historialCorreccionId}
                                onEliminar={async () => {
                                    const resultado = await dispatch(fecthOrdenesPedidos({
                                        page: currentPage,
                                        limit: 20,
                                        search,
                                        startDate,
                                        endDate,
                                        estado: estadoFilter,
                                        proveedor: proveedorFilter,
                                    })).unwrap();

                                    const freshOrders = resultado?.data ?? [];
                                    if (freshOrders.length > 0) {
                                        setSelectedOrders((prev) =>
                                            prev.map((o) => {
                                                const actualizada = freshOrders.find(
                                                    (f) => f.nro_orden_id === o.nro_orden_id
                                                );
                                                return actualizada ?? o;
                                            })
                                        );
                                    }
                                }}

                            />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default VerOrdenesPedidos;