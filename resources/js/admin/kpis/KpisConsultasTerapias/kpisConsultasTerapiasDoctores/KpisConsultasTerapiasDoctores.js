import React, { useEffect, useState } from "react";
import DateRangeSeparate from "../../../reportes/DateRange";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Col, Row, Select } from 'antd';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, } from 'recharts';
import { fetchKpisConsultasPorDoctores, fetchKpisTerapiasPorDoctores, setFechaRangeConsultasPorDoctores, setFechaRangeTerapiasPorDoctores } from "../../../../redux/features/kpis/kpisConsultasTerapias/kpisConsultasTerapiasSlice";

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
            checked={activeLinesTerapiasPorDoctores.includes(doctor.id_usuario)}
            onChange={(e) => handleCheckboxChangeTerapiasPorDoctores(doctor.id_usuario, e.target.checked)}
          >
            {doctor.nombre}
          </Checkbox>
        </div>
      ))}
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
              barSize={70}
            />
          );
        }
      });
    }


    return lines;
  };


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
    <div>

      <Row gutter={[16, 16]}>

        {/* <Col xxl={12} xl={12} md={12}>
          <div style={{ color: 'black', fontWeight: 'bold' }}>Reporteria de Consultas de doctores</div>
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <DateRangeSeparate
                onApply={handleDateApplyConsultasPorDoctores}
                onReset={handleDateResetConsultasPorDoctores}
                isMonthPicker={true}
              />
              <div
                style={{
                  display: "flex", flexDirection: "column", marginTop: '-32px',
                  borderLeft: '1px solid gray',
                  paddingLeft: '12px'
                }}
              >
                <label>Filtrar por Consultas:</label>
                <Select
                  mode="multiple"
                  style={{ width: '200px' }}
                  placeholder="Selecciona las consultas"
                  onChange={handleChangeConsultas}
                  value={consultasFilter || undefined}
                  allowClear
                  direction="vertical"
                  options={opcionesConsultas}
                >
                </Select>
              </div>
            </div>

            <div style={{ flex: 1, }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={kpisConsultasPorDoctores}
                  margin={{ top: 20, right: 50, left: 20, bottom: 80 }}
                  isAnimationActive={false}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, angle: -45, textAnchor: 'end' }}
                    interval={0}
                    tickFormatter={truncateXAxisConsultasPorDoctores}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltipBarras />} cursor={{ fill: 'transparent' }} />
                  <Legend
                    verticalAlign="top"
                    align="center"
                    content={renderLegendConsultasPorDoctores}
                  />
                  {renderLinesConsultasPorDoctores()}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div >
        </Col> */}


        <Col xxl={12} xl={12} md={12}>
          <div style={{ color: 'black', fontWeight: 'bold' }}>Reporteria de Terapias de doctores</div>
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <DateRangeSeparate
                onApply={handleDateApplyTerapiasPorDoctores}
                onReset={handleDateResetTerapiasPorDoctores}
                isMonthPicker={true}
              />
              <div
                style={{
                  display: "flex", flexDirection: "column", marginTop: '-32px',
                  borderLeft: '1px solid gray',
                  paddingLeft: '12px'
                }}
              >

                <label>Filtrar por Terapias:</label>
                <Select
                  mode="multiple"
                  style={{ width: '200px' }}
                  placeholder="Selecciona las terapias"
                  onChange={handleChangeTerapias}
                  value={terapiasFilter || undefined}
                  allowClear
                  direction="vertical"
                  options={opcionesTerapias}
                >
                </Select>
              </div>
            </div>

            <div style={{ flex: 1, }}>
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
                  <Legend
                    verticalAlign="top"
                    align="center"
                    content={renderLegendTerapiasPorDoctores}
                  />
                  {renderLinesTerapiasPorDoctores()}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div >
        </Col>
      </Row>



    </div>
  );
};

export default KpisConsultasTerapiasDoctores;