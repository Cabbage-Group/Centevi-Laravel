import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DateRangePicker from './DateRangePicker';
import ExportButton from './exportButton';
import { transformDataForReporteOrdenes } from '../../../utils/dataTransform';
import { Button, Col, Card, Row, Tooltip } from 'antd';
import { fetchReportesOrdenes, setSortOrder, setSortColumn, setFechaRange } from '../../redux/features/reportes/reporteOrdenesSlice';
import PaginationReportesOrdenes from './PaginationReportesOrdenes';
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
  const {
    reportesOrdenes,
    estados,
    lentes,
    laboratorios,
    pagos,
    doctores,
    sucursales,
    asesores,
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
    dispatch(fetchReportesOrdenes({
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

  console.log('dataexport', dataexport)

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
                            : {estados?.OK}
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
                            : {estados?.Advertencia}
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
                            : {estados?.Crítico}
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
                            : {estados?.Completado}
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
                      : {lentes?.contacto}
                    </p>
                    <p>
                      <img
                        src="assets/img/recetas/lentenormal.png"
                        alt="Lente de contacto"
                        style={{ width: '20px', height: '20px', marginRight: '8px' }}
                      />
                      : {lentes?.normales}
                    </p>
                  </Card>
                </div>

                <div className="col-md-4">
                  <Card title="Resumen Laboratorio" bordered={false} hoverable>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      <div style={{ width: '33%' }}>
                        <p>Ping: {laboratorios?.Ping}</p>
                        <p>Optilab: {laboratorios?.Optilab}</p>
                        <p>Centilab: {laboratorios?.Centilab}</p>
                      </div>
                      <div style={{ width: '33%' }}>
                        <p>Vista Pro: {laboratorios?.['Vista Pro']}</p>
                        <p>Haseth J&J: {laboratorios?.['Haseth J&J']}</p>
                      </div>
                      <div style={{ width: '33%' }}>
                        <p>Alcon: {laboratorios?.Alcon}</p>
                        <p>B+L: {laboratorios?.['B+L'] || 0} </p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="col-md-4" >
                  <Card title="Resumen de Pagos" bordered={false} hoverable>
                    <p>Pagado: {pagos?.Pagado}</p>
                    <p>Abonado: {pagos?.Cortesía}</p>
                    <p>Cortesia: {pagos?.Abonado}</p>
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
                    {doctores &&
                      Object.entries(doctores)
                        .slice(0, visibleCount)
                        .map(([doctorId, total]) => {
                          const truncatedBranchId = doctorId.length > 60;
                          const displayedBranchId = truncatedBranchId
                            ? doctorId.substring(0, 60) + '...'
                            : doctorId;
                          return (
                            <Tooltip title={`${doctorId}: ${total}`} key={doctorId}>
                              <p>
                                {displayedBranchId}: {total}
                              </p>
                            </Tooltip>
                          );
                        })}
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                      {visibleCount < Object.keys(doctores || {}).length ? (
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
                    {sucursales &&
                      Object.entries(sucursales)
                        .slice(0, visibleCountSucursal)
                        .map(([branchId, total]) => {
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
                      {visibleCountSucursal < Object.keys(sucursales || {}).length ? (
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
                    {asesores &&
                      Object.entries(asesores)
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
                      {visibleCountAsesor < Object.keys(asesores || {}).length ? (
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
                      </div>
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
                                    <td>{rpOrden?.codigo_cristal}</td>
                                    <td>
                                      <Tooltip title={rpOrden?.estado ?? ""}>
                                        <span
                                          style={{
                                            display: 'inline-block',
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            backgroundColor:
                                              rpOrden?.estado === 'OK'
                                                ? 'green'
                                                : rpOrden?.estado === 'Advertencia'
                                                  ? 'yellow'
                                                  : rpOrden?.estado === 'Critico'
                                                    ? 'red'
                                                    : rpOrden?.estado === 'Completado'
                                                      ? 'blue'
                                                      : 'gray',
                                          }}
                                        ></span>{" "}
                                      </Tooltip>
                                    </td>
                                    <td>{rpOrden?.created_at}</td>
                                    <td>{rpOrden?.nro_orden_id}</td>
                                    <td>{rpOrden?.pagado}</td>
                                    <td>{rpOrden?.sucursal}</td>
                                    <td>{rpOrden?.doctor}</td>
                                    <td>{rpOrden?.asesor}</td>
                                    <td>{rpOrden?.laboratorio}</td>
                                  </tr>

                                  {/* Fila para las correcciones */}
                                  {
                                    rpOrden.correcciones && rpOrden.correcciones.length > 0 &&
                                    rpOrden.correcciones.map((correccion, index) => (
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
                                        <td>{correccion.codigo_cristal}</td>
                                        <td>
                                          <Tooltip title={correccion.estado ?? ""}>
                                            <span
                                              style={{
                                                display: 'inline-block',
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                backgroundColor:
                                                  correccion.status === 'OK'
                                                    ? 'green'
                                                    : correccion.status === 'Advertencia'
                                                      ? 'yellow'
                                                      : correccion.status === 'Crítico'
                                                        ? 'red'
                                                        : correccion.status === 'Completado'
                                                          ? 'blue'
                                                          : 'gray',
                                              }}
                                            ></span>{" "}
                                          </Tooltip>
                                        </td>
                                        <td>{correccion.fecha}</td>
                                        <td>{`${correccion.nro_orden_id}-C${index + 1}`}</td>
                                        <td>{correccion.pagado}</td>
                                        <td>{correccion.sucursal}</td>
                                        <td>{correccion.doctor}</td>
                                        <td>{correccion.asesor}</td>
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