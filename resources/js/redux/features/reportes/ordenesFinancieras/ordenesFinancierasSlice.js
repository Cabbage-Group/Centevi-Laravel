import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../../../../config/config";

const buildParams = ({ desde, hasta, sucursal, fase, estadoFinanciero, search }) => {
  const params = {};
  if (desde) params.desde = desde;
  if (hasta) params.hasta = hasta;
  if (sucursal && sucursal !== "todas") params.sucursal = sucursal;
  if (fase) params.fase = fase;
  if (estadoFinanciero !== "" && estadoFinanciero !== undefined && estadoFinanciero !== null) {
    params.estado_financiero = estadoFinanciero;
  }
  if (search) params.search = search;
  return params;
};

// El signal permite abortar la petición anterior cuando cambia un filtro
export const fetchOrdenesFinancieras = createAsyncThunk(
  "reporteOrdenesFinancieras/fetch",
  async ({ filtros, page = 1, limit = 15 }, { signal, rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/reportes/ordenes-financieras`, {
        params: { ...buildParams(filtros), page, limit },
        signal,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchOpcionesOrdenesFinancieras = createAsyncThunk(
  "reporteOrdenesFinancieras/fetchOpciones",
  async () => {
    const response = await axios.get(`${API}/reportes/ordenes-financieras/opciones`);
    return response.data;
  }
);

// Trae todo lo filtrado (sin paginar) solo para exportar
export const fetchOrdenesFinancierasExport = async (filtros) => {
  const response = await axios.get(`${API}/reportes/ordenes-financieras`, {
    params: { ...buildParams(filtros), export: 1 },
  });
  return response.data.data;
};

const ordenesFinancierasSlice = createSlice({
  name: "reporteOrdenesFinancieras",
  initialState: {
    data: [],
    meta: { page: 1, limit: 15, total: 0, last_page: 1 },
    resumen: { total_cotizaciones: 0, total_aplicado: 0, saldo_por_cobrar: 0, total_ordenes: 0 },
    opciones: { sucursales: [], fases: [] },
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdenesFinancieras.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrdenesFinancieras.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.data;
        state.meta = action.payload.meta;
        state.resumen = action.payload.resumen;
      })
      .addCase(fetchOrdenesFinancieras.rejected, (state, action) => {
        // Una petición abortada no es un error: la siguiente ya está en curso
        if (action.meta.aborted) return;
        state.status = "failed";
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(fetchOpcionesOrdenesFinancieras.fulfilled, (state, action) => {
        state.opciones = action.payload;
      });
  },
});

export default ordenesFinancierasSlice.reducer;
