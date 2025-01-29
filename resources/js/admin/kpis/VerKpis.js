import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchKpis, fetchKpisAsesores, fetchKpisAsesoresFases, fetchKpisAsesoresOrdenes, fetchKpisAsesoresStatus, fetchKpisDoctores, fetchKpisDoctoresFases, fetchKpisDoctoresOrdenes, fetchKpisDoctoresStatus, setFechaRange, setFechaRangeAsesores, setFechaRangeDoctores } from '../../redux/features/kpis/kpisSlice';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice';
import DateRangeSeparate from '../reportes/DateRange';
import { Checkbox, Select, Radio, Row, Col } from 'antd';
import { fetchUsuarios } from '../../redux/features/usuarios/usuariosSlice';

const VerKpis = () => {
  const colors = [
    '#FF5733',
    '#33FF57',
    '#3357FF',
    '#F39C12',
    '#8E44AD',
    '#1ABC9C',
    '#E74C3C',
    '#34495E',
  ];

  const data = [
    { name: "Group A", value: 16 },
    { name: "Group B", value: 4 },

  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];


  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const dispatch = useDispatch();
  const {
    kpis,
    kpisAsesores,
    kpisDoctores,
    kpisDoctoresOrdenes,
    kpisDoctoresFases,
    kpisDoctoresStatus,
    kpisAsesoresOrdenes,
    kpisAsesoresFases,
    kpisAsesoresStatus,
    startDate,
    endDate,
    startDateAsesores,
    endDateAsesores,
    statusDoctoresStatus,
    statusDoctoresFases 
  } = useSelector((state) => state.kpis);
  const { sucursales } = useSelector((state) => state.sucursales);
  const {
    usuarios_doctores_options_selecteds,
    doctores_activados,
    usuarios_activados,
    asesores_activados } = useSelector((state) => state.usuarios);

  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [localStartDateAsesores, setLocalStartDateAsesores] = useState(startDateAsesores);
  const [localEndDateAsesores, setLocalEndDateAsesores] = useState(endDateAsesores);
  const [localStartDateDoctores, setLocalStartDateDoctores] = useState();
  const [localEndDateDoctores, setLocalEndDateDoctores] = useState();
  const [activeLines, setActiveLines] = useState([]);
  const [activeLinesUsuarios, setActiveLinesUsuarios] = useState([]);
  const [activeLinesDoctores, setActiveLinesDoctores] = useState([]);
  const [lenteContactoFilter, setLenteContactoFilter] = useState([]);
  const [lenteContactoFilterAsesores, setLenteContactoFilterAsesores] = useState([]);
  const [lenteContactoFilterDoctores, setLenteContactoFilterDoctores] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedAsesor, setSelectedAsesor] = useState(null);

  const chunkSize = 4;
  const doctorChunks = [];
  const asesoresChunk = [];
  for (let i = 0; i < doctores_activados.length; i += chunkSize) {
    doctorChunks.push(doctores_activados.slice(i, i + chunkSize));
  }
  for (let i = 0; i < asesores_activados.length; i += chunkSize) {
    asesoresChunk.push(asesores_activados.slice(i, i + chunkSize));
  }

  const handleLenteContactoChange = (value) => {
    setLenteContactoFilter(value);
  };

  const handleLenteContactoChangeAsesores = (value) => {
    setLenteContactoFilterAsesores(value);
  };

  const handleLenteContactoChangeDoctores = (value) => {
    setLenteContactoFilterDoctores(value);
  };

  const handleSelectAll = () => {
    const allIds = sucursales.map(sucursal => sucursal.id_sucursal);
    setActiveLines(allIds);
  };

  const handleDeselectAll = () => {
    setActiveLines([]);
  };

  const handleSelectAllAsesores = () => {
    const allIds = usuarios_activados.map(usuario => usuario.id_usuario);
    setActiveLinesUsuarios(allIds);
  };

  const handleDeselectAllAsesores = () => {
    setActiveLinesUsuarios([]);
  };

  const handleSelectAllDoctores = () => {
    const allIds = usuarios_doctores_options_selecteds.map(doctor => doctor.value);
    setActiveLinesDoctores(allIds);
  };

  const handleDeselectAllDoctores = () => {
    setActiveLinesDoctores([]);
  };

  const handleDateApply = (newStartDate, newEndDate) => {
    setLocalStartDate(newStartDate);
    setLocalEndDate(newEndDate);

    dispatch(setFechaRange({ startDate: newStartDate, endDate: newEndDate }));
  };

  const handleDateReset = () => {
    setLocalStartDate(null);
    setLocalEndDate(null);

    dispatch(setFechaRange({ startDate: null, endDate: null }));
  };

  const handleDateApplyDoctores = (newStartDate, newEndDate) => {
    setLocalStartDateDoctores(newStartDate);
    setLocalEndDateDoctores(newEndDate);

    dispatch(setFechaRangeDoctores({ startDate: newStartDate, endDate: newEndDate }));
  };

  const handleDateResetDoctores = () => {
    setLocalStartDateDoctores(null);
    setLocalEndDateDoctores(null);

    dispatch(setFechaRangeDoctores({ startDate: null, endDate: null }));
  };

  const handleDateApplyAsesores = (newStartDate, newEndDate) => {
    setLocalStartDateAsesores(newStartDate);
    setLocalEndDateAsesores(newEndDate);

    dispatch(setFechaRangeAsesores({ startDate: newStartDate, endDate: newEndDate }));
  };

  const handleDateResetAsesores = () => {
    setLocalStartDateAsesores(null);
    setLocalEndDateAsesores(null);

    dispatch(setFechaRangeAsesores({ startDate: null, endDate: null }));
  };

  useEffect(() => {
    if (doctores_activados.length > 0 && !selectedDoctor) {
      setSelectedDoctor(doctores_activados[0].id_usuario);
    }
  }, [doctores_activados, selectedDoctor]);

  useEffect(() => {
    if (asesores_activados.length > 0 && !selectedAsesor) {
      setSelectedAsesor(asesores_activados[0].id_usuario);
    }
  }, [asesores_activados, selectedAsesor]);


  useEffect(() => {
    if (selectedDoctor) {
      dispatch(fetchKpisDoctoresOrdenes(selectedDoctor));
      dispatch(fetchKpisDoctoresFases(selectedDoctor));
      dispatch(fetchKpisDoctoresStatus(selectedDoctor));
    }
  }, [selectedDoctor, dispatch]);




  useEffect(() => {
    if (selectedAsesor) {
      dispatch(fetchKpisAsesoresOrdenes(selectedAsesor));
      dispatch(fetchKpisAsesoresFases(selectedAsesor));
      dispatch(fetchKpisAsesoresStatus(selectedAsesor));
    }
  }, [selectedAsesor, dispatch]);


  useEffect(() => {
    dispatch(fetchKpis({ startDate: localStartDate, endDate: localEndDate, lenteContacto: lenteContactoFilter }));
  }, [dispatch, localStartDate, localEndDate, lenteContactoFilter]);

  useEffect(() => {
    dispatch(fetchKpisAsesores({ startDate: localStartDateAsesores, endDate: localEndDateAsesores, lenteContacto: lenteContactoFilterAsesores }));
  }, [dispatch, localStartDateAsesores, localEndDateAsesores, lenteContactoFilterAsesores]);

  useEffect(() => {
    dispatch(fetchKpisDoctores({ startDate: localStartDateDoctores, endDate: localEndDateDoctores, lenteContacto: lenteContactoFilterDoctores }));
  }, [dispatch, localStartDateDoctores, localEndDateDoctores, lenteContactoFilterDoctores]);

  useEffect(() => {
    dispatch(fetchSucursales({}));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUsuarios({}));
  }, [dispatch]);

  useEffect(() => {
    if (sucursales.length > 0) {
      setActiveLines(sucursales.map(sucursal => sucursal.id_sucursal));
    }
  }, [sucursales]);

  useEffect(() => {
    if (usuarios_activados.length > 0) {
      setActiveLinesUsuarios(usuarios_activados.map(usuario => usuario.id_usuario));
    }
  }, [usuarios_activados]);

  useEffect(() => {
    if (usuarios_doctores_options_selecteds.length > 0) {
      setActiveLinesDoctores(usuarios_doctores_options_selecteds.map(doctor => doctor.value));
    }
  }, [usuarios_doctores_options_selecteds]);

  const renderLines = () => {
    return sucursales.map((sucursal, index) => {
      const lineColor = colors[index % colors.length];
      if (activeLines.includes(sucursal.id_sucursal)) {
        return (
          <Line
            key={sucursal.id_sucursal}
            type="monotone"
            dataKey={sucursal.nombre}
            stroke={lineColor}
            strokeWidth={2}
          />
        );
      }
      return null;
    });
  };

  const renderLinesDoctores = () => {
    return usuarios_doctores_options_selecteds.map((doctor, index) => {
      const lineColor = colors[index % colors.length];
      if (activeLinesDoctores.includes(doctor.value)) {
        return (
          <Line
            key={doctor.value}
            type="monotone"
            dataKey={doctor.label}
            stroke={lineColor}
            strokeWidth={2}
          />
        );
      }
      return null;
    });
  };

  const renderLinesAsesores = () => {
    return usuarios_activados.map((usuario, index) => {
      const lineColor = colors[index % colors.length];
      if (activeLinesUsuarios.includes(usuario.id_usuario)) {
        return (
          <Line
            key={usuario.id_sucursal}
            type="monotone"
            dataKey={usuario.nombre}
            stroke={lineColor}
            strokeWidth={2}
          />
        );
      }
      return null;
    });
  };



  const handleCheckboxChange = (sucursalId, checked) => {
    setActiveLines(prevState => {
      if (checked) {
        return [...prevState, sucursalId];
      } else {
        return prevState.filter(id => id !== sucursalId);
      }
    });
  };

  const handleCheckboxChangeDoctores = (doctorId, checked) => {
    setActiveLinesDoctores(prevState => {
      if (checked) {
        return [...prevState, doctorId];
      } else {
        return prevState.filter(id => id !== doctorId);
      }
    });
  };

  const handleCheckboxChangeUsuarios = (usuarioId, checked) => {
    setActiveLinesUsuarios(prevState => {
      if (checked) {
        return [...prevState, usuarioId];
      } else {
        return prevState.filter(id => id !== usuarioId);
      }
    });
  };

  const renderLegend = () => {
    // Dividir las sucursales en bloques de 9 elementos
    const chunkedSucursales = [];
    for (let i = 0; i < sucursales.length; i += 12) {
      chunkedSucursales.push(sucursales.slice(i, i + 12));
    }
    return (
      <div style={{ display: 'flex', gap: '20px' }}>
        {chunkedSucursales.map((chunk, chunkIndex) => (
          <div key={chunkIndex} style={{
            display: 'flex',
            flexDirection: 'column', // Asegura que los elementos estén en columnas
            gap: '8px',
          }}>
            {chunk.map((sucursal, index) => {
              const lineColor = colors[(chunkIndex * 12 + index) % colors.length];
              return (
                <div key={sucursal.id_sucursal} style={{ display: 'flex', alignItems: 'center', marginLeft: '40px' }}>
                  <Checkbox
                    checked={activeLines.includes(sucursal.id_sucursal)}
                    onChange={(e) => handleCheckboxChange(sucursal.id_sucursal, e.target.checked)}
                    style={{ marginRight: '5px' }}
                  />
                  <span
                    style={{ color: lineColor, fontSize: '12px', width: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    title={sucursal.nombre} // Muestra el nombre completo cuando se pasa el mouse
                  >
                    {sucursal.nombre}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };



  const renderLegendDoctores = () => {
    // Dividir los doctores en columnas de 7 elementos
    const chunkedDoctores = [];
    for (let i = 0; i < usuarios_doctores_options_selecteds.length; i += 12) {
      chunkedDoctores.push(usuarios_doctores_options_selecteds.slice(i, i + 12));
    }

    return (
      <div style={{ display: 'flex', gap: '20px' }}>
        {chunkedDoctores.map((chunk, chunkIndex) => (
          <div key={chunkIndex} style={{
            display: 'flex',
            flexDirection: 'column', // Asegura que los elementos estén en columnas
            gap: '8px',
          }}>
            {chunk.map((doctor, index) => {
              const lineColor = colors[(chunkIndex * 12 + index) % colors.length];
              return (
                <div key={doctor.value} style={{ display: 'flex', alignItems: 'center', marginLeft: '40px' }}>
                  <Checkbox
                    checked={activeLinesDoctores.includes(doctor.value)}
                    onChange={(e) => handleCheckboxChangeDoctores(doctor.value, e.target.checked)}
                    style={{ marginRight: '5px' }}
                  />
                  <span
                    style={{
                      color: lineColor,
                      fontSize: '12px',
                      width: '150px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={doctor.label} // Muestra el nombre completo cuando se pasa el mouse
                  >
                    {doctor.label}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };




  const renderLegendAsesores = () => {
    // Dividir los asesores en columnas de 7 elementos
    const chunkedUsuarios = [];
    for (let i = 0; i < usuarios_activados.length; i += 10) {
      chunkedUsuarios.push(usuarios_activados.slice(i, i + 10));
    }

    return (
      <div style={{ display: 'flex', gap: '20px' }}>
        {chunkedUsuarios.map((chunk, chunkIndex) => (
          <div key={chunkIndex} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {chunk.map((usuario, index) => {
              const lineColor = colors[(chunkIndex * 10 + index) % colors.length];
              return (
                <div key={usuario.id_usuario} style={{ display: 'flex', alignItems: 'center', marginLeft: '40px' }}>
                  <Checkbox
                    checked={activeLinesUsuarios.includes(usuario.id_usuario)}
                    onChange={(e) => handleCheckboxChangeUsuarios(usuario.id_usuario, e.target.checked)}
                    style={{ marginRight: '5px' }}
                  />
                  <span
                    style={{
                      color: lineColor,
                      fontSize: '12px',
                      width: '150px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={usuario.nombre} // Muestra el nombre completo cuando se pasa el mouse
                  >
                    {usuario.nombre}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: '#fff', padding: 10, border: '1px solid #ccc' }}>
          <p>{label}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px' }}>
            {payload.map((entry, index) => (
              <div key={index} style={{ color: entry.color }}>
                <strong>{entry.name}:</strong> {entry.value}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const buttonStyle = (color) => ({
    backgroundColor: color === 'green' ? '#4CAF50' : '#F44336',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    outline: 'none',
  });
  
  return (
    <div>
      <ResponsiveContainer width="100%" height={300} >
        <label>
          Buscar por Fecha Sucursales:
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

          <DateRangeSeparate onApply={handleDateApply} onReset={handleDateReset} />
          <div style={{ display: "flex", flexDirection: "column", marginTop: '-32px' }}>
            <label>
              Filtrar por Tipo de Lente:
            </label>
            <Select
              mode="multiple"
              style={{ width: '200px' }}
              placeholder="Selecciona el tipo de lente"
              onChange={handleLenteContactoChange}
              value={lenteContactoFilter || undefined}
              allowClear
            >
              <Select.Option value="1">
                <img
                  src="assets/img/recetas/lentesdecontacto.png"
                  alt="Lente On"
                  style={{ width: '20px', height: '20px', marginRight: '5px' }}
                />
                Lente de Contacto
              </Select.Option>
              <Select.Option value="0">
                <img
                  src="assets/img/recetas/lentenormal.png"
                  alt="Lente Off"
                  style={{ width: '20px', height: '20px', marginRight: '5px' }}
                />
                Lente Normal
              </Select.Option>
            </Select>
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "15px", marginTop: '-32px' }}>
            <button
              onClick={handleSelectAll}
              style={buttonStyle('green')}
            >
              Seleccionar Todo
            </button>
            <button
              onClick={handleDeselectAll}
              style={buttonStyle('red')}
            >
              Deseleccionar Todo
            </button>
          </div>
        </div>
        <LineChart
          data={kpis}
          margin={{ top: 20, right: 120, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={customTooltip} />
          <Legend
            content={renderLegend}
            align="right"
            verticalAlign="middle"
            layout="vertical"
          />
          {renderLines()}
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={300} style={{ marginTop: '100px' }}>
        <label>
          Buscar por Fecha Asesores:
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

          <DateRangeSeparate onApply={handleDateApplyAsesores} onReset={handleDateResetAsesores} />
          <div style={{ display: "flex", flexDirection: "column", marginTop: '-32px' }}>
            <label>
              Filtrar por Tipo de Lente Asesores:
            </label>
            <Select
              mode="multiple"
              style={{ width: '200px' }}
              placeholder="Selecciona el tipo de lente"
              onChange={handleLenteContactoChangeAsesores}
              value={lenteContactoFilterAsesores || undefined}
              allowClear
            >
              <Select.Option value="1">
                <img
                  src="assets/img/recetas/lentesdecontacto.png"
                  alt="Lente On"
                  style={{ width: '20px', height: '20px', marginRight: '5px' }}
                />
                Lente de Contacto
              </Select.Option>
              <Select.Option value="0">
                <img
                  src="assets/img/recetas/lentenormal.png"
                  alt="Lente Off"
                  style={{ width: '20px', height: '20px', marginRight: '5px' }}
                />
                Lente Normal
              </Select.Option>
            </Select>
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "15px", marginTop: '-32px' }}>
            <button
              onClick={handleSelectAllAsesores}
              style={buttonStyle('green')}
            >
              Seleccionar Todo
            </button>
            <button
              onClick={handleDeselectAllAsesores}
              style={buttonStyle('red')}
            >
              Deseleccionar Todo
            </button>
          </div>
        </div>
        <LineChart
          data={kpisAsesores}
          margin={{ top: 20, right: 120, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={customTooltip} />
          <Legend
            content={renderLegendAsesores}
            align="right"
            verticalAlign="middle"
            layout="vertical"
          />
          {renderLinesAsesores()}
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={300} style={{ marginTop: '100px' }} >
        <label >
          Buscar por Fecha Doctores:
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

          <DateRangeSeparate onApply={handleDateApplyDoctores} onReset={handleDateResetDoctores} />
          <div style={{ display: "flex", flexDirection: "column", marginTop: '-32px' }}>
            <label>
              Filtrar por Tipo de Lente Doctores:
            </label>

            <Select
              mode="multiple"
              style={{ width: '200px' }}
              placeholder="Selecciona el tipo de lente"
              onChange={handleLenteContactoChangeDoctores}
              value={lenteContactoFilterDoctores || undefined}
              allowClear
            >
              <Select.Option value="1">
                <img
                  src="assets/img/recetas/lentesdecontacto.png"
                  alt="Lente On"
                  style={{ width: '20px', height: '20px', marginRight: '5px' }}
                />
                Lente de Contacto
              </Select.Option>
              <Select.Option value="0">
                <img
                  src="assets/img/recetas/lentenormal.png"
                  alt="Lente Off"
                  style={{ width: '20px', height: '20px', marginRight: '5px' }}
                />
                Lente Normal
              </Select.Option>
            </Select>

          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "15px", marginTop: '-32px' }}>
            <button
              onClick={handleSelectAllDoctores}
              style={buttonStyle('green')}
            >
              Seleccionar Todo
            </button>
            <button
              onClick={handleDeselectAllDoctores}
              style={buttonStyle('red')}
            >
              Deseleccionar Todo
            </button>
          </div>
        </div>
        <LineChart
          data={kpisDoctores}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={customTooltip} />
          <Legend
            content={renderLegendDoctores}
            align="right"
            verticalAlign="middle"
            layout="vertical"
          />
          {renderLinesDoctores()}
        </LineChart>
      </ResponsiveContainer>
      <div>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '60px' }}>Gráfico por Doctores</h2>
        <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
  
          <div style={{ display: 'flex', gap: '20px', flex: 4 }}>
            {[{ data: kpisDoctoresOrdenes, selected: selectedDoctor, setSelected: setSelectedDoctor },
            { data: kpisDoctoresFases, selected: selectedDoctor, setSelected: setSelectedDoctor },
            { data: kpisDoctoresStatus, selected: selectedDoctor, setSelected: setSelectedDoctor }].map((item, index) => (
              <div key={index} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
               
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={item.data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {item.data.map((entry, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                
              </div>
              
            ))}
          </div>
       

          {/* Radio Group fuera de la iteración */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Radio.Group onChange={(e) => setSelectedDoctor(e.target.value)} value={selectedDoctor}>
              <Row gutter={[16, 16]}>
                {doctorChunks.map((group, colIndex) => (
                  <Col key={colIndex}>
                    {group.map((doctor) => (
                      <Radio key={doctor.id_usuario} value={doctor.id_usuario} style={{ display: 'block' }}>
                        {doctor.nombre}
                      </Radio>
                    ))}
                  </Col>
                ))}
              </Row>
            </Radio.Group>
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '60px' }}>Gráfico por Asesores</h2>
        <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
          <div style={{ display: 'flex', gap: '20px', flex: 1 }}>
            {[{ data: kpisAsesoresOrdenes, selected: selectedAsesor, setSelected: setSelectedAsesor },
            { data: kpisAsesoresFases, selected: selectedAsesor, setSelected: setSelectedAsesor },
            { data: kpisAsesoresStatus, selected: selectedAsesor, setSelected: setSelectedAsesor }].map((item, index) => (
              <div key={index} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={item.data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {item.data.map((entry, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>

          {/* Radio Group fuera de la iteración */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Radio.Group onChange={(e) => setSelectedAsesor(e.target.value)} value={selectedAsesor}>
              <Row gutter={[16, 16]}>
                {asesoresChunk.map((group, colIndex) => (
                  <Col key={colIndex}>
                    {group.map((asesor) => (
                      <Radio key={asesor.id_usuario} value={asesor.id_usuario} style={{ display: 'block' }}>
                        {asesor.nombre}
                      </Radio>
                    ))}
                  </Col>
                ))}
              </Row>
            </Radio.Group>
          </div>
        </div>
      </div>

    </div>
  );
};

export default VerKpis;
