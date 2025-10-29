import React, { useEffect, useState, useRef } from "react";
import { Col, Row, Divider } from "antd";
import {
  fetchKpisTerapiasConsultasDoctor,
  fetchKpisTerapiasConsultasSucursales,
  fetchKpisTerapiasPorDoctores,
  setFechaRangeTerapiasConsultasCYTDoctores,
  setFechaRangeTerapiasConsultasCYTSucursal,
  setFechaRangeTerapiasPorDoctores,
} from "../../../redux/features/kpis/kpisConsultasTerapias/kpisConsultasTerapiasSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchSucursales } from "../../../redux/features/sucursales/sucursalesSlice";
import { fetchUsuarios } from "../../../redux/features/usuarios/usuariosSlice";
import KpisConsultasTerapiasDoctores from "../KpisConsultasTerapias/kpisConsultasTerapiasDoctores/KpisConsultasTerapiasDoctores";
// import KpisConsultasTerapiasSucursales from "../KpisConsultasTerapias/kpisConsultasTerapiasSucursales/KpisConsultasTerapiasSucursales";

import CustomizedAnalyticsBarChart from "../../../components/pages/admin/kpis/CustomizedAnalyticsBarChart";
import PdfActionButtons from "../../../components/buttons/admin/kpis/PdfActionButtons";
import PdfPreviewModal from "../../../components/modals/pdfs/PdfPreviewModal";
import ChartsConsultasYTerapias from "../../../services/pdf/kpis/kpisConsultasYTerapias/ChartsConsultasYTerapias";
import { preparePdfChartsData } from "../../../utils/admin/kpis/PreparePdfChartsData";
import { setMetricsActiveByValues } from "../../../utils/admin/kpis/setMetricsActiveByValues";
import KpisConsultasTerapiasPorSucursal from "./componentes/KpisConsultasTerapiasPorSucursal";
import CardPieChart from "./componentes/KpisConsultasTerapiasPie";

const VerKpisConsultasYTerapias = () => {
  const buttons = [
    { label: "Por Sucursal", value: false },
    { label: "Por Terapia", value: true },
  ];

  const baseButtonStyle = {
    position: "relative",
    padding: "10px 24px",
    borderRadius: "16px",
    fontWeight: 600,
    fontSize: "15px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    color: "#444",
  };

  const activeButtonStyle = {
    background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
    color: "#fff",
    boxShadow: "0 4px 12px rgba(99,102,241,0.5)",
    transform: "scale(1.05)",
  };

  const hoveredButtonStyle = {
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    transform: "scale(1.05)",
  };

  const [porSucursal, setPorSucursal] = useState(false);
  const [hovered, setHovered] = useState(null);

  // const [hovered, setHovered] = useState(false);

  const baseStyle = {
    background: "linear-gradient(135deg, #ffffff, #f8f9ff)",
    borderRadius: "16px",
    height: "130px",
    width: "300px",
    textAlign: "center",
    color: "#1e1e1e",
    fontSize: "30px",
    fontWeight: 700,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #E0E7FF",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease-in-out",
    cursor: "pointer",
  };

  const hoveredStyle = {
    transform: "translateY(-4px) scale(1.03)",
    boxShadow: "0 10px 20px rgba(99,102,241,0.3)",
    border: "1px solid #818CF8",
    background: "linear-gradient(135deg, #eef2ff, #ffffff)",
  };

  const iconStyle = {
    fontSize: "28px",
    color: "#6366F1",
    marginBottom: "8px",
  };

  const subtitleStyle = {
    fontSize: "14px",
    color: "#4B5563",
    fontWeight: 500,
    marginTop: "4px",
  };

  /* ------------------------------------------------------------------------------
                                Redux: Dispatch - Store y data
  ------------------------------------------------------------------------------ */
  const dispatch = useDispatch();

  const { sucursales } = useSelector((state) => state.sucursales);
  const { doctores_activados } = useSelector((state) => state.usuarios);
  const { kpisTerapiasConsultasSucursales, kpisTerapiasConsultasDoctor, kpisTerapiasPorDoctores } =
    useSelector((state) => state.kpisConsultasTerapias);

  /* ------------------------------------------------------------------------------
                            UseStates y data constante para logica
  ------------------------------------------------------------------------------ */
  const [activeLinesCYTSucursales, setActiveLinesCYTSucursales] = useState([
    { label: "Consultas", value: "consultas", color: "#6C5CE7", active: true },
    { label: "Terapias", value: "terapia", color: "#00B894", active: true },
  ]);
  const [activeLinesCYTDoctores, setActiveLinesCYTDoctores] = useState([
    { label: "Consultas", value: "consultas", color: "#6C5CE7", active: true },
    { label: "Terapias", value: "terapia", color: "#00B894", active: true },
  ]);
  const [localStartDateCYTSucursales, setLocalStartDateCYTSucursales] = useState();
  const [localStartDateCYTDoctores, setLocalStartDateCYTDoctores] = useState();
  const [localEndDateCYTSucursales, setLocalEndDateCYTSucursales] = useState();
  const [localEndDateCYTDoctores, setLocalEndDateCYTDoctores] = useState();
  const [cytsucursalFilter, setCYTSucursalFilter] = useState([]); // funciona con ids(number[])
  const [cytdoctorFilter, setCYTDoctorFilter] = useState([]); // funciona con nombres(string[])

  // teercer grafico terapias de doctor
  const [localStartDateTerapiasPorDoctores, setLocalStartDateTerapiasPorDoctores] = useState();
  const [localEndDateTerapiasPorDoctores, setLocalEndDateTerapiasPorDoctores] = useState();
  const [activeLinesTerapiasPorDoctores, setActiveLinesTerapiasPorDoctores] = useState([]);
  const [terapiasFilter, setTerapiasFilter] = useState([]);

  const opcionesTerapias = [
    { label: "Terapia Baja Visión", value: "terapia_baja_vision" },
    { label: "Terapia Optometria Neonatos", value: "terapia_optometria_neonatos" },
    { label: "Terapia Ortoptica Adultos", value: "terapia_ortoptica_adultos" },
    { label: "Terapia Optometria Pediatrica", value: "terapia_optometria_pediatrica" },
  ];

  // para generacion y muestra de pdfs
  const [cytsucursalFilterToString, setCYTSucursalFilterToString] = useState([]); // formateado para graficos con nombres(number[])
  const [showModalPdf, setShowModalPdf] = useState(false);
  const [chartsData, setChartsData] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const chartDoctoresExportRef = useRef(null);
  const chartSucursalesExportRef = useRef(null);
  const chartTerapiasDoctoresExportRef = useRef(null);

  // data para graficos pdf:
  const pdfChartsRawData = [
    {
      ref: chartSucursalesExportRef,
      title: "Gráfico distribuido por sucursales",
      filters: {
        metrics: activeLinesCYTSucursales,
        categories: cytsucursalFilterToString,
        rangeDate: { start: localStartDateCYTSucursales, end: localEndDateCYTSucursales },
      },
    },
    {
      ref: chartDoctoresExportRef,
      title: "Gráfico distribuido por doctores",
      filters: {
        metrics: activeLinesCYTDoctores,
        categories: cytdoctorFilter,
        rangeDate: { start: localStartDateCYTDoctores, end: localEndDateCYTDoctores },
      },
    },
    {
      ref: chartTerapiasDoctoresExportRef,
      title: "Gráfico terapias de doctores",
      filters: {
        metrics: activeLinesTerapiasPorDoctores,
        categories: terapiasFilter,
        rangeDate: {
          start: localStartDateTerapiasPorDoctores,
          end: localEndDateTerapiasPorDoctores,
        },
      },
    },
  ];

  /* ------------------------------------------------------------------------------
                                UseEffects
  ------------------------------------------------------------------------------ */
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

  // Para invalidar imágenes de graficos pdf cuando cambien filtros/fechas/series
  useEffect(() => {
    // Si ya hay imágenes generadas y se cambia algún filtro/fecha/series, limpiarlas
    if (chartsData && chartsData.length > 0) {
      setChartsData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // sucursales chart
    localStartDateCYTSucursales,
    localEndDateCYTSucursales,
    cytsucursalFilter,
    activeLinesCYTSucursales,
    // doctores chart
    localStartDateCYTDoctores,
    localEndDateCYTDoctores,
    cytdoctorFilter,
    activeLinesCYTDoctores,
    // terapias doctores chart
    localStartDateTerapiasPorDoctores,
    localEndDateTerapiasPorDoctores,
    activeLinesTerapiasPorDoctores,
    terapiasFilter,
  ]);

  useEffect(() => {
    if (doctores_activados?.length > 0) {
      const doctorColors = [
        "#FF6347",
        "#FF9800",
        "#4CAF50",
        "#2196F3",
        "#9C27B0",
        "#9B59B6",
        "#16A085",
        "#F1C40F",
        "#D35400",
        "#7F8C8D",
        "#27AE60",
      ];
      const formattedData = doctores_activados.map((doctor, index) => {
        const color = doctorColors[index % doctorColors.length];
        return {
          label: doctor.nombre,
          value: doctor.nombre,
          color,
          active: true,
        };
      });
      setActiveLinesTerapiasPorDoctores(formattedData);
    }
  }, [doctores_activados]);

  useEffect(() => {
    dispatch(
      fetchKpisTerapiasPorDoctores({
        startDate: localStartDateTerapiasPorDoctores,
        endDate: localEndDateTerapiasPorDoctores,
        terapias: terapiasFilter,
      })
    );
  }, [localStartDateTerapiasPorDoctores, localEndDateTerapiasPorDoctores, terapiasFilter]);

  /* ------------------------------------------------------------------------------
                                  Handlers
  ------------------------------------------------------------------------------ */

  // ---------------------- Handler para grafico sucursales ----------------------
  const handleDateApplyCYTSucursales = (newStartDate, newEndDate) => {
    setLocalStartDateCYTSucursales(newStartDate);
    setLocalEndDateCYTSucursales(newEndDate);
    dispatch(
      setFechaRangeTerapiasConsultasCYTSucursal({ startDate: newStartDate, endDate: newEndDate })
    );
  };

  const handleDateResetCYTSucursales = () => {
    const newEndDate = new Date();
    const newStartDate = new Date(newEndDate.getFullYear(), newEndDate.getMonth() - 12, 1);
    const lastDayOfCurrentMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth() + 1, 0);
    const startDateFormatted = newStartDate.toISOString().split("T")[0];
    const endDateFormatted = lastDayOfCurrentMonth.toISOString().split("T")[0];
    // setLocalStartDateCYTSucursales(startDateFormatted);
    // setLocalEndDateCYTSucursales(endDateFormatted);
    setLocalStartDateCYTSucursales(undefined);
    setLocalEndDateCYTSucursales(undefined);
    dispatch(
      setFechaRangeTerapiasConsultasCYTSucursal({
        startDate: startDateFormatted,
        endDate: endDateFormatted,
      })
    );
  };

  // usamos optionsSelected aca porque neecesitamos los nombres de las sucursales, no sus ids
  const handleChangeCYTSucursales = (value, optionsSelected) => {
    setCYTSucursalFilter(value);
    const formated = optionsSelected.map((opt) => opt.children);
    setCYTSucursalFilterToString(formated);
  };
  const onMetricsChangeCYTSucursales = (selectedValues = []) => {
    setActiveLinesCYTSucursales((prev) => setMetricsActiveByValues(prev, selectedValues));
  };

  // ---------------------- Handler para grafico doctores ----------------------
  const handleDateApplyCYTDoctores = (newStartDate, newEndDate) => {
    setLocalStartDateCYTDoctores(newStartDate);
    setLocalEndDateCYTDoctores(newEndDate);
    dispatch(setFechaRangeTerapiasPorDoctores({ startDate: newStartDate, endDate: newEndDate }));
  };
  const handleDateResetCYTDoctores = () => {
    const newEndDate = new Date();
    const newStartDate = new Date(newEndDate.getFullYear(), newEndDate.getMonth() - 12, 1);
    const lastDayOfCurrentMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth() + 1, 0);
    const startDateFormatted = newStartDate.toISOString().split("T")[0];
    const endDateFormatted = lastDayOfCurrentMonth.toISOString().split("T")[0];
    // setLocalStartDateCYTDoctores(startDateFormatted);
    // setLocalEndDateCYTDoctores(endDateFormatted);
    setLocalStartDateCYTDoctores(undefined);
    setLocalEndDateCYTDoctores(undefined);
    dispatch(
      setFechaRangeTerapiasConsultasCYTDoctores({
        startDate: startDateFormatted,
        endDate: endDateFormatted,
      })
    );
  };

  // cambio de filtro->local
  const handleChangeCYTDoctores = (value, label) => {
    setCYTDoctorFilter(value);
  };

  const onMetricsChangeCYTDoctores = (selectedValues = []) => {
    setActiveLinesCYTDoctores((prev) => setMetricsActiveByValues(prev, selectedValues));
  };

  // handler tercer grafico terapias doctor
  const handleDateApplyTerapiasPorDoctores = (newStartDate, newEndDate) => {
    setLocalStartDateTerapiasPorDoctores(newStartDate);
    setLocalEndDateTerapiasPorDoctores(newEndDate);
    dispatch(setFechaRangeTerapiasPorDoctores({ startDate: newStartDate, endDate: newEndDate }));
  };
  const handleDateResetTerapiasPorDoctores = () => {
    const newEndDate = new Date();
    const newStartDate = new Date(newEndDate.getFullYear(), newEndDate.getMonth() - 12, 1);
    const lastDayOfCurrentMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth() + 1, 0);
    const startDateFormatted = newStartDate.toISOString().split("T")[0];
    const endDateFormatted = lastDayOfCurrentMonth.toISOString().split("T")[0];

    // setLocalStartDateTerapiasPorDoctores(startDateFormatted);
    // setLocalEndDateTerapiasPorDoctores(endDateFormatted);
    setLocalStartDateTerapiasPorDoctores(undefined);
    setLocalEndDateTerapiasPorDoctores(undefined);
    dispatch(
      setFechaRangeTerapiasPorDoctores({
        startDate: startDateFormatted,
        endDate: endDateFormatted,
      })
    );
  };

  const handleOnMetricChangeTerapiasPorDoctores = (selectedValues = []) => {
    setActiveLinesTerapiasPorDoctores((prev) => setMetricsActiveByValues(prev, selectedValues));
  };

  const handleChangeTerapias = (value) => {
    setTerapiasFilter(value);
  };

  // creacion de pdf
  const handlePreviewPdf = async () => {
    try {
      // si ya generaste imágenes, no vuelvas a generarlas
      if (!chartsData || chartsData.length === 0) {
        setIsGeneratingPdf(true);
        const chartEl = chartTerapiasDoctoresExportRef.current;
        const prevWidth = chartEl.style.width;

        chartEl.style.width = "530px";
        await new Promise((resolve) => setTimeout(resolve, 300)); // espera 0.3seg

        const chartsPrepared = await preparePdfChartsData(pdfChartsRawData, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          delay: 120,
        });

        // Restaurar tamaño original
        chartEl.style.width = prevWidth;

        setChartsData(chartsPrepared);
        setIsGeneratingPdf(false);
        // abre modal una vez que tengamos las imágenes
        setShowModalPdf(true);
      } else {
        // ya hay imágenes -> solo abrir modal
        setShowModalPdf(true);
      }
    } catch (err) {
      console.error("Error generando imágenes para preview:", err);
      setIsGeneratingPdf(false);
    }
  };
  /* ------------------------------------------------------------------------------
                                function Utils
  ------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------
                              Custom JSX functions
  ------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------
                                Return Main View
  ------------------------------------------------------------------------------ */
  return (
    <div style={{ width: "100%", marginBottom: "30px" }}>
      <Row justify="center">
        <Col xs={24} sm={24} md={22} lg={22} xl={20} xxl={18}>
          <Row style={{ marginBottom: 9 }} gutter={[12, 12]}>
            <Col
              xs={24}
              sm={16}
              style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
            >
              <h1
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: 16,
                  margin: "0 0 0 0",
                  display: "block",
                }}
              >
                Reporteria de Consultas & Terapias
              </h1>
            </Col>
            <Col xs={24} sm={8} style={{ display: "flex", justifyContent: "flex-end" }}>
              <PdfActionButtons
                onPreview={handlePreviewPdf}
                isGenerating={isGeneratingPdf}
                ready={!!(chartsData && chartsData.length > 0)}
                downloadDocument={<ChartsConsultasYTerapias chartsData={chartsData} />}
                titleFilename="KPIs_terapias_consultas"
                size="middle"
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            {/* 1ra CARD Grafico Suscursales */}
            <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
              <CustomizedAnalyticsBarChart
                badgeLabel="Sucursales"
                data={kpisTerapiasConsultasSucursales}
                needCardWrapper={true}
                exportRef={chartSucursalesExportRef}
                dateIsMonthPicker={true}
                onDateApply={handleDateApplyCYTSucursales}
                onDateReset={handleDateResetCYTSucursales}
                filterTitle="Filtrar por sucursal:"
                filterOptions={sucursales.map((s) => ({ value: s.id_sucursal, label: s.nombre }))}
                filterValue={cytsucursalFilter}
                onFilterChange={handleChangeCYTSucursales}
                metrics={activeLinesCYTSucursales}
                renderMetricSelector={true}
                onMetricsChange={onMetricsChangeCYTSucursales}
              />
            </Col>

            {/* 2da CARD Grafico doctores */}
            <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
              <CustomizedAnalyticsBarChart
                badgeLabel="Doctores"
                data={kpisTerapiasConsultasDoctor}
                needCardWrapper={true}
                exportRef={chartDoctoresExportRef}
                dateIsMonthPicker={true}
                onDateApply={handleDateApplyCYTDoctores}
                onDateReset={handleDateResetCYTDoctores}
                filterTitle="Filtrar por Doctor:"
                filterOptions={doctores_activados.map((d) => ({
                  value: d.nombre,
                  label: d.nombre,
                }))} // el nombre funciona como value y label
                filterValue={cytdoctorFilter}
                onFilterChange={handleChangeCYTDoctores}
                metrics={activeLinesCYTDoctores}
                renderMetricSelector={true}
                onMetricsChange={onMetricsChangeCYTDoctores}
              />
            </Col>
          </Row>

          <Divider />

          <Row style={{ marginBottom: "15px" }}>
            <Col sm={8} xs={8}>
              <div style={{ color: "black", fontWeight: "bold", fontSize: 16 }}>
                Reporteria de Terapias de doctores
              </div>
            </Col>

            <Col sm={8} xs={8}>
              <div
                style={{
                  ...(hovered ? { ...baseStyle, ...hoveredStyle } : baseStyle),
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontWeight: "600",
                    fontSize: "28px",
                  }}
                >
                  <div style={{ fontSize: "32px", color: "#6366F1" }}>🩺</div>
                  {kpisTerapiasConsultasSucursales
                    .reduce((total, item) => total + (item.consultas + item.terapia), 0)
                    .toLocaleString("es-PE")}
                </div>

                <span style={subtitleStyle}>Terapias</span>
              </div>
            </Col>
            <Col
              sm={8}
              xs={8}
              style={{
                justifyItems: "right",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "16px",
                  marginTop: "24px",
                }}
              >
                {buttons.map((btn) => {
                  const active = porSucursal === btn.value;
                  const isHovered = hovered === btn.label;

                  const style = {
                    ...baseButtonStyle,
                    ...(active ? activeButtonStyle : {}),
                    ...(isHovered && !active ? hoveredButtonStyle : {}),
                  };

                  return (
                    <button
                      key={btn.label}
                      onClick={() => setPorSucursal(btn.value)}
                      onMouseEnter={() => setHovered(btn.label)}
                      onMouseLeave={() => setHovered(null)}
                      style={style}
                    >
                      {btn.label}
                    </button>
                  );
                })}
              </div>
            </Col>
          </Row>
          {/* Grafico doctores - separado */}
          <Row gutter={[16, 16]}>
            <Col xs={porSucursal ? 24 : 14} sm={porSucursal ? 24 : 14}>
              {/* <KpisConsultasTerapiasDoctores
                doctores_activados={doctores_activados}
                exportRef={chartTerapiasDoctoresExportRef}
              /> */}
              {porSucursal ? (
                <CustomizedAnalyticsBarChart
                  // badgeLabel="tag"
                  data={kpisTerapiasPorDoctores}
                  needCardWrapper={true}
                  exportRef={chartTerapiasDoctoresExportRef}
                  dateIsMonthPicker={true}
                  onDateApply={handleDateApplyTerapiasPorDoctores}
                  onDateReset={handleDateResetTerapiasPorDoctores}
                  filterTitle="Filtrar por Terapias:"
                  filterOptions={opcionesTerapias}
                  filterValue={terapiasFilter}
                  onFilterChange={handleChangeTerapias}
                  metrics={activeLinesTerapiasPorDoctores}
                  renderMetricSelector={true}
                  onMetricsChange={handleOnMetricChangeTerapiasPorDoctores}
                  barCategoryGap={"10%"}
                  barsCategorySize={60}
                />
              ) : (
                <KpisConsultasTerapiasPorSucursal
                  kpisTerapiasConsultasSucursales={kpisTerapiasConsultasSucursales}
                  onDateApply={handleDateApplyCYTSucursales}
                  onDateReset={handleDateResetCYTSucursales}
                  dateIsMonthPicker={true}
                  filterTitle="Filtrar por sucursal:"
                  onFilterChange={handleChangeCYTSucursales}
                  filterValue={cytsucursalFilter}
                  filterOptions={sucursales.map((s) => ({ value: s.id_sucursal, label: s.nombre }))}
                />
              )}
            </Col>
            {!porSucursal && (
              <Col xs={10} sm={10}>
                <div>
                  <CardPieChart
                    data={kpisTerapiasPorDoctores}
                    datas={[
                      {
                        name: "CENTEVI Centro Médico San Judas Tadeo",
                        consultas: 1698,
                        terapia: 126,
                      },
                      {
                        name: "CENTEVI Consultorios Medicos Paitilla",
                        consultas: 1354,
                        terapia: 95,
                      },
                      { name: "CENTEVI El Dorado", consultas: 1030, terapia: 69 },
                      { name: "CENTEVI Giras Interior del Pais", consultas: 51, terapia: 0 },
                      { name: "CENTEVI Consultorio Town Center", consultas: 4, terapia: 0 },
                      { name: "Examen Visual Empresas", consultas: 0, terapia: 0 },
                      { name: "CENTEVI Via Espana", consultas: 29, terapia: 0 },
                    ]}
                    title="Por terapia"
                    subtitle="Cantidad de terapias"
                  />
                </div>
              </Col>
            )}
          </Row>
        </Col>
      </Row>

      {/* Extra fuera del contenido principal: modals - etc */}
      <PdfPreviewModal
        open={showModalPdf}
        onClose={() => setShowModalPdf(false)}
        document={<ChartsConsultasYTerapias chartsData={chartsData} />}
        loading={isGeneratingPdf || !chartsData} // muestra loader si estamos generando las imágenes
        title="Vista previa - Reporte KPIs Terapias y consultas"
        titleFilename="KPIs_terapias_consultas"
        width="85%"
        height="80vh"
      />
    </div>
  );
};

export default VerKpisConsultasYTerapias;
