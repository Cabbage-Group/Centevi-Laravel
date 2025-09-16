import React, { useEffect, useState, useRef  } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchKpisTiposLente, fetchKpisTiposLenteAsesores, fetchKpisTiposLenteDoctores, setFechaRangeTipoLente, setFechaRangeTipoLenteAsesores, setFechaRangeTipoLenteDoctores } from "../../../redux/features/kpis/kpisTiposLente/kpisTiposLente";
import { Col, Divider, Row, Grid } from "antd";
import { fetchSucursales } from "../../../redux/features/sucursales/sucursalesSlice";
import { fetchUsuarios } from "../../../redux/features/usuarios/usuariosSlice";
import KpiTiempoPromedio from "../KpisOrdenes/KpiTiempoPromedio";
import HorizontalBarChart from "../../../components/pages/admin/kpis/HorizontalBarChart";
import { ResponsiveContainer } from "recharts";
import ChartsTiposLentesPdfReport from "../../../services/pdf/kpis/kpisTiposLentes/ChartsTiposLentesPdfReport";
import { preparePdfChartsData } from "../../../utils/admin/kpis/PreparePdfChartsData";

import PdfPreviewModal from "../../../components/modals/pdfs/PdfPreviewModal";

import PdfActionButtons from "../../../components/buttons/admin/kpis/PdfActionButtons";
import { setMetricsActiveByValues } from "../../../utils/admin/kpis/setMetricsActiveByValues";

const VerKpisTipoLente = () => {
  /* ------------------------------------------------------------------------------
                                Redux: Dispatch - Store y data
  ------------------------------------------------------------------------------ */
  const dispatch = useDispatch();

  const { sucursales } = useSelector((state) => state.sucursales);
  const { kpisTipoLente, kpisTipoLenteAsesores, kpisTipoLenteDoctores } = useSelector((state) => state.kpisTipoLente);
  const { asesores_activados, doctores_activados } = useSelector((state) => state.usuarios);


  /* ------------------------------------------------------------------------------
                            UseStates y data constante para logica
  ------------------------------------------------------------------------------ */
  const [localStartDateAsesores, setLocalStartDateAsesores] = useState();
  const [localEndDateAsesores, setLocalEndDateAsesores] = useState();
  const [localStartDate, setLocalStartDate] = useState();
  const [localEndDate, setLocalEndDate] = useState();
  const [localStartDateDoctores, setLocalStartDateDoctores] = useState();
  const [localEndDateDoctores, setLocalEndDateDoctores] = useState();

  const [activeLinesLenteAsesores, setActiveLinesLenteAsesores] = useState([
    { label: "Lente contacto", value: "lente_contacto", color: "#6C5CE7", active: true },
    { label: "Lente Normal", value: "lente_normal", color: "#00B894", active: true },
  ]);
  const [activeLinesLente, setActiveLinesLente] = useState([
    { label: "Lente contacto", value: "lente_contacto", color: "#6C5CE7", active: true },
    { label: "Lente Normal", value: "lente_normal", color: "#00B894", active: true },
  ]);
  const [activeLinesLenteDoctores, setActiveLinesLenteDoctores] = useState([
    { label: "Lente contacto", value: "lente_contacto", color: "#6C5CE7", active: true },
    { label: "Lente Normal", value: "lente_normal", color: "#00B894", active: true },
  ]);

  const [asesorFilter, setAsesorFilter] = useState([]);
  const [sucursalFilter, setSucursalFilter] = useState([]);
  const [doctorFilter, setDoctorFilter] = useState([]);

  // para generacion y muestra de pdfs
  const [showModalPdf, setShowModalPdf] = useState(false)
  const [chartsData, setChartsData] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const [asesorFilterToString, setAsesorFilterToString] = useState([]);
  const [sucursalFilterToString, setSucursalFilterToString] = useState([]);

  const [timeAverageFilters, setTimeAverageFilters] = useState(null);

  const chartAsesoresExportRef = useRef(null);
  const chartSucursalesExportRef = useRef(null);
  const chartDoctoresExportRef = useRef(null);
  const timeAverageExportRef = useRef(null);
  const pdfChartsRawData = [
    { ref: chartAsesoresExportRef, title: "Gráfico distribuido por asesores", filters: {
      metrics: activeLinesLenteAsesores, categories: asesorFilterToString, 
      rangeDate: {start: localStartDateAsesores, end: localEndDateAsesores}
    }},
    { ref: chartSucursalesExportRef, title: "Gráfico distribuido por sucursales", filters: {
      metrics: activeLinesLente, categories: sucursalFilterToString,
      rangeDate: {start: localStartDate, end: localEndDate}
    } },
    { ref: chartDoctoresExportRef, title: "Gráfico distribuido por doctores", filters:{
      metrics: activeLinesLenteDoctores, categories: doctorFilter,
      rangeDate: {start: localStartDateDoctores, end: localEndDateDoctores}
    }},
  ];
  const [timeAverageData, setTimeAverageData] = useState(null)
  // extra responsive antd
  const { useBreakpoint } = Grid;
  const breakpoints = useBreakpoint();


  /* ------------------------------------------------------------------------------
                                UseEffects
  ------------------------------------------------------------------------------ */
  useEffect(() => {
    dispatch(fetchKpisTiposLente({
      startDate: localStartDate,
      endDate: localEndDate,
      sucursalIds: sucursalFilter
    }));
  }, [dispatch, localStartDate, localEndDate, sucursalFilter]);

  useEffect(() => {
    dispatch(fetchKpisTiposLenteAsesores({
      startDate: localStartDateAsesores,
      endDate: localEndDateAsesores,
      usuarioIds: asesorFilter
    }))
  }, [dispatch, localStartDateAsesores, localEndDateAsesores, asesorFilter])

  useEffect(() => {
    dispatch(fetchKpisTiposLenteDoctores({
      startDate: localStartDateDoctores,
      endDate: localEndDateDoctores,
      doctorNames: doctorFilter
    }))
  }, [dispatch, localStartDateDoctores, localEndDateDoctores, doctorFilter])

  useEffect(() => {
    dispatch(fetchSucursales({}));
    dispatch(fetchUsuarios({}))
  }, [dispatch]);

  // Nuevo useEffect para invalidar charts PDF al cambiar filtros/fechas/series
  useEffect(() => {
    if (chartsData && chartsData.length > 0) {
      setChartsData(null); // resetea para forzar regeneración
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // Asesores chart
    localStartDateAsesores,
    localEndDateAsesores,
    asesorFilter,
    activeLinesLenteAsesores,
    // Sucursales chart
    localStartDate,
    localEndDate,
    sucursalFilter,
    activeLinesLente,
    // Doctores chart
    localStartDateDoctores,
    localEndDateDoctores,
    doctorFilter,
    activeLinesLenteDoctores,
    timeAverageFilters
  ]);

  /* ------------------------------------------------------------------------------
                                  Handlers
  ------------------------------------------------------------------------------ */

  const handleDateApply = (newStartDate, newEndDate) => {
    setLocalStartDate(newStartDate);
    setLocalEndDate(newEndDate);
    dispatch(setFechaRangeTipoLente({ startDate: newStartDate, endDate: newEndDate }));
  };

  const handleDateReset = () => {
    const newEndDate = new Date();
    const newStartDate = new Date(newEndDate.getFullYear(), newEndDate.getMonth() - 12, 1);
    const lastDayOfCurrentMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth() + 1, 0);
    const startDateFormatted = newStartDate.toISOString().split('T')[0];
    const endDateFormatted = lastDayOfCurrentMonth.toISOString().split('T')[0];

    // setLocalStartDate(startDateFormatted);
    // setLocalEndDate(endDateFormatted);
    setLocalStartDate(undefined);
    setLocalEndDate(undefined);
    dispatch(setFechaRangeTipoLente({
      startDate: startDateFormatted,
      endDate: endDateFormatted
    }));
  };

  const handleChange = (value, optionsSelected) => {
    setSucursalFilter(value);
    const formated = optionsSelected.map(opt => opt.children);
    setSucursalFilterToString(formated);
  };

  const handleChangeAsesores = (value, optionsSelected) => {
    setAsesorFilter(value);
    const formated = optionsSelected.map(opt => opt.children);
    setAsesorFilterToString(formated);
  };

  const handleChangeDoctores = (value) => {
    setDoctorFilter(value);
  };

  const handleDateApplyAsesores = (newStartDate, newEndDate) => {
    setLocalStartDateAsesores(newStartDate);
    setLocalEndDateAsesores(newEndDate);
    dispatch(setFechaRangeTipoLenteAsesores({ startDate: newStartDate, endDate: newEndDate }));
  };

  const handleDateResetAsesores = () => {
    const newEndDate = new Date();
    const newStartDate = new Date(newEndDate.getFullYear(), newEndDate.getMonth() - 12, 1);
    const lastDayOfCurrentMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth() + 1, 0);
    const startDateFormatted = newStartDate.toISOString().split('T')[0];
    const endDateFormatted = lastDayOfCurrentMonth.toISOString().split('T')[0];

    // setLocalStartDateAsesores(startDateFormatted);
    // setLocalEndDateAsesores(endDateFormatted);
    setLocalStartDateAsesores(undefined);
    setLocalEndDateAsesores(undefined);
    dispatch(setFechaRangeTipoLenteAsesores({
      startDate: startDateFormatted,
      endDate: endDateFormatted
    }));
  };

  const handleDateApplyDoctores = (newStartDate, newEndDate) => {
    setLocalStartDateDoctores(newStartDate);
    setLocalEndDateDoctores(newEndDate);
    dispatch(setFechaRangeTipoLenteDoctores({ startDate: newStartDate, endDate: newEndDate }));
  };

  const handleDateResetDoctores = () => {
    const newEndDate = new Date();
    const newStartDate = new Date(newEndDate.getFullYear(), newEndDate.getMonth() - 12, 1);

    const lastDayOfCurrentMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth() + 1, 0);

    const startDateFormatted = newStartDate.toISOString().split('T')[0];
    const endDateFormatted = lastDayOfCurrentMonth.toISOString().split('T')[0];

    // setLocalStartDateDoctores(startDateFormatted);
    // setLocalEndDateDoctores(endDateFormatted);
    setLocalStartDateDoctores(undefined);
    setLocalEndDateDoctores(undefined);
    dispatch(setFechaRangeTipoLenteDoctores({
      startDate: startDateFormatted,
      endDate: endDateFormatted
    }));
  };

  const onMetricSelectorAsesorChange = (values = []) => {
    setActiveLinesLenteAsesores(prev => setMetricsActiveByValues(prev, values));
  }
  const onMetricSelectorSucursalChange = (values = []) => {
    setActiveLinesLente(prev => setMetricsActiveByValues(prev, values));
  }
  const onMetricSelectorDoctorChange = (values = []) => {
    setActiveLinesLenteDoctores(prev => setMetricsActiveByValues(prev, values));
  }

  // handler que pasas al child
  const handleTimeAverageFiltersChange = (filters) => {
    // guarda filtros y forza regeneración de imágenes
    console.log(filters);
    
    setTimeAverageFilters(filters);
    if (chartsData && chartsData.length > 0) setChartsData(null);
  };

  /* ------------------------------------------------------------------------------------------
                                    Funciones utilitarias
   ------------------------------------------------------------------------------------------*/

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
        const timeAveragePrepared = {
          info: timeAverageExportRef.current.innerText ?? 'No definido',
          rangeDate: {
            start: timeAverageFilters?.startDate ?? undefined, end: timeAverageFilters?.endDate ?? undefined
          },
          rangePhase: {
            start: timeAverageFilters?.faseInicial ?? undefined, end: timeAverageFilters?.faseFinal ?? undefined
          },
          type: timeAverageFilters?.lenteContacto ?? [],
        }
        setTimeAverageData(timeAveragePrepared)
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
    // Contenedor principal
    <Row justify="center" style={{marginBottom: '30px'}}>
      <Col xs={24} sm={24} md={22} lg={22} xl={20} xxl={18}>

        {/* Contenido */}
        <ResponsiveContainer width="100%">
          <Row gutter={[16, 16]} >
            <Col xs={24} sm={24}>
              <Row gutter={[12, 12]}>
                <Col xs={24} sm={16} style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <h1 style={{ color: "black", fontWeight: "bold", fontSize: 16, margin: '0 0 0 0', display: 'block' }}>
                    KPIs Tipos de lentes
                  </h1>
                </Col>
                <Col xs={24} sm={8} style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <PdfActionButtons
                    onPreview={handlePreviewPdf}
                    isGenerating={isGeneratingPdf}
                    ready={!!(chartsData && chartsData.length > 0)}
                    downloadDocument={
                      <ChartsTiposLentesPdfReport 
                        chartsData={chartsData} 
                        timeAverageData={timeAverageData}
                      />
                    }
                    titleFilename="KPI_Tipos_Lentes"
                    size="middle"
                  />
                </Col>
              </Row>
            </Col>

            {/* Contenedor Grafico  */}
            <Col xs={24} sm={24}>
              <Row gutter={[16, 16] }
                style={{
                  background: 'white',
                  padding: "15px",
                  borderRadius: "15px",
                  marginLeft: '0px',
                  marginRight: '0px',
                  position: 'relative',
                  boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
                }}
              >
                {/* Grafico */}
                <Col xs={24} sm={24} md={15} lg={13} xl={15} >

                  <HorizontalBarChart 
                    // title="tag"
                    data={kpisTipoLenteAsesores}
                    needCardWrapper={false}
                
                    exportRef={chartAsesoresExportRef}
                
                    dateIsMonthPicker={true}
                    onDateApply={handleDateApplyAsesores}
                    onDateReset={handleDateResetAsesores}
                
                    filterTitle="Filtrar por Asesor:"
                    filterOptions={asesores_activados.map(s => ({ value: s.id_usuario, label: s.nombre }))}
                    filterValue={asesorFilter}
                    onFilterChange={handleChangeAsesores}
                
                    metrics={activeLinesLenteAsesores}
                    renderMetricSelector={true}
                    onMetricsChange={onMetricSelectorAsesorChange}
                  />

                </Col>

                {/* Divider responsivo */}
                <Col xs={24} sm={24} md={1} style={{display:'flex', justifyContent: 'end', alignItems: 'center'}}>
                  <Divider
                    type={breakpoints.md ? "vertical" : "horizontal"}
                    style={breakpoints.md ? { height: "100%", margin: "0 0 0 0", borderColor: "#d9d9d9", borderWidth: 1.5}
                      : { width: "100%", margin: "0 0 0 0", borderColor: "#d9d9d9", borderWidth: 1.5}
                    }
                  />
                </Col>


                {/*Tiempo promedio */}
                <Col xs={24} sm={24} md={8} lg={10} xl={8}>
                  <Row gutter={[24, 24]}>
                    <Col xs={24} sm={24}>
                      <KpiTiempoPromedio 
                        timeRef={timeAverageExportRef}
                        onFiltersChange={handleTimeAverageFiltersChange}
                      />
                    </Col>

                    
                  </Row>

                </Col>

              </Row>
            </Col>


            {/* grafica por sucursal */}
            <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
              <HorizontalBarChart 
                // title="tag"
                data={kpisTipoLente}
                needCardWrapper={true}
              
                exportRef={chartSucursalesExportRef}
              
                dateIsMonthPicker={true}
                onDateApply={handleDateApply}
                onDateReset={handleDateReset}
              
                filterTitle="Filtrar por Sucursal:"
                filterOptions={sucursales.map(s => ({ value: s.id_sucursal, label: s.nombre }))}
                filterValue={sucursalFilter}
                onFilterChange={handleChange}
              
                metrics={activeLinesLente}
                renderMetricSelector={true}
                onMetricsChange={onMetricSelectorSucursalChange}
              />

            </Col>



            {/* grafica por doctor */}
            <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
              <HorizontalBarChart 
                // title="tag"
                data={kpisTipoLenteDoctores}
                needCardWrapper={true}
              
                exportRef={chartDoctoresExportRef}
              
                dateIsMonthPicker={true}
                onDateApply={handleDateApplyDoctores}
                onDateReset={handleDateResetDoctores}
              
                filterTitle="Filtrar por Doctor:"
                filterOptions={doctores_activados.map(s => ({ value: s.nombre, label: s.nombre }))}
                filterValue={doctorFilter}
                onFilterChange={handleChangeDoctores}
              
                metrics={activeLinesLenteDoctores}
                renderMetricSelector={true}
                onMetricsChange={onMetricSelectorDoctorChange}
              />

            </Col>
          </Row>
        </ResponsiveContainer>

      </Col>

      {/* Extra fuera del contenido principal: modals - etc */}
      <PdfPreviewModal
        open={showModalPdf}
        onClose={() => setShowModalPdf(false)}
        document={
          <ChartsTiposLentesPdfReport 
            chartsData={chartsData} 
            timeAverageData={timeAverageData}
          />
        }
        loading={isGeneratingPdf || !chartsData} // muestra loader si estamos generando las imágenes
        title="Vista previa - Reporte KPIs Tipos de Lentes"
        titleFilename="KPIs_Tipos_Lentes"
        width="85%"
        height="80vh"
      />
    </Row>
  );
};

export default VerKpisTipoLente;
