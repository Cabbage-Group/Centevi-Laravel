import React, { useEffect, useState, useRef  } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchKpisTiposLente, fetchKpisTiposLenteAsesores, fetchKpisTiposLenteDoctores, setFechaRangeTipoLente, setFechaRangeTipoLenteAsesores, setFechaRangeTipoLenteDoctores } from "../../../redux/features/kpis/kpisTiposLente/kpisTiposLente";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import DateRangeSeparate from "../../reportes/DateRange";
import { Checkbox, Col, Divider, Row, Select, Grid, Button  } from "antd";
import { fetchSucursales } from "../../../redux/features/sucursales/sucursalesSlice";
import { fetchUsuarios } from "../../../redux/features/usuarios/usuariosSlice";
import KpiTiempoPromedio from "../KpisOrdenes/KpiTiempoPromedio";
import HorizontalBarChart from "../../../components/pages/admin/kpis/HorizontalBarChart";

import { PDFDownloadLink } from "@react-pdf/renderer";
import ChartsTiposLentesPdfReport from "../../../services/pdf/kpis/kpisTiposLentes/ChartsTiposLentesPdfReport";

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

  const [showModalPdf, setShowModalPdf] = useState(false)

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

  const chartAsesoresExportRef = useRef(null);
  const chartSucursalesExportRef = useRef(null);
  const chartDoctoresExportRef = useRef(null);



  const { useBreakpoint } = Grid;
  const breakpoints = useBreakpoint();

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




  const truncateXAxis = (value) => {
    return value.length > 20 ? value.substring(0, 20) + "..." : value;
  };

  const truncateXAxisAsesores = (value) => {
    return value.length > 6 ? value.substring(0, 6) + "..." : value;
  };

  const truncateXAxisDoctores = (value) => {
    return value.length > 10 ? value.substring(0, 10) + "..." : value;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "#f9f9f9",
          color: "#000",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          boxShadow: "0px 2px 5px rgba(0,0,0,0.2)"
        }}>
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

  const handleCheckboxChangeLente = (lineKey, checked) => {
    setActiveLinesLente(prevActiveLines => {
      if (checked) {
        return [...prevActiveLines, lineKey];
      } else {
        return prevActiveLines.filter(line => line !== lineKey);
      }
    });
  };

  const handleCheckboxChangeLenteAsesores = (lineKey, checked) => {
    setActiveLinesLenteAsesores(prevActiveLines => {
      if (checked) {
        return [...prevActiveLines, lineKey];
      } else {
        return prevActiveLines.filter(line => line !== lineKey);
      }
    });
  };

  const handleCheckboxChangeLenteDoctores = (lineKey, checked) => {
    setActiveLinesLenteDoctores(prevActiveLines => {
      if (checked) {
        return [...prevActiveLines, lineKey];
      } else {
        return prevActiveLines.filter(line => line !== lineKey);
      }
    });
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

  const renderLinesLente = () => {
    const lines = [];
    if (activeLinesLente.includes("lente_contacto")) {
      lines.push(
        <Bar
          dataKey="lente_contacto"
          stackId="a"
          fill="#6C5CE7"
          barSize={70}
          isAnimationActive={false}
        />
      );
    }
    if (activeLinesLente.includes("lente_normal")) {
      lines.push(
        <Bar
          dataKey="lente_normal"
          stackId="a"
          fill="#00B894"
          barSize={70}
          isAnimationActive={false}
        />
      );
    }
    return lines;
  };

  const renderLinesLenteAsesores = () => {
    const lines = [];
    if (activeLinesLenteAsesores.includes("lente_contacto")) {
      lines.push(<Bar dataKey="lente_contacto" stackId="a" fill="#6C5CE7" barSize={70} />);
    }
    if (activeLinesLenteAsesores.includes("lente_normal")) {
      lines.push(<Bar dataKey="lente_normal" stackId="a" fill="#00B894" barSize={70} />);
    }
    return lines;
  };


  const renderLinesLenteDoctores = () => {
    const lines = [];
    if (activeLinesLenteDoctores.includes("lente_contacto")) {
      lines.push(<Bar dataKey="lente_contacto" stackId="a" fill="#6C5CE7" barSize={70} />);
    }
    if (activeLinesLenteDoctores.includes("lente_normal")) {
      lines.push(<Bar dataKey="lente_normal" stackId="a" fill="#00B894" barSize={70} />);
    }
    return lines;
  };

  const renderLegendLente = () => (
    <div style={{ display: 'flex', gap: '0px', marginBottom: '15px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '15px', height: '15px', backgroundColor: '#6C5CE7', borderRadius: '3px' }}></div>
        <Checkbox
          checked={activeLinesLente.includes("lente_contacto")}
          onChange={(e) => handleCheckboxChangeLente("lente_contacto", e.target.checked)}
        >
          Lente Contacto
        </Checkbox>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '15px', height: '15px', backgroundColor: '#00B894', borderRadius: '3px' }}></div>
        <Checkbox
          checked={activeLinesLente.includes("lente_normal")}
          onChange={(e) => handleCheckboxChangeLente("lente_normal", e.target.checked)}
        >
          Lente Normal
        </Checkbox>
      </div>
    </div>
  );


  const renderLegendLenteAsesores = () => (

    <div style={{ display: 'flex', gap: '0px', marginBottom: '15px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '15px', height: '15px', backgroundColor: '#6C5CE7', borderRadius: '3px' }}></div>
        <Checkbox
          checked={activeLinesLenteAsesores.includes("lente_contacto")}
          onChange={(e) => handleCheckboxChangeLenteAsesores("lente_contacto", e.target.checked)}
        >
          Lente Contacto
        </Checkbox>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '15px', height: '15px', backgroundColor: '#00B894', borderRadius: '3px' }}></div>
        <Checkbox
          checked={activeLinesLenteAsesores.includes("lente_normal")}
          onChange={(e) => handleCheckboxChangeLenteAsesores("lente_normal", e.target.checked)}
        >
          Lente Normal
        </Checkbox>
      </div>
    </div>
  );

  

  const renderLegendLenteDoctores = () => (
    <div style={{ display: 'flex', gap: '0px', marginBottom: '15px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '15px', height: '15px', backgroundColor: '#6C5CE7', borderRadius: '3px' }}></div>
        <Checkbox
          checked={activeLinesLenteDoctores.includes("lente_contacto")}
          onChange={(e) => handleCheckboxChangeLenteDoctores("lente_contacto", e.target.checked)}
        >
          Lente Contacto
        </Checkbox>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '15px', height: '15px', backgroundColor: '#00B894', borderRadius: '3px' }}></div>
        <Checkbox
          checked={activeLinesLenteDoctores.includes("lente_normal")}
          onChange={(e) => handleCheckboxChangeLenteDoctores("lente_normal", e.target.checked)}
        >
          Lente Normal
        </Checkbox>
      </div>
    </div>
    // <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px' }}>
    //   <Checkbox
    //     checked={activeLinesLenteDoctores.includes("lente_contacto")}
    //     onChange={(e) => handleCheckboxChangeLenteDoctores("lente_contacto", e.target.checked)}
    //   >
    //     Lente Contacto
    //   </Checkbox>
    //   <Checkbox
    //     checked={activeLinesLenteDoctores.includes("lente_normal")}
    //     onChange={(e) => handleCheckboxChangeLenteDoctores("lente_normal", e.target.checked)}
    //   >
    //     Lente Normal
    //   </Checkbox>
    // </div>
  );

  // const CustomTooltip = ({ active, payload, label }) => {
  //   if (active && payload && payload.length) {
  //     return (
  //       <div style={{ background: 'transparent', padding: '0' }}>
  //         <p style={{ margin: 0 }}>{`${label}: ${payload[0].value}`}</p>
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  /* ------------------------------------------------------------------------------------------ 
                                    Funciones utilitarias
   ------------------------------------------------------------------------------------------*/
  

  // const handlePreviewPdf = async () => {
  //   const elements = [
  //     chartAsesoresExportRef.current,
  //     chartSucursalesExportRef.current,
  //     chartDoctoresExportRef.current,
  //   ].filter(Boolean);
  //   const pdfUrl = await ChartReportToPdfUrl(elements, { title: "KPI Tipo Lente" });

  //   // Abrir en nueva pestaña
  //   window.open(pdfUrl, "_blank");
  // };

  return (
    
    // Contenedor principal
    <Row justify="center" style={{marginBottom: '30px'}}>
      <Col xs={24} sm={24} md={22} lg={22} xl={20} xxl={18}>

        {/* Contenido */}
        <ResponsiveContainer width="100%">
          <Row gutter={[16, 16]} >

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
                {/* <Col xs={24} sm={24} md={14} lg={16} xl={18}> */}
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

                {/* <Divider
                  type={breakpoints.md ? "vertical" : "horizontal"}
                  style={breakpoints.md ? { height: "100%", margin: "0 0 0 0",  } : { width: "100%", margin: "0 0 0 0"}}
                /> */}

                {/*Tiempo promedio */}
                <Col xs={24} sm={24} md={8} lg={10} xl={8}>
                  {/* <KpiTiempoPromedio /> */}
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
      <Col sm={24} xs={24}>
        <PDFDownloadLink
          document={<ChartsTiposLentesPdfReport />}
          fileName="KPI_Tipos_Lentes.pdf"
          style={{ textDecoration: "none" }}
        >
          {({ loading }) => (
            <Button type="primary">
              {loading ? "Generando PDF..." : "Descargar Reporte"}
            </Button>
          )}
        </PDFDownloadLink>
      </Col>
    </Row>
  );
};

export default VerKpisTipoLente;
