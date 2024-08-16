import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPacientes, eliminarPaciente } from '../../redux/features/pacientes/pacientesSlice.js';
import { Link } from 'react-router-dom';
import PaginationPacientes from './PaginationPacientes.js';
import Swal from 'sweetalert2';


const ListaPaciente = () => {

    const dispatch = useDispatch();
    const { meta, pacientes, status, error, totalPages, search } = useSelector((state) => state.pacientes);
    const [currentPage, setCurrentPage] = useState(1);
    const [localSearch, setLocalSearch] = useState(search);

    useEffect(() => {
        dispatch(fetchPacientes({ page: currentPage, limit: 6 ,search: localSearch}));
    }, [dispatch, currentPage,localSearch]);

    const handleSearchChange = (event) => {
        setLocalSearch(event.target.value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleEliminarPaciente = (id_paciente) => {
        // Mostrar alerta de confirmación
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Dispatch the eliminarPaciente thunk
                dispatch(eliminarPaciente(id_paciente))
                    .then(() => {
                        Swal.fire(
                            'Eliminado',
                            'El paciente ha sido eliminado.',
                            'success'
                        );
                    })
                    .catch((error) => {
                        Swal.fire(
                            'Error',
                            'Hubo un problema al eliminar el paciente.',
                            'error'
                        );
                    });
            }
        });
    };

   

    return (
        <div className="admin-data-content" style={{ marginTop: '50px' }}>
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
                                        <div className="form-row mb-4">
                                            <div
                                                className="form-group col-md-12"
                                                style={{
                                                    display: 'flex'
                                                }}
                                            >
                                                <a className="btn btn-success mb-4 ml-3 mt-4">
                                                    <Link to={"/crear-paciente"}>
                                                        Agregar Paciente
                                                    </Link>
                                                </a>
                                                <input
                                                    className="form-control txt-buscar-cedula"
                                                    name=""
                                                    placeholder="Buscar por Cedula"
                                                    
                                                    value={localSearch}
                                                    onChange={handleSearchChange}
                                                    style={{
                                                        marginTop: '16px',
                                                        width: '50%'
                                                    }}
                                                    type="search"
                                                />
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                        {status === 'loading' && <p>Loading...</p>}
                                                    {status === 'failed' && <p>Error: {error}</p>}
                                                    {status === 'succeeded' && (
                                            <table
                                                className="table dt-table-hover tabla_pacientes"
                                                id="zero-config"
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
                                                            Direccion
                                                        </th>
                                                        <th>
                                                            Fecha de creacion
                                                        </th>
                                                        <th className="text-center dt-no-sorting">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pacientes.map((paciente) => (
                                                        <tr key={paciente.id_paciente}>
                                                            <td>{`${paciente.nombres} ${paciente.apellidos}`}</td>
                                                            <td>{paciente.nro_cedula}</td>
                                                            <td>{`${paciente.direccion}, ${paciente.lugar_nacimiento}`}</td>
                                                            <td>{paciente.fecha_creacion}</td>
                                                            <td>
                                                                <div className="btn-group">


                                                                    <button
                                                                        className="btn btn-primary btnVerHistoria"
                                                                        data-target="hitoriapaciente"
                                                                        data-toggle="modal"
                                                                        
                                                                    >
                                                                        <Link to={`/historia-paciente/${paciente.id_paciente}`}>
                                                                            <svg
                                                                                className="h-6 w-6"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                viewBox="0 0 24 24"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                            >
                                                                                <path
                                                                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth="2"
                                                                                />
                                                                            </svg>
                                                                        </Link>
                                                                    </button>

                                                                    <button
                                                                        className="btn btn-warning btnEditarPaciente"
                                                                        data-target="#modalEditarUsuario"
                                                                        data-toggle="modal"
                                                                        id_paciente="1"
                                                                    >
                                                                        <Link to={`/editar-paciente/${paciente.id_paciente}`}>
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
                                                                        </Link>
                                                                    </button>
                                                                    <button
                                                                        borrar_paciente="1"
                                                                        className="btn btn-danger btnEliminarPaciente"
                                                                        onClick={() => handleEliminarPaciente(paciente.id_paciente)}
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
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <th>
                                                            Nombres de Paciente
                                                        </th>
                                                        <th>
                                                            Cedula
                                                        </th>
                                                        <th>
                                                            Direccion
                                                        </th>
                                                        <th>
                                                            Fecha de creacion
                                                        </th>
                                                        <th className="text-center dt-no-sorting">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                            )}
                                        </div>
                                        
                                        <PaginationPacientes
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

export default ListaPaciente