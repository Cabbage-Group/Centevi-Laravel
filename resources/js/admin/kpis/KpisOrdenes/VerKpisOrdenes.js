import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchKpisPromedioFasesOrdenes, setFasesRangePromedioFasesOrdenes, setFechaRangePromedioFasesOrdenes } from "../../../redux/features/kpis/kpisConsultasTerapias/kpisConsultasTerapiasSlice";
import { Button, Card, Checkbox, Col, Row, Select, Spin } from "antd";
import DateRangeSeparate from "../../reportes/DateRange";
import { fetchKpisOrdenesLente, fetchKpisOrdenesTipoCristal, setFechaRangeOrdenesLente, setFechaRangeOrdenesTipoCristal } from "../../../redux/features/kpis/kpisOrdenes/kpisOrdenes";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { fetchCristales } from "../../../redux/features/cristales/cristalesSlice";


const VerKpisOrdenes = () => {

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
    tiempoPromedio,
    faseInicial,
    faseFinal,
    statusPromedioFasesOrdenes } = useSelector((state) => state.kpisConsultasTerapias)
  const { kpisOrdenesTipoCristal, kpisOrdenesLente } = useSelector((state) => state.kpisOrdenes)
  const { cristales } = useSelector((state) => state.cristales)
  const [localStartDateFasesOrdenes, setLocalStartDateFasesOrdenes] = useState();
  const [localEndDateFasesOrdenes, setLocalEndDateFasesOrdenes] = useState();
  const [lenteContactoFilter, setLenteContactoFilter] = useState([]);
  const [activeLines, setActiveLines] = useState([]);
  const [activeLinesLente, setActiveLinesLente] = useState(["lente_contacto", "lente_normal"]);
  const [localStartDate, setLocalStartDate] = useState();
  const [localEndDate, setLocalEndDate] = useState();
  const [localStartDateLente, setLocalStartDateLente] = useState();
  const [localEndDateLente, setLocalEndDateLente] = useState();

  console.log('kpisOrdenesLente:', kpisOrdenesLente)

  const faseMapping = {
    Nuevo: 1,
    "En confeccion": 2,
    Listo: 3,
    Retirado: 4
  };

  const tiempo = tiempoPromedio
    ? `${tiempoPromedio.dias} días, ${tiempoPromedio.horas} horas, ${tiempoPromedio.minutos} minutos`
    : "No disponible";

  const handleSelectAll = () => {
    const allIds = cristales.map(cristal => cristal.id);
    setActiveLines(allIds);
  };

  const handleDeselectAll = () => {
    setActiveLines([]);
  };

  const handleCheckboxChange = (cristalId, checked) => {
    setActiveLines(prevState => {
      if (checked) {
        return [...prevState, cristalId];
      } else {
        return prevState.filter(id => id !== cristalId);
      }
    });
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




  const handleFaseInicialChange = (value) => {
    dispatch(setFasesRangePromedioFasesOrdenes({ faseInicial: value, faseFinal: null }));
  };

  const handleFaseFinalChange = (value) => {
    dispatch(setFasesRangePromedioFasesOrdenes({ faseInicial, faseFinal: value }));
  };

  const handleLimpiar = () => {
    dispatch(setFasesRangePromedioFasesOrdenes({ faseInicial: null, faseFinal: null }));
  };

  const getFasesDisponibles = (faseInicial) => {
    const fases = ["Nuevo", "En confeccion", "Listo", "Retirado"];
    return fases.slice(fases.indexOf(faseInicial) + 1);
  };

  const handleLenteContactoChange = (value) => {
    setLenteContactoFilter(value);
  };

  const handleDateApplyPromedioFasesOrdenes = (newStartDate, newEndDate) => {
    setLocalStartDateFasesOrdenes(newStartDate);
    setLocalEndDateFasesOrdenes(newEndDate);

    dispatch(setFechaRangePromedioFasesOrdenes({ startDate: newStartDate, endDate: newEndDate }));
  };

  const handleDateResetPromedioFasesOrdenes = () => {
    setLocalStartDateFasesOrdenes(null);
    setLocalEndDateFasesOrdenes(null);

    dispatch(setFechaRangePromedioFasesOrdenes({ startDate: null, endDate: null }));
  };

  const handleDateApply = (newStartDate, newEndDate) => {
    setLocalStartDate(newStartDate);
    setLocalEndDate(newEndDate);

    dispatch(setFechaRangeOrdenesTipoCristal({ startDate: newStartDate, endDate: newEndDate }));
  };

  const handleDateReset = () => {
    setLocalStartDate(null);
    setLocalEndDate(null);

    dispatch(setFechaRangeOrdenesTipoCristal({ startDate: null, endDate: null }));
  };

  const handleDateApplyLente = (newStartDate, newEndDate) => {
    setLocalStartDateLente(newStartDate);
    setLocalEndDateLente(newEndDate);

    dispatch(setFechaRangeOrdenesLente({ startDate: newStartDate, endDate: newEndDate }));
  };

  const handleDateResetLente = () => {
    setLocalStartDateLente(null);
    setLocalEndDateLente(null);

    dispatch(setFechaRangeOrdenesLente({ startDate: null, endDate: null }));
  };


  useEffect(() => {
    dispatch(fetchKpisPromedioFasesOrdenes({
      startDate: localStartDateFasesOrdenes,
      endDate: localEndDateFasesOrdenes,
      faseInicial: faseInicial ? faseMapping[faseInicial] : null,
      faseFinal: faseFinal ? faseMapping[faseFinal] : null,
      lenteContacto: lenteContactoFilter
    }));
  }, [dispatch, localStartDateFasesOrdenes, localEndDateFasesOrdenes, lenteContactoFilter, faseInicial, faseFinal]);

  useEffect(() => {
    dispatch(fetchKpisOrdenesTipoCristal({ startDate: localStartDate, endDate: localEndDate, }))
  }, [dispatch, localStartDate, localEndDate,])

  useEffect(() => {
    dispatch(fetchKpisOrdenesLente({ startDate: localStartDateLente, endDate: localEndDateLente, }))
  }, [localStartDateLente, localEndDateLente])

  useEffect(() => {
    dispatch(fetchCristales())
  }, [dispatch])

  useEffect(() => {
    if (cristales.length > 0) {
      setActiveLines(cristales.map(cristal => cristal.id));
    }
  }, [cristales]);

  const renderLegend = () => {
    const chunkedCristales = [];
    for (let i = 0; i < cristales.length; i += 22) {
      chunkedCristales.push(cristales.slice(i, i + 22));
    }
    return (
      <div style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        maxHeight: '600px',
        overflowY: 'auto',
        marginLeft: '140px',
        padding: '5px'
      }}>
        {chunkedCristales.map((chunk, chunkIndex) => (
          <div key={chunkIndex} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            {chunk.map((cristal, index) => {
              const lineColor = colors[(chunkIndex * 22 + index) % colors.length];
              return (
                <div key={cristal.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '16px'
                }}>
                  <Checkbox
                    checked={activeLines.includes(cristal.id)}
                    onChange={(e) => handleCheckboxChange(cristal.id, e.target.checked)}
                    style={{
                      marginRight: '4px',
                      transform: 'scale(0.8)'
                    }}
                  />
                  <span
                    style={{
                      color: lineColor,
                      fontSize: '11px',
                      width: '100px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={cristal.codigo}
                  >
                    {cristal.codigo}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderLegendLente = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px' }}>
      <Checkbox
        checked={activeLinesLente.includes("lente_contacto")}
        onChange={(e) => handleCheckboxChangeLente("lente_contacto", e.target.checked)}
      >
        Lente Contacto
      </Checkbox>
      <Checkbox
        checked={activeLinesLente.includes("lente_normal")}
        onChange={(e) => handleCheckboxChangeLente("lente_normal", e.target.checked)}
      >
        Lente Normal
      </Checkbox>
    </div>
  );

  const renderLines = () => {
    return cristales.map((cristal, index) => {
      const lineColor = colors[index % colors.length];
      if (activeLines.includes(cristal.id)) {
        return (
          <Line
            key={cristal.id}
            type="monotone"
            dataKey={cristal.codigo}
            stroke={lineColor}
            strokeWidth={2}
          />
        );
      }
      return null;
    });
  };

  const renderLinesLente = () => {
    const lines = [];
    if (activeLinesLente.includes("lente_contacto")) {
      lines.push(<Line key="lente_contacto" type="monotone" dataKey="lente_contacto" stroke="#FF5733" />);
    }
    if (activeLinesLente.includes("lente_normal")) {
      lines.push(<Line key="lente_normal" type="monotone" dataKey="lente_normal" stroke="#33FF57" />);
    }
    return lines;
  };


  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Calcular el número de columnas según el número de datos
      const columns = Math.ceil(payload.length / 5); // 5 por columna (ajusta esto según tus necesidades)
      return (
        <div
          style={{
            backgroundColor: '#fff',
            padding: '10px',
            border: '1px solid #ccc',
            width: 'auto',  // Ajustar automáticamente el tamaño
            boxSizing: 'border-box'
          }}
        >
          <p><strong>Fecha:</strong> {label}</p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,  // Crear columnas dinámicas según el número de elementos
            gap: '10px',
            fontSize: '14px',
            color: '#333'
          }}>
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

  const customTooltipLente = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: "#fff", padding: '10px', border: '1px solid #ccc' }}>
          <p><strong>Fecha:</strong> {label}</p>
          {payload.map((entry, index) => (
            <div key={index}>
              <strong>{entry.name}:</strong> {entry.value}
            </div>
          ))}
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
    <div >
      {/* <div style={{ width: "100%", height: 600 }}> */}
      {/* <div style={{ 
                    display: "flex", 
                    justifyContent: "flex-end", 
                    marginBottom: "10px",
                    gap: "10px"
                }}>
                    <DateRangeSeparate></DateRangeSeparate>
                    <button onClick={handleSelectAll} style={buttonStyle('green')}>
                        Seleccionar Todo
                    </button>
                    <button onClick={handleDeselectAll} style={buttonStyle('red')}>
                        Deseleccionar Todo
                    </button>
                </div>
     */}
      <ResponsiveContainer width="100%" height={500} >

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label>
            Buscar por Fecha:
          </label>

          <DateRangeSeparate onApply={handleDateApply} onReset={handleDateReset} />
          <div style={{ display: "flex", flexDirection: "column", marginTop: '-32px' }}>

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
          data={kpisOrdenesTipoCristal}
          margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={customTooltip} />
          <Legend
            content={renderLegend}
            verticalAlign="middle"
            align="right"
            layout="vertical"
          />
          {renderLines()}
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={500}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label>
            Buscar por Fecha:
          </label>

          <DateRangeSeparate onApply={handleDateApplyLente} onReset={handleDateResetLente} />
        </div>
        <LineChart
          data={kpisOrdenesLente}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={customTooltipLente} />
          <Legend content={renderLegendLente} verticalAlign="middle" align="right" layout="vertical" />
          {renderLinesLente()}
        </LineChart>
      </ResponsiveContainer>

      <div style={{ width: "100%", marginTop: "10px" }}>
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          flexWrap: "wrap"
        }}>

          <div style={{ marginTop: "0px" }}>
            <label>Buscar por Fecha:</label>
            <DateRangeSeparate
              onApply={handleDateApplyPromedioFasesOrdenes}
              onReset={handleDateResetPromedioFasesOrdenes}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>Filtrar por Tipo de Lente:</label>
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
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>Fase Inicial:</label>
            <Select
              style={{ width: '200px' }}
              placeholder="Selecciona una fase inicial"
              value={faseInicial}
              onChange={handleFaseInicialChange}
            >
              <Select.Option value="Nuevo">Nuevo</Select.Option>
              <Select.Option value="En confeccion">En confección</Select.Option>
              <Select.Option value="Listo">Listo</Select.Option>
              <Select.Option value="Retirado">Retirado</Select.Option>
            </Select>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>Fase Final:</label>
            <Select
              style={{ width: '200px' }}
              placeholder="Selecciona una fase final"
              value={faseFinal}
              onChange={handleFaseFinalChange}
              disabled={!faseInicial}
            >
              {faseInicial && getFasesDisponibles(faseInicial).map(fase => (
                <Select.Option key={fase} value={fase}>{fase}</Select.Option>
              ))}
            </Select>
          </div>
          <Button
            onClick={handleLimpiar}
            type="primary"
            danger
            disabled={!faseInicial && !faseFinal}
            style={{ marginTop: '30px' }}
          >
            Limpiar
          </Button>
        </div>
      </div>

      {/* Card de tiempo promedio */}
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Tiempo Promedio" bordered={false} style={{ width: 300, marginTop: "20px" }}>
            {statusPromedioFasesOrdenes === 'loading' ? (
              <Spin size="large" />
            ) : (
              <h3>{tiempo}</h3>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}


export default VerKpisOrdenes;