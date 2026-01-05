import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBases } from '../../../redux/features/bases/basesSlice';
import { 
  fetchTiposBaseEstadistica, 
  fetchKpiTiposBaseTop10,
  fetchKpiTiposBaseTop30,
  fetchKpiTiposBaseTodos,
  fetchTiposBaseExcel,
} from "../../../redux/features/kpis/KpisTiposBase/KpisTiposBaseSlice";
import { Col, Row, Card, Statistic, Button } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import CustomizedAnalyticsBarChart from "../../../components/pages/admin/kpis/CustomizedAnalyticsBarChart";
import ChartsTipoBasesPdfReport from "../../../services/pdf/kpis/kpisTipoBases/ChartsTipoBasesPdfReport";
import PdfActionButtons from "../../../components/buttons/admin/kpis/PdfActionButtons";
import PdfPreviewModal from "../../../components/modals/pdfs/PdfPreviewModal";
import { preparePdfChartsData } from "../../../utils/admin/kpis/PreparePdfChartsData";

const KpisTiposBase = () => {
  /* ------------------------------------------------------------------------------
                                Redux: Dispatch - Store y data
  ------------------------------------------------------------------------------ */
  const dispatch = useDispatch();
  const { bases } = useSelector((state) => state.bases);
  const {
    downloadingExcel,
    kpiTiposBaseTop10,
    kpiTiposBaseTop30,
    kpiTiposBaseTodos,
    kpiTiposBaseLength,
  } = useSelector((state) => state.kpisTiposBase);

  /* ------------------------------------------------------------------------------
                            UseStates y data constante para logica
  ------------------------------------------------------------------------------ */
  // state: KpiTiposBaseTop10
  const [localStartDateKpiTiposBaseTop10, setLocalStartDateKpiTiposBaseTop10] = useState();
  const [localEndDateKpiTiposBaseTop10, setLocalEndDateKpiTiposBaseTop10] = useState();
  const [kpiTiposBaseTop10Filter, setKpiTiposBaseTop10Filter] = useState([]);
  const [kpiTiposBaseTop10Lado, setKpiTiposBaseTop10Lado] = useState();

  // state: tipos bases limit 30
  const [localStartDateKpiTiposBaseTop30, setLocalStartDateKpiTiposBaseTop30] = useState();
  const [localEndDateKpiTiposBaseTop30, setLocalEndDateKpiTiposBaseTop30] = useState();
  const [kpiTiposBaseTop30Filter, setKpiTiposBaseTop30Filter] = useState([]);
  const [kpiTiposBaseTop30Lado, setKpiTiposBaseTop30Lado] = useState();


  // state: tipos bases no limit
  const [localStartDateKpiTiposBaseTodos, setLocalStartDateKpiTiposBaseTodos] = useState();
  const [localEndDateKpiTiposBaseTodos, setLocalEndDateKpiTiposBaseTodos] = useState();
  const [kpiTiposBaseTodosFilter, setKpiTiposBaseTodosFilter] = useState([]);
  const [kpiTiposBaseTodosLado, setKpiTiposBaseTodosLado] = useState();


  // para generacion y muestra de pdfs
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
        categories: kpiTiposBaseTop10Filter, 
        rangeDate: {start: localStartDateKpiTiposBaseTop10, end: localEndDateKpiTiposBaseTop10},
        lado: kpiTiposBaseTop10Lado,
      }, options: {orientation: 'horizontal'}},
    { ref: chartLimited70Ref, title: "Gráfico limitado a 30 registros", filters: {
        categories: kpiTiposBaseTop30Filter, 
        rangeDate: {start: localStartDateKpiTiposBaseTop30, end: localEndDateKpiTiposBaseTop30},
        lado: kpiTiposBaseTop30Lado,
      }, options: {orientation: 'vertical'}},
    { ref: chartNoLimitedRef, title: "Gráfico sin limites", filters: {
        categories: kpiTiposBaseTodosFilter, 
        rangeDate: {start: localStartDateKpiTiposBaseTodos, end: localEndDateKpiTiposBaseTodos},
        lado: kpiTiposBaseTodosLado,
      }, options: {orientation: 'vertical'}},
  ];

  /* ------------------------------------------------------------------------------
                                UseEffects
  ------------------------------------------------------------------------------ */
  useEffect(() => {
    dispatch(fetchTiposBaseEstadistica());
    dispatch(fetchBases({}));
  }, [])

  /* ------------------------------------------------------------------------------
                                  Handlers
  ------------------------------------------------------------------------------ */

  const buildFilters = ({ basesId, startDate, endDate, lado }) => {
    const filters = {};
    if (basesId && basesId.length > 0) filters.basesId = basesId;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (lado) filters.lado = lado;
    return filters;
  };

  // tipos cristales limit 10
  const handleDateApplyKpiTiposBaseTop10 = (newStartDate, newEndDate) => {
    setLocalStartDateKpiTiposBaseTop10(newStartDate);
    setLocalEndDateKpiTiposBaseTop10(newEndDate);

    dispatch(
      fetchKpiTiposBaseTop10(
        buildFilters({
          basesId: kpiTiposBaseTop10Filter,
          startDate: newStartDate,
          endDate: newEndDate,
        })
      )
    );

    setChartsData(null);
  };

  const handleDateResetKpiTiposBaseTop10 = () => {
    setLocalStartDateKpiTiposBaseTop10(null);
    setLocalEndDateKpiTiposBaseTop10(null);

    dispatch(
      fetchKpiTiposBaseTop10(
        buildFilters({
          basesId: kpiTiposBaseTop10Filter,
        })
      )
    );

    setChartsData(null);
  };

  // tipos bases limit 30
  const handleDateApplyKpiTiposBaseTop30 = (newStartDate, newEndDate) => {
    setLocalStartDateKpiTiposBaseTop30(newStartDate);
    setLocalEndDateKpiTiposBaseTop30(newEndDate);

    dispatch(
      fetchKpiTiposBaseTop30(
        buildFilters({
          basesId: kpiTiposBaseTop30Filter,
          startDate: newStartDate,
          endDate: newEndDate,
        })
      )
    );

    setChartsData(null);
  };

  // date reset
  const handleDateResetKpiTiposBaseTop30 = () => {
    setLocalStartDateKpiTiposBaseTop30(null);
    setLocalEndDateKpiTiposBaseTop30(null);

    dispatch(
      fetchKpiTiposBaseTop30(
        buildFilters({
          basesId: kpiTiposBaseTop30Filter,
        })
      )
    );

    setChartsData(null);
  };
  
  const handleDateApplyKpiTiposBaseTodos = (newStartDate, newEndDate) => {
    setLocalStartDateKpiTiposBaseTodos(newStartDate);
    setLocalEndDateKpiTiposBaseTodos(newEndDate);

    dispatch(
      fetchKpiTiposBaseTodos(
        buildFilters({
          basesId: kpiTiposBaseTodosFilter,
          startDate: newStartDate,
          endDate: newEndDate,
        })
      )
    );

    setChartsData(null);
  };

  // date reset
  const handleDateResetKpiTiposBaseTodos = () => {
    setLocalStartDateKpiTiposBaseTodos(null);
    setLocalEndDateKpiTiposBaseTodos(null);

    dispatch(
      fetchKpiTiposBaseTodos(
        buildFilters({
          basesId: kpiTiposBaseTodosFilter,
        })
      )
    );

    setChartsData(null);
  };

  // ----------------------- filters onChange ----------------------
  // tipos base limit 10
  const handleChangeTiposBase = (value) => {
    setKpiTiposBaseTop10Filter(value);

    dispatch(
      fetchKpiTiposBaseTop10(
        buildFilters({
          basesId: value,
          startDate: localStartDateKpiTiposBaseTop10,
          endDate: localEndDateKpiTiposBaseTop10,
        })
      )
    );

    setChartsData(null);
  };

  // tipos base limit 70
  const handleChangeTiposBaseTop30 = (value) => {
    setKpiTiposBaseTop30Filter(value);

    dispatch(
      fetchKpiTiposBaseTop30(
        buildFilters({
          basesId: value,
          startDate: localStartDateKpiTiposBaseTop30,
          endDate: localEndDateKpiTiposBaseTop30,
        })
      )
    );

    setChartsData(null);
  };
  
  // tipos base no limit
  const handleChangeTiposBaseTodos = (value) => {
    setKpiTiposBaseTodosFilter(value);

    dispatch(
      fetchKpiTiposBaseTodos(
        buildFilters({
          basesId: value,
          startDate: localStartDateKpiTiposBaseTodos,
          endDate: localEndDateKpiTiposBaseTodos,
        })
      )
    );

    setChartsData(null);
  };

  // ----------------------- lado filtro ----------------------

  const KpiTiposBaseTop10LadoFilter = (lado) => {
    setKpiTiposBaseTop10Lado(lado);

    dispatch(
      fetchKpiTiposBaseTop10(
        buildFilters({
          basesId: kpiTiposBaseTop10Filter,
          startDate: localStartDateKpiTiposBaseTop10,
          endDate: localEndDateKpiTiposBaseTop10,
          lado: lado
        })
      )
    );

    setChartsData(null);
  };

  const KpiTiposBaseTop30LadoFilter = (lado) => {
    setKpiTiposBaseTop30Lado(lado);

    dispatch(
      fetchKpiTiposBaseTop30(
        buildFilters({
          basesId: kpiTiposBaseTop30Filter,
          startDate: localStartDateKpiTiposBaseTop30,
          endDate: localEndDateKpiTiposBaseTop30,
          lado: lado
        })
      )
    );

    setChartsData(null);
  };

  const KpiTiposBaseTodosLadoFilter = (lado) => {
    setKpiTiposBaseTodosLado(lado);

    dispatch(
      fetchKpiTiposBaseTodos(
        buildFilters({
          basesId: kpiTiposBaseTodosFilter,
          startDate: localStartDateKpiTiposBaseTodos,
          endDate: localEndDateKpiTiposBaseTodos,
          lado: lado
        })
      )
    );

    setChartsData(null);
  };

  const downloadExcel = async () => {
    try {
      const blob = await dispatch(fetchTiposBaseExcel({})).unwrap();

      const url = window.URL.createObjectURL(
        new Blob([blob], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `KPIs_Tipos_Base_${new Date().toISOString().slice(0, 10)}.xlsx`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar Excel:", error);
    }
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
                                Return Main View
  ------------------------------------------------------------------------------ */
  return (
    // Contenedor principal
    <Row justify="center">
      <Col xs={24} sm={24} md={22} lg={22} xl={20} xxl={18}>

        {/* Contenedor Titulo y botones para pdf */}
        <Row style={{marginBottom: 16}} gutter={[12, 12]}>
          <Col xs={24} sm={16} style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <h1 style={{ color: "black", fontWeight: "bold", fontSize: 16, margin: '0 0 0 0', display: 'block' }}>
              Reporteria de Tipos de Base
            </h1>
          </Col>
          <Col xs={24} sm={8} style={{display: 'flex', justifyContent: 'flex-end', gap: 8}}>
            {/* Botón Descargar Excel */}
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              style={{
                backgroundColor: "#217346",
                borderColor: "#217346",
              }}
              onClick={downloadExcel}
              loading={downloadingExcel}
            >
              Descargar Excel
            </Button>
            <PdfActionButtons
              onPreview={handlePreviewPdf}
              isGenerating={isGeneratingPdf}
              ready={!!(chartsData && chartsData.length > 0)}
              downloadDocument={<ChartsTipoBasesPdfReport chartsData={chartsData} />}
              titleFilename="KPIs_tipos_base"
              size="middle"
            />
          </Col>
        </Row>

        {/* ================= KPI HEADER ================= */}
        <Row
          style={{ marginBottom: 16 }}
          justify="center"
        >
          <Col xs={24} sm={20} md={16} lg={8}>
            <Card
              style={{
                backgroundColor: "#ffffffff",
                borderRadius: 12,
                textAlign: "center",
              }}
              bodyStyle={{ padding: "8px" }}
            >
              <Statistic
                title={
                  <span style={{fontSize: 14 }}>
                    Total de Bases
                  </span>
                }
                value={kpiTiposBaseLength}
                valueStyle={{
                  fontSize: 28,
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* Contenedor Graficas */}
        <Row style={{marginBottom: 9}} gutter={[12, 12]}>

          {/* Grafico de barras verticales - limite 10 */}
          <Col xs={24} sm={24}>
            <CustomizedAnalyticsBarChart
              badgeLabel="Tipos Base"
              data={kpiTiposBaseTop10.map(data => ({
                ...data,
                total: Number(data.total)
              }))}
              needCardWrapper={true}
              exportRef={chartLimited10Ref}

              dateIsMonthPicker={true}
              onDateApply={handleDateApplyKpiTiposBaseTop10}
              onDateReset={handleDateResetKpiTiposBaseTop10}

              filterTitle="Filtrar por tipo de base:"
              filterOptions={bases.map((base) => ({
                value: Number(base.id),
                label: `${base.codigo} - ${base.descripcion}`,
              }))}
              filterValue={kpiTiposBaseTop10Filter}
              onFilterChange={handleChangeTiposBase}

              filters={[
                {
                  key: "lado",
                  title: "Filtrar por lado:",
                  mode: "single",
                  value: kpiTiposBaseTop10Lado,
                  onChange: (val) => KpiTiposBaseTop10LadoFilter(val),
                  options: [
                    { value: "izquierda", label: "Izquierda" },
                    { value: "derecha", label: "Derecha" },
                  ],
                },
              ]}

              metrics={[
                { label: "descripcion", value: "total", color: "#8884d8", active: true },
              ]}
              renderMetricSelector={false}
              needLegend={true}
              barDataKey="descripcion"
            />
          </Col>

          {/* Grafico de barras horizontales - limite 30 */}
          <Col xs={24} sm={24} md={12}>
            <CustomizedAnalyticsBarChart 
              badgeLabel="Tipos Base"
              data={kpiTiposBaseTop30.map(data => ({
                ...data,
                total: Number(data.total)
              }))}
              needCardWrapper={true}
              chartHeight="900px"

              exportRef={chartLimited70Ref}

              dateIsMonthPicker={true}
              onDateApply={handleDateApplyKpiTiposBaseTop30}
              onDateReset={handleDateResetKpiTiposBaseTop30}

              filterTitle="Filtrar por tipos de base:"
              filterOptions={bases.map(base => ({
                value: Number(base.id),
                label: `${base.codigo} - ${base.descripcion}`,
              }))}
              filterValue={kpiTiposBaseTop30Filter}
              onFilterChange={handleChangeTiposBaseTop30}

              filters={[
                {
                  key: "lado",
                  title: "Filtrar por lado:",
                  mode: "single",
                  value: kpiTiposBaseTop30Lado,
                  onChange: (val) => KpiTiposBaseTop30LadoFilter(val),
                  options: [
                    { value: "izquierda", label: "Izquierda" },
                    { value: "derecha", label: "Derecha" },
                  ],
                },
              ]}

              metrics={[{label: "descripcion", value: "total", color: "#8884d8", active: true}]}
              renderMetricSelector={false}
              needLegend={true}
              barsOrientation="horizontal"
              barDataKey="descripcion"
            />
          </Col>

          {/* Grafico de barras horizontales - sin limites */}
          <Col xs={24} sm={24} md={12}>
            <CustomizedAnalyticsBarChart 
              badgeLabel="Tipos Bases"
              data={kpiTiposBaseTodos.map(data => ({
                ...data,
                total: Number(data.total)
              }))}
              needCardWrapper={true}
              chartHeight="900px"

              exportRef={chartNoLimitedRef}

              dateIsMonthPicker={true}
              onDateApply={handleDateApplyKpiTiposBaseTodos}
              onDateReset={handleDateResetKpiTiposBaseTodos}

              filterTitle="Filtrar por tipo de base:"
              filterOptions={bases.map(base => ({
                value: Number(base.id),
                label: `${base.codigo} - ${base.descripcion}`,
              }))}
              filterValue={kpiTiposBaseTodosFilter}
              onFilterChange={handleChangeTiposBaseTodos}

              filters={[
                {
                  key: "lado",
                  title: "Filtrar por lado:",
                  mode: "single",
                  value: kpiTiposBaseTodosLado,
                  onChange: (val) => KpiTiposBaseTodosLadoFilter(val),
                  options: [
                    { value: "izquierda", label: "Izquierda" },
                    { value: "derecha", label: "Derecha" },
                  ],
                },
              ]}

              metrics={[{label: "descripcion", value: "total", color: "#8884d8", active: true}]} // solo una barra por categoria sin cambios
              renderMetricSelector={false}
              needLegend={true}
              barsOrientation="horizontal"
              barDataKey="descripcion"
            />
          </Col>
          
        </Row>
        <PdfPreviewModal 
          open={showModalPdf}
          onClose={() => setShowModalPdf(false)}
          document={<ChartsTipoBasesPdfReport chartsData={chartsData} />}
          loading={isGeneratingPdf || !chartsData} // muestra loader si estamos generando las imágenes
          title="Vista previa - Reporte KPIs Tipos de base"
          titleFilename="KPIs_tipos_base"
          width="85%"
          height="80vh"
        />
      </Col>
    </Row>
  );
}

export default KpisTiposBase