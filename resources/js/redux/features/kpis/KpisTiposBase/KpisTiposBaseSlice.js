import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../../../../config/config";

export const fetchTiposBaseEstadistica = createAsyncThunk(
  "kpisTiposBase/fetchTiposBaseEstadistica",
  async () => {
    try {
      const response = await axios.post(`${API}/kpis/bases-ordenes`);
      return response.data;
    } catch (error) {
      console.error("Error fetching proveedor-material:", error.response.data);
      throw error;
    }
  }
);

export const fetchKpiTiposBaseTop10 = createAsyncThunk(
  "kpisTiposBase/fetchKpiTiposBaseTop10",
  async (filters) => {
    try {
      const response = await axios.post(
        `${API}/kpis/bases-ordenes`, 
        { 
          ...filters,
          limit: 10,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching proveedor-material:", error.response.data);
      throw error;
    }
  }
);

export const fetchKpiTiposBaseTop30 = createAsyncThunk(
  "kpisTiposBase/fetchKpiTiposBaseTop30",
  async (filters) => {
    try {
      const response = await axios.post(
        `${API}/kpis/bases-ordenes`, 
        { 
          ...filters,
          limit: 30,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching proveedor-material:", error.response.data);
      throw error;
    }
  }
);

export const fetchKpiTiposBaseTodos = createAsyncThunk(
  "kpisTiposBase/fetchKpiTiposBaseTodos",
  async (filters) => {
    try {
      const response = await axios.post(
        `${API}/kpis/bases-ordenes`, 
        filters,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching proveedor-material:", error.response.data);
      throw error;
    }
  }
);

const kpisTiposBaseSlice = createSlice({
  name: 'kpisTiposBase',
  initialState: {
    loading: false,
    kpiTiposBaseTop10: [],
    kpiTiposBaseTop30: [],
    kpiTiposBaseTodos: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTiposBaseEstadistica.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTiposBaseEstadistica.fulfilled, (state, action) => {
        state.loading = false;
        state.kpiTiposBaseTop10 = action.payload.data.slice(0, 10);
        state.kpiTiposBaseTop30 = action.payload.data.slice(0, 30);
        state.kpiTiposBaseTodos = action.payload.data;
      })
      .addCase(fetchTiposBaseEstadistica.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchKpiTiposBaseTop10.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchKpiTiposBaseTop10.fulfilled, (state, action) => {
        state.loading = false;
        state.kpiTiposBaseTop10 = action.payload.data;
      })
      .addCase(fetchKpiTiposBaseTop10.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchKpiTiposBaseTop30.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchKpiTiposBaseTop30.fulfilled, (state, action) => {
        state.loading = false;
        state.kpiTiposBaseTop30 = action.payload.data;
      })
      .addCase(fetchKpiTiposBaseTop30.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchKpiTiposBaseTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchKpiTiposBaseTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.kpiTiposBaseTodos = action.payload.data;
      })
      .addCase(fetchKpiTiposBaseTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export default kpisTiposBaseSlice.reducer;