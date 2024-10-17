import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fetchLogin = createAsyncThunk(
  'auth/login',
  async (data) => {
    const response = await axios.post(`${API}/login`, data);
    console.log("response: --");
    console.log(response);

    return response.data;
  }
);

export const fetchValidarToken = createAsyncThunk(
  'auth/validar-user',
  async (data) => {
    const response = await axios.post(`${API}/validar-user`, { usuario: data });

    const rpta = response.data
    if (rpta) {
      // console.log("rpta.data.usuario.perfil ---");
      // console.log(rpta.data.usuario.perfil);
      // localStorage.setItem('perfil', rpta.data.usuario.perfil)
    }
    return rpta;
  }
);

export const validateUserAuth = createAsyncThunk(
  'auth-validate-auth',
  async (data) => {
    return true;
  }
);

// await fetch(config.api_public+'login',
//   {
//       mode:'cors',
//       method: 'POST',
//       headers: {
//           'Accept' 	   : 'application/json',
//           'Content-type' : 'application/json',
//       },
//       body: JSON.stringify(usu),
//   }
// )

const AuthSlice = createSlice({
  name: 'auth',
  initialState: {
    usuario: null,
    status: 'idle',
    error: null,
    permisos: [],
    fetchUsuario: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.status = 'loading';
        state.fetchUsuario = true;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.fetchUsuario = true;
        state.usuario = action.payload.data;
        state.permisos = action.payload.data.permisos;
        localStorage.setItem('id_usuario', action.payload.data.usuario.id_usuario)
        localStorage.setItem('token_user', action.payload.data.token)
        localStorage.setItem('usuario', action.payload.data.usuario.usuario)
        localStorage.setItem('nombre', action.payload.data.usuario.nombre)

      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.status = 'failed';
        state.fetchUsuario = true;
        state.error = action.error.message;
      })


      .addCase(fetchValidarToken.pending, (state) => {
        state.status = 'loading';
        state.fetchUsuario = true;
      })
      .addCase(fetchValidarToken.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.usuario = action.payload.data;
        state.permisos = action.payload.data.permisos;
        state.fetchUsuario = true;
        localStorage.setItem('id_usuario', action.payload.data.usuario.id_usuario)
        localStorage.setItem('token_user', action.payload.data.token)
        localStorage.setItem('usuario', action.payload.data.usuario.usuario)
        localStorage.setItem('nombre', action.payload.data.usuario.nombre)
        console.log("VALIDAR !");
      })

      .addCase(fetchValidarToken.rejected, (state, action) => {
        state.status = 'failed';
        state.fetchUsuario = true;
        state.error = action.error.message;
      })

      .addCase(validateUserAuth.fulfilled, (state, action) => {
        state.fetchUsuario = true;
      })
  },
});

export default AuthSlice.reducer;
