import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../../../config/config";

export const fetchBases = createAsyncThunk(
  "bases/fetchBases",
  async ({ search }) => {
    try {
      const response = await axios.get(`${API}/bases`, {
        params: {
          search: search || "",
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching bases:", error.response.data);
      throw error;
    }
  }
);

export const createBases = createAsyncThunk(
  "bases/createBases",
  async (values) => {
    try {
      const response = await axios.post(`${API}/bases`, values);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);

export const updateBases = createAsyncThunk(
  "bases/updateBases",
  async ({ id, values }) => {
    try {
      const response = await axios.put(`${API}/bases/${id}`, values);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);

export const deleteBases = createAsyncThunk(
  "bases/deleteBases",
  async (baseId) => {
    try {
      const response = await axios.delete(`${API}/bases/${baseId}`);
      return response;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);


const basesSlice = createSlice({
  name: "bases",
  initialState: {
    bases: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBases.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBases.fulfilled, (state, action) => {
        state.loading = false;
        state.bases = action.payload.data;
      })
      .addCase(fetchBases.rejected, (state, action) => {
        state.loading = true;
        state.error = action.error.message;
      })
      .addCase(createBases.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBases.fulfilled, (state, action) => {
        state.loading = false;
        state.bases.push(action.payload);
      })
      .addCase(createBases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBases.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBases.fulfilled, (state, action) => {
        state.loading = false;

        const updatedBase = action.payload.data;

        const index = state.bases.findIndex(
          (base) => base.id === Number(updatedBase.id)
        );

        if (index !== -1) {
          state.bases[index] = updatedBase;
        }
      })
      .addCase(updateBases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteBases.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBases.fulfilled, (state, action) => {
        state.loading = false;
        state.bases = state.bases.filter(
          (base) => base.id !== Number(action.payload.data.id)
        );
      })
      .addCase(deleteBases.rejected, (state, action) => {
        state.loading = true;
        state.error = action.error.message;
      })
  },
});

export default basesSlice.reducer;
