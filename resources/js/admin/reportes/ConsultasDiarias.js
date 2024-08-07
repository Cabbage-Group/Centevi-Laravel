import React, {useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConsultasDiarias, setOrden, setOrdenPor,setFechaRange } from '../../redux/features/reportes/consultasDiariasSlice.js';
import PaginationConsultasDiarias from './PaginationConsultasDiarias';
import DateRangePicker from './DateRangePicker';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice.js';
import ExportButton from './exportButton';
import { transformDataForConsultasDiarias } from '../../../utils/dataTransform';


const ConsultasDiarias = () => {

    const dispatch = useDispatch();
    const metaPacientes = useSelector((state) => state.pacientes.meta);
    const { consultasDiarias, status, error, meta,totalPages, orden,startDate, endDate, ordenPor,search,dataexport} = useSelector((state) => state.consultasDiarias);

    const [currentPage, setCurrentPage] = useState(1);
    const [localEndDate, setLocalEndDate] = useState(endDate);
    const [localStartDate, setLocalStartDate] = useState(startDate);
    const [localSearch, setLocalSearch] = useState(search);
    
    useEffect(() => {
        dispatch(fetchPacientes({}));
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchConsultasDiarias({page: currentPage, limit: 20, orden, ordenPor,startDate, endDate, search: localSearch }));
    }, [dispatch,localSearch,  currentPage, orden, ordenPor,startDate, endDate]);


    const handleSearchChange = (event) => {
        setLocalSearch(event.target.value); 
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDateChange = () => {
        dispatch(setFechaRange({ startDate: localStartDate, endDate: localEndDate }));
        dispatch(fetchConsultasDiarias({ page: currentPage, startDate: localStartDate, endDate: localEndDate, limit: 20, orden, ordenPor }));
    };


    const handleSort = (newOrdenPor) => {
        const newOrder = orden === 'asc' ? 'desc' : 'asc';
        dispatch(setOrden(newOrder));
        dispatch(setOrdenPor(newOrdenPor));
        dispatch(fetchConsultasDiarias({ page: currentPage, startDate, endDate, limit: 20, orden: newOrder, ordenPor: newOrderPor }));
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
                                            Reporte de Pacientes | Consultas Diarias
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
                                                        {metaPacientes.total}
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
                                <DateRangePicker
                                    startDate={localStartDate}
                                    endDate={localEndDate}
                                    onChange={(start, end) => {
                                        setLocalStartDate(start);
                                        setLocalEndDate(end);
                                    }}
                                    onApply={handleDateChange}
                                />
                                
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
                                                <ExportButton 
                                                dataexport={dataexport}
                                                transformData={transformDataForConsultasDiarias}
                                                fileName="consultas_diarias.xlsx"
                                                />
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
                                                            value={localSearch}
                                                            onChange={handleSearchChange} // Maneja los cambios en el campo de búsqueda
                                                        />
                                                        {/* Renderiza los datos de ultimaAtencion */}
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
                                                        aria-controls="zero-config"
                                                        aria-label={`Nombre: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                                                        className={`sorting ${orden}`}
                                                        colSpan="1"
                                                        rowSpan="1"
                                                        style={{ width: '153.82px' }}
                                                        tabIndex="0"
                                                        onClick={() => handleSort('PACIENTE_NOMBRE')}
                                                            
                                                        >
                                                            Nombre
                                                        </th>
                                                        <th
                                                        aria-controls="zero-config"
                                                        aria-label={`Cedula: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                                                        className={`sorting ${orden}`}
                                                        colSpan="1"
                                                        rowSpan="1"
                                                        style={{ width: '153.82px' }}
                                                        tabIndex="0"
                                                        onClick={() => handleSort('PACIENTE_CEDULA')}
                                                           
                                                        >
                                                            Cedula
                                                        </th>
                                                        <th
                                                        aria-controls="zero-config"
                                                        aria-label={`Sucursal: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                                                        className={`sorting ${orden}`}
                                                        colSpan="1"
                                                        rowSpan="1"
                                                        style={{ width: '153.82px' }}
                                                        tabIndex="0"
                                                        onClick={() => handleSort('SUCURSAL')}
                                                            
                                                        >
                                                            Sucursal
                                                        </th>
                                                        <th
                                                        aria-controls="zero-config"
                                                        aria-label={`Celular: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                                                        className={`sorting ${orden}`}
                                                        colSpan="1"
                                                        rowSpan="1"
                                                        style={{ width: '153.82px' }}
                                                        tabIndex="0"
                                                        onClick={() => handleSort('PACIENTE_CELULAR')}
                                                          
                                                        >
                                                            Celular
                                                        </th>
                                                        <th
                                                        aria-controls="zero-config"
                                                        aria-label={`Tipo: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                                                        className={`sorting ${orden}`}
                                                        colSpan="1"
                                                        rowSpan="1"
                                                        style={{ width: '153.82px' }}
                                                        tabIndex="0"
                                                        onClick={() => handleSort('TIPO')}
                                                            
                                                        >
                                                            Tipo de Consulta
                                                        </th>
                                                        <th
                                                        aria-controls="zero-config"
                                                        aria-label={`Fecha atencion: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                                                        className={`sorting ${orden}`}
                                                        colSpan="1"
                                                        rowSpan="1"
                                                        style={{ width: '153.82px' }}
                                                        tabIndex="0"
                                                        onClick={() => handleSort('FECHA_ATENCION')}
                                                            
                                                        >
                                                            Fecha de atención
                                                        </th>
                                                        <th
                                                        aria-controls="zero-config"
                                                        aria-label={`Doctor: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                                                        className={`sorting ${orden}`}
                                                        colSpan="1"
                                                        rowSpan="1"
                                                        style={{ width: '153.82px' }}
                                                        tabIndex="0"
                                                        onClick={() => handleSort('DOCTOR')}
                                                            
                                                        >
                                                            Doctor
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {consultasDiarias.map((consultaDiaria) => (
                                                        <tr key={consultaDiaria.ID_PACIENTE}>
                                                            <td>{consultaDiaria.PACIENTE_NOMBRE.trim()}</td>
                                                            <td>{consultaDiaria.PACIENTE_CEDULA}</td>
                                                            <td>{consultaDiaria.SUCURSAL}</td>
                                                            <td>{consultaDiaria.PACIENTE_CELULAR}</td>
                                                            <td>{consultaDiaria.TIPO}</td>
                                                            <td>{consultaDiaria.FECHA_ATENCION}</td>
                                                            <td>{consultaDiaria.DOCTOR}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )} 

                                        <PaginationConsultasDiarias
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

export default ConsultasDiarias