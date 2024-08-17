import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSucursales, deleteSucursal,createSucursal, updateSucursal } from '../../redux/features/sucursales/sucursalesSlice';
import PaginationSucursales from './PaginationSucursales';
import Swal from 'sweetalert2';


const Sucursales = () => {
    const dispatch = useDispatch();
    const { sucursales, meta, status, error,totalPages, search  } = useSelector((state) => state.sucursales);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedSucursal, setSelectedSucursal] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [localSearch, setLocalSearch] = useState(search);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortColumn, setSortColumn] = useState('nombre');

    const [formValues, setFormValues] = useState({
        nombre: '',
        ubicacion: '',
       
    });

   


    useEffect(() => {
        if (selectedSucursal && isEditMode) {
            setFormValues({
                nombre: selectedSucursal.nombre || '',
                ubicacion: selectedSucursal.ubicacion || '',
                

            });
        } else {
            setFormValues({
                nombre: '',
                ubicacion: ''
            });
        }
    }, [selectedSucursal, isEditMode]);

    useEffect(() => {
        dispatch(fetchSucursales({}));

    }, [dispatch, currentPage]);

    useEffect(() => {
        dispatch(fetchSucursales({ page: currentPage, limit: 7, search: localSearch ,sortColumn,
            sortOrder, }));
    }, [dispatch,localSearch, currentPage, sortColumn, sortOrder]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (event) => {
        setLocalSearch(event.target.value);
    };

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    const handleEditClick = (sucursal) => {
        setSelectedSucursal(sucursal);
        setIsEditMode(true);
        setIsModalVisible(true);
    };


    const handleCreateClick = () => {
        setSelectedSucursal(null);
        setIsEditMode(false);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedSucursal(null);
        setFile(null);
    };


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormValues({
            ...formValues,
            [name]: value,

        });

    };
    const handleClearSearch = () => {
        setLocalSearch('');
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const newSucursalData = {
            nombre: formValues.nombre,
            ubicacion: formValues.ubicacion,
        };

        if (isEditMode && selectedSucursal) {

            dispatch(updateSucursal({ id: selectedSucursal.id_sucursal, updatedData: formValues }))
            .then(() => {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Sucursal actualizada correctamente.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    didClose: () => {
                        window.location.reload();
                    }
                });
                setIsModalVisible(false);
                setIsEditMode(false);
                setSelectedSucursal(null);
                dispatch(fetchSucursales({ page: currentPage })); 
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.message || 'Hubo un problema al actualizar la sucursal.';
                Swal.fire({
                    title: '¡Error!',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            });
        }else{

        dispatch(createSucursal(newSucursalData))
                .then(() => {
                    Swal.fire({
                        title: 'Éxito!',
                        text: 'Sucursal creado correctamente.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        didClose: () => {
                            window.location.reload();
                        }
                       

                    });
                })
                .catch((error) => {
                    const errorMessage = error.response?.data?.message || 'Hubo un problema al crear la sucursal.';
                    Swal.fire({
                        title: 'Error!',
                        text: errorMessage,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
            });
        }
    }

    const handleDeleteClick = (sucursal) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas eliminar la sucursal ${sucursal.nombre}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {

                dispatch(deleteSucursal(sucursal.id_sucursal))

                    .then(() => {
                        Swal.fire({
                            title: 'Eliminado!',
                            text: 'Sucursal eliminada correctamente.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });

                        if (sucursales.length === 1 && currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                        } else {
                            dispatch(fetchSucursales({ page: currentPage, limit: 7 }));
                        }
                    })
                    .catch((error) => {
                        const errorMessage = error.response?.data?.message || 'Hubo un problema al actualizar la sucursal.';
                        Swal.fire({
                            title: 'Error!',
                            text: errorMessage,
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    });
            }
        });
    };

    return (
        <div className="admin-data-content" style={{ marginTop: 50, }}>
            <div className="row layout-top-spacing">
                <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
                    <div className="widget-content-area br-4">
                        <div className="widget-one">
                            <div className="row layout-top-spacing" id="cancel-row">
                                <div className="col-xl-12 col-lg-12 col-sm-12  layout-spacing">
                                    <div className="widget-content widget-content-area br-6">
                                        <button 
                                        className="btn btn-success mb-4 ml-3 mt-4" 
                                        data-toggle="modal" 
                                        data-target="#modalAgregarSucursal"
                                        onClick={handleCreateClick}
                                       
                                        >
                                            Agregar Sucursal
                                        </button>
                                        <div id="zero-config_wrapper" className="dataTables_wrapper container-fluid dt-bootstrap4">
                                            <div className="dt--top-section">
                                                <div className="row">
                                                    <div className="col-12 col-sm-6 d-flex justify-content-sm-start justify-content-center">
                                                        <div className="dataTables_length" id="zero-config_length">
                                                            <label>Results :
                                                                <select name="zero-config_length" aria-controls="zero-config" className="form-control">
                                                                    <option value="7">7</option>
                                                                    <option value="10">10</option>
                                                                    <option value="20">20</option>
                                                                    <option value="50">50</option>
                                                                </select>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-sm-6 d-flex justify-content-sm-end justify-content-center mt-sm-0 mt-3">
                                                        <div id="zero-config_filter" className="dataTables_filter">
                                                            <label>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search">
                                                                    <circle cx="11" cy="11" r="8" />
                                                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                                                </svg>
                                                                <input 
                                                                type="search" 
                                                                className="form-control" 
                                                                placeholder="Search..." 
                                                                aria-controls="zero-config" 
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
                                           
                                            <div 
                                            
                                            className="table-responsive">
                                               
                                                <table id="zero-config" className="table dt-table-hover tablaSucursal dataTable" style={{ width: "100%" }} role="grid" aria-describedby="zero-config_info">
                                                    <thead>
                                                        <tr role="row">
                                                            <th 
                                                            aria-label="Nombre: activate to sort column ascending"
                                                            className={`sorting_${sortColumn === 'nombre' ? sortOrder : ''}`}
                                                            tabIndex="0" 
                                                            aria-controls="zero-config"
                                                            onClick={() => handleSort('nombre')}>
                                                                Nombre Sucursal
                                                            </th>
                                                            <th 
                                                            className={`sorting_${sortColumn === 'ubicacion' ? sortOrder : ''}`}
                                                            tabIndex="0" 
                                                            aria-controls="zero-config"
                                                            onClick={() => handleSort('ubicacion')}>Ubicacion</th>
                                                            <th 
                                                            className={`sorting_${sortColumn === 'fecha_creacion' ? sortOrder : ''}`}
                                                            tabIndex="0" 
                                                            aria-controls="zero-config"
                                                            onClick={() => handleSort('fecha_creacion')}>Fecha de creacion</th>
                                                            <th className="text-center dt-no-sorting sorting" tabIndex="0" aria-controls="zero-config">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {sucursales.map((sucursal) => (
                                                            <tr key={sucursal.id_sucursal}>
                                                                <td>{sucursal.nombre}</td>
                                                                <td>{sucursal.ubicacion}</td>
                                                                <td>{sucursal.fecha_creacion}</td>
                                                                <td>
                                                                    <div className="btn-group">
                                                                        <button 
                                                                        className="btn btn-warning btnEditarSucursal" 
                                                                        id_sucursal="3" 
                                                                        data-toggle="modal" 
                                                                        data-target="#modalEditarSucursal"
                                                                        onClick={() => handleEditClick(sucursal)}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="modalEditarSucursal" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                                            </svg>
                                                                        </button>
                                                                        <button className="btn btn-danger btnEliminarSucursal" 
                                                
                                                                            onClick={() => handleDeleteClick(sucursal)}>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <th>Nombre Sucursal</th>
                                                            <th>Ubicacion</th>
                                                            <th>Estado</th>
                                                            <th>Fecha de creacion</th>
                                                            <th className="invisible"></th>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                                       
                                            </div>
                                            <PaginationSucursales
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

                {isModalVisible && (  
                <div
                    aria-hidden="true"
                    className="modal fade"
                    id="modalAgregarSucursal"

                >
                    <div
                        className="modal-dialog"
                    >
                        <div className="modal-content">
                            <form
                                encType="multipart/form-data"
                                method="post"
                                role="form"
                                onSubmit={handleFormSubmit}
                            >
                                <div
                                    className="modal-header"
                                    style={{
                                        background: '#1abc9c',
                                        color: 'white'
                                    }}
                                >
                                    <button
                                        className="close"
                                        data-dismiss="modal"
                                        type="button"
                                        onClick={handleModalClose}

                                    >
                                        ×
                                    </button>
                                    <h4 className="modal-title">
                                        Agregar Sucursal
                                    </h4>
                                </div>
                                <div className="modal-body">
                                    <div className="box-body">
                                        <div className="form-group">
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-user" />
                                                </span>
                                                <input
                                                    className="form-control input-lg"
                                                    name="nombre"
                                                    placeholder="Ingresar nombre"
                                                    required
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>                                 
                                        <div className="form-group">
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-lock" />
                                                </span>
                                                <input
                                                    className="form-control input-lg"
                                                    name="ubicacion"
                                                    placeholder="Ingresar ubicacion"
                                                    required
                                                    type="text"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>                                                                                                        
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        className="btn btn-default pull-left"
                                        data-dismiss="modal"
                                        type="button"
                                        onClick={handleModalClose}
                                    >
                                        Salir
                                    </button>
                                    <button
                                        className="btn btn-success"
                                        type="submit"
                                    >
                                        Guardar Sucursal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            )}
     {isModalVisible &&(        
                <div
                    className="modal fade show"
                    id="modalEditarSucursal"
                    role="dialog"
                >
                    <div className="modal-dialog" >
                        <div className="modal-content">

                            <form
                                encType="multipart/form-data"
                                method="post"
                                role="form"
                                onSubmit={handleFormSubmit}
                            >

                                <div
                                    className="modal-header"
                                    style={{
                                        background: '#1abc9c',
                                        color: 'white'
                                    }}
                                >
                                    <button
                                        className="close"
                                        data-dismiss="modal"
                                        type="button"
                                        onClick={handleModalClose}
                                    >
                                        ×
                                    </button>
                                    <h4 className="modal-title">
                                        Editar usuario
                                    </h4>
                                </div>
                                <div className="modal-body">
                                    <div className="box-body">
                                        <div className="form-group">
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-user" />
                                                </span>
                                                <input
                                                    className="form-control input-lg"
                                                    value={formValues?.nombre || ''}
                                                    id="editarNombre"
                                                    name="nombre"
                                                    onChange={handleChange}
                                                    required
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="form-group">
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-lock" />
                                                </span>
                                                <input
                                                    className="form-control input-lg"
                                                    value={formValues?.ubicacion || ''}
                                                    name="ubicacion"
                                                    onChange={handleChange}
                                                    type="text"
                                                />
            
                                            </div>
                                        </div>
                                        
                                        
                                        
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        className="btn btn-default pull-left"
                                        data-dismiss="modal"
                                        type="button"
                                        onClick={handleModalClose}
                                    >
                                        Salir
                                    </button>
                                    <button
                                        className="btn btn-success"
                                        type="submit"
                                    >
                                        Modificar Sucursal
                                    </button>
                                </div>
                            </form>

                        </div>

                    </div>

                </div>
                   )}                     
            </div>
        </div>
    )
}

export default Sucursales