import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../../../config/config";

export const fetchMarcasOnefit = createAsyncThunk(
  "marcasOnefit/fetchMarcasOnefit",
  async ({ search = "" } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/marcas/onefit`, {
        params: {
          search: search || "",
        },
      });

      return response.data;
    } catch (error) {
      console.error(
        "Error fetching marcas OneFit:",
        error.response?.data || error.message
      );

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createMarcasOnefit = createAsyncThunk(
  "marcasOnefit/createMarcasOnefit",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/marcas/onefit`, values);

      return response.data;
    } catch (error) {
      console.error(
        "Error creating marca OneFit:",
        error.response?.data || error.message
      );

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateMarcasOnefit = createAsyncThunk(
  "marcasOnefit/updateMarcasOnefit",
  async ({ id, ...values }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API}/marcas/onefit/${id}`,
        values
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error updating marca OneFit:",
        error.response?.data || error.message
      );

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteMarcasOnefit = createAsyncThunk(
  "marcasOnefit/deleteMarcasOnefit",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API}/marcas/onefit/${id}`);

      return id;
    } catch (error) {
      console.error(
        "Error deleting marca OneFit:",
        error.response?.data || error.message
      );

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const marcasOnefitSlice = createSlice({
  name: "marcasOnefit",

  initialState: {
    marcas: [],
    marcas_one_fit_options_selecteds: [],
    status_marcas: false,
    status: "idle",
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchMarcasOnefit.pending, (state) => {
        state.status_marcas = true;
        state.error = null;
      })

      .addCase(fetchMarcasOnefit.fulfilled, (state, action) => {
        state.status_marcas = false;

        state.marcas = action.payload.data || [];

        state.marcas_one_fit_options_selecteds = state.marcas
          .filter(({ id, codigo, nombre }) => id && codigo && nombre)
          .map(({ id, codigo, nombre, ...rest }) => ({
            value: id,
            label: `${codigo} | ${nombre}`,
            ...rest,
          }));
      })

      .addCase(fetchMarcasOnefit.rejected, (state, action) => {
        state.status_marcas = false;
        state.error = action.payload || action.error.message;
      })

      // CREATE
      .addCase(createMarcasOnefit.pending, (state) => {
        state.status = "loading";
      })

      .addCase(createMarcasOnefit.fulfilled, (state, action) => {
        state.status = "succeeded";

        const marca = action.payload.data;

        state.marcas.push(marca);

        if (marca?.id && marca?.codigo && marca?.nombre) {
          state.marcas_one_fit_options_selecteds.push({
            value: marca.id,
            label: `${marca.codigo} | ${marca.nombre}`,
          });
        }
      })

      .addCase(createMarcasOnefit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // UPDATE
      .addCase(updateMarcasOnefit.pending, (state) => {
        state.status = "loading";
      })

      .addCase(updateMarcasOnefit.fulfilled, (state, action) => {
        state.status = "succeeded";

        const updatedMarca = action.payload.data;

        const index = state.marcas.findIndex(
          (marca) => marca.id === updatedMarca.id
        );

        if (index !== -1) {
          state.marcas[index] = updatedMarca;
        }

        const optionIndex = state.marcas_one_fit_options_selecteds.findIndex(
          (marca) => marca.value === updatedMarca.id
        );

        if (optionIndex !== -1) {
          state.marcas_one_fit_options_selecteds[optionIndex] = {
            value: updatedMarca.id,
            label: `${updatedMarca.codigo} | ${updatedMarca.nombre}`,
          };
        }
      })

      .addCase(updateMarcasOnefit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // DELETE
      .addCase(deleteMarcasOnefit.pending, (state) => {
        state.status = "loading";
      })

      .addCase(deleteMarcasOnefit.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.marcas = state.marcas.filter(
          (marca) => marca.id !== action.payload
        );

        state.marcas_one_fit_options_selecteds =
          state.marcas_one_fit_options_selecteds.filter(
            (marca) => marca.value !== action.payload
          );
      })

      .addCase(deleteMarcasOnefit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default marcasOnefitSlice.reducer;