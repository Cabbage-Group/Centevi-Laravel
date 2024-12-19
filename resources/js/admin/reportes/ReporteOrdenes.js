import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DateRangePicker from './DateRangePicker';
import ExportButton from './exportButton';
import {transformDataForReporteOrdenes } from '../../../utils/dataTransform';
import { BookTwoTone } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { Button, Col, Divider, Input, Modal, Row, List, Tooltip } from 'antd';
import moment from 'moment';
import { fecthReportesOrdenes, setSortOrder, setSortColumn, setFechaRange } from '../../redux/features/reportes/reporteOrdenesSlice';
import PaginationReportesOrdenes from './PaginationReportesOrdenes';


const ReporteOrdenes = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localSearch, setLocalSearch] = useState(search);

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
                            transformData={transformDataForReporteOrdenes}
                            fileName="reporte_ordenes.xlsx"
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
                                            : rpOrden?.status  === 'Advertencia'
                                            ? 'yellow'
                                            : rpOrden?.status  === 'Critico'
                                            ? 'red'
                                            : 'gray',
                                      }}
                                    ></span>{" "}
                                    </Tooltip>
                                  </td>
                                  <td>{rpOrden?.created_at_formatted}</td>
                                  <td>{rpOrden?.nro_orden}</td>
                                  <td>{rpOrden?.pagado_nombre}</td>
                                  <td>{rpOrden?.sucursal.nombre}</td>
                                  <td>{rpOrden?.doctor}</td>
                                  <td>{rpOrden?.elaborado_por_nombre}</td>
                                  <td>{rpOrden?.laboratorio}</td>
                                </tr>
                              );
                            })
                          }
                        </tbody>
                      </table>
                      <PaginationReportesOrdenes
                        meta={meta}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
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

export default ReporteOrdenes