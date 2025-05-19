import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../../config/config';
import { act } from 'react';


export const fetchInterfuerzaProducts = createAsyncThunk(
  'interfuerzaProducts/fetchInterfuerzaProducts',
  async ({ page = 1, field, operator, value }) => {
    try {
      const response = await axios.get(`${API}/products/get`,
        {
          params: {
            page: page,
            field: field,
            operator: operator,
            value: value
          }
        });
      const products = response.data;
      return products;
    } catch (error) {
      console.error('Error fetching interfuerza products:', error.response.data);
      throw error;
    }
  }
);

export const verifyInterfuerzaProducts = createAsyncThunk(
  'interfuerzaProducts/verifyInterfuerzaProducts',
  async (codigo, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/verify/products`, codigo);

      return response;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: 'Error desconocido' });
      }
    }
  }
);

export const deleteInterfuerzaProducts = createAsyncThunk(
  'interfuerzaProducts/deleteInterfuerzaProducts',
  async (__, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API}/delete/products`);

      return response;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: 'Error desconocido' });
      }
    }
  }
);

const interfuerzaProductsSlice = createSlice({
  name: 'interfuerzaProducts',
  initialState: {
    interfuerzaProducts: [],
    message: "",
    status_products: 'idle',
    error_products: null,
    page_products: 1,
    hasMore_products: true,
    totalInterfuerza: 0,
    exists_in_interfuerza: false,
    exists_in_local: false,
    page_interfuerza: 1
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterfuerzaProducts.pending, (state) => {
        state.status_products = 'loading';
      })
      .addCase(fetchInterfuerzaProducts.fulfilled, (state, action) => {
        state.status_products = 'succeeded';
        const meta = action.payload.meta
        state.interfuerzaProducts = action.payload.data
        state.total = meta.total;
        state.page_interfuerza = meta.page
      })
      .addCase(fetchInterfuerzaProducts.rejected, (state, action) => {
        state.status_products = 'failed';
        state.error_products = action.error.message;
      })
      .addCase(verifyInterfuerzaProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(verifyInterfuerzaProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.exists_in_interfuerza = action.payload.data.exists_in_interfuerza
        state.exists_in_local = action.payload.data.exists_in_local
      })
      .addCase(verifyInterfuerzaProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteInterfuerzaProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteInterfuerzaProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(deleteInterfuerzaProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  },
});

export default interfuerzaProductsSlice.reducer;
