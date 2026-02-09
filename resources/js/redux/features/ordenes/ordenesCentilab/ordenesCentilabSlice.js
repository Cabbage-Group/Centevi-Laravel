import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../../config/config.js';
import API_LOCAL from '../../../../config/configSvLocal.js';

export const fecthOrdenesCentilab = createAsyncThunk(
  'ordenesCentilab/fecthOrdenesCentilab',
  async ({
    page = '',
    limit = 20,
    sortOrder = 'desc',
    sortColumn = 'created_at',
    search = '',
    sucursal = '',
    doctor = '',
    startDate = '',
    endDate = ''
  }) => {
    const fecha = startDate && endDate ? `${startDate} - ${endDate}` : '';

    const response = await axios.post(`${API}/obtener-ordenes-centilab`,
      {
        page,
        limit,
        sortOrder,
        sortColumn,
        search,
        fecha,
        sucursal,
        doctor
      },);
    return response.data;
  }
);

export const fecthPruebaOrdenes = createAsyncThunk(
  'ordenesCentilab/fecthPruebaOrdenes',
  async ({
    page = '',
    limit = 20,
    search = '',
    sortOrder = 'desc',
    sortColumn = 'created_at',
  }) => {

    const response = await axios.post(`${API}/prueba/orden`,
      {
        page,
        limit,
        search,
        sortOrder,
        sortColumn,
      },);
    return response.data;
  }
);

export const verOrdenCentilabPdf = createAsyncThunk(
  'ordenesCentilab/viewPdf',
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

export const verCorrecionCentilabPdf = createAsyncThunk(
  'ordenesCentilab/coreccion/viewPdf',
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

export const verOrdenCentilabPdfSize = createAsyncThunk(
  'ordenesCentilab/viewPdf',
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

export const verOrdenCentilabPdfSmall = createAsyncThunk(
  'ordenesCentilab/viewPdf',
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

export const impricionAutomatica = createAsyncThunk(
  'ordenesCentilab/imprimir-automatica',
  async (orden, { rejectWithValue }) => {

    try {

      const response = await axios.get(`${API_LOCAL}/imprimir/${orden?.id_paciente}/${orden?.nro_orden_id}`)

      return response

    } catch (error) {
      console.error('Error al visualizar la orden:', error.response?.data)
      return rejectWithValue(error.response?.data || 'Error al obtener PDF')
    }

  }
);

const ordenesCentilabSlice = createSlice({
  name: 'ordenesCentilab',
  initialState: {
    data: [],
    ordenesCentilab: [],
    pacienteOrdenes: [],
    pacienteOrden: {},
    OrderIDPaciente: null,
    contactoOrden: [],
    ordenes_menciones: [],
    nro_orden_auto: [],
    ordenes_prueba: [],
    ordenes_tiempo: '',
    OrderId: null,
    total: 0,
    meta: {},
    meta_prueba: {},
    search_term_ordenes: '',
    search_prueba: '',
    status: 'idle',
    statusPacienteOrdenes: 'idle',
    statusPacienteOrden: 'idle',
    status_prueba: '',
    search: '',
    error: null,
    error_prueba: null,
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
    setOrderCentilabId: (state, action) => {
      state.OrderId = action.payload;
    },
    clearOrderId: (state) => {
      state.OrderId = null;
    },
    setSearchTermOrdenes: (state, action) => {
      state.search_term_ordenes = action.payload;
      // state.page = 1;
    },
    setSearchTermPruebaOrdenes: (state, action) => {
      state.search_prueba = action.payload;
    },
    setStatusLoading: (state, action) => {
      state.status = 'loading';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fecthOrdenesCentilab.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fecthOrdenesCentilab.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ordenesCentilab = action.payload.data;
        state.meta = action.payload.meta;
        state.total = action.payload.meta.total
      })
      .addCase(fecthOrdenesCentilab.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  },
});

export const {
  setOrden,
  setOrdenPor,
  setFechaRange,
  setOrderCentilabId,
  clearOrderId,
  setSearch,
  setSearchTermOrdenes,
  setSearchTermPruebaOrdenes,
  setStatusLoading,
} = ordenesCentilabSlice.actions;
export default ordenesCentilabSlice.reducer;
