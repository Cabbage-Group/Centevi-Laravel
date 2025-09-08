import React, { useEffect, useState } from "react";
import DateRangeSeparate from "../../reportes/DateRange";
import { Checkbox, Col, Row, Select, Divider } from "antd";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  fetchKpisTerapiasConsultasDoctor,
  fetchKpisTerapiasConsultasSucursales,
  setFechaRangeTerapiasConsultasCYTDoctores,
  setFechaRangeTerapiasConsultasCYTSucursal,
  setFechaRangeTerapiasPorDoctores,
} from "../../../redux/features/kpis/kpisConsultasTerapias/kpisConsultasTerapiasSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchSucursales } from "../../../redux/features/sucursales/sucursalesSlice";
import { fetchUsuarios } from "../../../redux/features/usuarios/usuariosSlice";
import KpisConsultasTerapiasDoctores from "../KpisConsultasTerapias/kpisConsultasTerapiasDoctores/KpisConsultasTerapiasDoctores";
// import KpisConsultasTerapiasSucursales from "../KpisConsultasTerapias/kpisConsultasTerapiasSucursales/KpisConsultasTerapiasSucursales";

const SERIES_OPTIONS = [
  { label: "Consultas", value: "consultas", color: "#6C5CE7" },
  { label: "Terapias", value: "terapia", color: "#00B894" },
];

const tagRender = (props) => {
  const { label, value } = props;
  const opt = SERIES_OPTIONS.find((o) => o.value === value) || {};
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "2px 8px",
        borderRadius: 12,
        border: "1px solid #eee",
        background: "#fff",
        fontSize: 12,
      }}
    >
      {/* <span style={{width: 10,height: 10,background: opt.color || "#ccc",borderRadius: 3,display: "inline-block",}}/> */}
      {label}
    </span>
  );
};

const VerKpisConsultasYTerapias = () => {
  const dispatch = useDispatch();
  const { sucursales } = useSelector((state) => state.sucursales);
  const { doctores_activados } = useSelector((state) => state.usuarios);
  const {
    kpisTerapiasConsultasSucursales,
    kpisTerapiasConsultasDoctor,
  } = useSelector((state) => state.kpisConsultasTerapias);

  const [activeLinesCYTSucursales, setActiveLinesCYTSucursales] = useState([
    "consultas",
    "terapia",
  ]);
  const [activeLinesCYTDoctores, setActiveLinesCYTDoctores] = useState([
    "consultas",
    "terapia",
  ]);
  const [localStartDateCYTSucursales, setLocalStartDateCYTSucursales] =
    useState();
  const [localStartDateCYTDoctores, setLocalStartDateCYTDoctores] =
    useState();
  const [localEndDateCYTSucursales, setLocalEndDateCYTSucursales] =
    useState();
  const [localEndDateCYTDoctores, setLocalEndDateCYTDoctores] = useState();
  const [cytsucursalFilter, setCYTSucursalFilter] = useState([]);
  const [cytdoctorFilter, setCYTDoctorFilter] = useState([]);

  useEffect(() => {
    dispatch(fetchSucursales({}));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUsuarios({}));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchKpisTerapiasConsultasSucursales({
        startDate: localStartDateCYTSucursales,
        endDate: localEndDateCYTSucursales,
        sucursales: cytsucursalFilter,
      })
    );
  }, [dispatch, localStartDateCYTSucursales, localEndDateCYTSucursales, cytsucursalFilter]);

  useEffect(() => {
    dispatch(
      fetchKpisTerapiasConsultasDoctor({
        startDate: localStartDateCYTDoctores,
        endDate: localEndDateCYTDoctores,
        doctores: cytdoctorFilter,
      })
    );
  }, [dispatch, localStartDateCYTDoctores, localEndDateCYTDoctores, cytdoctorFilter]);

  const truncateXAxisCYTSucursales = (value) =>
    value && value.length > 10 ? value.substring(0, 10) + "..." : value;

  const truncateXAxisCYTDoctores = (value) =>
    value && value.length > 10 ? value.substring(0, 10) + "..." : value;

  const handleDateApplyCYTSucursales = (newStartDate, newEndDate) => {
    setLocalStartDateCYTSucursales(newStartDate);
    setLocalEndDateCYTSucursales(newEndDate);
    dispatch(
      setFechaRangeTerapiasConsultasCYTSucursal({ startDate: newStartDate, endDate: newEndDate })
    );
  };

  const handleDateApplyCYTDoctores = (newStartDate, newEndDate) => {
    setLocalStartDateCYTDoctores(newStartDate);
    setLocalEndDateCYTDoctores(newEndDate);
    dispatch(setFechaRangeTerapiasPorDoctores({ startDate: newStartDate, endDate: newEndDate }));
  };

  const handleDateResetCYTSucursales = () => {
    const newEndDate = new Date();
    const newStartDate = new Date(newEndDate.getFullYear(), newEndDate.getMonth() - 12, 1);
    const lastDayOfCurrentMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth() + 1, 0);
    const startDateFormatted = newStartDate.toISOString().split("T")[0];
    const endDateFormatted = lastDayOfCurrentMonth.toISOString().split("T")[0];
    setLocalStartDateCYTSucursales(startDateFormatted);
    setLocalEndDateCYTSucursales(endDateFormatted);
    dispatch(
      setFechaRangeTerapiasConsultasCYTSucursal({
        startDate: startDateFormatted,
        endDate: endDateFormatted,
      })
    );
  };

  const handleDateResetCYTDoctores = () => {
    const newEndDate = new Date();
    const newStartDate = new Date(newEndDate.getFullYear(), newEndDate.getMonth() - 12, 1);
    const lastDayOfCurrentMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth() + 1, 0);
    const startDateFormatted = newStartDate.toISOString().split("T")[0];
    const endDateFormatted = lastDayOfCurrentMonth.toISOString().split("T")[0];
    setLocalStartDateCYTDoctores(startDateFormatted);
    setLocalEndDateCYTDoctores(endDateFormatted);
    dispatch(
      setFechaRangeTerapiasConsultasCYTDoctores({
        startDate: startDateFormatted,
        endDate: endDateFormatted,
      })
    );
  };

  const handleChangeCYTSucursales = (value) => {
    setCYTSucursalFilter(value);
  };

  const handleChangeCYTDoctores = (value) => {
    setCYTDoctorFilter(value);
  };

  // Nuevo: cambio del "legend" por Select
  const onLegendChangeCYTSucursales = (values) => {
    // si values vacío, conservar ninguno seleccionado -> el chart quedará vacío
    setActiveLinesCYTSucursales(values);
  };
  const onLegendChangeCYTDoctores = (values) => {
    setActiveLinesCYTDoctores(values);
  };

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

  const renderLinesCYTSucursales = () => {
    const lines = [];
    const activeCount = activeLinesCYTSucursales.length;
    const size = activeCount > 1 ? 14 : 28; // más delgadas si hay varias series

    if (activeLinesCYTSucursales.includes("consultas")) {
      lines.push(
        <Bar
          key="consultas"
          dataKey="consultas"
          fill="#6C5CE7"
          barSize={size}
          maxBarSize={48}
          shape={(props) => <rect {...props} />}
        />
      );
    }
    if (activeLinesCYTSucursales.includes("terapia")) {
      lines.push(
        <Bar
          key="terapia"
          dataKey="terapia"
          fill="#00B894"
          barSize={size}
          maxBarSize={48}
          shape={(props) => <rect {...props} />}
        />
      );
    }
    return lines;
  };

  const renderLinesCYTDoctores = () => {
    const lines = [];
    const activeCount = activeLinesCYTDoctores.length;
    const size = activeCount > 1 ? 14 : 28;

    if (activeLinesCYTDoctores.includes("consultas")) {
      lines.push(
        <Bar
          key="consultas"
          dataKey="consultas"
          fill="#6C5CE7"
          barSize={size}
          maxBarSize={48}
          // shape={(props) => <rect {...props} rx={6} ry={6} />}
          shape={(props) => <rect {...props} />}
        />
      );
    }
    if (activeLinesCYTDoctores.includes("terapia")) {
      lines.push(
        <Bar
          key="terapia"
          dataKey="terapia"
          fill="#00B894"
          barSize={size}
          maxBarSize={48}
          shape={(props) => <rect {...props}/>}
        />
      );
    }
    return lines;
  };

  return (
    <div style={{ width: "100%", marginBottom: '30px' }}>
      <Row justify="center">
        <Col xs={24} sm={24} md={22} lg={22} xl={20} xxl={18}>
          <Row>
            <Col sm={24} xs={24}>
              <div style={{ color: "black", fontWeight: "bold", fontSize: 16 }}>
                Reporteria de Consultas & Terapias
              </div>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            
            <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
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
                  Sucursales
                </div>

                <Row gutter={[32, 12]}>
                  <Col xs={24} sm={12} md={24} lg={12} xl={12} xxl={12}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <DateRangeSeparate
                        onApply={handleDateApplyCYTSucursales}
                        onReset={handleDateResetCYTSucursales}
                        isMonthPicker={true}
                      />
                    </div>
                  </Col>

                  <Col xs={24} sm={12} md={24} lg={12} xl={12} xxl={12}>
                    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                      <label style={{ marginBottom: 8 }}>Filtrar por Sucursal:</label>
                      <Select
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder="Selecciona la sucursal"
                        onChange={handleChangeCYTSucursales}
                        value={cytsucursalFilter || undefined}
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.children || "").toString().toLowerCase().includes(input.toLowerCase())
                        }
                      >
                        {sucursales.map((sucursal) => (
                          <Select.Option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                            {sucursal.nombre}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </Col>
                </Row>

                {/* Nuevo control de series (Select) */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12, marginBottom: 6 }}>
                  <Select
                    mode="multiple"
                    placeholder="Series"
                    value={activeLinesCYTSucursales}
                    onChange={onLegendChangeCYTSucursales}
                    style={{ minWidth: 160 }}
                    tagRender={tagRender}
                    aria-label="Seleccionar series"
                  >
                    {SERIES_OPTIONS.map((opt) => (
                      <Select.Option key={opt.value} value={opt.value}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 10, height: 10, background: opt.color, borderRadius: 3 }} />
                          {opt.label}
                        </span>
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                {/* ---------------------- Grafico de Barras ---------------------- */}
                <div style={{ flex: 1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={kpisTerapiasConsultasSucursales}
                      margin={{ top: 20, right: 50, left: 20, bottom: 80 }}
                      isAnimationActive={false}
                      barCategoryGap="50%"
                      barGap={0}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10, angle: -45, textAnchor: "end" }}
                        interval={0}
                        tickFormatter={truncateXAxisCYTSucursales}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip content={<CustomTooltipBarras />} cursor={{ fill: "transparent" }} />
                      {renderLinesCYTSucursales()}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Col>

            <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
              <div
                style={{
                  background: "white",
                  padding: "15px",
                  height: "600px",
                  borderRadius: "15px",
                  marginTop: "15px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
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
                  Doctores
                </div>

                <Row gutter={[32, 12]}>
                  <Col xs={24} sm={12} md={24} lg={12} xl={12} xxl={12}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <DateRangeSeparate
                        onApply={handleDateApplyCYTDoctores}
                        onReset={handleDateResetCYTDoctores}
                        isMonthPicker={true}
                      />
                    </div>
                  </Col>

                  <Col xs={24} sm={12} md={24} lg={12} xl={12} xxl={12}>
                    <div style={{ display: "flex", flexDirection: "column"}}>
                      <label style={{ marginBottom: 8 }}>Filtrar por Doctor:</label>
                      <Select
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder="Selecciona el doctor"
                        onChange={handleChangeCYTDoctores}
                        value={cytdoctorFilter || undefined}
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {doctores_activados.map((doctor) => (
                          <Select.Option key={doctor.id_usuario} value={doctor.nombre}>
                            {doctor.nombre}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </Col>
                </Row>

                {/* Nuevo control de series para doctores */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12, marginBottom: 6 }}>
                  <Select
                    mode="multiple"
                    placeholder="Series"
                    value={activeLinesCYTDoctores}
                    onChange={onLegendChangeCYTDoctores}
                    style={{ minWidth: 160 }}
                    tagRender={tagRender}
                    aria-label="Seleccionar series doctores"
                  >
                    {SERIES_OPTIONS.map((opt) => (
                      <Select.Option key={opt.value} value={opt.value}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 10, height: 10, background: opt.color, borderRadius: 3 }} />
                          {opt.label}
                        </span>
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                {/* ---------------------- Grafico de Barras ---------------------- */}
                <div style={{ flex: 1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={kpisTerapiasConsultasDoctor}
                      margin={{ top: 20, right: 50, left: 20, bottom: 80 }}
                      isAnimationActive={false}
                      barCategoryGap="50%"
                      barGap={0}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10, angle: -45, textAnchor: "end" }}
                        interval={0}
                        tickFormatter={truncateXAxisCYTDoctores}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip content={<CustomTooltipBarras />} cursor={{ fill: "transparent" }} />
                      {renderLinesCYTDoctores()}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Col>
          </Row>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
              <KpisConsultasTerapiasDoctores doctores_activados={doctores_activados} />
            </Col>
          </Row>


        </Col>
      </Row>
    </div>
  );
};

export default VerKpisConsultasYTerapias;
