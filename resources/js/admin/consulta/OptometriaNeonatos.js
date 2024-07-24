import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice.js';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice';
import { crearNeonato } from '../../redux/features/consultas/OptometriaNeonatosSlice.js';
import { Formik } from 'formik';

const OptometriaNeonatos = () => {

    const dispatch = useDispatch();
    const { pacientes } = useSelector((state) => state.pacientes);
    const { sucursales } = useSelector((state) => state.sucursales);
    const { status, error } = useSelector((state) => state.optometriaNeonatos);

    const [formData, setFormData] = useState({
        sucursal: '',
        doctor: 'ejmplo doctor',
        id_terapia: '1',
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

        agudeza_visual: {
            tambor: '',
            fija: '',
            sigue: '',
            mantiene: '',
            test: '',
            a_oi: '',
            a_ao: ''
        },
        lensometria: {
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
        lensometria_extra: {
            len_tipo_lentes: '',
            len_filtros: '',
            len_tiempo: '',
            len_tipo_aro: ''
        },
        sa_pp: {
            sa_od: '',
            pp_od: '',
            sa_oi: '',
            pp_oi: ''
        },
        pruebas_extras: {
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
        refraccion: {
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
        // Add other fields as necessary
    });
    useEffect(() => {
        dispatch(fetchSucursales({ page: 1, limit: 100 }));
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchPacientes({ page: 1, limit: 10000 }));
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAgudezaVisualChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            agudeza_visual: {
                ...prevState.agudeza_visual,
                [name]: value,
            },
        }));
    };

    const handleLensometriaChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            lensometria: {
                ...prevState.lensometria,
                [name]: value,
            },
        }));
    };

    const handleLensometriaExtraChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            lensometria_extra: {
                ...prevState.lensometria_extra,
                [name]: value,
            },
        }));
    };
    const handleSA_PPChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            sa_pp: {
                ...prevState.sa_pp,
                [name]: value,
            },
        }));
    };

    const handlePruebas_extrasChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            pruebas_extras: {
                ...prevState.pruebas_extras,
                [name]: value,
            },
        }));
    };

    const handleRefraccionChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            refraccion: {
                ...prevState.refraccion,
                [name]: value,
            },
        }));
    };

    const handleSubmit = () => {
        dispatch(crearNeonato(formData));
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
                                                    Optometría Neonatos
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="widget-content widget-content-area">
                                        <form
                                            method="post"
                                            role="form"
                                        >
                                            <div className="form-row mb-12">
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="inputEmail4">
                                                        Pacientes
                                                    </label>
                                                    <select
                                                        aria-hidden="true"
                                                        className="form-control"
                                                        data-select2-id="1"
                                                        name="paciente"
                                                        value={formData.paciente}
                                                        onChange={handleSelectChange}
                                                        tabIndex="-1"
                                                    >
                                                        <option
                                                            data-select2-id="3"
                                                            value=""
                                                        >
                                                            {`<--- Seleccione el paciente --->`}
                                                        </option>
                                                        {pacientes.map((paciente) => (
                                                            <option
                                                                key={paciente.id_paciente}
                                                                value={paciente.id_paciente}
                                                            >
                                                                Número Cedula: {paciente.nro_cedula} || Nombres: {paciente.nombres} {paciente.apellidos}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-row mb-12">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="inputSucursal">
                                                        Sucursal
                                                    </label>
                                                    <select
                                                        className="form-control"
                                                        id="sucursal"
                                                        name="sucursal"
                                                        value={formData.sucursal}
                                                        onChange={handleSelectChange}
                                                        required
                                                    >
                                                        <option value="">
                                                            Seleccionar sucursal
                                                        </option>

                                                        {sucursales.map((sucursal) => (
                                                            <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>{sucursal.nombre}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="edad">
                                                        Edad
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="edad"
                                                        name="edad"
                                                        value={formData.edad}
                                                        onChange={handleChange}
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="inputAddress">
                                                        Fecha de atencion
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="inputAddress"
                                                        max="2024-07-04"
                                                        name="fecha_atencion"
                                                        value={formData.fecha_atencion}
                                                        onChange={handleChange}
                                                        required
                                                        type="date"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="inputAddress">
                                                        Motivo de consulta:
                                                    </label>
                                                    <textarea
                                                        className="form-control textarea"
                                                        id="textarea"
                                                        maxLength="10000"
                                                        name="m_c"
                                                        value={formData.m_c}
                                                        onChange={handleChange}
                                                        placeholder=""
                                                        rows="15"
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
                                                        id="lugarNacimiento"
                                                        name="a_o"
                                                        value={formData.a_o}
                                                        onChange={handleChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="inputAddress2">
                                                        Antecedentes Personales
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="inputAddress2"
                                                        name="a_p"
                                                        value={formData.a_p}
                                                        onChange={handleChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="inputAddress2">
                                                        Antecedentes Familiares
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="inputAddress2"
                                                        name="a_f"
                                                        value={formData.a_f}
                                                        onChange={handleChange}
                                                        placeholder=""
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
                                                        id="medicamentos"
                                                        name="medicamentos"
                                                        value={formData.medicamentos}
                                                        onChange={handleChange}
                                                        placeholder=""
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
                                                        id="tratamientos"
                                                        name="tratamientos"
                                                        value={formData.tratamientos}
                                                        onChange={handleChange}
                                                        placeholder=""
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
                                                        id="tratamientos"
                                                        name="desarrollo"
                                                        value={formData.desarrollo}
                                                        onChange={handleChange}
                                                        placeholder=""
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
                                                        id="tratamientos"
                                                        name="nacimiento"
                                                        value={formData.nacimiento}
                                                        onChange={handleChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tratamientos">
                                                        Parto
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="tratamientos"
                                                        name="parto"
                                                        value={formData.parto}
                                                        onChange={handleChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tratamientos">
                                                        Gateo
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="tratamientos"
                                                        name="gateo"
                                                        value={formData.gateo}
                                                        onChange={handleChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tratamientos">
                                                        Lenguaje
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="tratamientos"
                                                        name="lenguaje"
                                                        value={formData.lenguaje}
                                                        onChange={handleChange}
                                                        placeholder=""
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
                                                        id="tratamientos"
                                                        name="complicaciones"
                                                        value={formData.complicaciones}
                                                        onChange={handleChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="tratamientos">
                                                        Perinatales
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="tratamientos"
                                                        name="perinatales"
                                                        value={formData.perinatales}
                                                        onChange={handleChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="tratamientos">
                                                        Postnatales
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="tratamientos"
                                                        name="postnatales"
                                                        value={formData.postnatales}
                                                        onChange={handleChange}
                                                        placeholder=""
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
                                                        id="tambor"
                                                        name="tambor"
                                                        value={formData.agudeza_visual.tambor}
                                                        onChange={handleAgudezaVisualChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="fija">
                                                        Fija
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="fija"
                                                        name="fija"
                                                        value={formData.agudeza_visual.fija}
                                                        onChange={handleAgudezaVisualChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="sigue">
                                                        Sigue
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="sigue"
                                                        name="sigue"
                                                        value={formData.agudeza_visual.sigue}
                                                        onChange={handleAgudezaVisualChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="mantiene">
                                                        Mantiene
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="mantiene"
                                                        name="mantiene"
                                                        value={formData.agudeza_visual.mantiene}
                                                        onChange={handleAgudezaVisualChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="test">
                                                        Test mirada preferencial OD{' '}
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="test"
                                                        name="test"
                                                        value={formData.agudeza_visual.test}
                                                        onChange={handleAgudezaVisualChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="oi">
                                                        OI
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="oi"
                                                        name="a_oi"
                                                        value={formData.agudeza_visual.a_oi}
                                                        onChange={handleAgudezaVisualChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="ao">
                                                        AO
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="ao"
                                                        name="a_ao"
                                                        value={formData.agudeza_visual.a_ao}
                                                        onChange={handleAgudezaVisualChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
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
                                                                        onChange={handleLensometriaChange}
                                                                        placeholder=""
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="cilindro_od"
                                                                        value={formData.lensometria.cilindro_od}
                                                                        onChange={handleLensometriaChange}
                                                                        placeholder=""
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="eje_od"
                                                                        value={formData.lensometria.eje_od}
                                                                        onChange={handleLensometriaChange}
                                                                        placeholder=""
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="p_base_od"
                                                                        value={formData.lensometria.p_base_od}
                                                                        onChange={handleLensometriaChange}
                                                                        placeholder="△"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="add_od"
                                                                        value={formData.lensometria.add_od}
                                                                        onChange={handleLensometriaChange}
                                                                        placeholder=""
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
                                                                        name="esfera_oi"
                                                                        value={formData.lensometria.esfera_oi}
                                                                        onChange={handleLensometriaChange}
                                                                        placeholder=""
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="cilindro_oi"
                                                                        value={formData.lensometria.cilindro_oi}
                                                                        onChange={handleLensometriaChange}
                                                                        placeholder=""
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="eje_oi"
                                                                        value={formData.lensometria.eje_oi}
                                                                        onChange={handleLensometriaChange}
                                                                        placeholder=""
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="p_base_oi"
                                                                        value={formData.lensometria.p_base_oi}
                                                                        onChange={handleLensometriaChange}
                                                                        placeholder="△"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="add_oi"
                                                                        value={formData.lensometria.add_oi}
                                                                        onChange={handleLensometriaChange}
                                                                        placeholder=""
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
                                                        name="len_tipo_lentes"
                                                        value={formData.lensometria_extra.len_tipo_lentes}
                                                        onChange={handleLensometriaExtraChange}
                                                        type="text"
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
                                                        onChange={handleLensometriaExtraChange}
                                                        type="text"
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
                                                        onChange={handleLensometriaExtraChange}
                                                        type="text"
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
                                                        onChange={handleLensometriaExtraChange}
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
                                                        name="sa_od"
                                                        value={formData.sa_pp.sa_od}
                                                        onChange={handleSA_PPChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <input
                                                        className="form-control"
                                                        name="pp_od"
                                                        value={formData.sa_pp.pp_od}
                                                        onChange={handleSA_PPChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-3">
                                                    <input
                                                        className="form-control"
                                                        name="sa_oi"
                                                        value={formData.sa_pp.sa_oi}
                                                        onChange={handleSA_PPChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <input
                                                        className="form-control"
                                                        name="pp_oi"
                                                        value={formData.sa_pp.pp_oi}
                                                        onChange={handleSA_PPChange}
                                                        placeholder=""
                                                        type="text"
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
                                                        id="D"
                                                        name="hirschberg"
                                                        value={formData.pruebas_extras.hirschberg}
                                                        onChange={handlePruebas_extrasChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="tratamientos">
                                                        Krismsky
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="I"
                                                        name="krismsky"
                                                        value={formData.pruebas_extras.krismsky}
                                                        onChange={handlePruebas_extrasChange}
                                                        placeholder=""
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
                                                        maxLength="10000"
                                                        name="plan_versiones"
                                                        value={formData.pruebas_extras.plan_versiones}
                                                        onChange={handlePruebas_extrasChange}
                                                        placeholder=""
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
                                                        id="D"
                                                        name="ct_vp"
                                                        value={formData.pruebas_extras.ct_vp}
                                                        onChange={handlePruebas_extrasChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tratamientos">
                                                        Reflejo Cocleopalpebral
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="I"
                                                        name="ct_reflejo"
                                                        value={formData.pruebas_extras.ct_reflejo}
                                                        onChange={handlePruebas_extrasChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tratamientos">
                                                        Ducciones:OD
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="I"
                                                        name="ducciones_od"
                                                        value={formData.pruebas_extras.ducciones_od}
                                                        onChange={handlePruebas_extrasChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tratamientos">
                                                        OI
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="I"
                                                        name="ducciones_oi"
                                                        value={formData.pruebas_extras.ducciones_oi}
                                                        onChange={handlePruebas_extrasChange}
                                                        placeholder=""
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
                                                        id="I"
                                                        name="posicion_compensatoria"
                                                        value={formData.pruebas_extras.posicion_compensatoria}
                                                        onChange={handlePruebas_extrasChange}
                                                        placeholder=""
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
                                                        id="D"
                                                        name="fotomotor_od"
                                                        value={formData.pruebas_extras.fotomotor_od}
                                                        onChange={handlePruebas_extrasChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tratamientos">
                                                        Consensual
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="I"
                                                        name="consensual"
                                                        value={formData.pruebas_extras.consensual}
                                                        onChange={handlePruebas_extrasChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tratamientos">
                                                        Fotomotor:OI
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="I"
                                                        name="fotomotor_oi"
                                                        value={formData.pruebas_extras.fotomotor_oi}
                                                        onChange={handlePruebas_extrasChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tratamientos">
                                                        Consensual
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="I"
                                                        name="fotomotor_consensual"
                                                        value={formData.pruebas_extras.fotomotor_consensual}
                                                        onChange={handlePruebas_extrasChange}
                                                        placeholder=""
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
                                                        id="inputAddress"
                                                        name="reflejo_r_od"
                                                        value={formData.refraccion.reflejo_r_od}
                                                        onChange={handleRefraccionChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="inputAddress">
                                                        OI:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="inputAddress"
                                                        name="reflejo_r_oi"
                                                        value={formData.refraccion.reflejo_r_oi}
                                                        onChange={handleRefraccionChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="inputAddress">
                                                        AO:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="inputAddress"
                                                        name="reflejo_r_ao"
                                                        value={formData.refraccion.reflejo_r_ao}
                                                        onChange={handleRefraccionChange}
                                                        placeholder=""
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
                                                                    <input
                                                                        className="form-control"
                                                                        name="esfera_od_f"
                                                                        value={formData.refraccion.esfera_od_f}
                                                                        onChange={handleRefraccionChange}
                                                                        placeholder=""
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="cilindro_od_f"
                                                                        value={formData.refraccion.cilindro_od_f}
                                                                        onChange={handleRefraccionChange}
                                                                        placeholder=""
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="eje_od_f"
                                                                        value={formData.refraccion.eje_od_f}
                                                                        onChange={handleRefraccionChange}
                                                                        placeholder=""
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="p_base_od_f"
                                                                        value={formData.refraccion.p_base_od_f}
                                                                        onChange={handleRefraccionChange}
                                                                        placeholder="△"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="add_od_f"
                                                                        value={formData.refraccion.add_od_f}
                                                                        onChange={handleRefraccionChange}
                                                                        placeholder=""
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
                                                                        name="esfera_oi_f"
                                                                        value={formData.refraccion.esfera_oi_f}
                                                                        onChange={handleRefraccionChange}
                                                                        placeholder=""
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="cilindro_oi_f"
                                                                        value={formData.refraccion.cilindro_oi_f}
                                                                        onChange={handleRefraccionChange}
                                                                        placeholder=""
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="eje_oi_f"
                                                                        value={formData.refraccion.eje_oi_f}
                                                                        onChange={handleRefraccionChange}
                                                                        placeholder=""
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="p_base_oi_f"
                                                                        value={formData.refraccion.p_base_oi_f}
                                                                        onChange={handleRefraccionChange}
                                                                        placeholder="△"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="add_oi_f"
                                                                        value={formData.refraccion.add_oi_f}
                                                                        onChange={handleRefraccionChange}
                                                                        placeholder=""
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
                                                        id="inputAddress"
                                                        name="refraccion_tipo_lentes"
                                                        value={formData.refraccion.refraccion_tipo_lentes}
                                                        onChange={handleRefraccionChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="inputAddress">
                                                        PD:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="inputAddress"
                                                        name="refraccion_pd"
                                                        value={formData.refraccion.refraccion_pd}
                                                        onChange={handleRefraccionChange}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="inputAddress">
                                                        USO:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="inputAddress"
                                                        name="refraccion_uso"
                                                        value={formData.refraccion.refraccion_uso}
                                                        onChange={handleRefraccionChange}
                                                        placeholder=""
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
                                                        id="textarea"
                                                        maxLength="10000"
                                                        name="conducta_seguir"
                                                        value={formData.conducta_seguir}
                                                        onChange={handleChange}
                                                        placeholder=""
                                                        rows="15"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                className="btn btn-success mt-3"
                                                type="button"
                                                onClick={handleSubmit}
                                            >
                                                Guardar Consulta
                                            </button>
                                            {status === 'loading' && <p>Enviando...</p>}
                                            {status === 'failed' && <p>Error: {error}</p>}
                                            {status === 'succeeded' && <p>Neonato creado con éxito</p>}
                                        </form>
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

export default OptometriaNeonatos