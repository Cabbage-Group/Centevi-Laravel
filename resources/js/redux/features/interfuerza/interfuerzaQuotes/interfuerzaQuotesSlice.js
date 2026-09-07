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

export const fetchInterfuerzaQuoteById = createAsyncThunk(
  'interfuerzaQuotes/fetchInterfuerzaQuoteById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/quotes/interfuerza/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const interfuerzaQuotesSlice = createSlice({
  name: 'interfuerzaQuotes',
  initialState: {
    interfuerzaQuotes: [],
    status: 'idle',
    error: null,
    quoteConsulta: {
      data: null,
      status: 'idle',
      error: null,
    },
  },
  reducers: {
    clearQuoteConsulta: (state) => {
      state.quoteConsulta = { data: null, status: 'idle', error: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createInterfuerzaQuotes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createInterfuerzaQuotes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.interfuerzaQuotes = action.payload.data;
      })
      .addCase(fetchInterfuerzaQuoteById.pending, (state) => {
        state.quoteConsulta.status = 'loading';
        state.quoteConsulta.error = null;
      })
      .addCase(fetchInterfuerzaQuoteById.fulfilled, (state, action) => {
        state.quoteConsulta.status = 'succeeded';
        state.quoteConsulta.data = action.payload;
      })
      .addCase(fetchInterfuerzaQuoteById.rejected, (state, action) => {
        state.quoteConsulta.status = 'failed';
        state.quoteConsulta.data = null;
        state.quoteConsulta.error = action.payload;
      });
  },
});

export const { clearQuoteConsulta } = interfuerzaQuotesSlice.actions;
export default interfuerzaQuotesSlice.reducer;