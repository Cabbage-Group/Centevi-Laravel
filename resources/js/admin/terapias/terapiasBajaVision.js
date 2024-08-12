import React from 'react'

const terapiasBajaVision = () => {
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
                                <div className="col-md-12">
                                    <div className="widget-content widget-content-area">
                                        <div className="col-md-12">
                                            <p
                                                style={{
                                                    fontSize: '16px'
                                                }}
                                            >
                                                <b>
                                                    Paciente:{' '}
                                                </b>
                                                {' '}Daniel Antonio Halphen Tapia
                                            </p>
                                            <p>
                                            </p>
                                            <p
                                                style={{
                                                    fontSize: '16px'
                                                }}
                                            >
                                                <b>
                                                    Cedula:{' '}
                                                </b>
                                                {' '}8-1128-323
                                            </p>
                                            <p>
                                            </p>
                                            <form
                                                method="post"
                                                role="form"
                                            >
                                                <label htmlFor="textarea">
                                                    Motivo
                                                </label>
                                                <textarea
                                                    className="form-control textarea"
                                                    id="textarea"
                                                    maxLength="200"
                                                    name="motivo"
                                                    placeholder="Limite de 200 caracteres."
                                                    rows="1"
                                                />
                                                <input
                                                    defaultValue="actualizar"
                                                    name="actualizar_motivo"
                                                    type="hidden"
                                                />
                                                <input
                                                    defaultValue="84"
                                                    name="id_terapia"
                                                    type="hidden"
                                                />
                                                <input
                                                    defaultValue="28"
                                                    name="id_paciente"
                                                    type="hidden"
                                                />
                                                <button
                                                    className="btn btn-success mt-3"
                                                    type="submit"
                                                >
                                                    Actualizar Motivo
                                                </button>
                                            </form>
                                        </div>
                                        <form
                                            method="post"
                                            role="form"
                                        >
                                            <input
                                                defaultValue="crear"
                                                name="crear_terapia"
                                                type="hidden"
                                            />
                                            <input
                                                defaultValue="28"
                                                name="id_paciente"
                                                type="hidden"
                                            />
                                            <input
                                                defaultValue="84"
                                                name="id_terapias"
                                                type="hidden"
                                            />
                                            <input
                                                defaultValue="SuperAdmin"
                                                name="doctor"
                                                type="hidden"
                                            />
                                            <button className="btn btn-success mb-4 ml-3 mt-4">
                                                Agregar Sesión
                                            </button>
                                        </form>
                                        <h5 className="p-3">
                                            Sesiones:
                                        </h5>
                                        <div
                                            className="card component-card_7"
                                            style={{
                                                background: 'rgb(0 150 136 / 11%)',
                                                width: '100%'
                                            }}
                                        >
                                            <div className="table-responsive-md">
                                                <table
                                                    className="table dt-table-hover sesiones"
                                                    id="zero-config"
                                                    style={{
                                                        width: '100%'
                                                    }}
                                                >
                                                    <thead>
                                                        <tr>
                                                            <th>
                                                                Sesión
                                                            </th>
                                                            <th>
                                                                Pagado
                                                            </th>
                                                            <th>
                                                                Terapeuta
                                                            </th>
                                                            <th>
                                                                Fecha de Atención
                                                            </th>
                                                            <th className="no-content">
                                                                Acción
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="text-center">
                                                                Sesión 1
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-danger btn-xs btnActivar"
                                                                    estadopago="1"
                                                                    idpaciente="23"
                                                                    idsesion="253"
                                                                    idterapia="75"
                                                                >
                                                                    Sin Pago
                                                                </button>
                                                            </td>
                                                            <td>
                                                                SuperAdmin
                                                            </td>
                                                            <td>
                                                                2024-08-10 09:59:13
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="btnVerTerapia btn btn-primary mb-2 p-1 mr-2 rounded-circle"
                                                                    id_paciente="23"
                                                                    id_terapia="75"
                                                                    ver_terapia="253"
                                                                >
                                                                    <svg
                                                                        className="h-6 w-6"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                        />
                                                                        <path
                                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    className="btnEditarTerapia btn btn-warning mb-2 p-1 mr-2 rounded-circle"
                                                                    editar_terapia="253"
                                                                    id_paciente="23"
                                                                    id_terapia="75"
                                                                    idsucursal=""
                                                                >
                                                                    <svg
                                                                        className="h-6 w-6"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    className="btnEliminarTerapia btn btn-danger mb-2 p-1 mr-2 rounded-circle"
                                                                    eliminar_terapia="253"
                                                                    id_paciente="23"
                                                                    id_terapia="75"
                                                                >
                                                                    <svg
                                                                        className="h-6 w-6"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                        />
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
    )
}

export default terapiasBajaVision