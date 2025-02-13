import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { createOrdenes, fecthOrdenes } from '../../redux/features/ordenes/ordenesSlice';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import { Col, Input, Row, Select, Checkbox, Button } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { CloseCircleTwoTone } from '@ant-design/icons';
import { fetchUsuarios } from '../../redux/features/usuarios/usuariosSlice';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { createCorrecionesOrdenes, fecthCorrecionesOrdenes } from '../../redux/features/correciones-ordenes/correcionesOrdenesSlice';
import { fetchCristales } from '../../redux/features/cristales/cristalesSlice';
import { fetchMateriales } from '../../redux/features/materiales/materialesSlice';
import { fetchTratamientos } from '../../redux/features/tratamientos/tratamientosSlice';

const CreateCorrecionOrden = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const { orden } = location.state || {};
  const [selectedOrden, setSelectedOrden] = useState(orden?.id_orden);
  const { pacientes_options_selecteds } = useSelector((state) => state.pacientes);
  const { usuario } = useSelector((state) => state.auth);
  const { usuarios_doctores_options_selecteds } = useSelector((state) => state.usuarios)
  const { cristales_options_selecteds } = useSelector((state) => state.cristales)
  const { materiales_options_selecteds } = useSelector((state) => state.materiales)
  const { tratamientos_options_selecteds } = useSelector((state) => state.tratamientos)
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [selectedMarca, setSelectedMarca] = useState(orden?.marca);
  const [lenteContacto, setLenteContacto] = useState(false);
  const [isRowVisible, setIsRowVisible] = useState(true);
  const [isImageVisible, setIsImageVisible] = useState(true);
  const [isAroVisible, setIsAroVisible] = useState(true);
  const [aroCentevi, setAroCentevi] = useState(false);


  useEffect(() => {
    if (orden?.lente_contacto) {
      setLenteContacto(true);
      setIsRowVisible(false);
      setIsImageVisible(false);
      setIsAroVisible(false);
    }
  }, [orden]);


  useEffect(() => {
    if (id && pacientes_options_selecteds.length > 0) {
      setSelectedPaciente(Number(id));
    }
  }, [id, pacientes_options_selecteds]);

  const {
    ordenes_options_selecteds
  } = useSelector((state) => state.ordenes);



  useEffect(() => {
    dispatch(fetchUsuarios({}))
    dispatch(fecthOrdenes({}))
    dispatch(fetchCristales())
    dispatch(fetchMateriales())
    dispatch(fetchTratamientos())
  }, []);

  useEffect(() => {
    dispatch(fecthCorrecionesOrdenes({}))
  }, []);

  useEffect(() => {
    if (orden?.aro_centevi !== undefined) {
      setAroCentevi(orden?.aro_centevi === 1);
    }
  }, [orden]);


  const initialValues = {
    ordenes_id: orden?.id_orden,
    nro_orden_id: orden?.nro_orden_id,
    esfera_od: orden?.esfera_od,
    esfera_oi: orden?.esfera_oi,
    cilindro_od: orden?.cilindro_od,
    cilindro_oi: orden?.cilindro_oi,
    eje_od: orden?.eje_od,
    eje_oi: orden?.eje_oi,
    add_od: orden?.add_od,
    add_oi: orden?.add_oi,
    prisma_od: orden?.prisma_od,
    prisma_oi: orden?.prisma_oi,
    distancia_od: orden?.distancia_od,
    distancia_oi: orden?.distancia_oi,
    altura_od: orden?.altura_od,
    altura_oi: orden?.altura_oi,
    tipo_cristal_od: "",
    tipo_cristal_oi: "",
    material_od: "",
    material_oi: "",
    tratamientos_od: "",
    tratamientos_oi: "",
    aro_centevi: orden?.aro_centevi,
    aro_propio: orden?.aro_propio,
    codigo: orden?.codigo,
    color: orden?.color,
    marca: orden?.marca,
    tipo_aro: orden?.tipo_aro,
    observaciones: orden?.observaciones,
    doctor: orden?.doctor,
    l_uno: orden?.l_uno,
    l_dos: orden?.l_dos,
    l_tres: orden?.l_tres,
    l_cuatro: orden?.l_cuatro,
    l_cinco: orden?.l_cinco,
    pagado: orden?.pagado,
    isRowVisible: isAroVisible,
  };

  const tipoAroOptions = [
    { label: 'Pasta Completo', value: 1 },
    { label: 'Pasta Semi al Aire', value: 2 },
    { label: 'Metal Completo', value: 3 },
    { label: 'Metal Semi al Aire', value: 4 },
    { label: 'Al Aire', value: 5 },
    { label: 'Seguridad', value: 6 },
  ];


  const validationSchema = Yup.object().shape({
    elaborado_por: Yup.number().nullable(),
    aro_centevi: Yup.number().oneOf([0, 1]),
    aro_propio: Yup.number().oneOf([0, 1]),
    tipo_aro: Yup.string().when('lenteContacto', {
      is: false,
      then: (schema) => schema.required("Seleccione un tipo de aro"),
      otherwise: (schema) => schema.notRequired(),
    }),
    doctor: Yup.string()
      .nullable()
      .required("Seleccione un doctor"),
  });

  const [serviciosRealizados, setServiciosRealizados] = useState([
    orden?.tipo_cristal_od ? {
      value: orden?.tipo_cristal_od,
      label: orden?.tipo_cristal_od,
      ojo: "Ojo Derecho"
    } : null,
    orden?.tipo_cristal_oi ? {
      value: orden?.tipo_cristal_oi,
      label: orden?.tipo_cristal_oi,
      ojo: "Ojo Izquierdo"
    } : null,
  ].filter(Boolean));
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState([
    orden?.material_od ? {
      value: orden?.material_od,
      label: orden?.material_od,
      ojo: "Ojo Derecho"
    } : null,
    orden?.material_oi ? {
      value: orden?.material_oi,
      label: orden?.material_oi,
      ojo: "Ojo Izquierdo"
    } : null,
  ].filter(Boolean));
  const [tratamientosFiltros, setTratamientosFiltros] = useState([
    orden?.tratamientos_od ? {
      value: orden?.tratamientos_od,
      label: orden?.tratamientos_od,
      ojo: "Ojo Derecho"
    } : null,
    orden?.tratamientos_oi ? {
      value: orden?.tratamientos_oi,
      label: orden?.tratamientos_oi,
      ojo: "Ojo Izquierdo"
    } : null,
  ].filter(Boolean));
  const [tipoAro, setTipoAro] = useState(orden?.tipo_aro);
  const [doctorSeleccionado, setDoctorSeleccionado] = useState(orden?.doctor)
  const [isLeftEye, setIsLeftEye] = useState(false);
  const [isLeftEyeMaterial, setIsLeftEyeMaterial] = useState(false);
  const [isLeftEyeTratamientos, setIsLeftEyeTratamientos] = useState(false);



  const toggleEye = () => {
    setIsLeftEye(!isLeftEye);
  };

  const toggleEyeMaterial = () => {
    setIsLeftEyeMaterial(!isLeftEyeMaterial);
  };

  const toggleEyeTratamientos = () => {
    setIsLeftEyeTratamientos(!isLeftEyeTratamientos);
  };


  const handleSelectChange = (value, option) => {
    const newEntry = {
      ojo: isLeftEye ? "Ojo Izquierdo" : "Ojo Derecho",
      label: option.label,
    };
    const indexFind = serviciosRealizados.findIndex(servicio => servicio.ojo == newEntry.ojo)
    if (indexFind !== -1) {
      setServiciosRealizados((prev) =>
        prev.map((servicio, index) => (index === indexFind ? { ...servicio, ...newEntry } : servicio))
      );
    } else {
      setServiciosRealizados((prev) => {
        return [...prev, newEntry];
      });
    }
    setIsLeftEye(!isLeftEye);
  };

  const handleSelectChangeMaterial = (value, option) => {
    const newEntryMateriales = {
      ojo: isLeftEyeMaterial ? "Ojo Izquierdo" : "Ojo Derecho",
      label: option.label,
    };

    const indexFind = materialesSeleccionados.findIndex(material => material.ojo == newEntryMateriales.ojo)

    if (indexFind !== -1) {
      setMaterialesSeleccionados((prev) =>
        prev.map((material, index) => (index === indexFind ? { ...material, ...newEntryMateriales } : material))
      );
    } else {
      setMaterialesSeleccionados((prev) => {
        return [...prev, newEntryMateriales];
      });
    }

    setIsLeftEyeMaterial(!isLeftEyeMaterial);
  };

  const handleSelectChangeTratamientos = (value, option) => {
    const newEntryTratamientos = {
      ojo: isLeftEyeTratamientos ? "Ojo Izquierdo" : "Ojo Derecho",
      label: option.label,
    };

    const indexFind = tratamientosFiltros.findIndex(tratamiento => tratamiento.ojo == newEntryTratamientos.ojo)

    if (indexFind !== -1) {
      setTratamientosFiltros((prev) =>
        prev.map((tratamiento, index) => (index === indexFind ? { ...tratamiento, ...newEntryTratamientos } : tratamiento))
      );
    } else {
      setTratamientosFiltros((prev) => {
        return [...prev, newEntryTratamientos];
      });
    }

    setIsLeftEyeTratamientos(!isLeftEyeTratamientos);
  };



  const handleSubmit = async (values) => {
    const serviciosRealizadosSubmit = serviciosRealizados.map(servicio => servicio.label);
    const materialesSeleccionadosSubmit = materialesSeleccionados.map(servicio => servicio.label)
    const tratamientosFiltrosSubmit = tratamientosFiltros.map(servicio => servicio.label)
    const transformedValues = {
      ...values,
      ...(serviciosRealizadosSubmit.length === 1
        ? (!isLeftEye
          ? { tipo_cristal_oi: serviciosRealizadosSubmit[0] }
          : { tipo_cristal_od: serviciosRealizadosSubmit[0] }
        )
        : serviciosRealizadosSubmit.length === 2
          ? isLeftEye
            ? {
              tipo_cristal_oi: serviciosRealizadosSubmit[0],
              tipo_cristal_od: serviciosRealizadosSubmit[1]
            }
            : {
              tipo_cristal_od: serviciosRealizadosSubmit[0],
              tipo_cristal_oi: serviciosRealizadosSubmit[1]
            }
          : {}
      ),

      ...(materialesSeleccionadosSubmit.length === 1
        ? (!isLeftEyeMaterial
          ? { material_oi: materialesSeleccionadosSubmit[0] }
          : { material_od: materialesSeleccionadosSubmit[0] }
        )
        : materialesSeleccionadosSubmit.length === 2
          ? isLeftEyeMaterial
            ? {
              material_oi: materialesSeleccionadosSubmit[0],
              material_od: materialesSeleccionadosSubmit[1]
            }
            : {
              material_od: materialesSeleccionadosSubmit[0],
              material_oi: materialesSeleccionadosSubmit[1]
            }
          : {}
      ),

      ...(tratamientosFiltrosSubmit.length === 1
        ? (!isLeftEyeTratamientos
          ? { tratamientos_oi: tratamientosFiltrosSubmit[0] }
          : { tratamientos_od: tratamientosFiltrosSubmit[0] }
        )
        : tratamientosFiltrosSubmit.length === 2
          ? isLeftEyeTratamientos
            ? {
              tratamientos_oi: tratamientosFiltrosSubmit[0],
              tratamientos_od: tratamientosFiltrosSubmit[1]
            }
            : {
              tratamientos_od: tratamientosFiltrosSubmit[0],
              tratamientos_oi: tratamientosFiltrosSubmit[1]
            }
          : {}
      ),
      aro_centevi: aroCentevi ? 1 : 0,
      aro_propio: aroCentevi ? 0 : 1,
      ...(isRowVisible ? { tipo_aro: tipoAro } : {}),
      doctor: doctorSeleccionado,
      elaborado_por: usuario?.usuario?.id_usuario,
      lente_contacto: lenteContacto,
    };
    console.log('transformedValues:', transformedValues);
    const result = await dispatch(createCorrecionesOrdenes(transformedValues));

    console.log('result:', result)

    if (result) {
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
        text: 'Hubo un problema al crear la receta. Por favor, intenta de nuevo. Nro de Orden ya existente',
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
                          initialValues={{ ...initialValues, isRowVisible: isAroVisible }}
                          validationSchema={validationSchema}
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
                                    src="img/centevi.png"
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
                                      {moment().format('YYYY-MM-DD')}
                                    </b>
                                  </p>
                                </div>
                                <div className="form-group col-md-4" >
                                  <label htmlFor="pacientes">Orden*</label>
                                  <Select
                                    showSearch
                                    value={ordenes_options_selecteds.length > 0 ? selectedOrden : undefined}
                                    onChange={(value) => {
                                      console.log('value:', value)
                                      setSelectedOrden(value); // Actualizar el estado con el paciente seleccionado
                                      setFieldValue("nro_orden_id", value); // También actualizar el campo de Formik
                                    }}
                                    placeholder="Seleccione el orden"
                                    loading={ordenes_options_selecteds.length === 0}
                                    filterOption={(input, option) => {
                                      const searchTerms = input.toLowerCase().split(' ');
                                      return searchTerms.every(term =>
                                        (option?.label ?? '').toLowerCase().includes(term)
                                      );
                                    }}
                                    options={ordenes_options_selecteds}
                                    style={{
                                      width: "100%",
                                      height: "48px",
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  />

                                  <ErrorMessage name="ordenes_id" component="div" className="text-danger" />

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
                                              color: 'white!important',
                                            }}
                                          >
                                            RX
                                          </th>
                                          <th
                                            className="text-center"
                                            style={{
                                              color: 'white!important',
                                              width: "130px"
                                            }}
                                          >
                                            Esfera
                                          </th>
                                          <th
                                            style={{
                                              color: 'white!important',
                                              width: "130px"
                                            }}
                                          >
                                            Cilindro
                                          </th>
                                          <th
                                            style={{
                                              color: 'white!important',
                                              width: "130px"
                                            }}
                                          >
                                            Eje
                                          </th>
                                          <th
                                            style={{
                                              color: 'white!important',
                                              width: "130px"
                                            }}
                                          >
                                            ADD
                                          </th>
                                          <th
                                            style={{
                                              color: 'white!important',
                                              // width: '175px'
                                            }}
                                          >
                                            {isAroVisible ? 'PRISMA' : 'Tipo de lente de contacto'}
                                          </th>
                                          <th
                                            style={{
                                              color: 'white!important',
                                              width: "130px"
                                            }}
                                          >
                                            {isAroVisible ? 'DISTANCIA PUPILAR' : 'Curva Base'}
                                          </th>
                                          <th
                                            style={{
                                              color: 'white!important',
                                              width: "130px"
                                            }}
                                          >
                                            {isAroVisible ? 'ALTURA' : 'Diametro'}
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
                                              name="esfera_od"
                                              as="input"
                                              style={{
                                                width: isAroVisible ? '90px' : '120px',
                                              }}
                                            />
                                          </td>
                                          <td>
                                            <Field
                                              className="form-control"
                                              name="cilindro_od"

                                              as="input"
                                            />
                                          </td>
                                          <td>
                                            <Field
                                              className="form-control"
                                              name="eje_od"

                                              as="input"
                                            />
                                          </td>
                                          <td>
                                            <Field
                                              className="form-control"
                                              name="add_od"

                                              as="input"
                                            />
                                          </td>
                                          <td>
                                            <Field
                                              className="form-control"
                                              name="prisma_od"
                                              as="input"
                                            />
                                          </td>
                                          <td                                         >
                                            <Field
                                              className="form-control"
                                              name="distancia_od"
                                              as="input"
                                            // style={{
                                            //   width: isAroVisible ? '90px' : '120px',
                                            // }}
                                            />
                                          </td>
                                          <td>
                                            <Field
                                              className="form-control"
                                              name="altura_od"
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
                                              name="esfera_oi"
                                              as="input"
                                              style={{
                                                width: isAroVisible ? '90px' : '120px',
                                              }}
                                            />
                                          </td>
                                          <td>
                                            <Field
                                              className="form-control"
                                              name="cilindro_oi"

                                              as="input"
                                            />
                                          </td>
                                          <td>
                                            <Field
                                              className="form-control"
                                              name="eje_oi"

                                              as="input"
                                            />
                                          </td>
                                          <td>
                                            <Field
                                              className="form-control"
                                              name="add_oi"

                                              as="input"
                                            />
                                          </td>
                                          <td>
                                            <Field
                                              className="form-control"
                                              type="text"
                                              name="prisma_oi"
                                              as="input"
                                            />
                                          </td>
                                          {isRowVisible ? (
                                            <td></td>
                                          ) : (
                                            <td>
                                              <Field
                                                className="form-control"
                                                type="text"
                                                name="distancia_oi"
                                                as="input"
                                              />
                                            </td>
                                          )}
                                          <td>
                                            <Field
                                              className="form-control"
                                              name="altura_oi"

                                              as="input"
                                            />
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>

                              {
                                isRowVisible && (
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
                                          <span style={{ fontSize: '13px', color: 'gray', marginLeft: '10px' }}>
                                            <b>(Click al ojo para cambiar de derecho a izquierdo)</b>
                                            <EyeOutlined style={{
                                              cursor: 'pointer',
                                              color: isLeftEye ? 'blue' : '#067231',
                                              marginLeft: '10px'
                                            }} />
                                          </span>
                                        </div>
                                      </Col>
                                      <Col xxl={8} xl={8} md={8}>
                                        <h6
                                          className="text-center p-2"
                                          onClick={toggleEye}
                                          style={{
                                            cursor: 'pointer',
                                            color: isLeftEye ? 'blue' : '#067231',
                                          }}
                                        >
                                          {isLeftEye ? <EyeOutlined style={{ marginRight: '8px' }} /> : null}
                                          TIPO DE CRISTAL {isLeftEye ? "OJO IZQUIERDO" : "OJO DERECHO"}
                                          {!isLeftEye ? <EyeOutlined style={{ marginLeft: '8px' }} /> : null}
                                        </h6>

                                        <Select
                                          showSearch
                                          value={null}
                                          style={{
                                            width: '100%', color: 'transparent',
                                            background: 'white !important'
                                          }}
                                          optionFilterProp="label"
                                          onChange={handleSelectChange}
                                          options={cristales_options_selecteds.map(servicio => ({
                                            value: servicio.value,
                                            label: servicio.label
                                          }))}
                                        >
                                        </Select>
                                        <div
                                          style={{
                                            // display: 'ruby',
                                            marginTop: '10px',
                                            marginBottom: '10px'
                                          }}
                                          onClick={() => {
                                          }}
                                        >
                                          {
                                            serviciosRealizados.map((servicio, index) => {
                                              return (
                                                <>
                                                  <div
                                                    style={index !== 0 ? { marginTop: '10px', color: 'black' } : { color: 'black' }}
                                                  >
                                                    {servicio.ojo ? servicio.ojo : ""}  {servicio.servicio ? servicio.servicio : ""} :

                                                  </div>
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
                                                      // display: 'flex',
                                                      display: 'table-cell',
                                                      marginRight: '5px',
                                                      marginTop: '5px'
                                                    }}
                                                  >
                                                    {servicio.label}
                                                    <span
                                                      style={{
                                                        marginLeft: '5px',
                                                        cursor: 'pointer'
                                                      }}
                                                      onClick={() => {
                                                        // setServiciosRealizados([...serviciosRealizados.filter(serv => serv.value !== servicio.value)])
                                                        setServiciosRealizados([])
                                                      }}
                                                    >
                                                      <CloseCircleTwoTone twoToneColor="#eb2f96" />
                                                    </span>
                                                  </div>
                                                </>
                                              )
                                            })
                                          }

                                        </div>
                                      </Col>
                                      <Col xxl={8} xl={8} md={8}>
                                        <h6
                                          className="text-center p-2"
                                          onClick={toggleEyeMaterial}
                                          style={{
                                            cursor: 'pointer',
                                            color: isLeftEyeMaterial ? 'blue' : '#067231',
                                          }}
                                        >
                                          {isLeftEyeMaterial ? <EyeOutlined style={{ marginRight: '8px' }} /> : null}
                                          MATERIAL {isLeftEyeMaterial ? "OJO IZQUIERDO " : "OJO DERECHO"}
                                          {!isLeftEyeMaterial ? <EyeOutlined style={{ marginLeft: '8px' }} /> : null}
                                        </h6>

                                        <Select
                                          showSearch
                                          value={null}
                                          style={{
                                            width: '100%', color: 'transparent',
                                            background: 'white !important'
                                          }}
                                          optionFilterProp="label"
                                          onChange={handleSelectChangeMaterial}
                                          options={materiales_options_selecteds.map(servicio => ({
                                            value: servicio.value,
                                            label: servicio.label
                                          }))}
                                        >
                                        </Select>
                                        <div
                                          style={{
                                            // display: 'ruby',
                                            marginTop: '10px',
                                            marginBottom: '10px'
                                          }}
                                          onClick={() => {
                                          }}
                                        >
                                          {
                                            materialesSeleccionados.map((servicio, index) => {
                                              return (
                                                <>
                                                  <div
                                                    style={index !== 0 ? { marginTop: '10px', color: 'black' } : { color: 'black' }}
                                                  >
                                                    {servicio.ojo ? servicio.ojo : ""}  {servicio.servicio ? servicio.servicio : ""} :
                                                  </div>
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
                                                      // display: 'flex',
                                                      display: 'table-cell',
                                                      marginRight: '5px',
                                                      marginTop: '5px'
                                                    }}
                                                  >
                                                    {servicio.label}
                                                    <span
                                                      style={{
                                                        marginLeft: '5px',
                                                        cursor: 'pointer'
                                                      }}
                                                      onClick={() => {
                                                        // setMaterialesSeleccionados([...materialesSeleccionados.filter(serv => serv.value !== servicio.value)])
                                                        setMaterialesSeleccionados([])
                                                      }}
                                                    >
                                                      <CloseCircleTwoTone twoToneColor="#eb2f96" />
                                                    </span>
                                                  </div>
                                                </>
                                              )
                                            })
                                          }

                                        </div>
                                      </Col>
                                      <Col xxl={8} xl={8} md={8}>
                                        <h6
                                          className="text-center p-2"
                                          onClick={toggleEyeTratamientos}
                                          style={{
                                            cursor: 'pointer',
                                            color: isLeftEyeTratamientos ? 'blue' : '#067231',
                                          }}
                                        >
                                          {isLeftEyeTratamientos ? <EyeOutlined style={{ marginRight: '8px' }} /> : null}
                                          TRATAMIENTOS Y FILTROS {isLeftEyeTratamientos ? "OJO IZQUIERDO" : "OJO DERECHO"}
                                          {!isLeftEyeTratamientos ? <EyeOutlined style={{ marginLeft: '8px' }} /> : null}
                                        </h6>
                                        <Select
                                          showSearch
                                          value={null}
                                          style={{
                                            width: '100%', color: 'transparent',
                                            background: 'white !important'
                                          }}
                                          optionFilterProp="label"
                                          onChange={handleSelectChangeTratamientos}
                                          options={tratamientos_options_selecteds.map(servicio => ({
                                            value: servicio.value,
                                            label: servicio.label
                                          }))}
                                        >
                                        </Select>
                                        <div
                                          style={{
                                            // display: 'ruby',
                                            marginTop: '10px',
                                            marginBottom: '10px'
                                          }}
                                          onClick={() => {
                                          }}
                                        >
                                          {
                                            tratamientosFiltros.map((servicio, index) => {
                                              return (
                                                <>
                                                  <div
                                                    style={index !== 0 ? { marginTop: '10px', color: 'black' } : { color: 'black' }}
                                                  >
                                                    {servicio.ojo ? servicio.ojo : ""}  {servicio.servicio ? servicio.servicio : ""} :
                                                  </div>
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
                                                      // display: 'flex',
                                                      display: 'table-cell',
                                                      marginRight: '5px',
                                                      marginTop: '5px'
                                                    }}
                                                  >
                                                    {servicio.label}
                                                    <span
                                                      style={{
                                                        marginLeft: '5px',
                                                        cursor: 'pointer'
                                                      }}
                                                      onClick={() => {
                                                        // setTratamientosFiltros([...tratamientosFiltros.filter(serv => serv.value !== servicio.value)])
                                                        setTratamientosFiltros([])
                                                      }}
                                                    >
                                                      <CloseCircleTwoTone twoToneColor="#eb2f96" />
                                                    </span>
                                                  </div>
                                                </>
                                              )
                                            })
                                          }

                                        </div>
                                      </Col>
                                    </Row>


                                  </div>
                                )
                              }
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
                                      // alignContent: 'center'
                                    }}
                                  >
                                    <Row
                                      gutter={[16, 16]}
                                    >
                                      <Col xxl={24} xl={24} md={24}>
                                        <div
                                          style={{
                                            fontSize: '20px',
                                            color: 'black',
                                            marginTop: '40px'
                                          }}
                                        >
                                          Caracteristicas de Aro
                                        </div>
                                      </Col>

                                      {isAroVisible && (
                                        <Col xxl={5} xl={5} md={5}>
                                          <div>
                                            <label className="new-control new-radio radio-classic-primary">
                                              <b>ARO CENTEVI</b>
                                              <Field
                                                className="new-control-input"
                                                checked={aroCentevi}
                                                type="radio"
                                                name="aro_centevi"
                                                onChange={() => {
                                                  setAroCentevi(true)
                                                }
                                                }
                                              />
                                              <span className="new-control-indicator" />
                                            </label>
                                          </div>
                                        </Col>
                                      )}
                                      {isAroVisible && (
                                        <Col xxl={5} xl={5} md={5}>
                                          <div>
                                            <label className="new-control new-radio radio-classic-primary">
                                              <b>ARO PROPIO</b>
                                              <Field
                                                className="new-control-input"
                                                checked={!aroCentevi}
                                                type="radio"
                                                onChange={() => setAroCentevi(false)}
                                              />
                                              <span className="new-control-indicator" />
                                            </label>
                                          </div>
                                        </Col>
                                      )}
                                      {isAroVisible && (
                                        <Col xxl={5} xl={5} md={5}>
                                          <div
                                            style={{
                                              // display: 'flex'
                                            }}
                                          >
                                            <div style={{ marginTop: '-15px' }}>
                                              <b>CÓDIGO</b>
                                            </div>
                                            <Field
                                              className="form-control"
                                              name="codigo"
                                              style={{
                                                marginLeft: '0px', height: '30px',
                                                width: '100%'
                                              }}
                                              as="input"
                                              disabled={!aroCentevi}
                                            />
                                          </div>
                                        </Col>
                                      )}

                                      <Col xxl={isRowVisible ? 9 : 12} xl={isRowVisible ? 9 : 12} md={isRowVisible ? 9 : 12}>
                                        {isAroVisible && (
                                          <div
                                            style={{
                                              // display: 'flex'
                                            }}
                                          >
                                            <div style={{ marginTop: '-68px' }}>
                                              <b>COLOR*</b>
                                            </div>
                                            <Field
                                              className="form-control"
                                              name="color"
                                              style={{
                                                marginLeft: '0px', height: '30px'
                                              }}
                                            />
                                          </div>
                                        )}
                                        <div style={{}}>
                                          <div style={{ marginTop: '1px' }}>
                                            <b>MARCA</b>
                                          </div>
                                          {isAroVisible ? (
                                            <Field
                                              className="form-control"
                                              name="marca"
                                              style={{ marginLeft: '0px', height: '30px', display: 'block' }}
                                            />
                                          ) : (
                                            <Select
                                              name="marca"
                                              placeholder="Selecciona la marca"
                                              value={selectedMarca}
                                              showSearch
                                              style={{
                                                width: "100%",
                                                height: "48px",
                                                color: "black",
                                                fontWeight: "bold",
                                              }}
                                              onChange={(value) => {
                                                console.log('value:', value)
                                                setSelectedMarca(value); // Actualizar el estado con el paciente seleccionado
                                                setFieldValue("marca", value); // También actualizar el campo de Formik
                                              }}
                                              filterOption={(input, option) =>
                                                option.label.toLowerCase().includes(input.toLowerCase())
                                              }
                                              options={[
                                                { value: 'L001 | Acuvue 2', label: 'L001 | Acuvue 2' },
                                                { value: 'L002 | Acuvue Oasys Esferico ', label: 'L002 | Acuvue Oasys Esferico ' },
                                                { value: 'L003 | Acuvue Oasys Astigmatismo', label: 'L003 | Acuvue Oasys Astigmatismo' },
                                                { value: 'L004 | Acuvue Oasys Presbicia', label: 'L004 | Acuvue Oasys Presbicia' },
                                                { value: 'L005 | One Day Moist Desechables Diarios Caja 30 unidades', label: 'L005 | One Day Moist Desechables Diarios Caja 30 unidades' },
                                                { value: 'L006 | One Day Moist Desechables Diarios Caja 90 unidades', label: 'L006 | One Day Moist Desechables Diarios Caja 90 unidades' },
                                                { value: 'L007 | One Day Moist Desechables Diarios Astigmatismo Caja 30 unidades', label: 'L007 | One Day Moist Desechables Diarios Astigmatismo Caja 30 unidades' },
                                                { value: 'L008 | Oasys One Day Desechables Diarios (Hydraluxe) Caja 30 unidades ', label: 'L008 | Oasys One Day Desechables Diarios (Hydraluxe) Caja 30 unidades ' },
                                                { value: 'L009 | Oasys One Day Desechables Diario (Hydraluxe) Caja 90 unidades', label: 'L009 | Oasys One Day Desechables Diario (Hydraluxe) Caja 90 unidades' },
                                                { value: 'L010 | Soflens 38 Esférico CB: 8.7 Dia. 14.00 (Rango: -9.00 a +4.00)', label: 'L010 | Soflens 38 Esférico CB: 8.7 Dia. 14.00 (Rango: -9.00 a +4.00)' },
                                                { value: 'L011 | Soflens 59 Esferico CB: 8.6 Dia: 14.2 (Rango: -9.00 a +6.00)', label: 'L011 | Soflens 59 Esferico CB: 8.6 Dia: 14.2 (Rango: -9.00 a +6.00)' },
                                                { value: 'L012 | Lunare Lentes de Contacto Cosmético (Sin Receta 2 unidades)', label: 'L012 | Lunare Lentes de Contacto Cosmético (Sin Receta 2 unidades)' },
                                                { value: 'L013 | Lunare Lentes de Contacto Cosmético (Con Receta 1 unidad) Receta: Plano hasta -6.00', label: 'L013 | Lunare Lentes de Contacto Cosmético (Con Receta 1 unidad) Receta: Plano hasta -6.00' },
                                                { value: 'L014 | Soflens Torico CB: 8.5 Dia: 14.5 (Rango: -9.00 a +6.00) (Cyl: hasta 2.75)', label: 'L014 | Soflens Torico CB: 8.5 Dia: 14.5 (Rango: -9.00 a +6.00) (Cyl: hasta 2.75)' },
                                                { value: 'L015 | Purevision 2 Esferico  (HiSi) CB: 8.6 Dia: 14.0 (Rango: -12.00 a +6.00)', label: 'L015 | Purevision 2 Esferico  (HiSi) CB: 8.6 Dia: 14.0 (Rango: -12.00 a +6.00)' },
                                                { value: 'L016 | Purevision 2 Torico (HiSi) CB: 8.9 (Rango: -9.00 a +6.00) (Cyl: hasta 2.25)', label: 'L016 | Purevision 2 Torico (HiSi) CB: 8.9 (Rango: -9.00 a +6.00) (Cyl: hasta 2.25)' },
                                                { value: 'L017 | Purevision Multifocal CB: 8.6 Dia: 14.0 (Rango: -10.00 a +6.00) Low/High', label: 'L017 | Purevision Multifocal CB: 8.6 Dia: 14.0 (Rango: -10.00 a +6.00) Low/High' },
                                                { value: 'L018 | Freshlook Cosmético (Rango: -8.00 a +6.00)', label: 'L018 | Freshlook Cosmético (Rango: -8.00 a +6.00)' },
                                                { value: 'L019 | Air Optix Colors (HiSi) (Rango: -8.00 a +6.00)', label: 'L019 | Air Optix Colors (HiSi) (Rango: -8.00 a +6.00)' },
                                                { value: 'L020 | Air Optix Hydraglyde Esférico (Rango: -12.00 a +8.00)', label: 'L020 | Air Optix Hydraglyde Esférico (Rango: -12.00 a +8.00)' },
                                                { value: 'L021 | Air Optix Astigmatismo (Rango: -10.00 a +6.00) (Cyl hasta -2.25)', label: 'L021 | Air Optix Astigmatismo (Rango: -10.00 a +6.00) (Cyl hasta -2.25)' },
                                                { value: 'L022 | Air Optix Multifocal (Rango: -10.00 a +6.00) Low, Med, High', label: 'L022 | Air Optix Multifocal (Rango: -10.00 a +6.00) Low, Med, High' },
                                                { value: 'L023 | Avaira Vitality Esferico ', label: 'L023 | Avaira Vitality Esferico ' },
                                                { value: 'L024 | Avaira Vitality Torico CB: 8.5 Dia: 14.5 (Plano a -6.00) (Cyl: hasta 1.75) ', label: 'L024 | Avaira Vitality Torico CB: 8.5 Dia: 14.5 (Plano a -6.00) (Cyl: hasta 1.75) ' },
                                                { value: 'L025 | Biomedics 55 Esferico CB: 8.6/8.9 Dia: 14.2 (-0.25 a -10.00)  CB:8.8 Dia. 14.2 (+0.25 a +6.00)', label: 'L025 | Biomedics 55 Esferico CB: 8.6/8.9 Dia: 14.2 (-0.25 a -10.00)  CB:8.8 Dia. 14.2 (+0.25 a +6.00)' },
                                                { value: 'L026 | Biomedics Torico CB: 8.7 Dia: 14.5 (+6.00 a -9.00) (Cyl hasta 2.25)', label: 'L026 | Biomedics Torico CB: 8.7 Dia: 14.5 (+6.00 a -9.00) (Cyl hasta 2.25)' },
                                                { value: 'L027 | Biofinity Sphere CB: 8.6 Dia: 14.0 ', label: 'L027 | Biofinity Sphere CB: 8.6 Dia: 14.0 ' },
                                                { value: 'L028 | Biofinity Torico CB: 8.7 Dia: 14.5 (+8.00 a -10.00) (Cyl: hasta 2.25)', label: 'L028 | Biofinity Torico CB: 8.7 Dia: 14.5 (+8.00 a -10.00) (Cyl: hasta 2.25)' },
                                                { value: 'L029 | Biofinity Torico XR CB: 8.7 Dia: 14.5(+10.00 a -10.00) (Cyl: 2.75 a 5.75)', label: 'L029 | Biofinity Torico XR CB: 8.7 Dia: 14.5(+10.00 a -10.00) (Cyl: 2.75 a 5.75)' },
                                                { value: 'L030 | Biofinity Multifocal CB: 8.6 Dia: 14.0 (+6.00 a -8.00) Add: +1.00 a +2.50', label: 'L030 | Biofinity Multifocal CB: 8.6 Dia: 14.0 (+6.00 a -8.00) Add: +1.00 a +2.50' },
                                                { value: 'L031 | Proclear Sphere CB: 8.6 Dia: 14.2 (+20.00 a -20.00)', label: 'L031 | Proclear Sphere CB: 8.6 Dia: 14.2 (+20.00 a -20.00)' },
                                                { value: 'L032 | Proclear Torico CB: 8.8/8.4 Dia: 14.4 (+6.00 a -8.00) (Cyl: hasta -2.25)', label: 'L032 | Proclear Torico CB: 8.8/8.4 Dia: 14.4 (+6.00 a -8.00) (Cyl: hasta -2.25)' },
                                                { value: 'L033 | Proclear Torico XR CB: 8.8/8.4 Dia: 14.4 (+10.00 a -10.00) (Cyl: 2.75 a 5.75)', label: 'L033 | Proclear Torico XR CB: 8.8/8.4 Dia: 14.4 (+10.00 a -10.00) (Cyl: 2.75 a 5.75)' },
                                                { value: 'L034 | Proclear Multifocal CB: 8.7 Dia: 14.4 (+6.00 a -8.00) Add: +1.00 a +2.50', label: 'L034 | Proclear Multifocal CB: 8.7 Dia: 14.4 (+6.00 a -8.00) Add: +1.00 a +2.50' },
                                                { value: 'L035 | Proclear Multifocal XR CB: 8.7 Dia: 14.4 (+20.00 a -20.00) Add: +3.00 a +4.00', label: 'L035 | Proclear Multifocal XR CB: 8.7 Dia: 14.4 (+20.00 a -20.00) Add: +3.00 a +4.00' },
                                                { value: 'L036 | Proclear Multifocal Torico CB: 8.8/8.4 Dia: 14.4 (+20.00 a -20.00) (Cyl: hasta 5.75)  Add: +1.00 a +4.00', label: 'L036 | Proclear Multifocal Torico CB: 8.8/8.4 Dia: 14.4 (+20.00 a -20.00) (Cyl: hasta 5.75)  Add: +1.00 a +4.00' },
                                                { value: 'L037 | Reemplazo Anual Hydrasoft Sphere (CB: 8.3/8.6 Dia:14.2) (CB: 8.9/9.2 Dia:15.00) (+10.00 a -30.00)', label: 'L037 | Reemplazo Anual Hydrasoft Sphere (CB: 8.3/8.6 Dia:14.2) (CB: 8.9/9.2 Dia:15.00) (+10.00 a -30.00)' },
                                                { value: 'L038 | Reemplazo Anual Hydrasoft Aphakic (CB: 8.3/8.6 Dia:14.2) (CB: 8.9/9.2 Dia:15.00) (+10.25 a +30.00)', label: 'L038 | Reemplazo Anual Hydrasoft Aphakic (CB: 8.3/8.6 Dia:14.2) (CB: 8.9/9.2 Dia:15.00) (+10.25 a +30.00)' },
                                                { value: 'L039 | Reemplazo Anual Hydrasoft Toric (CB: 8.3/8.6 Dia:14.2) (CB: 8.9/9.2 Dia:15.00) (+30.00 a -30.00) (Cyl: -0.50 a -10.00)', label: 'L039 | Reemplazo Anual Hydrasoft Toric (CB: 8.3/8.6 Dia:14.2) (CB: 8.9/9.2 Dia:15.00) (+30.00 a -30.00) (Cyl: -0.50 a -10.00)' },
                                                { value: 'L040 | Biofinity Sphere XR CB: 8.6 Dia: 14.00', label: 'L040 | Biofinity Sphere XR CB: 8.6 Dia: 14.00' },
                                              ]}
                                            />
                                          )}
                                        </div>
                                      </Col>

                                      <Col xxl={24} xl={24} md={24}>
                                        <Row
                                          gutter={[16, 16]}
                                        >
                                          <Col xxl={12} xl={12} md={12}>
                                            <Row>

                                              {isAroVisible && (
                                                <Col xxl={24} xl={24} md={24}>
                                                  <div
                                                    style={{
                                                      // display: 'flex'
                                                      marginBottom: '10px'
                                                    }}
                                                  >


                                                    {/* <Input /> */}
                                                    <b>TIPO DE ARO*:</b>
                                                    <Select
                                                      showSearch
                                                      placeholder="Selecciona el tipo de aro"
                                                      value={tipoAro}
                                                      options={tipoAroOptions}
                                                      style={{
                                                        width: "100%",
                                                        height: "40px",
                                                        color: "black",
                                                        fontWeight: "bold",
                                                      }}
                                                      onChange={(value) => {
                                                        const selectedOption = tipoAroOptions.find(option => option.value === value);
                                                        if (selectedOption) {
                                                          setTipoAro(selectedOption.label);
                                                          setFieldValue("tipo_aro", selectedOption.label);
                                                        }
                                                      }}
                                                      filterOption={(input, option) =>
                                                        option.label.toLowerCase().includes(input.toLowerCase())
                                                      }
                                                    />
                                                    <ErrorMessage name="tipo_aro" component="div" className="text-danger" />
                                                  </div>
                                                </Col>
                                              )}
                                              <Col xxl={24} xl={24} md={24}>
                                                <div
                                                >
                                                  <b>DOCTOR*:</b>
                                                  <Select
                                                    showSearch
                                                    placeholder="Seleccione el doctor"
                                                    value={doctorSeleccionado}
                                                    options={usuarios_doctores_options_selecteds}
                                                    style={{
                                                      width: "100%",
                                                      height: "48px",
                                                      color: "black",
                                                      fontWeight: "bold",
                                                    }}
                                                    onChange={(value) => {
                                                      const selectedOption = usuarios_doctores_options_selecteds.find(option => option.value === value);
                                                      if (selectedOption) {
                                                        setDoctorSeleccionado(selectedOption.label);
                                                        setFieldValue("doctor", selectedOption.label)
                                                      }
                                                    }}
                                                    filterOption={(input, option) =>
                                                      option.label.toLowerCase().includes(input.toLowerCase())
                                                    }
                                                  />
                                                  <ErrorMessage name="doctor" component="div" className="text-danger" />
                                                </div>
                                              </Col>

                                              <Col xxl={24} xl={24} md={24}>
                                                <div
                                                  style={{
                                                    marginTop: '10px'
                                                  }}
                                                >
                                                  <b>ELABORADO POR</b>
                                                  <Input
                                                    value={usuario?.usuario?.nombre}
                                                    disabled />
                                                </div>
                                              </Col>
                                            </Row>
                                          </Col>

                                          <Col xxl={12} xl={12} md={12}>
                                            <b>OBSERVACIONES</b>
                                            <Field
                                              as={TextArea}
                                              className="form-control"
                                              name='observaciones'
                                              style={{
                                                height: '180px'
                                              }}
                                              rows="5"
                                            />
                                          </Col>
                                        </Row>
                                      </Col>
                                    </Row>
                                  </Col>
                                  {isImageVisible && (
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
                                          // alignContent: "center",
                                        }}
                                      >
                                        <img
                                          src="assets/img/recetas/lentessinbarilla.png"
                                          style={{
                                            width: "120%",
                                            // height: "80px"
                                          }}
                                        />
                                        <div
                                          style={{
                                            position: 'absolute',
                                            top: '208px',
                                            width: '70px',
                                            border: '1px solid red',
                                            left: '29px'
                                          }}
                                        >
                                          <Field
                                            name='l_uno'
                                            style={{
                                              width: '68px'
                                            }}
                                          />
                                        </div>


                                        <div
                                          style={{
                                            position: 'absolute',
                                            top: '128px',
                                            width: '70px',
                                            border: '1px solid red',
                                            left: '147px'
                                          }}
                                        >
                                          <Field
                                            name='l_dos'
                                            style={{
                                              width: '68px'
                                            }}
                                          />
                                        </div>

                                        <div
                                          style={{
                                            position: 'absolute',
                                            top: '169px',
                                            width: '70px',
                                            border: '1px solid red',
                                            left: '261px'
                                          }}
                                        >
                                          <Field
                                            name='l_tres'
                                            style={{
                                              width: '68px'
                                            }}
                                          />
                                        </div>

                                        <div
                                          style={{
                                            position: 'absolute',
                                            top: '288px',
                                            width: '70px',
                                            border: '1px solid red',
                                            left: '155px'
                                          }}
                                        >
                                          <Field
                                            name='l_cuatro'
                                            style={{
                                              width: '68px'
                                            }}
                                          />
                                        </div>

                                        <div
                                          style={{
                                            position: 'absolute',
                                            top: '205px',
                                            width: '70px',
                                            border: '1px solid red',
                                            left: '374px'
                                          }}
                                        >
                                          <Field
                                            name='l_cinco'
                                            style={{
                                              width: '68px'
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </Col>
                                  )}
                                </Row>
                              </div>
                              {/*  */}
                              <button
                                className="btn btn-success mt-3"
                                type="submit"
                              >
                                Crear Corrección
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

export default CreateCorrecionOrden