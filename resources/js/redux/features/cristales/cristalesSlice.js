import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fetchCristales = createAsyncThunk(
  'cristales/fetchCristales',
  async ({ search }) => {
    try {
      const response = await axios.get(`${API}/cristales`, {
        params: {
          search: search || '',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Cristales:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const createCristales = createAsyncThunk(
  'cristales/createCristales',
  async (values) => {
    try {
      const response = await axios.post(`${API}/cristales`, values);
      return response.data;
    } catch (error) {

      console.error('Error creating Cristales:', error.response.data);
      throw error;
    }
  }
);

export const updateCristales = createAsyncThunk(
  'cristales/updateCristales',
  async ({ id, ...values }) => {
    try {
      const response = await axios.put(`${API}/cristales/${id}`, values);

      return response.data;
    } catch (error) {
      console.error('Error updating Cristales:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const deleteCristales = createAsyncThunk(
  'cristales/deleteCristales',
  async (id_orden) => {
    try {
      await axios.delete(`${API}/cristales/${id_orden}`);
      return id_orden;
    } catch (error) {
      console.error('Error deleting Cristales :', error.response.data);
      throw error;
    }
  }
);


const cristalesSlice = createSlice({
  name: 'cristales',
  initialState: {
    cristales: [],
    cristales_options_selecteds: [],
    status_cristales: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCristales.pending, (state) => {
        state.status_cristales = true;
      })
      .addCase(fetchCristales.fulfilled, (state, action) => {
        state.status_cristales = false;
        state.cristales = action.payload.data;

        state.cristales_options_selecteds = action.payload.data
          .filter(({ id, codigo, nombre }) => id && codigo && nombre)
          .map(({ id, codigo, nombre, ...rest }) => ({
            value: id,
            label: `${codigo} | ${nombre}`,
            ...rest
          }));
      })
      .addCase(fetchCristales.rejected, (state, action) => {
        state.status_cristales = true;
        state.error = action.error.message;
      })
      .addCase(createCristales.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCristales.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cristales.push(action.payload.data);
      })
      .addCase(createCristales.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateCristales.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCristales.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.cristales.findIndex(cristal => cristal.id === action.payload.data.id);
        if (index !== -1) {
          state.cristales[index] = action.payload.data;
        }
      })
      .addCase(updateCristales.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteCristales.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCristales.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cristales = state.cristales.filter(cristal => cristal.id !== action.payload);
      })
      .addCase(deleteCristales.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default cristalesSlice.reducer; 