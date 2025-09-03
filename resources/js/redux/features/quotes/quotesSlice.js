import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';
import { message } from 'laravel-mix/src/Log';

export const fetchQuotes = createAsyncThunk(
  'quotes/fetchQuotes',
  async ({ page = 1, limit = 18, sortColumn = 'created_at', sortOrder = 'desc', searchTerm }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/obtener/quotes/centevi`, {
        params: {
          page,
          limit,
          sortColumn,
          sortOrder,
          searchTerm
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: 'Error desconocido' });
      }
    }
  }
);


export const createQuotes = createAsyncThunk(
  'quotes/createQuotes',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/crear/quote/centevi`, data);
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: 'Error desconocido' });
      }
    }
  }
);

export const verCotizacionPdf = createAsyncThunk(
  'quotes/viewPdf',
  async (id, { rejectWithValue }) => {
    let urlPdf = null;
    try {
      const response = await axios.get(`${API}/quote/pdf/${id}`, {  
        responseType: 'blob' 
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      urlPdf = url;
    } catch (error) {
      console.error('Error al visualizar la cotización:', error.response?.data);
      return rejectWithValue(error.response?.data || 'Error al obtener PDF');
    }
    return urlPdf;
  }
);

export const VerUnaQuote = createAsyncThunk(
  'quotes/VerUnaQuote',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/ver/quote/centevi/${id}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: 'Error desconocido' });
      }
    }
  }
);

export const updateEstadoQuote = createAsyncThunk(
  'quotes/updateEstadoQuote',
  async ({ id, data }) => {
    try {
      const response = await axios.put(`${API}/update/quote/centevi/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating quote:', error.response.data);
      throw error;
    }
  }
);

export const fetchExchangeRate = createAsyncThunk(
  'quotes/fetchExchangeRate',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://v6.exchangerate-api.com/v6/055cfd817c849596fb5c49e7/latest/USD`);
      return response.data.conversion_rates.PAB;
    } catch (error) {
      return rejectWithValue({ message: 'Error al obtener la tasa de cambio' });
    }
  }
);

export const findQuotesByIdAndUpdate = createAsyncThunk(
  'quotes/findQuotesByIdAndUpdate',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/verify/quotes`, data);
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: 'Error desconocido' });
      }

    }

  }
)

const quotesSlice = createSlice({
  name: 'quotes',
  initialState: {
    data: [],
    quotes: [],
    quote: {},
    page: 1,
    limit: 18,
    sortColumn: 'created_at',
    sortOrder: 'desc',
    total: 0,
    status: 'idle',
    meta: {},
    searchTerm: '',
    status_create: 'idle',
    exchangeRate: null,
    exchangeRateStatus: 'idle',
    error: null,
    errorCreate: null,
    codigoInterfuerzaList: [],
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSort: (state, action) => {
      console.log('action2', action.payload)
      state.sortColumn = action.payload.sortColumn;
      state.sortOrder = action.payload.sortOrder;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuotes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuotes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quotes = action.payload.data;
        state.meta = action.payload.meta
        state.codigoInterfuerzaList = action.payload.data.map(quote => quote.codigo_interfuerza);
      })
      .addCase(fetchQuotes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createQuotes.pending, (state) => {
        state.status_create = 'loading';
      })
      .addCase(createQuotes.fulfilled, (state, action) => {
        state.status_create = 'succeeded';
      })
      .addCase(createQuotes.rejected, (state, action) => {
        state.status_create = 'failed';
        state.errorCreate = action.error.message;
      })
      .addCase(fetchExchangeRate.pending, (state) => {
        state.exchangeRateStatus = 'loading';
      })
      .addCase(fetchExchangeRate.fulfilled, (state, action) => {
        state.exchangeRateStatus = 'succeeded';
        state.exchangeRate = action.payload;
      })
      .addCase(fetchExchangeRate.rejected, (state, action) => {
        state.exchangeRateStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(VerUnaQuote.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(VerUnaQuote.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quote = action.payload;

      })
      .addCase(VerUnaQuote.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateEstadoQuote.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateEstadoQuote.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedQuote = action.payload.quote;

        state.quotes = state.quotes.map(quote =>
          quote.id === updatedQuote.id ? { ...quote, ...updatedQuote } : quote
        );
      })
      .addCase(updateEstadoQuote.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(findQuotesByIdAndUpdate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(findQuotesByIdAndUpdate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // const updatedQuote = action.payload.quote;

        // state.quotes = state.quotes.map(quote =>
        //   quote.id === updatedQuote.id ? { ...quote, ...updatedQuote } : quote
        // );
      })
      .addCase(findQuotesByIdAndUpdate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  },
});


export const { setPage, setSort, setSearchTerm } = quotesSlice.actions;
export default quotesSlice.reducer;

