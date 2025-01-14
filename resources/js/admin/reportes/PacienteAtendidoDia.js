import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PaginationAtendidosPorDia from './PaginationAtendidosPorDia';
import { fetchAtendidosPorDia, setOrden, setOrdenPor, setFechaRange } from '../../redux/features/reportes/atendidosPorDiaSilce';
import DateRangePicker from './DateRangePicker';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice';
import ExportButton from './exportButton';
import { transformDataForAtendidosPorDia } from '../../../utils/dataTransform';
import { fetchUsuarios } from '../../redux/features/usuarios/usuariosSlice';
import { BookTwoTone } from '@ant-design/icons';
import { funPermisosObtenidos } from '../../utils/ValidarPermisos';
import { Button, Col, Divider, Input, Modal, Row, List } from 'antd';
import { fetchServicios } from '../../redux/features/servicios/serviciosSlice';

const PacienteAtendidoDia = ({
  showFilters = true,
  paginate = true,
  limit = 20,
  column_celular = true
}) => {
  // const { showFilters } = props;
  const dispatch = useDispatch();
  const { permisos } = useSelector((state) => state.auth);
  const nombreUsuario = localStorage.getItem('nombre');
  const [filaSeleccionada, setfilaSeleccionada] = useState({});
  const [txtNotas, setTxtNotas] = useState("");
  const {
    atendidosPorDia,
    status,
    startDate,
    endDate, error, meta,
    totalPages,
    orden,
    ordenPor,
    search,
    dataexport
  } = useSelector((state) => state.atendidosPorDia);

  const [currentPage, setCurrentPage] = useState(1);
  const [localSearch, setLocalSearch] = useState(search);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const { usuarios, usuarios_activados } = useSelector((state) => state.usuarios);
  const [selectedDoctor, setSelectedDoctor] = useState(nombreUsuario);
  const [showServicios, setShowServicios] = useState(false);
  const { servicios } = useSelector((state) => state.servicios);


  useEffect(() => {
    // dispatch(fetchPacientes({}));
    dispatch(fetchUsuarios({}))
  }, []);



  useEffect(() => {
    const fetchParams = {
      page: currentPage,
      limit: limit,
      orden,
      ordenPor,
      startDate,
      endDate,
      search: localSearch,
      doctor: selectedDoctor
    };

    dispatch(fetchAtendidosPorDia(fetchParams));
    dispatch(fetchServicios());
  }, [localSearch, currentPage, startDate, endDate, orden, ordenPor, selectedDoctor]);

  console.log('atendidosPorDia:', atendidosPorDia)

  const handleSearchChange = (event) => {
    setLocalSearch(event.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDateChange = () => {
    dispatch(setFechaRange({ startDate: localStartDate, endDate: localEndDate }));
    dispatch(fetchAtendidosPorDia({ page: currentPage, startDate: localStartDate, endDate: localEndDate, limit: limit, orden, ordenPor }));
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

  console.log('showFilters', showFilters)

  const serviciosMap = servicios.reduce((acc, servicio) => {
    acc[servicio.id] = servicio.servicio;
    return acc;
  }, {});


  const proximosServicios = filaSeleccionada?.PROXIMOS_SERVICIOS_ID
    ? filaSeleccionada.PROXIMOS_SERVICIOS_ID
      .split(',') // Separa los IDs por coma
      .map((id) => serviciosMap[id.trim()]) // Mapea cada ID a su nombre
      .filter(Boolean) // Filtra valores undefined o null
    : [];

  const realizadosServicios = filaSeleccionada?.REALIZADOS_SERVICIOS_ID
    ? filaSeleccionada.REALIZADOS_SERVICIOS_ID
      .split(',') // Separa los IDs por coma
      .map((id) => serviciosMap[id.trim()]) // Mapea cada ID a su nombre
      .filter(Boolean) // Filtra valores undefined o null
    : [];


  return (
    <>
      <div className="row layout-top-spacing">
        <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
          <div className="widget-content-area br-4">
            <div className="widget-one">
              <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
                  <div className="widget widget-one">
                    <div className="widget-heading">
                      <h6 className="">
                        Reporte de pacientes atendidos por día
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
                      transformData={transformDataForAtendidosPorDia}
                      fileName="Atendidos_Por_Dia.xlsx"
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
                    showFilters ? (
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
                            {usuarios_activados.map((usuario) => (
                              <option key={usuario.id_usuario} value={usuario.nombre}>
                                {usuario.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                      )
                    ) : null
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
                                Nombre del Paciente2
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
                              {
                                column_celular && (
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
                                )
                              }

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
                              <th
                                aria-controls="zero-config"
                                colSpan="1"
                                rowSpan="1"
                                style={{ width: '100px' }}
                                tabIndex="0"
                              >
                                Servicios
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {atendidosPorDia.map((atendidoPorDia) => (
                              <tr key={atendidoPorDia.ID_PACIENTE}>
                                <td>
                                  {
                                    atendidoPorDia.PACIENTE_NOMBRE.trim() + " " + atendidoPorDia.PACIENTE_APELLIDO.trim()
                                  }
                                </td>
                                <td>{atendidoPorDia.PACIENTE_CEDULA}</td>
                                <td>{atendidoPorDia.SUCURSAL}</td>
                                {
                                  column_celular && (
                                    <td>{atendidoPorDia.PACIENTE_CELULAR}</td>
                                  )
                                }
                                <td>{atendidoPorDia.TIPO}</td>
                                <td>{atendidoPorDia.FECHA_ATENCION}</td>
                                <td>{atendidoPorDia.DOCTOR}</td>
                                <td
                                  style={{
                                    textAlign: "center",
                                    fontSize: "20px",
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => {
                                    setTxtNotas('Servicios')
                                    setfilaSeleccionada(atendidoPorDia)
                                    setShowServicios(!showServicios)
                                  }}
                                >
                                  <BookTwoTone />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                      {
                        paginate && (
                          <PaginationAtendidosPorDia
                            meta={meta}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                          />
                        )
                      }

                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Servicios"
        open={showServicios}
        onOk={() => setShowServicios(!showServicios)}
        onCancel={() => setShowServicios(!showServicios)}
      >
        <Row gutter={[16, 16]} justify="start">
          <Col span={12}>
            <div style={{ marginBottom: '20px' }}>
              <div><b>Proximos Servicios</b></div>
              <List
                size="small"
                bordered
                dataSource={proximosServicios}
                renderItem={(item) => <List.Item>{item}</List.Item>}
                locale={{
                  emptyText: 'No hay servicios',
                }}
              />
            </div>
          </Col>
          <Col span={12}>
            <div>
              <div><b>Servicios Realizados</b></div>
              <List
                size="small"
                bordered
                dataSource={realizadosServicios}
                renderItem={(item) => <List.Item>{item}</List.Item>}
                locale={{
                  emptyText: 'No hay servicios',
                }}
              />
            </div>
          </Col>
        </Row>
      </Modal>

      {/*  */}




    </>
  )
}

export default PacienteAtendidoDia