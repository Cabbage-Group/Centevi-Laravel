import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../../../config/config.js";

export const fetchTratamientos = createAsyncThunk(
  "tratamientos/fetchTratamientos",
  async ({ search }) => {
    try {
      const response = await axios.get(`${API}/tratamientos`, {
        params: {
          search: search || "",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching tratamientos:", error.response.data);
      throw error;
    }
  }
);

export const createTratamientos = createAsyncThunk(
  "tratamientos/createTratamientos",
  async (values) => {
    try {
      const response = await axios.post(`${API}/tratamientos`, values);
      return response.data;
    } catch (error) {
      console.error("Error creating Tratamientos:", error.response.data);
      throw error;
    }
  }
);

export const updateTratamientos = createAsyncThunk(
  "tratamientos/updateTratamientos",
  async ({ id, ...values }) => {
    try {
      const response = await axios.put(`${API}/tratamientos/${id}`, values);

      return response.data;
    } catch (error) {
      console.error("Error updating Tratamientos:", error.response?.data || error.message);
      throw error;
    }
  }
);

export const deleteTratamientos = createAsyncThunk(
  "tratamientos/deleteTratamientos",
  async (id) => {
    try {
      await axios.delete(`${API}/tratamientos/${id}`);
      return id;
    } catch (error) {
      console.error("Error deleting Tratamientos :", error.response.data);
      throw error;
    }
  }
);

const tratamientosSlice = createSlice({
  name: "tratamientos",
  initialState: {
    tratamientos: [],
    tratamientos_options_selecteds: [],
    status_tratamientos: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTratamientos.pending, (state) => {
        state.status_tratamientos = true;
      })
      .addCase(fetchTratamientos.fulfilled, (state, action) => {
        state.status_tratamientos = false;
        state.tratamientos = action.payload.data;

        state.tratamientos_options_selecteds = action.payload.data
          .filter(({ id, nombre }) => id && nombre)
          .map(({ id, nombre, ...rest }) => ({
            value: id,
            label: `${nombre}`,
            ...rest,
          }));
      })
      .addCase(fetchTratamientos.rejected, (state, action) => {
        state.status_tratamientos = true;
        state.error = action.error.message;
      })
      .addCase(createTratamientos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createTratamientos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tratamientos.push(action.payload.data);
      })
      .addCase(createTratamientos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateTratamientos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTratamientos.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.tratamientos.findIndex(
          (tratamiento) => tratamiento.id === action.payload.data.id
        );
        if (index !== -1) {
          state.tratamientos[index] = action.payload.data;
        }
      })
      .addCase(updateTratamientos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteTratamientos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTratamientos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tratamientos = state.tratamientos.filter(
          (tratamiento) => tratamiento.id !== action.payload
        );
      })
      .addCase(deleteTratamientos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default tratamientosSlice.reducer;
