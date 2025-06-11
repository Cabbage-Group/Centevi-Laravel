import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';

export const fetchVentas = createAsyncThunk(
  'ventas/fetchVentas',
  async ({
    page = 1,
    limit = 10,
    sortOrder = 'asc',
    searchDateAbono = '',
    searchDateFactura = '',
    searchAbono = '',
    searchFactura = ''
    }) => {
    try {

      const response = await axios.get(`${API}/ventas`, {
        params: { 
          page, 
          limit, 
          sortOrder,
          searchDateAbono,
          searchDateFactura,
          searchAbono, 
          searchFactura
        }
      });


      return response.data;
    } catch (error) {
      console.error('Error fetching ventas:', error.response.data);
      throw error;
    }
  }
);

const ventasSlice = createSlice({
  name: 'ventas',
  initialState: {
    data: [],
    meta: {},
    status: 'idle',
    error: null,
    searchDateAbono: '',
    searchDateFactura: '',
    searchAbono: '',
    searchFactura: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVentas.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVentas.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchVentas.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

  },
});

export default ventasSlice.reducer;
