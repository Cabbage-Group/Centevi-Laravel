import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../../../../config/config";

export const fetchReporteDiagnosticos = createAsyncThunk(
  "reporteDiagnosticos/fetchReporteDiagnosticos",
  async ({ startDate = "", endDate = "", page = 1, limit = 10 }) => {
    try {
      const params = { page, limit };
      if (startDate) params.desde = startDate;
      if (endDate) params.hasta = endDate;

      const response = await axios.get(`${API}/reportes/reporte-diagnosticos`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching reporteDiagnosticos:", error.response?.data || error.message);
      throw error;
    }
  }
);

const diagnosticosSlice = createSlice({
  name: "reporteDiagnosticos",
  initialState: {
    data: [],
    status: "idle",
    error: null,
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
    meta: {},
  },
  reducers: {
    setFechaRange(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
      state.page = 1; // resetear página al cambiar fechas
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReporteDiagnosticos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReporteDiagnosticos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchReporteDiagnosticos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.data = [];
        state.meta = {};
      });
  },
});

export const { setFechaRange, setPage } = diagnosticosSlice.actions;
export default diagnosticosSlice.reducer;
