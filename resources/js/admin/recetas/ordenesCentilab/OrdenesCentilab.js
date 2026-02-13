import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Tooltip,
    Typography,
    Table,
    Button,
    Modal,
    Skeleton,
} from "antd";
import { EyeOutlined, FilePdfOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { fetchCorreccionesByOrdenId } from "../../../redux/features/correciones-ordenes/correcionesOrdenesSlice";
import { fecthOrdenesCentilab, setFechaRange, setOrderCentilabId, setSearch, setStatusLoading, verCorrecionCentilabPdf, verOrdenCentilabPdf, verOrdenCentilabPdfSize } from "../../../redux/features/ordenes/ordenesCentilab/ordenesCentilabSlice";
import OptionsOrdenesCentilab from "./OptionsOrdenesCentilab";




const { Text } = Typography;

const columnWidths = {
    nro_orden_id: 100,
    nombres: 300,
    tipo_cristal_od: 300,
    dias: 100,
    created_at: 120,
    enviado: 120,
    entrada: 120,
    retiro: 120,
    doctor: 150,
    status: 100,
    acciones: 220,
};

const OrdenesCentilab = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { ordenesCentilab, startDate, endDate, status, error, meta, search } =
        useSelector((state) => state.ordenesCentilab);
    const { correcionesbyOrden } = useSelector(
        (state) => state.correcionesordenes
    );
    const getSucursalInicial = () => {
        const ip = localStorage.getItem('ip');

        const sucursalPorIp = {
            '186.74.2.218': null,
            '190.219.45.142': 3,
            '45.229.196.9': 4,
            '190.34.23.233': 11,
        };

        return sucursalPorIp[ip] ? [sucursalPorIp[ip]] : [];
    };
    const OrdenId = useSelector((state) => state.ordenesCentilab.OrderId);
    const sucursalFilterLabo = useSelector((state) => state.fasesOrdenes.sucursalFilterLabo);

    const [showOrden, setShowOrden] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showOrdenSize, setShowOrdenSize] = useState(false);
    const [loadingPdfSize, setLoadingPdfSize] = useState(false);
    const [urlPdfOrdenSize, setUrlPdfOrdenSize] = useState(null);
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [urlPdfOrden, setUrlPdfOrden] = useState(null);
    const [sucursalFilter, setSucursalFilter] = useState(getSucursalInicial || sucursalFilterLabo || []);
    const [doctorFilter, setDoctorFilter] = useState([]);
    const [selectedOrdenId, setSelectedOrdenId] = useState(null);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [loading, setIsLoading] = useState();
    useEffect(() => {
        let isCurrent = true;
        setIsLoading(true);
        dispatch(
            fecthOrdenesCentilab({
                page: currentPage,
                limit: 20,
                search: search,
                sucursal: sucursalFilter,
                doctor: doctorFilter,
                startDate,
                endDate,
            })
        ).then(() => {
            if (isCurrent) setIsLoading(false);
        });

        return () => {
            isCurrent = false;
        };
    }, [
        dispatch,
        currentPage,
        search,
        sucursalFilter,
        doctorFilter,
        startDate,
        endDate,
    ]);

    useEffect(() => {
        if (selectedOrdenId) {
            dispatch(
                fetchCorreccionesByOrdenId({
                    orden_id: selectedOrdenId,
                })
            );
        }
    }, [selectedOrdenId]);


    const handleExpand = (expanded, record) => {
        if (expanded) {
            setExpandedRowKeys([record.id_orden]);
            setSelectedOrdenId(record.id_orden);
        } else {
            setExpandedRowKeys([]);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleVerOrden = async (id_orden) => {
        try {
            setShowOrdenSize(false);
            setLoadingPdf(true);
            setShowOrden(true);
            const url = await dispatch(verOrdenCentilabPdf(id_orden));
            if (url) {
                dispatch(setOrderCentilabId(id_orden));
                setUrlPdfOrden(url.payload);
            } else {
                Swal.fire(
                    "Error",
                    "Hubo un problema al visualizar la orden.",
                    "error"
                );
            }
        } catch (error) {
            console.log(error);
            Swal.fire(
                "Error",
                "Hubo un problema al visualizar la orden.",
                "error"
            );
            setLoadingPdf(false);
        }
        setLoadingPdf(false);
    };

    const handleVerOrdenSize = async (id_orden) => {
        try {
            setShowOrden(false);
            setLoadingPdfSize(true);
            setShowOrdenSize(true);
            const url = await dispatch(verOrdenCentilabPdfSize(id_orden));
            if (url) {
                setUrlPdfOrdenSize(url.payload);
            } else {
                Swal.fire(
                    "Error",
                    "Hubo un problema al visualizar la orden.",
                    "error"
                );
            }
        } catch (error) {
            console.log(error);
            Swal.fire(
                "Error",
                "Hubo un problema al visualizar la orden.",
                "error"
            );
            setLoadingPdfSize(false);
        }
        setLoadingPdfSize(false);
    };

    const handleVerCorrecion = async (id_correcion, numero_correcion) => {
        try {
            setLoadingPdf(true);
            setShowOrden(true);
            const url = await dispatch(
                verCorrecionCentilabPdf({ id_correcion, numero_correcion })
            );

            if (url) {
                setUrlPdfOrden(url.payload);
            } else {
                Swal.fire(
                    "Error",
                    "Hubo un problema al visualizar la orden.",
                    "error"
                );
            }
        } catch (error) {
            console.log(error);
            Swal.fire(
                "Error",
                "Hubo un problema al visualizar la orden.",
                "error"
            );
            setLoadingPdf(false);
        }
        setLoadingPdf(false);
    };

    const columns = [
        {
            title: "N° de Orden",
            dataIndex: "nro_orden_id",
            width: columnWidths.nro_orden_id,
            render: (text, record) => (
                <>
                    {text}
                    <img
                        src={
                            record?.lente_contacto
                                ? "assets/img/recetas/lentesdecontacto.png"
                                : "assets/img/recetas/lentenormal.png"
                        }
                        alt="Lente"
                        style={{ width: "20px", marginLeft: "8px" }}
                    />
                </>
            ),
        },
        {
            title: "Paciente",
            dataIndex: "nombres",
            width: columnWidths.nombres,
            render: (_, record) => (
                <Text
                    ellipsis
                    title={`${record?.nombres?.trim()} ${record?.apellidos?.trim()}`}
                >
                    <span
                        style={{
                            color: "#515365",
                            fontSize: "13px",
                            fontWeight: "normal",
                        }}
                    >
                        {`${record?.nombres?.trim().split(" ")[0] ?? ""} ${record?.apellidos?.trim().split(" ")[0] ?? ""
                            }`}
                    </span>
                </Text>
            ),
        },
        {
            title: "Lente",
            dataIndex: "tipo_cristal_od",
            width: columnWidths.tipo_cristal_od,
            render: (_, record) => {
                if (record?.lente_contacto) {
                    return record?.marca || '-';
                }

                return record?.tipo_cristal_od || record?.tipo_cristal_oi || '-';
            },
        },
        {
            title: "Días",
            dataIndex: "dias",
            width: columnWidths.dias,
        },
        {
            title: "Fecha orden",
            dataIndex: "created_at",
            width: columnWidths.created_at,
        },
        {
            title: "En Confección",
            dataIndex: "enviado",
            width: columnWidths.enviado,
        },
        {
            title: "Entrada",
            dataIndex: "entrada",
            width: columnWidths.entrada,
        },
        {
            title: "Listo",
            dataIndex: "retiro",
            width: columnWidths.retiro,
        },
        {
            title: "Doctor",
            dataIndex: "doctor",
            width: columnWidths.doctor,
        },
        {
            title: "Status",
            dataIndex: "estado",
            width: columnWidths.status,
            render: (__, record) => {
                return (
                    <Tooltip title={record?.estado}>
                        <span
                            style={{
                                display: "inline-block",
                                width: "12px",
                                height: "12px",
                                borderRadius: "50%",
                                backgroundColor:
                                    record?.estado === "OK"
                                        ? "green"
                                        : record?.estado === "Advertencia"
                                            ? "yellow"
                                            : record?.estado === "Crítico"
                                                ? "red"
                                                : record?.estado === "Completado"
                                                    ? "blue"
                                                    : "gray",
                            }}
                        ></span>
                    </Tooltip>
                );
            },
        },
        {
            title: "Acciones",
            key: "acciones",
            width: columnWidths.acciones,
            render: (_, record) => (
                <>
                    <Button
                        size="large"
                        icon={<FilePdfOutlined />}
                        onClick={() => {
                            dispatch(setOrderCentilabId(record.id_orden));
                            handleVerOrden(record.id_orden);
                        }}
                        style={{
                            marginRight: "8px",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#4361EE",
                            color: "#fff",
                        }}
                    />
                    <Button
                        size="large"
                        icon={<EyeOutlined />}
                        onClick={() =>
                            navigate(
                                `/ver-orden/${record.id_orden}/${record?.nro_orden_id}/${record?.id_paciente}`
                            )
                        }
                        style={{
                            marginRight: "8px",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#1890ff",
                            color: "#fff",
                        }}
                    />
                    <Button
                        size="large"
                        icon={<EditOutlined />}
                        onClick={() =>
                            navigate(
                                `/orden-receta/${record.id_orden}/${record.nro_orden_id}/${record.id_paciente}`,
                                {
                                    state: {
                                        sucursalFilterLabo: sucursalFilter,
                                        doctor: doctorFilter,
                                        searchLabo: search,
                                        startDateLabo: startDate,
                                        endDateLabo: endDate,
                                    },
                                }
                            )
                        }
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#f39c12",
                            borderColor: "#f39c12",
                            color: "#fff",
                            opacity: record?.cancelada ? 0.5 : 1,
                        }}
                        disabled={record.cancelada}
                    />

                </>
            ),
        },
    ];

    return (
        <div className="widget-content-area br-4">
            <div className="widget-one">
                <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing d-flex justify-content-center align-items-center" style={{ marginTop: '-40px' }}>
                    <div
                        className="card absolute"
                        style={{
                            width: '10rem', height: '3rem', padding: '0.5rem', display: 'flex',
                            justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '-10px'
                        }}
                    >
                        <div
                            className="card-body"
                            style={{
                                display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.5rem'
                            }}
                        >
                            <span
                                style={{
                                    fontSize: '1rem', fontWeight: 'bold',
                                    textAlign: 'center'
                                }}
                            >
                                Órdenes: {meta?.total}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="row layout-top-spacing" id="cancel-row">
                    <div className="col-xl-12 col-lg-12 col-sm-12  layout-spacing">
                        <div className="widget-content widget-content-area br-6">
                            <div
                                style={{ width: "100%", marginBottom: "20px" }}
                            >
                                <div className="d-flex">
                                    <OptionsOrdenesCentilab
                                        sucursalFilter={sucursalFilter}
                                        doctorFilter={doctorFilter}
                                        setSucursalFilter={setSucursalFilter}
                                        setDoctorFilter={setDoctorFilter}
                                        setFechaRange={setFechaRange}
                                    />
                                </div>
                            </div>
                            <Table
                                className="table-ordenes"
                                columns={columns}
                                dataSource={ordenesCentilab}
                                rowKey="id_orden"
                                loading={status === 'loading'}
                                rowClassName={(record) => (record.cancelada ? 'fila-cancelada' : '')}
                                pagination={{
                                    current: currentPage,
                                    total: meta?.total,
                                    pageSize: 20,
                                    onChange: handlePageChange,
                                    showSizeChanger: false,
                                }}
                                scroll={{ x: 1300 }}
                                expandable={{
                                    expandedRowRender: (parentRecord) => (
                                        <Table
                                            columns={[
                                                {
                                                    dataIndex: "nro_orden_id",
                                                    width: columnWidths.nroOrden,
                                                    key: "nro_orden_id",
                                                    render: (
                                                        text,
                                                        record,
                                                        index
                                                    ) =>
                                                        `${record.nro_orden_id
                                                        }-C${index + 1}`,
                                                },
                                                {
                                                    dataIndex: "nombres",
                                                    width: columnWidths.paciente,
                                                    render: (_, record) => (
                                                        <Text
                                                            ellipsis
                                                            title={`${record?.nombres?.trim()} ${record?.apellidos?.trim()}`}
                                                        >
                                                            <span
                                                                style={{
                                                                    color: "#515365",
                                                                    fontSize:
                                                                        "13px",
                                                                    fontWeight:
                                                                        "normal",
                                                                }}
                                                            >
                                                                {`${record?.nombres
                                                                    ?.trim()
                                                                    .split(
                                                                        " "
                                                                    )[0] ??
                                                                    ""
                                                                    } ${record?.apellidos
                                                                        ?.trim()
                                                                        .split(
                                                                            " "
                                                                        )[0] ??
                                                                    ""
                                                                    }`}
                                                            </span>
                                                        </Text>
                                                    ),
                                                },
                                                {
                                                    dataIndex: "tipo_cristal_od",
                                                    width: columnWidths.tipo_cristal_od,
                                                    key: "tipo_cristal_od",
                                                    render: (_, record) => record?.tipo_cristal_od || record?.tipo_cristal_oi || '-',
                                                },
                                                {
                                                    dataIndex: "created_at",
                                                    width: columnWidths.created_at,
                                                    key: "created_at",
                                                },
                                                {
                                                    dataIndex: "enviado",
                                                    width: columnWidths.enviado,
                                                    key: "enviado",
                                                },
                                                {
                                                    dataIndex: "entrada",
                                                    width: columnWidths.entrada,
                                                    key: "entrada",
                                                },
                                                {
                                                    dataIndex: "retiro",
                                                    width: columnWidths.retiro,
                                                    key: "retiro",
                                                },
                                                {
                                                    dataIndex: "doctor",
                                                    width: columnWidths.doctor,
                                                    key: "doctor",
                                                },
                                                {
                                                    dataIndex: "fase_actual",
                                                    width: columnWidths.fase,
                                                    key: "fase_actual",
                                                },
                                                {
                                                    dataIndex: "estado",
                                                    width: columnWidths.status,
                                                    key: "estado",
                                                    render: (__, record) => {
                                                        return (
                                                            <Tooltip
                                                                title={
                                                                    record?.estado
                                                                }
                                                            >
                                                                <span
                                                                    style={{
                                                                        display:
                                                                            "inline-block",
                                                                        width: "12px",
                                                                        height: "12px",
                                                                        borderRadius:
                                                                            "50%",
                                                                        backgroundColor:
                                                                            record?.estado ===
                                                                                "OK"
                                                                                ? "green"
                                                                                : record?.estado ===
                                                                                    "Advertencia"
                                                                                    ? "yellow"
                                                                                    : record?.estado ===
                                                                                        "Crítico"
                                                                                        ? "red"
                                                                                        : record?.estado ===
                                                                                            "Completado"
                                                                                            ? "blue"
                                                                                            : "gray",
                                                                    }}
                                                                ></span>
                                                            </Tooltip>
                                                        );
                                                    },
                                                },
                                                {
                                                    title: "Acciones",
                                                    key: "acciones",
                                                    width: columnWidths.acciones,
                                                    render: (
                                                        _,
                                                        record,
                                                        index
                                                    ) => (
                                                        <>
                                                            <Button
                                                                size="large"
                                                                icon={
                                                                    <FilePdfOutlined />
                                                                }
                                                                onClick={() => {
                                                                    handleVerCorrecion(
                                                                        record.correccion_id,
                                                                        record.nro_orden_id +
                                                                        "-C" +
                                                                        (parseFloat(
                                                                            index
                                                                        ) +
                                                                            1)
                                                                    );
                                                                }}
                                                                style={{
                                                                    marginRight:
                                                                        "8px",
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "center",
                                                                    backgroundColor:
                                                                        "#4361EE",
                                                                    color: "#fff",
                                                                }}
                                                            />
                                                            <Button
                                                                size="large"
                                                                icon={
                                                                    <EyeOutlined />
                                                                }
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/ver-correcion-orden/${record.correccion_id}`
                                                                    )
                                                                }
                                                                style={{
                                                                    marginRight:
                                                                        "8px",
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "center",
                                                                    backgroundColor:
                                                                        "#1890ff",
                                                                    color: "#fff",
                                                                }}
                                                            />
                                                            <Button
                                                                size="large"
                                                                icon={
                                                                    <EditOutlined />
                                                                }
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/correciones-ordenes/${record.correccion_id}`,
                                                                    )
                                                                }
                                                                style={{
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "center",
                                                                    backgroundColor:
                                                                        "#f39c12",
                                                                    borderColor:
                                                                        "#f39c12",
                                                                    color: "#fff",
                                                                    opacity: record?.cancelada ? 0.5 : 1,
                                                                }}
                                                                disabled={
                                                                    record?.cancelada
                                                                }
                                                            />
                                                        </>
                                                    ),
                                                },
                                            ]}
                                            rowClassName={(record) => (record.cancelada ? 'fila-cancelada' : '')}
                                            dataSource={correcionesbyOrden}
                                            rowKey="nro_orden_id"
                                            pagination={false}
                                            showHeader={false}
                                            size="small"
                                        />
                                    ),
                                    rowExpandable: (record) =>
                                        !!record.correcciones,
                                    expandedRowKeys,
                                    onExpand: handleExpand,
                                }}
                            />
                            {status === "failed" && (
                                <p style={{ color: "red" }}>Error: {error}</p>
                            )}
                            <Modal
                                open={showOrden}
                                zIndex={1000000000}
                                width={1600}
                                closable={false}
                                footer={null}
                                height="100%"
                                centered={false}
                            >
                                {OrdenId !== null && (
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <button
                                            onClick={() =>
                                                handleVerOrdenSize(OrdenId)
                                            }
                                            className="btn btn-danger"
                                        >
                                            Ticket
                                        </button>
                                    </div>
                                )}

                                {loadingPdf ? (
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Skeleton.Node
                                            active
                                            style={{
                                                width: 1500,
                                                height: 600,
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <div>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    class="bi bi-file-pdf"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1" />
                                                    <path d="M4.603 12.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.6 11.6 0 0 0-1.997.406 11.3 11.3 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.244.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 5.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z" />
                                                </svg>
                                            </div>
                                        </Skeleton.Node>
                                    </div>
                                ) : urlPdfOrden ? (
                                    <iframe
                                        src={urlPdfOrden}
                                        title=""
                                        width="100%"
                                        height="800px"
                                        style={{ border: "none" }}
                                    />
                                ) : (
                                    "PDF no disponible"
                                )}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <button
                                        onClick={() => {
                                            setShowOrden(false);
                                            setUrlPdfOrden(null);
                                        }}
                                        className="btn btn-danger"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </Modal>
                            <Modal
                                open={showOrdenSize}
                                zIndex={1000000000}
                                width={1600}
                                closable={false}
                                footer={null}
                                height="100%"
                                centered={false}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <button
                                        onClick={() => handleVerOrden(OrdenId)}
                                        className="btn btn-danger"
                                    >
                                        A4
                                    </button>
                                </div>

                                {loadingPdfSize ? (
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Skeleton.Node
                                            active
                                            style={{
                                                width: 1500,
                                                height: 600,
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <div>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    class="bi bi-file-pdf"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1" />
                                                    <path d="M4.603 12.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.6 11.6 0 0 0-1.997.406 11.3 11.3 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.244.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 5.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z" />
                                                </svg>
                                            </div>
                                        </Skeleton.Node>
                                    </div>
                                ) : urlPdfOrdenSize ? (
                                    <iframe
                                        src={urlPdfOrdenSize}
                                        title=""
                                        width="100%"
                                        height="800px"
                                        style={{ border: "none" }}
                                    />
                                ) : (
                                    "PDF no disponible"
                                )}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <button
                                        onClick={() => {
                                            setShowOrdenSize(false);
                                            setUrlPdfOrdenSize(null);
                                        }}
                                        className="btn btn-danger"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdenesCentilab;