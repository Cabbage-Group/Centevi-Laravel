import React from 'react'

const UltimaAtencion = () => {
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
                                            Reporte de pacientes última atención
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
                                            ULTIMOS PACIENTES
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
                                                        Email
                                                    </th>
                                                    <th>
                                                        Celular
                                                    </th>
                                                    <th>
                                                        Dirección
                                                    </th>
                                                    <th>
                                                        Fecha de última atención
                                                    </th>
                                                    <th>
                                                        Doctor
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        Danna Lucia  Gonzalez Quiros
                                                    </td>
                                                    <td>
                                                        8-1219-383
                                                    </td>
                                                    <td>
                                                        rosibel2788@hotmail.com
                                                    </td>
                                                    <td>
                                                        6582-8904
                                                    </td>
                                                    <td>
                                                        Santiago, Provincia Veraguas
                                                    </td>
                                                    <td>
                                                        2024-05-25
                                                    </td>
                                                    <td>
                                                        Laura Toro Yau
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Amber Lizeth Martinez Moreno
                                                    </td>
                                                    <td>
                                                        4-882-127
                                                    </td>
                                                    <td />
                                                    <td>
                                                        6478-1937
                                                    </td>
                                                    <td>
                                                        David Residencial Hacienda del Lago, Chiriqui
                                                    </td>
                                                    <td>
                                                        2021-12-18
                                                    </td>
                                                    <td>
                                                        Laura Toro Yau, SuperAdmin, Xavier Vargas
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Jenna Nicolle Martinez Moreno
                                                    </td>
                                                    <td>
                                                        4-867-2164
                                                    </td>
                                                    <td />
                                                    <td>
                                                        6478-1937
                                                    </td>
                                                    <td>
                                                        David Residencial Hacienda del Lago Chiriqui
                                                    </td>
                                                    <td>
                                                        2021-12-18
                                                    </td>
                                                    <td>
                                                        Laura Toro Yau
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Ambar Julieta Quintero Xatruch
                                                    </td>
                                                    <td>
                                                        8-1118-185
                                                    </td>
                                                    <td />
                                                    <td>
                                                        6614-6377{' '}
                                                    </td>
                                                    <td>
                                                        Limajos, Panama
                                                    </td>
                                                    <td>
                                                        2022-10-31
                                                    </td>
                                                    <td>
                                                        Laura Toro Yau
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Noa Stella Edde Sasson
                                                    </td>
                                                    <td>
                                                        0000
                                                    </td>
                                                    <td>
                                                        Nadine.edde@gmail.com
                                                    </td>
                                                    <td>
                                                        6130-3636
                                                    </td>
                                                    <td>
                                                        Pacific Point Torre 500, 3A
                                                    </td>
                                                    <td />
                                                    <td />
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Daniel Antonio Halphen Tapia
                                                    </td>
                                                    <td>
                                                        8-1128-323
                                                    </td>
                                                    <td />
                                                    <td>
                                                        6679-2021
                                                    </td>
                                                    <td>
                                                        {' '}Calle Amapolas, San Francisco
                                                    </td>
                                                    <td>
                                                        2023-05-03
                                                    </td>
                                                    <td>
                                                        Laura Toro Yau
                                                    </td>
                                                </tr>
                                            </tbody>
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
                                                            width: '356px'
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
                                                            width: '132px'
                                                        }}
                                                        tabIndex="0"
                                                    >
                                                        Cedula
                                                    </th>
                                                    <th
                                                        aria-controls="html5-extension"
                                                        aria-label="Email: activate to sort column ascending"
                                                        className="sorting"
                                                        colSpan="1"
                                                        rowSpan="1"
                                                        style={{
                                                            width: '252px'
                                                        }}
                                                        tabIndex="0"
                                                    >
                                                        Email
                                                    </th>
                                                    <th
                                                        aria-controls="html5-extension"
                                                        aria-label="Celular: activate to sort column ascending"
                                                        className="sorting"
                                                        colSpan="1"
                                                        rowSpan="1"
                                                        style={{
                                                            width: '63px'
                                                        }}
                                                        tabIndex="0"
                                                    >
                                                        Celular
                                                    </th>
                                                    <th
                                                        aria-controls="html5-extension"
                                                        aria-label="Dirección: activate to sort column ascending"
                                                        className="sorting"
                                                        colSpan="1"
                                                        rowSpan="1"
                                                        style={{
                                                            width: '593px'
                                                        }}
                                                        tabIndex="0"
                                                    >
                                                        Dirección
                                                    </th>
                                                    <th
                                                        aria-controls="html5-extension"
                                                        aria-label="Fecha de última atención: activate to sort column ascending"
                                                        className="sorting"
                                                        colSpan="1"
                                                        rowSpan="1"
                                                        style={{
                                                            width: '193px'
                                                        }}
                                                        tabIndex="0"
                                                    >
                                                        Fecha de última atención
                                                    </th>
                                                    <th
                                                        aria-controls="html5-extension"
                                                        aria-label="Doctor: activate to sort column ascending"
                                                        className="sorting"
                                                        colSpan="1"
                                                        rowSpan="1"
                                                        style={{
                                                            width: '480px'
                                                        }}
                                                        tabIndex="0"
                                                    >
                                                        Doctor
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr role="row">
                                                    <td className="sorting_1">
                                                        Aaran Nathanie  Blake Niño
                                                    </td>
                                                    <td>
                                                        8-1130-778
                                                    </td>
                                                    <td>
                                                        notiene@gmail.com
                                                    </td>
                                                    <td>
                                                        6011-9492
                                                    </td>
                                                    <td>
                                                        Arraijan
                                                    </td>
                                                    <td />
                                                    <td />
                                                </tr>
                                                <tr role="row">
                                                    <td className="sorting_1">
                                                        Aaron  Ameth  montilla Cuarezma
                                                    </td>
                                                    <td>
                                                        8-1249-20
                                                    </td>
                                                    <td />
                                                    <td>
                                                        6009-5242
                                                    </td>
                                                    <td>
                                                        Pedregal
                                                    </td>
                                                    <td />
                                                    <td />
                                                </tr>
                                                <tr role="row">
                                                    <td className="sorting_1">
                                                        AARON  ELIAM PEREZ PINZON
                                                    </td>
                                                    <td>
                                                        8-1166-1372
                                                    </td>
                                                    <td />
                                                    <td>
                                                        62593911
                                                    </td>
                                                    <td>
                                                        SANTA ISABEL,PACORA
                                                    </td>
                                                    <td />
                                                    <td />
                                                </tr>
                                                <tr role="row">
                                                    <td className="sorting_1">
                                                        Aaron  Isler
                                                    </td>
                                                    <td>
                                                        8-1238-522
                                                    </td>
                                                    <td />
                                                    <td>
                                                        6264-2926
                                                    </td>
                                                    <td>
                                                        San Francisco, casa 478
                                                    </td>
                                                    <td>
                                                        2022-08-04
                                                    </td>
                                                    <td>
                                                        Fabian Gonzalez
                                                    </td>
                                                </tr>
                                                <tr role="row">
                                                    <td className="sorting_1">
                                                        Aaron Amador Sanchez Guevara
                                                    </td>
                                                    <td>
                                                        8-1067-2238
                                                    </td>
                                                    <td />
                                                    <td>
                                                        6549-8602
                                                    </td>
                                                    <td>
                                                        San Miguelito
                                                    </td>
                                                    <td>
                                                        0000-00-00
                                                    </td>
                                                    <td>
                                                        Xavier Vargas
                                                    </td>
                                                </tr>
                                                <tr role="row">
                                                    <td className="sorting_1">
                                                        AARON DANIEL LARAME ESPINOZA
                                                    </td>
                                                    <td>
                                                        8-1136-834
                                                    </td>
                                                    <td />
                                                    <td>
                                                        6898-4106
                                                    </td>
                                                    <td>
                                                        PACORA
                                                    </td>
                                                    <td />
                                                    <td />
                                                </tr>
                                                <tr role="row">
                                                    <td className="sorting_1">
                                                        Aaron Eliam Peréz Pinzón DUPLICADO
                                                    </td>
                                                    <td>
                                                        8-1166-1372
                                                    </td>
                                                    <td>
                                                        DUPLICADO@GMAIL.COM
                                                    </td>
                                                    <td>
                                                        6259-3911
                                                    </td>
                                                    <td>
                                                        Santa Isabel, Cabra
                                                    </td>
                                                    <td />
                                                    <td />
                                                </tr>
                                                <tr role="row">
                                                    <td className="sorting_1">
                                                        AARON FREUTAZ ALVAREZ DAVID
                                                    </td>
                                                    <td>
                                                        1151101692
                                                    </td>
                                                    <td />
                                                    <td>
                                                        000000
                                                    </td>
                                                    <td />
                                                    <td />
                                                    <td />
                                                </tr>
                                                <tr role="row">
                                                    <td className="sorting_1">
                                                        Aaron Ibrahim Jalil Dumbar
                                                    </td>
                                                    <td>
                                                        3-782-397
                                                    </td>
                                                    <td />
                                                    <td>
                                                        6648-8412
                                                    </td>
                                                    <td>
                                                        Colon Cativa
                                                    </td>
                                                    <td />
                                                    <td />
                                                </tr>
                                                <tr role="row">
                                                    <td className="sorting_1">
                                                        Aaron Martin Andrade Manns
                                                    </td>
                                                    <td>
                                                        8-1166-57
                                                    </td>
                                                    <td />
                                                    <td>
                                                        6537-0207
                                                    </td>
                                                    <td>
                                                        La Loma, Pueblo Nuevo
                                                    </td>
                                                    <td>
                                                        2022-08-09
                                                    </td>
                                                    <td>
                                                        Laura Toro Yau
                                                    </td>
                                                </tr>
                                                <tr role="row">
                                                    <td className="sorting_1">
                                                        AARON MOISES GARZON ARWAS
                                                    </td>
                                                    <td>
                                                        8-1050-648
                                                    </td>
                                                    <td>
                                                        garzonnamelia18@gmail.com
                                                    </td>
                                                    <td>
                                                        6617-1746
                                                    </td>
                                                    <td>
                                                        PUNTA PACIFICA
                                                    </td>
                                                    <td>
                                                        2024-04-01
                                                    </td>
                                                    <td>
                                                        Laura Toro Yau
                                                    </td>
                                                </tr>
                                                <tr role="row">
                                                    <td className="sorting_1">
                                                        Aarón Alex  Sánchez Camarena{' '}
                                                    </td>
                                                    <td>
                                                        8-1241-1648
                                                    </td>
                                                    <td />
                                                    <td>
                                                        6354-5593
                                                    </td>
                                                    <td>
                                                        Tocumen Villa Louchin Caja 11
                                                    </td>
                                                    <td />
                                                    <td />
                                                </tr>
                                                <tr role="row">
                                                    <td className="sorting_1">
                                                        Aarón Saúl  Atencio Brown
                                                    </td>
                                                    <td>
                                                        8-1098-224
                                                    </td>
                                                    <td />
                                                    <td>
                                                        6747-2863
                                                    </td>
                                                    <td>
                                                        Bethania
                                                    </td>
                                                    <td>
                                                        2023-06-15
                                                    </td>
                                                    <td>
                                                        Sayuris Santos
                                                    </td>
                                                </tr>
                                                <tr role="row">
                                                    <td className="sorting_1">
                                                        ABBI ANDREA VELIZ GARCIA DUPLICADO
                                                    </td>
                                                    <td>
                                                        8-1222-2003
                                                    </td>
                                                    <td>
                                                        DUPLICADO@GMAIL.COM
                                                    </td>
                                                    <td>
                                                        6057-3921
                                                    </td>
                                                    <td>
                                                        PH MALLORCA
                                                    </td>
                                                    <td />
                                                    <td />
                                                </tr>
                                                <tr role="row">
                                                    <td className="sorting_1">
                                                        Abbie Andrea Veliz Garcia
                                                    </td>
                                                    <td>
                                                        8-1222-2003
                                                    </td>
                                                    <td />
                                                    <td>
                                                        6057-3921
                                                    </td>
                                                    <td>
                                                        PH Mallorca Park, San Miguelito
                                                    </td>
                                                    <td />
                                                    <td />
                                                </tr>
                                                <tr role="row">
                                                    <td className="sorting_1">
                                                        Abbie Valentina  Ramos Quintero{' '}
                                                    </td>
                                                    <td>
                                                        8-1247-1693
                                                    </td>
                                                    <td />
                                                    <td>
                                                        6821-3061
                                                    </td>
                                                    <td>
                                                        Las Cumbres PH Quintas del Lago{' '}
                                                    </td>
                                                    <td />
                                                    <td />
                                                </tr>
                                                <tr role="row">
                                                    <td className="sorting_1">
                                                        Abby Claire de sousa Jatouche
                                                    </td>
                                                    <td>
                                                        8-1169-48
                                                    </td>
                                                    <td />
                                                    <td>
                                                        6249-3144
                                                    </td>
                                                    <td>
                                                        arraijan,bda el bambu
                                                    </td>
                                                    <td>
                                                        2022-05-14
                                                    </td>
                                                    <td>
                                                        Laura Toro Yau
                                                    </td>
                                                </tr>
                                                <tr role="row">
                                                    <td className="sorting_1">
                                                        Abby Evangeline  Gonzalez Solano{' '}
                                                    </td>
                                                    <td>
                                                        8-1179-580
                                                    </td>
                                                    <td />
                                                    <td>
                                                        6965-0356
                                                    </td>
                                                    <td>
                                                        Buenas Vista Tocumen Calle 2D Casa D51
                                                    </td>
                                                    <td />
                                                    <td />
                                                </tr>
                                                <tr role="row">
                                                    <td className="sorting_1">
                                                        ABBY NICOLE BROKAMP TABOADA
                                                    </td>
                                                    <td>
                                                        8-1188-512
                                                    </td>
                                                    <td />
                                                    <td>
                                                        6676-9138
                                                    </td>
                                                    <td>
                                                        CHORRERA
                                                    </td>
                                                    <td>
                                                        2023-04-26
                                                    </td>
                                                    <td>
                                                        Laura Toro Yau
                                                    </td>
                                                </tr>
                                                <tr role="row">
                                                    <td className="sorting_1">
                                                        ABDEL ALEJANDRO  RUIZ AGRAZAL
                                                    </td>
                                                    <td>
                                                        8-1163-1727
                                                    </td>
                                                    <td />
                                                    <td>
                                                        6015-4320
                                                    </td>
                                                    <td>
                                                        TOCUMEN, TORREMOLINO
                                                    </td>
                                                    <td />
                                                    <td />
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="dt--bottom-section d-sm-flex justify-content-sm-between text-center">
                                        <div className="dt--pages-count  mb-sm-0 mb-3">
                                            <div
                                                aria-live="polite"
                                                className="dataTables_info"
                                                id="html5-extension_info"
                                                role="status"
                                            >
                                                Showing page 1 of 441
                                            </div>
                                        </div>
                                        <div className="dt--pagination">
                                            <div
                                                className="dataTables_paginate paging_simple_numbers"
                                                id="html5-extension_paginate"
                                            >
                                                <ul className="pagination">
                                                    <li
                                                        className="paginate_button page-item previous disabled"
                                                        id="html5-extension_previous"
                                                    >
                                                        <a
                                                            aria-controls="html5-extension"
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
                                                            aria-controls="html5-extension"
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
                                                            aria-controls="html5-extension"
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
                                                            aria-controls="html5-extension"
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
                                                            aria-controls="html5-extension"
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
                                                            aria-controls="html5-extension"
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
                                                        id="html5-extension_ellipsis"
                                                    >
                                                        <a
                                                            aria-controls="html5-extension"
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
                                                            aria-controls="html5-extension"
                                                            className="page-link"
                                                            data-dt-idx="7"
                                                            href="#"
                                                            tabIndex="0"
                                                        >
                                                            441
                                                        </a>
                                                    </li>
                                                    <li
                                                        className="paginate_button page-item next"
                                                        id="html5-extension_next"
                                                    >
                                                        <a
                                                            aria-controls="html5-extension"
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
    )
}

export default UltimaAtencion