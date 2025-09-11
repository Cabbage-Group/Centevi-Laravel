import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../../../config/config.js";

export const fectchDiagnosticos = createAsyncThunk(
  "diagnosticos/fectchDiagnosticos",
  async ({ search }) => {
    try {
      const response = await axios.get(`${API}/diagnosticos/obtener-diagnosticos`, {
        params: {
          search: search,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching diagnosticos:", error.response.data);
      throw error;
    }
  }
);

export const createDiagnosticos = createAsyncThunk(
  "diagnosticos/createDiagnosticos",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/diagnosticos/crearDiagnosticos`, data);
      Swal.fire({
        icon: "success",
        title: "Diagnostico creado",
        text: "El diagnostico se ha creado correctamente",
        confirmButtonColor: "#3085d6",
      });

      return response.data;
    } catch (error) {
      console.error("Error creating diagnostico:", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Hubo un error al crear el diagnostico",
        confirmButtonColor: "#d33",
      });

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateDiagnosticos = createAsyncThunk(
  "diagnosticos/updateDiagnosticos",
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API}/diagnosticos/${id}/actualizarDiagnosticos`, data);

      Swal.fire({
        icon: "success",
        title: "Diagnostico actualizado",
        text: "El Diagnostico se ha actualizado correctamente",
        confirmButtonColor: "#3085d6",
      });

      return response.data;
    } catch (error) {
      console.error("Error updating diagnostico:", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Hubo un error al actualizar el diagnostico",
        confirmButtonColor: "#d33",
      });

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteDiagnosticos = createAsyncThunk(
  "diagnosticos/deleteDiagnosticos",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API}/diagnosticos/${id}/eliminarDiagnosticos`);
      return response;
    } catch (error) {
      console.error("Error deleting Diagnostico:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const diagnosticosSlice = createSlice({
  name: "diagnosticos",
  initialState: {
    diagnosticos: [],
    options_diagnosticos: [],
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
        console.log(0, "Diagnosticos fetched successfully:", action.payload);
        state.status = "succeeded";
        state.diagnosticos = action.payload.data;
        state.options_diagnosticos = action.payload.data.map((diagnostico) => ({
          label: `${diagnostico.codigo} | ${diagnostico.diagnostico}`,
          value: diagnostico.id,
        }));
        state.loading = false;
      })
      .addCase(fectchDiagnosticos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(createDiagnosticos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createDiagnosticos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.diagnosticos.push(action.payload.data);
      })
      .addCase(createDiagnosticos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateDiagnosticos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateDiagnosticos.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.diagnosticos.findIndex(
          (diagnostico) => diagnostico.id === action.payload.data.id
        );
        if (index !== -1) {
          state.diagnosticos[index] = action.payload.data;
        }
      })
      .addCase(updateDiagnosticos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteDiagnosticos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteDiagnosticos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.diagnosticos = state.diagnosticos.filter(
          (diagnostico) => diagnostico.id !== Number(action.payload.data.id)
        );
      })

      .addCase(deleteDiagnosticos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default diagnosticosSlice.reducer;
