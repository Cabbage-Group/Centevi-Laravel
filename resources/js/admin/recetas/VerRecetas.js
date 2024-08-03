import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { fecthRecetas } from '../../redux/features/recetas/recetasSlice';
import PaginationRecetas from '../reportes/PaginationRecetas';
import { eliminarRecetas } from '../../redux/features/recetas/eliminarRecetasSlice';
import Swal from 'sweetalert2';

const VerRecetas = () => {
    const dispatch = useDispatch();
    const { recetas, status, error, meta, totalPages, orden, ordenPor } = useSelector((state) => state.recetas);

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {

        dispatch(fecthRecetas({ page: currentPage, limit: 7, orden, ordenPor }));
    }, [dispatch, currentPage, orden, ordenPor]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleEliminarReceta = async (id_receta) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "¡No podrás recuperar esta receta después de eliminarla!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });
    
            if (result.isConfirmed) {
                await dispatch(eliminarRecetas(id_receta));
                dispatch(fecthRecetas({ page: currentPage, limit: 7, orden, ordenPor }));
                
                Swal.fire(
                    'Eliminado!',
                    'La receta ha sido eliminada.',
                    'success'
                );
            }
        } catch (error) {
            Swal.fire(
                'Error',
                'Hubo un problema al eliminar la receta.',
                'error'
            );
        }
    };
    
    
    

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
                                            {status === 'loading' && <p>Loading...</p>}
                                            {status === 'failed' && <p>Error: {error}</p>}
                                            {status === 'succeeded' && (
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
                                                        {recetas.map((receta) => (
                                                            <tr key={receta.ID_PACIENTE}>
                                                                <td>{`${receta.PACIENTE_NOMBRE.trim()} ${receta.PACIENTE_APELLIDO.trim()}`}</td>
                                                                <td>{receta.DOCTOR}</td>
                                                                <td>{receta.FECHA_ATENCION}</td>
                                                                <td>
                                                                    <div className="btn-group">
                                                                    <Link to={`/select-receta/${receta.ID_RECETA}`}
                                                                            className="btnVerReceta btn btn-primary mb-2 p-1 mr-2 rounded-circle"
                                                                            
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
                                                                            </Link>
                                                                        <Link to={`/editar-receta/${receta.ID_RECETA}`}
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
                                                                        </Link>
                                                                        <button
                                                                            onClick={() => handleEliminarReceta(receta.ID_RECETA)} 
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
                                                        ))}



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
                                            )}

                                            <PaginationRecetas
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
        </div>
    )
}

export default VerRecetas