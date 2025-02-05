import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/config";


export const fetchKpisTiposLente = createAsyncThunk(
  'kpisTipoLente/fetchKpisTiposLente',
  async ({ startDate, endDate, sucursalIds }) => {
    try {
      const requestBody = {
        startDate,
        endDate,
        sucursalIds
      };
      const response = await axios.post(`${API}/kpis/lente-ordenes-sucursal`, requestBody);

      return response.data;



    } catch (error) {
      console.error('Error fetching Kpis:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const fetchKpisTiposLenteAsesores = createAsyncThunk(
  'kpisTipoLente/fetchKpisTiposLenteAsesores',
  async ({ startDate, endDate, usuarioIds }) => {
    try {
      const requestBody = {
        startDate,
        endDate,
        usuarioIds
      };
      const response = await axios.post(`${API}/kpis/lente-ordenes-asesores`, requestBody);

      return response.data;



    } catch (error) {
      console.error('Error fetching Kpis:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const fetchKpisTiposLenteDoctores = createAsyncThunk(
  'kpisTipoLente/fetchKpisTiposLenteDoctores',
  async ({ startDate, endDate, doctorIds }) => {
    try {
      const requestBody = {
        startDate,
        endDate,
        doctorIds
      };
      const response = await axios.post(`${API}/kpis/lente-ordenes-doctores`, requestBody);

      return response.data;



    } catch (error) {
      console.error('Error fetching Kpis:', error.response?.data || error.message);
      throw error;
    }
  }
);


const kpisTipoLenteSlice = createSlice({
  name: 'kpisTipoLente',
  initialState: {
    kpisTipoLente: [],
    kpisTipoLenteAsesores: [],
    kpisTipoLenteDoctores: [],
    loading: false,
    loadingAsesores: false,
    loadingDoctores: false,
    status: 'failed',
    statusAsesores: 'failed',
    statusDoctores: 'failed',
    error: null,
    errorAsesores: null,
    errorDoctores: null
  },
  reducers: {
    setFechaRangeTipoLente(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    setFechaRangeTipoLenteAsesores(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    setFechaRangeTipoLenteDoctores(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKpisTiposLente.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKpisTiposLente.fulfilled, (state, action) => {
        state.status = action.payload.status
        state.kpisTipoLente = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchKpisTiposLente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchKpisTiposLenteAsesores.pending, (state) => {
        state.loadingAsesores = true;
        state.errorAsesores = null;
      })
      .addCase(fetchKpisTiposLenteAsesores.fulfilled, (state, action) => {
        state.statusAsesores = action.payload.status
        state.kpisTipoLenteAsesores = action.payload.data;
        state.loadingAsesores = false;
      })
      .addCase(fetchKpisTiposLenteAsesores.rejected, (state, action) => {
        state.loadingAsesores = false;
        state.errorAsesores = action.error.message;
      })
      .addCase(fetchKpisTiposLenteDoctores.pending, (state) => {
        state.loadingDoctores = true;
        state.errorDoctores = null;
      })
      .addCase(fetchKpisTiposLenteDoctores.fulfilled, (state, action) => {
        state.statusDoctores = action.payload.status
        state.kpisTipoLenteDoctores = action.payload.data;
        state.loadingDoctores = false;
      })
      .addCase(fetchKpisTiposLenteDoctores.rejected, (state, action) => {
        state.loadingDoctores = false;
        state.errorDoctores = action.error.message;
      });
  }
});
export const {
  setFechaRangeTipoLente,
  setFechaRangeTipoLenteAsesores,
  setFechaRangeTipoLenteDoctores
} = kpisTipoLenteSlice.actions;
export default kpisTipoLenteSlice.reducer