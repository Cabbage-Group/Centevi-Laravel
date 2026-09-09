import { AutoComplete, Button, Table, Modal, Typography, Progress, message, Spin, Select, Alert } from "antd";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CopyOutlined, EyeOutlined, FilePdfOutlined, ProfileOutlined, UploadOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import '../../../css/tables/TableAnticipos.css';
import {
    fetchAnticipos,
    setSort,
    setPage,
    setSearchTerm,
    setPaciente,
    fetchInterfuerzaAnticipos,
    migrationAnticiposInterfuerza,
} from '../../redux/features/anticipos/anticiposSlice.js';
import { Edit2Icon } from "lucide-react";
import { fetchSucursales } from "../../redux/features/sucursales/sucursalesSlice.js";
import CrearAnticipoModal from "./components/CrearAnticipoModal.js";
import { fetchPacientes } from "../../redux/features/pacientes/pacientesSlice.js";
const { Text } = Typography;

const TableAnticipos = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modalCrear, setModalCrear] = useState(false);
    const [anticipoSeleccionado, setAnticipoSeleccionado] = useState(null);
    const { pacientes_options_selecteds } = useSelector((state) => state.pacientes);
    const {
        anticipos,
        limit,
        page,
        sortColumn,
        sortOrder,
        meta,
        searchTerm,
        id_paciente,
        status,
        interfuerzaTotal,
    } = useSelector((state) => state.anticipos);

    // ---- NUEVO: estado del modal de migración ----
    const [isModalMigracionVisible, setIsModalMigracionVisible] = useState(false);
    const [progressData, setProgressData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusMessage, setStatusMessage] = useState(null);
    const [isMigrating, setIsMigrating] = useState(false);
    const migrationPageSize = 25;
    const totalMigrationPages = Math.ceil(interfuerzaTotal / migrationPageSize);
    const scrollRef = useRef(null);

    useEffect(() => {
        dispatch(
            fetchAnticipos({
                page,
                limit,
                sortColumn,
                sortOrder,
                searchTerm,
                id_paciente,
            })
        );
    }, [
        page,
        limit,
        sortColumn,
        sortOrder,
        searchTerm,
        id_paciente,
    ]);

    useEffect(() => {

        dispatch(fetchSucursales({}))
        dispatch(fetchPacientes({}))
    }, []);

    useEffect(() => {
        dispatch(fetchInterfuerzaAnticipos({ page: 1 }));
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [progressData]);

    const handleTableChange = (pagination, filters, sorter) => {
        const newPage = pagination.current;
        const newSortColumn = sorter.field;
        const newSortOrder = sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : null;

        if (newPage !== page) dispatch(setPage(newPage));
        dispatch(setSort({ sortColumn: newSortColumn, sortOrder: newSortOrder }));
    };

    const handleSearchChange = (value) => {
        dispatch(setSearchTerm(value));
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES');
    };
    const migrateNextPage = async (pageToMigrate) => {
        if (isMigrating) return;

        setIsMigrating(true);

        try {
            const fetched = await dispatch(
                fetchInterfuerzaAnticipos({
                    page: pageToMigrate,
                    limit: migrationPageSize
                })
            ).unwrap();

            const payments = fetched.data || [];
            const totalEnPagina = fetched.total_pagina ?? payments.length;

            const anticiposToMigrate = payments
                .filter(
                    (p) =>
                        (p.Payment?.Type || "").toUpperCase() === "ADVANCE"
                )
                .map((p) => ({
                    referencia: p.Payment.id,
                    codigo_cliente: p.Payment.Cliente,
                    monto: p.Payment.Monto,
                    fecha: p.Payment.Fecha,
                    estado:
                        (p.Payment.Status || "").toUpperCase() === "DELETED"
                            ? "CANCELLED"
                            : "ACTIVE",
                }));

            await dispatch(
                migrationAnticiposInterfuerza({
                    page: pageToMigrate,
                    data: anticiposToMigrate,
                    total_pagina: totalEnPagina,

                    limit: migrationPageSize,

                    es_ultima_pagina:
                        pageToMigrate === totalMigrationPages,

                    hubo_errores: progressData.some(
                        (p) => p.status === "error"
                    ),
                })
            ).unwrap();

            setProgressData((prev) => [
                ...prev,
                {
                    page: pageToMigrate,
                    status: "success"
                }
            ]);

        } catch (error) {
            setProgressData((prev) => [
                ...prev,
                {
                    page: pageToMigrate,
                    status: "error"
                }
            ]);
        } finally {
            setIsMigrating(false);
        }

        if (pageToMigrate < totalMigrationPages) {
            setCurrentPage(pageToMigrate + 1);
        } else {
            setStatusMessage(
                progressData.some((p) => p.status === "error")
                    ? {
                        type: "error",
                        text: "Migración finalizada con errores."
                    }
                    : {
                        type: "success",
                        text: "Migración completada exitosamente."
                    }
            );
        }
    };

    useEffect(() => {
        if (isModalMigracionVisible) {
            setProgressData([]);
            setCurrentPage(1);
            setStatusMessage(null);
        }
    }, [isModalMigracionVisible]);

    useEffect(() => {
        if (isModalMigracionVisible && currentPage <= totalMigrationPages && !isMigrating) {
            migrateNextPage(currentPage);
        }
    }, [currentPage, isModalMigracionVisible]);

    const handleCancelMigracion = () => {
        setIsModalMigracionVisible(false);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id_anticipo',
            key: 'id_anticipo',
            render: (value) => {
                return (
                    <Text
                        ellipsis
                        title={`${value}`}
                    >
                        <span
                            style={{
                                color: "#515365",
                                fontSize: "13px",
                                fontWeight: "normal",
                            }}
                        >
                            {value}
                        </span>
                    </Text>
                );
            },
        },
        {
            title: 'Referencia',
            dataIndex: 'referencia',
            key: 'referencia',
            render: (value) => {
                return (
                    <Text
                        ellipsis
                        title={`${value}`}
                    >
                        <span
                            style={{
                                color: "#515365",
                                fontSize: "13px",
                                fontWeight: "normal",
                            }}
                        >
                            {value}
                        </span>
                    </Text>
                );
            },
        },
        {
            title: 'CODIGO INTERFUERZA',
            dataIndex: 'codigo_interfuerza',
            key: 'codigo_interfuerza',
            render: (value) => {
                return (
                    <Text
                        ellipsis
                        title={`${value}`}
                    >
                        <span
                            style={{
                                color: "#515365",
                                fontSize: "13px",
                                fontWeight: "normal",
                            }}
                        >
                            {value}
                        </span>
                    </Text>
                );
            },
        },
        {
            title: 'Paciente',
            render: (_, record) => {
                return (
                    <Text
                        ellipsis
                        title={`${record?.paciente?.nombres?.trim()} ${record?.paciente?.apellidos?.trim()}`}
                    >
                        <span
                            style={{
                                color: "#515365",
                                fontSize: "13px",
                                fontWeight: "normal",
                            }}
                        >
                            {`${record?.paciente?.nombres?.trim().split(" ")[0] ?? ""} ${record?.paciente?.apellidos?.trim().split(" ")[0] ?? ""
                                }`}
                        </span>
                    </Text>
                );
            },
        },
        {
            title: 'Tipo',
            dataIndex: 'tipo',
            key: 'tipo',
            sorter: true,
            sortOrder: sortColumn === 'Bodega' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
            render: (value) => {
                return (
                    <Text
                        ellipsis
                        title={`${value}`}
                    >
                        <span
                            style={{
                                color: "#515365",
                                fontSize: "13px",
                                fontWeight: "normal",
                            }}
                        >
                            {value}
                        </span>
                    </Text>
                );
            },
        },
        {
            title: 'Monto',
            dataIndex: 'monto',
            key: 'monto',
            render: (value) => {
                return (
                    <Text
                        ellipsis
                        title={`${value}`}
                    >
                        <span
                            style={{
                                color: "#515365",
                                fontSize: "13px",
                                fontWeight: "normal",
                            }}
                        >
                            {value}
                        </span>
                    </Text>
                );
            },
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            render: (value) => {
                return (
                    <Text
                        ellipsis
                        title={`${value}`}
                    >
                        <span
                            style={{
                                color: "#515365",
                                fontSize: "13px",
                                fontWeight: "normal",
                            }}
                        >
                            {value}
                        </span>
                    </Text>
                );
            },
        },
        {
            title: 'Fecha',
            dataIndex: 'fecha',
            key: 'fecha',
            sorter: true,
            sortOrder: sortColumn === 'Fecha' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
            render: (value) => {
                return (
                    <Text
                        ellipsis
                        title={`${formatDate(value)}`}
                    >
                        <span
                            style={{
                                color: "#515365",
                                fontSize: "13px",
                                fontWeight: "normal",
                            }}
                        >
                            {formatDate(value)}
                        </span>
                    </Text>
                );
            },
        },
        // {
        //     title: "Acciones",
        //     key: "acciones",
        //     render: (_, record) => (
        //         <div style={{ display: 'flex' }}>
        //             {/* <Button
        //                 size="large"
        //                 icon={<EyeOutlined style={{ width: '15px' }} />}
        //                 onClick={() => navigate(`/ver-anticipo/${record.id}`)}
        //                 style={{
        //                     marginRight: 8,
        //                     alignItems: "center",
        //                     justifyContent: "center",
        //                     backgroundColor: '#1890ff',
        //                     color: '#fff',
        //                     width: "30px",
        //                     height: "30px"
        //                 }}
        //             /> */}
        //             <Button
        //                 size="large"
        //                 icon={
        //                     <Edit2Icon style={{ width: '15px' }} />
        //                 }
        //                 disabled={true}
        //                 onClick={() => {
        //                     const tieneOrden =
        //                         record?.ordenAnticipos?.length > 0;

        //                     Modal.confirm({
        //                         title: tieneOrden
        //                             ? "Anticipo aplicado"
        //                             : "Editar anticipo",

        //                         content: tieneOrden
        //                             ? "Este anticipo ya está relacionado con una orden. Podrás modificar sus datos, pero el monto no podrá ser cambiado."
        //                             : "¿Está seguro de que desea editar este anticipo?",

        //                         okText: "Continuar",
        //                         cancelText: "Cancelar",

        //                         onOk: () => {
        //                             setAnticipoSeleccionado(record);
        //                             setModalCrear(true);
        //                         },
        //                     });
        //                 }}
        //                 style={{
        //                     alignItems: "center",
        //                     justifyContent: "center",
        //                     backgroundColor: '#13c2c2',
        //                     color: '#fff',
        //                     width: "30px",
        //                     height: "30px"
        //                 }}
        //             />
        //         </div>
        //     ),
        // },
    ];


    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    marginBottom: '20px',
                }}
            >
                <Button
                    type="primary"
                    disabled={true}
                    onClick={() => {
                        setAnticipoSeleccionado(null);
                        setModalCrear(true);
                    }}
                >
                    Agregar Anticipo
                </Button>

                <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    onClick={() => setIsModalMigracionVisible(true)}
                    disabled={!interfuerzaTotal}
                >
                    Migrar Anticipos
                </Button>

                <Select
                    showSearch
                    allowClear
                    placeholder="Filtrar por paciente"
                    style={{ width: 600 }}
                    value={id_paciente || undefined}
                    options={pacientes_options_selecteds}
                    optionFilterProp="label"
                    onChange={(value) => {
                        dispatch(setPaciente(value || ''));
                    }}
                    filterOption={(input, option) =>
                        option?.label
                            ?.toLowerCase()
                            .includes(input.toLowerCase())
                    }
                />

                <AutoComplete
                    style={{ width: 200 }}
                    onSearch={handleSearchChange}
                    placeholder="Buscar Anticipo"
                    value={searchTerm}
                />
            </div>


            <Spin spinning={status === 'loading'} tip="Cargando datos..." size="large">
                <Table
                    columns={columns}
                    dataSource={anticipos}
                    rowKey="id"
                    onChange={handleTableChange}
                    className="compact-table"
                    id="zero-config_wrapper"
                    pagination={{
                        current: meta?.page || 1,
                        total: meta?.total || 0,
                        pageSize: limit,
                        showSizeChanger: false,
                    }}
                />
            </Spin>
            <CrearAnticipoModal
                open={modalCrear}
                record={anticipoSeleccionado}
                onClose={() => {
                    setModalCrear(false);
                    setAnticipoSeleccionado(null);
                }}
                onSuccess={() => {
                    dispatch(
                        fetchAnticipos({
                            page,
                            limit,
                            sortColumn,
                            sortOrder,
                            searchTerm,
                            id_paciente,
                        })
                    );
                }}
            />
            <Modal
                title="Migrando anticipos"
                open={isModalMigracionVisible}
                onCancel={handleCancelMigracion}
                footer={null}
            >
                <div style={{ maxHeight: 300, overflowY: 'auto', paddingRight: 8 }} ref={scrollRef}>
                    {progressData.map(({ page: p, status: s }) => (
                        <Progress
                            key={p}
                            percent={100}
                            status={s === 'success' ? 'success' : 'exception'}
                            format={() => `Página ${p}`}
                            style={{ marginBottom: 8 }}
                        />
                    ))}
                </div>

                {statusMessage && (
                    <Alert
                        type={statusMessage.type}
                        message={statusMessage.text}
                        showIcon
                        style={{ marginTop: 16 }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default TableAnticipos;