import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
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
import { fetchTerapiasBajaVision, createTerapiasBajaVision, deleteTerapiasBajaVision } from '../../redux/features/terapias/terapiasBajaVisionSlice';
import { fetchTerapiasOptometriaNeonatos, createTerapiasOptometriaNeonatos, deleteTerapiasOptometriaNeonatos } from '../../redux/features/terapias/TerapiaOptometriaNeonatosSlice';
import { fetchTerapiasOptometriaPediatrica, createTerapiasOptometriaPediatrica, deleteTerapiasOptometriaPediatrica } from '../../redux/features/terapias/TerapiaOptometriaPediatricaSlice';
import { fetchTerapiasOrtopticaAdultos, createTerapiasOrtopticaAdultos, deleteTerapiasOrtopticaAdultos } from '../../redux/features/terapias/TerapiaOrtopticaAdultosSlice';
import { useParams, Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { funPermisosObtenidos } from '../../utils/ValidarPermisos';
import { deleteOrdenes, fetchOrdenesDelPaciente, fetchOrdenTiempoSinOrden, setOrderId, updateOrden, verCorrecionPdf, verOrdenPdf } from '../../redux/features/ordenes/ordenesSlice';
import { Button, Modal, Skeleton, Tooltip } from 'antd';
import PaginationPacientes from './PaginationPacientes';
import PaginationOrdenesPacientes from './PaginationOrdenesPacientes';
import { fetchPacientes, fetchPacientesTiempoSinConsultas } from '../../redux/features/pacientes/pacientesSlice';
import InfiniteScrollList from './componentes/historiaPaciente/infiniteScroll';
import DiagnosticosTableModal from './componentes/historiaPaciente/DiagnosticosTableModal';
import { resetDiagnosticosPorPaciente } from '../../redux/features/diagnosticos/DiagnosticosSlice';
import { deleteCorreccionesOrdenes } from '../../redux/features/correciones-ordenes/correcionesOrdenesSlice.js';
import { fetchResumenFinanciero } from '../../redux/features/anticipos/anticiposSlice.js';
import ResumenFinancieroPaciente from './componentes/historiaPaciente/ResumenFinancieroPaciente.js';

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
  const navigate = useNavigate();
  const { id } = useParams();
  console.log('id de paciente:', id);
  const { data: verPaciente, } = useSelector((state) => state.verPaciente);
  const { usuario, permisos } = useSelector((state) => state.auth);
  const { dataOA } = useSelector((state) => state.mostrarOrtoptica);
  const { dataBV } = useSelector((state) => state.mostrarBajaVision);
  const { dataRG } = useSelector((state) => state.mostrarGeneral);
  const { dataON } = useSelector((state) => state.mostrarNeonatos);
  const { dataOP } = useSelector((state) => state.mostrarPediatrica);
  const { dataCG } = useSelector((state) => state.mostrarConsultaGenerica);
  const [documento, setDocumento] = useState(null);
  const [nombreArchivo, setNombreArchivo] = useState("Subir archivo...");
  const { uploading } = useSelector((state) => state.subirDocumento);
  const { documentos } = useSelector((state) => state.verDocumento);
  const { terapias } = useSelector((state) => state.terapiasBajaVision);
  const { neonatos } = useSelector((state) => state.terapiaNeonatos);
  const { pediatrica } = useSelector((state) => state.terapiasPediatrica);
  const { ortoptica } = useSelector((state) => state.terapiasOrtoptica);
  const [terapiaModificada, setTerapiaModificada] = useState(false);
  const [age, setAge] = useState(null);
  const { pacienteOrdenes, meta, totalPages, statusPacienteOrdenes, ordenes_tiempo } = useSelector((state) => state.ordenes);
  const { pacientes_consultas_tiempo } = useSelector((state) => state.pacientes);
  const [showOrden, setShowOrden] = useState(false)
  const [urlPdfOrden, setUrlPdfOrden] = useState(null)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [openHistory, setOpenHistory] = useState(false);
  const [idPaciente, setIdPaciente] = useState();
  const [isCorreccion, setIsCorreccion] = useState(false);
  const [numCorrecionActual, setNumCorrecionActual] = useState(null);
  const { resumen: resumenFinanciero } = useSelector((state) => state.anticipos);

  let urgencia = {};
  let menor = {};
  try {
    urgencia = verPaciente && verPaciente.urgencia ? JSON.parse(verPaciente.urgencia) : {};
    menor = verPaciente && verPaciente.menor ? JSON.parse(verPaciente.menor) : {};
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  useEffect(() => {
    if (verPaciente && verPaciente.fecha_nacimiento) {
      const calculatedAge = calculateAge(verPaciente.fecha_nacimiento);
      setAge(calculatedAge);
    }
  }, [verPaciente]);

  useEffect(() => {
    if (id && id !== 'undefined') {
      dispatch(fetchResumenFinanciero(id));
    }
  }, [id, dispatch]);

  useEffect(() => {

    if (!id || id === 'undefined') {
      console.error('ID de paciente no válido:', id);
      // Redirige a una página de error o a la lista de pacientes
      navigate('/lista-pacientes');
      return;
    }
    dispatch(fetchVerPaciente(id));
    dispatch(fetchOrdenTiempoSinOrden(id));
    dispatch(fetchPacientesTiempoSinConsultas(id));
    dispatch(fetchMostrarOrtoptica({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
    dispatch(fetchMostrarBajaVision({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
    dispatch(fetchMostrarGeneral({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
    dispatch(fetchMostrarNeonatos({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
    dispatch(fetchMostrarPediatrica({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
    dispatch(fetchMostrarConsultaGenerica({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
    dispatch(fetchTerapiasOptometriaNeonatos(id));
    dispatch(fetchTerapiasOptometriaPediatrica(id));
    dispatch(fetchTerapiasOrtopticaAdultos(id));
    dispatch(fetchTerapiasBajaVision(id));
    dispatch(fetchVerDocumentosSlice(id));
    setTerapiaModificada(false);

  }, [id, terapiaModificada]);

  console.log('ordenes_tiempo:', ordenes_tiempo);

  useEffect(() => {
    if (id && id !== undefined) {
      dispatch(fetchOrdenesDelPaciente({ id_paciente: id, page: currentPage, limit: 10 })).unwrap();;
    }
  }, [id, currentPage])

  const handleCreateTerapias = (tipo) => {
    const nuevaTerapia = {
      id_paciente: id,
      evaluacion: '',
      motivo: '',
      fecha_creacion: new Date().toISOString().split('T')[0]
    };

    const terapiaInfo = {
      'bajaVision': {
        title: 'Baja Visión',
        action: createTerapiasBajaVision
      },
      'optometriaNeonatos': {
        title: 'Optometria Neonatos',
        action: createTerapiasOptometriaNeonatos
      },
      'optometriaPediatrica': {
        title: 'Optometria Pediatrica',
        action: createTerapiasOptometriaPediatrica
      },
      'ortopticaAdultos': {
        title: 'Ortoptica Adultos',
        action: createTerapiasOrtopticaAdultos
      },

    };

    const { title, action } = terapiaInfo[tipo];

    Swal.fire({
      title: `¿Crear nueva terapia de ${title}?`,
      text: `¿Estás seguro de que quieres crear una nueva terapia de ${title}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(action(nuevaTerapia))
          .unwrap()
          .then((response) => {
            Swal.fire(
              '¡Creada!',
              `La terapia de ${title} ha sido creada con éxito.`,
              'success'
            );
            setTerapiaModificada(true);
          })
          .catch((error) => {
            Swal.fire(
              'Error',
              `Hubo un problema al crear la terapia de ${title}.`,
              'error'
            );
            console.error(`Error al crear terapia de ${title}:`, error);
          });
      }
    });
  };

  const handleDeleteTerapia = (tipo, id_terapia) => {
    const terapiaInfo = {
      'bajaVision': {
        title: 'Baja Visión',
        action: deleteTerapiasBajaVision,
        fetchAction: fetchTerapiasBajaVision
      },
      'optometriaNeonatos': {
        title: 'Optometria Neonatos',
        action: deleteTerapiasOptometriaNeonatos,
        fetchAction: fetchTerapiasOptometriaNeonatos
      },
      'optometriaPediatrica': {
        title: 'Optometria Pediatrica',
        action: deleteTerapiasOptometriaPediatrica,
        fetchAction: fetchTerapiasOptometriaPediatrica
      },
      'ortopticaAdultos': {
        title: 'Ortoptica Adultos',
        action: deleteTerapiasOrtopticaAdultos,
        fetchAction: fetchTerapiasOrtopticaAdultos
      },
    };

    const { title, action, fetchAction } = terapiaInfo[tipo];

    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(action(id_terapia))
          .unwrap()
          .then(() => {
            Swal.fire(
              'Eliminado',
              `Terapia de ${title} eliminada exitosamente`,
              'success'
            );
            // Despacha la acción para actualizar la lista de terapias
            dispatch(fetchAction(id));
            setTerapiaModificada(true);
          })
          .catch((error) => {
            console.error(`Error al eliminar la terapia de ${title}:`, error);
            Swal.fire(
              'Error',
              `Hubo un error al intentar eliminar la terapia de ${title}.`,
              'error'
            );
          });
      }
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const archivoSeleccionado = e.target.files[0];
      setDocumento(archivoSeleccionado);
      setNombreArchivo(archivoSeleccionado.name);
    }
  };

  const handlePagoToggle = async (id_orden, estadoActual) => {
    try {
      const estado = parseInt(estadoActual);
      let nuevoEstado;
      console.log('estadoActual:', estadoActual)
      if (estado === 0) {
        console.log('entre a abonado')
        nuevoEstado = 2;
      } else if (estado === 2) {
        console.log('entre a pagado')
        nuevoEstado = 1;
      } else {
        console.log('entre a no pagado')
        nuevoEstado = 0;
      }

      console.log('nuevoEstado:', nuevoEstado)
      const payload = {
        pagado: nuevoEstado
      };
      console.log('payload:', payload)
      await dispatch(updateOrden({ id_orden, data: payload })).unwrap();
      dispatch(fetchOrdenesDelPaciente({
        id_paciente: id,
        page: currentPage,
        limit: 10,
      })).unwrap();

    } catch (err) {
      console.error('Error al actualizar el estado de pagado:', err);
    }
  }

  const handleFileUpload = (e) => {
    console.log("Enviar...");
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
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteDocumento(id_documento))
          .then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
              Swal.fire(
                'Eliminado',
                'Documento eliminado exitosamente',
                'success'
              );
              dispatch(fetchVerDocumentosSlice(id)); // Actualizar la lista de documentos
            } else {
              Swal.fire(
                'Error',
                'Hubo un error al intentar eliminar el documento.',
                'error'
              );
            }
          });
      }
    });
  };

  const handleDeleteOptometriaGeneral = (id_consulta) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteOptometriaGeneral(id_consulta))
          .then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
              Swal.fire(
                'Eliminado',
                'Consulta eliminada exitosamente',
                'success'
              );
              dispatch(fetchMostrarGeneral({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
            } else {
              Swal.fire(
                'Error',
                'Hubo un error al intentar eliminar la consulta.',
                'error'
              );
            }
          });
      }
    });
  };

  const handleDeleteBajaVision = (id_consulta) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DeleteBajaVision(id_consulta))
          .then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
              Swal.fire(
                'Eliminado',
                'Consulta eliminada exitosamente',
                'success'
              );
              dispatch(fetchMostrarBajaVision({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
            } else {
              Swal.fire(
                'Error',
                'Hubo un error al intentar eliminar la consulta.',
                'error'
              );
            }
          });
      }
    });
  };

  const handleDeleteConsultaGenerica = (id_consulta) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción a",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      console.log("result: ");
      console.log(result);
      if (result.isConfirmed) {
        console.log("elimando");

        dispatch(DeleteConsultaGenerica(id_consulta))
          .then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
              Swal.fire(
                'Eliminado',
                'Consulta eliminada exitosamente',
                'success'
              );
              dispatch(fetchMostrarConsultaGenerica({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
            } else {
              Swal.fire(
                'Error',
                'Hubo un error al intentar eliminar la consulta.',
                'error'
              );
            }
          });
      }
    });
  };

  const handleDeleteNeonatos = (id_consulta) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DeleteNeonatos(id_consulta))
          .then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
              Swal.fire(
                'Eliminado',
                'Consulta eliminada exitosamente',
                'success'
              );
              dispatch(fetchMostrarNeonatos({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
            } else {
              Swal.fire(
                'Error',
                'Hubo un error al intentar eliminar la consulta.',
                'error'
              );
            }
          });
      }
    });
  };

  const handleDeleteOrtoptica = (id_consulta) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DeleteOrtoptica(id_consulta))
          .then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
              Swal.fire(
                'Eliminado',
                'Consulta eliminada exitosamente',
                'success'
              );
              dispatch(fetchMostrarOrtoptica({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
            } else {
              Swal.fire(
                'Error',
                'Hubo un error al intentar eliminar la consulta.',
                'error'
              );
            }
          });
      }
    });
  };

  const handleDeletePediatrica = (id_consulta) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DeletePediatrica(id_consulta))
          .then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
              Swal.fire(
                'Eliminado',
                'Consulta eliminada exitosamente',
                'success'
              );
              dispatch(fetchMostrarPediatrica({ item: 'id_terapia', item2: 'paciente', valor: '0', valor2: id }));
            } else {
              Swal.fire(
                'Error',
                'Hubo un error al intentar eliminar la consulta.',
                'error'
              );
            }
          });
      }
    });
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
        await dispatch(fetchOrdenesDelPaciente({
          id_paciente: id,
          page: currentPage,
          limit: 10,
        })).unwrap();

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

  const handleEliminarCorrecionOrden = async (id_orden, index) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás recuperar esta corrección después de eliminarla!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await dispatch(deleteCorreccionesOrdenes(id_orden));
        await dispatch(fetchOrdenesDelPaciente({
          id_paciente: id,
          page: currentPage,
          limit: 10,
        })).unwrap();


        Swal.fire(
          'Eliminado!',
          'La corrección ha sido eliminada.',
          'success'
        );
      }
    } catch (error) {
      Swal.fire(
        'Error',
        'Hubo un problema al eliminar la corrección.',
        'error'
      );
    }
  };

  const handleVerOrden = async (id_orden) => {

    try {
      setIsCorreccion(false);
      setLoadingPdf(true)
      setShowOrden(true)
      const url = await dispatch(verOrdenPdf(id_orden))
      if (url) {
        setUrlPdfOrden(url.payload)
      } else {
        Swal.fire(
          'Error',
          'Hubo un problema al visualizar la orden.',
          'error'
        );
      }
    } catch (error) {
      console.log(error)
      Swal.fire(
        'Error',
        'Hubo un problema al visualizar la orden.',
        'error'
      );
      setLoadingPdf(false)
    }
    setLoadingPdf(false)
  }

  const handleVerCorrecion = async (id_correcion, numero_correcion) => {

    try {
      setLoadingPdf(true)
      setShowOrden(true)
      setIsCorreccion(true);
      setNumCorrecionActual(numero_correcion);
      dispatch(setOrderId(id_correcion));
      const url = await dispatch(verCorrecionPdf({ id_correcion, numero_correcion }))
      if (url) {
        setUrlPdfOrden(url.payload)
      } else {
        Swal.fire(
          'Error',
          'Hubo un problema al visualizar la orden.',
          'error'
        );
      }
    } catch (error) {
      console.log(error)
      Swal.fire(
        'Error',
        'Hubo un problema al visualizar la orden.',
        'error'
      );
      setLoadingPdf(false)
    }
    setLoadingPdf(false)
  }

  const handleOpenHistory = () => {
    setOpenHistory(true);
  };

  const handleCloseHistory = () => {
    setOpenHistory(false);
  };

  return (
    <div
      className="admin-data-content"
      style={{
        marginTop: '20px',
      }}
    >
      <div className="row layout-top-spacing">
        <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
          <div
            className="col-xl-12 col-lg-12 col-md-12 col-12 d-flex justify-content-start align-items-center"
            style={{ gap: '1rem', marginBottom: '0.5rem' }}
          >
            <div
              className="card"
              style={{
                width: '15rem',
                height: '3rem',
                padding: '0.5rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <div
                className="card-body"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.5rem' }}
              >
                <span style={{ fontSize: '1rem', fontWeight: 'bold', textAlign: 'center' }}>
                  {ordenes_tiempo || '0'} {'sin ordenes creadas'}
                </span>
              </div>
            </div>
            <div
              className="card"
              style={{
                width: '15rem',
                height: '3rem',
                padding: '0.5rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <div
                className="card-body"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.5rem' }}
              >
                <span style={{ fontSize: '1rem', fontWeight: 'bold', textAlign: 'center' }}>
                  {pacientes_consultas_tiempo || '0'} {'sin consultas creadas'}
                </span>
              </div>
            </div>
          </div>

          <div className="widget-content-area br-4" style={{ marginTop: '0' }}>
            <div className="widget-one">
              <div className="row">
                <div className="col-lg-12 layout-spacing" id="flFormsGrid">
                  <div className="statbox widget box box-shadow">

                    <div className="widget-header position-relative">
                      <div className="row">
                        <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                          <h4>
                            Historia Paciente
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div
                      className="position-absolute"
                      style={{
                        top: '10px',
                        right: '45px',
                        width: '480px',
                        maxHeight: '400px',
                        background: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,.1), 0 0 0 1px rgba(0,0,0,.05)',
                        zIndex: 10,
                        overflow: 'hidden',
                      }}
                    >
                      <InfiniteScrollList pacienteId={id} />
                    </div>

                    <Tooltip title="Ver historial completo">
                      <Button
                        size="small"
                        onClick={() => {
                          setIdPaciente(id);
                          handleOpenHistory();
                        }}
                        style={{
                          position: 'absolute',
                          top: 6,
                          right: 6,
                          zIndex: 10,
                          padding: '0 8px'
                        }}
                      >
                        📖
                      </Button>
                    </Tooltip>

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
                        </div>
                        <div className="form-row mb-4">
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
                          <div className="form-group col-md-4">
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
                          {/* <div className="form-group col-m d-3">
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
                          </div> */}
                        </div>

                        <div className="form-row mb-4">
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
                            <h4
                              onClick={() => console.log(usuario)}
                            >
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
                                        <td>
                                          {moment(OA.fecha_creacion).format('DD-MM-YYYY HH:mm')}
                                        </td>
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

                                          {
                                            funPermisosObtenidos(
                                              permisos,
                                              "historiapaciente.eliminarconsultaortoptica",
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
                                            )
                                          }


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
                                        <td>{moment(BV.fecha_creacion).format('DD-MM-YYYY HH:mm')}</td>
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
                                          {
                                            funPermisosObtenidos(
                                              permisos,
                                              "historiapaciente.eliminarconsultaabajavision",
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
                                            )
                                          }
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
                                CONSULTAS OPTOMETRÍA GENERAL:
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
                                        <td>
                                          {moment(RG.fecha_creacion).format('DD-MM-YYYY HH:mm')}
                                        </td>
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
                                          {
                                            funPermisosObtenidos(
                                              permisos,
                                              "historiapaciente.eliminarconsultaoptometriageneral",
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
                                            )
                                          }

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
                                CONSULTAS OPTOMETRÍA NEONATOS:
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
                                        <td>
                                          {moment(ON.fecha_creacion).format('DD-MM-YYYY HH:mm')}
                                        </td>
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

                                          {
                                            funPermisosObtenidos(
                                              permisos,
                                              "historiapaciente.eliminarconsultaoptometrianeonatos",
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
                                            )
                                          }



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
                                CONSULTAS OPTOMETRÍA PEDIATRICA:
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
                                        <td>
                                          {moment(OP.fecha_creacion).format('DD-MM-YYYY HH:mm')}
                                        </td>
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

                                          {
                                            funPermisosObtenidos(
                                              permisos,
                                              "historiapaciente.eliminarconsultaoptometriapediatrica",
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
                                            )
                                          }


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
                                        <td>
                                          {moment(CG.fecha_creacion).format('DD-MM-YYYY HH:mm')}
                                        </td>
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

                                          {
                                            funPermisosObtenidos(
                                              permisos,
                                              "historiapaciente.eliminarconsultagenerica",
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
                                            )
                                          }


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
                          {
                            funPermisosObtenidos(
                              permisos,
                              "historiapaciente.crearterapiabajavision",
                              <div className="col-md-3">
                                <form onSubmit={(e) => e.preventDefault()}>
                                  <button
                                    className="btn btn-success mb-4 ml-3 mt-4"
                                    onClick={() => handleCreateTerapias('bajaVision')}
                                  >
                                    Crear Terapia Baja Vision
                                  </button>
                                </form>
                              </div>
                            )
                          }

                          {age !== null && (
                            <>
                              {age <= 3 && (
                                <>
                                  {
                                    funPermisosObtenidos(
                                      permisos,
                                      "historiapaciente.crearterapiaoptometrianeonatos",
                                      <div className="col-md-3">
                                        <form onSubmit={(e) => e.preventDefault()}>
                                          <button
                                            className="btn btn-success mb-4 ml-3 mt-4"
                                            onClick={() => handleCreateTerapias('optometriaNeonatos')}
                                          >
                                            Crear Terapia Optometría Neonatos
                                          </button>
                                        </form>
                                      </div>
                                    )
                                  }
                                </>

                              )}
                              {age > 3 && age <= 18 && (
                                <>
                                  {
                                    funPermisosObtenidos(
                                      permisos,
                                      "historiapaciente.crearterapiaoptometriapediatrica",
                                      <div className="col-md-3">
                                        <form onSubmit={(e) => e.preventDefault()}>
                                          <button
                                            className="btn btn-success mb-4 ml-3 mt-4"
                                            onClick={() => handleCreateTerapias('optometriaPediatrica')}
                                          >
                                            Crear Terapia Optometría Pediatrica
                                          </button>
                                        </form>
                                      </div>
                                    )
                                  }
                                </>
                              )}
                              {age > 18 && (
                                <>
                                  {
                                    funPermisosObtenidos(
                                      permisos,
                                      "historiapaciente.crearterapiaoptometriaadultos",
                                      <div className="col-md-3">
                                        <form onSubmit={(e) => e.preventDefault()}>
                                          <button
                                            className="btn btn-success mb-4 ml-3 mt-4"
                                            onClick={() => handleCreateTerapias('ortopticaAdultos')}
                                          >
                                            Crear Terapia Ortoptica Adultos
                                          </button>
                                        </form>
                                      </div>
                                    )
                                  }
                                </>
                              )}
                              <>
                                {
                                  funPermisosObtenidos(
                                    permisos,
                                    "historiapaciente.crearorden",
                                    <div className="col-md-3">
                                      <Link
                                        to={"/create-orden"}
                                        state={{ id: id }}
                                        className="btn btn-success ml-3 mt-4"
                                      >
                                        Agregar Orden
                                      </Link>
                                    </div>
                                  )
                                }
                              </>
                            </>
                          )}
                        </div>

                        <div className="row">
                          {
                            terapias ?
                              terapias.length > 0 ? terapias?.map((terapia) => (
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

                                        {
                                          funPermisosObtenidos(
                                            permisos,
                                            "historiapaciente.eliminarterapia",
                                            <button
                                              className="btn btn-danger"
                                              onClick={() => handleDeleteTerapia('bajaVision', terapia.id_terapia)}
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
                                          )
                                        }


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
                                              {moment(terapia?.fecha_creacion).format('YYYY-MM-DD HH:mm:ss')}
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
                              )) : <div></div> : <div></div>
                          }
                        </div>

                        <div className="row">
                          {neonatos.map((terapia) => (
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

                                    {
                                      funPermisosObtenidos(
                                        permisos,
                                        "historiapaciente.eliminarterapianeonatos",
                                        <button
                                          className="btn btn-danger btn_eliminar_terapia btn_eliminar_terapiagopp"
                                          onClick={() => handleDeleteTerapia('optometriaNeonatos', terapia.id_terapia)}
                                          style={{
                                            marginBottom: '-80px',
                                            position: 'absolute',
                                            zIndex: '3',
                                            marginLeft: '420px',
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
                                      )
                                    }


                                    <h5 className="">
                                      Terapia Optometria Neonatos:
                                    </h5>
                                    <div className="rating-stars">
                                      <p>
                                        Cantidad de terapias realizadas <b>{terapia.cantidad}</b>
                                      </p>
                                      <p>
                                        Fecha de creación:
                                        <b>
                                          {moment(terapia?.fecha_creacion).format('YYYY-MM-DD HH:mm:ss')}
                                        </b>
                                      </p>
                                      <Link to={`/terapias-neonatos/${id}/${terapia.id_terapia}`}>
                                        <button className="btn btn-success mb-4 ml-3 mt-4">
                                          VER
                                        </button>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                          }
                        </div>

                        <div className="row">
                          {pediatrica.map((terapia) => (
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
                                    {
                                      funPermisosObtenidos(
                                        permisos,
                                        "historiapaciente.eliminaroptometriapediatrica",
                                        <button
                                          className="btn btn-danger btn_eliminar_terapia btn_eliminar_terapiagopp"
                                          onClick={() => handleDeleteTerapia('optometriaPediatrica', terapia.id_terapia)}
                                          style={{
                                            marginBottom: '-80px',
                                            position: 'absolute',
                                            zIndex: '3',
                                            marginLeft: '420px',
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
                                      )
                                    }

                                    <h5 className="">
                                      Terapia Optometria Pediatrica:
                                    </h5>
                                    <div className="rating-stars">
                                      <p>
                                        Cantidad de terapias realizadas <b>{terapia.cantidad}</b>
                                      </p>
                                      <p>
                                        Fecha de creación:
                                        <b>
                                          {moment(terapia?.fecha_creacion).format('YYYY-MM-DD HH:mm:ss')}
                                        </b>
                                      </p>
                                      <Link to={`/terapias-pediatrica/${id}/${terapia.id_terapia}`}>
                                        <button className="btn btn-success mb-4 ml-3 mt-4">
                                          VER
                                        </button>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                          }
                        </div>

                        <div className="row">
                          {ortoptica.map((terapia) => (
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
                                    {
                                      funPermisosObtenidos(
                                        permisos,
                                        "historiapaciente.eliminarterapiaortopticaadultos",
                                        <button
                                          className="btn btn-danger btn_eliminar_terapia btn_eliminar_terapiagopp"
                                          onClick={() => handleDeleteTerapia('ortopticaAdultos', terapia.id_terapia)}
                                          style={{
                                            marginBottom: '-80px',
                                            position: 'absolute',
                                            zIndex: '3',
                                            marginLeft: '420px',
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
                                      )
                                    }

                                    <h5 className="">
                                      Terapia Ortoptica Adultos:
                                    </h5>
                                    <div className="rating-stars">
                                      <p>
                                        Cantidad de terapias realizadas <b>{terapia.cantidad}</b>
                                      </p>
                                      <p>
                                        Fecha de creación:
                                        <b>
                                          {moment(terapia?.fecha_creacion).format('YYYY-MM-DD HH:mm:ss')}
                                        </b>
                                      </p>
                                      <Link to={`/terapias-ortoptica/${id}/${terapia.id_terapia}`}>
                                        <button className="btn btn-success mb-4 ml-3 mt-4">
                                          VER
                                        </button>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                          }
                        </div>

                        <div
                          className="widget-header mt-0"
                          style={{
                          }}
                        >
                          <div className="row">
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                              <h3>
                                SALDOS Y ANTICIPOS:
                              </h3>
                            </div>
                          </div>
                        </div>

                        <ResumenFinancieroPaciente resumen={resumenFinanciero} />

                        <div
                          className="widget-header mt-0"
                          style={{
                          }}
                        >
                          <div className="row">
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                              <h3>
                                ORDENES:
                              </h3>
                            </div>
                          </div>
                        </div>
                        {pacienteOrdenes.length > 0 && (
                          <div
                            className="card component-card_7 mb-4"
                            style={{
                              background: 'rgb(0 150 136 / 11%)', width: '96%'
                            }}
                          >
                            <h6 className="p-3">
                              ORDENES DEL PACIENTE:
                            </h6>
                            <div className="table-responsive-md">
                              {statusPacienteOrdenes === 'loading' && <p>Loading...</p>}
                              {statusPacienteOrdenes === 'failed' && <p>Error: {error}</p>}
                              {statusPacienteOrdenes === 'succeeded' && (
                                <table className="table dt-table-hover" id="zero-config" style={{ width: '100%', }}>
                                  <thead>
                                    <tr>
                                      <th
                                      >
                                        Nro
                                      </th>
                                      <th>
                                        Nro_Orden
                                      </th>
                                      <th>
                                        Pagado
                                      </th>
                                      <th>
                                        Fecha de creación
                                      </th>
                                      <th>
                                        Sucursal
                                      </th>
                                      <th className="no-content">
                                        Acción
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {pacienteOrdenes.map((pacienteOrden, index) => (
                                      <tr key={pacienteOrden.id_orden}>
                                        <td className="text-center">{index + 1}</td>
                                        <td>
                                          {pacienteOrden.nro_orden_id}
                                          {pacienteOrden.lente_contacto ? (
                                            <img
                                              src="/assets/img/recetas/lentesdecontacto.png"
                                              alt="Lente Contacto True"
                                              style={{ width: '20px', marginLeft: '8px' }}
                                            />
                                          ) : (
                                            <img
                                              src="/assets/img/recetas/lentenormal.png"
                                              alt="Lente Contacto False"
                                              style={{ width: '20px', marginLeft: '8px' }}
                                            />
                                          )}
                                        </td>
                                        <td>
                                          <button
                                            className={`btn btn-xs ${parseInt(pacienteOrden.pagado) === 1
                                              ? 'btn-success'
                                              : parseInt(pacienteOrden.pagado) === 2
                                                ? 'btn-warning'
                                                : 'btn-danger'
                                              }`}
                                            onClick={() => handlePagoToggle(pacienteOrden.id_orden, parseInt(pacienteOrden.pagado))}
                                            style={{ minWidth: '100px' }}
                                          >
                                            {parseInt(pacienteOrden.pagado) === 1
                                              ? 'pagado'
                                              : parseInt(pacienteOrden.pagado) === 2
                                                ? 'abonado'
                                                : 'Cortesia'}
                                          </button>
                                        </td>
                                        <td>{moment(pacienteOrden.created_at).format('DD/MM/YYYY')}</td>
                                        <td>{pacienteOrden?.sucursal?.nombre || ""}</td>
                                        <td style={{ display: 'flex', alignItems: 'center' }}>
                                          <button
                                            onClick={() => {
                                              if (pacienteOrden.es_correccion) {
                                                handleVerCorrecion(pacienteOrden.id, pacienteOrden.nro_orden_id);

                                              } else {
                                                handleVerOrden(pacienteOrden.id_orden)
                                              }
                                            }}
                                            className="btn btn-primary btnEditarConsultaCG btn mb-2 p-1 mr-2 rounded-circle"
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-pdf" viewBox="0 0 16 16">
                                              <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1" />
                                              <path d="M4.603 12.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.6 11.6 0 0 0-1.997.406 11.3 11.3 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.244.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 5.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z" />
                                            </svg>
                                          </button>
                                          <div>
                                            <Link
                                              to={
                                                pacienteOrden.es_correccion
                                                  ? `/correciones-ordenes/${pacienteOrden?.id}`
                                                  : `/orden-receta/${pacienteOrden.id_orden}/${pacienteOrden.nro_orden_id}/${pacienteOrden.id_paciente}`
                                              }
                                            >
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
                                          </div>

                                          {
                                            funPermisosObtenidos(
                                              permisos,
                                              "historiapaciente.eliminarorden",
                                              <button
                                                key={pacienteOrden.id_orden}
                                                onClick={() => {
                                                  if (pacienteOrden.es_correccion) {
                                                    handleEliminarCorrecionOrden(pacienteOrden.id)
                                                  } else {
                                                    handleEliminarOrden(pacienteOrden.id_orden)
                                                  }
                                                }}
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
                                            )
                                          }
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
                                        Nro Orden
                                      </th>
                                      <th>
                                        Pagado
                                      </th>
                                      <th>
                                        Fecha de creación
                                      </th>
                                      <th>
                                        Sucursal
                                      </th>
                                      <th className="no-content" />
                                    </tr>
                                  </tfoot>
                                </table>
                              )}
                            </div>
                            <PaginationOrdenesPacientes
                              meta={meta}
                              currentPage={currentPage}
                              totalPages={totalPages}
                              onPageChange={(handlePageChange)}
                            >

                            </PaginationOrdenesPacientes>
                          </div>
                        )}
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
                                        {nombreArchivo}
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

                              {/* Visualizar */}
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

                              {/* Descargar */}
                              <a
                                className="btn btn-primary"
                                download={doc.nombre}
                                href={`${doc.url}`}
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

                              {/* Eliminar */}
                              {
                                funPermisosObtenidos(
                                  permisos,
                                  "historiapaciente.eliminardocumentopaciente",
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
                                )
                              }


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
      <Modal
        open={showOrden}
        zIndex={1000000000}
        width={1600}
        closable={false}
        footer={null}
        height='100%'
        centered={false}
      >
        {
          loadingPdf
            ? <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Skeleton.Node
                active
                style={{
                  width: 1500,
                  height: 600,
                  marginBottom: '10px'
                }}
              >
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-pdf" viewBox="0 0 16 16">
                    <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1" />
                    <path d="M4.603 12.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.6 11.6 0 0 0-1.997.406 11.3 11.3 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.244.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 5.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z" />
                  </svg>
                </div>
              </Skeleton.Node>
            </div>
            : urlPdfOrden
              ? <iframe
                src={urlPdfOrden}
                title=""
                width="100%"
                height="800px"
                style={{ border: 'none' }}
              />
              : 'PDF no disponible'
        }

        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <button
            onClick={() => {
              setShowOrden(false)
              setUrlPdfOrden(null)
            }}
            className='btn btn-danger'
          >Cerrar</button>
        </div>
      </Modal>
      <DiagnosticosTableModal
        open={openHistory}
        onClose={handleCloseHistory}
        pacienteId={idPaciente}
      />

    </div >
  )
}
export default HistoriaPaciente