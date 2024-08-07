// src/slices/recetaSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fetchVerUnaReceta = createAsyncThunk(
  'receta/fetchReceta',
  async (id_receta) => {
    const response = await axios.get(`${API}/recetas/${id_receta}`);
   
    return response.data;
  }
);

const verUnaRecetaSlice = createSlice({
  name: 'verUnaReceta',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVerUnaReceta.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVerUnaReceta.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.data;
      })
      .addCase(fetchVerUnaReceta.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default verUnaRecetaSlice.reducer;
