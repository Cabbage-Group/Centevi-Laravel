import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';


export const fetchCorreccionesObservacionesOrden = createAsyncThunk(
  'correccionesOrdenObservaciones/fetchCorreccionesObservacionesOrden',
  async (correccionOrderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/correciones-ordenes/${correccionOrderId}/observaciones`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCorreccionesObservacionOrden = createAsyncThunk(
  'correccionesOrdenObservaciones/createCorreccionesObservacionOrden',
  async ({ correccionOrderId, observacion, elaborado_por }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/correciones-ordenes/${correccionOrderId}/observaciones`, {
        observacion,
        elaborado_por,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCorreccionesObservacionOrden = createAsyncThunk(
  'correccionesOrdenObservaciones/updateCorreccionesObservacionOrden',
  async ({ correccionOrderId, id, observacion, elaborado_por }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API}/correciones-ordenes/${correccionOrderId}/observaciones/${id}`, {
        observacion,
        elaborado_por,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCorreccionesObservacionOrden = createAsyncThunk(
  'correccionesOrdenObservaciones/deleteCorreccionesObservacionOrden',
  async ({ correccionOrderId, id }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API}/correciones-ordenes/${correccionOrderId}/observaciones/${id}`);
      return { id };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const correccionesOrdenObservacionesSlice = createSlice({
  name: 'correccionesOrdenObservaciones',
  initialState: {
    correccionesObservaciones: [],
    statusFetch:   'idle',
    statusCreate:  'idle',
    statusUpdate:  'idle',
    statusDelete:  'idle',  
    errorFetch:    null,
    errorCreate:   null,
    errorUpdate:   null,
    errorDelete:   null,   
  },
  reducers: {
    clearCorreccionesObservaciones(state) {
      state.correccionesObservaciones = [];
      state.statusFetch   = 'idle';
      state.errorFetch    = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCorreccionesObservacionesOrden.pending, (state) => {
        state.statusFetch = 'loading';
        state.errorFetch  = null;
      })
      .addCase(fetchCorreccionesObservacionesOrden.fulfilled, (state, action) => {
        console.log('ction.payload.observaciones',action.payload.observaciones)
        state.statusFetch   = 'succeeded';
        state.correccionesObservaciones = action.payload.observaciones;
      })
      .addCase(fetchCorreccionesObservacionesOrden.rejected, (state, action) => {
        state.statusFetch = 'failed';
        state.errorFetch  = action.payload;
      })

      .addCase(createCorreccionesObservacionOrden.pending, (state) => {
        state.statusCreate = 'loading';
        state.errorCreate  = null;
      })
      .addCase(createCorreccionesObservacionOrden.fulfilled, (state, action) => {
        state.statusCreate = 'succeeded';
        state.correccionesObservaciones.push(action.payload.observacion);
      })
      .addCase(createCorreccionesObservacionOrden.rejected, (state, action) => {
        state.statusCreate = 'failed';
        state.errorCreate  = action.payload;
      })

      .addCase(updateCorreccionesObservacionOrden.pending, (state) => {
        state.statusUpdate = 'loading';
        state.errorUpdate  = null;
      })
      .addCase(updateCorreccionesObservacionOrden.fulfilled, (state, action) => {
        state.statusUpdate = 'succeeded';
        const index = state.correccionesObservaciones.findIndex(
          (obs) => obs.id === action.payload.observacion.id
        );
        if (index !== -1) {
          state.correccionesObservaciones[index] = action.payload.observacion;
        }
      })
      .addCase(updateCorreccionesObservacionOrden.rejected, (state, action) => {
        state.statusUpdate = 'failed';
        state.errorUpdate  = action.payload;
      })

      // ← NUEVO
      .addCase(deleteCorreccionesObservacionOrden.pending, (state) => {
        state.statusDelete = 'loading';
        state.errorDelete  = null;
      })
      .addCase(deleteCorreccionesObservacionOrden.fulfilled, (state, action) => {
        state.statusDelete  = 'succeeded';
        state.correccionesObservaciones = state.correccionesObservaciones.filter(
          (obs) => obs.id !== action.payload.id
        );
      })
      .addCase(deleteCorreccionesObservacionOrden.rejected, (state, action) => {
        state.statusDelete = 'failed';
        state.errorDelete  = action.payload;
      });
  },
});

export const { clearCorreccionesObservaciones } = correccionesOrdenObservacionesSlice.actions;
export default correccionesOrdenObservacionesSlice.reducer;