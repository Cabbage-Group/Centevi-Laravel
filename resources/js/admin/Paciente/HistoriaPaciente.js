import React from 'react'

const HistoriaPaciente = () => {
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
                                                        Historia Paciente
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
                                                    <div className="form-group col-md-6">
                                                        <p>
                                                            Creado por:{' '}
                                                            <b>
                                                                {' '}Laura Toro Yau
                                                            </b>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-4">
                                                        <label
                                                            className="labelBold"
                                                            htmlFor="nombres"
                                                        >
                                                            Nombres
                                                        </label>
                                                        <input
                                                            className="form-control labelBold"
                                                            defaultValue="Danna Lucia "
                                                            id="nombres"
                                                            name="nombres"
                                                            placeholder="Nombres"
                                                            readOnly
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="apellidos">
                                                            Apellidos
                                                        </label>
                                                        <input
                                                            className="form-control labelBold"
                                                            defaultValue="Gonzalez Quiros"
                                                            id="apellidos"
                                                            name="apellidos"
                                                            placeholder="Apellidos"
                                                            readOnly
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="email">
                                                            Email
                                                        </label>
                                                        <input
                                                            className="form-control labelBold"
                                                            defaultValue="rosibel2788@hotmail.com"
                                                            id="email"
                                                            name="email"
                                                            placeholder="Email"
                                                            readOnly
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
                                                            defaultValue="8-1219-383"
                                                            name="nro_cedula"
                                                            placeholder="Nro.Cedula"
                                                            readOnly
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="nro_seguro">
                                                            Nro.Seguro Social
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name="nro_seguro"
                                                            placeholder="Nro.Seguro Social"
                                                            readOnly
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="nacimiento">
                                                            Fecha de Nacimiento
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="2018-08-21"
                                                            name="fecha_nacimiento"
                                                            readOnly
                                                            type="date"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="genero">
                                                            Genero
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="Femenino"
                                                            name="genero"
                                                            placeholder="Genero"
                                                            readOnly
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
                                                            defaultValue="Panama"
                                                            id="lugarNacimiento"
                                                            name="lugar_nacimiento"
                                                            placeholder="Lugar de Nacimiento"
                                                            readOnly
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-8">
                                                        <label htmlFor="inputAddress2">
                                                            Direccion Residencial
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="Santiago, Provincia Veraguas"
                                                            id="inputAddress2"
                                                            name="direccion"
                                                            placeholder="Dirección Residencial"
                                                            readOnly
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
                                                            defaultValue="Infante"
                                                            id="ocupacion"
                                                            name="ocupacion"
                                                            placeholder="Ocupación"
                                                            readOnly
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="telefono">
                                                            Teléfono de casa
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="no tiene"
                                                            id="telefono"
                                                            name="telefono"
                                                            placeholder="Teléfono"
                                                            readOnly
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="celular">
                                                            Número de celular
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="6582-8904"
                                                            id="celular"
                                                            name="celular"
                                                            placeholder="Celular"
                                                            readOnly
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
                                                            defaultValue="Dr Domingo Martinez "
                                                            id="medico"
                                                            name="medico"
                                                            placeholder="Medico de Cabecera"
                                                            readOnly
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <h4>
                                                    EN CASO DE URGENCIA
                                                </h4>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="nombre_ur">
                                                            {' '}Nombre
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="Rosibel Quiroz"
                                                            disabled
                                                            id="nombre_ur"
                                                            name="nombre_ur"
                                                            placeholder="Responsable"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="parentesco_ur">
                                                            {' '}Parentesco
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="madre"
                                                            disabled
                                                            id="parentesco_ur"
                                                            name="parentesco_ur"
                                                            placeholder="Parentesco"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="nro_ur">
                                                            {' '}Número
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="6582-8904"
                                                            disabled
                                                            id="nro_ur"
                                                            name="nro_ur"
                                                            placeholder="Parentesco"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <h4>
                                                    MENOR DE EDAD
                                                </h4>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="responsable">
                                                            {' '}Por favor colocar el nombre del acudiente o responsable
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="Rosibel Quiros B."
                                                            disabled
                                                            id="responsable"
                                                            name="responsable"
                                                            placeholder="Responsable"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="parentesco">
                                                            {' '}Parentesco
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="Madre"
                                                            disabled
                                                            id="parentesco"
                                                            name="parentesco"
                                                            placeholder="Parentesco"
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
                                                            defaultValue="6582-8904 / 6635-7919"
                                                            disabled
                                                            id="nro_celular_responsable"
                                                            name="nro_celular_responsable"
                                                            placeholder="Nro Celular"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="urg_responsable">
                                                            {' '}Remitido Por
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue="Instagram"
                                                            disabled
                                                            id="remitido"
                                                            name="remitido"
                                                            placeholder="Remitido"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <a
                                                    className="btn btn-success mt-3"
                                                    href="index.php?ruta=editar-paciente&id_paciente=22"
                                                >
                                                    Editar Paciente
                                                </a>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
                                                        LISTA DE CONSULTAS
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="widget-content widget-content-area">
                                            <div className="row mb-4">
                                                <div
                                                    className="card component-card_7 mb-4"
                                                    style={{
                                                        background: 'rgb(0 150 136 / 11%)',
                                                        width: '100%'
                                                    }}
                                                >
                                                    <h6 className="p-3">
                                                        CONSULTAS GENERICAS:
                                                    </h6>
                                                    <div className="table-responsive-md">
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
                                                                        Nro
                                                                    </th>
                                                                    <th>
                                                                        Consulta
                                                                    </th>
                                                                    <th>
                                                                        Medico
                                                                    </th>
                                                                    <th>
                                                                        Fecha Atención
                                                                    </th>
                                                                    <th className="no-content">
                                                                        Acción
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        1
                                                                    </td>
                                                                    <td>
                                                                        Consulta Historia Clinica{' '}
                                                                    </td>
                                                                    <td>
                                                                        Laura Toro Yau
                                                                    </td>
                                                                    <td>
                                                                        2022-05-21 11:11:15
                                                                    </td>
                                                                    <td>
                                                                        <button
                                                                            className="btnVerConsultaCG btn btn-primary mb-2 p-1 mr-2 rounded-circle"
                                                                            id_consulta="56"
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
                                                                            className="btnEditarConsultaCG btn btn-warning mb-2 p-1 mr-2 rounded-circle"
                                                                            id_consulta="56"
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
                                                                            borrar_consulta="56"
                                                                            className="btnEliminarConsultaCG btn btn-danger mb-2 p-1 mr-2 rounded-circle"
                                                                            id_paciente="22"
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
                                                                <tr>
                                                                    <td className="text-center">
                                                                        2
                                                                    </td>
                                                                    <td>
                                                                        Consulta Historia Clinica{' '}
                                                                    </td>
                                                                    <td>
                                                                        Laura Toro Yau
                                                                    </td>
                                                                    <td>
                                                                        2022-12-17 12:20:27
                                                                    </td>
                                                                    <td>
                                                                        <button
                                                                            className="btnVerConsultaCG btn btn-primary mb-2 p-1 mr-2 rounded-circle"
                                                                            id_consulta="1455"
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
                                                                            className="btnEditarConsultaCG btn btn-warning mb-2 p-1 mr-2 rounded-circle"
                                                                            id_consulta="1455"
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
                                                                            borrar_consulta="1455"
                                                                            className="btnEliminarConsultaCG btn btn-danger mb-2 p-1 mr-2 rounded-circle"
                                                                            id_paciente="22"
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
                                                                <tr>
                                                                    <td className="text-center">
                                                                        3
                                                                    </td>
                                                                    <td>
                                                                        Consulta Historia Clinica{' '}
                                                                    </td>
                                                                    <td>
                                                                        Laura Toro Yau
                                                                    </td>
                                                                    <td>
                                                                        2024-01-27 11:09:54
                                                                    </td>
                                                                    <td>
                                                                        <button
                                                                            className="btnVerConsultaCG btn btn-primary mb-2 p-1 mr-2 rounded-circle"
                                                                            id_consulta="4364"
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
                                                                            className="btnEditarConsultaCG btn btn-warning mb-2 p-1 mr-2 rounded-circle"
                                                                            id_consulta="4364"
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
                                                                            borrar_consulta="4364"
                                                                            className="btnEliminarConsultaCG btn btn-danger mb-2 p-1 mr-2 rounded-circle"
                                                                            id_paciente="22"
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
                                                                <tr>
                                                                    <td className="text-center">
                                                                        4
                                                                    </td>
                                                                    <td>
                                                                        Consulta Historia Clinica{' '}
                                                                    </td>
                                                                    <td>
                                                                        Laura Toro Yau
                                                                    </td>
                                                                    <td>
                                                                        2024-05-27 00:29:36
                                                                    </td>
                                                                    <td>
                                                                        <button
                                                                            className="btnVerConsultaCG btn btn-primary mb-2 p-1 mr-2 rounded-circle"
                                                                            id_consulta="5281"
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
                                                                            className="btnEditarConsultaCG btn btn-warning mb-2 p-1 mr-2 rounded-circle"
                                                                            id_consulta="5281"
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
                                                                            borrar_consulta="5281"
                                                                            className="btnEliminarConsultaCG btn btn-danger mb-2 p-1 mr-2 rounded-circle"
                                                                            id_paciente="22"
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
                                                            <tfoot>
                                                                <tr>
                                                                    <th>
                                                                        Nro
                                                                    </th>
                                                                    <th>
                                                                        Consulta
                                                                    </th>
                                                                    <th>
                                                                        Medico
                                                                    </th>
                                                                    <th>
                                                                        Fecha Atención
                                                                    </th>
                                                                    <th className="no-content" />
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="widget-header mt-4"
                                                style={{
                                                    paddingTop: '15%'
                                                }}
                                            >
                                                <div className="row">
                                                    <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                                        <h3>
                                                            TERAPIAS:
                                                        </h3>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mt-4">
                                                <div className="col-md-3">
                                                    <form
                                                        method="post"
                                                        role="form"
                                                    >
                                                        <button className="btn btn-success mb-4 ml-3 mt-4">
                                                            Crear Terapia Baja Vision
                                                        </button>
                                                        <input
                                                            defaultValue="22"
                                                            name="id_paciente"
                                                            type="hidden"
                                                        />
                                                        <input
                                                            defaultValue="crear"
                                                            name="crear_terapiaBV"
                                                            type="hidden"
                                                        />
                                                    </form>
                                                </div>
                                                <div className="col-md-3">
                                                    <form
                                                        method="post"
                                                        role="form"
                                                    >
                                                        <button className="btn btn-success mb-4 ml-3 mt-4">
                                                            Crear Terapia Optometría Pediatrica
                                                        </button>
                                                        <input
                                                            defaultValue="22"
                                                            name="id_paciente"
                                                            type="hidden"
                                                        />
                                                        <input
                                                            defaultValue="crear"
                                                            name="crear_optometria_p"
                                                            type="hidden"
                                                        />
                                                    </form>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="widget-content widget-content-area">
                                                        <div
                                                            className="card component-card_7"
                                                            style={{
                                                                background: 'rgb(0 150 136 / 11%)',
                                                                width: '100%'
                                                            }}
                                                        >
                                                            <div className="card-body">
                                                                <button
                                                                    className="btn btn-danger btn_eliminar_terapia btn_eliminar_terapiagopp"
                                                                    id_paciente="22"
                                                                    id_terapia="620"
                                                                    style={{
                                                                        marginBottom: '-80px',
                                                                        position: 'absolute',
                                                                        zIndex: '3'
                                                                    }}
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
                                                                <h5 className="">
                                                                    Terapia Optometría Pediatrica:
                                                                </h5>
                                                                <div className="rating-stars">
                                                                    <p>
                                                                        Cantidad de terapias realizadas{' '}
                                                                        <b>
                                                                            3
                                                                        </b>
                                                                    </p>
                                                                    <p>
                                                                        Fecha de creación:{' '}
                                                                        <b>
                                                                            2024-06-07 10:46:20
                                                                        </b>
                                                                    </p>
                                                                    <a
                                                                        className="btn btn-success mb-4 ml-3 mt-4"
                                                                        href="index.php?ruta=terapiasOptometriaPediatrica&id_terapia=620&id_paciente=22"
                                                                    >
                                                                        VER
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mt-3 p-3">
                                                <h6>
                                                    SUBIR DOCUMENTOS DEL PACIENTE:
                                                </h6>
                                                <div
                                                    className="col-lg-12 layout-spacing"
                                                    id="fuSingleFile"
                                                >
                                                    <div className="statbox widget box box-shadow">
                                                        <div className="widget-header">
                                                            <div className="row">
                                                                <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="widget-content widget-content-area">
                                                            <div
                                                                className="custom-file-container"
                                                                data-upload-id="myFirstImage"
                                                            >
                                                                <label>
                                                                    Limpiar{' '}
                                                                    <a
                                                                        className="custom-file-container__image-clear"
                                                                        href="javascript:void(0)"
                                                                    >
                                                                        x
                                                                    </a>
                                                                </label>
                                                                <form
                                                                    encType="multipart/form-data"
                                                                    method="post"
                                                                    role="form"
                                                                >
                                                                    <label className="custom-file-container__custom-file">
                                                                        <input
                                                                            className="custom-file-container__custom-file__custom-file-input"
                                                                            name="documento"
                                                                            required
                                                                            type="file"
                                                                        />
                                                                        <span className="custom-file-container__custom-file__custom-file-control">
                                                                            Subir archivo...
                                                                            <span className="custom-file-container__custom-file__custom-file-control__button">
                                                                                {' '}Buscar{' '}
                                                                            </span>
                                                                        </span>
                                                                    </label>
                                                                    <input
                                                                        defaultValue="Danna Lucia "
                                                                        name="nombrePaciente"
                                                                        type="hidden"
                                                                    />
                                                                    <input
                                                                        defaultValue="Gonzalez Quiros"
                                                                        name="apellidoPaciente"
                                                                        type="hidden"
                                                                    />
                                                                    <input
                                                                        defaultValue="22"
                                                                        name="id_paciente"
                                                                        type="hidden"
                                                                    />
                                                                    <input
                                                                        defaultValue="subir_documento"
                                                                        name="nuevoDocumento"
                                                                        type="hidden"
                                                                    />
                                                                    <button
                                                                        className="btn btn-primary mt-4"
                                                                        type="submit"
                                                                    >
                                                                        Subir Documento
                                                                    </button>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                                        <h4 className="p-2">
                                                            DOCUMENTOS PACIENTE:
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mt-4">
                                                <div
                                                    className="col-md-6"
                                                    style={{
                                                        backgroundColor: '#e1e1e1',
                                                        border: '2px solid black',
                                                        borderRadius: '20px 20px',
                                                        minWidth: '100px'
                                                    }}
                                                >
                                                    <svg
                                                        fill="none"
                                                        stroke="currentColor"
                                                        style={{
                                                            width: '60px'
                                                        }}
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                        />
                                                    </svg>
                                                    <a
                                                        className="btn btn-info"
                                                        href="vistas/img/documentos_pacientes/DannaLuciaGonzalezQuiros/Consulta Dic 2021 1era TPC.pdf"
                                                        target="_blank"
                                                        title="Visualizar Archivo"
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
                                                    </a>
                                                    <a
                                                        className="btn btn-primary"
                                                        download="Consulta Dic 2021 1era TPC.pdf"
                                                        href="vistas/img/documentos_pacientes/DannaLuciaGonzalezQuiros/Consulta Dic 2021 1era TPC.pdf"
                                                        title="Descargar Archivo"
                                                    >
                                                        <svg
                                                            className="h-6 w-6"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                            />
                                                        </svg>
                                                    </a>
                                                    <button
                                                        borrar_documento="933"
                                                        className="btn btn-danger eliminarDocumentoPaciente"
                                                        id_paciente="22"
                                                        nombre="Consulta Dic 2021 1era TPC.pdf"
                                                        type="submit"
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
                                                    <p className="mt-3">
                                                        Nombre:Consulta Dic 2021 1era TPC.pdf
                                                    </p>
                                                </div>
                                                <div
                                                    className="col-md-6"
                                                    style={{
                                                        backgroundColor: '#e1e1e1',
                                                        border: '2px solid black',
                                                        borderRadius: '20px 20px',
                                                        minWidth: '100px'
                                                    }}
                                                >
                                                    <svg
                                                        fill="none"
                                                        stroke="currentColor"
                                                        style={{
                                                            width: '60px'
                                                        }}
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                        />
                                                    </svg>
                                                    <a
                                                        className="btn btn-info"
                                                        href="vistas/img/documentos_pacientes/DannaLuciaGonzalezQuiros/COnsulta Enero 2022 Chitre.pdf"
                                                        target="_blank"
                                                        title="Visualizar Archivo"
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
                                                    </a>
                                                    <a
                                                        className="btn btn-primary"
                                                        download="COnsulta Enero 2022 Chitre.pdf"
                                                        href="vistas/img/documentos_pacientes/DannaLuciaGonzalezQuiros/COnsulta Enero 2022 Chitre.pdf"
                                                        title="Descargar Archivo"
                                                    >
                                                        <svg
                                                            className="h-6 w-6"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                            />
                                                        </svg>
                                                    </a>
                                                    <button
                                                        borrar_documento="934"
                                                        className="btn btn-danger eliminarDocumentoPaciente"
                                                        id_paciente="22"
                                                        nombre="COnsulta Enero 2022 Chitre.pdf"
                                                        type="submit"
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
                                                    <p className="mt-3">
                                                        Nombre:COnsulta Enero 2022 Chitre.pdf
                                                    </p>
                                                </div>
                                                <div
                                                    className="col-md-6"
                                                    style={{
                                                        backgroundColor: '#e1e1e1',
                                                        border: '2px solid black',
                                                        borderRadius: '20px 20px',
                                                        minWidth: '100px'
                                                    }}
                                                >
                                                    <svg
                                                        fill="none"
                                                        stroke="currentColor"
                                                        style={{
                                                            width: '60px'
                                                        }}
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                        />
                                                    </svg>
                                                    <a
                                                        className="btn btn-info"
                                                        href="vistas/img/documentos_pacientes/DannaLuciaGonzalezQuiros/COnsulta Marzo 2022 Chitre.pdf"
                                                        target="_blank"
                                                        title="Visualizar Archivo"
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
                                                    </a>
                                                    <a
                                                        className="btn btn-primary"
                                                        download="COnsulta Marzo 2022 Chitre.pdf"
                                                        href="vistas/img/documentos_pacientes/DannaLuciaGonzalezQuiros/COnsulta Marzo 2022 Chitre.pdf"
                                                        title="Descargar Archivo"
                                                    >
                                                        <svg
                                                            className="h-6 w-6"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                            />
                                                        </svg>
                                                    </a>
                                                    <button
                                                        borrar_documento="935"
                                                        className="btn btn-danger eliminarDocumentoPaciente"
                                                        id_paciente="22"
                                                        nombre="COnsulta Marzo 2022 Chitre.pdf"
                                                        type="submit"
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
                                                    <p className="mt-3">
                                                        Nombre:COnsulta Marzo 2022 Chitre.pdf
                                                    </p>
                                                </div>
                                                <div
                                                    className="col-md-6"
                                                    style={{
                                                        backgroundColor: '#e1e1e1',
                                                        border: '2px solid black',
                                                        borderRadius: '20px 20px',
                                                        minWidth: '100px'
                                                    }}
                                                >
                                                    <svg
                                                        fill="none"
                                                        stroke="currentColor"
                                                        style={{
                                                            width: '60px'
                                                        }}
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                        />
                                                    </svg>
                                                    <a
                                                        className="btn btn-info"
                                                        href="vistas/img/documentos_pacientes/DannaLuciaGonzalezQuiros/Orden Lentes Chitre  Marzo 2022.pdf"
                                                        target="_blank"
                                                        title="Visualizar Archivo"
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
                                                    </a>
                                                    <a
                                                        className="btn btn-primary"
                                                        download="Orden Lentes Chitre  Marzo 2022.pdf"
                                                        href="vistas/img/documentos_pacientes/DannaLuciaGonzalezQuiros/Orden Lentes Chitre  Marzo 2022.pdf"
                                                        title="Descargar Archivo"
                                                    >
                                                        <svg
                                                            className="h-6 w-6"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                            />
                                                        </svg>
                                                    </a>
                                                    <button
                                                        borrar_documento="936"
                                                        className="btn btn-danger eliminarDocumentoPaciente"
                                                        id_paciente="22"
                                                        nombre="Orden Lentes Chitre  Marzo 2022.pdf"
                                                        type="submit"
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
                                                    <p className="mt-3">
                                                        Nombre:Orden Lentes Chitre  Marzo 2022.pdf
                                                    </p>
                                                </div>
                                                <div
                                                    className="col-md-6"
                                                    style={{
                                                        backgroundColor: '#e1e1e1',
                                                        border: '2px solid black',
                                                        borderRadius: '20px 20px',
                                                        minWidth: '100px'
                                                    }}
                                                >
                                                    <svg
                                                        fill="none"
                                                        stroke="currentColor"
                                                        style={{
                                                            width: '60px'
                                                        }}
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                        />
                                                    </svg>
                                                    <a
                                                        className="btn btn-info"
                                                        href="vistas/img/documentos_pacientes/DannaLuciaGonzalezQuiros/Orden de Enero 2024,Danna Gonzalez.pdf"
                                                        target="_blank"
                                                        title="Visualizar Archivo"
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
                                                    </a>
                                                    <a
                                                        className="btn btn-primary"
                                                        download="Orden de Enero 2024,Danna Gonzalez.pdf"
                                                        href="vistas/img/documentos_pacientes/DannaLuciaGonzalezQuiros/Orden de Enero 2024,Danna Gonzalez.pdf"
                                                        title="Descargar Archivo"
                                                    >
                                                        <svg
                                                            className="h-6 w-6"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                            />
                                                        </svg>
                                                    </a>
                                                    <button
                                                        borrar_documento="18606"
                                                        className="btn btn-danger eliminarDocumentoPaciente"
                                                        id_paciente="22"
                                                        nombre="Orden de Enero 2024,Danna Gonzalez.pdf"
                                                        type="submit"
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
                                                    <p className="mt-3">
                                                        Nombre:Orden de Enero 2024,Danna Gonzalez.pdf
                                                    </p>
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
        </div>
    )
}

export default HistoriaPaciente