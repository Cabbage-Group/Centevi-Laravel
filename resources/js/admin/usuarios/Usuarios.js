import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsuarios, updateUsuario, deleteUsuario , updateEstadoUsuario} from '../../redux/features/usuarios/usuariosSlice.js';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice';
import PaginationUsuarios from './PaginationUsuarios.js';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';


const Usuarios = () => {

    const dispatch = useDispatch();
    const { meta, usuarios, status, error, totalPages } = useSelector((state) => state.usuarios);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const { sucursales } = useSelector((state) => state.sucursales);
    const [previewImage, setPreviewImage] = useState('');

    const [formValues, setFormValues] = useState({
        nombre: selectedUsuario?.nombre || '',
        usuario: selectedUsuario?.usuario || '',
        perfil: selectedUsuario?.perfil || '',
        sucursal: selectedUsuario?.sucursal || '',
        password: selectedUsuario?.password || ''
    });

    useEffect(() => {
        if (selectedUsuario) {
            setFormValues({
                nombre: selectedUsuario.nombre || '',
                usuario: selectedUsuario.usuario || '',
                perfil: selectedUsuario.perfil || '',
                sucursal: selectedUsuario.sucursal || '',
                password: selectedUsuario.password || ''
            });
            setPreviewImage(selectedUsuario.foto || '');
        }
    }, [selectedUsuario]);

    useEffect(() => {
        dispatch(fetchSucursales({}));

    }, [dispatch, currentPage]);

    const [sortOrder, setSortOrder] = useState('asc');
    const [sortColumn, setSortColumn] = useState('nombre'); 

    useEffect(() => {
        dispatch(fetchUsuarios({ page: currentPage, limit: 6, sortOrder, sortColumn }));
    }, [dispatch, currentPage, sortOrder, sortColumn]);



    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    const handleEditClick = (usuario) => {
        setSelectedUsuario(usuario);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedUsuario(null);
    };



    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormValues({
            ...formValues,
            [name]: value,

        });

    };

    const handleChangeEstado = async (id_usuario, estado) => {
        try {
            await dispatch(updateEstadoUsuario({ id_usuario, estado }));
        } catch (error) {
            console.error('Error updating estado:', error);
        }
    };




    const handleFormSubmit = (e) => {
        e.preventDefault();
        const formData = {
            nombre: formValues.nombre,
            usuario: formValues.usuario,
            perfil: formValues.perfil,
            sucursal: formValues.sucursal,
            password: formValues.password
        };

        console.log('formData:', formData);

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

    };

    const handleDeleteClick = (usuario) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas eliminar el usuario ${usuario.nombre}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteUsuario(usuario.id_usuario))
                    .then(() => {
                        Swal.fire({
                            title: 'Eliminado!',
                            text: 'Usuario eliminado correctamente.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });
                    })
                    .catch((error) => {
                        Swal.fire({
                            title: 'Error!',
                            text: 'Hubo un problema al eliminar el usuario.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    });
            }
        });
    };





    return (
        <div>
            <div className="admin-data-content">
                <div className="row layout-top-spacing">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
                        <div className="widget-content-area br-4">
                            <div className="widget-one">
                                <div className="row layout-top-spacing" id="cancel-row">
                                    <div className="col-xl-12 col-lg-12 col-sm-12  layout-spacing">
                                        <div className="widget-content widget-content-area br-6">
                                            <button className="btn btn-success mt-3 ml-4" data-target="#modalAgregarUsuario" data-toggle="modal">
                                                Agregar usuario
                                            </button>
                                            <div className="table-responsive">
                                                <div className="dataTables_wrapper container-fluid dt-bootstrap4" id="zero-config_wrapper">
                                                    <div className="table-responsive">
                                                        <div className="col-12 col-sm-6 mt-sm-10 mt-3">
                                                            <div className="dataTables_filter" id="zero-config_filter">
                                                                <label>
                                                                    <svg className="feather feather-search" fill="none" height="24" stroke="currentColor" strokeLinecap="round"
                                                                        strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <circle cx="11" cy="11" r="8" />
                                                                        <line x1="21" x2="16.65" y1="21" y2="16.65" />
                                                                    </svg>
                                                                    <input aria-controls="zero-config" className="form-control" placeholder="Search..." type="search" />
                                                                </label>
                                                            </div>
                                                        </div>
                                                        {status === 'loading' && (
                                                            <div>Loading...</div>
                                                        )}
                                                        {status === 'failed' && (
                                                            <div>Error: {error}</div>
                                                        )}
                                                        {status === 'succeeded' && (
                                                            <table
                                                                aria-describedby="zero-config_info"
                                                                className="table dt-table-hover tablas dataTable"
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
                                                                            aria-label="#: activate to sort column descending"
                                                                            aria-sort="ascending"
                                                                            colSpan="1"
                                                                            rowSpan="1"
                                                                            style={{
                                                                                width: '10.5234px'
                                                                            }}
                                                                            tabIndex="0"
                                                                        >
                                                                            #
                                                                        </th>
                                                                        <th
                                                                            aria-controls="zero-config"
                                                                            aria-label="Nombre: activate to sort column ascending"
                                                                            className={`sorting_${sortColumn === 'nombre' ? sortOrder : ''}`}
                                                                            colSpan="1"
                                                                            rowSpan="1"
                                                                            style={{
                                                                                width: '153.82px',
                                                                                cursor: 'pointer'
                                                                            }}
                                                                            tabIndex="0"
                                                                            onClick={() => handleSort('nombre')}
                                                                        >
                                                                            Nombre
                                                                        </th>
                                                                        <th
                                                                            aria-controls="zero-config"
                                                                            aria-label="Usuario: activate to sort column ascending"
                                                                            className={`sorting_${sortColumn === 'usuario' ? sortOrder : ''}`}
                                                                            colSpan="1"
                                                                            rowSpan="1"
                                                                            style={{
                                                                                width: '78.1406px',
                                                                                cursor: 'pointer'
                                                                            }}
                                                                            tabIndex="0"
                                                                            onClick={() => handleSort('usuario')}
                                                                        >
                                                                            Usuario
                                                                        </th>
                                                                        <th
                                                                            aria-controls="zero-config"
                                                                            aria-label="Foto: activate to sort column ascending"

                                                                            colSpan="1"
                                                                            rowSpan="1"
                                                                            style={{
                                                                                width: '34.2891px'
                                                                            }}
                                                                            tabIndex="0"
                                                                        >
                                                                            Foto
                                                                        </th>
                                                                        <th
                                                                            aria-controls="zero-config"
                                                                            aria-label="Perfil: activate to sort column ascending"
                                                                            className={`sorting_${sortColumn === 'perfil' ? sortOrder : ''}`}
                                                                            colSpan="1"
                                                                            rowSpan="1"
                                                                            style={{
                                                                                width: '115.477px',
                                                                                cursor: 'pointer'
                                                                            }}
                                                                            tabIndex="0"
                                                                            onClick={() => handleSort('perfil')}
                                                                        >
                                                                            Perfil
                                                                        </th>
                                                                        <th
                                                                            aria-controls="zero-config"
                                                                            aria-label="Estado: activate to sort column ascending"

                                                                            colSpan="1"
                                                                            rowSpan="1"
                                                                            style={{
                                                                                width: '120px'
                                                                            }}
                                                                            tabIndex="0"
                                                                        >
                                                                            Estado
                                                                        </th>
                                                                        <th
                                                                            aria-controls="zero-config"
                                                                            aria-label="Último login: activate to sort column ascending"

                                                                            colSpan="1"
                                                                            rowSpan="1"
                                                                            style={{
                                                                                width: '123.68px'
                                                                            }}
                                                                            tabIndex="0"
                                                                        >
                                                                            Último login
                                                                        </th>
                                                                        <th
                                                                            aria-controls="zero-config"
                                                                            aria-label="Acciones: activate to sort column ascending"

                                                                            colSpan="1"
                                                                            rowSpan="1"
                                                                            style={{
                                                                                width: '101.953px'
                                                                            }}
                                                                            tabIndex="0"
                                                                        >
                                                                            Acciones
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {usuarios.map((usuario) => (
                                                                        <tr key={usuario.id_usuario}>
                                                                            <td className="sorting_1">{usuario.id_usuario}</td>
                                                                            <td>{usuario.nombre}</td>
                                                                            <td>{usuario.usuario}</td>
                                                                            <td>
                                                                                <img
                                                                                    className="img-thumbnail"
                                                                                    src={`vistas/img/usuarios/${usuario.usuario}/912.jpg`}
                                                                                    width="40px"
                                                                                    alt={`${usuario.nombre} - Foto`}
                                                                                />
                                                                            </td>
                                                                            <td>{usuario.perfil}</td>
                                                                            <td>
                                                                                <button
                                                                                    className={`btn btn-${usuario.estado === 1 ? 'success' : 'danger'} btn-xs`}
                                                                                    onClick={() => handleChangeEstado(usuario.id_usuario, usuario.estado === 1 ? 0 : 1)}
                                                                                >
                                                                                    {usuario.estado === 1 ? 'Activado' : 'Desactivado'}
                                                                                </button>
                                                                            </td>
                                                                            <td>{usuario.ultimo_login}</td>
                                                                            <td>
                                                                                <div className="btn-group">
                                                                                    <button
                                                                                        onClick={() => handleEditClick(usuario)}
                                                                                        className="btn btn-warning btnEditarUsuario"
                                                                                        data-toggle="modal"
                                                                                        data-target="#modalEditarUsuario"

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
                                                                                    <button
                                                                                        className="btn btn-danger btnEliminarUsuario"
                                                                                        fotousuario={`vistas/img/usuarios/${usuario.usuario}/912.jpg`}
                                                                                        idusuario={usuario.id_usuario}
                                                                                        usuario={usuario.usuario}
                                                                                        onClick={() => handleDeleteClick(usuario)}
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
                                                                            style={{
                                                                                width: '10px'
                                                                            }}
                                                                        >
                                                                            #
                                                                        </th>
                                                                        <th
                                                                            colSpan="1"
                                                                            rowSpan="1"
                                                                        >
                                                                            Nombre
                                                                        </th>
                                                                        <th
                                                                            colSpan="1"
                                                                            rowSpan="1"
                                                                        >
                                                                            Usuario
                                                                        </th>
                                                                        <th
                                                                            colSpan="1"
                                                                            rowSpan="1"
                                                                        >
                                                                            Foto
                                                                        </th>
                                                                        <th
                                                                            colSpan="1"
                                                                            rowSpan="1"
                                                                        >
                                                                            Perfil
                                                                        </th>
                                                                        <th
                                                                            colSpan="1"
                                                                            rowSpan="1"
                                                                        >
                                                                            Estado
                                                                        </th>
                                                                        <th
                                                                            colSpan="1"
                                                                            rowSpan="1"
                                                                        >
                                                                            Último login
                                                                        </th>
                                                                        <th
                                                                            colSpan="1"
                                                                            rowSpan="1"
                                                                        >
                                                                            Acciones
                                                                        </th>
                                                                    </tr>
                                                                </tfoot>
                                                            </table>
                                                        )}
                                                    </div>
                                                    <PaginationUsuarios
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
            </div>
            <div
                aria-hidden="true"
                className="modal fade"
                id="modalAgregarUsuario"
                style={{
                    display: 'none'
                }}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form
                            encType="multipart/form-data"
                            method="post"
                            role="form"
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

                                >
                                    ×
                                </button>
                                <h4 className="modal-title">
                                    Agregar usuario
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
                                                name="nuevoNombre"
                                                placeholder="Ingresar nombre"
                                                required
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-key" />
                                            </span>
                                            <input
                                                className="form-control input-lg"
                                                id="nuevoUsuario"
                                                name="nuevoUsuario"
                                                placeholder="Ingresar usuario"
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
                                                name="nuevoPassword"
                                                placeholder="Ingresar contraseña"
                                                required
                                                type="password"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-users" />
                                            </span>
                                            <select
                                                className="form-control input-lg"
                                                name="nuevoPerfil"
                                            >
                                                <option value="">
                                                    Selecionar perfil
                                                </option>
                                                <option value="superadministrador">
                                                    SuperAdministrador
                                                </option>
                                                <option value="administrador">
                                                    Administrador
                                                </option>
                                                <option value="gestor">
                                                    Gestor
                                                </option>
                                                <option value="doctor">
                                                    Doctor
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-users" />
                                            </span>
                                            <select
                                                className="form-control input-lg"
                                                name="nuevaSucursal"
                                            >
                                                <option value="">
                                                    Selecionar Sucursal
                                                </option>
                                                <option value="3">
                                                    CENTEVI Centro Médico San Judas Tadeo
                                                </option>
                                                <option value="4">
                                                    CENTEVI Consultorios Medicos Paitilla
                                                </option>
                                                <option value="5">
                                                    CENTEVI Sede Chitre
                                                </option>
                                                <option value="7">
                                                    CENTEVI El Dorado
                                                </option>
                                                <option value="8">
                                                    CENTEVI Giras Interior del Pais
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="panel">
                                            SUBIR FOTO
                                        </div>
                                        <input
                                            className="nuevaFoto"
                                            name="nuevaFoto"
                                            type="file"
                                        />
                                        <p className="help-block">
                                            Peso máximo de la foto 2MB
                                        </p>
                                        <img
                                            className="img-thumbnail previsualizar"
                                            src="vistas/img/usuarios/default/anonymous.png"
                                            width="100px"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-default pull-left"
                                    data-dismiss="modal"
                                    type="button"
                                >
                                    Salir
                                </button>
                                <button
                                    className="btn btn-success"
                                    type="submit"
                                >
                                    Guardar usuario
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {isModalVisible && selectedUsuario && (
                <div
                    className="modal fade show"
                    id="modalEditarUsuario"
                    role="dialog"
                    onClick={handleModalClose}
                >

                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
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
                                                    defaultValue={selectedUsuario?.nombre || ''}
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
                                                    <i className="fa fa-key" />
                                                </span>
                                                <input
                                                    className="form-control input-lg"
                                                    defaultValue={selectedUsuario?.usuario || ''}
                                                    id="editarUsuario"
                                                    name="editarUsuario"
                                                    onChange={handleChange}
                                                    readOnly
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
                                                    defaultValue=""
                                                    name="password"
                                                    onChange={handleChange}
                                                    placeholder="Escriba la nueva contraseña"
                                                    type="password"
                                                />
                                                <input
                                                    id="passwordActual"
                                                    name="passwordActual"
                                                    type="hidden"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-users" />
                                                </span>
                                                <select
                                                    className="form-control input-lg"
                                                    defaultValue={selectedUsuario?.perfil || ''}
                                                    name="perfil"
                                                    onChange={handleChange}
                                                >
                                                    <option
                                                        id="editarPerfil"
                                                        value=""
                                                    />
                                                    <option value="">
                                                        Selecionar perfil
                                                    </option>
                                                    <option value="superadministrador">
                                                        SuperAdministrador
                                                    </option>
                                                    <option value="administrador">
                                                        Administrador
                                                    </option>
                                                    <option value="gestor">
                                                        Gestor
                                                    </option>
                                                    <option value="doctor">
                                                        Doctor
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-users" />
                                                </span>
                                                <select
                                                    className="form-control input-lg"
                                                    defaultValue={selectedUsuario?.sucursal || ''}
                                                    id="editarSucursal"
                                                    name="sucursal"
                                                    onChange={handleChange}

                                                >
                                                    <option value={""}>Selecionar Sucursal</option>
                                                    {sucursales.map((sucursal) => (
                                                        <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                                                            {sucursal.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="panel">
                                                SUBIR FOTO
                                            </div>
                                            <input
                                                className="nuevaFoto"
                                                name="editarFoto"
                                                type="file"
                                            />
                                            <p className="help-block">
                                                Peso máximo de la foto 2MB
                                            </p>
                                            <img
                                                className="img-thumbnail previsualizarEditar"
                                                src={previewImage || selectedUsuario?.foto}
                                                width="100px"
                                            />
                                            <input
                                                id="fotoActual"
                                                name="fotoActual"
                                                type="hidden"
                                            />
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
                                        Modificar usuario
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

export default Usuarios