import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { fetchVerPaciente } from '../../redux/features/pacientes/VerPacienteSlice';
import { editTerapiasBajaVision } from '../../redux/features/terapias/terapiasBajaVisionSlice';
import { VerUnaTerapiaBajaVision } from '../../redux/features/terapias/verUnaTerapiaBajaVisionSlice';
import { useParams } from 'react-router-dom';

const TerapiasBajaVision = () => {
    const dispatch = useDispatch();
    const { id, id_terapia } = useParams();
    const { data: verTerapia } = useSelector((state) => state.verTerapiaBajaVision);
    const { data: verPaciente } = useSelector((state) => state.verPaciente);

    useEffect(() => {
        if (id && id_terapia) {
            dispatch(fetchVerPaciente(id));
            dispatch(VerUnaTerapiaBajaVision({ id_paciente: id, id_terapia }));
        }
    }, [dispatch, id, id_terapia]);

    return (
        <div className="admin-data-content" style={{ marginTop: '50px' }}>
            <div className="row layout-top-spacing">
                <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
                    <div className="widget-content-area br-4">
                        <div className="widget-one">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="widget-content widget-content-area">
                                        <div className="col-md-12">
                                            <p style={{ fontSize: '16px' }}>
                                                <b>Paciente:</b> {verPaciente?.nombres} {verPaciente?.apellidos}
                                            </p>
                                            <p style={{ fontSize: '16px' }}>
                                                <b>Cedula:</b> {verPaciente?.nro_cedula}
                                            </p>
                                            <Formik
                                                initialValues={{
                                                    motivo: verTerapia?.motivo || '',
                                                    evaluacion: verTerapia?.evaluacion || ''
                                                }}
                                                onSubmit={async (values, { setSubmitting }) => {
                                                    try {
                                                        await dispatch(editTerapiasBajaVision({ id_terapia, terapiaData: values })).unwrap();
                                                        Swal.fire({
                                                            icon: 'success',
                                                            title: 'Edit Successful',
                                                            text: 'Terapia Baja Vision has been successfully updated!',
                                                        });
                                                    } catch (error) {
                                                        Swal.fire({
                                                            icon: 'error',
                                                            title: 'Edit Failed',
                                                            text: `There was an error updating the Terapia Baja Vision: ${error.message}`,
                                                        });
                                                    } finally {
                                                        setSubmitting(false);
                                                    }
                                                }}
                                            >
                                                {({ isSubmitting }) => (
                                                    <Form>
                                                        <div className="form-group">
                                                            <label htmlFor="motivo">Motivo</label>
                                                            <Field
                                                                as="textarea"
                                                                className="form-control textarea"
                                                                name="motivo"
                                                                rows="1"
                                                            />
                                                            <ErrorMessage name="motivo" component="div" className="text-danger" />
                                                        </div>
                                                        <button
                                                            className="btn btn-success mt-3"
                                                            type="submit"
                                                            disabled={isSubmitting}
                                                        >
                                                            Actualizar Motivo
                                                        </button>
                                                    </Form>
                                                )}
                                            </Formik>
                                        </div>
                                        <form method="post" role="form">
                                            <button className="btn btn-success mb-4 ml-3 mt-4">Agregar Sesión</button>
                                        </form>
                                        <h5 className="p-3">Sesiones:</h5>
                                        <div className="card component-card_7" style={{ background: 'rgb(0 150 136 / 11%)', width: '100%' }}>
                                            <div className="table-responsive-md">
                                                <table className="table dt-table-hover sesiones" id="zero-config" style={{ width: '100%' }}>
                                                    <thead>
                                                        <tr>
                                                            <th>Sesión</th>
                                                            <th>Pagado</th>
                                                            <th>Terapeuta</th>
                                                            <th>Fecha de Atención</th>
                                                            <th className="no-content">Acción</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="text-center">Sesión 1</td>
                                                            <td>
                                                                <button className="btn btn-danger btn-xs btnActivar">Sin Pago</button>
                                                            </td>
                                                            <td>SuperAdmin</td>
                                                            <td>2024-08-10 09:59:13</td>
                                                            <td>
                                                                <button className="btnVerTerapia btn btn-primary mb-2 p-1 mr-2 rounded-circle">
                                                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                                                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                                                    </svg>
                                                                </button>
                                                                <button className="btnEditarTerapia btn btn-warning mb-2 p-1 mr-2 rounded-circle">
                                                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                                                    </svg>
                                                                </button>
                                                                <button className="btnEliminarTerapia btn btn-danger mb-2 p-1 mr-2 rounded-circle">
                                                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                                                    </svg>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
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
    );
};

export default TerapiasBajaVision;
