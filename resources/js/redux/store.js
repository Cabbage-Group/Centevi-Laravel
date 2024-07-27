import { configureStore } from '@reduxjs/toolkit';
import sucursalesReducer from './features/sucursales/sucursalesSlice';
import usuariosSlice from './features/usuarios/usuariosSlice';
import pacientesSlice from './features/pacientes/pacientesSlice';
import optometriaNeonatosReducer from './features/consultas/OptometriaNeonatosSlice';
import ultimaAtencionSlice from './features/ultimaAtencionSlice';
import OptometriaPediatricaSlice from './features/consultas/OptometriaPediatricaSlice';
import OrtopticaV_BSlice from './features/consultas/OrtopticaV_BSlice';
import OptometriaGeneralSlice from './features/consultas/OptomotriaGeneralSlice';

const store = configureStore({
        reducer: {
                sucursales: sucursalesReducer,
                usuarios: usuariosSlice,
                pacientes: pacientesSlice,
                optometriaNeonatos: optometriaNeonatosReducer,
                optometriaPediatrica: OptometriaPediatricaSlice ,
                ultimaAtencion: ultimaAtencionSlice,
                ortoptica: OrtopticaV_BSlice,
                optometriaGeneral: OptometriaGeneralSlice,
        },
});


export default store;