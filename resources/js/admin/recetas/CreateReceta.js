import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { crearRecetas } from '../../redux/features/recetas/crearRecetasSlice';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import { Col, Input, Row, Select, Checkbox } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { CloseCircleTwoTone } from '@ant-design/icons';

const CreateReceta = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pacientes, pacientes_options_selecteds } = useSelector((state) => state.pacientes);
  const { sucursales } = useSelector((state) => state.sucursales);
  const initialValues = {
    id_paciente: "",
    nro_receta: "",
    direccion: "",
    cedula: "",
    telefono: "",
    rx: {
      esfera_od: "",
      cilindro_od: "",
      eje_od: "",
      add_od: "",
      prisma_od: "",
      distancia_od: "",
      altura_od: "",
      esfera_oi: "",
      cilindro_oi: "",
      eje_oi: "",
      add_oi: "",
      prisma_oi: "",
      distancia_oi: "",
      altura_oi: ""

    },
    tipo_lente: "",
    material: {
      material_1: "",
      gris_m: "",
      cafe_m: "",
      material_2: ""
    },
    tratamientos: {
      transitions: "",
      filtro_a: "",
      gris_t: "",
      cafe_t: "",
      fotocromatico_t: "",
      antireflejo_t: "",
      espejado: "",
      uv: "",
      tinte: "",
      degradante: "",
      uniforme: "",
      color_t: "",
      intensidad_t: ""
    },
    aro_propio: {
      aro_centevi: "",
      propio: "",
      codigo_aro: "",
      color_aro: "",
      marca: "",
      elaborado: "",
    },
    observacion: "",
    medidas: {
      alto_l: "",
      ancho_b_l: "",
      separacion_l: "",
      diagonal_l: "",
    },
    sucursal: "",
    doctor: "",

  };

  const [serviciosRealizados, setServiciosRealizados] = useState([]);
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState([]);
  const [tratamientosFiltros, setTratamientosFiltros] = useState([]);
  const [aroCentevi, setAroCentevi] = useState(false);

  useEffect(() => {
    dispatch(fetchSucursales({ page: 1, limit: 100 }));
    dispatch(fetchPacientes({ page: 1, limit: 10000 }));
  }, [dispatch]);

  const handleSubmit = async (values) => {
    console.log('Valores del formulario al enviar:', values);
    const result = await dispatch(crearRecetas(values));

    if (result.meta.requestStatus === 'fulfilled') {
      Swal.fire({
        icon: 'success',
        title: 'Receta creada',
        text: 'La receta se ha creado exitosamente.',
      }).then(() => {
        navigate(-1);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al crear la receta. Por favor, intenta de nuevo.',
      });
    }
  };


  return (
    <div className="admin-data-content" data-select2-id="15">
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

                      <div className="widget-content widget-content-area" >
                        <Formik
                          initialValues={initialValues}

                          onSubmit={handleSubmit}
                        >

                          {({ setFieldValue, values }) => (
                            <Form
                            >
                              <div className="form-row" style={{ marginBottom: "2rem" }}>

                                <div className="col-md-4" >
                                  <img
                                    alt="logo"
                                    className="navbar-logo"
                                    src="vistas/img/centevi-logo-in.png"
                                    style={{
                                      height: '80px'
                                    }}
                                  />
                                </div>
                                <div className="col-md-4">
                                  <h4>
                                    Fecha de solicitud
                                  </h4>
                                  <p className="ml-5">
                                    <b>
                                      2024-11-05
                                    </b>
                                  </p>
                                </div>
                                <div class="col-md-2"  >
                                  <h4>Nro. Orden</h4>
                                  <Input
                                    style={{
                                      color: "red",
                                      fontWeight: "bold",
                                      marginBottom: "1rem",
                                      height: '40px'
                                    }}
                                    type="text"
                                    class="form-control"
                                    name="nro_receta"
                                  // disabled
                                  />
                                </div>


                                <div className="form-group col-md-4" >
                                  <label htmlFor="pacientes">Pacientes</label>
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
                                      height: "48px",
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                    onChange={(e) => {
                                      // const selectedPaciente = pacientes.find(paciente => paciente.id_paciente === parseInt(e.target.value));
                                      // setFieldValue('paciente', e.target.value);
                                      // setFieldValue('id_paciente', selectedPaciente ? selectedPaciente.id_paciente : '');
                                    }}
                                  />
                                  {/* <Field
                                    as="select"
                                    name="id_paciente"
                                    className="form-control"
                                    onChange={(e) => {
                                      const selectedPaciente = pacientes.find(paciente => paciente.id_paciente === parseInt(e.target.value));
                                      setFieldValue('paciente', e.target.value);
                                      setFieldValue('id_paciente', selectedPaciente ? selectedPaciente.id_paciente : '');
                                    }}

                                  >
                                    <option value="">Seleccione el paciente</option>
                                    {pacientes.map((paciente) => (
                                      <option key={paciente.id_paciente} value={paciente.id_paciente}>
                                        Numero Cedula: {paciente.nro_cedula} || Nombres: {paciente.nombres} {paciente.apellidos}
                                      </option>
                                    ))}
                                  </Field> */}
                                  <ErrorMessage name="id_paciente" component="div" className="text-danger" />

                                </div>


                                <div className="form-group col-md-4" >
                                  <label htmlFor="inputSucursal">Sucursal</label>
                                  <Field
                                    as="select"
                                    name="sucursal"
                                    className="form-control"
                                    onChange={(e) => {
                                      const selectedSucursal = sucursales.find(sucursal => sucursal.id_sucursal === parseInt(e.target.value));
                                      setFieldValue('sucursal', e.target.value);
                                      setFieldValue('direccion', selectedSucursal ? selectedSucursal.nombre : '');
                                    }}
                                  >
                                    <option value="">Seleccionar sucursal</option>
                                    {sucursales.map((sucursal) => (
                                      <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>{sucursal.nombre}</option>
                                    ))}
                                  </Field>
                                  <ErrorMessage name="sucursal" component="div" className="text-danger" />
                                </div>
                                <div className="form-group col-md-2">
                                  <label htmlFor="cedula">
                                    Cedula
                                  </label>
                                  <Input
                                    className="form-control"
                                    name="cedula"
                                    type="text"
                                    style={{
                                      color: "red",
                                      fontWeight: "bold",
                                      marginBottom: "1rem",
                                      height: '48px'
                                    }}
                                    disabled
                                  />
                                </div>
                                <div className="form-group col-md-2">
                                  <label htmlFor="inputEmail4">
                                    Telefono
                                  </label>
                                  <Input
                                    className="form-control"
                                    name="telefono"
                                    type="text"
                                    style={{
                                      color: "red",
                                      fontWeight: "bold",
                                      marginBottom: "1rem",
                                      height: '48px'
                                    }}
                                    disabled
                                  />
                                </div>
                              </div>
                              <div
                                className="form-row"
                                style={{
                                  marginTop: '-30px'
                                }}
                              >
                                <div className="form-group col-md-12">
                                  <div className="table-responsive">
                                    <table className="table table-bordered">
                                      <thead>
                                        <tr
                                          style={{
                                            backgroundColor: '#4361ee'
                                          }}
                                        >
                                          <th
                                            className="text-center"
                                            style={{
                                              color: 'white!important'
                                            }}
                                          >
                                            RX
                                          </th>
                                          <th
                                            className="text-center"
                                            style={{
                                              color: 'white!important'
                                            }}
                                          >
                                            Esfera
                                          </th>
                                          <th
                                            style={{
                                              color: 'white!important'
                                            }}
                                          >
                                            Cilindro
                                          </th>
                                          <th
                                            style={{
                                              color: 'white!important'
                                            }}
                                          >
                                            Eje
                                          </th>
                                          <th
                                            style={{
                                              color: 'white!important'
                                            }}
                                          >
                                            ADD
                                          </th>
                                          <th
                                            style={{
                                              color: 'white!important'
                                            }}
                                          >
                                            PRISMA
                                          </th>
                                          <th
                                            style={{
                                              color: 'white!important'
                                            }}
                                          >
                                            DISTANCIA PUPILAR
                                          </th>
                                          <th
                                            style={{
                                              color: 'white!important'
                                            }}
                                          >
                                            ALTURA
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
                                              name="rx.esfera_od"

                                              as="input"
                                            />
                                          </td>
                                          <td>
                                            <Field
                                              className="form-control"
                                              name="rx.cilindro_od"

                                              as="input"
                                            />
                                          </td>
                                          <td>
                                            <Field
                                              className="form-control"
                                              name="rx.eje_od"

                                              as="input"
                                            />
                                          </td>
                                          <td>
                                            <Field
                                              className="form-control"
                                              name="rx.add_od"

                                              as="input"
                                            />
                                          </td>
                                          <td>
                                            <Field
                                              className="form-control"
                                              placeholder="△"
                                              type="text"
                                              value="△"
                                              name="rx.prisma_od"
                                              as="input"
                                            />
                                          </td>
                                          <td>
                                            <Field
                                              className="form-control"
                                              name="rx.distancia_od"

                                              as="input"
                                            />
                                          </td>
                                          <td>
                                            <Field
                                              className="form-control"
                                              name="rx.altura_od"

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
                                              name="rx.esfera_oi"

                                              as="input"
                                            />
                                          </td>
                                          <td>
                                            <Field
                                              className="form-control"
                                              name="rx.cilindro_oi"

                                              as="input"
                                            />
                                          </td>
                                          <td>
                                            <Field
                                              className="form-control"
                                              name="rx.eje_oi"

                                              as="input"
                                            />
                                          </td>
                                          <td>
                                            <Field
                                              className="form-control"
                                              name="rx.add_oi"

                                              as="input"
                                            />
                                          </td>
                                          <td>
                                            <Field
                                              className="form-control"
                                              value="△"
                                              type="text"
                                              placeholder="△"
                                              name="rx.prisma_oi"
                                              as="input"
                                            />
                                          </td>
                                          <td>
                                            <Field
                                              className="form-control"
                                              name="rx.distancia_oi"

                                              as="input"
                                            />
                                          </td>
                                          <td>
                                            <Field
                                              className="form-control"
                                              name="rx.altura_oi"

                                              as="input"
                                            />
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                              <div
                                style={{
                                  border: '2px solid blue',
                                  borderRadius: '25px',
                                  marginTop: '-20px',
                                  padding: '15px'
                                  // background: 'red'
                                }}
                              >
                                <Row gutter={[16, 16]}>
                                  <Col xxl={24} xl={24} md={24}>
                                    <div
                                      style={{
                                        fontSize: '20px',
                                        color: 'black'
                                      }}
                                    >
                                      Caracteristicas de Cristales
                                    </div>
                                  </Col>
                                  <Col xxl={8} xl={8} md={8}>
                                    <h6 className="text-center p-2">
                                      TIPO DE CRISTAL:
                                    </h6>

                                    <Select
                                      showSearch
                                      value={null}
                                      style={{
                                        width: '100%', color: 'transparent',
                                        background: 'white !important'
                                      }}
                                      onChange={(value, val) => {
                                        // setFieldValue('servicios_realizados_historias_clinicas', value);

                                        if (!serviciosRealizados.find(servicio => servicio.id == value)) {
                                          serviciosRealizados.push(val)
                                          setServiciosRealizados([...serviciosRealizados])
                                        }
                                      }}
                                      options={[
                                        { id: 1, codigo: "MP01 | Monofocal Claro Sencillo" },
                                        { id: 2, codigo: "MPAR | Monofocal + Antirreflejo" },
                                        { id: 3, codigo: "MPL02 | Monofocal + Antirreflejo + Filtro Luz Azul" },
                                        { id: 4, codigo: "MCAF1 | Monofocal + Antirreflejo + Fotocromático" },
                                        { id: 5, codigo: "MCAF | Monofocal + Antirreflejo + Fotocromático + Filtro Luz Azul" },
                                        { id: 6, codigo: "MPT06 | Monofocal + Transitions" },
                                      ].map(servicio => ({
                                        value: servicio.id,
                                        label: servicio.codigo
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
                                                  setServiciosRealizados([...serviciosRealizados.filter(serv => serv.value !== servicio.value)])
                                                }}
                                              >
                                                <CloseCircleTwoTone twoToneColor="#eb2f96" />
                                              </div>
                                            </div>
                                          )
                                        })
                                      }

                                    </div>
                                  </Col>
                                  <Col xxl={8} xl={8} md={8}>
                                    <h6 className="text-center p-2">
                                      MATERIAL:
                                    </h6>

                                    <Select
                                      showSearch
                                      value={null}
                                      style={{
                                        width: '100%', color: 'transparent',
                                        background: 'white !important'
                                      }}
                                      onChange={(value, val) => {
                                        // setFieldValue('servicios_realizados_historias_clinicas', value);

                                        if (!materialesSeleccionados.find(servicio => servicio.id == value)) {
                                          materialesSeleccionados.push(val)
                                          setMaterialesSeleccionados([...materialesSeleccionados])
                                        }
                                      }}
                                      options={[
                                        { id: 1, codigo: "CR-39" },
                                        { id: 2, codigo: "Policarbonato" },
                                        { id: 3, codigo: "THIN & LITE" },
                                        { id: 4, codigo: "SUPER THIN & LITE" },
                                        { id: 5, codigo: "DRIVEWEAR" },
                                        { id: 6, codigo: "POLIRIZADO" },
                                        { id: 7, codigo: "POLICOLOR" },
                                      ].map(servicio => ({
                                        value: servicio.id,
                                        label: servicio.codigo
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
                                        materialesSeleccionados.map((servicio) => {
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
                                                  setMaterialesSeleccionados([...materialesSeleccionados.filter(serv => serv.value !== servicio.value)])
                                                }}
                                              >
                                                <CloseCircleTwoTone twoToneColor="#eb2f96" />
                                              </div>
                                            </div>
                                          )
                                        })
                                      }

                                    </div>
                                  </Col>
                                  <Col xxl={8} xl={8} md={8}>
                                    <h6 className="text-center p-2">
                                      TRATAMIENTOS Y FILTROS:
                                    </h6>
                                    <Select
                                      showSearch
                                      value={null}
                                      style={{
                                        width: '100%', color: 'transparent',
                                        background: 'white !important'
                                      }}
                                      onChange={(value, val) => {
                                        // setFieldValue('servicios_realizados_historias_clinicas', value);

                                        if (!tratamientosFiltros.find(servicio => servicio.id == value)) {
                                          tratamientosFiltros.push(val)
                                          setTratamientosFiltros([...tratamientosFiltros])
                                        }
                                      }}
                                      options={[
                                        { id: 1, codigo: "Transitions" },
                                        { id: 2, codigo: "Antireflejo" },
                                        { id: 3, codigo: "Espejado" },
                                        { id: 4, codigo: "Degradante" },
                                        { id: 5, codigo: "Color" },
                                        { id: 6, codigo: "Fotocramático" },
                                        { id: 7, codigo: "UV" },
                                        { id: 8, codigo: "Tinte" },
                                        { id: 9, codigo: "Uniforme" },
                                        { id: 10, codigo: "Intensidad" },
                                      ].map(servicio => ({
                                        value: servicio.id,
                                        label: servicio.codigo
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
                                        tratamientosFiltros.map((servicio) => {
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
                                                  setTratamientosFiltros([...tratamientosFiltros.filter(serv => serv.value !== servicio.value)])
                                                }}
                                              >
                                                <CloseCircleTwoTone twoToneColor="#eb2f96" />
                                              </div>
                                            </div>
                                          )
                                        })
                                      }

                                    </div>
                                  </Col>
                                </Row>
                                {/* <div className="row p-1">
                                  <div className="col-md-2">
                                    <h6 className="text-center p-2">
                                      TIPO DE LENTE:
                                    </h6>
                                  </div>
                                  <div className="col-md-2 p-2">
                                    <div className="n-chk">
                                      <label className="new-control new-radio radio-classic-primary">
                                        <Field
                                          className="new-control-input"
                                          value="monofocal"
                                          name="tipo_lente"
                                          type="radio"
                                        />
                                        <span className="new-control-indicator" />
                                        Monofocal
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-md-2 p-2">
                                    <div className="n-chk">
                                      <label className="new-control new-radio radio-classic-primary">
                                        <Field
                                          className="new-control-input"
                                          value="bifocal"
                                          name="tipo_lente"
                                          type="radio"
                                        />
                                        <span className="new-control-indicator" />
                                        Bifocal
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-md-2 p-2">
                                    <div className="n-chk">
                                      <label className="new-control new-radio radio-classic-primary">
                                        <Field
                                          className="new-control-input"
                                          value="interview"
                                          name="tipo_lente"
                                          type="radio"
                                        />
                                        <span className="new-control-indicator" />
                                        Interview
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-md-2 p-2">
                                    <div className="n-chk">
                                      <label className="new-control new-radio radio-classic-primary">
                                        <Field
                                          className="new-control-input"
                                          value="antifatigue"
                                          name="tipo_lente"
                                          type="radio"
                                        />
                                        <span className="new-control-indicator" />
                                        Antifatigue
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-md-2 p-2">
                                    <div className="n-chk">
                                      <label className="new-control new-radio radio-classic-primary">
                                        <Field
                                          className="new-control-input"
                                          value="progresivo"
                                          name="tipo_lente"
                                          type="radio"
                                        />
                                        <span className="new-control-indicator" />
                                        Progresivo
                                      </label>
                                    </div>
                                  </div>
                                </div> */}
                              </div>

                              {/* <div
                                className="p-2"
                                style={{
                                  border: '2px solid blue',
                                  borderRadius: '25px',
                                  marginTop: '10px'
                                }}
                              >
                                <div className="row">
                                  <div className="col-md-2">
                                    <h6 className="text-center p-2">
                                      MATERIAL:
                                    </h6>
                                  </div>
                                  <div className="col-md-2">
                                    <div className="n-chk">
                                      <label className="new-control new-radio radio-classic-primary">
                                        <Field
                                          className="new-control-input"
                                          value="cr_39"
                                          name="material.material_1"
                                          type="radio"
                                        />
                                        <span className="new-control-indicator" />
                                        CR-39
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-md-2">
                                    <div className="n-chk">
                                      <label className="new-control new-radio radio-classic-primary">
                                        <Field
                                          className="new-control-input"
                                          value="policarbonato"
                                          name="material.material_1"
                                          type="radio"
                                        />
                                        <span className="new-control-indicator" />
                                        Policarbonato
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-md-2">
                                    <div className="n-chk">
                                      <label className="new-control new-radio radio-classic-primary">
                                        <Field
                                          className="new-control-input"
                                          value="thin_lite"
                                          name="material.material_2"
                                          type="radio"
                                        />
                                        <span className="new-control-indicator" />
                                        THIN & LITE
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-md-2">
                                    <div className="n-chk">
                                      <label className="new-control new-radio radio-classic-primary">
                                        <Field
                                          className="new-control-input"
                                          value="super_thin"
                                          name="material.material_2"
                                          type="radio"
                                        />
                                        <span className="new-control-indicator" />
                                        {' '}SUPER THIN & LITE
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                <div className="row p-2">
                                  <div className="col-md-2">
                                    <h6 className="text-center p-2" />
                                  </div>
                                  <div className="col-md-2">
                                    <div className="n-chk">
                                      <label className="new-control new-radio radio-classic-primary">
                                        <Field
                                          className="new-control-input"
                                          value="drivewear"
                                          name="material.material_1"
                                          type="radio"
                                        />
                                        <span className="new-control-indicator" />
                                        DRIVEWEAR
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-md-2">
                                    <div className="n-chk">
                                      <label className="new-control new-radio radio-classic-primary">
                                        <Field
                                          className="new-control-input"
                                          value="polarizado"
                                          name="material.material_1"
                                          type="radio"
                                        />
                                        <span className="new-control-indicator" />
                                        POLARIZADO
                                      </label>
                                      <div>
                                        <span>Gris</span>
                                        <span>
                                          <Input />
                                        </span>
                                        <span>Café</span>
                                        <span>
                                          <Input />
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-md-2">
                                    <div className="n-chk">
                                      <label className="new-control new-radio radio-classic-primary">
                                        <Field
                                          className="new-control-input"
                                          value="policolor"
                                          name="material.material_2"
                                          type="radio"
                                        />
                                        <span className="new-control-indicator" />
                                        POLICOLOR
                                      </label>
                                      <div>
                                        <span>
                                          <Input />
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              </div> */}

                              {/*  */}
                              {/* <div
                                style={{
                                  border: '2px solid blue',
                                  borderRadius: '25px',
                                  marginTop: '10px',
                                  padding: '10px 50px'
                                }}
                              >
                                <div className="row p-1">
                                  <div className="col-md-2">
                                    <h6 className="text-center p-2">
                                      TRATAMIENTOS Y FILTROS:
                                    </h6>
                                  </div>
                                  <div className="col-md-2">
                                    <div className="n-chk">
                                      <label className="new-control new-radio radio-classic-primary">
                                        <Field
                                          className="new-control-input"
                                          value="transitions"
                                          name="tratamientos.transitions"
                                          type="radio"
                                        />
                                        <span className="new-control-indicator" />
                                        Transitions
                                      </label>

                                      <div>
                                        <span>
                                          <Input />
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-md-2">
                                    <div className="n-chk">
                                      <label className="new-control new-checkbox checkbox-outline-success">
                                        <Field
                                          className="new-control-input"
                                          value="antireflejo"
                                          name="tratamientos.antireflejo_t"
                                          type="checkbox"
                                        />
                                        <span className="new-control-indicator" />
                                        Antireflejo
                                      </label>
                                    </div>
                                  </div>

                                  <div className="col-md-2">
                                    <div className="n-chk">
                                      <label className="new-control new-checkbox checkbox-outline-success">
                                        <Field
                                          className="new-control-input"
                                          value="espejado"
                                          name="tratamientos.espejado"
                                          type="checkbox"
                                        />
                                        <span className="new-control-indicator" />
                                        Espejado
                                      </label>
                                    </div>
                                  </div>

                                  <div className="col-md-2">
                                    <div className="n-chk">
                                      <label className="new-control new-radio radio-classic-primary">
                                        <Field
                                          className="new-control-input"
                                          value="degradante"
                                          name="tratamientos.degradante"
                                          type="checkbox"
                                        />
                                        <span className="new-control-indicator" />
                                        Degradante
                                      </label>
                                    </div>
                                  </div>


                                  <div className="col-md-2">
                                    <div className="n-chk">

                                      <div
                                        style={{
                                          color: 'black'
                                        }}
                                      >
                                        Color
                                      </div>

                                      <div>
                                        <span>
                                          <Input />
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                </div>
                                <div className="row p-2">
                                  <div className="col-md-2">
                                    <h6 className="text-center p-2" />
                                  </div>
                                  <div className="col-md-2">
                                    <div className="n-chk">
                                      <label className="new-control new-checkbox checkbox-outline-success">
                                        <Field
                                          className="new-control-input"
                                          value="fotocromatico"
                                          name="tratamientos.fotocromatico_t"
                                          type="checkbox"
                                        />
                                        <span className="new-control-indicator" />
                                        Fotocromático
                                      </label>

                                      <div>
                                        <span>Gris</span>
                                        <span>
                                          <Input />
                                        </span>
                                        <span>Café</span>
                                        <span>
                                          <Input />
                                        </span>
                                      </div>
                                    </div>
                                  </div>


                                  <div className="col-md-2">
                                    <div className="n-chk">
                                      <label className="new-control new-checkbox checkbox-outline-success">
                                        <Field
                                          className="new-control-input"
                                          value="uv"
                                          name="tratamientos.uv"
                                          type="checkbox"
                                        />
                                        <span className="new-control-indicator" />
                                        UV
                                      </label>
                                    </div>
                                  </div>



                                  <div className="col-md-2">
                                    <div className="n-chk">
                                      <label className="new-control new-radio radio-classic-primary">
                                        <Field
                                          className="new-control-input"
                                          value="tinte"
                                          name="tratamientos.tinte"
                                          type="checkbox"
                                        />
                                        <span className="new-control-indicator" />
                                        Tinte
                                      </label>
                                    </div>
                                  </div>

                                  <div className="col-md-2">
                                    <div className="n-chk">
                                      <label className="new-control new-radio radio-classic-primary">
                                        <Field
                                          className="new-control-input"
                                          value="uniforme"
                                          name="tratamientos.uniforme"
                                          type="checkbox"
                                        />
                                        <span className="new-control-indicator" />
                                        Uniforme
                                      </label>
                                    </div>
                                  </div>

                                  <div className="col-md-2">
                                    <div className="n-chk">

                                      <div
                                        style={{
                                          color: 'black'
                                        }}
                                      >
                                        Intensidad
                                      </div>

                                      <div>
                                        <span>
                                          <Input />
                                        </span>
                                      </div>
                                    </div>
                                  </div>


                                </div>
                                <div className="row p-2">

                                </div>
                              </div> */}
                              {/*  */}

                              {/*  */}


                              <div
                                style={{
                                  border: '2px solid blue',
                                  borderRadius: '25px',
                                  marginTop: '10px',
                                  padding: '10px 50px'
                                }}
                              >
                                <Row
                                  gutter={[16, 16]}
                                >
                                  <Col
                                    xxl={14} xl={14} md={14}
                                    style={{
                                      alignContent: 'center'
                                    }}
                                  >
                                    <Row
                                      gutter={[16, 16]}
                                    >
                                      <Col xxl={24} xl={24} md={24}>
                                        <div
                                          style={{
                                            fontSize: '20px',
                                            color: 'black'
                                          }}
                                        >
                                          Caracteristicas de Aro
                                        </div>
                                      </Col>
                                      <Col xxl={5} xl={5} md={5}>
                                        <div>
                                          <label className="new-control new-radio radio-classic-primary">
                                            <b>ARO CENTEVI</b>
                                            {/* <Checkbox
                                              className="new-control-input"
                                            >

                                            </Checkbox> */}
                                            <Field
                                              className="new-control-input"
                                              value={aroCentevi}
                                              checked={aroCentevi}
                                              name="caracaro.aro.propiocentevi"
                                              type="radio"
                                              onChange={(e) => {
                                                setAroCentevi(!aroCentevi)
                                              }}
                                            />
                                            <span className="new-control-indicator" />
                                          </label>
                                        </div>
                                      </Col>
                                      <Col xxl={5} xl={5} md={5}>
                                        <div>
                                          <label className="new-control new-radio radio-classic-primary">
                                            <b>ARO PROPIO</b>
                                            <Field
                                              className="new-control-input"
                                              value={!aroCentevi}
                                              checked={!aroCentevi}
                                              name="caracaro.aro.propiocentevi"
                                              type="radio"
                                              onChange={() => {
                                                setAroCentevi(!aroCentevi)
                                              }}
                                            />
                                            <span className="new-control-indicator" />
                                          </label>
                                        </div>
                                      </Col>

                                      <Col xxl={5} xl={5} md={5}>
                                        <div
                                          style={{
                                            // display: 'flex'
                                          }}
                                        >
                                          <div style={{ marginTop: '-15px' }}>
                                            <b>CÓDIGO</b>
                                          </div>
                                          <Input
                                            style={{
                                              marginLeft: '0px', height: '30px',
                                              width: '100%'
                                            }}
                                            disabled={!aroCentevi}
                                          />
                                        </div>
                                      </Col>

                                      <Col xxl={5} xl={5} md={5}>
                                        <div
                                          style={{
                                            // display: 'flex'
                                          }}
                                        >
                                          <div style={{ marginTop: '-15px' }}>
                                            <b>COLOR</b>
                                          </div>
                                          <Input
                                            style={{
                                              marginLeft: '0px', height: '30px'
                                            }}
                                          />
                                        </div>
                                      </Col>
                                      <Col xxl={4} xl={4} md={4}>
                                        <div
                                          style={{
                                            // display: 'flex'
                                          }}
                                        >
                                          <div style={{ marginTop: '-15px' }}>
                                            <b>MARCA</b>
                                          </div>
                                          <Input
                                            style={{
                                              marginLeft: '0px', height: '30px'
                                            }}
                                          />
                                        </div>
                                      </Col>



                                      <Col xxl={24} xl={24} md={24}>
                                        <Row
                                          gutter={[16, 16]}
                                        >
                                          <Col xxl={12} xl={12} md={12}>
                                            <Row>
                                              <Col xxl={12} xl={12} md={12}>
                                                <div>
                                                  <label className="new-control new-radio radio-classic-primary">
                                                    <b>METAL COMPLETO</b>
                                                    <Field
                                                      className="new-control-input"
                                                      value="transitions"
                                                      name="tratamientos.transitions"
                                                      type="radio"
                                                    />
                                                    <span className="new-control-indicator" />
                                                  </label>
                                                </div>
                                              </Col>
                                              <Col xxl={12} xl={12} md={12}>
                                                <div>
                                                  <label className="new-control new-radio radio-classic-primary">
                                                    <b>PASTA COMPLETO</b>
                                                    <Field
                                                      className="new-control-input"
                                                      value="transitions"
                                                      name="tratamientos.transitions"
                                                      type="radio"
                                                    />
                                                    <span className="new-control-indicator" />
                                                  </label>
                                                </div>
                                              </Col>

                                              <Col xxl={12} xl={12} md={12}>
                                                <div>
                                                  <label className="new-control new-radio radio-classic-primary">
                                                    <b>METAL SEMI - AIRE</b>
                                                    <Field
                                                      className="new-control-input"
                                                      value="transitions"
                                                      name="tratamientos.transitions"
                                                      type="radio"
                                                    />
                                                    <span className="new-control-indicator" />
                                                  </label>
                                                </div>
                                              </Col>

                                              <Col xxl={12} xl={12} md={12}>
                                                <div>
                                                  <label className="new-control new-radio radio-classic-primary">
                                                    <b>PASTA SEMI - AIRE</b>
                                                    <Field
                                                      className="new-control-input"
                                                      value="transitions"
                                                      name="tratamientos.transitions"
                                                      type="radio"
                                                    />
                                                    <span className="new-control-indicator" />
                                                  </label>
                                                </div>
                                              </Col>



                                              <Col xxl={12} xl={12} md={12}>
                                                <div>
                                                  <label className="new-control new-radio radio-classic-primary">
                                                    <b>AL AIRE</b>
                                                    <Field
                                                      className="new-control-input"
                                                      value="transitions"
                                                      name="tratamientos.transitions"
                                                      type="radio"
                                                    />
                                                    <span className="new-control-indicator" />
                                                  </label>
                                                </div>
                                              </Col>


                                              <Col xxl={12} xl={12} md={12}>
                                                <div>
                                                  <label className="new-control new-radio radio-classic-primary">
                                                    <b>SEGURIDAD</b>
                                                    <Field
                                                      className="new-control-input"
                                                      value="transitions"
                                                      name="tratamientos.transitions"
                                                      type="radio"
                                                    />
                                                    <span className="new-control-indicator" />
                                                  </label>
                                                </div>
                                              </Col>

                                              <Col xxl={24} xl={24} md={24}>
                                                <div
                                                  style={{
                                                    // display: 'flex'
                                                    marginBottom: '10px'
                                                  }}
                                                >
                                                  {/* <label className="new-control new-radio radio-classic-primary">
                                                    <b>MARCA</b>
                                                    <Field
                                                      className="new-control-input"
                                                      value="transitions"
                                                      name="tratamientos.transitions"
                                                      type="radio"
                                                    />
                                                    <span className="new-control-indicator" />
                                                  </label> */}

                                                  {/* <Input /> */}
                                                  <b>TIPO DE ARO:</b>
                                                  <Select
                                                    showSearch
                                                    placeholder="Selecciona el tipo de aro"
                                                    // filterOption={(input, option) => {
                                                    //   const searchTerms = input.toLowerCase().split(' ');
                                                    //   return searchTerms.every(term =>
                                                    //     (option?.label ?? '').toLowerCase().includes(term)
                                                    //   );
                                                    // }}
                                                    options={[
                                                      { label: 'Pasta Completo', value: 1 },
                                                      { label: 'Pasta Semi al Aire', value: 2 },
                                                      { label: 'Metal Completo', value: 3 },
                                                      { label: 'Metal Semi al Aire', value: 4 },
                                                      { label: 'Al Aire', value: 5 },
                                                      { label: 'Seguridad', value: 6 },
                                                    ]}
                                                    style={{
                                                      width: "100%",
                                                      height: "40px",
                                                      color: "black",
                                                      fontWeight: "bold",
                                                    }}
                                                  />
                                                </div>
                                              </Col>



                                              <Col xxl={24} xl={24} md={24}>
                                                <div
                                                >
                                                  <b>DOCTOR:</b>
                                                  <Select
                                                    showSearch
                                                    placeholder="Seleccione el doctor"
                                                    filterOption={(input, option) => {
                                                      const searchTerms = input.toLowerCase().split(' ');
                                                      return searchTerms.every(term =>
                                                        (option?.label ?? '').toLowerCase().includes(term)
                                                      );
                                                    }}
                                                    options={pacientes_options_selecteds}
                                                    style={{
                                                      width: "100%",
                                                      height: "48px",
                                                      color: "black",
                                                      fontWeight: "bold",
                                                    }}
                                                    onChange={(e) => { }}
                                                  />
                                                  {/* <Input /> */}
                                                </div>
                                              </Col>

                                              <Col xxl={24} xl={24} md={24}>
                                                <div
                                                  style={{
                                                    marginTop: '10px'
                                                  }}
                                                >
                                                  <b>ELABORADO POR</b>
                                                  <Input disabled />
                                                </div>
                                              </Col>
                                            </Row>
                                          </Col>

                                          <Col xxl={12} xl={12} md={12}>
                                            <b>OBSERVACIONES</b>
                                            <TextArea
                                              style={{
                                                height: '100px'
                                              }}
                                            />
                                          </Col>
                                        </Row>
                                      </Col>
                                    </Row>
                                  </Col>

                                  <Col
                                    xxl={10} xl={10} md={10}
                                    style={{
                                      alignContent: "center",
                                      position: 'relative'
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: '470px',
                                        height: '470px',
                                        alignContent: "center",
                                      }}
                                    >
                                      <img
                                        src="assets/img/recetas/lentescentevi.jpeg"
                                        style={{
                                          width: "100%",
                                          // height: "80px"
                                        }}
                                      />
                                      <div
                                        style={{
                                          position: 'absolute',
                                          top: '212px',
                                          width: '70px',
                                          border: '1px solid red'
                                        }}
                                      >
                                        <Input />
                                      </div>


                                      <div
                                        style={{
                                          position: 'absolute',
                                          top: '157px',
                                          width: '70px',
                                          border: '1px solid red',
                                          left: '85px'
                                        }}
                                      >
                                        <Input />
                                      </div>

                                      <div
                                        style={{
                                          position: 'absolute',
                                          top: '210px',
                                          width: '70px',
                                          border: '1px solid red',
                                          left: '210px'
                                        }}
                                      >
                                        <Input />
                                      </div>

                                      <div
                                        style={{
                                          position: 'absolute',
                                          top: '279px',
                                          width: '70px',
                                          border: '1px solid red',
                                          left: '84px'
                                        }}
                                      >
                                        <Input />
                                      </div>

                                      <div
                                        style={{
                                          position: 'absolute',
                                          top: '213px',
                                          width: '70px',
                                          border: '1px solid red',
                                          left: '331px'
                                        }}
                                      >
                                        <Input />
                                      </div>

                                    </div>


                                  </Col>
                                </Row>
                              </div>



                              {/*  */}










                              <button
                                className="btn btn-success mt-3"
                                type="submit"
                              >
                                Crear Receta
                              </button>



                            </Form>
                          )}
                        </Formik>
                      </div>
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

export default CreateReceta