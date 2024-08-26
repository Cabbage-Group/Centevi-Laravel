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
    usuario: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.usuario = action.payload.data;
        // console.log("action.payload.data: ---");
        // console.log(action.payload.data);
        localStorage.setItem('token_user', action.payload.data.token)
        localStorage.setItem('usuario', action.payload.data.usuario.usuario)
        localStorage.setItem('nombre', action.payload.data.usuario.nombre)
        
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default AuthSlice.reducer;
