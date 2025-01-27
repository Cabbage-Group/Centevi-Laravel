import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  EyeOutlined,
  WhatsAppOutlined
} from '@ant-design/icons';
import { deleteOrdenes, fecthOrdenes, fetchContactoOrdenesDelPaciente, updateOrden, verOrdenPdf, setFechaRange, setOrden, setOrdenPor } from '../../redux/features/ordenes/ordenesSlice';
import { deleteCorreccionesOrdenes, fecthCorrecionesOrdenes, fetchContactoCorreccionesOrdenesDelPaciente, fetchCorreccionesByOrdenId, verOrdenCorrecionPdf } from '../../redux/features/correciones-ordenes/correcionesOrdenesSlice';
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
    localSearch
  }

) => {
  const dispatch = useDispatch();
  const [collapsedordens, setCollapsedordens] = useState();
  const [selectedOrdenId, setSelectedOrdenId] = useState(null);
  const [showOrden, setShowOrden] = useState(false);
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
  const {
    correcionesbyOrden,
    contactoCorreccionOrden
  } = useSelector((state) => state.correcionesordenes);
  const [urlPdfOrden, setUrlPdfOrden] = useState(null)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [showContacto, setShowContacto] = useState(false);
  const [showContactoCorreccion, setShowContactoCorrecion] = useState(false);
  const { permisos } = useSelector((state) => state.auth);

  console.log('localSearch:', localSearch)
  useEffect(() => {
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
  }, [dispatch,
    currentPage,
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
    endDate]);

  useEffect(() => {
    if (selectedOrdenId) {
      dispatch(fetchCorreccionesByOrdenId(selectedOrdenId)); // Llamar a la API con el ID de la orden
    }
  }, [dispatch, selectedOrdenId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
      console.log('estadoActual:', estadoActual)
      if (estado === 0) {
        console.log('entre a abonado')
        nuevoEstado = 2;
      } else if (estado === 2) {
        console.log('entre a pagado')
        nuevoEstado = 1;
      } else {
        console.log('entre a no pagado')
        nuevoEstado = 0;
      }

      console.log('nuevoEstado:', nuevoEstado)
      const payload = {
        pagado: nuevoEstado
      };
      console.log('payload:', payload)
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

  const handleVerOrden = async (id_orden, correccion) => {


    try {
      setLoadingPdf(true)
      setShowOrden(true)
      let url = null
      if (correccion) {
        url = await dispatch(verOrdenCorrecionPdf(id_orden))
      } else {
        url = await dispatch(verOrdenPdf(id_orden))
      }
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
                    <td>{orden?.created_at_formatted}</td>
                    <td >{orden?.sucursal?.nombre}</td>
                    <td>{`${orden.paciente?.nombres} ${orden?.paciente?.apellidos}`}</td>
                    <td>{orden?.paciente?.celular}</td>
                    <td>{orden?.laboratorio}</td>
                    <td>{orden?.fase_actual}</td>
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
                          onClick={() => handleVerOrden(orden.id_orden, false)}
                          className="btn btn-primary"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-pdf" viewBox="0 0 16 16">
                            <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1" />
                            <path d="M4.603 12.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.6 11.6 0 0 0-1.997.406 11.3 11.3 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.244.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 5.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z" />
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
                              .map((correcion, index) => (
                                <tr key={correcion.id}>

                                  <td style={{ width: columnWidths.nroOrden }}>{correcion.nro_orden_id} - C{index + 1}</td>
                                  <td style={{ width: columnWidths.pagado }} >
                                    <button
                                      className={`btn btn-xs ${parseInt(orden.pagado) === 1
                                        ? 'btn-success'
                                        : parseInt(orden.pagado) === 2
                                          ? 'btn-warning'
                                          : 'btn-danger'
                                        }`}
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
                                  <td style={{ width: columnWidths.sucursal }}>{correcion.sucursal}</td>
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
                                        onClick={() => {
                                          handleVerOrden(correcion.id, true)
                                        }}
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
