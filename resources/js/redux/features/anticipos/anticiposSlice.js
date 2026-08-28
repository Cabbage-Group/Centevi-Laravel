// redux/features/anticipos/anticiposSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';

export const fetchAnticipos = createAsyncThunk(
  'anticipos/fetchAnticipos',
  async (
    {
      page = 1,
      limit = 18,
      sortColumn = 'created_at',
      sortOrder = 'desc',
      searchTerm = '',
      id_paciente = '',
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`${API}/anticipos`, {
        params: {
          page,
          limit,
          sortColumn,
          sortOrder,
          searchTerm,
          id_paciente,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: 'Error al cargar los anticipos',
        }
      );
    }
  }
);

export const fetchAnticipo = createAsyncThunk(
  'anticipos/fetchAnticipo',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/anticipos/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: 'Error al cargar el anticipo',
        }
      );
    }
  }
);

export const createAnticipo = createAsyncThunk(
  'anticipos/createAnticipo',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API}/anticipos`,
        data
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: 'Error al crear el anticipo',
        }
      );
    }
  }
);

export const updateAnticipo = createAsyncThunk(
  'anticipos/updateAnticipo',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API}/anticipos/${id}`,
        data
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: 'Error al actualizar el anticipo',
        }
      );
    }
  }
);

export const deleteAnticipo = createAsyncThunk(
  'anticipos/deleteAnticipo',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API}/anticipos/${id}`
      );

      return {
        ...response.data,
        id,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: 'Error al eliminar el anticipo',
        }
      );
    }
  }
);

export const fetchAnticiposDisponibles = createAsyncThunk(
  'anticipos/fetchDisponibles',
  async (idPaciente, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API}/pacientes/${idPaciente}/anticipos-disponibles`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: 'Error al cargar anticipos',
        }
      );
    }
  }
);

export const guardarAnticipos = createAsyncThunk(
  'anticipos/guardarAnticipos',
  async ({ ordenId, aplicaciones }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API}/orden-anticipos/ordenes/${ordenId}/guardarAnticipos`,
        { aplicaciones }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: 'Error al guardar los anticipos',
        }
      );
    }
  }
);

export const fetchResumenFinanciero = createAsyncThunk(
  'anticipos/fetchResumenFinanciero',
  async (idPaciente, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API}/orden-anticipos/by-paciente`,
        {
          id_paciente: idPaciente,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: 'Error al cargar el resumen financiero',
        }
      );
    }
  }
);

const anticiposSlice = createSlice({
  name: 'anticipos',

  initialState: {
    list: [],
    anticipos: [],
    anticipo: null,
    id_paciente: '',
    page: 1,
    limit: 18,
    sortColumn: 'created_at',
    sortOrder: 'desc',
    searchTerm: '',
    meta: {
      total: 0,
      limit: 18,
      page: 1,
      last_page: 1,
    },
    resumen: null,
    status: 'idle',
    guardando: false,
    error: null,
  },

  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },

    setSort: (state, action) => {
      state.sortColumn = action.payload.sortColumn;
      state.sortOrder = action.payload.sortOrder;
    },

    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.page = 1;
    },

    clearAnticipo: (state) => {
      state.anticipo = null;
    },
    setPaciente: (state, action) => {
      state.id_paciente = action.payload;
      state.page = 1;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchAnticipos.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(fetchAnticipos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.anticipos = action.payload?.data || [];
        state.meta = action.payload?.meta || state.meta;
        state.error = null;
      })

      .addCase(fetchAnticipos.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload?.message ||
          'Error al cargar los anticipos';
      })

      .addCase(fetchAnticipo.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(fetchAnticipo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.anticipo = action.payload?.data || null;
        state.error = null;
      })

      .addCase(fetchAnticipo.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload?.message ||
          'Error al cargar el anticipo';
      })

      .addCase(createAnticipo.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(createAnticipo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;

        if (action.payload?.data) {
          state.anticipos.unshift(action.payload.data);
        }
      })

      .addCase(createAnticipo.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload?.message ||
          'Error al crear el anticipo';
      })

      .addCase(updateAnticipo.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(updateAnticipo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;

        const updated = action.payload?.data;

        if (updated) {
          const index = state.anticipos.findIndex(
            (item) => item.id_anticipo === updated.id_anticipo
          );

          if (index !== -1) {
            state.anticipos[index] = updated;
          }

          state.anticipo = updated;
        }
      })

      .addCase(updateAnticipo.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload?.message ||
          'Error al actualizar el anticipo';
      })

      .addCase(deleteAnticipo.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(deleteAnticipo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;

        state.anticipos = state.anticipos.filter(
          (item) => item.id_anticipo !== action.payload.id
        );

        if (state.anticipo?.id_anticipo === action.payload.id) {
          state.anticipo = null;
        }
      })

      .addCase(deleteAnticipo.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload?.message ||
          'Error al eliminar el anticipo';
      })

      .addCase(fetchAnticiposDisponibles.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(fetchAnticiposDisponibles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })

      .addCase(fetchAnticiposDisponibles.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload?.message ||
          'Error al cargar anticipos';
      })

      .addCase(guardarAnticipos.pending, (state) => {
        state.guardando = true;
      })

      .addCase(guardarAnticipos.fulfilled, (state) => {
        state.guardando = false;
      })

      .addCase(guardarAnticipos.rejected, (state) => {
        state.guardando = false;
      })

      .addCase(fetchResumenFinanciero.fulfilled, (state, action) => {
        state.resumen = action.payload;
      });
  },
});

export const {
  setPage,
  setSort,
  setSearchTerm,
  setPaciente,
  clearAnticipo,
} = anticiposSlice.actions;

export default anticiposSlice.reducer;