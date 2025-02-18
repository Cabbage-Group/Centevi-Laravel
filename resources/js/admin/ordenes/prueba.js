import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  EyeOutlined,
  WhatsAppOutlined
} from '@ant-design/icons';
import { deleteOrdenes, fecthOrdenes, fetchContactoOrdenesDelPaciente, updateOrden, verOrdenPdf, setFechaRange, setOrden, setOrdenPor, verCorrecionPdf, verOrdenPdfSize, setOrderId, verOrdenPdfSmall } from '../../redux/features/ordenes/ordenesSlice';
import { deleteCorreccionesOrdenes, fecthCorrecionesOrdenes, fetchContactoCorreccionesOrdenesDelPaciente, fetchCorreccionesByOrdenId } from '../../redux/features/correciones-ordenes/correcionesOrdenesSlice';
import { Modal, Tooltip, Skeleton, Table } from 'antd';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import PaginationOrdenes from './PaginationOrdenes';
import { funPermisosObtenidosBoolean } from '../../utils/ValidarPermisos.js';

const CollapsibleTable = (
  {
    search,
    pagadoFiltro,
    sucursalFiltro,
    laboratorioFiltro,
    faseFiltro,
    lenteContactoFiltro,
    statusFiltro,
    localEndDateFiltro,
    localStartDateFiltro,
    currentPageTable,
    setCurrentPageTable
  }

) => {
  const dispatch = useDispatch();
  const [collapsedordens, setCollapsedordens] = useState();
  const [selectedOrdenId, setSelectedOrdenId] = useState(null);
  const [showOrden, setShowOrden] = useState(false);
  const [showOrdenSize, setShowOrdenSize] = useState(false);
  const [urlPdfOrdenSize, setUrlPdfOrdenSize] = useState(null)
  const [loadingPdfSize, setLoadingPdfSize] = useState(false)
  const [showOrdenSmall, setShowOrdenSmall] = useState(false);
  const [urlPdfOrdenSmall, setUrlPdfOrdenSmall] = useState(null)
  const [loadingPdfSmall, setLoadingPdfSmall] = useState(false)
  const {
    ordenes,
    status,
    error,
    meta,
    startDate,
    endDate,
    contactoOrden,
    totalPages,
    sortColumn,
    sortOrder
  } = useSelector((state) => state.ordenes);
  const OrdenId = useSelector((state) => state.ordenes.OrderId)
  const {
    correcionesbyOrden,
    contactoCorreccionOrden
  } = useSelector((state) => state.correcionesordenes);
  const { permisos } = useSelector((state) => state.auth);

  const [urlPdfOrden, setUrlPdfOrden] = useState(null)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const currentPage = currentPageTable;
  const [showContacto, setShowContacto] = useState(false);
  const [showContactoCorreccion, setShowContactoCorrecion] = useState(false);

  console.log('OrdenId', OrdenId);

  useEffect(() => {
    dispatch(fecthOrdenes({
      page: currentPageTable,
      limit: 20,
      sortColumn,
      sortOrder,
      search: search,
      startDate,
      endDate,
      pagado: pagadoFiltro,
      sucursal: sucursalFiltro,
      status: statusFiltro,
      lenteContacto: lenteContactoFiltro,
      fase: faseFiltro,
      laboratorio: laboratorioFiltro,


    }));
  }, [
    dispatch,
    currentPageTable,
    sortColumn,
    sortOrder,
    search,
    pagadoFiltro,
    sucursalFiltro,
    statusFiltro,
    lenteContactoFiltro,
    faseFiltro,
    laboratorioFiltro,
    startDate,
    endDate
  ]);

  useEffect(() => {
    if (selectedOrdenId) {
      dispatch(fetchCorreccionesByOrdenId(selectedOrdenId)); // Llamar a la API con el ID de la orden
    }
  }, [dispatch, selectedOrdenId]);

  const handlePageChange = (page) => {
    setCurrentPageTable(page); // Esta función debe venir como prop del padre
  };

  const toggleorden = (index, ordenId) => {
    setCollapsedordens(prevIndex => (prevIndex === index ? null : index));

    if (collapsedordens !== index) {
      setSelectedOrdenId(ordenId);
      dispatch(fetchCorreccionesByOrdenId(ordenId));
    }
  };


  const handlePagoToggle = async (id_orden, estadoActual) => {
    try {
      const estado = parseInt(estadoActual);
      let nuevoEstado;
      if (estado === 0) {
        nuevoEstado = 2;
      } else if (estado === 2) {
        nuevoEstado = 1;
      } else {
        nuevoEstado = 0;
      }

      const payload = {
        pagado: nuevoEstado
      };

      await dispatch(updateOrden({ id_orden, data: payload })).unwrap();
      dispatch(fecthOrdenes({
        page: currentPage,
        limit: 20,
        sortColumn,
        sortOrder,
        search,
        startDate,
        endDate,
        pagado: pagadoFiltro,
        sucursal: sucursalFiltro,
        status: statusFiltro,
        lenteContacto: lenteContactoFiltro,
        fase: faseFiltro,
        laboratorio: laboratorioFiltro,
      }));
    } catch (err) {
      console.error('Error al actualizar el estado de pagado:', err);
    }
  };

  const handleVerOrden = async (id_orden) => {

    try {
      setShowOrdenSize(false)
      setLoadingPdf(true)
      setShowOrden(true)
      const url = await dispatch(verOrdenPdf(id_orden))
      if (url) {
        dispatch(setOrderId(id_orden))
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

  const handleVerOrdenSize = async (id_orden) => {

    try {
      setShowOrden(false)
      setLoadingPdfSize(true)
      setShowOrdenSize(true)
      const url = await dispatch(verOrdenPdfSize(id_orden))
      if (url) {
        setUrlPdfOrdenSize(url.payload)
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
      setLoadingPdfSize(false)
    }
    setLoadingPdfSize(false)
  }

  const handleVerOrdenSmall = async (id_orden) => {

    try {
      setShowOrdenSmall(false)
      setLoadingPdfSmall(true)
      setShowOrdenSmall(true)
      const url = await dispatch(verOrdenPdfSmall(id_orden))
      if (url) {
        setUrlPdfOrdenSmall(url.payload)
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
      setLoadingPdfSmall(false)
    }
    setLoadingPdfSmall(false)
  }

  const handleVerCorrecion = async (id_correcion, numero_correcion) => {

    try {
      setLoadingPdf(true)
      setShowOrden(true)
      console.log("empezar");

      const url = await dispatch(verCorrecionPdf({ id_correcion, numero_correcion }))
      console.log("empezar2");
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
        dispatch(fecthOrdenes({
          page: currentPage,
          limit: 20,
          sortColumn,
          sortOrder,
          search: search,
          startDate,
          endDate,
          pagado: pagadoFiltro,
          sucursal: sucursalFiltro,
          status: statusFiltro,
          lenteContacto: lenteContactoFiltro,
          fase: faseFiltro,
          laboratorio: laboratorioFiltro,
        }));

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

  const handleEliminarCorrecionOrden = async (id_orden, index) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás recuperar esta corrección después de eliminarla!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await dispatch(deleteCorreccionesOrdenes(id_orden));
        setCollapsedordens(prevState => (prevState === index ? null : prevState));
        dispatch(fecthOrdenes({
          page: currentPage,
          limit: 20,
          sortColumn,
          sortOrder,
          search: search,
          startDate,
          endDate,
          pagado: pagadoFiltro,
          sucursal: sucursalFiltro,
          status: statusFiltro,
          lenteContacto: lenteContactoFiltro,
          fase: faseFiltro,
          laboratorio: laboratorioFiltro,
        }));

        // dispatch(fetchCorreccionesByOrdenId(id_orden));

        Swal.fire(
          'Eliminado!',
          'La corrección ha sido eliminada.',
          'success'
        );
      }
    } catch (error) {
      Swal.fire(
        'Error',
        'Hubo un problema al eliminar la corrección.',
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

  const handleVerContactoCorreccion = async (id) => {
    const rpta = await dispatch(fetchContactoCorreccionesOrdenesDelPaciente(id))
    if (rpta) {
      setShowContactoCorrecion(true)
    } else {
      Swal.fire(
        'Error',
        'Hubo un problema al cargar los datos.',
        'error'
      );
    }
  }

  const confirmPagoToggle = (id_orden, pagado, nro_orden) => {
    Swal.fire({
      title: 'Confirmación',
      text: "¿Está seguro de cambiar el estado de la orden?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        handlePagoToggle(id_orden, pagado, nro_orden)
      }
    });
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

  const columnWidths = {
    nroOrden: '10%',
    pagado: '10%',
    fecha: '12%',
    sucursal: '12%',
    paciente: '15%',
    celular: '8%',
    laboratorio: '10%',
    fase: '8%',
    status: '5%',
    action: '10%'
  };

  return (
    <div
      className="dataTables_wrapper container-fluid dt-bootstrap4"
      id="zero-config_wrapper"
    >
      <div className="table-responsive">
        {status === 'loading' && <p>Loading...</p>}
        {status === 'failed' && <p>Error: {error}</p>}
        {status === 'succeeded' && (
          <table className="table dt-table-hover tablaSucursal dataTable">
            <thead>
              <tr >

                <th style={{ width: columnWidths.nroOrden }}>Número de Orden</th>
                <th style={{ width: columnWidths.pagado }}>Pagado</th>
                <th style={{ width: columnWidths.fecha }}>Fecha de Creación</th>
                <th style={{ width: columnWidths.sucursal }}>Sucursal</th>
                <th style={{ width: columnWidths.paciente }}>Paciente</th>
                <th style={{ width: columnWidths.celular }}>Celular</th>
                <th style={{ width: columnWidths.laboratorio }}>Laboratorio</th>
                <th style={{ width: columnWidths.fase }}>Fase</th>
                <th style={{ width: columnWidths.status }}>Status</th>
                <th style={{ width: columnWidths.action }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {ordenes?.map((orden, index) => (
                <React.Fragment key={orden?.id_orden}>
                  <tr>
                    <td>
                      {orden?.correccion ? (
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => toggleorden(index, orden?.id_orden)}
                        >
                          {collapsedordens === index ? '▲' : '▼'}
                        </span>
                      ) : null}

                      {orden?.nro_orden_id}
                      {orden?.lente_contacto ? (
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
                        className={`btn btn-xs ${parseInt(orden.pagado) === 1
                          ? 'btn-success'
                          : parseInt(orden.pagado) === 2
                            ? 'btn-warning'
                            : 'btn-danger'
                          }`}
                        // onClick={() => handlePagoToggle(orden.id_orden, parseInt(orden.pagado))}
                        onClick={() => confirmPagoToggle(orden.id_orden, parseInt(orden.pagado))}
                        style={{ minWidth: '100px' }}
                      >
                        {parseInt(orden.pagado) === 1
                          ? 'pagado'
                          : parseInt(orden.pagado) === 2
                            ? 'abonado'
                            : 'Cortesia'}
                      </button>
                    </td>
                    <td onClick={() => console.log(orden)} >{orden?.created_at_formatted}</td>
                    <td >{orden?.sucursal?.nombre}</td>
                    <td>{`${orden.paciente?.nombres} ${orden?.paciente?.apellidos}`}</td>
                    <td>{orden?.paciente?.celular}</td>
                    <td>{orden?.laboratorio}</td>
                    <td>
                      <div>{orden?.fase_actual}</div>
                      <div>{orden?.elaborado_por_fase}</div>
                    </td>
                    <td>
                      <Tooltip title={orden?.status ?? ""}>
                        <span
                          style={{
                            display: 'inline-block',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor:
                              orden?.status === 'Ok'
                                ? 'green'
                                : orden?.status === 'Advertencia'
                                  ? 'yellow'
                                  : orden?.status === 'Critico'
                                    ? 'red'
                                    : orden?.status === 'Completado'
                                      ? 'blue'
                                      : 'gray',
                          }}
                        ></span>{" "}
                      </Tooltip>
                    </td>
                    <td>
                      <div className="btn-group">

                        <Link
                          to={`/orden-receta/${orden.id_orden}`}
                          className="btn btn-warning btnEditarReceta"
                          state={{
                            orden,
                            pagadoFiltro,
                            sucursalFiltro,
                            laboratorioFiltro,
                            faseFiltro,
                            lenteContactoFiltro,
                            statusFiltro,
                            localStartDateFiltro,
                            localEndDateFiltro
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
                          to={`/ver-orden/${orden.id_orden}`}
                          className="btn btn-info"
                          style={{ display: 'flex', alignItems: 'center' }}
                          state={{ orden }}
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
                          onClick={() => {
                            dispatch(setOrderId(orden.id_orden))
                            handleVerOrden(orden.id_orden)
                          }}
                          className="btn btn-primary"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-pdf" viewBox="0 0 16 16">
                            <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1" />
                            <path d="M4.603 12.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.6 11.6 0 0 0-1.997.406 11.3 11.3 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.244.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 5.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleVerOrdenSmall(orden.id_orden)}
                          className="btn"
                          style={{ background: '#EFF5FF' }}
                        >
                          <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.1211 2.87868C16.2424 2 14.8282 2 11.9998 2C9.17134 2 7.75712 2 6.87844 2.87868C6.38608 3.37105 6.16961 4.03157 6.07444 5.01484C6.63368 4.99996 7.25183 4.99998 7.92943 5H16.0706C16.748 4.99998 17.366 4.99996 17.9251 5.01483C17.8299 4.03156 17.6135 3.37105 17.1211 2.87868Z" fill="#1C274C" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M18 14.5C18 17.3284 18 20.2426 17.1213 21.1213C16.2426 22 14.8284 22 12 22C9.17158 22 7.75736 22 6.87868 21.1213C6 20.2426 6 17.3284 6 14.5H18ZM15.75 16.75C15.75 17.1642 15.4142 17.5 15 17.5H9C8.58579 17.5 8.25 17.1642 8.25 16.75C8.25 16.3358 8.58579 16 9 16H15C15.4142 16 15.75 16.3358 15.75 16.75ZM13.75 19.75C13.75 20.1642 13.4142 20.5 13 20.5H9C8.58579 20.5 8.25 20.1642 8.25 19.75C8.25 19.3358 8.58579 19 9 19H13C13.4142 19 13.75 19.3358 13.75 19.75Z" fill="#1C274C" />
                            <g opacity="0.5">
                              <path d="M15 17.5C15.4142 17.5 15.75 17.1642 15.75 16.75C15.75 16.3358 15.4142 16 15 16H9C8.58579 16 8.25 16.3358 8.25 16.75C8.25 17.1642 8.58579 17.5 9 17.5H15Z" fill="#1C274C" />
                              <path d="M13 20.5C13.4142 20.5 13.75 20.1642 13.75 19.75C13.75 19.3358 13.4142 19 13 19H9C8.58579 19 8.25 19.3358 8.25 19.75C8.25 20.1642 8.58579 20.5 9 20.5H13Z" fill="#1C274C" />
                            </g>
                            <path opacity="0.5" d="M16 6H8C5.17157 6 3.75736 6 2.87868 6.87868C2 7.75736 2 9.17157 2 12C2 14.8284 2 16.2426 2.87868 17.1213C3.37323 17.6159 4.03743 17.8321 5.02795 17.9266C4.99998 17.2038 4.99999 15.3522 5 14.5C4.72386 14.5 4.5 14.2761 4.5 14C4.5 13.7239 4.72386 13.5 5 13.5H19C19.2761 13.5 19.5 13.7239 19.5 14C19.5 14.2761 19.2761 14.5003 19 14.5003C19 15.3525 19 17.2039 18.9721 17.9266C19.9626 17.8321 20.6268 17.6159 21.1213 17.1213C22 16.2426 22 14.8284 22 12C22 9.17157 22 7.75736 21.1213 6.87868C20.2426 6 18.8284 6 16 6Z" fill="#1C274C" />
                            <path d="M9 10.75C9.41421 10.75 9.75 10.4142 9.75 10C9.75 9.58579 9.41421 9.25 9 9.25H6C5.58579 9.25 5.25 9.58579 5.25 10C5.25 10.4142 5.58579 10.75 6 10.75H9Z" fill="#1C274C" />
                            <path d="M18 10C18 10.5523 17.5523 11 17 11C16.4477 11 16 10.5523 16 10C16 9.44772 16.4477 9 17 9C17.5523 9 18 9.44772 18 10Z" fill="#1C274C" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleVerContacto(orden.id_orden)}
                          className="btn btn-info"
                          style={{ display: 'flex', alignItems: 'center', background: 'green' }}
                        >
                          <WhatsAppOutlined />
                        </button>

                        {
                          funPermisosObtenidosBoolean(permisos, 'sidebar.recetas.ordenes.eliminarorden')
                            ? <button
                              onClick={() => handleEliminarOrden(orden.id_orden)}
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
                            : null
                        }


                      </div>
                    </td>

                  </tr>

                  {collapsedordens === index && (
                    <tr>
                      <td colSpan="10" style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
                        <table className="table dt-table-hover">

                          <tbody>
                            {correcionesbyOrden
                              ?.filter(
                                (correcion) => correcion.ordenes_id === orden.id_orden
                              )
                              .map((correcion, idx) => (
                                <tr key={correcion.id}>

                                  <td style={{ width: columnWidths.nroOrden }}>
                                    {correcion.nro_orden_id}-C{idx + 1}
                                  </td>
                                  <td style={{ width: columnWidths.pagado }} >
                                    <button
                                      className={`btn btn-xs ${parseInt(orden.pagado) === 1
                                        ? 'btn-success'
                                        : parseInt(orden.pagado) === 2
                                          ? 'btn-warning'
                                          : 'btn-danger'
                                        }`}
                                      // onClick={() => handlePagoToggle(orden.id_orden, parseInt(orden.pagado), orden.nro_orden)}
                                      onAbort={async () => confirmPagoToggle(orden.id_orden, parseInt(orden.pagado), orden.nro_orden)}
                                      style={{ minWidth: '50px' }}
                                    >
                                      {parseInt(orden.pagado) === 1
                                        ? 'pagado'
                                        : parseInt(orden.pagado) === 2
                                          ? 'abonado'
                                          : 'Cortesia'}
                                    </button>
                                  </td>
                                  <td style={{ width: columnWidths.fecha }}>
                                    {new Date(correcion.created_at).toLocaleDateString('es-ES', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                    })}
                                  </td>
                                  <td onClick={() => console.log(correcion)} style={{ width: columnWidths.sucursal }}>{correcion.sucursal}</td>
                                  <td style={{ width: columnWidths.paciente }}>{correcion.paciente_nombre_completo}</td>
                                  <td style={{ width: columnWidths.celular }}>{correcion.celular}</td>
                                  <td style={{ width: columnWidths.laboratorio }}>{correcion.laboratorio}</td>
                                  <td style={{ width: columnWidths.fase }}>{correcion.fase_actual}</td>
                                  <td style={{ width: columnWidths.status }}>
                                    <Tooltip title={correcion?.status ?? ""}>
                                      <span
                                        style={{
                                          display: 'inline-block',
                                          width: '12px',
                                          height: '12px',
                                          borderRadius: '50%',
                                          backgroundColor:
                                            correcion?.status === 'Ok'
                                              ? 'green'
                                              : correcion?.status === 'Advertencia'
                                                ? 'yellow'
                                                : correcion?.status === 'Critico'
                                                  ? 'red'
                                                  : correcion?.status === 'Completado'
                                                    ? 'blue'
                                                    : 'gray',
                                        }}
                                      ></span>{" "}
                                    </Tooltip>
                                  </td>
                                  <td>
                                    <div className="btn-group">

                                      <Link
                                        to={`/correciones-ordenes/${correcion.id}`}
                                        className="btn btn-warning btnEditarReceta"
                                        state={{
                                          correcion,
                                          pagadoFiltro,
                                          sucursalFiltro,
                                          laboratorioFiltro,
                                          faseFiltro,
                                          lenteContactoFiltro,
                                          statusFiltro,
                                          localStartDateFiltro,
                                          localEndDateFiltro

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
                                        to={`/ver-correcion-orden/${correcion.id}`}
                                        className="btn btn-info"
                                        style={{ display: 'flex', alignItems: 'center' }}
                                        state={{ correcion }}
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
                                        onClick={() => handleVerCorrecion(correcion.id, correcion.nro_orden_id + "-C" + (parseFloat(idx) + 1))}
                                        className="btn btn-primary"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-pdf" viewBox="0 0 16 16">
                                          <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1" />
                                          <path d="M4.603 12.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.6 11.6 0 0 0-1.997.406 11.3 11.3 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.244.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 5.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z" />
                                        </svg>
                                      </button>
                                      <button
                                        onClick={() => handleVerContactoCorreccion(correcion.id)}
                                        className="btn btn-info"
                                        style={{ display: 'flex', alignItems: 'center', background: 'green' }}
                                      >
                                        <WhatsAppOutlined />
                                      </button>
                                      {
                                        funPermisosObtenidosBoolean(permisos, 'sidebar.recetas.ordenes.eliminarorden')
                                          ? <button
                                            onClick={() => handleEliminarCorrecionOrden(correcion.id, index)}
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
                                          : null
                                      }

                                    </div>
                                  </td>

                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th
                  colSpan="1"
                  ordenSpan="1"
                >
                  Nro_Orden
                </th>
                <th
                  colSpan="1"
                  ordenSpan="1"
                >
                  Pagado
                </th>
                <th
                  colSpan="1"
                  ordenSpan="1"
                >
                  Fecha de ingreso
                </th>
                <th
                  colSpan="1"
                  ordenSpan="1"
                >
                  Sucursal
                </th>
                <th
                  colSpan="1"
                  ordenSpan="1"
                >
                  Paciente
                </th>
                <th
                  colSpan="1"
                  ordenSpan="1"
                >
                  Celular
                </th>
                <th
                  colSpan="1"
                  ordenSpan="1"
                >
                  Laboratorio
                </th>
                <th
                  colSpan="1"
                  ordenSpan="1"
                >
                  Fase
                </th>
                <th
                  colSpan="1"
                  ordenSpan="1"
                >
                  Status
                </th>
                <th
                  colSpan="1"
                  ordenSpan="1"
                >
                  Action
                </th>
                <th
                  className="invisible"
                  colSpan="1"
                  ordenSpan="1"
                />
              </tr>
            </tfoot>
          </table>
        )}
        <PaginationOrdenes
          meta={meta}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <Modal
        open={showOrden}
        zIndex={1000000000}
        width={1600}
        closable={false}
        footer={null}
        height='100%'
        centered={false}
      >{
          OrdenId !== null && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => handleVerOrdenSize(OrdenId)}
                className="btn btn-danger">
                Ticket
              </button>
            </div>
          )
        }

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
        open={showOrdenSize}
        zIndex={1000000000}
        width={1600}
        closable={false}
        footer={null}
        height='100%'
        centered={false}
      >

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => handleVerOrden(OrdenId)}
            className="btn btn-danger">
            A4
          </button>
        </div>

        {
          loadingPdfSize
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
            : urlPdfOrdenSize
              ? <iframe
                src={urlPdfOrdenSize}
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
              setShowOrdenSize(false)
              setUrlPdfOrdenSize(null)
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
      <Modal
        open={showOrdenSmall}
        zIndex={1000000000}
        width={1600}
        closable={false}
        footer={null}
        height='100%'
        centered={false}
      >
        {
          loadingPdfSmall
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
            : urlPdfOrdenSmall
              ? <iframe
                src={urlPdfOrdenSmall}
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
              setShowOrdenSmall(false)
              setUrlPdfOrdenSmall(null)
            }}
            className='btn btn-danger'
          >Cerrar</button>
        </div>
      </Modal>
      <Modal
        open={showContactoCorreccion}
        zIndex={1000000000}
        width={1000}
        closable={true}
        onClose={() => setShowContactoCorrecion(false)}
        footer={null}
        onCancel={() => setShowContactoCorrecion(false)}
        height='100%'
        centered={false}>
        <div style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '10px', fontWeight: 600, fontSize: '18px' }}>Veces contactada: {contactoCorreccionOrden.length}</div>
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
            dataSource={contactoCorreccionOrden}
          />

        </div>
      </Modal>
    </div>

  );
};

export default CollapsibleTable;