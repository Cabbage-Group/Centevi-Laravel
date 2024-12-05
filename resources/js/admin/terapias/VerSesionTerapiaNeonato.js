import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSesionTerapiaNeonato } from '../../redux/features/terapias/VerSesionTerapiaNeonatoSlice';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice.js';
import { useParams } from 'react-router-dom';

const VerSesionTerapiaNeonato = () => {

    const dispatch = useDispatch();
    const { id_paciente, id_terapia, id_sesion } = useParams();
    const { sucursales } = useSelector((state) => state.sucursales);
    const { paciente, terapia, status } = useSelector((state) => state.verSesionTerapiaNeonato);

    useEffect(() => {
        if (id_paciente && id_terapia) {
            dispatch(fetchSesionTerapiaNeonato({ id_paciente, id_terapia, id_sesion }));
            dispatch(fetchSucursales({ page: 1, limit: 100 }));
        }
    }, [dispatch, id_paciente, id_terapia, id_sesion]);

    let sesion = {};
    try {
        sesion = terapia ? JSON.parse(terapia.sesion) : {};
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }

    const selectedSucursal = sucursales.find(sucursal => sucursal.id_sucursal === terapia?.sucursal);

    return (
        <div className="row layout-top-spacing">
            <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
                <div className="widget-content-area br-4">
                    <div className="widget-one">
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
                                            <select className="form-control" id="sucursal" name="sucursal" readOnly>
                                                {selectedSucursal ? (
                                                    <option value={selectedSucursal.id_sucursal}>
                                                        {selectedSucursal.nombre}
                                                    </option>
                                                ) : (
                                                    <option>No sucursal found</option>
                                                )}
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
                                                                value={sesion ? sesion.actividad_1?.trim() : ''}
                                                                name="actividad_1"
                                                                readOnly
                                                                rows="4"
                                                                style={{
                                                                    color: 'green'
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="form-control textarea"
                                                                maxLength="800"
                                                                value={sesion ? sesion.resultado_1?.trim() : ''}
                                                                name="resultado_1"
                                                                readOnly
                                                                rows="4"
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
                                                                value={sesion ? sesion.actividad_2?.trim() : ''}
                                                                name="actividad_2"
                                                                readOnly
                                                                rows="4"
                                                                style={{
                                                                    color: 'green'
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="form-control textarea"
                                                                maxLength="800"
                                                                value={sesion ? sesion.resultado_2?.trim() : ''}
                                                                name="resultado_2"
                                                                readOnly
                                                                rows="4"
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
                                                                value={sesion ? sesion.actividad_3?.trim() : ''}
                                                                name="actividad_3"
                                                                readOnly
                                                                rows="4"
                                                                style={{
                                                                    color: 'green'
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="form-control textarea"
                                                                maxLength="800"
                                                                value={sesion ? sesion.resultado_3?.trim() : ''}
                                                                name="resultado_3"
                                                                readOnly
                                                                rows="4"
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
                                                                value={sesion ? sesion.actividad_4?.trim() : ''}
                                                                name="actividad_4"
                                                                readOnly
                                                                rows="4"
                                                                style={{
                                                                    color: 'green'
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="form-control textarea"
                                                                maxLength="800"
                                                                value={sesion ? sesion.resultado_4?.trim() : ''}
                                                                name="resultado_4"
                                                                readOnly
                                                                rows="4"
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
                                                                value={sesion ? sesion.actividad_casa?.trim() : ''}
                                                                name="actividad_casa"
                                                                readOnly
                                                                rows="3"
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VerSesionTerapiaNeonato