import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchKpis, fetchKpisAsesores, fetchKpisDoctores, setFechaRange, setFechaRangeAsesores, setFechaRangeDoctores } from '../../redux/features/kpis/kpisSlice';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice';
import DateRangeSeparate from '../reportes/DateRange';
import { Checkbox } from 'antd';
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

  const dispatch = useDispatch();
  const {
    kpis,
    kpisAsesores,
    kpisDoctores,
    startDate,
    endDate,
    startDateAsesores,
    endDateAsesores,
  } = useSelector((state) => state.kpis);
  const { sucursales } = useSelector((state) => state.sucursales);
  const { usuarios_doctores_options_selecteds, usuarios_activados } = useSelector((state) => state.usuarios);

  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [localStartDateAsesores, setLocalStartDateAsesores] = useState(startDateAsesores);
  const [localEndDateAsesores, setLocalEndDateAsesores] = useState(endDateAsesores);
  const [localStartDateDoctores, setLocalStartDateDoctores] = useState();
  const [localEndDateDoctores, setLocalEndDateDoctores] = useState();
  const [activeLines, setActiveLines] = useState([]);
  const [activeLinesUsuarios, setActiveLinesUsuarios] = useState([]);
  const [activeLinesDoctores, setActiveLinesDoctores] = useState([]);



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
    dispatch(fetchKpis({ startDate: localStartDate, endDate: localEndDate }));
  }, [dispatch, localStartDate, localEndDate]);

  useEffect(() => {
    dispatch(fetchKpisAsesores({ startDate: localStartDateAsesores, endDate: localEndDateAsesores }));
  }, [dispatch, localStartDateAsesores, localEndDateAsesores]);

  useEffect(() => {
    dispatch(fetchKpisDoctores({ startDate: localStartDateDoctores, endDate: localEndDateDoctores }));
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
    for (let i = 0; i < usuarios_activados.length; i += 12) {
      chunkedUsuarios.push(usuarios_activados.slice(i, i + 12));
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
              const lineColor = colors[(chunkIndex * 12 + index) % colors.length];
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
  
  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <div style={{ marginRight: '10px', marginTop: 'px' }}>
          <label>
            Buscar por Fecha Sucursales:
          </label>
          <DateRangeSeparate onApply={handleDateApply} onReset={handleDateReset} />
        </div>
        <LineChart
          data={kpis}
          margin={{ top: 20, right: 120, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={customTooltip}/>
          <Legend
            content={renderLegend}
            align="right"
            verticalAlign="middle"
            layout="vertical"
          />
          {renderLines()}
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={300}>
        <div style={{ marginRight: '10px', marginTop: '100px' }}>
          <label>
            Buscar por Fecha Asesores:
          </label>
          <DateRangeSeparate onApply={handleDateApplyAsesores} onReset={handleDateResetAsesores} />
        </div>
        <LineChart
          data={kpisAsesores}
          margin={{ top: 20, right: 120, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip  content={customTooltip}/>
          <Legend
            content={renderLegendAsesores}
            align="right"
            verticalAlign="middle"
            layout="vertical"
          />
          {renderLinesAsesores()}
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={300}>
        <div style={{ marginRight: '10px', marginTop: '100px' }}>
          <label>
            Buscar por Fecha Doctores:
          </label>
          <DateRangeSeparate onApply={handleDateApplyDoctores} onReset={handleDateResetDoctores} />
        </div>
        <LineChart
          data={kpisDoctores}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={customTooltip}/>
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

export default VerKpis;
