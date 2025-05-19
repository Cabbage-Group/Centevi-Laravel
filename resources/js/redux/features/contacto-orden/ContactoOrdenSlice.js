import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';

export const fetchContactoOrden = createAsyncThunk(
  'contactoOrden/fetchContactoOrden',
  async () => {
    try {
      const response = await axios.get(`${API}/contacto-orden`);

      return response.data;
    } catch (error) {
      console.error('Error fetching ContactoOrden:', error.response.data);
      throw error;
    }
  }
);

export const createContactoOrden = createAsyncThunk(
  'contactoOrden/createContactoOrden',
  async (newContactoOrdenData) => {
    try {
      const response = await axios.post(`${API}/contacto-orden`, newContactoOrdenData);
      return response.data;
    } catch (error) {
      console.error('Error creating ContactoOrden:', error.response.data);
      throw error;
    }
  }
);

const contactoOrdenSlice = createSlice({
  name: 'ContactoOrden',
  initialState: {
    contactoOrden: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactoOrden.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchContactoOrden.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contactoOrden = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchContactoOrden.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createContactoOrden.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createContactoOrden.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contactoOrden.push(action.payload.data);
      })
      .addCase(createContactoOrden.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default contactoOrdenSlice.reducer;
