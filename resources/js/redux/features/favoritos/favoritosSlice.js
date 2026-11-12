import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../../../config/config";

export const fetchFavoritos = createAsyncThunk("favoritos/fetchFavoritos", async (id_usuario) => {
  const response = await axios.get(`${API}/favoritos`, { params: { id_usuario } });
  return response.data.data;
});

export const toggleFavorito = createAsyncThunk(
  "favoritos/toggleFavorito",
  async ({ id_usuario, url, titulo, modulo }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/favoritos/toggle`, { id_usuario, url, titulo, modulo });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const favoritosSlice = createSlice({
  name: "favoritos",
  initialState: {
    items: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoritos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFavoritos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchFavoritos.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(toggleFavorito.fulfilled, (state, action) => {
        const { favorito, data } = action.payload;
        state.items = favorito
          ? [...state.items, data].sort((a, b) => a.titulo.localeCompare(b.titulo))
          : state.items.filter((f) => f.url !== data.url);
      });
  },
});

export default favoritosSlice.reducer;
