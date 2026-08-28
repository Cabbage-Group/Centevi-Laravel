import { AutoComplete, Button, Table, Modal, Typography, Progress, message, Spin, Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CopyOutlined, EyeOutlined, FilePdfOutlined, ProfileOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import '../../../css/tables/TableAnticipos.css';
import { fetchAnticipos, setSort, setPage, setSearchTerm, setPaciente } from '../../redux/features/anticipos/anticiposSlice.js';
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
    } = useSelector((state) => state.anticipos);


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
        {
            title: "Acciones",
            key: "acciones",
            render: (_, record) => (
                <div style={{ display: 'flex' }}>
                    {/* <Button
                        size="large"
                        icon={<EyeOutlined style={{ width: '15px' }} />}
                        onClick={() => navigate(`/ver-anticipo/${record.id}`)}
                        style={{
                            marginRight: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: '#1890ff',
                            color: '#fff',
                            width: "30px",
                            height: "30px"
                        }}
                    /> */}
                    <Button
                        size="large"
                        icon={
                            <Edit2Icon style={{ width: '15px' }} />
                        }
                        onClick={() => {
                            const tieneOrden =
                                record?.ordenAnticipos?.length > 0;

                            Modal.confirm({
                                title: tieneOrden
                                    ? "Anticipo aplicado"
                                    : "Editar anticipo",

                                content: tieneOrden
                                    ? "Este anticipo ya está relacionado con una orden. Podrás modificar sus datos, pero el monto no podrá ser cambiado."
                                    : "¿Está seguro de que desea editar este anticipo?",

                                okText: "Continuar",
                                cancelText: "Cancelar",

                                onOk: () => {
                                    setAnticipoSeleccionado(record);
                                    setModalCrear(true);
                                },
                            });
                        }}
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: '#13c2c2',
                            color: '#fff',
                            width: "30px",
                            height: "30px"
                        }}
                    />
                </div>
            ),
        },
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
                    onClick={() => {
                        setAnticipoSeleccionado(null);
                        setModalCrear(true);
                    }}
                >
                    Agregar Anticipo
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
        </div>
    );
};

export default TableAnticipos;