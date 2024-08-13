import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVerPaciente } from '../../redux/features/pacientes/VerPacienteSlice'
import { fetchMostrarOrtoptica } from '../../redux/features/pacientes/MostrarOrtopticaSlice';
import { fetchMostrarBajaVision } from '../../redux/features/pacientes/MostrarBajaVisionSlice';
import { fetchMostrarGeneral } from '../../redux/features/pacientes/MostrarGeneralSlice';
import { fetchMostrarNeonatos } from '../../redux/features/pacientes/MostrarNeonatosSlice';
import { fetchMostrarPediatrica } from '../../redux/features/pacientes/MostrarPediatricaSlice';
import { fetchMostrarConsultaGenerica } from '../../redux/features/pacientes/MostrarConsultaGenerica';
import { deleteOptometriaGeneral } from '../../redux/features/consultas/DeleteGeneralSlice';
import { DeleteBajaVision } from '../../redux/features/consultas/DeleteBajaVisionSlice';
import { DeleteConsultaGenerica } from '../../redux/features/consultas/DeleteConsultaGenericaSlice';
import { DeleteNeonatos } from '../../redux/features/consultas/DeleteNeonatosSlice';
import { DeleteOrtoptica } from '../../redux/features/consultas/DeleteOrtopticaSlice';
import { DeletePediatrica } from '../../redux/features/consultas/DeletePediatricaSlice';
import { uploadDocumento } from '../../redux/features/documentos/DocumentosPacientesSlice';
import { fetchVerDocumentosSlice } from '../../redux/features/documentos/VerDocumentosSlice';
import { deleteDocumento } from '../../redux/features/documentos/deleteDocumentoSlice';
import { fetchTerapiasBajaVision, createTerapiasBajaVision } from '../../redux/features/terapias/terapiasBajaVisionSlice';
import { useParams, Link } from 'react-router-dom';

const formatToDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
};

const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }
    return age;
};

const HistoriaPaciente = () => {

    const dispatch = useDispatch();
    const { id } = useParams();
    const { data: verPaciente, } = useSelector((state) => state.verPaciente);
    const { dataOA } = useSelector((state) => state.mostrarOrtoptica);
    const { dataBV } = useSelector((state) => state.mostrarBajaVision);
    const { dataRG } = useSelector((state) => state.mostrarGeneral);
    const { dataON } = useSelector((state) => state.mostrarNeonatos);
    const { dataOP } = useSelector((state) => state.mostrarPediatrica);
    const { dataCG } = useSelector((state) => state.mostrarConsultaGenerica);
    const [documento, setDocumento] = useState(null);
    const { uploading } = useSelector((state) => state.subirDocumento);
    const { documentos } = useSelector((state) => state.verDocumento);
    const { terapias } = useSelector((state) => state.terapiasBajaVision);
    const [age, setAge] = useState(null);

    let urgencia = {};
    let menor = {};
    try {
        urgencia = verPaciente && verPaciente.urgencia ? JSON.parse(verPaciente.urgencia) : {};
        menor = verPaciente && verPaciente.menor ? JSON.parse(verPaciente.menor) : {};
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }

    useEffect(() => {
        if (verPaciente && verPaciente.fecha_nacimiento) {
            const calculatedAge = calculateAge(verPaciente.fecha_nacimiento);
            setAge(calculatedAge);
        }
    }, [verPaciente]);

    useEffect(() => {
        if (id) {
            dispatch(fetchVerPaciente(id));
            dispatch(fetchMostrarOrtoptica({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
            dispatch(fetchMostrarBajaVision({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
            dispatch(fetchMostrarGeneral({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
            dispatch(fetchMostrarNeonatos({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
            dispatch(fetchMostrarPediatrica({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
            dispatch(fetchMostrarConsultaGenerica({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
            dispatch(fetchVerDocumentosSlice(id));
            dispatch(fetchTerapiasBajaVision(id));
        }
    }, [dispatch, id]);


    const handleCreateTerapias = () => {
        const nuevaTerapia = {
            id_paciente: id,
            evaluacion: '',
            motivo: '',
            fecha_creacion: new Date().toISOString().split('T')[0]
        };

        dispatch(createTerapiasBajaVision(nuevaTerapia))
            .unwrap()
            .then((response) => {
                alert('Terapia Creada con exito')
            })
            .catch((error) => {
                // Maneja el error aquí
                console.error('Error al crear terapia:', error);
            });
    };

    const handleFileChange = (e) => {
        setDocumento(e.target.files[0]);
    };

    const handleFileUpload = (e) => {
        e.preventDefault();
        if (!documento) {
            alert('Selecciona un archivo primero');
            return;
        }
        dispatch(uploadDocumento({ documento, id_paciente: id }))
            .then((result) => {
                if (result.meta.requestStatus === 'fulfilled') {
                    alert('Documento subido exitosamente');
                    dispatch(fetchVerDocumentosSlice(id)); // Actualiza la lista de documentos
                    setDocumento(null); // Limpiar el archivo seleccionado
                } else {
                    alert('Hubo un error al intentar subir el documento.');
                }
            });
    };


    const handleDeleteDocument = (id_documento) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este documento?')) {
            dispatch(deleteDocumento(id_documento))
                .then((result) => {
                    if (result.meta.requestStatus === 'fulfilled') {
                        alert('Documento eliminado exitosamente');
                        dispatch(fetchVerDocumentosSlice(id)); // Actualizar la lista de documentos
                    } else {
                        alert('Hubo un error al intentar eliminar el documento.');
                    }
                });
        }
    };
    const handleDeleteOptometriaGeneral = (id_consulta) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta consulta?')) {
            dispatch(deleteOptometriaGeneral(id_consulta))
                .then((result) => {
                    if (result.meta.requestStatus === 'fulfilled') {
                        alert('Consulta eliminada exitosamente');
                        dispatch(fetchMostrarGeneral({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
                    } else {
                        alert('Hubo un error al intentar eliminar la consulta.');
                    }
                });
        }
    };

    const handleDeleteBajaVision = (id_consulta) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta consulta?')) {
            dispatch(DeleteBajaVision(id_consulta))
                .then((result) => {
                    if (result.meta.requestStatus === 'fulfilled') {
                        alert('Consulta eliminada exitosamente');
                        dispatch(fetchMostrarConsultaGenerica({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
                    } else {
                        alert('Hubo un error al intentar eliminar la consulta.');
                    }
                });
        }
    };

    const handleDeleteConsultaGenerica = (id_consulta) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta consulta?')) {
            dispatch(DeleteConsultaGenerica(id_consulta))
                .then((result) => {
                    if (result.meta.requestStatus === 'fulfilled') {
                        alert('Consulta eliminada exitosamente');
                        dispatch(fetchMostrarConsultaGenerica({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
                    } else {
                        alert('Hubo un error al intentar eliminar la consulta.');
                    }
                });
        }
    };

    const handleDeleteNeonatos = (id_consulta) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta consulta?')) {
            dispatch(DeleteNeonatos(id_consulta))
                .then((result) => {
                    if (result.meta.requestStatus === 'fulfilled') {
                        alert('Consulta eliminada exitosamente');
                        dispatch(fetchMostrarNeonatos({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
                    } else {
                        alert('Hubo un error al intentar eliminar la consulta.');
                    }
                });
        }
    };

    const handleDeleteOrtoptica = (id_consulta) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta consulta?')) {
            dispatch(DeleteOrtoptica(id_consulta))
                .then((result) => {
                    if (result.meta.requestStatus === 'fulfilled') {
                        alert('Consulta eliminada exitosamente');
                        dispatch(fetchMostrarOrtoptica({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
                    } else {
                        alert('Hubo un error al intentar eliminar la consulta.');
                    }
                });
        }
    };

    const handleDeletePediatrica = (id_consulta) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta consulta?')) {
            dispatch(DeletePediatrica(id_consulta))
                .then((result) => {
                    if (result.meta.requestStatus === 'fulfilled') {
                        alert('Consulta eliminada exitosamente');
                        dispatch(fetchMostrarPediatrica({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
                    } else {
                        alert('Hubo un error al intentar eliminar la consulta.');
                    }
                });
        }
    };

    return (
        <div
            className="admin-data-content"
            style={{
                marginTop: '50px',
            }}
        >
            <div className="row layout-top-spacing">
                <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
                    <div className="widget-content-area br-4">
                        <div className="widget-one">
                            <div className="row">
                                <div
                                    className="col-lg-12 layout-spacing"
                                    id="flFormsGrid"
                                >
                                    <div className="statbox widget box box-shadow">
                                        <div className="widget-header">
                                            <div className="row">
                                                <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                                    <h4>
                                                        Historia Paciente
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="widget-content widget-content-area"
                                            style={{
                                                width: '92%',
                                                left: '4%',
                                            }}
                                        >
                                            <form
                                                method="post"
                                                role="form"
                                            >
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-6">
                                                        <p>
                                                            Creado por:{' '}
                                                            <b>
                                                                {verPaciente ? verPaciente.doctor?.trim() : ''}
                                                            </b>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-4">
                                                        <label
                                                            className="labelBold"
                                                            htmlFor="nombres"
                                                        >
                                                            Nombre
                                                        </label>
                                                        <input
                                                            className="form-control labelBold"
                                                            value={verPaciente ? verPaciente.nombres?.trim() : ''}
                                                            id="nombres"
                                                            name="nombres"
                                                            placeholder="Nombres"
                                                            readOnly
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="apellidos">
                                                            Apellidos
                                                        </label>
                                                        <input
                                                            className="form-control labelBold"
                                                            value={verPaciente ? verPaciente.apellidos?.trim() : ''}
                                                            id="apellidos"
                                                            name="apellidos"
                                                            placeholder="Apellidos"
                                                            readOnly
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="email">
                                                            Email
                                                        </label>
                                                        <input
                                                            className="form-control labelBold"
                                                            value={verPaciente ? verPaciente.email?.trim() : ''}
                                                            id="email"
                                                            name="email"
                                                            placeholder="Email"
                                                            readOnly
                                                            type="email"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="nro_cedula">
                                                            Nro.Cedula
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={verPaciente ? verPaciente.nro_cedula?.trim() : ''}
                                                            name="nro_cedula"
                                                            placeholder="Nro.Cedula"
                                                            readOnly
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="nro_seguro">
                                                            Nro.Seguro Social
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={verPaciente ? verPaciente.nro_seguro?.trim() : ''}
                                                            name="nro_seguro"
                                                            placeholder="Nro.Seguro Social"
                                                            readOnly
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="nacimiento">
                                                            Fecha de Nacimiento
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={verPaciente ? formatToDateDisplay(verPaciente.fecha_nacimiento?.trim()) : ''}
                                                            name="fecha_nacimiento"
                                                            readOnly
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-m d-3">
                                                        <label htmlFor="genero">
                                                            Genero
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={verPaciente ? verPaciente.genero?.trim() : ''}
                                                            name="genero"
                                                            placeholder="Genero"
                                                            readOnly
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="lugarNacimiento">
                                                            Lugar de Nacimiento
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={verPaciente ? verPaciente.lugar_nacimiento?.trim() : ''}
                                                            id="lugarNacimiento"
                                                            name="lugar_nacimiento"
                                                            placeholder="Lugar de Nacimiento"
                                                            readOnly
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-8">
                                                        <label htmlFor="inputAddress2">
                                                            Direccion Residencial
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={verPaciente ? verPaciente.direccion?.trim() : ''}
                                                            id="inputAddress2"
                                                            name="direccion"
                                                            placeholder="Dirección Residencial"
                                                            readOnly
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="ocupacion">
                                                            Ocupación
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={verPaciente ? verPaciente.ocupacion?.trim() : ''}
                                                            id="ocupacion"
                                                            name="ocupacion"
                                                            placeholder="Ocupación"
                                                            readOnly
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="telefono">
                                                            Teléfono de casa
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={verPaciente ? verPaciente.telefono?.trim() : ''}
                                                            id="telefono"
                                                            name="telefono"
                                                            placeholder="Teléfono"
                                                            readOnly
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="celular">
                                                            Número de celular
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={verPaciente ? verPaciente.celular?.trim() : ''}
                                                            id="celular"
                                                            name="celular"
                                                            placeholder="Celular"
                                                            readOnly
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="medico">
                                                            Medico de Cabecera
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={verPaciente ? verPaciente.medico?.trim() : ''}
                                                            id="medico"
                                                            name="medico"
                                                            placeholder="Medico de Cabecera"
                                                            readOnly
                                                            type="text"
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
                                                            value={urgencia.nombre_ur || ''}
                                                            disabled
                                                            id="nombre_ur"
                                                            name="nombre_ur"
                                                            placeholder="Responsable"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="parentesco_ur">
                                                            {' '}Parentesco
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={urgencia.parentesco_ur || ''}
                                                            disabled
                                                            id="parentesco_ur"
                                                            name="parentesco_ur"
                                                            placeholder="Parentesco"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="nro_ur">
                                                            {' '}Número
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={urgencia.nro_ur || ''}
                                                            disabled
                                                            id="nro_ur"
                                                            name="nro_ur"
                                                            placeholder="Parentesco"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <h4>
                                                    MENOR DE EDAD
                                                </h4>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="responsable">
                                                            {' '}Por favor colocar el nombre del acudiente o responsable
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={menor.responsable || ''}
                                                            disabled
                                                            id="responsable"
                                                            name="responsable"
                                                            placeholder="Responsable"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="parentesco">
                                                            {' '}Parentesco
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={menor.parentesco || ''}
                                                            disabled
                                                            id="parentesco"
                                                            name="parentesco"
                                                            placeholder="Parentesco"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="nro_celular_responsable">
                                                            {' '}Nro.Celular
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={menor.nro_celular_responsable || ''}
                                                            disabled
                                                            id="nro_celular_responsable"
                                                            name="nro_celular_responsable"
                                                            placeholder="Nro Celular"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="urg_responsable">
                                                            {' '}Remitido Por
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={menor.remitido || ''}
                                                            disabled
                                                            id="remitido"
                                                            name="remitido"
                                                            placeholder="Remitido"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <button className="btn btn-success mt-3">
                                                    <Link to={`/editar-paciente/${verPaciente.id_paciente}`}>
                                                        Editar Paciente
                                                    </Link>
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
            <div
                className="admin-data-content"
                style={{
                    marginTop: '50px',
                }}
            >
                <div className="row layout-top-spacing">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
                        <div className="widget-content-area br-4">
                            <div className="widget-one">
                                <div className="row">
                                    <div
                                        className="col-lg-12 layout-spacing"
                                        id="flFormsGrid"
                                    >
                                        <div className="statbox widget box box-shadow">
                                            <div className="widget-header">
                                                <div className="row">
                                                    <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                                        <h4>
                                                            LISTA DE CONSULTAS
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="widget-content widget-content-area">
                                                <div className="row mb-4">
                                                    {dataOA.length > 0 && (
                                                        <div className="card component-card_7 mb-4" style={{ background: 'rgb(0 150 136 / 11%)', width: '96%', left: '2%' }}>
                                                            <h6 className="p-3">
                                                                CONSULTAS ORTOPTICA:
                                                            </h6>
                                                            <div className="table-responsive-md">
                                                                <table className="table dt-table-hover" id="zero-config" style={{ width: '100%', }}>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>
                                                                                Nro
                                                                            </th>
                                                                            <th>
                                                                                Consulta
                                                                            </th>
                                                                            <th>
                                                                                Medico
                                                                            </th>
                                                                            <th>
                                                                                Fecha Atención
                                                                            </th>
                                                                            <th className="no-content">
                                                                                Acción
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {dataOA.map((OA, index) => (
                                                                            <tr key={OA.id_consulta}>
                                                                                <td className="text-center">{index + 1}</td>
                                                                                <td>Consulta Ortoptica Adultos</td>
                                                                                <td>{OA.doctor}</td>
                                                                                <td>{OA.fecha_creacion}</td>
                                                                                <td>
                                                                                    <Link to={`/ver-ortoptica/${OA.paciente}/${OA.id_consulta}`}>
                                                                                        <button
                                                                                            className="btnVerConsultaCG btn btn-primary mb-2 p-1 mr-2 rounded-circle"
                                                                                            id_consulta="56"
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
                                                                                        </button>
                                                                                    </Link>
                                                                                    <Link to={`/editar-ortoptica/${OA.paciente}/${OA.id_consulta}`}>
                                                                                        <button
                                                                                            className="btnEditarConsultaCG btn btn-warning mb-2 p-1 mr-2 rounded-circle"
                                                                                            id_consulta="56"
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
                                                                                    <button
                                                                                        key={OA.id_consulta}
                                                                                        onClick={() => handleDeleteOrtoptica(OA.id_consulta)}
                                                                                        className="btnEliminarConsultaCG btn btn-danger mb-2 p-1 mr-2 rounded-circle"
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
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                    <tfoot>
                                                                        <tr>
                                                                            <th>
                                                                                Nro
                                                                            </th>
                                                                            <th>
                                                                                Consulta
                                                                            </th>
                                                                            <th>
                                                                                Medico
                                                                            </th>
                                                                            <th>
                                                                                Fecha Atención
                                                                            </th>
                                                                            <th className="no-content" />
                                                                        </tr>
                                                                    </tfoot>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {dataBV.length > 0 && (
                                                        <div className="card component-card_7 mb-4" style={{ background: 'rgb(0 150 136 / 11%)', width: '96%', left: '2%' }}>
                                                            <h6 className="p-3">
                                                                CONSULTAS BAJA VISION:
                                                            </h6>
                                                            <div className="table-responsive-md">
                                                                <table className="table dt-table-hover" id="zero-config" style={{ width: '100%', }}>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>
                                                                                Nro
                                                                            </th>
                                                                            <th>
                                                                                Consulta
                                                                            </th>
                                                                            <th>
                                                                                Medico
                                                                            </th>
                                                                            <th>
                                                                                Fecha Atención
                                                                            </th>
                                                                            <th className="no-content">
                                                                                Acción
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {dataBV.map((BV, index) => (
                                                                            <tr key={BV.id_consulta}>
                                                                                <td className="text-center">{index + 1}</td>
                                                                                <td>Consulta Optometría Baja Vision</td>
                                                                                <td>{BV.doctor}</td>
                                                                                <td>{BV.fecha_creacion}</td>
                                                                                <td>
                                                                                    <Link to={`/ver-bajaVision/${id}/${BV.id_consulta}`}>
                                                                                        <button
                                                                                            className="btnVerConsultaCG btn btn-primary mb-2 p-1 mr-2 rounded-circle"
                                                                                            id_consulta="56"
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
                                                                                        </button>
                                                                                    </Link>
                                                                                    <Link to={`/editar-bajaVision/${id}/${BV.id_consulta}`}>
                                                                                        <button
                                                                                            className="btnEditarConsultaCG btn btn-warning mb-2 p-1 mr-2 rounded-circle"
                                                                                            id_consulta="56"
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
                                                                                    <button
                                                                                        key={BV.id_consulta}
                                                                                        onClick={() => handleDeleteBajaVision(BV.id_consulta)}
                                                                                        borrar_consulta="56"
                                                                                        className="btnEliminarConsultaCG btn btn-danger mb-2 p-1 mr-2 rounded-circle"
                                                                                        id_paciente="22"
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
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                    <tfoot>
                                                                        <tr>
                                                                            <th>
                                                                                Nro
                                                                            </th>
                                                                            <th>
                                                                                Consulta
                                                                            </th>
                                                                            <th>
                                                                                Medico
                                                                            </th>
                                                                            <th>
                                                                                Fecha Atención
                                                                            </th>
                                                                            <th className="no-content" />
                                                                        </tr>
                                                                    </tfoot>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {dataRG.length > 0 && (
                                                        <div className="card component-card_7 mb-4" style={{ background: 'rgb(0 150 136 / 11%)', width: '96%', left: '2%' }}>
                                                            <h6 className="p-3">
                                                                CONSULTAS OBTOMETRIA GENERAL:
                                                            </h6>
                                                            <div className="table-responsive-md">
                                                                <table className="table dt-table-hover" id="zero-config" style={{ width: '100%', }}>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>
                                                                                Nro
                                                                            </th>
                                                                            <th>
                                                                                Consulta
                                                                            </th>
                                                                            <th>
                                                                                Medico
                                                                            </th>
                                                                            <th>
                                                                                Fecha Atención
                                                                            </th>
                                                                            <th className="no-content">
                                                                                Acción
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {dataRG.map((RG, index) => (
                                                                            <tr key={RG.id_consulta}>
                                                                                <td className="text-center">{index + 1}</td>
                                                                                <td>Consulta Optometría General</td>
                                                                                <td>{RG.doctor}</td>
                                                                                <td>{RG.fecha_creacion}</td>
                                                                                <td>
                                                                                    <Link to={`/ver-refraccion/${id}/${RG.id_consulta}`}>
                                                                                        <button
                                                                                            className="btnVerConsultaRG btn btn-primary mb-2 p-1 mr-2 rounded-circle"
                                                                                            id_consulta="56"
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
                                                                                        </button>
                                                                                    </Link>
                                                                                    <Link to={`/editar-OptometriaGeneral/${id}/${RG.id_consulta}`}>
                                                                                        <button
                                                                                            className="btnEditarConsultaRG btn btn-warning mb-2 p-1 mr-2 rounded-circle"
                                                                                            id_consulta="56"
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
                                                                                    <button
                                                                                        key={RG.id_consulta}
                                                                                        onClick={() => handleDeleteOptometriaGeneral(RG.id_consulta)}
                                                                                        className="btnEliminarConsultaRG btn btn-danger mb-2 p-1 mr-2 rounded-circle"
                                                                                        id_paciente="22"
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
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                    <tfoot>
                                                                        <tr>
                                                                            <th>
                                                                                Nro
                                                                            </th>
                                                                            <th>
                                                                                Consulta
                                                                            </th>
                                                                            <th>
                                                                                Medico
                                                                            </th>
                                                                            <th>
                                                                                Fecha Atención
                                                                            </th>
                                                                            <th className="no-content" />
                                                                        </tr>
                                                                    </tfoot>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {dataON.length > 0 && (
                                                        <div className="card component-card_7 mb-4" style={{ background: 'rgb(0 150 136 / 11%)', width: '96%', left: '2%' }}>
                                                            <h6 className="p-3">
                                                                CONSULTAS OBTOMETRIA NEONATOS:
                                                            </h6>
                                                            <div className="table-responsive-md">
                                                                <table className="table dt-table-hover" id="zero-config" style={{ width: '100%', }}>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>
                                                                                Nro
                                                                            </th>
                                                                            <th>
                                                                                Consulta
                                                                            </th>
                                                                            <th>
                                                                                Medico
                                                                            </th>
                                                                            <th>
                                                                                Fecha Atención
                                                                            </th>
                                                                            <th className="no-content">
                                                                                Acción
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {dataON.map((ON, index) => (
                                                                            <tr key={ON.id_consulta}>
                                                                                <td className="text-center">{index + 1}</td>
                                                                                <td>Consulta Optometría Neonatos</td>
                                                                                <td>{ON.doctor}</td>
                                                                                <td>{ON.fecha_creacion}</td>
                                                                                <td>
                                                                                    <Link to={`/ver-neonatos/${id}/${ON.id_consulta}`}>
                                                                                        <button
                                                                                            className="btnVerConsultaCG btn btn-primary mb-2 p-1 mr-2 rounded-circle"
                                                                                            id_consulta="56"
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
                                                                                        </button>
                                                                                    </Link>
                                                                                    <Link to={`/editar-neonato/${id}/${ON.id_consulta}`}>
                                                                                        <button
                                                                                            className="btnEditarConsultaCG btn btn-warning mb-2 p-1 mr-2 rounded-circle"
                                                                                            id_consulta="56"
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
                                                                                    <button
                                                                                        key={ON.id_consulta}
                                                                                        onClick={() => handleDeleteNeonatos(ON.id_consulta)}
                                                                                        className="btnEliminarConsultaCG btn btn-danger mb-2 p-1 mr-2 rounded-circle"
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
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                    <tfoot>
                                                                        <tr>
                                                                            <th>
                                                                                Nro
                                                                            </th>
                                                                            <th>
                                                                                Consulta
                                                                            </th>
                                                                            <th>
                                                                                Medico
                                                                            </th>
                                                                            <th>
                                                                                Fecha Atención
                                                                            </th>
                                                                            <th className="no-content" />
                                                                        </tr>
                                                                    </tfoot>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {dataOP.length > 0 && (
                                                        <div className="card component-card_7 mb-4" style={{ background: 'rgb(0 150 136 / 11%)', width: '96%', left: '2%' }}>
                                                            <h6 className="p-3">
                                                                CONSULTAS OBTOMETRIA PEDIATRICA:
                                                            </h6>
                                                            <div className="table-responsive-md">
                                                                <table className="table dt-table-hover" id="zero-config" style={{ width: '100%', }}>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>
                                                                                Nro
                                                                            </th>
                                                                            <th>
                                                                                Consulta
                                                                            </th>
                                                                            <th>
                                                                                Medico
                                                                            </th>
                                                                            <th>
                                                                                Fecha Atención
                                                                            </th>
                                                                            <th className="no-content">
                                                                                Acción
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {dataOP.map((OP, index) => (
                                                                            <tr key={OP.id_consulta}>
                                                                                <td className="text-center">{index + 1}</td>
                                                                                <td>Consulta Optometría Pediatrica</td>
                                                                                <td>{OP.doctor}</td>
                                                                                <td>{OP.fecha_creacion}</td>
                                                                                <td>
                                                                                    <Link to={`/ver-pediatrica/${id}/${OP.id_consulta}`}>
                                                                                        <button
                                                                                            className="btnVerConsultaCG btn btn-primary mb-2 p-1 mr-2 rounded-circle"
                                                                                            id_consulta="56"
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
                                                                                        </button>
                                                                                    </Link>
                                                                                    <Link to={`/editar-pediatrica/${id}/${OP.id_consulta}`}>
                                                                                        <button
                                                                                            className="btnEditarConsultaCG btn btn-warning mb-2 p-1 mr-2 rounded-circle"
                                                                                            id_consulta="56"
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
                                                                                    <button
                                                                                        key={OP.id_consulta}
                                                                                        onClick={() => handleDeletePediatrica(OP.id_consulta)}
                                                                                        className="btnEliminarConsultaCG btn btn-danger mb-2 p-1 mr-2 rounded-circle"
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
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                    <tfoot>
                                                                        <tr>
                                                                            <th>
                                                                                Nro
                                                                            </th>
                                                                            <th>
                                                                                Consulta
                                                                            </th>
                                                                            <th>
                                                                                Medico
                                                                            </th>
                                                                            <th>
                                                                                Fecha Atención
                                                                            </th>
                                                                            <th className="no-content" />
                                                                        </tr>
                                                                    </tfoot>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {dataCG.length > 0 && (
                                                        <div className="card component-card_7 mb-4" style={{ background: 'rgb(0 150 136 / 11%)', width: '96%', left: '2%' }}>
                                                            <h6 className="p-3">
                                                                CONSULTAS CONSULTA GENERICA:
                                                            </h6>
                                                            <div className="table-responsive-md">
                                                                <table className="table dt-table-hover" id="zero-config" style={{ width: '100%', }}>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>
                                                                                Nro
                                                                            </th>
                                                                            <th>
                                                                                Consulta
                                                                            </th>
                                                                            <th>
                                                                                Medico
                                                                            </th>
                                                                            <th>
                                                                                Fecha Atención
                                                                            </th>
                                                                            <th className="no-content">
                                                                                Acción
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {dataCG.map((CG, index) => (
                                                                            <tr key={CG.id_consulta}>
                                                                                <td className="text-center">{index + 1}</td>
                                                                                <td>Consulta Consulta Generica</td>
                                                                                <td>{CG.doctor}</td>
                                                                                <td>{CG.fecha_creacion}</td>
                                                                                <td>
                                                                                    <Link to={`/ver-consultagenericas/${id}/${CG.id_consulta}`}>
                                                                                        <button
                                                                                            className="btnVerConsultaCG btn btn-primary mb-2 p-1 mr-2 rounded-circle"
                                                                                            id_consulta="56"
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
                                                                                        </button>
                                                                                    </Link>
                                                                                    <Link to={`/editar-ConsultaGenerica/${id}/${CG.id_consulta}`}>
                                                                                        <button
                                                                                            className="btnEditarConsultaCG btn btn-warning mb-2 p-1 mr-2 rounded-circle"
                                                                                            id_consulta="56"
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
                                                                                    <button
                                                                                        key={CG.id_consulta}
                                                                                        onClick={() => handleDeleteConsultaGenerica(CG.id_consulta)}
                                                                                        className="btnEliminarConsultaCG btn btn-danger mb-2 p-1 mr-2 rounded-circle"
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
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                    <tfoot>
                                                                        <tr>
                                                                            <th>
                                                                                Nro
                                                                            </th>
                                                                            <th>
                                                                                Consulta
                                                                            </th>
                                                                            <th>
                                                                                Medico
                                                                            </th>
                                                                            <th>
                                                                                Fecha Atención
                                                                            </th>
                                                                            <th className="no-content" />
                                                                        </tr>
                                                                    </tfoot>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div
                                                    className="widget-header mt-4"
                                                    style={{
                                                        paddingTop: '5%'
                                                    }}
                                                >
                                                    <div className="row">
                                                        <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                                            <h3>
                                                                TERAPIAS:
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mt-4">
                                                    <div className="col-md-3">
                                                        <form onSubmit={(e) => e.preventDefault()}>
                                                            <button
                                                                className="btn btn-success mb-4 ml-3 mt-4"
                                                                onClick={handleCreateTerapias}
                                                            >
                                                                Crear Terapia Baja Vision
                                                            </button>
                                                        </form>
                                                    </div>

                                                    {age !== null && (
                                                        <>
                                                            {age < 3 && (
                                                                <div className="col-md-3">
                                                                    <button className="btn btn-success mb-4 ml-3 mt-4">
                                                                        Crear Terapia Optometría Neonatos
                                                                    </button>
                                                                </div>
                                                            )}
                                                            {age >= 3 && age <= 18 && (
                                                                <div className="col-md-3">
                                                                    <button className="btn btn-success mb-4 ml-3 mt-4">
                                                                        Crear Terapia Optometría Pediatrica
                                                                    </button>
                                                                </div>
                                                            )}
                                                            {age > 18 && (
                                                                <div className="col-md-3">
                                                                    <button className="btn btn-success mb-4 ml-3 mt-4">
                                                                        Crear Terapia Ortoptica Adultos
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>

                                                <div className="row">
                                                    {terapias.map((terapia) => (
                                                        <div key={terapia.id_terapia} className="col-md-12">
                                                            <div className="widget-content widget-content-area">
                                                                <div
                                                                    className="card component-card_7"
                                                                    style={{
                                                                        background: 'rgb(0 150 136 / 11%)',
                                                                        width: '100%'
                                                                    }}
                                                                >
                                                                    <div className="card-body">
                                                                        <button
                                                                            className="btn btn-danger btn_eliminar_terapia btn_eliminar_terapiagopp"
                                                                            id_paciente={terapia.id_paciente}
                                                                            id_terapia={terapia.id_terapia}
                                                                            style={{
                                                                                marginBottom: '-80px',
                                                                                position: 'absolute',
                                                                                zIndex: '3',
                                                                                marginLeft: 420,
                                                                            }}
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
                                                                        <h5 className="">
                                                                            Terapia Baja Vision:
                                                                        </h5>
                                                                        <div className="rating-stars">
                                                                            <p>
                                                                                Cantidad de terapias realizadas{' '}
                                                                                <b>
                                                                                    {terapia.cantidad}
                                                                                </b>
                                                                            </p>
                                                                            <p>
                                                                                Fecha de creación:{' '}
                                                                                <b>
                                                                                    {terapia.fecha_creacion}
                                                                                </b>
                                                                            </p>
                                                                            <Link to={`/terapias-bajavision/${id}/${terapia.id_terapia}`}>
                                                                                <a
                                                                                    className="btn btn-success mb-4 ml-3 mt-4"
                                                                                >
                                                                                    VER
                                                                                </a>
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="row mt-3 p-3">
                                                    <h6>SUBIR DOCUMENTOS DEL PACIENTE:</h6>
                                                    <div className="col-lg-12 layout-spacing" id="fuSingleFile">
                                                        <div className="statbox widget box box-shadow">
                                                            <div className="widget-header">
                                                                <div className="row">
                                                                    <div className="col-xl-12 col-md-12 col-sm-12 col-12"></div>
                                                                </div>
                                                            </div>
                                                            <div className="widget-content widget-content-area">
                                                                <div className="custom-file-container" data-upload-id="myFirstImage">
                                                                    <form onSubmit={handleFileUpload}>
                                                                        <label className="custom-file-container__custom-file">
                                                                            <input
                                                                                className="custom-file-container__custom-file__custom-file-input"
                                                                                type="file"
                                                                                onChange={handleFileChange}
                                                                                required
                                                                            />
                                                                            <span className="custom-file-container__custom-file__custom-file-control">
                                                                                Subir archivo...
                                                                                <span className="custom-file-container__custom-file__custom-file-control__button">Buscar</span>
                                                                            </span>
                                                                        </label>
                                                                        <button
                                                                            className="btn btn-primary mt-4"
                                                                            type="submit"
                                                                            disabled={uploading}
                                                                        >
                                                                            {uploading ? 'Subiendo...' : 'Subir Documento'}
                                                                        </button>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                                    <h4 className="p-2">DOCUMENTOS PACIENTE:</h4>
                                                </div>
                                                <div className="row mt-4">
                                                    {documentos && documentos.map((doc) => (
                                                        <div
                                                            key={doc.id_documento}
                                                            className="col-md-6"
                                                            style={{
                                                                backgroundColor: '#e1e1e1',
                                                                border: '2px solid black',
                                                                borderRadius: '20px 20px',
                                                                minWidth: '100px'
                                                            }}
                                                        >
                                                            <svg
                                                                fill="none"
                                                                stroke="currentColor"
                                                                style={{
                                                                    width: '60px'
                                                                }}
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                />
                                                            </svg>
                                                            <a
                                                                className="btn btn-info"
                                                                href={doc.url}
                                                                target="_blank"
                                                                title="Visualizar Archivo"
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
                                                            </a>
                                                            <a
                                                                className="btn btn-primary"
                                                                download={doc.nombre}
                                                                href={`/storage/app/public/documentos_pacientes/${doc.id_documento}`}
                                                                title="Descargar Archivo"
                                                            >
                                                                <svg
                                                                    className="h-6 w-6"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                    />
                                                                </svg>
                                                            </a>
                                                            <button
                                                                borrar_documento="32"
                                                                className="btn btn-danger eliminarDocumentoPaciente"
                                                                onClick={() => handleDeleteDocument(doc.id_documento)}
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
                                                            <p className="mt-3">
                                                                Nombre:{doc.nombre}
                                                            </p>
                                                        </div>
                                                    ))}
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

export default HistoriaPaciente