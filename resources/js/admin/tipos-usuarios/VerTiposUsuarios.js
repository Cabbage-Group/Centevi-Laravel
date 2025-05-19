import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { createTiposUsuarios, fetchTiposUsuarios } from '../../redux/features/tipos-usuarios/verTiposUsuariosSlice';
import Swal from 'sweetalert2';
import PaginationTiposUsuarios from './PaginationTiposUsuarios';

const VerTiposUsuarios = () => {
    const dispatch = useDispatch();
    const { tiposUsuarios, status, meta, totalPages } = useSelector((state) => state.tiposUsuarios);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTiposUsuarios, setSelectedTiposUsuarios] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    console.log('tiposUsuarios:', tiposUsuarios)

    const [formValues, setFormValues] = useState({
        tipo_usuario: '',
      });

    useEffect(() => {
        dispatch(fetchTiposUsuarios({ page: currentPage, limit: 7}));

    }, [dispatch, currentPage]);

    const handlePageChange = (page) => {
      setCurrentPage(page);
    };

    useEffect(() => {
        if (selectedTiposUsuarios && isEditMode) {
          setFormValues({
            tipo_usuario: selectedTiposUsuarios.tipo_usuario || '',

    
          });
        }
      }, [selectedTiposUsuarios, isEditMode]);
    

    const handleCreateClick = () => {
        setSelectedTiposUsuarios(null);
        setIsEditMode(false);
        setIsModalVisible(true);
      };
    
      const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedTiposUsuarios(null);
      };

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
          ...formValues,
          [name]: value
        });
    
      };

      const handleFormSubmit = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('tipo_usuario', formValues.tipo_usuario);

        if (isEditMode) {
          formData.append('_method', 'PUT');
    
          for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
          }
    
          dispatch(updateUsuario({
            id_usuario: selectedUsuario.id_usuario,
            data: formData
          }))
            .then(() => {
              Swal.fire({
                title: 'Éxito!',
                text: 'Usuario actualizado correctamente.',
                icon: 'success',
                confirmButtonText: 'OK',
                didClose: () => {
                  window.location.reload();
                }
    
    
              });
            })
            .catch((error) => {
              Swal.fire({
                title: 'Error!',
                text: 'Hubo un problema al actualizar el usuario.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            });
        } else {
          dispatch(createTiposUsuarios(formData))
            .then(() => {
              Swal.fire({
                title: 'Éxito!',
                text: 'Usuario creado correctamente.',
                icon: 'success',
                confirmButtonText: 'OK',
                didClose: () => {
                  window.location.reload();
                }
    
              });
            })
            .catch((error) => {
              const errorMessage = error.response?.data?.message || 'Hubo un problema al crear el usuario.';
              Swal.fire({
                title: 'Error!',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'OK'
              });
            });
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
                                <button
                                        className="btn btn-success mt-3 ml-4"
                                        data-target="#modalAgregarUsuario"
                                        data-toggle="modal"
                                        onClick={handleCreateClick}
                                    >
                                        Agregar tipo usuario
                                    </button>

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
                                                                // aria-label={`Nombre: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
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
                                                                Tipo de Usuario
                                                            </th>
                                                            <th
                                                                aria-controls="zero-config"
                                                                // aria-label={`Doctor: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                                                                className="sorting"
                                                                colSpan="1"
                                                                rowSpan="1"
                                                                style={{
                                                                    width: '266px'
                                                                }}
                                                                tabIndex="0"
                                                                onClick={() => handleSort('DOCTOR')}
                                                            >
                                                                createdAt
                                                            </th>
                                                            <th
                                                                aria-controls="zero-config"
                                                                // aria-label={`Fecha_atencion: activate to sort column ${orden === 'desc' ? 'descending' : 'ascending'}`}
                                                                className="sorting"
                                                                colSpan="1"
                                                                rowSpan="1"
                                                                style={{
                                                                    width: '299px'
                                                                }}
                                                                tabIndex="0"
                                                                onClick={() => handleSort('fecha_creacion')}
                                                            >
                                                                updatedAt
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
                                                        {tiposUsuarios?.map((tiposusuarios) => (
                                                            <tr key={tiposusuarios.id}>
                                                                <td>{`${tiposusuarios.tipo_usuario.trim()}`}</td>
                                                                <td>{tiposusuarios.created_at ? new Date(tiposusuarios.created_at).toLocaleString() : 'N/A'}</td>
                                                                <td>{tiposusuarios.updated_at ? new Date(tiposusuarios.updated_at).toLocaleString() : 'N/A'}</td>
                                                                <td >
                                                                <Link to={`/permisos/${tiposusuarios.id}`}>
                                                            <button
                                                                className="btn btn-warning btnEditarPaciente"
                                                                data-target="#modalEditarUsuario"
                                                                data-toggle="modal"
                                                                id_paciente="1"
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
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                />
                                                                </svg>

                                                            </button>
                                                            </Link>                                                               
                                                                </td>

                                                            </tr>
                                                        ))}

                                                    </tbody>                                                  
                                                </table>
                                            )}
                                            <PaginationTiposUsuarios
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
            {isModalVisible && (
        <div
          aria-hidden="true"
          className="modal fade"
          id="modalAgregarUsuario"

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
                    Agregar Tipo de Usuario
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
                          name="tipo_usuario"
                          placeholder="Ingresar Tipo de Usuario"
                          required
                          type="text"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="input-group">
                        <span className="input-group-addon">
                          <i className="fa fa-users" />
                        </span>
                       
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
                    Guardar tipo usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
        </div>
    )
}

export default VerTiposUsuarios