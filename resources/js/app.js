require('./bootstrap');
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login.js';
import Sidebar from './components/partials/sidebar.js';
import Sucursales from './admin/sucursales/Sucursales.js';
import BajaVision from './admin/consulta/BajaVision.js';
import OptometriaGeneral from './admin/consulta/OptometriaGeneral.js';
import OrtopticaVisionBinocular from './admin/consulta/OrtopticaVisionBinocular.js';
import HistoriaClinica from './admin/consulta/HistoriaClinica.js';
import OptometriaNeonatos from './admin/consulta/OptometriaNeonatos.js';
import OptometriaPediatra from './admin/consulta/OptometriaPediatra.js';
import CrearPaciente from './admin/Paciente/CrearPaciente.js';
import Usuarios from './admin/usuarios/Usuarios.js';
import Home from './components/pages/Home.js';
import Navbar from './components/partials/Navbar.js';
import ListaPaciente from './admin/Paciente/ListaPaciente.js';
import VerRecetas from './admin/recetas/VerRecetas.js';
import CrearReceta from './admin/recetas/CrearReceta.js';
import SinAtencion from './admin/reportes/SinAtencion.js';
import UltimaAtencion from './admin/reportes/UltimaAtencion.js';
import PacienteAtendidoDia from './admin/reportes/PacienteAtendidoDia.js';
import ConsultasDiarias from './admin/reportes/ConsultasDiarias.js';
import TerapiasDiarias from './admin/reportes/TerapiasDiarias.js'
import VerReportes from './admin/reportes/VerReportes.js';
import HistoriaPaciente from './admin/Paciente/HistoriaPaciente.js';
import EditarPaciente from './admin/Paciente/EditarPaciente.js';
import VerOrtoptica from './admin/Paciente/VerOrtoptica.js';
import EditarOrtoptica from './admin/consulta/EditarOrtoptica.js';
import VerBajaVision from './admin/Paciente/VerBajaVision.js';
import VerNeonatos from './admin/Paciente/VerNeonatos.js';
import VerConsultaGenerica from './admin/Paciente/VerConsultaGenerica.js';
import VerPediatrica from './admin/Paciente/VerPediatrica.js';
import VerRefraccionGeneral from './admin/Paciente/VerRefraccionGeneral.js';
import EditarBajaVision from './admin/consulta/EditarBajaVision.js';
import EditarNeonatos from './admin/consulta/EditarNeonatos.js';
import EditarPediatra from './admin/consulta/EditarPediatra.js';
import EditarConsultaGenerica from './admin/consulta/EditarConsultaGenerica.js';
import EditarGeneral from './admin/consulta/EditarGeneral.js';
import SelectReceta from './admin/recetas/SelectReceta.js';
import EditarReceta from './admin/recetas/EditarReceta.js';
import TerapiasBajaVision from './admin/terapias/terapiasBajaVision.js';
import VerSesionTerapia from './admin/terapias/VerSesionTerapia.js';
import EditarSesionTerapia from './admin/terapias/EditarSesionTerapia.js';
import TerapiasNeonatos from './admin/terapias/terapiasNeonatos.js';
import VerSesionTerapiaNeonato from './admin/terapias/VerSesionTerapiaNeonato.js';
import EditarSesionTerapiaNeonato from './admin/terapias/EditarSesionTerapiaNeonato.js';
import TerapiasPediatrica from './admin/terapias/terapiasPediatrica.js';
import VerSesionTerapiaPediatrica from './admin/terapias/VerSesionTerapiaPediatrica.js';
import EditarSesionTerapiaPediatrica from './admin/terapias/EditarSesionTerapiaPediatrica.js';
import TerapiasOrtoptica from './admin/terapias/terapiasOrtoptica.js';
import VerSesionTerapiaOrtoptica from './admin/terapias/VerSesionTerapiaOrtoptica.js';
import EditarSesionTerapiaOrtoptica from './admin/terapias/EditarSesionTerapiaOrtoptica.js';
import ProximasCitas from './admin/reportes/ProximasCitas.js';

function AppRouter() {
    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/sidebar" element={<Sidebar />} />
                    <Route path="/navbar" element={<Navbar />} />
                    <Route path="/home" element={<Sidebar component={<Home />} />} />
                    <Route path="/sucursales" element={<Sidebar component={<Sucursales />} />} />

                    <Route path="/editar-bajaVision/:id/:id_consulta" element={<Sidebar component={<EditarBajaVision/>} />} />
                    <Route path="/ver-bajaVision/:id/:id_consulta" element={<Sidebar component={<VerBajaVision/>} />} />
                    <Route path="/baja-vision" element={<Sidebar component={<BajaVision />} />} />
                    
                    <Route path="/ver-refraccion/:id/:id_consulta" element={<Sidebar component={<VerRefraccionGeneral />} />} />
                    <Route path="/editar-OptometriaGeneral/:id/:id_consulta" element={<Sidebar component={<EditarGeneral />} />} />
                    <Route path="/optometria-general" element={<Sidebar component={<OptometriaGeneral />} />} />

                    <Route path="/historia-clinica" element={<Sidebar component={<HistoriaClinica />} />} />
                    <Route path="/editar-ConsultaGenerica/:id/:id_consulta" element={<Sidebar component={<EditarConsultaGenerica />} />} />

                    <Route path="/editar-neonato/:id/:id_consulta" element={<Sidebar component={<EditarNeonatos />} />} />
                    <Route path="/ver-neonatos/:id/:id_consulta" element={<Sidebar component={<VerNeonatos />} />} />
                    <Route path="/optometria-neonatos" element={<Sidebar component={<OptometriaNeonatos />} />} />

                    <Route path="/ver-pediatrica/:id/:id_consulta" element={<Sidebar component={<VerPediatrica />} />} />
                    <Route path="/editar-pediatrica/:id/:id_consulta" element={<Sidebar component={<EditarPediatra />} />} />
                    <Route path="/optometria-pediatra" element={<Sidebar component={<OptometriaPediatra />} />} />

                    <Route path="/crear-paciente" element={<Sidebar component={<CrearPaciente />} />} />
                    <Route path="/usuarios" element={<Sidebar component={<Usuarios />} />} />
                    <Route path="/lista-pacientes" element={<Sidebar component={<ListaPaciente />} />} />
                    <Route path="/historia-paciente/:id" element={<Sidebar component={<HistoriaPaciente />} />} />
                    <Route path="/editar-paciente/:id" element={<Sidebar component={<EditarPaciente />} />} />

                    <Route path="/ver-ortoptica/:id/:id_consulta" element={<Sidebar component={<VerOrtoptica />} />} />
                    <Route path="/editar-ortoptica/:id/:id_consulta" element={<Sidebar component={<EditarOrtoptica/>} />} />
                    <Route path="/vision-binocular" element={<Sidebar component={<OrtopticaVisionBinocular />} />} />

                    <Route path="/recetas" element={<Sidebar component={<VerRecetas />} />} />
                    <Route path="/crear-receta" element={<Sidebar component={<CrearReceta />} />} />
                    <Route path="/select-receta/:id_receta" element={<Sidebar component={<SelectReceta />} />} />
                    <Route path="/editar-receta/:id_receta" element={<Sidebar component={<EditarReceta />} />} />

                    <Route path="/reportes" element={<Sidebar component={<VerReportes />} />} />
                    <Route path="/reportes-sin-atencion" element={<Sidebar component={<SinAtencion />} />} />
                    <Route path="/reportes-ultima-atencion" element={<Sidebar component={<UltimaAtencion />} />} />
                    <Route path="/paciente-atendido-dia" element={<Sidebar component={<PacienteAtendidoDia />} />} />
                    <Route path="/consultas-diarias" element={<Sidebar component={<ConsultasDiarias />} />} />
                    <Route path="/terapias-diarias" element={<Sidebar component={<TerapiasDiarias />} />} />
                    <Route path="/proximas-citas" element={<Sidebar component={<ProximasCitas />} />} />

                    <Route path="/ver-sesion-terapia/:id_paciente/:id_terapia/:id_sesion" element={<Sidebar component={<VerSesionTerapia/>} />} />
                    <Route path="/ver-sesion-terapia-pediatrica/:id_paciente/:id_terapia/:id_sesion" element={<Sidebar component={<VerSesionTerapiaPediatrica/>} />} />
                    <Route path="/ver-sesion-terapia-neonato/:id_paciente/:id_terapia/:id_sesion" element={<Sidebar component={<VerSesionTerapiaNeonato/>} />} />
                    <Route path="/ver-sesion-terapia-ortoptica/:id_paciente/:id_terapia/:id_sesion" element={<Sidebar component={<VerSesionTerapiaOrtoptica/>} />} />

                    <Route path="/editar-sesion-terapia/:id_paciente/:id_terapia/:id_sesion" element={<Sidebar component={<EditarSesionTerapia/>} />} />
                    <Route path="/editar-sesion-terapia-pediatrica/:id_paciente/:id_terapia/:id_sesion" element={<Sidebar component={<EditarSesionTerapiaPediatrica/>} />} />
                    <Route path="/editar-sesion-terapia-neonato/:id_paciente/:id_terapia/:id_sesion" element={<Sidebar component={<EditarSesionTerapiaNeonato/>} />} />
                    <Route path="/editar-sesion-terapia-ortoptica/:id_paciente/:id_terapia/:id_sesion" element={<Sidebar component={<EditarSesionTerapiaOrtoptica/>} />} />

                    <Route path="/ver-consultagenericas/:id/:id_consulta" element={<Sidebar component={<VerConsultaGenerica />} />} />

                    <Route path="/terapias-bajavision/:id/:id_terapia" element={<Sidebar component={<TerapiasBajaVision/>} />} />
                    <Route path="/terapias-neonatos/:id/:id_terapia" element={<Sidebar component={<TerapiasNeonatos/>} />} />
                    <Route path="/terapias-ortoptica/:id/:id_terapia" element={<Sidebar component={<TerapiasOrtoptica/>} />} />
                    <Route path="/terapias-pediatrica/:id/:id_terapia" element={<Sidebar component={<TerapiasPediatrica/>} />} />

                </Routes>
            </Router>
        </Provider>
    );
}

ReactDOM.render(<AppRouter />, document.getElementById('app'));


