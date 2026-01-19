import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { setFechaRange, setStatusLoading } from '../../redux/features/ordenes/ordenesSlice';
import { Modal, Skeleton, Select, Table, Button, Tooltip } from 'antd';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice';
import DateRangePicker from '../reportes/DateRangePicker';
import { fecthCorrecionesOrdenes, fetchCorreccionesByOrdenId } from '../../redux/features/correciones-ordenes/correcionesOrdenesSlice';
import CollapsibleTable from './TableOrdenesCorrecciones';
import TableOrdenesCorrecciones from './TableOrdenesCorrecciones';

const VerOrdenes = () => {
  const dispatch = useDispatch();
  const pagado = useSelector((state) => state.fasesOrdenes.pagado);
  const tipoLente = useSelector((state) => state.fasesOrdenes.tipoLente);
  const laboratorio = useSelector((state) => state.fasesOrdenes.laboratorio);
  const fase = useSelector((state) => state.fasesOrdenes.fase);
  const sucursal = useSelector((state) => state.fasesOrdenes.sucursal);
  const statusOrden = useSelector((state) => state.fasesOrdenes.statusOrden);
  const fechaInicio = useSelector((state) => state.fasesOrdenes.fechaInicio);
  const fechaFin = useSelector((state) => state.fasesOrdenes.fechaFin);
  const faseCorreccion = useSelector((state) => state.fasesOrdenes.faseCorreccion);
  const laboratorioCorreccion = useSelector((state) => state.fasesOrdenes.laboratorioCorreccion);
  const lenteContactoCorreccion = useSelector((state) => state.fasesOrdenes.lenteContactoCorreccion);
  const sucursalCorreccion = useSelector((state) => state.fasesOrdenes.sucursalCorreccion);
  const statusCorreccion = useSelector((state) => state.fasesOrdenes.statusCorreccion);
  const pagadoCorreccion = useSelector((state) => state.fasesOrdenes.pagadoCorreccion);
  const changeOrden = useSelector((state) => state.fasesOrdenes.changeOrden);
  const { total } = useSelector((state) => state.ordenes);
  const [idOrden, setIdOrden] = useState()
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [correctionsFilterFase, setCorrectionsFilterFase] = useState(faseCorreccion || []);
  const [correctionsFilterLaboratorio, setCorrectionsFilterLaboratorio] = useState(laboratorioCorreccion || []);
  const [correctionsFilterSucursal, setCorrectionsFilterSucursal] = useState(sucursalCorreccion || []);
  const [correctionsFilterStatus, setCorrectionsFilterStatus] = useState(statusCorreccion || []);
  const [correctionsFilterPagado, setCorrectionsFilterPagado] = useState(pagadoCorreccion || []);
  const [correctionsFilterLenteContacto, setCorrectionsFilterLenteContacto] = useState(lenteContactoCorreccion || []);
  const [isCorrections, setIsCorrections] = useState(changeOrden);

  const handleToggleCorrections = () => {
    setIsCorrections(!isCorrections);
  };
  const {
    search,
    contactoOrden,
  } = useSelector((state) => state.ordenes);


  const {
    sucursales_option_selects
  } = useSelector((state) => state.sucursales);

  const {
    correcionesbyOrden,
    metabyOrden
  } = useSelector((state) => state.correcionesordenes)

  const [currentPage, setCurrentPage] = useState(1);
  const [localSearch, setLocalSearch] = useState(search);
  const [debouncedSearch, setDebouncedSearch] = useState(localSearch);
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
  const [cancelarOrdenFilter, setCancelarOrdenFilter] = useState(false);

  useEffect(() => {
    dispatch(fetchSucursales({}))
  }, [dispatch])

  useEffect(() => {
    if (idOrden !== undefined && idOrden !== null) {
      dispatch(fetchCorreccionesByOrdenId(idOrden));
    }
  }, [idOrden, dispatch]);

  useEffect(() => {
    if (localSearch === '') {
      setDebouncedSearch('');
      setCurrentPage(1);
      return;
    }

    const timeoutId = setTimeout(() => {
      setDebouncedSearch(localSearch);
      setCurrentPage(1);
    }, 1250);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [localSearch]);

  const handleSearchChange = (event) => {
    dispatch(setStatusLoading());
    setLocalSearch(event.target.value);
    setCurrentPage(1);
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
    setDebouncedSearch('');
  };

  const handleLenteContactoChange = (value) => {
    setLenteContactoFilter(value);
    setCurrentPage(1)
  };
  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1)
  };

  const handlePagadoChange = (value) => {
    setPagadoFilter(value);
    setCurrentPage(1)
  };

  const handleSucursalChange = (value) => {
    setSucursalFilter(value);
    setCurrentPage(1)
  };

  const handleLaboratorioChange = (value) => {
    setLaboratorioFilter(value);
    setCurrentPage(1)
  };

  const handleFaseChange = (value) => {
    setFaseFilter(value);
    setCurrentPage(1)
  };

  const handleCorrectionsChangeFase = (values) => {
    setCorrectionsFilterFase(values);
  };

  const handleCorrectionsChangeLaboratorio = (values) => {
    setCorrectionsFilterLaboratorio(values);
  };

  const handleCorrectionsChangeSucursal = (values) => {
    setCorrectionsFilterSucursal(values);
  };

  const handleCorrectionsChangeStatus = (values) => {
    setCorrectionsFilterStatus(values);
  };

  const handleCorrectionsChangePagado = (values) => {
    setCorrectionsFilterPagado(values);
  };

  const handleCorrectionsChangeLenteContacto = (values) => {
    setCorrectionsFilterLenteContacto(values);
  };

  const handleDateChange = () => {
    dispatch(setFechaRange({ startDate: localStartDate, endDate: localEndDate }));
    setCurrentPage(1)
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setModalData(null);
  };

  const handleClearOrders = () => {
    setPagadoFilter([]);
    setSucursalFilter([]);
    setLaboratorioFilter([]);
    setFaseFilter([]);
    setLenteContactoFilter([]);
    setStatusFilter([]);
  }

  const handleClearCorrections = () => {
    setCorrectionsFilterFase([]);
    setCorrectionsFilterLaboratorio([]);
    setCorrectionsFilterSucursal([]);
    setCorrectionsFilterStatus([]);
    setCorrectionsFilterPagado([]);
    setCorrectionsFilterLenteContacto([]);
  }

  const handleOrdenCancel = () => {
    setCancelarOrdenFilter(!cancelarOrdenFilter);
    setCurrentPage(1);
  };

  const columns = React.useMemo(() => {

    if (!Array.isArray(correcionesbyOrden) || correcionesbyOrden.length === 0) return [];

    const keys = Object.keys(correcionesbyOrden[0]);

    return keys.map((key) => ({
      title: key.replace(/_/g, ' ').toUpperCase(),
      dataIndex: key,
      key: key,
      render: (text) => (text ? text : 'No Correjido'),
    }));
  }, [correcionesbyOrden]);

  const data = Array.isArray(correcionesbyOrden) && correcionesbyOrden.length > 0
    ? correcionesbyOrden.map((correccion, index) => ({
      key: index,
      ...correccion,
    }))
    : [];



  return (

    <div className="row layout-top-spacing">
      <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
        <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing d-flex justify-content-center align-items-center" style={{ marginTop: '-40px' }}>
          <div className="card" style={{ width: '10rem', height: '3rem', padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="card-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.5rem' }}>
              <span
                style={{
                  fontSize: '1rem', fontWeight: 'bold',
                  textAlign: 'center'
                }}
              >
                Órdenes: {total}
              </span>
            </div>
          </div>
        </div>

        <div className="widget-content-area br-4" style={{ marginTop: '-70px' }}>
          <div className="widget-one">
            <div
              className="row layout-top-spacing"
              id="cancel-row"
            >
              <div className="col-xl-12 col-lg-12 col-sm-12  layout-spacing">
                <div className="widget-content widget-content-area br-6">
                  <div style={{ width: '100%' }}>
                    <div className="d-flex justify-content-between mb-4">
                      <div className="d-flex">
                        <Link
                          to="/create-orden"
                          className="btn btn-success"
                          style={{ height: '37px' }}
                        >
                          Agregar Orden
                        </Link>


                        <Tooltip
                          title="Ver Ordenes Canceladas"
                        >
                          <button
                            className="btn"
                            style={{
                              backgroundColor: cancelarOrdenFilter ? '#1ABC9C' : '#e7515a',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginLeft: '10px',
                              padding: '0 10px',
                              height: '35px',
                            }}
                            onClick={() => {
                              const newValue = !cancelarOrdenFilter;
                              setCancelarOrdenFilter(newValue);
                              handleOrdenCancel(newValue ? '1' : '');
                            }}
                          >
                            {cancelarOrdenFilter ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="white"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="white"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            )}
                          </button>
                        </Tooltip>
                      </div>

                      <div className="d-flex gap-2">
                        <button className="btn btn-success" onClick={handleToggleCorrections}>
                          {isCorrections ? "Filtrar por Fase" : "Filtrar Correcciones por Fase"}
                        </button>
                        <button
                          onClick={handleClearOrders}
                          className={
                            pagadoFilter.length > 0 ||
                              sucursalFilter.length > 0 ||
                              laboratorioFilter.length > 0 ||
                              faseFilter.length > 0 ||
                              lenteContactoFilter.length > 0 ||
                              statusFilter.length > 0
                              ? "btn btn-warning"
                              : "btn"
                          }
                        >
                          Limpiar Ordenes
                        </button>
                        <button
                          onClick={handleClearCorrections}
                          className="btn"
                        >
                          Limpiar Correcciones
                        </button>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div className="d-flex flex-column" style={{ width: '30%' }}>
                        <div className="mb-4">
                          <label style={{ position: 'relative', width: '100%', display: 'block' }}>
                            <div style={{ position: 'absolute', right: '8px', top: '7px' }}>
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
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" x2="16.65" y1="21" y2="16.65" />
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
                                &#x2715;
                              </button>
                            )}
                          </label>
                        </div>
                        <div>
                          <label className="mb-2">Buscar por Fecha:</label>
                          <DateRangePicker
                            startDate={localStartDate}
                            endDate={localEndDate}
                            onChange={(start, end) => {
                              setLocalStartDate(start);
                              setLocalEndDate(end);
                            }}
                            skipReset={true}
                            onApply={handleDateChange}
                            onReset={() => {
                              dispatch(setFechaRange({ startDate: '', endDate: '' }));
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ width: '65%' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                          <div>
                            <div>
                              <div className="mb-4">
                                <label className="mb-2 font-weight-bold d-block">
                                  {isCorrections ? "Filtrar Correcciones Laboratorio:" : "Filtrar Ordenes por Laboratorio:"}
                                </label>
                                <Select
                                  mode="multiple"
                                  style={{ width: '100%' }}
                                  placeholder="Filtrar por Laboratorio"
                                  onChange={isCorrections ? handleCorrectionsChangeLaboratorio : handleLaboratorioChange}
                                  value={isCorrections ? correctionsFilterLaboratorio : laboratorioFilter}
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
                              <label className="mb-2 font-weight-bold d-block">
                                {isCorrections ? "Filtrar Correcciones por Sucursal:" : "Filtrar Ordenes por Sucursal:"}
                              </label>
                              <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="Seleccione la sucursal"
                                onChange={isCorrections ? handleCorrectionsChangeSucursal : handleSucursalChange}
                                value={isCorrections ? correctionsFilterSucursal : sucursalFilter}
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
                          <div>
                            <div className="mb-4">
                              <label className="mb-2 font-weight-bold d-block">
                                {isCorrections ? "Filtrar Correcciones Tipo de lente:" : "Filtrar Ordenes por Tipo de lente:"}
                              </label>
                              <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="Selecciona el tipo de lente"
                                onChange={isCorrections ? handleCorrectionsChangeLenteContacto : handleLenteContactoChange}
                                value={isCorrections ? correctionsFilterLenteContacto : lenteContactoFilter}
                                allowClear
                              >
                                <Select.Option value="1">
                                  <div style={{ width: '30px', height: '30px' }}>
                                    <img
                                      src="assets/img/recetas/lentesdecontacto.png"
                                      alt="Lente On"
                                      style={{ width: '50%', height: '50%' }}
                                    />
                                  </div>
                                </Select.Option>
                                <Select.Option value="0">
                                  <div style={{ width: '30px', height: '30px' }}>
                                    <img
                                      src="assets/img/recetas/lentenormal.png"
                                      alt="Lente Off"
                                      style={{ width: '50%', height: '50%' }}
                                    />
                                  </div>
                                </Select.Option>
                              </Select>
                            </div>
                            <div>
                              <label className="mb-2 font-weight-bold d-block">
                                {isCorrections ? "Filtrar Correcciones por Status:" : "Filtrar Ordenes por Status:"}
                              </label>
                              <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="Filtrar por Status"
                                onChange={isCorrections ? handleCorrectionsChangeStatus : handleStatusChange}
                                value={isCorrections ? correctionsFilterStatus : statusFilter}
                                allowClear
                              >
                                <Select.Option value="OK">OK</Select.Option>
                                <Select.Option value="Advertencia">Advertencia</Select.Option>
                                <Select.Option value="Crítico">Crítico</Select.Option>
                                <Select.Option value="Completado">Completado</Select.Option>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <div className="mb-4">
                              <label className="mb-2 font-weight-bold d-block">
                                {isCorrections ? "Filtrar Correcciones por Fase:" : "Filtrar Ordenes por Fase:"}
                              </label>
                              <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="Filtrar por Fase"
                                onChange={isCorrections ? handleCorrectionsChangeFase : handleFaseChange}
                                value={isCorrections ? correctionsFilterFase : faseFilter}
                                allowClear
                              >
                                <Select.Option value="Nuevo">Nuevo</Select.Option>
                                <Select.Option value="Listo">Listo</Select.Option>
                                <Select.Option value="En Confección">En confeccion</Select.Option>
                                <Select.Option value="Retirado">Retirado</Select.Option>
                              </Select>
                            </div>
                            <div>
                              <label className="mb-2 font-weight-bold d-block">
                                {isCorrections ? "Filtrar Correcciones por Pago:" : "Filtrar Ordenes por Pago:"}
                              </label>
                              <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="Seleccione estado de pago"
                                onChange={isCorrections ? handleCorrectionsChangePagado : handlePagadoChange}
                                value={isCorrections ? correctionsFilterPagado : pagadoFilter}
                                allowClear
                              >
                                <Select.Option value="0">Cortesia</Select.Option>
                                <Select.Option value="2">Abonado</Select.Option>
                                <Select.Option value="1">Pagado</Select.Option>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <TableOrdenesCorrecciones
                    search={debouncedSearch}
                    pagadoFiltro={pagadoFilter}
                    sucursalFiltro={sucursalFilter}
                    laboratorioFiltro={laboratorioFilter}
                    faseFiltro={faseFilter}
                    isCorrections={isCorrections}
                    correctionsFiltroFase={isCorrections ? correctionsFilterFase : undefined}
                    correctionsFiltroLaboratorio={isCorrections ? correctionsFilterLaboratorio : undefined}
                    correctionsFiltroSucursal={isCorrections ? correctionsFilterSucursal : undefined}
                    correctionsFiltroStatus={isCorrections ? correctionsFilterStatus : undefined}
                    correctionsFiltroPagado={isCorrections ? correctionsFilterPagado : undefined}
                    correctionsFiltroLenteContacto={isCorrections ? correctionsFilterLenteContacto : undefined}
                    lenteContactoFiltro={lenteContactoFilter}
                    statusFiltro={statusFilter}
                    localEndDateFiltro={localEndDate}
                    localStartDateFiltro={localStartDate}
                    currentPageTable={currentPage}
                    setCurrentPageTable={setCurrentPage}
                    setCancelarOrdenFilter={setCancelarOrdenFilter}
                    cancelarOrdenFilter={cancelarOrdenFilter}
                  />
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
      <Modal
        title={`Detalles de la Orden ${modalData?.nro_orden}`}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1200}
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="correccion_id"
          pagination={{
            current: metabyOrden.page,
            pageSize: metabyOrden.limit,
            total: metabyOrden.total
          }}
          scroll={{ x: 'max-content' }}
        />
      </Modal>

    </div >
  )
}

export default VerOrdenes