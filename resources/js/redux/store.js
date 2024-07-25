import { configureStore } from '@reduxjs/toolkit';
import sucursalesReducer from './features/sucursalesSlice';
import usuariosSlice from './features/usuariosSlice';
import pacientesSlice from './features/pacientesSlice';
import ultimaAtencionSlice from './features/ultimaAtencionSlice';
import consultasDiariasSlice from './features/consultasDiariasSlice';
import terapiasDiariasSlice from './features/terapiasDiariasSlice';
import pacientesSinAtencionSlice from './features/pacientesSinAtencionSlice';
import atendidosPorDiaSilce from './features/atendidosPorDiaSilce';

const store = configureStore({
    reducer: {
        sucursales: sucursalesReducer,
        usuarios: usuariosSlice,
        pacientes: pacientesSlice,
        ultimaAtencion: ultimaAtencionSlice,
        consultasDiarias: consultasDiariasSlice,
        terapiasDiarias: terapiasDiariasSlice,
        pacientesSinAtencion: pacientesSinAtencionSlice,
        atendidosPorDia: atendidosPorDiaSilce
    },
});


export default store;