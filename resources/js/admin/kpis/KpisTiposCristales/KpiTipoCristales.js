import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchKpisTiposCristales, fetchKpisTiposCristalesNoLimits, 
  setFechaRangeTiposCristales, setFechaRangeTiposCristalesNoLimits,
  fetchKpisTiposCristalesNoLimitsVertical, fetchKpisTiposCristalesOptions, 
  setFechaRangeTiposCristalesNoLimitsVertical 
} from "../../../redux/features/kpis/kpisTiposCristales/kpisTiposCristalesSlice";
import { Col, Row } from "antd";
// import KpisTiposCristalesVertical from "./KpisTipoCristalesVertical";
import CustomizedAnalyticsBarChart from "../../../components/pages/admin/kpis/CustomizedAnalyticsBarChart";
import ChartsTipoCristalesPdfReport from "../../../services/pdf/kpis/kpisTipoCristales/ChartsTipoCristalesPdfReport";
import PdfActionButtons from "../../../components/buttons/admin/kpis/PdfActionButtons";
import PdfPreviewModal from "../../../components/modals/pdfs/PdfPreviewModal";
import { preparePdfChartsData } from "../../../utils/admin/kpis/PreparePdfChartsData";

const KpisTiposCristales = () => {
  /* ------------------------------------------------------------------------------
                                Redux: Dispatch - Store y data
  ------------------------------------------------------------------------------ */
  const dispatch = useDispatch();
  const {
    // tipos cristales limitt  10
    kpisTiposCristales,
    kpisTipos_cristales_select_option,

    // tipos cristales limit 70
    kpisTiposCristalesNoLimitsVertical,
    kpisTipos_cristales_select_option_no_limits_vertical,
    kpisTipos_Cristales_options,

    // tipos cristales no limit (> 984 aprox)
    kpisTiposCristalesNoLimits,
    kpisTipos_cristales_select_option_no_limits,
  } = useSelector((state) => state.kpisTiposCristales);

  /* ------------------------------------------------------------------------------
                            UseStates y data constante para logica
  ------------------------------------------------------------------------------ */
  // state: tipos cristales limit 10
  const [localStartDateTiposCristales, setLocalStartDateTiposCristales] = useState();
  const [localEndDateTiposCristales, setLocalEndDateTiposCristales] = useState();
  const [tiposCristalesFilter, setTiposCristalesFilter] = useState([]);

  // state: tipos cristales limit 70
  const [localStartDateTiposCristalesVertical, setLocalStartDateTiposCristalesVertical] = useState();
  const [localEndDateTiposCristalesVertical, setLocalEndDateTiposCristalesVertical] = useState();
  const [tiposCristalesFilterVertical, setTiposCristalesFilterVertical] = useState([]);

  // state: tipos cristales no limit (> 984 aprox)
  const [localStartDateTiposCristalesNoLimits, setLocalStartDateTiposCristalesNoLimits] = useState();
  const [localEndDateTiposCristaleNoLimits, setLocalEndDateTiposCristalesNoLimits] = useState();
  const [tiposCristalesFilterNoLimits, setTiposCristalesFilterNoLimits] = useState([]);

  // para generacion y muestra de pdfs
  // const [cytsucursalFilterToString, setCYTSucursalFilterToString] = useState([]); // formateado para graficos con nombres(number[])
  const [showModalPdf, setShowModalPdf] = useState(false)
  const [chartsData, setChartsData] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  //refs para graficos
  const chartLimited10Ref = useRef(null);
  const chartLimited70Ref = useRef(null);
  const chartNoLimitedRef = useRef(null);

  // data para graficos pdf:
  const pdfChartsRawData = [
    { ref: chartLimited10Ref, title: "Gráfico limitado a 10 registros", filters: {
        categories: tiposCristalesFilter, 
        rangeDate: {start: localStartDateTiposCristales, end: localEndDateTiposCristales}
      }, options: {orientation: 'horizontal'}},
    { ref: chartLimited70Ref, title: "Gráfico limitado a 70 registros", filters: {
        categories: tiposCristalesFilterVertical, 
        rangeDate: {start: localStartDateTiposCristalesVertical, end: localEndDateTiposCristalesVertical}
      }, options: {orientation: 'vertical'}},
    { ref: chartNoLimitedRef, title: "Gráfico sin limites", filters: {
        categories: tiposCristalesFilterNoLimits, 
        rangeDate: {start: localStartDateTiposCristalesNoLimits, end: localEndDateTiposCristaleNoLimits}
      }, options: {orientation: 'vertical'}},
  ];

  /* ------------------------------------------------------------------------------
                                UseEffects
  ------------------------------------------------------------------------------ */
  // tipos cristales limit 10
  useEffect(() => {
    dispatch(fetchKpisTiposCristales({
      startDate: localStartDateTiposCristales,
      endDate: localEndDateTiposCristales,
      name: tiposCristalesFilter
    }));
  }, [dispatch,
    tiposCristalesFilter,
    localStartDateTiposCristales,
    localEndDateTiposCristales])

  // tipos cristales limit 70
  useEffect(() => {
    dispatch(fetchKpisTiposCristalesNoLimits({
      startDate: localStartDateTiposCristalesNoLimits,
      endDate: localEndDateTiposCristaleNoLimits,
      name: tiposCristalesFilterNoLimits
    }));
  }, [dispatch,
    tiposCristalesFilterNoLimits,
    localStartDateTiposCristalesNoLimits,
    localEndDateTiposCristaleNoLimits])

  // tipos cristales no limit (> 984 aprox)
  useEffect(() => {
    dispatch(fetchKpisTiposCristalesNoLimitsVertical({
      startDate: localStartDateTiposCristalesVertical,
      endDate: localEndDateTiposCristalesVertical,
      name: tiposCristalesFilterVertical,
      limit: 70
    }))
  }, [
    dispatch,
    localStartDateTiposCristalesVertical,
    localEndDateTiposCristalesVertical,
    tiposCristalesFilterVertical
  ])
  //otra forma de cargar las opciones del filtro sin alterarlo despues
  useEffect(() => {
    dispatch(fetchKpisTiposCristalesOptions({}))
  }, [])

  // Para invalidar imágenes de graficos pdf cuando cambien filtros/fechas/series
  useEffect(() => {
    // Si ya hay imágenes generadas y se cambia algún filtro/fecha/series, limpiarlas
    if (chartsData && chartsData.length > 0) {
      setChartsData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // tipos cristales limit 10
    localStartDateTiposCristales,
    localEndDateTiposCristales,
    tiposCristalesFilter,

    // tipos cristales limit 70
    localStartDateTiposCristalesVertical,
    localEndDateTiposCristalesVertical,
    tiposCristalesFilterVertical,

    // tipos cristales no limit
    localStartDateTiposCristalesNoLimits,
    localEndDateTiposCristaleNoLimits,
    tiposCristalesFilterNoLimits,
  ]);

  /* ------------------------------------------------------------------------------
                                  Handlers
  ------------------------------------------------------------------------------ */
  // ----------------------- date apply - reset ----------------------
  // tipos cristales limit 10
  const handleDateApplyTiposCristales = (newStartDate, newEndDate) => {
    setLocalStartDateTiposCristales(newStartDate);
    setLocalEndDateTiposCristales(newEndDate);
    dispatch(setFechaRangeTiposCristales({ startDate: newStartDate, endDate: newEndDate }));
  };
  const handleDateResetTiposCristales = () => {
    setLocalStartDateTiposCristales(null);
    setLocalEndDateTiposCristales(null);
    dispatch(setFechaRangeTiposCristales({ startDate: null, endDate: null }));
  };

  // tipos cristales limit 70
  const handleDateApplyTiposCristalesVertical = (newStartDate, newEndDate) => {
    setLocalStartDateTiposCristalesVertical(newStartDate);
    setLocalEndDateTiposCristalesVertical(newEndDate);
    dispatch(setFechaRangeTiposCristalesNoLimitsVertical({ startDate: newStartDate, endDate: newEndDate }));
  };
  const handleDateResetTiposCristalesVertical = () => {
    setLocalStartDateTiposCristalesVertical(null);
    setLocalEndDateTiposCristalesVertical(null);
    dispatch(setFechaRangeTiposCristalesNoLimitsVertical({ startDate: null, endDate: null }));
  };
  
  // tipos cristales no limit (> 984 aprox)
  const handleDateApplyTiposCristalesNoLimits = (newStartDate, newEndDate) => {
    setLocalStartDateTiposCristalesNoLimits(newStartDate);
    setLocalEndDateTiposCristalesNoLimits(newEndDate);
    dispatch(setFechaRangeTiposCristales({ startDate: newStartDate, endDate: newEndDate }));
  };
  const handleDateResetTiposCristalesNoLimits = () => {
    setLocalStartDateTiposCristalesNoLimits(null);
    setLocalEndDateTiposCristalesNoLimits(null);
    dispatch(setFechaRangeTiposCristalesNoLimits({ startDate: null, endDate: null }));
  };

  

  // ----------------------- filters onChange ----------------------
  // tipos cristales limit 10
  const handleChangeTiposCristales = (value) => {
    setTiposCristalesFilter(value);
  };

  // tipos cristales limit 70
  const handleChangeTiposCristalesVertical = (value) => {
    setTiposCristalesFilterVertical(value);
  };
  
  // tipos cristales no limit (> 984 aprox)
  const handleChangeTiposCristalesNoLimits = (value) => {
    setTiposCristalesFilterNoLimits(value);
  };

  // ----------------------- creacion de pdf -----------------------
  const handlePreviewPdf = async () => {
    try {
      // si ya generaste imágenes, no vuelvas a generarlas
      if (!chartsData || chartsData.length === 0) {
        setIsGeneratingPdf(true);

        const chartsPrepared = await preparePdfChartsData(pdfChartsRawData, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          delay: 120,
        });

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
    // Contenedor principal
    <Row justify="center">
      <Col xs={24} sm={24} md={22} lg={22} xl={20} xxl={18}>

        {/* Contenedor Titulo y botones para pdf */}
        <Row style={{marginBottom: 9}} gutter={[12, 12]}>
          <Col xs={24} sm={16} style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <h1 style={{ color: "black", fontWeight: "bold", fontSize: 16, margin: '0 0 0 0', display: 'block' }}>
              Reporteria de Tipos de cristal
            </h1>
          </Col>
          <Col xs={24} sm={8} style={{display: 'flex', justifyContent: 'flex-end'}}>
            <PdfActionButtons
              onPreview={handlePreviewPdf}
              isGenerating={isGeneratingPdf}
              ready={!!(chartsData && chartsData.length > 0)}
              downloadDocument={<ChartsTipoCristalesPdfReport chartsData={chartsData} />}
              titleFilename="KPIs_tipos_cristal"
              size="middle"
            />
          </Col>
        </Row>

        {/* Contenedor Graficas */}
        <Row style={{marginBottom: 9}} gutter={[12, 12]}>

          {/* Grafico de barras horizontal (barras verticales) - limite 10 */}
          <Col xs={24} sm={24}>
            <CustomizedAnalyticsBarChart 
              badgeLabel="Tipos Cristales"
              data={kpisTiposCristales}
              needCardWrapper={true}

              exportRef={chartLimited10Ref}

              dateIsMonthPicker={true}
              onDateApply={handleDateApplyTiposCristales}
              onDateReset={handleDateResetTiposCristales}

              filterTitle="Filtrar por tipo de cristal:"
              filterOptions={kpisTipos_cristales_select_option.map(s => ({ value: s.value, label: s.label }))} // label y value tiene el mismo valor
              filterValue={tiposCristalesFilter}
              onFilterChange={handleChangeTiposCristales}

              metrics={[{label: "name", value: "total", color: "#8884d8", active: true}]} // solo una barra por categoria sin cambios
              renderMetricSelector={false}
              // onMetricsChange={void}
              needLegend={true}
            />
          </Col>

          {/* Grafico de barras vertical (barras horizontales) - limite 70 */}
          <Col xs={24} sm={24} md={12}>
            {/* <KpisTiposCristalesVertical
              limit={70}
            /> */}
            <CustomizedAnalyticsBarChart 
              badgeLabel="Tipos Cristales limite 70"
              data={kpisTiposCristalesNoLimitsVertical}
              needCardWrapper={true}
              chartHeight="900px"

              exportRef={chartLimited70Ref}

              dateIsMonthPicker={true}
              onDateApply={handleDateApplyTiposCristalesVertical}
              onDateReset={handleDateResetTiposCristalesVertical}

              filterTitle="Filtrar por tipo de cristal:"
              filterOptions={kpisTipos_Cristales_options.map(s => ({ value: s.value, label: s.label }))} // label y value tiene el mismo valor
              filterValue={tiposCristalesFilterVertical}
              onFilterChange={handleChangeTiposCristalesVertical}

              metrics={[{label: "name", value: "total", color: "#8884d8", active: true}]} // solo una barra por categoria sin cambios
              renderMetricSelector={false}
              // onMetricsChange={void}
              needLegend={true}
              barsOrientation="horizontal"
            />
          </Col>

          {/* Grafico de barras vertical (barras horizontales) - sin limites (> 984 aprox) */}
          <Col xs={24} sm={24} md={12}>
            <CustomizedAnalyticsBarChart 
              badgeLabel="Tipos Cristales Sin limites"
              data={kpisTiposCristalesNoLimits}
              needCardWrapper={true}
              chartHeight="900px"

              exportRef={chartNoLimitedRef}

              dateIsMonthPicker={true}
              onDateApply={handleDateApplyTiposCristalesNoLimits}
              onDateReset={handleDateResetTiposCristalesNoLimits}

              filterTitle="Filtrar por tipo de cristal:"
              filterOptions={kpisTipos_cristales_select_option_no_limits.map(s => ({ value: s.value, label: s.label }))} // label y value tiene el mismo valor
              filterValue={tiposCristalesFilterNoLimits}
              onFilterChange={handleChangeTiposCristalesNoLimits}

              metrics={[{label: "name", value: "total", color: "#8884d8", active: true}]} // solo una barra por categoria sin cambios
              renderMetricSelector={false}
              // onMetricsChange={void}
              needLegend={true}
              barsOrientation="horizontal"
            />
          </Col>
          
        </Row>
        <PdfPreviewModal 
          open={showModalPdf}
          onClose={() => setShowModalPdf(false)}
          document={<ChartsTipoCristalesPdfReport chartsData={chartsData} />}
          loading={isGeneratingPdf || !chartsData} // muestra loader si estamos generando las imágenes
          title="Vista previa - Reporte KPIs Tipos de cristal"
          titleFilename="KPIs_tipos_cristal"
          width="85%"
          height="80vh"
        />
      </Col>
    </Row>
  );
}

export default KpisTiposCristales