import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { eliminarRecetas } from '../../redux/features/recetas/eliminarRecetasSlice';
import Swal from 'sweetalert2';
import { deleteOrdenes, fecthOrdenes, fetchContactoOrdenesDelPaciente, setFechaRange, setOrden, setOrdenPor, updateOrden, verOrdenPdf } from '../../redux/features/ordenes/ordenesSlice';
import PaginationOrdenes from './PaginationOrdenes';
import dayjs from 'dayjs';
import { Modal, Skeleton, Button, Tooltip, Select, Table, Space, Tag } from 'antd';
import {
  EyeOutlined,
  WhatsAppOutlined
} from '@ant-design/icons';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice';
import DateRangePicker from '../reportes/DateRangePicker';


const VerOrdenes = () => {
  const dispatch = useDispatch();
  const {
    ordenes,
    status,
    error,
    meta,
    search,
    totalPages,
    startDate,
    endDate,
    contactoOrden,
    sortColumn,
    sortOrder } = useSelector((state) => state.ordenes);

  const {
    sucursales_option_selects
  } = useSelector((state) => state.sucursales);

  const [currentPage, setCurrentPage] = useState(1);
  const [localSearch, setLocalSearch] = useState(search);
  const [showOrden, setShowOrden] = useState(false);
  const [showContacto, setShowContacto] = useState(false);
  const [urlPdfOrden, setUrlPdfOrden] = useState(null)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [pagadoFilter, setPagadoFilter] = useState([]);
  const [sucursalFilter, setSucursalFilter] = useState([]);
  const [laboratorioFilter, setLaboratorioFilter] = useState([]);
  const [faseFilter, setFaseFilter] = useState([]);
  const [lenteContactoFilter, setLenteContactoFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [localStartDate, setLocalStartDate] = useState(startDate);

  useEffect(() => {
    dispatch(fecthOrdenes({
      page: currentPage,
      limit: 20,
      sortColumn,
      sortOrder,
      search: localSearch,
      startDate,
      endDate,
      lenteContacto: lenteContactoFilter,
      status: statusFilter,
      pagado: pagadoFilter,
      sucursal: sucursalFilter,
      laboratorio: laboratorioFilter,
      fase: faseFilter
    }));
  }, [dispatch,
    currentPage,
    sortColumn,
    sortOrder,
    localSearch,
    startDate,
    endDate,
    lenteContactoFilter,
    statusFilter,
    pagadoFilter,
    sucursalFilter,
    laboratorioFilter,
    faseFilter]);

  useEffect(() => {
    dispatch(fetchSucursales({}))
  }, [dispatch])

  const handleSort = (newOrdenPor) => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setOrden(newOrder));
    dispatch(setOrdenPor(newOrdenPor));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    setLocalSearch(event.target.value);
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

  const handleClearSearch = () => {
    setLocalSearch('');
  };
  const handlePagoToggle = async (id_orden, estadoActual, nro_orden) => {
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
        pagado: nuevoEstado,
        nro_orden,
      };
      console.log('payload:', payload)
      await dispatch(updateOrden({ id_orden, data: payload })).unwrap();
      dispatch(fecthOrdenes({ page: currentPage, limit: 20, sortOrder, sortColumn }));
    } catch (err) {
      console.error('Error al actualizar el estado de pagado:', err);
    }
  };


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



                  <div
                    style={{
                      display: 'flex'
                    }}
                  >
                    <Link
                      to={"/create-orden"} className="btn btn-success ml-3 mt-4"
                      style={{ height: '37px' }}
                    >
                      Agregar Orden
                    </Link>
                    <div>

                      <div className="dt--top-section">
                        <div className="row">
                          <div className="col-sm-24 col-md-12 d-flex justify-content-md-end justify-content-center mt-md-0 mt-3">
                            <div
                              className="dataTables_filter"
                              id="html5-extension_filter"
                            >

                              <label style={{ position: 'relative' }}>
                                <div
                                  style={{
                                    position: 'absolute',
                                    right: '8px',
                                    top: '7px'
                                  }}
                                >
                                  <svg
                                    className="feather feather-search"
                                    fill="none"
                                    height="24"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <circle
                                      cx="11"
                                      cy="11"
                                      r="8"
                                    />
                                    <line
                                      x1="21"
                                      x2="16.65"
                                      y1="21"
                                      y2="16.65"
                                    />
                                  </svg>
                                </div>

                                <input
                                  aria-controls="html5-extension"
                                  className="form-control"
                                  placeholder="Search..."
                                  type="search"
                                  value={localSearch}
                                  onChange={handleSearchChange}
                                />
                                {localSearch && (
                                  <button
                                    onClick={handleClearSearch}
                                    style={{
                                      position: 'absolute',
                                      right: '25px',
                                      top: '50%',
                                      transform: 'translateY(-50%)',
                                      background: 'none',
                                      border: 'none',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    &#x2715; { }
                                  </button>
                                )}
                              </label>
                              <div >
                                <label>
                                  Buscar por Fecha:
                                </label>
                                <DateRangePicker
                                  startDate={localStartDate}
                                  endDate={localEndDate}
                                  onChange={(start, end) => {
                                    setLocalStartDate(start);
                                    setLocalEndDate(end);
                                  }}
                                  onApply={handleDateChange}
                                  onReset={() => {
                                    dispatch(setFechaRange({ startDate: '', endDate: '' }));
                                  }}

                                />
                              </div>
                            </div>
                          </div>
                          
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-4 mt-4 mb-4 px-4">
                      <div className="flex items-center">
                        <label className="font-weight-bold">Filtrar por Tipo de lente:</label>
                        <Select
                          mode="multiple"
                          style={{ width: '100%', height: '40%' }}
                          placeholder="Selecciona el tipo de lente"
                          onChange={handleLenteContactoChange}
                          value={lenteContactoFilter || undefined}
                          allowClear              
                        >                     
                          <Select.Option value="1">
                            <div style={{ width: '30px', height: '30px' }}>
                              <img
                                src="assets/img/recetas/lentesdecontacto.png"
                                alt="Lente On"
                                style={{ width: '50%', height: '50%'}}
                              />
                            </div>
                          </Select.Option>

                          <Select.Option value="0">
                            <div style={{ width: '30px', height: '30px' }}>
                              <img
                                src="assets/img/recetas/lentenormal.png"
                                alt="Lente Off"
                                style={{ width: '50%', height: '50%'}}
                              />
                            </div>
                          </Select.Option>
                        </Select>
                        <div className="d-flex flex-column">
                          <label className="mb-1 font-weight-bold">Filtrar por Status:</label>
                          <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Filtrar por Status"
                            onChange={handleStatusChange}
                            value={statusFilter || undefined}
                            allowClear
                          >
                            <Select.Option value="Ok">Ok</Select.Option>
                            <Select.Option value="Advertencia">Advertencia</Select.Option>
                            <Select.Option value="Critico">Critico</Select.Option>
                            <Select.Option value="Completado">Completado</Select.Option>
                          </Select>

                        </div>
                        <div className="d-flex flex-column">
                          <label className="mb-1 font-weight-bold">Filtrar por Fase:</label>
                          <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Filtrar por Fase"
                            onChange={handleFaseChange}
                            value={faseFilter || undefined}
                            allowClear
                          >
                            <Select.Option value="Nuevo">Nuevo</Select.Option>
                            <Select.Option value="Listo">Listo</Select.Option>
                            <Select.Option value="En confeccion">En confeccion</Select.Option>
                            <Select.Option value="Retirado">Retirado</Select.Option>
                          </Select>

                        </div>
                        <div className="d-flex flex-column">
                          <label className="mb-1 font-weight-bold">Filtrar por Laboratorio:</label>
                          <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Filtrar por Laboratorio"
                            onChange={handleLaboratorioChange}
                            value={laboratorioFilter || undefined}
                            allowClear
                          >
                            <Select.Option value="Ping">Ping</Select.Option>
                            <Select.Option value="Centilab">Centilab</Select.Option>
                            <Select.Option value="Optilab">Optilab</Select.Option>
                            <Select.Option value="Vista Pro">Vista Pro</Select.Option>
                            <Select.Option value="Haseth J&J">Haseth J&J</Select.Option>
                            <Select.Option value="Alcon">Alcon</Select.Option>
                            <Select.Option value="B+L">B+L</Select.Option>
                          </Select>

                        </div>
                        <div className="d-flex flex-column">
                          <label className="mb-1 font-weight-bold">Filtrar por Pago:</label>
                          <Space style={{ width: '100%' }} direction="vertical">
                            <Select
                              mode="multiple"
                              style={{ width: '100%' }}
                              placeholder="Seleccione estado de pago"
                              onChange={handlePagadoChange}
                              value={pagadoFilter}
                              allowClear
                            >
                              <Select.Option value="0">Sin Pago</Select.Option>
                              <Select.Option value="2">Abonado</Select.Option>
                              <Select.Option value="1">Pagado</Select.Option>
                            </Select>
                          </Space>
                        </div>
                        <div className="d-flex flex-column">
                          <label className="mb-1 font-weight-bold">Filtrar por Sucursal:</label>
                          <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Seleccione la sucursal"
                            onChange={handleSucursalChange}
                            value={sucursalFilter}
                            allowClear
                          >
                            {sucursales_option_selects.map((sucursal) => (
                              <Option key={sucursal.value} value={sucursal.value}>
                                {sucursal.label}
                              </Option>
                            ))}
                          </Select>
                        </div>
                      </div>
                    </div>
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
                                aria-label={`Nro_Orden: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                aria-sort="descending"
                                className="sorting_desc"
                                colSpan="1"
                                rowSpan="1"
                                style={{
                                  width: '527px'
                                }}
                                tabIndex="0"
                                onClick={() => handleSort('Nro_Orden')}
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
                                onClick={() => handleSort('PACIENTE_NOMBRE')}
                              >
                                Sucursal
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
                                Paciente
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
                            {ordenes.map((orden) => (
                              <tr key={orden.id_orden}>
                                <td style={{ display: 'flex', alignItems: 'center' }}>
                                  {orden.nro_orden}
                                  {orden.lente_contacto ? (
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
                                    onClick={() => handlePagoToggle(orden.id_orden, parseInt(orden.pagado), orden.nro_orden)}
                                    style={{ minWidth: '100px' }}
                                  >
                                    {parseInt(orden.pagado) === 1
                                      ? 'pagado'
                                      : parseInt(orden.pagado) === 2
                                        ? 'abonado'
                                        : 'sin pago'}
                                  </button>
                                </td>
                                <td>{dayjs(orden.created_at).format('DD/MM/YYYY')}</td>
                                <td>{orden?.sucursal?.nombre || ""}</td>
                                <td>{
                                  orden?.paciente?.nombres + " " + orden?.paciente?.apellidos
                                }</td>
                                <td>{orden?.paciente?.celular || ""}</td>
                                <td>{orden?.laboratorio || ""}</td>
                                <td>{orden?.fase_actual || ""}</td>
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
                                <td >
                                  <div className="btn-group">

                                    <Link
                                      to={`/orden-receta/${orden.id_orden}`}
                                      className="btn btn-warning btnEditarReceta"
                                      state={{ orden }}
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
                                      onClick={() => handleVerOrden(orden.id_orden)}
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
                                    <button
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
                      <PaginationOrdenes
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

export default VerOrdenes