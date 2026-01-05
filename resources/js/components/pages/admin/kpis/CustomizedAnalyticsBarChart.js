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

const CustomizedAnalyticsBarChart = ({
  badgeLabel,
  data = [],

  needCardWrapper = false,
  chartHeight = "455px",
  exportRef = null,

  dateIsMonthPicker = true,
  onDateApply = null,
  onDateReset = null,

  // 🔴 Legacy filter
  filterTitle = "Filtrar:",
  filterOptions = [],
  filterValue = undefined,
  onFilterChange = undefined,

  // 🟢 Nuevo sistema de filtros
  filters = null,

  // Metrics
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
  /* ---------------- responsive bar size ---------------- */
  const [responsiveBarSize, setResponsiveBarSize] = useState(barsCategorySize);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      let size = barsCategorySize;

      if (w < 576) size *= 0.4;
      else if (w < 768) size *= 0.5;
      else if (w < 992) size *= 0.65;
      else if (w < 1200) size *= 0.75;
      else if (w < 1600) size *= 0.9;

      setResponsiveBarSize(Math.round(size));
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [barsCategorySize]);

  /* ---------------- metrics logic (sin cambios) ---------------- */
  const metricsNormalized = useMemo(
    () =>
      (metrics || []).map((m) => ({
        ...m,
        active: !!m.active,
      })),
    [metrics]
  );

  const controlledActiveValues = useMemo(
    () => metricsNormalized.filter((m) => m.active).map((m) => m.value),
    [metricsNormalized]
  );

  const [localActive, setLocalActive] = useState(controlledActiveValues);

  const activeValues = onMetricsChange ? controlledActiveValues : localActive;

  const handleMetricsChange = useCallback(
    (vals) => {
      onMetricsChange ? onMetricsChange(vals) : setLocalActive(vals);
    },
    [onMetricsChange]
  );

  const tagRender = useCallback(({ label }) => {
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

  /* ---------------- styles ---------------- */
  const cardStyles = useMemo(
    () =>
      needCardWrapper
        ? {
            background: "white",
            padding: "15px",
            borderRadius: "15px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
          }
        : {},
    [needCardWrapper]
  );

  const activeCount = Math.max(1, activeValues.length || 1);
  const barSize =
    activeCount > 1
      ? Math.max(8, Math.round(responsiveBarSize / activeCount))
      : responsiveBarSize;

  /* ======================= RENDER ======================= */
  return (
    <div
      style={{
        ...cardStyles,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Badge */}
      {badgeLabel && (
        <div
          style={{
            position: "absolute",
            background: "orange",
            padding: "2px 10px",
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

      {/* ================= HEADER: FECHA + FILTROS ================= */}
      <Row gutter={[32, 12]}>
        {/* FECHA */}
        <Col xs={24} sm={12}>
          <DateRangeSeparate
            onApply={onDateApply}
            onReset={onDateReset}
            isMonthPicker={dateIsMonthPicker}
          />
        </Col>

        {/* LEGACY FILTER (SIEMPRE VISIBLE) */}
        <Col xs={24} sm={12}>
          {onFilterChange && (
            <div style={{ width: "100%" }}>
              <label
                style={{
                  marginBottom: 6,
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
                filterOption={(input, option) =>
                  (option?.children || "")
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {(filterOptions || []).map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}
        </Col>
      </Row>

      {/* ================= NUEVOS FILTROS (OTRA FILA) ================= */}
      {Array.isArray(filters) && filters.length > 0 && (
        <Row gutter={[16, 12]} style={{ marginTop: 12 }}>
          {filters.map((f) => (
            <Col key={f.key} xs={24} sm={24} md={12} lg={10}>
              <label
                style={{
                  marginBottom: 6,
                  display: "inline-block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {f.title}
              </label>
              <Select
                mode={f.mode === "single" ? undefined : "multiple"}
                style={{ width: "100%" }}
                value={f.value}
                onChange={f.onChange}
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="Selecciona"
              >
                {(f.options || []).map((o) => (
                  <Select.Option key={o.value} value={o.value}>
                    {o.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          ))}
        </Row>
      )}

      {/* ================= METRICS SELECTOR ================= */}
      {renderMetricSelector && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 12,
            marginBottom: 6,
          }}
        >
          <Select
            mode="multiple"
            placeholder="Series"
            value={activeValues}
            onChange={handleMetricsChange}
            style={{ minWidth: 160 }}
            tagRender={tagRender}
          >
            {metricsNormalized.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      background: opt.color,
                      borderRadius: 3,
                    }}
                  />
                  {opt.label}
                </span>
              </Select.Option>
            ))}
          </Select>
        </div>
      )}

      {/* ================= CHART (SIN CAMBIOS) ================= */}
      <div style={{ height: chartHeight }} ref={exportRef}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout={barsOrientation === "horizontal" ? "vertical" : "horizontal"}
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

            <Tooltip cursor={{ fill: "transparent" }} />
            {needLegend && (
              <Legend verticalAlign={legendAlignVertical} align={legendAlignHorizontal} />
            )}

            {metricsNormalized.map((s) => {
              if (!activeValues.includes(s.value)) return null;
              return (
                <Bar
                  key={s.value}
                  dataKey={s.value}
                  fill={s.color}
                  barSize={barSize}
                  maxBarSize={barSize * 1.3}
                >
                  {data.map((_, idx) => (
                    <Cell key={`${s.value}-${idx}`} fill={s.color} />
                  ))}
                </Bar>
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomizedAnalyticsBarChart;