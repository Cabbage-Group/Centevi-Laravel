import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';
import dayjs from 'dayjs';

export const fetchKpis = createAsyncThunk(
  'kpis/fetchKpis',
  async ({ sortOrder = 'asc', startDate = '', endDate = '', lenteContacto = '' }) => {
    try {
      const today = dayjs();
      const formattedEndDate = endDate ? `${endDate}-23:59` : today.format('YYYY-MM-DD-23:59');
      const formattedStartDate = startDate ? `${startDate}-00:00` : dayjs(formattedEndDate, 'YYYY-MM-DD-23:59').subtract(30, 'day').format('YYYY-MM-DD-00:00');

      const requestBody = {
        sortOrder,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        lenteContacto
      };

      const response = await axios.post(`${API}/kpis`, requestBody); 

      return response.data;
    } catch (error) {
      console.error('Error fetching Kpis:', error.response?.data || error.message);
      throw error;
    }
  }
);


export const fetchKpisAsesores = createAsyncThunk(
  'kpis/fetchKpisAsesores',
  async ({ sortOrder = 'asc', startDate = '', endDate = '', lenteContacto = ''  }) => {
    try {
      const today = dayjs();
      const formattedEndDate = endDate ? `${endDate}-23:59` : today.format('YYYY-MM-DD-23:59');
      const formattedStartDate = startDate ? `${startDate}-00:00` : dayjs(formattedEndDate, 'YYYY-MM-DD-23:59').subtract(30, 'day').format('YYYY-MM-DD-00:00');
      const requestBody = { 
        sortOrder, 
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        lenteContacto
      };
      const response = await axios.post(`${API}/kpis/asesores`, requestBody );

      return response.data;
    } catch (error) {
      console.error('Error fetching Kpis:', error.response.data);
      throw error;
    }
  }
);

export const fetchKpisDoctores = createAsyncThunk(
  'kpis/fetchKpisDoctores',
  async ({ sortOrder = 'asc', startDate = '', endDate = '', lenteContacto = ''  }) => {
    try {
      const today = dayjs();
      const formattedEndDate = endDate ? `${endDate}-23:59` : today.format('YYYY-MM-DD-23:59');
      const formattedStartDate = startDate ? `${startDate}-00:00` : dayjs(formattedEndDate, 'YYYY-MM-DD-23:59').subtract(30, 'day').format('YYYY-MM-DD-00:00');     
      const requestBody = { 
        sortOrder, 
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        lenteContacto
      };
      const response = await axios.post(`${API}/kpis/doctores`,  requestBody );

      return response.data;
    } catch (error) {
      console.error('Error fetching Kpis:', error.response.data);
      throw error;
    }
  }
);

const kpisSlice = createSlice({
  name: 'kpis',
  initialState: {
    kpis: [],
    kpisAsesores: [],
    kpisDoctores: [],
    statusAsesores : 'idle',
    statusDoctores : 'idle',
    errorAsesores: null,
    errorDoctores: null,
    sortOrder: 'asc',
    status: 'idle',
    error: null,
    search: '',
    startDate: null,
    endDate: null,
    startDateAsesores: null,
    endDateAsesores: null,
  },
  reducers: {
    setFechaRange(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    setFechaRangeAsesores(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    setFechaRangeDoctores(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
},
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKpis.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchKpis.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.kpis = action.payload.data;
      })
      .addCase(fetchKpis.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchKpisAsesores.pending, (state) => {
        state.statusAsesores  = 'loading';
      })
      .addCase(fetchKpisAsesores.fulfilled, (state, action) => {
        state.statusAsesores  = 'succeeded';
        state.kpisAsesores = action.payload.data;
      })
      .addCase(fetchKpisAsesores.rejected, (state, action) => {
        state.statusAsesores  = 'failed';
        state.errorAsesores = action.error.message;
      })
      .addCase(fetchKpisDoctores.pending, (state) => {
        state.statusDoctores  = 'loading';
      })
      .addCase(fetchKpisDoctores.fulfilled, (state, action) => {
        state.statusDoctores  = 'succeeded';
        state.kpisDoctores = action.payload.data;
      })
      .addCase(fetchKpisDoctores.rejected, (state, action) => {
        state.statusDoctores  = 'failed';
        state.errorDoctores = action.error.message;
      });
  },
});

export const {
  setSortOrder,
  setFechaRange,
  setFechaRangeAsesores,
  setFechaRangeDoctores
} = kpisSlice.actions;
export default kpisSlice.reducer;
