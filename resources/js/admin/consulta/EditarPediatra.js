import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEditarPediatrica } from '../../redux/features/consultas/EditarPediatricaSlice.js';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice.js';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice.js';
import { fetchVerPediatrica } from '../../redux/features/pacientes/VerPediatricaSlice.js';
import Swal from 'sweetalert2';

const EditarPediatra = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id, id_consulta } = useParams();
    const { pacientes } = useSelector((state) => state.pacientes);
    const { sucursales } = useSelector((state) => state.sucursales);
    const { data: pediatrica } = useSelector((state) => state.verPediatrica)

    const [formData, setFormData] = useState({
        sucursal: '',
        doctor: '',
        id_terapia: '',
        paciente: '',
        edad: '',
        fecha_atencion: '',
        m_c: "",
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
            esfera_od_f : "",
            cilindro_od_f: "",
            eje_od_f: "",
            p_base_od_:"",
            add_od_f: "",
            agz_od_f: "",
            esfera_oi_f:"",
            cilindro_oi_f:"",
            eje_oi_f:"",
            p_base_oi_f:"",
            add_oi_f:"",
            agz_oi_f:"",
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
            lente_pd_1:"",
            lente_dpn_1: "",
            lente_altura_1: "",
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
        conducta_seguir: '',
        plan_versiones: '',
        fecha_creacion: '',
        editado: {
            doctor: '',
            fecha_edicion: ''
        },
    });

    useEffect(() => {
        if (pediatrica) {
            setFormData({
                sucursal: pediatrica.sucursal || '',
                doctor: pediatrica.doctor || '',
                paciente: pediatrica.paciente || '',
                id_terapia: pediatrica.id_terapia || '',
                edad: pediatrica.edad || '',
                fecha_atencion: pediatrica.fecha_atencion || '',
                m_c: pediatrica.m_c || '',
                a_o: pediatrica.a_o || '',
                a_p: pediatrica.a_p || '',
                a_f: pediatrica.a_f || '',
                medicamentos: pediatrica.medicamentos || '',
                tratamientos: pediatrica.tratamientos || '',
                desarrollo: pediatrica.desarrollo || '',
                nacimiento: pediatrica.nacimiento || '',
                parto: pediatrica.parto || '',
                incubadora: pediatrica.incubadora || '',
                tiempo: pediatrica.tiempo || '',
                av_sc: pediatrica.av_sc ? JSON.parse(pediatrica.av_sc) : {},
                av_cc: pediatrica.av_cc ? JSON.parse(pediatrica.av_cc) : {},
                ojo_dominante: pediatrica.ojo_dominante || '',
                mano_dominante: pediatrica.mano_dominante || '',
                lensometria: pediatrica.lensometria ? JSON.parse(pediatrica.lensometria) : {},
                lensometria_extra: pediatrica.lensometria_extra ? JSON.parse(pediatrica.lensometria_extra) : {},
                sa_pp: pediatrica.sa_pp ? JSON.parse(pediatrica.sa_pp) : {},
                visuscopia: pediatrica.visuscopia ? JSON.parse(pediatrica.visuscopia) : {},
                visuscopia_extra: pediatrica.visuscopia_extra ? JSON.parse(pediatrica.visuscopia_extra) : {},
                refraccion: pediatrica.refraccion ? JSON.parse(pediatrica.refraccion) : {},
                lentes_contacto: pediatrica.lentes_contacto ? JSON.parse(pediatrica.lentes_contacto) : {},
                pruebas: pediatrica.pruebas ? JSON.parse(pediatrica.pruebas) : {},
                pruebas_extra: pediatrica.pruebas_extra ? JSON.parse(pediatrica.pruebas_extra) : {},
                conducta_seguir: pediatrica.conducta_seguir || '',
                plan_versiones: pediatrica.plan_versiones || '',
                fecha_creacion: pediatrica.fecha_creacion || '',
                editado: pediatrica.editado ? JSON.parse(pediatrica.editado) : {},
            });
        }
    }, [pediatrica]);

    useEffect(() => {
        if (id && id_consulta) {
            dispatch(fetchVerPediatrica({ id, id_consulta }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            // Mostrar alerta de confirmación
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "¡Confirmarás los cambios en los datos!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, guardar',
                cancelButtonText: 'Cancelar'
            });
    
            if (result.isConfirmed) {
                // Despachar la acción
                await dispatch(fetchEditarPediatrica({ id, id_consulta, data: formData }));
    
                // Mostrar alerta de éxito
                await Swal.fire(
                    'Guardado!',
                    'Los datos han sido actualizados.',
                    'success'
                );
    
                // Redirigir a la página anterior
                navigate(-1);
            }
        } catch (error) {
            // Mostrar alerta de error en caso de fallo
            Swal.fire(
                'Error',
                'Ocurrió un error al actualizar los datos. Por favor, inténtalo de nuevo.',
                'error'
            );
        }
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
                                                        <h3 className="text-center">
                                                            Editar Optometría Pediatrica
                                                        </h3>
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
                                                        background: '#0096881c'
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
                                                            {pediatrica.doctor}
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
                                                            <option value={formData.medicamentos}>Seleccione un paciente</option> {/* Opción por defecto */}
                                                            {pacientes.filter(paciente => paciente.id_paciente === pediatrica.paciente).map((paciente) => (
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
                                                            <option value={formData.medicamentos}>Seleccione una sucursal</option> {/* Opción por defecto */}
                                                            {sucursales.filter(sucursal => sucursal.id_sucursal === pediatrica.sucursal).map((sucursal) => (
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
                                                            className="form-control"
                                                            value={formData.m_c}
                                                            maxLength="225"
                                                            name="m_c"
                                                            placeholder="Esta área tiene un limite de 225 caracteres."
                                                            
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
                                                            name="a_o"
                                                            placeholder="A/O"
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
                                                            onChange={handleChange}
                                                            
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
                                                            value={formData.desarrollo}
                                                            
                                                            name="desarrollo"
                                                            onChange={handleChange}
                                                            
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
                                                            value={formData.nacimiento}
                                                            id="nacimiento"
                                                            name="nacimiento"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="tratamientos">
                                                            Parto
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.parto}
                                                            id="parto"
                                                            name="parto"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="tratamientos">
                                                            Incubadora
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.incubadora}
                                                            id="incubadora"
                                                            name="incubadora"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="tratamientos">
                                                            Tiempo
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.tiempo}
                                                            id="tiempo"
                                                            name="tiempo"
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
                                                                                name="av_sc_od_vl"                                                         
                                                                                onChange={handleChange}
                                                                                data-group="av_sc"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={formData.av_sc.av_sc_oi_vl}
                                                                                name="av_sc_oi_vl"
                                                                                onChange={handleChange}
                                                                                data-group="av_sc"
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
                                                                                name="av_sc_od_vp"
                                                                                onChange={handleChange}
                                                                                data-group="av_sc"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={formData.av_sc.av_sc_oi_vp}
                                                                                name="av_sc_oi_vp"
                                                                                onChange={handleChange}
                                                                                data-group="av_sc"
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
                                                                                name="av_sc_od_ph"
                                                                                onChange={handleChange}
                                                                                data-group="av_sc"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={formData.av_sc.av_sc_oi_ph}
                                                                                name="av_sc_oi_ph"
                                                                                onChange={handleChange}
                                                                                data-group="av_sc"
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
                                                                                name="av_cc_od_vl"
                                                                                onChange={handleChange}
                                                                                data-group="av_cc"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={formData.av_cc.av_cc_oi_vl}
                                                                                name="av_cc_oi_vl"
                                                                                onChange={handleChange}
                                                                                data-group="av_cc"
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
                                                                                name="av_cc_od_vp"
                                                                                onChange={handleChange}
                                                                                data-group="av_cc"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={formData.av_cc.av_cc_oi_vp}
                                                                                name="av_cc_oi_vp"
                                                                                onChange={handleChange}
                                                                                data-group="av_cc"
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
                                                                                name="av_cc_od_ph"
                                                                                onChange={handleChange}
                                                                                data-group="av_cc"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={formData.av_cc.av_cc_oi_ph}
                                                                                name="av_cc_oi_ph"
                                                                                onChange={handleChange}
                                                                                data-group="av_cc"
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
                                                                            name="esfera_od"
                                                                            value={formData.lensometria.esfera_od}
                                                                            onChange={handleChange}
                                                                            data-group="lensometria"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="cilindro_od"
                                                                            value={formData.lensometria.cilindro_od}                                                                          
                                                                            onChange={handleChange}
                                                                            data-group="lensometria"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="eje_od"
                                                                            value={formData.lensometria.eje_od}
                                                                            onChange={handleChange}
                                                                            data-group="lensometria"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="p_base_od"
                                                                            value={formData.lensometria.p_base_od}
                                                                            onChange={handleChange}
                                                                            data-group="lensometria"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="add_od"
                                                                            value={formData.lensometria.add_od}
                                                                            onChange={handleChange}
                                                                            data-group="lensometria"
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
                                                                            name="esfera_oi"
                                                                            value={formData.lensometria.esfera_oi}
                                                                            onChange={handleChange}
                                                                            data-group="lensometria"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="cilindro_oi"
                                                                            value={formData.lensometria.cilindro_oi}
                                                                            onChange={handleChange}
                                                                            data-group="lensometria"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="eje_oi"
                                                                            value={formData.lensometria.eje_oi}
                                                                            onChange={handleChange}
                                                                            data-group="lensometria"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="p_base_oi"
                                                                            value={formData.lensometria.p_base_oi}
                                                                            onChange={handleChange}
                                                                            data-group="lensometria"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="add_oi"
                                                                            value={formData.lensometria.add_oi}
                                                                            onChange={handleChange}
                                                                            data-group="lensometria"
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
                                                            name="len_tipo_lentes"
                                                            value={formData.lensometria_extra.len_tipo_lentes}
                                                            onChange={handleChange}
                                                            data-group="lensometria_extra"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="objetivos">
                                                            Filtros
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            name="len_filtros"
                                                            value={formData.lensometria_extra.len_filtros}
                                                            onChange={handleChange}
                                                            data-group="lensometria_extra"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="objetivos">
                                                            Tiempo
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            name="len_tiempo"
                                                            value={formData.lensometria_extra.len_tiempo}
                                                            onChange={handleChange}
                                                            data-group="lensometria_extra"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="objetivos">
                                                            Tipo de Aro
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            name="len_tipo_aro"
                                                            value={formData.lensometria_extra.len_tipo_aro}
                                                            onChange={handleChange}
                                                            data-group="lensometria_extra"
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
                                                            name="sa_od"
                                                            value={formData.sa_pp.sa_od}
                                                            onChange={handleChange}
                                                            data-group="sa_pp"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <input
                                                            className="form-control"
                                                            value={formData.sa_pp.pp_od}
                                                            name="pp_od"
                                                            onChange={handleChange}
                                                            data-group="sa_pp"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-3">
                                                        <input
                                                            className="form-control"
                                                            value={formData.sa_pp.sa_oi}
                                                            name="sa_oi"
                                                            onChange={handleChange}
                                                            data-group="sa_pp"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <input
                                                            className="form-control"
                                                            value={formData.sa_pp.pp_oi}
                                                            name="pp_oi"
                                                            onChange={handleChange}
                                                            data-group="sa_pp"
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
                                                        id="v_od"
                                                        name="viscopia_od"
                                                        onChange={handleChange}
                                                        data-group="visuscopia"
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="v_oi">
                                                        OI
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        value={formData.visuscopia.viscopia_oi}
                                                        id="v_oi"
                                                        name="viscopia_oi"
                                                        onChange={handleChange}
                                                        data-group="visuscopia"
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
                                                        id="hirschberg"
                                                        name="hirschberg"
                                                        onChange={handleChange}
                                                        data-group="visuscopia"
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="tratamientos">
                                                        Krismsky
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        value={formData.visuscopia.krismsky}
                                                        id="krismsky"
                                                        name="krismsky"
                                                        onChange={handleChange}
                                                        data-group="visuscopia"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="inputAddress">
                                                        VERSIONES:
                                                    </label>
                                                    <textarea
                                                        className="form-control"
                                                        value={formData.plan_versiones}
                                                        maxLength="800"    
                                                        name="plan_versiones"
                                                        onChange={handleChange}
                                                        rows="8"
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
                                                        onChange={handleChange}
                                                        data-group="visuscopia"
                                                    />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="VP">
                                                        VP
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        value={formData.visuscopia.ct_vp}
                                                        id="VP"
                                                        name="ct_vp"
                                                        onChange={handleChange}
                                                        data-group="visuscopia"
                                                    />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="maddox">
                                                        MADDOX:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        value={formData.visuscopia.maddox}
                                                        id="maddox"
                                                        name="maddox"
                                                        onChange={handleChange}
                                                        data-group="visuscopia"

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
                                                        id="ao"
                                                        name="seguimiento_ao"
                                                        onChange={handleChange}
                                                        data-group="visuscopia_extra"
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="tratamientos">
                                                        Sacádicos(AO):{' '}
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        value={formData.visuscopia_extra.sacadicos_ao}
                                                        id="ao"
                                                        name="sacadicos_ao"
                                                        onChange={handleChange}
                                                        data-group="visuscopia_extra"
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
                                                        id="or"
                                                        name="ppc_or"
                                                        onChange={handleChange}
                                                        data-group="visuscopia_extra"
                                                    />
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="tratamientos">
                                                        L:{' '}
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        value={formData.visuscopia_extra.ppc_l}
                                                        id="L"
                                                        name="ppc_l"
                                                        onChange={handleChange}
                                                        data-group="visuscopia_extra"
                                                    />
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="tratamientos">
                                                        FR:{' '}
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        value={formData.visuscopia_extra.ppc_fr}
                                                        id="FR"
                                                        name="ppc_fr"
                                                        onChange={handleChange}
                                                        data-group="visuscopia_extra"
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="tratamientos">
                                                        Posicion compensatoria:{' '}
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        value={formData.visuscopia_extra.ppc_posicion}
                                                        id="Posicion"
                                                        name="ppc_posicion"
                                                        onChange={handleChange}
                                                        data-group="visuscopia_extra"
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
                                                                    onChange={handleChange}
                                                                    data-group="pruebas"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    value={formData.pruebas.vp_luces}
                                                                    name="vp_luces"
                                                                    onChange={handleChange}
                                                                    data-group="pruebas"
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
                                                                    onChange={handleChange}
                                                                    data-group="pruebas"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    value={formData.pruebas.vp_bg}
                                                                    name="vp_bg"
                                                                    onChange={handleChange}
                                                                    data-group="pruebas"
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
                                                        value={formData.pruebas_extra?.randot || ''}
                                                       
                                                        name="randot"
                                                        onChange={handleChange}
                                                        data-group="pruebas_extra"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="inputAddress">
                                                        Lang:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        value={formData.pruebas_extra?.lang || ''}
                                                        
                                                        name="lang"
                                                        onChange={handleChange}
                                                        data-group="pruebas_extra"
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
                                                        value={formData.pruebas_extra?.vision_color || ''}
                                                        id="inputAddress"
                                                        name="vision_color"
                                                        onChange={handleChange}
                                                        data-group="pruebas_extra"
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
                                                                    <input
                                                                        className="form-control"
                                                                        name="esfera_od_f"
                                                                        value={formData.refraccion?.esfera_od_f || ''}
                                                                        onChange={handleChange}
                                                                        data-group="refraccion"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="cilindro_od_f"
                                                                        value={formData.refraccion.cilindro_od_f}
                                                                        onChange={handleChange}
                                                                        data-group="refraccion"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="eje_od_f"
                                                                        value={formData.refraccion.eje_od_f}
                                                                        onChange={handleChange}
                                                                        data-group="refraccion"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="p_base_od_f"
                                                                        value={formData.refraccion.p_base_od_f}
                                                                        onChange={handleChange}
                                                                        data-group="refraccion"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="add_od_f"
                                                                        value={formData.refraccion.add_od_f}
                                                                        onChange={handleChange}
                                                                        data-group="refraccion"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="agz_od_f"
                                                                        value={formData.refraccion.agz_od_f}
                                                                        onChange={handleChange}
                                                                        data-group="refraccion"
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
                                                                        name="esfera_oi_f"
                                                                        value={formData.refraccion.esfera_oi_f}
                                                                        onChange={handleChange}
                                                                        data-group="refraccion"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="cilindro_oi_f"
                                                                        value={formData.refraccion.cilindro_oi_f}
                                                                        onChange={handleChange}
                                                                        data-group="refraccion"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="eje_oi_f"
                                                                        value={formData.refraccion.eje_oi_f}
                                                                        onChange={handleChange}
                                                                        data-group="refraccion"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="p_base_oi_f"
                                                                        value={formData.refraccion.p_base_oi_f}
                                                                        onChange={handleChange}
                                                                        data-group="refraccion"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="add_oi_f"
                                                                        value={formData.refraccion.add_oi_f}
                                                                        onChange={handleChange}
                                                                        data-group="refraccion"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="agz_oi_f"
                                                                        value={formData.refraccion.agz_oi_f}
                                                                        onChange={handleChange}
                                                                        data-group="refraccion"
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
                                                        id="inputAddress"
                                                        name="lente_marca_1"
                                                        value={formData.lentes_contacto.lente_marca_1}
                                                        onChange={handleChange}
                                                        data-group="lentes_contacto"
                                                    />
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="inputAddress">
                                                        PD:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="inputAddress"
                                                        name="lente_pd_1"
                                                        value={formData.lentes_contacto.lente_pd_1}
                                                        onChange={handleChange}
                                                        data-group="lentes_contacto"
                                                    />
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="inputAddress">
                                                        PD:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="inputAddress"
                                                        name="lente_dpn_1"
                                                        value={formData.lentes_contacto.lente_dpn_1}
                                                        onChange={handleChange}
                                                        data-group="lentes_contacto"
                                                    />
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="inputAddress">
                                                        Altura:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="inputAddress"
                                                        name="lente_altura_1"
                                                        value={formData.lentes_contacto.lente_altura_1}
                                                        onChange={handleChange}
                                                        data-group="lentes_contacto"
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
                                                                        name="poder_od"
                                                                        value={formData.lentes_contacto.poder_od}
                                                                        onChange={handleChange}
                                                                        data-group="lentes_contacto"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="poder_oi"
                                                                        value={formData.lentes_contacto.poder_oi}
                                                                        onChange={handleChange}
                                                                        data-group="lentes_contacto"
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
                                                                        name="cb_od"
                                                                        value={formData.lentes_contacto.cb_od}
                                                                        onChange={handleChange}
                                                                        data-group="lentes_contacto"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="cb_oi"
                                                                        value={formData.lentes_contacto.cb_oi}
                                                                        onChange={handleChange}
                                                                        data-group="lentes_contacto"
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
                                                                        name="dia_od"
                                                                        value={formData.lentes_contacto.dia_od}
                                                                        onChange={handleChange}
                                                                        data-group="lentes_contacto"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="dia_oi"
                                                                        value={formData.lentes_contacto.dia_oi}
                                                                        onChange={handleChange}
                                                                        data-group="lentes_contacto"
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
                                                        id="inputAddress"
                                                        name="lente_marca"
                                                        value={formData.lentes_contacto.lente_marca}
                                                        onChange={handleChange}
                                                        data-group="lentes_contacto"
                                                        
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="inputAddress">
                                                        Tipo:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="inputAddress"
                                                        name="lente_tipo"
                                                        value={formData.lentes_contacto.lente_tipo}
                                                        onChange={handleChange}
                                                        data-group="lentes_contacto"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="inputAddress">
                                                        CONDUCTA A SEGUIR:
                                                    </label>
                                                    <textarea
                                                        className="form-control"
                                                        id="textarea"
                                                        maxLength="800"
                                                        name="conducta_seguir"
                                                        value={formData.conducta_seguir}
                                                        rows="8"
                                                        onChange={handleChange}
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

export default EditarPediatra