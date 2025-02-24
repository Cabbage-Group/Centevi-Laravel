import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// export const fecthOrdenes = createAsyncThunk(
//   'ordenes/fecthordenes',
//   async ({
//     page = '',
//     limit = 10000000000000,
//     sortOrder = 'desc',
//     sortColumn = 'created_at',
//     search = '',
//     status = '',
//     lenteContacto = '',
//     pagado = '',
//     sucursal = '',
//     laboratorio = '',
//     fase = '',
//     startDate = '',
//     endDate = '',
//   }) => {
//     const fecha = startDate && endDate ? `${startDate} - ${endDate}` : '';

//     const response = await axios.post(`${API}/verOrdenes`,
//       {
//         page,
//         limit,
//         sortOrder,
//         sortColumn,
//         search,
//         fecha,
//         pagado,
//         sucursal,
//         status,
//         lenteContacto,
//         laboratorio,
//         fase
//       },);
//     return response.data;
//   }
// );

export const fecthOrdenes = createAsyncThunk(
  'ordenes/fecthordenes',
  async ({
    page = '',
    limit = 20,
    sortOrder = 'desc',
    sortColumn = 'created_at',
    search = '',
    estados = '',
    lenteContacto = '',
    pagado = '',
    sucursal = '',
    laboratorio = '',
    fase = '',
    startDate = '',
    endDate = '',
  }) => {
    const fecha = startDate && endDate ? `${startDate} - ${endDate}` : '';

    const response = await axios.post(`${API}/obtener-ordenes`,
      {
        page,
        limit,
        sortOrder,
        sortColumn,
        search,
        fecha,
        pagado,
        sucursal,
        estados,
        lenteContacto,
        laboratorio,
        fase
      },);
    return response.data;
  }
);


export const createOrdenes = createAsyncThunk(
  'ordenes/createOrdenes',
  async (data) => {
    try {
      const response = await axios.post(`${API}/ordenes`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating orden:', error.response.data);
      throw error;
    }
  }
);

export const deleteOrdenes = createAsyncThunk(
  'ordenes/deleteOrden',
  async (id_orden) => {
    try {
      await axios.delete(`${API}/ordenes/${id_orden}`);
      return id_orden;
    } catch (error) {
      console.error('Error deleting orden:', error.response.data);
      throw error;
    }
  }
);

export const verOrdenPdf = createAsyncThunk(
  'ordenes/viewPdf',
  async (id_orden, { rejectWithValue }) => {
    let urlPdf = null
    try {
      const response = await axios.get(`${API}/ordenes/pdf/${id_orden}`, {
        responseType: 'blob',
      })
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      urlPdf = url
    } catch (error) {
      console.error('Error al visualizar la orden:', error.response?.data)
      return rejectWithValue(error.response?.data || 'Error al obtener PDF')
    }
    return urlPdf
  }
);

export const verCorrecionPdf = createAsyncThunk(
  'ordenes/coreccion/viewPdf',
  async ({ id_correcion, numero_correcion }, { rejectWithValue }) => {

    let urlPdf = null
    try {
      const response = await axios.get(`${API}/ordenes/correcion/pdf/${id_correcion}/${numero_correcion}`, {
        responseType: 'blob',
      })
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      urlPdf = url
    } catch (error) {
      console.error('Error al visualizar la orden:', error.response?.data)
      return rejectWithValue(error.response?.data || 'Error al obtener PDF')
    }
    return urlPdf
  }
);

export const verOrdenPdfSize = createAsyncThunk(
  'ordenes/viewPdf',
  async (id_orden, { rejectWithValue }) => {
    let urlPdf = null
    try {
      const response = await axios.get(`${API}/ordenes/pdf/size/${id_orden}`, {
        responseType: 'blob',
      })
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      urlPdf = url
    } catch (error) {
      console.error('Error al visualizar la orden:', error.response?.data)
      return rejectWithValue(error.response?.data || 'Error al obtener PDF')
    }
    return urlPdf
  }
);

export const verOrdenPdfSmall = createAsyncThunk(
  'ordenes/viewPdf',
  async (id_orden, { rejectWithValue }) => {
    let urlPdf = null
    try {
      const response = await axios.get(`${API}/ordenes/pdf/small/${id_orden}`, {
        responseType: 'blob',
      })
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      urlPdf = url
    } catch (error) {
      console.error('Error al visualizar la orden:', error.response?.data)
      return rejectWithValue(error.response?.data || 'Error al obtener PDF')
    }
    return urlPdf
  }
);


export const updateOrden = createAsyncThunk(
  'ordenes/updateOrdenes',
  async ({ id_orden, data }) => {
    try {
      console.log('data:', data)
      const response = await axios.put(`${API}/ordenes/${id_orden}`, data);

      return response.data;
    } catch (error) {
      console.error('Error updating orden:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const fetchOrdenesDelPaciente = createAsyncThunk(
  'ordenes/fetchOrdenesDelPaciente',
  async (id_paciente) => {
    const response = await axios.get(`${API}/ordenes/${id_paciente}`);
    return response.data;
  }
);

export const fetchOrdenDelPaciente = createAsyncThunk(
  'ordenes/fetchOrdenDelPaciente',
  async ({ id_paciente, nro_orden_id }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/paciente/orden/${id_paciente}/${nro_orden_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


export const fetchContactoOrdenesDelPaciente = createAsyncThunk(
  'ordenes/fetchContactoOrdenesDelPaciente',
  async (id_paciente) => {
    const response = await axios.get(`${API}/ordenes/contacto-orden/${id_paciente}`);
    return response.data;
  }
);



const ordenesSlice = createSlice({
  name: 'ordenes',
  initialState: {
    data: [],
    ordenes: [],
    pacienteOrdenes: [],
    pacienteOrden: {},
    OrderIDPaciente: null,
    contactoOrden: [],
    ordenes_options_selecteds: [],
    nro_orden_auto: [],
    OrderId: null,
    total: 0,
    meta: {},
    status: 'idle',
    statusPacienteOrdenes: 'idle',
    statusPacienteOrden: 'idle',
    search: '',
    error: null,
    errorPacienteOrdenes: null,
    errorPacienteOrden: null,
    sortOrder: 'desc',
    sortColumn: 'created_at',
  },
  reducers: {
    setOrden(state, action) {
      state.sortOrder = action.payload;
    },
    setOrdenPor(state, action) {
      state.sortColumn = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
    setFechaRange(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    setOrderId: (state, action) => {
      state.OrderId = action.payload;
    },
    clearOrderId: (state) => {
      state.OrderId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fecthOrdenes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fecthOrdenes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ordenes = action.payload.data;
        state.meta = action.payload.meta;
        state.total = action.payload.meta.total
        state.ordenes_options_selecteds = action.payload.data.map((
          { ordenes_id, nro_orden_id, nombres, apellidos, id_paciente, ...rest }) =>
            id_paciente && nombres && apellidos
            ? {
              value: ordenes_id,
              label: `Nro Orden: ${nro_orden_id} || Nombre: ${nombres.trim()} ${apellidos.trim()}`,
              ...rest
            } :
            { ...rest }
        );
      })
      .addCase(fecthOrdenes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createOrdenes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrdenes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ordenes.push(action.payload.data);
        state.nro_orden_auto = action.payload.data[0].nro_orden_id;
      })
      .addCase(createOrdenes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateOrden.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateOrden.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.ordenes.findIndex(receta => receta.id_orden === action.payload.data.id_orden);
        if (index !== -1) {
          state.ordenes[index] = action.payload.data;
        }
      })
      .addCase(updateOrden.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteOrdenes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteOrdenes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ordenes = state.ordenes.filter(orden => orden.id_orden !== action.payload);
      })
      .addCase(deleteOrdenes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchOrdenesDelPaciente.pending, (state) => {
        state.statusPacienteOrdenes = 'loading';
      })
      .addCase(fetchOrdenesDelPaciente.fulfilled, (state, action) => {
        state.statusPacienteOrdenes = 'succeeded';
        state.pacienteOrdenes = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchOrdenesDelPaciente.rejected, (state, action) => {
        state.statusPacienteOrdenes = 'failed';
        state.errorPacienteOrdenes = action.error.message;
      })
      .addCase(fetchOrdenDelPaciente.pending, (state) => {
        state.statusPacienteOrden = 'loading';
      })
      .addCase(fetchOrdenDelPaciente.fulfilled, (state, action) => {
        state.statusPacienteOrden = 'succeeded';
        state.pacienteOrden = action.payload.data;
      })
      .addCase(fetchOrdenDelPaciente.rejected, (state, action) => {
        state.statusPacienteOrden = 'failed';
        state.errorPacienteOrden = action.error.message;
      })
      .addCase(fetchContactoOrdenesDelPaciente.fulfilled, (state, action) => {
        state.contactoOrden = action.payload.data;
      });
  },
});

export const {
  setOrden,
  setOrdenPor,
  setFechaRange,
  setOrderId,
  clearOrderId,
  setSearch } = ordenesSlice.actions;
export default ordenesSlice.reducer;
