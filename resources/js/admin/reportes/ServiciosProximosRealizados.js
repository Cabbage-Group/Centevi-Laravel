import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PaginationProximasCitas from './PaginationProximasCitas';
import DateRangePicker from './DateRangePicker';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice';
import ExportButton from './exportButton';
import { transformDataForServiciosRealizados, transformDataForServiciosProximos } from '../../../utils/dataTransform';
import { BookTwoTone } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { Button, Col, Divider, Input, Modal, Row, List } from 'antd';
import moment from 'moment';
import { fetchServiciosRealizados, setSortOrder, setSortColumn, setFechaRange } from '../../redux/features/reportes/serviciosRealizadosSlice';
import PaginationServiciosRealizados from './PaginationServiciosRealizados';
import { fetchServiciosProximos, setSortColumnServiciosProximos, setSortOrderServiciosProximos, setFechaRangeServiciosProximos } from '../../redux/features/reportes/serviciosProximosSlice';
import PaginationServiciosProximos from './PaginationServiciosProximos';

const ProximasCitas = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localSearch, setLocalSearch] = useState(search);

  const [currentPageserviciosProximos, setCurrentPageserviciosProximos] = useState(1);
  const [localEndDateServiciosProximos, setLocalEndDateServiciosProximos] = useState(endDateServiciosProximos);
  const [localStartDateServiciosProximos, setLocalStartDateServiciosProximos] = useState(startDateServiciosProximos);
  const [localSearchServiciosProximos, setLocalSearchServiciosProximos] = useState(searchServiciosProximos);


  const {
    serviciosRealizados,
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
  } = useSelector((state) => state.serviciosRealizados);

  const {
    serviciosProximos,
    sortColumnServiciosProximos,
    sortOrderServiciosProximos,
    metaServiciosProximos,
    totalPagesServiciosProximos,
    startDateServiciosProximos,
    endDateServiciosProximos,
    searchServiciosProximos,
    dataexportServiciosProximos,
    statusServiciosProximos,
    errorServiciosProximos
  } = useSelector((state) => state.serviciosProximos);

  useEffect(() => {
    dispatch(fetchServiciosRealizados({
      page: currentPage,
      limit: 10,
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
    dispatch(fetchServiciosProximos({
      page: currentPageserviciosProximos,
      limit: 10,
      sortOrderServiciosProximos,
      sortColumnServiciosProximos,
      startDateServiciosProximos,
      endDateServiciosProximos,
      searchServiciosProximos: localSearchServiciosProximos
    }))

  }, [
    dispatch,
    currentPageserviciosProximos,
    localSearchServiciosProximos,
    sortColumnServiciosProximos,
    sortOrderServiciosProximos,
    startDateServiciosProximos,
    endDateServiciosProximos
  ]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageChangeserviciosProximos = (page) => {
    setCurrentPageserviciosProximos(page);
  };

  const handleDateChange = () => {
    dispatch(setFechaRange({ startDate: localStartDate, endDate: localEndDate }));
  };

  const handleDateChangeServiciosProximos = () => {
    dispatch(setFechaRangeServiciosProximos({ startDateServiciosProximos: localStartDateServiciosProximos, endDateServiciosProximos: localEndDateServiciosProximos }));
  };

  const handleSearchChange = (event) => {
    setLocalSearch(event.target.value);
  };

  const handleSearchChangeServiciosProximos = (event) => {
    setLocalSearchServiciosProximos(event.target.value);
  };

  const handleClearSearch = () => {
    setLocalSearch('');
  };

  const handleClearSearchServiciosProximos = () => {
    setLocalSearchServiciosProximos('');
  };

  const handleSort = (newOrdenPor) => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setSortOrder(newOrder));
    dispatch(setSortColumn(newOrdenPor));
  };

  const handleSortserviciosProximos = (newOrdenPor) => {
    const newOrder = sortOrderServiciosProximos === 'asc' ? 'desc' : 'asc';
    dispatch(setSortOrderServiciosProximos(newOrder));
    dispatch(setSortColumnServiciosProximos(newOrdenPor));
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
                      Reporte de Servicios| Proximos | Realizados
                    </h6>
                  </div>
                  <div className="w-chart">
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12" style={{ marginTop: '-60px' }}>
              <div className="form-group col-md-4 mt-4">
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
                />
              </div>
              <div className="table-responsive">
                <div
                  className="dataTables_wrapper container-fluid dt-bootstrap4 no-footer"
                  id="html5-extension_wrapper"
                >
                  <div className="dt--top-section">
                    <div className="row">
                      <div className="col-sm-12 col-md-6 d-flex justify-content-md-start justify-content-center">
                        <div className="dt-buttons">
                          <ExportButton
                            dataexport={dataexport}
                            transformData={transformDataForServiciosRealizados}
                            fileName="servicios_realizados.xlsx"
                          />
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6 d-flex justify-content-md-end justify-content-center mt-md-0 mt-3">
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
                      </div>
                    </div>
                  </div>
                  {status === 'loading' && <p>Loading...</p>}
                  {status === 'failed' && <p>Error: {error}</p>}
                  {status === 'succeeded' && (
                    <div className="table-responsive">
                      <table aria-describedby="zero-config_info" className="table dt-table-hover tablas dataTable" id="zero-config" role="grid" style={{ width: '100%' }}>
                        <thead>
                          <tr role="row">
                            <th

                              aria-controls="zero-config"
                              aria-label={`Fecha_Proxima_Cita: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${sortOrder}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('ID_CONSULTA')}

                            >
                              ID_CONSULTA
                            </th>
                            <th

                              aria-controls="zero-config"
                              aria-label={`Nombre: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${sortOrder}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('FECHA_CONSULTA')}

                            >
                              FECHA_CONSULTA
                            </th>
                            <th

                              aria-controls="zero-config"
                              aria-label={`Celular: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${sortOrder}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('CONSULTA')}

                            >
                              CONSULTA
                            </th>
                            <th

                              aria-controls="zero-config"
                              aria-label={`Sucursal: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${sortOrder}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('CEDULA')}

                            >
                              CEDULA
                            </th>
                            <th
                              aria-controls="zero-config"
                              aria-label={`Doctor: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${sortOrder}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('PACIENTE')}

                            >
                              PACIENTE
                            </th>
                            <th

                              aria-controls="zero-config"
                              aria-label={`Doctor: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${sortOrder}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '130px' }}
                              tabIndex="0"
                              onClick={() => handleSort('SERVICIO_REALIZADO')}

                            >
                              SERVICIO_REALIZADO
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            serviciosRealizados.map((serviciosR) => {
                              // Mapeo de prefijos según el tipo de consulta
                              const prefixMapping = {
                                refracciongeneral: 'RG-',
                                optometria_pediatrica: 'OP-',
                                ortoptica_adultos: 'OA-',
                                consultagenerica: 'CG-',
                                optometria_neonatos: 'ON-'
                              };

                              // Obtener el prefijo basado en CONSULTA
                              const prefix = prefixMapping[serviciosR.CONSULTA.toLowerCase()] || '';

                              return (
                                <tr key={serviciosR.ID_CONSULTA}>
                                  <td>{`${prefix}${serviciosR.ID_CONSULTA}`}</td>
                                  <td>{moment.utc(serviciosR.FECHA_CONSULTA).format('DD-MM-YYYY')}</td>
                                  <td>{serviciosR.CONSULTA}</td>
                                  <td>{serviciosR.CEDULA}</td>
                                  <td>{serviciosR.PACIENTE}</td>
                                  <td>{serviciosR.SERVICIO_REALIZADO}</td>
                                </tr>
                              );
                            })
                          }
                        </tbody>
                      </table>
                      <PaginationServiciosRealizados
                        meta={meta}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group col-md-4 mt-4">
                <label>
                  Buscar por Fecha:
                </label>
                <DateRangePicker
                  startDate={localStartDateServiciosProximos}
                  endDate={localEndDateServiciosProximos}
                  onChange={(start, end) => {
                    setLocalStartDateServiciosProximos(start);
                    setLocalEndDateServiciosProximos(end);
                  }}
                  onApply={handleDateChangeServiciosProximos}
                />
              </div>
              <div className="table-responsive">
                <div
                  className="dataTables_wrapper container-fluid dt-bootstrap4 no-footer"
                  id="html5-extension_wrapper"
                >
                  <div className="dt--top-section">
                    <div className="row">
                      <div className="col-sm-12 col-md-6 d-flex justify-content-md-start justify-content-center">
                        <div className="dt-buttons">
                          <ExportButton
                            dataexport={dataexportServiciosProximos}
                            transformData={transformDataForServiciosProximos}
                            fileName="servicios_proximos.xlsx"
                          />
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6 d-flex justify-content-md-end justify-content-center mt-md-0 mt-3">
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
                              value={localSearchServiciosProximos}
                              onChange={handleSearchChangeServiciosProximos}
                            />
                            {localSearchServiciosProximos && (
                              <button
                                onClick={handleClearSearchServiciosProximos}
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
                      </div>
                    </div>
                  </div>
                  {statusServiciosProximos === 'loading' && <p>Loading...</p>}
                  {statusServiciosProximos === 'failed' && <p>Error: {errorServiciosProximos}</p>}
                  {statusServiciosProximos === 'succeeded' && (
                    <div className="table-responsive">

                      <table aria-describedby="zero-config_info" className="table dt-table-hover tablas dataTable" id="zero-config" role="grid" style={{ width: '100%' }}>
                        <thead>
                          <tr role="row">
                            <th

                              aria-controls="zero-config"
                              aria-label={`Fecha_Proxima_Cita: activate to sort column ${sortOrderServiciosProximos === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${sortOrderServiciosProximos}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSortserviciosProximos('ID_CONSULTA')}

                            >
                              ID_CONSULTA
                            </th>
                            <th

                              aria-controls="zero-config"
                              aria-label={`Nombre: activate to sort column ${sortOrderServiciosProximos === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${sortOrderServiciosProximos}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSortserviciosProximos('FECHA_CONSULTA')}

                            >
                              FECHA_CONSULTA
                            </th>
                            <th

                              aria-controls="zero-config"
                              aria-label={`Celular: activate to sort column ${sortOrderServiciosProximos === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${sortOrderServiciosProximos}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSortserviciosProximos('CONSULTA')}

                            >
                              CONSULTA
                            </th>
                            <th

                              aria-controls="zero-config"
                              aria-label={`Sucursal: activate to sort column ${sortOrderServiciosProximos === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${sortOrderServiciosProximos}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSortserviciosProximos('CEDULA')}

                            >
                              CEDULA
                            </th>
                            <th
                              aria-controls="zero-config"
                              aria-label={`Doctor: activate to sort column ${sortOrderServiciosProximos === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${sortOrderServiciosProximos}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSortserviciosProximos('PACIENTE')}

                            >
                              PACIENTE
                            </th>
                            <th

                              aria-controls="zero-config"
                              aria-label={`Doctor: activate to sort column ${sortOrderServiciosProximos === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${sortOrderServiciosProximos}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '130px' }}
                              tabIndex="0"
                              onClick={() => handleSortserviciosProximos('SERVICIO_PROXIMO')}

                            >
                              SERVICIO_PROXIMO
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            serviciosProximos.map((serviciosP) => {
                              const prefixMapping = {
                                refracciongeneral: 'RG-',
                                optometria_pediatrica: 'OP-',
                                ortoptica_adultos: 'OA-',
                                consultagenerica: 'CG-',
                                optometria_neonatos: 'ON-'
                              };

                              const prefix = prefixMapping[serviciosP.CONSULTA.toLowerCase()] || '';

                              return (
                                <tr key={serviciosP.ID_CONSULTA}>
                                  <td>{`${prefix}${serviciosP.ID_CONSULTA}`}</td>
                                  <td>{moment.utc(serviciosP.FECHA_CONSULTA).format('DD-MM-YYYY')}</td>
                                  <td>{serviciosP.CONSULTA}</td>
                                  <td>{serviciosP.CEDULA}</td>
                                  <td>{serviciosP.PACIENTE}</td>
                                  <td>{serviciosP.SERVICIO_PROXIMO}</td>
                                </tr>
                              )
                            })
                          }



                        </tbody>
                      </table>

                      <PaginationServiciosProximos
                        meta={metaServiciosProximos}
                        currentPage={currentPageserviciosProximos}
                        totalPages={totalPagesServiciosProximos}
                        onPageChange={handlePageChangeserviciosProximos}
                      />

                    </div>
                  )}
                </div>

              </div>


            </div>

          </div>

        </div>

      </div>
    </div>

  )
}

export default ProximasCitas