import { configureStore } from '@reduxjs/toolkit';
import sucursalesReducer from './features/sucursales/sucursalesSlice';
import usuariosSlice from './features/usuarios/usuariosSlice';
import pacientesSlice from './features/pacientes/pacientesSlice';
import HistoriaClinicaSlice from './features/consultas/HistoriaClinicaSlice';
import optometriaNeonatosReducer from './features/consultas/OptometriaNeonatosSlice';
import ultimaAtencionSlice from './features/reportes/ultimaAtencionSlice';
import OptometriaPediatricaSlice from './features/consultas/OptometriaPediatricaSlice';
import OrtopticaV_BSlice from './features/consultas/OrtopticaV_BSlice';
import OptometriaGeneralSlice from './features/consultas/OptomotriaGeneralSlice';
import consultasDiariasSlice from './features/reportes/consultasDiariasSlice';
import terapiasDiariasSlice from './features/reportes/terapiasDiariasSlice';
import pacientesSinAtencionSlice from './features/reportes/pacientesSinAtencionSlice';
import atendidosPorDiaSilce from './features/reportes/atendidosPorDiaSilce';
import VerPacienteSlice from './features/pacientes/VerPacienteSlice';
import EditarPacienteSlice from './features/pacientes/EditarPacienteSlice';
import MostrarOrtopticaSlice from './features/pacientes/MostrarOrtopticaSlice';
import MostrarBajaVisionSlice from './features/pacientes/MostrarBajaVisionSlice';
import MostrarGeneralSlice from './features/pacientes/MostrarGeneralSlice';
import MostrarNeonatosSlice from './features/pacientes/MostrarNeonatosSlice';
import MostrarPediatricaSlice from './features/pacientes/MostrarPediatricaSlice';
import MostrarConsultaGenerica from './features/pacientes/MostrarConsultaGenerica';
import crearPacientesSlice from './features/pacientes/crearPacientesSlice';
import recetasSlice from './features/recetas/recetasSlice';
import crearRecetasSlice from './features/recetas/crearRecetasSlice';
import VerOrtopticaSlice from './features/pacientes/VerOrtopticaSlice';
import EditarOrtopticaSlice from './features/consultas/EditarOrtopticaSlice';
import VerBajaVisionSlice from './features/pacientes/VerBajaVisionSlice';
import VerNeonatosSlice from './features/pacientes/VerNeonatosSlice';
import VerConsultaGenericaSlice from './features/pacientes/VerConsultaGenericaSlice';
import VerPediatricaSlice from './features/pacientes/VerPediatricaSlice';
import VerRefraccionGeneralSlice from './features/pacientes/VerRefraccionGeneralSlice';
import EditarBajaVisionSlice from './features/consultas/EditarBajaVisionSlice';
import EditarNeonatoSlice from './features/consultas/EditarNeonatoSlice';
import EditarPediatricaSlice from './features/consultas/EditarPediatricaSlice';
import EditarConsultaGenericaSlice from './features/consultas/EditarConsultaGenericaSlice';
import EditarGeneralSlice from './features/consultas/EditarGeneralSlice';
import verUnaRecetaSlice from './features/recetas/verUnaRecetaSlice';
import editarRecetasSlice from './features/recetas/editarRecetasSlice';
import DocumentosPacientesSlice from './features/documentos/DocumentosPacientesSlice';
import VerDocumentosSlice from './features/documentos/VerDocumentosSlice';
import terapiasBajaVisionSlice from './features/terapias/terapiasBajaVisionSlice';
import verUnaTerapiaBajaVisionSlice from './features/terapias/verUnaTerapiaBajaVisionSlice';
import terapiaSesionBajaVisionSlice from './features/terapias/terapiaSesionBajaVisionSlice';
import VerSesionTerapiaSlice from './features/terapias/VerSesionTerapiaSlice';
import EditarSesionTerapiaSlice from './features/terapias/EditarSesionTerapiaSlice';
import TerapiaOptometriaNeonatosSlice from './features/terapias/TerapiaOptometriaNeonatosSlice';
import TerapiaOptometriaPediatricaSlice from './features/terapias/TerapiaOptometriaPediatricaSlice';
import TerapiaOrtopticaAdultosSlice from './features/terapias/TerapiaOrtopticaAdultosSlice';
import verUnaTerapiaNeonatosSlice from './features/terapias/verUnaTerapiaNeonatosSlice';
import terapiaSesionNeonatosSlice from './features/terapias/terapiaSesionNeonatosSlice';
import VerSesionTerapiaNeonatoSlice from './features/terapias/VerSesionTerapiaNeonatoSlice';
import EditarSesionTerapiaNeonatoSlice from './features/terapias/EditarSesionTerapiaNeonatoSlice';
import verUnaTerapiaPediatricaSlice from './features/terapias/verUnaTerapiaPediatricaSlice';
import terapiaSesionPediatricaSlice from './features/terapias/terapiaSesionPediatricaSlice';
import VerSesionTerapiaPediatricaSlice from './features/terapias/VerSesionTerapiaPediatricaSlice';
import EditarSesionTerapiaPediatricaSlice from './features/terapias/EditarSesionTerapiaPediatricaSlice';
import verUnaTerapiaOrtopticaSlice from './features/terapias/verUnaTerapiaOrtopticaSlice';
import terapiaSesionOrtopticaSlice from './features/terapias/terapiaSesionOrtopticaSlice';
import VerSesionTerapiaOrtopticaSlice from './features/terapias/VerSesionTerapiaOrtopticaSlice';
import EditarSesionTerapiaOrtopticaSlice from './features/terapias/EditarSesionTerapiaOrtopticaSlice';
import proximasCitasSlice from './features/reportes/proximasCitasSlice';
import AuthSlice from './features/auth/AuthSlice';
import verTiposUsuariosSlice from './features/tipos-usuarios/verTiposUsuariosSlice';
import PermisosSlice from './features/permisos/PermisosSlice';
import TiposPermisosSlice from './features/tipos-permisos/TiposPermisosSlice';
import pacientesMenoresReducer from './features/pacientes/pacientesMenoresSlice';
import pacientesAdultosReducer from './features/pacientes/pacientesAdultosSlice';
import usuariosDoctorReducer from './features/usuarios/usuariosDoctorSlice';
import serviciosReducer from './features/servicios/serviciosSlice';
import serviciosRealizadosSlice from './features/reportes/serviciosRealizadosSlice';
import serviciosProximosReducer from './features/reportes/serviciosProximosSlice';
import ordenesSlice from './features/ordenes/ordenesSlice';
import tiposFasesOrdenesSlice from './features/ordenes/tiposFasesOrdenesSlice';
import fasesOrdenesSlice from './features/ordenes/fasesOrdenesSlice'
import reportesOrdenesSlice from './features/reportes/reporteOrdenesSlice'
import kpisSlice from './features/kpis/kpisSlice'
import correcionesordenesSlice from './features/correciones-ordenes/correcionesOrdenesSlice'
import correccionesFasesOrdenes from './features/correciones-ordenes/correccionesFasesOrdenesSlice'
import emailSlice from './features/email/emailSlice'
import cristalesSlice from './features/cristales/cristalesSlice'
import materialesSlice from './features/materiales/materialesSlice'
import tratamientosSlice from './features/tratamientos/tratamientosSlice'
import kpisConsultasTerapiasSlice from './features/kpis/kpisConsultasTerapias/kpisConsultasTerapiasSlice'
import kpisOrdenesSlice from './features/kpis/kpisOrdenes/kpisOrdenes'
import marcasSlice from './features/marcas/marcasSlice'
import kpisTipoLenteSlice from './features/kpis/kpisTiposLente/kpisTiposLente';
import tiposArosSlice from './features/tipos-aros/tiposArosSlice'
import kpisTiposCristales from './features/kpis/kpisTiposCristales/kpisTiposCristalesSlice';
import citasAgenda from './features/citas/CitasAgendaSlice';
import proveedorMaterialSlice from './features/proveedor-material/proveedorMaterialSlice';
import chat from './features/mensajes/mensajesSlice'


const store = configureStore({
  reducer: {
    sucursales: sucursalesReducer,
    usuarios: usuariosSlice,
    pacientes: pacientesSlice,
    auth: AuthSlice,
    recetas: recetasSlice,
    consultagenerica: HistoriaClinicaSlice,
    optometriaNeonatos: optometriaNeonatosReducer,
    optometriaPediatrica: OptometriaPediatricaSlice,
    ortoptica: OrtopticaV_BSlice,
    optometriaGeneral: OptometriaGeneralSlice,
    ultimaAtencion: ultimaAtencionSlice,
    consultasDiarias: consultasDiariasSlice,
    terapiasDiarias: terapiasDiariasSlice,
    pacientesSinAtencion: pacientesSinAtencionSlice,
    atendidosPorDia: atendidosPorDiaSilce,
    proximasCitas: proximasCitasSlice,
    verPaciente: VerPacienteSlice,
    editarPaciente: EditarPacienteSlice,
    mostrarOrtoptica: MostrarOrtopticaSlice,
    mostrarBajaVision: MostrarBajaVisionSlice,
    mostrarGeneral: MostrarGeneralSlice,
    mostrarNeonatos: MostrarNeonatosSlice,
    mostrarPediatrica: MostrarPediatricaSlice,
    mostrarConsultaGenerica: MostrarConsultaGenerica,
    crearPacientes: crearPacientesSlice,
    crearRecetas: crearRecetasSlice,
    verOrtoptica: VerOrtopticaSlice,
    editarOrtoptica: EditarOrtopticaSlice,
    verBajaVision: VerBajaVisionSlice,
    verNeonatos: VerNeonatosSlice,
    verConsultaGenerica: VerConsultaGenericaSlice,
    verPediatrica: VerPediatricaSlice,
    verRefraccionGeneral: VerRefraccionGeneralSlice,
    editarBajaVision: EditarBajaVisionSlice,
    editarNeonatos: EditarNeonatoSlice,
    editarPediatrica: EditarPediatricaSlice,
    editarConsultaGenerica: EditarConsultaGenericaSlice,
    editarGeneral: EditarGeneralSlice,
    verUnaReceta: verUnaRecetaSlice,
    editarReceta: editarRecetasSlice,
    subirDocumento: DocumentosPacientesSlice,
    verDocumento: VerDocumentosSlice,
    terapiasBajaVision: terapiasBajaVisionSlice,
    terapiaNeonatos: TerapiaOptometriaNeonatosSlice,
    terapiasPediatrica: TerapiaOptometriaPediatricaSlice,
    terapiasOrtoptica: TerapiaOrtopticaAdultosSlice,
    verTerapiaBajaVision: verUnaTerapiaBajaVisionSlice,
    verTerapiaNeonatos: verUnaTerapiaNeonatosSlice,
    verTerapiaPediatrica: verUnaTerapiaPediatricaSlice,
    verTerapiaOrtoptica: verUnaTerapiaOrtopticaSlice,

    sesionTerapiaBajaVision: terapiaSesionBajaVisionSlice,
    sesionTerapiaNeonatos: terapiaSesionNeonatosSlice,
    sesionTerapiaPediatrica: terapiaSesionPediatricaSlice,
    sesionTerapiaOrtoptica: terapiaSesionOrtopticaSlice,

    verSesionTerapia: VerSesionTerapiaSlice,
    verSesionTerapiaNeonato: VerSesionTerapiaNeonatoSlice,
    verSesionTerapiaPediatrica: VerSesionTerapiaPediatricaSlice,
    verSesionTerapiaOrtoptica: VerSesionTerapiaOrtopticaSlice,

    editarSesionTerapia: EditarSesionTerapiaSlice,
    editarSesionTerapiaNeonato: EditarSesionTerapiaNeonatoSlice,
    editarSesionTerapiaPediatrica: EditarSesionTerapiaPediatricaSlice,
    editarSesionTerapiaOrtoptica: EditarSesionTerapiaOrtopticaSlice,

    tiposUsuarios: verTiposUsuariosSlice,
    permisos: PermisosSlice,
    tiposPermisos: TiposPermisosSlice,
    pacientesMenores: pacientesMenoresReducer,
    pacientesAdultos: pacientesAdultosReducer,
    usuariosDoctor: usuariosDoctorReducer,

    servicios: serviciosReducer,

    serviciosRealizados: serviciosRealizadosSlice,

    serviciosProximos: serviciosProximosReducer,

    ordenes: ordenesSlice,

    fasesOrdenes: fasesOrdenesSlice,

    tiposFasesOrdenes: tiposFasesOrdenesSlice,

    reportesOrdenes: reportesOrdenesSlice,

    kpis: kpisSlice,

    correcionesordenes: correcionesordenesSlice,

    correccionesFasesOrdenes: correccionesFasesOrdenes,

    email: emailSlice,

    cristales: cristalesSlice,

    materiales: materialesSlice,

    tratamientos: tratamientosSlice,

    kpisConsultasTerapias: kpisConsultasTerapiasSlice,

    kpisOrdenes: kpisOrdenesSlice,

    marcas: marcasSlice,

    kpisTipoLente: kpisTipoLenteSlice,

    tiposAros: tiposArosSlice,

    kpisTiposCristales: kpisTiposCristales,

    citasAgenda: citasAgenda,

    proveedorMaterial: proveedorMaterialSlice,

    chat : chat


  }
});

export default store;