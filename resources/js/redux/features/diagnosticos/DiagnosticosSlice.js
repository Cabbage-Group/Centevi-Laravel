import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../../../config/config.js";

export const fectchDiagnosticos = createAsyncThunk("diagnosticos/fectchDiagnosticos", async () => {
  try {
    const response = await axios.get(`${API}/obtener-diagnosticos`);
    return response.data;
  } catch (error) {
    console.error("Error fetching servicios:", error.response.data);
    throw error;
  }
});

const diagnosticosSlice = createSlice({
  name: "diagnosticos",
  initialState: {
    diagnosticos: [],
    status: "idle",
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fectchDiagnosticos.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fectchDiagnosticos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.diagnosticos = action.payload.data;
        state.loading = false;
      })
      .addCase(fectchDiagnosticos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default diagnosticosSlice.reducer;
