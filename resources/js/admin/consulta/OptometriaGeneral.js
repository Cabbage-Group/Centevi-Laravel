import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice.js';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice.js';
import { crearGeneral } from '../../redux/features/consultas/OptomotriaGeneralSlice.js';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Select, Button } from 'antd';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { getCurrentMMYYYYDate } from '../../utils/DateUtils.js';

const OptometriaGeneral = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pacientes, pacientes_options_selecteds } = useSelector((state) => state.pacientes);
  const { sucursales } = useSelector((state) => state.sucursales);
  const { status, error } = useSelector((state) => state.optometriaGeneral);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const initialValues = {
    sucursal: '',
    doctor: localStorage.getItem('nombre'),
    id_terapia: '0',
    paciente: '',
    edad: '0',
    fecha_atencion: getCurrentMMYYYYDate(),
    m_c: '',
    a_o: '',
    a_p: '',
    a_f: '',
    medicamentos: '',
    tratamientos: '',
    av_sc: {
      av_sc_od_vl: "",
      av_sc_oi_vl: "",
      av_sc_od_vp: "",
      av_sc_oi_vp: "",
      av_sc_od_ph: "",
      av_sc_oi_ph: "",
    },
    av_cc: {
      av_cc_od_vl: "",
      av_cc_oi_vl: "",
      av_cc_od_vp: "",
      av_cc_oi_vp: "",
      av_cc_od_ph: "",
      av_cc_oi_ph: ""
    },
    ojo_dominante: '',
    mano_dominante: '',
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
    visuscopia: {
      hirschberg: "",
      ct_vl: "",
      ct_vp: "",
    },
    visuscopia_extra: {
      ppc_or: "",
      ppc_l: "",
      ppc_posicion: "",
      observaciones: "",
    },
    refraccion: {
      esfera_od_f: "",
      cilindro_od_f: "",
      eje_od_f: "",
      p_base_od_f: "",
      add_od_f: "",
      agz_od_f: "",
      esfera_oi_f: "",
      cilindro_oi_f: "",
      eje_oi_f: "",
      p_base_oi_f: "",
      add_oi_f: "",
      agz_oi_f: ""
    },
    tipo_lentes: {
      tipo_l: "",
      pd: "",
      dnp: "",
      alt: ""
    },
    lentes_contacto: {
      poder_od: "",
      poder_oi: "",
      cb_od: "",
      cb_oi: "",
      dia_od: "",
      dia_oi: "",
      lente_marca: "",
      lente_tipo: "",
    },
    pruebas: {
      vl_luces: "",
      vp_luces: "",
    },
    pruebas_extra: {
      randot: "",
      lang: "",
      vision_color: ""
    },
    acomodacion: {
      aa_od: "",
      aa_oi: "",
      fan_od: "",
      fan_cpm: "",
      aco_oi: "",
      aco_cpm: "",
      acp_fab: "",
      aco_falla: ""
    },
    acomodacion_extra: {
      mem_od: "",
      mem_oi: "",
      mem_arn: "",
      mem_arp: ""
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
  }, [dispatch]);

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

  const handleSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    dispatch(crearGeneral(values))
      .then((response) => {
        // Asumiendo que la respuesta contiene el ID del paciente
        const pacienteId = response.payload.paciente || values.paciente;

        Swal.fire({
          title: '¡Creación exitosa!',
          text: 'El registro ha sido creado correctamente.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            // Usa el ID del paciente para la navegación
            navigate(`/historia-paciente/${pacienteId}`);
          }
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al crear el registro.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };
  return (
    <div
      className="admin-data-content"
      style={{
        marginTop: '50px'
      }}
    >
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
                            Optometria General
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="widget-content widget-content-area">
                      <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                      >
                        {({ setFieldValue, isSubmitting }) => (
                          <Form
                            method="post"
                            role="form"
                          >
                            <div className="form-row mb-4">
                              <div className="form-group col-md-12">
                                <label >Pacientes</label>
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
                                {/* <Field as="select" name="paciente" className="form-control" onChange={(e) => handlePacienteChange(e, setFieldValue)}>
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
                                <label >Sucursal</label>
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
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-3">
                                <label htmlFor="inputAddress">
                                  Fecha de atencion
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  // max="2024-07-04"
                                  name="fecha_atencion"
                                  required
                                  type="date"
                                />
                              </div>
                            </div>
                            <div className="form-row mb-4">
                              <div className="form-group col-md-12">
                                <label htmlFor="inputAddress">
                                  Motivo de Consulta:
                                </label>
                                <Field
                                  className="form-control textarea"
                                  as="textarea"
                                  maxLength="10000"
                                  name="m_c"
                                  rows="15"
                                />
                              </div>
                            </div>
                            <div className="form-row mb-4">
                              <div className="form-group col-md-4">
                                <label htmlFor="lugarNacimiento">
                                  Antecedentes Oculares
                                </label>
                                <Field
                                  className="form-control"
                                  id="lugarNacimiento"
                                  name="a_o"
                                  as="input"
                                />
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

                            <h3>
                              AGUDEZA VISUAL
                            </h3>
                            <div className="form-row mb-4">
                              <div className="form-group col-md-6">
                                <div className="table-responsive">
                                  <table className="table table-bordered">
                                    <thead>
                                      <tr>
                                        <th className="text-center">
                                          AV/SC
                                        </th>
                                        <th>
                                          OD
                                        </th>
                                        <th>
                                          OI
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td className="text-center">
                                          Visión Lejana
                                        </td>
                                        <td>
                                          <Field
                                            className="form-control"
                                            name="av_sc.av_sc_od_vl"
                                            as="input"
                                          />
                                        </td>
                                        <td>
                                          <Field
                                            className="form-control"
                                            name="av_sc.av_sc_oi_vl"
                                            as="input"
                                          />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="text-center">
                                          Visión Próxima
                                        </td>
                                        <td>
                                          <Field
                                            className="form-control"
                                            name="av_sc.av_sc_od_vp"
                                            as="input"
                                          />
                                        </td>
                                        <td>
                                          <Field
                                            className="form-control"
                                            name="av_sc.av_sc_oi_vp"
                                            as="input"
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div className="form-group col-md-6">
                                <div className="table-responsive">
                                  <table className="table table-bordered">
                                    <thead>
                                      <tr>
                                        <th className="text-center">
                                          AV/CC
                                        </th>
                                        <th>
                                          OD
                                        </th>
                                        <th>
                                          OI
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td className="text-center">
                                          Visión Lejana
                                        </td>
                                        <td>
                                          <Field
                                            className="form-control"
                                            name="av_cc.av_cc_od_vl"
                                            as="input"
                                          />
                                        </td>
                                        <td>
                                          <Field
                                            className="form-control"
                                            name="av_cc.av_cc_oi_vl"
                                            as="input"
                                          />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="text-center">
                                          Visión Próxima
                                        </td>
                                        <td>
                                          <Field
                                            className="form-control"
                                            name="av_cc.av_cc_od_vp"
                                            as="input"
                                          />
                                        </td>
                                        <td>
                                          <Field
                                            className="form-control"
                                            name="av_cc.av_cc_oi_vp"
                                            as="input"
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>

                            <div className="form-group">
                              <h5>
                                LENSOMETRIA
                              </h5>
                              <div className="table-responsive">
                                <table className="table table-bordered">
                                  <thead>
                                    <tr>
                                      <th className="text-center">
                                        RX EN USO
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
                                        OD
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
                                        OI
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
                                  id="hirschberg"
                                  name="visuscopia.hirschberg"
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-3">
                                <label htmlFor="VL">
                                  CT: VL:
                                </label>
                                <Field
                                  className="form-control"
                                  id="VL"
                                  name="visuscopia.ct_vl"
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-3">
                                <label htmlFor="VP">
                                  VP
                                </label>
                                <Field
                                  className="form-control"
                                  id="VP"
                                  name="visuscopia.ct_vp"
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
                                  className="form-control textarea"
                                  as="textarea"
                                  maxLength="800"
                                  name="plan_versiones"
                                  rows="5"
                                />
                              </div>
                            </div>
                            <div className="form-row mb-4">
                              <div className="form-group col-md-2">
                                <label htmlFor="tratamientos">
                                  PPC: OR{' '}
                                </label>
                                <Field
                                  className="form-control"
                                  id="ppc_or"
                                  name="visuscopia_extra.ppc_or"
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-2">
                                <label htmlFor="tratamientos">
                                  L:{' '}
                                </label>
                                <Field
                                  className="form-control"
                                  id="ppc_l"
                                  name="visuscopia_extra.ppc_l"
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-6">
                                <label htmlFor="tratamientos">
                                  Posicion compensatoria:{' '}
                                </label>
                                <Field
                                  className="form-control"
                                  id="ppc_posicion"
                                  name="visuscopia_extra.ppc_posicion"
                                  as="input"
                                />
                              </div>
                            </div>
                            <div className="form-row mb-4">
                              <div className="form-group col-md-12">
                                <label htmlFor="inputAddress">
                                  OBSERVACIONES:
                                </label>
                                <Field
                                  className="form-control textarea"
                                  as="textarea"
                                  maxLength="500"
                                  name="visuscopia_extra.observaciones"
                                  rows="3"
                                />
                              </div>
                            </div>
                            <div className="table-responsive">
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th className="text-center">
                                      PRUEBAS SENSORIALES
                                    </th>
                                    <th className="text-center">
                                      VISION LEJANA
                                    </th>
                                    <th className="text-center">
                                      VISION PROXIMA
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="text-center">
                                      Luces de Worth
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="pruebas.vl_luces"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="pruebas.vp_luces"
                                        as="input"
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="form-row mb-4">
                              <div className="form-group col-md-3">
                                <h4 className="text-center">
                                  Estereopsis
                                </h4>
                              </div>
                              <div className="form-group col-md-3">
                                <label htmlFor="inputAddress">
                                  Randot:
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="pruebas_extra.randot"
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-3">
                                <label htmlFor="inputAddress">
                                  Lang:
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="pruebas_extra.lang"
                                  as="input"
                                />
                              </div>
                            </div>
                            <div className="form-row mb-4">
                              <div className="form-group col-md-12">
                                <label htmlFor="inputAddress">
                                  Visión de Color
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="pruebas_extra.vision_color"
                                  as="input"
                                />
                              </div>
                            </div>
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
                                    <th>
                                      AGUDEZA VISUAL
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
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="refraccion.agz_od_f"
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
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="refraccion.agz_oi_f"
                                        as="input"
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="form-row mb-4">
                              <div className="form-group col-md-6">
                                <label htmlFor="tratamientos">
                                  TIPO DE LENTE{' '}
                                </label>
                                <Field
                                  className="form-control"
                                  id="tipo_l"
                                  name="tipo_lentes.tipo_l"
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-2">
                                <label htmlFor="tratamientos">
                                  PD:{' '}
                                </label>
                                <Field
                                  className="form-control"
                                  id="pd"
                                  name="tipo_lentes.pd"
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-2">
                                <label htmlFor="tratamientos">
                                  DNP:
                                </label>
                                <Field
                                  className="form-control"
                                  id="dnp"
                                  name="tipo_lentes.dnp"
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-2">
                                <label htmlFor="tratamientos">
                                  ALTURA:
                                </label>
                                <Field
                                  className="form-control"
                                  id="alt"
                                  name="tipo_lentes.alt"
                                  as="input"
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <h5>
                                Lente de Contacto
                              </h5>
                              <div className="table-responsive">
                                <table className="table table-bordered">
                                  <thead>
                                    <tr>
                                      <th>
                                        PARAMETROS
                                      </th>
                                      <th>
                                        OD
                                      </th>
                                      <th className="text-center">
                                        OI
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="text-center">
                                        PODER
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="lentes_contacto.poder_od"
                                          as="input"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="lentes_contacto.poder_oi"
                                          as="input"
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        C.B
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="lentes_contacto.cb_od"
                                          as="input"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="lentes_contacto.cb_oi"
                                          as="input"
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        DIA
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="lentes_contacto.dia_od"
                                          as="input"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="lentes_contacto.dia_oi"
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
                                  Marca
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="lentes_contacto.lente_marca"
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-6">
                                <label htmlFor="inputAddress">
                                  Tipo:
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="lentes_contacto.lente_tipo"
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
                                  className="form-control textarea"
                                  as="textarea"
                                  maxLength="800"
                                  name="conducta_seguir"
                                  rows="5"
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
    </div>
  )
}

export default OptometriaGeneral