import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';


export const fetchObservacionesOrden = createAsyncThunk(
  'ordenObservaciones/fetchObservacionesOrden',
  async (ordenes_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/ordenes/${ordenes_id}/observaciones`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createObservacionOrden = createAsyncThunk(
  'ordenObservaciones/createObservacionOrden',
  async ({ ordenes_id, observacion, elaborado_por }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/ordenes/${ordenes_id}/observaciones`, {
        observacion,
        elaborado_por,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateObservacionOrden = createAsyncThunk(
  'ordenObservaciones/updateObservacionOrden',
  async ({ ordenes_id, id, observacion, elaborado_por }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API}/ordenes/${ordenes_id}/observaciones/${id}`, {
        observacion,
        elaborado_por,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteObservacionOrden = createAsyncThunk(
  'ordenObservaciones/deleteObservacionOrden',
  async ({ ordenes_id, id }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API}/ordenes/${ordenes_id}/observaciones/${id}`);
      return { id };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const ordenObservacionesSlice = createSlice({
  name: 'ordenObservaciones',
  initialState: {
    observaciones: [],
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
    clearObservaciones(state) {
      state.observaciones = [];
      state.statusFetch   = 'idle';
      state.errorFetch    = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchObservacionesOrden.pending, (state) => {
        state.statusFetch = 'loading';
        state.errorFetch  = null;
      })
      .addCase(fetchObservacionesOrden.fulfilled, (state, action) => {
        state.statusFetch   = 'succeeded';
        state.observaciones = action.payload.observaciones;
      })
      .addCase(fetchObservacionesOrden.rejected, (state, action) => {
        state.statusFetch = 'failed';
        state.errorFetch  = action.payload;
      })

      .addCase(createObservacionOrden.pending, (state) => {
        state.statusCreate = 'loading';
        state.errorCreate  = null;
      })
      .addCase(createObservacionOrden.fulfilled, (state, action) => {
        state.statusCreate = 'succeeded';
        state.observaciones.push(action.payload.observacion);
      })
      .addCase(createObservacionOrden.rejected, (state, action) => {
        state.statusCreate = 'failed';
        state.errorCreate  = action.payload;
      })

      .addCase(updateObservacionOrden.pending, (state) => {
        state.statusUpdate = 'loading';
        state.errorUpdate  = null;
      })
      .addCase(updateObservacionOrden.fulfilled, (state, action) => {
        state.statusUpdate = 'succeeded';
        const index = state.observaciones.findIndex(
          (obs) => obs.id === action.payload.observacion.id
        );
        if (index !== -1) {
          state.observaciones[index] = action.payload.observacion;
        }
      })
      .addCase(updateObservacionOrden.rejected, (state, action) => {
        state.statusUpdate = 'failed';
        state.errorUpdate  = action.payload;
      })

      // ← NUEVO
      .addCase(deleteObservacionOrden.pending, (state) => {
        state.statusDelete = 'loading';
        state.errorDelete  = null;
      })
      .addCase(deleteObservacionOrden.fulfilled, (state, action) => {
        state.statusDelete  = 'succeeded';
        state.observaciones = state.observaciones.filter(
          (obs) => obs.id !== action.payload.id
        );
      })
      .addCase(deleteObservacionOrden.rejected, (state, action) => {
        state.statusDelete = 'failed';
        state.errorDelete  = action.payload;
      });
  },
});

export const { clearObservaciones } = ordenObservacionesSlice.actions;
export default ordenObservacionesSlice.reducer;