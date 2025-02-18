import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchKpisTiposCristalesNoLimitsVertical, fetchKpisTiposCristalesOptions, setFechaRangeTiposCristalesNoLimitsVertical } from "../../../redux/features/kpis/kpisTiposCristales/kpisTiposCristalesSlice";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, ComposedChart } from 'recharts';
import { Button, Col, Row, Select } from "antd";
import DateRangeSeparate from "../../reportes/DateRange";

const KpisTiposCristalesVertical = (props) => {
  const {
    limit
  } = props

  const dispatch = useDispatch();

  const {
    kpisTiposCristalesNoLimitsVertical,
    kpisTipos_cristales_select_option_no_limits_vertical,
    kpisTipos_Cristales_options
  } = useSelector((state) => state.kpisTiposCristales)

  const [localStartDateTiposCristalesVertical, setLocalStartDateTiposCristalesVertical] = useState();
  const [localEndDateTiposCristalesVertical, setLocalEndDateTiposCristalesVertical] = useState();
  const [tiposCristalesFilterVertical, setTiposCristalesFilterVertical] = useState([]);

  const handleDateApplyTiposCristalesVertical = (newStartDate, newEndDate) => {
    setLocalStartDateTiposCristalesVertical(newStartDate);
    setLocalEndDateTiposCristalesVertical(newEndDate);
    dispatch(setFechaRangeTiposCristalesNoLimitsVertical({ startDate: newStartDate, endDate: newEndDate }));
  };


  const handleDateResetTiposCristalesVertical = () => {
    setLocalStartDateTiposCristalesVertical(null);
    setLocalEndDateTiposCristalesVertical(null);
    dispatch(setFechaRangeTiposCristalesNoLimitsVertical({ startDate: null, endDate: null }));
  };

  useEffect(() => {
    if (limit) {
      dispatch(fetchKpisTiposCristalesNoLimitsVertical({
        startDate: localStartDateTiposCristalesVertical,
        endDate: localEndDateTiposCristalesVertical,
        name: tiposCristalesFilterVertical,
        limit: limit
      }))
    }

  }, [
    dispatch,
    localStartDateTiposCristalesVertical,
    localEndDateTiposCristalesVertical,
    tiposCristalesFilterVertical
  ])

  useEffect(() => {
    dispatch(fetchKpisTiposCristalesOptions({}))
  }, [])

  const handleChangeTiposCristalesVertical = (value) => {
    setTiposCristalesFilterVertical(value);
  };

  const truncateXAxisTiposCristalesVertical = (value) => {
    return value.length > 10 ? value.substring(0, 10) + "..." : value;
  };

  const CustomTooltipBarrasVertical = ({ active, payload, label }) => {
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

  return (
    <Row>
      <Col xxl={24} xl={24} md={24}>
        <div
          style={{
            background: 'white',
            padding: '15px',
            height: '1600px',
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
            Tipos Cristales Sin limites {limit}
          </div>

          <div style={{ display: 'flex', alignItems: "center", gap: "10px" }}>
            <DateRangeSeparate
              onApply={handleDateApplyTiposCristalesVertical}
              onReset={handleDateResetTiposCristalesVertical}
              isMonthPicker={true}
            />
            <div
              style={{
                display: "flex", flexDirection: "column", marginTop: '-32px',
                borderLeft: '1px solid gray',
                paddingLeft: '12px'
              }}
            >
              <label>Filtrar por Tipo de Cristal:</label>
              <Select
                mode="multiple"
                style={{ width: '200px' }}
                placeholder="Selecciona el tipo de cristal"
                onChange={handleChangeTiposCristalesVertical}
                value={tiposCristalesFilterVertical || undefined}
                allowClear
              >
                {kpisTipos_Cristales_options.map(tipoCristal => (
                  <Select.Option key={tipoCristal.value} value={tipoCristal.value}>
                    {tipoCristal.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                layout="vertical"
                margin={{ top: 20, right: 50, left: 20, bottom: 80 }}
                data={kpisTiposCristalesNoLimitsVertical}
                isAnimationActive={false}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis type="number" />
                <YAxis
                  dataKey="name"
                  type="category"
                  scale="band"
                  tick={{ fontSize: 10, angle: -45, textAnchor: 'end' }}
                  tickFormatter={truncateXAxisTiposCristalesVertical}
                />
                <Tooltip content={<CustomTooltipBarrasVertical />} cursor={{ fill: 'transparent' }} />
                <Legend
                  verticalAlign="top"
                  align="center"
                />
                <Bar dataKey="total" fill="#8884d8" barSize={100} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ div>
      </Col>
    </Row>
  )
}

export default KpisTiposCristalesVertical;