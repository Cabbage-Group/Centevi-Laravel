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

export const fetchKpisDoctoresOrdenes = createAsyncThunk(
  'kpis/fetchKpisDoctoresOrdenes',
  async (doctor) => {
    try {
     
      const requestBody = { 
        doctor
      };
      const response = await axios.post(`${API}/kpis/doctor-ordenes`,  requestBody );

      return response.data;
    } catch (error) {
      console.error('Error fetching Kpis:', error.response.data);
      throw error;
    }
  }
);

export const fetchKpisDoctoresFases = createAsyncThunk(
  'kpis/fetchKpisDoctoresFases',
  async (doctor) => {
    try {
     
      const requestBody = { 
        doctor
      };
      const response = await axios.post(`${API}/kpis/fases-ordenes`,  requestBody );

      return response.data;
    } catch (error) {
      console.error('Error fetching Kpis:', error.response.data);
      throw error;
    }
  }
);

export const fetchKpisDoctoresStatus= createAsyncThunk(
  'kpis/fetchKpisDoctoresStatus',
  async (doctor) => {
    try {
     
      const requestBody = { 
        doctor
      };
      const response = await axios.post(`${API}/kpis/status-ordenes`,  requestBody );

      return response.data;
    } catch (error) {
      console.error('Error fetching Kpis:', error.response.data);
      throw error;
    }
  }
);

export const fetchKpisAsesoresOrdenes = createAsyncThunk(
  'kpis/fetchKpisAsesoresOrdenes',
  async (usuario) => {
    try {
     
      const requestBody = { 
        usuario
      };
      const response = await axios.post(`${API}/kpis/asesor-ordenes`,  requestBody );

      return response.data;
    } catch (error) {
      console.error('Error fetching Kpis:', error.response.data);
      throw error;
    }
  }
);

export const fetchKpisAsesoresFases = createAsyncThunk(
  'kpis/fetchKpisAsesoresFases',
  async (usuario) => {
    try {
     
      const requestBody = { 
        usuario
      };
      const response = await axios.post(`${API}/kpis/asesor-fases`,  requestBody );

      return response.data;
    } catch (error) {
      console.error('Error fetching Kpis:', error.response.data);
      throw error;
    }
  }
);

export const fetchKpisAsesoresStatus = createAsyncThunk(
  'kpis/fetchKpisAsesoresStatus',
  async (usuario) => {
    try {
     
      const requestBody = { 
        usuario
      };
      const response = await axios.post(`${API}/kpis/asesor-status`,  requestBody );

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
    kpisDoctoresOrdenes: [],
    kpisDoctoresFases: [],
    kpisDoctoresStatus: [],
    kpisAsesoresOrdenes: [],
    kpisAsesoresFases: [],
    kpisAsesoresStatus: [],
    statusDoctoresFases : 'idle',
    statusDoctoresOrdenes : 'idle',
    statusDoctoresStatus : 'idle',
    statusAsesoresOrdenes : 'idle',
    statusAsesoresFases : 'idle',
    statusAsesoresStatus : 'idle',
    statusAsesores : 'idle',
    statusDoctores : 'idle',
    errorAsesores: null,
    errorDoctores: null,
    errorDoctoresOrdenes: null,
    errorDoctoresFases: null,
    errorDoctoresStatus: null,
    errorAsesoresOrdenes: null,
    errorAsesoresFases: null,
    errorAsesoresStatus: null,
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
      })
      .addCase(fetchKpisDoctoresOrdenes.pending, (state) => {
        state.statusDoctoresOrdenes  = 'loading';
      })
      .addCase(fetchKpisDoctoresOrdenes.fulfilled, (state, action) => {
        state.statusDoctoresOrdenes  = 'succeeded';
        state.kpisDoctoresOrdenes = action.payload.data;
      })
      .addCase(fetchKpisDoctoresOrdenes.rejected, (state, action) => {
        state.statusDoctoresOrdenes  = 'failed';
        state.errorDoctoresOrdenes = action.error.message;
      })
      .addCase(fetchKpisDoctoresFases.pending, (state) => {
        state.statusDoctoresFases  = 'loading';
      })
      .addCase(fetchKpisDoctoresFases.fulfilled, (state, action) => {
        state.statusDoctoresFases  = 'succeeded';
        state.kpisDoctoresFases = action.payload.data;
      })
      .addCase(fetchKpisDoctoresFases.rejected, (state, action) => {
        state.statusDoctoresFases  = 'failed';
        state.errorDoctoresFases = action.error.message;
      })
      .addCase(fetchKpisDoctoresStatus.pending, (state) => {
        state.statusDoctoresStatus = 'loading';
      })
      .addCase(fetchKpisDoctoresStatus.fulfilled, (state, action) => {
        state.statusDoctoresStatus  = 'succeeded';
        state.kpisDoctoresStatus = action.payload.data;
      })
      .addCase(fetchKpisDoctoresStatus.rejected, (state, action) => {
        state.statusDoctoresStatus  = 'failed';
        state.errorDoctoresStatus = action.error.message;
      })
      .addCase(fetchKpisAsesoresOrdenes.pending, (state) => {
        state.statusAsesoresOrdenes  = 'loading';
      })
      .addCase(fetchKpisAsesoresOrdenes.fulfilled, (state, action) => {
        state.statusAsesoresOrdenes  = 'succeeded';
        state.kpisAsesoresOrdenes = action.payload.data;
      })
      .addCase(fetchKpisAsesoresOrdenes.rejected, (state, action) => {
        state.statusAsesoresOrdenes  = 'failed';
        state.errorAsesoresOrdenes = action.error.message;
      })
      .addCase(fetchKpisAsesoresFases.pending, (state) => {
        state.statusAsesoresFases = 'loading';
      })
      .addCase(fetchKpisAsesoresFases.fulfilled, (state, action) => {
        state.statusAsesoresFases  = 'succeeded';
        state.kpisAsesoresFases = action.payload.data;
      })
      .addCase(fetchKpisAsesoresFases.rejected, (state, action) => {
        state.statusAsesoresFases  = 'failed';
        state.errorAsesoresFases = action.error.message;
      })
      .addCase(fetchKpisAsesoresStatus.pending, (state) => {
        state.statusAsesoresStatus = 'loading';
      })
      .addCase(fetchKpisAsesoresStatus.fulfilled, (state, action) => {
        state.statusAsesoresStatus  = 'succeeded';
        state.kpisAsesoresStatus = action.payload.data;
      })
      .addCase(fetchKpisAsesoresStatus.rejected, (state, action) => {
        state.statusAsesoresStatus  = 'failed';
        state.errorAsesoresStatus = action.error.message;
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
