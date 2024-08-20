import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProximasCitas, actualizarContacto, setOrden, setOrdenPor, setFechaRange , updateCitaContacto, updateCitaAgendada, actualizarAgendo } from '../../redux/features/reportes/proximasCitasSlice';
import PaginationProximasCitas from './PaginationProximasCitas';
import DateRangePicker from './DateRangePicker';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice';
import ExportButton from './exportButton';
import { transformDataForProximasCitas } from '../../../utils/dataTransform';

import Swal from 'sweetalert2';



const ProximasCitas = () => {
    const dispatch = useDispatch();

    const metaPacientes = useSelector((state) => state.pacientes.meta);
    const { proximasCitas, status, startDate, endDate, error, meta, totalPages, orden, ordenPor, search, dataexport } = useSelector((state) => state.proximasCitas);

    const [currentPage, setCurrentPage] = useState(1);
    const [localSearch, setLocalSearch] = useState(search);
    const [localEndDate, setLocalEndDate] = useState(endDate);
    const [localStartDate, setLocalStartDate] = useState(startDate);

    useEffect(() => {
        dispatch(fetchPacientes({}));
    }, [dispatch]);

    useEffect(() => {

        dispatch(fetchProximasCitas({ page: currentPage, limit: 20, orden, ordenPor, startDate, endDate, search: localSearch }));
    }, [dispatch, localSearch, currentPage, startDate, endDate, orden, ordenPor]);


    const handleSearchChange = (event) => {
        setLocalSearch(event.target.value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDateChange = () => {
        dispatch(setFechaRange({ startDate: localStartDate, endDate: localEndDate }));
        dispatch(fetchProximasCitas({ startDate: localStartDate, endDate: localEndDate, limit: 20, orden, ordenPor }))


    };

    const handleClearSearch = () => {
        setLocalSearch('');
    };

    const handleSort = (newOrdenPor) => {
        const newOrder = orden === 'asc' ? 'desc' : 'asc';
        dispatch(setOrden(newOrder));
        dispatch(setOrdenPor(newOrdenPor));
        dispatch(fetchProximasCitas({ page: currentPage, startDate, endDate, limit: 20, orden: newOrder, ordenPor: newOrdenPor }))
            .catch((err) => console.error('Error fetching terapias diarias on sort:', err));
    };

    const handleContactoClick = (proximaCita) => {

        console.log('Datos de la cita:', proximaCita); 
        Swal.fire({
            title: '¿Contactaste con este paciente?',
            text: '¡Acepta solo si tuviste la oportunidad de comunicarte con este paciente!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, lo contacté',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
   
                dispatch(actualizarContacto({
                    tabla: proximaCita.NOMBRE_TABLA, 
                    id_consulta: proximaCita.ID_CONSULTA,
                    hubo_contacto: 1
                }))
                .then(() => {
                    console.log('Contacto actualizado exitosamente');
                    dispatch(updateCitaContacto({ id_consulta: proximaCita.ID_CONSULTA, hubo_contacto: 1 }));
                    Swal.fire('Contacto confirmado', '', 'success');
                    dispatch(fetchProximasCitas({ page: currentPage, limit: 20, orden, ordenPor, startDate, endDate, search: localSearch })); // Actualiza los datos
                })
                .catch(() => {
                    Swal.fire('Error al confirmar contacto', '', 'error');
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Contacto no confirmado', '', 'error');
            }
        });
    };

    const handleAgendadoClick = (proximaCita) => {
        if (proximaCita.CONTACTO === 1) {
            Swal.fire({
                title: '¿Agendaste la cita con este paciente?',
                text: '¡Acepta solo si has agendado la cita!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, la agendé',
                cancelButtonText: 'No',
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log('Confirmado por el usuario');

                    const datosActualizar = {
                        tabla: proximaCita.NOMBRE_TABLA, 
                        id_consulta: proximaCita.ID_CONSULTA,
                        se_agendo: 1 
                    };

                    console.log('Datos para actualizar agendado:', datosActualizar);

                    dispatch(actualizarAgendo(datosActualizar))
                            .then(() => {
                                console.log('Cita agendada exitosamente');
                                dispatch(updateCitaAgendada({ id_consulta: proximaCita.ID_CONSULTA, se_agendo: 1 }));
                                Swal.fire('Cita agendada', '', 'success');
                                dispatch(fetchProximasCitas({ page: currentPage, limit: 20, orden, ordenPor, startDate, endDate, search: localSearch })); 
                            })
                        .catch((error) => {
                            console.error('Error al agendar cita:', error.message);
                            Swal.fire('Error al agendar cita', '', 'error');
                        });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    console.log('Cancelado por el usuario');
                    Swal.fire('Cita no agendada', '', 'error');
                }
            });
        } else {
            Swal.fire('Acción bloqueada', 'Lo sentimos, primero tienes que marcar que se contactó al paciente', 'error');
        }
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
                                            Reporte de Pacientes | Terapias Diarias
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
                                                        transformData={transformDataForProximasCitas}
                                                        fileName="proximas_citas.xlsx"
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
                                                            onChange={handleSearchChange}
                                                        />
                                                        {localSearch && (
                                                            <button
                                                                onClick={handleClearSearch}
                                                                style={{
                                                                    position: 'absolute',
                                                                    right: '25px',
                                                                    top: '50%',
                                                                    transform: 'translateY(-50%)',
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                &#x2715; { }
                                                            </button>
                                                        )}
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
                                                        aria-label={`Fecha_Proxima_Cita: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                                                        className={`sorting ${orden}`}
                                                        colSpan="1"
                                                        rowSpan="1"
                                                        style={{ width: '153.82px' }}
                                                        tabIndex="0"
                                                        onClick={() => handleSort('PROXIMA_FECHA')}

                                                        >
                                                        Fecha Proxima Cita
                                                        </th>
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
                                                            aria-label={`Email: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                                                            className={`sorting ${orden}`}
                                                            colSpan="1"
                                                            rowSpan="1"
                                                            style={{ width: '153.82px' }}
                                                            tabIndex="0"
                                                            onClick={() => handleSort('PACIENTE_EMAIL')}

                                                        >
                                                            Email
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
                                                        <th

                                                            aria-controls="zero-config"                                                         
                                                            colSpan="1"
                                                            rowSpan="1"
                                                            style={{ width: '153.82px' }}
                                                            tabIndex="0"
                                                            
                                                        >
                                                            Se Contacto
                                                        </th>
                                                        <th
                                                            aria-controls="zero-config"                                                          
                                                            colSpan="1"
                                                            rowSpan="1"
                                                            style={{ width: '153.82px' }}
                                                            tabIndex="0"                                                          
                                                        >
                                                            Se Agendo
                                                        </th>
                                                      
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {proximasCitas.map((proximaCita) => (
                                                        <tr key={proximaCita.ID_PACIENTE}>
                                                            <td>{proximaCita.PROXIMA_FECHA}</td> 
                                                            <td>{proximaCita.PACIENTE_NOMBRE.trim()}</td>
                                                            <td>{proximaCita.PACIENTE_EMAIL}</td>
                                                            <td>{proximaCita.PACIENTE_CELULAR}</td>
                                                            <td>{proximaCita.SUCURSAL}</td>
                                                            <td>{proximaCita.DOCTOR}</td>
                                                            <td
                                                                    onClick={() => handleContactoClick(proximaCita)}
                                                                    style={{ cursor: 'pointer' }} 
                                                                >
                                                                    {proximaCita.CONTACTO === 1 ? 'Sí' : 'No'}
                                                            </td>
                                                            <td
                                                                    onClick={() => handleAgendadoClick(proximaCita)}
                                                                    style={{ cursor: 'pointer' }}
                                                                >
                                                                    {proximaCita.SE_AGENDO === 1 ? 'Sí' : 'No'}
                                                                </td>                                                                                                                                                                                                                                                                                                      
                                                                </tr>
                                                            ))}
                                                </tbody>
                                            </table>
                                        )}

                                        <PaginationProximasCitas
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

export default ProximasCitas