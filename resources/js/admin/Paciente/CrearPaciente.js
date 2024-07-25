import React from 'react'

const CrearPaciente = () => {
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
                                            <form
                                                method="post"
                                                role="form"
                                            >
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="nombres">
                                                            Nombres
                                                        </label>
                                                        <input
                                                            className="form-control nombres"
                                                            id="nombres"
                                                            name="nombres"
                                                            required
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="apellidos">
                                                            Apellidos
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            id="apellidos"
                                                            name="apellidos"
                                                            required
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="email">
                                                            Email
                                                        </label>
                                                        <input
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
                                                        <input
                                                            className="form-control"
                                                            id="nro_cedula"
                                                            name="nro_cedula"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="nro_seguro">
                                                            Nro.Seguro Social
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            id="nro_seguro"
                                                            name="nro_seguro"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label>
                                                            Fecha de Nacimiento
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            name="fecha_nacimiento"
                                                            type="date"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="inputAddress">
                                                            Genero
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            name="genero"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="lugarNacimiento">
                                                            Lugar de Nacimiento
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            id="lugarNacimiento"
                                                            name="lugar_nacimiento"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-8">
                                                        <label htmlFor="inputAddress2">
                                                            Direccion Residencial
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            id="inputAddress2"
                                                            name="direccion"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="ocupacion">
                                                            Ocupación
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            id="ocupacion"
                                                            name="ocupacion"
                                                            required
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="telefono">
                                                            Teléfono de casa
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            id="telefono"
                                                            name="telefono"
                                                            required
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="celular">
                                                            Número de celular
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            id="celular"
                                                            name="celular"
                                                            required
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="medico">
                                                            Medico de Cabecera
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            id="medico"
                                                            name="medico_cabecera"
                                                            type="text"
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
                                                        <input
                                                            className="form-control"
                                                            id="nombre"
                                                            name="nombre_ur"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="parentesco">
                                                            {' '}Parentesco
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            id="parentesco_ur"
                                                            name="parentesco_ur"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="nro_celular_responsable">
                                                            {' '}Nro.Celular
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            id="numero_ur"
                                                            name="nro_ur"
                                                            type="text"
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
                                                        <input
                                                            className="form-control"
                                                            id="responsable"
                                                            name="responsable"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="parentesco">
                                                            {' '}Parentesco
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            id="parentesco"
                                                            name="parentesco"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="nro_celular_responsable">
                                                            {' '}Nro.Celular
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            id="nro_celular_responsable"
                                                            name="nro_celular_responsable"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="urg_celular">
                                                            Remitido Por{' '}
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            id="remitido"
                                                            name="remitido"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <input
                                                    defaultValue="3"
                                                    name="sucursal"
                                                    type="hidden"
                                                />
                                                <input
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
                                                </div>
                                            </form>
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