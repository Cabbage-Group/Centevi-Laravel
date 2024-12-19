import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { eliminarRecetas } from '../../redux/features/recetas/eliminarRecetasSlice';
import Swal from 'sweetalert2';
import { deleteOrdenes, fecthOrdenes, setOrden, setOrdenPor, updateOrden } from '../../redux/features/ordenes/ordenesSlice';
import PaginationOrdenes from './PaginationOrdenes';
import dayjs from 'dayjs';
import { Button, Tooltip,Select } from 'antd';


const VerOrdenes = () => {
  const dispatch = useDispatch();
  const { 
    ordenes, 
    status, 
    error, 
    meta,
    search, 
    totalPages, 
    sortColumn, 
    sortOrder } = useSelector((state) => state.ordenes);

  const [currentPage, setCurrentPage] = useState(1);
  const [localSearch, setLocalSearch] = useState(search);
  const [lenteContactoFilter, setLenteContactoFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(fecthOrdenes({ 
      page: currentPage, 
      limit: 20, 
      sortColumn, 
      sortOrder,
      search: localSearch,
      lenteContacto: lenteContactoFilter,
      status: statusFilter,
    }));
  }, [dispatch, currentPage, sortColumn, sortOrder,localSearch,lenteContactoFilter,statusFilter]);

  const handleSort = (newOrdenPor) => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setOrden(newOrder));
    dispatch(setOrdenPor(newOrdenPor));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    setLocalSearch(event.target.value);
  };
  const handleClearSearch = () => {
    setLocalSearch('');
  };
  const handlePagoToggle = async (id_orden, data, nro_orden) => {
    try {

      const payload = {
        pagado: !data,
        nro_orden,
      };
      await dispatch(updateOrden({ id_orden, data: payload })).unwrap();
      dispatch(fecthOrdenes({ page: currentPage, limit: 20, sortOrder, sortColumn }));
    } catch (err) {
      console.error('Error al actualizar el estado de pagado:', err);
    }
  };

  


  const handleEliminarOrden = async (id_orden) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás recuperar esta orden después de eliminarla!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await dispatch(deleteOrdenes(id_orden));
        dispatch(fecthOrdenes({ page: currentPage, limit: 20, sortOrder, sortColumn }));

        Swal.fire(
          'Eliminado!',
          'La orden ha sido eliminada.',
          'success'
        );
      }
    } catch (error) {
      Swal.fire(
        'Error',
        'Hubo un problema al eliminar la orden.',
        'error'
      );
    }
  };

  const handleLenteContactoToggle = () => {
    // Cycle through filter states: '' -> '1' -> '0'
    setLenteContactoFilter(prev => 
      prev === '' ? '1' : 
      prev === '1' ? '0' : 
      ''
    );
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
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
                  <Link to={"/create-orden"} className="btn btn-success ml-3 mt-4">
                    Agregar Orden
                  </Link>
                  {/* Lente de Contacto Filter Button */}
                  <div className="d-flex align-items-center mr-3">
                  <label className="mr-2 mb-0 font-weight-bold">Filtrar por Tipo de lente</label>
                  <button 
                      onClick={handleLenteContactoToggle}
                      className="btn btn-outline-primary position-relative"
                      style={{ width: '100px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                      {lenteContactoFilter === '' && (
                        <div className="d-flex justify-content-between w-100">
                          <img 
                            src="assets/img/recetas/lentesdecontacto.png" 
                            alt="Lente On" 
                            style={{ width: '45%', height: '100%', objectFit: 'contain' }}
                          />
                          <img 
                            src="assets/img/recetas/lentenormal.png" 
                            alt="Lente Off" 
                            style={{ width: '45%', height: '100%', objectFit: 'contain' }}
                          />
                        </div>
                      )}
                      
                      {lenteContactoFilter === '1' && (
                        <div className="d-flex justify-content-center w-100">
                          <img 
                            src="assets/img/recetas/lentesdecontacto.png" 
                            alt="Lente On" 
                            style={{ width: '70%', height: '100%', objectFit: 'contain' }}
                          />
                        </div>
                      )}
                      
                      {lenteContactoFilter === '0' && (
                        <div className="d-flex justify-content-center w-100">
                          <img 
                            src="assets/img/recetas/lentenormal.png" 
                            alt="Lente Off" 
                            style={{ width: '70%', height: '100%', objectFit: 'contain' }}
                          />
                        </div>
                      )}
                    </button>
                    <div className="d-flex align-items-center">
                    <label className="mr-2 mb-0 font-weight-bold">Filtrar por Status</label>
                   <Select
                      style={{ width: 200 }}
                      placeholder="Filtrar por Status"
                      onChange={handleStatusChange}
                      value={statusFilter || undefined}
                      allowClear
                    >
                      <Select.Option value="">Todos</Select.Option>
                      <Select.Option value="Ok">Ok</Select.Option>
                      <Select.Option value="Advertencia">Advertencia</Select.Option>
                      <Select.Option value="Critico">Critico</Select.Option>
                      <Select.Option value="null">Sin Status</Select.Option>
                    </Select>
                    </div>  
                    </div>

                  <div
                    className="dataTables_wrapper container-fluid dt-bootstrap4"
                    id="zero-config_wrapper"
                  >
                    <div className="dt--top-section">
                    <div className="row">
                      <div className="col-sm-12 col-md-6 d-flex justify-content-md-start justify-content-center">                    
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
                                aria-label={`Nro_Orden: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                aria-sort="descending"
                                className="sorting_desc"
                                colSpan="1"
                                rowSpan="1"
                                style={{
                                  width: '527px'
                                }}
                                tabIndex="0"
                                onClick={() => handleSort('Nro_Orden')}
                              >
                                Nro_Orden
                              </th>
                              <th
                                style={{
                                  width: '800px'
                                }}>
                                Pagado
                              </th>
                              <th
                                aria-controls="zero-config"
                                aria-label={`created_at: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                className="sorting"
                                colSpan="1"
                                rowSpan="1"
                                style={{
                                  width: '299px'
                                }}
                                tabIndex="0"
                                onClick={() => handleSort('created_at')}
                              >
                                Fecha de creacion
                              </th>
                              <th
                                aria-controls="zero-config"
                                aria-label={`Nombre: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                aria-sort="descending"
                                className="sorting_desc"
                                colSpan="1"
                                rowSpan="1"
                                style={{
                                  width: '527px'
                                }}
                                tabIndex="0"
                                onClick={() => handleSort('PACIENTE_NOMBRE')}
                              >
                                Sucursal
                              </th>
                              <th
                                aria-controls="zero-config"
                                aria-label={`Doctor: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                className="sorting"
                                colSpan="1"
                                rowSpan="1"
                                style={{
                                  width: '266px'
                                }}
                                tabIndex="0"
                                onClick={() => handleSort('DOCTOR')}
                              >
                                Paciente
                              </th>
                              <th
                                aria-controls="zero-config"
                                aria-label={`Doctor: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                className="sorting"
                                colSpan="1"
                                rowSpan="1"
                                style={{
                                  width: '266px'
                                }}
                                tabIndex="0"
                                onClick={() => handleSort('DOCTOR')}
                              >
                                Celular
                              </th>
                              <th
                                aria-controls="zero-config"
                                aria-label={`Doctor: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                className="sorting"
                                colSpan="1"
                                rowSpan="1"
                                style={{
                                  width: '266px'
                                }}
                                tabIndex="0"
                                onClick={() => handleSort('DOCTOR')}
                              >
                                Laboratorio
                              </th>
                              <th
                                aria-controls="zero-config"
                                aria-label={`Doctor: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                className="sorting"
                                colSpan="1"
                                rowSpan="1"
                                style={{
                                  width: '266px'
                                }}
                                tabIndex="0"
                                onClick={() => handleSort('DOCTOR')}
                              >
                                Fase
                              </th>
                              <th
                                aria-controls="zero-config"
                                aria-label={`Doctor: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                className="sorting"
                                colSpan="1"
                                rowSpan="1"
                                style={{
                                  width: '266px'
                                }}
                                tabIndex="0"
                                onClick={() => handleSort('DOCTOR')}
                              >
                                Status
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
                            {ordenes.map((orden) => (
                              <tr key={orden.id_orden}>
                                 <td style={{ display: 'flex', alignItems: 'center' }}>
                                  {orden.nro_orden}
                                  {orden.lente_contacto ? (
                                    <img
                                      src="assets/img/recetas/lentesdecontacto.png" 
                                      alt="Lente Contacto True"
                                      style={{ width: '20px', marginLeft: '8px' }}
                                    />
                                  ) : (
                                    <img
                                      src="assets/img/recetas/lentenormal.png" 
                                      alt="Lente Contacto False"
                                      style={{ width: '20px', marginLeft: '8px' }}
                                    />
                                  )}
                                </td>
                                <td>
                                  <button
                                    className={`btn btn-xs ${orden.pagado ? 'btn-success' : 'btn-danger'}`}
                                    onClick={() => handlePagoToggle(orden.id_orden, orden.pagado, orden.nro_orden)}
                                    style={{ minWidth: '100px' }}
                                  >
                                    {orden.pagado ? 'Pagado' : 'Sin Pago'}
                                  </button>
                                </td>
                                <td>{dayjs(orden.created_at).format('DD/MM/YYYY')}</td>
                                <td>{orden?.sucursal?.nombre || ""}</td>
                                <td>{
                                  orden?.paciente?.nombres + " " + orden?.paciente?.apellidos
                                }</td>
                                <td>{orden?.paciente?.celular || ""}</td>
                                <td>{orden?.laboratorio || ""}</td>
                                <td>{orden?.fase_actual || ""}</td>
                                <td>
                                  <Tooltip title={orden?.status ?? ""}>
                                  <span
                                    style={{
                                      display: 'inline-block',
                                      width: '12px',
                                      height: '12px',
                                      borderRadius: '50%',
                                      backgroundColor:
                                         orden?.status === 'Ok'
                                          ? 'green'
                                          : orden?.status  === 'Advertencia'
                                          ? 'yellow'
                                          : orden?.status  === 'Critico'
                                          ? 'red'
                                          : 'gray',
                                    }}
                                  ></span>{" "}
                                  </Tooltip>
                                </td>
                                <td >
                                  <div className="btn-group">

                                    <Link
                                      to={`/orden-receta/${orden.id_orden}`}
                                      className="btn btn-warning btnEditarReceta"
                                      state={{ orden }}
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
                                      onClick={() => handleEliminarOrden(orden.id_orden)}
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
                                Nro_Orden
                              </th>
                              <th
                                colSpan="1"
                                rowSpan="1"
                              >
                                Pagado
                              </th>
                              <th
                                colSpan="1"
                                rowSpan="1"
                              >
                                Fecha de ingreso
                              </th>
                              <th
                                colSpan="1"
                                rowSpan="1"
                              >
                                Sucursal
                              </th>
                              <th
                                colSpan="1"
                                rowSpan="1"
                              >
                                Paciente
                              </th>
                              <th
                                colSpan="1"
                                rowSpan="1"
                              >
                                Celular
                              </th>
                              <th
                                colSpan="1"
                                rowSpan="1"
                              >
                                Laboratorio
                              </th>
                              <th
                                colSpan="1"
                                rowSpan="1"
                              >
                                Fase
                              </th>
                              <th
                                colSpan="1"
                                rowSpan="1"
                              >
                                Status
                              </th>
                              <th
                                colSpan="1"
                                rowSpan="1"
                              >
                                Action
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
                      <PaginationOrdenes
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

export default VerOrdenes