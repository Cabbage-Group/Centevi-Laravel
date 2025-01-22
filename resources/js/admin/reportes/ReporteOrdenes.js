import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DateRangePicker from './DateRangePicker';
import ExportButton from './exportButton';
import { transformDataForReporteOrdenes } from '../../../utils/dataTransform';
import { Button, Col, Card, Row, Tooltip } from 'antd';
import { fecthReportesOrdenes, setSortOrder, setSortColumn, setFechaRange, fecthStatusTotals, fecthLenteContactoTotals, fecthLaboratorioTotals, fecthPagadoTotals, fetchBranchTotals, fetchDoctoresTotals, fetchAsesoresTotals } from '../../redux/features/reportes/reporteOrdenesSlice';
import PaginationReportesOrdenes from './PaginationReportesOrdenes';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice';
import { fetchUsuarios } from '../../redux/features/usuarios/usuariosSlice';
import moment from 'moment';


const ReporteOrdenes = () => {
  const dispatch = useDispatch();
  const [visibleCount, setVisibleCount] = useState(4);
  const [visibleCountSucursal, setVisibleCountSucursal] = useState(4);
  const [visibleCountAsesor, setVisibleCountAsesor] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localSearch, setLocalSearch] = useState(search);
  const { usuarios_doctores_options_selecteds, usuarios_activados } = useSelector((state) => state.usuarios)
  const { sucursales_option_selects } = useSelector((state) => state.sucursales);
  const {
    reportesOrdenes,
    sortColumn,
    sortOrder,
    meta,
    totalPages,
    startDate,
    endDate,
    search,
    dataexport,
    status,
    error
  } = useSelector((state) => state.reportesOrdenes);


  useEffect(() => {
    dispatch(fecthReportesOrdenes({
      page: currentPage,
      limit: 20,
      sortOrder,
      sortColumn,
      startDate,
      endDate,
      search: localSearch,
    }));
  }, [
    dispatch,
    currentPage,
    localSearch,
    sortColumn,
    sortOrder,
    startDate,
    endDate
  ]);

  useEffect(() => {
    dispatch(fecthStatusTotals({}))
    dispatch(fecthLenteContactoTotals({}))
    dispatch(fecthLaboratorioTotals({}))
    dispatch(fecthPagadoTotals({}))
    dispatch(fetchSucursales({}))
    dispatch(fetchUsuarios({}))
  }, [dispatch])

  useEffect(() => {
    if (sucursales_option_selects.length > 0) {
      const sucursalIds = sucursales_option_selects.map(sucursal => sucursal.value);
      const sucursalNames = sucursales_option_selects.map(sucursal => sucursal.label);
      dispatch(fetchBranchTotals(
        {
          sucursales: sucursalIds,
          sucursalesNames: sucursalNames
        }
      ));
    }
  }, [dispatch, sucursales_option_selects]);

  useEffect(() => {
    if (usuarios_doctores_options_selecteds.length > 0) {
      const doctoresIds = usuarios_doctores_options_selecteds.map(doctor => doctor.value);
      const doctoresNames = usuarios_doctores_options_selecteds.map(doctor => doctor.label);
      dispatch(fetchDoctoresTotals(
        {
          doctores: doctoresIds,
          doctoresNames: doctoresNames
        }
      ));
    }
  }, [dispatch, usuarios_doctores_options_selecteds]);

  useEffect(() => {
    if (usuarios_activados.length > 0) {
      const asesoressIds = usuarios_activados.map(asesor => asesor.id_usuario);
      const asesoresNames = usuarios_activados.map(asesor => asesor.nombre);
      dispatch(fetchAsesoresTotals(
        {
          asesores: asesoressIds,
          asesoresNames: asesoresNames
        }
      ));
    }
  }, [dispatch, usuarios_activados]);

  console.log('usuarios_activados:', usuarios_activados)

  const statusTotals = useSelector((state) => state.reportesOrdenes.statusTotals);
  const lenteContactoTotals = useSelector((state) => state.reportesOrdenes.lenteContactoTotals);
  const laboratoriosTotals = useSelector((state) => state.reportesOrdenes.laboratoriosTotals);
  const pagadoTotals = useSelector((state) => state.reportesOrdenes.pagadoTotals);
  const branchTotals = useSelector((state) => state.reportesOrdenes.branchTotals);
  const doctoresTotals = useSelector((state) => state.reportesOrdenes.doctoresTotals);
  const asesoresTotals = useSelector((state) => state.reportesOrdenes.asesoresTotals);

  console.log('asesoresTotals:', asesoresTotals)

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDateChange = () => {
    dispatch(setFechaRange({ startDate: localStartDate, endDate: localEndDate }));
  };

  const handleSearchChange = (event) => {
    setLocalSearch(event.target.value);
  };
  const handleClearSearch = () => {
    setLocalSearch('');
  };



  const handleSort = (newOrdenPor) => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setSortOrder(newOrder));
    dispatch(setSortColumn(newOrdenPor));
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const handleLoadMoreSucursal = () => {
    setVisibleCountSucursal((prev) => prev + 4);
  };

  const handleLoadMoreAsesor = () => {
    setVisibleCountAsesor((prev) => prev + 4);
  };


  return (
    <div className="row layout-top-spacing">
      <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
        <div className="widget-content-area br-4">
          <div className="widget-one">
            <div className="row">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
                <div className="widget widget-one">
                  <div className="widget-heading">
                    <h6 className="">
                      Reporte de Ordenes
                    </h6>
                  </div>
                  <div className="w-chart">
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="row" style={{ marginTop: '-20px' }}>
                <div className="col-md-2">
                  <Card title="Resumen de estado" bordered={false} hoverable>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      <div style={{ marginRight: '20px' }}>
                        <Tooltip title="Ok">
                          <p>
                            <span style={{
                              display: 'inline-block',
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: 'green',
                              marginRight: '8px'
                            }}></span>
                            : {statusTotals?.Ok}
                          </p>
                        </Tooltip>
                        <Tooltip title="Advertencia">
                          <p>
                            <span style={{
                              display: 'inline-block',
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: 'yellow',
                              marginRight: '8px'
                            }}></span>
                            : {statusTotals?.Advertencia}
                          </p>
                        </Tooltip>
                      </div>
                      <div >
                        <Tooltip title="Crítico">
                          <p>
                            <span style={{
                              display: 'inline-block',
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: 'red',
                              marginRight: '8px'
                            }}></span>
                            : {statusTotals?.Critico}
                          </p>
                        </Tooltip>
                        <Tooltip title="Completado">
                          <p>
                            <span style={{
                              display: 'inline-block',
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: 'blue',
                              marginRight: '8px'
                            }}></span>
                            : {statusTotals?.Completado}
                          </p>
                        </Tooltip>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="col-md-2">
                  <Card title="Resumen Lente" bordered={false} hoverable>
                    <p>
                      <img
                        src="assets/img/recetas/lentesdecontacto.png"
                        alt="Lente de contacto"
                        style={{ width: '20px', height: '20px', marginRight: '8px' }}
                      />
                      : {lenteContactoTotals?.['1']}
                    </p>
                    <p>
                      <img
                        src="assets/img/recetas/lentenormal.png"
                        alt="Lente de contacto"
                        style={{ width: '20px', height: '20px', marginRight: '8px' }}
                      />
                      : {lenteContactoTotals?.['0']}
                    </p>
                  </Card>
                </div>

                <div className="col-md-4">
                  <Card title="Resumen Laboratorio" bordered={false} hoverable>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      <div style={{ width: '33%' }}>
                        <p>Ping: {laboratoriosTotals?.Ping}</p>
                        <p>Optilab: {laboratoriosTotals?.Optilab}</p>
                        <p>Centilab: {laboratoriosTotals?.Centilab}</p>
                      </div>
                      <div style={{ width: '33%' }}>
                        <p>Vista Pro: {laboratoriosTotals?.['Vista Pro']}</p>
                        <p>Haseth J&J: {laboratoriosTotals?.['Haseth J&J']}</p>
                      </div>
                      <div style={{ width: '33%' }}>
                        <p>Alcon: {laboratoriosTotals?.Alcon}</p>
                        <p>B+L: {laboratoriosTotals?.['B+L']}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="col-md-4" >
                  <Card title="Resumen de Pagos" bordered={false} hoverable>
                    <p>Pagado: {pagadoTotals?.['1']}</p>
                    <p>Abonado: {pagadoTotals?.['2']}</p>
                    <p>Cortesia: {pagadoTotals?.['0']}</p>
                  </Card>
                </div>
                <div className="col-md-4" style={{ marginTop: '20px' }}>
                  <Card
                    title="Resumen por Doctor"
                    bordered={false}
                    hoverable
                    style={{
                      height: '300px',
                      overflowY: 'auto',
                    }}
                  >
                    {doctoresTotals &&
                      Object.entries(doctoresTotals)
                        .slice(0, visibleCount)
                        .map(([doctorId, total]) => {
                          const truncatedBranchId =
                            doctorId.length > 10 ? doctorId.substring(0, 40) + '...' : doctorId;

                          return (
                            <Tooltip title={`${doctorId}: ${total}`} key={doctorId}>
                              <p>
                                {truncatedBranchId}: {total}
                              </p>
                            </Tooltip>
                          );
                        })}

                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                      {visibleCount < Object.keys(doctoresTotals || {}).length ? (
                        <Button type="link" onClick={handleLoadMore}>
                          Cargar más
                        </Button>
                      ) : (
                        <Button
                          type="link"
                          onClick={() => setVisibleCount(4)}
                        >
                          Ver menos
                        </Button>
                      )}
                    </div>
                  </Card>
                </div>

                <div className="col-md-4" style={{ marginTop: '20px' }}>
                  <Card
                    title="Resumen por Sucursal"
                    bordered={false}
                    hoverable
                    style={{
                      height: '300px',
                      overflowY: 'auto',
                    }}
                  >
                    {branchTotals &&
                      Object.entries(branchTotals)
                        .slice(0, visibleCountSucursal)
                        .map(([branchId, total]) => {
                          // Solo agregar puntos suspensivos si el texto es truncado
                          const isTruncated = branchId.length > 60;
                          const displayedBranchId = isTruncated
                            ? branchId.substring(0, 60) + '...'
                            : branchId;

                          return (
                            <Tooltip title={`${branchId}: ${total}`} key={branchId}>
                              <p>
                                {displayedBranchId}: {total}
                              </p>
                            </Tooltip>
                          );
                        })}

                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                      {visibleCountSucursal < Object.keys(branchTotals || {}).length ? (
                        <Button type="link" onClick={handleLoadMoreSucursal}>
                          Cargar más
                        </Button>
                      ) : (
                        <Button
                          type="link"
                          onClick={() => setVisibleCountSucursal(4)}
                        >
                          Ver menos
                        </Button>
                      )}
                    </div>
                  </Card>
                </div>

                <div className="col-md-4" style={{ marginTop: '20px' }}>
                  <Card
                    title="Resumen por Asesor"
                    bordered={false}
                    hoverable
                    style={{
                      height: '300px',
                      overflowY: 'auto',
                    }}
                  >
                    {asesoresTotals &&
                      Object.entries(asesoresTotals)
                        .slice(0, visibleCountAsesor)
                        .map(([branchId, total]) => {
                          // Solo agregar puntos suspensivos si el texto es truncado
                          const isTruncated = branchId.length > 60;
                          const displayedBranchId = isTruncated
                            ? branchId.substring(0, 60) + '...'
                            : branchId;

                          return (
                            <Tooltip title={`${branchId}: ${total}`} key={branchId}>
                              <p>
                                {displayedBranchId}: {total}
                              </p>
                            </Tooltip>
                          );
                        })}

                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                      {visibleCountAsesor < Object.keys(asesoresTotals || {}).length ? (
                        <Button type="link" onClick={handleLoadMoreAsesor}>
                          Cargar más
                        </Button>
                      ) : (
                        <Button
                          type="link"
                          onClick={() => setVisibleCountAsesor(4)}
                        >
                          Ver menos
                        </Button>
                      )}
                    </div>
                  </Card>
                </div>

              </div>
            </div>
            <div className="col-md-12" style={{ marginTop: '-30px' }}>
              <div className="form-group col-md-4 mt-4 " style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ marginRight: '10px', marginTop: 'px' }}>
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
                <div
                  className="col-sm-12 col-md-6 d-flex justify-content-md-start justify-content-center"
                  style={{ marginTop: '50px' }}
                >
                  <ExportButton
                    dataexport={dataexport}
                    transformData={transformDataForReporteOrdenes}
                    fileName="reporte_ordenes.xlsx"
                  />
                </div>
                <div className="col-sm-12 col-md-6 d-flex justify-content-md-center justify-content-start mt-md-0 mt-3">
                  <div className="relative w-full max-w-md">
                    <label className="relative block">
                      <input
                        style={{ marginTop: '50px' }}
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
                            top: '70%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          &#x2715; { }
                        </button>
                      )}
                      {!localSearch && (
                        <img
                          src="/assets/img/lupa.png"
                          alt="Search"
                          style={{
                            position: 'absolute',
                            right: '25px',
                            top: '70%',
                            transform: 'translateY(-50%)',
                            width: '20px',
                            height: '20px',
                            pointerEvents: 'none',
                          }}
                        />
                      )}
                    </label>
                  </div>

                </div>

              </div>



              <div className="table-responsive">
                <div
                  className="dataTables_wrapper container-fluid dt-bootstrap4 no-footer"
                  id="html5-extension_wrapper"
                >
                  <div className="dt--top-section">
                    <div className="row">
                      <div className="col-sm-12 col-md-6 d-flex justify-content-md-start justify-content-center">
                        {/* <div className="dt-buttons">
                          <ExportButton
                            dataexport={dataexport}
                            transformData={transformDataForReporteOrdenes}
                            fileName="reporte_ordenes.xlsx"
                          />
                        </div> */}
                      </div>
                      {/* <div className="col-sm-12 col-md-6 d-flex justify-content-md-center justify-content-start mt-md-0 mt-3">
                        <div
                          className="dataTables_filter"
                          id="html5-extension_filter"
                        >
                          <label>
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
                        </div>

                      </div> */}
                    </div>

                  </div>
                  <div className="table-responsive">
                    {status === 'loading' && <p>Loading...</p>}
                    {status === 'failed' && <p>Error: {error}</p>}
                    {status === 'succeeded' && (
                      <table aria-describedby="zero-config_info" className="table dt-table-hover tablas dataTable" id="zero-config" role="grid" style={{ width: '100%' }}>
                        <thead>
                          <tr role="row">
                            <th
                              aria-controls="zero-config"
                              aria-label={`lente_contacto: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${sortOrder}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('lente_contacto')}

                            >
                              TIPO DE LENTE
                            </th>
                            <th
                              aria-controls="zero-config"
                              aria-label={`tipo_cristal_od_codigo: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${sortOrder}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('tipo_cristal_od_codigo' || 'tipo_cristal_oi_codigo')}

                            >
                              CODIGO TIPO CRISTAL
                            </th>
                            <th
                              aria-controls="zero-config"
                              aria-label={`status: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${sortOrder}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('status')}

                            >
                              STATUS
                            </th>
                            <th
                              aria-controls="zero-config"
                              aria-label={`created_at_formatted: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${sortOrder}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('created_at_formatted')}

                            >
                              FECHA DE ORDEN
                            </th>
                            <th
                              aria-controls="zero-config"
                              aria-label={`nro_orden: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${sortOrder}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('nro_orden')}

                            >
                              NRO DE ORDEN
                            </th>
                            <th

                              aria-controls="zero-config"
                              aria-label={`pagado: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${sortOrder}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('pagado')}

                            >
                              PAGADO
                            </th>
                            <th

                              aria-controls="zero-config"
                              aria-label={`Sucursal: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${sortOrder}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('sucursal')}

                            >
                              SUCURSAL
                            </th>
                            <th
                              aria-controls="zero-config"
                              aria-label={`doctor: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${sortOrder}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('doctor')}

                            >
                              DOCTOR
                            </th>
                            <th

                              aria-controls="zero-config"
                              aria-label={`elaborado_por_nombre: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${sortOrder}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '130px' }}
                              tabIndex="0"
                              onClick={() => handleSort('elaborado_por_nombre')}

                            >
                              ASESOR
                            </th>
                            <th

                              aria-controls="zero-config"
                              aria-label={`laboratorio: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${sortOrder}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '130px' }}
                              tabIndex="0"
                              onClick={() => handleSort('laboratorio')}

                            >
                              LABORATORIO
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            reportesOrdenes.map((rpOrden) => {
                              return (
                                <>
                                  {/* Fila para el reporte de orden */}
                                  <tr key={rpOrden.id_orden}>
                                    <td>{rpOrden.lente_contacto ? (
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
                                    <td>{rpOrden?.tipo_cristal_od_codigo || rpOrden?.tipo_cristal_oi_codigo}</td>
                                    <td>
                                      <Tooltip title={rpOrden?.status ?? ""}>
                                        <span
                                          style={{
                                            display: 'inline-block',
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            backgroundColor:
                                              rpOrden?.status === 'Ok'
                                                ? 'green'
                                                : rpOrden?.status === 'Advertencia'
                                                  ? 'yellow'
                                                  : rpOrden?.status === 'Critico'
                                                    ? 'red'
                                                    : rpOrden?.status === 'Completado'
                                                      ? 'blue'
                                                      : 'gray',
                                          }}
                                        ></span>{" "}
                                      </Tooltip>
                                    </td>
                                    <td>{rpOrden?.created_at_formatted}</td>
                                    <td>{rpOrden?.nro_orden_id}</td>
                                    <td>{rpOrden?.pagado_nombre}</td>
                                    <td>{rpOrden?.sucursal?.nombre}</td>
                                    <td>{rpOrden?.doctor}</td>
                                    <td>{rpOrden?.elaborado_por_nombre}</td>
                                    <td>{rpOrden?.laboratorio}</td>
                                  </tr>

                                  {/* Fila para las correcciones */}
                                  {
                                    rpOrden.correciones && rpOrden.correciones.length > 0 &&
                                    rpOrden.correciones.map((correccion, index) => (
                                      <tr key={`correccion-${rpOrden.id_orden}-${index}`}>
                                        <td>{correccion.lente_contacto ? (
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
                                        <td>{correccion.tipo_cristal_od_codigo || correccion.tipo_cristal_oi_codigo}</td>
                                        <td>
                                          <Tooltip title={correccion.status ?? ""}>
                                            <span
                                              style={{
                                                display: 'inline-block',
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                backgroundColor:
                                                  correccion.status === 'Ok'
                                                    ? 'green'
                                                    : correccion.status === 'Advertencia'
                                                      ? 'yellow'
                                                      : correccion.status === 'Critico'
                                                        ? 'red'
                                                        : correccion.status === 'Completado'
                                                          ? 'blue'
                                                          : 'gray',
                                              }}
                                            ></span>{" "}
                                          </Tooltip>
                                        </td>
                                        <td>{moment(correccion.created_at).format('DD-MM-YYYY')}</td>
                                        <td>{correccion.correcion_format}</td>
                                        <td>{correccion.pagado_nombre}</td>
                                        <td>{correccion.nombre_sucursal}</td>
                                        <td>{correccion.doctor}</td>
                                        <td>{correccion.elaborado_por_nombre}</td>
                                        <td>{correccion.laboratorio}</td>
                                      </tr>
                                    ))
                                  }
                                </>
                              );
                            })
                          }
                        </tbody>



                      </table>)}
                    <PaginationReportesOrdenes
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

  )
}

export default ReporteOrdenes