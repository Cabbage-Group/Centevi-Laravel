import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { crearPacientes } from '../../redux/features/pacientes/crearPacientesSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';


const CrearPaciente = () => {

    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.crearPacientes);
    const initialValues = {
        sucursal: "2",
        doctor: "pedrito",
        nombres: "",
        apellidos: "",
        nro_cedula: "",
        email: "",
        nro_seguro: "",
        fecha_nacimiento: "",
        genero: "",
        lugar_nacimiento: "",
        direccion: "",
        ocupacion: "",
        telefono: "",
        celular: "",
        medico: "",
        urgencia: {
            nombre_ur: "",
            parentesco_ur: "",
            nro_ur: ""
        },
        menor: {
            responsable: "",
            parentesco: "",
            nro_celular_responsable: "",
            remitido: ""
        },
        fecha_creacion: ""
    };

    
    const validationSchema = Yup.object().shape({
      
      });
      


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
                                                    <h4>
                                                        CREAR PACIENTE
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="widget-content widget-content-area">
                                            <Formik
                                                initialValues={initialValues}
                                                validationSchema={validationSchema}
                                                onSubmit={(values, { setSubmitting }) => {
                                                    console.log('Form values:', values);
                                                    dispatch(crearPacientes(values));
                                                    setSubmitting(false);
                                                }}
                                            >                       
                                                    <Form
                                                        method="post"
                                                        role="form"
                                                    >
                                                        <div className="form-row mb-4">
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="nombres">
                                                                    Nombres
                                                                </label>
                                                                <Field
                                                                    className="form-control nombres"
                                                                    id="nombres"
                                                                    name="nombres"
                                                                    required
                                                                    as = "input"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="apellidos">
                                                                    Apellidos
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="apellidos"
                                                                    name="apellidos"
                                                                    required
                                                                    as = "input"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="email">
                                                                    Email
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="email"
                                                                    name="email"
                                                                    required
                                                                    type="email"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-row mb-4">
                                                            <div className="form-group col-md-3">
                                                                <label htmlFor="nro_cedula">
                                                                    Nro.Cedula
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="nro_cedula"
                                                                    name="nro_cedula"
                                                                    as = "input"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-3">
                                                                <label htmlFor="nro_seguro">
                                                                    Nro.Seguro Social
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="nro_seguro"
                                                                    name="nro_seguro"
                                                                    as = "input"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-3">
                                                                <label>
                                                                    Fecha de Nacimiento
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    name="fecha_nacimiento"
                                                                    type="date"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-3">
                                                                <label htmlFor="inputAddress">
                                                                    Genero
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    name="genero"
                                                                    as = "input"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-row mb-4">
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="lugarNacimiento">
                                                                    Lugar de Nacimiento
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="lugarNacimiento"
                                                                    name="lugar_nacimiento"
                                                                    as = "input"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-8">
                                                                <label htmlFor="inputAddress2">
                                                                    Direccion Residencial
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="inputAddress2"
                                                                    name="direccion"
                                                                    as = "input"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-row mb-4">
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="ocupacion">
                                                                    Ocupación
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="ocupacion"
                                                                    name="ocupacion"
                                                                    required
                                                                    as = "input"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="telefono">
                                                                    Teléfono de casa
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="telefono"
                                                                    name="telefono"
                                                                    required
                                                                    as = "input"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="celular">
                                                                    Número de celular
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="celular"
                                                                    name="celular"
                                                                    required
                                                                    as = "input"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-row mb-4">
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="medico">
                                                                    Medico de Cabecera
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="medico"
                                                                    name="medico_cabecera"
                                                                    as = "input"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <h4>
                                                                EN CASO DE URGENCIA
                                                            </h4>
                                                        </div>
                                                        <div className="form-row mb-4">
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="responsable">
                                                                    {' '}Por favor colocar el nombre
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="nombre"
                                                                    name="nombre_ur"
                                                                    as = "input"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="parentesco">
                                                                    {' '}Parentesco
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="parentesco_ur"
                                                                    name="parentesco_ur"
                                                                    as = "input"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="nro_celular_responsable">
                                                                    {' '}Nro.Celular
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="numero_ur"
                                                                    name="nro_ur"
                                                                    as = "input"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <h4>
                                                                MENOR DE EDAD
                                                            </h4>
                                                        </div>
                                                        <div className="form-row mb-4">
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="responsable">
                                                                    {' '}Por favor colocar el nombre del acudiente o                                                    responsable
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="responsable"
                                                                    name="responsable"
                                                                    as = "input"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="parentesco">
                                                                    {' '}Parentesco
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="parentesco"
                                                                    name="parentesco"
                                                                    as = "input"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-row mb-4">
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="nro_celular_responsable">
                                                                    {' '}Nro.Celular
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="nro_celular_responsable"
                                                                    name="nro_celular_responsable"
                                                                    as = "input"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="urg_celular">
                                                                    Remitido Por{' '}
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="remitido"
                                                                    name="remitido"
                                                                    as = "input"
                                                                />
                                                            </div>
                                                        </div>
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
                                                        <div
                                                            className="btn-crear-paciente"
                                                            style={{
                                                                width: '150px'
                                                            }}
                                                        >
                                                            <button
                                                                className="btn btn-success mt-3 btn-crear-paciente"
                                                                type="submit"
                                                            >
                                                                <div className="txt-btn-crear">
                                                                    Crear Paciente
                                                                </div>
                                                                <div
                                                                    className="spinner-border no-mostrar-btn"
                                                                    role="status"
                                                                >
                                                                    <span className="sr-only">
                                                                        {' '}Loading...
                                                                    </span>
                                                                </div>
                                                            </button>
                                                            {status === 'loading' && <p>Enviando...</p>}
                                                            {status === 'failed' && <p>Error: {error}</p>}
                                                            {status === 'succeeded' && <p>Neonato creado con éxito</p>}
                                                        </div>
                                                    </Form>
                                                
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

export default CrearPaciente