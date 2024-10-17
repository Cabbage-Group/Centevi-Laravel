import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, Route, useNavigate } from 'react-router-dom'
import { fetchValidarToken, validateUserAuth } from '../redux/features/auth/AuthSlice';
import Login from '../components/auth/Login';

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    status,
    usuario,
    fetchUsuario
  } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token_user');
    if (token) {
      if (!usuario) {
        dispatch(fetchValidarToken(localStorage.getItem('usuario')));
      }
    } else {  
      dispatch(validateUserAuth())
      if(!usuario){
        navigate('/login');
      }else{
        navigate('/home');
      }
    }
  })

  return (
    fetchUsuario && usuario
      ? <Outlet />
      : <>
        
      </>
  )
}

export default ProtectedRoute