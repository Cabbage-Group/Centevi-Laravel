import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchEditarOrtoptica } from '../../redux/features/consultas/EditarOrtopticaSlice.js';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice.js';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice.js';
import { fetchVerOrtoptica } from '../../redux/features/pacientes/VerOrtopticaSlice.js';


const EditarOrtoptica = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id, id_consulta } = useParams();
    const { pacientes } = useSelector((state) => state.pacientes);
    const { sucursales } = useSelector((state) => state.sucursales);
    const { data: ortoptica } = useSelector((state) => state.verOrtoptica)

    const [formData, setFormData] = useState({
        sucursal: '',
        doctor: 'Dr. Diego',
        id_terapia: '0',
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
            len_tipo_arco: ''
        },
        sa_pp:
        {
            sa_od: '',
            pp_od: '',
            sa_oi: '',
            pp_oi: ''
        },
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
            helshoswky: "",
            von_graefe: "",
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
            agz_oi_f: ""
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
            lente_marca_1: "",
            lente_pd_1: "",
            lente_dnp_1: "",
            lente_altura_1: ""
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
        vergencia: {
            v_vt_vl: "",
            v_bt_vp: "",
            v_bn_vl: "",
            v_bn_vp: ""
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
        let av_sc = {};
        let av_cc = {};
        let lensometria = {};
        let lensometria_extra = {};
        let sa_pp = {};
        let visuscopia = {};
        let visuscopia_extra = {};
        let refraccion = {};
        let lentes_contacto = {};
        let pruebas = {};
        let pruebas_extra = {};
        let acomodacion = {};
        let acomodacion_extra = {};
        let vergencia = {};
        let editado = {};
        let ojo_dominante = '';
        let mano_dominante = '';

        try {
            av_sc = ortoptica && ortoptica.av_sc ? JSON.parse(ortoptica.av_sc) : {};
            av_cc = ortoptica && ortoptica.av_cc ? JSON.parse(ortoptica.av_cc) : {};
            lensometria = ortoptica && ortoptica.lensometria ? JSON.parse(ortoptica.lensometria) : {};
            lensometria_extra = ortoptica && ortoptica.lensometria_extra ? JSON.parse(ortoptica.lensometria_extra) : {};
            sa_pp = ortoptica && ortoptica.sa_pp ? JSON.parse(ortoptica.sa_pp) : {};
            visuscopia = ortoptica && ortoptica.visuscopia ? JSON.parse(ortoptica.visuscopia) : {};
            visuscopia_extra = ortoptica && ortoptica.visuscopia_extra ? JSON.parse(ortoptica.visuscopia_extra) : {};
            refraccion = ortoptica && ortoptica.refraccion ? JSON.parse(ortoptica.refraccion) : {};
            lentes_contacto = ortoptica && ortoptica.lentes_contacto ? JSON.parse(ortoptica.lentes_contacto) : {};
            pruebas = ortoptica && ortoptica.pruebas ? JSON.parse(ortoptica.pruebas) : {};
            pruebas_extra = ortoptica && ortoptica.pruebas_extra ? JSON.parse(ortoptica.pruebas_extra) : {};
            acomodacion = ortoptica && ortoptica.acomodacion ? JSON.parse(ortoptica.acomodacion) : {};
            acomodacion_extra = ortoptica && ortoptica.acomodacion_extra ? JSON.parse(ortoptica.acomodacion_extra) : {};
            vergencia = ortoptica && ortoptica.vergencia ? JSON.parse(ortoptica.vergencia) : {};
            editado = ortoptica && ortoptica.editado ? JSON.parse(ortoptica.editado) : {};
            ojo_dominante = ortoptica && ortoptica.ojo_dominante ? ortoptica.ojo_dominante : '';
            mano_dominante = ortoptica && ortoptica.mano_dominante ? ortoptica.mano_dominante : '';
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }

        setFormData((prevFormData) => ({
            ...prevFormData,
            ojo_dominante,
            mano_dominante,
        }));
    }, [ortoptica]);

    useEffect(() => {
        if (ortoptica) {
            setFormData({
                sucursal: ortoptica.sucursal || '',
                doctor: ortoptica.doctor || '',
                paciente: ortoptica.paciente || '',
                id_terapia: ortoptica.id_terapia || '',
                edad: ortoptica.edad || '',
                fecha_atencion: ortoptica.fecha_atencion || '',
                m_c: ortoptica.m_c || '',
                a_o: ortoptica.a_o || '',
                a_p: ortoptica.a_p || '',
                a_f: ortoptica.a_f || '',
                medicamentos: ortoptica.medicamentos || '',
                tratamientos: ortoptica.tratamientos || '',
                av_sc: ortoptica.av_sc ? JSON.parse(ortoptica.av_sc) : {},
                av_cc: ortoptica.av_cc ? JSON.parse(ortoptica.av_cc) : {},
                ojo_dominante: ortoptica.ojo_dominante || '',
                mano_dominante: ortoptica.mano_dominante || '',
                lensometria: ortoptica.lensometria ? JSON.parse(ortoptica.lensometria) : {},
                lensometria_extra: ortoptica.lensometria_extra ? JSON.parse(ortoptica.lensometria_extra) : {},
                sa_pp: ortoptica.sa_pp ? JSON.parse(ortoptica.sa_pp) : {},
                visuscopia: ortoptica.visuscopia ? JSON.parse(ortoptica.visuscopia) : {},
                visuscopia_extra: ortoptica.visuscopia_extra ? JSON.parse(ortoptica.visuscopia_extra) : {},
                refraccion: ortoptica.refraccion ? JSON.parse(ortoptica.refraccion) : {},
                lentes_contacto: ortoptica.lentes_contacto ? JSON.parse(ortoptica.lentes_contacto) : {},
                pruebas: ortoptica.pruebas ? JSON.parse(ortoptica.pruebas) : {},
                pruebas_extra: ortoptica.pruebas_extra ? JSON.parse(ortoptica.pruebas_extra) : {},
                acomodacion: ortoptica.acomodacion ? JSON.parse(ortoptica.acomodacion) : {},
                acomodacion_extra: ortoptica.acomodacion_extra ? JSON.parse(ortoptica.acomodacion_extra) : {},
                vergencia: ortoptica.vergencia ? JSON.parse(ortoptica.vergencia) : {},
                conducta_seguir: ortoptica.conducta_seguir || '',
                plan_versiones: ortoptica.plan_versiones || '',
                fecha_creacion: ortoptica.fecha_creacion || '',
                editado: ortoptica.editado ? JSON.parse(ortoptica.editado) : {},
            });
        }
    }, [ortoptica]);

    useEffect(() => {
        if (id && id_consulta) {
            dispatch(fetchVerOrtoptica({ id, id_consulta }));
            dispatch(fetchSucursales({ page: 1, limit: 100 }));
            dispatch(fetchPacientes({ page: 1, limit: 10000 }));
        }
    }, [dispatch, id, id_consulta]);


    const handleChange = (e) => {
        const { name, value, dataset } = e.target;

        console.log('Handling change for:', name, value, dataset.group);

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
                case 'vergencia':
                    return {
                        ...prevFormData,
                        vergencia: {
                            ...prevFormData.vergencia,
                            [name]: value,
                        },
                    };
                case 'id_terapia':
                    return {
                        ...prevFormData,
                        id_terapia: value,
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
        console.log('Submitting form with data:', formData); // Agrega esta línea para depuración
        dispatch(fetchEditarOrtoptica({ id, id_consulta, data: formData }));
        navigate(''); // Reemplaza con la ruta a la que quieres redirigir después de actualizar
    };

    return (
        <div
            className="admin-data-content"
            style={{
                marginTop: '50px'
            }}
        >
            <div className="row layout-top-spacing">
                <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
                    <div className="widget-content-area br-4">
                        <form
                            method="put"
                            role="form"
                            onSubmit={handleSubmit}
                        >
                            <div className="widget-one" style={{ padding: "40px" }}>
                                <div className="row">
                                    <div
                                        className="col-lg-12 layout-spacing"
                                        id="flFormsGrid"
                                    >
                                        <div className="statbox widget box box-shadow">
                                            <div className="widget-header">
                                                <div className="row">
                                                    <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                                        <h4>
                                                            ORTOPTICA
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="widget-content widget-content-area">
                                                <nav
                                                    aria-label="breadcrumb"
                                                    className="breadcrumb-one"
                                                >
                                                    <ol
                                                        className="breadcrumb"
                                                        style={{
                                                            background: 'rgb(0 150 136 / 11%)'
                                                        }}
                                                    >
                                                        <li className="breadcrumb-item">
                                                            <a href="doctor">
                                                                Doctor:
                                                            </a>
                                                        </li>
                                                        <li
                                                            aria-current="page"
                                                            className="breadcrumb-item active"
                                                        >
                                                            <b>
                                                                {ortoptica.doctor}
                                                            </b>
                                                        </li>
                                                    </ol>
                                                </nav>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="paciente">
                                                            Paciente:
                                                        </label>
                                                        <select
                                                            className="form-control"
                                                            name="paciente"
                                                        >
                                                            <option >
                                                                {pacientes.filter(paciente => paciente.id_paciente === ortoptica.paciente).map((paciente) => (
                                                                    <option key={paciente.id_paciente} value={formData.paciente.id_paciente}>
                                                                        Numero Cedula: {paciente.nro_cedula} || Nombres: {paciente.nombres} {paciente.apellidos}
                                                                    </option>
                                                                ))}
                                                            </option>
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
                                                        >
                                                            <option>
                                                                {sucursales.filter(sucursal => sucursal.id_sucursal === ortoptica.sucursal).map((sucursal) => (
                                                                    <option key={sucursal.id_sucursal} value={formData.sucursal.id_sucursal}>
                                                                        {sucursal.nombre}
                                                                    </option>
                                                                ))}
                                                            </option>
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
                                                            M/C:
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
                                                            A/O
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.a_o}
                                                            id="lugarNacimiento"
                                                            name="a_o"
                                                            placeholder="A/O"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="inputAddress2">
                                                            A/P
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
                                                            A/F
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
                                                                            VL
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
                                                                            VP
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={formData.av_sc.av_sc_od_vp}
                                                                                name="av/sc_od_vp"
                                                                                placeholder="od_vp"
                                                                                type="text"
                                                                                onChange={handleChange}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={formData.av_sc.av_sc_oi_vp}
                                                                                name="av/sc_oi_vp"
                                                                                placeholder="oi_vp"
                                                                                type="text"
                                                                                onChange={handleChange}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="text-center">
                                                                            PH
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={formData.av_sc.av_sc_od_ph}
                                                                                name="av/sc_od_ph"
                                                                                placeholder="od_ph"
                                                                                type="text"
                                                                                onChange={handleChange}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={formData.av_sc.av_sc_oi_ph}
                                                                                name="av/sc_oi_ph"
                                                                                placeholder="oi_ph"
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
                                                                            VL
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={formData.av_cc.av_cc_od_vl}
                                                                                name="av/cc_od_vl"
                                                                                placeholder="od_vl"
                                                                                type="text"
                                                                                onChange={handleChange}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={formData.av_cc.av_cc_oi_vl}
                                                                                name="av/cc_oi_vl"
                                                                                placeholder="oi_vl"
                                                                                type="text"
                                                                                onChange={handleChange}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="text-center">
                                                                            VP
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={formData.av_cc.av_cc_od_vp}
                                                                                name="av/cc_od_vp"
                                                                                placeholder="od_vp"
                                                                                type="text"
                                                                                onChange={handleChange}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={formData.av_cc.av_cc_oi_vp}
                                                                                name="av/cc_oi_vp"
                                                                                placeholder="oi_vp"
                                                                                type="text"
                                                                                onChange={handleChange}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="text-center">
                                                                            PH
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={formData.av_cc.av_cc_od_ph}
                                                                                name="av/cc_od_ph"
                                                                                placeholder="od_ph"
                                                                                type="text"
                                                                                onChange={handleChange}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={formData.av_cc.av_cc_oi_ph}
                                                                                name="av/cc_oi_ph"
                                                                                placeholder="oi_ph"
                                                                                type="text"
                                                                                onChange={handleChange}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h6>
                                                            OJO DOMINANTE
                                                        </h6>
                                                        <div className="form-row mb-4">
                                                            <div className="form-group col-md-3">
                                                                <div className="n-chk">
                                                                    <label className="new-control new-radio radio-classic-success">
                                                                        <input
                                                                            className="new-control-input"
                                                                            value="IZQUIERDO"
                                                                            name="ojo_dominante"
                                                                            type="radio"
                                                                            checked={formData.ojo_dominante === 'IZQUIERDO'}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <span className="new-control-indicator" />
                                                                        IZQUIERDO
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="form-group col-md-3">
                                                                <div className="n-chk">
                                                                    <label className="new-control new-radio radio-classic-success">
                                                                        <input
                                                                            className="new-control-input"
                                                                            value="DERECHO"
                                                                            name="ojo_dominante"
                                                                            type="radio"
                                                                            checked={formData.ojo_dominante === 'DERECHO'}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <span className="new-control-indicator" />
                                                                        DERECHO
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h6>
                                                            MANO DOMINANTE
                                                        </h6>
                                                        <div className="form-row mb-4">
                                                            <div className="form-group col-md-3">
                                                                <div className="n-chk">
                                                                    <label className="new-control new-radio radio-classic-success">
                                                                        <input
                                                                            className="new-control-input"
                                                                            value="IZQUIERDA"
                                                                            name="mano_dominante"
                                                                            type="radio"
                                                                            checked={formData.mano_dominante === 'IZQUIERDA'}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <span className="new-control-indicator" />
                                                                        IZQUIEDA
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="form-group col-md-3">
                                                                <div className="n-chk">
                                                                    <label className="new-control new-radio radio-classic-success">
                                                                        <input
                                                                            className="new-control-input"
                                                                            value="DERECHO"
                                                                            name="mano_dominante"
                                                                            type="radio"
                                                                            checked={formData.mano_dominante === 'DERECHO'}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <span className="new-control-indicator" />
                                                                        DERECHA
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group second_page">
                                                    <h5>
                                                        RECETA
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
                                                                        Ojo Derecho
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            value={formData.lensometria.esfera_od}
                                                                            name="esfera_od"
                                                                            placeholder="esfera_od"
                                                                            type="text"
                                                                            onChange={handleChange}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            value={formData.lensometria.cilindro_od}
                                                                            name="cilindro_od"
                                                                            placeholder="cilindro_od"
                                                                            type="text"
                                                                            onChange={handleChange}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            value={formData.lensometria.eje_od}
                                                                            name="eje_od"
                                                                            placeholder="eje_od"
                                                                            type="text"
                                                                            onChange={handleChange}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            value={formData.lensometria.p_base_od}
                                                                            name="p_base_od"
                                                                            placeholder="p_base_od"
                                                                            type="text"
                                                                            onChange={handleChange}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            value={formData.lensometria.add_od}
                                                                            name="add_od"
                                                                            placeholder="add_od"
                                                                            type="text"
                                                                            onChange={handleChange}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Ojo Izquierdo
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            value={formData.lensometria.esfera_oi}
                                                                            name="esfera_oi"
                                                                            placeholder="esfera_oi"
                                                                            type="text"
                                                                            onChange={handleChange}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            value={formData.lensometria.cilindro_oi}
                                                                            name="cilindro_oi"
                                                                            placeholder="cilindro_oi"
                                                                            type="text"
                                                                            onChange={handleChange}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            value={formData.lensometria.eje_oi}
                                                                            name="eje_oi"
                                                                            placeholder="eje_oi"
                                                                            type="text"
                                                                            onChange={handleChange}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            value={formData.lensometria.p_base_oi}
                                                                            name="p_base_oi"
                                                                            placeholder="p_base_oi"
                                                                            type="text"
                                                                            onChange={handleChange}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            value={formData.lensometria.add_oi}
                                                                            name="add_oi"
                                                                            placeholder="add_oi"
                                                                            type="text"
                                                                            onChange={handleChange}
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
                                                            value={formData.lensometria_extra.len_tipo_lentes}
                                                            name="len_tipo_lentes"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="objetivos">
                                                            Filtros
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.lensometria_extra.len_filtros}
                                                            name="len_filtros"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="objetivos">
                                                            Tiempo
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.lensometria_extra.len_tiempo}
                                                            name="len_tiempo"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="objetivos">
                                                            Tipo de Aro
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.lensometria_extra.len_tipo_arco}
                                                            name="len_tipo_arco"
                                                            type="text"
                                                            onChange={handleChange}
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
                                                            value={formData.sa_pp.sa_od}
                                                            name="sa_od"
                                                            placeholder="OD"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <input
                                                            className="form-control"
                                                            value={formData.sa_pp.pp_od}
                                                            name="pp_od"
                                                            placeholder="OD"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-3">
                                                        <input
                                                            className="form-control"
                                                            value={formData.sa_pp.sa_oi}
                                                            name="sa_oi"
                                                            placeholder="OI"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <input
                                                            className="form-control"
                                                            value={formData.sa_pp.pp_oi}
                                                            name="pp_oi"
                                                            placeholder="OI"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
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
                                                    <input
                                                        className="form-control"
                                                        value={formData.visuscopia.viscopia_od}
                                                        name="viscopia_od"
                                                        placeholder="OD"
                                                        type="text"
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="v_oi">
                                                        OI
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        value={formData.visuscopia.viscopia_oi}
                                                        name="viscopia_oi"
                                                        placeholder="OI"
                                                        type="text"
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="tratamientos">
                                                        Hirschberg
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        value={formData.visuscopia.hirschberg}
                                                        name="hirschberg"
                                                        placeholder="hirschberg"
                                                        type="text"
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="tratamientos">
                                                        Krismsky
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        value={formData.visuscopia.krismsky}
                                                        name="krismsky"
                                                        placeholder="krismsky"
                                                        type="text"
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group col-md-12">
                                                <label htmlFor="versiones">
                                                    VERSIONES:
                                                </label>
                                                <textarea
                                                    className="form-control textarea"
                                                    value={formData.plan_versiones}
                                                    maxLength="225"
                                                    name="plan_versiones"
                                                    placeholder="Esta área tiene un limite de 225 caracteres."
                                                    rows="2"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row mb-4">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="VL">
                                                    CT: VL:
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.visuscopia.ct_vl}
                                                    id="VL"
                                                    name="ct_vl"
                                                    placeholder="VL"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="VP">
                                                    VP
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.visuscopia.ct_vp}
                                                    name="ct_vp"
                                                    placeholder="VP"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="maddox">
                                                    MADDOX:
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.visuscopia.maddox}
                                                    name="maddox"
                                                    placeholder="maddox"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row mb-4">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="tratamientos">
                                                    Seguimiento Visual(AO):{' '}
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.visuscopia_extra.seguimiento_ao}
                                                    name="seguimiento_ao"
                                                    placeholder="seguimiento"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="tratamientos">
                                                    Sacádicos(AO):{' '}
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.visuscopia_extra.sacadicos_ao}
                                                    name="sacadicos_ao"
                                                    placeholder="sacadicos"
                                                    type="text"
                                                    onChange={handleChange}
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
                                                    value={formData.visuscopia_extra.ppc_or}
                                                    name="ppc_or"
                                                    placeholder="ppc_or"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="tratamientos">
                                                    L:{' '}
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.visuscopia_extra.ppc_l}
                                                    name="ppc_l"
                                                    placeholder="ppc_l"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="tratamientos">
                                                    FR:{' '}
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.visuscopia_extra.ppc_fr}
                                                    name="ppc_fr"
                                                    placeholder="ppc_fr"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="tratamientos">
                                                    Posicion compensatoria:{' '}
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.visuscopia_extra.ppc_posicion}
                                                    name="ppc_posicion"
                                                    placeholder="ppc_posicion"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row mb-4">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="tratamientos">
                                                    HELSHOSWSKY
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.visuscopia_extra.helshoswky}
                                                    name="helshoswky"
                                                    placeholder="helshoswky"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="tratamientos">
                                                    VON GRAEFE
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.visuscopia_extra.von_graefe}
                                                    name="von_graefe"
                                                    placeholder="von_graefe"
                                                    type="text"
                                                    onChange={handleChange}
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
                                                                value={formData.pruebas.vl_luces}
                                                                name="vl_luces"
                                                                placeholder="vl_luces"
                                                                type="text"
                                                                onChange={handleChange}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                value={formData.pruebas.vp_luces}
                                                                name="vp_luces"
                                                                placeholder="vp_luces"
                                                                type="text"
                                                                onChange={handleChange}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-center">
                                                            Bagolinni
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                value={formData.pruebas.vl_bg}
                                                                name="vl_bg"
                                                                placeholder="vl_bg"
                                                                type="text"
                                                                onChange={handleChange}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                value={formData.pruebas.vp_bg}

                                                                name="vp_bg"
                                                                placeholder="vp_bg"
                                                                type="text"
                                                                onChange={handleChange}
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
                                                <input
                                                    className="form-control"
                                                    value={formData.pruebas_extra.randot}
                                                    name="randot"
                                                    placeholder="randot"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="inputAddress">
                                                    Lang:
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.pruebas_extra.lang}
                                                    name="lang"
                                                    placeholder="lang"
                                                    type="text"
                                                    onChange={handleChange}
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
                                                    value={formData.pruebas_extra.vision_color}
                                                    name="vision_color"
                                                    placeholder="vision"
                                                    type="text"
                                                    onChange={handleChange}
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
                                                <input
                                                    className="form-control"
                                                    value={formData.acomodacion.aa_od}
                                                    name="aa_od"
                                                    placeholder="aa_od"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="inputAddress">
                                                    OI
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.acomodacion.aa_oi}
                                                    name="aa_oi"
                                                    placeholder="aa_oi"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="inputAddress">
                                                    FAN: OD
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.acomodacion.fan_od}
                                                    name="fan_od"
                                                    placeholder="fan_od"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="inputAddress">
                                                    OI:
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.acomodacion.fan_cpm}
                                                    name="fan_cpm"
                                                    placeholder="fan_cpm"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row mb-4">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="inputAddress">
                                                    FAB
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.acomodacion.aco_oi}
                                                    name="aco_oi"
                                                    placeholder="aco_oi"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="inputAddress">
                                                    MEM: OD
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.acomodacion.aco_cpm}
                                                    name="aco_cpm"
                                                    placeholder="aco_cpm"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="inputAddress">
                                                    OI
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.acomodacion.acp_fab}
                                                    name="acp_fab"
                                                    placeholder="acp_fab"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row mb-4">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="inputAddress">
                                                    ARN
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.acomodacion_extra.mem_arn}
                                                    name="mem_arn"
                                                    placeholder="mem_arn"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="inputAddress">
                                                    ARP
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.acomodacion_extra.mem_arp}
                                                    name="mem_arp"
                                                    placeholder="mem_arp"
                                                    type="text"
                                                    onChange={handleChange}
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
                                                <input
                                                    className="form-control"
                                                    value={formData.vergencia.v_vt_vl}
                                                    name="v_vt_vl"
                                                    placeholder="v_vt_vl"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="inputAddress">
                                                    BT/VP
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.vergencia.v_bt_vp}
                                                    name="v_bt_vp"
                                                    placeholder="v_bt_vp"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row mb-4">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="inputAddress">
                                                    BN/VL
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.vergencia.v_bn_vl}
                                                    name="v_bn_vl"
                                                    placeholder="v_bn_vl"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="inputAddress">
                                                    BN/VP
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.vergencia.v_bn_vp}
                                                    name="v_bn_vp"
                                                    placeholder="v_bn_vp"
                                                    type="text"
                                                    onChange={handleChange}
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
                                                            <th>
                                                                AGUDEZA VISUAL
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
                                                                    value={formData.refraccion.esfera_od_f}
                                                                    name="esfera_od_f"
                                                                    type="text"
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    value={formData.refraccion.cilindro_od_f}
                                                                    name="cilindro_od_f"
                                                                    type="text"
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    value={formData.refraccion.eje_od_f}
                                                                    name="eje_od_f"
                                                                    type="text"
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    value={formData.refraccion.p_base_od_f}
                                                                    name="p_base_od_f"
                                                                    type="text"
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    value={formData.refraccion.add_od_f}
                                                                    name="add_od_f"
                                                                    type="text"
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    value={formData.refraccion.agz_od_f}
                                                                    name="agz_od_f"
                                                                    type="text"
                                                                    onChange={handleChange}
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
                                                                    value={formData.refraccion.esfera_oi_f}
                                                                    name="esfera_oi_f"
                                                                    type="text"
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    value={formData.refraccion.cilindro_oi_f}
                                                                    name="cilindro_oi_f"
                                                                    type="text"
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    value={formData.refraccion.eje_oi_f}
                                                                    name="eje_oi_f"
                                                                    type="text"
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    value={formData.refraccion.p_base_oi_f}
                                                                    name="p_base_oi_f"
                                                                    type="text"
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    value={formData.refraccion.add_oi_f}
                                                                    name="add_oi_f"
                                                                    type="text"
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    value={formData.refraccion.agz_oi_f}
                                                                    name="agz_oi_f"
                                                                    type="text"
                                                                    onChange={handleChange}
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
                                                <input
                                                    className="form-control"
                                                    value={formData.lentes_contacto.lente_marca_1}
                                                    name="lente_marca_1"
                                                    placeholder="Marca"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="inputAddress">
                                                    PD:
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.lentes_contacto.lente_pd_1}
                                                    name="lente_pd_1"
                                                    placeholder="pd"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="inputAddress">
                                                    DNP:
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.lentes_contacto.lente_dnp_1}
                                                    name="lente_dnp_1"
                                                    placeholder="dnp"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="inputAddress">
                                                    ALTURA:
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.lentes_contacto.lente_altura_1}
                                                    name="lente_altura_1"
                                                    placeholder="altura"
                                                    type="text"
                                                    onChange={handleChange}
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
                                                                    value={formData.lentes_contacto.poder_od}
                                                                    name="poder_od"
                                                                    placeholder="poder_od"
                                                                    type="text"
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    value={formData.lentes_contacto.poder_oi}
                                                                    name="poder_oi"
                                                                    placeholder="poder_oi"
                                                                    type="text"
                                                                    onChange={handleChange}
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
                                                                    value={formData.lentes_contacto.cb_od}
                                                                    name="cb_od"
                                                                    placeholder="cb_od"
                                                                    type="text"
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    value={formData.lentes_contacto.cb_oi}
                                                                    name="cb_oi"
                                                                    placeholder="cb_oi"
                                                                    type="text"
                                                                    onChange={handleChange}
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
                                                                    value={formData.lentes_contacto.dia_od}
                                                                    name="dia_od"
                                                                    placeholder="dia_od"
                                                                    type="text"
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    value={formData.lentes_contacto.dia_oi}
                                                                    name="dia_oi"
                                                                    placeholder="dia_oi"
                                                                    type="text"
                                                                    onChange={handleChange}
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
                                                    value={formData.lentes_contacto.lente_marca}
                                                    name="lente_marca"
                                                    placeholder="Marca"
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="inputAddress">
                                                    Tipo:
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={formData.lentes_contacto.lente_tipo}
                                                    name="lente_tipo"
                                                    placeholder="Tipo"
                                                    type="text"
                                                    onChange={handleChange}
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
                                                    value={formData.conducta_seguir}
                                                    maxLength="225"
                                                    name="conducta_seguir"
                                                    placeholder="Esta área tiene un limite de 225 caracteres."
                                                    rows="2"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row mb-4">
                                            <button type="submit" className="btn btn-success mt-3">
                                                Editar Ortoptica
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

export default EditarOrtoptica