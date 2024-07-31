import React from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import Swal from 'sweetalert2';
import { crearPacientes, verificarCedula } from '../../redux/features/pacientes/crearPacientesSlice';

const CrearPaciente = () => {
    const dispatch = useDispatch();

    const initialValues = {
        sucursal: "",
        doctor: "",
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
        }
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            // Filtrar los campos vacíos
            const cleanedValues = Object.keys(values).reduce((acc, key) => {
                if (typeof values[key] === 'object' && values[key] !== null) {
                    const nestedCleaned = Object.keys(values[key]).reduce((nestedAcc, nestedKey) => {
                        if (values[key][nestedKey]) {
                            nestedAcc[nestedKey] = values[key][nestedKey];
                        }
                        return nestedAcc;
                    }, {});
                    if (Object.keys(nestedCleaned).length > 0) {
                        acc[key] = nestedCleaned;
                    }
                } else if (values[key]) {
                    acc[key] = values[key];
                }
                return acc;
            }, {});

            // Verificar cédula antes de crear paciente
            const nroCedula = cleanedValues.nro_cedula;
            const cedulaExists = await dispatch(verificarCedula(nroCedula)).unwrap();

            if (cedulaExists) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Cédula existente',
                    text: 'La cédula ingresada ya existe. Por favor, ingresa una cédula diferente.',
                    showConfirmButton: true,
                    confirmButtonText: 'Cerrar'
                });
                setSubmitting(false);
                return;
            }

            Swal.fire({
                title: 'Cargando...',
                text: 'Estamos procesando tu solicitud',
                icon: 'info',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            await dispatch(crearPacientes(cleanedValues)).unwrap();

            Swal.fire({
                icon: 'success',
                title: 'El paciente ha sido guardado correctamente',
                showConfirmButton: true,
                confirmButtonText: 'Cerrar'
            });

            // Resetear el formulario
            resetForm();
        } catch (error) {
            let errorMessage = error.message || 'Error desconocido';
            Swal.fire({
                icon: 'error',
                title: 'Error al guardar el paciente',
                text: errorMessage,
                showConfirmButton: true,
                confirmButtonText: 'Cerrar'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleCedulaBlur = async (nroCedula, setFieldValue) => {
        if (nroCedula) {
            try {
                const response = await dispatch(verificarCedula(nroCedula)).unwrap();
                if (response) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Cédula existente',
                        text: 'La cédula ingresada ya existe. Por favor, ingresa una cédula diferente.',
                        showConfirmButton: true,
                        confirmButtonText: 'Cerrar'
                    });
                    // Limpiar el campo
                    setFieldValue('nro_cedula', '');
                }
            } catch (error) {
                console.error('Error verificando la cédula:', error);
            }
        }
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
                                                onSubmit={handleSubmit}
                                            >
                                                {({ setFieldValue, resetForm }) => (
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
                                                                    as="input"
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
                                                                    as="input"
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
                                                                    Nro.Cédula
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="nro_cedula"
                                                                    name="nro_cedula"
                                                                    onBlur={(e) => handleCedulaBlur(e.target.value, setFieldValue)}
                                                                    as="input"
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
                                                                    as="input"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-3">
                                                                <label>
                                                                    Fecha de Nacimiento
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    name="fecha_nacimiento"
                                                                    required
                                                                    type="date"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-3">
                                                                <label htmlFor="inputAddress">
                                                                    Género
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    name="genero"
                                                                    as="input"
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
                                                                    as="input"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-8">
                                                                <label htmlFor="inputAddress2">
                                                                    Dirección Residencial
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="inputAddress2"
                                                                    name="direccion"
                                                                    as="input"
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
                                                                    as="input"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="telefono">
                                                                    Teléfono
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="telefono"
                                                                    name="telefono"
                                                                    required
                                                                    as="input"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="celular">
                                                                    Celular
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="celular"
                                                                    name="celular"
                                                                    required
                                                                    as="input"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-row mb-4">
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="medico">
                                                                    Médico
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="medico"
                                                                    name="medico"
                                                                    as="input"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="urgencia_nombre">
                                                                    Nombre de Urgencia
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="urgencia_nombre"
                                                                    name="urgencia.nombre_ur"
                                                                    as="input"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-row mb-4">
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="urgencia_parentesco">
                                                                    Parentesco de Urgencia
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="urgencia_parentesco"
                                                                    name="urgencia.parentesco_ur"
                                                                    as="input"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="urgencia_nro">
                                                                    Nro. de Urgencia
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="urgencia_nro"
                                                                    name="urgencia.nro_ur"
                                                                    as="input"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-row mb-4">
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="menor_responsable">
                                                                    Responsable
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="menor_responsable"
                                                                    name="menor.responsable"
                                                                    as="input"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="menor_parentesco">
                                                                    Parentesco
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="menor_parentesco"
                                                                    name="menor.parentesco"
                                                                    as="input"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-row mb-4">
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="menor_nro_celular">
                                                                    Nro. Celular Responsable
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="menor_nro_celular"
                                                                    name="menor.nro_celular_responsable"
                                                                    as="input"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="menor_remitido">
                                                                    Remitido
                                                                </label>
                                                                <Field
                                                                    className="form-control"
                                                                    id="menor_remitido"
                                                                    name="menor.remitido"
                                                                    as="input"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-row">
                                                            <div className="form-group col-md-12">
                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-primary"
                                                                >
                                                                    Guardar Paciente
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </Form>
                                                )}
                                            </Formik>
                                        </div>
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

export default CrearPaciente;
