import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchKpisTiposLente, fetchKpisTiposLenteAsesores, fetchKpisTiposLenteDoctores, setFechaRangeTipoLente, setFechaRangeTipoLenteAsesores, setFechaRangeTipoLenteDoctores } from "../../../redux/features/kpis/kpisTiposLente/kpisTiposLente";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import DateRangeSeparate from "../../reportes/DateRange";
import { Checkbox, Col, Divider, Row, Select } from "antd";
import { fetchSucursales } from "../../../redux/features/sucursales/sucursalesSlice";
import { fetchUsuarios } from "../../../redux/features/usuarios/usuariosSlice";
import KpiTiempoPromedio from "../KpisOrdenes/KpiTiempoPromedio";

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
      doctorIds: doctorFilter
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
    const newStartDate = new Date(newEndDate);
    newStartDate.setMonth(newEndDate.getMonth() - 12);
    const startDateFormatted = newStartDate.toISOString().split('T')[0];
    const endDateFormatted = newEndDate.toISOString().split('T')[0];

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
    const newStartDate = new Date(newEndDate);
    newStartDate.setMonth(newEndDate.getMonth() - 12);
    const startDateFormatted = newStartDate.toISOString().split('T')[0];
    const endDateFormatted = newEndDate.toISOString().split('T')[0];

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
    const newStartDate = new Date(newEndDate);
    newStartDate.setMonth(newEndDate.getMonth() - 12);

    const startDateFormatted = newStartDate.toISOString().split('T')[0];
    const endDateFormatted = newEndDate.toISOString().split('T')[0];

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


  return (
    <ResponsiveContainer width="100%" height={400}>

      <Row
        gutter={[16, 16]}
      >

        <Col xxl={18} xl={18} md={18}>
          <div
            style={{
              background: 'white',
              height: '600px',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <DateRangeSeparate
                onApply={handleDateApplyAsesores}
                onReset={handleDateResetAsesores}
                isMonthPicker={true}
              />
              <div
                style={{
                  display: "flex", flexDirection: "column", marginTop: '-32px',
                  position: 'absolute',
                  right: '10px'
                }}
              >
                <label>
                  Filtrar por Asesor:
                </label>
                <Select
                  mode="multiple"
                  style={{ width: '200px' }}
                  placeholder="Selecciona el asesor"
                  onChange={handleChangeAsesores}
                  value={asesorFilter || undefined}
                  allowClear
                >
                  {asesores_activados.map(asesor => (
                    <Select.Option
                      key={asesor.id_usuario}
                      value={asesor.id_usuario}
                    >
                      {asesor.nombre}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={kpisTipoLenteAsesores}
                  margin={{ top: 20, right: 50, left: 20, bottom: 50 }}
                  isAnimationActive={false} // Desactiva la animación de hover
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickFormatter={truncateXAxisAsesores}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} /> {/* Sin fondo al hacer hover */}
                  <Legend
                    verticalAlign="top"
                    align="center"
                    content={renderLegendLenteAsesores}
                  />
                  {renderLinesLenteAsesores()}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>

        <Col xxl={6} xl={6} md={6}>
          <KpiTiempoPromedio />
        </Col>


        {/*  */}

        <Col xxl={12} xl={12} md={12}>
          <div
            style={{
              background: 'white',
              height: '600px',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <DateRangeSeparate
                onApply={handleDateApply}
                onReset={handleDateReset}
                isMonthPicker={true}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: '-32px',
                  borderLeft: '1px solid gray',
                  paddingLeft: '12px'
                }}
              >
                <label>Filtrar por Sucursal:</label>
                <Select
                  mode="multiple"
                  style={{ width: '200px' }}
                  placeholder="Selecciona la sucursal"
                  onChange={handleChange}
                  value={sucursalFilter || undefined}
                  allowClear
                >
                  {sucursales.map(sucursal => (
                    <Select.Option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                      {sucursal.nombre}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>

            <div style={{ flex: 1, marginTop: '0px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={kpisTipoLente}
                  margin={{ top: 20, right: 50, left: 20, bottom: 80 }}
                  isAnimationActive={false} // Desactiva la animación para hover
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, angle: -45, textAnchor: 'end' }}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} /> {/* Sin fondo al hacer hover */}
                  <Legend
                    verticalAlign="top"
                    align="center"
                    content={renderLegendLente}
                  />
                  {renderLinesLente()}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>






        <Col xxl={12} xl={12} md={12}>
          <div
            style={{
              background: 'white',
              height: '600px',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <DateRangeSeparate
                onApply={handleDateApplyDoctores}
                onReset={handleDateResetDoctores}
                isMonthPicker={true}
              />
              <div
                style={{
                  display: "flex", flexDirection: "column", marginTop: '-32px',
                  borderLeft: '1px solid gray',
                  paddingLeft: '12px'
                }}
              >
                <label>Filtrar por Doctor:</label>
                <Select
                  mode="multiple"
                  style={{ width: '200px' }}
                  placeholder="Selecciona el doctor"
                  onChange={handleChangeDoctores}
                  value={doctorFilter || undefined}
                  allowClear
                >
                  {doctores_activados.map(doctor => (
                    <Select.Option key={doctor.id_usuario} value={doctor.id_usuario}>
                      {doctor.nombre}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>

            <div style={{ flex: 1, }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={kpisTipoLenteDoctores}
                  margin={{ top: 20, right: 50, left: 20, bottom: 80 }}
                  isAnimationActive={false} // Desactiva la animación para hover
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, angle: -45, textAnchor: 'end' }}
                    interval={0}
                    tickFormatter={truncateXAxisDoctores}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} /> {/* Sin fondo al hacer hover */}
                  <Legend
                    verticalAlign="top"
                    align="center"
                    content={renderLegendLenteDoctores}
                  />
                  {renderLinesLenteDoctores()}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
      </Row>




    </ResponsiveContainer>

  );
};

export default VerKpisTipoLente;
