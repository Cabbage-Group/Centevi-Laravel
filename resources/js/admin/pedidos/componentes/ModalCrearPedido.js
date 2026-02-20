import { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import {
    CloseOutlined, PrinterOutlined, FileExcelOutlined,
    CheckCircleOutlined, CopyOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchProveedorMaterial } from "../../../redux/features/proveedor-material/proveedorMaterialSlice";
import { createOrdenesPedidos, fecthOrdenesPedidos } from "../../../redux/features/pedidos/ordenesPedidosSlice";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import API from "../../../config/config";

const formatFecha = () => {
    const now = new Date();
    return (
        now.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }) +
        " " +
        now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    );
};

const ModalCrearPedido = ({
    open,
    onClose,
    selectedRowKeys = [],
    ordenesPedidos = [],
    onSuccess
}) => {
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
        if (open && proveedorMaterial?.length > 0 && proveedorSeleccionado === null) {
            setProveedorSeleccionado(proveedorMaterial[0].id);
        }
    }, [open, proveedorMaterial]);

    useEffect(() => {
        if (open) {
            const init = {};
            selectedRowKeys.forEach((id) => { init[id] = ""; });
            setObservaciones(init);
        }
    }, [open, selectedRowKeys]);

    const ordenesSeleccionadas = ordenesPedidos.filter((o) =>
        selectedRowKeys.includes(o.nro_orden_id)
    );

    const proveedorActual = proveedorMaterial?.find((p) => p.id === proveedorSeleccionado);

    const totalCantidad = ordenesSeleccionadas.reduce((acc, o) => {
        const mermasPendientes = (o.mermas ?? []).filter(m => m.estado === 'Pendiente').length;
        if (!o.id_pedido) {
            return acc + 1 + mermasPendientes;
        } else {
            return acc + mermasPendientes;
        }
    }, 0);

    const handleConfirmar = async () => {
        try {
            const payload = {
                id_proveedor: proveedorSeleccionado,
                ordenes: ordenesSeleccionadas.map((o) => ({
                    tipo: o.es_correccion ? 'correccion' : 'orden',
                    id_orden: o.es_correccion ? o.id_orden_padre : o.id_orden,
                    id_correccion: o.es_correccion ? o.id_real : null,
                    observacion: observaciones[o.nro_orden_id] || "",
                    receta_od: o.esfera_od ?? null,
                    receta_oi: o.esfera_oi ?? null,
                    add_od: o.add_od ?? null,
                    add_oi: o.add_oi ?? null,
                    prisma_od: o.prisma_od ?? null,
                    prisma_oi: o.prisma_oi ?? null,
                    tipo_base: o.tipo_base ?? null,
                    material: o.material ?? null,
                    mermas: (o.mermas ?? [])
                        .filter(m => m.estado === 'Pendiente')
                        .map(m => ({
                            id_merma: m.id_merma,
                            observacion: m.observacion || '',
                        })),
                })),
            };
            console.log("Confirmar pedido:", payload);
            await dispatch(createOrdenesPedidos(payload)).unwrap();
            onClose();
            onSuccess?.();
        } catch (error) {
            console.error("Error al confirmar:", error);
        }
    };

    const handleCopiar = () => {
        const headers = [
            'Proveedor', 'Fecha', 'Orden', 'Cantidad',
            'Receta OD', 'Receta OI', 'Add OD', 'Add OI',
            'Prismas OD', 'Prismas OI', 'Tipo de base', 'Material',
            'Observación', 'Mermas pend.'
        ].join('\t');

        const filas = ordenesSeleccionadas.map((o) => {
            const mermasPendientes = (o.mermas ?? []).filter(m => m.estado === 'Pendiente').length;
            const cantidad = !o.id_pedido
                ? 1 + mermasPendientes
                : mermasPendientes;

            return [
                proveedorActual?.nombre ?? '—',
                o.fecha ?? '—',
                o.nro_orden_id,
                cantidad,
                o.esfera_od ?? '—',
                o.esfera_oi ?? '—',
                o.add_od ?? '**',
                o.add_oi ?? '**',
                o.prisma_od ?? '**',
                o.prisma_oi ?? '**',
                o.tipo_base ?? '—',
                o.material ?? '—',
                observaciones[o.nro_orden_id] || '',
                mermasPendientes,
            ].join('\t');
        }).join('\n');

        const texto = `${headers}\n${filas}`;

        navigator.clipboard.writeText(texto).then(() => {
            Swal.fire({
                title: "¡Copiado!",
                text: "Pegá directamente en Excel",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                confirmButtonColor: "#2c3e6b",
            });
        }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = texto;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        });
    };

    const handleImprimir = () => {
        const payload = {
            proveedor: proveedorActual?.nombre ?? '—',
            fecha: fechaGenerado,
            ordenes: ordenesSeleccionadas.map((o) => ({
                id_orden: o.nro_orden_id,
                fecha: o.fecha,
                receta_od: o.esfera_od,
                receta_oi: o.esfera_oi,
                add_od: o.add_od,
                add_oi: o.add_oi,
                prisma_od: o.prisma_od,
                prisma_oi: o.prisma_oi,
                tipo_base: o.tipo_base,
                material: o.material,
                observacion: observaciones[o.nro_orden_id] || '',
                mermas_pendientes: (o.mermas ?? []).filter(m => m.estado === 'Pendiente').length,
                cantidad: !o.id_pedido
                    ? 1 + (o.mermas ?? []).filter(m => m.estado === 'Pendiente').length
                    : (o.mermas ?? []).filter(m => m.estado === 'Pendiente').length,
            })),
        };

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `${API}/pedidos/imprimir-pedido`;
        form.target = '_blank';

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'data';
        input.value = JSON.stringify(payload);
        form.appendChild(input);

        const csrf = document.createElement('input');
        csrf.type = 'hidden';
        csrf.name = '_token';
        csrf.value = document.querySelector('meta[name="csrf-token"]')?.content ?? '';
        form.appendChild(csrf);

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    const handleExportarExcel = () => {
        const filas = [];

        ordenesSeleccionadas.forEach((o) => {
            const mermasPendientes = (o.mermas ?? []).filter(m => m.estado === 'Pendiente').length;
            const cantidad = !o.id_pedido
                ? 1 + mermasPendientes
                : mermasPendientes;

            filas.push({
                'Proveedor': proveedorActual?.nombre ?? '—',
                'Fecha': o.fecha ?? '—',
                'Orden': o.nro_orden_id,
                'Cantidad': cantidad,
                'Receta OD': o.esfera_od ?? '—',
                'Receta OI': o.esfera_oi ?? '—',
                'Add OD': o.add_od ?? '**',
                'Add OI': o.add_oi ?? '**',
                'Prismas OD': o.prisma_od ?? '**',
                'Prismas OI': o.prisma_oi ?? '**',
                'Tipo de base': o.tipo_base ?? '—',
                'Material': o.material ?? '—',
                'Observación': observaciones[o.nro_orden_id] || '',
                'Mermas pend.': mermasPendientes,
            });
        });

        const ws = XLSX.utils.json_to_sheet(filas);
        ws['!cols'] = [
            { wch: 18 }, { wch: 12 }, { wch: 10 }, { wch: 10 },
            { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 10 },
            { wch: 20 }, { wch: 20 }, { wch: 14 }, { wch: 30 },
            { wch: 25 }, { wch: 12 },
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Pedido');

        const nombreArchivo = `pedido_${proveedorActual?.nombre ?? 'sin_proveedor'}_${new Date().toLocaleDateString('es-AR').replace(/\//g, '-')}.xlsx`;

        const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([buf], { type: 'application/octet-stream' }), nombreArchivo);
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
                        <span style={{ fontSize: 13 }}>
                            Cantidad total:{" "}
                            <strong style={{ color: totalCantidad > ordenesSeleccionadas.length ? "#e67e22" : "inherit" }}>
                                {totalCantidad}
                            </strong>
                        </span>
                        <span style={{ fontSize: 13 }}>Generado: <strong>{fechaGenerado}</strong></span>
                    </div>

                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: "#e8f0e9" }}>
                                <th style={thStyle}>Fecha</th>
                                <th style={thStyle}>Orden</th>
                                <th style={thStyle}>Cantidad</th>
                                <th style={thStyle}>Observación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordenesSeleccionadas.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: "center", padding: 24, color: "#aaa" }}>
                                        No hay órdenes seleccionadas
                                    </td>
                                </tr>
                            ) : (
                                ordenesSeleccionadas.map((orden) => {
                                    const mermasPendientes = (orden.mermas ?? []).filter(m => m.estado === 'Pendiente');
                                    const cantidad = !orden.id_pedido
                                        ? 1 + mermasPendientes.length
                                        : mermasPendientes.length;

                                    return (
                                        <>
                                            <tr key={orden.nro_orden_id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                                                <td style={tdStyle}>{orden.fecha || "-"}</td>
                                                <td style={tdStyle}><strong>{orden.nro_orden_id}</strong></td>
                                                <td style={tdStyle}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                        <span style={{
                                                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                                                            minWidth: 28, height: 28, borderRadius: 6,
                                                            background: "#eef1fd", border: "1px solid #4361EE",
                                                            fontWeight: 700, fontSize: 14, color: "#4361EE",
                                                        }}>
                                                            {cantidad}
                                                        </span>
                                                        {/* {mermasPendientes.length > 0 && (
                                                            <span style={{
                                                                fontSize: 11, background: "#fff3e0",
                                                                border: "1px solid #f39c12", borderRadius: 10,
                                                                padding: "1px 8px", color: "#e67e22", fontWeight: 600,
                                                            }}>
                                                                +{mermasPendientes.length} merma{mermasPendientes.length > 1 ? "s" : ""}
                                                            </span>
                                                        )} */}
                                                    </div>
                                                </td>
                                                <td style={tdStyle}>
                                                    <input
                                                        type="text"
                                                        value={observaciones[orden.nro_orden_id] || ""}
                                                        onChange={(e) =>
                                                            setObservaciones((prev) => ({ ...prev, [orden.nro_orden_id]: e.target.value }))
                                                        }
                                                        placeholder=""
                                                        style={{ width: "100%", padding: "5px 8px", border: "1px solid #d9d9d9", borderRadius: 4, fontSize: 12, outline: "none" }}
                                                        onFocus={(e) => (e.target.style.borderColor = "#4361EE")}
                                                        onBlur={(e) => (e.target.style.borderColor = "#d9d9d9")}
                                                    />
                                                </td>
                                            </tr>
                                            <tr key={`det-${orden.nro_orden_id}`} style={{ background: "#fafafa", borderBottom: "1px solid #ebebeb" }}>
                                                <td colSpan={4} style={{ padding: "6px 12px 10px 12px" }}>
                                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 32px" }}>
                                                        <span style={detalleStyle}>Receta OD: <strong>{orden.esfera_od || "-"}</strong></span>
                                                        <span style={detalleStyle}>Receta OI: <strong>{orden.esfera_oi || "-"}</strong></span>
                                                        <span style={detalleStyle}>Add OD: <strong>{orden.add_od || "**"}</strong></span>
                                                        <span style={detalleStyle}>Add OI: <strong>{orden.add_oi || "**"}</strong></span>
                                                        <span style={detalleStyle}>Prismas OD: <strong>{orden.prisma_od || "-"}</strong></span>
                                                        <span style={detalleStyle}>Prismas OI: <strong>{orden.prisma_oi || "-"}</strong></span>
                                                        <span style={detalleStyle}>Tipo de base: <strong>{orden.tipo_base || "-"}</strong></span>
                                                        <span style={detalleStyle}>Material: <strong>{orden.material || "-"}</strong></span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
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
                    <Button icon={<CopyOutlined />} onClick={handleCopiar}>Copiar</Button>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <Button icon={<PrinterOutlined />} onClick={handleImprimir}>
                        Imprimir
                    </Button>
                    <Button
                        icon={<FileExcelOutlined />}
                        style={{ background: "#1d6f42", borderColor: "#1d6f42", color: "#fff" }}
                        onClick={handleExportarExcel}
                        disabled={ordenesSeleccionadas.length === 0}
                    >
                        Exportar Excel
                    </Button>
                    <Button style={{ background: "#e8a838", borderColor: "#e8a838", color: "#fff" }} onClick={onClose}>
                        Cerrar
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

const thStyle = { padding: "8px 12px", textAlign: "left", fontWeight: 600, fontSize: 12, color: "#4a6741", borderBottom: "1px solid #c8dfc9" };
const tdStyle = { padding: "10px 12px", verticalAlign: "middle", color: "#333" };
const detalleStyle = { fontSize: 12, color: "#555", display: "block" };

export default ModalCrearPedido;