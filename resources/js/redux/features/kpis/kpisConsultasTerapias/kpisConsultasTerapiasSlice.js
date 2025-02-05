import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../../config/config';
import dayjs from 'dayjs';

export const fetchKpisConsultasTerapias = createAsyncThunk(
  'kpisConsultasTerapias/fetchKpisConsultasTerapias',
  async ({ startDate = '', endDate = '' }) => {
    try {
      const today = dayjs();

      const formattedEndDate = endDate
        ? `${endDate}-23:59`
        : today.endOf('month').format('YYYY-MM-DD-23:59');

      // Si no se proporciona startDate, lo calculamos como 12 meses atrás desde endDate
      const formattedStartDate = startDate
        ? `${startDate}-00:00`
        : today.subtract(12, 'month').startOf('month').format('YYYY-MM-DD-00:00');

      // Construir los parámetros de la consulta directamente en la URL
      const params = new URLSearchParams({
        startDate: formattedStartDate,
        endDate: formattedEndDate
      });

      // Hacer la solicitud GET con los parámetros en la URL
      const response = await axios.get(`${API}/kpis/sucursales-consultas?${params.toString()}`);

      return response.data;
    } catch (error) {
      console.error('Error fetching Kpis:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const fetchKpisConsultasTerapiasDoctores = createAsyncThunk(
  'kpisConsultasTerapias/fetchKpisConsultasTerapiasDoctores',
  async ({ startDate = '', endDate = '' }) => {
    try {
      const today = dayjs();

      const formattedEndDate = endDate
        ? `${endDate}-23:59`
        : today.endOf('month').format('YYYY-MM-DD-23:59');

      // Si no se proporciona startDate, lo calculamos como 12 meses atrás desde endDate
      const formattedStartDate = startDate
        ? `${startDate}-00:00`
        : today.subtract(12, 'month').startOf('month').format('YYYY-MM-DD-00:00');

      // Construir los parámetros de la consulta directamente en la URL
      const params = new URLSearchParams({
        startDate: formattedStartDate,
        endDate: formattedEndDate
      });

      // Hacer la solicitud GET con los parámetros en la URL
      const response = await axios.get(`${API}/kpis/doctores-consultas?${params.toString()}`);

      return response.data;
    } catch (error) {
      console.error('Error fetching Kpis:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const fetchKpisPromedioFasesOrdenes = createAsyncThunk(
  'kpisConsultasTerapias/fetchKpisPromedioFasesOrdenes',
  async ({ startDate = '', endDate = '', faseInicial, faseFinal, lenteContacto = '' }) => {
    try {

      const requestBody = {
        startDate,
        endDate,
        faseInicial,
        faseFinal,
        lente_contacto: lenteContacto

      };
      const response = await axios.post(`${API}/kpis/promedio-fases-ordenes`, requestBody);

      return response.data;
    } catch (error) {
      console.error('Error fetching Kpis:', error.response.data);
      throw error;
    }
  }
);


const kpisSliceConsultasTerapias = createSlice({
  name: 'kpis',
  initialState: {
    kpisConsultasTerapias: [],
    kpisConsultasTerapiasDoctores: [],
    kpisPromedioFasesOrdenes: [],
    tiempoPromedio: {},
    sortOrder: 'asc',
    status: 'idle',
    statusPromedioFasesOrdenes: 'idle',
    error: null,
    errorPromedioFasesOrdenes: null,
    search: '',
    startDate: null,
    endDate: null,
    faseInicial: null,
    faseFinal: null,
  },
  reducers: {
    setFechaRangeConsultasTerapias(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    setFechaRangeConsultasTerapiasDoctores(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    setFechaRangePromedioFasesOrdenes(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    setFasesRangePromedioFasesOrdenes(state, action) {
      state.faseInicial = action.payload.faseInicial;
      state.faseFinal = action.payload.faseFinal;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKpisConsultasTerapias.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchKpisConsultasTerapias.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.kpisConsultasTerapias = action.payload.data;
      })
      .addCase(fetchKpisConsultasTerapias.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchKpisConsultasTerapiasDoctores.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchKpisConsultasTerapiasDoctores.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.kpisConsultasTerapiasDoctores = action.payload.data;
      })
      .addCase(fetchKpisConsultasTerapiasDoctores.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchKpisPromedioFasesOrdenes.pending, (state) => {
        state.statusPromedioFasesOrdenes = 'loading';
      })
      .addCase(fetchKpisPromedioFasesOrdenes.fulfilled, (state, action) => {
        state.statusPromedioFasesOrdenes = 'succeeded';
        state.kpisPromedioFasesOrdenes = action.payload.data;
        state.tiempoPromedio = action.payload.tiempo_promedio;
      })
      .addCase(fetchKpisPromedioFasesOrdenes.rejected, (state, action) => {
        state.statusPromedioFasesOrdenes = 'failed';
        state.errorPromedioFasesOrdenes = action.error.message;
      });

  },
});

export const {
  setSortOrder,
  setFechaRangeConsultasTerapias,
  setFechaRangeConsultasTerapiasDoctores,
  setFechaRangePromedioFasesOrdenes,
  setFasesRangePromedioFasesOrdenes
} = kpisSliceConsultasTerapias.actions;
export default kpisSliceConsultasTerapias.reducer;

