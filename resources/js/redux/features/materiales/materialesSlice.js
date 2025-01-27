import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fetchMateriales = createAsyncThunk(
  'materiales/fetchMateriales',
  async () => {
    try {
      const response = await axios.get(`${API}/materiales`);
      return response.data;
    } catch (error) {

      console.error('Error fetching materiales:', error.response.data);
      throw error;
    }
  }
);

export const createMateriales = createAsyncThunk(
  'materiales/createMateriales',
  async (values) => {
    try {
      const response = await axios.post(`${API}/materiales`, values);
      return response.data;
    } catch (error) {

      console.error('Error creating Materiales:', error.response.data);
      throw error;
    }
  }
);

export const updateMateriales = createAsyncThunk(
  'materiales/updateMateriales',
  async ({ id, ...values }) => {
    try {
      const response = await axios.put(`${API}/materiales/${id}`, values);

      return response.data;
    } catch (error) {
      console.error('Error updating Materiales:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const deleteMateriales = createAsyncThunk(
  'materiales/deleteMateriales',
  async (id) => {
    try {
      await axios.delete(`${API}/materiales/${id}`);
      return id;
    } catch (error) {
      console.error('Error deleting Materiales :', error.response.data);
      throw error;
    }
  }
);



const materialesSlice = createSlice({
  name: 'materiales',
  initialState: {
    materiales: [],
    materiales_options_selecteds: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMateriales.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMateriales.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.materiales = action.payload.data;

        state.materiales_options_selecteds = action.payload.data
          .filter(({ id, nombre }) => id && nombre)
          .map(({ id, nombre, ...rest }) => ({
            value: id,
            label: `${nombre}`,
            ...rest
          }));
      })
      .addCase(fetchMateriales.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createMateriales.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createMateriales.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.materiales.push(action.payload.data);
      })
      .addCase(createMateriales.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateMateriales.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateMateriales.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.materiales.findIndex(material => material.id === action.payload.data.id);
        if (index !== -1) {
          state.materiales[index] = action.payload.data;
        }
      })
      .addCase(updateMateriales.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteMateriales.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteMateriales.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.materiales = state.materiales.filter(material => material.id !== action.payload);
      })
      .addCase(deleteMateriales.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default materialesSlice.reducer; 