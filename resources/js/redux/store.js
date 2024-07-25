import { configureStore } from '@reduxjs/toolkit';
import sucursalesReducer from './features/sucursalesSlice';
import usuariosSlice from './features/usuariosSlice';
import pacientesSlice from './features/pacientesSlice';
import ultimaAtencionSlice from './features/ultimaAtencionSlice';

const store = configureStore({
    reducer: {
        sucursales: sucursalesReducer,
        usuarios: usuariosSlice,
        pacientes: pacientesSlice,
        ultimaAtencion: ultimaAtencionSlice
    },
});


export default store;