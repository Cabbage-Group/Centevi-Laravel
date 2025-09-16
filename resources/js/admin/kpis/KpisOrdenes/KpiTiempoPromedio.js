import React, { useEffect, useRef, useState } from 'react'
import DateRangeSeparate from '../../reportes/DateRange'
import { Col, Row, Select, Spin, Space, Typography, Divider, Tooltip } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchKpisPromedioFasesOrdenes,
  setFasesRangePromedioFasesOrdenes,
  setFechaRangePromedioFasesOrdenes
} from '../../../redux/features/kpis/kpisConsultasTerapias/kpisConsultasTerapiasSlice'

const { Text, Title } = Typography;

const KpiTiempoPromedio = ({
  timeRef = null,
}) => {
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

  // refs y control para abrir/focar el Select de Fase Final
  const finalSelectRef = useRef(null);
  const [openFinal, setOpenFinal] = useState(false);

  const fases = ["Nuevo", "En confeccion", "Listo", "Retirado"];
  const faseMapping = {
    Nuevo: 1,
    "En confeccion": 2,
    Listo: 3,
    Retirado: 4
  };

  const tiempo = tiempoPromedio
    ? `${tiempoPromedio.dias} días, ${tiempoPromedio.horas} horas, ${tiempoPromedio.minutos} minutos`
    : "No disponible";

  const getFasesDisponibles = (faseInicialVal) => {
    if (!faseInicialVal) return [];
    const idx = fases.indexOf(faseInicialVal);
    if (idx === -1) return [];
    return fases.slice(idx + 1); // solo posteriores
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

  // Al cambiar fase inicial: ajusta faseFinal si ya no es válida, abre y enfoca el select final
  const handleFaseInicialChange = (value) => {
    // value puede ser undefined (clear)
    if (!value) {
      dispatch(setFasesRangePromedioFasesOrdenes({ faseInicial: null, faseFinal: null }));
      setOpenFinal(false);
      return;
    }

    const disponibles = getFasesDisponibles(value);
    const newFinal = (faseFinal && disponibles.includes(faseFinal)) ? faseFinal : null;

    dispatch(setFasesRangePromedioFasesOrdenes({ faseInicial: value, faseFinal: newFinal }));

    // abrir y enfocar el select final para que el usuario continúe
    setTimeout(() => {
      setOpenFinal(true);
      if (finalSelectRef.current?.focus) finalSelectRef.current.focus();
    }, 80);
  };

  // Al cambiar fase final: si se limpia, solo limpia la fase final; si selecciona, la guarda
  const handleFaseFinalChange = (value) => {
    if (!value) {
      dispatch(setFasesRangePromedioFasesOrdenes({ faseInicial: faseInicial || null, faseFinal: null }));
      return;
    }
    dispatch(setFasesRangePromedioFasesOrdenes({ faseInicial: faseInicial || null, faseFinal: value }));
    setOpenFinal(false);
  };

  // Texto que muestra el rango seleccionado (ej: "Nuevo → Listo")
  const renderFaseRangeText = () => {
    if (faseInicial && faseFinal) return `${faseInicial} → ${faseFinal}`;
    if (faseInicial) return `Desde: ${faseInicial}`;
    if (faseFinal) return `Hasta: ${faseFinal}`;
    return "No hay rango de fases seleccionado";
  };

  // opciones para fase final (solo posteriores)
  const opcionesFinal = getFasesDisponibles(faseInicial);

  return (
    <Row gutter={[12,12]}>

      {/* Header + valor grande (sin Card) */}
      <Col xs={24} sm={24}>
        <Row gutter={[6, 6]}>
          <Col xs={24} sm={24}>
            <Title level={5} style={{ margin: 0 }}>Tiempo Promedio</Title>
          </Col>
          <Col xs={24} sm={24}>
            {statusPromedioFasesOrdenes === 'loading' ? (
              <Spin size="large" />
            ) : (
              <Title level={3} style={{ margin: "8px 0", color: "#009688" }} ref={timeRef}>
                {tiempo}
              </Title>
            )}
          </Col>
          <Col xs={24} sm={24}>
            <Divider style={{margin: "0 0 0 0"}}/>
          </Col>
        </Row>
      </Col>


      {/* Filtro DateRange  */}
      <Col xs={24} sm={24}>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={24}>
             <DateRangeSeparate
             onApply={handleDateApplyPromedioFasesOrdenes}
             onReset={handleDateResetPromedioFasesOrdenes}
           />
          </Col>
          <Col xs={24} sm={24}>
            <Divider style={{margin: "0 0 0 0"}}/>
          </Col>
        </Row>
      </Col>



      {/* Contenedor unificado para ambos selects fase inicial - fase final */}
      <Col xs={24} sm={24}>
        <Row gutter={[0, 12]}>
          <Col xs={24} sm={24}>
            <Text strong style={{ marginBottom: 6, fontSize: 16 }}>Filtrar por Fase Inicial - Final</Text>
          </Col>
          <Col xs={12} sm={12}>
            <Tooltip title='Selecciona una fase inicial'>
                <Select
                style={{ width: "100%"}}
                placeholder="Fase inicial"
                value={faseInicial || undefined}
                onChange={handleFaseInicialChange}
                allowClear
              >
                {fases.map(f => <Select.Option key={f} value={f}>{f}</Select.Option>)}
              </Select>
            </Tooltip>
          </Col>
          <Col xs={12} sm={12}>
            <Tooltip title='Selecciona una fase final'>
              <Select
                ref={finalSelectRef}
                open={openFinal}
                onDropdownVisibleChange={(open) => setOpenFinal(open)}
                style={{ width: "100%" }}
                placeholder={faseInicial ? "Fase final" : "Primero Fase inicial"}
                value={faseFinal || undefined}
                onChange={handleFaseFinalChange}
                allowClear
                disabled={!faseInicial}
              >
                {opcionesFinal.map(f => <Select.Option key={f} value={f}>{f}</Select.Option>)}
              </Select>
            </Tooltip>
            
          </Col>

          <Col xs={24} sm={24}>
            <Text type="secondary" style={{fontSize: 12}}>Rango: </Text>
            <Space>
              <Text type="secondary" style={{fontSize: 12}}>{renderFaseRangeText()}</Text>
            </Space>
          </Col>
          <Col xs={24} sm={24}>
            <Divider style={{margin: "0 0 0 0"}}/>
          </Col>
        </Row>
      </Col>


      {/* Contenedor Filtro Tipo lente */}
      <Col xs={24} sm={24}>
        <Row gutter={[12, 12]}>
          {/* titulo */}
          <Col xs={24} sm={24}>
            <Text strong>Filtrar por Tipo de Lente</Text>
          </Col>

          {/* titulo select */}
          <Col xs={24} sm={24}>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Selecciona el tipo de lente"
              onChange={handleLenteContactoChange}
              value={lenteContactoFilter || undefined}
              allowClear
            >
              <Select.Option value="1">
                <img
                  src="assets/img/recetas/lentesdecontacto.png"
                  alt="Lente On"
                  style={{ width: '20px', height: '20px', marginRight: '8px' }}
                />
                Lente de Contacto
              </Select.Option>
              <Select.Option value="0">
                <img
                  src="assets/img/recetas/lentenormal.png"
                  alt="Lente Off"
                  style={{ width: '20px', height: '20px', marginRight: '8px' }}
                />
                Lente Normal
              </Select.Option>
            </Select>
          </Col>

        </Row>
      </Col>

    </Row>
  )
}

export default KpiTiempoPromedio