import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { createOrdenes, updateOrden } from '../../redux/features/ordenes/ordenesSlice';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import { Col, Input, Row, Select, Checkbox, Button } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { CloseCircleTwoTone } from '@ant-design/icons';
import { fetchUsuarios } from '../../redux/features/usuarios/usuariosSlice';
import { useLocation } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment';


const EditOrden = ({ fecha_solicitud }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();
  const { orden } = location.state || {};
  const { pacienteOrden } = location.state || {};
  const { pacientes_options_selecteds, pacientes } = useSelector((state) => state.pacientes);
  const { sucursales_option_selects } = useSelector((state) => state.sucursales);
  const { usuario } = useSelector((state) => state.auth);
  const { usuarios_doctores_options_selecteds } = useSelector((state) => state.usuarios);
  const [selectedPaciente, setSelectedPaciente] = useState(orden?.id_paciente || pacienteOrden?.id_paciente);
  const [selectedSucursal, setSelectedSucursal] = useState(orden?.id_sucursal || pacienteOrden?.id_sucursal);
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('Sr(a) paciente {nombre}, sus lentes estan listos para retirar, puede pasar a retirarlos en la sucursal {sucursal');
  const [cedula, setCedula] = useState('');
  const [isLeftEye, setIsLeftEye] = useState(false);
  const [isLeftEyeMaterial, setIsLeftEyeMaterial] = useState(false);
  const [isLeftEyeTratamientos, setIsLeftEyeTratamientos] = useState(false);
  const [lenteContacto, setLenteContacto] = useState(false);
  const [isRowVisible, setIsRowVisible] = useState(true);
  const [isImageVisible, setIsImageVisible] = useState(true);
  const [isAroVisible, setIsAroVisible] = useState(true);
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [selectedMarca, setSelectedMarca] = useState(orden?.marca || pacienteOrden?.marca);


  useEffect(() => {
    if (orden?.lente_contacto || pacienteOrden?.lente_contacto) {
      setLenteContacto(true);
      setIsRowVisible(false);
      setIsImageVisible(false);
      setIsAroVisible(false);
    }
  }, [orden, pacienteOrden]);

  useEffect(() => {
    const hasRightEye = serviciosRealizados.some(servicio => servicio.ojo === "Ojo Derecho");
    setIsLeftEye(hasRightEye);
  }, [serviciosRealizados]);

  const initialValues = {
    nro_orden: orden?.nro_orden || pacienteOrden?.nro_orden,
    nro_orden_id: orden?.nro_orden_id || pacienteOrden?.nro_orden_id,
    id_paciente: orden?.id_paciente || pacienteOrden?.id_paciente,
    id_sucursal: orden?.id_sucursal || pacienteOrden?.id_sucursal,
    esfera_od: orden?.esfera_od || pacienteOrden?.esfera_od,
    esfera_oi: orden?.esfera_oi || pacienteOrden?.esfera_oi,
    cilindro_od: orden?.cilindro_od || pacienteOrden?.cilindro_od,
    cilindro_oi: orden?.cilindro_oi || pacienteOrden?.cilindro_oi,
    eje_od: orden?.eje_od || pacienteOrden?.eje_od,
    eje_oi: orden?.eje_oi || pacienteOrden?.eje_oi,
    add_od: orden?.add_od || pacienteOrden?.add_od,
    add_oi: orden?.add_oi || pacienteOrden?.add_oi,
    prisma_od: orden?.prisma_od || pacienteOrden?.prisma_od,
    prisma_oi: orden?.prisma_oi || pacienteOrden?.prisma_oi,
    distancia_od: orden?.distancia_od || pacienteOrden?.distancia_od,
    distancia_oi: orden?.distancia_oi || pacienteOrden?.distancia_oi,
    altura_od: orden?.altura_od || pacienteOrden?.altura_od,
    altura_oi: orden?.altura_oi || pacienteOrden?.altura_oi,
    tipo_cristal_od: '',
    tipo_cristal_oi: '',
    material_od: '',
    material_oi: '',
    tratamientos_od: '',
    tratamientos_oi: '',
    aro_centevi: orden?.aro_centevi || pacienteOrden?.aro_centevi,
    aro_propio: orden?.aro_propio || pacienteOrden?.aro_propio,
    codigo: orden?.codigo || pacienteOrden?.codigo,
    color: orden?.color || pacienteOrden?.color,
    marca: orden?.marca || pacienteOrden?.marca,
    tipo_aro: orden?.tipo_aro || pacienteOrden?.tipo_aro,
    observaciones: orden?.observaciones || pacienteOrden?.observaciones,
    doctor: orden?.doctor || pacienteOrden?.doctor,
    l_uno: orden?.l_uno || pacienteOrden?.l_uno,
    l_dos: orden?.l_dos || pacienteOrden?.l_dos,
    l_tres: orden?.l_tres || pacienteOrden?.l_tres,
    l_cuatro: orden?.l_cuatro || pacienteOrden?.l_cuatro,
    l_cinco: orden?.l_cinco || pacienteOrden?.l_cinco,
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
    tipo_aro: Yup.string().when('lente_contacto', {
      is: (lente_contacto) => {
        return lente_contacto;
      },
      then: (schema) => schema.required("Seleccione un tipo de aro"),
      otherwise: (schema) => schema.nullable(),
    }),
    doctor: Yup.string()
      .nullable()
      .required("Seleccione un doctor"),
  });

  const [serviciosRealizados, setServiciosRealizados] = useState([
    orden?.tipo_cristal_od || pacienteOrden?.tipo_cristal_od ? {
      value: orden?.tipo_cristal_od || pacienteOrden?.tipo_cristal_od,
      label: orden?.tipo_cristal_od || pacienteOrden?.tipo_cristal_od,
      ojo: "Ojo Derecho"
    } : null,
    orden?.tipo_cristal_oi || pacienteOrden?.tipo_cristal_oi ? {
      value: orden?.tipo_cristal_oi || pacienteOrden?.tipo_cristal_oi,
      label: orden?.tipo_cristal_oi || pacienteOrden?.tipo_cristal_oi,
      ojo: "Ojo Izquierdo"
    } : null,
  ].filter(Boolean));
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState([
    orden?.material_od || pacienteOrden?.material_od ? {
      value: orden?.material_od || pacienteOrden?.material_od,
      label: orden?.material_od || pacienteOrden?.material_od,
      ojo: "Ojo Derecho"
    } : null,
    orden?.material_oi || pacienteOrden?.material_oi ? {
      value: orden?.material_oi || pacienteOrden?.material_oi,
      label: orden?.material_oi || pacienteOrden?.material_oi,
      ojo: "Ojo Izquierdo"
    } : null,
  ].filter(Boolean));
  const [tratamientosFiltros, setTratamientosFiltros] = useState([
    orden?.tratamientos_od || pacienteOrden?.tratamientos_od ? {
      value: orden?.tratamientos_od || pacienteOrden?.tratamientos_od,
      label: orden?.tratamientos_od || pacienteOrden?.tratamientos_od,
      ojo: "Ojo Derecho"
    } : null,
    orden?.tratamientos_oi || pacienteOrden?.tratamientos_oi ? {
      value: orden?.tratamientos_oi || pacienteOrden?.tratamientos_oi,
      label: orden?.tratamientos_oi || pacienteOrden?.tratamientos_oi,
      ojo: "Ojo Izquierdo"
    } : null,
  ].filter(Boolean));
  const [aroCentevi, setAroCentevi] = useState(false);
  const [tipoAro, setTipoAro] = useState(orden?.tipo_aro || pacienteOrden?.tipo_aro);
  const [doctorSeleccionado, setDoctorSeleccionado] = useState(orden?.doctor || pacienteOrden?.doctor)

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

  useEffect(() => {
    if (orden?.aro_centevi !== undefined || pacienteOrden?.aro_centevi !== undefined) {
      setAroCentevi(orden?.aro_centevi === 1 || pacienteOrden?.aro_centevi === 1);
    }
  }, [orden, pacienteOrden]);

  useEffect(() => {
    if (selectedPaciente) {
      // Buscar el paciente seleccionado en la lista de pacientes
      const pacienteSeleccionado = pacientes.find(
        (paciente) => paciente.id_paciente === selectedPaciente
      );
      if (pacienteSeleccionado) {
        setTelefono(pacienteSeleccionado.celular || '');
        setCedula(pacienteSeleccionado.nro_cedula || '');
        setNombrePaciente(pacienteSeleccionado?.nombres || '');
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
          ? {
            tipo_cristal_oi: serviciosRealizadosSubmit[0],
            tipo_cristal_od: ""
          }
          : {
            tipo_cristal_od: serviciosRealizadosSubmit[0],
            tipo_cristal_oi: ""
          }
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
          ? {
            material_oi: materialesSeleccionadosSubmit[0],
            material_od: ""
          }
          : {
            material_od: materialesSeleccionadosSubmit[0],
            material_oi: ""
          }
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
          ? {
            tratamientos_oi: tratamientosFiltrosSubmit[0],
            tratamientos_od: ""
          }
          : {
            tratamientos_od: tratamientosFiltrosSubmit[0],
            tratamientos_oi: ""
          }
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
    const result = await dispatch(updateOrden({ id_orden: orderId, data: transformedValues }));

    if (result.meta.requestStatus === 'fulfilled') {
      Swal.fire({
        icon: 'success',
        title: 'Orden Actualizada',
        text: 'La orden se ha actualizado exitosamente.',
      }).then(() => {
        navigate(-1);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al actualizar la receta. Por favor, intenta de nuevo. Nro de Orden ya existente',
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
                          initialValues={{ ...initialValues, lente_contacto: lenteContacto }}
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
                                      {fecha_solicitud ? moment(fecha_solicitud).format('DD/MM/YYYY') : ''}
                                    </b>
                                  </p>
                                </div>
                                <div class="col-md-2"  >
                                  <h4>Nro. Orden*</h4>
                                  <Input
                                    name="nro_orden_id"
                                    value={values.nro_orden_id}
                                    onChange={(e) => {
                                      const onlyNumbers = e.target.value.replace(/\D/g, "");
                                      setFieldValue("nro_orden_id", onlyNumbers);
                                    }}
                                    disabled
                                    placeholder="Ingrese el número de orden"
                                    style={{
                                      color: "red",
                                      fontWeight: "bold",
                                      marginBottom: "1rem",
                                      height: '40px',
                                    }}
                                  />
                                  <ErrorMessage
                                    name="nro_orden_id"
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
                                      disabled={true}
                                      onClick={() => {
                                        handleLenteContactoChange()
                                        setIsRowVisible(!isRowVisible);
                                        setFieldValue("isRowVisible", !isRowVisible);
                                      }}
                                    >
                                      {lenteContacto ? ' Cambiar a lente de contacto' : 'Cambiar a lente normal'}
                                    </button>
                                  </div>
                                </div>



                                <div className="form-group col-md-4" >
                                  <label htmlFor="pacientes">Pacientes*</label>
                                  <Select
                                    showSearch
                                    value={selectedPaciente}
                                    onChange={(value) => {
                                      setSelectedPaciente(value); // Actualizar el estado con el paciente seleccionado
                                      setFieldValue("id_paciente", value); // También actualizar el campo de Formik
                                    }}
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
                                  />

                                  <ErrorMessage name="id_paciente" component="div" className="text-danger" />

                                </div>


                                <div className="form-group col-md-4" >
                                  <label htmlFor="sucursales">Sucursal*</label>
                                  <Select
                                    showSearch
                                    value={selectedSucursal}
                                    placeholder="Seleccione una sucursal"
                                    onChange={(value) => {
                                      setSelectedSucursal(value)
                                      setFieldValue('id_sucursal', value);
                                    }}
                                    filterOption={(input, option) => {
                                      const searchTerms = input.toLowerCase().split(' ');
                                      return searchTerms.every(term =>
                                        (option?.label ?? '').toLowerCase().includes(term)
                                      );
                                    }}
                                    options={sucursales_option_selects}
                                    style={{
                                      width: "100%",
                                      height: "48px",
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  />

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
                                              color: 'white!important'
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
                                              placeholder="△"
                                              type="text"
                                              name="prisma_od"
                                              as="input"
                                            />
                                          </td>
                                          <td >
                                            <Field
                                              className="form-control"
                                              name="distancia_od"
                                              as="input"
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
                                              // placeholder="△"
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

                                          options={[
                                            { "id": 1, "codigo": "MP01 | Monofocal Claro Sencillo" },
                                            { "id": 2, "codigo": "MPAR | Monofocal + Antirreflejo" },
                                            { "id": 3, "codigo": "MPL02 | Monofocal + Antirreflejo + Filtro Luz Azul" },
                                            { "id": 4, "codigo": "MCAF1 | Monofocal + Antirreflejo + Fotocromático" },
                                            { "id": 5, "codigo": "MCAF | Monofocal + Antirreflejo + Fotocromático + Filtro Luz Azul" },
                                            { "id": 6, "codigo": "MPT06 | Monofocal + Transitions" },
                                            { "id": 7, "codigo": "MPX07 | Monofocal + Transitions Xtractive" },
                                            { "id": 8, "codigo": "MPP04 | Monofocal Polarizado (Lente de Sol Oscuro)" },
                                            { "id": 9, "codigo": "MPE05 | Monofocal Polarizado con Espejado (Lente de Sol Oscuro)" },
                                            { "id": 10, "codigo": "MTL08 | Monofocal Thin & Lite 1.67 Claros" },
                                            { "id": 11, "codigo": "MTL09 | Monofocal Thin & Lite 1.67 + Fotocromático" },
                                            { "id": 12, "codigo": "MHI07 | Monofocal Hi Index Super Thin & Lite 1.74 + Filtro Luz Azul sin AR" },
                                            { "id": 13, "codigo": "MAF08 | Antifatigue (Relax) Claros + Filtro Luz Azul" },
                                            { "id": 14, "codigo": "MLE09 | Monofocal Lenticular Claro" },
                                            { "id": 15, "codigo": "MLT06 | Monofocal Lenticular + Transitions" },
                                            { "id": 16, "codigo": "BFT2 | Bifocal Flap Top Claro Sencillo" },
                                            { "id": 17, "codigo": "BFT3 | Bifocal Flap Top Claro + Filtro Luz Azul" },
                                            { "id": 18, "codigo": "BFTF | Bifocal Flap Top + Fotocromático" },
                                            { "id": 19, "codigo": "BFTA | Bifocal Flap Top + Fotocromático + Antirreflejo" },
                                            { "id": 20, "codigo": "BFK01 | Bifocal Kriptop Claro Sencillo" },
                                            { "id": 21, "codigo": "BKFA | Bifocal Kriptop + Filtro Luz Azul + Antirreflejo" },
                                            { "id": 22, "codigo": "BKFA1 | Bifocal Kriptop + Filtro Luz Azul + Fotocromático + Antirreflejo" },
                                            { "id": 23, "codigo": "BKL01 | Bifocal Kriptop Lenticular Claro" },
                                            { "id": 24, "codigo": "BI001 | Bifocal Invisible Claro" },
                                            { "id": 25, "codigo": "BIF01 | Bifocal Invisible + Filtro Luz Azul" },
                                            { "id": 26, "codigo": "BIF02 | Bifocal Invisible + Fotocromático" },
                                            { "id": 27, "codigo": "BIF03 | Bifocal Invisible + Fotocromático + Filtro Luz Azul" },
                                            { "id": 28, "codigo": "BIAF1 | Bifocal Invisible + Fotocromático + Antirreflejo" },
                                            { "id": 29, "codigo": "BBIF1 | Bifocal BiFREE (Bifocal Invisible Avanzado Digital) Claro" },
                                            { "id": 30, "codigo": "BBIF2 | Bifocal BiFREE (Bifocal Invisible Avanzado Digital) + Fotocromático" },
                                            { "id": 31, "codigo": "BTT01 | Trifocal Claro Sencillo (Solo vender a usuarios)" },
                                            { "id": 32, "codigo": "CM01 | Control Miopia Claro Sencillo" },
                                            { "id": 33, "codigo": "CM02 | Control Miopia + Filtro Luz Azul" },
                                            { "id": 34, "codigo": "CM04 | Control Miopia + Transitions" },
                                            { "id": 35, "codigo": "CM05 | Control Miopia THIN & LITE + Transitions" },
                                            { "id": 36, "codigo": "CM06 | Control Miopia Polarizado (Lente Oscuro de Sol)" },
                                            { "id": 37, "codigo": "MGSE | Multifocal Generico Claro Sencillo" },
                                            { "id": 38, "codigo": "MGFL | Multifocal Generico + Filtro Luz Azul" },
                                            { "id": 39, "codigo": "MFFT1 | Multifocal Solarmax + Fotocromatico" },
                                            { "id": 40, "codigo": "MSFF | Multifocal Solarmax + Fotocromatico + Filtro Luz Azul" },
                                            { "id": 41, "codigo": "MF01 | Multifocal 4NEW Claro sencillo (utilizar este código cuando lleva filtro terapéutico)" },
                                            { "id": 42, "codigo": "MNTR | Multifocal 4NEW + Transition" },
                                            { "id": 43, "codigo": "MFSS | Multifocal 4STARTER Sencillo" },
                                            { "id": 44, "codigo": "MSTR | Multifocal 4STARTER + Transition" },
                                            { "id": 45, "codigo": "MFPS | Multifocal Panorama Sencillo" },
                                            { "id": 46, "codigo": "MPTR | Multifocal Panorama + Transition" },
                                            { "id": 47, "codigo": "MFDS | Multifocal 4DIGILIFE Claro Sencillo" },
                                            { "id": 48, "codigo": "MDTR | Multifocal 4DIGILIFE + Transition" },
                                            { "id": 49, "codigo": "SP005 | Sobrepoder en Multifocal (ESF. +/- 8.50 CYL. +/- 3.00)" },
                                            { "id": 50, "codigo": "PEM1 | Paquete económico monofocales claros sencillos" },
                                            { "id": 51, "codigo": "PEML | Paquete económico Monofocal + Antirreflejo + Filtro Luz Azul" },
                                            { "id": 52, "codigo": "PEBK2 | Paquete económico Bifocal Kriptop Claro Sencillo" },
                                            { "id": 53, "codigo": "PEBT3 | Paquete económico Bifocal Flap Top Claro Sencillo" },
                                            { "id": 54, "codigo": "PEBI4 | Paquete económico Bifocal Invisible Claro Sencillo" },
                                            { "id": 55, "codigo": "PEMO5 | Paquete económico Multifocal Claro Sencillo" },
                                            { "id": 56, "codigo": "FTP01 | Filtro Terapéutico" },
                                            { "id": 57, "codigo": "FUV1 | Filtro Luz Azul (UV 400)" },
                                            { "id": 58, "codigo": "PM02 | Prismas" },
                                            { "id": 59, "codigo": "RT03 | Remover Tinte" },
                                            { "id": 60, "codigo": "SP04 | Sobrepoder (ESF. +/- 6 CYL: -3.25) Aplica para monofocales y bifocales" },
                                            { "id": 61, "codigo": "TT05 | Tinte" },
                                            { "id": 62, "codigo": "MAA6 | Montaje aro al aire" },
                                            { "id": 63, "codigo": "MA10 | Montaje de aro" },
                                            { "id": 64, "codigo": "RAR7 | Remover antirreflejo" },
                                            { "id": 65, "codigo": "AR009 | Antirreflejo Standard el par (Se cobra adicional)" },
                                            { "id": 66, "codigo": "TRANS | Transition" },
                                            { "id": 67, "codigo": "FOT | Fotocromático" }
                                          ].map(servicio => ({
                                            value: servicio.id,
                                            label: servicio.codigo
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
                                          MATERIAL {isLeftEyeMaterial ? "OJO IZQUIERDO" : "OJO DERECHO"}
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
                                          // onChange={(value, val) => {
                                          //   // setFieldValue('servicios_realizados_historias_clinicas', value);

                                          //   if (!tratamientosFiltros.find(servicio => servicio.value == value) && tratamientosFiltros.length < 2) {
                                          //     tratamientosFiltros.push(val)
                                          //     setTratamientosFiltros([...tratamientosFiltros])
                                          //   }
                                          // }}
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
                                            { id: 11, codigo: "Filtro TERA chocolate claros rosado" },
                                            { id: 12, codigo: "Filtro EP Azul claro" },
                                            { id: 13, codigo: "Filtro Amarillo Claro 450" },
                                            { id: 14, codigo: "Filtro Amarillo Fuerte 350" },
                                            { id: 15, codigo: "Filtro Chocolate Oscuro EB 480" },
                                            { id: 16, codigo: "Filtro Amarillo/ Naranja 510" },
                                            { id: 17, codigo: "Filtro Naranja Claro 525" },
                                            { id: 18, codigo: "Filtro Naranja Oscuro 550" },
                                            { id: 19, codigo: "Filtro Rojo Oscuro 60" },
                                            { id: 20, codigo: "Fotocromático Gris" },
                                            { id: 21, codigo: "Fotocromático Café" },
                                            { id: 22, codigo: "Antirreflejo AR" },
                                            { id: 23, codigo: "Polarizado Negro" },
                                            { id: 24, codigo: "Polarizado Café" },
                                            { id: 25, codigo: "Polarizado Gris + Espejado" },
                                            { id: 26, codigo: "Polarizado Café + Espejado" },
                                            { id: 27, codigo: "Tinte Uniforme" },
                                            { id: 28, codigo: "Tinte Degradante" },
                                            { id: 29, codigo: "Filtro UV" },
                                            { id: 30, codigo: "Transitions Gris" },
                                            { id: 31, codigo: "Transitions Café" }
                                          ].map(servicio => ({
                                            value: servicio.id,
                                            label: servicio.codigo
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
                                      {/* <Col xxl={4} xl={4} md={4}>
                                        <div
                                          style={{
                                            // display: 'flex'
                                          }}
                                        >
                                          <div style={{ marginTop: '-15px' }}>
                                            <b>MARCA</b>
                                          </div>
                                          <Field
                                            className="form-control"
                                            name="marca"
                                            style={{
                                              marginLeft: '0px', height: '30px'
                                            }}
                                          />
                                        </div>
                                      </Col> */}



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
                                                    value={orden?.elaborado_por_nombre}
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
                                          src="/assets/img/recetas/lentessinbarilla.png"
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
                                Editar Receta
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

export default EditOrden