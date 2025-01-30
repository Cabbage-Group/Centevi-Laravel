import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, Select, Radio, Row, Col } from 'antd';
import { fetchKpisConsultasTerapias, fetchKpisConsultasTerapiasDoctores, setFechaRangeConsultasTerapias, setFechaRangeConsultasTerapiasDoctores } from '../../../redux/features/kpis/kpisConsultasTerapias/kpisConsultasTerapiasSlice';
import DateRangeSeparate from '../../reportes/DateRange';
import { fetchSucursales } from '../../../redux/features/sucursales/sucursalesSlice';
import { fetchUsuarios } from '../../../redux/features/usuarios/usuariosSlice';


const VerKpisConsultasTerapias = () => {
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
    kpisConsultasTerapias,
    kpisConsultasTerapiasDoctores,
    startDate,
    endDate
  } = useSelector((state) => state.kpisConsultasTerapias)
  const {
    usuarios_doctores_options_selecteds
  } = useSelector((state) => state.usuarios);
  const { sucursales } = useSelector((state) => state.sucursales);
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [localStartDateDoctores, setLocalStartDateDoctores] = useState();
  const [localEndDateDoctores, setLocalEndDateDoctores] = useState();
  const [activeLines, setActiveLines] = useState([]);
  const [activeLinesDoctores, setActiveLinesDoctores] = useState([]);

  const handleSelectAll = () => {
    const allIds = sucursales.map(sucursal => sucursal.id_sucursal);
    setActiveLines(allIds);
  };

  const handleDeselectAll = () => {
    setActiveLines([]);
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

    dispatch(setFechaRangeConsultasTerapias({ startDate: newStartDate, endDate: newEndDate }));
  };

  const handleDateReset = () => {
    setLocalStartDate(null);
    setLocalEndDate(null);

    dispatch(setFechaRangeConsultasTerapias({ startDate: null, endDate: null }));
  };

  const handleDateApplyDoctores = (newStartDate, newEndDate) => {
    setLocalStartDateDoctores(newStartDate);
    setLocalEndDateDoctores(newEndDate);

    dispatch(setFechaRangeConsultasTerapiasDoctores({ startDate: newStartDate, endDate: newEndDate }));
  };

  const handleDateResetDoctores = () => {
    setLocalStartDateDoctores(null);
    setLocalEndDateDoctores(null);

    dispatch(setFechaRangeConsultasTerapiasDoctores({ startDate: null, endDate: null }));
  };

  useEffect(() => {
    dispatch(fetchKpisConsultasTerapias({ startDate: localStartDate, endDate: localEndDate }));
  }, [dispatch, localStartDate, localEndDate]);

  useEffect(() => {
    dispatch(fetchKpisConsultasTerapiasDoctores({ startDate: localStartDateDoctores, endDate: localEndDateDoctores }));
  }, [dispatch, localStartDateDoctores, localEndDateDoctores]);

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

          <DateRangeSeparate
            onApply={handleDateApply}
            onReset={handleDateReset}
            disableDateRangeLimit={true}
            isMonthPicker={true}
          />
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
          data={kpisConsultasTerapias}
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

      <ResponsiveContainer width="100%" height={300} style={{ marginTop: '100px' }} >
        <label >
          Buscar por Fecha Doctores:
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

          <DateRangeSeparate
            onApply={handleDateApplyDoctores}
            onReset={handleDateResetDoctores}
            disableDateRangeLimit={true}
            isMonthPicker={true}
          />
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
          data={kpisConsultasTerapiasDoctores}
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
    </div>
  );
};

export default VerKpisConsultasTerapias;
