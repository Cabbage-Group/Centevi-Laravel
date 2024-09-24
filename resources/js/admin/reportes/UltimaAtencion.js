import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { fetchUltimaAtencion, setOrden, setFechaRange, setOrdenPor, setSearch } from '../../redux/features/reportes/ultimaAtencionSlice';
import PaginationUltimaAtencion from './PaginationUltimaAtencion';
import DateRangePicker from './DateRangePicker';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice';
import ExportButton from './exportButton';
import { transformDataForUltimaAtencion } from '../../../utils/dataTransform';



const UltimaAtencion = () => {

  const dispatch = useDispatch();
  const metaPacientes = useSelector((state) => state.pacientes.meta);
  const { ultimaAtencion, meta, status, error, startDate, endDate, orden, ordenPor, totalPages, search, dataexport } = useSelector((state) => state.ultimaAtencion);

  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localSearch, setLocalSearch] = useState(search);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchPacientes({}));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUltimaAtencion({ page: currentPage, limit: 20, orden, ordenPor, startDate, endDate, search: localSearch }));
  }, [dispatch, localSearch, currentPage, startDate, endDate, orden, ordenPor]);

  const handleSearchChange = (event) => {
    setLocalSearch(event.target.value); // Actualiza el estado local
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDateChange = () => {
    dispatch(setFechaRange({ startDate: localStartDate, endDate: localEndDate }));
    dispatch(fetchUltimaAtencion({ startDate: localStartDate, endDate: localEndDate, limit: 20, orden, ordenPor }))
      .catch(err => console.error('Error fetching terapias diarias on date change:', err));
  };

  const handleSort = (newOrdenPor) => {
    const newOrder = orden === 'asc' ? 'desc' : 'asc';
    dispatch(setOrden(newOrder));
    dispatch(setOrdenPor(newOrdenPor));
    dispatch(fetchUltimaAtencion({ page: currentPage, startDate, endDate, limit: 20, orden: newOrder, ordenPor: newOrderPor }));
  };

  const handleClearSearch = () => {
    setLocalSearch('');
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
                      Reporte de pacientes última atención
                    </h6>
                  </div>
                  <div className="w-chart">
                  </div>
                </div>
              </div>
            </div>
            <div className="all-card">
              <div className="row">
                <div className="col-lg-3 col-md-6">
                  <div className="widget widget-one_hybrid widget-referral">
                    <div className="widget-heading">
                      <div className="w-title">
                        <div className="w-icon">
                          <svg
                            className="feather feather-users"
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
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle
                              cx="9"
                              cy="7"
                              r="4"
                            />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </div>
                        <div className="">
                          <p className="w-value">
                            {metaPacientes.total}
                          </p>
                          <h5 className="">
                            PACIENTES
                          </h5>
                        </div>
                      </div>
                    </div>
                    <div className="widget-content">
                      <div className="w-chart">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
                <div className="widget-four">
                  <div className="widget-heading">
                    <h5 className="">
                      ULTIMOS PACIENTES
                    </h5>
                  </div>
                                    // Primer table

                </div>
              </div>
            </div>
            <div className="col-md-12">
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
                            transformData={transformDataForUltimaAtencion}
                            fileName="ultimaAtencion_diarias.xlsx"
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

                  <div className="table-responsive">
                    {status === 'loading' && <p>Loading...</p>}
                    {status === 'failed' && <p>Error: {error}</p>}
                    {status === 'succeeded' && (
                      <table aria-describedby="zero-config_info" className="table dt-table-hover tablas dataTable" id="zero-config" role="grid" style={{ width: '100%' }}>
                        <thead>
                          <tr role="row">
                            <th
                              aria-controls="zero-config"
                              aria-label={`Nombre: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${orden}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('nombres')}
                            >
                              Nombre
                            </th>
                            <th
                              aria-controls="zero-config"
                              aria-label={`Cedula: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${orden}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('nro_cedula')}
                            >
                              Cedula
                            </th>
                            <th
                              aria-controls="zero-config"
                              aria-label={`Email: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${orden}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('email')}
                            >
                              Email
                            </th>
                            <th
                              aria-controls="zero-config"
                              aria-label={`Direccion: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${orden}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('direccion')}
                            >
                              Direccion
                            </th>
                            <th
                              aria-controls="zero-config"
                              aria-label={`Ultima atencion: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${orden}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('ultima_atencion')}
                            >
                              Ultima atencion
                            </th>
                            <th
                              aria-controls="zero-config"
                              aria-label={`Doctores: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${orden}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('doctores')}
                            >
                              Doctores
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {ultimaAtencion.map((ultAten) => (
                            <tr key={ultAten.id_paciente}>
                              <td>
                                {
                                  ultAten.nombres.trim() + " " + ultAten.apellidos.trim()
                                }
                              </td>
                              <td>{ultAten.nro_cedula}</td>
                              <td>{ultAten.email}</td>
                              <td>{ultAten.direccion}</td>
                              <td>{ultAten.ultima_atencion}</td>
                              <td>{ultAten.doctores}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    <PaginationUltimaAtencion
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

  );
};


export default UltimaAtencion