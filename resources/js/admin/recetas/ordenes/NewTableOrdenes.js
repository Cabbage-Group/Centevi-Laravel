import React, { useEffect, useState } from 'react';
import { fecthOrdenes, fecthPruebaOrdenes, setSearchTermOrdenes, setSearchTermPruebaOrdenes } from '../../../redux/features/ordenes/ordenesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AutoComplete, Tooltip, Typography, Table, Button } from 'antd';
import dayjs from 'dayjs'

const { Text } = Typography;

const columnWidths = {
    nroOrden: 120,
    fecha: 120,
    sucursal: 140,
    cedula: 140,
    paciente: 180,
    laboratorio: 100,
    proveedor_material: 100,
    fase: 160,
    status: 60,
    codigoCristal: 100
};

const NewTableOrdenes = () => {
    const dispatch = useDispatch();
    const {
        ordenes_prueba,
        status_prueba,
        error_prueba,
        meta_prueba,
        search_prueba
    } = useSelector((state) => state.ordenes);

    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isCurrent = true;
        setIsLoading(true);

        dispatch(fecthPruebaOrdenes({
            page: currentPage,
            limit: 20,
            search: search_prueba
        })).then(() => {
            if (isCurrent) setIsLoading(false);
        });

        return () => {
            isCurrent = false;
        };
    }, [dispatch, currentPage, search_prueba]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    const handleSearchChange = (value) => {
        dispatch(setSearchTermPruebaOrdenes(value));
    };

    const columns = [
        {
            title: 'N° de Orden',
            dataIndex: 'nro_orden_id',
            width: columnWidths.nroOrden,
            render: (text, record) => (
                <>
                    {text}
                    <img
                        src={
                            record?.lente_contacto
                                ? 'assets/img/recetas/lentesdecontacto.png'
                                : 'assets/img/recetas/lentenormal.png'
                        }
                        alt="Lente"
                        style={{ width: '20px', marginLeft: '8px' }}
                    />
                </>
            )
        },
        {
            title: 'Fec. de Creación',
            dataIndex: 'created_at',
            width: columnWidths.fecha,
            render: (text) => dayjs(text).format('DD/MM/YYYY')
        },
        {
            title: 'Sucursal',
            dataIndex: 'sucursal',
            width: columnWidths.sucursal,
            render: (sucursal) => sucursal?.nombre?.replace("CENTEVI", "").trim()
        },
        {
            title: 'Cédula',
            dataIndex: ['paciente', 'nro_cedula'],
            width: columnWidths.cedula
        },
        {
            title: 'Paciente',
            dataIndex: 'paciente',
            width: columnWidths.paciente,
            render: (paciente) => (
                <Text ellipsis title={`${paciente?.nombres} ${paciente?.apellidos}`}>
                    <span style={{ color: "#515365", fontSize: "13px", fontWeight: "normal" }}>
                        {`${paciente?.nombres?.split(" ")[0] ?? ''} ${paciente?.apellidos?.split(" ")[0] ?? ''}`}
                    </span>
                </Text>
            )
        },
        {
            title: 'Laboratorio',
            dataIndex: 'fases_ordenes',
            width: columnWidths.laboratorio,
            render: (fases_ordenes) => {
                const faseConLaboratorio = (fases_ordenes ?? []).find(fase => fase?.laboratorio);
                return faseConLaboratorio?.laboratorio ?? 'Sin laboratorio';
            }
        },
        {
            title: 'Proveedor',
            dataIndex: 'fases_ordenes',
            width: columnWidths.proveedor_material,
            render: (fases_ordenes) => {
                const faseConProveedor = (fases_ordenes ?? []).find(fase => fase?.proveedor_material);
                return faseConProveedor?.proveedor_material ?? 'Sin Proveedor';
            }
        },
        {
            title: 'Fase',
            dataIndex: 'tipo_fase_orden',
            width: columnWidths.fase,
            render: (_, record) => {
                const fases = record?.fases_ordenes ?? [];
                const faseMayor = fases.length > 0
                    ? [...fases].sort((a, b) => b.tipo_fase_orden_id - a.tipo_fase_orden_id)[0]
                    : null;

                return (
                    <div>{faseMayor?.tipo_fase_orden?.tipo_fase_orden ?? 'Nuevo'}</div>
                );
            }
        },
        {
            title: 'Status',
            dataIndex: 'fases_ordenes',
            width: columnWidths.status,
            render: (fases_ordenes) => {
                let estado = '';
                let color = '';

                if (!fases_ordenes || fases_ordenes.length === 0) {
                    estado = 'Sin estado';
                    color = 'gray';
                } else {
                    const isCompletado = fases_ordenes.some(f => f.tipo_fase_orden_id === 4);

                    if (isCompletado) {
                        estado = 'Completado';
                        color = 'blue';
                    } else {
                        const ultimaFase = fases_ordenes[fases_ordenes.length - 1];
                        const ultimaFecha = new Date(ultimaFase?.created_at ?? ultimaFase?.updated_at ?? new Date());
                        const hoy = new Date();
                        const diffTime = Math.abs(hoy.getTime() - ultimaFecha.getTime());
                        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                        if (diffDays <= 6) {
                            estado = 'OK';
                            color = 'green';
                        } else if (diffDays === 7) {
                            estado = 'Advertencia';
                            color = 'yellow';
                        } else {
                            estado = 'Crítico';
                            color = 'red';
                        }
                    }
                }

                return (
                    <Tooltip title={estado}>
                        <span
                            style={{
                                display: 'inline-block',
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: color
                            }}
                        ></span>
                    </Tooltip>
                );
            }
        },
        {
            title: 'Codigo Cristal',
            dataIndex: 'codigo_cristal',
            width: columnWidths.codigoCristal,
            render: (codigoCristal) => codigoCristal ?? 'Sin codigo'
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: 20 }}>
                <AutoComplete
                    allowClear
                    style={{ width: 200 }}
                    onSearch={handleSearchChange}
                    onClear={() => handleSearchChange('')}
                    placeholder="Buscar"
                    value={search_prueba}
                />
            </div>
            <Table
                className="table-ordenes"
                columns={columns}
                dataSource={ordenes_prueba}
                rowKey="id_orden"
                loading={isLoading}
                pagination={{
                    current: currentPage,
                    total: meta_prueba?.total,
                    pageSize: 20,
                    onChange: handlePageChange,
                    showSizeChanger: false,
                }}
                scroll={{ x: 'max-content' }}
            />
            {status_prueba === 'failed' && <p style={{ color: 'red' }}>Error: {error_prueba}</p>}
        </div>
    );
};

export default NewTableOrdenes;
