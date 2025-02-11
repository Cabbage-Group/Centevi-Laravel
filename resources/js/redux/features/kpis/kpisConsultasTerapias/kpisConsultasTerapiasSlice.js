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

export const fetchKpisTerapiasConsultasDoctor = createAsyncThunk(
  'kpisConsultasTerapias/fetchKpisTerapiasConsultasDoctor',
  async ({
    startDate = '',
    endDate = '',
    doctores }) => {
    try {

      const today = dayjs();

      const formattedEndDate = endDate
        ? `${endDate}`
        : today.endOf('month').format('YYYY-MM-DD');

      // Si no se proporciona startDate, lo calculamos como 12 meses atrás desde endDate
      const formattedStartDate = startDate
        ? `${startDate}`
        : today.subtract(12, 'month').startOf('month').format('YYYY-MM-DD');


      const requestBody = {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        doctores
      };
      const response = await axios.post(`${API}/kpis/terapias-consultas-doctor`, requestBody);

      return response.data;
    } catch (error) {
      console.error('Error fetching Kpis:', error.response.data);
      throw error;
    }
  }
);


export const fetchKpisTerapiasConsultasSucursales = createAsyncThunk(
  'kpisConsultasTerapias/fetchKpisTerapiasConsultasSucursales',
  async ({
    startDate = '',
    endDate = '',
    sucursales }) => {
    try {

      const today = dayjs();

      const formattedEndDate = endDate
        ? `${endDate}`
        : today.endOf('month').format('YYYY-MM-DD');

      // Si no se proporciona startDate, lo calculamos como 12 meses atrás desde endDate
      const formattedStartDate = startDate
        ? `${startDate}`
        : today.subtract(12, 'month').startOf('month').format('YYYY-MM-DD');


      const requestBody = {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        sucursales
      };
      const response = await axios.post(`${API}/kpis/terapias-consultas-sucursales`, requestBody);

      return response.data;
    } catch (error) {
      console.error('Error fetching Kpis:', error.response.data);
      throw error;
    }
  }
);

export const fetchKpisConsultasPorDoctores = createAsyncThunk(
  'kpisConsultasTerapias/fetchKpisConsultasPorDoctores',
  async ({
    startDate = '',
    endDate = '',
    consultas }) => {
    try {

      const today = dayjs();

      const formattedEndDate = endDate
        ? `${endDate}`
        : today.endOf('month').format('YYYY-MM-DD');

      // Si no se proporciona startDate, lo calculamos como 12 meses atrás desde endDate
      const formattedStartDate = startDate
        ? `${startDate}`
        : today.subtract(12, 'month').startOf('month').format('YYYY-MM-DD');


      const requestBody = {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        consultas
      };
      const response = await axios.post(`${API}/kpis/consultas-doctores`, requestBody);

      return response.data;
    } catch (error) {
      console.error('Error fetching Kpis:', error.response.data);
      throw error;
    }
  }
);

export const fetchKpisTerapiasPorDoctores = createAsyncThunk(
  'kpisConsultasTerapias/fetchKpisTerapiasPorDoctores',
  async ({
    startDate = '',
    endDate = '',
    terapias }) => {
    try {

      const today = dayjs();

      const formattedEndDate = endDate
        ? `${endDate}`
        : today.endOf('month').format('YYYY-MM-DD');

      // Si no se proporciona startDate, lo calculamos como 12 meses atrás desde endDate
      const formattedStartDate = startDate
        ? `${startDate}`
        : today.subtract(12, 'month').startOf('month').format('YYYY-MM-DD');


      const requestBody = {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        terapias
      };
      const response = await axios.post(`${API}/kpis/terapias-doctores`, requestBody);

      return response.data;
    } catch (error) {
      console.error('Error fetching Kpis:', error.response.data);
      throw error;
    }
  }
);

export const fetchKpisConsultasPorSucursales = createAsyncThunk(
  'kpisConsultasTerapias/fetchKpisConsultasPorSucursales',
  async ({
    startDate = '',
    endDate = '',
    consultas }) => {
    try {

      const today = dayjs();

      const formattedEndDate = endDate
        ? `${endDate}`
        : today.endOf('month').format('YYYY-MM-DD');

      // Si no se proporciona startDate, lo calculamos como 12 meses atrás desde endDate
      const formattedStartDate = startDate
        ? `${startDate}`
        : today.subtract(12, 'month').startOf('month').format('YYYY-MM-DD');


      const requestBody = {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        consultas
      };
      const response = await axios.post(`${API}/kpis/consultas-sucursales`, requestBody);

      return response.data;
    } catch (error) {
      console.error('Error fetching Kpis:', error.response.data);
      throw error;
    }
  }
);

export const fetchKpisTerapiasPorSucursales = createAsyncThunk(
  'kpisConsultasTerapias/fetchKpisTerapiasPorSucursales',
  async ({
    startDate = '',
    endDate = '',
    terapias }) => {
    try {

      const today = dayjs();

      const formattedEndDate = endDate
        ? `${endDate}`
        : today.endOf('month').format('YYYY-MM-DD');

      // Si no se proporciona startDate, lo calculamos como 12 meses atrás desde endDate
      const formattedStartDate = startDate
        ? `${startDate}`
        : today.subtract(12, 'month').startOf('month').format('YYYY-MM-DD');


      const requestBody = {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        terapias
      };
      const response = await axios.post(`${API}/kpis/terapias-sucursales`, requestBody);

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
    kpisTerapiasConsultasDoctor: [],
    kpisTerapiasConsultasSucursales: [],
    kpisConsultasPorDoctores: [],
    kpisTerapiasPorDoctores: [],
    kpisConsultasPorSucursales: [],
    kpisTerapiasPorSucursales: [],
    tiempoPromedio: {},
    sortOrder: 'asc',
    status: 'idle',
    statusPromedioFasesOrdenes: 'idle',
    statusTerapiasConsultasDoctor: 'idle',
    statusTerapiasConsultasSucursales: 'idle',
    statusConsultasPorDoctores: 'idle',
    statusTerapiasPorDoctores: 'idle',
    statusConsultasPorSucursales: 'idle',
    statusTerapiasPorSucursales: 'idle',
    error: null,
    errorPromedioFasesOrdenes: null,
    errorTerapiasConsultasDoctor: null,
    errorTerapiasConsultasSucursales: null,
    errorTerapiasConsultasPorDoctores: null,
    errorConsultasPorDoctores: null,
    errorTerapiasPorDoctores: null,
    errorConsultasPorSucursales: null,
    errorTerapiasPorSucursales: null,
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
    setFechaRangeConsultasPorDoctores(state, action) {
      state.faseInicial = action.payload.faseInicial;
      state.faseFinal = action.payload.faseFinal;
    },
    setFechaRangeTerapiasPorDoctores(state, action) {
      state.faseInicial = action.payload.faseInicial;
      state.faseFinal = action.payload.faseFinal;
    },
    setFechaRangeTerapiasConsultasCYTSucursal(state, action) {
      state.faseInicial = action.payload.faseInicial;
      state.faseFinal = action.payload.faseFinal;
    },
    setFechaRangeTerapiasConsultasCYTDoctores(state, action) {
      state.faseInicial = action.payload.faseInicial;
      state.faseFinal = action.payload.faseFinal;
    },
    setFechaRangeConsultasPorSucursales(state, action) {
      state.faseInicial = action.payload.faseInicial;
      state.faseFinal = action.payload.faseFinal;
    },
    setFechaRangeTerapiasPorSucursales(state, action) {
      state.faseInicial = action.payload.faseInicial;
      state.faseFinal = action.payload.faseFinal;
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
      })
      .addCase(fetchKpisTerapiasConsultasDoctor.pending, (state) => {
        state.statusTerapiasConsultasDoctor = 'loading';
      })
      .addCase(fetchKpisTerapiasConsultasDoctor.fulfilled, (state, action) => {
        state.statusTerapiasConsultasDoctor = 'succeeded';
        state.kpisTerapiasConsultasDoctor = action.payload.data;
      })
      .addCase(fetchKpisTerapiasConsultasDoctor.rejected, (state, action) => {
        state.statusTerapiasConsultasDoctor = 'failed';
        state.errorTerapiasConsultasDoctor = action.error.message;
      })
      .addCase(fetchKpisTerapiasConsultasSucursales.pending, (state) => {
        state.statusTerapiasConsultasSucursales = 'loading';
      })
      .addCase(fetchKpisTerapiasConsultasSucursales.fulfilled, (state, action) => {
        state.statusTerapiasConsultasSucursales = 'succeeded';
        state.kpisTerapiasConsultasSucursales = action.payload.data;
      })
      .addCase(fetchKpisTerapiasConsultasSucursales.rejected, (state, action) => {
        state.statusTerapiasConsultasSucursales = 'failed';
        state.errorTerapiasConsultasSucursales = action.error.message;
      })
      .addCase(fetchKpisConsultasPorDoctores.pending, (state) => {
        state.statusConsultasPorDoctores = 'loading';
      })
      .addCase(fetchKpisConsultasPorDoctores.fulfilled, (state, action) => {
        state.statusConsultasPorDoctores = 'succeeded';
        state.kpisConsultasPorDoctores = action.payload.data;
      })
      .addCase(fetchKpisConsultasPorDoctores.rejected, (state, action) => {
        state.statusConsultasPorDoctores = 'failed';
        state.errorConsultasPorDoctores = action.error.message;
      })
      .addCase(fetchKpisTerapiasPorDoctores.pending, (state) => {
        state.statusTerapiasPorDoctores = 'loading';
      })
      .addCase(fetchKpisTerapiasPorDoctores.fulfilled, (state, action) => {
        state.statusTerapiasPorDoctores = 'succeeded';
        state.kpisTerapiasPorDoctores = action.payload.data;
      })
      .addCase(fetchKpisTerapiasPorDoctores.rejected, (state, action) => {
        state.statusTerapiasPorDoctores = 'failed';
        state.errorTerapiasPorDoctores = action.error.message;
      })
      .addCase(fetchKpisConsultasPorSucursales.pending, (state) => {
        state.statusConsultasPorSucursales = 'loading';
      })
      .addCase(fetchKpisConsultasPorSucursales.fulfilled, (state, action) => {
        state.statusConsultasPorSucursales = 'succeeded';
        state.kpisConsultasPorSucursales = action.payload.data;
      })
      .addCase(fetchKpisConsultasPorSucursales.rejected, (state, action) => {
        state.statusConsultasPorSucursales = 'failed';
        state.errorConsultasPorSucursales = action.error.message;
      })
      .addCase(fetchKpisTerapiasPorSucursales.pending, (state) => {
        state.statusTerapiasPorSucursales = 'loading';
      })
      .addCase(fetchKpisTerapiasPorSucursales.fulfilled, (state, action) => {
        state.statusTerapiasPorSucursales = 'succeeded';
        state.kpisTerapiasPorSucursales = action.payload.data;
      })
      .addCase(fetchKpisTerapiasPorSucursales.rejected, (state, action) => {
        state.statusTerapiasPorSucursales = 'failed';
        state.errorTerapiasPorSucursales = action.error.message;
      });

  },
});

export const {
  setSortOrder,
  setFechaRangeConsultasTerapias,
  setFechaRangeConsultasTerapiasDoctores,
  setFechaRangePromedioFasesOrdenes,
  setFasesRangePromedioFasesOrdenes,
  setFechaRangeTerapiasConsultasCYTSucursal,
  setFechaRangeTerapiasConsultasCYTDoctores,
  setFechaRangeConsultasPorDoctores,
  setFechaRangeTerapiasPorDoctores,
  setFechaRangeConsultasPorSucursales,
  setFechaRangeTerapiasPorSucursales
} = kpisSliceConsultasTerapias.actions;
export default kpisSliceConsultasTerapias.reducer;

