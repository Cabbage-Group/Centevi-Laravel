import React, { useEffect, useState } from "react";
import DateRangeSeparate from "../../reportes/DateRange";
import { Checkbox, Col, Row, Select, Divider } from "antd";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, } from 'recharts';
import { fetchKpisTerapiasConsultasDoctor, fetchKpisTerapiasConsultasSucursales, setFechaRangeTerapiasConsultasCYTDoctores, setFechaRangeTerapiasConsultasCYTSucursal, setFechaRangeTerapiasPorDoctores } from "../../../redux/features/kpis/kpisConsultasTerapias/kpisConsultasTerapiasSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchSucursales } from "../../../redux/features/sucursales/sucursalesSlice";
import { fetchUsuarios } from "../../../redux/features/usuarios/usuariosSlice";
import KpisConsultasTerapiasDoctores from "../KpisConsultasTerapias/kpisConsultasTerapiasDoctores/KpisConsultasTerapiasDoctores";
import KpisConsultasTerapiasSucursales from "../KpisConsultasTerapias/kpisConsultasTerapiasSucursales/KpisConsultasTerapiasSucursales";

const VerKpisConsultasYTerapias = () => {

  const dispatch = useDispatch();
  const { sucursales } = useSelector((state) => state.sucursales);
  const {
    doctores_activados
  } = useSelector((state) => state.usuarios);
  const {
    kpisTerapiasConsultasSucursales,
    kpisTerapiasConsultasDoctor
  } = useSelector((state) => state.kpisConsultasTerapias)
  const [activeLinesCYTSucursales, setActiveLinesCYTSucursales] = useState(["consultas", "terapia"]);
  const [activeLinesCYTDoctores, setActiveLinesCYTDoctores] = useState(["consultas", "terapia"]);
  const [localStartDateCYTSucursales, setLocalStartDateCYTSucursales] = useState();
  const [localStartDateCYTDoctores, setLocalStartDateCYTDoctores] = useState();
  const [localEndDateCYTSucursales, setLocalEndDateCYTSucursales] = useState();
  const [localEndDateCYTDoctores, setLocalEndDateCYTDoctores] = useState();
  const [cytsucursalFilter, setCYTSucursalFilter] = useState([]);
  const [cytdoctorFilter, setCYTDoctorFilter] = useState([]);

  useEffect(() => {
    dispatch(fetchSucursales({}));
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchUsuarios({}));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchKpisTerapiasConsultasSucursales({
      startDate: localStartDateCYTSucursales,
      endDate: localEndDateCYTSucursales,
      sucursales: cytsucursalFilter
    }));
  }, [dispatch, localStartDateCYTSucursales, localEndDateCYTSucursales, cytsucursalFilter]);

  useEffect(() => {
    dispatch(fetchKpisTerapiasConsultasDoctor({
      startDate: localStartDateCYTDoctores,
      endDate: localEndDateCYTDoctores,
      doctores: cytdoctorFilter
    }));
  }, [dispatch, localStartDateCYTDoctores, localEndDateCYTDoctores, cytdoctorFilter]);

  const truncateXAxisCYTSucursales = (value) => {
    return value.length > 10 ? value.substring(0, 10) + "..." : value;
  };

  const truncateXAxisCYTDoctores = (value) => {
    return value.length > 10 ? value.substring(0, 10) + "..." : value;
  };

  const handleDateApplyCYTSucursales = (newStartDate, newEndDate) => {
    setLocalStartDateCYTSucursales(newStartDate);
    setLocalEndDateCYTSucursales(newEndDate);
    dispatch(setFechaRangeTerapiasConsultasCYTSucursal({ startDate: newStartDate, endDate: newEndDate }));
  };

  const handleDateApplyCYTDoctores = (newStartDate, newEndDate) => {
    setLocalStartDateCYTDoctores(newStartDate);
    setLocalEndDateCYTDoctores(newEndDate);
    dispatch(setFechaRangeTerapiasPorDoctores({ startDate: newStartDate, endDate: newEndDate }));
  };

  const handleCheckboxChangeCYTSucursales = (lineKey, checked) => {
    setActiveLinesCYTSucursales(prevActiveLines => {
      if (checked) {
        return [...prevActiveLines, lineKey];
      } else {
        return prevActiveLines.filter(line => line !== lineKey);
      }
    });
  };

  const handleCheckboxChangeCYTDoctores = (lineKey, checked) => {
    setActiveLinesCYTDoctores(prevActiveLines => {
      if (checked) {
        return [...prevActiveLines, lineKey];
      } else {
        return prevActiveLines.filter(line => line !== lineKey);
      }
    });
  };


  const handleDateResetCYTSucursales = () => {
    const newEndDate = new Date();
    const newStartDate = new Date(newEndDate.getFullYear(), newEndDate.getMonth() - 12, 1);

    const lastDayOfCurrentMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth() + 1, 0);

    const startDateFormatted = newStartDate.toISOString().split('T')[0];
    const endDateFormatted = lastDayOfCurrentMonth.toISOString().split('T')[0];


    setLocalStartDateCYTSucursales(startDateFormatted);
    setLocalEndDateCYTSucursales(endDateFormatted);
    dispatch(setFechaRangeTerapiasConsultasCYTSucursal({
      startDate: startDateFormatted,
      endDate: endDateFormatted
    }));
  };

  const handleDateResetCYTDoctores = () => {
    const newEndDate = new Date();
    const newStartDate = new Date(newEndDate.getFullYear(), newEndDate.getMonth() - 12, 1);

    const lastDayOfCurrentMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth() + 1, 0);

    const startDateFormatted = newStartDate.toISOString().split('T')[0];
    const endDateFormatted = lastDayOfCurrentMonth.toISOString().split('T')[0];


    setLocalStartDateCYTDoctores(startDateFormatted);
    setLocalEndDateCYTDoctores(endDateFormatted);
    dispatch(setFechaRangeTerapiasConsultasCYTDoctores({
      startDate: startDateFormatted,
      endDate: endDateFormatted
    }));
  };

  const handleChangeCYTSucursales = (value) => {
    setCYTSucursalFilter(value);
  };

  const handleChangeCYTDoctores = (value) => {
    setCYTDoctorFilter(value);
  };


  const CustomTooltipBarras = ({ active, payload, label }) => {
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

  const renderLegendCYTSucursales = () => (
    <div style={{ display: 'flex', gap: '0px', marginBottom: '15px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '15px', height: '15px', backgroundColor: '#6C5CE7', borderRadius: '3px' }}></div>
        <Checkbox
          checked={activeLinesCYTSucursales.includes("consultas")}
          onChange={(e) => handleCheckboxChangeCYTSucursales("consultas", e.target.checked)}
        >
          Consultas
        </Checkbox>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '15px', height: '15px', backgroundColor: '#00B894', borderRadius: '3px' }}></div>
        <Checkbox
          checked={activeLinesCYTSucursales.includes("terapia")}
          onChange={(e) => handleCheckboxChangeCYTSucursales("terapia", e.target.checked)}
        >
          Terapias
        </Checkbox>
      </div>
    </div>
  );

  const renderLegendCYTDoctores = () => (
    <div style={{ display: 'flex', gap: '0px', marginBottom: '15px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '15px', height: '15px', backgroundColor: '#6C5CE7', borderRadius: '3px' }}></div>
        <Checkbox
          checked={activeLinesCYTDoctores.includes("consultas")}
          onChange={(e) => handleCheckboxChangeCYTDoctores("consultas", e.target.checked)}
        >
          Consultas
        </Checkbox>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '15px', height: '15px', backgroundColor: '#00B894', borderRadius: '3px' }}></div>
        <Checkbox
          checked={activeLinesCYTDoctores.includes("terapia")}
          onChange={(e) => handleCheckboxChangeCYTDoctores("terapia", e.target.checked)}
        >
          Terapias
        </Checkbox>
      </div>
    </div>
  );

  const renderLinesCYTSucursales = () => {
    const lines = [];
    if (activeLinesCYTSucursales.includes("consultas")) {
      lines.push(<Bar dataKey="consultas" stackId="a" fill="#6C5CE7" barSize={70} />);
    }
    if (activeLinesCYTSucursales.includes("terapia")) {
      lines.push(<Bar dataKey="terapia" stackId="a" fill="#00B894" barSize={70} />);
    }
    return lines;
  };

  const renderLinesCYTDoctores = () => {
    const lines = [];
    if (activeLinesCYTDoctores.includes("consultas")) {
      lines.push(<Bar dataKey="consultas" stackId="a" fill="#6C5CE7" barSize={70} />);
    }
    if (activeLinesCYTDoctores.includes("terapia")) {
      lines.push(<Bar dataKey="terapia" stackId="a" fill="#00B894" barSize={70} />);
    }
    return lines;
  };


  return (
    <div style={{ width: "100%" }}>
      <Row justify="center">
        <Col xs={24} sm={24} md={22} lg={22} xl={20} xxl={18}>
          <div style={{ color: 'black', fontWeight: 'bold', fontSize: 16 }}>Reporteria de Consultas & Terapias</div>
      
            <Row gutter={[16, 16]}>
              <Col xxl={12} xl={12} md={12}>
                <div
                  style={{
                    background: 'white',
                    padding: '15px',
                    height: '600px',
                    borderRadius: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '15px',
                    position: 'relative'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute', background: 'orange', paddingLeft: '10px', paddingRight: '10px', paddingTop: '2px', paddingBottom: '2px',
                      bottom: '10px', right: '20px', fontSize: '10px', color: 'white', borderRadius: '8px'
                    }}
                  >
                    Sucursales
                  </div>
                  <Row gutter={[12, 12]} align="">
                    {/* DateRange: ocupa toda la fila en xs/sm, y ~60%-65% en md+ */}
                    <Col xs={24} sm={12} md={24} lg={12} xl={12} xxl={12}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <DateRangeSeparate
                          onApply={handleDateApplyCYTSucursales}
                          onReset={handleDateResetCYTSucursales}
                          isMonthPicker={true}
                        />
                      </div>
                    </Col>

                    {/* Filtro de sucursal: ocupa toda la fila en xs/sm, y el resto en md+ */}
                    <Col xs={24} sm={12} md={24} lg={12} xl={12} xxl={12}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
                        <label style={{ marginBottom: 4 }}>Filtrar por Sucursal:</label>
                        <Select
                          mode="multiple"
                          style={{ width: '100%' }}
                          width={'100%'}
                          placeholder="Selecciona la sucursal"
                          onChange={handleChangeCYTSucursales}
                          value={cytsucursalFilter || undefined}
                          allowClear
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            (option?.children || '').toString().toLowerCase().includes(input.toLowerCase())
                          }
                        >
                          {sucursales.map(sucursal => (
                            <Select.Option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                              {sucursal.nombre}
                            </Select.Option>
                          ))}
                        </Select>
                      </div>
                    </Col>
                  </Row>

                      
                  <div style={{ flex: 1 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={kpisTerapiasConsultasSucursales}
                        margin={{ top: 20, right: 50, left: 20, bottom: 80 }}
                        isAnimationActive={false}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 10, angle: -45, textAnchor: 'end' }}
                          interval={0}
                          tickFormatter={truncateXAxisCYTSucursales}
                        />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip content={<CustomTooltipBarras />} cursor={{ fill: 'transparent' }} /> {/* Sin fondo al hacer hover */}
                        <Legend
                          verticalAlign="top"
                          align="center"
                          content={renderLegendCYTSucursales}
                        />
                        {renderLinesCYTSucursales()}
                      
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ div>
              </Col>
              <Col xxl={12} xl={12} md={12}>
                <div
                  style={{
                    background: 'white',
                    padding: '15px',
                    height: '600px',
                    borderRadius: '15px',
                    marginTop: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}
                >
                
                  <div
                    style={{
                      position: 'absolute', background: 'orange', paddingLeft: '10px', paddingRight: '10px', paddingTop: '2px', paddingBottom: '2px',
                      bottom: '10px', right: '20px', fontSize: '10px', color: 'white', borderRadius: '8px'
                    }}
                  >
                    Doctores
                  </div>
                  <Row gutter={[12, 12]} align="">
                    {/* DateRange: ocupa toda la fila en xs/sm, y ~60%-65% en md+ */}
                    <Col xs={24} sm={12} md={24} lg={12} xl={12} xxl={12}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <DateRangeSeparate
                          onApply={handleDateApplyCYTDoctores}
                          onReset={handleDateResetCYTDoctores}
                          isMonthPicker={false}
                        />
                      </div>
                    </Col>

                    {/* Filtro de doctor: ocupa toda la fila en xs/sm, y el resto en md+ */}
                    <Col xs={24} sm={12} md={24} lg={12} xl={12} xxl={12}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        <label style={{ marginBottom: 4 }}>Filtrar por Doctor:</label>
                        <Select
                          mode="multiple"
                          style={{ width: '100%' }}
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
                          {doctores_activados.map(doctor => (
                            <Select.Option key={doctor.id_usuario} value={doctor.nombre}>
                              {doctor.nombre}
                            </Select.Option>
                          ))}
                        </Select>
                      </div>
                    </Col>
                  </Row>
                      
                  <div style={{ flex: 1, }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={kpisTerapiasConsultasDoctor}
                        margin={{ top: 20, right: 50, left: 20, bottom: 80 }}
                        isAnimationActive={false} // Desactiva la animación para hover
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 10, angle: -45, textAnchor: 'end' }}
                          interval={0}
                          tickFormatter={truncateXAxisCYTDoctores}
                        />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip content={<CustomTooltipBarras />} cursor={{ fill: 'transparent' }} /> {/* Sin fondo al hacer hover */}
                        <Legend
                          verticalAlign="top"
                          align="center"
                          content={renderLegendCYTDoctores}
                        />
                        {renderLinesCYTDoctores()}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Col>
            </Row>
        
          <Divider />


          <KpisConsultasTerapiasDoctores
            doctores_activados={doctores_activados}
          />

          {/* 
          <Divider />
          
          <KpisConsultasTerapiasSucursales
            sucursales = {sucursales}
          /> */}
        </Col>
      </Row>
    </div>



  )

}

export default VerKpisConsultasYTerapias;