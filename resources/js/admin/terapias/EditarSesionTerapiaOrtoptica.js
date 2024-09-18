import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSesionTerapiaOrtoptica } from '../../redux/features/terapias/VerSesionTerapiaOrtopticaSlice.js'; 
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice.js';
import { editarSesionTerapiaOrtoptica } from '../../redux/features/terapias/EditarSesionTerapiaOrtopticaSlice.js'; 
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


const EditarSesionTerapiaOrtoptica = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id_paciente, id_terapia, id_sesion } = useParams();
    const { sucursales } = useSelector((state) => state.sucursales);
    const { paciente, terapia, status } = useSelector((state) => state.verSesionTerapiaOrtoptica);
    const { status: editStatus, error: editError } = useSelector((state) => state.editarSesionTerapiaOrtoptica);

    const [formData, setFormData] = useState({
        sesion: {
            actividad_1:"",
            resultado_1:"",
            actividad_2:"",
            resultado_2:"",
            actividad_3:"",
            resultado_3:"",
            actividad_4:"",
            resultado_4:"",
            actividad_casa:""
        },
        sucursal: null
    });

    let sesion = {};
    try {
        sesion = terapia ? JSON.parse(terapia.sesion) : {};
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }

    useEffect(() => {
        if (id_paciente && id_terapia) {
            dispatch(fetchSesionTerapiaOrtoptica({ id_paciente, id_terapia, id_sesion }));
            dispatch(fetchSucursales({ page: 1, limit: 100 }));
        }
    }, [dispatch, id_paciente, id_terapia, id_sesion]);

    useEffect(() => {
        if (terapia) {
            setFormData({
                sesion: JSON.parse(terapia.sesion) || {},
                pagado: terapia.pagado,
                sucursal: terapia.sucursal
            });
        }
    }, [terapia]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            sesion: {
                ...prevState.sesion,
                [name]: value
            }
        }));
    };

    const handleSucursalChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            sucursal: parseInt(e.target.value)
        }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Quieres guardar los cambios?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, guardar cambios',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(editarSesionTerapiaOrtoptica({
                    id_sesion,
                    sesion: JSON.stringify(formData.sesion),
                    sucursal: formData.sucursal,
                    pagado: formData.pagado
                })).then(() => {
                    Swal.fire(
                        '¡Guardado!',
                        'Los cambios han sido guardados.',
                        'success'
                    ).then(() => {
                        navigate(-1);
                    });
                }).catch((error) => {
                    Swal.fire(
                        'Error',
                        'Hubo un problema al guardar los cambios.',
                        'error'
                    );
                });
            }
        });
    };


    return (
        <div className="row layout-top-spacing">
            <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
                <div className="widget-content-area br-4">
                    <div className="widget-one">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="widget-content widget-content-area">
                                        <p style={{ fontSize: '16px' }}>
                                            <b>Paciente: </b>
                                            {paciente?.nombres} {paciente?.apellidos}
                                        </p>
                                        <p style={{ fontSize: '16px' }}>
                                            <b>Cedula: </b>
                                            {paciente?.nro_cedula}
                                        </p>
                                        <div className="sesiones" style={{ display: 'flex' }}>
                                            <h6>
                                                <b>Terapia en Consultorio:</b>
                                            </h6>
                                            <div style={{ marginBottom: 20, marginLeft: 10, marginTop: -10 }}>
                                                <select
                                                    className="form-control"
                                                    id="sucursal"
                                                    value={formData.sucursal || ''}
                                                    onChange={handleSucursalChange}
                                                >
                                                    <option value="">Seleccione una sucursal</option>
                                                    {sucursales.map((sucursal) => (
                                                        <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                                                            {sucursal.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div
                                            className="card component-card_7"
                                            style={{
                                                background: 'rgb(0 150 136 / 11%)',
                                                width: '100%'
                                            }}
                                        >
                                            <div className="table-responsive-md">
                                                <hr />
                                                <table
                                                    className="table dt-table-hover"
                                                    id="zero-config"
                                                    style={{
                                                        width: '100%'
                                                    }}
                                                >
                                                    <thead>
                                                        <tr>
                                                            <th>
                                                                Actividad
                                                            </th>
                                                            <th>
                                                                Resultado
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <textarea
                                                                    className="form-control textarea"
                                                                    maxLength="800"
                                                                    value={formData.sesion.actividad_1 || ''}
                                                                    name="actividad_1"
                                                                    rows="4"
                                                                    onChange={handleInputChange}
                                                                    style={{
                                                                        color: 'green'
                                                                    }}
                                                                />
                                                            </td>
                                                            <td>
                                                                <textarea
                                                                    className="form-control textarea"
                                                                    maxLength="800"
                                                                    value={formData.sesion.resultado_1 || ''}
                                                                    name="resultado_1"
                                                                    rows="4"
                                                                    onChange={handleInputChange}
                                                                    style={{
                                                                        color: 'green'
                                                                    }}
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <textarea
                                                                    className="form-control textarea"
                                                                    maxLength="800"
                                                                    value={formData.sesion.actividad_2 || ''}
                                                                    name="actividad_2"
                                                                    rows="4"
                                                                    onChange={handleInputChange}
                                                                    style={{
                                                                        color: 'green'
                                                                    }}
                                                                />
                                                            </td>
                                                            <td>
                                                                <textarea
                                                                    className="form-control textarea"
                                                                    maxLength="800"
                                                                    value={formData.sesion.resultado_2 || ''}
                                                                    name="resultado_2"
                                                                    rows="4"
                                                                    onChange={handleInputChange}
                                                                    style={{
                                                                        color: 'green'
                                                                    }}
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <textarea
                                                                    className="form-control textarea"
                                                                    maxLength="800"
                                                                    value={formData.sesion.actividad_3 || ''}
                                                                    name="actividad_3"
                                                                    rows="4"
                                                                    onChange={handleInputChange}
                                                                    style={{
                                                                        color: 'green'
                                                                    }}
                                                                />
                                                            </td>
                                                            <td>
                                                                <textarea
                                                                    className="form-control textarea"
                                                                    maxLength="800"
                                                                    value={formData.sesion.resultado_3 || ''}
                                                                    name="resultado_3"
                                                                    rows="4"
                                                                    onChange={handleInputChange}
                                                                    style={{
                                                                        color: 'green'
                                                                    }}
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <textarea
                                                                    className="form-control textarea"
                                                                    maxLength="800"
                                                                    value={formData.sesion.actividad_4 || ''}
                                                                    name="actividad_4"
                                                                    rows="4"
                                                                    onChange={handleInputChange}
                                                                    style={{
                                                                        color: 'green'
                                                                    }}
                                                                />
                                                            </td>
                                                            <td>
                                                                <textarea
                                                                    className="form-control textarea"
                                                                    maxLength="800"
                                                                    value={formData.sesion.resultado_4 || ''}
                                                                    name="resultado_4"
                                                                    rows="4"
                                                                    onChange={handleInputChange}
                                                                    style={{
                                                                        color: 'green'
                                                                    }}
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan="2">
                                                                Actividades Asignadas para Casa
                                                                <textarea
                                                                    className="form-control textarea"
                                                                    maxLength="300"
                                                                    value={formData.sesion.actividad_casa || ''}
                                                                    name="actividad_casa"
                                                                    rows="3"
                                                                    onChange={handleInputChange}
                                                                    style={{
                                                                        color: 'green'
                                                                    }}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                    <tbody />
                                                </table>
                                            </div>
                                        </div>
                                        {/* ... (campos de textarea como antes, pero con onChange={handleInputChange}) ... */}
                                        <button
                                            className="btn btn-success mt-3"
                                            type="submit"
                                            disabled={editStatus === 'loading'}
                                        >
                                            {editStatus === 'loading' ? 'Guardando...' : 'Editar'}
                                        </button>
                                        {editStatus === 'failed' && <p className="text-danger mt-2">{editError}</p>}
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

export default EditarSesionTerapiaOrtoptica