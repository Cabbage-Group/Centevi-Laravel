import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  Legend,
} from "recharts";

/**
 * CustomizedAnalyticsBarChart
 *
 * Props :
 * {string} title - Texto pequeño que se muestra en la esquina (decorativo).
 * {Array<Object>} data - Array de objetos con la estructura usada por Recharts. Ej: [{ name: 'A', metric1: 10, metric2: 20 }, ...]
 *
 * Layout / estilo
 * {boolean} needCardWrapper - Si true, aplica estilo de "card" (background, padding, borderRadius, shadow).
 * {string|number} chartHeight - Alto del contenedor del chart (ej: "455px" o 400).
 * {any} exportRef - Ref opcional para exportar/imprimir solo el área del chart.
 *
 * Date controls (props separadas - NO objeto)
 * {boolean} dateIsMonthPicker - Si true, el DateRangeSeparate actúa como picker por meses.
 * {function|null} onDateApply - Callback cuando se aplica la fecha: (range) => {}
 * {function|null} onDateReset - Callback cuando se resetea la fecha.
 *
 * Filter (props separadas - NO objeto)
 * {string} filterTitle - Etiqueta encima del Select multiple.
 * {Array<{value:any,label:string}>} filterOptions - Opciones del Select (value + label).
 * {Array<any>|any} filterValue - Valor(s) seleccionados. Para mode="multiple" espera array.
 * {function} onFilterChange - onChange del Select: (vals) => {}
 *
 * Metrics / series
 * {Array<{label:string,value:string,color:string,active?:boolean}>} metrics - Definición de series/metrics.
 * {function|null} onMetricsChange - Si se provee, el componente es controlado para las series activas: (vals) => {}
 * {boolean} renderMetricSelector - Muestra u oculta el selector de series.
 *
 * Bar config (recharts)
 * {string|number} barCategoryGap - barCategoryGap para BarChart.
 * {number} barGap - barGap para BarChart.
 * {string} xDataKey - key del eje X (ej: "name").
 *
 */
const CustomizedAnalyticsBarChart = ({
  badgeLabel,
  data = [],

  needCardWrapper = false,
  chartHeight = "455px",
  

  exportRef = null,

  dateIsMonthPicker = true,
  onDateApply = null,
  onDateReset = null,

  filterTitle = "Filtrar:",
  filterOptions = [],
  filterValue = undefined,
  onFilterChange = undefined,

  // Metrics / series
  metrics = [],
  onMetricsChange = null,
  renderMetricSelector = false,

  // Bar config
  barCategoryGap = "50%",
  barGap = 0,
  barDataKey = "name",
  needLegend = false,
  legendAlignVertical = "top",
  legendAlignHorizontal = "center",
  barsOrientation = "vertical",
  barsCategorySize = 32,
}) => {
  // --- responsive bar size (same lógica que tenías) ---
  const [responsiveBarSize, setResponsiveBarSize] = useState(barsCategorySize);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      let size = barsCategorySize;

      if (w < 576) size = Math.round(barsCategorySize * 0.4);   // ~40%
      else if (w < 768) size = Math.round(barsCategorySize * 0.5); // ~50%
      else if (w < 992) size = Math.round(barsCategorySize * 0.65); // ~65%
      else if (w < 1200) size = Math.round(barsCategorySize * 0.75); // ~75%
      else if (w < 1600) size = Math.round(barsCategorySize * 0.9); // ~90%
      else size = barsCategorySize;

      setResponsiveBarSize(size);
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [barsCategorySize]);

  // --- Normalizar metrics: { label, value, color, active } ---
  const metricsNormalized = useMemo(
    () =>
      (metrics || []).map((m) => ({
        label: m.label,
        value: m.value,
        color: m.color,
        active: !!m.active,
        original: m,
      })),
    [metrics]
  );

  // valores activos controlados por prop metrics (si vienen marcados como active)
  const controlledActiveValues = useMemo(
    () => metricsNormalized.filter((m) => m.active).map((m) => m.value),
    [metricsNormalized]
  );

  // fallback: estado local cuando el padre NO controla la selección de metrics
  const [localActive, setLocalActive] = useState(
    controlledActiveValues.length
      ? controlledActiveValues
      : metricsNormalized.length
      ? metricsNormalized.map((m) => m.value)
      : []
  );

  useEffect(() => {
    // si el padre NO controla (onMetricsChange undefined), mantener local en sync con metrics prop
    if (!onMetricsChange) {
      setLocalActive(
        controlledActiveValues.length
          ? controlledActiveValues
          : metricsNormalized.length
          ? metricsNormalized.map((m) => m.value)
          : []
      );
    }
  }, [metricsNormalized, controlledActiveValues, onMetricsChange]);

  // activeValues: si el padre controla -> derived de metrics; si no -> estado local
  const activeValues = onMetricsChange ? controlledActiveValues : localActive;

  const handleMetricsChange = useCallback(
    (vals) => {
      if (onMetricsChange) onMetricsChange(vals);
      else setLocalActive(vals);
    },
    [onMetricsChange]
  );

  // render para tags en el Select multiple (estético)
  const tagRender = useCallback((props) => {
    const { label } = props;
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
  }, []);

  // tooltip custom
  const CustomTooltipBarras = useCallback(({ active, payload, label }) => {
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
  }, []);

  // estilos de "card" condicionales
  const cardStyles = useMemo(
    () =>
      needCardWrapper
        ? {
            background: "white",
            padding: "15px",
            borderRadius: "15px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
          }
        : { background: "transparent", padding: 0, borderRadius: 0 },
    [needCardWrapper]
  );

  const activeCount = Math.max(1, (activeValues && activeValues.length) || 1);
  const barSize = activeCount > 1 ? Math.max(8, Math.round(responsiveBarSize / activeCount)) : responsiveBarSize;

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
      {badgeLabel && (
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
          {badgeLabel}
        </div>
      )}

      <Row gutter={[32, 12]}>
        <Col xs={24} sm={12} md={24} lg={12} xl={12} xxl={12}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <DateRangeSeparate onApply={onDateApply} onReset={onDateReset} isMonthPicker={dateIsMonthPicker} />
          </div>
        </Col>

        <Col xs={24} sm={12} md={24} lg={12} xl={12} xxl={12}>
          <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <label
              style={{
                marginBottom: 8,
                width: "100%",
                display: "inline-block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
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
              {(filterOptions || []).map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Col>
      </Row>

      <div>
        {renderMetricSelector && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12, marginBottom: 6 }}>
            <Select
              mode="multiple"
              placeholder="Series"
              value={activeValues}
              onChange={handleMetricsChange}
              style={{ minWidth: 160 }}
              tagRender={tagRender}
              aria-label="Seleccionar series"
            >
              {metricsNormalized.map((opt) => (
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

        <div style={{ height: chartHeight }} ref={exportRef}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout={barsOrientation === "horizontal" ? "vertical" : "horizontal"} //  cambia layout = orienttacion ded las barras
              margin={{ top: 20, right: 50, left: 20, bottom: 80 }}
              isAnimationActive={false}
              barCategoryGap={barCategoryGap}
              barGap={barGap}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={barsOrientation !== "horizontal"} />

              {barsOrientation === "horizontal" ? (
                <>
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis 
                    dataKey={barDataKey} 
                    type="category" 
                    tick={{ fontSize: 10, angle: -45, textAnchor: "end" }}
                    tickFormatter={(v) =>
                      typeof v === "string" && v.length > 10 ? v.substring(0, 10) + "..." : v
                    }
                  />
                </>
              ) : (
                <>
                  <XAxis
                    dataKey={barDataKey}
                    tick={{ fontSize: 10, angle: -45, textAnchor: "end" }}
                    interval={0}
                    tickFormatter={(v) =>
                      typeof v === "string" && v.length > 10 ? v.substring(0, 10) + "..." : v
                    }
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                </>
              )}

              <Tooltip content={<CustomTooltipBarras />} cursor={{ fill: "transparent" }} />
              {needLegend && (
                <Legend
                  verticalAlign={legendAlignVertical}
                  align={legendAlignHorizontal}
                />
              )}
              {metricsNormalized.map((s) => {
                if (!activeValues.includes(s.value)) return null;
                return (
                  <Bar key={s.value} dataKey={s.value} fill={s.color} barSize={barSize} maxBarSize={barSize*1.3} shape={(props) => <rect {...props} />}>
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

export default CustomizedAnalyticsBarChart;