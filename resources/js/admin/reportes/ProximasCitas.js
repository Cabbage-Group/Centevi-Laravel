import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProximasCitas, actualizarContacto, setOrden, setOrdenPor, setFechaRange, updateCitaContacto, updateCitaAgendada, actualizarAgendo, actualizarNotaContacto } from '../../redux/features/reportes/proximasCitasSlice';
import PaginationProximasCitas from './PaginationProximasCitas';
import DateRangePicker from './DateRangePicker';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice';
import ExportButton from './exportButton';
import { transformDataForProximasCitas } from '../../../utils/dataTransform';
import { BookTwoTone } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { Button, Col, Divider, Input, Modal, Row, List } from 'antd';
import moment from 'moment';
import { fetchServicios } from '../../redux/features/servicios/serviciosSlice';

const ProximasCitas = () => {
  const dispatch = useDispatch();

  const {
    proximasCitas,
    status,
    startDate,
    endDate,
    error,
    meta,
    totalPages,
    orden,
    ordenPor,
    search,
    dataexport
  } = useSelector((state) => state.proximasCitas);

  const nombreUsuario = localStorage.getItem('nombre');
  const [showNotaContacto, setShowNotaContacto] = useState(false);
  const [showServicios, setShowServicios] = useState(false);
  const { servicios } = useSelector((state) => state.servicios);
  const [filaSeleccionada, setfilaSeleccionada] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearch, setLocalSearch] = useState(search);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [txtNotas, setTxtNotas] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(nombreUsuario);

  useEffect(() => {
    dispatch(fetchPacientes({}));
  }, []);

  useEffect(() => {
    const fetchParams = {
      page: currentPage,
      limit: 20,
      orden,
      ordenPor,
      startDate,
      endDate,
      search: localSearch,

    };
    dispatch(fetchProximasCitas(fetchParams));
    dispatch(fetchServicios());
  }, [dispatch, localSearch, currentPage, startDate, endDate, orden, ordenPor]);

  console.log('fetchServicios:', servicios)
  console.log('proximasCitas:', proximasCitas)
  const handleSearchChange = (event) => {
    setLocalSearch(event.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDateChange = () => {
    dispatch(setFechaRange({ startDate: localStartDate, endDate: localEndDate }));
  };

  const handleClearSearch = () => {
    setLocalSearch('');
  };

  const handleSort = (newOrdenPor) => {
    const newOrder = orden === 'asc' ? 'desc' : 'asc';
    dispatch(setOrden(newOrder));
    dispatch(setOrdenPor(newOrdenPor));
  };

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

  const handleContactoClick = (proximaCita) => {

    console.log('Datos de la cita:', proximaCita);
    Swal.fire({
      title: '¿Contactaste con este paciente?',
      text: '¡Acepta solo si tuviste la oportunidad de comunicarte con este paciente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, lo contacté',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {

        dispatch(actualizarContacto({
          tabla: proximaCita.NOMBRE_TABLA,
          id_consulta: proximaCita.ID_CONSULTA,
          hubo_contacto: 1
        }))
          .then(() => {
            console.log('Contacto actualizado exitosamente');
            dispatch(updateCitaContacto({ id_consulta: proximaCita.ID_CONSULTA, hubo_contacto: 1 }));
            Swal.fire('Contacto confirmado', '', 'success');
            dispatch(fetchProximasCitas({ page: currentPage, limit: 20, orden, ordenPor, startDate, endDate, search: localSearch })); // Actualiza los datos
          })
          .catch(() => {
            Swal.fire('Error al confirmar contacto', '', 'error');
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Contacto no confirmado', '', 'error');
      }
    });
  };

  const handleAgendadoClick = (proximaCita) => {
    if (proximaCita.CONTACTO === 1) {
      Swal.fire({
        title: '¿Agendaste la cita con este paciente?',
        text: '¡Acepta solo si has agendado la cita!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, la agendé',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          console.log('Confirmado por el usuario');

          const datosActualizar = {
            tabla: proximaCita.NOMBRE_TABLA,
            id_consulta: proximaCita.ID_CONSULTA,
            se_agendo: 1
          };

          console.log('Datos para actualizar agendado:', datosActualizar);

          dispatch(actualizarAgendo(datosActualizar))
            .then(() => {
              console.log('Cita agendada exitosamente');
              dispatch(updateCitaAgendada({ id_consulta: proximaCita.ID_CONSULTA, se_agendo: 1 }));
              Swal.fire('Cita agendada', '', 'success');
              dispatch(fetchProximasCitas({ page: currentPage, limit: 20, orden, ordenPor, startDate, endDate, search: localSearch }));
            })
            .catch((error) => {
              console.error('Error al agendar cita:', error.message);
              Swal.fire('Error al agendar cita', '', 'error');
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          console.log('Cancelado por el usuario');
          Swal.fire('Cita no agendada', '', 'error');
        }
      });
    } else {
      Swal.fire('Acción bloqueada', 'Lo sentimos, primero tienes que marcar que se contactó al paciente', 'error');
    }
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
                      Reporte de Pacientes | Proximas Citas
                    </h6>
                  </div>
                  <div className="w-chart">
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12" style={{ marginTop: '-60px' }}>
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
                  />
                </div>
                <div
                  className="col-sm-12 col-md-6 d-flex justify-content-md-start justify-content-center"
                  style={{ marginTop: '50px' }}
                >
                  <ExportButton
                    dataexport={dataexport}
                    transformData={transformDataForProximasCitas}
                    fileName="proximas_citas.xlsx"
                  />
                </div>
                <div className="col-sm-12 col-md-6 d-flex justify-content-md-end justify-content-center mt-md-0 mt-3">
                  <div
                    className="dataTables_filter"
                    id="html5-extension_filter"
                  >
                    <label>
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
                    </label>
                  </div>
                </div>
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
                              aria-label={`Fecha_Proxima_Cita: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${orden}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('PROXIMA_FECHA')}

                            >
                              Fecha Proxima Cita
                            </th>
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
                            {/* <th

                              aria-controls="zero-config"
                              aria-label={`Email: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                              className={`sorting ${orden}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                              onClick={() => handleSort('PACIENTE_EMAIL')}

                            >
                              Email
                            </th> */}
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
                              style={{ width: '130px' }}
                              tabIndex="0"

                            >
                              Se Contacto
                            </th>
                            <th
                              aria-controls="zero-config"
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '130px' }}
                              tabIndex="0"
                            >
                              El que contacto
                            </th>
                            <th
                              aria-controls="zero-config"
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '100px' }}
                              tabIndex="0"
                            >
                              Nota Contacto
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
                            {/* <th
                              aria-controls="zero-config"
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: '153.82px' }}
                              tabIndex="0"
                            >
                              Se Agendo
                            </th> */}

                          </tr>
                        </thead>
                        <tbody>
                          {proximasCitas.map((proximaCita) => (
                            <tr key={proximaCita.ID_PACIENTE}>
                              <td>
                                {
                                  moment.utc(proximaCita.PROXIMA_FECHA).format('DD-MM-YYYY')
                                }
                              </td>
                              <td>
                                {
                                  proximaCita.PACIENTE_NOMBRE.trim() + " " + proximaCita.PACIENTE_APELLIDO.trim()
                                }
                              </td>
                              {/* <td>{proximaCita.PACIENTE_EMAIL}</td> */}
                              <td>{proximaCita.PACIENTE_CELULAR}</td>
                              <td>{proximaCita.SUCURSAL}</td>
                              <td>{proximaCita.DOCTOR}</td>
                              <td
                                onClick={() => handleContactoClick(proximaCita)}
                                style={{ cursor: 'pointer' }}
                              >
                                {parseFloat(proximaCita.CONTACTO.toString()) === 1 ? 'Sí' : 'No'}
                              </td>
                              <td>
                                {proximaCita.USUARIO_NOMBRE}
                              </td>
                              <td
                                style={{
                                  textAlign: "center",
                                  fontSize: "20px",
                                  cursor: 'pointer'
                                }}
                                onClick={() => {
                                  setTxtNotas(proximaCita.NOTA_CONTACTO)
                                  setfilaSeleccionada(proximaCita)
                                  setShowNotaContacto(!showNotaContacto)
                                }}
                              >
                                <BookTwoTone />
                              </td>
                              <td
                                style={{
                                  textAlign: "center",
                                  fontSize: "20px",
                                  cursor: 'pointer'
                                }}
                                onClick={() => {
                                  setTxtNotas('Servicios')
                                  setfilaSeleccionada(proximaCita)
                                  setShowServicios(!showServicios)
                                }}
                              >
                                <BookTwoTone />
                              </td>
                              {/* <td
                                onClick={() => handleAgendadoClick(proximaCita)}
                                style={{ cursor: 'pointer' }}
                              >
                                {parseFloat(proximaCita.SE_AGENDO.toString()) === 1 ? 'Sí' : 'No'}
                              </td> */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    <PaginationProximasCitas
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
      <Modal
        title="Servicios"
        open={showServicios}
        onOk={() => setShowServicios(!showServicios)}
        onCancel={() => setShowServicios(!showServicios)}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div style={{ marginBottom: '20px' }}>
              <div><b>Próximos Servicios</b></div>
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
      <Modal
        title="Agregar Nota del Conctacto"
        open={showNotaContacto}
        onOk={() => {
          if (filaSeleccionada) {
            dispatch(actualizarNotaContacto({
              tabla: filaSeleccionada.NOMBRE_TABLA,
              id_consulta: filaSeleccionada.ID_CONSULTA,
              nota_contacto: txtNotas
            }))
              .then(() => {
                Swal.fire('Contacto confirmado', '', 'success');
                dispatch(fetchProximasCitas({ page: currentPage, limit: 20, orden, ordenPor, startDate, endDate, search: localSearch })); // Actualiza los datos
              })
              .catch(() => {
                Swal.fire('Error al confirmar contacto', '', 'error');
              });
          }

          setShowNotaContacto(!showNotaContacto)
        }}
        onCancel={() => setShowNotaContacto(!showNotaContacto)}
      >
        <Row>
          <Col xxl={12} xl={12}>
            <div style={{ height: '50px' }}>
              <div><b>Fecha Proxima Cita</b></div>
              <div> {filaSeleccionada?.PROXIMA_FECHA} </div>
            </div>
            <Divider />
            <div style={{ height: '30px' }}>
              <div><b>Nombre</b> </div>
              <div> {filaSeleccionada?.PACIENTE_NOMBRE + " " + filaSeleccionada?.PACIENTE_APELLIDO} </div>
            </div>
            <Divider />
            <div style={{ height: '30px' }}>
              <div><b>Celular</b> </div>
              <div> {filaSeleccionada?.PACIENTE_CELULAR} </div>
            </div>
            <Divider />
            <div style={{ height: '50px' }}>
              <div><b>El que contacto</b> </div>
              <div> {filaSeleccionada?.USUARIO_NOMBRE} </div>
            </div>
          </Col>
          <Col xxl={12} xl={12}>
            <div style={{ height: '50px' }}>
              <div><b>Sucursal</b> </div>
              <div> {filaSeleccionada?.SUCURSAL} </div>
            </div>
            <Divider />
            <div style={{ height: '30px' }}>
              <div><b>Doctor</b> </div>
              <div> {filaSeleccionada?.DOCTOR} </div>
            </div>
            <Divider />
            <div style={{ height: '30px' }}>
              <div><b>Se Contacto</b> </div>
              <div> {parseFloat(filaSeleccionada?.CONTACTO?.toString()) === 1 ? 'Sí' : 'No'} </div>
            </div>
            <Divider />
            <div style={{ height: '30px' }}>
              <div><b>Fecha de Contacto</b> </div>
              <div> {
                filaSeleccionada && filaSeleccionada.FECHA_CONTACTO
                  ? moment.utc(filaSeleccionada?.FECHA_CONTACTO).format('DD-MM-YYYY HH:mm')
                  : ""
              } </div>
            </div>
          </Col>
          <Col xxl={24} xl={24}>
            <div>
              <b>Escribe la nota:</b>
              <Input.TextArea
                value={txtNotas}
                onChange={(e) => setTxtNotas(e.target.value)}
              />
            </div>
          </Col>
        </Row>
        {/* <Button
          onClick={() => {
            console.log(filaSeleccionada);
          }}
        >click</Button> */}
      </Modal>
    </div>
  )
}

export default ProximasCitas