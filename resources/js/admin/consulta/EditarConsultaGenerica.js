import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEditarConsultaGenerica } from '../../redux/features/consultas/EditarConsultaGenericaSlice.js';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice.js';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice.js';
import { fetchVerConsultaGenerica } from '../../redux/features/pacientes/VerConsultaGenericaSlice.js';

const EditarConsultaGenerica = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id, id_consulta } = useParams();
    const { pacientes } = useSelector((state) => state.pacientes);
    const { sucursales } = useSelector((state) => state.sucursales);
    const { data: consultagenerica } = useSelector((state) => state.verConsultaGenerica)

    const [formData, setFormData] = useState({
        sucursal: '',
        doctor: '',
        paciente: '',
        id_terapia: '',
        edad: '',
        fecha_atencion: '',
        m_c: '',
        fecha_creacion: '',
        editado: {
            doctor: '',
            fecha_edicion: ''
        },
    });

    useEffect(() => {
        if (consultagenerica) {
            setFormData({
                sucursal: consultagenerica.sucursal || '',
                doctor: consultagenerica.doctor || '',
                paciente: consultagenerica.paciente || '',
                id_terapia: consultagenerica.id_terapia || '',
                edad: consultagenerica.edad || '',
                fecha_atencion: consultagenerica.fecha_atencion || '',
                m_c: consultagenerica.m_c || '',
                fecha_creacion: consultagenerica.fecha_creacion || '',
                editado: consultagenerica.editado ? JSON.parse(consultagenerica.editado) : {},
            });
        }
    }, [consultagenerica]);

    useEffect(() => {
        if (id && id_consulta) {
            dispatch(fetchVerConsultaGenerica({ id, id_consulta }));
            dispatch(fetchSucursales({ page: 1, limit: 100 }));
            dispatch(fetchPacientes({ page: 1, limit: 10000 }));
        }
    }, [dispatch, id, id_consulta]);


    const handleChange = (e) => {
        const { name, value, dataset } = e.target;

        setFormData((prevFormData) => {
            switch (dataset.group) {
                case 'editado':
                    return {
                        ...prevFormData,
                        editado: {
                            ...prevFormData.editado,
                            [name]: value,
                        },
                    };
                default:
                    return {
                        ...prevFormData,
                        [name]: value,
                    };
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(fetchEditarConsultaGenerica({ id, id_consulta, data: formData }));
        navigate(-1); // Reemplaza con la ruta a la que quieres redirigir después de actualizar
    };

    return (
        <div
            className="admin-data-content"
            data-select2-id="12"
            style={{
                marginTop: '50px'
            }}
        >
            <div
                className="row layout-top-spacing"
                data-select2-id="11"
            >
                <div
                    className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing"
                    data-select2-id="10"
                >
                    <div
                        className="widget-content-area br-4"
                        data-select2-id="9"
                    >
                        <form
                            method="put"
                            role="form"
                            onSubmit={handleSubmit}
                        >
                            <div
                                className="widget-one"
                                data-select2-id="8"
                            >
                                <div
                                    className="row"
                                    data-select2-id="7"
                                >
                                    <div
                                        className="col-lg-12 layout-spacing"
                                        data-select2-id="flFormsGrid"
                                        id="flFormsGrid"
                                    >
                                        <div
                                            className="statbox widget box box-shadow"
                                            data-select2-id="6"
                                        >
                                            <div className="widget-header">
                                                <div className="row">
                                                    <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                                        <h4>
                                                            {' '}Editar Historia Clínica
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                            <nav
                                                aria-label="breadcrumb"
                                                className="breadcrumb-one"
                                            >
                                                <ol
                                                    className="breadcrumb"
                                                    style={{
                                                        background: '#0096881c'
                                                    }}
                                                >
                                                    <li className="breadcrumb-item">
                                                        <a href="javascript:void(0);">
                                                            Doctor:
                                                        </a>
                                                    </li>
                                                    <li
                                                        aria-current="page"
                                                        className="breadcrumb-item active"
                                                    >
                                                        <b>
                                                            {consultagenerica.doctor}
                                                        </b>
                                                    </li>
                                                </ol>
                                            </nav>
                                            <div className="widget-content widget-content-area">
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="paciente">
                                                            Paciente:
                                                        </label>
                                                        <select
                                                            className="form-control"
                                                            name="paciente"
                                                            value={formData.paciente || ''} // Asigna el valor del paciente seleccionado
                                                            onChange={(e) => setFormData({ ...formData, paciente: e.target.value })} // Manejo del cambio
                                                        >
                                                            <option value="">Seleccione un paciente</option> {/* Opción por defecto */}
                                                            {pacientes.filter(paciente => paciente.id_paciente === consultagenerica.paciente).map((paciente) => (
                                                                <option key={paciente.id_paciente} value={paciente.id_paciente}>
                                                                    Numero Cedula: {paciente.nro_cedula} || Nombres: {paciente.nombres} {paciente.apellidos}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-row mb-12">
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="sucursal">
                                                            Sucursal
                                                        </label>
                                                        <select
                                                            className="form-control"
                                                            name="sucursal"
                                                            value={formData.sucursal || ''} // Asigna el valor de la sucursal seleccionada
                                                            onChange={(e) => setFormData({ ...formData, sucursal: e.target.value })} // Manejo del cambio
                                                        >
                                                            <option value="">Seleccione una sucursal</option> {/* Opción por defecto */}
                                                            {sucursales.filter(sucursal => sucursal.id_sucursal === consultagenerica.sucursal).map((sucursal) => (
                                                                <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                                                                    {sucursal.nombre}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="edad">
                                                            Edad
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.edad}
                                                            name="edad"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="inputAddress">
                                                            Fecha de atencion
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={formData.fecha_atencion}
                                                            name="fecha_atencion"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="inputAddress">
                                                            Motivo de Consulta:
                                                        </label>
                                                        <textarea
                                                            className="form-control textarea"
                                                            value={formData.m_c}
                                                            maxLength="10000"
                                                            name="m_c"
                                                            placeholder="Esta área tiene un limite de 800 caracteres."
                                                            rows="25"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                className="btn btn-success mt-3"
                                                type="submit"
                                            >
                                                Editar Consulta
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditarConsultaGenerica