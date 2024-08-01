import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { crearRecetas } from '../../redux/features/recetas/crearRecetasSlice';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as Yup from 'yup';

const CrearReceta = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pacientes } = useSelector((state) => state.pacientes);
    const { sucursales } = useSelector((state) => state.sucursales);
    const { status, error } = useSelector((state) => state.recetas);
    const [selectedPaciente, setSelectedPaciente] = useState(null);
    const initialValues = {
        id_paciente: "",
        nro_receta: "",
        direccion: "",
        cedula: "",
        telefono: "",
        rx: {
            esfera_od: "",
            cilindro_od: "",
            eje_od: "",
            add_od: "",
            prisma_od: "",
            distancia_od: "",
            altura_od: "",
            esfera_oi: "",
            cilindro_oi: "",
            eje_oi: "",
            add_oi: "",
            prisma_oi: "",
            distancia_oi: "",
            altura_oi: ""

        },
        tipo_lente: "",
        material: {
            material_1: "",
            gris_m: "",
            cafe_m: "",
            material_2: ""
        },
        tratamientos: {
            transitions: "",
            filtro_a: "",
            gris_t: "",
            cafe_t: "",
            fotocromatico_t: "",
            antireflejo_t: "",
            espejado: "",
            uv: "",
            tinte: "",
            degradante: "",
            uniforme: "",
            color_t: "",
            intensidad_t: ""
        },
        aro_propio: {
            aro_centevi: "",
            propio: "",
            codigo_aro: "",
            color_aro: "",
            marca: "",
            doctor: "",
            elaborado: "",
        },
        observacion: "",
        medidas: {
            alto_l: "",
            ancho_b_l: "",
            separacion_l: "",
            diagonal_l: "",
        },
        sucursal: "",
        doctor: "",

    };

    useEffect(() => {
        console.log('Pacientes:', pacientes);
    }, [pacientes]);

    useEffect(() => {
        dispatch(fetchSucursales({ page: 1, limit: 100 }));
        dispatch(fetchPacientes({ page: 1, limit: 10000 }));
    }, [dispatch]);


    const handlePacienteChange = (e, setFieldValue) => {
        const selectedPacienteId = e.target.value;
        console.log('Paciente seleccionado ID:', selectedPacienteId); // Verifica el ID del paciente seleccionado
        setFieldValue('id_paciente', selectedPacienteId);
    };

    const handleSubmit = (values) => {
        console.log('Valores del formulario al enviar:', values);
        dispatch(crearRecetas(values));
        navigate(-1);
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
                                                    initialValues={initialValues}

                                                    onSubmit={handleSubmit}
                                                >

                                                    {({ setFieldValue }) => (
                                                        <Form
                                                            method="post"
                                                            role="form"
                                                        >


                                                            <div className="form-row" style={{marginBottom: "2rem"}}>

                                                                <div className="col-md-4" >
                                                                    <img
                                                                        alt="logo"
                                                                        className="navbar-logo"
                                                                        src="vistas/img/centevi-logo-in.png"
                                                                        style={{
                                                                            height: '80px'
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <h4>
                                                                        Fecha de solicitud
                                                                    </h4>
                                                                    <p className="ml-5">
                                                                        <b>
                                                                            2024-07-11
                                                                        </b>
                                                                    </p>
                                                                </div>
                                                                <div class="col-md-2"  >
                                                                    <h4>Nro. Orden</h4>
                                                                    <input style={{ color: "red", fontWeight: "bold" , marginBottom: "1rem"}} type="text" class="form-control" placeholder="" name="nro_receta"
                                                                    />
                                                                </div>


                                                                <div className="form-group col-md-4" >
                                                                    <label htmlFor="pacientes">Pacientes</label>
                                                                    <Field
                                                                        as="select"
                                                                        name="id_paciente"
                                                                        className="form-control"
                                                                    >
                                                                        <option value="">Seleccione el paciente</option>
                                                                        {pacientes.map((paciente) => (
                                                                            <option key={paciente.id_paciente} value={paciente.id_paciente}>
                                                                                Numero Cedula: {paciente.nro_cedula} || Nombres: {paciente.nombres} {paciente.apellidos}
                                                                            </option>
                                                                        ))}
                                                                    </Field>
                                                                    <ErrorMessage name="id_paciente" component="div" className="text-danger" />

                                                                </div>


                                                                <div className="form-group col-md-4" >
                                                                    <label htmlFor="inputSucursal">Sucursal</label>
                                                                    <Field
                                                                        as="select"
                                                                        name="sucursal"
                                                                        className="form-control"
                                                                    >
                                                                        <option value="">Seleccionar sucursal</option>
                                                                        {sucursales.map((sucursal) => (
                                                                            <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>{sucursal.nombre}</option>
                                                                        ))}
                                                                    </Field>
                                                                    <ErrorMessage name="sucursal" component="div" className="text-danger" />
                                                                </div>
                                                                <div className="form-group col-md-2">
                                                                    <label htmlFor="cedula">
                                                                        Cedula
                                                                    </label>
                                                                    <Field
                                                                        className="form-control"
                                                                        name="cedula"

                                                                        type="text"
                                                                    />
                                                                </div>
                                                                <div className="form-group col-md-2">
                                                                    <label htmlFor="inputEmail4">
                                                                        Telefono
                                                                    </label>
                                                                    <Field
                                                                        className="form-control"
                                                                        name="telefono"

                                                                        type="text"
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
                                                                                            color: 'white!important'
                                                                                        }}
                                                                                    >
                                                                                        Esfera
                                                                                    </th>
                                                                                    <th
                                                                                        style={{
                                                                                            color: 'white!important'
                                                                                        }}
                                                                                    >
                                                                                        Cilindro
                                                                                    </th>
                                                                                    <th
                                                                                        style={{
                                                                                            color: 'white!important'
                                                                                        }}
                                                                                    >
                                                                                        Eje
                                                                                    </th>
                                                                                    <th
                                                                                        style={{
                                                                                            color: 'white!important'
                                                                                        }}
                                                                                    >
                                                                                        ADD
                                                                                    </th>
                                                                                    <th
                                                                                        style={{
                                                                                            color: 'white!important'
                                                                                        }}
                                                                                    >
                                                                                        PRISMA
                                                                                    </th>
                                                                                    <th
                                                                                        style={{
                                                                                            color: 'white!important'
                                                                                        }}
                                                                                    >
                                                                                        DISTANCIA PUPILAR
                                                                                    </th>
                                                                                    <th
                                                                                        style={{
                                                                                            color: 'white!important'
                                                                                        }}
                                                                                    >
                                                                                        ALTURA
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
                                                                                            name="rx.esfera_od"

                                                                                            as="input"
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <Field
                                                                                            className="form-control"
                                                                                            name="rx.cilindro_od"

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
                                                                                            defaultValue="△"
                                                                                            name="prisma_od"
                                                                                            as="input"
                                                                                        />
                                                                                    </td>
                                                                                    <td>
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
                                                                                            defaultValue="△"
                                                                                            name="prisma_oi"
                                                                                            as="input"
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <Field
                                                                                            className="form-control"
                                                                                            name="distancia_oi"

                                                                                            as="input"
                                                                                        />
                                                                                    </td>
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
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div
                                                                style={{
                                                                    border: '2px solid blue',
                                                                    borderRadius: '25px',
                                                                    marginTop: '-20px'
                                                                }}
                                                            >
                                                                <div className="row p-1">
                                                                    <div className="col-md-2">
                                                                        <h6 className="text-center p-2">
                                                                            TIPO DE LENTE:
                                                                        </h6>
                                                                    </div>
                                                                    <div className="col-md-2 p-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    defaultValue="monofocal"
                                                                                    name="tipo_lente_r"
                                                                                    type="radio"
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                Monofocal
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2 p-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    defaultValue="bifocal"
                                                                                    name="tipo_lente_r"
                                                                                    type="radio"
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                Bifocal
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2 p-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    defaultValue="interview"
                                                                                    name="tipo_lente_r"
                                                                                    type="radio"
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                Interview
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2 p-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    defaultValue="antifatigue"
                                                                                    name="tipo_lente_r"
                                                                                    type="radio"
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                Antifatigue
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2 p-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    defaultValue="progresivo"
                                                                                    name="tipo_lente_r"
                                                                                    type="radio"
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                Progresivo
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div
                                                                style={{
                                                                    border: '2px solid blue',
                                                                    borderRadius: '25px',
                                                                    marginTop: '10px',
                                                                    padding: '10px 50px'
                                                                }}
                                                            >
                                                                <div className="row p-1">
                                                                    <div className="col-md-2">
                                                                        <h6 className="text-center p-2">
                                                                            TRATAMIENTOS Y FILTROS:
                                                                        </h6>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    defaultValue="transitions"
                                                                                    name="transitions"
                                                                                    type="radio"
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                Transitions
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    defaultValue="filtro_a"
                                                                                    name="filtro_a"
                                                                                    type="checkbox"
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                Filtro de luz azul
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <label htmlFor="inputEmail4">
                                                                            Gris
                                                                        </label>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="gris_t"

                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <label htmlFor="inputEmail4">
                                                                            Cafe
                                                                        </label>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="cafe_t"

                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="row p-2">
                                                                    <div className="col-md-2">
                                                                        <h6 className="text-center p-2" />
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-checkbox checkbox-outline-success">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    defaultValue="fotocromatico"
                                                                                    name="fotocromatico"
                                                                                    type="checkbox"
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                Fotocromático
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-checkbox checkbox-outline-success">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    defaultValue="antireflejo"
                                                                                    name="antireflejo"
                                                                                    type="checkbox"
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                Antireflejo
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-checkbox checkbox-outline-success">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    defaultValue="espejado"
                                                                                    name="espejado"
                                                                                    type="checkbox"
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                Espejado
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-checkbox checkbox-outline-success">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    defaultValue="uv"
                                                                                    name="uv"
                                                                                    type="checkbox"
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                UV
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="row p-2">
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    defaultValue="tinte"
                                                                                    name="tinte"
                                                                                    type="checkbox"
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                Tinte
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    defaultValue="degradante"
                                                                                    name="degradante"
                                                                                    type="checkbox"
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                Degradante
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    defaultValue="uniforme"
                                                                                    name="uniforme"
                                                                                    type="checkbox"
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                Uniforme
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <label htmlFor="inputEmail4">
                                                                            Color
                                                                        </label>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="color_t"

                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <label htmlFor="inputEmail4">
                                                                            Intensidad
                                                                        </label>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="intensidad_t"

                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="p-2"
                                                                style={{
                                                                    border: '2px solid blue',
                                                                    borderRadius: '25px',
                                                                    marginTop: '10px'
                                                                }}
                                                            >
                                                                <div className="row">
                                                                    <div className="col-md-2">
                                                                        <h6 className="text-center p-2">
                                                                            MATERIAL:
                                                                        </h6>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    defaultValue="cr_39"
                                                                                    name="material_1"
                                                                                    type="radio"
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                CR-39
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    defaultValue="policarbonato"
                                                                                    name="material_1"
                                                                                    type="radio"
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                Policarbonato
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="row p-2">
                                                                    <div className="col-md-2">
                                                                        <h6 className="text-center p-2" />
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    defaultValue="drivewear"
                                                                                    name="material_1"
                                                                                    type="radio"
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                DRIVEWEAR
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    defaultValue="polarizado"
                                                                                    name="material_1"
                                                                                    type="radio"
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                POLARIZADO
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    defaultValue="thin_lite"
                                                                                    name="material_2"
                                                                                    type="radio"
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                THIN & LITE
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    defaultValue="policolor"
                                                                                    name="material_2"
                                                                                    type="radio"
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                POLICOLOR
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    defaultValue="super_thin"
                                                                                    name="material_2"
                                                                                    type="radio"
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                {' '}SUPER THIN & LITE
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div
                                                                style={{
                                                                    border: '2px solid blue',
                                                                    borderRadius: '25px',
                                                                    marginTop: '10px',
                                                                    padding: '10px 50px'
                                                                }}
                                                            >
                                                                <div className="row ">
                                                                    <div className="n-chk">
                                                                        <label className="new-control new-radio radio-classic-primary">
                                                                            <Field
                                                                                className="new-control-input"
                                                                                defaultValue="aro_centevi"
                                                                                name="propio"
                                                                                type="checkbox"
                                                                            />
                                                                            <span className="new-control-indicator" />
                                                                            <strong>
                                                                                Aro Centevi
                                                                            </strong>
                                                                        </label>
                                                                        <label className="new-control new-radio radio-classic-primary">
                                                                            <Field
                                                                                className="new-control-input"
                                                                                defaultValue="aro_propio"
                                                                                name="propio"
                                                                                type="checkbox"
                                                                            />
                                                                            <span className="new-control-indicator" />
                                                                            <strong>
                                                                                Aro Propio
                                                                            </strong>
                                                                        </label>
                                                                    </div>
                                                                    <div
                                                                        className="col-md-3"
                                                                        id="div1"
                                                                        style={{
                                                                            maxWidth: 'fit-content'
                                                                        }}
                                                                    >
                                                                        <div>
                                                                            <div className="n-chk">
                                                                                <label className="new-control new-radio radio-classic-primary">
                                                                                    <Field
                                                                                        className="new-control-input"
                                                                                        defaultValue="metal_c"
                                                                                        name="aro_centevi"
                                                                                        type="radio"
                                                                                    />
                                                                                    <span className="new-control-indicator" />
                                                                                    Metal Completo
                                                                                </label>
                                                                                <label className="new-control new-radio radio-classic-primary">
                                                                                    <Field
                                                                                        className="new-control-input"
                                                                                        defaultValue="metal_semi"
                                                                                        name="aro_centevi"
                                                                                        type="radio"
                                                                                    />
                                                                                    <span className="new-control-indicator" />
                                                                                    Metal Semi - Aire
                                                                                </label>
                                                                                <label className="new-control new-radio radio-classic-primary">
                                                                                    <Field
                                                                                        className="new-control-input"
                                                                                        defaultValue="aire"
                                                                                        name="aro_centevi"
                                                                                        type="radio"
                                                                                    />
                                                                                    <span className="new-control-indicator" />
                                                                                    Al Aire
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className="col-md-4"
                                                                        id="div2"
                                                                        style={{
                                                                            maxWidth: 'fit-content'
                                                                        }}
                                                                    >
                                                                        <div>
                                                                            <div className="n-chk">
                                                                                <label className="new-control new-checkbox checkbox-outline-info">
                                                                                    <Field
                                                                                        className="new-control-input"
                                                                                        defaultValue="pasta_c"
                                                                                        name="propio"
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <span className="new-control-indicator" />
                                                                                    Pasta Completo
                                                                                </label>
                                                                            </div>
                                                                            <div className="n-chk">
                                                                                <label className="new-control new-checkbox checkbox-outline-primary">
                                                                                    <Field
                                                                                        className="new-control-input"
                                                                                        defaultValue="pasta_semi"
                                                                                        name="propio"
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <span className="new-control-indicator" />
                                                                                    Pasta Semi - Aire
                                                                                </label>
                                                                            </div>
                                                                            <div className="n-chk">
                                                                                <label className="new-control new-checkbox checkbox-outline-success">
                                                                                    <Field
                                                                                        className="new-control-input"
                                                                                        defaultValue="seguridad"
                                                                                        name="propio"
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <span className="new-control-indicator" />
                                                                                    Seguridad
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <label htmlFor="inputEmail4">
                                                                            Codigo
                                                                        </label>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="codigo_aro"

                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <label htmlFor="inputEmail4">
                                                                            Color
                                                                        </label>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="color_aro"

                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-6 mt-3">
                                                                        <label htmlFor="inputEmail4">
                                                                            Marca
                                                                        </label>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="marca"

                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div
                                                                style={{
                                                                    border: '2px solid blue',
                                                                    borderRadius: '25px',
                                                                    marginTop: '10px',
                                                                    padding: '10px 50px'
                                                                }}
                                                            >
                                                                <div className="row mt-2">
                                                                    <div className="col-md-2">
                                                                        <h6 className="text-center p-2">
                                                                            MEDIDA DE LENTE:
                                                                        </h6>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <label htmlFor="inputEmail4">
                                                                            Altura (Vertical)
                                                                        </label>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="alto_l"

                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <label htmlFor="inputEmail4">
                                                                            Horizontal
                                                                        </label>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="ancho_b_l"

                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <label htmlFor="inputEmail4">
                                                                            Diagonal Total
                                                                        </label>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="diagonal_l"

                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <label htmlFor="inputEmail4">
                                                                            Puente
                                                                        </label>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="separacion_l"

                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div
                                                                style={{
                                                                    border: '2px solid blue',
                                                                    borderRadius: '25px',
                                                                    marginTop: '10px',
                                                                    padding: '10px 50px'
                                                                }}
                                                            >
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <label htmlFor="inputEmail4">
                                                                            Doctor
                                                                        </label>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="doctor"

                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <label htmlFor="inputEmail4">
                                                                            Elaborado por
                                                                        </label>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="elaborado"

                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-12">
                                                                        <label htmlFor="inputEmail4">
                                                                            Observación
                                                                        </label>
                                                                        <textarea
                                                                            className="form-control textarea"
                                                                            id="textarea"
                                                                            maxLength="800"
                                                                            name="observacion"
                                                                            placeholder="Esta área tiene un limite de 800 caracteres."
                                                                            rows="6"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <Field
                                                                name="crear_receta"
                                                                type="hidden"
                                                            />
                                                            <Field
                                                                defaultValue="3"
                                                                name="sucursal"
                                                                type="hidden"
                                                            />
                                                            <Field
                                                                defaultValue="Administrador"
                                                                name="doctor"
                                                                type="hidden"
                                                            />
                                                            <button
                                                                className="btn btn-success mt-3"
                                                                type="submit"
                                                            >
                                                                Crear Receta
                                                            </button>

                                                            {status === 'loading' && <p>Enviando...</p>}
                                                            {status === 'failed' && <p>Error: {error}</p>}
                                                            {status === 'succeeded' && <p>Neonato creado con éxito</p>}

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
        </div>
    )
}

export default CrearReceta