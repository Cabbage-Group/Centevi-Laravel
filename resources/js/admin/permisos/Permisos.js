import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPermisos, createOrUpdatePermisosUsuario, createPermisos } from '../../redux/features/permisos/PermisosSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { createTiposPermisos, fetchTiposPermisos } from '../../redux/features/tipos-permisos/TiposPermisosSlice';

const Permisos = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { permisos, status } = useSelector((state) => state.permisos);
    const { tiposPermisos } = useSelector((state) => state.tiposPermisos);

    console.log('tiposPermisos:',tiposPermisos)

    const [selectedPermisos, setSelectedPermisos] = useState({});
    const [showModal, setShowModal] = useState(false); // Para mostrar/ocultar el modal
    const [showTipoPermisoModal, setShowTipoPermisoModal] = useState(false); // Modal para agregar tipo de permiso
    const [newPermiso, setNewPermiso] = useState({
        tipo_permiso_id: '',
        slug: '',
        ruta: '',
        descripcion: ''
    });

    const [newTipoPermiso, setNewTipoPermiso] = useState({ tipo: '' }); // Estado para nuevo tipo de permiso


    useEffect(() => {
        dispatch(fetchPermisos(id));
        dispatch(fetchTiposPermisos());
    }, [dispatch, id]);

    useEffect(() => {
        const initialSelected = {};
        permisos.forEach(tipo => {
            tipo.permisos.forEach(permiso => {
                initialSelected[permiso.id] = permiso.seleccionado;
            });
        });
        setSelectedPermisos(initialSelected);
    }, [permisos]);

    const handleCheckboxChange = (permisoId) => {
        setSelectedPermisos(prevState => ({
            ...prevState,
            [permisoId]: !prevState[permisoId]
        }));
    };

    const handleInputChange = (e) => {
        setNewPermiso({
            ...newPermiso,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmitNewPermiso = async () => {
        try {

            await dispatch(createPermisos(newPermiso)).unwrap();

            dispatch(fetchPermisos(id));
    
            setNewPermiso({
                tipo_permiso_id: '',
                slug: '',
                ruta: '',
                descripcion: ''
            });
            setShowModal(false);
        } catch (error) {
            console.error('Error al crear el permiso:', error);
        }
    };

    const handleSubmit = () => {
        const permisoIds = Object.keys(selectedPermisos)
            .filter(permisoId => selectedPermisos[permisoId])
            .map(permisoId => parseInt(permisoId));

        const data = {
            permiso_id: permisoIds,
            tipo_usuario_id: id,
        };

        dispatch(createOrUpdatePermisosUsuario(data));    
    };

    const handleSubmitNewTipoPermiso = async () => {
        try {

            await dispatch(createTiposPermisos(newTipoPermiso)).unwrap();

            dispatch(fetchTiposPermisos());

            dispatch(fetchPermisos(id));
    
            setNewTipoPermiso({ tipo: '' });
            setShowTipoPermisoModal(false);
        } catch (error) {
            console.error('Error al crear tipo de permiso:', error);
        }
    };

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="row layout-top-spacing">
            
            <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
                
                <div className="widget-content-area br-4">
                     {/* Botones para agregar permisos y tipos de permisos */}
                     <div className="mb-3">
                        <button className="btn btn-success mt-3" onClick={() => setShowModal(true)}>
                            Agregar Permiso
                        </button>
                        <button className="btn btn-info mt-3" onClick={() => setShowTipoPermisoModal(true)}>
                            Agregar Tipo de Permiso
                        </button>
                        <button className="btn btn-primary mt-3" onClick={handleSubmit}>
                            Guardar Permisos
                        </button>
                        <button className="btn btn-secondary mt-3" onClick={goBack}>
                            Volver
                        </button>
                    </div>
                    {permisos.map(tipo => (
                        <div key={tipo.id} className="mb-3">
                            <h5
                                className="btn btn-link"
                                data-toggle="collapse"
                                data-target={`#tipo-${tipo.id}`}
                                aria-expanded="false"
                                aria-controls={`tipo-${tipo.id}`}
                            >
                                {tipo.tipo_permiso}
                            </h5>
                            <div className="collapse" id={`tipo-${tipo.id}`}>
                                <div className="card card-body">
                                    {tipo.permisos.map(permiso => (
                                        <div key={permiso.id} className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id={`permiso-${permiso.id}`}
                                                checked={selectedPermisos[permiso.id] || false}
                                                onChange={() => handleCheckboxChange(permiso.id)}
                                            />
                                            <label className="form-check-label" htmlFor={`permiso-${permiso.id}`}>
                                                {permiso.permiso}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                  

                    {showModal && (
                        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Agregar Nuevo Permiso</h5>
                                        <button type="button" className="close" onClick={() => setShowModal(false)}>
                                            <span>&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label htmlFor="tipo_permiso_id">Tipo de Permiso</label>
                                            <select
                                                className="form-control"
                                                id="tipo_permiso_id"
                                                value={newPermiso.tipo_permiso_id}
                                                onChange={(e) =>
                                                    setNewPermiso({ ...newPermiso, tipo_permiso_id: e.target.value })
                                                }
                                            >
                                                <option value="">Seleccione un tipo</option>
                                                {tiposPermisos.map((tipo) => (
                                                    <option key={tipo.id} value={tipo.id}>
                                                        {tipo.tipo}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Slug</label>
                                            <input
                                                type="text"
                                                name="slug"
                                                className="form-control"
                                                value={newPermiso.slug}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Ruta</label>
                                            <input
                                                type="text"
                                                name="ruta"
                                                className="form-control"
                                                value={newPermiso.ruta}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Descripción</label>
                                            <input
                                                type="text"
                                                name="descripcion"
                                                className="form-control"
                                                value={newPermiso.descripcion}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                            Cerrar
                                        </button>
                                        <button type="button" className="btn btn-primary" onClick={handleSubmitNewPermiso}>
                                            Guardar Permiso
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Modal para agregar nuevo tipo de permiso */}
                    {showTipoPermisoModal && (
                        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Agregar Tipo de Permiso</h5>
                                        <button type="button" className="close" onClick={() => setShowTipoPermisoModal(false)}>
                                            <span>&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label>Tipo</label>
                                            <input
                                                type="text"
                                                name="tipo"
                                                className="form-control"
                                                value={newTipoPermiso.tipo}
                                                onChange={(e) =>
                                                    setNewTipoPermiso({ ...newTipoPermiso, tipo: e.target.value })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowTipoPermisoModal(false)}>
                                            Cerrar
                                        </button>
                                        <button type="button" className="btn btn-primary" onClick={handleSubmitNewTipoPermiso}>
                                            Guardar Tipo de Permiso
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Permisos;
