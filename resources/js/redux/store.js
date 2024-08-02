import { configureStore } from '@reduxjs/toolkit';
import sucursalesReducer from './features/sucursales/sucursalesSlice';
import usuariosSlice from './features/usuarios/usuariosSlice';
import pacientesSlice from './features/pacientes/pacientesSlice';
import optometriaNeonatosReducer from './features/consultas/OptometriaNeonatosSlice';
import ultimaAtencionSlice from './features/reportes/ultimaAtencionSlice';
import OptometriaPediatricaSlice from './features/consultas/OptometriaPediatricaSlice';
import OrtopticaV_BSlice from './features/consultas/OrtopticaV_BSlice';
import OptometriaGeneralSlice from './features/consultas/OptomotriaGeneralSlice';
import consultasDiariasSlice from './features/reportes/consultasDiariasSlice';
import terapiasDiariasSlice from './features/reportes/terapiasDiariasSlice';
import pacientesSinAtencionSlice from './features/reportes/pacientesSinAtencionSlice';
import atendidosPorDiaSilce from './features/reportes/atendidosPorDiaSlice';
import crearPacientesSlice from './features/pacientes/crearPacientesSlice';
import recetasSlice from './features/recetas/recetasSlice';
import crearRecetasSlice from './features/recetas/crearRecetasSlice';
import verUnaRecetaSlice from './features/recetas/verUnaRecetaSlice';

const store = configureStore({
        reducer: {
                sucursales: sucursalesReducer,
                usuarios: usuariosSlice,
                pacientes: pacientesSlice,
                recetas: recetasSlice,
                optometriaNeonatos: optometriaNeonatosReducer,
                optometriaPediatrica: OptometriaPediatricaSlice ,
                ortoptica: OrtopticaV_BSlice,
                optometriaGeneral: OptometriaGeneralSlice,
                ultimaAtencion: ultimaAtencionSlice,
                consultasDiarias: consultasDiariasSlice,
                terapiasDiarias: terapiasDiariasSlice,
                pacientesSinAtencion: pacientesSinAtencionSlice,
                atendidosPorDia: atendidosPorDiaSilce,
                crearPacientes: crearPacientesSlice,
                crearRecetas: crearRecetasSlice,
                verUnaReceta: verUnaRecetaSlice
                
        }
});


export default store;