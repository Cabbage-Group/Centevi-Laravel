import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConsultasDiarias, setOrden, setOrdenPor, setFechaRange } from '../../redux/features/reportes/consultasDiariasSlice.js';
import PaginationConsultasDiarias from './PaginationConsultasDiarias';
import DateRangePicker from './DateRangePicker';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice.js';
import ExportButton from './exportButton';
import { transformDataForConsultasDiarias } from '../../../utils/dataTransform';
import { fetchUsuarios } from '../../redux/features/usuarios/usuariosSlice.js';
import { funPermisosObtenidos } from '../../utils/ValidarPermisos.js';

const ConsultasDiarias = () => {

  const dispatch = useDispatch();
  const metaPacientes = useSelector((state) => state.pacientes.meta);
  const { permisos } = useSelector((state) => state.auth);
  const { consultasDiarias, status, error, meta, totalPages, orden, startDate, endDate, ordenPor, search, dataexport } = useSelector((state) => state.consultasDiarias);
  const nombreUsuario = localStorage.getItem('nombre');
  const [currentPage, setCurrentPage] = useState(1);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localSearch, setLocalSearch] = useState(search);
  const { usuarios } = useSelector((state) => state.usuarios);
  const [selectedDoctor, setSelectedDoctor] = useState(nombreUsuario);

  useEffect(() => {
    dispatch(fetchPacientes({}));
    dispatch(fetchUsuarios({}))
  }, [dispatch]);

  useEffect(() => {
    const fetchParams = {
      page: currentPage,
      limit: 20,
      orden,
      ordenPor,
      startDate,
      endDate,
      search: localSearch,
      doctor: selectedDoctor
    };
    dispatch(fetchConsultasDiarias(fetchParams));
  }, [dispatch, localSearch, currentPage, orden, ordenPor, startDate, endDate, selectedDoctor]);


  const handleSearchChange = (event) => {
    setLocalSearch(event.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDateChange = () => {
    dispatch(setFechaRange({ startDate: localStartDate, endDate: localEndDate }));
    dispatch(fetchConsultasDiarias({ page: currentPage, startDate: localStartDate, endDate: localEndDate, limit: 20, orden, ordenPor }));
  };


  const handleSort = (newOrdenPor) => {
    const newOrder = orden === 'asc' ? 'desc' : 'asc';
    dispatch(setOrden(newOrder));
    dispatch(setOrdenPor(newOrdenPor));

  };

  const handleClearSearch = () => {
    setLocalSearch('');
  };

  const handleDoctorChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedDoctor(selectedValue === 'todos' ? '' : selectedValue);
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
                      Reporte de Pacientes | Consultas Diarias
                    </h6>
                  </div>
                  <div className="w-chart">
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group col-md-4 mt-4" style={{ display: 'flex', alignItems: 'start', gap: '20px' }}>
                <div style={{ marginRight: '10px' }}>
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
                <div className="col-sm-12 col-md-6 d-flex justify-content-md-start justify-content-center" style={{ marginTop: '35px' }}>
                  <ExportButton
                    dataexport={dataexport}
                    transformData={transformDataForConsultasDiarias}
                    fileName="consultas_diarias.xlsx"
                  />
                </div>
                <div className="d-flex flex-column">
                  <div className="dataTables_filter" id="html5-extension_filter">
                    <label style={{ width: '100%', position: 'relative' }}>
                      <input
                        style={{ marginTop: '50px', width: '200px', paddingRight: '30px' }}
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
                            top: '75%',
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
                            right: '10px',
                            top: '75%',
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
                {
                  funPermisosObtenidos(
                    permisos,
                    "reportes.atendidospordia.buscarpordoctor",
                    <div className="d-flex flex-column" style={{ minWidth: '250px', marginTop: '18px' }}>
                      <label>Buscar por Doctor:</label>
                      <select
                        className="form-control"
                        value={selectedDoctor}
                        onChange={handleDoctorChange}
                        style={{ width: '100%' }}
                      >
                        <option value="todos">Todos los doctores</option>
                        {usuarios.map((usuario) => (
                          <option key={usuario.id} value={usuario.nombre}>
                            {usuario.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                }
              </div>
              <div className="table-responsive">
                <div
                  className="dataTables_wrapper container-fluid dt-bootstrap4 no-footer"
                  id="html5-extension_wrapper"
                >
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
                              onClick={() => handleSort('PACIENTE_NOMBRE')}

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
                              onClick={() => handleSort('PACIENTE_CEDULA')}

                            >
                              Cedula
                            </th>
                            <th
                              aria-controls="zero-config"
                              aria-label={`Sucursal: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${orden}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('SUCURSAL')}

                            >
                              Sucursal
                            </th>
                            <th
                              aria-controls="zero-config"
                              aria-label={`Celular: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${orden}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('PACIENTE_CELULAR')}

                            >
                              Celular
                            </th>
                            <th
                              aria-controls="zero-config"
                              aria-label={`Tipo: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${orden}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('TIPO')}

                            >
                              Tipo de Consulta
                            </th>
                            <th
                              aria-controls="zero-config"
                              aria-label={`Fecha atencion: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${orden}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('FECHA_ATENCION')}

                            >
                              Fecha de atención
                            </th>
                            <th
                              aria-controls="zero-config"
                              aria-label={`Doctor: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${orden}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('DOCTOR')}

                            >
                              Doctor
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {consultasDiarias.map((consultaDiaria) => (
                            <tr key={consultaDiaria.ID_PACIENTE}>
                              <td>
                                {
                                  consultaDiaria.PACIENTE_NOMBRE.trim() + " " + consultaDiaria.PACIENTE_APELLIDO.trim()
                                }
                              </td>
                              <td>{consultaDiaria.PACIENTE_CEDULA}</td>
                              <td>{consultaDiaria.SUCURSAL}</td>
                              <td>{consultaDiaria.PACIENTE_CELULAR}</td>
                              <td>{consultaDiaria.TIPO}</td>
                              <td>{consultaDiaria.FECHA_ATENCION}</td>
                              <td>{consultaDiaria.DOCTOR}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    <PaginationConsultasDiarias
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

export default ConsultasDiarias