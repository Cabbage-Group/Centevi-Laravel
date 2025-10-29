import { Col, Row, Select } from "antd";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import DateRangeSeparate from "../../../reportes/DateRange";

const KpisConsultasTerapiasPorSucursal = ({
  kpisTerapiasConsultasSucursales,
  onDateApply = null,
  onDateReset = null,
  dateIsMonthPicker = true,
  filterTitle = "Filtrar:",
  onFilterChange = undefined,
  filterValue = undefined,
  filterOptions = [],
}) => {
  const cardStyle = {
    width: "100%",
    borderRadius: "20px",
    background: "linear-gradient(145deg, #ffffff, #f3f4f6)",
    boxShadow:
      "0 6px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.05), inset 0 0 0 rgba(255,255,255,0.3)",
    padding: "24px",
    transition: "all 0.3s ease",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: 700,
    color: "#333",
    textAlign: "center",
    marginBottom: "20px",
    letterSpacing: "0.5px",
  };

  const chartContainerStyle = {
    width: "100%",
    height: "300px",
  };

  const dispatch = useDispatch();

  function sumarConsultasYTerapias(data) {
    return data.map((item) => ({
      name: item.name,
      valor: (item.consultas || 0) + (item.terapia || 0),
    }));
  }

  return (
    <div style={cardStyle}>
      <Row gutter={[32, 12]}>
        <Col xs={24} sm={12} md={24} lg={12} xl={8} xxl={8}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <DateRangeSeparate
              onApply={onDateApply}
              onReset={onDateReset}
              isMonthPicker={dateIsMonthPicker}
            />
          </div>
        </Col>

        <Col xs={24} sm={12} md={24} lg={12} xl={8} xxl={8}>
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
              filterOption={(input, option) =>
                (option?.children || "").toString().toLowerCase().includes(input.toLowerCase())
              }
            >
              {(filterOptions || []).map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Col>
        <Col xs={24} sm={12} md={24} lg={12} xl={8} xxl={8}></Col>
      </Row>

      <div style={chartContainerStyle}>
        <ResponsiveContainer>
          <BarChart
            data={sumarConsultasYTerapias(kpisTerapiasConsultasSucursales)}
            margin={{ top: 10, right: 20, left: 0, bottom: 40 }} // Aumentamos el bottom para el texto girado
          >
            <defs>
              <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.7} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

            {/* 👇 Eje X mejorado */}
            <XAxis
              dataKey="name"
              stroke="#555"
              tick={{ fontSize: 11, fill: "#555" }} // texto más pequeño
              angle={-35} // inclinamos el texto
              textAnchor="end" // alineamos correctamente el texto inclinado
              interval={0} // muestra todas las etiquetas, incluso si son muchas
              height={60} // espacio adicional si las etiquetas son largas
            />

            <YAxis stroke="#555" />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            />
            <Bar dataKey="valor" fill="url(#colorBar)" radius={[6, 6, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default KpisConsultasTerapiasPorSucursal;
