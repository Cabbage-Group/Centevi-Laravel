import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchKpisConsultasPorSucursales, fetchKpisTerapiasPorSucursales, setFechaRangeConsultasPorSucursales, setFechaRangeTerapiasPorSucursales } from "../../../../redux/features/kpis/kpisConsultasTerapias/kpisConsultasTerapiasSlice";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, } from 'recharts';
import { Checkbox, Select } from "antd";
import DateRangeSeparate from "../../../reportes/DateRange";

const KpisConsultasTerapiasSucursales = (
    { sucursales }
) => {
    const dispatch = useDispatch();

    const {
        kpisConsultasPorSucursales,
        kpisTerapiasPorSucursales
    } = useSelector((state) => state.kpisConsultasTerapias)

    const [localStartDateConsultasPorSucursales, setLocalStartDateConsultasPorSucursales] = useState();
    const [localEndDateConsultasPorSucursales, setLocalEndDateConsultasPorSucursales] = useState();
    const [activeLinesConsultasPorSucursales, setActiveLinesConsultasPorSucursales] = useState([]);
    const [consultasFilter, setConsultasFilter] = useState([]);

    const [localStartDateTerapiasPorSucursales, setLocalStartDateTerapiasPorSucursales] = useState();
    const [localEndDateTerapiasPorSucursales, setLocalEndDateTerapiasPorSucursales] = useState();
    const [activeLinesTerapiasPorSucursales, setActiveLinesTerapiasPorSucursales] = useState([]);
    const [terapiasFilter, setTerapiasFilter] = useState([]);

    const CustomTooltipBarras = ({ active, payload, label }) => {
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

    useEffect(() => {
        if (sucursales.length > 0) {
            setActiveLinesConsultasPorSucursales(sucursales.map((sucursal) => sucursal.id_sucursal));
            setActiveLinesTerapiasPorSucursales(sucursales.map((sucursal) => sucursal.id_sucursal));
        }
    }, [sucursales]);

    useEffect(() => {
        dispatch(fetchKpisConsultasPorSucursales({
            startDate: localStartDateConsultasPorSucursales,
            endDate: localEndDateConsultasPorSucursales,
            consultas: consultasFilter
        }));
    }, [localStartDateConsultasPorSucursales, localEndDateConsultasPorSucursales, consultasFilter])

    useEffect(() => {
        dispatch(fetchKpisTerapiasPorSucursales({
            startDate: localStartDateTerapiasPorSucursales,
            endDate: localEndDateTerapiasPorSucursales,
            terapias: terapiasFilter
        }));
    }, [localStartDateTerapiasPorSucursales, localEndDateTerapiasPorSucursales, terapiasFilter])

    const handleDateApplyConsultasPorSucursales = (newStartDate, newEndDate) => {
        setLocalStartDateConsultasPorSucursales(newStartDate);
        setLocalEndDateConsultasPorSucursales(newEndDate);
        dispatch(setFechaRangeConsultasPorSucursales({ startDate: newStartDate, endDate: newEndDate }));
    };

    const handleCheckboxChangeConsultasPorSucursales = (id, checked) => {
        setActiveLinesConsultasPorSucursales((prev) =>
            checked ? [...prev, id] : prev.filter((sucursalId) => sucursalId !== id)
        );
    };

    const handleDateResetConsultasPorSucursales = () => {
        const newEndDate = new Date();
        const newStartDate = new Date(newEndDate.getFullYear(), newEndDate.getMonth() - 12, 1);

        const lastDayOfCurrentMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth() + 1, 0);

        const startDateFormatted = newStartDate.toISOString().split('T')[0];
        const endDateFormatted = lastDayOfCurrentMonth.toISOString().split('T')[0];


        setLocalStartDateConsultasPorSucursales(startDateFormatted);
        setLocalEndDateConsultasPorSucursales(endDateFormatted);
        dispatch(setFechaRangeConsultasPorSucursales({
            startDate: startDateFormatted,
            endDate: endDateFormatted
        }));
    }

    const truncateXAxisConsultasPorSucursales = (value) => {
        return value.length > 10 ? value.substring(0, 10) + "..." : value;
    };

    const renderLegendConsultasPorSucursales = () => (
        <div style={{ display: 'flex', gap: '0px', marginBottom: '15px' }}>
            {sucursales.map((sucursal) => (
                <div key={sucursal.id_sucursal} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                        style={{
                            width: '15px',
                            height: '15px',
                            backgroundColor: '#6C5CE7',
                            borderRadius: '3px',
                        }}
                    ></div>
                    <Checkbox
                        checked={activeLinesConsultasPorSucursales.includes(sucursal.id_sucursal)}
                        onChange={(e) => handleCheckboxChangeConsultasPorSucursales(sucursal.id_sucursal, e.target.checked)}
                    >
                        {sucursal.nombre}
                    </Checkbox>
                </div>
            ))}
        </div>
    );

    const renderLinesConsultasPorSucursales = () => {
        const lines = [];

        const sucursalColors = [
            "#FF6347",
            "#FF9800",
            "#4CAF50",
            "#2196F3",
            "#9C27B0",
            "#00B894",
            "#F39C12",
        ];

        sucursales.forEach((sucursal, index) => {
            if (activeLinesConsultasPorSucursales.includes(sucursal.id_sucursal)) {
                const sucursalColor = sucursalColors[index % sucursalColors.length];
                lines.push(
                    <Bar
                        key={sucursal.id_sucursal}
                        dataKey={sucursal.nombre}
                        stackId="a"
                        fill={sucursalColor}
                        barSize={70}
                    />
                );
            }
        });

        return lines;
    };

    { '' }

    const handleDateApplyTerapiasPorSucursales = (newStartDate, newEndDate) => {
        setLocalStartDateTerapiasPorSucursales(newStartDate);
        setLocalEndDateTerapiasPorSucursales(newEndDate);
        dispatch(setFechaRangeTerapiasPorSucursales({ startDate: newStartDate, endDate: newEndDate }));
    };

    const handleCheckboxChangeTerapiasPorSucursales = (id, checked) => {
        setActiveLinesTerapiasPorSucursales((prev) =>
            checked ? [...prev, id] : prev.filter((sucursalId) => sucursalId !== id)
        );
    };

    const handleDateResetTerapiasPorSucursales = () => {
        const newEndDate = new Date();
        const newStartDate = new Date(newEndDate.getFullYear(), newEndDate.getMonth() - 12, 1);

        const lastDayOfCurrentMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth() + 1, 0);

        const startDateFormatted = newStartDate.toISOString().split('T')[0];
        const endDateFormatted = lastDayOfCurrentMonth.toISOString().split('T')[0];


        setLocalStartDateTerapiasPorSucursales(startDateFormatted);
        setLocalEndDateTerapiasPorSucursales(endDateFormatted);
        dispatch(setFechaRangeTerapiasPorSucursales({
            startDate: startDateFormatted,
            endDate: endDateFormatted
        }));
    }

    const truncateXAxisTerapiasPorSucursales = (value) => {
        return value.length > 10 ? value.substring(0, 10) + "..." : value;
    };

    const renderLegendTerapiasPorSucursales = () => (
        <div style={{ display: 'flex', gap: '0px', marginBottom: '15px' }}>
            {sucursales.map((sucursal) => (
                <div key={sucursal.id_sucursal} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                        style={{
                            width: '15px',
                            height: '15px',
                            backgroundColor: '#6C5CE7',
                            borderRadius: '3px',
                        }}
                    ></div>
                    <Checkbox
                        checked={activeLinesTerapiasPorSucursales.includes(sucursal.id_sucursal)}
                        onChange={(e) => handleCheckboxChangeTerapiasPorSucursales(sucursal.id_sucursal, e.target.checked)}
                    >
                        {sucursal.nombre}
                    </Checkbox>
                </div>
            ))}
        </div>
    );


    const renderLinesTerapiasPorSucursales = () => {
        const lines = [];

        const sucursalColors = [
            "#FF6347",
            "#FF9800",
            "#4CAF50",
            "#2196F3",
            "#9C27B0",
            "#00B894",
            "#F39C12",
        ];

        sucursales.forEach((sucursal, index) => {
            if (activeLinesTerapiasPorSucursales.includes(sucursal.id_sucursal)) {
                const sucursalColor = sucursalColors[index % sucursalColors.length];
                lines.push(
                    <Bar
                        key={sucursal.id_sucursal}
                        dataKey={sucursal.nombre}
                        stackId="a"
                        fill={sucursalColor}
                        barSize={70}
                    />
                );
            }
        });

        return lines;
    };


    const handleChangeConsultas = (value) => {
        setConsultasFilter(value);
    };

    const handleChangeTerapias = (value) => {
        setTerapiasFilter(value);
    };

    const opcionesConsultas = [
        { label: 'Baja Visión', value: 'baja_vision' },
        { label: 'Consulta Generica', value: 'consulta_generica' },
        { label: 'Optometria Neonatos', value: 'optometria_neonatos' },
        { label: 'Refraccion General', value: 'refraccion_general' },
        { label: 'Ortoptica Adultos', value: 'ortoptica_adultos' },
        { label: 'Optometria Pediatrica', value: 'optometria_pediatrica' },
    ];

    const opcionesTerapias = [
        { label: 'Terapia Baja Visión', value: 'terapia_baja_vision' },
        { label: 'Terapia Optometria Neonatos', value: 'terapia_optometria_neonatos' },
        { label: 'Terapia Ortoptica Adultos', value: 'terapia_ortoptica_adultos' },
        { label: 'Terapia Optometria Pediatrica', value: 'terapia_optometria_pediatrica' },
    ];


    return (
        <div>
            <div
                style={{
                    background: 'white',
                    padding: '15px',
                    height: '600px',
                    borderRadius: '15px',
                    marginTop: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <DateRangeSeparate
                        onApply={handleDateApplyConsultasPorSucursales}
                        onReset={handleDateResetConsultasPorSucursales}
                        isMonthPicker={true}
                    />
                    <div
                        style={{
                            display: "flex", flexDirection: "column", marginTop: '-32px',
                            borderLeft: '1px solid gray',
                            paddingLeft: '12px'
                        }}
                    >
                        <label>Filtrar por Consultas:</label>
                        <Select
                            mode="multiple"
                            style={{ width: '200px' }}
                            placeholder="Selecciona las consultas"
                            onChange={handleChangeConsultas}
                            value={consultasFilter || undefined}
                            allowClear
                            direction="vertical"
                            options={opcionesConsultas}
                        >
                        </Select>
                    </div>
                </div>

                <div style={{ flex: 1, }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={kpisConsultasPorSucursales}
                            margin={{ top: 20, right: 50, left: 20, bottom: 80 }}
                            isAnimationActive={false}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 10, angle: -45, textAnchor: 'end' }}
                                interval={0}
                                tickFormatter={truncateXAxisConsultasPorSucursales}
                            />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip content={<CustomTooltipBarras />} cursor={{ fill: 'transparent' }} />
                            <Legend
                                verticalAlign="top"
                                align="center"
                                content={renderLegendConsultasPorSucursales}
                            />
                            {renderLinesConsultasPorSucursales()}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div >

            {""}

            <div
                style={{
                    background: 'white',
                    padding: '15px',
                    height: '600px',
                    borderRadius: '15px',
                    marginTop: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <DateRangeSeparate
                        onApply={handleDateApplyTerapiasPorSucursales}
                        onReset={handleDateResetTerapiasPorSucursales}
                        isMonthPicker={true}
                    />
                    <div
                        style={{
                            display: "flex", flexDirection: "column", marginTop: '-32px',
                            borderLeft: '1px solid gray',
                            paddingLeft: '12px'
                        }}
                    >

                        <label>Filtrar por Terapias:</label>
                        <Select
                            mode="multiple"
                            style={{ width: '200px' }}
                            placeholder="Selecciona las terapias"
                            onChange={handleChangeTerapias}
                            value={terapiasFilter || undefined}
                            allowClear
                            direction="vertical"
                            options={opcionesTerapias}
                        >
                        </Select>
                    </div>
                </div>

                <div style={{ flex: 1, }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={kpisTerapiasPorSucursales}
                            margin={{ top: 20, right: 50, left: 20, bottom: 80 }}
                            isAnimationActive={false}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 10, angle: -45, textAnchor: 'end' }}
                                interval={0}
                                tickFormatter={truncateXAxisTerapiasPorSucursales}
                            />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip content={<CustomTooltipBarras />} cursor={{ fill: 'transparent' }} />
                            <Legend
                                verticalAlign="top"
                                align="center"
                                content={renderLegendTerapiasPorSucursales}
                            />
                            {renderLinesTerapiasPorSucursales()}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div >
        </div>
    )
}

export default KpisConsultasTerapiasSucursales;