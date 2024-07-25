import React from 'react'

const VerReportes = () => {
    return (
        <div className="row layout-top-spacing">
            <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
                <div className="widget-content-area br-4">
                    <div className="widget-one">
                        <div className="row">
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
                                <div className="widget widget-one">
                                    <div className="widget-heading">
                                        <h6 className="">
                                            Reporte de pacientes atendidos por día
                                        </h6>
                                    </div>
                                    <div className="w-chart">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="all-card">
                            <div className="row">
                                <div className="col-lg-3 col-md-6">
                                    <div className="widget widget-one_hybrid widget-referral">
                                        <div className="widget-heading">
                                            <div className="w-title">
                                                <div className="w-icon">
                                                    <svg
                                                        className="feather feather-users"
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
                                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                        <circle
                                                            cx="9"
                                                            cy="7"
                                                            r="4"
                                                        />
                                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                    </svg>
                                                </div>
                                                <div className="">
                                                    <p className="w-value">
                                                        8819
                                                    </p>
                                                    <h5 className="">
                                                        PACIENTES
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="widget-content">
                                            <div className="w-chart">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
                                <div className="widget-four">
                                    <div className="widget-heading">
                                        <h5 className="">
                                            ULTIMOS PACIENTES ATENDIDOS POR DIA
                                        </h5>
                                    </div>
                                    <div className="table-responsive">
                                        <table
                                            className="table dt-table-hover tabla_pacientes"
                                            style={{
                                                width: '100%'
                                            }}
                                        >
                                            <thead>
                                                <tr>
                                                    <th>
                                                        Nombres de Paciente
                                                    </th>
                                                    <th>
                                                        Cedula
                                                    </th>
                                                    <th>
                                                        Sucursal
                                                    </th>
                                                    <th>
                                                        Celular
                                                    </th>
                                                    <th>
                                                        Fecha de atención
                                                    </th>
                                                    <th>
                                                        Doctor
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody />
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group col-md-4 mt-4">
                                <label>
                                    Buscar por Fecha:
                                </label>
                                <input
                                    className="form-control"
                                    defaultValue=""
                                    id="fecha_reporte"
                                    name="fecha"
                                    type="text"
                                />
                                <button
                                    className="btn btn-success mt-3"
                                    id="buscar"
                                    type="button"
                                >
                                    BUSCAR
                                </button>
                            </div>
                            <div className="table-responsive">
                                <div
                                    className="dataTables_wrapper container-fluid dt-bootstrap4 no-footer"
                                    id="html5-extension_wrapper"
                                >
                                    <div className="dt--top-section">
                                        <div className="row">
                                            <div className="col-sm-12 col-md-6 d-flex justify-content-md-start justify-content-center">
                                                <div className="dt-buttons">
                                                    <button
                                                        aria-controls="html5-extension"
                                                        className="dt-button buttons-copy buttons-html5 btn btn-sm"
                                                        tabIndex="0"
                                                    >
                                                        <span>
                                                            Copy
                                                        </span>
                                                    </button>
                                                    {' '}
                                                    <button
                                                        aria-controls="html5-extension"
                                                        className="dt-button buttons-csv buttons-html5 btn btn-sm"
                                                        tabIndex="0"
                                                    >
                                                        <span>
                                                            CSV
                                                        </span>
                                                    </button>
                                                    {' '}
                                                    <button
                                                        aria-controls="html5-extension"
                                                        className="dt-button buttons-excel buttons-html5 btn btn-sm"
                                                        tabIndex="0"
                                                    >
                                                        <span>
                                                            Excel
                                                        </span>
                                                    </button>
                                                    {' '}
                                                    <button
                                                        aria-controls="html5-extension"
                                                        className="dt-button buttons-print btn btn-sm"
                                                        tabIndex="0"
                                                    >
                                                        <span>
                                                            Print
                                                        </span>
                                                    </button>
                                                    {' '}
                                                </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 d-flex justify-content-md-end justify-content-center mt-md-0 mt-3">
                                                <div
                                                    className="dataTables_filter"
                                                    id="html5-extension_filter"
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
                                                            aria-controls="html5-extension"
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
                                            aria-describedby="html5-extension_info"
                                            className="table table-hover non-hover dataTable no-footer"
                                            id="html5-extension"
                                            role="grid"
                                            style={{
                                                width: '100%'
                                            }}
                                        >
                                            <thead>
                                                <tr role="row">
                                                    <th
                                                        aria-controls="html5-extension"
                                                        aria-label="Nombres de Paciente: activate to sort column descending"
                                                        aria-sort="ascending"
                                                        className="sorting_asc"
                                                        colSpan="1"
                                                        rowSpan="1"
                                                        style={{
                                                            width: '283px'
                                                        }}
                                                        tabIndex="0"
                                                    >
                                                        Nombres de Paciente
                                                    </th>
                                                    <th
                                                        aria-controls="html5-extension"
                                                        aria-label="Cedula: activate to sort column ascending"
                                                        className="sorting"
                                                        colSpan="1"
                                                        rowSpan="1"
                                                        style={{
                                                            width: '111px'
                                                        }}
                                                        tabIndex="0"
                                                    >
                                                        Cedula
                                                    </th>
                                                    <th
                                                        aria-controls="html5-extension"
                                                        aria-label="Sucursal: activate to sort column ascending"
                                                        className="sorting"
                                                        colSpan="1"
                                                        rowSpan="1"
                                                        style={{
                                                            width: '131px'
                                                        }}
                                                        tabIndex="0"
                                                    >
                                                        Sucursal
                                                    </th>
                                                    <th
                                                        aria-controls="html5-extension"
                                                        aria-label="Celular: activate to sort column ascending"
                                                        className="sorting"
                                                        colSpan="1"
                                                        rowSpan="1"
                                                        style={{
                                                            width: '114px'
                                                        }}
                                                        tabIndex="0"
                                                    >
                                                        Celular
                                                    </th>
                                                    <th
                                                        aria-controls="html5-extension"
                                                        aria-label="Tipo de Consulta: activate to sort column ascending"
                                                        className="sorting"
                                                        colSpan="1"
                                                        rowSpan="1"
                                                        style={{
                                                            width: '230px'
                                                        }}
                                                        tabIndex="0"
                                                    >
                                                        Tipo de Consulta
                                                    </th>
                                                    <th
                                                        aria-controls="html5-extension"
                                                        aria-label="Fecha de atención: activate to sort column ascending"
                                                        className="sorting"
                                                        colSpan="1"
                                                        rowSpan="1"
                                                        style={{
                                                            width: '248px'
                                                        }}
                                                        tabIndex="0"
                                                    >
                                                        Fecha de atención
                                                    </th>
                                                    <th
                                                        aria-controls="html5-extension"
                                                        aria-label="Doctor: activate to sort column ascending"
                                                        className="sorting"
                                                        colSpan="1"
                                                        rowSpan="1"
                                                        style={{
                                                            width: '111px'
                                                        }}
                                                        tabIndex="0"
                                                    >
                                                        Doctor
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="">
                                                    <td
                                                        className="dataTables_empty"
                                                        colSpan="7"
                                                        valign="top"
                                                    >
                                                        No data available in table
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
    )
}

export default VerReportes