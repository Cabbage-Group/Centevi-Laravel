import React, { useEffect, useState } from "react";
import DateRangeSeparate from "../../../reportes/DateRange";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Col, Row, Select, Dropdown, Button, Input, Space  } from 'antd';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, } from 'recharts';
import { fetchKpisConsultasPorDoctores, fetchKpisTerapiasPorDoctores, setFechaRangeConsultasPorDoctores, setFechaRangeTerapiasPorDoctores } from "../../../../redux/features/kpis/kpisConsultasTerapias/kpisConsultasTerapiasSlice";
import { DownOutlined } from '@ant-design/icons';

const KpisConsultasTerapiasDoctores = (
  { doctores_activados }
) => {


  const dispatch = useDispatch();
  const {
    kpisConsultasPorDoctores,
    kpisTerapiasPorDoctores
  } = useSelector((state) => state.kpisConsultasTerapias)


  const [localStartDateConsultasPorDoctores, setLocalStartDateConsultasPorDoctores] = useState();
  const [localEndDateConsultasPorDoctores, setLocalEndDateConsultasPorDoctores] = useState();
  const [activeLinesConsultasPorDoctores, setActiveLinesConsultasPorDoctores] = useState([]);
  const [consultasFilter, setConsultasFilter] = useState([]);

  const [localStartDateTerapiasPorDoctores, setLocalStartDateTerapiasPorDoctores] = useState();
  const [localEndDateTerapiasPorDoctores, setLocalEndDateTerapiasPorDoctores] = useState();
  const [activeLinesTerapiasPorDoctores, setActiveLinesTerapiasPorDoctores] = useState([]);
  const [terapiasFilter, setTerapiasFilter] = useState([]);
  // Dropdown
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (doctores_activados?.length > 0) {
      setActiveLinesConsultasPorDoctores(doctores_activados.map((doctor) => doctor.id_usuario));
      setActiveLinesTerapiasPorDoctores(doctores_activados.map((doctor) => doctor.id_usuario))
    }
  }, [doctores_activados]);

  useEffect(() => {
    dispatch(fetchKpisConsultasPorDoctores({
      startDate: localStartDateConsultasPorDoctores,
      endDate: localEndDateConsultasPorDoctores,
      consultas: consultasFilter
    }));

  }, [localStartDateConsultasPorDoctores, localEndDateConsultasPorDoctores, consultasFilter]);

  useEffect(() => {
    dispatch(fetchKpisTerapiasPorDoctores({
      startDate: localStartDateTerapiasPorDoctores,
      endDate: localEndDateTerapiasPorDoctores,
      terapias: terapiasFilter
    }));
  }, [localStartDateTerapiasPorDoctores, localEndDateTerapiasPorDoctores, terapiasFilter]);


  const handleDateApplyConsultasPorDoctores = (newStartDate, newEndDate) => {
    setLocalStartDateConsultasPorDoctores(newStartDate);
    setLocalEndDateConsultasPorDoctores(newEndDate);
    dispatch(setFechaRangeConsultasPorDoctores({ startDate: newStartDate, endDate: newEndDate }));
  };

  const handleCheckboxChangeConsultasPorDoctores = (id, checked) => {
    setActiveLinesConsultasPorDoctores((prev) =>
      checked ? [...prev, id] : prev.filter((doctorId) => doctorId !== id)
    );
  };

  const handleDateResetConsultasPorDoctores = () => {
    const newEndDate = new Date();
    const newStartDate = new Date(newEndDate.getFullYear(), newEndDate.getMonth() - 12, 1);

    const lastDayOfCurrentMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth() + 1, 0);

    const startDateFormatted = newStartDate.toISOString().split('T')[0];
    const endDateFormatted = lastDayOfCurrentMonth.toISOString().split('T')[0];


    setLocalStartDateConsultasPorDoctores(startDateFormatted);
    setLocalEndDateConsultasPorDoctores(endDateFormatted);
    dispatch(setFechaRangeConsultasPorDoctores({
      startDate: startDateFormatted,
      endDate: endDateFormatted
    }));
  };

  const handleDateApplyTerapiasPorDoctores = (newStartDate, newEndDate) => {
    setLocalStartDateTerapiasPorDoctores(newStartDate);
    setLocalEndDateTerapiasPorDoctores(newEndDate);
    dispatch(setFechaRangeTerapiasPorDoctores({ startDate: newStartDate, endDate: newEndDate }));
  };

  const handleCheckboxChangeTerapiasPorDoctores = (id, checked) => {
    setActiveLinesTerapiasPorDoctores((prev) =>
      checked ? [...prev, id] : prev.filter((doctorId) => doctorId !== id)
    );
  };


  const handleDateResetTerapiasPorDoctores = () => {
    const newEndDate = new Date();
    const newStartDate = new Date(newEndDate.getFullYear(), newEndDate.getMonth() - 12, 1);

    const lastDayOfCurrentMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth() + 1, 0);

    const startDateFormatted = newStartDate.toISOString().split('T')[0];
    const endDateFormatted = lastDayOfCurrentMonth.toISOString().split('T')[0];


    setLocalStartDateTerapiasPorDoctores(startDateFormatted);
    setLocalEndDateTerapiasPorDoctores(endDateFormatted);
    dispatch(setFechaRangeTerapiasPorDoctores({
      startDate: startDateFormatted,
      endDate: endDateFormatted
    }));
  };

  const truncateXAxisConsultasPorDoctores = (value) => {
    return value.length > 10 ? value.substring(0, 10) + "..." : value;
  };

  const truncateXAxisTerapiasPorDoctores = (value) => {
    return value.length > 10 ? value.substring(0, 10) + "..." : value;
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

  const renderLegendConsultasPorDoctores = () => (
    <div style={{ display: 'flex', gap: '0px', marginBottom: '15px' }}>
      {doctores_activados?.map((doctor) => (
        <div key={doctor.id_usuario} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '15px',
              height: '15px',
              backgroundColor: '#6C5CE7',
              borderRadius: '3px',
            }}
          ></div>
          <Checkbox
            checked={activeLinesConsultasPorDoctores.includes(doctor.id_usuario)}
            onChange={(e) => handleCheckboxChangeConsultasPorDoctores(doctor.id_usuario, e.target.checked)}
          >
            {doctor.nombre}
          </Checkbox>
        </div>
      ))}
    </div>
  );

  const renderLinesConsultasPorDoctores = () => {
    const lines = [];

    const doctorColors = [
      "#FF6347",
      "#FF9800",
      "#4CAF50",
      "#2196F3",
      "#9C27B0",
      "#00B894",
      "#F39C12",
    ];

    {
      doctores_activados?.length > 0
        ? doctores_activados.forEach((doctor, index) => {
          if (activeLinesConsultasPorDoctores.includes(doctor.id_usuario)) {
            const doctorColor = doctorColors[index % doctorColors.length];
            lines.push(
              <Bar
                key={doctor.id_usuario}
                dataKey={doctor.nombre}
                stackId="a"
                fill={doctorColor}
                barSize={70}
              />
            );
          }
        })
        : null
    }


    return lines;
  };

  const renderLegendTerapiasPorDoctores = () => (
    <div style={{
      display: 'block',
      marginBottom: '15px',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
      paddingBottom: '6px'
    }}>
      <div style={{ display: 'inline-flex', gap: '12px' }}>
        {doctores_activados?.map((doctor) => (
          <div key={doctor.id_usuario} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#6C5CE7', borderRadius: '3px' }} />
            <Checkbox
              checked={activeLinesTerapiasPorDoctores.includes(doctor.id_usuario)}
              onChange={(e) => handleCheckboxChangeTerapiasPorDoctores(doctor.id_usuario, e.target.checked)}
            >
              <span style={{ display: 'inline-block', verticalAlign: 'middle', maxWidth: 120, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {doctor.nombre}
              </span>
            </Checkbox>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLinesTerapiasPorDoctores = () => {
    const lines = [];

    const doctorColors = [
      "#FF6347",
      "#FF9800",
      "#4CAF50",
      "#2196F3",
      "#9C27B0",
      "#00B894",
      "#F39C12",
    ];

    if (doctores_activados && doctores_activados.lenght > 0) {
      doctores_activados?.forEach((doctor, index) => {
        if (activeLinesTerapiasPorDoctores.includes(doctor.id_usuario)) {
          const doctorColor = doctorColors[index % doctorColors.length];
          lines.push(
            <Bar
              key={doctor.id_usuario}
              dataKey={doctor.nombre}
              stackId="a"
              fill={doctorColor}
              // barSize={70}
              barSize={40}
            />
          );
        }
      });
    }


    return lines;
  };

  // nuevo menu para doctores
  const { Search } = Input;
  const filteredDoctors = (doctores_activados || []).filter(d =>
    !searchTerm || d.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const dropdownOverlay = (
    <div style={{ padding: 12, width: 320, backgroundColor:"white" }} onClick={(e) => e.stopPropagation()}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Search placeholder="Buscar doctor" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} allowClear />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button size="small" onClick={() => setActiveLinesTerapiasPorDoctores((doctores_activados || []).map(d => d.id_usuario))}>Seleccionar todos</Button>
          <Button size="small" onClick={() => setActiveLinesTerapiasPorDoctores([])}>Limpiar</Button>
        </div>
        <div style={{ maxHeight: 260, overflowY: 'auto', paddingTop: 6 }}>
          <Checkbox.Group value={activeLinesTerapiasPorDoctores} onChange={(vals) => setActiveLinesTerapiasPorDoctores(vals)} style={{ width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {filteredDoctors.map(d => (
                <Checkbox key={d.id_usuario} value={d.id_usuario}>{d.nombre}</Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </div>
      </Space>
    </div>
  );


  const handleChangeConsultas = (value) => {
    setConsultasFilter(value);
  };

  const handleChangeTerapias = (value) => {
    setTerapiasFilter(value);
  };

  const opcionesConsultas = [
    { label: 'Baja Visión', value: 'baja_vision' },
    { label: 'Consulta Generica', value: 'consulta_generica' },
    { label: 'Optometria Neonatos', value: 'optometria_neonatos' },
    { label: 'Refraccion General', value: 'refraccion_general' },
    { label: 'Ortoptica Adultos', value: 'ortoptica_adultos' },
    { label: 'Optometria Pediatrica', value: 'optometria_pediatrica' },
  ];

  const opcionesTerapias = [
    { label: 'Terapia Baja Visión', value: 'terapia_baja_vision' },
    { label: 'Terapia Optometria Neonatos', value: 'terapia_optometria_neonatos' },
    { label: 'Terapia Ortoptica Adultos', value: 'terapia_ortoptica_adultos' },
    { label: 'Terapia Optometria Pediatrica', value: 'terapia_optometria_pediatrica' },
  ];



  return (
    <div style={{width: '100%'}}>
      <div style={{ color: 'black', fontWeight: 'bold', fontSize: 16 }}>
        Reporteria de Terapias de doctores
      </div>
      <div
        style={{
          background: 'white',
          padding: '15px',
          height: '600px',
          borderRadius: '15px',
          marginTop: '15px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Row gutter={[16, 16]} width={'100%'}>
          <Col>

              <Row gutter={[12, 12]} align="">
                <Col xs={24} sm={12} md={24} lg={12} xl={12} xxl={12}>
                  <DateRangeSeparate
                    onApply={handleDateApplyTerapiasPorDoctores}
                    onReset={handleDateResetTerapiasPorDoctores}
                    isMonthPicker={true}
                  />
                </Col>

                <Col xs={24} sm={12} md={24} lg={12} xl={12} xxl={12}>
                  <label>Filtrar por Terapias:</label>
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    width={'100%'}
                    placeholder="Selecciona las terapias"
                    onChange={handleChangeTerapias}
                    value={terapiasFilter || undefined}
                    allowClear
                    direction="vertical"
                    options={opcionesTerapias}
                  >
                  </Select>
                </Col>
              </Row>
              <Row >
                <Col style={{marginBottom: '6px', marginTop: '12px'}}>
                  <Dropdown overlay={dropdownOverlay} trigger={['click']} placement="bottomRight">
                    <Button>
                      Filtrar doctores <DownOutlined />
                    </Button>
                  </Dropdown>
                </Col>
              </Row>



          </Col>
        </Row>

        <Row style={{width: '100%', height: '100%'}}>
          <Col style={{width: '100%', height: '100%'}}>
            <div style={{ flex: 1, width: '100%', height: '100%'}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={kpisTerapiasPorDoctores}
                  margin={{ top: 20, right: 50, left: 20, bottom: 80 }}
                  isAnimationActive={false}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, angle: -45, textAnchor: 'end' }}
                    interval={0}
                    tickFormatter={truncateXAxisTerapiasPorDoctores}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltipBarras />} cursor={{ fill: 'transparent' }} />
                  {/* <Legend
                    verticalAlign="top"
                    align="center"
                    content={renderLegendTerapiasPorDoctores}
                  /> */}

                  {renderLinesTerapiasPorDoctores()}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Col>
        </Row>
        
      </div >
    </div>
  );
};

export default KpisConsultasTerapiasDoctores;