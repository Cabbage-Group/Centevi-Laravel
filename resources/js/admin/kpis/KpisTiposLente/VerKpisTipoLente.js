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
import { generateChartsImages } from "../../../utils/GenerateChartImages";

import PdfPreviewModal from "../../../components/modals/pdfs/PdfPreviewModal";

import PdfActionButtons from "../../../components/butttons/PdfActionButtons";

const VerKpisTipoLente = () => {
  const dispatch = useDispatch();
  const { kpisTipoLente, kpisTipoLenteAsesores, kpisTipoLenteDoctores } = useSelector((state) => state.kpisTipoLente);
  const { sucursales } = useSelector((state) => state.sucursales);
  const { asesores_activados, doctores_activados } = useSelector((state) => state.usuarios);


  const [localStartDate, setLocalStartDate] = useState();
  const [localEndDate, setLocalEndDate] = useState();
  const [localStartDateAsesores, setLocalStartDateAsesores] = useState();
  const [localEndDateAsesores, setLocalEndDateAsesores] = useState();
  const [localStartDateDoctores, setLocalStartDateDoctores] = useState();
  const [localEndDateDoctores, setLocalEndDateDoctores] = useState();
  const [activeLinesLente, setActiveLinesLente] = useState(["lente_contacto", "lente_normal"]);
  const [activeLinesLenteAsesores, setActiveLinesLenteAsesores] = useState(["lente_contacto", "lente_normal"]);
  const [activeLinesLenteDoctores, setActiveLinesLenteDoctores] = useState(["lente_contacto", "lente_normal"]);
  const [sucursalFilter, setSucursalFilter] = useState([]);
  const [asesorFilter, setAsesorFilter] = useState([]);
  const [doctorFilter, setDoctorFilter] = useState([]);

  // para generacion y muestra de pdfs
  const [showModalPdf, setShowModalPdf] = useState(false)
  const [chartsImages, setChartsImages] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const chartAsesoresExportRef = useRef(null);
  const chartSucursalesExportRef = useRef(null);
  const chartDoctoresExportRef = useRef(null);

  const metricsOptionsAsesores = [
    {label: 'Lente contacto', value: 'lente_contacto', color: '#6C5CE7'},
    {label: 'Lente Normal', value: 'lente_normal', color: '#00B894'},
  ]

  const metricsOptionsSucursales = [
    {label: 'Lente contacto', value: 'lente_contacto', color: '#6C5CE7'},
    {label: 'Lente Normal', value: 'lente_normal', color: '#00B894'},
  ]

  const metricsOptionsDoctores = [
    {label: 'Lente contacto', value: 'lente_contacto', color: '#6C5CE7'},
    {label: 'Lente Normal', value: 'lente_normal', color: '#00B894'},
  ]

  const { useBreakpoint } = Grid;
  const breakpoints = useBreakpoint();

  const timeAverageExportRef = useRef(null);

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

    setLocalStartDate(startDateFormatted);
    setLocalEndDate(endDateFormatted);
    dispatch(setFechaRangeTipoLente({
      startDate: startDateFormatted,
      endDate: endDateFormatted
    }));
  };


  const handleChange = (value) => {
    setSucursalFilter(value);
  };

  const handleChangeAsesores = (value) => {
    setAsesorFilter(value);
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

    setLocalStartDateAsesores(startDateFormatted);
    setLocalEndDateAsesores(endDateFormatted);
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


    setLocalStartDateDoctores(startDateFormatted);
    setLocalEndDateDoctores(endDateFormatted);
    dispatch(setFechaRangeTipoLenteDoctores({
      startDate: startDateFormatted,
      endDate: endDateFormatted
    }));
  };



  const onMetricSelectorAsesorChange = (values) => {
    setActiveLinesLenteAsesores(values);
  }
  const onMetricSelectorSucursalChange = (values) => {
    setActiveLinesLente(values);
  }
  const onMetricSelectorDoctorlChange = (values) => {
    setActiveLinesLenteDoctores(values);
  }

  
  /* ------------------------------------------------------------------------------------------
                                    Funciones utilitarias
   ------------------------------------------------------------------------------------------*/


  const handlePreviewPdf = async () => {
    try {
      // si ya generaste imágenes, no vuelvas a generarlas
      if (!chartsImages || chartsImages.length === 0) {
        setIsGeneratingPdf(true);
        const itemsToCapture = [
          { ref: chartAsesoresExportRef, title: "Gráfico - Asesores" },
          { ref: chartSucursalesExportRef, title: "Gráfico - Sucursales" },
          { ref: chartDoctoresExportRef, title: "Gráfico - Doctores" },
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

  return (

    // Contenedor principal
    <Row justify="center" style={{marginBottom: '30px'}}>
      <Col xs={24} sm={24} md={22} lg={22} xl={20} xxl={18}>

        {/* Contenido */}
        <ResponsiveContainer width="100%">
          <Row gutter={[16, 16]} >
            <Col xs={24} sm={24}>
              <Row style={{marginBottom: 9}} gutter={[12, 12]}>
                <Col xs={24} sm={16} style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <h1 style={{ color: "black", fontWeight: "bold", fontSize: 16, margin: '0 0 0 0', display: 'block' }}>
                    KPIs Tipos de lentes
                  </h1>
                </Col>
                <Col xs={24} sm={8} style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <PdfActionButtons
                    onPreview={handlePreviewPdf}
                    isGenerating={isGeneratingPdf}
                    ready={!!(chartsImages && chartsImages.length > 0)}
                    downloadDocument={<ChartsTiposLentesPdfReport charts={chartsImages} timeAverage={timeAverageExportRef} />}
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

                    isMonthPicker={true}
                    onDateApply={handleDateApplyAsesores}
                    onDateReset={handleDateResetAsesores}

                    filterTitle="Filtrar por Asesor:"
                    filterList={asesores_activados}
                    filterValueKey="id_usuario"
                    filterLabelKey="nombre"
                    filterValue={asesorFilter}
                    onFilterChange={handleChangeAsesores}

                    metricsOptions={metricsOptionsAsesores}
                    // activeMetrics={activeLinesLenteDoctores}
                    activeMetrics={activeLinesLenteAsesores}


                    renderMetricSelector={true}
                    onMetricsChange={onMetricSelectorAsesorChange}

                    barCategoryGap="50%"
                    barGap={0}
                    xDataKey="name"
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

                isMonthPicker={true}
                onDateApply={handleDateApply}
                onDateReset={handleDateReset}

                filterTitle="Filtrar por Sucursal:"
                filterList={sucursales}
                filterValueKey="id_sucursal"
                filterLabelKey="nombre"
                filterValue={sucursalFilter}
                onFilterChange={handleChange}

                metricsOptions={metricsOptionsSucursales}
                activeMetrics={activeLinesLente}

                renderMetricSelector={true}
                onMetricsChange={onMetricSelectorSucursalChange}

                barCategoryGap="50%"
                barGap={0}
                xDataKey="name"
              />

            </Col>



            {/* grafica por doctor */}
            <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
              <HorizontalBarChart
                // title="tag"
                data={kpisTipoLenteDoctores}
                needCardWrapper={true}

                exportRef={chartDoctoresExportRef}

                isMonthPicker={true}
                onDateApply={handleDateApplyDoctores}
                onDateReset={handleDateResetDoctores}

                filterTitle="Filtrar por Doctor:"
                filterList={doctores_activados}
                filterValueKey="nombre"
                filterLabelKey="nombre"
                filterValue={doctorFilter}
                onFilterChange={handleChangeDoctores}

                metricsOptions={metricsOptionsDoctores}
                activeMetrics={activeLinesLenteDoctores}

                renderMetricSelector={true}
                onMetricsChange={onMetricSelectorDoctorlChange}

                barCategoryGap="50%"
                barGap={0}
                xDataKey="name"
              />

            </Col>
          </Row>
        </ResponsiveContainer>

      </Col>

      {/* Extra fuera del contenido principal: modals - etc */}
      <PdfPreviewModal
        open={showModalPdf}
        onClose={() => setShowModalPdf(false)}
        document={<ChartsTiposLentesPdfReport charts={chartsImages} timeAverage={timeAverageExportRef}/>}
        loading={isGeneratingPdf || !chartsImages} // muestra loader si estamos generando las imágenes
        title="Vista previa - KPIs Tipos de Lentes"
        titleFilename="KPIs_Tipos_Lentes"
        width="85%"
        height="80vh"
      />
    </Row>
  );
};

export default VerKpisTipoLente;
