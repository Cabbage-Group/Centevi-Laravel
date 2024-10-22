import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice';
import { fetchTotalPacientesMenores } from '../../redux/features/pacientes/pacientesMenoresSlice';
import { fetchTotalPacientesAdultos } from '../../redux/features/pacientes/pacientesAdultosSlice';
import { fetchTotalUsuariosDoctor } from '../../redux/features/usuarios/usuariosDoctorSlice';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice';
import { fetchUsuarios } from '../../redux/features/usuarios/usuariosSlice';
import { funPermisosObtenidos } from '../../utils/ValidarPermisos';
import PacienteAtendidoDia from '../../admin/reportes/PacienteAtendidoDia';
import { Select } from 'antd';

const Home = () => {

  const dispatch = useDispatch();
  const { total, } = useSelector((state) => state.pacientesMenores);
  const { permisos } = useSelector((state) => state.auth);
  const { totalAdultos } = useSelector((state) => state.pacientesAdultos);
  const { totalDoctor } = useSelector((state) => state.usuariosDoctor);
  const { metaSucursales } = useSelector((state) => state.sucursales);
  const { meta, pacientes, status, error } = useSelector((state) => state.pacientes);
  const [currentPage, setCurrentPage] = useState(1);
  const nombreUsuario = localStorage.getItem('nombre');
  const { usuarios } = useSelector((state) => state.usuarios);
  // const [selectedDoctor, setSelectedDoctor] = useState(nombreUsuario);
  const [selectedDoctor, setSelectedDoctor] = useState('todos');

  useEffect(() => {
    const fetchParams = {
      page: currentPage,
      limit: 10,
      sortOrder: 'desc',
      sortColumn: 'fecha_creacion',
      doctor: selectedDoctor === 'todos' ? '' : selectedDoctor,
    };
    // dispatch(fetchPacientes({ page: currentPage, limit: 10, sortOrder: 'desc', sortColumn: 'fecha_creacion' }));
    dispatch(fetchPacientes(fetchParams))
    dispatch(fetchTotalPacientesMenores());
    dispatch(fetchTotalPacientesAdultos());
    dispatch(fetchTotalUsuariosDoctor());
    dispatch(fetchSucursales({}));
    dispatch(fetchUsuarios({}))
  }, [dispatch, currentPage, selectedDoctor]);

  const handleDoctorChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedDoctor(selectedValue);
  };

  return (
    <>
      <div className="admin-data-content" style={{ marginTop: 50 }}>
        <div className="row layout-top-spacing">
          <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">

            <div className="widget-content-area">
              <div className="widget-one">
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
                    <div className="widget widget-one">
                      <div className="widget-heading">
                        <h6 className="">Estadísticas</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="all-card" style={{ marginTop: '-90px' }}>
                  <div className="row">
                    <div className="col-lg-2 col-md-6">
                      <div className="widget widget-one_hybrid widget-referral">
                        <div className="widget-heading">
                          <div className="w-title">
                            <div className="w-icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className="feather feather-users">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                              </svg>
                            </div>
                            <div className="">
                              <p className="w-value">{meta.total}</p>
                              <h5 className="">PACIENTES</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="widget widget-one_hybrid widget-engagement">
                        <div className="widget-heading">
                          <div className="w-title">
                            <div className="w-icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className="feather feather-users">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                              </svg>
                            </div>
                            <div className="">
                              <p className="w-value">{total}</p>
                              <h5 className="">PACIENTES MENORES</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="widget widget-one_hybrid widget-followers">
                        <div className="widget-heading">
                          <div className="w-title">
                            <div className="w-icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className="feather feather-users">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                              </svg>
                            </div>
                            <div className="">
                              <p className="w-value">{totalAdultos}</p>
                              <h5 className="">PACIENTES ADULTOS</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-6">
                      <div className="widget widget-one_hybrid widget-followers">
                        <div className="widget-heading">
                          <div className="w-title">
                            <div className="w-icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className="feather feather-users">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                              </svg>
                            </div>
                            <div className="">
                              <p className="w-value">{totalDoctor}</p>
                              <h5 className="">DOCTORES</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-6">
                      <div className="widget widget-one_hybrid widget-referral">
                        <div className="widget-heading">
                          <div className="w-title">
                            <div className="w-icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className="feather feather-cpu">
                                <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                                <rect x="9" y="9" width="6" height="6"></rect>
                                <line x1="9" y1="1" x2="9" y2="4" />
                                <line x1="15" y1="1" x2="15" y2="4" />
                                <line x1="9" y1="20" x2="9" y2="23" />
                                <line x1="15" y1="20" x2="15" y2="23" />
                                <line x1="20" y1="9" x2="23" y2="9" />
                                <line x1="20" y1="14" x2="23" y2="14" />
                                <line x1="1" y1="9" x2="4" y2="9" />
                                <line x1="1" y1="14" x2="4" y2="14" />
                              </svg>
                            </div>
                            <div className="">
                              <p className="w-value">{metaSucursales.total}</p>
                              <h5 className="">SUCURSALES</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row" style={{ marginTop: '-70px' }}>
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
                    <div className="widget-four">
                      <div className="widget-heading" style={{ marginBottom: '-15px' }}>
                        <h5 className="">ÚLTIMOS PACIENTES</h5>
                      </div>
                      {/* Nuevo select para buscar por doctor */}
                      {
                        funPermisosObtenidos(
                          permisos,
                          "home.buscarpordoctor",
                          <div className="form-group col-md-4 mt-4" style={{ marginLeft: '-10px' }}>
                            <label>Buscar por Doctor:</label>
                            <select
                              // showSearch
                              // style={{
                              //   width: "100%",
                              //   height: "52px",
                              //   color: "black",
                              //   fontWeight: "bold",
                              // }}
                              className="form-control"
                              value={selectedDoctor}
                              onChange={handleDoctorChange}
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

                      <div className="table-responsive">
                        {status === 'loading' && <p>Loading...</p>}
                        {status === 'failed' && <p>Error: {error}</p>}
                        {status === 'succeeded' && (
                          <table
                            className="table dt-table-hover tabla_pacientes"
                            id="zero-config"
                            style={{
                              width: '100%'
                            }}
                          >
                            <thead>
                              <tr>
                                <th>
                                  Nombres de Paciente
                                </th>
                                <th>
                                  Cedula
                                </th>
                                <th>
                                  Telefono
                                </th>
                                <th>
                                  Email
                                </th>
                                <th>
                                  Doctor
                                </th>
                                <th>
                                  Direccion
                                </th>
                                <th>
                                  Fecha de creacion
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                pacientes.length <= 10
                                  ? pacientes.map((paciente) => (
                                    <tr key={paciente.id_paciente}>
                                      <td>{`${paciente.nombres} ${paciente.apellidos}`}</td>
                                      <td>{paciente.nro_cedula}</td>
                                      <td>{paciente.telefono}</td>
                                      <td>{paciente.email}</td>
                                      <td>{paciente.doctor}</td>
                                      <td>{`${paciente.direccion}, ${paciente.lugar_nacimiento}`}</td>
                                      <td>
                                        {
                                          moment(paciente?.fecha_creacion).format('YYYY-MM-DD')
                                        }
                                      </td>
                                      <td>
                                      </td>
                                    </tr>
                                  ))
                                  : null
                              }
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="all-card">
        <div className="row">
          <div className="col-lg-2 col-md-6">
            <div className="widget widget-one_hybrid widget-referral">
              <div className="widget-heading">
                <div className="w-title">
                  <div className="w-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="feather feather-users">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="">
                    <p className="w-value">8819</p>
                    <h5 className="">PACIENTES</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="widget widget-one_hybrid widget-engagement">
              <div className="widget-heading">
                <div className="w-title">
                  <div className="w-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="feather feather-users">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="">
                    <p className="w-value">4592</p>
                    <h5 className="">PACIENTES MENORES</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="widget widget-one_hybrid widget-followers">
              <div className="widget-heading">
                <div className="w-title">
                  <div className="w-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="feather feather-users">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="">
                    <p className="w-value">4227</p>
                    <h5 className="">PACIENTES ADULTOS</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-6">
            <div className="widget widget-one_hybrid widget-followers">
              <div className="widget-heading">
                <div className="w-title">
                  <div className="w-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="feather feather-users">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="">
                    <p className="w-value">2</p>
                    <h5 className="">DOCTORES</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-6">
            <div className="widget widget-one_hybrid widget-referral">
              <div className="widget-heading">
                <div className="w-title">
                  <div className="w-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="feather feather-cpu">
                      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                      <rect x="9" y="9" width="6" height="6"></rect>
                      <line x1="9" y1="1" x2="9" y2="4" />
                      <line x1="15" y1="1" x2="15" y2="4" />
                      <line x1="9" y1="20" x2="9" y2="23" />
                      <line x1="15" y1="20" x2="15" y2="23" />
                      <line x1="20" y1="9" x2="23" y2="9" />
                      <line x1="20" y1="14" x2="23" y2="14" />
                      <line x1="1" y1="9" x2="4" y2="9" />
                      <line x1="1" y1="14" x2="4" y2="14" />
                    </svg>
                  </div>
                  <div className="">
                    <p className="w-value">5</p>
                    <h5 className="">SUCURSALES</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
        {/* <div className="row">
        <div className="col-xl-7 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
          <div className="widget-four">
            <div className="widget-heading">
              <h5 className="">ÚLTIMOS PACIENTES</h5>
            </div>
            <div className="table-responsive">
              <table id="zero-config" className="table dt-table-hover tabla_pacientes" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Nombres de Paciente</th>
                    <th>Cedula</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Fecha de creación</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ZAPATO POLO</td>
                    <td>2992</td>
                    <td>29292911</td>
                    <td>SAA@GMAIL.COM</td>
                    <td>2024-06-19</td>
                  </tr>
                  <tr>
                    <td>POLO9090 ASDLL</td>
                    <td>299091</td>
                    <td>222</td>
                    <td>L@GMAIL.COM</td>
                    <td>2024-06-19</td>
                  </tr>
                  <tr>
                    <td>pac33 paa</td>
                    <td>122</td>
                    <td>asdasd</td>
                    <td>a@gmail.com</td>
                    <td>2024-06-19</td>
                  </tr>
                  <tr>
                    <td>Gg pp</td>
                    <td>12333</td>
                    <td>11123</td>
                    <td>q@gmail.com</td>
                    <td>2024-06-19</td>
                  </tr>
                  <tr>
                    <td>pac2 asd</td>
                    <td>1234</td>
                    <td>222</td>
                    <td>asd@gmail.com</td>
                    <td>2024-06-19</td>
                  </tr>
                  <tr>
                    <td>niño prueba</td>
                    <td>123999</td>
                    <td>123999</td>
                    <td>nino@gmail.com</td>
                    <td>2024-06-12</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div> */}

      </div >

      {/*  */}

      <PacienteAtendidoDia 
        showFilters={false}
      />

    </>
  );
}

export default Home