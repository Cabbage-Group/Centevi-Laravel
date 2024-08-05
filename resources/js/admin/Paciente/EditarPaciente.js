import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVerPaciente } from '../../redux/features/pacientes/VerPacienteSlice';
import { fetchEditarPaciente } from '../../redux/features/pacientes/EditarPacienteSlice';
import { useParams, useNavigate, Link } from 'react-router-dom';

const formatToDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
};

const EditarPaciente = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: verPaciente } = useSelector((state) => state.verPaciente);

    const [formData, setFormData] = useState({
        sucursal: "1",
        doctor: "Dr. Elviz",
        nombres: '',
        apellidos: '',
        email: '',
        nro_cedula: '',
        nro_seguro: '',
        fecha_nacimiento: '',
        genero: '',
        lugar_nacimiento: '',
        direccion: '',
        ocupacion: '',
        telefono: '',
        celular: '',
        medico: '',
        urgencia: {
            nombre_ur: '',
            parentesco_ur: '',
            nro_ur: '',
        },
        menor: {
            responsable: '',
            parentesco: '',
            nro_celular_responsable: '',
            remitido: '',
        }
    });

    useEffect(() => {
        if (verPaciente) {
            try {
                const parsedUrgencias = verPaciente.urgencia ? JSON.parse(verPaciente.urgencia) : {};
                setUrgencias(parsedUrgencias);
            } catch (error) {
                console.error('Error parsing JSON for urgencias:', error);
            }
            try {
                const parsedMenores = verPaciente.menor ? JSON.parse(verPaciente.menor) : {};
                setMenores(parsedMenores);
            } catch (error) {
                console.error('Error parsing JSON for menores:', error);
            }
        }
    }, [verPaciente]);


    useEffect(() => {
        if (id) {
            dispatch(fetchVerPaciente(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (verPaciente) {
            setFormData({
                sucursal: verPaciente.sucursal || '',
                doctor: verPaciente.doctor || '',
                nombres: verPaciente.nombres || '',
                apellidos: verPaciente.apellidos || '',
                email: verPaciente.email || '',
                nro_cedula: verPaciente.nro_cedula || '',
                nro_seguro: verPaciente.nro_seguro || '',
                fecha_nacimiento: verPaciente.fecha_nacimiento || '',
                genero: verPaciente.genero || '',
                lugar_nacimiento: verPaciente.lugar_nacimiento || '',
                direccion: verPaciente.direccion || '',
                ocupacion: verPaciente.ocupacion || '',
                telefono: verPaciente.telefono || '',
                celular: verPaciente.celular || '',
                medico: verPaciente.medico || '',
                urgencia: verPaciente.urgencia ? JSON.parse(verPaciente.urgencia) : {},
                menor: verPaciente.menor ? JSON.parse(verPaciente.menor) : {}
            });
        }
    }, [verPaciente]);

    const handleChange = (e) => {
        const { name, value, dataset } = e.target;
    
        setFormData((prevFormData) => {
            // Check if the input belongs to "urgencia" or "menor"
            if (dataset.group === 'urgencia') {
                return {
                    ...prevFormData,
                    urgencia: {
                        ...prevFormData.urgencia,
                        [name]: value,
                    },
                };
            } else if (dataset.group === 'menor') {
                return {
                    ...prevFormData,
                    menor: {
                        ...prevFormData.menor,
                        [name]: value,
                    },
                };
            }
            // Default case for regular inputs
            return {
                ...prevFormData,
                [name]: value,
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(fetchEditarPaciente({ id, data: formData }));
        navigate(-1); // Reemplaza con la ruta a la que quieres redirigir después de actualizar
    };

    return (
        <div className="admin-data-content" style={{ marginTop: '50px' }}>
            <div className="row layout-top-spacing">
                <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
                    <div className="widget-content-area br-4">
                        <div className="widget-one">
                            <div className="row">
                                <div className="col-lg-12 layout-spacing" id="flFormsGrid" >
                                    <div className="statbox widget box box-shadow" style={{ width: '96%', left: '2%'}}>
                                        <div className="widget-header">
                                            <div className="row">
                                                <div className="col-xl-12 col-md-12 col-sm-12 col-12" style={{ left:-30}}>
                                                    <h4>Historia Paciente</h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="widget-content widget-content-area">
                                            
                                            <form method="post" role="form" onSubmit={handleSubmit}>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-6">
                                                        <p>
                                                            Creado por:{' '}
                                                            <b>{verPaciente ? verPaciente.doctor?.trim() : ''}</b>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-4">
                                                        <label className="labelBold" htmlFor="nombres">
                                                            Nombre
                                                        </label>
                                                        <input
                                                            className="form-control labelBold"
                                                            value={formData.nombres}
                                                            name="nombres"
                                                            placeholder="Nombres"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="apellidos">Apellidos</label>
                                                        <input
                                                            className="form-control labelBold"
                                                            value={formData.apellidos}
                                                            name="apellidos"
                                                            placeholder="Apellidos"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="email">Email</label>
                                                        <input
                                                            className="form-control labelBold"
                                                            value={formData.email}
                                                            name="email"
                                                            placeholder="Email"
                                                            type="email"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="nro_cedula">Nro.Cedula</label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.nro_cedula}
                                                            name="nro_cedula"
                                                            placeholder="Nro.Cedula"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="nro_seguro">Nro.Seguro Social</label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.nro_seguro}
                                                            name="nro_seguro"
                                                            placeholder="Nro.Seguro Social"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
                                                        <input
                                                            className="form-control"
                                                            value={formatToDateDisplay(formData.fecha_nacimiento)}
                                                            name="fecha_nacimiento"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="genero">Genero</label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.genero}
                                                            name="genero"
                                                            placeholder="Genero"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="lugar_nacimiento">Lugar de Nacimiento</label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.lugar_nacimiento}
                                                            name="lugar_nacimiento"
                                                            placeholder="Lugar de Nacimiento"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="direccion">Dirección</label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.direccion}
                                                            name="direccion"
                                                            placeholder="Dirección"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="ocupacion">Ocupación</label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.ocupacion}
                                                            name="ocupacion"
                                                            placeholder="Ocupación"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="telefono">Teléfono</label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.telefono}
                                                            name="telefono"
                                                            placeholder="Teléfono"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="celular">Celular</label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.celular}
                                                            name="celular"
                                                            placeholder="Celular"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="medico">Médico</label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.medico}
                                                            name="medico"
                                                            placeholder="Médico"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <h4>
                                                    EN CASO DE URGENCIA
                                                </h4>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="nombre_ur">
                                                            {' '}Nombre
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.urgencia.nombre_ur}
                                                            name="nombre_ur"
                                                            placeholder="Nombre de Contacto"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="parentesco_ur">{' '}Parentesco</label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.urgencia.parentesco_ur}
                                                            name="parentesco_ur"
                                                            placeholder="Parentesco"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="nro_ur">{' '}Número</label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.urgencia.nro_ur}
                                                            name="nro_ur"
                                                            placeholder="Número de Contacto"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <h4>Menor de Edad</h4>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="responsable">{' '}Por favor colocar el nombre del acudiente o responsable</label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.menor.responsable}
                                                            name="responsable"
                                                            placeholder="Nombre del Responsable"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="parentesco">{' '}Parentesco</label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.menor.parentesco}
                                                            name="parentesco"
                                                            placeholder="Parentesco"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="nro_celular_responsable">
                                                            {' '}Nro.Celular
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.menor.nro_celular_responsable}
                                                            name="nro_celular_responsable"
                                                            placeholder="Número de Celular del Responsable"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="urg_responsable">
                                                            {' '}Remitido Por
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.menor.remitido}
                                                            name="remitido"
                                                            placeholder="Remitido"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <button type="submit" className="btn btn-success mt-3">
                                                    Editar Paciente
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarPaciente;
