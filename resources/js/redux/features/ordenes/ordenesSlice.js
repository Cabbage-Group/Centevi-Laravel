import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';
import API_LOCAL from '../../../config/configSvLocal.js';
import { update } from 'lodash';

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
    proveedor = '',
    startDate = '',
    endDate = '',
    cancelada = false,
    serviciosFiltrados = ''
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
        fase,
        proveedor,
        cancelada,
        serviciosFiltrados
      },);
    return response.data;
  }
);

export const fecthPruebaOrdenes = createAsyncThunk(
  'ordenes/fecthPruebaOrdenes',
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

export const impricionAutomatica = createAsyncThunk(
  'ordenes/imprimir-automatica',
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

export const updateOrdeneCancelada = createAsyncThunk(
  'ordenes/updateOrdeneCancelada',
  async (id_orden) => {
    try {
      const response = await axios.put(`${API}/ordenes/cancelada/${id_orden}`);
      return response.data;
    } catch (error) {
      console.error('Error updating orden cancelada:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const fetchOrdenesDelPaciente = createAsyncThunk(
  'ordenes/fetchOrdenesDelPaciente',
  async ({ id_paciente, page, limit, cancelada = false }, thunkAPI) => {
    try {
      const response = await axios.get(`${API}/ordenes/${id_paciente}`, {
        params: {
          page,
          limit,
          cancelada
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error desconocido');
    }
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

export const fetchOrdenesMenciones = createAsyncThunk(
  'ordenes/fetchOrdenesMenciones',
  async (search) => {

    const response = await axios.get(`${API}/search/ordenes`, {
      params: { search }
    });
    return response.data.data;
  }
);


export const fetchOrdenTiempoSinOrden = createAsyncThunk(
  'ordenes/fetchOrdenTiempoSinOrden',
  async (id) => {
    const response = await axios.get(`${API}/ordenes/${id}/tiempo-sin-orden`);
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
    setOrderId: (state, action) => {
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
      })
      .addCase(fetchOrdenesMenciones.fulfilled, (state, action) => {
        state.ordenes_menciones = action.payload.data;
      })
      .addCase(fecthPruebaOrdenes.pending, (state) => {
        state.status_prueba = 'loading';
      })
      .addCase(fecthPruebaOrdenes.fulfilled, (state, action) => {
        state.status_prueba = 'succeeded';
        state.ordenes_prueba = action.payload.data;
        state.meta_prueba = action.payload.meta;
      })
      .addCase(fecthPruebaOrdenes.rejected, (state, action) => {
        state.status_prueba = 'failed';
        state.error_prueba = action.error.message;
      })
      .addCase(updateOrdeneCancelada.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateOrdeneCancelada.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.ordenes.findIndex(
          (orden) => orden.id_orden === action.payload.data.id_orden
        );
        if (index !== -1) {
          state.ordenes[index].cancelada = action.payload.data.cancelada;
        }
      })
      .addCase(updateOrdeneCancelada.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchOrdenTiempoSinOrden.pending, (state) => {
        state.status_prueba = 'loading';
      })
      .addCase(fetchOrdenTiempoSinOrden.fulfilled, (state, action) => {
        console.log('Tiempo sin orden:', action.payload);
        state.status_prueba = 'succeeded';
        state.ordenes_tiempo = action.payload.tiempo;
      })
      .addCase(fetchOrdenTiempoSinOrden.rejected, (state, action) => {
        state.status_prueba = 'failed';
        state.error_prueba = action.error.message;
      });
  },
});

export const {
  setOrden,
  setOrdenPor,
  setFechaRange,
  setOrderId,
  clearOrderId,
  setSearch,
  setSearchTermOrdenes,
  setSearchTermPruebaOrdenes,
  setStatusLoading,
} = ordenesSlice.actions;
export default ordenesSlice.reducer;
