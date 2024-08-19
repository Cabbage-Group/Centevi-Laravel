import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice.js';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice.js';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { crearHistoriaClinica } from '../../redux/features/consultas/HistoriaClinicaSlice.js';

const HistoriaClinica = () => {
    const dispatch = useDispatch();
    const { pacientes } = useSelector((state) => state.pacientes);
    const { sucursales } = useSelector((state) => state.sucursales);
    const { status, error } = useSelector((state) => state.optometriaGeneral);
    const [selectedPaciente, setSelectedPaciente] = useState(null);
    const initialValues = {
        sucursal: '',
        doctor: 'Dr. Diego',
        id_terapia: '0',
        paciente: '',
        edad: '35',
        fecha_atencion: '',
        m_c: '',
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
                                            <div
                                                className="col-xl-12 col-md-12 col-sm-12 col-12"
                                                style={{
                                                    textAlign: 'center'
                                                }}
                                            >
                                                <h3>
                                                    Historia Clinica
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
                                                dispatch(crearHistoriaClinica(values));
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
                                                            <label htmlFor="edad">
                                                                Edad
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="edad"
                                                                name="edad"
                                                                readOnly
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-3">
                                                            <label htmlFor="inputAddress">
                                                                Fecha de atencion
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                id="inputAddress"
                                                                max="2024-07-04"
                                                                name="fecha_atencion"
                                                                required
                                                                type="date"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-row mb-4">
                                                        <div className="form-group col-md-12">
                                                            <label htmlFor="textarea">
                                                                Motivo de Consulta:
                                                            </label>
                                                            <Field
                                                                className="form-control textarea"
                                                                id="textarea"
                                                                maxLength="10000"
                                                                name="m_c"
                                                                placeholder=""
                                                                rows="25"
                                                                as="textarea"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-row mb-12">
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="inputFehaProxCita">
                                                                Fecha de proxima cita
                                                            </label>
                                                            <input
                                                                className="form-control"
                                                                id="inputFehaProxCita"
                                                                name="fecha_proxima_consulta"
                                                                required
                                                                type="date"
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="btn btn-success mt-3 btn-crear-consulta-generica"
                                                        type="submit"
                                                    >
                                                        Guardar Consulta
                                                    </button>
                                                    {status === 'loading' && <p>Enviando...</p>}
                                                    {status === 'failed' && <p>Error: {error}</p>}
                                                    {status === 'succeeded' && <p>Creado con éxito</p>}
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

export default HistoriaClinica