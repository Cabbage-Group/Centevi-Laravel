import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';

export const fetchContactoCorreccionOrden = createAsyncThunk(
  'contactoCorreccionOrden/fetchContactoCorreccionOrden',
  async () => {
    try {
      const response = await axios.get(`${API}/cont-correccion-orden`);

      return response.data;
    } catch (error) {
      console.error('Error fetching ContactoOrden:', error.response.data);
      throw error;
    }
  }
);

export const createContactoCorreccionOrden = createAsyncThunk(
  'contactoCorreccionOrden/createContactoOrden',
  async (newContactoOrdenData) => {
    try {
      const response = await axios.post(`${API}/cont-correccion-orden`, newContactoOrdenData);
      return response.data;
    } catch (error) {
      console.error('Error creating ContactoOrden:', error.response.data);
      throw error;
    }
  }
);

const contactoCorreccionOrdenSlice = createSlice({
  name: 'contactoCorreccionOrden',
  initialState: {
    contactoCorreccionOrden: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactoCorreccionOrden.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchContactoCorreccionOrden.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contactoCorreccionOrden = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchContactoCorreccionOrden.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createContactoOrden.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createContactoOrden.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contactoCorreccionOrden.push(action.payload.data);
      })
      .addCase(createContactoOrden.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default contactoCorreccionOrdenSlice.reducer;
