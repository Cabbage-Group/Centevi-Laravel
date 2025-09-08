// src/components/HorizontalBarChart.js
import React from "react";
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
 * - data: array (datos del chart)
 * - isMonthPicker: bool (para DateRangeSeparate)
 * - onDateApply(newStart, newEnd)
 * - onDateReset()
 * - filterTitle: string (para el titulo del filtro)
 * - filterList: array (lista para el Select de filtrado, p.e. sucursales)
 * - filterValueKey: string (clave del id en filterList, ej 'id_sucursal')
 * - filterLabelKey: string (clave del label en filterList, ej 'nombre')
 * - filterValue: array (valor seleccionado)
 * - onFilterChange(vals)
 * - seriesOptions: [{ label, value, color }]
 * - activeSeries: array (series activas)
 * - onSeriesChange(vals)
 * - tagRender: fn opcional para custom tags del Select de series
 * - tickFormatter: fn para X axis
 * - responsiveBarSize: number
 * - barCategoryGap, barGap: opcionales
 * - xDataKey: default 'name'
 * - tooltipComponent: componente o elemento para Tooltip content
 */
const HorizontalBarChart = ({
  title,
  data = [],
  isMonthPicker = true,
  onDateApply,
  onDateReset,
  filterTitle = "Filtrar:",
  filterList = [],
  filterValueKey = "id",
  filterLabelKey = "name",
  filterValue = [],
  onFilterChange,
  seriesOptions = [],
  activeSeries = [],
  onSeriesChange,
  tagRender,
  tickFormatter,
  responsiveBarSize = 28,
  barCategoryGap = "50%",
  barGap = 0,
  xDataKey = "name",
  tooltipComponent = null,
}) => {
  const activeCount = activeSeries.length || 1;
  const barSize = activeCount > 1 ? Math.max(8, Math.round(responsiveBarSize / activeCount)) : responsiveBarSize;

  return (
    <div
      style={{
        background: "white",
        padding: "15px",
        height: "600px",
        borderRadius: "15px",
        display: "flex",
        flexDirection: "column",
        marginTop: "15px",
        position: "relative",
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

      {/* Series control */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12, marginBottom: 6 }}>
        <Select
          mode="multiple"
          placeholder="Series"
          value={activeSeries}
          onChange={onSeriesChange}
          style={{ minWidth: 160 }}
          tagRender={tagRender}
          aria-label="Seleccionar series"
        >
          {seriesOptions.map((opt) => (
            <Select.Option key={opt.value} value={opt.value}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 10, height: 10, background: opt.color, borderRadius: 3 }} />
                {opt.label}
              </span>
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Chart */}
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 50, left: 20, bottom: 80 }} isAnimationActive={false} barCategoryGap={barCategoryGap} barGap={barGap}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xDataKey} tick={{ fontSize: 10, angle: -45, textAnchor: "end" }} interval={0} tickFormatter={tickFormatter} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip content={tooltipComponent} cursor={{ fill: "transparent" }} />

            {seriesOptions.map((s) => {
              if (!activeSeries.includes(s.value)) return null;
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
  );
};

export default HorizontalBarChart;