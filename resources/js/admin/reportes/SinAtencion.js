import React, {useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPacientesSinAtencion } from '../../redux/features/reportes/pacientesSinAtencionSlice';
import PaginationSinAtencion from './PaginationSinAtencion';

const SinAtencion = () => {

    const dispatch = useDispatch();
    const { pacientesSinAtencion, status, error, meta, totalPages} = useSelector((state) => state.pacientesSinAtencion);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(fetchPacientesSinAtencion({ page: currentPage, limit: 20}));
    }, [dispatch, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


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
                                            Reporte de pacientes sin atención
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
                                                        8871
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
                                <div className="col-lg-3 col-md-6">
                                    <div className="widget widget-one_hybrid widget-engagement">
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
                                                        {meta.total}
                                                    </p>
                                                    <h5 className="">
                                                        PACIENTES SIN ATENDER
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
                                            Listado de pacientes sin atención
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
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        ZAPATO POLO
                                                    </td>
                                                    <td>
                                                        2992
                                                    </td>
                                                    <td>
                                                        SAA@GMAIL.COM
                                                    </td>
                                                    <td>
                                                        29292911
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        POLO9090 ASDLL
                                                    </td>
                                                    <td>
                                                        299091
                                                    </td>
                                                    <td>
                                                        L@GMAIL.COM
                                                    </td>
                                                    <td>
                                                        222
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        pac33 paa
                                                    </td>
                                                    <td>
                                                        122
                                                    </td>
                                                    <td>
                                                        a@gmail.com
                                                    </td>
                                                    <td>
                                                        asdasd
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Gg pp
                                                    </td>
                                                    <td>
                                                        12333
                                                    </td>
                                                    <td>
                                                        q@gmail.com
                                                    </td>
                                                    <td>
                                                        11123
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        pac2 asd
                                                    </td>
                                                    <td>
                                                        1234
                                                    </td>
                                                    <td>
                                                        asd@gmail.com
                                                    </td>
                                                    <td>
                                                        222
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        KETHLIN AILEEN  DELGADO RODRIGUEZ
                                                    </td>
                                                    <td>
                                                        3-783-274
                                                    </td>
                                                    <td>
                                                        ETHLIN30@HOTMAIL.COM
                                                    </td>
                                                    <td>
                                                        6561-5447
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
                                <h5 className="">
                                    Exportación de datos
                                </h5>
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
                                        {status === 'loading' && <p>Loading...</p>}
                                        {status === 'failed' && <p>Error: {error}</p>}
                                        {status === 'succeeded' && (
                                            <table aria-describedby="zero-config_info" className="table dt-table-hover tablas dataTable" id="zero-config" role="grid" style={{ width: '100%' }}>
                                                <thead>
                                                    <tr role="row">
                                                        <th
                                                            
                                                        >
                                                            Nombre del Paciente
                                                        </th>
                                                        <th
                                                           
                                                        >
                                                            Cedula
                                                        </th>
                                                        <th
                                                            
                                                        >
                                                            Email
                                                        </th>
                                                        <th
                                                          
                                                        >
                                                            Celular
                                                        </th>
                                                        
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pacientesSinAtencion.map((pacienteSinAtencion) => (
                                                        <tr key={pacienteSinAtencion.id_paciente}>
                                                            <td>{pacienteSinAtencion.nombres.trim()}</td>
                                                            <td>{pacienteSinAtencion.nro_cedula}</td>
                                                            <td>{pacienteSinAtencion.email}</td>
                                                            <td>{pacienteSinAtencion.celular}</td>
                                                            
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                        <PaginationSinAtencion
                                            meta={meta}
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                        />                                 
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

export default SinAtencion