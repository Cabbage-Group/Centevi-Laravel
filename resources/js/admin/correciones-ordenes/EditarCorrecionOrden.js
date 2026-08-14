import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import { Col, Input, Row, Select, Checkbox, Button, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { CloseCircleTwoTone, LoadingOutlined } from '@ant-design/icons';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { updateCorreccionOrden } from '../../redux/features/correciones-ordenes/correcionesOrdenesSlice';
import { fetchMarcas } from '../../redux/features/marcas/marcasSlice';
import { fetchCristales } from '../../redux/features/cristales/cristalesSlice';
import { fetchMateriales } from '../../redux/features/materiales/materialesSlice';
import { fetchTiposAros } from '../../redux/features/tipos-aros/tiposArosSlice';
import { fetchTratamientos } from '../../redux/features/tratamientos/tratamientosSlice';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice';
import { fetchMarcasOnefit } from '../../redux/features/marcas-onefit/marcasOnefitSlice';
import { fetchMarcasOnefitMed } from '../../redux/features/marcas-onefit-med/marcasOnefitMedSlice';

const ONE_FIT_INITIAL = {
  poder_od: '', dia_od: '', edge_od: '', pfsd_od: '', cb_od: '', ct_od: '',
  poder_oi: '', dia_oi: '', edge_oi: '', pfsd_oi: '', cb_oi: '', ct_oi: '',
};

const ONE_FIT_MED_INITIAL = {
  sag_od: '', poder_od: '', dia_od: '', mid_od: '', lim_od: '', pfsd_od: '', edg_od: '', ct_od: '',
  sag_oi: '', poder_oi: '', dia_oi: '', mid_oi: '', lim_oi: '', pfsd_oi: '', edg_oi: '', ct_oi: '',
};

const EditarCorrecionOrden = ({
  fecha_solicitud,
  correcionOrden,
  statusCorreccionOrden
}) => {
  const isLoadingData = statusCorreccionOrden === "loading" || statusCorreccionOrden === "idle";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { correccionOrderId } = useParams();
  const { usuario } = useSelector((state) => state.auth);
  const { usuarios_doctores_options_selecteds } = useSelector((state) => state.usuarios);
  const { pacientes_options_selecteds } = useSelector((state) => state.pacientes);
  const { sucursales_option_selects } = useSelector((state) => state.sucursales);
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('Sr(a) paciente {nombre}, sus lentes estan listos para retirar, puede pasar a retirarlos en la sucursal {sucursal');
  const [isLeftEye, setIsLeftEye] = useState(false);
  const [isLeftEyeMaterial, setIsLeftEyeMaterial] = useState(false);
  const [isLeftEyeTratamientos, setIsLeftEyeTratamientos] = useState(false);
  const [lenteContacto, setLenteContacto] = useState(false);
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [selectedMarca, setSelectedMarca] = useState('');
  const [selectedMarcaOI, setSelectedMarcaOI] = useState('');
  const [selectedAsesor, setSelectedAsesor] = useState('');
  const [serviciosRealizados, setServiciosRealizados] = useState([]);
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState([]);
  const [tratamientosFiltros, setTratamientosFiltros] = useState([]);
  const [aroCentevi, setAroCentevi] = useState(false);
  const [tipoAro, setTipoAro] = useState('');
  const [doctorSeleccionado, setDoctorSeleccionado] = useState('')
  const { marcas_options_selecteds } = useSelector((state) => state.marcas)
  const { cristales_options_selecteds } = useSelector((state) => state.cristales)
  const { materiales_options_selecteds } = useSelector((state) => state.materiales)
  const { tratamientos_options_selecteds } = useSelector((state) => state.tratamientos)
  const { tipo_aro_options_selecteds } = useSelector((state) => state.tiposAros)
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [selectedSucursal, setSelectedSucursal] = useState('');
  const [cedula, setCedula] = useState('');
  const [isLoading, setisLoading] = useState('')
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
    const hasRightEye = serviciosRealizados.some(servicio => servicio.ojo === "Ojo Derecho");
    setIsLeftEye(hasRightEye);
  }, [serviciosRealizados]);
  useEffect(() => {
    Promise.all([
      dispatch(fetchMarcas({})),
      dispatch(fetchMarcasOnefit({})),
      dispatch(fetchMarcasOnefitMed({})),
      dispatch(fetchTratamientos({})),
      dispatch(fetchCristales({})),
      dispatch(fetchMateriales({})),
      dispatch(fetchTiposAros({})),
      dispatch(fetchSucursales({ page: 1, limit: 100 })),
    ]).finally(() => {
      setDataReady(true);
    });
  }, []);
  const [formValues, setFormValues] = useState({
    nro_cotizacion: '',
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
    tipo_aro: '',
    observaciones: '',
    doctor: '',
    l_uno: '',
    l_dos: '',
    l_tres: '',
    l_cuatro: '',
    l_cinco: ''
  });

  useEffect(() => {
    if (correcionOrden) {
      setSelectedPaciente(correcionOrden?.id_paciente);
      setSelectedSucursal(correcionOrden?.id_sucursal);
      setDoctorSeleccionado(correcionOrden?.doctor);
      setTipoAro(correcionOrden?.tipo_aro);
      setSelectedMarca(correcionOrden?.marca);
      setSelectedMarcaOI(correcionOrden?.marca_oi);
      setSelectedAsesor(correcionOrden?.elaborado_por_nombre);
      setLenteContacto(correcionOrden?.lente_contacto)
      setServiciosRealizados([
        correcionOrden?.tipo_cristal_od
          ? { value: correcionOrden.tipo_cristal_od, label: correcionOrden.tipo_cristal_od, ojo: "Ojo Derecho" }
          : null,
        correcionOrden?.tipo_cristal_oi
          ? { value: correcionOrden.tipo_cristal_oi, label: correcionOrden.tipo_cristal_oi, ojo: "Ojo Izquierdo" }
          : null,
      ].filter(Boolean));
      const tipo = correcionOrden?.tipo_lente || 'aro';
      setTipoLente(tipo);
      setOneFitValues({
        poder_od: correcionOrden?.poder_od || '',
        poder_oi: correcionOrden?.poder_oi || '',
        dia_od: correcionOrden?.dia_od || '',
        dia_oi: correcionOrden?.dia_oi || '',
        edge_od: correcionOrden?.edge_od || '',
        edge_oi: correcionOrden?.edge_oi || '',
        pfsd_od: correcionOrden?.pfsd_od || '',
        pfsd_oi: correcionOrden?.pfsd_oi || '',
        cb_od: correcionOrden?.cb_od || '',
        cb_oi: correcionOrden?.cb_oi || '',
        ct_od: correcionOrden?.ct_od || '',
        ct_oi: correcionOrden?.ct_oi || '',
      });

      setOneFitMedValues({
        sag_od: correcionOrden?.sag_od || '',
        sag_oi: correcionOrden?.sag_oi || '',
        poder_od: correcionOrden?.poder_od || '',
        poder_oi: correcionOrden?.poder_oi || '',
        dia_od: correcionOrden?.dia_od || '',
        dia_oi: correcionOrden?.dia_oi || '',
        mid_od: correcionOrden?.mid_od || '',
        mid_oi: correcionOrden?.mid_oi || '',
        lim_od: correcionOrden?.lim_od || '',
        lim_oi: correcionOrden?.lim_oi || '',
        pfsd_od: correcionOrden?.pfsd_od || '',
        pfsd_oi: correcionOrden?.pfsd_oi || '',
        edg_od: correcionOrden?.edg_od || '',
        edg_oi: correcionOrden?.edg_oi || '',
        ct_od: correcionOrden?.ct_od || '',
        ct_oi: correcionOrden?.ct_oi || '',
      });
      setMaterialesSeleccionados([
        correcionOrden?.material_od ? {
          value: correcionOrden?.material_od,
          label: correcionOrden?.material_od,
          ojo: "Ojo Derecho"
        } : null,
        correcionOrden?.material_oi ? {
          value: correcionOrden?.material_oi,
          label: correcionOrden?.material_oi,
          ojo: "Ojo Izquierdo"
        } : null,
      ].filter(Boolean));
      setTratamientosFiltros([
        correcionOrden?.tratamientos_od ? {
          value: correcionOrden?.tratamientos_od,
          label: correcionOrden?.tratamientos_od,
          ojo: "Ojo Derecho"
        } : null,
        correcionOrden?.tratamientos_oi ? {
          value: correcionOrden?.tratamientos_oi,
          label: correcionOrden?.tratamientos_oi,
          ojo: "Ojo Izquierdo"
        } : null,
      ].filter(Boolean));
      setFormValues((prevValues) => ({
        ...prevValues,
        nro_cotizacion: correcionOrden.nro_cotizacion || '',
        nro_orden: correcionOrden.nro_orden || '',
        nro_orden_id: correcionOrden.nro_orden_id || '',
        id_paciente: correcionOrden.id_paciente || '',
        id_sucursal: correcionOrden.id_sucursal || '',
        esfera_od: correcionOrden?.esfera_od || '',
        esfera_oi: correcionOrden.esfera_oi || '',
        cilindro_od: correcionOrden.cilindro_od || '',
        cilindro_oi: correcionOrden.cilindro_oi || '',
        eje_od: correcionOrden.eje_od || '',
        eje_oi: correcionOrden.eje_oi || '',
        add_od: correcionOrden.add_od || '',
        add_oi: correcionOrden.add_oi || '',
        prisma_od: correcionOrden.prisma_od || '',
        prisma_oi: correcionOrden.prisma_oi || '',
        distancia_od: correcionOrden.distancia_od || '',
        distancia_oi: correcionOrden.distancia_oi || '',
        altura_od: correcionOrden.altura_od || '',
        altura_oi: correcionOrden.altura_oi || '',
        tipo_cristal_od: '',
        tipo_cristal_oi: '',
        material_od: '',
        material_oi: '',
        tratamientos_od: '',
        tratamientos_oi: '',
        aro_centevi: correcionOrden.aro_centevi || '',
        aro_propio: correcionOrden.aro_propio || '',
        codigo: correcionOrden.codigo || '',
        color: correcionOrden.color || '',
        marca: correcionOrden.marca || '',
        tipo_aro: correcionOrden.tipo_aro || '',
        observaciones: correcionOrden.observaciones || '',
        doctor: correcionOrden.doctor || '',
        l_uno: correcionOrden.l_uno || '',
        l_dos: correcionOrden.l_dos || '',
        l_tres: correcionOrden.l_tres || '',
        l_cuatro: correcionOrden.l_cuatro || '',
        l_cinco: correcionOrden.l_cinco || '',
        lenteContacto: Boolean(correcionOrden.lente_contacto),
      }));
    }
  }, [correcionOrden]);

  useEffect(() => {
    if (selectedPaciente) {
      const pacienteSeleccionado = pacientes_options_selecteds.find(
        (paciente) => paciente.value === Number(selectedPaciente)
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
  }, [selectedPaciente, pacientes_options_selecteds]);

  const validationSchema = Yup.object().shape({
    elaborado_por: Yup.number().nullable(),
    aro_centevi: Yup.number().oneOf([0, 1]),
    aro_propio: Yup.number().oneOf([0, 1]),
    tipo_aro: Yup.string().when('lente_contacto', {
      is: false,
      then: (schema) => schema.required("Seleccione un tipo de aro"),
      otherwise: (schema) => schema.nullable(),
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
    if (correcionOrden?.aro_centevi !== undefined) {
      setAroCentevi(correcionOrden?.aro_centevi === 1);
    }
  }, [correcionOrden]);

  const handleSubmit = async (values) => {
    const serviciosRealizadosSubmit = serviciosRealizados.map(servicio => servicio.label);
    const materialesSeleccionadosSubmit = materialesSeleccionados.map(servicio => servicio.label)
    const tratamientosFiltrosSubmit = tratamientosFiltros.map(servicio => servicio.label)
    const transformedValues = {
      ...values,
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
      doctor: doctorSeleccionado,
      elaborado_por: usuario?.usuario?.id_usuario,
      lente_contacto: lenteContacto,
      tipo_lente: tipoLente,
      ...(esAro
        ? {
          aro_centevi: aroCentevi ? 1 : 0,
          aro_propio: aroCentevi ? 0 : 1,
          tipo_aro: tipoAro,
        }
        : {
          aro_centevi: 0,
          aro_propio: 0,
          tipo_aro: null,
        }
      ),
      ...(esOneFit
        ? {
          ...oneFitValues,
        }
        : {}),
      ...(esOneFitMed
        ? {
          ...oneFitMedValues,
        }
        : {}),
      ...(tipoLente !== 'aro'
        ? {
          marca: selectedMarca || '',
          marca_oi: selectedMarcaOI || '',
        }
        : {}),
    };
    const result = await dispatch(updateCorreccionOrden({ id: correccionOrderId, data: transformedValues }));

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
  const antIcon = (
    <LoadingOutlined style={{ fontSize: 40, color: "#52c41a" }} spin />
  );

  return (
    <div className="admin-data-content" data-select2-id="15">
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
                <div className="col-lg-12 layout-spacing" id="flFormsGrid">
                  <div className="statbox widget box box-shadow">
                    <div className="widget-header">
                      <div className="widget-content widget-content-area">
                        <Formik
                          initialValues={{ ...formValues }}
                          enableReinitialize
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
                                        {fecha_solicitud ? moment(fecha_solicitud).format('DD/MM/YYYY') : ''}
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
                                      disabled
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
                                      disabled
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
                                                      value={selectedAsesor}
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
                            )
                          }}
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

  )
}

export default EditarCorrecionOrden