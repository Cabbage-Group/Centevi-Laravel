import React, { useEffect, useState } from 'react'
import DateRangeSeparate from '../../reportes/DateRange'
import { Button, Card, Col, Row, Select, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchKpisPromedioFasesOrdenes,
  setFasesRangePromedioFasesOrdenes,
  setFechaRangePromedioFasesOrdenes
} from '../../../redux/features/kpis/kpisConsultasTerapias/kpisConsultasTerapiasSlice'

const KpiTiempoPromedio = () => {
  const dispatch = useDispatch();

  const {
    tiempoPromedio,
    faseInicial,
    faseFinal,
    statusPromedioFasesOrdenes
  } = useSelector((state) => state.kpisConsultasTerapias)

  const [lenteContactoFilter, setLenteContactoFilter] = useState([]);
  const [localStartDateFasesOrdenes, setLocalStartDateFasesOrdenes] = useState();
  const [localEndDateFasesOrdenes, setLocalEndDateFasesOrdenes] = useState();

  const faseMapping = {
    Nuevo: 1,
    "En confeccion": 2,
    Listo: 3,
    Retirado: 4
  };

  const tiempo = tiempoPromedio
    ? `${tiempoPromedio.dias} días, ${tiempoPromedio.horas} horas, ${tiempoPromedio.minutos} minutos`
    : "No disponible";

  const getFasesDisponibles = (faseInicial) => {
    const fases = ["Nuevo", "En confeccion", "Listo", "Retirado"];
    return fases.slice(fases.indexOf(faseInicial) + 1);
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

  const handleLenteContactoChange = (value) => {
    setLenteContactoFilter(value);
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

  useEffect(() => {
    dispatch(fetchKpisPromedioFasesOrdenes({
      startDate: localStartDateFasesOrdenes,
      endDate: localEndDateFasesOrdenes,
      faseInicial: faseInicial ? faseMapping[faseInicial] : null,
      faseFinal: faseFinal ? faseMapping[faseFinal] : null,
      lenteContacto: lenteContactoFilter
    }));
  }, [dispatch, localStartDateFasesOrdenes, localEndDateFasesOrdenes, lenteContactoFilter, faseInicial, faseFinal]);

  return (
    <div>

      {/* Card de tiempo promedio */}
      <Row>
        <Col xxl={24} xl={24} md={24}>
          <Card title="Tiempo Promedio" bordered={false}>
            {statusPromedioFasesOrdenes === 'loading' ? (
              <Spin size="large" />
            ) : (
              <h3>{tiempo}</h3>
            )}
          </Card>
        </Col>
      </Row>


      <div
        style={{
          marginTop: '10px',
          background: 'white',
          padding: '10px'
        }}
      >
        <DateRangeSeparate
          onApply={handleDateApplyPromedioFasesOrdenes}
          onReset={handleDateResetPromedioFasesOrdenes}
        />

        <div style={{ width: "100%", marginTop: "10px" }}>
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            flexWrap: "wrap"
          }}>


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

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Filtrar por Tipo de Lente:</label>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
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

          </div>
        </div>
      </div>




    </div>
  )
}

export default KpiTiempoPromedio