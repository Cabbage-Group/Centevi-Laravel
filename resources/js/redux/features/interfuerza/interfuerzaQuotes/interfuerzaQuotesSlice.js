import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../../config/config';


export const createInterfuerzaQuotes = createAsyncThunk(
  'interfuerzaQuotes/createInterfuerzaQuotes',
  async (data) => {
    try {
      const response = await axios.post(`${API}/quote/create`, data);


      return response.data;
    } catch (error) {
      console.error('Error fetching interfuerzaQuotes:', error.response.data);
      throw error;
    }
  }
);

const interfuerzaQuotesSlice = createSlice({
  name: 'interfuerzaQuotes',
  initialState: {
    interfuerzaQuotes: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createInterfuerzaQuotes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createInterfuerzaQuotes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.interfuerzaQuotes = action.payload.data;
      })

  },
});

export default interfuerzaQuotesSlice.reducer;
