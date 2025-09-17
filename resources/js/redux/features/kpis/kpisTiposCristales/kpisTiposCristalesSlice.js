
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../../config/config';


export const fetchKpisTiposCristales = createAsyncThunk(
  'kpisTiposCristales/fetchKpisTiposCristales',
  async ({
    startDate = '',
    endDate = '',
    limit = 10,
    name = [] }) => {
    try {
      const response = await axios.post(`${API}/kpis/tipo-cristal-esfera-cilindro-ordenes`, {
        startDate,
        endDate,
        name,
        limit

      });

      return response.data;
    } catch (error) {
      console.error('Error fetching Kpis:', error.response?.data || error.message);
      throw error;
    }
  }
);


export const fetchKpisTiposCristalesNoLimits = createAsyncThunk(
  'kpisTiposCristales/fetchKpisTiposCristalesNoLimits',
  async ({
    startDate = '',
    endDate = '',
    limit = 5000000,
    name = [] }) => {
    try {
      const response = await axios.post(`${API}/kpis/tipo-cristal-esfera-cilindro-ordenes`, {
        startDate,
        endDate,
        name,
        limit

      });

      return response.data;
    } catch (error) {
      console.error('Error fetching Kpis:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const fetchKpisTiposCristalesNoLimitsVertical = createAsyncThunk(
  'kpisTiposCristales/fetchKpisTiposCristalesNoLimitsVertical',
  async ({
    startDate = '',
    endDate = '',
    limit,
    name = [] }) => {
    try {
      const response = await axios.post(`${API}/kpis/tipo-cristal-esfera-cilindro-ordenes`, {
        startDate,
        endDate,
        name,
        limit

      });

      return response.data;
    } catch (error) {
      console.error('Error fetching Kpis:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const fetchKpisTiposCristalesOptions = createAsyncThunk(
  'kpisTiposCristales/fetchKpisTiposCristalesOptions',
  async ({
    startDate = '',
    endDate = '',
    limit = 5000000,
    name = [] }) => {
    try {
      const response = await axios.post(`${API}/kpis/tipo-cristal-esfera-cilindro-ordenes`, {
        startDate,
        endDate,
        name,
        limit

      });

      return response.data;
    } catch (error) {
      console.error('Error fetching Kpis:', error.response?.data || error.message);
      throw error;
    }
  }
);


const kpisSliceTiposCristales = createSlice({
  name: 'kpisTiposCristales',
  initialState: {
    kpisTiposCristales: [],
    kpisTiposCristalesNoLimits: [],
    kpisTiposCristalesNoLimitsVertical: [],
    kpisTipos_cristales_select_option: [],
    kpisTipos_cristales_select_option_no_limits: [],
    kpisTipos_cristales_select_option_no_limits_vertical: [],
    kpisTipos_Cristales_options: [],
    status: 'idle',
    statusNolimits: 'idle',
    statusNolimitsVertical: 'idle',
    statusNolimitsOptions: 'idle',
    error: null,
    errorNoLimits: null,
    errorNoLimitsVertical: null,
    errorNoLimitsOptions: null,
  }, reducers: {
    setFechaRangeTiposCristales(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    setFechaRangeTiposCristalesNoLimits(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    setFechaRangeTiposCristalesNoLimitsVertical(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    }
  }, extraReducers: (builder) => {
    builder
      .addCase(fetchKpisTiposCristales.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchKpisTiposCristales.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.kpisTiposCristales = action.payload.data;
        // state.kpisTipos_cristales_select_option = action.payload.data.map(item => ({
        //   value: item.name,
        //   label: item.name
        // }));

        // Pequeño parche para error de select sin options -> Solo llena si está vacío / la primera vez
        if (state.kpisTipos_cristales_select_option.length === 0) {
          state.kpisTipos_cristales_select_option = action.payload.data.map(item => ({
            value: item.name,
            label: item.name
          }));
        }
      })
      .addCase(fetchKpisTiposCristales.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchKpisTiposCristalesNoLimits.pending, (state) => {
        state.statusNolimits = 'loading';
      })
      .addCase(fetchKpisTiposCristalesNoLimits.fulfilled, (state, action) => {
        state.statusNolimits = 'succeeded';
        state.kpisTiposCristalesNoLimits = action.payload.data;
        // state.kpisTipos_cristales_select_option_no_limits = action.payload.data.map(item => ({
        //   value: item.name,
        //   label: item.name
        // }));

        // Pequeño parche para error de select sin options -> Solo llena si está vacío / la primera vez
        if (state.kpisTipos_cristales_select_option_no_limits.length === 0) {
          state.kpisTipos_cristales_select_option_no_limits = action.payload.data.map(item => ({
            value: item.name,
            label: item.name
          }));
        }
      })
      .addCase(fetchKpisTiposCristalesNoLimits.rejected, (state, action) => {
        state.statusNolimits = 'failed';
        state.errorNoLimits = action.error.message;
      })
      .addCase(fetchKpisTiposCristalesNoLimitsVertical.pending, (state) => {
        state.statusNolimitsVertical = 'loading';
      })
      .addCase(fetchKpisTiposCristalesNoLimitsVertical.fulfilled, (state, action) => {
        state.statusNolimitsVertical = 'succeeded';
        state.kpisTiposCristalesNoLimitsVertical = action.payload.data;
        state.kpisTipos_cristales_select_option_no_limits_vertical = action.payload.data.map(item => ({
          value: item.name,
          label: item.name
        }));
      })
      .addCase(fetchKpisTiposCristalesNoLimitsVertical.rejected, (state, action) => {
        state.statusNolimitsVertical = 'failed';
        state.errorNoLimitsVertical = action.error.message;
      })
      .addCase(fetchKpisTiposCristalesOptions.pending, (state) => {
        state.statusNolimitsOptions = 'loading';
      })
      .addCase(fetchKpisTiposCristalesOptions.fulfilled, (state, action) => {
        state.statusNolimitsOptions = 'succeeded';
        state.kpisTipos_Cristales_options = action.payload.data.map(item => ({
          value: item.name,
          label: item.name
        }));
      })
      .addCase(fetchKpisTiposCristalesOptions.rejected, (state, action) => {
        state.statusNolimitsOptions = 'failed';
        state.errorNoLimitsOptions = action.error.message;
      })
  },
});

export const {
  setFechaRangeTiposCristales,
  setFechaRangeTiposCristalesNoLimits,
  setFechaRangeTiposCristalesNoLimitsVertical
} = kpisSliceTiposCristales.actions;
export default kpisSliceTiposCristales.reducer;