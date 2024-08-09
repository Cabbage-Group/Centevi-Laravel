import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEditarOptometriaGeneral } from '../../redux/features/consultas/EditarGeneralSlice.js';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice.js';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice.js';
import { fetchVerRefraccionGeneral } from '../../redux/features/pacientes/VerRefraccionGeneralSlice.js';


const EditarGeneral = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id, id_consulta } = useParams();
    const { pacientes } = useSelector((state) => state.pacientes);
    const { sucursales } = useSelector((state) => state.sucursales);
    const { data: RefraccionGeneral } = useSelector((state) => state.verRefraccionGeneral)

    const [formData, setFormData] = useState({
        sucursal: '',
        doctor: '',
        id_terapia: '',
        paciente: '',
        edad: '',
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
        lensometria:
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
        lensometria_extra:
        {
            len_tipo_lentes: '',
            len_filtros: '',
            len_tiempo: '',
            len_tipo_aro: ''
        },
        sa_pp:
        {
            sa_od: '',
            pp_od: '',
            sa_oi: '',
            pp_oi: ''
        },
        visuscopia: {
            hirschberg: "",
            ct_vl: "",
            ct_vp: "",
        },
        visuscopia_extra: {
            ppc_or: "",
            ppc_l: "",
            ppc_posicion: "",
            observaciones: "",
        },
        refraccion: {
            esfera_od_f: "",
            cilindro_od_f: "",
            eje_od_f: "",
            p_base_od_f: "",
            add_od_f: "",
            esfera_oi_f: "",
            cilindro_oi_f: "",
            eje_oi_f: "",
            p_base_oi_f: "",
            add_oi_f: "",
        },
        tipo_lentes: {
            tipo_l: "",
            pd: "",
            dnp: "",
            alt: ""
        },
        lentes_contacto: {
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
        },
        pruebas_extra: {
            randot: "",
            lang: "",
            vision_color: ""
        },
        acomodacion: {
            aa_od: "",
            aa_oi: "",
            fan_od: "",
            fan_cpm: "",
            aco_oi: "",
            aco_cpm: "",
            acp_fab: "",
            aco_falla: ""
        },
        acomodacion_extra: {
            mem_od: "",
            mem_oi: "",
            mem_arn: "",
            mem_arp: ""
        },
        conducta_seguir: '',
        plan_versiones: '',
        fecha_creacion: '',
        editado: {
            doctor: '',
            fecha_edicion: ''
        },
    });

    useEffect(() => {
        if (RefraccionGeneral) {
            setFormData({
                sucursal: RefraccionGeneral.sucursal || '',
                doctor: RefraccionGeneral.doctor || '',
                paciente: RefraccionGeneral.paciente || '',
                id_terapia: RefraccionGeneral.id_terapia || '',
                edad: RefraccionGeneral.edad || '',
                fecha_atencion: RefraccionGeneral.fecha_atencion || '',
                m_c: RefraccionGeneral.m_c || '',
                a_o: RefraccionGeneral.a_o || '',
                a_p: RefraccionGeneral.a_p || '',
                a_f: RefraccionGeneral.a_f || '',
                medicamentos: RefraccionGeneral.medicamentos || '',
                tratamientos: RefraccionGeneral.tratamientos || '',
                av_sc: RefraccionGeneral.av_sc ? JSON.parse(RefraccionGeneral.av_sc) : {},
                av_cc: RefraccionGeneral.av_cc ? JSON.parse(RefraccionGeneral.av_cc) : {},
                ojo_dominante: RefraccionGeneral.ojo_dominante || '',
                mano_dominante: RefraccionGeneral.mano_dominante || '',
                lensometria: RefraccionGeneral.lensometria ? JSON.parse(RefraccionGeneral.lensometria) : {},
                lensometria_extra: RefraccionGeneral.lensometria_extra ? JSON.parse(RefraccionGeneral.lensometria_extra) : {},
                sa_pp: RefraccionGeneral.sa_pp ? JSON.parse(RefraccionGeneral.sa_pp) : {},
                visuscopia: RefraccionGeneral.visuscopia ? JSON.parse(RefraccionGeneral.visuscopia) : {},
                visuscopia_extra: RefraccionGeneral.visuscopia_extra ? JSON.parse(RefraccionGeneral.visuscopia_extra) : {},
                refraccion: RefraccionGeneral.refraccion ? JSON.parse(RefraccionGeneral.refraccion) : {},
                tipo_lentes: RefraccionGeneral.tipo_lentes ? JSON.parse(RefraccionGeneral.tipo_lentes) : {},
                lentes_contacto: RefraccionGeneral.lentes_contacto ? JSON.parse(RefraccionGeneral.lentes_contacto) : {},
                pruebas: RefraccionGeneral.pruebas ? JSON.parse(RefraccionGeneral.pruebas) : {},
                pruebas_extra: RefraccionGeneral.pruebas_extra ? JSON.parse(RefraccionGeneral.pruebas_extra) : {},
                acomodacion: RefraccionGeneral.acomodacion ? JSON.parse(RefraccionGeneral.acomodacion) : {},
                acomodacion_extra: RefraccionGeneral.acomodacion_extra ? JSON.parse(RefraccionGeneral.acomodacion_extra) : {},
                conducta_seguir: RefraccionGeneral.conducta_seguir || '',
                plan_versiones: RefraccionGeneral.plan_versiones || '',
                fecha_creacion: RefraccionGeneral.fecha_creacion || '',
                editado: RefraccionGeneral.editado ? JSON.parse(RefraccionGeneral.editado) : {},
            });
        }
    }, [RefraccionGeneral]);

    useEffect(() => {
        if (id && id_consulta) {
            dispatch(fetchVerRefraccionGeneral({ id, id_consulta }));
            dispatch(fetchSucursales({ page: 1, limit: 100 }));
            dispatch(fetchPacientes({ page: 1, limit: 10000 }));
        }
    }, [dispatch, id, id_consulta]);


    const handleChange = (e) => {
        const { name, value, dataset } = e.target;

        setFormData((prevFormData) => {
            switch (dataset.group) {
                case 'av_sc':
                    return {
                        ...prevFormData,
                        av_sc: {
                            ...prevFormData.av_sc,
                            [name]: value,
                        },
                    };
                case 'av_cc':
                    return {
                        ...prevFormData,
                        av_cc: {
                            ...prevFormData.av_cc,
                            [name]: value,
                        },
                    };
                case 'lensometria':
                    return {
                        ...prevFormData,
                        lensometria: {
                            ...prevFormData.lensometria,
                            [name]: value,
                        },
                    };
                case 'lensometria_extra':
                    return {
                        ...prevFormData,
                        lensometria_extra: {
                            ...prevFormData.lensometria_extra,
                            [name]: value,
                        },
                    };
                case 'sa_pp':
                    return {
                        ...prevFormData,
                        sa_pp: {
                            ...prevFormData.sa_pp,
                            [name]: value,
                        },
                    };
                case 'visuscopia':
                    return {
                        ...prevFormData,
                        visuscopia: {
                            ...prevFormData.visuscopia,
                            [name]: value,
                        },
                    };
                case 'visuscopia_extra':
                    return {
                        ...prevFormData,
                        visuscopia_extra: {
                            ...prevFormData.visuscopia_extra,
                            [name]: value,
                        },
                    };
                case 'refraccion':
                    return {
                        ...prevFormData,
                        refraccion: {
                            ...prevFormData.refraccion,
                            [name]: value,
                        },
                    };
                case 'tipo_lentes':
                    return {
                        ...prevFormData,
                        tipo_lentes: {
                            ...prevFormData.tipo_lentes,
                            [name]: value,
                        },
                    };
                case 'lentes_contacto':
                    return {
                        ...prevFormData,
                        lentes_contacto: {
                            ...prevFormData.lentes_contacto,
                            [name]: value,
                        },
                    };
                case 'pruebas':
                    return {
                        ...prevFormData,
                        pruebas: {
                            ...prevFormData.pruebas,
                            [name]: value,
                        },
                    };
                case 'pruebas_extra':
                    return {
                        ...prevFormData,
                        pruebas_extra: {
                            ...prevFormData.pruebas_extra,
                            [name]: value,
                        },
                    };
                case 'acomodacion':
                    return {
                        ...prevFormData,
                        acomodacion: {
                            ...prevFormData.acomodacion,
                            [name]: value,
                        },
                    };
                case 'acomodacion_extra':
                    return {
                        ...prevFormData,
                        acomodacion_extra: {
                            ...prevFormData.acomodacion_extra,
                            [name]: value,
                        },
                    };
                case 'editado':
                    return {
                        ...prevFormData,
                        editado: {
                            ...prevFormData.editado,
                            [name]: value,
                        },
                    };
                default:
                    return {
                        ...prevFormData,
                        [name]: value,
                    };
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(fetchEditarOptometriaGeneral({ id, id_consulta, data: formData }));
        navigate(''); // Reemplaza con la ruta a la que quieres redirigir después de actualizar
    };

    return (
        <div
            className="admin-data-content"
            data-select2-id="12"
            style={{
                marginTop: '50px'
            }}
        >
            <div
                className="row layout-top-spacing"
                data-select2-id="11"
            >
                <div
                    className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing"
                    data-select2-id="10"
                >
                    <div
                        className="widget-content-area br-4"
                        data-select2-id="9"
                    >
                        <form
                            method="put"
                            role="form"
                            onSubmit={handleSubmit}
                        >
                            <div
                                className="widget-one"
                                data-select2-id="8"
                            >
                                <div
                                    className="row"
                                    data-select2-id="7"
                                >
                                    <div
                                        className="col-lg-12 layout-spacing"
                                        data-select2-id="flFormsGrid"
                                        id="flFormsGrid"
                                    >
                                        <div
                                            className="statbox widget box box-shadow"
                                            data-select2-id="6"
                                        >
                                            <div className="widget-header">
                                                <div className="row">
                                                    <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                                        <h4>
                                                            {' '}Editar Refracción General
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                            <nav
                                                aria-label="breadcrumb"
                                                className="breadcrumb-one"
                                            >
                                                <ol
                                                    className="breadcrumb"
                                                    style={{
                                                        background: 'rgb(0 150 136 / 11%)!important'
                                                    }}
                                                >
                                                    <li className="breadcrumb-item">
                                                        <a href="javascript:void(0);">
                                                            Doctor:
                                                        </a>
                                                    </li>
                                                    <li
                                                        aria-current="page"
                                                        className="breadcrumb-item active"
                                                    >
                                                        <b>
                                                            {RefraccionGeneral.doctor}
                                                        </b>
                                                    </li>
                                                </ol>
                                            </nav>
                                            <div className="widget-content widget-content-area">
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="paciente">
                                                            Paciente:
                                                        </label>
                                                        <select
                                                            className="form-control"
                                                            name="paciente"
                                                            value={formData.paciente || ''} // Asigna el valor del paciente seleccionado
                                                            onChange={(e) => setFormData({ ...formData, paciente: e.target.value })} // Manejo del cambio
                                                        >
                                                            <option value="">Seleccione un paciente</option> {/* Opción por defecto */}
                                                            {pacientes.filter(paciente => paciente.id_paciente === RefraccionGeneral.paciente).map((paciente) => (
                                                                <option key={paciente.id_paciente} value={paciente.id_paciente}>
                                                                    Numero Cedula: {paciente.nro_cedula} || Nombres: {paciente.nombres} {paciente.apellidos}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-row mb-12">
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="sucursal">
                                                            Sucursal
                                                        </label>
                                                        <select
                                                            className="form-control"
                                                            name="sucursal"
                                                            value={formData.sucursal || ''} // Asigna el valor de la sucursal seleccionada
                                                            onChange={(e) => setFormData({ ...formData, sucursal: e.target.value })} // Manejo del cambio
                                                        >
                                                            <option value="">Seleccione una sucursal</option> {/* Opción por defecto */}
                                                            {sucursales.filter(sucursal => sucursal.id_sucursal === RefraccionGeneral.sucursal).map((sucursal) => (
                                                                <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                                                                    {sucursal.nombre}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="edad">
                                                            Edad
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.edad}
                                                            name="edad"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="inputAddress">
                                                            Fecha de atencion
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.fecha_atencion}
                                                            name="fecha_atencion"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="inputAddress">
                                                            Motivo de Consulta:
                                                        </label>
                                                        <textarea
                                                            className="form-control textarea"
                                                            value={formData.m_c}
                                                            maxLength="225"
                                                            name="m_c"
                                                            placeholder="Esta área tiene un limite de 225 caracteres."
                                                            rows="2"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="lugarNacimiento">
                                                            Antecedentes Oculares
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.a_o}
                                                            name="a_o"
                                                            placeholder="A/O"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="inputAddress2">
                                                            Antecedentes Personales
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.a_p}
                                                            name="a_p"
                                                            placeholder="A/P"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="inputAddress2">
                                                            Antecedentes Familiares
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.a_f}
                                                            name="a_f"
                                                            placeholder="A/F"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="medicamentos">
                                                            Medicamentos
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.medicamentos}
                                                            name="medicamentos"
                                                            placeholder="Medicamentos"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="tratamientos">
                                                            Tratamientos anteriores
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.tratamientos}
                                                            name="tratamientos"
                                                            placeholder="Tratamientos"
                                                            type="text"
                                                            onChange={handleChange}
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
                                                                            Visión Lejana
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={formData.av_sc.av_sc_od_vl}
                                                                                name="av/sc_od_vl"
                                                                                placeholder="od_vl"
                                                                                type="text"
                                                                                onChange={handleChange}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={formData.av_sc.av_sc_oi_vl}
                                                                                name="av/sc_oi_vl"
                                                                                placeholder="oi_vl"
                                                                                type="text"
                                                                                onChange={handleChange}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="text-center">
                                                                            Visión Próxima
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={formData.av_sc.av_sc_od_vp}
                                                                                name="av/sc_od_vp"
                                                                                type="text"
                                                                                onChange={handleChange}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={formData.av_sc.av_sc_oi_vp}
                                                                                name="av/sc_oi_vp"
                                                                                type="text"
                                                                                onChange={handleChange}
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
                                                                            Visión Lejana
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                defaultValue=""
                                                                                name="av/cc_od_vl"
                                                                                type="text"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                defaultValue=""
                                                                                name="av/cc_oi_vl"
                                                                                type="text"
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="text-center">
                                                                            Visión Próxima
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                defaultValue=""
                                                                                name="av/cc_od_vp"
                                                                                type="text"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                defaultValue=""
                                                                                name="av/cc_oi_vp"
                                                                                type="text"
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
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue="+2.50"
                                                                            name="esfera_od"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue=""
                                                                            name="cilindro_od"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue=""
                                                                            name="eje_od"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue=""
                                                                            name="p_base_od"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue="+2.50"
                                                                            name="add_od"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        OI
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue="+2.50"
                                                                            name="esfera_oi"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue=""
                                                                            name="cilindro_oi"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue=""
                                                                            name="eje_oi"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue=""
                                                                            name="p_base_oi"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue="+2.50"
                                                                            name="add_oi"
                                                                            type="text"
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
                                                        <input
                                                            className="form-control"
                                                            defaultValue="bifocalst"
                                                            name="len_tipo_lentes"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="objetivos">
                                                            Filtros
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name="len_filtros"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="objetivos">
                                                            Tiempo
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name="len_tiempo"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="objetivos">
                                                            Tipo de Aro
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name="len_tipo_arco"
                                                            type="text"
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
                                                        <input
                                                            className="form-control"
                                                            defaultValue="opacidad"
                                                            name="sa_od"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name="pp_od"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-3">
                                                        <input
                                                            className="form-control"
                                                            defaultValue="opacidad"
                                                            name="sa_oi"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name="pp_oi"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="tratamientos">
                                                        Hirschberg
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue=""
                                                        id="hirschberg"
                                                        name="hirschberg"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="VL">
                                                        CT: VL:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue=""
                                                        id="VL"
                                                        name="ct_vl"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="VP">
                                                        VP
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue=""
                                                        id="VP"
                                                        name="ct_vp"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="inputAddress">
                                                        VERSIONES:
                                                    </label>
                                                    <textarea
                                                        className="form-control textarea"
                                                        id="textarea"
                                                        maxLength="800"
                                                        name="plan_versiones"
                                                        rows="5"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="tratamientos">
                                                        PPC: OR{' '}
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue=""
                                                        id="ppc_or"
                                                        name="ppc_or"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="tratamientos">
                                                        L:{' '}
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue=""
                                                        id="ppc_l"
                                                        name="ppc_l"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="tratamientos">
                                                        Posicion compensatoria:{' '}
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue=""
                                                        id="ppc_posicion"
                                                        name="ppc_posicion"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="inputAddress">
                                                        OBSERVACIONES:
                                                    </label>
                                                    <textarea
                                                        className="form-control textarea"
                                                        id="textarea"
                                                        maxLength="500"
                                                        name="observaciones"
                                                        rows="3"
                                                    />
                                                </div>
                                            </div>
                                            <div className="table-responsive">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th className="text-center">
                                                                PRUEBAS
                                                            </th>
                                                            <th>
                                                                VL
                                                            </th>
                                                            <th>
                                                                VP
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="text-center">
                                                                Luces de Worth
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    defaultValue=""
                                                                    name="vl_luces"
                                                                    type="text"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    defaultValue=""
                                                                    name="vp_luces"
                                                                    type="text"
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="inputAddress">
                                                        Randot:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue=""
                                                        id="inputAddress"
                                                        name="randot"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="inputAddress">
                                                        Lang:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue=""
                                                        id="inputAddress"
                                                        name="lang"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="inputAddress">
                                                        Visión de Color
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue=""
                                                        id="inputAddress"
                                                        name="vision_color"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <h6>
                                                Acomodación
                                            </h6>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="inputAddress">
                                                        A.A OD:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="<br /><b>Notice</b>:  Trying to access array offset on value of type null in <b>D:\Trabajos\Cabbage\Centevi\vistas\modulos\editar-refraccion-general.php</b> on line <b>510</b><br />"
                                                        id="inputAddress"
                                                        name="aa_od"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="inputAddress">
                                                        OI
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="<br /><b>Notice</b>:  Trying to access array offset on value of type null in <b>D:\Trabajos\Cabbage\Centevi\vistas\modulos\editar-refraccion-general.php</b> on line <b>514</b><br />"
                                                        id="inputAddress"
                                                        name="aa_oi"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="inputAddress">
                                                        FAM: OD
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="<br /><b>Notice</b>:  Trying to access array offset on value of type null in <b>D:\Trabajos\Cabbage\Centevi\vistas\modulos\editar-refraccion-general.php</b> on line <b>518</b><br />"
                                                        id="inputAddress"
                                                        name="fan_od"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="inputAddress">
                                                        CPM
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="<br /><b>Notice</b>:  Trying to access array offset on value of type null in <b>D:\Trabajos\Cabbage\Centevi\vistas\modulos\editar-refraccion-general.php</b> on line <b>522</b><br />"
                                                        id="inputAddress"
                                                        name="fan_cpm"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="inputAddress">
                                                        OI
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="<br /><b>Notice</b>:  Trying to access array offset on value of type null in <b>D:\Trabajos\Cabbage\Centevi\vistas\modulos\editar-refraccion-general.php</b> on line <b>529</b><br />"
                                                        id="inputAddress"
                                                        name="aco_oi"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="inputAddress">
                                                        CPM
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="<br /><b>Notice</b>:  Trying to access array offset on value of type null in <b>D:\Trabajos\Cabbage\Centevi\vistas\modulos\editar-refraccion-general.php</b> on line <b>533</b><br />"
                                                        id="inputAddress"
                                                        name="aco_cpm"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="inputAddress">
                                                        FAB
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="<br /><b>Notice</b>:  Trying to access array offset on value of type null in <b>D:\Trabajos\Cabbage\Centevi\vistas\modulos\editar-refraccion-general.php</b> on line <b>537</b><br />"
                                                        id="inputAddress"
                                                        name="acp_fab"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="inputAddress">
                                                        CPM Falla
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="<br /><b>Notice</b>:  Trying to access array offset on value of type null in <b>D:\Trabajos\Cabbage\Centevi\vistas\modulos\editar-refraccion-general.php</b> on line <b>541</b><br />"
                                                        id="inputAddress"
                                                        name="aco_falla"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="inputAddress">
                                                        MEM:OD
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="<br /><b>Notice</b>:  Trying to access array offset on value of type null in <b>D:\Trabajos\Cabbage\Centevi\vistas\modulos\editar-refraccion-general.php</b> on line <b>551</b><br />"
                                                        id="inputAddress"
                                                        name="mem_od"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="inputAddress">
                                                        OI
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="<br /><b>Notice</b>:  Trying to access array offset on value of type null in <b>D:\Trabajos\Cabbage\Centevi\vistas\modulos\editar-refraccion-general.php</b> on line <b>555</b><br />"
                                                        id="inputAddress"
                                                        name="mem_oi"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="inputAddress">
                                                        ARN
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="<br /><b>Notice</b>:  Trying to access array offset on value of type null in <b>D:\Trabajos\Cabbage\Centevi\vistas\modulos\editar-refraccion-general.php</b> on line <b>559</b><br />"
                                                        id="inputAddress"
                                                        name="mem_arn"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="inputAddress">
                                                        ARP
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="<br /><b>Notice</b>:  Trying to access array offset on value of type null in <b>D:\Trabajos\Cabbage\Centevi\vistas\modulos\editar-refraccion-general.php</b> on line <b>563</b><br />"
                                                        id="inputAddress"
                                                        name="mem_arp"
                                                        type="text"
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
                                                                    P/BASE
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
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue="-0.25"
                                                                        name="esfera_od_f"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue="-1.00"
                                                                        name="cilindro_od_f"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue="60"
                                                                        name="eje_od_f"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue=""
                                                                        name="p_base_od_f"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue="+2.50"
                                                                        name="add_od_f"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-center">
                                                                    OI
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue="0.00"
                                                                        name="esfera_oi_f"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue="-0.75"
                                                                        name="cilindro_oi_f"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue="120"
                                                                        name="eje_oi_f"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue=""
                                                                        name="p_base_oi_f"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue="+2.50"
                                                                        name="add_oi_f"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="tratamientos">
                                                        Tipo Lentes{' '}
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        name="tipo_l"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="tratamientos">
                                                        PD:{' '}
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue=""
                                                        id="pd"
                                                        name="pd"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="tratamientos">
                                                        DNP
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue=""
                                                        id="dnp"
                                                        name="dnp"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="tratamientos">
                                                        ALT
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue=""
                                                        id="alt"
                                                        name="alt"
                                                        type="text"
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
                                                                <th>
                                                                    OD
                                                                </th>
                                                                <th className="text-center">
                                                                    OI
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="text-center">
                                                                    PODER
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue=""
                                                                        name="poder_od"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue=""
                                                                        name="poder_oi"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-center">
                                                                    C.B
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue=""
                                                                        name="cb_od"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue=""
                                                                        name="cb_oi"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-center">
                                                                    DIA
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue=""
                                                                        name="dia_od"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue=""
                                                                        name="dia_oi"
                                                                        type="text"
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
                                                    <input
                                                        className="form-control"
                                                        defaultValue=""
                                                        id="inputAddress"
                                                        name="lente_marca"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="inputAddress">
                                                        Tipo:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue=""
                                                        id="inputAddress"
                                                        name="lente_tipo"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="inputAddress">
                                                        CONDUCTA A SEGUIR:
                                                    </label>
                                                    <textarea
                                                        className="form-control textarea"
                                                        maxLength="800"
                                                        name="conducta_seguir"
                                                        rows="5"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                className="btn btn-success mt-3"
                                                type="submit"
                                            >
                                                Editar Consulta
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditarGeneral