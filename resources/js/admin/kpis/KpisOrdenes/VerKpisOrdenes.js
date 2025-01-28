import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchKpisPromedioFasesOrdenes, setFasesRangePromedioFasesOrdenes, setFechaRangePromedioFasesOrdenes } from "../../../redux/features/kpis/kpisConsultasTerapias/kpisConsultasTerapiasSlice";
import { Button, Card, Col, Row, Select, Spin } from "antd";
import DateRangeSeparate from "../../reportes/DateRange";


const VerKpisOrdenes = () => {

    const dispatch = useDispatch();
    const { 
        tiempoPromedio, 
        faseInicial, 
        faseFinal, 
        statusPromedioFasesOrdenes } = useSelector((state) => state.kpisConsultasTerapias)
    const [localStartDateFasesOrdenes, setLocalStartDateFasesOrdenes] = useState();
    const [localEndDateFasesOrdenes, setLocalEndDateFasesOrdenes] = useState();
    const [lenteContactoFilter, setLenteContactoFilter] = useState([]);

    const faseMapping = {
        Nuevo: 1,
        "En confeccion": 2,
        Listo: 3,
        Retirado: 4
    };

    const tiempo = tiempoPromedio
        ? `${tiempoPromedio.dias} días, ${tiempoPromedio.horas} horas, ${tiempoPromedio.minutos} minutos`
        : "No disponible";

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
        <div style={{ marginTop: "20px" }}>
            <label >
                Buscar por Fecha:
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <DateRangeSeparate
                    onApply={handleDateApplyPromedioFasesOrdenes}
                    onReset={handleDateResetPromedioFasesOrdenes}
                />
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
                <div style={{ display: "flex", flexDirection: "column", marginTop: '-32px' }}>
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
                <div style={{ display: "flex", flexDirection: "column", marginTop: '-32px' }}>
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
                    style={{}}
                    type="primary"
                    danger
                    disabled={!faseInicial && !faseFinal}
                >
                    Limpiar
                </Button>
            </div>
            <Row gutter={16} style={{ marginTop: "30px" }}>
                <Col span={8}>
                    <Card title="Tiempo Promedio" bordered={false} style={{ width: 300 }}>
                        {statusPromedioFasesOrdenes === 'loading' ? (
                            <Spin size="large" />
                        ) : (
                            <h3>{tiempo}</h3>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    )
}


export default VerKpisOrdenes;