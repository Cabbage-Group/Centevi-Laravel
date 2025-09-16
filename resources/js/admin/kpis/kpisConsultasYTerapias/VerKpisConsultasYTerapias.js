import React, { useEffect, useState, useRef } from "react";
import { Col, Row, Divider } from "antd";
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
import PdfActionButtons from "../../../components/buttons/admin/kpis/PdfActionButtons";
import PdfPreviewModal from "../../../components/modals/pdfs/PdfPreviewModal";
import ChartsConsultasYTerapias from "../../../services/pdf/kpis/kpisConsultasYTerapias/ChartsConsultasYTerapias";
import { preparePdfChartsData } from "../../../utils/admin/kpis/PreparePdfChartsData";
import { setMetricsActiveByValues } from "../../../utils/admin/kpis/setMetricsActiveByValues";

const VerKpisConsultasYTerapias = () => {
  /* ------------------------------------------------------------------------------
                                Redux: Dispatch - Store y data
  ------------------------------------------------------------------------------ */
  const dispatch = useDispatch();

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
    { label: "Consultas", value: "consultas", color: "#6C5CE7", active: true },
    { label: "Terapias", value: "terapia", color: "#00B894", active: true },
  ]);
  const [activeLinesCYTDoctores, setActiveLinesCYTDoctores] = useState([
    { label: "Consultas", value: "consultas", color: "#fb5607", active: true },
    { label: "Terapias", value: "terapia", color: "#3a86ff", active: true },
  ]);
  const [localStartDateCYTSucursales, setLocalStartDateCYTSucursales] = useState();
  const [localStartDateCYTDoctores, setLocalStartDateCYTDoctores] = useState();
  const [localEndDateCYTSucursales, setLocalEndDateCYTSucursales] = useState();
  const [localEndDateCYTDoctores, setLocalEndDateCYTDoctores] = useState();
  const [cytsucursalFilter, setCYTSucursalFilter] = useState([]); // funciona con ids(number[])
  const [cytdoctorFilter, setCYTDoctorFilter] = useState([]); // funciona con nombres(string[])

  // para generacion y muestra de pdfs
  const [cytsucursalFilterToString, setCYTSucursalFilterToString] = useState([]); // formateado para graficos con nombres(number[])
  const [showModalPdf, setShowModalPdf] = useState(false)
  const [chartsData, setChartsData] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const chartDoctoresExportRef = useRef(null);
  const chartSucursalesExportRef = useRef(null);
  const chartTerapiasDoctoresExportRef = useRef(null);

  // data para graficos pdf:
  const pdfChartsRawData = [
    { ref: chartSucursalesExportRef, title: "Gráfico distribuido por sucursales", filters: {
      metrics:  activeLinesCYTSucursales, categories: cytsucursalFilterToString, 
      rangeDate: {start: localStartDateCYTSucursales, end: localEndDateCYTSucursales}
    }},
    { ref: chartDoctoresExportRef, title: "Gráfico distribuido por doctores", filters: {
      metrics: activeLinesCYTDoctores, categories: cytdoctorFilter, 
      rangeDate: {start: localStartDateCYTDoctores, end: localEndDateCYTDoctores}
    }},
    { ref: chartTerapiasDoctoresExportRef, title: "Gráfico terapias de doctores" },
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
  ]);
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
    const formated = optionsSelected.map(opt => opt.children);
    setCYTSucursalFilterToString(formated);
  }
  const onMetricsChangeCYTSucursales = (selectedValues = []) => {
    setActiveLinesCYTSucursales(prev => setMetricsActiveByValues(prev, selectedValues));
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
    setActiveLinesCYTDoctores(prev => setMetricsActiveByValues(prev, selectedValues));
  };

  // creacion de pdf
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
              <HorizontalBarChart 
                title="Sucursales"
                data={kpisTerapiasConsultasSucursales}
                needCardWrapper={true}

                exportRef={chartSucursalesExportRef}

                dateIsMonthPicker={true}
                onDateApply={handleDateApplyCYTSucursales}
                onDateReset={handleDateResetCYTSucursales}

                filterTitle="Filtrar por sucursal:"
                filterOptions={sucursales.map(s => ({ value: s.id_sucursal, label: s.nombre }))}
                filterValue={cytsucursalFilter}
                onFilterChange={handleChangeCYTSucursales}

                metrics={activeLinesCYTSucursales}
                renderMetricSelector={true}
                onMetricsChange={onMetricsChangeCYTSucursales}
              />
            </Col>

            {/* 2da CARD Grafico doctores */}
            <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
              <HorizontalBarChart 
                title="Doctores"
                data={kpisTerapiasConsultasDoctor}
                needCardWrapper={true}

                exportRef={chartDoctoresExportRef}

                dateIsMonthPicker={true}
                onDateApply={handleDateApplyCYTDoctores}
                onDateReset={handleDateResetCYTDoctores}

                filterTitle="Filtrar por Doctor:"
                filterOptions={doctores_activados.map(d => ({ value: d.nombre, label: d.nombre }))} // el nombre funciona como value y label
                filterValue={cytdoctorFilter}
                onFilterChange={handleChangeCYTDoctores}

                metrics={activeLinesCYTDoctores}
                renderMetricSelector={true}
                onMetricsChange={onMetricsChangeCYTDoctores}
              />
            </Col>
          </Row>

          <Divider />

          {/* Grafico doctores - separado */}
          <Row gutter={[16, 16]}>
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
