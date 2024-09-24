import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice.js';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice.js';
import { crearOrtoptica } from '../../redux/features/consultas/OrtopticaV_BSlice.js';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Select, Button } from 'antd';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const OrtopticaVisionBinocular = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pacientes, pacientes_options_selecteds } = useSelector((state) => state.pacientes);
  const { sucursales } = useSelector((state) => state.sucursales);
  const { status, error } = useSelector((state) => state.ortoptica);
  const [selectedPaciente, setSelectedPaciente] = useState(null);

  const initialValues = {
    sucursal: '',
    doctor: localStorage.getItem('nombre'),
    id_terapia: '0',
    paciente: '',
    edad: '0',
    fecha_atencion: new Date().toISOString().split('T')[0],
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
      len_tipo_arco: ''
    },

    sa_pp:
    {
      sa_od: '',
      pp_od: '',
      sa_oi: '',
      pp_oi: ''
    },

    visuscopia: {
      viscopia_od: "",
      viscopia_oi: "",
      hirschberg: "",
      krismsky: "",
      ct_vl: "",
      ct_vp: "",
      maddox: ""
    },
    visuscopia_extra: {
      seguimiento_ao: "",
      sacadicos_ao: "",
      ppc_or: "",
      ppc_l: "",
      ppc_fr: "",
      ppc_posicion: "",
      helshoswky: "",
      von_graefe: "",
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
    lentes_contacto: {
      poder_od: "",
      poder_oi: "",
      cb_od: "",
      cb_oi: "",
      dia_od: "",
      dia_oi: "",
      lente_marca: "",
      lente_tipo: "",
      lente_marca_1: "",
      lente_pd_1: "",
      lente_dnp_1: "",
      lente_altura_1: ""
    },
    pruebas: {
      vl_luces: "",
      vp_luces: "",
      vl_bg: "",
      vp_bg: ""
    },
    pruebas_extra: {
      estereosis: "",
      randot: "",
      lang: "",
      seg_arco: "",
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
    vergencia: {
      v_vt_vl: "",
      v_bt_vp: "",
      v_bn_vl: "",
      v_bn_vp: ""
    },
    conducta_seguir: '',
    plan_versiones: '',
    fecha_creacion: '',
    editado: {
      doctor: '',
      fecha_edicion: ''
    },
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

  return (
    <div className="admin-data-content" data-select2-id="12" style={{ marginTop: '50px' }}>
      <div className="row layout-top-spacing" data-select2-id="11">
        <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing" data-select2-id="10">
          <div className="widget-content-area br-4" data-select2-id="9">
            <div className="widget-one" data-select2-id="8">
              <div className="row" data-select2-id="7">
                <div className="col-lg-12 layout-spacing" data-select2-id="flFormsGrid" id="flFormsGrid">
                  <div className="statbox widget box box-shadow" data-select2-id="6">
                    <div className="widget-header">
                      <div className="row">
                        <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                          <h3 className="text-center">
                            Consulta de Ortóptica
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
                          const rpta = await dispatch(crearOrtoptica(values));
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
                                  // max="2024-07-05"
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
                                  name="m_c"
                                  as="textarea"
                                  maxLength="10000"
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
                                  placeholder=""
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
                                  placeholder=""
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
                                  placeholder=""
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
                                  placeholder=""
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
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                            </div>
                            <h5>
                              AGUDEZA VISUAL
                            </h5>
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
                                          VL
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
                                          VP
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
                                      <tr>
                                        <td className="text-center">
                                          PH
                                        </td>
                                        <td>
                                          <Field
                                            className="form-control"
                                            name="av_sc.av_sc_od_ph"
                                            as="input"
                                          />
                                        </td>
                                        <td>
                                          <Field
                                            className="form-control"
                                            name="av_sc.av_sc_oi_ph"
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
                                          VL
                                        </td>
                                        <td>
                                          <Field
                                            className="form-control"
                                            name="av_cc.av_cc_od_vl"
                                            placeholder=""
                                            as="input"
                                          />
                                        </td>
                                        <td>
                                          <Field
                                            className="form-control"
                                            name="av_cc.av_cc_oi_vl"
                                            placeholder=""
                                            as="input"
                                          />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="text-center">
                                          VP
                                        </td>
                                        <td>
                                          <Field
                                            className="form-control"
                                            name="av_cc.av_cc_od_vp"
                                            placeholder=""
                                            as="input"
                                          />
                                        </td>
                                        <td>
                                          <Field
                                            className="form-control"
                                            name="av_cc.av_cc_oi_vp"
                                            placeholder=""
                                            as="input"
                                          />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="text-center">
                                          PH
                                        </td>
                                        <td>
                                          <Field
                                            className="form-control"
                                            name="av_cc.av_cc_od_ph"
                                            placeholder=""
                                            as="input"
                                          />
                                        </td>
                                        <td>
                                          <Field
                                            className="form-control"
                                            name="av_cc.av_cc_oi_ph"
                                            placeholder=""
                                            as="input"
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-md-6">
                                <h6>
                                  OJO DOMINANTE
                                </h6>
                                <div className="form-row mb-4">
                                  <div className="form-group col-md-3">
                                    <div className="n-chk">
                                      <label className="new-control new-radio radio-classic-success">
                                        <input
                                          className="new-control-input"
                                          // value="IZQUIERDO"
                                          name="ojo_dominante"
                                          readOnly
                                          type="radio"
                                          onChange={() => {
                                            setFieldValue('ojo_dominante', 'IZQUIERDO');
                                          }}
                                        // checked={ortoptica ? ortoptica.ojo_dominante === 'IZQUIERDO' : false}
                                        />
                                        {/* <Field
                                          className="new-control-input"
                                          name="ojo_dominante"
                                          placeholder=""
                                          as="radio"
                                        /> */}
                                        <span className="new-control-indicator" />
                                        IZQUIERDO
                                      </label>
                                    </div>
                                  </div>
                                  <div className="form-group col-md-3">
                                    <div className="n-chk">
                                      <label className="new-control new-radio radio-classic-success">
                                        <input
                                          className="new-control-input"
                                          // value="DERECHO"
                                          name="ojo_dominante"
                                          readOnly
                                          type="radio"
                                          onChange={() => {
                                            setFieldValue('ojo_dominante', 'DERECHO');
                                          }}
                                        // checked={ortoptica ? ortoptica.ojo_dominante === 'DERECHO' : false}
                                        />
                                        <span className="new-control-indicator" />
                                        DERECHO
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <h6>
                                  MANO DOMINANTE
                                </h6>
                                <div className="form-row mb-4">
                                  <div className="form-group col-md-3">
                                    <div className="n-chk">
                                      <label className="new-control new-radio radio-classic-success">
                                        <input
                                          className="new-control-input"
                                          // value="IZQUIERDA"
                                          // disabled
                                          name="mano_dominante"
                                          type="radio"
                                          onChange={() => {
                                            setFieldValue('mano_dominante', 'IZQUIERDA');
                                          }}
                                        // checked={ortoptica ? ortoptica.mano_dominante === 'IZQUIERDA' : false}
                                        />
                                        <span className="new-control-indicator" />
                                        IZQUIEDA
                                      </label>
                                    </div>
                                  </div>
                                  <div className="form-group col-md-3">
                                    <div className="n-chk">
                                      <label className="new-control new-radio radio-classic-success">
                                        <input
                                          className="new-control-input"
                                          // value="DERECHO"
                                          // disabled
                                          name="mano_dominante"
                                          type="radio"
                                          onChange={() => {
                                            setFieldValue('mano_dominante', 'DERECHO');
                                          }}
                                        // checked={ortoptica ? ortoptica.mano_dominante === 'DERECHO' : false}
                                        />
                                        <span className="new-control-indicator" />
                                        DERECHA
                                      </label>
                                    </div>
                                  </div>
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
                                          placeholder=""
                                          as="input"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="lensometria.cilindro_od"
                                          placeholder=""
                                          as="input"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="lensometria.eje_od"
                                          placeholder=""
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
                                          placeholder=""
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
                                          placeholder=""
                                          as="input"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="lensometria.cilindro_oi"
                                          placeholder=""
                                          as="input"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="lensometria.eje_oi"
                                          placeholder=""
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
                                          placeholder=""
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
                                  name="lensometria_extra.len_tipo_arco"
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
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-3">
                                <Field
                                  className="form-control"
                                  name="sa_pp.pp_od"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                            </div>
                            <div className="form-row mb-4">
                              <div className="form-group col-md-3">
                                <Field
                                  className="form-control"
                                  name="sa_pp.sa_oi"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-3">
                                <Field
                                  className="form-control"
                                  name="sa_pp.pp_oi"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                            </div>
                            <h6>
                              VISUSCOPIA:
                            </h6>
                            <div className="form-row mb-4">
                              <div className="form-group col-md-6">
                                <label htmlFor="v_od">
                                  OD
                                </label>
                                <Field
                                  className="form-control"
                                  id="v_od"
                                  name="visuscopia.viscopia_od"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-6">
                                <label htmlFor="v_oi">
                                  OI
                                </label>
                                <Field
                                  className="form-control"
                                  id="v_oi"
                                  name="visuscopia.viscopia_oi"
                                  placeholder=""
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
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-6">
                                <label htmlFor="tratamientos">
                                  Krismsky
                                </label>
                                <Field
                                  className="form-control"
                                  id="krismsky"
                                  name="visuscopia.krismsky"
                                  placeholder=""
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
                                  name="plan_versiones"
                                  placeholder=""
                                  as="textarea"
                                />
                              </div>
                            </div>
                            <div className="form-row mb-4">
                              <div className="form-group col-md-4">
                                <label htmlFor="VL">
                                  COVER TEST: VL:
                                </label>
                                <Field
                                  className="form-control"
                                  id="VL"
                                  name="visuscopia.ct_vl"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-4">
                                <label htmlFor="VP">
                                  VP
                                </label>
                                <Field
                                  className="form-control"
                                  id="VP"
                                  name="visuscopia.ct_vp"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-4">
                                <label htmlFor="maddox">
                                  MADDOX:
                                </label>
                                <Field
                                  className="form-control"
                                  id="maddox"
                                  name="visuscopia.maddox"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                            </div>
                            <div className="form-row mb-4">
                              <div className="form-group col-md-6">
                                <label htmlFor="tratamientos">
                                  Seguimiento Visual(AO):{' '}
                                </label>
                                <Field
                                  className="form-control"
                                  id="seguimiento"
                                  name="visuscopia_extra.seguimiento_ao"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-6">
                                <label htmlFor="tratamientos">
                                  Sacádicos(AO):{' '}
                                </label>
                                <Field
                                  className="form-control"
                                  id="sacadicos"
                                  name="visuscopia_extra.sacadicos_ao"
                                  placeholder=""
                                  as="input"
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
                                  placeholder=""
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
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-2">
                                <label htmlFor="tratamientos">
                                  FR:{' '}
                                </label>
                                <Field
                                  className="form-control"
                                  id="ppc_fr"
                                  name="visuscopia_extra.ppc_fr"
                                  placeholder=""
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
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                            </div>
                            <div className="form-row mb-4">
                              <div className="form-group col-md-6">
                                <label htmlFor="tratamientos">
                                  TEST DE BIELSCHOWSKY
                                </label>
                                <Field
                                  className="form-control"
                                  id="helshoswky"
                                  name="visuscopia_extra.helshoswky"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-6">
                                <label htmlFor="tratamientos">
                                  VON GRAEFE
                                </label>
                                <Field
                                  className="form-control"
                                  id="von_graefe"
                                  name="visuscopia_extra.von_graefe"
                                  placeholder=""
                                  as="input"
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
                                        placeholder=""
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="pruebas.vp_luces"
                                        placeholder=""
                                        as="input"
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-center">
                                      Bagolinni
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="pruebas.vl_bg"
                                        placeholder=""
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="pruebas.vp_bg"
                                        placeholder=""
                                        as="input"
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="form-row mb-4">
                              <div className="form-group col-md-3">
                                <h5 className="text-center">
                                  Estereopsis
                                </h5>
                              </div>
                              <div className="form-group col-md-3">
                                <label htmlFor="inputAddress">
                                  Randot:
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="pruebas_extra.randot"
                                  placeholder=""
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
                                  placeholder=""
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
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                            </div>
                            <h4>
                              EVALUACION DE LA ACOMODACION
                            </h4>
                            <div className="form-row mb-4">
                              <div className="form-group col-md-3">
                                <label htmlFor="inputAddress">
                                  A.A OD:
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="acomodacion.aa_od"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-3">
                                <label htmlFor="inputAddress">
                                  OI
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="acomodacion.aa_oi"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-3">
                                <label htmlFor="inputAddress">
                                  FAM: OD
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="acomodacion.fan_od"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-3">
                                <label htmlFor="inputAddress">
                                  OI
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="acomodacion.fan_cpm"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                            </div>
                            <div className="form-row mb-4">
                              <div className="form-group col-md-3">
                                <label htmlFor="inputAddress">
                                  FAB
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="acomodacion.aco_oi"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-3">
                                <label htmlFor="inputAddress">
                                  MEM: OD
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="acomodacion.aco_cpm"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-3">
                                <label htmlFor="inputAddress">
                                  OI
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="acomodacion.acp_fab"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                            </div>
                            <div className="form-row mb-4">
                              <div className="form-group col-md-3">
                                <label htmlFor="inputAddress">
                                  ARN
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="acomodacion_extra.mem_arn"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-3">
                                <label htmlFor="inputAddress">
                                  ARP
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="acomodacion_extra.mem_arp"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                            </div>
                            <h4>
                              EVALUACION DE LAS VERGENCIAS
                            </h4>
                            <div className="form-row mb-4">
                              <div className="form-group col-md-3">
                                <label htmlFor="inputAddress">
                                  BT/VL
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="vergencia.v_vt_vl"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-3">
                                <label htmlFor="inputAddress">
                                  BT/VP
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="vergencia.v_bt_vp"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                            </div>
                            <div className="form-row mb-4">
                              <div className="form-group col-md-3">
                                <label htmlFor="inputAddress">
                                  BN/VL
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="vergencia.v_bn_vl"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-3">
                                <label htmlFor="inputAddress">
                                  BN/VP
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="vergencia.v_bn_vp"
                                  placeholder=""
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
                                          placeholder=""
                                          as="input"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="refraccion.cilindro_od_f"
                                          placeholder=""
                                          as="input"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="refraccion.eje_od_f"
                                          placeholder=""
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
                                          placeholder=""
                                          as="input"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="refraccion.agz_od_f"
                                          placeholder=""
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
                                          placeholder=""
                                          as="input"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="refraccion.cilindro_oi_f"
                                          placeholder=""
                                          as="input"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="refraccion.eje_oi_f"
                                          placeholder=""
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
                                          placeholder=""
                                          as="input"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="refraccion.agz_oi_f"
                                          placeholder=""
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
                                  TIPO DE LENTE
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="lentes_contacto.lente_marca_1"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-2">
                                <label htmlFor="inputAddress">
                                  PD
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="lentes_contacto.lente_pd_1"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-2">
                                <label htmlFor="inputAddress">
                                  DNP
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="lentes_contacto.lente_dnp_1"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-2">
                                <label htmlFor="inputAddress">
                                  ALTURA
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="lentes_contacto.lente_altura_1"
                                  placeholder=""
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
                                      <th className="text-center">
                                        OJO DERECHO
                                      </th>
                                      <th className="text-center">
                                        OJO IZQUIERDO
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
                                          placeholder=""
                                          as="input"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="lentes_contacto.poder_oi"
                                          placeholder=""
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
                                          placeholder=""
                                          as="input"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="lentes_contacto.cb_oi"
                                          placeholder=""
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
                                          placeholder=""
                                          as="input"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="lentes_contacto.dia_oi"
                                          placeholder=""
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
                                  MARCA
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="lentes_contacto.lente_marca"
                                  placeholder=""
                                  as="input"
                                />
                              </div>
                              <div className="form-group col-md-6">
                                <label htmlFor="inputAddress">
                                  TIPO
                                </label>
                                <Field
                                  className="form-control"
                                  id="inputAddress"
                                  name="lentes_contacto.lente_tipo"
                                  placeholder=""
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
                                  name="conducta_seguir"
                                  as="textarea"
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
    </div>
  )
}

export default OrtopticaVisionBinocular