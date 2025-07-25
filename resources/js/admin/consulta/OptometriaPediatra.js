import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPacientes } from "../../redux/features/pacientes/pacientesSlice.js";
import { fetchSucursales } from "../../redux/features/sucursales/sucursalesSlice.js";
import { crearPediatrica } from "../../redux/features/consultas/OptometriaPediatricaSlice.js";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Select, Button, Row, Col } from "antd";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getCurrentMMYYYYDate } from "../../utils/DateUtils.js";
import { CloseCircleTwoTone } from "@ant-design/icons";
import { fetchServicios } from "../../redux/features/servicios/serviciosSlice.js";

const OptometriaPediatra = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { pacientes, pacientes_options_selecteds } = useSelector(
        (state) => state.pacientes
    );
    const { sucursales } = useSelector((state) => state.sucursales);
    const { servicios } = useSelector((state) => state.servicios);
    const { status, error } = useSelector(
        (state) => state.optometriaPediatrica
    );
    const [selectedPaciente, setSelectedPaciente] = useState(null);
    const [serviciosRealizados, setServiciosRealizados] = useState([]);
    const [proximosServicios, setProximosServicios] = useState([]);
    const initialValues = {
        sucursal: "",
        doctor: localStorage.getItem("nombre"),
        agendado_por: localStorage.getItem("nombre"),
        id_terapia: "0",
        paciente: "",
        edad: "0",
        fecha_atencion: getCurrentMMYYYYDate(),
        m_c: "",
        a_o: "",
        a_p: "",
        a_f: "",
        medicamentos: "",
        tratamientos: "",
        desarrollo: "",
        nacimiento: "",
        parto: "",
        incubadora: "",
        tiempo: "",
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
            av_cc_oi_ph: "",
        },
        ojo_dominante: "",
        mano_dominante: "",
        lensometria:
            // [
            {
                esfera_od: "",
                cilindro_od: "",
                eje_od: "",
                p_base_od: "",
                add_od: "",
                esfera_oi: "",
                cilindro_oi: "",
                eje_oi: "",
                p_base_oi: "",
                add_oi: "",
            },
        // ],
        lensometria_extra:
            // [
            {
                len_tipo_lentes: "",
                len_filtros: "",
                len_tiempo: "",
                len_tipo_aro: "",
            },
        // ],
        sa_pp:
            // [
            {
                sa_od: "",
                pp_od: "",
                sa_oi: "",
                pp_oi: "",
            },
        // ],
        visuscopia: {
            viscopia_od: "",
            viscopia_oi: "",
            hirschberg: "",
            krismsky: "",
            ct_vl: "",
            ct_vp: "",
            maddox: "",
        },
        visuscopia_extra: {
            seguimiento_ao: "",
            sacadicos_ao: "",
            ppc_or: "",
            ppc_l: "",
            ppc_fr: "",
            ppc_posicion: "",
        },
        refraccion: {
            esfera_od_f: "",
            cilindro_od_f: "",
            eje_od_f: "",
            p_base_od_f: "",
            add_od_f: "",
            agz_od_f: "",
            esfera_oi_f: "",
            cilindro_oi_f: "",
            eje_oi_f: "",
            p_base_oi_f: "",
            add_oi_f: "",
            agz_oi_f: "",
            agz_od_f: "",
        },
        lentes_contacto: {
            lente_marca_1: "",
            lente_pd_1: "",
            lente_dpn_1: "",
            lente_altura_1: "",
            poder_od: "",
            poder_oi: "",
            cb_od: "",
            cb_oi: "",
            dia_od: "",
            dia_oi: "",
            lente_marca: "",
            lente_tipo: "",
        },
        pruebas: {
            vl_luces: "",
            vp_luces: "",
            vl_bg: "",
            vp_bg: "",
        },
        pruebas_extras: {
            estereosis: "",
            randot: "",
            lang: "",
            seg_arco: "",
            vision_color: "",
        },
        conducta_seguir: "",
        plan_versiones: "",
        fecha_creacion: "",
        editado: "",
        fecha_proxima_consulta: "",
    };

    useEffect(() => {
        dispatch(fetchSucursales({ page: 1, limit: 100 }));
        dispatch(fetchPacientes({ page: 1, limit: 50000 }));
        dispatch(fetchServicios());
    }, [dispatch]);

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birthDateObj = new Date(birthDate);
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDifference = today.getMonth() - birthDateObj.getMonth();
        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDateObj.getDate())
        ) {
            age--;
        }
        return age;
    };

    const validationSchema = Yup.object({
        sucursal: Yup.number().required("Required"),
        paciente: Yup.number().required("Required"),
        fecha_atencion: Yup.date().required("Required"),
    });

    const handlePacienteChange = (e, setFieldValue) => {
        console.log(e);
        // const { value } = e.target;
        const value = e;
        setSelectedPaciente(value);
        setFieldValue("paciente", value);
        const paciente = pacientes.find((p) => p.id_paciente == value);

        if (paciente && paciente.fecha_nacimiento) {
            const edad = calculateAge(paciente.fecha_nacimiento);
            setFieldValue("edad", edad);
        }
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
                                            onSubmit={async (
                                                values,
                                                { setSubmitting }
                                            ) => {
                                                setSubmitting(true);
                                                console.log(
                                                    "Form values:",
                                                    values
                                                );
                                                const rpta = await dispatch(
                                                    crearPediatrica(values)
                                                );
                                                setSubmitting(false);

                                                Swal.fire({
                                                    title: "La consulta ha sido guardado correctamente.",
                                                    text: "",
                                                    icon: "success",
                                                    confirmButtonText: "OK",
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        navigate(
                                                            `/historia-paciente/${values.paciente}`
                                                        );
                                                        // location.reload();
                                                    }
                                                });
                                            }}
                                        >
                                            {({
                                                setFieldValue,
                                                isSubmitting,
                                            }) => (
                                                <Form method="post" role="form">
                                                    <div className="form-row mb-4">
                                                        <div className="form-group col-md-12">
                                                            <label htmlFor="paciente">
                                                                Pacientes
                                                            </label>
                                                            <Select
                                                                showSearch
                                                                placeholder="Seleccione el paciente"
                                                                filterOption={(
                                                                    input,
                                                                    option
                                                                ) => {
                                                                    const searchTerms =
                                                                        input
                                                                            .toLowerCase()
                                                                            .split(
                                                                                " "
                                                                            );
                                                                    return searchTerms.every(
                                                                        (
                                                                            term
                                                                        ) =>
                                                                            (
                                                                                option?.label ??
                                                                                ""
                                                                            )
                                                                                .toLowerCase()
                                                                                .includes(
                                                                                    term
                                                                                )
                                                                    );
                                                                }}
                                                                options={
                                                                    pacientes_options_selecteds
                                                                }
                                                                style={{
                                                                    width: "100%",
                                                                    height: "52px",
                                                                    color: "black",
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    handlePacienteChange(
                                                                        e,
                                                                        setFieldValue
                                                                    );
                                                                }}
                                                            />
                                                            {/* <Field as="select" name="paciente" className="form-control form-small" onChange={(e) => handlePacienteChange(e, setFieldValue)}>
                                <option value="">Seleccione el paciente</option>
                                {pacientes.map((paciente) => (
                                  <option key={paciente.id_paciente} value={paciente.id_paciente}>
                                    Numero Cedula: {paciente.nro_cedula} || Nombres: {paciente.nombres} {paciente.apellidos}
                                  </option>
                                ))}
                              </Field> */}
                                                            <ErrorMessage
                                                                name="paciente"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-row mb-12">
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="inputSucursal">
                                                                Sucursal
                                                            </label>
                                                            <Field
                                                                as="select"
                                                                name="sucursal"
                                                                className="form-control"
                                                                id="sucursal"
                                                            >
                                                                <option value="">
                                                                    Seleccionar
                                                                    sucursal
                                                                </option>
                                                                {sucursales.map(
                                                                    (
                                                                        sucursal
                                                                    ) => (
                                                                        <option
                                                                            key={
                                                                                sucursal.id_sucursal
                                                                            }
                                                                            value={
                                                                                sucursal.id_sucursal
                                                                            }
                                                                        >
                                                                            {
                                                                                sucursal.nombre
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </Field>
                                                            <ErrorMessage
                                                                name="sucursal"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-3">
                                                            <label htmlFor="edad">
                                                                Edad
                                                            </label>
                                                            <Field
                                                                as="input"
                                                                name="edad"
                                                                className="form-control"
                                                                id="edad"
                                                                readOnly
                                                            />
                                                            <ErrorMessage
                                                                name="edad"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-3">
                                                            <label htmlFor="fecha_atencion">
                                                                Fecha de
                                                                atención
                                                            </label>
                                                            <Field
                                                                type="date"
                                                                name="fecha_atencion"
                                                                className="form-control"
                                                                id="fecha_atencion"
                                                                // max="2024-07-04"
                                                            />
                                                            <ErrorMessage
                                                                name="fecha_atencion"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-row mb-4">
                                                        <div className="form-group col-md-12">
                                                            <label htmlFor="m_c">
                                                                Motivo de
                                                                consulta
                                                            </label>
                                                            <Field
                                                                as="textarea"
                                                                name="m_c"
                                                                className="form-control textarea"
                                                                id="m_c"
                                                                maxLength="10000"
                                                                rows="15"
                                                            />
                                                            <ErrorMessage
                                                                name="m_c"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-row mb-4">
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="lugarNacimiento">
                                                                Antecedentes
                                                                Oculares
                                                            </label>
                                                            <Field
                                                                as="input"
                                                                className="form-control"
                                                                id="lugarNacimiento"
                                                                name="a_o"
                                                            />
                                                            <ErrorMessage
                                                                name="a_o"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="inputAddress2">
                                                                Antecedentes
                                                                Personales
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
                                                                Antecedentes
                                                                Familiares
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
                                                                Tratamientos
                                                                anteriores
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
                                                                Desarrollo del
                                                                infante
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
                                                                                    name="av_sc.av_sc_od_vl"
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="av_sc.av_sc_oi_vl"
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
                                                                                    name="av_sc.av_sc_od_vp"
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="av_sc.av_sc_oi_vp"
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
                                                                                    name="av_sc.av_sc_od_ph"
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="av_sc.av_sc_oi_ph"
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
                                                                                    name="av_cc.av_cc_od_vl"
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="av_cc.av_cc_oi_vl"
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
                                                                                    name="av_cc.av_cc_od_vp"
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="av_cc.av_cc_oi_vp"
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
                                                                                    name="av_cc.av_cc_od_ph"
                                                                                    as="input"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Field
                                                                                    className="form-control"
                                                                                    name="av_cc.av_cc_oi_ph"
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
                                                        <h5>RECETA EN USO</h5>
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
                                                                            P/BASE
                                                                            △
                                                                        </th>
                                                                        <th>
                                                                            ADD
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="text-center">
                                                                            Ojo
                                                                            Derecho
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="lensometria.esfera_od"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="lensometria.cilindro_od"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="lensometria.eje_od"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="lensometria.p_base_od"
                                                                                placeholder="△"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="lensometria.add_od"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="text-center">
                                                                            Ojo
                                                                            Izquierdo
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="lensometria.esfera_oi"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="lensometria.cilindro_oi"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="lensometria.eje_oi"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="lensometria.p_base_oi"
                                                                                placeholder="△"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="lensometria.add_oi"
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
                                                                name="lensometria_extra.len_tipo_lentes"
                                                                as="input"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-3">
                                                            <label htmlFor="objetivos">
                                                                Filtros
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                name="lensometria_extra.len_filtros"
                                                                as="input"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-3">
                                                            <label htmlFor="objetivos">
                                                                Tiempo
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                name="lensometria_extra.len_tiempo"
                                                                as="input"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-3">
                                                            <label htmlFor="objetivos">
                                                                Tipo de Aro
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                name="lensometria_extra.len_tipo_aro"
                                                                placeholder="len_tipo_aro"
                                                                as="input"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-row mb-4">
                                                        <div className="form-group col-md-3">
                                                            <h5>
                                                                Segmento
                                                                Anterior
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
                                                                name="sa_pp.sa_od"
                                                                as="input"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-3">
                                                            <Field
                                                                className="form-control"
                                                                name="sa_pp.pp_od"
                                                                as="input"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-row mb-4">
                                                        <div className="form-group col-md-3">
                                                            <Field
                                                                className="form-control"
                                                                name="sa_pp.sa_oi"
                                                                as="input"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-3">
                                                            <Field
                                                                className="form-control"
                                                                name="sa_pp.pp_oi"
                                                                as="input"
                                                            />
                                                        </div>
                                                    </div>

                                                    <h6>VISUSCOPIA:</h6>
                                                    <div className="form-row mb-4">
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="v_od">
                                                                OD
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="v_od"
                                                                name="visuscopia.viscopia_od"
                                                                as="input"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="v_oi">
                                                                OI
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="v_oi"
                                                                name="visuscopia.viscopia_oi"
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
                                                                name="visuscopia.hirschberg"
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
                                                                name="visuscopia.krismsky"
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
                                                                COVER TEST:
                                                                VISION LEJANA:
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="VL"
                                                                name="visuscopia.ct_vl"
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
                                                                name="visuscopia.ct_vp"
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
                                                                name="visuscopia.maddox"
                                                                as="input"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-row mb-4">
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="tratamientos">
                                                                Seguimiento
                                                                Visual(AO):{" "}
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="ao"
                                                                name="visuscopia_extra.seguimiento_ao"
                                                                as="input"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="tratamientos">
                                                                Sacádicos(AO):{" "}
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="ao"
                                                                name="visuscopia_extra.sacadicos_ao"
                                                                as="input"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-row mb-4">
                                                        <div className="form-group col-md-2">
                                                            <label htmlFor="tratamientos">
                                                                PPC: OR{" "}
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="or"
                                                                name="visuscopia_extra.ppc_or"
                                                                as="input"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-2">
                                                            <label htmlFor="tratamientos">
                                                                L:{" "}
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="L"
                                                                name="visuscopia_extra.ppc_l"
                                                                as="input"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-2">
                                                            <label htmlFor="tratamientos">
                                                                FR:{" "}
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="FR"
                                                                name="visuscopia_extra.ppc_fr"
                                                                as="input"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="tratamientos">
                                                                Posicion
                                                                compensatoria:{" "}
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="Posicion"
                                                                name="visuscopia_extra.ppc_posicion"
                                                                as="input"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="table-responsive">
                                                        <table className="table table-bordered">
                                                            <thead>
                                                                <tr>
                                                                    <th className="text-center">
                                                                        PRUEBAS
                                                                        SENSORIALES
                                                                    </th>
                                                                    <th className="text-center">
                                                                        VISION
                                                                        LEJANA
                                                                    </th>
                                                                    <th className="text-center">
                                                                        VISION
                                                                        PROXIMA
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Luces de
                                                                        Worth
                                                                    </td>
                                                                    <td>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="pruebas.vl_luces"
                                                                            as="input"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="pruebas.vp_luces"
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
                                                                            name="pruebas.vl_bg"
                                                                            as="input"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="pruebas.vp_bg"
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
                                                                name="pruebas_extras.randot"
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
                                                                name="pruebas_extras.lang"
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
                                                                name="pruebas_extras.vision_color"
                                                                as="input"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <h5>RECETA FINAL</h5>
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
                                                                            P/BASE
                                                                            △
                                                                        </th>
                                                                        <th>
                                                                            ADD
                                                                        </th>
                                                                        <th>
                                                                            AGUDEZA
                                                                            VISUAL
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="text-center">
                                                                            Ojo
                                                                            Derecho
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="refraccion.esfera_od_f"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="refraccion.cilindro_od_f"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="refraccion.eje_od_f"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="refraccion.p_base_od_f"
                                                                                placeholder="△"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="refraccion.add_od_f"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="refraccion.agz_od_f"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="text-center">
                                                                            Ojo
                                                                            Izquierdo
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="refraccion.esfera_oi_f"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="refraccion.cilindro_oi_f"
                                                                                placeholder="cilindro_oi"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="refraccion.eje_oi_f"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="refraccion.p_base_oi_f"
                                                                                placeholder="△"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="refraccion.add_oi_f"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="refraccion.agz_oi_f"
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
                                                                name="lentes_contacto.lente_marca_1"
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
                                                                name="lentes_contacto.lente_pd_1"
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
                                                                name="lentes_contacto.lente_dpn_1"
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
                                                                name="lentes_contacto.lente_altura_1"
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
                                                                            OJO
                                                                            DERECHO
                                                                        </th>
                                                                        <th className="text-center">
                                                                            OJO
                                                                            IZQUIERDO
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
                                                                                name="lentes_contacto.poder_od"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="lentes_contacto.poder_oi"
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
                                                                                name="lentes_contacto.cb_od"
                                                                                placeholder="cb_od"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="lentes_contacto.cb_oi"
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
                                                                                name="lentes_contacto.dia_od"
                                                                                as="input"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="lentes_contacto.dia_oi"
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
                                                                name="lentes_contacto.lente_marca"
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
                                                                name="lentes_contacto.lente_tipo"
                                                                as="input"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-row mb-4">
                                                        <div className="form-group col-md-12">
                                                            <label htmlFor="inputAddress">
                                                                CONDUCTA A
                                                                SEGUIR: asdasda
                                                            </label>
                                                            <Field
                                                                className="form-control textarea"
                                                                id="textarea"
                                                                // maxLength="800"
                                                                name="conducta_seguir"
                                                                rows="8"
                                                                as="textarea"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-row mb-12">
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="inputFehaProxCita">
                                                                Fecha de proxima
                                                                cita
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                name="fecha_proxima_consulta"
                                                                required
                                                                type="date"
                                                            />
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>
                                                                Diagnostico de
                                                                pacientes
                                                            </label>
                                                            <Select
                                                                showSearch
                                                                value={null}
                                                                style={{
                                                                    width: "100%",
                                                                    color: "transparent",
                                                                    height: "45px",
                                                                    background:
                                                                        "white !important",
                                                                }}
                                                                options={[
                                                                    {
                                                                        label: "H49 - Estrabismo Paralítico",
                                                                        value: "H49",
                                                                    },
                                                                    {
                                                                        label: "H49.0 - Parálisis del tercer par craneal (III: Motor ocular común)",
                                                                        value: "H49.0",
                                                                    },
                                                                    {
                                                                        label: "H49.1 - Parálisis del cuarto par craneal (IV: Patético o Troclear)",
                                                                        value: "H49.1",
                                                                    },
                                                                    {
                                                                        label: "H49.2 - Parálisis del sexto par craneal (VI: Abductor)",
                                                                        value: "H49.2",
                                                                    },
                                                                    {
                                                                        label: "H49.3 - Oftalmoplejia total (externa)",
                                                                        value: "H49.3",
                                                                    },
                                                                    {
                                                                        label: "H49.4 - Oftalmoplejia progresiva externa",
                                                                        value: "H49.4",
                                                                    },
                                                                    {
                                                                        label: "H49.8 - Otros estrabismos paralíticos",
                                                                        value: "H49.8",
                                                                    },
                                                                    {
                                                                        label: "H49.9 - Estrabismo Paralítico sin especificar",
                                                                        value: "H49.9",
                                                                    },
                                                                    {
                                                                        label: "H50.0 - Estrabismo concomitante convergente",
                                                                        value: "H50.0",
                                                                    },
                                                                    {
                                                                        label: "H50.1 - Estrabismo concomitante divergente",
                                                                        value: "H50.1",
                                                                    },
                                                                    {
                                                                        label: "H50.2 - Estrabismo vertical",
                                                                        value: "H50.2",
                                                                    },
                                                                    {
                                                                        label: "H50.3 - Heterotropia intermitente",
                                                                        value: "H50.3",
                                                                    },
                                                                    {
                                                                        label: "H50.4 - Otras heterotropia y heterotropias sin especificar",
                                                                        value: "H50.4",
                                                                    },
                                                                    {
                                                                        label: "H50.5 - Heteroforia",
                                                                        value: "H50.5",
                                                                    },
                                                                    {
                                                                        label: "H50.6 - Estrabismo Mecánica",
                                                                        value: "H50.6",
                                                                    },
                                                                    {
                                                                        label: "H50.8 - Otros estrabismos especificados",
                                                                        value: "H50.8",
                                                                    },
                                                                    {
                                                                        label: "H50.9 - Estrabismos sin especificar",
                                                                        value: "H50.9",
                                                                    },
                                                                    {
                                                                        label: "H51.0 - Parálisis de la mirada conjugada",
                                                                        value: "H51.0",
                                                                    },
                                                                    {
                                                                        label: "H51.1 - Exceso e insuficiencia de convergencia",
                                                                        value: "H51.1",
                                                                    },
                                                                    {
                                                                        label: "H51.2 - Oftalmoplejia internuclear",
                                                                        value: "H51.2",
                                                                    },
                                                                    {
                                                                        label: "H51.8 - Otros trastornos del movimiento binocular especificados",
                                                                        value: "H51.8",
                                                                    },
                                                                    {
                                                                        label: "H51.9 - Trastornos del movimiento binocular sin especificar",
                                                                        value: "H51.9",
                                                                    },
                                                                    {
                                                                        label: "H52.0 - Hipermetropía",
                                                                        value: "H52.0",
                                                                    },
                                                                    {
                                                                        label: "H52.1 - Miopía",
                                                                        value: "H52.1",
                                                                    },
                                                                    {
                                                                        label: "H52.2 - Astigmatismo",
                                                                        value: "H52.2",
                                                                    },
                                                                    {
                                                                        label: "H52.3 - Anisometropía o aniseiconia",
                                                                        value: "H52.3",
                                                                    },
                                                                    {
                                                                        label: "H52.4 - Presbicia",
                                                                        value: "H52.4",
                                                                    },
                                                                    {
                                                                        label: "H52.5 - Trastorno de acomodación",
                                                                        value: "H52.5",
                                                                    },
                                                                    {
                                                                        label: "H52.6 - Otros trastornos de refracción",
                                                                        value: "H52.6",
                                                                    },
                                                                    {
                                                                        label: "H52.7 - Trastorno de refracción sin especificar",
                                                                        value: "H52.7",
                                                                    },
                                                                    {
                                                                        label: "H53 - Problemas visuales",
                                                                        value: "H53",
                                                                    },
                                                                    {
                                                                        label: "H53.0 - Ambliopía ex anopsia",
                                                                        value: "H53.0",
                                                                    },
                                                                    {
                                                                        label: "H53.00 - Ambliopía no especificada",
                                                                        value: "H53.00",
                                                                    },
                                                                    {
                                                                        label: "H53.001 - Ambliopía no especificada, ojo derecho",
                                                                        value: "H53.001",
                                                                    },
                                                                    {
                                                                        label: "H53.002 - Ambliopía no especificada, ojo izquierdo",
                                                                        value: "H53.002",
                                                                    },
                                                                    {
                                                                        label: "H53.003 - Ambliopía no especificada, bilateral",
                                                                        value: "H53.003",
                                                                    },
                                                                    {
                                                                        label: "H53.009 - Ambliopía no especificada, ojo no especificado",
                                                                        value: "H53.009",
                                                                    },
                                                                    {
                                                                        label: "H53.01 - Ambliopía por deprivación",
                                                                        value: "H53.01",
                                                                    },
                                                                    {
                                                                        label: "H53.011 - Ambliopía por deprivación, ojo derecho",
                                                                        value: "H53.011",
                                                                    },
                                                                    {
                                                                        label: "H53.012 - Ambliopía por deprivación, ojo izquierdo",
                                                                        value: "H53.012",
                                                                    },
                                                                    {
                                                                        label: "H53.013 - Ambliopía por deprivación, bilateral",
                                                                        value: "H53.013",
                                                                    },
                                                                    {
                                                                        label: "H53.019 - Ambliopía por deprivación ojo no especificado",
                                                                        value: "H53.019",
                                                                    },
                                                                    {
                                                                        label: "H53.02 - Ambliopía Refractiva",
                                                                        value: "H53.02",
                                                                    },
                                                                    {
                                                                        label: "H53.021 - Ambliopía refractiva, ojo derecho",
                                                                        value: "H53.021",
                                                                    },
                                                                    {
                                                                        label: "H53.022 - Ambliopía refractiva, ojo izquierdo",
                                                                        value: "H53.022",
                                                                    },
                                                                    {
                                                                        label: "H53.023 - Ambliopía refractiva bilateral",
                                                                        value: "H53.023",
                                                                    },
                                                                    {
                                                                        label: "H53.029 - Ambliopía refractiva, ojo no especificado",
                                                                        value: "H53.029",
                                                                    },
                                                                    {
                                                                        label: "H53.03 - Ambliopía estrábica",
                                                                        value: "H53.03",
                                                                    },
                                                                    {
                                                                        label: "H53.031 - Ambliopía estrábica, ojo derecho",
                                                                        value: "H53.031",
                                                                    },
                                                                    {
                                                                        label: "H53.032 - Ambliopía estrábica, ojo izquierdo",
                                                                        value: "H53.032",
                                                                    },
                                                                    {
                                                                        label: "H53.033 - Ambliopía estrábica, bilateral",
                                                                        value: "H53.033",
                                                                    },
                                                                    {
                                                                        label: "H53.039 - Ambliopía estrábica, ojo no especificado",
                                                                        value: "H53.039",
                                                                    },
                                                                    {
                                                                        label: "H53.1 - Trastorno de visión subjetiva",
                                                                        value: "H53.1",
                                                                    },
                                                                    {
                                                                        label: "H53.10 - Alteraciones de visión subjetiva no especificada",
                                                                        value: "H53.10",
                                                                    },
                                                                    {
                                                                        label: "H53.11 - Ceguera diurna",
                                                                        value: "H53.11",
                                                                    },
                                                                    {
                                                                        label: "H53.12 - Perdida de visión transitoria",
                                                                        value: "H53.12",
                                                                    },
                                                                    {
                                                                        label: "H53.121 - Perdida de visión transitoria, ojo derecho",
                                                                        value: "H53.121",
                                                                    },
                                                                    {
                                                                        label: "H53.122 - Perdida de visión transitoria, ojo izquierdo",
                                                                        value: "H53.122",
                                                                    },
                                                                    {
                                                                        label: "H53.123 - Perdida de visión transitoria, bilateral",
                                                                        value: "H53.123",
                                                                    },
                                                                    {
                                                                        label: "H53.129 - Perdida de visión transitoria, ojo no especificado",
                                                                        value: "H53.129",
                                                                    },
                                                                    {
                                                                        label: "H53.13 - Perdida brusca de visión",
                                                                        value: "H53.13",
                                                                    },
                                                                    {
                                                                        label: "H53.131 - Perdida brusca de visión, ojo derecho",
                                                                        value: "H53.131",
                                                                    },
                                                                    {
                                                                        label: "H53.132 - Perdida brusca de visión, ojo izquierdo",
                                                                        value: "H53.132",
                                                                    },
                                                                    {
                                                                        label: "H53.133 - Perdida brusca de visión, bilateral",
                                                                        value: "H53.133",
                                                                    },
                                                                    {
                                                                        label: "H53.139 - Perdida brusca de visión, ojo no especificado",
                                                                        value: "H53.139",
                                                                    },
                                                                    {
                                                                        label: "H53.14 - Molestias visuales",
                                                                        value: "H53.14",
                                                                    },
                                                                    {
                                                                        label: "H53.141 - Molestias visuales, ojo derecho",
                                                                        value: "H53.141",
                                                                    },
                                                                    {
                                                                        label: "H53.142 - Molestias visuales, ojo izquierdo",
                                                                        value: "H53.142",
                                                                    },
                                                                    {
                                                                        label: "H53.143 - Molestias visuales, bilaterales",
                                                                        value: "H53.143",
                                                                    },
                                                                    {
                                                                        label: "H53.149 - Molestias visuales, no especificadas",
                                                                        value: "H53.149",
                                                                    },
                                                                    {
                                                                        label: "H53.15 - Distorsiones visuales de forma y tamaño",
                                                                        value: "H53.15",
                                                                    },
                                                                    {
                                                                        label: "H53.16 - Trastornos visuales psicofísicos",
                                                                        value: "H53.16",
                                                                    },
                                                                    {
                                                                        label: "H53.19 - Otros trastornos visuales subjetiva",
                                                                        value: "H53.19",
                                                                    },
                                                                    {
                                                                        label: "H53.2 - Diplopía",
                                                                        value: "H53.2",
                                                                    },
                                                                ]}
                                                            ></Select>
                                                        </div>
                                                    </div>

                                                    {/* Selector de Tags */}

                                                    <Row gutter={[16, 16]}>
                                                        <Col
                                                            xxl={12}
                                                            xl={12}
                                                            md={12}
                                                        >
                                                            <div className="form-row mb-4">
                                                                <div className="form-group col-md-12">
                                                                    <label htmlFor="tags">
                                                                        Servicios
                                                                        Realizados
                                                                    </label>
                                                                    <Select
                                                                        showSearch
                                                                        value={
                                                                            null
                                                                        }
                                                                        style={{
                                                                            width: "100%",
                                                                            color: "transparent",
                                                                            background:
                                                                                "white !important",
                                                                        }}
                                                                        onChange={(
                                                                            value,
                                                                            val
                                                                        ) => {
                                                                            if (
                                                                                !serviciosRealizados.find(
                                                                                    (
                                                                                        servicio
                                                                                    ) =>
                                                                                        servicio.value ===
                                                                                        value
                                                                                )
                                                                            ) {
                                                                                const newServicios =
                                                                                    [
                                                                                        ...serviciosRealizados,
                                                                                        val,
                                                                                    ];
                                                                                setServiciosRealizados(
                                                                                    newServicios
                                                                                );
                                                                                setFieldValue(
                                                                                    "servicios_realizados_optometria_pediatrica",
                                                                                    newServicios.map(
                                                                                        (
                                                                                            s
                                                                                        ) =>
                                                                                            s.value
                                                                                    )
                                                                                );
                                                                            }
                                                                        }}
                                                                        options={servicios.map(
                                                                            (
                                                                                servicio
                                                                            ) => ({
                                                                                value: servicio.id,
                                                                                label:
                                                                                    servicio.codigo +
                                                                                    " | " +
                                                                                    servicio.servicio,
                                                                            })
                                                                        )}
                                                                        filterOption={(
                                                                            input,
                                                                            option
                                                                        ) => {
                                                                            const searchTerms =
                                                                                input
                                                                                    .toLowerCase()
                                                                                    .split(
                                                                                        " "
                                                                                    );
                                                                            return searchTerms.every(
                                                                                (
                                                                                    term
                                                                                ) =>
                                                                                    (
                                                                                        option?.label ??
                                                                                        ""
                                                                                    )
                                                                                        .toLowerCase()
                                                                                        .includes(
                                                                                            term
                                                                                        )
                                                                            );
                                                                        }}
                                                                    ></Select>
                                                                    <div
                                                                        style={{
                                                                            display:
                                                                                "ruby",
                                                                            marginTop:
                                                                                "10px",
                                                                            marginBottom:
                                                                                "10px",
                                                                        }}
                                                                        onClick={() => {}}
                                                                    >
                                                                        {serviciosRealizados.map(
                                                                            (
                                                                                servicio
                                                                            ) => {
                                                                                return (
                                                                                    <div
                                                                                        style={{
                                                                                            color: "black",
                                                                                            background:
                                                                                                "white",
                                                                                            border: "1px solid gray",
                                                                                            paddingTop:
                                                                                                "5px",
                                                                                            paddingBottom:
                                                                                                "5px",
                                                                                            paddingLeft:
                                                                                                "10px",
                                                                                            paddingRight:
                                                                                                "10px",
                                                                                            borderRadius:
                                                                                                "20px",
                                                                                            display:
                                                                                                "flex",
                                                                                            marginRight:
                                                                                                "5px",
                                                                                            marginTop:
                                                                                                "5px",
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            servicio.label
                                                                                        }
                                                                                        <div
                                                                                            style={{
                                                                                                marginLeft:
                                                                                                    "5px",
                                                                                                cursor: "pointer",
                                                                                            }}
                                                                                            onClick={() => {
                                                                                                const newServicios =
                                                                                                    serviciosRealizados.filter(
                                                                                                        (
                                                                                                            serv
                                                                                                        ) =>
                                                                                                            serv.value !==
                                                                                                            servicio.value
                                                                                                    );
                                                                                                setServiciosRealizados(
                                                                                                    newServicios
                                                                                                );
                                                                                                setFieldValue(
                                                                                                    "servicios_realizados_optometria_pediatrica",
                                                                                                    newServicios.map(
                                                                                                        (
                                                                                                            s
                                                                                                        ) =>
                                                                                                            s.value
                                                                                                    )
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            <CloseCircleTwoTone twoToneColor="#eb2f96" />
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Col>

                                                        <Col
                                                            xxl={12}
                                                            xl={12}
                                                            md={12}
                                                        >
                                                            <div className="form-row mb-4">
                                                                <div className="form-group col-md-12">
                                                                    <label htmlFor="tags">
                                                                        Proximos
                                                                        Servicios
                                                                    </label>
                                                                    <Select
                                                                        showSearch
                                                                        value={
                                                                            null
                                                                        }
                                                                        style={{
                                                                            width: "100%",
                                                                            color: "transparent",
                                                                            background:
                                                                                "white !important",
                                                                        }}
                                                                        onChange={(
                                                                            value,
                                                                            val
                                                                        ) => {
                                                                            if (
                                                                                !proximosServicios.find(
                                                                                    (
                                                                                        servicio
                                                                                    ) =>
                                                                                        servicio.value ==
                                                                                        value
                                                                                )
                                                                            ) {
                                                                                const newServicios =
                                                                                    [
                                                                                        ...proximosServicios,
                                                                                        val,
                                                                                    ];
                                                                                setProximosServicios(
                                                                                    newServicios
                                                                                );
                                                                                setFieldValue(
                                                                                    "servicios_proximos_optometria_pediatrica",
                                                                                    newServicios.map(
                                                                                        (
                                                                                            s
                                                                                        ) =>
                                                                                            s.value
                                                                                    )
                                                                                );
                                                                            }
                                                                        }}
                                                                        options={servicios.map(
                                                                            (
                                                                                servicio
                                                                            ) => ({
                                                                                value: servicio.id,
                                                                                label:
                                                                                    servicio.codigo +
                                                                                    " | " +
                                                                                    servicio.servicio,
                                                                            })
                                                                        )}
                                                                        filterOption={(
                                                                            input,
                                                                            option
                                                                        ) => {
                                                                            const searchTerms =
                                                                                input
                                                                                    .toLowerCase()
                                                                                    .split(
                                                                                        " "
                                                                                    );
                                                                            return searchTerms.every(
                                                                                (
                                                                                    term
                                                                                ) =>
                                                                                    (
                                                                                        option?.label ??
                                                                                        ""
                                                                                    )
                                                                                        .toLowerCase()
                                                                                        .includes(
                                                                                            term
                                                                                        )
                                                                            );
                                                                        }}
                                                                    ></Select>
                                                                    <div
                                                                        style={{
                                                                            display:
                                                                                "ruby",
                                                                            marginTop:
                                                                                "10px",
                                                                            marginBottom:
                                                                                "10px",
                                                                        }}
                                                                        onClick={() => {}}
                                                                    >
                                                                        {proximosServicios.map(
                                                                            (
                                                                                servicio
                                                                            ) => {
                                                                                return (
                                                                                    <div
                                                                                        style={{
                                                                                            color: "black",
                                                                                            background:
                                                                                                "white",
                                                                                            border: "1px solid gray",
                                                                                            paddingTop:
                                                                                                "5px",
                                                                                            paddingBottom:
                                                                                                "5px",
                                                                                            paddingLeft:
                                                                                                "10px",
                                                                                            paddingRight:
                                                                                                "10px",
                                                                                            borderRadius:
                                                                                                "20px",
                                                                                            display:
                                                                                                "flex",
                                                                                            marginRight:
                                                                                                "5px",
                                                                                            marginTop:
                                                                                                "5px",
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            servicio.label
                                                                                        }
                                                                                        <div
                                                                                            style={{
                                                                                                marginLeft:
                                                                                                    "5px",
                                                                                                cursor: "pointer",
                                                                                            }}
                                                                                            onClick={() => {
                                                                                                const newServicios =
                                                                                                    proximosServicios.filter(
                                                                                                        (
                                                                                                            serv
                                                                                                        ) =>
                                                                                                            serv.value !==
                                                                                                            servicio.value
                                                                                                    );
                                                                                                setProximosServicios(
                                                                                                    newServicios
                                                                                                );
                                                                                                setFieldValue(
                                                                                                    "servicios_proximos_optometria_pediatrica",
                                                                                                    newServicios.map(
                                                                                                        (
                                                                                                            s
                                                                                                        ) =>
                                                                                                            s.value
                                                                                                    )
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            <CloseCircleTwoTone twoToneColor="#eb2f96" />
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                    <Button
                                                        className="btn btn-success mt-3"
                                                        htmlType="submit"
                                                        loading={isSubmitting}
                                                        disabled={isSubmitting}
                                                        style={{
                                                            display: "flex",
                                                        }}
                                                    >
                                                        Guardar Consulta
                                                    </Button>
                                                    {status === "loading" && (
                                                        <p>Enviando...</p>
                                                    )}
                                                    {status === "failed" && (
                                                        <p>Error: {error}</p>
                                                    )}
                                                    {status === "succeeded" && (
                                                        <p>
                                                            Pediatria creado con
                                                            éxito
                                                        </p>
                                                    )}
                                                </Form>
                                            )}
                                        </Formik>
                                        {status === "error" && (
                                            <div className="alert alert-danger">
                                                {error}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OptometriaPediatra;
