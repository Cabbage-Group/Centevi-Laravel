import React from 'react'
import { Link } from 'react-router-dom'

const VerRecetas = () => {
    return (

        <div className="row layout-top-spacing">
            <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
                <div className="widget-content-area br-4">
                    <div className="widget-one">
                        <div
                            className="row layout-top-spacing"
                            id="cancel-row"
                        >
                            <div className="col-xl-12 col-lg-12 col-sm-12  layout-spacing">
                                <div className="widget-content widget-content-area br-6">
                                    <Link to={"/crear-receta"} className="btn btn-success mb-4 ml-3 mt-4">
                                        Agregar Receta
                                    </Link>

                                    <div
                                        className="dataTables_wrapper container-fluid dt-bootstrap4"
                                        id="zero-config_wrapper"
                                    >
                                        <div className="dt--top-section">
                                            <div className="row">
                                                <div className="col-12 col-sm-6 d-flex justify-content-sm-start justify-content-center">
                                                    <div
                                                        className="dataTables_length"
                                                        id="zero-config_length"
                                                    >
                                                        <label>
                                                            Results :
                                                            <select
                                                                aria-controls="zero-config"
                                                                className="form-control"
                                                                name="zero-config_length"
                                                            >
                                                                <option value="7">
                                                                    7
                                                                </option>
                                                                <option value="10">
                                                                    10
                                                                </option>
                                                                <option value="20">
                                                                    20
                                                                </option>
                                                                <option value="50">
                                                                    50
                                                                </option>
                                                            </select>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 d-flex justify-content-sm-end justify-content-center mt-sm-0 mt-3">
                                                    <div
                                                        className="dataTables_filter"
                                                        id="zero-config_filter"
                                                    >
                                                        <label>
                                                            <svg
                                                                className="feather feather-search"
                                                                fill="none"
                                                                height="24"
                                                                stroke="currentColor"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                viewBox="0 0 24 24"
                                                                width="24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <circle
                                                                    cx="11"
                                                                    cy="11"
                                                                    r="8"
                                                                />
                                                                <line
                                                                    x1="21"
                                                                    x2="16.65"
                                                                    y1="21"
                                                                    y2="16.65"
                                                                />
                                                            </svg>
                                                            <input
                                                                aria-controls="zero-config"
                                                                className="form-control"
                                                                placeholder="Search..."
                                                                type="search"
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table
                                                aria-describedby="zero-config_info"
                                                className="table dt-table-hover tablaSucursal dataTable"
                                                id="zero-config"
                                                role="grid"
                                                style={{
                                                    width: '100%'
                                                }}
                                            >
                                                <thead>
                                                    <tr role="row">
                                                        <th
                                                            aria-controls="zero-config"
                                                            aria-label="Nombres Paciente: activate to sort column ascending"
                                                            aria-sort="descending"
                                                            className="sorting_desc"
                                                            colSpan="1"
                                                            rowSpan="1"
                                                            style={{
                                                                width: '527px'
                                                            }}
                                                            tabIndex="0"
                                                        >
                                                            Nombres Paciente
                                                        </th>
                                                        <th
                                                            aria-controls="zero-config"
                                                            aria-label="Doctor: activate to sort column ascending"
                                                            className="sorting"
                                                            colSpan="1"
                                                            rowSpan="1"
                                                            style={{
                                                                width: '266px'
                                                            }}
                                                            tabIndex="0"
                                                        >
                                                            Doctor
                                                        </th>
                                                        <th
                                                            aria-controls="zero-config"
                                                            aria-label="Fecha de creacion: activate to sort column ascending"
                                                            className="sorting"
                                                            colSpan="1"
                                                            rowSpan="1"
                                                            style={{
                                                                width: '299px'
                                                            }}
                                                            tabIndex="0"
                                                        >
                                                            Fecha de creacion
                                                        </th>
                                                        <th
                                                            aria-controls="zero-config"
                                                            aria-label="Action: activate to sort column ascending"
                                                            className="text-center dt-no-sorting sorting"
                                                            colSpan="1"
                                                            rowSpan="1"
                                                            style={{
                                                                width: '314px'
                                                            }}
                                                            tabIndex="0"
                                                        >
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr role="row">
                                                        <td className="sorting_1">
                                                            Zoey Briana Herrera Lopez
                                                        </td>
                                                        <td>
                                                            Rosa Urdaneta
                                                        </td>
                                                        <td>
                                                            2022-06-07 15:47:40
                                                        </td>
                                                        <td>
                                                            <div className="btn-group">
                                                                <button
                                                                    className="btnVerReceta btn btn-primary mb-2 p-1 mr-2 rounded-circle"
                                                                    id_receta="185"
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
                                                                    className="btn btn-warning btnEditarReceta"
                                                                    data-target="#modalEditarSucursal"
                                                                    data-toggle="modal"
                                                                    id_receta="185"
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
                                                                            strokeLinecap="modalEditarSucursal"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    borrar_receta="185"
                                                                    className="btn btn-danger btnEliminarReceta"
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
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr role="row">
                                                        <td className="sorting_1">
                                                            YOVANA ITZAL  GOMEZ MORAN
                                                        </td>
                                                        <td>
                                                            Rosa Urdaneta
                                                        </td>
                                                        <td>
                                                            2022-05-18 12:47:44
                                                        </td>
                                                        <td>
                                                            <div className="btn-group">
                                                                <button
                                                                    className="btnVerReceta btn btn-primary mb-2 p-1 mr-2 rounded-circle"
                                                                    id_receta="104"
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
                                                                    className="btn btn-warning btnEditarReceta"
                                                                    data-target="#modalEditarSucursal"
                                                                    data-toggle="modal"
                                                                    id_receta="104"
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
                                                                            strokeLinecap="modalEditarSucursal"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    borrar_receta="104"
                                                                    className="btn btn-danger btnEliminarReceta"
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
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr role="row">
                                                        <td className="sorting_1">
                                                            YOVANA ITZAL  GOMEZ MORAN
                                                        </td>
                                                        <td>
                                                            Rosa Urdaneta
                                                        </td>
                                                        <td>
                                                            2022-06-09 11:59:30
                                                        </td>
                                                        <td>
                                                            <div className="btn-group">
                                                                <button
                                                                    className="btnVerReceta btn btn-primary mb-2 p-1 mr-2 rounded-circle"
                                                                    id_receta="215"
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
                                                                    className="btn btn-warning btnEditarReceta"
                                                                    data-target="#modalEditarSucursal"
                                                                    data-toggle="modal"
                                                                    id_receta="215"
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
                                                                            strokeLinecap="modalEditarSucursal"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    borrar_receta="215"
                                                                    className="btn btn-danger btnEliminarReceta"
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
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr role="row">
                                                        <td className="sorting_1">
                                                            Yohanán David  Martinez Gonzalez
                                                        </td>
                                                        <td>
                                                            Rosa Urdaneta
                                                        </td>
                                                        <td>
                                                            2022-06-07 16:13:21
                                                        </td>
                                                        <td>
                                                            <div className="btn-group">
                                                                <button
                                                                    className="btnVerReceta btn btn-primary mb-2 p-1 mr-2 rounded-circle"
                                                                    id_receta="199"
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
                                                                    className="btn btn-warning btnEditarReceta"
                                                                    data-target="#modalEditarSucursal"
                                                                    data-toggle="modal"
                                                                    id_receta="199"
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
                                                                            strokeLinecap="modalEditarSucursal"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    borrar_receta="199"
                                                                    className="btn btn-danger btnEliminarReceta"
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
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr role="row">
                                                        <td className="sorting_1">
                                                            YERENA YARISEL REYES ALVEO
                                                        </td>
                                                        <td>
                                                            Rosa Urdaneta
                                                        </td>
                                                        <td>
                                                            2022-06-07 12:09:52
                                                        </td>
                                                        <td>
                                                            <div className="btn-group">
                                                                <button
                                                                    className="btnVerReceta btn btn-primary mb-2 p-1 mr-2 rounded-circle"
                                                                    id_receta="155"
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
                                                                    className="btn btn-warning btnEditarReceta"
                                                                    data-target="#modalEditarSucursal"
                                                                    data-toggle="modal"
                                                                    id_receta="155"
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
                                                                            strokeLinecap="modalEditarSucursal"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    borrar_receta="155"
                                                                    className="btn btn-danger btnEliminarReceta"
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
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr role="row">
                                                        <td className="sorting_1">
                                                            Yelice Maria Darce Corrales
                                                        </td>
                                                        <td>
                                                            Rosangela Urdaneta
                                                        </td>
                                                        <td>
                                                            2022-04-08 17:15:54
                                                        </td>
                                                        <td>
                                                            <div className="btn-group">
                                                                <button
                                                                    className="btnVerReceta btn btn-primary mb-2 p-1 mr-2 rounded-circle"
                                                                    id_receta="52"
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
                                                                    className="btn btn-warning btnEditarReceta"
                                                                    data-target="#modalEditarSucursal"
                                                                    data-toggle="modal"
                                                                    id_receta="52"
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
                                                                            strokeLinecap="modalEditarSucursal"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    borrar_receta="52"
                                                                    className="btn btn-danger btnEliminarReceta"
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
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr role="row">
                                                        <td className="sorting_1">
                                                            Yannett Yadira  Pérez Ortíz
                                                        </td>
                                                        <td>
                                                            Rosa Urdaneta
                                                        </td>
                                                        <td>
                                                            2022-06-07 13:44:57
                                                        </td>
                                                        <td>
                                                            <div className="btn-group">
                                                                <button
                                                                    className="btnVerReceta btn btn-primary mb-2 p-1 mr-2 rounded-circle"
                                                                    id_receta="169"
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
                                                                    className="btn btn-warning btnEditarReceta"
                                                                    data-target="#modalEditarSucursal"
                                                                    data-toggle="modal"
                                                                    id_receta="169"
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
                                                                            strokeLinecap="modalEditarSucursal"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    borrar_receta="169"
                                                                    className="btn btn-danger btnEliminarReceta"
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
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <th
                                                            colSpan="1"
                                                            rowSpan="1"
                                                        >
                                                            Nombre Paciente
                                                        </th>
                                                        <th
                                                            colSpan="1"
                                                            rowSpan="1"
                                                        >
                                                            Doctor
                                                        </th>
                                                        <th
                                                            colSpan="1"
                                                            rowSpan="1"
                                                        >
                                                            Fecha de creacion
                                                        </th>
                                                        <th
                                                            className="invisible"
                                                            colSpan="1"
                                                            rowSpan="1"
                                                        />
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                        <div className="dt--bottom-section d-sm-flex justify-content-sm-between text-center">
                                            <div className="dt--pages-count  mb-sm-0 mb-3">
                                                <div
                                                    aria-live="polite"
                                                    className="dataTables_info"
                                                    id="zero-config_info"
                                                    role="status"
                                                >
                                                    Showing page 1 of 29
                                                </div>
                                            </div>
                                            <div className="dt--pagination">
                                                <div
                                                    className="dataTables_paginate paging_simple_numbers"
                                                    id="zero-config_paginate"
                                                >
                                                    <ul className="pagination">
                                                        <li
                                                            className="paginate_button page-item previous disabled"
                                                            id="zero-config_previous"
                                                        >
                                                            <a
                                                                aria-controls="zero-config"
                                                                className="page-link"
                                                                data-dt-idx="0"
                                                                href="#"
                                                                tabIndex="0"
                                                            >
                                                                <svg
                                                                    className="feather feather-arrow-left"
                                                                    fill="none"
                                                                    height="24"
                                                                    stroke="currentColor"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    viewBox="0 0 24 24"
                                                                    width="24"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <line
                                                                        x1="19"
                                                                        x2="5"
                                                                        y1="12"
                                                                        y2="12"
                                                                    />
                                                                    <polyline points="12 19 5 12 12 5" />
                                                                </svg>
                                                            </a>
                                                        </li>
                                                        <li className="paginate_button page-item active">
                                                            <a
                                                                aria-controls="zero-config"
                                                                className="page-link"
                                                                data-dt-idx="1"
                                                                href="#"
                                                                tabIndex="0"
                                                            >
                                                                1
                                                            </a>
                                                        </li>
                                                        <li className="paginate_button page-item ">
                                                            <a
                                                                aria-controls="zero-config"
                                                                className="page-link"
                                                                data-dt-idx="2"
                                                                href="#"
                                                                tabIndex="0"
                                                            >
                                                                2
                                                            </a>
                                                        </li>
                                                        <li className="paginate_button page-item ">
                                                            <a
                                                                aria-controls="zero-config"
                                                                className="page-link"
                                                                data-dt-idx="3"
                                                                href="#"
                                                                tabIndex="0"
                                                            >
                                                                3
                                                            </a>
                                                        </li>
                                                        <li className="paginate_button page-item ">
                                                            <a
                                                                aria-controls="zero-config"
                                                                className="page-link"
                                                                data-dt-idx="4"
                                                                href="#"
                                                                tabIndex="0"
                                                            >
                                                                4
                                                            </a>
                                                        </li>
                                                        <li className="paginate_button page-item ">
                                                            <a
                                                                aria-controls="zero-config"
                                                                className="page-link"
                                                                data-dt-idx="5"
                                                                href="#"
                                                                tabIndex="0"
                                                            >
                                                                5
                                                            </a>
                                                        </li>
                                                        <li
                                                            className="paginate_button page-item disabled"
                                                            id="zero-config_ellipsis"
                                                        >
                                                            <a
                                                                aria-controls="zero-config"
                                                                className="page-link"
                                                                data-dt-idx="6"
                                                                href="#"
                                                                tabIndex="0"
                                                            >
                                                                …
                                                            </a>
                                                        </li>
                                                        <li className="paginate_button page-item ">
                                                            <a
                                                                aria-controls="zero-config"
                                                                className="page-link"
                                                                data-dt-idx="7"
                                                                href="#"
                                                                tabIndex="0"
                                                            >
                                                                29
                                                            </a>
                                                        </li>
                                                        <li
                                                            className="paginate_button page-item next"
                                                            id="zero-config_next"
                                                        >
                                                            <a
                                                                aria-controls="zero-config"
                                                                className="page-link"
                                                                data-dt-idx="8"
                                                                href="#"
                                                                tabIndex="0"
                                                            >
                                                                <svg
                                                                    className="feather feather-arrow-right"
                                                                    fill="none"
                                                                    height="24"
                                                                    stroke="currentColor"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    viewBox="0 0 24 24"
                                                                    width="24"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <line
                                                                        x1="5"
                                                                        x2="19"
                                                                        y1="12"
                                                                        y2="12"
                                                                    />
                                                                    <polyline points="12 5 19 12 12 19" />
                                                                </svg>
                                                            </a>
                                                        </li>
                                                    </ul>
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

export default VerRecetas