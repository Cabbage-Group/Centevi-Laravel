import { configureStore } from '@reduxjs/toolkit';
import sucursalesReducer from './features/sucursales/sucursalesSlice';
import usuariosSlice from './features/usuarios/usuariosSlice';
import pacientesSlice from './features/pacientes/pacientesSlice';
import optometriaNeonatosReducer from './features/consultas/OptometriaNeonatosSlice';
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