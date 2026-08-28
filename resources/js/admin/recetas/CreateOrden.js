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
import { fetchMarcasOnefit } from '../../redux/features/marcas-onefit/marcasOnefitSlice';
import { fetchMarcasOnefitMed } from '../../redux/features/marcas-onefit-med/marcasOnefitMedSlice';

// Opciones del selector de tipo de lente
const TIPO_LENTE_OPTIONS = [
  { value: 'aro', label: 'Lente Aro' },
  { value: 'contacto', label: 'Lente de Contacto' },
  { value: 'onefit', label: 'Lente Escleral OneFit' },
  { value: 'onefitmed', label: 'Lente Escleral OneFit Med' },
];

const ONE_FIT_INITIAL = {
  rx_od: '', poder_od: '', dia_od: '', edge_od: '', pfsd_od: '', cb_od: '', ct_od: '',
  rx_oi: '', poder_oi: '', dia_oi: '', edge_oi: '', pfsd_oi: '', cb_oi: '', ct_oi: '',
};

const ONE_FIT_MED_INITIAL = {
  rx_od: '', sag_od: '', poder_od: '', dia_od: '', mid_od: '', lim_od: '', pfsd_od: '', edg_od: '', ct_od: '',
  rx_oi: '', sag_oi: '', poder_oi: '', dia_oi: '', mid_oi: '', lim_oi: '', pfsd_oi: '', edg_oi: '', ct_oi: '',
};

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
  const {
    marcas_one_fit_options_selecteds,
  } = useSelector((state) => state.marcasOnefit);

  const {
    marcas_one_fit_med_options_selecteds,
  } = useSelector((state) => state.marcasOnefitMed);

  const [selectedPaciente, setSelectedPaciente] = useState(parsedId || null);
  const [selectedMarca, setSelectedMarca] = useState(null);
  const [telefono, setTelefono] = useState('');
  const [cedula, setCedula] = useState('');

  // Tipo de lente: 'aro' | 'contacto' | 'onefit' | 'onefitmed'
  const [tipoLente, setTipoLente] = useState('aro');
  const esAro = tipoLente === 'aro';
  const esOneFit = tipoLente === 'onefit';
  const esOneFitMed = tipoLente === 'onefitmed';

  const [serviciosRealizados, setServiciosRealizados] = useState([]);
  const [tipoCorredor, setTipoCorredor] = useState('');
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState([]);
  const [tratamientosFiltros, setTratamientosFiltros] = useState([]);
  const [aroCentevi, setAroCentevi] = useState(false);
  const [tipoAro, setTipoAro] = useState(null);
  const [doctorSeleccionado, setDoctorSeleccionado] = useState(null)
  const [isLeftEye, setIsLeftEye] = useState(false);
  const [isLeftEyeMaterial, setIsLeftEyeMaterial] = useState(false);
  const [isLeftEyeTratamientos, setIsLeftEyeTratamientos] = useState(false);
  const [tieneFactura, setTieneFactura] = useState(false);

  // Valores manuales para Lente Escleral OneFit
  const [oneFitValues, setOneFitValues] = useState(ONE_FIT_INITIAL);
  const handleOneFitChange = (field) => (e) => {
    const { value } = e.target;
    setOneFitValues((prev) => ({ ...prev, [field]: value }));
  };

  // Valores manuales para Lente Escleral OneFit Med
  const [oneFitMedValues, setOneFitMedValues] = useState(ONE_FIT_MED_INITIAL);
  const handleOneFitMedChange = (field) => (e) => {
    const { value } = e.target;
    setOneFitMedValues((prev) => ({ ...prev, [field]: value }));
  };

  const marcasOptions = (() => {
    switch (tipoLente) {
      case 'contacto':
        return marcas_options_selecteds || [];

      case 'onefit':
        return marcas_one_fit_options_selecteds || [];

      case 'onefitmed':
        return marcas_one_fit_med_options_selecteds || [];

      default:
        return [];
    }
  })();

  // Dorado : 186.74.2.218
  // San Judas Tadeo: 190.219.45.142
  // Paitilla:  45.229.196.9
  // Espana: 190.34.23.233

  const initialValues = {
    id_paciente: parsedId || "",
    id_sucursal:
      localStorage.getItem('ip') == '186.74.2.218'
        ? "7"
        : localStorage.getItem('ip') == '190.219.45.142'
          ? "3"
          : localStorage.getItem('ip') == '45.229.196.9'
            ? "4"
            : localStorage.getItem('ip') == '190.34.23.233'
              ? "11"
              : "",
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
    tipo_corredor: "",
    material_od: "",
    material_oi: "",
    tratamientos_od: "",
    tratamientos_oi: "",
    aro_centevi: "",
    aro_propio: "",
    codigo: "",
    color: "",
    marca: "",
    marca_oi: "",
    tipo_aro: esAro ? "" : null,
    observaciones: "",
    doctor: "",
    l_uno: "",
    l_dos: "",
    l_tres: "",
    l_cuatro: "",
    l_cinco: "",
    nro_cotizacion: "",
    tipo_lente: 'aro',
    nro_factura: "",
    tieneFactura: 0
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
    tipo_aro: Yup.string().when('tipo_lente', {
      is: 'aro',
      then: (schema) => schema.required("Seleccione un tipo de aro"),
      otherwise: (schema) => schema.notRequired(),
    }),
    doctor: Yup.string().nullable()
      .required("Seleccione un doctor"),
    nro_cotizacion: Yup.string()
      .required("Coloque un número de cotización"),
    nro_factura: Yup.string().when('tieneFactura', {
      is: (val) => val === true || val === 1,
      then: (schema) => schema.required("Coloque un número de factura"),
      otherwise: (schema) => schema.notRequired(),
    }),
    marca: Yup.string().when('tipo_lente', {
      is: (val) => val !== 'aro',
      then: (schema) => schema.test(
        'at-least-one-marca',
        'Debe seleccionar al menos una marca',
        function (value) {
          const { marca_oi } = this.parent;
          return !!(value || marca_oi);
        }
      ),
      otherwise: (schema) => schema.notRequired(),
    }),
    marca_oi: Yup.string().when('tipo_lente', {
      is: (val) => val !== 'aro',
      then: (schema) => schema.test(
        'at-least-one-marca',
        'Debe seleccionar al menos una marca',
        function (value) {
          const { marca } = this.parent;
          return !!(value || marca);
        }
      ),
      otherwise: (schema) => schema.notRequired(),
    }),
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
    const ojoActual = isLeftEye ? "OJO IZQUIERDO" : "OJO DERECHO";
    const newEntry = { servicio: ojoActual, label: option.label };

    setServiciosRealizados((prev) => {
      const indexFind = prev.findIndex((s) => s.servicio === ojoActual);
      if (indexFind !== -1) {
        const copy = [...prev];
        copy[indexFind] = newEntry;
        return copy;
      }
      return [...prev, newEntry];
    });
    setIsLeftEye(!isLeftEye);
  };

  const tipoCristalMultifocal = () => {
    return serviciosRealizados.some(servicio =>
      servicio.label.toLowerCase().includes("multifocal")
    );
  };

  const handleSelectChangeMaterial = (value, option) => {
    const ojoActual = isLeftEyeMaterial ? "OJO IZQUIERDO" : "OJO DERECHO";
    const newEntryMateriales = { servicio: ojoActual, label: option.label };

    setMaterialesSeleccionados((prev) => {
      const indexFind = prev.findIndex((s) => s.servicio === ojoActual);
      if (indexFind !== -1) {
        const copy = [...prev];
        copy[indexFind] = newEntryMateriales;
        return copy;
      }
      return [...prev, newEntryMateriales];
    });
    setIsLeftEyeMaterial(!isLeftEyeMaterial);
  };


  const handleSelectChangeTratamientos = (value, option) => {
    const ojoActual = isLeftEyeTratamientos ? "OJO IZQUIERDO" : "OJO DERECHO";
    const newEntryTratamientos = { servicio: ojoActual, label: option.label };

    setTratamientosFiltros((prev) => {
      const indexFind = prev.findIndex((s) => s.servicio === ojoActual);
      if (indexFind !== -1) {
        const copy = [...prev];
        copy[indexFind] = newEntryTratamientos;
        return copy;
      }
      return [...prev, newEntryTratamientos];
    });
    setIsLeftEyeTratamientos(!isLeftEyeTratamientos);
  };

  const extraerPorOjo = (lista) => {
    const od = lista.find((item) => item.servicio === "OJO DERECHO");
    const oi = lista.find((item) => item.servicio === "OJO IZQUIERDO");
    return {
      od: od ? od.label : "",
      oi: oi ? oi.label : "",
    };
  };



  useEffect(() => {
    if (selectedPaciente) {
      const pacienteSeleccionado = pacientes.find(
        (paciente) => paciente.id_paciente === selectedPaciente
      );
      if (pacienteSeleccionado) {
        setTelefono(pacienteSeleccionado.celular || '');
        setCedula(pacienteSeleccionado.nro_cedula || '');
        setTieneFactura(!!pacienteSeleccionado.factura);
      } else {
        setTelefono('');
        setCedula('');
        setTieneFactura(false);
      }
    } else {
      setTelefono('');
      setCedula('');
      setTieneFactura(false);
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
    dispatch(fetchMarcas({}));
    dispatch(fetchMarcasOnefit({}));
    dispatch(fetchMarcasOnefitMed({}));
  }, []);

  const handleSubmit = async (values) => {
    try {
      const cristalPorOjo = extraerPorOjo(serviciosRealizados);
      const materialPorOjo = extraerPorOjo(materialesSeleccionados);
      const tratamientoPorOjo = extraerPorOjo(tratamientosFiltros);

      const transformedValues = {
        ...values,
        id_paciente: selectedPaciente,

        tipo_cristal_od: cristalPorOjo.od,
        tipo_cristal_oi: cristalPorOjo.oi,

        material_od: materialPorOjo.od,
        material_oi: materialPorOjo.oi,

        tratamientos_od: tratamientoPorOjo.od,
        tratamientos_oi: tratamientoPorOjo.oi,

        tipo_corredor: tipoCorredor,

        aro_centevi: aroCentevi ? 1 : 0,
        aro_propio: aroCentevi ? 0 : 1,
        ...(esAro ? { tipo_aro: tipoAro } : {}),
        ...(esOneFit ? { ...oneFitValues } : {}),
        ...(esOneFitMed ? { ...oneFitMedValues } : {}),
        doctor: doctorSeleccionado,
        elaborado_por: usuario?.usuario?.id_usuario,
        tipo_lente: tipoLente,
      };

      const response = await dispatch(createOrdenes(transformedValues)).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'Receta creada',
        html: `La receta se ha creado exitosamente. Número de orden: 
      <b style="font-size: 25px;">${response.data[0].nro_orden_id}</b>`,
      }).then(() => {
        navigate(-1);
      });

    } catch (error) {
      console.error('Error al crear receta:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.message || 'Hubo un problema al crear la receta. Por favor, intenta de nuevo.',
      });
    }
  };


  const handleTipoLenteChange = (value, setFieldValue) => {
    if (value === tipoLente) return;

    const nuevoLabel =
      TIPO_LENTE_OPTIONS.find((o) => o.value === value)?.label || value;

    Swal.fire({
      title: `¿Estás seguro de cambiar a ${nuevoLabel.toLowerCase()}?`,
      text: `Esto cambiará el formulario al modo ${nuevoLabel.toLowerCase()}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (!result.isConfirmed) return;

      setTipoLente(value);
      setFieldValue("marca", "");
      setFieldValue("marca_oi", "");
      setOneFitValues(ONE_FIT_INITIAL);
      setOneFitMedValues(ONE_FIT_MED_INITIAL);
      setTipoAro(null);
      setFieldValue("tipo_aro", "");
      setFieldValue("color", "");
      setFieldValue("aro_centevi", "");
      setFieldValue("aro_propio", "");
      setServiciosRealizados([]);
      setIsLeftEye(false);
      setSelectedMarca(null);
      setFieldValue("tipo_cristal_od", "");
      setFieldValue("tipo_cristal_oi", "");
      setFieldValue("tipo_corredor", "");
      setMaterialesSeleccionados([]);
      setIsLeftEyeMaterial(false);
      setDoctorSeleccionado(null)
      setFieldValue("material_od", "");
      setFieldValue("material_oi", "");
      setTratamientosFiltros([]);
      setIsLeftEyeTratamientos(false);

      setFieldValue("tratamientos_od", "");
      setFieldValue("tratamientos_oi", "");

      Swal.fire(
        nuevoLabel,
        `El tipo de lente ha sido actualizado a ${nuevoLabel.toLowerCase()}.`,
        'success'
      );
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
                          initialValues={{
                            ...initialValues,
                            tipo_lente: tipoLente,
                          }}
                          validationSchema={validationSchema}
                          onSubmit={handleSubmit}
                          enableReinitialize
                        >

                          {({ setFieldValue, values, isSubmitting }) => {

                            React.useEffect(() => {
                              setFieldValue('tipo_lente', tipoLente);
                            }, [tipoLente, setFieldValue]);
                            React.useEffect(() => {
                              setFieldValue('tieneFactura', tieneFactura);
                            }, [tieneFactura, setFieldValue]);
                            return (
                              <Form
                              >
                                <div className="form-row" style={{ marginBottom: "2rem" }}>

                                  <div className={tieneFactura ? "col-md-2" : "col-md-4"}>
                                    <img
                                      alt="logo"
                                      className="navbar-logo"
                                      src="img/centevi.png"
                                      style={{
                                        height: '80px',
                                        width: tieneFactura ? '250px' : undefined,
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

                                  <div className={tieneFactura ? "col-md-2" : "col-md-2"}>
                                    <h4>Nro. Cotización*</h4>
                                    <Field name="nro_cotizacion">
                                      {({ field }) => (
                                        <input
                                          {...field}
                                          type="text"
                                          placeholder="Ingrese el número de cotización"
                                          className="form-control"
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
                                    <ErrorMessage
                                      name="nro_cotizacion"
                                      component="div"
                                      style={{ color: "red", fontSize: "12px" }}
                                    />
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
                                      <ErrorMessage
                                        name="nro_factura"
                                        component="div"
                                        style={{ color: "red", fontSize: "12px" }}
                                      />
                                    </div>
                                  )}

                                  <div className={tieneFactura ? "col-md-2" : "col-md-2"}>
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

                                  <div className="col-md-2">
                                    <h4>Tipo de lente</h4>
                                    <Select
                                      value={tipoLente}
                                      options={TIPO_LENTE_OPTIONS}
                                      onChange={(value) => handleTipoLenteChange(value, setFieldValue)}
                                      style={{
                                        width: "100%",
                                        height: "40px",
                                      }}
                                    />
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
                                        setFieldValue("nro_factura", "");
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
                                              <td><input className="form-control" value={oneFitValues.poder_od} onChange={handleOneFitChange('poder_od')} /></td>
                                              <td><input className="form-control" value={oneFitValues.dia_od} onChange={handleOneFitChange('dia_od')} /></td>
                                              <td><input className="form-control" value={oneFitValues.edge_od} onChange={handleOneFitChange('edge_od')} /></td>
                                              <td><input className="form-control" value={oneFitValues.pfsd_od} onChange={handleOneFitChange('pfsd_od')} /></td>
                                              <td><input className="form-control" value={oneFitValues.cb_od} onChange={handleOneFitChange('cb_od')} /></td>
                                              <td><input className="form-control" value={oneFitValues.ct_od} onChange={handleOneFitChange('ct_od')} /></td>
                                            </tr>
                                            <tr>
                                              <td className="text-center">OI</td>
                                              <td><input className="form-control" value={oneFitValues.poder_oi} onChange={handleOneFitChange('poder_oi')} /></td>
                                              <td><input className="form-control" value={oneFitValues.dia_oi} onChange={handleOneFitChange('dia_oi')} /></td>
                                              <td><input className="form-control" value={oneFitValues.edge_oi} onChange={handleOneFitChange('edge_oi')} /></td>
                                              <td><input className="form-control" value={oneFitValues.pfsd_oi} onChange={handleOneFitChange('pfsd_oi')} /></td>
                                              <td><input className="form-control" value={oneFitValues.cb_oi} onChange={handleOneFitChange('cb_oi')} /></td>
                                              <td><input className="form-control" value={oneFitValues.ct_oi} onChange={handleOneFitChange('ct_oi')} /></td>
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
                                              <td><input className="form-control" value={oneFitMedValues.sag_od} onChange={handleOneFitMedChange('sag_od')} /></td>
                                              <td><input className="form-control" value={oneFitMedValues.poder_od} onChange={handleOneFitMedChange('poder_od')} /></td>
                                              <td><input className="form-control" value={oneFitMedValues.dia_od} onChange={handleOneFitMedChange('dia_od')} /></td>
                                              <td><input className="form-control" value={oneFitMedValues.mid_od} onChange={handleOneFitMedChange('mid_od')} /></td>
                                              <td><input className="form-control" value={oneFitMedValues.lim_od} onChange={handleOneFitMedChange('lim_od')} /></td>
                                              <td><input className="form-control" value={oneFitMedValues.pfsd_od} onChange={handleOneFitMedChange('pfsd_od')} /></td>
                                              <td><input className="form-control" value={oneFitMedValues.edg_od} onChange={handleOneFitMedChange('edg_od')} /></td>
                                              <td><input className="form-control" value={oneFitMedValues.ct_od} onChange={handleOneFitMedChange('ct_od')} /></td>
                                            </tr>
                                            <tr>
                                              <td className="text-center">OI</td>
                                              <td><input className="form-control" value={oneFitMedValues.sag_oi} onChange={handleOneFitMedChange('sag_oi')} /></td>
                                              <td><input className="form-control" value={oneFitMedValues.poder_oi} onChange={handleOneFitMedChange('poder_oi')} /></td>
                                              <td><input className="form-control" value={oneFitMedValues.dia_oi} onChange={handleOneFitMedChange('dia_oi')} /></td>
                                              <td><input className="form-control" value={oneFitMedValues.mid_oi} onChange={handleOneFitMedChange('mid_oi')} /></td>
                                              <td><input className="form-control" value={oneFitMedValues.lim_oi} onChange={handleOneFitMedChange('lim_oi')} /></td>
                                              <td><input className="form-control" value={oneFitMedValues.pfsd_oi} onChange={handleOneFitMedChange('pfsd_oi')} /></td>
                                              <td><input className="form-control" value={oneFitMedValues.edg_oi} onChange={handleOneFitMedChange('edg_oi')} /></td>
                                              <td><input className="form-control" value={oneFitMedValues.ct_oi} onChange={handleOneFitMedChange('ct_oi')} /></td>
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
                                                  as="input"
                                                  style={{
                                                    width: esAro ? '90px' : '120px',
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
                                                    width: esAro ? '90px' : '120px',
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
                                              {esAro ? (
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
                                                          setServiciosRealizados((prev) => {
                                                            const restante = prev.filter((s) => s.servicio !== servicio.servicio);
                                                            const siguesMultifocal = restante.some((s) => s.label.toLowerCase().includes("multifocal"));
                                                            if (!siguesMultifocal) setTipoCorredor('');
                                                            return restante;
                                                          });
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
                                          {tipoCristalMultifocal() && (
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
                                              >
                                              </Select>
                                            </>
                                          )}
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
                                                          setMaterialesSeleccionados((prev) => prev.filter((s) => s.servicio !== servicio.servicio));
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
                                                          setTratamientosFiltros((prev) => prev.filter((s) => s.servicio !== servicio.servicio));
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
                                        {esAro && (
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
                                        {esAro && (
                                          <Col xxl={5} xl={5} md={5}>
                                            <div>
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

                                        <Col xxl={esAro ? 9 : 12} xl={esAro ? 9 : 12} md={esAro ? 9 : 12}>
                                          {esAro && (
                                            <div>
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
                                          <div>
                                            <div style={{ marginTop: '1px' }}>
                                              <b>MARCA</b>
                                            </div>
                                            {esAro ? (

                                              <Field
                                                className="form-control"
                                                name="marca"
                                                style={{ marginLeft: '0px', height: '30px', display: 'block' }}
                                              />
                                            ) : (
                                              <div style={{ display: 'flex', gap: '10px' }}>
                                                <div style={{ flex: 1 }}>
                                                  <div style={{ marginBottom: '5px', fontSize: '12px' }}>Ojo Derecho</div>
                                                  <Select
                                                    name="marca"
                                                    value={values.marca || undefined}
                                                    placeholder="Selecciona la marca"
                                                    showSearch
                                                    style={{
                                                      width: "100%",
                                                      height: "48px",
                                                      color: "black",
                                                      fontWeight: "bold",
                                                    }}
                                                    onChange={(value) => {
                                                      setSelectedMarca(value);
                                                      setFieldValue("marca", value);
                                                    }}
                                                    filterOption={(input, option) =>
                                                      option.label.toLowerCase().includes(input.toLowerCase())
                                                    }
                                                    options={marcasOptions.map(marca => ({
                                                      value: marca.label,
                                                      label: marca.label,
                                                    }))}
                                                  />
                                                  <ErrorMessage name="marca" component="div" className="text-danger" />
                                                </div>

                                                <div style={{ flex: 1 }}>
                                                  <div style={{ marginBottom: '5px', fontSize: '12px' }}>Ojo Izquierdo</div>
                                                  <Select
                                                    name="marca_oi"
                                                    value={values.marca_oi || undefined}
                                                    placeholder="Selecciona la marca"
                                                    showSearch
                                                    style={{
                                                      width: "100%",
                                                      height: "48px",
                                                      color: "black",
                                                      fontWeight: "bold",
                                                    }}
                                                    onChange={(value) => {
                                                      setFieldValue("marca_oi", value);
                                                    }}
                                                    filterOption={(input, option) =>
                                                      option.label.toLowerCase().includes(input.toLowerCase())
                                                    }
                                                    options={marcasOptions.map(marca => ({
                                                      value: marca.label,
                                                      label: marca.label,
                                                    }))}
                                                  />
                                                  <ErrorMessage name="marca_oi" component="div" className="text-danger" />
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
                                            src="assets/img/recetas/lentessinbarilla.png"
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
                                <button
                                  className="btn btn-success mt-3"
                                  type="submit"
                                >
                                  Crear Receta
                                </button>
                              </Form>
                            )
                          }}
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
    </div >
  )
}

export default CreateOrden