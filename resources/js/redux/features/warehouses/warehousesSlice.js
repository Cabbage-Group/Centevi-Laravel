import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../../../config/config";

export const fetchWareHouses = createAsyncThunk(
  "warehouses/fetchWareHouses",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/warehouses/index`, {
        params: {
          page,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: "Error desconocido" });
      }
    }
  }
);

export const syncWarehouses = createAsyncThunk("warehouses/syncWarehouses", async () => {
  try {
    const response = await axios.post(`${API}/warehouses/sync`);
    console.log("response", response);
    return response.data.success;
  } catch (error) {
    if (error.response) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue({ message: "Error desconocido" });
    }
  }
});

export const updateSendDiscount = createAsyncThunk(
  "warehouses/updateSendDiscount",
  async ({ id, send_discount }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API}/warehouses/${id}/send-discount`, {
        send_discount,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Error desconocido" });
    }
  }
);

export const updateSucursalWareHouse = createAsyncThunk(
  "warehouses/updateSucursal",
  async ({ id, sucursal_id }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API}/warehouses/${id}/updateSucursal`, { sucursal_id });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Error desconocido" });
    }
  }
);

const warehousesSlice = createSlice({
  name: "warehouses",
  initialState: {
    warehouses: [],
    page: 1,
    limit: 18,
    total: 0,
    status_warehouses: "idle",
    status_updateSucursal: "idle",
    meta: {},
    error_warehouses: null,
    error_updateSucursal: null,
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWareHouses.pending, (state) => {
        state.status_warehouses = "loading";
      })
      .addCase(fetchWareHouses.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        state.status_warehouses = "succeeded";
        state.warehouses = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchWareHouses.rejected, (state, action) => {
        state.status_warehouses = "failed";
        state.error_warehouses = action.error.message;
      })
      .addCase(syncWarehouses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(syncWarehouses.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(syncWarehouses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateSendDiscount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSendDiscount.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updated = action.payload.data;
        state.warehouses = state.warehouses.map((w) => (w.id === updated.id ? updated : w));
      })
      .addCase(updateSendDiscount.rejected, (state, action) => {
        state.status = "failed";
        state.error_updateSucursal = action.error.message;
      })
      .addCase(updateSucursalWareHouse.pending, (state) => {
        state.status_updateSucursal = "loading";
      })
      .addCase(updateSucursalWareHouse.fulfilled, (state, action) => {
        state.status_updateSucursal = "succeeded";
        const updatedWarehouse = action.payload.data;
        state.warehouses = state.warehouses.map((w) =>
          w.id === updatedWarehouse.id ? updatedWarehouse : w
        );
      })
      .addCase(updateSucursalWareHouse.rejected, (state, action) => {
        state.status_updateSucursal = "failed";
        state.error_updateSucursal = action.error.message;
      });
  },
});

export const { setPage } = warehousesSlice.actions;
export default warehousesSlice.reducer;
