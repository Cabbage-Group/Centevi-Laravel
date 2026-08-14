import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { updateOrden } from '../../redux/features/ordenes/ordenesSlice';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import { Col, Input, Row, Select, Checkbox, Button, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { CloseCircleTwoTone, LoadingOutlined } from '@ant-design/icons';
import { fetchUsuarios } from '../../redux/features/usuarios/usuariosSlice';
import { useLocation } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment';

const ONE_FIT_INITIAL = {
  poder_od: '', dia_od: '', edge_od: '', pfsd_od: '', cb_od: '', ct_od: '',
  poder_oi: '', dia_oi: '', edge_oi: '', pfsd_oi: '', cb_oi: '', ct_oi: '',
};

const ONE_FIT_MED_INITIAL = {
  sag_od: '', poder_od: '', dia_od: '', mid_od: '', lim_od: '', pfsd_od: '', edg_od: '', ct_od: '',
  sag_oi: '', poder_oi: '', dia_oi: '', mid_oi: '', lim_oi: '', pfsd_oi: '', edg_oi: '', ct_oi: '',
};

const VerOrden = ({ fecha_solicitud, pacienteOrden, statusPacienteOrden }) => {
  const isLoadingData = statusPacienteOrden === "loading" || statusPacienteOrden === "loading";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();
  const { pacientes_options_selecteds, pacientes, status } = useSelector((state) => state.pacientes);
  const { sucursales_option_selects } = useSelector((state) => state.sucursales);
  const { usuario } = useSelector((state) => state.auth);
  const { usuarios_doctores_options_selecteds } = useSelector((state) => state.usuarios);
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const [selectedSucursal, setSelectedSucursal] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('Sr(a) paciente {nombre}, sus lentes estan listos para retirar, puede pasar a retirarlos en la sucursal {sucursal');
  const [cedula, setCedula] = useState('');
  const [isLeftEye, setIsLeftEye] = useState(false);
  const [isLeftEyeMaterial, setIsLeftEyeMaterial] = useState(false);
  const [isLeftEyeTratamientos, setIsLeftEyeTratamientos] = useState(false);
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [selectedMarca, setSelectedMarca] = useState('');
  const [selectedMarcaOI, setSelectedMarcaOI] = useState('');
  const [serviciosRealizados, setServiciosRealizados] = useState([]);
  const [tipoCorredor, setTipoCorredor] = useState('');
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState([]);
  const [tratamientosFiltros, setTratamientosFiltros] = useState([]);
  const [aroCentevi, setAroCentevi] = useState(false);
  const [tipoAro, setTipoAro] = useState('');
  const [doctorSeleccionado, setDoctorSeleccionado] = useState('')
  const [tieneFactura, setTieneFactura] = useState(false);

  // Tipo de lente: 'aro' | 'contacto' | 'onefit' | 'onefitmed' — misma lógica que EditOrden, solo lectura
  const [tipoLente, setTipoLente] = useState('aro');
  const esAro = tipoLente === 'aro';
  const esOneFit = tipoLente === 'onefit';
  const esOneFitMed = tipoLente === 'onefitmed';

  const [oneFitValues, setOneFitValues] = useState(ONE_FIT_INITIAL);
  const [oneFitMedValues, setOneFitMedValues] = useState(ONE_FIT_MED_INITIAL);

  useEffect(() => {
    if (pacienteOrden?.tipo_lente) {
      setTipoLente(pacienteOrden.tipo_lente);
    }
  }, [pacienteOrden]);

  useEffect(() => {
    const hasRightEye = serviciosRealizados.some(servicio => servicio.ojo === "Ojo Derecho");
    setIsLeftEye(hasRightEye);
  }, [serviciosRealizados]);

  const [formValues, setFormValues] = useState({
    nro_orden: '',
    nro_orden_id: '',
    nro_cotizacion: '',
    id_paciente: '',
    id_sucursal: '',
    esfera_od: '',
    esfera_oi: '',
    cilindro_od: '',
    cilindro_oi: '',
    eje_od: '',
    eje_oi: '',
    add_od: '',
    add_oi: '',
    prisma_od: '',
    prisma_oi: '',
    distancia_od: '',
    distancia_oi: '',
    altura_od: '',
    altura_oi: '',
    tipo_cristal_od: '',
    tipo_cristal_oi: '',
    tipo_corredor: '',
    material_od: '',
    material_oi: '',
    tratamientos_od: '',
    tratamientos_oi: '',
    aro_centevi: '',
    aro_propio: '',
    codigo: '',
    color: '',
    marca: '',
    marca_oi: '',
    tipo_aro: '',
    observaciones: '',
    doctor: '',
    l_uno: '',
    l_dos: '',
    l_tres: '',
    l_cuatro: '',
    l_cinco: '',
    nro_factura: ''
  });

  const tipoAroOptions = [
    { label: 'Pasta Completo', value: 1 },
    { label: 'Pasta Semi al Aire', value: 2 },
    { label: 'Metal Completo', value: 3 },
    { label: 'Metal Semi al Aire', value: 4 },
    { label: 'Al Aire', value: 5 },
    { label: 'Seguridad', value: 6 },
  ];
  useEffect(() => {
    if (pacienteOrden) {
      setSelectedPaciente(pacienteOrden?.id_paciente);
      setSelectedSucursal(pacienteOrden?.id_sucursal);
      setDoctorSeleccionado(pacienteOrden?.doctor);
      setTipoAro(pacienteOrden?.tipo_aro);
      setSelectedMarca(pacienteOrden?.marca);
      setSelectedMarcaOI(pacienteOrden?.marca_oi);
      setTieneFactura(pacienteOrden.nro_factura || false);
      setServiciosRealizados([
        pacienteOrden?.tipo_cristal_od
          ? { value: pacienteOrden.tipo_cristal_od, label: pacienteOrden.tipo_cristal_od, ojo: "Ojo Derecho" }
          : null,
        pacienteOrden?.tipo_cristal_oi
          ? { value: pacienteOrden.tipo_cristal_oi, label: pacienteOrden.tipo_cristal_oi, ojo: "Ojo Izquierdo" }
          : null,
      ].filter(Boolean));
      setMaterialesSeleccionados([
        pacienteOrden?.material_od ? {
          value: pacienteOrden?.material_od,
          label: pacienteOrden?.material_od,
          ojo: "Ojo Derecho"
        } : null,
        pacienteOrden?.material_oi ? {
          value: pacienteOrden?.material_oi,
          label: pacienteOrden?.material_oi,
          ojo: "Ojo Izquierdo"
        } : null,
      ].filter(Boolean));
      setTratamientosFiltros([
        pacienteOrden?.tratamientos_od ? {
          value: pacienteOrden?.tratamientos_od,
          label: pacienteOrden?.tratamientos_od,
          ojo: "Ojo Derecho"
        } : null,
        pacienteOrden?.tratamientos_oi ? {
          value: pacienteOrden?.tratamientos_oi,
          label: pacienteOrden?.tratamientos_oi,
          ojo: "Ojo Izquierdo"
        } : null,
      ].filter(Boolean));
      setTipoCorredor(pacienteOrden.tipo_corredor);

      setOneFitValues({
        poder_od: pacienteOrden?.poder_od || '',
        poder_oi: pacienteOrden?.poder_oi || '',
        dia_od: pacienteOrden?.dia_od || '',
        dia_oi: pacienteOrden?.dia_oi || '',
        edge_od: pacienteOrden?.edge_od || '',
        edge_oi: pacienteOrden?.edge_oi || '',
        pfsd_od: pacienteOrden?.pfsd_od || '',
        pfsd_oi: pacienteOrden?.pfsd_oi || '',
        cb_od: pacienteOrden?.cb_od || '',
        cb_oi: pacienteOrden?.cb_oi || '',
        ct_od: pacienteOrden?.ct_od || '',
        ct_oi: pacienteOrden?.ct_oi || '',
      });

      setOneFitMedValues({
        sag_od: pacienteOrden?.sag_od || '',
        sag_oi: pacienteOrden?.sag_oi || '',
        poder_od: pacienteOrden?.poder_od || '',
        poder_oi: pacienteOrden?.poder_oi || '',
        dia_od: pacienteOrden?.dia_od || '',
        dia_oi: pacienteOrden?.dia_oi || '',
        mid_od: pacienteOrden?.mid_od || '',
        mid_oi: pacienteOrden?.mid_oi || '',
        lim_od: pacienteOrden?.lim_od || '',
        lim_oi: pacienteOrden?.lim_oi || '',
        pfsd_od: pacienteOrden?.pfsd_od || '',
        pfsd_oi: pacienteOrden?.pfsd_oi || '',
        edg_od: pacienteOrden?.edg_od || '',
        edg_oi: pacienteOrden?.edg_oi || '',
        ct_od: pacienteOrden?.ct_od || '',
        ct_oi: pacienteOrden?.ct_oi || '',
      });

      setFormValues((prevValues) => ({
        ...prevValues,
        nro_orden: pacienteOrden.nro_orden || '',
        nro_orden_id: pacienteOrden.nro_orden_id || '',
        nro_cotizacion: pacienteOrden.nro_cotizacion || '',
        nro_factura: pacienteOrden.nro_factura || '',
        id_paciente: pacienteOrden.id_paciente || '',
        id_sucursal: pacienteOrden.id_sucursal || '',
        esfera_od: pacienteOrden.esfera_od || '',
        esfera_oi: pacienteOrden.esfera_oi || '',
        cilindro_od: pacienteOrden.cilindro_od || '',
        cilindro_oi: pacienteOrden.cilindro_oi || '',
        eje_od: pacienteOrden.eje_od || '',
        eje_oi: pacienteOrden.eje_oi || '',
        add_od: pacienteOrden.add_od || '',
        add_oi: pacienteOrden.add_oi || '',
        prisma_od: pacienteOrden.prisma_od || '',
        prisma_oi: pacienteOrden.prisma_oi || '',
        distancia_od: pacienteOrden.distancia_od || '',
        distancia_oi: pacienteOrden.distancia_oi || '',
        altura_od: pacienteOrden.altura_od || '',
        altura_oi: pacienteOrden.altura_oi || '',
        tipo_cristal_od: pacienteOrden.tipo_cristal_od,
        tipo_cristal_oi: '',
        material_od: '',
        material_oi: '',
        tratamientos_od: '',
        tratamientos_oi: '',
        aro_centevi: pacienteOrden.aro_centevi || '',
        aro_propio: pacienteOrden.aro_propio || '',
        codigo: pacienteOrden.codigo || '',
        color: pacienteOrden.color || '',
        marca: pacienteOrden.marca || '',
        marca_oi: pacienteOrden.marca_oi || '',
        tipo_aro: pacienteOrden.tipo_aro || '',
        observaciones: pacienteOrden.observaciones || '',
        doctor: pacienteOrden.doctor || '',
        l_uno: pacienteOrden.l_uno || '',
        l_dos: pacienteOrden.l_dos || '',
        l_tres: pacienteOrden.l_tres || '',
        l_cuatro: pacienteOrden.l_cuatro || '',
        l_cinco: pacienteOrden.l_cinco || '',
      }));
    }
  }, [pacienteOrden]);

  const validationSchema = Yup.object().shape({
    nro_orden: Yup.number()
      .integer("Debe ser un número entero")
      .typeError("Debe ser un número")
      .required("El número de orden es obligatorio"),
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
    doctor: Yup.string()
      .nullable()
      .required("Seleccione un doctor"),
  });



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
    if (pacienteOrden?.aro_centevi !== undefined) {
      setAroCentevi(pacienteOrden?.aro_centevi === 1);
    }
  }, [pacienteOrden]);

  useEffect(() => {
    if (selectedPaciente) {
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
    if (status === "idle" || pacientes.length < 11) {
      dispatch(fetchPacientes({ page: 1, limit: 50000 }));
    }
  }, []);

  useEffect(() => {
    dispatch(fetchSucursales({ page: 1, limit: 100 }));
    dispatch(fetchUsuarios({}))
  }, []);
  const handleSubmit = async () => { };
  const antIcon = (
    <LoadingOutlined style={{ fontSize: 40, color: "#52c41a" }} spin />
  );

  return (
    <div className="admin-data-content" data-select2-id="15">
      <div className="row layout-top-spacing">
        <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
          <div className="widget-content-area br-4">
            {isLoadingData ? (
              <div
                style={{
                  minHeight: "400px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Spin indicator={antIcon} tip="Cargando datos, por favor espere..." size="large" />
              </div>
            ) : (
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
                            initialValues={formValues}
                            enableReinitialize
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

                                  <div className={tieneFactura ? "col-md-2" : "col-md-2"}>
                                    <h4>
                                      Fecha de solicitud
                                    </h4>
                                    <p className="ml-5">
                                      <b>
                                        {moment().format('YYYY-MM-DD')}
                                      </b>
                                    </p>
                                  </div>

                                  <div className="col-md-2">
                                    <h4>Nro. Cotización*</h4>
                                    <Field name="nro_cotizacion">
                                      {({ field }) => (
                                        <input
                                          {...field}
                                          type="text"
                                          placeholder="Ingrese el número de cotización"
                                          className="form-control"
                                          readOnly
                                          style={{
                                            fontWeight: "bold",
                                            marginBottom: "1rem",
                                            height: "40px",
                                            fontSize: "12px",
                                            paddingLeft: "8px",
                                          }}
                                        />
                                      )}
                                    </Field>
                                  </div>

                                  {tieneFactura && (
                                    <div className="col-md-2">
                                      <h4>Nro. Factura*</h4>
                                      <Field name="nro_factura">
                                        {({ field }) => (
                                          <input
                                            {...field}
                                            type="text"
                                            placeholder="Ingrese el número de factura"
                                            className="form-control"
                                            readOnly
                                            style={{
                                              fontWeight: "bold",
                                              marginBottom: "1rem",
                                              height: "40px",
                                              fontSize: "12px",
                                              paddingLeft: "8px",
                                            }}
                                          />
                                        )}
                                      </Field>
                                    </div>
                                  )}

                                  <div class="col-md-2"  >
                                    <h4>Nro. Orden*</h4>
                                    <Input
                                      name="nro_orden"
                                      value={values.nro_orden_id}
                                      readOnly
                                      placeholder="Ingrese el número de orden"
                                      style={{
                                        color: "red",
                                        fontWeight: "bold",
                                        marginBottom: "1rem",
                                        height: '40px',
                                      }}

                                    />
                                    <ErrorMessage
                                      name="nro_orden"
                                      component="div"
                                      style={{ color: "red", fontSize: "12px" }}
                                    />
                                  </div>

                                  <div className="col-md-2">
                                    <h4>Tipo de lente</h4>
                                    <Input
                                      value={
                                        esAro ? 'Lente Aro'
                                          : esOneFit ? 'Lente Escleral OneFit'
                                            : esOneFitMed ? 'Lente Escleral OneFit Med'
                                              : 'Lente de Contacto'
                                      }
                                      disabled
                                      style={{
                                        fontWeight: "bold",
                                        height: '40px',
                                      }}
                                    />
                                  </div>

                                  <div className="form-group col-md-4" >
                                    <label htmlFor="pacientes">Pacientes*</label>
                                    <Select
                                      showSearch
                                      value={selectedPaciente}
                                      disabled
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
                                      disabled
                                      placeholder="Seleccione una sucursal"
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
                                      readOnly
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
                                      readOnly
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
                                      {esOneFit ? (
                                        <table className="table table-bordered">
                                          <thead>
                                            <tr style={{ backgroundColor: '#4361ee' }}>
                                              <th className="text-center" style={{ color: 'white!important' }}>RX</th>
                                              <th style={{ color: 'white!important' }}>Poder</th>
                                              <th style={{ color: 'white!important' }}>DIA</th>
                                              <th style={{ color: 'white!important' }}>Edge</th>
                                              <th style={{ color: 'white!important' }}>PFSD</th>
                                              <th style={{ color: 'white!important' }}>CB</th>
                                              <th style={{ color: 'white!important' }}>CT</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr>
                                              <td className="text-center">OD</td>
                                              <td><input className="form-control" readOnly disabled value={oneFitValues.poder_od} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitValues.dia_od} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitValues.edge_od} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitValues.pfsd_od} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitValues.cb_od} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitValues.ct_od} /></td>
                                            </tr>
                                            <tr>
                                              <td className="text-center">OI</td>
                                              <td><input className="form-control" readOnly disabled value={oneFitValues.poder_oi} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitValues.dia_oi} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitValues.edge_oi} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitValues.pfsd_oi} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitValues.cb_oi} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitValues.ct_oi} /></td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      ) : esOneFitMed ? (
                                        <table className="table table-bordered">
                                          <thead>
                                            <tr style={{ backgroundColor: '#4361ee' }}>
                                              <th className="text-center" style={{ color: 'white!important' }}>RX</th>
                                              <th style={{ color: 'white!important' }}>SAG</th>
                                              <th style={{ color: 'white!important' }}>Poder</th>
                                              <th style={{ color: 'white!important' }}>DIA</th>
                                              <th style={{ color: 'white!important' }}>MID</th>
                                              <th style={{ color: 'white!important' }}>LIM</th>
                                              <th style={{ color: 'white!important' }}>PFSD</th>
                                              <th style={{ color: 'white!important' }}>EDG</th>
                                              <th style={{ color: 'white!important' }}>CT</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr>
                                              <td className="text-center">OD</td>
                                              <td><input className="form-control" readOnly disabled value={oneFitMedValues.sag_od} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitMedValues.poder_od} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitMedValues.dia_od} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitMedValues.mid_od} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitMedValues.lim_od} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitMedValues.pfsd_od} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitMedValues.edg_od} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitMedValues.ct_od} /></td>
                                            </tr>
                                            <tr>
                                              <td className="text-center">OI</td>
                                              <td><input className="form-control" readOnly disabled value={oneFitMedValues.sag_oi} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitMedValues.poder_oi} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitMedValues.dia_oi} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitMedValues.mid_oi} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitMedValues.lim_oi} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitMedValues.pfsd_oi} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitMedValues.edg_oi} /></td>
                                              <td><input className="form-control" readOnly disabled value={oneFitMedValues.ct_oi} /></td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      ) : (
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
                                                }}
                                              >
                                                {esAro ? 'PRISMA' : 'Tipo de lente de contacto'}
                                              </th>
                                              <th
                                                style={{
                                                  color: 'white!important',
                                                  width: "130px"
                                                }}
                                              >
                                                {esAro ? 'DISTANCIA PUPILAR' : 'Curva Base'}
                                              </th>
                                              <th
                                                style={{
                                                  color: 'white!important',
                                                  width: "130px"
                                                }}
                                              >
                                                {esAro ? 'ALTURA' : 'Diametro'}
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
                                                  readOnly
                                                  disabled
                                                  as="input"
                                                />
                                              </td>
                                              <td>
                                                <Field
                                                  className="form-control"
                                                  name="cilindro_od"
                                                  readOnly
                                                  disabled
                                                  as="input"
                                                />
                                              </td>
                                              <td>
                                                <Field
                                                  className="form-control"
                                                  name="eje_od"
                                                  readOnly
                                                  disabled
                                                  as="input"
                                                />
                                              </td>
                                              <td>
                                                <Field
                                                  className="form-control"
                                                  name="add_od"
                                                  readOnly
                                                  disabled
                                                  as="input"
                                                />
                                              </td>
                                              <td>
                                                <Field
                                                  className="form-control"
                                                  placeholder="△"
                                                  type="text"
                                                  name="prisma_od"
                                                  readOnly
                                                  disabled
                                                  as="input"
                                                />
                                              </td>
                                              <td style={esAro ? { paddingTop: '70px', textAlign: 'center' } : {}}>
                                                <Field
                                                  className="form-control"
                                                  name="distancia_od"
                                                  as="input"
                                                  readOnly
                                                  disabled
                                                />
                                              </td>
                                              <td>
                                                <Field
                                                  className="form-control"
                                                  name="altura_od"
                                                  readOnly
                                                  disabled
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
                                                  readOnly
                                                  disabled
                                                  as="input"
                                                />
                                              </td>
                                              <td>
                                                <Field
                                                  className="form-control"
                                                  name="cilindro_oi"
                                                  readOnly
                                                  disabled
                                                  as="input"
                                                />
                                              </td>
                                              <td>
                                                <Field
                                                  className="form-control"
                                                  name="eje_oi"
                                                  readOnly
                                                  disabled
                                                  as="input"
                                                />
                                              </td>
                                              <td>
                                                <Field
                                                  className="form-control"
                                                  name="add_oi"
                                                  readOnly
                                                  disabled
                                                  as="input"
                                                />
                                              </td>
                                              <td>
                                                <Field
                                                  className="form-control"
                                                  type="text"
                                                  placeholder="△"
                                                  name="prisma_oi"
                                                  readOnly
                                                  disabled
                                                  as="input"
                                                />
                                              </td>
                                              {esAro ? (
                                                <td></td>
                                              ) : (
                                                <td>
                                                  <Field
                                                    className="form-control"
                                                    type="text"
                                                    name="distancia_oi"
                                                    readOnly
                                                    disabled
                                                    as="input"
                                                  />
                                                </td>
                                              )}
                                              <td>
                                                <Field
                                                  className="form-control"
                                                  name="altura_oi"
                                                  readOnly
                                                  disabled
                                                  as="input"
                                                />
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {
                                  esAro && (
                                    <div
                                      style={{
                                        border: '2px solid blue',
                                        borderRadius: '25px',
                                        marginTop: '-20px',
                                        padding: '15px'
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
                                            disabled
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
                                              marginTop: '10px',
                                              marginBottom: '10px'
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
                                                      >
                                                        <CloseCircleTwoTone twoToneColor="#eb2f96" />
                                                      </span>
                                                    </div>
                                                  </>
                                                )
                                              })
                                            }

                                          </div>
                                          {tipoCorredor && (
                                            <>
                                              <div
                                                style={{ marginTop: '10px', color: 'black' }}
                                              >
                                                Tipo Corredor
                                              </div>
                                              <Select
                                                showSearch
                                                value={tipoCorredor}
                                                style={{
                                                  width: '100%', color: 'transparent',
                                                  background: 'white !important'
                                                }}
                                                optionFilterProp="label"
                                                onChange={(value, option) => setTipoCorredor(option.label)}
                                                options={[
                                                  { value: "corredor-corto", label: "Corredor Corto" },
                                                  { value: "corredor-largo", label: "Corredor Largo" },
                                                ]}
                                                disabled={true}
                                              >
                                              </Select>
                                            </>
                                          )}
                                        </Col>
                                        <Col xxl={8} xl={8} md={8}>
                                          <h6
                                            className="text-center p-2"
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
                                            disabled
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
                                              marginTop: '10px',
                                              marginBottom: '10px'
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
                                            disabled
                                            style={{
                                              width: '100%', color: 'transparent',
                                              background: 'white !important'
                                            }}
                                            optionFilterProp="label"
                                            onChange={handleSelectChangeTratamientos}
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
                                              marginTop: '10px',
                                              marginBottom: '10px'
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
                                        {esAro && (
                                          <Col xxl={5} xl={5} md={5}>
                                            <div>
                                              <label className="new-control new-radio radio-classic-primary">
                                                <b>ARO CENTEVI</b>
                                                <Field
                                                  className="new-control-input"
                                                  checked={aroCentevi}
                                                  type="radio"
                                                  disabled
                                                  name="aro_centevi"
                                                />
                                                <span className="new-control-indicator" />
                                              </label>
                                            </div>
                                          </Col>
                                        )}
                                        {esAro && (
                                          <Col xxl={5} xl={5} md={5}>
                                            <div>
                                              <label className="new-control new-radio radio-classic-primary">
                                                <b>ARO PROPIO</b>
                                                <Field
                                                  className="new-control-input"
                                                  checked={!aroCentevi}
                                                  disabled
                                                  type="radio"
                                                />
                                                <span className="new-control-indicator" />
                                              </label>
                                            </div>
                                          </Col>
                                        )}
                                        {esAro && (
                                          <Col xxl={5} xl={5} md={5}>
                                            <div>
                                              <div style={{ marginTop: '-15px' }}>
                                                <b>CÓDIGO</b>
                                              </div>
                                              <Field
                                                className="form-control"
                                                name="codigo"
                                                readOnly
                                                style={{
                                                  marginLeft: '0px', height: '30px',
                                                  width: '100%'
                                                }}
                                                as="input"
                                                disabled
                                              />
                                            </div>
                                          </Col>
                                        )}

                                        <Col xxl={esAro ? 9 : 12} xl={esAro ? 9 : 12} md={esAro ? 9 : 12}>
                                          {esAro && (
                                            <div>
                                              <div style={{ marginTop: '-68px' }}>
                                                <b>COLOR*</b>
                                              </div>
                                              <Field
                                                className="form-control"
                                                name="color"
                                                readOnly
                                                disabled
                                                style={{
                                                  marginLeft: '0px', height: '30px'
                                                }}
                                              />
                                            </div>
                                          )}

                                          <div>
                                            <div style={{ marginTop: '1px' }}>
                                              <b>MARCA</b>
                                            </div>
                                            {esAro ? (
                                              <Field
                                                className="form-control"
                                                name="marca"
                                                readOnly
                                                disabled
                                                style={{
                                                  marginLeft: '0px', height: '30px'
                                                }}
                                              />
                                            ) : (
                                              <div style={{ display: 'flex', gap: '10px' }}>
                                                <div style={{ flex: 1 }}>
                                                  <div style={{ marginBottom: '5px', fontSize: '12px' }}>Ojo Derecho</div>
                                                  <Select
                                                    value={selectedMarca}
                                                    disabled
                                                    placeholder="Selecciona la marca"
                                                    showSearch
                                                    style={{
                                                      width: "100%",
                                                      height: "48px",
                                                      color: "black",
                                                      fontWeight: "bold",
                                                    }}
                                                    options={selectedMarca ? [{ value: selectedMarca, label: selectedMarca }] : []}
                                                  />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                  <div style={{ marginBottom: '5px', fontSize: '12px' }}>Ojo Izquierdo</div>
                                                  <Select
                                                    value={selectedMarcaOI}
                                                    disabled
                                                    placeholder="Selecciona la marca"
                                                    showSearch
                                                    style={{
                                                      width: "100%",
                                                      height: "48px",
                                                      color: "black",
                                                      fontWeight: "bold",
                                                    }}
                                                    options={selectedMarcaOI ? [{ value: selectedMarcaOI, label: selectedMarcaOI }] : []}
                                                  />
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </Col>

                                        <Col xxl={24} xl={24} md={24}>
                                          <Row
                                            gutter={[16, 16]}
                                          >
                                            <Col xxl={12} xl={12} md={12}>
                                              <Row>
                                                {esAro && (
                                                  <Col xxl={24} xl={24} md={24}>
                                                    <div
                                                      style={{
                                                        marginBottom: '10px'
                                                      }}
                                                    >
                                                      <b>TIPO DE ARO*:</b>
                                                      <Select
                                                        showSearch
                                                        placeholder="Selecciona el tipo de aro"
                                                        value={tipoAro}
                                                        disabled
                                                        options={tipoAroOptions}
                                                        style={{
                                                          width: "100%",
                                                          height: "40px",
                                                          color: "black",
                                                          fontWeight: "bold",
                                                        }}
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
                                                      disabled
                                                      options={usuarios_doctores_options_selecteds}
                                                      style={{
                                                        width: "100%",
                                                        height: "48px",
                                                        color: "black",
                                                        fontWeight: "bold",
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
                                                      value={pacienteOrden?.elaborado_por}
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
                                                readOnly
                                                disabled
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

                                    {esAro && (
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
                                          }}
                                        >
                                          <img
                                            src="/assets/img/recetas/lentessinbarilla.png"
                                            style={{
                                              width: "120%",
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
                                              readOnly
                                              disabled
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
                                              readOnly
                                              disabled
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
                                              readOnly
                                              disabled
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
                                              readOnly
                                              disabled
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
                                              readOnly
                                              disabled
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
                              </Form>
                            )}
                          </Formik>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerOrden