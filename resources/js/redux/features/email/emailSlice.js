import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';

export const fetchEmail = createAsyncThunk(
  'email/fetchEmail',
  async ({ email }) => {
    try {
      const requestBody = { email };
      const response = await axios.post(`${API}/send-verification-email`, requestBody);
      return response.data;
    } catch (error) {
      console.error('Error fetching email:', error.response?.data || error.message);
      throw error;
    }
  }
);

const emailSlice = createSlice({
  name: 'email',
  initialState: {
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmail.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(fetchEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default emailSlice.reducer;
