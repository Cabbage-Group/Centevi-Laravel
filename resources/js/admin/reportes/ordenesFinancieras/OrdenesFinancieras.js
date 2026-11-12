import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Select, Input, Button, Spin, message } from "antd";
import { FaFileExcel, FaFileCsv, FaPrint, FaCopy, FaSearch, FaExclamationTriangle } from "react-icons/fa";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import moment from "moment";
import {
  fetchOrdenesFinancieras,
  fetchOpcionesOrdenesFinancieras,
  fetchOrdenesFinancierasExport,
} from "../../../redux/features/reportes/ordenesFinancieras/ordenesFinancierasSlice";
import VerificarPagosAnticipos, { verificarPagosAnticiposEnLote } from "../../ordenes/VerificarPagosAnticipos";
import "./OrdenesFinancieras.css";

const PAGE_SIZE = 15;
const SEARCH_DELAY_MS = 1000;
const DATA_DESACTUALIZADA_MS = 20 * 60 * 1000;

const ESTADOS_FINANCIEROS = [
  { value: "", label: "Todos" },
  { value: "1", label: "Pagado" },
  { value: "2", label: "Abonado" },
  { value: "0", label: "Cortesía" },
];

const FILTROS_INICIALES = {
  desde: moment().startOf("month").format("YYYY-MM-DD"),
  hasta: moment().format("YYYY-MM-DD"),
  sucursal: "todas",
  fase: "",
  estadoFinanciero: "",
  search: "",
};

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const formatMoney = (value) => money.format(Number(value) || 0);
const formatFecha = (value) => (value ? moment(value).format("DD/MM/YYYY") : "");
const nombreSucursal = (value) => (value || "").replace("CENTEVI", "").trim();

const badgeClass = {
  Pagado: "of-badge--pagado",
  Abonado: "of-badge--abonado",
  "Cortesía": "of-badge--cortesia",
};

const toExportRows = (rows) =>
  rows.map((o) => ({
    "Número de orden": o.nro_orden_id,
    "Estado financiero": o.estado_financiero,
    "Fecha de Orden": formatFecha(o.fecha_orden),
    Sucursal: nombreSucursal(o.sucursal),
    Paciente: o.paciente,
    "Cédula": o.nro_cedula,
    "Fase Actual": o.fase_actual,
    "Cotización": o.nro_cotizacion,
    "Total cotización": Number(o.total_cotizacion) || 0,
    "Total aplicado": Number(o.total_aplicado) || 0,
    "Saldo por cobrar": Number(o.saldo_por_cobrar) || 0,
  }));

export default function OrdenesFinancieras() {
  const dispatch = useDispatch();
  const { data, meta, resumen, opciones, status } = useSelector(
    (state) => state.reporteOrdenesFinancieras
  );

  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [exportando, setExportando] = useState(false);
  const [sync, setSync] = useState({ corriendo: false, total: 0, procesadas: 0 });
  const [ultimaSync, setUltimaSync] = useState(null);
  const [desactualizada, setDesactualizada] = useState(false);
  const syncDetenidaRef = useRef(false);
  const syncCorriendoRef = useRef(false);

  useEffect(() => {
    dispatch(fetchOpcionesOrdenesFinancieras());
  }, [dispatch]);

  // Verifica en Interfuerza las órdenes abonadas (mismo proceso del botón) y recarga la tabla
  const sincronizarPagos = useCallback(async () => {
    if (syncCorriendoRef.current) return;
    syncCorriendoRef.current = true;
    setDesactualizada(false);
    setSync({ corriendo: true, total: 0, procesadas: 0 });

    try {
      const resumen = await verificarPagosAnticiposEnLote({
        onProgreso: (r) => setSync({ corriendo: true, total: r.total, procesadas: r.procesadas }),
        debeDetener: () => syncDetenidaRef.current,
      });
      if (syncDetenidaRef.current) return;
      if (resumen.pagado > 0) {
        message.success(`${resumen.pagado} orden(es) pasaron a pagado.`);
      }
    } catch (error) {
      if (!syncDetenidaRef.current) message.warning("No se pudo verificar los pagos de anticipos.");
    } finally {
      syncCorriendoRef.current = false;
      if (!syncDetenidaRef.current) {
        setSync({ corriendo: false, total: 0, procesadas: 0 });
        setUltimaSync(Date.now());
        setFiltros((prev) => ({ ...prev }));
      }
    }
  }, []);

  // Se ejecuta al entrar a la vista; al salir se detiene
  useEffect(() => {
    syncDetenidaRef.current = false;
    sincronizarPagos();
    return () => {
      syncDetenidaRef.current = true;
    };
  }, [sincronizarPagos]);

  // A los 20 minutos de la última verificación se avisa que la data puede estar desactualizada
  useEffect(() => {
    if (!ultimaSync) return undefined;
    const timer = setTimeout(() => setDesactualizada(true), DATA_DESACTUALIZADA_MS);
    return () => clearTimeout(timer);
  }, [ultimaSync]);

  // Cada cambio de filtros/página aborta la petición anterior y se queda con la última
  useEffect(() => {
    const request = dispatch(fetchOrdenesFinancieras({ filtros, page, limit: PAGE_SIZE }));
    return () => request.abort();
  }, [dispatch, filtros, page]);

  // El buscador solo aplica tras 1 segundo sin escribir
  useEffect(() => {
    const term = searchInput.trim();
    if (term === filtros.search) return undefined;

    const timer = setTimeout(() => {
      setFiltros((prev) => ({ ...prev, search: term }));
      setPage(1);
    }, SEARCH_DELAY_MS);

    return () => clearTimeout(timer);
  }, [searchInput, filtros.search]);

  const cambiarFiltro = (campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
    setPage(1);
  };

  const limpiarFiltros = () => {
    setSearchInput("");
    setFiltros(FILTROS_INICIALES);
    setPage(1);
  };

  const obtenerFilasExport = async () => {
    setExportando(true);
    try {
      const rows = await fetchOrdenesFinancierasExport(filtros);
      if (!rows.length) {
        message.info("No hay datos para exportar.");
        return null;
      }
      return toExportRows(rows);
    } catch (error) {
      message.error("No se pudo obtener la información para exportar.");
      return null;
    } finally {
      setExportando(false);
    }
  };

  const nombreArchivo = `ordenes-financieras_${filtros.desde || "inicio"}_${filtros.hasta || "hoy"}`;

  const exportarExcel = async () => {
    const rows = await obtenerFilasExport();
    if (!rows) return;
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ordenes financieras");
    XLSX.writeFile(wb, `${nombreArchivo}.xlsx`);
  };

  const exportarCSV = async () => {
    const rows = await obtenerFilasExport();
    if (!rows) return;
    const blob = new Blob(["﻿" + Papa.unparse(rows)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${nombreArchivo}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copiar = async () => {
    const rows = await obtenerFilasExport();
    if (!rows) return;
    const headers = Object.keys(rows[0]);
    const tsv = [headers.join("\t"), ...rows.map((r) => headers.map((h) => r[h] ?? "").join("\t"))].join("\n");
    try {
      await navigator.clipboard.writeText(tsv);
      message.success(`${rows.length} filas copiadas al portapapeles.`);
    } catch (error) {
      message.error("No se pudo copiar al portapapeles.");
    }
  };

  const imprimir = async () => {
    const rows = await obtenerFilasExport();
    if (!rows) return;
    const headers = Object.keys(rows[0]);
    const esMonto = (h) => ["Total cotización", "Total aplicado", "Saldo por cobrar"].includes(h);
    const celda = (h, v) => (esMonto(h) ? formatMoney(v) : v ?? "");

    const win = window.open("", "", "height=700,width=1000");
    win.document.write(`
      <html><head><title>Órdenes financieras</title>
      <style>
        body { font-family: Arial, sans-serif; color: #1f2937; padding: 16px; }
        h2 { margin: 0 0 4px; font-size: 18px; }
        p { margin: 0 0 12px; font-size: 12px; color: #6b7280; }
        .resumen { display: flex; gap: 24px; margin-bottom: 12px; font-size: 13px; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th, td { border-bottom: 1px solid #e5e7eb; padding: 6px; text-align: left; }
        th { background: #f9fafb; }
        td.num { text-align: right; }
      </style></head><body>
      <h2>Reporte de órdenes financieras</h2>
      <p>Del ${filtros.desde || "inicio"} al ${filtros.hasta || "hoy"}</p>
      <div class="resumen">
        <span>Total cotizaciones: <b>${formatMoney(resumen.total_cotizaciones)}</b></span>
        <span>Total aplicado: <b>${formatMoney(resumen.total_aplicado)}</b></span>
        <span>Saldo por cobrar: <b>${formatMoney(resumen.saldo_por_cobrar)}</b></span>
      </div>
      <table>
        <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
        <tbody>${rows
          .map((r) => `<tr>${headers.map((h) => `<td class="${esMonto(h) ? "num" : ""}">${celda(h, r[h])}</td>`).join("")}</tr>`)
          .join("")}</tbody>
      </table>
      </body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  const columns = useMemo(
    () => [
      {
        title: "Número de orden",
        dataIndex: "nro_orden_id",
        render: (value, o) => (
          <Link to={`/ver-orden/${o.id_orden}/${o.nro_orden_id}/${o.id_paciente}`}>{value}</Link>
        ),
      },
      {
        title: "Estado financiero",
        dataIndex: "estado_financiero",
        render: (value) => <span className={`of-badge ${badgeClass[value] || ""}`}>{value}</span>,
      },
      { title: "Fecha de Orden", dataIndex: "fecha_orden", render: formatFecha },
      { title: "Sucursal", dataIndex: "sucursal", render: nombreSucursal },
      { title: "Paciente", dataIndex: "paciente" },
      { title: "Cédula", dataIndex: "nro_cedula" },
      {
        title: "Fase Actual",
        dataIndex: "fase_actual",
        render: (value) => <span className="of-fase">{value}</span>,
      },
      { title: "Cotización", dataIndex: "nro_cotizacion" },
      {
        title: "Total cotización",
        dataIndex: "total_cotizacion",
        align: "right",
        render: (value) => <span className="of-num">{formatMoney(value)}</span>,
      },
      {
        title: "Total aplicado",
        dataIndex: "total_aplicado",
        align: "right",
        render: (value) => <span className="of-num">{formatMoney(value)}</span>,
      },
      {
        title: "Saldo por cobrar",
        dataIndex: "saldo_por_cobrar",
        align: "right",
        render: (value) => (
          <span className="of-num" style={{ fontWeight: Number(value) > 0 ? 600 : 400 }}>
            {formatMoney(value)}
          </span>
        ),
      },
    ],
    []
  );

  const cargando = status === "loading";

  return (
    <div className="of-wrapper">
      <div className="of-header">
        <div>
          <h2 className="of-title">Órdenes financieras</h2>
          <p className="of-subtitle">Cotizaciones, montos aplicados y saldos pendientes por orden</p>
        </div>
      </div>

      {sync.corriendo && (
        <div className="of-sync of-sync--info">
          <Spin size="small" />
          <span>
            Verificando pagos de anticipos en Interfuerza
            {sync.total > 0 ? ` (${sync.procesadas}/${sync.total})` : "..."}
          </span>
        </div>
      )}

      {desactualizada && !sync.corriendo && (
        <button type="button" className="of-sync of-sync--warning" onClick={sincronizarPagos}>
          <FaExclamationTriangle />
          <span>
            La data podría estar desactualizada. <b>Actualizar ahora</b>
          </span>
        </button>
      )}

      <div className="of-panel">
        <div className="of-filters">
          <div className="of-filter">
            <label>Fecha inicial</label>
            <input
              type="date"
              className="of-date"
              value={filtros.desde}
              max={filtros.hasta || undefined}
              onChange={(e) => cambiarFiltro("desde", e.target.value)}
            />
          </div>
          <div className="of-filter">
            <label>Fecha final</label>
            <input
              type="date"
              className="of-date"
              value={filtros.hasta}
              min={filtros.desde || undefined}
              onChange={(e) => cambiarFiltro("hasta", e.target.value)}
            />
          </div>
          <div className="of-filter">
            <label>Sucursal</label>
            <Select
              value={filtros.sucursal}
              onChange={(value) => cambiarFiltro("sucursal", value)}
              options={[
                { value: "todas", label: "Todas" },
                ...opciones.sucursales.map((s) => ({
                  value: String(s.id_sucursal),
                  label: nombreSucursal(s.nombre) || s.nombre,
                })),
              ]}
            />
          </div>
          <div className="of-filter">
            <label>Fase actual</label>
            <Select
              value={filtros.fase}
              onChange={(value) => cambiarFiltro("fase", value)}
              options={[
                { value: "", label: "Todas" },
                ...opciones.fases.map((f) => ({ value: f, label: f })),
              ]}
            />
          </div>
          <div className="of-filter">
            <label>Estado financiero</label>
            <Select
              value={filtros.estadoFinanciero}
              onChange={(value) => cambiarFiltro("estadoFinanciero", value)}
              options={ESTADOS_FINANCIEROS}
            />
          </div>
          <div className="of-filter of-filter-search">
            <label>Buscar</label>
            <Input
              allowClear
              prefix={<FaSearch style={{ color: "#9ca3af" }} />}
              placeholder="Buscar orden, paciente, cédula o cotización"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>

        <div className="of-toolbar">
          <div className="of-export">
            <Button size="small" icon={<FaFileExcel />} onClick={exportarExcel} loading={exportando}>
              Excel
            </Button>
            <Button size="small" icon={<FaFileCsv />} onClick={exportarCSV} disabled={exportando}>
              CSV
            </Button>
            <Button size="small" icon={<FaPrint />} onClick={imprimir} disabled={exportando}>
              Imprimir
            </Button>
            <Button size="small" icon={<FaCopy />} onClick={copiar} disabled={exportando}>
              Copiar
            </Button>
          </div>
          <div className="of-export">
            <VerificarPagosAnticipos
              buttonProps={{ size: "small", disabled: sync.corriendo }}
              onFinish={() => {
                setUltimaSync(Date.now());
                setDesactualizada(false);
                setFiltros((prev) => ({ ...prev }));
              }}
            />
            <Button size="small" type="link" onClick={limpiarFiltros}>
              Limpiar filtros
            </Button>
          </div>
        </div>
      </div>

      <div className="of-cards">
        <div className="of-card">
          <div className="of-card-label">Total cotizaciones</div>
          <div className="of-card-value">{formatMoney(resumen.total_cotizaciones)}</div>
          <div className="of-card-foot">{resumen.total_ordenes} órdenes</div>
        </div>
        <div className="of-card of-card--aplicado">
          <div className="of-card-label">Total aplicado</div>
          <div className="of-card-value">{formatMoney(resumen.total_aplicado)}</div>
          <div className="of-card-foot">Anticipos aplicados a órdenes</div>
        </div>
        <div className="of-card of-card--saldo">
          <div className="of-card-label">Saldo por cobrar</div>
          <div className="of-card-value">{formatMoney(resumen.saldo_por_cobrar)}</div>
          <div className="of-card-foot">Pendiente de cobro</div>
        </div>
      </div>

      <div className="of-panel">
        <Table
          className="of-table"
          size="middle"
          rowKey="id_orden"
          columns={columns}
          dataSource={data}
          loading={cargando}
          scroll={{ x: "max-content" }}
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total: meta.total,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, [from, to]) => `${from}-${to} de ${total} órdenes`,
            onChange: setPage,
          }}
        />
      </div>
    </div>
  );
}
