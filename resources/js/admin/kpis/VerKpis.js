import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchKpis, setFechaRange } from '../../redux/features/kpis/kpisSlice';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice';
import DateRange from '../reportes/DateRange';
import { Button } from 'antd';
import DateRangeSeparate from '../reportes/DateRange';
import CollapsedTable from '../ordenes/CollapsedTable';
import CollapsibleTable from '../ordenes/prueba';

const VerKpis = () => {

  const dispatch = useDispatch();
  const { kpis, startDate, endDate } = useSelector((state) => state.kpis);
  const { sucursales } = useSelector((state) => state.sucursales);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [localStartDate, setLocalStartDate] = useState(startDate);

  const [selectedDates, setSelectedDates] = useState({
    startDate: null,
    endDate: null,
  });

  const handleDateApply = (startDate, endDate) => {
    setSelectedDates({ startDate, endDate });
    console.log("Fechas seleccionadas:", { startDate, endDate });
  };

  const handleDateReset = () => {
    setSelectedDates({ startDate: null, endDate: null });
    console.log("Fechas reseteadas");
  };


  useEffect(() => {
    dispatch(fetchKpis({startDate,endDate}))
  }, [dispatch, startDate, endDate])

  useEffect(() => {
    dispatch(fetchSucursales({}))
  },[dispatch])

  const renderLines = () => {
    return sucursales.map((sucursal) => {
      return (
        <Line
          key={sucursal.id_sucursal}
          type="monotone"
          dataKey={sucursal.nombre}
          stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Colores aleatorios
          strokeWidth={2}
        />
      );
    });
  };

  const handleDateChange = () => {
    dispatch(setFechaRange({ startDate: localStartDate, endDate: localEndDate }));
  };


  return (
    <ResponsiveContainer width="100%" height={300}>
      <div style={{ marginRight: '10px', marginTop: 'px' }}>

        <Button
        onClick={()=>{
          console.log('localStartDate:',localStartDate)
        }}>
          AQUI2
        </Button>
        <label>
          Buscar por Fecha:
        </label>
        <DateRangeSeparate onApply={handleDateApply} onReset={handleDateReset} />
      </div>
      <LineChart
        data={kpis}
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {renderLines()}
      </LineChart>
      <h1>Tabla Colapsable</h1>
      <CollapsibleTable />
    </ResponsiveContainer>
    
  );
};

export default VerKpis;
