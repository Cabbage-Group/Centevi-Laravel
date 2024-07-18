import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSucursales } from '../../redux/features/sucursalesSlice';


const Sucursales = () => {
    const dispatch = useDispatch();
    const { sucursales, status, error } = useSelector((state) => state.sucursales);

    useEffect(() => {
        dispatch(fetchSucursales({ page: 1, limit: 50 }));
    }, [dispatch]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }
    return (
        <div className="admin-data-content" style={{ marginTop: 50, }}>
            <div className="row layout-top-spacing">
                <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
                    <div className="widget-content-area br-4">
                        <div className="widget-one">
                            <div className="row layout-top-spacing" id="cancel-row">
                                <div className="col-xl-12 col-lg-12 col-sm-12  layout-spacing">
                                    <div className="widget-content widget-content-area br-6">
                                        <button className="btn btn-success mb-4 ml-3 mt-4" data-toggle="modal" data-target="#modalAgregarSursal">
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
                                                                <input type="search" className="form-control" placeholder="Search..." aria-controls="zero-config" />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="table-responsive">
                                                <table id="zero-config" className="table dt-table-hover tablaSucursal dataTable" style={{ width: "100%" }} role="grid" aria-describedby="zero-config_info">
                                                    <thead>
                                                        <tr role="row">
                                                            <th className="sorting" tabIndex="0" aria-controls="zero-config">Nombre Sucursal</th>
                                                            <th className="sorting" tabIndex="0" aria-controls="zero-config">Ubicacion</th>
                                                            <th className="sorting" tabIndex="0" aria-controls="zero-config">Fecha de creacion</th>
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
                                                                        <button className="btn btn-warning btnEditarSucursal" id_sucursal="3" data-toggle="modal" data-target="#modalEditarSucursal">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="modalEditarSucursal" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                                            </svg>
                                                                        </button>
                                                                        <button className="btn btn-danger btnEliminarSucursal" borrar_sucursal="3">
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
                                            <div className="dt--bottom-section d-sm-flex justify-content-sm-between text-center">
                                                <div className="dt--pages-count  mb-sm-0 mb-3">
                                                    <div className="dataTables_info" id="zero-config_info" role="status" aria-live="polite"></div>
                                                </div>
                                                <div className="dt--pagination">
                                                    <div className="dataTables_paginate paging_simple_numbers" id="zero-config_paginate"></div>
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

export default Sucursales