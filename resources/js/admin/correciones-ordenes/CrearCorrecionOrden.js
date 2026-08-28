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
import { fetchMarcas } from '../../redux/features/marcas/marcasSlice';
import { fetchMarcasOnefit } from '../../redux/features/marcas-onefit/marcasOnefitSlice';
import { fetchMarcasOnefitMed } from '../../redux/features/marcas-onefit-med/marcasOnefitMedSlice';



const ONE_FIT_INITIAL = {
  poder_od: '', dia_od: '', edge_od: '', pfsd_od: '', cb_od: '', ct_od: '',
  rx_oi: '', poder_oi: '', dia_oi: '', edge_oi: '', pfsd_oi: '', cb_oi: '', ct_oi: '',
};

const ONE_FIT_MED_INITIAL = {
  sag_od: '', poder_od: '', dia_od: '', mid_od: '', lim_od: '', pfsd_od: '', edg_od: '', ct_od: '',
  sag_oi: '', poder_oi: '', dia_oi: '', mid_oi: '', lim_oi: '', pfsd_oi: '', edg_oi: '', ct_oi: '',
};

const CreateCorrecionOrden = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const { pacienteOrden } = location.state || {};
  const [selectedOrden, setSelectedOrden] = useState(pacienteOrden?.id_orden);
  const { pacientes_options_selecteds } = useSelector((state) => state.pacientes);
  const { usuario } = useSelector((state) => state.auth);
  const { usuarios_doctores_options_selecteds } = useSelector((state) => state.usuarios)
  const { cristales_options_selecteds } = useSelector((state) => state.cristales)
  const { materiales_options_selecteds } = useSelector((state) => state.materiales)
  const { tratamientos_options_selecteds } = useSelector((state) => state.tratamientos)
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [selectedMarca, setSelectedMarca] = useState(pacienteOrden?.marca);
  const [selectedMarcaOI, setSelectedMarcaOI] = useState(pacienteOrden?.marca_oi);
  const [lenteContacto, setLenteContacto] = useState(false);
  // const [isRowVisible, setIsRowVisible] = useState(true);
  // const [isImageVisible, setIsImageVisible] = useState(true);
  // const [isAroVisible, setIsAroVisible] = useState(true);
  const [aroCentevi, setAroCentevi] = useState(false);
  const { marcas_options_selecteds } = useSelector((state) => state.marcas)
  const { sucursales_option_selects } = useSelector((state) => state.sucursales);
  const [selectedSucursal, setSelectedSucursal] = useState('');
  const [cedula, setCedula] = useState('');
  const [telefono, setTelefono] = useState('');
  const [tipoLente, setTipoLente] = useState('aro');
  const esAro = tipoLente === 'aro';
  const esOneFit = tipoLente === 'onefit';
  const esOneFitMed = tipoLente === 'onefitmed';
  const {
    marcas_one_fit_options_selecteds,
  } = useSelector((state) => state.marcasOnefit);
  const {
    marcas_one_fit_med_options_selecteds,
  } = useSelector((state) => state.marcasOnefitMed);

  const [oneFitValues, setOneFitValues] = useState(ONE_FIT_INITIAL);
  const handleOneFitChange = (field) => (e) => {
    const { value } = e.target;
    setOneFitValues((prev) => ({ ...prev, [field]: value }));
  };

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

  useEffect(() => {
    if (pacientes_options_selecteds.length > 0) {
      setSelectedPaciente(Number(pacienteOrden?.id_paciente));
      setSelectedSucursal(pacienteOrden?.id_sucursal);
    }
  }, [id, pacientes_options_selecteds]);

  useEffect(() => {
    dispatch(fetchUsuarios({}))
    dispatch(fecthOrdenes({}))
    dispatch(fetchCristales({}))
    dispatch(fetchMateriales({}))
    dispatch(fetchTratamientos({}))
    dispatch(fetchMarcas({}))
    dispatch(fetchMarcasOnefit({}));
    dispatch(fetchMarcasOnefitMed({}));
    dispatch(fetchSucursales({ page: 1, limit: 100 }));
    if (pacientes_options_selecteds.length === 0) {
      dispatch(fetchPacientes({ page: 1, limit: 50000 }));
    }

  }, []);

  useEffect(() => {
    if (pacienteOrden?.aro_centevi !== undefined) {
      setAroCentevi(pacienteOrden?.aro_centevi === 1);
    }
  }, [pacienteOrden]);

  useEffect(() => {
    if (selectedPaciente) {
      const pacienteSeleccionado = pacientes_options_selecteds.find(
        (paciente) => paciente.value === Number(selectedPaciente)
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
  }, [selectedPaciente, pacientes_options_selecteds]);


  const initialValues = {
    nro_cotizacion: pacienteOrden?.nro_cotizacion,
    ordenes_id: pacienteOrden?.id_orden,
    nro_orden_id: pacienteOrden?.nro_orden_id,
    esfera_od: pacienteOrden?.esfera_od,
    esfera_oi: pacienteOrden?.esfera_oi,
    cilindro_od: pacienteOrden?.cilindro_od,
    cilindro_oi: pacienteOrden?.cilindro_oi,
    eje_od: pacienteOrden?.eje_od,
    eje_oi: pacienteOrden?.eje_oi,
    add_od: pacienteOrden?.add_od,
    add_oi: pacienteOrden?.add_oi,
    prisma_od: pacienteOrden?.prisma_od,
    prisma_oi: pacienteOrden?.prisma_oi,
    distancia_od: pacienteOrden?.distancia_od,
    distancia_oi: pacienteOrden?.distancia_oi,
    altura_od: pacienteOrden?.altura_od,
    altura_oi: pacienteOrden?.altura_oi,
    tipo_cristal_od: "",
    tipo_cristal_oi: "",
    material_od: "",
    material_oi: "",
    tratamientos_od: "",
    tratamientos_oi: "",
    aro_centevi: pacienteOrden?.aro_centevi,
    aro_propio: pacienteOrden?.aro_propio,
    codigo: pacienteOrden?.codigo,
    color: pacienteOrden?.color,
    marca: pacienteOrden?.marca,
    marca_oi: pacienteOrden?.marca_oi,
    tipo_aro: pacienteOrden?.tipo_aro,
    observaciones: pacienteOrden?.observaciones,
    doctor: pacienteOrden?.doctor,
    l_uno: pacienteOrden?.l_uno,
    l_dos: pacienteOrden?.l_dos,
    l_tres: pacienteOrden?.l_tres,
    l_cuatro: '',
    l_cinco: '',
    pagado: '',
    lenteContacto: false,
    tipo_lente: pacienteOrden.tipo_lente || 'aro',
  };

  const [formValues, setFormValues] = useState({
    nro_cotizacion: pacienteOrden?.nro_cotizacion,
    ordenes_id: '',
    nro_orden_id: '',
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
    tipo_cristal_od: "",
    tipo_cristal_oi: "",
    material_od: "",
    material_oi: "",
    tratamientos_od: "",
    tratamientos_oi: "",
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
    pagado: '',
    lenteContacto: false,
    tipo_lente: pacienteOrden.tipo_lente || 'aro',
  });

  useEffect(() => {
    if (pacienteOrden) {
      setSelectedPaciente(pacienteOrden?.id_paciente);
      setSelectedSucursal(pacienteOrden?.id_sucursal);
      setDoctorSeleccionado(pacienteOrden?.doctor);
      setTipoAro(pacienteOrden?.tipo_aro);
      setSelectedMarca(pacienteOrden?.marca);
      setSelectedMarcaOI(pacienteOrden?.marca_oi);
      setLenteContacto(pacienteOrden?.lente_contacto)
      const tipo = pacienteOrden?.tipo_lente || 'aro';
      setTipoLente(tipo);
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
      setServiciosRealizados([
        pacienteOrden?.tipo_cristal_od ? {
          value: pacienteOrden.tipo_cristal_od,
          label: pacienteOrden.tipo_cristal_od,
          ojo: "Ojo Derecho"
        }
          : null,
        pacienteOrden?.tipo_cristal_oi ?
          {
            value: pacienteOrden.tipo_cristal_oi,
            label: pacienteOrden.tipo_cristal_oi,
            ojo: "Ojo Izquierdo"
          }
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
      setFormValues((prevValues) => ({
        ...prevValues,
        ordenes_id: pacienteOrden?.id_orden,
        nro_orden: pacienteOrden.nro_orden || '',
        nro_orden_id: pacienteOrden.nro_orden_id || '',
        nro_cotizacion: pacienteOrden.nro_cotizacion || '',
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
        tipo_cristal_od: '',
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
        marca_oi: pacienteOrden.marca || '',
        tipo_aro: pacienteOrden.tipo_aro || '',
        observaciones: pacienteOrden.observaciones || '',
        doctor: pacienteOrden.doctor || '',
        l_uno: pacienteOrden.l_uno || '',
        l_dos: pacienteOrden.l_dos || '',
        l_tres: pacienteOrden.l_tres || '',
        l_cuatro: pacienteOrden.l_cuatro || '',
        l_cinco: pacienteOrden.l_cinco || '',
        lenteContacto: Boolean(pacienteOrden.lente_contacto),
      }));
    }
  }, [pacienteOrden]);

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
    tipo_aro: Yup.string().when('lente_contacto', {
      is: false,
      then: (schema) => schema.required("Seleccione un tipo de aro"),
      otherwise: (schema) => schema.notRequired(),
    }),
    doctor: Yup.string()
      .nullable()
      .required("Seleccione un doctor"),
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

  const [serviciosRealizados, setServiciosRealizados] = useState([
    pacienteOrden?.tipo_cristal_od ? {
      value: pacienteOrden?.tipo_cristal_od,
      label: pacienteOrden?.tipo_cristal_od,
      ojo: "Ojo Derecho"
    } : null,
    pacienteOrden?.tipo_cristal_oi ? {
      value: pacienteOrden?.tipo_cristal_oi,
      label: pacienteOrden?.tipo_cristal_oi,
      ojo: "Ojo Izquierdo"
    } : null,
  ].filter(Boolean));
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState([
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
  const [tratamientosFiltros, setTratamientosFiltros] = useState([
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
  const [tipoAro, setTipoAro] = useState(pacienteOrden?.tipo_aro);
  const [doctorSeleccionado, setDoctorSeleccionado] = useState(pacienteOrden?.doctor)
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

  const extraerPorOjo = (lista) => {
    const od = lista.find((item) => item.ojo === "Ojo Derecho");
    const oi = lista.find((item) => item.ojo === "Ojo Izquierdo");
    return { od: od ? od.label : "", oi: oi ? oi.label : "" };
  };


  const handleSubmit = async (values) => {
    const cristalPorOjo = extraerPorOjo(serviciosRealizados);
    const materialPorOjo = extraerPorOjo(materialesSeleccionados);
    const tratamientoPorOjo = extraerPorOjo(tratamientosFiltros);

    const transformedValues = {
      ...values,
      tipo_cristal_od: cristalPorOjo.od,
      tipo_cristal_oi: cristalPorOjo.oi,
      material_od: materialPorOjo.od,
      material_oi: materialPorOjo.oi,
      tratamientos_od: tratamientoPorOjo.od,
      tratamientos_oi: tratamientoPorOjo.oi,
      doctor: doctorSeleccionado,
      elaborado_por: usuario?.usuario?.id_usuario,
      lente_contacto: lenteContacto,
      tipo_lente: tipoLente,
      ...(esAro
        ? { aro_centevi: aroCentevi ? 1 : 0, aro_propio: aroCentevi ? 0 : 1, tipo_aro: tipoAro }
        : { aro_centevi: 0, aro_propio: 0, tipo_aro: null }),
      ...(esOneFit ? { ...oneFitValues } : {}),
      ...(esOneFitMed ? { ...oneFitMedValues } : {}),
      ...(tipoLente !== 'aro'
        ? { marca: selectedMarca || '', marca_oi: selectedMarcaOI || '' }
        : {}),
    };

    try {
      await dispatch(createCorrecionesOrdenes(transformedValues)).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'Receta creada',
        text: 'Correción creada exitosamente.',
      }).then(() => {
        navigate(-1);
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al crear la corrección',
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
                          enableReinitialize
                          initialValues={{
                            ...formValues
                          }}
                          validationSchema={validationSchema}
                          onSubmit={handleSubmit}
                        >

                          {({ setFieldValue, values }) => {
                            return (
                              <Form
                              >
                                <div className="form-row" style={{ marginBottom: "2rem" }}>
                                  <div
                                    className="col-md-4"
                                    style={{
                                      position: 'relative'
                                    }}
                                  >
                                    <div style={{
                                      position: "absolute",
                                      bottom: "10px",
                                      left: "0"
                                    }}>
                                      <Link
                                        to={selectedPaciente ? `/historia-paciente/${selectedPaciente}` : '#'}
                                        style={{
                                          pointerEvents: selectedPaciente ? 'auto' : 'none',
                                          opacity: selectedPaciente ? 1 : 0.5,
                                          cursor: selectedPaciente ? 'pointer' : 'not-allowed',
                                          display: 'block', // Make link block-level
                                          width: '100%', // Take full width of parent
                                          textAlign: 'center' // Center the button
                                        }}
                                      >
                                        <a className="btn btn-success">Ir a la Historia del paciente</a>
                                      </Link>
                                    </div>
                                  </div>

                                  <div className="col-md-2">
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
                                          style={{
                                            fontWeight: "bold",
                                            marginBottom: "1rem",
                                            height: "40px",
                                            fontSize: "12px",
                                            paddingLeft: "8px",
                                            "::placeholder": {
                                              fontSize: "12px"
                                            }
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

                                  <div class="col-md-2"  >
                                    <h4>Nro. pacienteOrden*</h4>
                                    <Input
                                      name="nro_orden_id"
                                      value={values.nro_orden_id}
                                      onChange={(e) => {
                                        const onlyNumbers = e.target.value.replace(/\D/g, "");
                                        setFieldValue("nro_orden_id", onlyNumbers);
                                      }}
                                      disabled
                                      placeholder="Ingrese el número de pacienteOrden"
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
                                  <div className="form-group col-md-4" >
                                    <label htmlFor="pacientes">Pacientes*</label>
                                    <Select
                                      showSearch
                                      value={selectedPaciente}
                                      onChange={(value) => {
                                        setSelectedPaciente(value);
                                        setFieldValue("id_paciente", value);
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
                                                  // width: '175px'
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
                                                          setServiciosRealizados(prev => prev.filter(s => s.ojo !== servicio.ojo));
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
                                                          setMaterialesSeleccionados(prev => prev.filter(s => s.ojo !== servicio.ojo));
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
                                                          setTratamientosFiltros(prev => prev.filter(s => s.ojo !== servicio.ojo));
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

                                        <Col xxl={esAro ? 9 : 12} xl={esAro ? 9 : 12} md={esAro ? 9 : 12}>
                                          {esAro && (
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
                                                    value={selectedMarca}
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
                                                    value={selectedMarcaOI}
                                                    placeholder="Selecciona la marca"
                                                    showSearch
                                                    style={{
                                                      width: "100%",
                                                      height: "48px",
                                                      color: "black",
                                                      fontWeight: "bold",
                                                    }}
                                                    onChange={(value) => {
                                                      setSelectedMarcaOI(value);
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
    </div>
  )
}

export default CreateCorrecionOrden