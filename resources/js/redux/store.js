import { configureStore } from '@reduxjs/toolkit';
import sucursalesReducer from './features/sucursalesSlice';
import usuariosSlice from './features/usuariosSlice';
import pacientesSlice from './features/pacientesSlice';

const store = configureStore({
    reducer: {
        sucursales: sucursalesReducer,
        usuarios: usuariosSlice,
        pacientes: pacientesSlice,
    },
});


export default store;