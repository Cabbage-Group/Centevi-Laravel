import React, { useEffect, useState, useRef } from "react";
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

import HorizontalBarChart from "../../../components/pages/admin/kpis/HorizontalBarChart";
import PdfActionButtons from "../../../components/butttons/PdfActionButtons";
import PdfPreviewModal from "../../../components/modals/pdfs/PdfPreviewModal";
import ChartsConsultasYTerapias from "../../../services/pdf/kpis/kpisConsultasYTerapias/ChartsConsultasYTerapias";
import { generateChartsImages } from "../../../utils/generateChartImages";

const VerKpisConsultasYTerapias = () => {
  /* ------------------------------------------------------------------------------
                                Redux: Dispatch
  ------------------------------------------------------------------------------ */
  const dispatch = useDispatch();
  /* ------------------------------------------------------------------------------
                              Redux: Store y data
  ------------------------------------------------------------------------------ */
  const { sucursales } = useSelector((state) => state.sucursales);
  const { doctores_activados } = useSelector((state) => state.usuarios);
  const {
    kpisTerapiasConsultasSucursales,
    kpisTerapiasConsultasDoctor,
  } = useSelector((state) => state.kpisConsultasTerapias);

  /* ------------------------------------------------------------------------------
                            UseStates y data constante para logica
  ------------------------------------------------------------------------------ */
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

  // para generacion y muestra de pdfs
  const [showModalPdf, setShowModalPdf] = useState(false)
  const [chartsImages, setChartsImages] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const chartDoctoresExportRef = useRef(null);
  const chartSucursalesExportRef = useRef(null);
  const chartTerapiasDoctoresExportRef = useRef(null);

  // funciona para ambos graficos de doctores y sucursales
  const metricsOptions = [
    { label: "Consultas", value: "consultas", color: "#6C5CE7" },
    { label: "Terapias", value: "terapia", color: "#00B894" },
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



  /* ------------------------------------------------------------------------------
                                function Utils
  ------------------------------------------------------------------------------ */

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
    setLocalStartDateCYTSucursales(startDateFormatted);
    setLocalEndDateCYTSucursales(endDateFormatted);
    dispatch(
      setFechaRangeTerapiasConsultasCYTSucursal({
        startDate: startDateFormatted,
        endDate: endDateFormatted,
      })
    );
  };
  const handleChangeCYTSucursales = (value) => {
    setCYTSucursalFilter(value);
  };

  // Nuevo: cambio del "legend" por Select
  const onMetricsChangeCYTSucursales = (values) => {
    // si values vacío, conservar ninguno seleccionado -> el chart quedará vacío
    setActiveLinesCYTSucursales(values);
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
    setLocalStartDateCYTDoctores(startDateFormatted);
    setLocalEndDateCYTDoctores(endDateFormatted);
    dispatch(
      setFechaRangeTerapiasConsultasCYTDoctores({
        startDate: startDateFormatted,
        endDate: endDateFormatted,
      })
    );
  };

  const handleChangeCYTDoctores = (value) => {
    setCYTDoctorFilter(value);
  };

  const onLegendChangeCYTDoctores = (values) => {
    setActiveLinesCYTDoctores(values);
  };

  const handlePreviewPdf = async () => {
    try {
      // si ya generaste imágenes, no vuelvas a generarlas
      if (!chartsImages || chartsImages.length === 0) {
        setIsGeneratingPdf(true);
        const itemsToCapture = [
          { ref: chartDoctoresExportRef, title: "Terapias y consultas - Doctores" },
          { ref: chartSucursalesExportRef, title: "Terapias y consultas - Sucursales" },
          { ref: chartTerapiasDoctoresExportRef, title: "Reporteria de Terapias de doctores" },
        ];

        const charts = await generateChartsImages(itemsToCapture, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          delay: 120,
        });

        setChartsImages(charts);
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
                              Custom JSX functions
  ------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------
                                Return Main View
  ------------------------------------------------------------------------------ */
  return (
    <div style={{ width: "100%", marginBottom: '30px' }}>
      <Row justify="center">
        <Col xs={24} sm={24} md={22} lg={22} xl={20} xxl={18}>
          <Row style={{marginBottom: 9}} gutter={[12, 12]}>
            <Col xs={24} sm={16} style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <h1 style={{ color: "black", fontWeight: "bold", fontSize: 16, margin: '0 0 0 0', display: 'block' }}>
                Reporteria de Consultas & Terapias
              </h1>
            </Col>
            <Col xs={24} sm={8} style={{display: 'flex', justifyContent: 'flex-end'}}>
              <PdfActionButtons
                onPreview={handlePreviewPdf}
                isGenerating={isGeneratingPdf}
                ready={!!(chartsImages && chartsImages.length > 0)}
                downloadDocument={<ChartsConsultasYTerapias charts={chartsImages} />}
                titleFilename="KPI_terapias_consultas.pdf"
                size="middle"
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            
            {/* 1ra CARD Grafico Suscursales */}
            <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
              <HorizontalBarChart
                title="Sucursales"
                data={kpisTerapiasConsultasSucursales}
                needCardWrapper={true}

                exportRef={chartSucursalesExportRef}

                isMonthPicker={true}
                onDateApply={handleDateApplyCYTSucursales}
                onDateReset={handleDateResetCYTSucursales}
                
                filterTitle="Filtrar por sucursal:"
                filterList={sucursales}
                filterValueKey="id_sucursal"
                filterLabelKey="nombre"
                filterValue={cytsucursalFilter}
                onFilterChange={handleChangeCYTSucursales}

                metricsOptions={metricsOptions}
                activeMetrics={activeLinesCYTSucursales}

                renderMetricSelector={true}
                onMetricsChange={onMetricsChangeCYTSucursales}
                
                barCategoryGap="50%"
                barGap={0}
                xDataKey="name"
              />

            </Col>

            {/* 2da CARD Grafico doctores */}
            <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
              <HorizontalBarChart
                title="Doctores"
                data={kpisTerapiasConsultasDoctor}
                needCardWrapper={true}

                exportRef={chartDoctoresExportRef}
              
                isMonthPicker={true}
                onDateApply={handleDateApplyCYTDoctores}
                onDateReset={handleDateResetCYTDoctores}
              
                filterTitle="Filtrar por Doctor:"
                filterList={doctores_activados}
                filterValueKey="nombre"
                filterLabelKey="nombre"
                filterValue={cytdoctorFilter}
                onFilterChange={handleChangeCYTDoctores}
              
                metricsOptions={metricsOptions}
                activeMetrics={activeLinesCYTDoctores}

                renderMetricSelector={true}
                onMetricsChange={onLegendChangeCYTDoctores}
              
                barCategoryGap="50%"
                barGap={0}
                xDataKey="name"
              />
            </Col>
          </Row>

          <Divider />

          {/* Grafico doctores */}
          <Row gutter={[16, 16]}>
            {/* <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}> */}
            <Col xs={24} sm={24}>
              <KpisConsultasTerapiasDoctores 
                doctores_activados={doctores_activados} 
                exportRef={chartTerapiasDoctoresExportRef}
              />
            </Col>
          </Row>


        </Col>
      </Row>

      {/* Extra fuera del contenido principal: modals - etc */}
      <PdfPreviewModal
        open={showModalPdf}
        onClose={() => setShowModalPdf(false)}
        document={<ChartsConsultasYTerapias charts={chartsImages} />}
        loading={isGeneratingPdf || !chartsImages} // muestra loader si estamos generando las imágenes
        title="Vista previa - KPIs Terapias y consultas"
        titleFilename="KPIs_terapias_consultas"
        width="85%"
        height="80vh"
      />

    </div>
  );
};

export default VerKpisConsultasYTerapias;
