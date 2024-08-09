import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchEditarNeonato } from '../../redux/features/consultas/EditarNeonatoSlice.js';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice.js';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice.js';
import { fetchVerNeonatos } from '../../redux/features/pacientes/VerNeonatosSlice.js';

const EditarNeonatos = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id, id_consulta } = useParams();
    const { pacientes } = useSelector((state) => state.pacientes);
    const { sucursales } = useSelector((state) => state.sucursales);
    const { data: neonato } = useSelector((state) => state.verNeonatos)

    const [formData, setFormData] = useState({
        sucursal: '',
        paciente: '',
        edad: '',
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
        gateo: '',
        lenguaje: '',
        complicaciones: '',
        perinatales: '',
        postnatales: '',
        agudeza_visual:
        {
            tambor: '',
            fija: '',
            sigue: '',
            mantiene: '',
            test: '',
            a_oi: '',
            a_ao: ''
        },
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
        pruebas_extras:
        {
            hirschberg: '',
            krismsky: '',
            plan_versiones: '',
            ct_vp: '',
            ct_reflejo: '',
            ducciones_od: '',
            ducciones_oi: '',
            posicion_compensatoria: '',
            fotomotor_od: '',
            consensual: '',
            fotomotor_oi: '',
            fotomotor_consensual: ''
        },
        refraccion:
        {
            refraccion_tipo_lentes: '',
            refraccion_pd: '',
            refraccion_uso: '',
            reflejo_r_od: '',
            reflejo_r_oi: '',
            reflejo_r_ao: '',
            esfera_od_f: '',
            cilindro_od_f: '',
            eje_od_f: '',
            p_base_od_f: '',
            add_od_f: '',
            esfera_oi_f: '',
            cilindro_oi_f: '',
            eje_oi_f: '',
            p_base_oi_f: '',
            add_oi_f: ''
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
        if (neonato) {
            setFormData({
                sucursal: neonato.sucursal || '',
                doctor: neonato.doctor || '',
                paciente: neonato.paciente || '',
                id_terapia: neonato.id_terapia || '',
                edad: neonato.edad || '',
                fecha_atencion: neonato.fecha_atencion || '',
                m_c: neonato.m_c || '',
                a_o: neonato.a_o || '',
                a_p: neonato.a_p || '',
                a_f: neonato.a_f || '',
                medicamentos: neonato.medicamentos || '',
                tratamientos: neonato.tratamientos || '',
                desarrollo: neonato.desarrollo || '',
                nacimiento: neonato.nacimiento || '',
                parto: neonato.parto || '',
                gateo: neonato.gateo || '',
                lenguaje: neonato.lenguaje || '',
                complicaciones: neonato.complicaciones || '',
                perinatales: neonato.perinatales || '',
                postnatales: neonato.postnatales || '',
                agudeza_visual: neonato.agudeza_visual ? JSON.parse(neonato.agudeza_visual) : {},
                lensometria: neonato.lensometria ? JSON.parse(neonato.lensometria) : {},
                lensometria_extra: neonato.lensometria_extra ? JSON.parse(neonato.lensometria_extra) : {},
                sa_pp: neonato.sa_pp ? JSON.parse(neonato.sa_pp) : {},
                pruebas_extra: neonato.pruebas_extra ? JSON.parse(neonato.pruebas_extra) : {},
                refraccion: neonato.refraccion ? JSON.parse(neonato.refraccion) : {},
                acomodacion_extra: neonato.acomodacion_extra ? JSON.parse(neonato.acomodacion_extra) : {},
                conducta_seguir: neonato.conducta_seguir || '',
                plan_versiones: neonato.plan_versiones || '',
                fecha_creacion: neonato.fecha_creacion || '',
                editado: neonato.editado ? JSON.parse(neonato.editado) : {},
            });
        }
    }, [neonato]);

    useEffect(() => {
        if (id && id_consulta) {
            dispatch(fetchVerNeonatos({ id, id_consulta }));
            dispatch(fetchSucursales({ page: 1, limit: 100 }));
            dispatch(fetchPacientes({ page: 1, limit: 10000 }));
        }
    }, [dispatch, id, id_consulta]);


    const handleChange = (e) => {
        const { name, value, dataset } = e.target;

        console.log('Handling change for:', name, value, dataset.group);

        setFormData((prevFormData) => {
            switch (dataset.group) {
                case 'agudeza_visual':
                    return {
                        ...prevFormData,
                        agudeza_visual: {
                            ...prevFormData.agudeza_visual,
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
                case 'pruebas_extra':
                    return {
                        ...prevFormData,
                        pruebas_extra: {
                            ...prevFormData.pruebas_extra,
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
        console.log('Submitting form with data:', formData); // Agrega esta línea para depuración
        dispatch(fetchEditarNeonato({ id, id_consulta, data: formData }));
        navigate(''); // Reemplaza con la ruta a la que quieres redirigir después de actualizar
    };

    return (
        <div
            className="admin-data-content"
            data-select2-id="8"
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
                            <div
                                className="widget-one"
                                data-select2-id="7"
                            >
                                <div className="row">
                                    <div
                                        className="col-lg-12 layout-spacing"
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
                                                            {' '}Editar Optometría Neonatos
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
                                                            Creado por:
                                                        </a>
                                                    </li>
                                                    <li
                                                        aria-current="page"
                                                        className="breadcrumb-item active"
                                                    >
                                                        <b>
                                                            {neonato.doctor}
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
                                                            {pacientes.filter(paciente => paciente.id_paciente === neonato.paciente).map((paciente) => (
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
                                                            {sucursales.filter(sucursal => sucursal.id_sucursal === neonato.sucursal).map((sucursal) => (
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
                                                            maxLength="10000"
                                                            value={formData.m_c}
                                                            name="m_c"
                                                            placeholder="Esta área tiene un limite de 10000 caracteres."
                                                            rows="15"
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
                                                            defaultValue="  PADRES MIOP"
                                                            id="inputAddress2"
                                                            name="a_f"
                                                            placeholder="A/F"
                                                            type="text"
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
                                                            defaultValue="  ANTIHISTAMINICOS"
                                                            id="medicamentos"
                                                            name="medicamentos"
                                                            placeholder="Medicamentos"
                                                            type="text"
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
                                                            defaultValue="  Ninguno"
                                                            id="tratamientos"
                                                            name="tratamientos"
                                                            placeholder="Tratamientos"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="tratamientos">
                                                            Desarrollo del infante
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="  RESTRASO GLOBAL DEL DESA"
                                                            id="tratamientos"
                                                            name="desarrollo_infante"
                                                            placeholder="Desarrollo del infante"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="tratamientos">
                                                            Nacimiento
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="  33 SEMANAS"
                                                            id="tratamientos"
                                                            name="nacimiento"
                                                            placeholder="Nacimiento"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="tratamientos">
                                                            Parto
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="  Cesarea"
                                                            id="tratamientos"
                                                            name="parto"
                                                            placeholder="Parto"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="tratamientos">
                                                            Gateo
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="  SI"
                                                            id="tratamientos"
                                                            name="gateo"
                                                            placeholder="Gateo"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="tratamientos">
                                                            Lenguaje
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="  NO VERBAL"
                                                            id="tratamientos"
                                                            name="lenguaje"
                                                            placeholder="Lenguaje"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="tratamientos">
                                                            Complicaciones Prenatales
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="  "
                                                            id="tratamientos"
                                                            name="complicaciones"
                                                            placeholder="Complicaciones Prenatales"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="tratamientos">
                                                            Perinatales
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="  "
                                                            id="tratamientos"
                                                            name="perinatales"
                                                            placeholder="Perinatales"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="tratamientos">
                                                            Postnatales
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="  "
                                                            id="tratamientos"
                                                            name="postnatales"
                                                            placeholder="Postnatales"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <h6>
                                                    AGUDEZA VISUAL:
                                                </h6>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="tambor">
                                                            Tambor Optocinético AO{' '}
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="  "
                                                            id="tambor"
                                                            name="tambor"
                                                            placeholder="Tambor Optocinético"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="fija">
                                                            Fija
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="  SI"
                                                            id="fija"
                                                            name="fija"
                                                            placeholder="Fija"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="sigue">
                                                            Sigue
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="  SI"
                                                            id="sigue"
                                                            name="sigue"
                                                            placeholder="Sigue"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="mantiene">
                                                            Mantiene
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="  SI"
                                                            id="mantiene"
                                                            name="mantiene"
                                                            placeholder="Mantiene"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="test">
                                                            Test mirada prefencial OD{' '}
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="------------"
                                                            id="test"
                                                            name="test"
                                                            placeholder="Test"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="oi">
                                                            OI
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="-----------"
                                                            id="oi"
                                                            name="a_oi"
                                                            placeholder="OI"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="ao">
                                                            AO
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="respuesta a todos los patrones"
                                                            id="ao"
                                                            name="a_ao"
                                                            placeholder="AO"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
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
                                                                        Ojo Derecho{' '}
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue="-------"
                                                                            name="esfera_od"
                                                                            placeholder="esfera_od"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue=""
                                                                            name="cilindro_od"
                                                                            placeholder="cilindro_od"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue=""
                                                                            name="eje_od"
                                                                            placeholder="eje_od"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue=""
                                                                            name="p_base_od"
                                                                            placeholder="p_base_od"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue=""
                                                                            name="add_od"
                                                                            placeholder="add_od"
                                                                            type="text"
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
                                                                            defaultValue="------"
                                                                            name="esfera_oi"
                                                                            placeholder="esfera_oi"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue=""
                                                                            name="cilindro_oi"
                                                                            placeholder="cilindro_oi"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue=""
                                                                            name="eje_oi"
                                                                            placeholder="eje_oi"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue=""
                                                                            name="p_base_oi"
                                                                            placeholder="p_base_oi"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue=""
                                                                            name="add_oi"
                                                                            placeholder="add_oi"
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
                                                            defaultValue=" NUNCA HA USADO RX"
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
                                                            defaultValue="------"
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
                                                            defaultValue="--------"
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
                                                            defaultValue="---------------"
                                                            name="len_tipo_aro"
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
                                                            defaultValue="OD Normales"
                                                            name="sa_od"
                                                            placeholder="SA_OD"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <input
                                                            className="form-control"
                                                            defaultValue="OD Medios Transparente"
                                                            name="pp_od"
                                                            placeholder="PP_OD"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-3">
                                                        <input
                                                            className="form-control"
                                                            defaultValue="OS Normales"
                                                            name="sa_oi"
                                                            placeholder="SA_OI"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <input
                                                            className="form-control"
                                                            defaultValue="OS Medios Transparente"
                                                            name="pp_oi"
                                                            placeholder="PP_OI"
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
                                                        defaultValue="Centrado Orthoposicion "
                                                        id="D"
                                                        name="hirschberg"
                                                        placeholder="Hirschberg"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="tratamientos">
                                                        Krismsky
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="--------"
                                                        id="I"
                                                        name="krismsky"
                                                        placeholder="Krismsky"
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
                                                        defaultValue="HIPERFUNCION MUSCULOS RECTOS LATERALES MAYOR DEL OD. "
                                                        id="textarea"
                                                        maxLength="10000"
                                                        name="plan_versiones"
                                                        placeholder="limite de 10000* caracteres."
                                                        rows="15"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tratamientos">
                                                        CT: VP:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="XT ALT INT +OD"
                                                        id="D"
                                                        name="ct_vp"
                                                        placeholder="VP"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tratamientos">
                                                        Reflejo Cocleopalpebral
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="Presente"
                                                        id="I"
                                                        name="ct_reflejo"
                                                        placeholder="Reflejo Cocleopalpebral"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tratamientos">
                                                        Ducciones:OD
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="NORMAL"
                                                        id="I"
                                                        name="ducciones_od"
                                                        placeholder="OD"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tratamientos">
                                                        OI
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="NORMAL"
                                                        id="I"
                                                        name="ducciones_oi"
                                                        placeholder="OI"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-8">
                                                    <label htmlFor="tratamientos">
                                                        Posición Compensatoria
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue=""
                                                        id="I"
                                                        name="posicion_compensatoria"
                                                        placeholder="Posicion Compensatoria"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tratamientos">
                                                        Reflejos Pupilares: Fotomotor/OD{' '}
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="NORMALES"
                                                        id="D"
                                                        name="fotomotor_od"
                                                        placeholder="Fotomotor/OD"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tratamientos">
                                                        Consensual
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="NORMAL"
                                                        id="I"
                                                        name="consensual"
                                                        placeholder="Consensual"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tratamientos">
                                                        Fotomotor:OI
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="NORMAL"
                                                        id="I"
                                                        name="fotomotor_oi"
                                                        placeholder="Fotomotor OI"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tratamientos">
                                                        Consensual
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="NORMAL"
                                                        id="I"
                                                        name="fotomotor_consensual"
                                                        placeholder="Fotomotor Consensual"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="inputAddress">
                                                        Reflejo retinoscopico OD:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="BRILLOSO Y LIMPIO"
                                                        id="inputAddress"
                                                        name="reflejo_r_od"
                                                        placeholder="Reflejo retinoscopico OD"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="inputAddress">
                                                        OI:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="BRILLOSO Y LIMPIO"
                                                        id="inputAddress"
                                                        name="reflejo_r_oi"
                                                        placeholder="OI"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="inputAddress">
                                                        AO:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue=""
                                                        id="inputAddress"
                                                        name="reflejo_r_ao"
                                                        placeholder="AO"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
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
                                                                    defaultValue="-1.00SPH"
                                                                    name="esfera_od_f"
                                                                    placeholder="esfera_od"
                                                                    type="text"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    defaultValue=""
                                                                    name="cilindro_od_f"
                                                                    placeholder="cilindro_od"
                                                                    type="text"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    defaultValue=""
                                                                    name="eje_od_f"
                                                                    placeholder="eje_od"
                                                                    type="text"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    defaultValue="3 B.INT"
                                                                    name="p_base_od_f"
                                                                    placeholder="p_base_od"
                                                                    type="text"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    defaultValue="OBJETIVA"
                                                                    name="add_od_f"
                                                                    placeholder="add_od"
                                                                    type="text"
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
                                                                    defaultValue="-1.00SPH"
                                                                    name="esfera_oi_f"
                                                                    placeholder="esfera_oi"
                                                                    type="text"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    defaultValue=""
                                                                    name="cilindro_oi_f"
                                                                    placeholder="cilindro_oi"
                                                                    type="text"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    defaultValue=""
                                                                    name="eje_oi_f"
                                                                    placeholder="eje_oi"
                                                                    type="text"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    defaultValue="3 B.INT"
                                                                    name="p_base_oi_f"
                                                                    placeholder="p_base_oi"
                                                                    type="text"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    defaultValue="OBJETIVA"
                                                                    name="add_oi_f"
                                                                    placeholder="add_oi"
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
                                                    Tipo Lentes
                                                </label>
                                                <input
                                                    className="form-control"
                                                    defaultValue="MONOFOCALES POLY SENCILLOS. PERMANENTE"
                                                    id="inputAddress"
                                                    name="refraccion_tipo_lentes"
                                                    placeholder="Tipo Lentes"
                                                    type="text"
                                                />
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="inputAddress">
                                                    PD:
                                                </label>
                                                <input
                                                    className="form-control"
                                                    defaultValue="48/50"
                                                    id="inputAddress"
                                                    name="refraccion_pd"
                                                    placeholder="PD"
                                                    type="text"
                                                />
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="inputAddress">
                                                    USO:
                                                </label>
                                                <input
                                                    className="form-control"
                                                    defaultValue="PERMANENTE"
                                                    id="inputAddress"
                                                    name="refraccion_uso"
                                                    placeholder="USO"
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
                                                    defaultValue="EXPLICO QUE PRESENTA EXOTROPIA ALTERNANTE INTERMITENTE Y QUE TIENE MIOPIA BAJA... ESTO ESTA RELACIONADA CON LA DESVIACION OCULAR.... REQUIERE USO DE LENTES PERMANENTE CON PRISMAS. CITA 1 MES DE USO LENTES. HOY PAGA 40 TPC"
                                                    id="textarea"
                                                    maxLength="10000"
                                                    name="conducta_seguir"
                                                    placeholder="Esta área tiene un limite de 10000 caracteres."
                                                    rows="15"
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
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditarNeonatos