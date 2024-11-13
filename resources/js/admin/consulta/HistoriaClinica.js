import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice.js';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice.js';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { crearHistoriaClinica } from '../../redux/features/consultas/HistoriaClinicaSlice.js';
import { Select, Button, Row, Col } from 'antd';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { getCurrentMMYYYYDate } from '../../utils/DateUtils.js';
import { fetchServicios } from '../../redux/features/servicios/serviciosSlice.js';
import { CloseCircleTwoTone } from '@ant-design/icons';

const HistoriaClinica = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pacientes, pacientes_options_selecteds } = useSelector((state) => state.pacientes);
  const { servicios } = useSelector((state) => state.servicios);
  const { sucursales } = useSelector((state) => state.sucursales);
  const { status, error } = useSelector((state) => state.consultagenerica);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [serviciosRealizados, setServiciosRealizados] = useState([]);
  const [proximosServicios, setProximosServicios] = useState([]);

  const initialValues = {
    sucursal: '',
    doctor: localStorage.getItem('nombre'),
    id_terapia: '0',
    paciente: '',
    edad: '0',
    fecha_atencion: getCurrentMMYYYYDate(),
    m_c: '',
    fecha_creacion: '',
    editado: '',
    fecha_proxima_consulta: '',
    hubo_contacto: false,
    se_agendo: false,
    servicios_realizados_historias_clinicas: [],
    servicios_proximos_historias_clinicas: []
  };

  useEffect(() => {
    dispatch(fetchSucursales({ page: 1, limit: 100 }));
    dispatch(fetchPacientes({ page: 1, limit: 10000 }));
    dispatch(fetchServicios())
  }, [dispatch]);

  console.log('servicios:', servicios)

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  };

  const validationSchema = Yup.object({
    sucursal: Yup.number().required('Required'),
    paciente: Yup.number().required('Required'),
    fecha_atencion: Yup.date().required('Required'),
  });

  const handlePacienteChange = (e, setFieldValue) => {
    const value = e;
    setSelectedPaciente(value);
    setFieldValue('paciente', value);
    const paciente = pacientes.find(p => p.id_paciente == value);

    if (paciente && paciente.fecha_nacimiento) {
      const edad = calculateAge(paciente.fecha_nacimiento);
      setFieldValue('edad', edad);
    }
  };




  return (
    <div className="row layout-top-spacing">
      <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
        <div className="widget-content-area br-4">
          <div className="widget-one">
            <div className="row">
              <div
                className="col-lg-12 layout-spacing"
                id="flFormsGrid"
              >
                <div className="statbox widget box box-shadow">
                  <div className="widget-header">
                    <div className="row">
                      <div
                        className="col-xl-12 col-md-12 col-sm-12 col-12"
                        style={{
                          textAlign: 'center'
                        }}
                      >
                        <h3>
                          Historia Clinica
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="widget-content widget-content-area">
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={async (values, { setSubmitting }) => {

                        setSubmitting(true);
                        console.log('Form values:', values);
                        const historiaClinicaData = {
                          ...values
                        };
                        const rpta = await dispatch(crearHistoriaClinica(historiaClinicaData));
                        setSubmitting(false);

                        Swal.fire({
                          title: 'La consulta ha sido guardado correctamente.',
                          text: '',
                          icon: 'success',
                          confirmButtonText: 'OK'
                        })
                          .then((result) => {
                            if (result.isConfirmed) {
                              navigate(`/historia-paciente/${values.paciente}`);
                              // location.reload();
                            }
                          });
                      }}
                    >
                      {({ setFieldValue, isSubmitting, values }) => (
                        <Form
                          method="post"
                          role="form"
                        >
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <label htmlFor="paciente">Pacientes</label>
                              <Select
                                showSearch
                                placeholder="Seleccione el paciente"
                                filterOption={(input, option) => {
                                  const searchTerms = input.toLowerCase().split(' ');
                                  return searchTerms.every(term =>
                                    (option?.label ?? '').toLowerCase().includes(term)
                                  );
                                }}
                                options={pacientes_options_selecteds}
                                style={{
                                  width: "100%",
                                  height: "52px",
                                  color: "black",
                                  fontWeight: "bold",
                                }}
                                onChange={(e) => {
                                  handlePacienteChange(e, setFieldValue)
                                }}
                              />
                              {/* <Field as="select" name="paciente" className="form-control form-small" onChange={(e) => handlePacienteChange(e, setFieldValue)}>
                                                                <option value="">Seleccione el paciente</option>
                                                                {pacientes.map((paciente) => (
                                                                    <option key={paciente.id_paciente} value={paciente.id_paciente}>
                                                                        Numero Cedula: {paciente.nro_cedula} || Nombres: {paciente.nombres} {paciente.apellidos}
                                                                    </option>
                                                                ))}
                                                            </Field> */}
                              <ErrorMessage name="paciente" component="div" className="text-danger" />
                            </div>
                          </div>
                          <div className="form-row mb-12">
                            <div className="form-group col-md-6">
                              <label htmlFor="inputSucursal">Sucursal</label>
                              <Field as="select" name="sucursal" className="form-control" id="sucursal">
                                <option value="">Seleccionar sucursal</option>
                                {sucursales.map((sucursal) => (
                                  <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>{sucursal.nombre}</option>
                                ))}
                              </Field>
                              <ErrorMessage name="sucursal" component="div" className="text-danger" />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="edad">
                                Edad
                              </label>
                              <Field
                                className="form-control"
                                id="edad"
                                name="edad"
                                readOnly
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="inputAddress">
                                Fecha de atencion
                              </label>
                              <Field
                                className="form-control"
                                // id="inputAddress"
                                // max="2024-07-04"
                                name="fecha_atencion"
                                required
                                type="date"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <label htmlFor="textarea">
                                Motivo de Consulta:
                              </label>
                              <Field
                                className="form-control textarea"
                                id="textarea"
                                maxLength="10000"
                                name="m_c"
                                placeholder=""
                                rows="25"
                                as="textarea"
                                required
                              />
                            </div>
                          </div>
                          <div className="form-row mb-12">
                            <div className="form-group col-md-4">
                              <label htmlFor="inputFehaProxCita">
                                Fecha de proxima cita
                              </label>
                              <Field
                                className="form-control"
                                name="fecha_proxima_consulta"
                                required
                                type="date"
                              />
                            </div>
                          </div>
                          {/* Selector de Tags */}

                          <Row gutter={[16, 16]} >
                            <Col xxl={12} xl={12} md={12}>
                              <div className="form-row mb-4">
                                <div className="form-group col-md-12">
                                  <label htmlFor="tags">Servicios Realizados</label>
                                  <Select
                                    showSearch
                                    value={null}
                                    style={{
                                      width: '100%', color: 'transparent',
                                      background: 'white !important'
                                    }}
                                    onChange={(value, val) => {
                                      if (!serviciosRealizados.find(servicio => servicio.value === value)) {
                                        const newServicios = [...serviciosRealizados, val];
                                        setServiciosRealizados(newServicios);
                                        setFieldValue('servicios_realizados_historias_clinicas', newServicios.map(s => s.value));
                                      }
                                    }}
                                    options={servicios.map(servicio => ({
                                      value: servicio.id,
                                      label: servicio.codigo + " | " + servicio.servicio
                                    }))}
                                  >
                                  </Select>
                                  <div
                                    style={{
                                      display: 'ruby',
                                      marginTop: '10px',
                                      marginBottom: '10px'
                                    }}
                                    onClick={() => {
                                    }}
                                  >
                                    {
                                      serviciosRealizados.map((servicio) => {
                                        return (
                                          <div
                                            style={{
                                              color: 'black',
                                              background: 'white',
                                              border: '1px solid gray',
                                              paddingTop: '5px',
                                              paddingBottom: '5px',
                                              paddingLeft: '10px',
                                              paddingRight: '10px',
                                              borderRadius: '20px',
                                              display: 'flex',
                                              marginRight: '5px',
                                              marginTop: '5px'
                                            }}
                                          >
                                            {servicio.label}
                                            <div
                                              style={{
                                                marginLeft: '5px',
                                                cursor: 'pointer'
                                              }}
                                              onClick={() => {
                                                const newServicios = serviciosRealizados.filter(serv => serv.value !== servicio.value);
                                                setServiciosRealizados(newServicios);
                                                setFieldValue('servicios_realizados_historias_clinicas', newServicios.map(s => s.value));
                                              }}
                                            >
                                              <CloseCircleTwoTone twoToneColor="#eb2f96" />
                                            </div>
                                          </div>
                                        )
                                      })
                                    }

                                  </div>
                                </div>
                              </div>
                            </Col>

                            <Col xxl={12} xl={12} md={12}>
                              <div className="form-row mb-4">
                                <div className="form-group col-md-12">
                                  <label htmlFor="tags">Proximos Servicios</label>
                                  <Select                               
                                    showSearch
                                    value={null}
                                    style={{
                                      width: '100%', color: 'transparent',
                                      background: 'white !important'
                                    }}
                                    onChange={(value, val) => {
                                      if (!proximosServicios.find(servicio => servicio.value == value)) {
                                        const newServicios = [...proximosServicios, val];
                                        setProximosServicios(newServicios)
                                        setFieldValue('servicios_proximos_historias_clinicas', newServicios.map(s => s.value));
                                      }
                                    }}
                                    options={servicios.map(servicio => ({
                                      value: servicio.id,
                                      label: servicio.codigo + " | " + servicio.servicio
                                    }))}
                                  >
                                  </Select>
                                  <div
                                    style={{
                                      display: 'ruby',
                                      marginTop: '10px',
                                      marginBottom: '10px'
                                    }}
                                    onClick={() => {
                                    }}
                                  >
                                    {
                                      proximosServicios.map((servicio) => {
                                        return (
                                          <div
                                            style={{
                                              color: 'black',
                                              background: 'white',
                                              border: '1px solid gray',
                                              paddingTop: '5px',
                                              paddingBottom: '5px',
                                              paddingLeft: '10px',
                                              paddingRight: '10px',
                                              borderRadius: '20px',
                                              display: 'flex',
                                              marginRight: '5px',
                                              marginTop: '5px'
                                            }}
                                          >
                                            {servicio.label}
                                            <div
                                              style={{
                                                marginLeft: '5px',
                                                cursor: 'pointer'
                                              }}
                                              onClick={() => {
                                                const newServicios = proximosServicios.filter(serv => serv.value !== servicio.value);
                                                setProximosServicios(newServicios)
                                                setFieldValue('servicios_proximos_historias_clinicas', newServicios.map(s => s.value));
                                              }}
                                            >
                                              <CloseCircleTwoTone twoToneColor="#eb2f96" />
                                            </div>
                                          </div>
                                        )
                                      })
                                    }

                                  </div>
                                </div>
                              </div>
                            </Col>
                          </Row>


                          <Button
                            className="btn btn-success mt-3"
                            htmlType="submit"

                            loading={isSubmitting}
                            disabled={isSubmitting}
                            style={{
                              display: 'flex'
                            }}
                          >
                            Guardar Consulta
                          </Button>
                          {status === 'loading' && <p>Enviando...</p>}
                          {status === 'failed' && <p>Error: {error}</p>}
                          {status === 'succeeded' && <p>Creado con éxito</p>}
                        </Form>
                      )}
                    </Formik>
                    {status === 'error' && <div className="alert alert-danger">{error}</div>}
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

export default HistoriaClinica