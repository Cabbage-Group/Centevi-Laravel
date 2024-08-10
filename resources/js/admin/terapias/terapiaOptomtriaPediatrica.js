import React from 'react'

const terapiaOptomtriaPediatrica = () => {
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
        </div>
    )
}

export default terapiaOptomtriaPediatrica