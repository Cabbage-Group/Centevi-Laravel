import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';


export const fecthOrdenesPedidos = createAsyncThunk(
  'ordenesPedidos/fecthOrdenesPedidos',
  async ({
    page = '',
    limit = 20,
    sortOrder = 'desc',
    sortColumn = 'created_at',
    search = '',
    startDate = '',
    endDate = '',
    estado = '',
    proveedor = '',
  }) => {
    const fecha = startDate && endDate ? `${startDate} - ${endDate}` : '';
    const response = await axios.get(`${API}/pedidos/ordenes-pendientes`, {
      params:
      {
        page,
        limit,
        sortOrder,
        sortColumn,
        search,
        fecha,
        estado,
        proveedor
      },
    });
    return response.data;
  }
);

export const createOrdenesPedidos = createAsyncThunk(
  'ordenesPedidos/createOrdenesPedidos',
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/pedidos/crear`, values);
      return response.data;
    } catch (error) {
      console.error("Error creating pedido:", error.response?.data);
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createMermaPedidos = createAsyncThunk(
  'ordenesPedidos/createMermaPedidos',
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/pedidos/crear-merma`, values);
      return response.data;
    } catch (error) {
      console.error("Error creating merma:", error.response?.data);
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateMermas = createAsyncThunk(
  "ordenesPedidos/updateMermas",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API}/pedidos/mermas/update`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const ordenesPedidosSlice = createSlice({
  name: 'ordenesPedidos',
  initialState: {
    data: [],
    ordenesPedidos: [],
    totalPendientes: 0,
    totalRealizados: 0,
    orderId: null,
    meta: {},
    status: 'idle',
    search: '',
    error: null,
    sortOrder: 'desc',
    sortColumn: 'created_at',
    startDate: '',
    endDate: '',
  },
  reducers: {
    setOrden(state, action) {
      state.sortOrder = action.payload;
    },
    setOrdenPor(state, action) {
      state.sortColumn = action.payload;
    },
    setSearchOrdenesPedidos(state, action) {
      state.search = action.payload;
    },
    setFechaRangeOrdenesPedidos(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    setStatusLoadingOrdenesPedidos(state) {
      state.status = 'loading';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fecthOrdenesPedidos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fecthOrdenesPedidos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ordenesPedidos = action.payload.data;
        state.meta = action.payload.meta;
        state.totalPendientes = action.payload.meta.total_pendientes;
        state.totalRealizados = action.payload.meta.total_realizados;
        state.total = action.payload.meta.total;
      })
      .addCase(fecthOrdenesPedidos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createOrdenesPedidos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrdenesPedidos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const ordenesActualizadas = action.payload.ordenes ?? [];
        ordenesActualizadas.forEach((ordenActualizada) => {
          const idx = state.ordenesPedidos.findIndex(
            (o) => o.id_orden === ordenActualizada.id_orden
          );
          if (idx !== -1) {
            state.ordenesPedidos[idx] = ordenActualizada;
          }
        });
      })
      .addCase(createOrdenesPedidos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? action.error.message;
      })
      .addCase(createMermaPedidos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createMermaPedidos.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(createMermaPedidos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? action.error.message;
      })
      .addCase(updateMermas.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateMermas.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updateMermas.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? action.error.message;
      });
  },
});

export const {
  setOrden,
  setOrdenPor,
  setSearchOrdenesPedidos,
  setFechaRangeOrdenesPedidos,
  setStatusLoadingOrdenesPedidos,
} = ordenesPedidosSlice.actions;

export default ordenesPedidosSlice.reducer;