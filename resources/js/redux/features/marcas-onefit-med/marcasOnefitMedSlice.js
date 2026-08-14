import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../../../config/config";

export const fetchMarcasOnefitMed = createAsyncThunk(
  "marcasOnefitMed/fetchMarcasOnefitMed",
  async ({ search = "" } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/marcas/onefit-med`, {
        params: {
          search: search || "",
        },
      });

      return response.data;
    } catch (error) {
      console.error(
        "Error fetching marcas OneFit Med:",
        error.response?.data || error.message
      );

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createMarcasOnefitMed = createAsyncThunk(
  "marcasOnefitMed/createMarcasOnefitMed",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API}/marcas/onefit-med`,
        values
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error creating marca OneFit Med:",
        error.response?.data || error.message
      );

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateMarcasOnefitMed = createAsyncThunk(
  "marcasOnefitMed/updateMarcasOnefitMed",
  async ({ id, ...values }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API}/marcas/onefit-med/${id}`,
        values
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error updating marca OneFit Med:",
        error.response?.data || error.message
      );

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteMarcasOnefitMed = createAsyncThunk(
  "marcasOnefitMed/deleteMarcasOnefitMed",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API}/marcas/onefit-med/${id}`);

      return id;
    } catch (error) {
      console.error(
        "Error deleting marca OneFit Med:",
        error.response?.data || error.message
      );

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const marcasOnefitMedSlice = createSlice({
  name: "marcasOnefitMed",

  initialState: {
    marcas: [],
    marcas_one_fit_med_options_selecteds: [],
    status_marcas: false,
    status: "idle",
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchMarcasOnefitMed.pending, (state) => {
        state.status_marcas = true;
        state.error = null;
      })

      .addCase(fetchMarcasOnefitMed.fulfilled, (state, action) => {
        state.status_marcas = false;

        state.marcas = action.payload.data || [];

        state.marcas_one_fit_med_options_selecteds = state.marcas
          .filter(({ id, codigo, nombre }) => id && codigo && nombre)
          .map(({ id, codigo, nombre, ...rest }) => ({
            value: id,
            label: `${codigo} | ${nombre}`,
            ...rest,
          }));
      })

      .addCase(fetchMarcasOnefitMed.rejected, (state, action) => {
        state.status_marcas = false;
        state.error = action.payload || action.error.message;
      })

      // CREATE
      .addCase(createMarcasOnefitMed.pending, (state) => {
        state.status = "loading";
      })

      .addCase(createMarcasOnefitMed.fulfilled, (state, action) => {
        state.status = "succeeded";

        const marca = action.payload.data;

        state.marcas.push(marca);

        if (marca?.id && marca?.codigo && marca?.nombre) {
          state.marcas_one_fit_med_options_selecteds.push({
            value: marca.id,
            label: `${marca.codigo} | ${marca.nombre}`,
          });
        }
      })

      .addCase(createMarcasOnefitMed.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // UPDATE
      .addCase(updateMarcasOnefitMed.pending, (state) => {
        state.status = "loading";
      })

      .addCase(updateMarcasOnefitMed.fulfilled, (state, action) => {
        state.status = "succeeded";

        const updatedMarca = action.payload.data;

        const index = state.marcas.findIndex(
          (marca) => marca.id === updatedMarca.id
        );

        if (index !== -1) {
          state.marcas[index] = updatedMarca;
        }

        const optionIndex = state.marcas_one_fit_med_options_selecteds.findIndex(
          (marca) => marca.value === updatedMarca.id
        );

        if (optionIndex !== -1) {
          state.marcas_one_fit_med_options_selecteds[optionIndex] = {
            value: updatedMarca.id,
            label: `${updatedMarca.codigo} | ${updatedMarca.nombre}`,
          };
        }
      })

      .addCase(updateMarcasOnefitMed.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // DELETE
      .addCase(deleteMarcasOnefitMed.pending, (state) => {
        state.status = "loading";
      })

      .addCase(deleteMarcasOnefitMed.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.marcas = state.marcas.filter(
          (marca) => marca.id !== action.payload
        );

        state.marcas_one_fit_med_options_selecteds =
          state.marcas_one_fit_med_options_selecteds.filter(
            (marca) => marca.value !== action.payload
          );
      })

      .addCase(deleteMarcasOnefitMed.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default marcasOnefitMedSlice.reducer;