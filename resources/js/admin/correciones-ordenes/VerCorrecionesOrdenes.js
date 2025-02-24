import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { eliminarRecetas } from '../../redux/features/recetas/eliminarRecetasSlice';
import Swal from 'sweetalert2';
import { deleteOrdenes, fecthOrdenes, fetchContactoOrdenesDelPaciente, setFechaRange, setOrden, setOrdenPor, updateOrden, verOrdenPdf } from '../../redux/features/ordenes/ordenesSlice';
import dayjs from 'dayjs';
import { Modal, Skeleton, Button, Tooltip, Select, Table, Space, Tag } from 'antd';
import {
    EyeOutlined,
    WhatsAppOutlined
} from '@ant-design/icons';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice';
import DateRangePicker from '../reportes/DateRangePicker';
import PaginationOrdenes from '../ordenes/PaginationOrdenes';
import { fecthCorrecionesOrdenes } from '../../redux/features/correciones-ordenes/correcionesOrdenesSlice';
import PaginationCorrecionesOrdenes from './PaginationCorrecionesOrdenes';


const VerCorrecionesOrdenes = () => {
    const dispatch = useDispatch();
    const pagado = useSelector((state) => state.fasesOrdenes.pagado);
    const tipoLente = useSelector((state) => state.fasesOrdenes.tipoLente);
    const laboratorio = useSelector((state) => state.fasesOrdenes.laboratorio);
    const fase = useSelector((state) => state.fasesOrdenes.fase);
    const sucursal = useSelector((state) => state.fasesOrdenes.sucursal);
    const statusOrden = useSelector((state) => state.fasesOrdenes.statusOrden);
    const fechaInicio = useSelector((state) => state.fasesOrdenes.fechaInicio);
    const fechaFin = useSelector((state) => state.fasesOrdenes.fechaFin);

    const {
        correcionesordenes,
        status,
        error,
        meta,
        totalPages,
        sortColumn,
        sortOrder } = useSelector((state) => state.correcionesordenes);
    const {
        contactoOrden,
     } = useSelector((state) => state.ordenes);

    const [currentPage, setCurrentPage] = useState(1);
    const [showOrden, setShowOrden] = useState(false);
    const [showContacto, setShowContacto] = useState(false);
    const [urlPdfOrden, setUrlPdfOrden] = useState(null)
    const [loadingPdf, setLoadingPdf] = useState(false)
    const [pagadoFilter, setPagadoFilter] = useState(pagado || []);
    const [sucursalFilter, setSucursalFilter] = useState(sucursal || []);
    const [laboratorioFilter, setLaboratorioFilter] = useState(laboratorio || []);
    const [faseFilter, setFaseFilter] = useState(fase || []);
    const [lenteContactoFilter, setLenteContactoFilter] = useState(tipoLente || []);
    const [statusFilter, setStatusFilter] = useState(statusOrden || []);
    const [localEndDate, setLocalEndDate] = useState(fechaFin);
    const [localStartDate, setLocalStartDate] = useState(fechaInicio);

    useEffect(() => {
        dispatch(fecthCorrecionesOrdenes({
            page: currentPage,
            limit: 10,
            sortColumn,
            sortOrder,
        }));
    }, [dispatch,
        currentPage,
        sortColumn,
        sortOrder]);

    const handleSort = (newOrdenPor) => {
        const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        dispatch(setOrden(newOrder));
        dispatch(setOrdenPor(newOrdenPor));
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    const formatDate = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`
    }


    const handleEliminarOrden = async (id_orden) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "¡No podrás recuperar esta orden después de eliminarla!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                await dispatch(deleteOrdenes(id_orden));
                dispatch(fecthOrdenes({ page: currentPage, limit: 20, sortOrder, sortColumn }));

                Swal.fire(
                    'Eliminado!',
                    'La orden ha sido eliminada.',
                    'success'
                );
            }
        } catch (error) {
            Swal.fire(
                'Error',
                'Hubo un problema al eliminar la orden.',
                'error'
            );
        }
    };

    const handleVerContacto = async (id_orden) => {
        const rpta = await dispatch(fetchContactoOrdenesDelPaciente(id_orden))
        if (rpta) {
            setShowContacto(true)
        } else {
            Swal.fire(
                'Error',
                'Hubo un problema al cargar los datos.',
                'error'
            );
        }
    }

    const handleVerOrden = async (id_orden) => {

        try {
            setLoadingPdf(true)
            setShowOrden(true)
            const url = await dispatch(verOrdenPdf(id_orden))
            if (url) {
                setUrlPdfOrden(url.payload)
            } else {
                Swal.fire(
                    'Error',
                    'Hubo un problema al visualizar la orden.',
                    'error'
                );
            }
        } catch (error) {
            console.log(error)
            Swal.fire(
                'Error',
                'Hubo un problema al visualizar la orden.',
                'error'
            );
            setLoadingPdf(false)
        }
        setLoadingPdf(false)
    }
    const handleLenteContactoChange = (value) => {
        setLenteContactoFilter(value);
    };
    const handleStatusChange = (value) => {
        setStatusFilter(value);
    };

    const handlePagadoChange = (value) => {
        setPagadoFilter(value);
    };

    const handleSucursalChange = (value) => {
        setSucursalFilter(value);
    };

    const handleLaboratorioChange = (value) => {
        setLaboratorioFilter(value);
    };

    const handleFaseChange = (value) => {
        setFaseFilter(value);
    };

    const handleDateChange = () => {
        dispatch(setFechaRange({ startDate: localStartDate, endDate: localEndDate }));
    };

    return (

        <div className="row layout-top-spacing">
            <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
                <div className="widget-content-area br-4">
                    <div className="widget-one">
                        <div
                            className="row layout-top-spacing"
                            id="cancel-row"
                        >
                            <div className="col-xl-12 col-lg-12 col-sm-12  layout-spacing">
                                <div className="widget-content widget-content-area br-6">
                                    <div style={{ width: '100%' }}>                                                         
                                    </div>
                                    <div
                                        className="dataTables_wrapper container-fluid dt-bootstrap4"
                                        id="zero-config_wrapper"
                                    >
                                        <div className="table-responsive">
                                            {status === 'loading' && <p>Loading...</p>}
                                            {status === 'failed' && <p>Error: {error}</p>}
                                            {status === 'succeeded' && (
                                                <table
                                                    aria-describedby="zero-config_info"
                                                    className="table dt-table-hover tablaSucursal dataTable"
                                                    id="zero-config"
                                                    role="grid"
                                                    style={{
                                                        width: '100%'
                                                    }}
                                                >
                                                    <thead>
                                                        <tr role="row">
                                                            <th
                                                                aria-controls="zero-config"
                                                                aria-label={`nro_orden: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                                                aria-sort="descending"
                                                                className="sorting_desc"
                                                                colSpan="1"
                                                                rowSpan="1"
                                                                style={{
                                                                    width: '527px'
                                                                }}
                                                                tabIndex="0"
                                                                onClick={() => handleSort('nro_orden')}
                                                            >
                                                                Nro_Orden
                                                            </th>
                                                            <th
                                                                style={{
                                                                    width: '800px'
                                                                }}>
                                                                Pagado
                                                            </th>
                                                            <th
                                                                aria-controls="zero-config"
                                                                aria-label={`created_at: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                                                className="sorting"
                                                                colSpan="1"
                                                                rowSpan="1"
                                                                style={{
                                                                    width: '299px'
                                                                }}
                                                                tabIndex="0"
                                                                onClick={() => handleSort('created_at')}
                                                            >
                                                                Fecha de creacion
                                                            </th>
                                                            <th
                                                                aria-controls="zero-config"
                                                                aria-label={`Nombre: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                                                aria-sort="descending"
                                                                className="sorting_desc"
                                                                colSpan="1"
                                                                rowSpan="1"
                                                                style={{
                                                                    width: '527px'
                                                                }}
                                                                tabIndex="0"
                                                                onClick={() => handleSort('sucursal')}
                                                            >
                                                                Sucursal
                                                            </th>
                                                            <th
                                                                aria-controls="zero-config"
                                                                aria-label={`paciente_nombre_completo: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                                                className="sorting"
                                                                colSpan="1"
                                                                rowSpan="1"
                                                                style={{
                                                                    width: '266px'
                                                                }}
                                                                tabIndex="0"
                                                                onClick={() => handleSort('paciente_nombre_completo')}
                                                            >
                                                                Paciente
                                                            </th>
                                                            <th
                                                                aria-controls="zero-config"
                                                                aria-label={`celular: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                                                className="sorting"
                                                                colSpan="1"
                                                                rowSpan="1"
                                                                style={{
                                                                    width: '266px'
                                                                }}
                                                                tabIndex="0"
                                                                onClick={() => handleSort('celular')}
                                                            >
                                                                Celular
                                                            </th>
                                                            <th
                                                                aria-controls="zero-config"
                                                                aria-label={`Doctor: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                                                className="sorting"
                                                                colSpan="1"
                                                                rowSpan="1"
                                                                style={{
                                                                    width: '266px'
                                                                }}
                                                                tabIndex="0"
                                                                onClick={() => handleSort('DOCTOR')}
                                                            >
                                                                Laboratorio
                                                            </th>
                                                            <th
                                                                aria-controls="zero-config"
                                                                aria-label={`Doctor: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                                                className="sorting"
                                                                colSpan="1"
                                                                rowSpan="1"
                                                                style={{
                                                                    width: '266px'
                                                                }}
                                                                tabIndex="0"
                                                                onClick={() => handleSort('DOCTOR')}
                                                            >
                                                                Fase
                                                            </th>
                                                            <th
                                                                aria-controls="zero-config"
                                                                aria-label={`Doctor: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                                                className="sorting"
                                                                colSpan="1"
                                                                rowSpan="1"
                                                                style={{
                                                                    width: '266px'
                                                                }}
                                                                tabIndex="0"
                                                                onClick={() => handleSort('DOCTOR')}
                                                            >
                                                                Status
                                                            </th>
                                                            <th
                                                                aria-controls="zero-config"
                                                                aria-label="Action: activate to sort column ascending"
                                                                className="text-center dt-no-sorting sorting"
                                                                colSpan="1"
                                                                rowSpan="1"
                                                                style={{
                                                                    width: '314px'
                                                                }}
                                                                tabIndex="0"

                                                            >
                                                                Action
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {correcionesordenes.map((correcionorden) => (
                                                            <tr key={correcionorden.id}>
                                                                <td style={{ display: 'flex', alignItems: 'center' }}>
                                                                    {correcionorden.nro_orden}
                                                                    {correcionorden.lente_contacto ? (
                                                                        <img
                                                                            src="assets/img/recetas/lentesdecontacto.png"
                                                                            alt="Lente Contacto True"
                                                                            style={{ width: '20px', marginLeft: '8px' }}
                                                                        />
                                                                    ) : (
                                                                        <img
                                                                            src="assets/img/recetas/lentenormal.png"
                                                                            alt="Lente Contacto False"
                                                                            style={{ width: '20px', marginLeft: '8px' }}
                                                                        />
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        className={`btn btn-xs ${parseInt(correcionorden.pagado_orden) === 1
                                                                            ? 'btn-success'
                                                                            : parseInt(correcionorden.pagado_orden) === 2
                                                                                ? 'btn-warning'
                                                                                : 'btn-danger'
                                                                            }`}
                                                                        onClick={() => handlePagoToggle(correcionorden.ordenes_id, parseInt(correcionorden.pagado_orden), correcionorden.nro_orden)}
                                                                        style={{ minWidth: '100px' }}
                                                                    >
                                                                        {parseInt(correcionorden.pagado_orden) === 1
                                                                            ? 'pagado'
                                                                            : parseInt(correcionorden.pagado_orden) === 2
                                                                                ? 'abonado'
                                                                                : 'Cortesia'}
                                                                    </button>
                                                                </td>
                                                                <td>{dayjs(correcionorden.created_at).format('DD/MM/YYYY')}</td>
                                                                <td>{correcionorden?.sucursal || ""}</td>
                                                                <td>{
                                                                    correcionorden?.paciente_nombre_completo
                                                                }</td>
                                                                <td>{correcionorden?.celular || ""}</td>
                                                                <td>{correcionorden?.laboratorio || ""}</td>
                                                                <td>{correcionorden?.fase_actual || ""}</td>
                                                                <td>
                                                                    <Tooltip title={correcionorden?.status ?? ""}>
                                                                        <span
                                                                            style={{
                                                                                display: 'inline-block',
                                                                                width: '12px',
                                                                                height: '12px',
                                                                                borderRadius: '50%',
                                                                                backgroundColor:
                                                                                    correcionorden?.status === 'Ok'
                                                                                        ? 'green'
                                                                                        : correcionorden?.status === 'Advertencia'
                                                                                            ? 'yellow'
                                                                                            : correcionorden?.status === 'Critico'
                                                                                                ? 'red'
                                                                                                : correcionorden?.status === 'Completado'
                                                                                                    ? 'blue'
                                                                                                    : 'gray',
                                                                            }}
                                                                        ></span>{" "}
                                                                    </Tooltip>
                                                                </td>
                                                                <td >
                                                                    <div className="btn-group">

                                                                        <Link
                                                                            to={`/correciones-ordenes/${correcionorden.ordenes_id}`}
                                                                            className="btn btn-warning btnEditarReceta"
                                                                            state={{
                                                                                correcionorden                                                                                                                                                     
                                                                            }}
                                                                            data-target="#modalEditarSucursal"
                                                                            data-toggle="modal"
                                                                            id_receta="185"
                                                                        >
                                                                            <svg
                                                                                className="h-6 w-6"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                viewBox="0 0 24 24"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                            >
                                                                                <path
                                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                                    strokeLinecap="modalEditarSucursal"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth="2"
                                                                                />
                                                                            </svg>
                                                                        </Link>
                                                                        <Link
                                                                            to={`/ver-orden/${correcionorden.ordenes_id}`}
                                                                            className="btn btn-info"
                                                                            style={{ display: 'flex', alignItems: 'center' }}
                                                                        // state={{ orden }}
                                                                        >

                                                                            <path
                                                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                                strokeLinecap="modalEditarSucursal"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth="2"
                                                                            />

                                                                            <EyeOutlined />
                                                                        </Link>
                                                                        <button
                                                                            onClick={() => handleVerOrden(correcionorden.ordenes_id)}
                                                                            className="btn btn-primary"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-pdf" viewBox="0 0 16 16">
                                                                                <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1" />
                                                                                <path d="M4.603 12.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.6 11.6 0 0 0-1.997.406 11.3 11.3 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.244.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 5.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z" />
                                                                            </svg>
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleVerContacto(correcionorden.ordenes_id)}
                                                                            className="btn btn-info"
                                                                            style={{ display: 'flex', alignItems: 'center', background: 'green' }}
                                                                        >
                                                                            <WhatsAppOutlined />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleEliminarOrden(correcionorden.ordenes_id)}
                                                                            borrar_receta="185"
                                                                            className="btn btn-danger btnEliminarReceta"
                                                                        >
                                                                            <svg
                                                                                className="h-6 w-6"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                viewBox="0 0 24 24"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                            >
                                                                                <path
                                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth="2"
                                                                                />
                                                                            </svg>
                                                                        </button>

                                                                    </div>
                                                                </td>

                                                            </tr>
                                                        ))}

                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <th
                                                                colSpan="1"
                                                                rowSpan="1"
                                                            >
                                                                Nro_Orden
                                                            </th>
                                                            <th
                                                                colSpan="1"
                                                                rowSpan="1"
                                                            >
                                                                Pagado
                                                            </th>
                                                            <th
                                                                colSpan="1"
                                                                rowSpan="1"
                                                            >
                                                                Fecha de ingreso
                                                            </th>
                                                            <th
                                                                colSpan="1"
                                                                rowSpan="1"
                                                            >
                                                                Sucursal
                                                            </th>
                                                            <th
                                                                colSpan="1"
                                                                rowSpan="1"
                                                            >
                                                                Paciente
                                                            </th>
                                                            <th
                                                                colSpan="1"
                                                                rowSpan="1"
                                                            >
                                                                Celular
                                                            </th>
                                                            <th
                                                                colSpan="1"
                                                                rowSpan="1"
                                                            >
                                                                Laboratorio
                                                            </th>
                                                            <th
                                                                colSpan="1"
                                                                rowSpan="1"
                                                            >
                                                                Fase
                                                            </th>
                                                            <th
                                                                colSpan="1"
                                                                rowSpan="1"
                                                            >
                                                                Status
                                                            </th>
                                                            <th
                                                                colSpan="1"
                                                                rowSpan="1"
                                                            >
                                                                Action
                                                            </th>
                                                            <th
                                                                className="invisible"
                                                                colSpan="1"
                                                                rowSpan="1"
                                                            />
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            )}
                                            <PaginationCorrecionesOrdenes
                                                meta={meta}
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                onPageChange={handlePageChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                open={showOrden}
                zIndex={1000000000}
                width={1600}
                closable={false}
                footer={null}
                height='100%'
                centered={false}
            >
                {
                    loadingPdf
                        ? <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Skeleton.Node
                                active
                                style={{
                                    width: 1500,
                                    height: 600,
                                    marginBottom: '10px'
                                }}
                            >
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-pdf" viewBox="0 0 16 16">
                                        <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1" />
                                        <path d="M4.603 12.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.6 11.6 0 0 0-1.997.406 11.3 11.3 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.244.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 5.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z" />
                                    </svg>
                                </div>
                            </Skeleton.Node>
                        </div>
                        : urlPdfOrden
                            ? <iframe
                                src={urlPdfOrden}
                                title=""
                                width="100%"
                                height="800px"
                                style={{ border: 'none' }}
                            />
                            : 'PDF no disponible'
                }

                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <button
                        onClick={() => {
                            setShowOrden(false)
                            setUrlPdfOrden(null)
                        }}
                        className='btn btn-danger'
                    >Cerrar</button>
                </div>
            </Modal>
            <Modal
                open={showContacto}
                zIndex={1000000000}
                width={1000}
                closable={true}
                onClose={() => setShowContacto(false)}
                footer={null}
                onCancel={() => setShowContacto(false)}
                height='100%'
                centered={false}>
                <div style={{ marginTop: '20px' }}>
                    <div style={{ marginBottom: '10px', fontWeight: 600, fontSize: '18px' }}>Veces contactada: {contactoOrden.length}</div>
                    <Table
                        className='Table-Orden-Contacts'
                        columns={[
                            { title: 'Usuario', dataIndex: 'nombre', key: 'nombre' },
                            {
                                title: 'Fecha',
                                dataIndex: 'created_at',
                                key: 'created_at',
                                render: (text, record) => {
                                    return formatDate(text)
                                }
                            },
                        ]}
                        dataSource={contactoOrden}
                    />

                </div>
            </Modal>
        </div>
    )
}

export default VerCorrecionesOrdenes