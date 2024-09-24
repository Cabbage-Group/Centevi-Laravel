import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice.js';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice.js';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { crearBajaVision } from '../../redux/features/consultas/BajaVisionSlice.js';
import * as Yup from 'yup';
import { Select, Button } from 'antd';

const BajaVision = () => {
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
    edad: '35',
    fecha_atencion: new Date().toISOString().split('T')[0],
    m_c: '',
    a_o: '',
    a_p: '',
    a_f: '',
    medicamentos: '',
    tratamientos: '',
    dx_oft_princ: '',
    objetivos: '',
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
    vision_exentrica: {
      ve_D: "",
      ve_I: ""
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
      len_tipo_aro: '',
    },

    cv_so: {
      cv_od: "",
      so_od: "",
      cv_oi: "",
      so_oi: ""
    },
    amsler: {
      amsler_od: "",
      amsler_oi: ""
    },
    sensibilidad_c: {
      sensibilidad_od: "",
      sensibilidad_oi: ""
    },
    refraccion: {
      esfera_od_f: "",
      cilindro_od_f: "",
      eje_od_f: "",
      p_base_od_f: "",
      agz_od_f: "",
      esfera_oi_f: "",
      cilindro_oi_f: "",
      eje_oi_f: "",
      p_base_oi_f: "",
      agz_oi_f: "",
      esfera_od_fc: "",
      cilindro_od_fc: "",
      eje_od_fc: "",
      p_base_od_fc: "",
      agz_od_fc: "",
      esfera_oi_fc: "",
      cilindro_oi_fc: "",
      eje_oi_fc: "",
      p_base_oi_fc: "",
      agz_oi_fc: "",
      lentes_marca_1: "",
      lentes_pd_1: "",
      lentes_dnp_1: "",
      lentes_altura_1: "",
      lentes_marca_2: "",
      lentes_pd_2: "",
      lentes_dnp_2: "",
      lentes_altura_2: ""
    },
    pruebas: {
      vl_luces: "",
      vp_luces: "",
      vision_color: "",
      prueba_od: "",
      prueba_oi: ""
    },
    ayudas_opticas: '',
    ayudas_no_opticas: '',
    plan_rehabilitacion: '',
    plan_versiones: '',
    fecha_creacion: '',
    editado: '',
    fecha_proxima_consulta: '',
  };

  useEffect(() => {
    dispatch(fetchSucursales({ page: 1, limit: 100 }));
    dispatch(fetchPacientes({ page: 1, limit: 10000 }));
  }, [dispatch]);

  useEffect(() => {
    if (selectedPaciente) {
      const paciente = pacientes.find(p => p.id_paciente === selectedPaciente);
      if (paciente && paciente.fecha_nacimiento) {
        const edad = calculateAge(paciente.fecha_nacimiento);
        setFieldValue('edad', edad);
      }
    }
  }, [selectedPaciente, pacientes]);

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
                          Consulta de Baja Vision
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="widget-content widget-content-area">
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={(values, { setSubmitting }) => {
                        console.log('Form values:', values);
                        dispatch(crearBajaVision(values));
                        setSubmitting(false);
                      }}
                    >
                      {({ setFieldValue }) => (
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
                                Motivo de consulta:
                              </label>
                              <Field
                                className="form-control textarea"
                                maxLength="10000"
                                name="m_c"
                                placeholder="Esta área tiene un limite de 10000 caracteres."
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
                                placeholder="A/O"
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
                                placeholder="A/P"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-4">
                              <label htmlFor="inputAddress2">
                                Antecentes Familiares
                              </label>
                              <Field
                                className="form-control"
                                id="inputAddress2"
                                name="a_f"
                                placeholder="A/F"
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
                                placeholder="Medicamentos"
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
                                placeholder="Tratamientos"
                                as="input"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-6">
                              <label htmlFor="oftalmologico">
                                DX. Oftalmologico Principal
                              </label>
                              <Field
                                className="form-control"
                                id="oftalmologico"
                                name="dx_oft_princ"
                                placeholder="Oftalmologico principal"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-6">
                              <label htmlFor="objetivos">
                                Objetivos de paciente
                              </label>
                              <Field
                                className="form-control"
                                id="objetivos"
                                name="objetivos"
                                placeholder="Objetivos"
                                as="input"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <label htmlFor="lugarNacimiento">
                                Acudiente/Acompañante
                              </label>
                              <Field
                                className="form-control"
                                id="Acudiente/Acompañante"
                                name="Acudiente/Acompañante"
                                placeholder="Acudiente/Acompañante"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-6">
                              <label htmlFor="inputAddress2">
                                ¿Tuvo consulta de baja visión anteriormente?
                              </label>
                              <br />
                              <div
                                style={{
                                  display: 'flex',
                                  placeContent: 'center'
                                }}
                              >
                                <div>
                                  <label htmlFor="vives-solo">
                                    Si
                                  </label>
                                  <Field
                                    defaultValue="si"
                                    name="vives-solo"
                                    type="radio"
                                  />
                                </div>
                                <div
                                  style={{
                                    marginLeft: '10px'
                                  }}
                                >
                                  <label htmlFor="vives-solo">
                                    No
                                  </label>
                                  <Field
                                    defaultValue="no"
                                    name="vives-solo"
                                    type="radio"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="form-group col-md-6">
                              <label htmlFor="inputAddress2">
                                Consulta de baja visión anterior
                              </label>
                              <Field
                                className="form-control"
                                id=""
                                max="2024-07-04"
                                name=""
                                placeholder="Consulta de baja visión anterior"
                                type="date"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-6">
                              <label htmlFor="lugarNacimiento">
                                ¿Ha utilizado ayudas para BV?
                              </label>
                              <div
                                style={{
                                  display: 'flex',
                                  placeContent: 'center'
                                }}
                              >
                                <div>
                                  <label htmlFor="vives-solo">
                                    Si
                                  </label>
                                  <Field
                                    defaultValue="si"
                                    name="vives-solo"
                                    type="radio"
                                  />
                                </div>
                                <div
                                  style={{
                                    marginLeft: '10px'
                                  }}
                                >
                                  <label htmlFor="vives-solo">
                                    No
                                  </label>
                                  <Field
                                    defaultValue="no"
                                    name="vives-solo"
                                    type="radio"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="form-group col-md-6">
                              <label htmlFor="lugarNacimiento">
                                ¿Que tipo de ayudas?
                              </label>
                              <Field
                                className="form-control"
                                id="ayudas"
                                name="ayudas"
                                placeholder="¿Que tipo de ayudas?"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-12">
                              <label htmlFor="lugarNacimiento">
                                ¿Quien le prescribió las ayudas?
                              </label>
                              <Field
                                className="form-control"
                                id="prescribioAyudas"
                                name="prescribioAyudas"
                                placeholder="¿Quien le prescribió las ayudas?"
                                as="input"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-6">
                              <div
                                style={{
                                  textAlignLast: 'center'
                                }}
                              >
                                <label htmlFor="lugarNacimiento">
                                  ¿Conoce su problema ocular?
                                </label>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  placeContent: 'center'
                                }}
                              >
                                <div>
                                  <label htmlFor="vives-solo">
                                    Si
                                  </label>
                                  <Field
                                    defaultValue="si"
                                    name="vives-solo"
                                    type="radio"
                                  />
                                </div>
                                <div
                                  style={{
                                    marginLeft: '10px'
                                  }}
                                >
                                  <label htmlFor="vives-solo">
                                    No
                                  </label>
                                  <Field
                                    defaultValue="no"
                                    name="vives-solo"
                                    type="radio"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="form-group col-md-6">
                              <div
                                style={{
                                  textAlignLast: 'center'
                                }}
                              >
                                <label htmlFor="lugarNacimiento">
                                  ¿Su visión fluctúa día con día?
                                </label>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  placeContent: 'center'
                                }}
                              >
                                <div>
                                  <label htmlFor="vives-solo">
                                    Si
                                  </label>
                                  <Field
                                    defaultValue="si"
                                    name="vives-solo"
                                    type="radio"
                                  />
                                </div>
                                <div
                                  style={{
                                    marginLeft: '10px'
                                  }}
                                >
                                  <label htmlFor="vives-solo">
                                    No
                                  </label>
                                  <Field
                                    defaultValue="no"
                                    name="vives-solo"
                                    type="radio"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="form-group col-md-12">
                              <label htmlFor="lugarNacimiento">
                                ¿Cuando?
                              </label>
                              <Field
                                className="form-control"
                                id="Cuando"
                                name="Cuando"
                                placeholder="Detalle Brevemente"
                                as="input"
                              />
                            </div>
                          </div>
                          <script
                            dangerouslySetInnerHTML={{
                              __html: ' document.querySelectorAll(\'.switch input\').forEach(function(input) {input.addEventListener(\'change\', function() {                                                var slider = this.nextElementSibling;                                                var text = slider.nextElementSibling;                                                var circle = slider.querySelector(\'.slider-circle\');                                                if (this.) {                                                    slider.style.backgroundColor = \'#2196F3\';                                                    text.textContent = \'\';                                                    circle.style.transform = \'translateX(26px)\';                                                } else {                                                    slider.style.backgroundColor = \'#b0b0b0\';                                                    text.textContent = \'\';                                                    circle.style.transform = \'translateX(0)\';                                                }                                            });                                        });                                    '
                            }}
                          />
                          <hr />
                          <h6>
                            <b>
                              Entorno Social
                            </b>
                          </h6>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <div className="table-responsive">
                                <table className="table table-bordered">
                                  <tbody>
                                    <tr>
                                      <td className="text-center">
                                        ¿Vives Solo?
                                      </td>
                                      <td className="text-center">
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="vives-solo">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="vives-solo"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="vives-solo">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="vives-solo"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        ¿Influyó la perdida de visión con su desempeño ocupacional?
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="ipvision-desem-ocup">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="ipvision-desem-ocup"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="ipvision-desem-ocup">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="ipvision-desem-ocup"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        ¿Cómo?
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="como"
                                          placeholder="Explique Brevemente"
                                          as="input"
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Nivel de Educación
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="nivel-educacion">
                                              Bachiller
                                            </label>
                                            <Field
                                              defaultValue="Bachiller"
                                              name="nivel-educacion"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="nivel-educacion">
                                              Licenciatura
                                            </label>
                                            <Field
                                              defaultValue="Licenciatura"
                                              name="nivel-educacion"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="nivel-educacion">
                                              Maestría
                                            </label>
                                            <Field
                                              defaultValue="Maestría"
                                              name="nivel-educacion"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="nivel-educacion">
                                              Doctorado
                                            </label>
                                            <Field
                                              defaultValue="Doctorado"
                                              name="nivel-educacion"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Desplazamiento en lugares externos
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="desplazamineto-lugares-externos">
                                              Solo
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="desplazamineto-lugares-externos"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="desplazamineto-lugares-externos">
                                              Acompañado
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="desplazamineto-lugares-externos"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Desplazamiento en lugares internos
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="desplazamineto-lugares-internos">
                                              Al tacto
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="desplazamineto-lugares-internos"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="desplazamineto-lugares-internos">
                                              Visión
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="desplazamineto-lugares-internos"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="desplazamineto-lugares-internos">
                                              Ambas
                                            </label>
                                            <Field
                                              defaultValue="Ambas"
                                              name="desplazamineto-lugares-internos"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        ¿En qué momento del día le gusta más desplazarse?
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="gusta-desplazarse">
                                              Día
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="gusta-desplazarse"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="gusta-desplazarse">
                                              Noche
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="gusta-desplazarse"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="gusta-desplazarse">
                                              Ambas
                                            </label>
                                            <Field
                                              defaultValue="Ambas"
                                              name="gusta-desplazarse"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                          <hr />
                          <h6>
                            <b>
                              Tareas de Lejos: Tiene Dificultad para:
                            </b>
                          </h6>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <div className="table-responsive">
                                <table className="table table-bordered">
                                  <tbody>
                                    <tr>
                                      <td className="text-center">
                                        Caminar en la calle
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="caminar-calle">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="caminar-calle"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="caminar-calle">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="caminar-calle"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Dezplazarse solo en un lugares conocidos
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="desplazarse-lugares-conocidos">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="desplazarse-lugares-conocidos"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="desplazarse-lugares-conocidos">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="desplazarse-lugares-conocidos"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Dezplazarse solo en unos lugares lejanos
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="desplazarse-lugares-lejanos">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="desplazarse-lugares-lejanos"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="desplazarse-lugares-lejanos">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="desplazarse-lugares-lejanos"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Conducir de noche
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="conducir-noche">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="conducir-noche"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="conducir-noche">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="conducir-noche"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Conducir de día
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="conducir-dia">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="conducir-dia"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="conducir-dia">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="conducir-dia"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Ver las señales de tránsito de día
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="seniales-transito-dia">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="seniales-transito-dia"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="seniales-transito-dia">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="seniales-transito-dia"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Ver las señales de tránsito de noche
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="seniales-transito-noche">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="seniales-transito-noche"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="seniales-transito-noche">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="seniales-transito-noche"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Ver el letrero de los buses
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="letreros-buses">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="letreros-buses"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="letreros-buses">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="letreros-buses"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Reconocer la letra las caras de las personas
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="reconocer-letra-caras-personas">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="reconocer-letra-caras-personas"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="reconocer-letra-caras-personas">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="reconocer-letra-caras-personas"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Ver al tablero en clases
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="tablero-clases">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="tablero-clases"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="tablero-clases">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="tablero-clases"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Ver los letreros de las Calles
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="letreros-calles">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="letreros-calles"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="letreros-calles">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="letreros-calles"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Ver bordes y peldaños de escaleras
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="bordes-peldanios-escaleras">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="bordes-peldanios-escaleras"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="bordes-peldanios-escaleras">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="bordes-peldanios-escaleras"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Ver las peliculas en el Cine o Teatro
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="peliculas-cine-teatro">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="peliculas-cine-teatro"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="peliculas-cine-teatro">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="peliculas-cine-teatro"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Reconocer los colores
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="reconocer-colores">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="reconocer-colores"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="reconocer-colores">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="reconocer-colores"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Hacer Deportes
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="hacer-deportes">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="hacer-deportes"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="hacer-deportes">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="hacer-deportes"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Realizar tareas del hogar
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="realizar-tareas-hogar">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="realizar-tareas-hogar"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="realizar-tareas-hogar">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="realizar-tareas-hogar"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Cocinar
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="cocinar">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="cocinar"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="cocinar">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="cocinar"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Manejar los Electrodomesticos
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="manejar-electrodomesticos">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="manejar-electrodomesticos"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="manejar-electrodomesticos">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="manejar-electrodomesticos"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Ver la llama de la estufa
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="ver-llama-estufa">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="ver-llama-estufa"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="ver-llama-estufa">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="ver-llama-estufa"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Ver la comida en el plato
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="ver-comida-plato">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="ver-comida-plato"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="ver-comida-plato">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="ver-comida-plato"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Marcar un número telefónico
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="marcar-numero-telefonico">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="marcar-numero-telefonico"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="marcar-numero-telefonico">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="marcar-numero-telefonico"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-center">
                                        Realizar su arreglo personal
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="arreglo-personal">
                                              bañarse
                                            </label>
                                            <Field
                                              defaultValue="bañarse"
                                              name="arreglo-personal"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="arreglo-personal">
                                              vestirse
                                            </label>
                                            <Field
                                              defaultValue="vestirse"
                                              name="arreglo-personal"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="arreglo-personal">
                                              lavarse los dientes
                                            </label>
                                            <Field
                                              defaultValue="lavarse los dientes"
                                              name="arreglo-personal"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                          <hr />
                          <h6>
                            <b>
                              Tareas de Cerca: Tiene Dificultad para:
                            </b>
                          </h6>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <div className="table-responsive">
                                <table className="table table-bordered">
                                  <tbody>
                                    <tr>
                                      <td
                                        className="text-center"
                                        style={{
                                          width: '50%'
                                        }}
                                      >
                                        Leer titulares de periodicos y revistas
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="leer-titulares-periodicos-revistas">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="leer-titulares-periodicos-revistas"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="leer-titulares-periodicos-revistas">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="leer-titulares-periodicos-revistas"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        className="text-center"
                                        style={{
                                          width: '50%'
                                        }}
                                      >
                                        Leer letra manuscrita o cursiva
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="leer-letra-manuscrita-cursiva">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="leer-letra-manuscrita-cursiva"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="leer-letra-manuscrita-cursiva">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="leer-letra-manuscrita-cursiva"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        className="text-center"
                                        style={{
                                          width: '50%'
                                        }}
                                      >
                                        Leer periodicos
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="leer-periodicos">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="leer-periodicos"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="leer-periodicos">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="leer-periodicos"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        className="text-center"
                                        style={{
                                          width: '50%'
                                        }}
                                      >
                                        Ver los precios o etiquetas de productos
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="ver-precios-etiquetas-productos">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="ver-precios-etiquetas-productos"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="ver-precios-etiquetas-productos">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="ver-precios-etiquetas-productos"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        className="text-center"
                                        style={{
                                          width: '50%'
                                        }}
                                      >
                                        Leer su correo electrónico
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="leer-correo-electronico">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="leer-correo-electronico"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="leer-correo-electronico">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="leer-correo-electronico"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        className="text-center"
                                        style={{
                                          width: '50%'
                                        }}
                                      >
                                        Firmas cheques, recibos, papelería
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="firma-cheque-recibo-papeleria">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="firma-cheque-recibo-papeleria"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="firma-cheque-recibo-papeleria">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="firma-cheque-recibo-papeleria"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        className="text-center"
                                        style={{
                                          width: '50%'
                                        }}
                                      >
                                        Escribir
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="escribir">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="escribir"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="escribir">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="escribir"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        className="text-center"
                                        style={{
                                          width: '50%'
                                        }}
                                      >
                                        Coser, tejer, bordar
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="coser-tejer-bordar">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="coser-tejer-bordar"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="coser-tejer-bordar">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="coser-tejer-bordar"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        className="text-center"
                                        style={{
                                          width: '50%'
                                        }}
                                      >
                                        Leer su Libro Religioso
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="leer-libro-religioso">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="leer-libro-religioso"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="leer-libro-religioso">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="leer-libro-religioso"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        className="text-center"
                                        style={{
                                          width: '50%'
                                        }}
                                      >
                                        Ver la pantalla de la computadora
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="ver-pantalla-computadora">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="ver-pantalla-computadora"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="ver-pantalla-computadora">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="ver-pantalla-computadora"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                          <hr />
                          <h6>
                            <b>
                              Iluminación: Tiene Problemas para:
                            </b>
                          </h6>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <div className="table-responsive">
                                <table className="table table-bordered">
                                  <tbody>
                                    <tr>
                                      <td
                                        className="text-center"
                                        style={{
                                          width: '50%'
                                        }}
                                      >
                                        Tolerar la luz del Sol
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="tolerar-luz-sol">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="tolerar-luz-sol"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="tolerar-luz-sol">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="tolerar-luz-sol"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        className="text-center"
                                        style={{
                                          width: '50%'
                                        }}
                                      >
                                        Usar lentes oscuros de Sol
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="usar-lentes-oscuros-sol">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="usar-lentes-oscuros-sol"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="usar-lentes-oscuros-sol">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="usar-lentes-oscuros-sol"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        className="text-center"
                                        style={{
                                          width: '50%'
                                        }}
                                      >
                                        Realizar actividades en lugares interiores
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="realizar-actividades-lugares-interiores">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="realizar-actividades-lugares-interiores"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="realizar-actividades-lugares-interiores">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="realizar-actividades-lugares-interiores"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        className="text-center"
                                        style={{
                                          width: '50%'
                                        }}
                                      >
                                        Siente destellos de luces, o deslumbramiento de día
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="siente-destellos-luces-deslumbramiento-dia">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="siente-destellos-luces-deslumbramiento-dia"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="siente-destellos-luces-deslumbramiento-dia">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="siente-destellos-luces-deslumbramiento-dia"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        className="text-center"
                                        style={{
                                          width: '50%'
                                        }}
                                      >
                                        Prefiere la luz
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="prefiere-luz">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="prefiere-luz"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="prefiere-luz">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="prefiere-luz"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        className="text-center"
                                        style={{
                                          width: '50%'
                                        }}
                                      >
                                        Ver en lugares que las luces son amarillas
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="ver-lugares-luces-amarillas">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="ver-lugares-luces-amarillas"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="ver-lugares-luces-amarillas">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="ver-lugares-luces-amarillas"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        className="text-center"
                                        style={{
                                          width: '50%'
                                        }}
                                      >
                                        Ver en lugares que las luces son blancas
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: 'flex',
                                            placeContent: 'center'
                                          }}
                                        >
                                          <div>
                                            <label htmlFor="ver-lugares-luces-blancas">
                                              Si
                                            </label>
                                            <Field
                                              defaultValue="si"
                                              name="ver-lugares-luces-blancas"
                                              type="radio"
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: '10px'
                                            }}
                                          >
                                            <label htmlFor="ver-lugares-luces-blancas">
                                              No
                                            </label>
                                            <Field
                                              defaultValue="no"
                                              name="ver-lugares-luces-blancas"
                                              type="radio"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                          <h6>
                            AGUDEZA VISUAL
                          </h6>
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
                                          name="av/sc_od_vl"
                                          placeholder="od_vl"
                                          as="input"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="av/sc_oi_vl"
                                          placeholder="oi_vl"
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
                                          name="av/sc_od_vp"
                                          placeholder="od_vp"
                                          as="input"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="av/sc_oi_vp"
                                          placeholder="oi_vp"
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
                                          name="av/sc_od_ph"
                                          placeholder="od_ph"
                                          as="input"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="av/sc_oi_ph"
                                          placeholder="oi_ph"
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
                                          name="av/cc_od_vl"
                                          placeholder="od_vl"
                                          as="input"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="av/cc_oi_vl"
                                          placeholder="oi_vl"
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
                                          name="av/cc_od_vp"
                                          placeholder="od_vp"
                                          as="input"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="av/cc_oi_vp"
                                          placeholder="oi_vp"
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
                                          name="av/cc_od_ph"
                                          placeholder="od_ph"
                                          as="input"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          className="form-control"
                                          name="av/cc_oi_ph"
                                          placeholder="oi_ph"
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
                            <h6>
                              RECETA EN USO
                            </h6>
                            <div className="table-responsive">
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th className="text-center">
                                      RX en uso
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
                                        name="esfera_od"
                                        placeholder="esfera_od"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="cilindro_od"
                                        placeholder="cilindro_od"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="eje_od"
                                        placeholder="eje_od"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        defaultValue="△"
                                        name="p_base_od"
                                        placeholder="p_base_od"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="add_od"
                                        placeholder="add_od"
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
                                        name="esfera_oi"
                                        placeholder="esfera_oi"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="cilindro_oi"
                                        placeholder="cilindro_oi"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="eje_oi"
                                        placeholder="eje_oi"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        defaultValue="△"
                                        name="p_base_oi"
                                        placeholder="p_base_oi"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="add_oi"
                                        placeholder="add_oi"
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
                                name="len_tipo_lentes"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="objetivos">
                                Filtros
                              </label>
                              <Field
                                className="form-control"
                                name="len_filtros"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="objetivos">
                                Tiempo
                              </label>
                              <Field
                                className="form-control"
                                name="len_tiempo"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="objetivos">
                                Tipo de Aro
                              </label>
                              <Field
                                className="form-control"
                                name="len_tipo_aro"
                                as="input"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <h6>
                              <b>
                                Test de Sensibilidad Luminosa (BAT)
                              </b>
                            </h6>
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th
                                    className="text-center"
                                    style={{
                                      width: '150px'
                                    }}
                                  >
                                    Ojo Evaluado
                                  </th>
                                  <th className="text-center">
                                    Apagado
                                  </th>
                                  <th className="text-center">
                                    Bajo
                                  </th>
                                  <th className="text-center">
                                    Medio
                                  </th>
                                  <th className="text-center">
                                    Alto
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
                                      name="Apagado"
                                      placeholder="Apagado"
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="Bajo"
                                      placeholder="Bajo"
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="Medio"
                                      placeholder="Medio"
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      defaultValue=""
                                      name="Alto"
                                      placeholder="Alto"
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
                                      name="Apagado"
                                      placeholder="Apagado"
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="Bajo"
                                      placeholder="Bajo"
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="Medio"
                                      placeholder="Medio"
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      defaultValue=""
                                      name="Alto"
                                      placeholder="Alto"
                                      as="input"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <label htmlFor="inputAddress">
                                Observaciones:
                              </label>
                              <Field
                                className="form-control textarea"
                                id="textarea"
                                maxLength="1000"
                                name=""
                                placeholder="Esta área tiene un limite de 1000 caracteres."
                                rows="5"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th className="text-center" />
                                    <th className="text-center">
                                      CV.CONFRONTACION
                                    </th>
                                    <th className="text-center">
                                      SALUD OCULAR
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
                                        name="cv_od"
                                        placeholder="Ojo Derecho"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="so_od"
                                        placeholder="Ojo Derecho"
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
                                        name="cv_oi"
                                        placeholder="Ojo Izquierdo"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="so_oi"
                                        placeholder="Ojo Izquierdo"
                                        as="input"
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <h6>
                                AMSLER
                              </h6>
                              <div className="form-row mb-4">
                                <div className="form-group col-md-6">
                                  <Field
                                    className="form-control"
                                    name="amsler_od"
                                    placeholder="Ojo Derecho"
                                    as="input"
                                  />
                                </div>
                                <div className="form-group col-md-6">
                                  <Field
                                    className="form-control"
                                    name="amsler_oi"
                                    placeholder="Ojo Izquierdo"
                                    as="input"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <h6>
                                SENSIBILIDAD AL CONTRASTE
                              </h6>
                              <div className="form-row mb-4">
                                <div className="form-group col-md-6">
                                  <Field
                                    className="form-control"
                                    name="sensibilidad_od"
                                    placeholder="Ojo Derecho"
                                    as="input"
                                  />
                                </div>
                                <div className="form-group col-md-6">
                                  <Field
                                    className="form-control"
                                    name="sensibilidad_oi"
                                    placeholder="Ojo Izquierdo"
                                    as="input"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <label htmlFor="inputAddress">
                                Versiones
                              </label>
                              <Field
                                className="form-control textarea"
                                id="textarea"
                                maxLength="800"
                                name="plan_versiones"
                                placeholder="Esta área tiene un limite de 800 caracteres."
                                rows="5"
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
                                      name="vl_luces"
                                      placeholder="vl_luces"
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="vp_luces"
                                      placeholder="vp_luces"
                                      as="input"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <label htmlFor="inputAddress">
                                Visión de Color
                              </label>
                              <Field
                                className="form-control"
                                defaultValue=""
                                id="inputAddress"
                                name="vision_color"
                                placeholder="Visión de Color"
                                as="input"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-6">
                              <label htmlFor="inputAddress">
                                Ojo Derecho
                              </label>
                              <Field
                                className="form-control"
                                id="inputAddress"
                                name="prueba_od"
                                placeholder="Ojo Derecho"
                                as="input"
                              />
                            </div>
                            <div className="form-group col-md-6">
                              <label htmlFor="inputAddress">
                                Ojo Izquierdo
                              </label>
                              <Field
                                className="form-control"
                                id="inputAddress"
                                name="prueba_oi"
                                placeholder="Ojo Izquierdo"
                                as="input"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <h5 className="p-4">
                              RECETA FINAL PARA DISTANCIA
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
                                        name="esfera_od_f"
                                        placeholder="esfera_od"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="cilindro_od_f"
                                        placeholder="cilindro_od"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="eje_od_f"
                                        placeholder="eje_od"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        defaultValue="△"
                                        name="p_base_od_f"
                                        placeholder="p_base_od"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="agz_od_f"
                                        placeholder="agz_od"
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
                                        name="esfera_oi_f"
                                        placeholder="esfera_oi"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="cilindro_oi_f"
                                        placeholder="cilindro_oi"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="eje_oi_f"
                                        placeholder="eje_oi"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        defaultValue="△"
                                        name="p_base_oi_f"
                                        placeholder="p_base_oi"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="agz_oi_f"
                                        placeholder="agz_oi"
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
                                name="lentes_marca_1"
                                placeholder="Marca"
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
                                name="lentes_pd_1"
                                placeholder="Tipo"
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
                                name="lentes_dnp_1"
                                placeholder="Tipo"
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
                                name="lentes_altura_1"
                                placeholder="Tipo"
                                as="input"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <h5 className="p-4">
                              RECETA FINAL PARA CERCA
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
                                        name="esfera_od_fc"
                                        placeholder="esfera_od"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="cilindro_od_fc"
                                        placeholder="cilindro_od"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="eje_od_fc"
                                        placeholder="eje_od"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        defaultValue="△"
                                        name="p_base_od_fc"
                                        placeholder="p_base_od"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="agz_od_fc"
                                        placeholder="agz_od"
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
                                        name="esfera_oi_fc"
                                        placeholder="esfera_oi"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="cilindro_oi_fc"
                                        placeholder="cilindro_oi"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="eje_oi_fc"
                                        placeholder="eje_oi"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        defaultValue="△"
                                        name="p_base_oi_fc"
                                        placeholder="p_base_oi"
                                        as="input"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        className="form-control"
                                        name="agz_oi_fc"
                                        placeholder="agz_oi"
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
                                name="lentes_marca_2"
                                placeholder="Marca"
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
                                name="lentes_pd_2"
                                placeholder="Tipo"
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
                                name="lentes_dnp_2"
                                placeholder="Tipo"
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
                                name="lentes_altura_2"
                                placeholder="Tipo"
                                as="input"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <label htmlFor="inputAddress">
                                Ayudas Opticas Para Baja Visión
                              </label>
                              <Field
                                className="form-control textarea"
                                id="textarea"
                                maxLength="800"
                                name="ayudas_opticas"
                                placeholder="Esta área tiene un limite de 800 caracteres."
                                rows="5"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <h6>
                              <b>
                                Microscopios
                              </b>
                            </h6>
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th className="text-center" />
                                  <th className="text-center">
                                    Potencia
                                  </th>
                                  <th className="text-center">
                                    AV
                                  </th>
                                  <th className="text-center">
                                    Dist
                                  </th>
                                  <th className="text-center">
                                    Observaciones
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
                                      name="od_pt"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="od_av"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="od_ds"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="od_ob"
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
                                      name="oi_pt"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="oi_av"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="oi_ds"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      defaultValue=""
                                      name="oi_ob"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="form-row mb-4">
                            <h6>
                              <b>
                                Magnificador
                              </b>
                            </h6>
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th className="text-center" />
                                  <th className="text-center">
                                    Potencia
                                  </th>
                                  <th className="text-center">
                                    AV
                                  </th>
                                  <th className="text-center">
                                    Dist
                                  </th>
                                  <th className="text-center">
                                    Observaciones
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
                                      name="od_pt"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="od_av"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="od_ds"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="od_ob"
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
                                      name="oi_pt"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="oi_av"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="oi_ds"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="oi_ob"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="form-row mb-4">
                            <h6>
                              <b>
                                Telescopio
                              </b>
                            </h6>
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th className="text-center" />
                                  <th className="text-center">
                                    Potencia
                                  </th>
                                  <th className="text-center">
                                    AV
                                  </th>
                                  <th className="text-center">
                                    Dist
                                  </th>
                                  <th className="text-center">
                                    Observaciones
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
                                      name="od_pt"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="od_av"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="od_ds"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      defaultValue=""
                                      name="od_ob"
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
                                      name="oi_pt"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="oi_av"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="oi_ds"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="oi_ob"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="form-row mb-4">
                            <h6>
                              <b>
                                Sistemas Telescopios Adaptados en Gafas
                              </b>
                            </h6>
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th className="text-center" />
                                  <th className="text-center">
                                    Potencia
                                  </th>
                                  <th className="text-center">
                                    AV
                                  </th>
                                  <th className="text-center">
                                    Dist
                                  </th>
                                  <th className="text-center">
                                    Lte ADD
                                  </th>
                                  <th className="text-center">
                                    Observaciones
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
                                      name="od_pt"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="od_av"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="od_ds"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="od_la"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="od_ob"
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
                                      name="oi_pt"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="oi_av"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="oi_ds"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="oi_la"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="oi_ob"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="form-row mb-4">
                            <h6>
                              <b>
                                Telemicroscopio
                              </b>
                            </h6>
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th />
                                  <th className="text-center">
                                    Potencia
                                  </th>
                                  <th className="text-center">
                                    Lte ADD
                                  </th>
                                  <th className="text-center">
                                    AV
                                  </th>
                                  <th className="text-center">
                                    Dist
                                  </th>
                                  <th className="text-center">
                                    Observaciones
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
                                      name="od_pt"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="od_la"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="od_av"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      defaultValue=""
                                      name="od_ds"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      defaultValue=""
                                      name="od_ob"
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
                                      name="oi_pt"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="oi_la"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="oi_av"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      defaultValue=""
                                      name="oi_ds"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      defaultValue=""
                                      name="oi_ob"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="form-row mb-4">
                            <h6>
                              <b>
                                Circuito Cerrado de Television
                              </b>
                            </h6>
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th />
                                  <th className="text-center">
                                    Polaridad
                                  </th>
                                  <th className="text-center">
                                    Potencia
                                  </th>
                                  <th className="text-center">
                                    AV
                                  </th>
                                  <th className="text-center">
                                    Dist
                                  </th>
                                  <th className="text-center">
                                    Observaciones
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
                                      name="od_pl"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="od_pt"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="od_av"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      defaultValue=""
                                      name="od_ds"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      defaultValue=""
                                      name="od_ob"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-center">
                                    Ojo Izquierdo
                                  </td>
                                  <td className="text-center">
                                    <Field
                                      className="form-control"
                                      name="oi_pl"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="oi_pt"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="oi_av"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name="oi_ds"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      defaultValue=""
                                      name="oi_ob"
                                      placeholder=""
                                      as="input"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <h6>
                                <b>
                                  Ayudas No Opticas/Otros
                                </b>
                              </h6>
                            </div>
                            <div className="form-group col-md-4">
                              <label>
                                <Field
                                  name="tiposcopio"
                                  type="checkbox"
                                />
                                {' '}Tiposcopio
                              </label>
                            </div>
                            <div className="form-group col-md-4">
                              <label>
                                <Field
                                  name="guia_escritura"
                                  type="checkbox"
                                />
                                {' '}Guia de Escritura
                              </label>
                            </div>
                            <div className="form-group col-md-4">
                              <label>
                                <Field
                                  name="atril"
                                  type="checkbox"
                                />
                                {' '}Atril
                              </label>
                            </div>
                            <div className="form-group col-md-4">
                              <label>
                                <Field
                                  name="iluminacion"
                                  type="checkbox"
                                />
                                {' '}Iluminacion
                              </label>
                            </div>
                            <div className="form-group col-md-4">
                              <label>
                                <Field
                                  name="macrotipo"
                                  type="checkbox"
                                />
                                {' '}Macrotipo
                              </label>
                            </div>
                            <div className="form-group col-md-4">
                              <label>
                                <Field
                                  name="acetato_amarillo"
                                  type="checkbox"
                                />
                                {' '}Acetato Amarillo
                              </label>
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <label htmlFor="inputAddress">
                                Ayudas No Opticas Para Baja Visión
                              </label>
                              <Field
                                className="form-control textarea"
                                id="textarea"
                                maxLength="800"
                                name="ayudas_no_opticas"
                                placeholder="Esta área tiene un limite de 800 caracteres."
                                rows="5"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <label htmlFor="">
                                Materiales a Prescribir:
                              </label>
                              <Field
                                className="form-control textarea"
                                id="textarea"
                                maxLength="1000"
                                name="materiales_a_escribir"
                                placeholder="Esta área tiene un limite de 1000 caracteres."
                                rows="5"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <label htmlFor="inputAddress">
                                Plan de Rehabilitación Visual
                              </label>
                              <Field
                                className="form-control textarea"
                                id="textarea"
                                maxLength="800"
                                name="plan_rehabilitacion"
                                placeholder="Esta área tiene un limite de 800 caracteres."
                                rows="5"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <label htmlFor="">
                                Referencia a otro servicio:
                              </label>
                              <Field
                                className="form-control textarea"
                                id="textarea"
                                maxLength="1000"
                                name="referencia_a_otro_servicio"
                                placeholder="Esta área tiene un limite de 1000 caracteres."
                                rows="5"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <label htmlFor="">
                                Observaciones:
                              </label>
                              <Field
                                className="form-control textarea"
                                id="textarea"
                                maxLength="1000"
                                name="observaciones"
                                placeholder="Esta área tiene un limite de 1000 caracteres."
                                rows="5"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-12">
                            <div className="form-group col-md-4">
                              <label htmlFor="inputFehaProxCita">
                                Fecha de proxima cita
                              </label>
                              <input
                                className="form-control"
                                id="inputFehaProxCita"
                                name="fecha_proxima_consulta"
                                required
                                type="date"
                              />
                            </div>
                          </div>
                          <button
                            className="btn btn-success mt-3"
                            type="submit"
                          >
                            Guardar Consulta
                          </button>
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

export default BajaVision