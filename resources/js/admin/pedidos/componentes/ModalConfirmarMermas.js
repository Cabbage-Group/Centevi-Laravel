import { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import {
    CloseOutlined,
    PrinterOutlined,
    FileExcelOutlined,
    CheckCircleOutlined,
    CopyOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchProveedorMaterial } from "../../../redux/features/proveedor-material/proveedorMaterialSlice";
import { createOrdenesPedidos } from "../../../redux/features/pedidos/ordenesPedidosSlice";


const formatFecha = () => {
    const now = new Date();
    return (
        now.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" }) +
        " " +
        now.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    );
};

const ModalConfirmarMermas = ({ open, onClose, selectedRowKeys = [], ordenesPedidos = [] }) => {
    const dispatch = useDispatch();                                         
    const { proveedorMaterial, status: statusProveedores } = useSelector(
        (state) => state.proveedorMaterial
    );

    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
    const [observaciones, setObservaciones] = useState({});
    const [fechaGenerado] = useState(formatFecha());

    useEffect(() => {
        dispatch(fetchProveedorMaterial({}));
    }, [dispatch]);

    useEffect(() => {
        if (proveedorMaterial?.length > 0 && proveedorSeleccionado === null) {
            setProveedorSeleccionado(proveedorMaterial[0].id);
        }
    }, [proveedorMaterial]);

    useEffect(() => {
        if (open) {
            const init = {};
            selectedRowKeys.forEach((id) => { init[id] = ""; });
            setObservaciones(init);
            if (proveedorMaterial?.length > 0) {
                setProveedorSeleccionado(proveedorMaterial[0].id);
            }
        }
    }, [open, selectedRowKeys]);

    const ordenesSeleccionadas = ordenesPedidos.filter((o) =>
        selectedRowKeys.includes(o.id_orden)
    );

    const proveedorActual = proveedorMaterial?.find((p) => p.id === proveedorSeleccionado); 

    const handleConfirmar = () => {
        const payload = {
            id_proveedor: proveedorSeleccionado,
            ordenes: ordenesSeleccionadas.map((o) => ({
                id_orden: o.id_orden,
                observacion: observaciones[o.id_orden] || "",
            })),
        };
        console.log("Confirmar pedido:", payload);
        dispatch(createOrdenesPedidos(payload)).then(() => onClose())
        onClose();
    };

    const handleCopiar = () => {
        const texto = ordenesSeleccionadas
            .map((o) => `Orden: ${o.id_orden} | Obs: ${observaciones[o.id_orden] || ""}`)
            .join("\n");
        navigator.clipboard.writeText(texto);
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={1050}
            centered
            closable={false}
            styles={{ body: { padding: 0 } }}
            style={{ borderRadius: 8, overflow: "hidden" }}
        >

            <div style={{ background: "#2c3e6b", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: 1, textTransform: "uppercase" }}>
                    Crear Pedido de Materia Prima
                </span>
                <button
                    onClick={onClose}
                    style={{ background: "#e74c3c", border: "none", borderRadius: 4, color: "#fff", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}
                >
                    <CloseOutlined />
                </button>
            </div>


            <div style={{ display: "flex", minHeight: 420 }}>

                <div style={{ width: 230, borderRight: "1px solid #e8e8e8", padding: "20px 16px", background: "#fafafa", flexShrink: 0 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", marginBottom: 14, letterSpacing: 1 }}>
                        Proveedor
                    </p>

                    {statusProveedores === "loading" && (
                        <p style={{ fontSize: 12, color: "#aaa" }}>Cargando...</p>
                    )}

                    {proveedorMaterial?.map((p) => (   
                        <div
                            key={p.id}
                            onClick={() => setProveedorSeleccionado(p.id)}
                            style={{
                                padding: "12px 14px", borderRadius: 6, marginBottom: 8, cursor: "pointer",
                                border: `1px solid ${proveedorSeleccionado === p.id ? "#4361EE" : "#e0e0e0"}`,
                                background: proveedorSeleccionado === p.id ? "#eef1fd" : "#fff",
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                transition: "all 0.18s",
                            }}
                        >
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 13, color: "#2c3e6b" }}>{p.nombre}</div>
                                <div style={{ fontSize: 11, color: "#999" }}>Pedido de materiales</div>
                            </div>
                            {proveedorSeleccionado === p.id && (
                                <CheckCircleOutlined style={{ color: "#4361EE", fontSize: 16 }} />
                            )}
                        </div>
                    ))}

                    <p style={{ fontSize: 11, color: "#aaa", marginTop: 18, lineHeight: 1.5 }}>
                        El proveedor aparece arriba del pedido para screenshot, Excel o impresión.
                    </p>
                </div>

                <div style={{ flex: 1, padding: "20px 20px 0 20px", overflowY: "auto", maxHeight: 520 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", marginBottom: 14, letterSpacing: 1 }}>
                        Pedido Listo para Enviar
                    </p>

                    <div style={{ background: "#f0f5ff", border: "1px solid #d0deff", borderRadius: 6, padding: "10px 16px", marginBottom: 16, display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13 }}>
                            <span style={{ color: "#27ae60", fontWeight: 700 }}>●</span>{" "}
                            Proveedor: <strong>{proveedorActual?.nombre ?? "—"}</strong>
                        </span>
                        <span style={{ fontSize: 13 }}>Órdenes: <strong>{ordenesSeleccionadas.length}</strong></span>
                        <span style={{ fontSize: 13 }}>Generado: <strong>{fechaGenerado}</strong></span>
                    </div>

                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: "#e8f0e9" }}>
                                <th style={thStyle}>Fecha</th>
                                <th style={thStyle}>Orden</th>
                                <th style={thStyle}>Observación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordenesSeleccionadas.length === 0 ? (
                                <tr>
                                    <td colSpan={3} style={{ textAlign: "center", padding: 24, color: "#aaa" }}>
                                        No hay órdenes seleccionadas
                                    </td>
                                </tr>
                            ) : (
                                ordenesSeleccionadas.map((orden) => (
                                    <>
                                        <tr key={orden.id_orden} style={{ borderBottom: "1px solid #f0f0f0" }}>
                                            <td style={tdStyle}>{orden.fecha || "-"}</td>
                                            <td style={tdStyle}><strong>{orden.id_orden}</strong></td>
                                            <td style={tdStyle}>
                                                <input
                                                    type="text"
                                                    value={observaciones[orden.id_orden] || ""}
                                                    onChange={(e) =>
                                                        setObservaciones((prev) => ({ ...prev, [orden.id_orden]: e.target.value }))
                                                    }
                                                    placeholder="Lo rápido posible..."
                                                    style={{ width: "100%", padding: "5px 8px", border: "1px solid #d9d9d9", borderRadius: 4, fontSize: 12, outline: "none" }}
                                                    onFocus={(e) => (e.target.style.borderColor = "#4361EE")}
                                                    onBlur={(e) => (e.target.style.borderColor = "#d9d9d9")}
                                                />
                                            </td>
                                        </tr>
                                        <tr key={`det-${orden.id_orden}`} style={{ background: "#fafafa", borderBottom: "1px solid #ebebeb" }}>
                                            <td colSpan={3} style={{ padding: "6px 12px 10px 12px" }}>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 32px" }}>
                                                    <span style={detalleStyle}>Receta OD: <strong>{orden.receta_od || "-"}</strong></span>
                                                    <span style={detalleStyle}>Receta OI: <strong>{orden.receta_oi || "-"}</strong></span>
                                                    <span style={detalleStyle}>Add OD: <strong>{orden.add_od || "**"}</strong></span>
                                                    <span style={detalleStyle}>Add OI: <strong>{orden.add_oi || "**"}</strong></span>
                                                    <span style={detalleStyle}>Prismas OD: <strong>{orden.prismas_od || "-"}</strong></span>
                                                    <span style={detalleStyle}>Prismas OI: <strong>{orden.prismas_oi || "-"}</strong></span>
                                                    <span style={detalleStyle}>Tipo de base: <strong>{orden.tipo_base || "-"}</strong></span>
                                                    <span style={detalleStyle}>Material: <strong>{orden.material || "-"}</strong></span>
                                                </div>
                                            </td>
                                        </tr>
                                    </>
                                ))
                            )}
                        </tbody>
                    </table>

                    <p style={{ fontSize: 11, color: "#888", margin: "14px 0 10px", lineHeight: 1.5 }}>
                        Confirmar crea un evento en historial por cada orden, y marca como realizado.
                        Si había merma pendiente, queda cubierta.
                    </p>
                </div>
            </div>

            <div style={{ padding: "12px 20px", borderTop: "1px solid #e8e8e8", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff" }}>
                <div style={{ display: "flex", gap: 8 }}>
                    <Button
                        type="primary"
                        onClick={handleConfirmar}
                        disabled={ordenesSeleccionadas.length === 0 || proveedorSeleccionado === null}
                        style={{ background: "#27ae60", borderColor: "#27ae60", fontWeight: 600 }}
                    >
                        Confirmar pedido
                    </Button>
                    <Button icon={<CopyOutlined />} onClick={handleCopiar}>
                        Copiar
                    </Button>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <Button icon={<PrinterOutlined />} onClick={() => window.print()}>Imprimir</Button>
                    <Button
                        icon={<FileExcelOutlined />}
                        style={{ background: "#1d6f42", borderColor: "#1d6f42", color: "#fff" }}
                        onClick={() => console.log("Exportar Excel")}
                    >
                        Exportar Excel
                    </Button>
                    <Button
                        style={{ background: "#e8a838", borderColor: "#e8a838", color: "#fff" }}
                        onClick={onClose}
                    >
                        Cerrar
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

const thStyle = {
    padding: "8px 12px",
    textAlign: "left",
    fontWeight: 600,
    fontSize: 12,
    color: "#4a6741",
    borderBottom: "1px solid #c8dfc9",
};

const tdStyle = {
    padding: "10px 12px",
    verticalAlign: "middle",
    color: "#333",
};

const detalleStyle = {
    fontSize: 12,
    color: "#555",
    display: "block",
};

export default ModalConfirmarMermas;