import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fetchLogin = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/login`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || null);
    }
  }
);

export const fetchValidarToken = createAsyncThunk(
  'auth/validar-user',
  async (data) => {
    const response = await axios.post(`${API}/validar-user`, { usuario: data });

    const rpta = response
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
        const rpta = action.payload;
        state.error = rpta?.mensaje
          ? (rpta.mensaje_dev && typeof rpta.mensaje_dev === 'string' ? `${rpta.mensaje}. ${rpta.mensaje_dev}` : rpta.mensaje)
          : 'Error al ingresar, vuelve a intentarlo';
      })


      .addCase(fetchValidarToken.pending, (state) => {
        state.status = 'loading';
        state.fetchUsuario = true;
      })
      .addCase(fetchValidarToken.fulfilled, (state, action) => {
        const rpta = action.payload.data;
        const data = rpta.data;
        console.log("rpta:--------------------------");
        console.log(rpta);
        console.log(data);
        console.log("rpta:--------------------------");
        
        if (rpta.respuesta) {
          state.status = 'succeeded';
          state.usuario = data;
          state.permisos = data.permisos;
          state.fetchUsuario = true;
          localStorage.setItem('id_usuario', data.usuario.id_usuario)
          localStorage.setItem('token_user', data.token)
          localStorage.setItem('usuario', data.usuario.usuario)
          localStorage.setItem('nombre', data.usuario.nombre)
          console.log("VALIDAR !");
        } else {
          localStorage.clear()
        }

      })

      .addCase(fetchValidarToken.rejected, (state, action) => {
        state.status = 'failed';
        state.fetchUsuario = true;
        state.error = null;
        // Limpia token_user, usuario y demás datos de sesión
        localStorage.clear();
        if (window.location.pathname !== '/login') {
          window.location.replace('/login');
        }
      })

      .addCase(validateUserAuth.fulfilled, (state, action) => {
        state.fetchUsuario = true;
      })
  },
});

export default AuthSlice.reducer;
