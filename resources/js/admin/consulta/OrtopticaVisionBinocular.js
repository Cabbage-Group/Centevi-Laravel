import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice.js';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice.js';
import { crearOrtoptica } from '../../redux/features/consultas/OrtopticaV_BSlice.js';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const OrtopticaVisionBinocular = () => {
    const dispatch = useDispatch();
    const { pacientes } = useSelector((state) => state.pacientes);
    const { sucursales } = useSelector((state) => state.sucursales);
    const { status, error } = useSelector((state) => state.ortoptica);
    const [selectedPaciente, setSelectedPaciente] = useState(null);
    const initialValues = {
        sucursal: '',
        doctor: 'Dr. Diego',
        id_terapia: '2',
        paciente: '',
        edad: '35',
        fecha_atencion: '',
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
        lensometria: [
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
        ],
        lensometria_extra: [
            {
                len_tipo_lentes: '',
                len_filtros: '',
                len_tiempo: '',
                len_tipo_arco: ''
            },
        ],
        sa_pp: [
            {
                sa_od: '',
                pp_od: '',
                sa_oi: '',
                pp_oi: ''
            },
        ],
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
            helshoswky:"",
            von_graefe:"",
        },
        refraccion: {
            esfera_od_f:"",
            cilindro_od_f:"",
            eje_od_f:"",
            p_base_od_f:"",
            add_od_f:"",
            agz_od_f:"",
            esfera_oi_f:"",
            cilindro_oi_f:"",
            eje_oi_f:"",
            p_base_oi_f:"",
            add_oi_f:"",
            agz_oi_f:""
        },
        lentes_contacto: {
            poder_od:"",
            poder_oi:"",
            cb_od:"",
            cb_oi:"",
            dia_od:"",
            dia_oi:"",
            lente_marca:"",
            lente_tipo:"",
            lente_marca_1:"",
            lente_pd_1:"",
            lente_dnp_1:"",
            lente_altura_1:""
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
        acomodacion:{
            aa_od:"",
            aa_oi:"",
            fan_od:"",
            fan_cpm:"",
            aco_oi:"",
            aco_cpm:"",
            acp_fab:"",
            aco_falla:""
        },
        acomodacion_extra:{
            mem_od:"",
            mem_oi:"",
            mem_arn:"",
            mem_arp:""
        },
        vergencia:{
            v_vt_vl:"",
            v_bt_vp:"",
            v_bn_vl:"",
            v_bn_vp:""
        },
        conducta_seguir: '',
        plan_versiones: '',
        fecha_creacion: '',
        editado: {
            doctor:'',
            fecha_edicion:''
        },
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
        const { value } = e.target;
        console.log(value);
        setSelectedPaciente(value);
        setFieldValue('paciente', value);
    };

    return (
        <div className="admin-data-content" data-select2-id="12" style={{ marginTop: '50px'}}>
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
                                                onSubmit={(values, { setSubmitting }) => {
                                                    console.log('Form values:', values);
                                                    dispatch(crearOrtoptica(values));
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
                                                                <Field as="select" name="paciente" className="form-control form-small" onChange={(e) => handlePacienteChange(e, setFieldValue)}>
                                                                    <option value="">Seleccione el paciente</option>
                                                                    {pacientes.map((paciente) => (
                                                                        <option key={paciente.id_paciente} value={paciente.id_paciente}>
                                                                            Numero Cedula: {paciente.nro_cedula} || Nombres: {paciente.nombres} {paciente.apellidos}
                                                                        </option>
                                                                    ))}
                                                                </Field>
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
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-3">
                                                                <label htmlFor="inputAddress">
                                                                    Fecha de atencion
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="inputAddress"
                                                                    max="2024-07-05"
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
                                                                    as="i"
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
                                                                    as="i"
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
                                                                    as="i"
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
                                                                    as="i"
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
                                                                    as="i"
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
                                                                                        name="av/sc_od_vl"
                                                                                        placeholder=""
                                                                                        as="input"
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <Field
                                                                                        className="form-control"
                                                                                        name="av/sc_oi_vl"
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
                                                                                        name="av/sc_od_vp"
                                                                                        placeholder=""
                                                                                        as="input"
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <Field
                                                                                        className="form-control"
                                                                                        name="av/sc_oi_vp"
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
                                                                                        name="av/sc_od_ph"
                                                                                        placeholder=""
                                                                                        as="input"
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <Field
                                                                                        className="form-control"
                                                                                        name="av/sc_oi_ph"
                                                                                        placeholder=""
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
                                                                                        placeholder=""
                                                                                        as="input"
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <Field
                                                                                        className="form-control"
                                                                                        name="av/cc_oi_vl"
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
                                                                                        name="av/cc_od_vp"
                                                                                        placeholder=""
                                                                                        as="input"
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <Field
                                                                                        className="form-control"
                                                                                        name="av/cc_oi_vp"
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
                                                                                        name="av/cc_od_ph"
                                                                                        placeholder=""
                                                                                        as="input"
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <Field
                                                                                        className="form-control"
                                                                                        name="av/cc_oi_ph"
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
                                                                                    name="esfera_od"
                                                                                    placeholder=""
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="cilindro_od"
                                                                                    placeholder=""
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="eje_od"
                                                                                    placeholder=""
                                                                                    as="input"
                                                                                />    
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="p_base_od"
                                                                                    placeholder="△"
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="add_od"
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
                                                                                    name="esfera_oi"
                                                                                    placeholder=""
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="cilindro_oi"
                                                                                    placeholder=""
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="eje_oi"
                                                                                    placeholder=""
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="p_base_oi"
                                                                                    placeholder="△"
                                                                                    as="input"
                                                                                />    
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="add_oi"
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
                                                                    name="len_tipo_lentes"
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-3">
                                                                <label htmlFor="objetivos">
                                                                    Filtros
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    name="len_filtros"
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-3">
                                                                <label htmlFor="objetivos">
                                                                    Tiempo
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    name="len_tiempo"
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-3">
                                                                <label htmlFor="objetivos">
                                                                    Tipo de Aro
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    name="len_tipo_arco"
                                                                    as="i"
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
                                                                    name="sa_od"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-3">
                                                                <Field
                                                                    className="form-control"
                                                                    name="pp_od"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-row mb-4">
                                                            <div className="form-group col-md-3">
                                                                <Field
                                                                    className="form-control"
                                                                    name="sa_oi"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-3">
                                                                <Field
                                                                    className="form-control"
                                                                    name="pp_oi"
                                                                    placeholder=""
                                                                    as="i"
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
                                                                    name="viscopia_od"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="v_oi">
                                                                    OI
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="v_oi"
                                                                    name="viscopia_oi"
                                                                    placeholder=""
                                                                    as="i"
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
                                                                    name="hirschberg"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="tratamientos">
                                                                    Krismsky
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="krismsky"
                                                                    name="krismsky"
                                                                    placeholder=""
                                                                    as="i"
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
                                                                    name="ct_vl"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="VP">
                                                                    VP
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="VP"
                                                                    name="ct_vp"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="maddox">
                                                                    MADDOX:
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="maddox"
                                                                    name="maddox"
                                                                    placeholder=""
                                                                    as="i"
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
                                                                    name="seguimiento_ao"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="tratamientos">
                                                                    Sacádicos(AO):{' '}
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="sacadicos"
                                                                    name="sacadicos_ao"
                                                                    placeholder=""
                                                                    as="i"
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
                                                                    name="ppc_or"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-2">
                                                                <label htmlFor="tratamientos">
                                                                    L:{' '}
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="ppc_l"
                                                                    name="ppc_l"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-2">
                                                                <label htmlFor="tratamientos">
                                                                    FR:{' '}
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="ppc_fr"
                                                                    name="ppc_fr"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="tratamientos">
                                                                    Posicion compensatoria:{' '}
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="ppc_posicion"
                                                                    name="ppc_posicion"
                                                                    placeholder=""
                                                                    as="i"
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
                                                                    name="helshoswky"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="tratamientos">
                                                                    VON GRAEFE
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="von_graefe"
                                                                    name="von_graefe"
                                                                    placeholder=""
                                                                    as="i"
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
                                                                                placeholder=""
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="vp_luces"
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
                                                                                name="vl_bg"
                                                                                placeholder=""
                                                                                as="input"
                                                                            />    
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="vp_bg"
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
                                                                    name="randot"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-3">
                                                                <label htmlFor="inputAddress">
                                                                    Lang:
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="inputAddress"
                                                                    name="lang"
                                                                    placeholder=""
                                                                    as="i"
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
                                                                    name="vision_color"
                                                                    placeholder=""
                                                                    as="i"
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
                                                                    name="aa_od"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-3">
                                                                <label htmlFor="inputAddress">
                                                                    OI
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="inputAddress"
                                                                    name="aa_oi"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-3">
                                                                <label htmlFor="inputAddress">
                                                                    FAM: OD
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="inputAddress"
                                                                    name="fan_od"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-3">
                                                                <label htmlFor="inputAddress">
                                                                    OI
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="inputAddress"
                                                                    name="fan_cpm"
                                                                    placeholder=""
                                                                    as="i"
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
                                                                    name="aco_oi"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-3">
                                                                <label htmlFor="inputAddress">
                                                                    MEM: OD
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="inputAddress"
                                                                    name="aco_cpm"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-3">
                                                                <label htmlFor="inputAddress">
                                                                    OI
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="inputAddress"
                                                                    name="acp_fab"
                                                                    placeholder=""
                                                                    as="i"
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
                                                                    name="mem_arn"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-3">
                                                                <label htmlFor="inputAddress">
                                                                    ARP
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="inputAddress"
                                                                    name="mem_arp"
                                                                    placeholder=""
                                                                    as="i"
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
                                                                    name="v_vt_vl"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-3">
                                                                <label htmlFor="inputAddress">
                                                                    BT/VP
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="inputAddress"
                                                                    name="v_bt_vp"
                                                                    placeholder=""
                                                                    as="i"
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
                                                                    name="v_bn_vl"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-3">
                                                                <label htmlFor="inputAddress">
                                                                    BN/VP
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="inputAddress"
                                                                    name="v_bn_vp"
                                                                    placeholder=""
                                                                    as="i"
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
                                                                                    name="esfera_od_f"
                                                                                    placeholder=""
                                                                                    as="input"
                                                                                    />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="cilindro_od_f"
                                                                                    placeholder=""
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="eje_od_f"
                                                                                    placeholder=""
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="p_base_od_f"
                                                                                    placeholder="△"
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="add_od_f"
                                                                                    placeholder=""
                                                                                    as="input"
                                                                                />   
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="agz_od_f"
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
                                                                                    name="esfera_oi_f"
                                                                                    placeholder=""
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="cilindro_oi_f"
                                                                                    placeholder=""
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="eje_oi_f"
                                                                                    placeholder=""
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="p_base_oi_f"
                                                                                    placeholder="△"
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="add_oi_f"
                                                                                    placeholder=""
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="agz_oi_f"
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
                                                                    name="lente_marca_1"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-2">
                                                                <label htmlFor="inputAddress">
                                                                    PD
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="inputAddress"
                                                                    name="lente_pd_1"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-2">
                                                                <label htmlFor="inputAddress">
                                                                    DNP
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="inputAddress"
                                                                    name="lente_dnp_1"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-2">
                                                                <label htmlFor="inputAddress">
                                                                    ALTURA
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="inputAddress"
                                                                    name="lente_altura_1"
                                                                    placeholder=""
                                                                    as="i"
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
                                                                                    name="poder_od"
                                                                                    placeholder=""
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="poder_oi"
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
                                                                                    name="cb_od"
                                                                                    placeholder=""
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="cb_oi"
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
                                                                                    name="dia_od"
                                                                                    placeholder=""
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="dia_oi"
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
                                                                    name="lente_marca"
                                                                    placeholder=""
                                                                    as="i"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="inputAddress">
                                                                    TIPO
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="inputAddress"
                                                                    name="lente_tipo"
                                                                    placeholder=""
                                                                    as="i"
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
        </div>
    )
}

export default OrtopticaVisionBinocular