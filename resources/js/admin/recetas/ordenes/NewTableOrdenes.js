import React, { useEffect, useState } from 'react';
import { fecthOrdenes, setSearchTermOrdenes } from '../../../redux/features/ordenes/ordenesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AutoComplete, Tooltip, Typography, Table, Button } from 'antd';

const { Text } = Typography;

const columnWidths = {
    nroOrden: 120,
    fecha: 120,
    sucursal: 140,
    cedula: 140,
    paciente: 180,
    laboratorio: 100,
    proveedor: 100,
    fase: 160,
    status: 60,
    codigoCristal: 100
};

const NewTableOrdenes = () => {
    const dispatch = useDispatch();
    const {
        ordenes,
        status,
        error,
        meta,
        search_term_ordenes
    } = useSelector((state) => state.ordenes);

    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        dispatch(fecthOrdenes({
            page: currentPage,
            limit: 20,
            search: search_term_ordenes
        })).then(() => {
            setIsLoading(false);
        });
    }, [dispatch, currentPage, search_term_ordenes]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    const handleSearchChange = (value) => {
        dispatch(setSearchTermOrdenes(value));
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
            width: columnWidths.fecha
        },
        {
            title: 'Sucursal',
            dataIndex: 'sucursal',
            width: columnWidths.sucursal,
            render: (sucursal) => sucursal?.replace("CENTEVI", "").trim()
        },
        {
            title: 'Cédula',
            dataIndex: 'nro_cedula',
            width: columnWidths.cedula
        },
        {
            title: 'Paciente',
            dataIndex: 'nombres',
            width: columnWidths.paciente,
            render: (text, record) => (
                <Text ellipsis title={`${record.nombres} ${record.apellidos}`}>
                    <span style={{ color: "#515365", fontSize: "13px", fontWeight: "normal" }}>
                        {`${record?.nombres?.split(" ")[0]} ${record?.apellidos?.split(" ")[0]}`}
                    </span>
                </Text>
            )
        },
        {
            title: 'Laboratorio',
            dataIndex: 'laboratorio',
            width: columnWidths.laboratorio
        },
        {
            title: 'Proveedor',
            dataIndex: 'proveedor',
            width: columnWidths.proveedor
        },
        {
            title: 'Fase',
            dataIndex: 'tipo_fase_orden',
            width: columnWidths.fase,
            render: (text, record) => (
                <>
                    <div>{text}</div>
                    <div>{record?.elaborado_por_fase}</div>
                </>
            )
        },
        {
            title: 'Status',
            dataIndex: 'estado',
            width: columnWidths.status,
            render: (estado) => (
                <Tooltip title={estado ?? ""}>
                    <span
                        style={{
                            display: 'inline-block',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor:
                                estado === 'OK'
                                    ? 'green'
                                    : estado === 'Advertencia'
                                        ? 'yellow'
                                        : estado === 'Crítico'
                                            ? 'red'
                                            : estado === 'Completado'
                                                ? 'blue'
                                                : 'gray',
                        }}
                    ></span>
                </Tooltip>
            )
        },
        {
            title: 'Codigo Cristal',
            dataIndex: 'codigo_cristal',
            width: columnWidths.codigoCristal
        }
    ];

    

    return (
        <div>
            {/* <Button
            onClick={() => {
                console.log('estatus:', status)
            }}>

            </Button> */}
            {/* <div style={{ marginBottom: 20 }}>
                <AutoComplete
                    style={{ width: 200 }}
                    onSearch={handleSearchChange}
                    placeholder="Buscar"
                    value={search_term_ordenes}
                />
            </div> */}
            <Table
                className="table-ordenes"
                columns={columns}
                dataSource={ordenes}
                rowKey="id_orden"
                loading={isLoading}
                pagination={{
                    current: currentPage,
                    total: meta?.total,
                    pageSize: 20,
                    onChange: handlePageChange,
                    showSizeChanger: false,
                }}
                scroll={{ x: 'max-content' }}
            />
            {status === 'failed' && <p style={{ color: 'red' }}>Error: {error}</p>}
        </div>
    );
};

export default NewTableOrdenes;
