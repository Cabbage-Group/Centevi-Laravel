import { useEffect } from "react";
import { Modal, Button, Table, Tag, Popconfirm } from "antd";
import { CloseOutlined, FileExcelOutlined, DeleteOutlined, PrinterOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { eliminarHistorialOrden, fetchHistorialOrden } from "../../../redux/features/historial/historialOrdenPedidoSlice";
import { fecthOrdenesPedidos } from "../../../redux/features/pedidos/ordenesPedidosSlice";
import API from "../../../config/config";

const ModalHistorialOrden = ({
    open,
    onClose,
    nroOrdenId,
    idOrden,
    esCorreccion = false,
    correccionId = null,
    onEliminar
}) => {
    const dispatch = useDispatch();
    const { historial, meta, status, deleteStatus } = useSelector((state) => state.historialOrdenPedido);

    useEffect(() => {
        if (open && idOrden) {
            dispatch(fetchHistorialOrden({ idOrden, esCorreccion, correccionId }));
        }
    }, [open, idOrden, dispatch]);

    const handleEliminar = (record) => {
        dispatch(eliminarHistorialOrden({
            tipo: record.evento === "PEDIDO" ? "pedido" : "merma",
            id: record.evento_id,
        }));

        dispatch(fetchHistorialOrden({ idOrden, esCorreccion, correccionId }));

        onEliminar?.();
    };


    const handleImprimir = () => {
        const params = new URLSearchParams({
            es_correccion: esCorreccion ? true : false,
            ...(correccionId && { correccion_id: correccionId }),
        });
        window.open(`${API}/pedidos/historial/${idOrden}/imprimir?${params}`, '_blank');
    };

    const formatDetalle = (detalle, record) => {

        if (!detalle) return "—";

        const ojo = record?.ojo || 'ambos';
        const esCentilab = record?.esCentilab;

        const mostrarOD = ojo !== 'oi';
        const mostrarOI = ojo !== 'od';

        const basesIguales = detalle.tipo_base_oi === detalle.tipo_base_od;
        const baseUnica = detalle.tipo_base_od || detalle.tipo_base_oi;

        const lineas = [
            detalle.titulo,
            '─────────────────────────────'
        ];

        if (mostrarOD) lineas.push(`Receta OD:   ${detalle.receta_od ?? "**"}`);
        if (mostrarOI) lineas.push(`Receta OI:   ${detalle.receta_oi ?? "**"}`);

        if (mostrarOD) lineas.push(`Add OD:      ${detalle.add_od ?? "**"}`);
        if (mostrarOI) lineas.push(`Add OI:      ${detalle.add_oi ?? "**"}`);

        if (mostrarOD) lineas.push(`Prismas OD:  ${detalle.prisma_od ?? "**"}`);
        if (mostrarOI) lineas.push(`Prismas OI:  ${detalle.prisma_oi ?? "**"}`);


        if (!esCentilab) {

            lineas.push(`Nro Base:    ${detalle.tipo_base_extra ?? "**"}`);

        } else {

            if (mostrarOD && (!basesIguales || ojo === 'od')) {
                lineas.push(`Nro Base OD: ${detalle.tipo_base_od ?? "**"}`);
            }

            if (mostrarOI && (!basesIguales || ojo === 'oi')) {
                lineas.push(`Nro Base OI: ${detalle.tipo_base_oi ?? "**"}`);
            }

            if (basesIguales && ojo === 'ambos') {
                lineas.push(`Nro Base:    ${baseUnica ?? "**"}`);
            }
        }

        lineas.push('─────────────────────────────');

        lineas.push(`Material:    ${detalle.material ?? "—"}`);

        lineas.push(`Observación: ${detalle.observacion ?? "Sin observación"}`);

        return lineas.join("\n");
    };

    const columns = [
        {
            title: "FECHA Y HORA",
            dataIndex: "fecha_hora",
            width: 160,
            render: (text) => (
                <span style={{ fontSize: 12, color: "#555", fontFamily: "monospace" }}>{text}</span>
            ),
        },
        {
            title: "EVENTO",
            dataIndex: "evento",
            width: 100,
            render: (tipo) => (
                <Tag
                    style={{
                        fontWeight: 700,
                        fontSize: 11,
                        letterSpacing: 0.5,
                        border: "none",
                        background: tipo === "PEDIDO" ? "#e8f4fd" : "#fff3cd",
                        color: tipo === "PEDIDO" ? "#1a5f8a" : "#856404",
                        padding: "2px 8px",
                        borderRadius: 3,
                    }}
                >
                    {tipo}
                </Tag>
            ),
        },
        {
            title: "PROVEEDOR",
            dataIndex: "proveedor",
            width: 120,
            render: (text, record) => (
                <span style={{ fontSize: 13 }}>
                    {record?.esCentilab
                        ? (text || "—")
                        : "Gestionado por laboratorio"}
                </span>
            ),
        },
        {
            title: "CANTIDAD",
            dataIndex: "cantidad",
            width: 90,
            align: "center",
            render: (val) => <span style={{ fontSize: 13, fontWeight: 600 }}>{val}</span>,
        },
        {
            title: "OJO",
            dataIndex: "ojo",
            width: 90,
            align: "center",
            render: (val) => {
                const config = {
                    od: { label: "OD", bg: "#e8f4fd", color: "#1a5f8a" },
                    oi: { label: "OI", bg: "#f3e8fd", color: "#6a3fa0" },
                    ambos: { label: "Ambos", bg: "#e8fdf0", color: "#27ae60" },
                };
                const c = config[val] ?? config.ambos;
                return (
                    <span style={{
                        background: c.bg,
                        color: c.color,
                        border: `1px solid ${c.color}`,
                        borderRadius: 4,
                        padding: "2px 8px",
                        fontSize: 11,
                        fontWeight: 700,
                    }}>
                        {c.label}
                    </span>
                );
            },
        },
        {
            title: "DETALLE",
            dataIndex: "detalle",
            render: (detalle, ojo) => (
                <pre
                    style={{
                        margin: 0,
                        fontSize: 12,
                        color: "#444",
                        fontFamily: "inherit",
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.6,
                    }}
                >
                    {formatDetalle(detalle, ojo)}
                </pre>
            ),
        },
        {
            title: "ACCIÓN",
            key: "accion",
            width: 110,
            align: "center",
            render: (_, record) => {
                const esPedido = record.evento === "PEDIDO";

                return (
                    <Popconfirm
                        title={
                            esPedido ? (
                                <div style={{ maxWidth: 220 }}>
                                    <div style={{ fontWeight: 700, color: "#c0392b", marginBottom: 4 }}>
                                        Eliminar pedido
                                    </div>
                                    <div style={{ fontSize: 12, color: "#555" }}>
                                        Al eliminar este pedido <strong>también se eliminarán todas sus mermas asociadas</strong>. Esta acción no se puede deshacer.
                                    </div>
                                </div>
                            ) : (
                                "¿Eliminar esta merma?"
                            )
                        }
                        onConfirm={() => handleEliminar(record)}
                        okText="Sí, eliminar"
                        cancelText="Cancelar"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            loading={deleteStatus === "loading"}
                            style={{ fontSize: 12, fontWeight: 600 }}
                        >
                            Eliminar
                        </Button>
                    </Popconfirm>
                );
            },
        },
    ];

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={980}
            centered
            closable={false}
            styles={{ body: { padding: 0 } }}
            style={{ borderRadius: 8, overflow: "hidden" }}
        >
            <div style={{
                background: "#2c3e6b",
                padding: "14px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <span style={{
                    color: "#fff", fontWeight: 700, fontSize: 15,
                    letterSpacing: 1, textTransform: "uppercase",
                }}>
                    Historial de Orden
                </span>
                <button
                    onClick={onClose}
                    style={{
                        background: "#e74c3c", border: "none", borderRadius: 4,
                        color: "#fff", width: 28, height: 28, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                    }}
                >
                    <CloseOutlined />
                </button>
            </div>

            <div style={{
                padding: "10px 20px",
                background: "#f8f9fa",
                borderBottom: "1px solid #e8e8e8",
                display: "flex",
                gap: 24,
                alignItems: "center",
                flexWrap: "wrap",
            }}>
                <span style={{ fontSize: 13 }}>
                    <span style={{ color: "#27ae60", fontWeight: 700 }}>●</span>{" "}
                    Orden: <strong>{nroOrdenId}</strong>
                </span>
                <span style={{ fontSize: 13 }}>
                    Merma total: <strong>{meta?.merma_total ?? "—"}</strong>
                </span>
                <span style={{ fontSize: 13 }}>
                    Merma pendiente: <strong>{meta?.merma_pendiente ?? "—"}</strong>
                </span>
                <span style={{ fontSize: 13 }}>
                    Último proveedor: <strong>{meta?.ultimo_proveedor ?? "—"}</strong>
                </span>
            </div>

            <Table
                columns={columns}
                dataSource={historial}
                rowKey={(record) => `${record.evento}-${record.evento_id}`}
                loading={status === "loading"}
                pagination={false}
                size="small"
                style={{ fontSize: 13 }}
                rowClassName={(_, idx) => idx % 2 === 0 ? "" : "historial-row-alt"}
            />
            <div style={{
                padding: "12px 20px",
                borderTop: "1px solid #e8e8e8",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#fff",
            }}>
                <Button
                    icon={<PrinterOutlined />}
                    style={{ background: "#2c3e6b", borderColor: "#2c3e6b", color: "#fff" }}
                    onClick={() => handleImprimir()}
                >
                    Imprimir
                </Button>
                <Button
                    style={{ background: "#e8a838", borderColor: "#e8a838", color: "#fff" }}
                    onClick={onClose}
                >
                    Cerrar
                </Button>
            </div>
        </Modal>
    );
};

export default ModalHistorialOrden;