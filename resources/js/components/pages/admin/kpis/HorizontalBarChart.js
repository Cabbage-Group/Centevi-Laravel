// src/components/HorizontalBarChart.js
import React, { useEffect, useState, useMemo } from "react";
import DateRangeSeparate from "../../../../admin/reportes/DateRange";
import { Row, Col, Select } from "antd";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

/**
 * Props:
 * - title: string (texto del badge)
 * - data: array (set de datos para la grafica)
 * - needCardWrapper: boolean (agrega estilos de card o no)
 * - height: string (aumenta el tamaño de todo el contenedor del grafico)
 * - exportRef: useRef (es la referencia al grafico para poder extraerlo para pdfs, etc)
 * - isMonthPicker: bool (para DateRangeSeparate)
 * - onDateApply(newStart, newEnd) (function al aplicar rango de fecha)
 * - onDateReset() (function al restear el filtro de fecha)
 * - filterList: array (lista para el Select de filtrado, p.e. sucursales=[{id, label}]) (ojo busqueeda servidor)
 * - filterValueKey: string (clave del campo id en filterList, ej 'id_sucursal')
 * - filterLabelKey: string (clave del campo que hace de label en filterList, ej 'nombre')
 * - filterValue: array (valor/es seleccionado/s )
 * - onFilterChange(vals)
 * - metricsOptions: [{ label, value, color }] (cierto campo de la data que se quiere mostrar en una barra) (importante para mostrar data)
 * - activeMetrics: array (series activas) (barras que se mostraran en el grafico) (importante para mostrar data)
 * - renderMetricSelector: boolean (renderiza el select paara filtrar metricas localmente)
 * - onMetricsChange(vals) (si cambia las barras que se quieren mostrar) (ojo: busqueda local)
 * - xDataKey: default 'name' (etiqueta que sale en el eje x de la grafica, debe estar en la "data")
 */
const HorizontalBarChart = ({
  title,
  data = [],

  needCardWrapper = false,
  chartHeight = "455px",

  exportRef = null,       // ref para exportar solo el area del chart

  isMonthPicker = true,
  onDateApply,
  onDateReset,
  
  filterTitle = "Filtrar:",
  filterList = [],
  filterValueKey = "id",
  filterLabelKey = "name",
  filterValue = [],
  onFilterChange,

  metricsOptions = [],
  activeMetrics = [],

  renderMetricSelector = false,
  onMetricsChange,
  
  barCategoryGap = "50%",
  barGap = 0,
  xDataKey = "name",
}) => {

  /* ------------------------------------------------------------------------------
                            UseStates y data constante para logica
  ------------------------------------------------------------------------------ */
  const [responsiveBarSize, setResponsiveBarSize] = useState(28);


  /* ------------------------------------------------------------------------------
                                UseEffects
  ------------------------------------------------------------------------------ */
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      let size = 28;
      // breakpoints based on Ant Design
      if (w < 576) size = 12;       // xs
      else if (w < 768) size = 14;  // sm
      else if (w < 992) size = 20;  // md
      else if (w < 1200) size = 24; // lg
      else if (w < 1600) size = 28; // xl
      else size = 32;               // xxl
      setResponsiveBarSize(size);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  /* ------------------------------------------------------------------------------
                              Handlers y helpers
  ------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------
                              Custom JSX functions
  ------------------------------------------------------------------------------ */
  // internal tagRender (uses seriesOptions to show color)
  const internalTagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const opt = metricsOptions.find((o) => o.value === value) || {};
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "2px 8px",
          borderRadius: 12,
          border: "1px solid #c7c7c7",
          background: "#ededed",
          fontSize: 12,
        }}
      >
        {label}
      </span>
    );
  };

  // internal tooltip
  const CustomTooltipBarras = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "#f9f9f9",
            color: "#000",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold" }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: "5px 0", color: entry.color }}>
              {entry.name}: <strong>{entry.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const cardStyles = needCardWrapper
  ? {
      background: "white",
      padding: "15px",
      borderRadius: "15px",
      boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
    }
  : {
      background: "transparent",
      padding: 0,
      borderRadius: 0,
    };

  // tamaño ded barra segun la cantidad de barras activas
  const activeCount = activeMetrics.length || 1;
  const barSize = activeCount > 1 ? Math.max(8, Math.round(responsiveBarSize / activeCount)) : responsiveBarSize;

  /* ------------------------------------------------------------------------------
                                Return Main View
  ------------------------------------------------------------------------------ */
  return (
    <div
      style={{
        ...cardStyles,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        justifyContent: "space-between",
      }}
    >
      {/* Badge */}
      {title && (
        <div
          style={{
            position: "absolute",
            background: "orange",
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingTop: "2px",
            paddingBottom: "2px",
            bottom: "10px",
            right: "20px",
            fontSize: "10px",
            color: "white",
            borderRadius: "8px",
          }}
        >
          {title}
        </div>
      )}

      {/* Row: DateRange + Filter */}
      <Row gutter={[32, 12]}>
        <Col xs={24} sm={12} md={24} lg={12} xl={12} xxl={12}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <DateRangeSeparate onApply={onDateApply} onReset={onDateReset} isMonthPicker={isMonthPicker} />
          </div>
        </Col>

        <Col xs={24} sm={12} md={24} lg={12} xl={12} xxl={12}>
          <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <label style={{ marginBottom: 8, width: "100%", display: "inline-block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {filterTitle}
            </label>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Selecciona"
              onChange={onFilterChange}
              value={filterValue || undefined}
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => (option?.children || "").toString().toLowerCase().includes(input.toLowerCase())}
            >
              {filterList.map((item) => (
                <Select.Option key={item[filterValueKey]} value={item[filterValueKey]}>
                  {item[filterLabelKey]}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Col>
      </Row>

      {/* Seccion grafico y filtro local side */}
      <div>
        {/* Select para las Metricas de control - rendizado opcional con renderMetricSelector */}
        {renderMetricSelector && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12, marginBottom: 6 }}>
            <Select
              mode="multiple"
              placeholder="Series"
              value={activeMetrics}
              onChange={onMetricsChange}
              style={{ minWidth: 160 }}
              tagRender={internalTagRender}
              aria-label="Seleccionar series"
            >
              {metricsOptions.map((opt) => (
                <Select.Option key={opt.value} value={opt.value}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 10, height: 10, background: opt.color, borderRadius: 3 }} />
                    {opt.label}
                  </span>
                </Select.Option>
              ))}
            </Select>
          </div>
        )}
        {/* Chart */}
        <div style={{ height: chartHeight }} ref={exportRef}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 50, left: 20, bottom: 80 }} isAnimationActive={false} barCategoryGap={barCategoryGap} barGap={barGap}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={xDataKey} tick={{ fontSize: 10, angle: -45, textAnchor: "end" }} interval={0} tickFormatter={(v) => (typeof v === "string" && v.length > 10 ? v.substring(0, 10) + "..." : v)} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltipBarras />} cursor={{ fill: "transparent" }} />

              {metricsOptions.map((s) => {
                if (!activeMetrics.includes(s.value)) return null;
                return (
                  <Bar key={s.value} dataKey={s.value} fill={s.color} barSize={barSize} maxBarSize={48} shape={(props) => <rect {...props} />}>
                    {data.map((entry, idx) => (
                      <Cell key={`${s.value}-${idx}`} fill={s.color} />
                    ))}
                  </Bar>
                );
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HorizontalBarChart;
