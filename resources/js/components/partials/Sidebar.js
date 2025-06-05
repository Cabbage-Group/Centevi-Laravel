import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import ValidarPermisos from '../../utils/ValidarPermisos';
import { fetchValidarToken, validateUserAuth } from '../../redux/features/auth/AuthSlice';
import getIp from '../../redux/features/utils/getIp';
import { fetchConversations } from '../../redux/features/mensajes/mensajesSlice';
import MenuResponsive from './MenuResponsive';
import MenuWeb from './MenuWeb';
import { Grid } from 'antd';

const { useBreakpoint } = Grid;

const Sidebar = (props) => {
  const screens = useBreakpoint();

  const id_usuario = localStorage.getItem("id_usuario");
  const { component } = props
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    usuario,
    permisos,
    fetchUsuario
  } = useSelector((state) => state.auth);


  const [selectPacientes, setSelectPacientes] = useState(false);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const conversationsLength = useSelector((state) => state.chat.conversationsLength);

  console.log('conversationsLength:', conversationsLength)

  useEffect(() => {
    dispatch(fetchConversations(Number(id_usuario)));
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token_user');
    if (token) {
      if (!usuario) {
        dispatch(fetchValidarToken(localStorage.getItem('usuario')));
      }
    } else {
      dispatch(validateUserAuth())
      if (!usuario) {
        navigate('/login');
      } else {
        navigate('/home');
      }
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingRoutes(true);
    }, 3000); // 3 segundos

    // Limpieza: limpiar el timeout cuando el componente se desmonte
    return () => clearTimeout(timer);
  }, []);

  useEffect(async () => {
    const IP = await getIp();
  }, [])

  return (
    true == true ? (

      <div>
        {screens.md ? (
          <MenuWeb
            component={component}
            fetchUsuario={fetchUsuario}
            ValidarPermisos={ValidarPermisos}
          />
        ) : (
          <MenuResponsive
            component={component}
            fetchUsuario={fetchUsuario}
            ValidarPermisos={ValidarPermisos}
          />
        )}
      </div>
    ) : (
      <div>

      </div>
    )
  )
}




export default Sidebar