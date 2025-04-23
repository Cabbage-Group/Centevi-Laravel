// redux/slices/quotesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';


export const fetchQuotes = createAsyncThunk(
    'quotes/fetchQuotes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API}/obtener/quotes/centevi`);
            console.log('response:', response)
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
        console.log('data:', data)
        try {
            const response = await axios.post(`${API}/crear/quote/centevi`, data);
            console.log('response:', response)
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

export const VerUnaQuote = createAsyncThunk(
    'quotes/VerUnaQuote',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API}/ver/quote/centevi/${id}`);
            console.log('response:', response)
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
            console.log('response:', response)
            return response.data.conversion_rates.PAB;
        } catch (error) {
            return rejectWithValue({ message: 'Error al obtener la tasa de cambio' });
        }
    }
);

const quotesSlice = createSlice({
    name: 'quotes',
    initialState: {
        data: [],
        quotes: [],
        quote: {},
        status: 'idle',
        status_create: 'idle',
        exchangeRate: null,
        exchangeRateStatus: 'idle',
        error: null,
        errorCreate: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuotes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchQuotes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.quotes = action.payload.data;

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
                state.quotes = action.payload

            })
            .addCase(createQuotes.rejected, (state, action) => {
                console.log('action:', action.payload)
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
            }); 3
    },
});

export default quotesSlice.reducer;

