import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { createOrdenes } from '../../redux/features/ordenes/ordenesSlice';
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
import { fetchCristales } from '../../redux/features/cristales/cristalesSlice';
import { fetchMateriales } from '../../redux/features/materiales/materialesSlice';
import { fetchTratamientos } from '../../redux/features/tratamientos/tratamientosSlice';
import { fetchMarcas } from '../../redux/features/marcas/marcasSlice';
import { fetchTiposAros } from '../../redux/features/tipos-aros/tiposArosSlice';

const CreateOrden = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const refButtonForm = useRef();

  const { id } = location.state || {};
  const parsedId = Number.isNaN(Number(id)) ? null : Number(id);
  const { pacientes_options_selecteds, pacientes } = useSelector((state) => state.pacientes);
  const { sucursales } = useSelector((state) => state.sucursales);
  const { usuario } = useSelector((state) => state.auth);
  const { usuarios_doctores_options_selecteds } = useSelector((state) => state.usuarios)
  const { cristales_options_selecteds } = useSelector((state) => state.cristales)
  const { materiales_options_selecteds } = useSelector((state) => state.materiales)
  const { tratamientos_options_selecteds } = useSelector((state) => state.tratamientos)
  const { tipo_aro_options_selecteds } = useSelector((state) => state.tiposAros)
  const { marcas_options_selecteds, marcas_lente_normal_options_selecteds } = useSelector((state) => state.marcas)
  const [selectedPaciente, setSelectedPaciente] = useState(parsedId || null);
  const [selectedMarca, setSelectedMarca] = useState(null);
  const [telefono, setTelefono] = useState('');
  const [cedula, setCedula] = useState('');
  const [lenteContacto, setLenteContacto] = useState(false);
  const [isRowVisible, setIsRowVisible] = useState(true);
  const [isImageVisible, setIsImageVisible] = useState(true);
  const [isAroVisible, setIsAroVisible] = useState(true);
  const { nro_orden_auto } = useSelector((state) => state.ordenes);
  const [serviciosRealizados, setServiciosRealizados] = useState([]);
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState([]);
  const [tratamientosFiltros, setTratamientosFiltros] = useState([]);
  const [aroCentevi, setAroCentevi] = useState(false);
  const [tipoAro, setTipoAro] = useState(null);
  const [doctorSeleccionado, setDoctorSeleccionado] = useState(null)
  const [isLeftEye, setIsLeftEye] = useState(false);
  const [isLeftEyeMaterial, setIsLeftEyeMaterial] = useState(false);
  const [isLeftEyeTratamientos, setIsLeftEyeTratamientos] = useState(false);


  // Dorado : 186.74.2.218
  // San Judas Tadeo: 190.219.45.142
  // Paitilla:  45.229.196.9

  const initialValues = {
    id_paciente: parsedId || "",
    id_sucursal:
      localStorage.getItem('ip') == '186.74.2.218'
        ? "7"
        : localStorage.getItem('ip') == '190.219.45.142'
          ? "3"
          : localStorage.getItem('ip') == '45.229.196.9'
            ? "4"
            : ""
    ,
    esfera_od: "",
    esfera_oi: "",
    cilindro_od: "",
    cilindro_oi: "",
    eje_od: "",
    eje_oi: "",
    add_od: "",
    prisma_od: "",
    prisma_oi: "",
    distancia_od: "",
    distancia_oi: "",
    altura_od: "",
    altura_oi: "",
    tipo_cristal_od: "",
    tipo_cristal_oi: "",
    material_od: "",
    material_oi: "",
    tratamientos_od: "",
    tratamientos_oi: "",
    aro_centevi: "",
    aro_propio: "",
    codigo: "",
    color: "",
    marca: "",
    tipo_aro: isRowVisible ? "" : null,
    observaciones: "",
    doctor: "",
    l_uno: "",
    l_dos: "",
    l_tres: "",
    l_cuatro: "",
    l_cinco: "",
    isRowVisible: isAroVisible,
  };

  const validationSchema = Yup.object().shape({
    id_paciente: Yup.number().nullable()
      .integer("Debe ser un número entero")
      .typeError("Debe ser un número")
      .required("Seleccione un paciente"),
    id_sucursal: Yup.number().nullable()
      .integer("Debe ser un número entero")
      .typeError("Debe ser un número")
      .required("Seleccione un sucursal"),
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
      servicio: isLeftEye ? "OJO IZQUIERDO" : "OJO DERECHO",
      label: option.label,
    };

    if (serviciosRealizados.length < 2) {
      setServiciosRealizados((prev) => [...prev, newEntry]);
      setIsLeftEye(!isLeftEye);
    }
  };

  const handleSelectChangeMaterial = (value, option) => {
    const newEntryMateriales = {
      servicio: isLeftEyeMaterial ? "OJO IZQUIERDO" : "OJO DERECHO",
      label: option.label,
    };

    if (materialesSeleccionados.length < 2) {
      setMaterialesSeleccionados((prev) => [...prev, newEntryMateriales]);
      setIsLeftEyeMaterial(!isLeftEyeMaterial);
    }
  };

  const handleSelectChangeTratamientos = (value, option) => {
    const newEntryTratamientos = {
      servicio: isLeftEyeTratamientos ? "OJO IZQUIERDO" : "OJO DERECHO",
      label: option.label,
    };

    if (tratamientosFiltros.length < 2) {
      setTratamientosFiltros((prev) => [...prev, newEntryTratamientos]);
      setIsLeftEyeTratamientos(!isLeftEyeTratamientos);
    }
  };



  useEffect(() => {
    if (selectedPaciente) {
      const pacienteSeleccionado = pacientes.find(
        (paciente) => paciente.id_paciente === selectedPaciente
      );
      if (pacienteSeleccionado) {
        setTelefono(pacienteSeleccionado.celular || '');
        setCedula(pacienteSeleccionado.nro_cedula || '');
      } else {
        setTelefono('');
        setCedula('');
      }
    } else {
      setTelefono('');
      setCedula('');
    }
  }, [selectedPaciente, pacientes]);


  useEffect(() => {
    dispatch(fetchSucursales({ page: 1, limit: 100 }));
    dispatch(fetchPacientes({ page: 1, limit: 50000 }));
    dispatch(fetchUsuarios({}))
    dispatch(fetchCristales({}))
    dispatch(fetchMateriales({}))
    dispatch(fetchTratamientos({}))
    dispatch(fetchTiposAros({}))
    dispatch(fetchMarcas({}))
  }, []);

  const handleSubmit = async (values) => {
    const serviciosRealizadosSubmit = serviciosRealizados.map(servicio => servicio.label);
    const materialesSeleccionadosSubmit = materialesSeleccionados.map(servicio => servicio.label)
    const tratamientosFiltrosSubmit = tratamientosFiltros.map(servicio => servicio.label)
    const transformedValues = {
      ...values,
      id_paciente: selectedPaciente,
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
    const result = await dispatch(createOrdenes(transformedValues));
    if (result.meta.requestStatus === 'fulfilled') {
      console.log('result:', result);
      Swal.fire({
        icon: 'success',
        title: 'Receta creada',
        html: `La receta se ha creado exitosamente. Número de orden: <b style="font-size: 25px;">${result.payload.data[0].nro_orden_id}</b>`,
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

  const handleLenteContactoChange = () => {
    const newLenteContactoState = !lenteContacto;
    const action = newLenteContactoState ? 'Cambiar a lente contacto' : 'Cambiar a lente normal';
    Swal.fire({
      title: `¿Estás seguro de ${action.toLowerCase()}?`,
      text: `Esto cambiará al modo ${newLenteContactoState ? 'lente de contacto' : 'lente normal'}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Sí, ${action.toLowerCase()}`,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        setIsRowVisible(!isRowVisible);
        setIsImageVisible(!isImageVisible);
        setLenteContacto(newLenteContactoState);
        setIsAroVisible(!isAroVisible);

        if (!isRowVisible) {
          setTipoAro(null);
        }
        Swal.fire(
          `${action.charAt(0).toUpperCase() + action.slice(1)}!`,
          `El valor de lente de contacto ha sido actualizado.`,
          'success'
        );
      }
    });
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

                          {({ setFieldValue, values, isSubmitting }) => (
                            <Form
                            >
                              <div className="form-row" style={{ marginBottom: "2rem" }}>

                                <div className="col-md-4" >
                                  <img
                                    alt="logo"
                                    className="navbar-logo"
                                    src="img/centevi.png"
                                    // src={public_path('img/centevi.png')}
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
                                <div class="col-md-2"  >
                                  <h4>Nro. Orden*</h4>
                                  <Input
                                    name="nro_orden"
                                    placeholder="Ingrese el número de orden"
                                    style={{
                                      color: "red",
                                      fontWeight: "bold",
                                      marginBottom: "1rem",
                                      height: '40px',
                                    }}
                                    disabled
                                  />

                                  <ErrorMessage
                                    name="nro_orden"
                                    component="div"
                                    style={{ color: "red", fontSize: "12px" }}
                                  />
                                </div>
                                <div class="col-md-2">
                                  <h4>Cambiar Tipo de lente</h4>
                                  <div className="d-flex align-items-center">
                                    <button
                                      type="button"
                                      className="btn btn-success"
                                      style={{
                                        height: "40px",
                                        marginTop: "0",
                                      }}
                                      onClick={() => {
                                        handleLenteContactoChange()
                                      }}
                                    >
                                      {lenteContacto ? 'Cambiar a lente normal' : 'Cambiar a lente de contacto'}
                                    </button>
                                  </div>
                                </div>


                                <div className="form-group col-md-4" >
                                  <label htmlFor="pacientes">Pacientes*</label>
                                  <Select
                                    showSearch
                                    value={pacientes_options_selecteds.length > 0 ? selectedPaciente : undefined}
                                    onChange={(value) => {
                                      console.log('value:', value)
                                      setSelectedPaciente(value);
                                      setFieldValue("id_paciente", value);
                                    }}
                                    placeholder="Seleccione el paciente"
                                    loading={pacientes_options_selecteds.length === 0}
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
                                  // onChange={(e) => {
                                  //   // const selectedPaciente = pacientes.find(paciente => paciente.id_paciente === parseInt(e.target.value));
                                  //   // setFieldValue('paciente', e.target.value);
                                  //   // setFieldValue('id_paciente', selectedPaciente ? selectedPaciente.id_paciente : '');
                                  // }}
                                  />

                                  <ErrorMessage name="id_paciente" component="div" className="text-danger" />

                                </div>


                                <div className="form-group col-md-4" >
                                  <label htmlFor="inputSucursal">Sucursal*</label>
                                  <Field
                                    as="select"
                                    name="id_sucursal"
                                    className="form-control"
                                    onChange={(e) => {
                                      const selectedSucursal = sucursales.find(sucursal => sucursal.id_sucursal === parseInt(e.target.value));
                                      setFieldValue('id_sucursal', e.target.value);
                                      setFieldValue('direccion', selectedSucursal ? selectedSucursal.nombre : '');
                                    }}
                                  >
                                    <option value="">Seleccionar sucursal</option>
                                    {sucursales.map((sucursal) => (
                                      <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>{sucursal.nombre}</option>
                                    ))}
                                  </Field>
                                  <ErrorMessage name="id_sucursal" component="div" className="text-danger" />
                                </div>
                                <div className="form-group col-md-2">
                                  <label htmlFor="cedula">
                                    Cedula
                                  </label>
                                  <Input
                                    className="form-control"
                                    name="cedula"
                                    type="text"
                                    value={cedula}
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
                                    Celular
                                  </label>
                                  <Input
                                    className="form-control"
                                    name="telefono"
                                    type="text"
                                    value={telefono}
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
                                                    {servicio.servicio} :
                                                    {/* {
                                                      
                                                  isLeftEye
                                                  ? (index == 1 ? "Ojo Derecho:" : "Ojo Izquierdo:")
                                                  : (index == 0 ? "Ojo Derecho:" : "Ojo Izquierdo:")
                                                } */}

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
                                                    {servicio.servicio} :

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
                                                    {servicio.servicio} :
                                                    {/* {
                                                   isLeftEyeTratamientos
                                                   ? (index == 1 ? "Ojo Derecho:" : "Ojo Izquierdo:")
                                                   : (index == 0 ? "Ojo Derecho:" : "Ojo Izquierdo:")
                                                } */}
                                                    {/* {
                                                  index == 0
                                                    ? "Ojo Derecho:"
                                                    : "Ojo Izquierdo:"
                                                } */}

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
                                )
                              }


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
                                              {/* <Checkbox
                                              className="new-control-input"
                                            >

                                            </Checkbox> */}
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
                                              options={marcas_options_selecteds.map(marca => ({
                                                value: marca.label,
                                                label: marca.label
                                              }))}

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
                                              {/* <Col xxl={12} xl={12} md={12}>
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
                                              </Col> */}
                                              {isAroVisible && (
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
                                                    <b>TIPO DE ARO*:</b>
                                                    <Select
                                                      showSearch
                                                      placeholder="Selecciona el tipo de aro"
                                                      value={tipoAro}
                                                      options={tipo_aro_options_selecteds}
                                                      style={{
                                                        width: "100%",
                                                        height: "40px",
                                                        color: "black",
                                                        fontWeight: "bold",
                                                      }}
                                                      onChange={(value) => {
                                                        const selectedOption = tipo_aro_options_selecteds.find(option => option.value === value);
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
                                style={{ display: 'none' }}
                                ref={refButtonForm}
                              >
                                click
                              </button>
                              <Button
                                className="btn btn-success mt-3"
                                type="submit"
                                loading={isSubmitting}
                                onClick={() => {
                                  console.log("click");
                                  refButtonForm.current.click();
                                  console.log("click");
                                }}
                              >
                                Crear Receta
                              </Button>
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

export default CreateOrden