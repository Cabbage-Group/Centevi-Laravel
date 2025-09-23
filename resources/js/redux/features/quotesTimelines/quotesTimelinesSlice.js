import API from '../../../config/config';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchQuotesTimelinesByQuoteId = createAsyncThunk(
  'quotesTimelines/fetchQuotesTimelinesByQuoteId',
  async (quoteId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/quote-timeline/for-quote/${quoteId}`);
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

export const createQuoteTimeline = createAsyncThunk(
  'quotesTimelines/createQuoteTimeline',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/quote-timeline`, data);
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

export const updateQuoteTimeline = createAsyncThunk(
  'quotesTimelines/updateQuoteTimeline',
  async ({ id, data }) => {
    try {
      const response = await axios.put(`${API}/quote-timeline/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating quote timeline: ', error.response.data);
      throw error;
    }
  }
);

export const deleteQuoteTimeline = createAsyncThunk(
  'quotesTimelines/deleteQuoteTimeline',
  async (id) => {
    try {
      const response = await axios.delete(`${API}/quote-timeline/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting quote timeline: ', error.response.data);
      throw error;
    }
  }
);

const quotesTimelinesSlice = createSlice({
  name: 'quotesTimelines',
  initialState: {
    quotes_timelines: [],
    fetch_status: 'idle',
    fetch_error: null,
    // total: 0,
    // created: {},
    create_status: 'idle',
    create_error: null,
    update_status: 'idle',
    update_error: null,
    delete_status: 'idle',
    delete_error: null,
  },
  reducers: {
    resetQuotesTimelinesState: (state) => {
      // Opción 1: resetear campo por campo
      state.quotes_timelines = [];
      state.fetch_status = 'idle';
      state.fetch_error = null;
      state.create_status = 'idle';
      state.create_error = null;
      state.update_status = 'idle';
      state.update_error = null;
      state.delete_status = 'idle';
      state.delete_error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuotesTimelinesByQuoteId.pending, (state) => {
        state.fetch_status = 'loading';
        state.fetch_error = null;
      })
      .addCase(fetchQuotesTimelinesByQuoteId.fulfilled, (state, action) => {
        state.fetch_status = 'succeeded';
        state.fetch_error = null;
        state.quotes_timelines = action.payload.data;
      })
      .addCase(fetchQuotesTimelinesByQuoteId.rejected, (state, action) => {
        state.fetch_status = 'failed';
        state.fetch_error = action.error.message;
      })
      .addCase(createQuoteTimeline.pending, (state) => {
        state.create_status = 'loading';
        state.create_error = null;
      })
      .addCase(createQuoteTimeline.fulfilled, (state, action) => {
        state.create_status = 'succeeded';
      })
      .addCase(createQuoteTimeline.rejected, (state, action) => {
        state.create_status = 'failed';
        state.create_error = action.error.message;
      })
      .addCase(updateQuoteTimeline.pending, (state) => {
        state.update_status = 'loading';
        state.update_error = null;
      })
      .addCase(updateQuoteTimeline.fulfilled, (state, action) => {
        state.update_status = 'succeeded';
      })
      .addCase(updateQuoteTimeline.rejected, (state, action) => {
        state.update_status = 'failed';
        state.update_error = action.error.message;
      })
      .addCase(deleteQuoteTimeline.pending, (state) => {
        state.delete_status = 'loading';
        state.delete_error = null;
      })
      .addCase(deleteQuoteTimeline.fulfilled, (state, action) => {
        state.delete_status = 'succeeded';
      })
      .addCase(deleteQuoteTimeline.rejected, (state, action) => {
        state.delete_status = 'failed';
        state.delete_error = action.error.message;
      })
  },
});

export const { resetQuotesTimelinesState } = quotesTimelinesSlice.actions;
export default quotesTimelinesSlice.reducer;