import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice.js';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice.js';
import { crearNeonato } from '../../redux/features/consultas/OptometriaNeonatosSlice.js';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Select, Button } from 'antd';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const OptometriaNeonatos = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { pacientes, pacientes_options_selecteds } = useSelector((state) => state.pacientes);
  const { sucursales } = useSelector((state) => state.sucursales);
  const { status, error } = useSelector((state) => state.optometriaNeonatos);
  const [selectedPaciente, setSelectedPaciente] = useState(null);

  const initialValues = {
    sucursal: '',
    doctor: localStorage.getItem('nombre'),
    id_terapia: '0',
    paciente: '',
    edad: '0',
    fecha_atencion: '',
    m_c: '',
    a_o: '',
    a_p: '',
    a_f: '',
    medicamentos: '',
    tratamientos: '',
    desarrollo: '',
    nacimiento: '',
    parto: '',
    gateo: '',
    lenguaje: '',
    complicaciones: '',
    perinatales: '',
    postnatales: '',
    agudeza_visual:
    {
      tambor: '',
      fija: '',
      sigue: '',
      mantiene: '',
      test: '',
      a_oi: '',
      a_ao: ''
    },
    lensometria:
    {
      esfera_od: '',
      cilindro_od: '',
      eje_od: '',
      p_base_od: '',
      add_od: '',
      esfera_oi: '',
      cilindro_oi: '',
      eje_oi: '',
      p_base_oi: '',
      add_oi: ''
    },

    lensometria_extra:
    {
      len_tipo_lentes: '',
      len_filtros: '',
      len_tiempo: '',
      len_tipo_aro: ''
    },
    sa_pp:
    {
      sa_od: '',
      pp_od: '',
      sa_oi: '',
      pp_oi: ''
    },

    pruebas_extras:
    {
      hirschberg: '',
      krismsky: '',
      plan_versiones: '',
      ct_vp: '',
      ct_reflejo: '',
      ducciones_od: '',
      ducciones_oi: '',
      posicion_compensatoria: '',
      fotomotor_od: '',
      consensual: '',
      fotomotor_oi: '',
      fotomotor_consensual: ''
    },
    refraccion:
    {
      refraccion_tipo_lentes: '',
      refraccion_pd: '',
      refraccion_uso: '',
      reflejo_r_od: '',
      reflejo_r_oi: '',
      reflejo_r_ao: '',
      esfera_od_f: '',
      cilindro_od_f: '',
      eje_od_f: '',
      p_base_od_f: '',
      add_od_f: '',
      esfera_oi_f: '',
      cilindro_oi_f: '',
      eje_oi_f: '',
      p_base_oi_f: '',
      add_oi_f: ''
    },
    conducta_seguir: '',
    plan_versiones: '',
    fecha_creacion: '',
    editado: '',
    fecha_proxima_consulta: '',
  };

  useEffect(() => {
    dispatch(fetchSucursales({ page: 1, limit: 100 }));
    dispatch(fetchPacientes({ page: 1, limit: 10000 }));
  }, []);

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
    console.log(e);
    // const { value } = e.target;
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
                      <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                        <h3 className="text-center">
                          Optometría Neonatos
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
                        const rpta = await dispatch(crearNeonato(values));
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
                      {({ setFieldValue, isSubmitting }) => (
                        <Form
                          method="post"
                          role="form"
                        >
                          <div className="form-row mb-12">
                            <div className="form-group col-md-12">
                              <label htmlFor="paciente">Pacientes</label>
                              <Select
                                showSearch
                                placeholder="Seleccione el paciente"
                                filterOption={(input, option) =>
                                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
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
                              {/* <Field
                                as="select"
                                name="paciente"
                                className="form-control"
                                onChange={(e) => {
                                  handlePacienteChange(e, setFieldValue)
                                }}
                              >
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
                              <label htmlFor="edad">Edad</label>
                              <Field
                                as="input"
                                name="edad"
                                className="form-control"
                                id="edad"
                                readOnly
                              />
                              <ErrorMessage name="edad" component="div" className="text-danger" />
                            </div>
                            <div className="form-group col-md-3">
                              <label>Fecha de atención</label>
                              <Field
                                type="date"
                                name="fecha_atencion"
                                className="form-control"
                              />
                              <ErrorMessage name="fecha_atencion" component="div" className="text-danger" />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <label htmlFor="m_c">Motivo de consulta</label>
                              <Field
                                as="textarea"
                                name="m_c"
                                className="form-control textarea"
                                maxLength="10000"
                                rows="15"
                              />
                              <ErrorMessage name="m_c" component="div" className="text-danger" />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-4">
                              <label htmlFor="lugarNacimiento">
                                Antecedentes Oculares
                              </label>
                              <Field
                                as="input"
                                className="form-control"
                                id="lugarNacimiento"
                                name="a_o"
                              />
                              <ErrorMessage name="a_o" component="div" className="text-danger" />
                            </div>
                            <div className="form-group col-md-4">
                              <label htmlFor="inputAddress2">
                                Antecedentes Personales
                              </label>
                              <Field
                                className="form-control"
                                id="inputAddress2"
                                name="a_p"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-4">
                              <label htmlFor="inputAddress2">
                                Antecedentes Familiares
                              </label>
                              <Field
                                className="form-control"
                                id="inputAddress2"
                                name="a_f"
                                as="input"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <label htmlFor="medicamentos">
                                Medicamentos
                              </label>
                              <Field
                                className="form-control"
                                id="medicamentos"
                                name="medicamentos"
                                as="input"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <label htmlFor="tratamientos">
                                Tratamientos anteriores
                              </label>
                              <Field
                                className="form-control"
                                id="tratamientos"
                                name="tratamientos"
                                as="input"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <label htmlFor="tratamientos">
                                Desarrollo del infante
                              </label>
                              <Field
                                className="form-control"
                                id="tratamientos"
                                name="desarrollo"
                                as="input"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-3">
                              <label htmlFor="tratamientos">
                                Nacimiento
                              </label>
                              <Field
                                className="form-control"
                                id="tratamientos"
                                name="nacimiento"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="tratamientos">
                                Parto
                              </label>
                              <Field
                                className="form-control"
                                id="tratamientos"
                                name="parto"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="tratamientos">
                                Gateo
                              </label>
                              <Field
                                className="form-control"
                                id="tratamientos"
                                name="gateo"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="tratamientos">
                                Lenguaje
                              </label>
                              <Field
                                className="form-control"
                                id="tratamientos"
                                name="lenguaje"
                                as="input"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-4">
                              <label htmlFor="tratamientos">
                                Complicaciones Prenatales
                              </label>
                              <Field
                                className="form-control"
                                id="tratamientos"
                                name="complicaciones"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-4">
                              <label htmlFor="tratamientos">
                                Perinatales
                              </label>
                              <Field
                                className="form-control"
                                id="tratamientos"
                                name="perinatales"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-4">
                              <label htmlFor="tratamientos">
                                Postnatales
                              </label>
                              <Field
                                className="form-control"
                                id="tratamientos"
                                name="postnatales"
                                as="input"
                              />
                            </div>
                          </div>
                          <h6>
                            AGUDEZA VISUAL:
                          </h6>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-3">
                              <label htmlFor="tambor">
                                Tambor Optocinético AO{' '}
                              </label>
                              <Field
                                className="form-control"
                                name="agudeza_visual.tambor"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="fija">
                                Fija
                              </label>
                              <Field
                                className="form-control"
                                name="agudeza_visual.fija"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="sigue">
                                Sigue
                              </label>
                              <Field
                                className="form-control"
                                name="agudeza_visual.sigue"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="mantiene">
                                Mantiene
                              </label>
                              <Field
                                className="form-control"
                                name="agudeza_visual.mantiene"
                                as="input"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-4">
                              <label htmlFor="test">
                                Test mirada preferencial OD{' '}
                              </label>
                              <Field
                                className="form-control"
                                name="agudeza_visual.test"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-4">
                              <label htmlFor="oi">
                                OI
                              </label>
                              <Field
                                className="form-control"
                                name="agudeza_visual.a_oi"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-4">
                              <label htmlFor="ao">
                                AO
                              </label>
                              <Field
                                className="form-control"
                                name="agudeza_visual.a_ao"
                                as="input"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <h5>
                              RECETA EN USO
                            </h5>
                            <div className="table-responsive">
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th className="text-center">
                                      RX{' '}
                                    </th>
                                    <th>
                                      ESFERA
                                    </th>
                                    <th>
                                      CILINDRO
                                    </th>
                                    <th>
                                      EJE
                                    </th>
                                    <th>
                                      P/BASE △
                                    </th>
                                    <th>
                                      ADD
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="text-center">
                                      Ojo Derecho
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="lensometria.esfera_od"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="lensometria.cilindro_od"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="lensometria.eje_od"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="lensometria.p_base_od"
                                        placeholder="△"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="lensometria.add_od"
                                        as="input"
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-center">
                                      Ojo Izquierdo
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="lensometria.esfera_oi"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="lensometria.cilindro_oi"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="lensometria.eje_oi"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="lensometria.p_base_oi"
                                        placeholder="△"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="lensometria.add_oi"
                                        as="input"
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-3">
                              <label htmlFor="objetivos">
                                Tipo de lentes
                              </label>
                              <Field
                                className="form-control"
                                name="lensometria_extra.len_tipo_lentes"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="objetivos">
                                Filtros
                              </label>
                              <Field
                                className="form-control"
                                name="lensometria_extra.len_filtros"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="objetivos">
                                Tiempo
                              </label>
                              <Field
                                className="form-control"
                                name="lensometria_extra.len_tiempo"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="objetivos">
                                Tipo de Aro
                              </label>
                              <Field
                                className="form-control"
                                name="lensometria_extra.len_tipo_aro"
                                placeholder="len_tipo_aro"
                                as="input"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-3">
                              <h5>
                                Segmento Anterior
                              </h5>
                            </div>
                            <div className="form-group col-md-3">
                              <h5>
                                Polo Posterior
                              </h5>
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-3">
                              <Field
                                className="form-control"
                                name="sa_pp.sa_od"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <Field
                                className="form-control"
                                name="sa_pp.pp_od"
                                as="input"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-3">
                              <Field
                                className="form-control"
                                name="sa_pp.sa_oi"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <Field
                                className="form-control"
                                name="sa_pp.pp_oi"
                                as="input"
                              />
                            </div>
                          </div>

                          <div className="form-row mb-4">
                            <div className="form-group col-md-6">
                              <label htmlFor="tratamientos">
                                Hirschberg
                              </label>
                              <Field
                                className="form-control"
                                name="pruebas_extras.hirschberg"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-6">
                              <label htmlFor="tratamientos">
                                Krismsky
                              </label>
                              <Field
                                className="form-control"
                                id="I"
                                name="pruebas_extras.krismsky"
                                as="input"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <label htmlFor="inputAddress">
                                VERSIONES:
                              </label>
                              <Field
                                as="textarea"
                                className="form-control textarea"
                                id="textarea"
                                maxLength="10000"
                                name="plan_versiones"
                                rows="15"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-3">
                              <label htmlFor="tratamientos">
                                CT: VP:
                              </label>
                              <Field
                                className="form-control"
                                id="D"
                                name="pruebas_extras.ct_vp"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="tratamientos">
                                Reflejo Cocleopalpebral
                              </label>
                              <Field
                                className="form-control"
                                id="I"
                                name="pruebas_extras.ct_reflejo"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="tratamientos">
                                Ducciones:OD
                              </label>
                              <Field
                                className="form-control"
                                name="pruebas_extras.ducciones_od"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="tratamientos">
                                OI
                              </label>
                              <Field
                                className="form-control"
                                name="pruebas_extras.ducciones_oi"
                                as="input"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-8">
                              <label htmlFor="tratamientos">
                                Posición Compensatoria
                              </label>
                              <Field
                                className="form-control"
                                name="pruebas_extras.posicion_compensatoria"
                                as="input"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-3">
                              <label htmlFor="tratamientos">
                                Reflejos Pupilares: Fotomotor/OD{' '}
                              </label>
                              <Field
                                className="form-control"
                                name="pruebas_extras.fotomotor_od"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="tratamientos">
                                Consensual
                              </label>
                              <Field
                                className="form-control"
                                id="I"
                                name="pruebas_extras.consensual"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="tratamientos">
                                Fotomotor:OI
                              </label>
                              <Field
                                className="form-control"
                                id="I"
                                name="pruebas_extras.fotomotor_oi"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="tratamientos">
                                Consensual
                              </label>
                              <Field
                                className="form-control"
                                id="I"
                                name="pruebas_extras.fotomotor_consensual"
                                as="input"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-6">
                              <label htmlFor="inputAddress">
                                Reflejo retinoscopico OD:
                              </label>
                              <Field
                                className="form-control"
                                id="inputAddress"
                                name="refraccion.reflejo_r_od"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="inputAddress">
                                OI:
                              </label>
                              <Field
                                className="form-control"
                                id="inputAddress"
                                name="refraccion.reflejo_r_oi"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="inputAddress">
                                AO:
                              </label>
                              <Field
                                className="form-control"
                                id="inputAddress"
                                name="refraccion.reflejo_r_ao"
                                as="input"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <h5>
                              RECETA FINAL
                            </h5>
                            <div className="table-responsive">
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th className="text-center">
                                      RX{' '}
                                    </th>
                                    <th>
                                      ESFERA
                                    </th>
                                    <th>
                                      CILINDRO
                                    </th>
                                    <th>
                                      EJE
                                    </th>
                                    <th>
                                      P/BASE △
                                    </th>
                                    <th>
                                      ADD
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="text-center">
                                      Ojo Derecho
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="refraccion.esfera_od_f"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="refraccion.cilindro_od_f"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="refraccion.eje_od_f"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="refraccion.p_base_od_f"
                                        placeholder="△"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="refraccion.add_od_f"
                                        as="input"
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-center">
                                      Ojo Izquierdo
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="refraccion.esfera_oi_f"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="refraccion.cilindro_oi_f"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="refraccion.eje_oi_f"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="refraccion.p_base_oi_f"
                                        placeholder="△"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="refraccion.add_oi_f"
                                        as="input"
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-6">
                              <label htmlFor="inputAddress">
                                Tipo Lentes
                              </label>
                              <Field
                                className="form-control"
                                id="inputAddress"
                                name="refraccion.refraccion_tipo_lentes"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-2">
                              <label htmlFor="inputAddress">
                                PD:
                              </label>
                              <Field
                                className="form-control"
                                id="inputAddress"
                                name="refraccion.refraccion_pd"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-4">
                              <label htmlFor="inputAddress">
                                USO:
                              </label>
                              <Field
                                className="form-control"
                                id="inputAddress"
                                name="refraccion.refraccion_uso"
                                as="input"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <label htmlFor="inputAddress">
                                CONDUCTA A SEGUIR:
                              </label>
                              <Field
                                as="textarea"
                                className="form-control textarea"
                                maxLength="10000"
                                name="conducta_seguir"
                                rows="15"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-12">
                            <div className="form-group col-md-4">
                              <label>
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
                          {status === 'succeeded' && <p>Neonato creado con éxito</p>}
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

export default OptometriaNeonatos