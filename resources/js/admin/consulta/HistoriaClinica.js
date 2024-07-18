import React from 'react'

const HistoriaClinica = () => {
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
                                        <form
                                            method="post"
                                            role="form"
                                        >
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="inputEmail4">
                                                        Pacientes
                                                    </label>
                                                    <select
                                                        aria-hidden="true"
                                                        className="form-control form-small select2-hidden-accessible"
                                                        data-select2-id="1"
                                                        name="paciente"
                                                        tabIndex="-1"
                                                    >
                                                        <option
                                                            data-select2-id="3"
                                                            value=""
                                                        >
                                                            {`<--- Seleccione el paciente --->`}
                                                        </option>
                                                        <option
                                                            data-fecha-nacimiento="2018-08-21"
                                                            value="22"
                                                        >
                                                            {' '}Número Cedula: 8-1219-383 || Nombres: Danna Lucia Gonzalez Quiros
                                                        </option>
                                                        <option
                                                            data-fecha-nacimiento="2016-09-22"
                                                            value="23"
                                                        >
                                                            {' '}Número Cedula: 4-882-127 || Nombres: Amber Lizeth Martinez Moreno
                                                        </option>
                                                        <option
                                                            data-fecha-nacimiento="2013-06-28"
                                                            value="24"
                                                        >
                                                            {' '}Número Cedula: 4-867-2164 || Nombres: Jenna Nicolle Martinez Moreno
                                                        </option>
                                                        <option
                                                            data-fecha-nacimiento="2011-11-22"
                                                            value="26"
                                                        >
                                                            {' '}Número Cedula: 8-1118-185 || Nombres: Ambar Julieta Quintero Xatruch
                                                        </option>
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
                                                        required
                                                    >
                                                        <option value="">
                                                            Seleccionar sucursal
                                                        </option>
                                                        <option value="3">
                                                            CENTEVI Centro Médico San Judas Tadeo
                                                        </option>
                                                        <option value="4">
                                                            CENTEVI Consultorios Medicos Paitilla
                                                        </option>
                                                        <option value="5">
                                                            CENTEVI Sede Chitre
                                                        </option>
                                                        <option value="7">
                                                            CENTEVI El Dorado
                                                        </option>
                                                        <option value="8">
                                                            CENTEVI Giras Interior del Pais
                                                        </option>
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
                                                        readOnly
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
                                                    <textarea
                                                        className="form-control textarea"
                                                        id="textarea"
                                                        maxLength="10000"
                                                        name="m_c"
                                                        placeholder=""
                                                        rows="25"
                                                    />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <input
                                    defaultValue="crear"
                                    name="crear_consulta_generica"
                                    type="hidden"
                                />
                                <input
                                    defaultValue="Administrador"
                                    name="doctor"
                                    type="hidden"
                                />
                                <input
                                    defaultValue="0"
                                    name="id_terapia"
                                    type="hidden"
                                />
                                <button
                                    className="btn btn-success mt-3 btn-crear-consulta-generica"
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HistoriaClinica