import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Fetch Terapias for a specific patient
export const fetchTerapiasOptometriaPediatrica = createAsyncThunk(
  'terapiaPediatrica/fetchTerapiasOptometriaPediatrica',
  async (id_paciente) => {
    const response = await axios.get(`${API}/terapias_optometria_pediatrica/${id_paciente}`);
    return response.data;
  }
);

// Async thunk for creating a new Terapia Baja Vision
export const createTerapiasOptometriaPediatrica = createAsyncThunk(
  'terapiaOptometriaPediatrica/createTerapiaOptometriaPediatrica',
  async (terapiaData) => {
    const response = await axios.post(`${API}/terapias_optometria_pediatrica`, terapiaData);
    return response.data;
  }
);

// Async thunk for editing an existing Terapia Baja Vision
export const editTerapiasOptometriaPediatrica = createAsyncThunk(
  'terapiasOptometriaPediatrica/editTerapiaOptometriaPediatrica',
  async ({ id_terapia, terapiaData }) => {
    const response = await axios.put(`${API}/terapias_optometria_pediatrica/${id_terapia}`, terapiaData);
    return response.data;
  }
);

export const deleteTerapiasOptometriaPediatrica = createAsyncThunk(
  'terapiaOptometriaPediatrica/deleteTerapiasOptometriaPediatrica',
  async (id_terapia, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API}/terapias_optometria_pediatrica/${id_terapia}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const TerapiaOptometriaPediatricaSlice = createSlice({
  name: 'terapiaPediatrica',
  initialState: {
    pediatrica: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTerapiasOptometriaPediatrica.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTerapiasOptometriaPediatrica.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pediatrica = action.payload.data;
      })
      .addCase(fetchTerapiasOptometriaPediatrica.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ? action.payload.error : action.error.message;
        state.pediatrica = [];
      })

      // Handling create
      .addCase(createTerapiasOptometriaPediatrica.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createTerapiasOptometriaPediatrica.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Optionally add the newly created therapy to the state
        state.pediatrica.push(action.payload.data[0]);
      })
      .addCase(createTerapiasOptometriaPediatrica.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.pediatrica = [];
      })
      // Handling edit
      .addCase(editTerapiasOptometriaPediatrica.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editTerapiasOptometriaPediatrica.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedTerapia = action.payload.data;
        const index = Array.isArray(state.pediatrica)
          ? state.pediatrica.findIndex(t => t.id_terapia === updatedTerapia.id_terapia)
          : -1;
        if (index !== -1) {
          state.pediatrica[index] = updatedTerapia;
        }
      })
      .addCase(editTerapiasOptometriaPediatrica.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.pediatrica = [];
      })

    builder.addCase(deleteTerapiasOptometriaPediatrica.fulfilled, (state, action) => {
      state.status = 'succeeded';
      // Filtra la terapia eliminada del estado
      state.pediatrica = state.pediatrica.filter(
        (terapia) => terapia.id_terapia !== action.meta.arg
      );
    })
    builder.addCase(deleteTerapiasOptometriaPediatrica.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
      state.pediatrica = [];
    });
  },
});

export default TerapiaOptometriaPediatricaSlice.reducer;
