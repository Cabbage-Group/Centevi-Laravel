import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';

export const fetchKpis = createAsyncThunk(
  'kpis/fetchKpis',
  async ({
    sortOrder = 'asc',
    startDate = '', 
    endDate = ''}) => {
    try {
      const formattedStartDate = startDate ? `${startDate}-00:00` : '';
      const formattedEndDate = endDate ? `${endDate}-23:59` : '';
      const fecha = formattedStartDate && formattedEndDate ? `${formattedStartDate} - ${formattedEndDate}` : '';
      const params = { sortOrder, fecha };
      const response = await axios.get(`${API}/kpis`, {params});


      return response.data;
    } catch (error) {
      console.error('Error fetching Kpis:', error.response.data);
      throw error;
    }
  }
);

const kpisSlice = createSlice({
  name: 'kpis',
  initialState: {
    kpis: [],
    sortOrder: 'asc',
    status: 'idle',
    error: null,
    search: ''
  },
  reducers: {
    setFechaRange(state, action) {
        state.startDate = action.payload.startDate;
        state.endDate = action.payload.endDate;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKpis.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchKpis.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.kpis = action.payload.data;
      })
      .addCase(fetchKpis.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  },
});

export const {
  setSortOrder,
  setFechaRange
} = kpisSlice.actions;
export default kpisSlice.reducer;
