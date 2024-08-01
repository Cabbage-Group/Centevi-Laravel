import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice.js';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice.js';
import { crearPediatrica } from '../../redux/features/consultas/OptometriaPediatricaSlice.js';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const OptometriaPediatra = () => {

    const dispatch = useDispatch();
    const { pacientes } = useSelector((state) => state.pacientes);
    const { sucursales } = useSelector((state) => state.sucursales);
    const { status, error } = useSelector((state) => state.optometriaPediatrica);
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
        desarrollo: '',
        nacimiento: '',
        parto: '',
        incubadora: '',
        tiempo: '',
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
                len_tipo_aro: ''
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
            ppc_posicion: ""
        },
        refraccion: {
            estatica_od: "",
            receta_od: "",
            av_od: "",
            estatica_oi: "",
            receta_oi: "",
            av_oi: ""
        },
        lentes_contacto:{
            poder_od:"",
            poder_oi:"",
            cb_od:"",
            cb_oi:"",
            dia_od:"",
            dia_oi:"",
            lente_marca:"",
            lente_tipo:""
        },
        pruebas:{
            vl_luces:"",
            vp_luces:"",
            vl_bg:"",
            vp_bg:""
        },
        pruebas_extras:{
            estereosis:"",
            randot:"",
            lang:"",
            seg_arco:"",
            vision_color:""
        },
        conducta_seguir: '',
        plan_versiones: '',
        fecha_creacion: '',
        editado: '',
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
                                                    Optometría Pediatrica
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
                                                dispatch(crearPediatrica(values));
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
                                                            <label htmlFor="edad">Edad</label>
                                                            <Field
                                                                as="input"
                                                                name="edad"
                                                                className="form-control"
                                                                id="edad"
                                                                readOnly
                                                            />
                                                            <ErrorMessage name="edad" component="div" className="text-danger" />
                                                        </div>
                                                        <div className="form-group col-md-3">
                                                            <label htmlFor="fecha_atencion">Fecha de atención</label>
                                                            <Field
                                                                type="date"
                                                                name="fecha_atencion"
                                                                className="form-control"
                                                                id="fecha_atencion"
                                                                max="2024-07-04"
                                                            />
                                                            <ErrorMessage name="fecha_atencion" component="div" className="text-danger" />
                                                        </div>
                                                    </div>
                                                    <div className="form-row mb-4">
                                                        <div className="form-group col-md-12">
                                                            <label htmlFor="m_c">Motivo de consulta</label>
                                                            <Field
                                                                as="textarea"
                                                                name="m_c"
                                                                className="form-control textarea"
                                                                id="m_c"
                                                                maxLength="10000"
                                                                rows="15"
                                                            />
                                                            <ErrorMessage name="m_c" component="div" className="text-danger" />
                                                        </div>
                                                    </div>
                                                    <div className="form-row mb-4">
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="lugarNacimiento">
                                                                Antecedentes Oculares
                                                            </label>
                                                            <Field
                                                                as="input"
                                                                className="form-control"
                                                                id="lugarNacimiento"
                                                                name="a_o"
                                                            />
                                                            <ErrorMessage name="a_o" component="div" className="text-danger" />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="inputAddress2">
                                                                Antecedentes Personales
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="inputAddress2"
                                                                name="a_p"
                                                                as="input"
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
                                                                as="input"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-row mb-4">
                                                        <div className="form-group col-md-12">
                                                            <label htmlFor="tratamientos">
                                                                Desarrollo del infante
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="tratamientos"
                                                                name="desarrollo"
                                                                as="input"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-row mb-4">
                                                        <div className="form-group col-md-3">
                                                            <label htmlFor="tratamientos">
                                                                Nacimiento
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="tratamientos"
                                                                name="nacimiento"
                                                                as="input"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-3">
                                                            <label htmlFor="tratamientos">
                                                                Parto
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="tratamientos"
                                                                name="parto"
                                                                as="input"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-3">
                                                            <label htmlFor="tratamientos">
                                                                Incubadora
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="incubadora"
                                                                name="incubadora"
                                                                as="input"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-3">
                                                            <label htmlFor="tratamientos">
                                                                Tiempo
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="tiempo"
                                                                name="tiempo"
                                                                as="input"
                                                            />
                                                        </div>
                                                    </div>
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
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="av/sc_oi_vl"
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
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="av/sc_oi_vp"
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
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="av/sc_oi_ph"
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
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="av/cc_oi_vl"
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
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="av/cc_oi_vp"
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
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="av/cc_oi_ph"
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
                                                            RECETA EN USO
                                                        </h5>
                                                        <div className="table-responsive">
                                                            <table className="table table-bordered">
                                                                <thead>
                                                                    <tr>
                                                                        <th className="text-center">
                                                                            RX
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
                                                                                name="p_base_od"
                                                                                placeholder="△"
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
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="text-center">
                                                                            Ojo Izquierdo
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
                                                                                name="p_base_oi"
                                                                                placeholder="△"
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
                                                                placeholder="len_tipo_aro"
                                                                as="input"
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
                                                                as="input"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-3">
                                                            <Field
                                                                className="form-control"
                                                                name="pp_od"
                                                                as="input"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-row mb-4">
                                                        <div className="form-group col-md-3">
                                                            <Field
                                                                className="form-control"
                                                                name="sa_oi"
                                                                as="input"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-3">
                                                            <Field
                                                                className="form-control"
                                                                name="pp_oi"
                                                                as="input"
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
                                                                id="D"
                                                                name="hirschberg"
                                                                as="input"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="tratamientos">
                                                                Krismsky
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="I"
                                                                name="krismsky"
                                                                as="input"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-row mb-4">
                                                        <div className="form-group col-md-12">
                                                            <label htmlFor="inputAddress">
                                                                VERSIONES:
                                                            </label>
                                                            <Field
                                                                as="textarea"
                                                                className="form-control textarea"
                                                                id="textarea"
                                                                maxLength="10000"
                                                                name="plan_versiones"
                                                                rows="15"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-row mb-4">
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="VL">
                                                                COVER TEST: VISION LEJANA:
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="VL"
                                                                name="ct_vl"
                                                                as="input"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="VP">
                                                                VISION PROXIMA
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="VP"
                                                                name="ct_vp"
                                                                as="input"
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
                                                                as="input"
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
                                                                id="ao"
                                                                name="seguimiento_ao"
                                                                as="input"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="tratamientos">
                                                                Sacádicos(AO):{' '}
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="ao"
                                                                name="sacadicos_ao"
                                                                as="input"
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
                                                                id="or"
                                                                name="ppc_or"
                                                                as="input"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-2">
                                                            <label htmlFor="tratamientos">
                                                                L:{' '}
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="L"
                                                                name="ppc_l"
                                                                as="input"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-2">
                                                            <label htmlFor="tratamientos">
                                                                FR:{' '}
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="FR"
                                                                name="ppc_fr"
                                                                as="input"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="tratamientos">
                                                                Posicion compensatoria:{' '}
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="Posicion"
                                                                name="ppc_posicion"
                                                                as="input"
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
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Bagolinni
                                                                    </td>
                                                                    <td>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="vl_bg"
                                                                            placeholder="vl_bg"
                                                                            as="input"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="vp_bg"
                                                                            placeholder="vp_bg"
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
                                                                as="input"
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
                                                                as="input"
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
                                                                as="input"
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
                                                                            RX
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
                                                                                name="p_base_od_f"
                                                                                placeholder="△"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="add_od_f"
                                                                                placeholder="add_od"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="agz_od_f"
                                                                                placeholder="agz_od_f"
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
                                                                                name="p_base_oi_f"
                                                                                placeholder="△"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="add_oi_f"
                                                                                placeholder="add_oi"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="agz_oi_f"
                                                                                placeholder="agz_oi_f"
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
                                                                name="lente_pd_1"
                                                                as="input"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-2">
                                                            <label htmlFor="inputAddress">
                                                                DPN
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="inputAddress"
                                                                name="lente_dpn_1"
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
                                                                name="lente_altura_1"
                                                                as="input"
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
                                                                                placeholder="poder_od"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="poder_oi"
                                                                                placeholder="poder_oi"
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
                                                                                placeholder="cb_od"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="cb_oi"
                                                                                placeholder="cb_oi"
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
                                                                                placeholder="dia_od"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="dia_oi"
                                                                                placeholder="dia_oi"
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
                                                                Marca
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="inputAddress"
                                                                name="lente_marca"
                                                                as="input"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="inputAddress">
                                                                Tipo:
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="inputAddress"
                                                                name="lente_tipo"
                                                                as="input"
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
                                                                id="textarea"
                                                                maxLength="800"
                                                                name="conducta_seguir"
                                                                rows="5"
                                                                as="textarea"
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="btn btn-success mt-3"
                                                        type="submit"
                                                    >
                                                        Crear Consulta
                                                    </button>
                                                    {status === 'loading' && <p>Enviando...</p>}
                                                    {status === 'failed' && <p>Error: {error}</p>}
                                                    {status === 'succeeded' && <p>Pediatria creado con éxito</p>}
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

export default OptometriaPediatra