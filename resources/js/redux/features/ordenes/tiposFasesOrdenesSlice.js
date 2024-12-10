import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fecthTiposFasesOrdenes = createAsyncThunk(
  'tiposFasesOrdenes/fecthTiposFasesOrdenes',
  async (idOrden) => {
    const response = await axios.get(`${API}/tipos-fases-ordenes/` + idOrden);

    return response.data;
  }
);


const tiposFasesOrdenesSlice = createSlice({
  name: 'tiposFasesOrdenes',
  initialState: {
    tiposFasesOrdenes: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fecthTiposFasesOrdenes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fecthTiposFasesOrdenes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tiposFasesOrdenes = action.payload.data;
      })
      .addCase(fecthTiposFasesOrdenes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  },
});

export default tiposFasesOrdenesSlice.reducer;
